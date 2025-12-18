<#
PowerShell helper to create and run a Cloudflare Tunnel using cloudflared.

Usage (local):
  # Ensure cloudflared is installed and you are authenticated with Cloudflare
  $env:PUBLIC_HOST = 'mardigrasparadesim2026.busaradigitalstrategy.com'
  $env:TUNNEL_NAME = 'mardigrasparade-tunnel'
  pwsh .\scripts\setup-cloudflare-tunnel.ps1

Notes:
- This script attempts to create a tunnel using `cloudflared tunnel create` and then route DNS with `cloudflared tunnel route dns`.
- If you are not logged into cloudflared, run `cloudflared login` first (it opens a browser to authorize).
- For automated (CI) runs, prefer the GitHub Actions workflow `.github/workflows/setup-cloudflare-tunnel.yml` and set repository secrets.
#>

param()

function Abort([string]$msg) {
  Write-Host "ERROR: $msg" -ForegroundColor Red
  exit 1
}

# required variables
$publicHost = $env:PUBLIC_HOST
$tunnelName = $env:TUNNEL_NAME

if (-not $publicHost) { Abort "PUBLIC_HOST environment variable is required (e.g. 'mardigrasparadesim2026.busaradigitalstrategy.com')" }
if (-not $tunnelName) { $tunnelName = 'mardigrasparade-tunnel'; Write-Host "TUNNEL_NAME not set — defaulting to $tunnelName" }

# locate cloudflared
$cloudflaredExe = Join-Path -Path $PSScriptRoot -ChildPath "cloudflared.exe"
if (-not (Test-Path $cloudflaredExe)) {
  Write-Host "cloudflared executable not found in scripts/ — attempting global 'cloudflared' on PATH" -ForegroundColor Yellow
  $cloudflaredExe = "cloudflared"
}

Write-Host "Using cloudflared: $cloudflaredExe"

# Check cloudflared is available
try {
  & $cloudflaredExe --version 2>$null | Out-Null
} catch {
  Abort "cloudflared not found or not runnable. Install cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation"
}

# Check login status by attempting to run tunnel list
$loggedIn = $false
try {
  $out = & $cloudflaredExe tunnel list --no-color 2>&1
  if ($LASTEXITCODE -eq 0) { $loggedIn = $true }
} catch { $loggedIn = $false }

if (-not $loggedIn) {
  Write-Host "cloudflared not authenticated. Running 'cloudflared login' to open browser for authorization..." -ForegroundColor Yellow
  try {
    & $cloudflaredExe login
    Write-Host "If the browser login completed successfully, re-run this script to continue." -ForegroundColor Green
    exit 0
  } catch {
    Abort "Interactive login failed. Authenticate cloudflared or set up a service token. See docs: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/"
  }
}

# Create tunnel if not exists
Write-Host "Creating tunnel named '$tunnelName' (if it doesn't exist)"
try {
  $createOut = & $cloudflaredExe tunnel create $tunnelName 2>&1
  if ($LASTEXITCODE -ne 0) {
    # If it already exists, cloudflared returns non-zero and prints details — attempt to parse ID from list
    Write-Host "Tunnel creation returned non-zero. Attempting to detect existing tunnel..." -ForegroundColor Yellow
  } else {
    Write-Host $createOut
  }
} catch {
  Write-Host "Warning: tunnel create may have failed (it may already exist). Continuing to attempt DNS routing." -ForegroundColor Yellow
}

# Attempt to route DNS for hostname
Write-Host "Routing DNS for $publicHost to tunnel $tunnelName"
try {
  & $cloudflaredExe tunnel route dns $tunnelName $publicHost
  if ($LASTEXITCODE -ne 0) { Write-Host "Warning: 'tunnel route dns' returned non-zero — check Cloudflare dashboard to verify DNS entry." -ForegroundColor Yellow }
} catch {
  Write-Host "Failed to run 'cloudflared tunnel route dns'. Ensure your cloudflared user account has permissions to manage DNS for the zone." -ForegroundColor Yellow
}

# Create a minimal config file for running the tunnel
$configDir = Join-Path $PSScriptRoot "..\.cloudflared"
if (-not (Test-Path $configDir)) { New-Item -ItemType Directory -Path $configDir | Out-Null }
$configPath = Join-Path $configDir ("config-$tunnelName.yml")

$configContent = @"
# cloudflared config for $tunnelName
tunnel: $tunnelName
credentials-file: $($env:USERPROFILE -replace '\\','/')\.cloudflared\$tunnelName.json
ingress:
  - hostname: $publicHost
    service: http://localhost:5000
  - service: http_status:404
"@

Set-Content -Path $configPath -Value $configContent -Encoding UTF8
Write-Host "Wrote config to $configPath"

# Start tunnel
Write-Host "Starting tunnel (background)..."
try {
  Start-Process -FilePath $cloudflaredExe -ArgumentList "tunnel run --config `"$configPath`" $tunnelName" -WindowStyle Hidden
  Write-Host "Tunnel started (check Cloudflare dashboard / DNS)." -ForegroundColor Green
  Write-Host "Public URL: https://$publicHost"
} catch {
  Write-Host "Failed to start tunnel automatically. You can run manually: cloudflared tunnel run --config \"$configPath\" $tunnelName" -ForegroundColor Yellow
}

Write-Host "Done. If DNS or tunnel setup failed, check cloudflared output and your Cloudflare account permissions." -ForegroundColor Green

