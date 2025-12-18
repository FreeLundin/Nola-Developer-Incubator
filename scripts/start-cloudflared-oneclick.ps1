# One-click helper: start dev server, open cloudflared tunnel, generate QR, open browser
# Usage: Right-click -> Run with PowerShell, or from repo root: .\scripts\start-cloudflared-oneclick.ps1

param(
  [int]$Port = 5000,
  [int]$TimeoutSeconds = 60
)

function Log { Write-Host "[start-cloudflared-oneclick]" $args }

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
# Project subdomain for localtunnel (can be overridden via env var PROJECT_SUBDOMAIN)
$PROJECT_SUBDOMAIN = if ($env:PROJECT_SUBDOMAIN) { $env:PROJECT_SUBDOMAIN } else { 'MardiGrasParadeSim2026' }
# sanitize to lowercase and alphanumeric/dash only (localtunnel requirements)
try { $PROJECT_SUBDOMAIN = $PROJECT_SUBDOMAIN.ToLower() -replace '[^a-z0-9-]','-' } catch { }
$serverLog = Join-Path $scriptRoot "server-oneclick.log"
$serverErr = Join-Path $scriptRoot "server-oneclick.err"
$tunnelLog = Join-Path $scriptRoot "tunnel-oneclick.log"
$tunnelErr = Join-Path $scriptRoot "tunnel-oneclick.err"
$logsDir = Join-Path $scriptRoot "logs"
if (-not (Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir | Out-Null }
$serverPidFile = Join-Path $logsDir "server-oneclick.pid"
$tunnelPidFile = Join-Path $logsDir "tunnel-oneclick.pid"

# Track started processes for cleanup
$global:StartedProcs = @()
function Stop-StartedProcs {
  foreach ($p in $global:StartedProcs) {
    try {
      if ($p -and $p.Id) {
        Write-Host "Stopping PID $($p.Id)";
        Stop-Process -Id $p.Id -ErrorAction SilentlyContinue;
      }
    } catch {}
  }
  # Remove pid files if present
  foreach ($f in @($serverPidFile,$tunnelPidFile)) { if (Test-Path $f) { Remove-Item $f -Force -ErrorAction SilentlyContinue } }
}

# Ensure cleanup on script exit or Ctrl+C
try {
  $null = Register-EngineEvent PowerShell.Exiting -Action { Stop-StartedProcs } | Out-Null
  $null = Register-EngineEvent Console_CancelKeyPress -Action { Stop-StartedProcs } | Out-Null
} catch {
  # best-effort; continue if registration not available
}

# Start dev server
Log "Starting dev server (npm run dev)..."
if ($IsWindows) {
  $serverProc = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c','npm run dev' -RedirectStandardOutput $serverLog -RedirectStandardError $serverErr -NoNewWindow -PassThru
} else {
  $serverProc = Start-Process -FilePath "npm" -ArgumentList 'run','dev' -RedirectStandardOutput $serverLog -RedirectStandardError $serverErr -NoNewWindow -PassThru
}
if ($serverProc) {
  $global:StartedProcs += $serverProc
  try { Set-Content -Path $serverPidFile -Value $serverProc.Id -Encoding UTF8 } catch {}
}
Start-Sleep -Milliseconds 500

# Wait for server to be ready
$start = Get-Date
$up = $false
while ( ((Get-Date) - $start).TotalSeconds -lt $TimeoutSeconds ) {
  try {
    $resp = Invoke-WebRequest -Uri "http://localhost:$Port/" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    if ($resp.StatusCode -eq 200 -or $resp.StatusCode -eq 304) { $up = $true; break }
  } catch { Start-Sleep -Seconds 1 }
}

if (-not $up) {
  Log "Server did not become available within $TimeoutSeconds seconds. See $serverLog"
  Stop-StartedProcs; return
}

# Try cloudflared first, then fallback to npx localtunnel
$cloudflaredCmd = Get-Command cloudflared -ErrorAction SilentlyContinue
$npxCmd = Get-Command npx -ErrorAction SilentlyContinue
$tunnelUrl = $null

if ($cloudflaredCmd) {
  Log "Starting cloudflared tunnel..."
  if (Test-Path $tunnelLog) { Remove-Item $tunnelLog -Force -ErrorAction SilentlyContinue }
  $cfProc = Start-Process -FilePath $cloudflaredCmd.Source -ArgumentList 'tunnel','--url',"http://localhost:$Port" -RedirectStandardOutput $tunnelLog -RedirectStandardError $tunnelErr -NoNewWindow -PassThru
  if ($cfProc) { $global:StartedProcs += $cfProc; try { Set-Content -Path $tunnelPidFile -Value $cfProc.Id -Encoding UTF8 } catch {} }

  # Poll for URL with robust regex
  for ($i=0; $i -lt 60; $i++) {
    if (Test-Path $tunnelLog) {
      $txt = Get-Content $tunnelLog -Raw -ErrorAction SilentlyContinue
      if ($txt -match '(https?://[\w\-\.]+trycloudflare\.com)') { $tunnelUrl = $matches[1]; break }
      if ($txt -match '(https?://[\w\-\.:/]+)') { $tunnelUrl = $matches[1]; break }
    }
    Start-Sleep -Milliseconds 500
  }
  if (-not $tunnelUrl) { Log "Could not parse cloudflared output; check $tunnelLog" }
}

# Fallback to localtunnel if cloudflared not started or failed
if (-not $tunnelUrl) {
  if ($npxCmd) {
    Log "cloudflared not available or failed; starting localtunnel via npx..."
    if (Test-Path $tunnelLog) { Remove-Item $tunnelLog -Force -ErrorAction SilentlyContinue }
    # localtunnel prints URL to stdout; use --print-url where available
    # Prefer a stable project subdomain when possible; localtunnel may reject if taken
    $ltArgs = @('localtunnel','--port',$Port,'--print-url')
    if ($PROJECT_SUBDOMAIN) { $ltArgs += @('--subdomain', $PROJECT_SUBDOMAIN) }
    $ltProc = Start-Process -FilePath $npxCmd.Source -ArgumentList $ltArgs -RedirectStandardOutput $tunnelLog -RedirectStandardError $tunnelErr -NoNewWindow -PassThru
    if ($ltProc) { $global:StartedProcs += $ltProc; try { Set-Content -Path $tunnelPidFile -Value $ltProc.Id -Encoding UTF8 } catch {} }
    for ($i=0; $i -lt 40; $i++) {
      if (Test-Path $tunnelLog) {
        $first = Get-Content $tunnelLog -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($first -and $first -match 'https?://') { $tunnelUrl = $first.Trim(); break }
      }
      Start-Sleep -Milliseconds 500
    }
    if (-not $tunnelUrl) { Log "Could not parse localtunnel output; check $tunnelLog" }
  } else {
    Write-Host "Neither cloudflared nor npx found. Install cloudflared or npx/localtunnel." -ForegroundColor Yellow
    Write-Host "cloudflared install: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/" -ForegroundColor Yellow
    Log "No tunnel provider available; exiting."; Stop-StartedProcs; return
  }
}

if (-not $tunnelUrl) {
  Log "Unable to determine public URL. See logs: $tunnelLog"
  Stop-StartedProcs; return
}

Log "Public URL: $tunnelUrl"

# Write docs/last-public-url.txt and docs/launch.html
try {
  $repoRoot = Resolve-Path -Path (Join-Path $scriptRoot '..') | Select-Object -ExpandProperty Path
  $docsDir = Join-Path $repoRoot 'docs'
  if (-not (Test-Path $docsDir)) { New-Item -ItemType Directory -Path $docsDir | Out-Null }
  $lastFile = Join-Path $docsDir 'last-public-url.txt'
  $launchFile = Join-Path $docsDir 'launch.html'

  $tmp = [IO.Path]::GetTempFileName()
  Set-Content -Path $tmp -Value $tunnelUrl -Encoding UTF8
  Move-Item -Path $tmp -Destination $lastFile -Force

  $escapedUrl = [System.Web.HttpUtility]::HtmlEncode($tunnelUrl)
  $html = @"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="refresh" content="1;url=$tunnelUrl" />
    <title>Mardi Gras Parade - Launch</title>
    <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial;padding:2rem;background:#0b0b0b;color:#fff;text-align:center}</style>
  </head>
  <body>
    <h1>Opening public playtest...</h1>
    <p>If your browser doesn't redirect automatically, <a href="$tunnelUrl">click here</a>.</p>
    <p><small>$escapedUrl</small></p>
  </body>
</html>
"@
  $tmpHtml = [IO.Path]::GetTempFileName()
  Set-Content -Path $tmpHtml -Value $html -Encoding UTF8
  Move-Item -Path $tmpHtml -Destination $launchFile -Force
  Log "Wrote $lastFile and $launchFile"
} catch {
  Log "Failed writing docs files: $_"
}

# Generate QR code using existing Node script (scripts/generate-qr.mjs)
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) { Write-Host "Node not found in PATH. Skipping QR generation." -ForegroundColor Yellow }
else {
  Log "Generating QR SVG at docs/browser-qr.svg"
  $env:URL = $tunnelUrl
  & $node.Source (Join-Path $scriptRoot 'generate-qr.mjs')
}

Log "Done. Server log: $serverLog ; Tunnel log: $tunnelLog ; QR: docs/browser-qr.svg"
Write-Host "Scan docs/browser-qr.svg or open $tunnelUrl" -ForegroundColor Green

# Use confirm helper to print/copy/open the URL instead of opening twice
$confirmScript = Join-Path $scriptRoot 'confirm-public-url.ps1'
if (Test-Path $confirmScript) {
  try {
    # Wait up to 30s for the docs file to appear and open in browser
    & $confirmScript -TimeoutSeconds 30 -OpenBrowser
  } catch {
    Write-Host "Failed to run confirm-public-url helper: $_" -ForegroundColor Yellow
    Write-Host "Opening URL directly as fallback: $tunnelUrl" -ForegroundColor Cyan
    Start-Process $tunnelUrl
  }
} else {
  Start-Process $tunnelUrl
}

# Keep script alive while background processes run so logs remain available
# Wait for cloudflared/localtunnel process to exit (or user Ctrl+C)
try {
  while ($true) { Start-Sleep -Seconds 1 }
} finally {
  Log "Cleaning up started processes..."
  Stop-StartedProcs
}
