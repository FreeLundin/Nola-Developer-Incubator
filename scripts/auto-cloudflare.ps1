<#
Auto Cloudflare Tunnel helper
Usage (interactive):
  pwsh .\scripts\auto-cloudflare.ps1 -PublicHost my.host.example.com -TunnelName my-tunnel

Usage (non-interactive, CI):
  pwsh .\scripts\auto-cloudflare.ps1 -PublicHost $env:PUBLIC_HOST -TunnelName $env:TUNNEL_NAME -CFApiToken $env:CF_API_TOKEN -CFAccountId $env:CF_ACCOUNT_ID -CFZoneId $env:CF_ZONE_ID -NonInteractive

What it does:
 - Verifies local dev server health (http://localhost:5000/health)
 - Locates cloudflared (scripts\cloudflared.exe or PATH)
 - If not authenticated, runs `cloudflared login` (interactive)
 - Creates a named tunnel with `cloudflared tunnel create` (if not exists)
 - Routes DNS for the hostname with `cloudflared tunnel route dns`
 - Writes a config file to .cloudflared and starts the tunnel `cloudflared tunnel run <name>` in background
 - Optionally runs Playwright tests if Playwright is installed (use -RunTests switch)

Notes:
 - Requires cloudflared and Node.js installed for Playwright testing.
 - NonInteractive mode will attempt Cloudflare API DNS creation if API token and ids are provided, but named tunnel creation is easier interactively.
#>

param(
  [Parameter(Mandatory=$true)][string]$PublicHost,
  [Parameter(Mandatory=$false)][string]$TunnelName = "mardigrasparade-tunnel",
  [Parameter(Mandatory=$false)][string]$CFApiToken,
  [Parameter(Mandatory=$false)][string]$CFAccountId,
  [Parameter(Mandatory=$false)][string]$CFZoneId,
  [switch]$NonInteractive,
  [switch]$RunTests
)

$logFile = Join-Path $PSScriptRoot "cloudflared_automation.log"
function Log([string]$msg) { $t = (Get-Date).ToString('o'); $line = "$t `t $msg"; $line | Out-File -FilePath $logFile -Append -Encoding UTF8; Write-Host $msg }

# Start fresh log
"--- Auto Cloudflare run $(Get-Date -Format o) ---" | Out-File $logFile -Encoding UTF8

Log "PublicHost: $PublicHost; TunnelName: $TunnelName; NonInteractive: $NonInteractive; RunTests: $RunTests"

# 1) Check local server health
function Check-LocalHealth {
  try {
    $h = Invoke-WebRequest -Uri http://localhost:5000/health -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Log "Local health OK: $($h.StatusCode)"
    return $true
  } catch {
    Log "Local health check failed: $($_.Exception.Message)"
    return $false
  }
}

$localOk = Check-LocalHealth
if (-not $localOk) {
  Log "Local server not responding on http://localhost:5000. Attempting to start dev server (npm run dev) in background..."
  try {
    Start-Process -FilePath "npm" -ArgumentList 'run dev' -WorkingDirectory (Resolve-Path "..\" -Relative) -WindowStyle Hidden
    Start-Sleep -Seconds 3
    if (Check-LocalHealth) { Log "Dev server started and healthy." } else { Log "Dev server did not start; please run 'npm run dev' manually and re-run this script."; if ($NonInteractive) { exit 1 } }
  } catch {
    Log "Failed to start dev server automatically: $($_.Exception.Message)"
    if ($NonInteractive) { exit 1 }
  }
}

# 2) Locate cloudflared
$cfExeCandidates = @(
  (Join-Path $PSScriptRoot 'cloudflared.exe'),
  'cloudflared'
)
$cloudflared = $null
foreach ($c in $cfExeCandidates) {
  try {
    if (Test-Path $c) { $cloudflared = $c; break }
    else {
      $ver = & $c --version 2>$null; if ($LASTEXITCODE -eq 0) { $cloudflared = $c; break }
    }
  } catch { }
}
if (-not $cloudflared) { Log "cloudflared not found. Please install cloudflared (https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation)"; exit 1 }
Log "Using cloudflared: $cloudflared"

# 3) Check authentication status (tunnel list)
function Is-Authenticated {
  try {
    $out = & $cloudflared tunnel list 2>&1
    if ($LASTEXITCODE -eq 0) { return $true }
    return $false
  } catch { return $false }
}

$auth = Is-Authenticated
if (-not $auth) {
  Log "cloudflared not authenticated."
  if ($NonInteractive -and $CFApiToken) {
    Log "Non-interactive mode: will proceed using API token for DNS mapping but named tunnel creation requires cloudflared local credentials. You may still run interactive 'cloudflared login' on this machine."
  } else {
    Log "Running interactive login: this will open a browser to authorize cloudflared. Please complete the login in the browser."
    try { & $cloudflared login; Start-Sleep -Seconds 2 } catch { Log "Login failed or aborted."; if ($NonInteractive) { exit 1 } }
    $auth = Is-Authenticated
    if ($auth) { Log "cloudflared authenticated." } else { Log "Authentication not detected after login." }
  }
}

# 4) Create named tunnel (if not exists)
function Ensure-TunnelExists {
  param($name)
  try {
    $list = & $cloudflared tunnel list 2>&1
    if ($list -match [regex]::Escape($name)) { Log "Tunnel $name already present."; return $true }
    Log "Creating tunnel: $name"
    $create = & $cloudflared tunnel create $name 2>&1
    if ($LASTEXITCODE -ne 0) { Log "tunnel create returned non-zero: $create"; return $false }
    Log "Tunnel created: $create"
    return $true
  } catch {
    Log "Error creating tunnel: $($_.Exception.Message)"; return $false
  }
}

$created = $false
if (-not $NonInteractive -or ($NonInteractive -and -not $CFApiToken)) {
  $created = Ensure-TunnelExists -name $TunnelName
} else {
  # In NonInteractive mode with API token, we attempt to create DNS via API and instruct user to create tunnel manually if needed
  Log "NonInteractive with API token: will create DNS mapping using API and expect a named tunnel to be created separately if not present."
}

# 5) Route DNS mapping
function Route-DNS-CLI {
  param($name, $hostname)
  try {
    Log "Attempting to route DNS via cloudflared CLI: tunnel route dns $name $hostname"
    $out = & $cloudflared tunnel route dns $name $hostname 2>&1
    if ($LASTEXITCODE -ne 0) { Log "tunnel route dns returned non-zero: $out"; return $false }
    Log "tunnel route dns output: $out"; return $true
  } catch { Log "Error routing DNS via CLI: $($_.Exception.Message)"; return $false }
}

function Route-DNS-API {
  param($token, $accountId, $zoneId, $hostname)
  try {
    if (-not $token -or -not $zoneId -or -not $accountId) { Log "Missing API credentials for DNS API mapping"; return $false }
    Log "Checking existing DNS records for $hostname in zone $zoneId"
    $existing = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records?name=$hostname" -Method Get -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop
    if ($existing.result_count -gt 0) {
      Log "Found existing DNS record(s): $($existing.result_count). Will update first record to CNAME tunnels.cloudflare.com"
      $rec = $existing.result[0]
      $recBody = @{ type='CNAME'; name=$hostname; content='tunnels.cloudflare.com'; ttl=120; proxied=$true } | ConvertTo-Json
      $update = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records/$($rec.id)" -Method Put -Headers @{ Authorization = "Bearer $token"; 'Content-Type' = 'application/json' } -Body $recBody -ErrorAction Stop
      Log "DNS update response: $($update.success)"
      return $true
    } else {
      Log "No existing DNS record found for $hostname. Creating new CNAME -> tunnels.cloudflare.com"
      $body = @{ type='CNAME'; name=$hostname; content='tunnels.cloudflare.com'; ttl=120; proxied=$true } | ConvertTo-Json
      $resp = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records" -Method Post -Headers @{ Authorization = "Bearer $token"; 'Content-Type' = 'application/json' } -Body $body -ErrorAction Stop
      Log "DNS API create response success: $($resp.success)"
      return $true
    }
  } catch { Log "DNS API create/update failed: $($_.Exception.Message)"; return $false }
}

$dnsOk = $false
if ($created) { $dnsOk = Route-DNS-CLI -name $TunnelName -hostname $PublicHost }
if (-not $dnsOk -and $CFApiToken) { $dnsOk = Route-DNS-API -token $CFApiToken -accountId $CFAccountId -zoneId $CFZoneId -hostname $PublicHost }
if (-not $dnsOk) { Log "DNS route not created automatically. Please verify DNS mapping in Cloudflare dashboard." }

# 6) Prepare config and run tunnel
$configDir = Join-Path $env:USERPROFILE '.cloudflared'
if (-not (Test-Path $configDir)) { New-Item -ItemType Directory -Path $configDir | Out-Null }
$configPath = Join-Path $configDir "config-$TunnelName.yml"
$configContent = @"
# cloudflared config for $TunnelName
tunnel: $TunnelName
ingress:
  - hostname: $PublicHost
    service: http://localhost:5000
  - service: http_status:404
"@
Set-Content -Path $configPath -Value $configContent -Encoding UTF8
Log "Wrote cloudflared config to $configPath"

# Start tunnel in background
try {
  Log "Starting named tunnel: $TunnelName"
  # Run cloudflared in a background job and redirect output to log file
  $script = {
    param($exe, $tunnel, $cfg, $logpath)
    & $exe tunnel run $tunnel --config $cfg *> $logpath 2>&1
  }
  $job = Start-Job -ScriptBlock $script -ArgumentList $cloudflared, $TunnelName, $configPath, $logFile
  Start-Sleep -Seconds 3
  if ($job -and (Get-Job -Id $job.Id)) { Log "Started cloudflared tunnel as job Id $($job.Id)." } else { Log "cloudflared job not started correctly." }
} catch {
  Log "Failed to start cloudflared tunnel in background: $($_.Exception.Message)"
}

# 7) Verify public URL
try {
  Start-Sleep -Seconds 3
  $h = Invoke-WebRequest -Uri "https://$PublicHost/health" -UseBasicParsing -TimeoutSec 8 -ErrorAction Stop
  Log "Public health check succeeded: $($h.StatusCode)"
} catch {
  Log "Public health check failed (this may be due to DNS propagation or tunnel not active): $($_.Exception.Message)"
}

# 8) Optionally run Playwright tests
if ($RunTests) {
  Log "Running Playwright tests against https://$PublicHost (if reachable)"
  try {
    $env:PLAYTEST_URL = "https://$PublicHost"
    & npx playwright test --reporter=list
  } catch {
    Log "Playwright run failed: $($_.Exception.Message)"
  }
}

Log "Auto Cloudflare run complete. Check $logFile for details."

