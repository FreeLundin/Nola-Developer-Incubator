# One-click helper: start dev server, open cloudflared tunnel, generate QR, open browser
# Usage: Right-click -> Run with PowerShell, or from repo root: .\scripts\start-cloudflared-oneclick.ps1

param(
  [int]$Port = 5000,
  [int]$TimeoutSeconds = 60
)

function Log { Write-Host "[start-cloudflared-oneclick]" $args }

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$serverLog = Join-Path $scriptRoot "server-oneclick.log"
$tunnelLog = Join-Path $scriptRoot "tunnel-oneclick.log"

# Start dev server
Log "Starting dev server (npm run dev)..."
$serverProc = Start-Process -FilePath "npm" -ArgumentList 'run','dev' -RedirectStandardOutput $serverLog -RedirectStandardError $serverLog -NoNewWindow -PassThru
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
  return
}

# Ensure cloudflared is available
$cloudflared = Get-Command cloudflared -ErrorAction SilentlyContinue
if (-not $cloudflared) {
  Write-Host "cloudflared not found in PATH. Install Cloudflare Cloudflared and try again:" -ForegroundColor Yellow
  Write-Host "https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/" -ForegroundColor Yellow
  return
}

Log "Starting cloudflared tunnel..."
# Start cloudflared and capture output
if (Test-Path $tunnelLog) { Remove-Item $tunnelLog -Force -ErrorAction SilentlyContinue }
$cfProc = Start-Process -FilePath $cloudflared.Source -ArgumentList 'tunnel','--url',"http://localhost:$Port" -RedirectStandardOutput $tunnelLog -RedirectStandardError $tunnelLog -NoNewWindow -PassThru

# Poll tunnel log for public url
$tunnelUrl = $null
for ($i=0; $i -lt 60; $i++) {
  if (Test-Path $tunnelLog) {
    $txt = Get-Content $tunnelLog -Raw -ErrorAction SilentlyContinue
    if ($txt -match 'https?://[\w\-\.]+trycloudflare\.com') { $tunnelUrl = $matches[0]; break }
    if ($txt -match 'https?://[\w\-\.:/]+') { $tunnelUrl = $matches[0]; break }
  }
  Start-Sleep -Milliseconds 500
}

if (-not $tunnelUrl) {
  Log "Unable to parse public URL from cloudflared output. See $tunnelLog"
  return
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

# Open in default browser
Log "Opening default browser to $tunnelUrl"
Start-Process $tunnelUrl

Log "Done. Server log: $serverLog ; Tunnel log: $tunnelLog ; QR: docs/browser-qr.svg"
Write-Host "Scan docs/browser-qr.svg or open $tunnelUrl" -ForegroundColor Green

