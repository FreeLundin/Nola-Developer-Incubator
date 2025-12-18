# Start dev server, open a tunnel, generate QR, and open browser
# Usage: Right-click and Run with PowerShell, or from terminal: .\scripts\start-cloud-tunnel.ps1

param(
  [int]$Port = 5000,
  [int]$TimeoutSeconds = 60
)

function Log { Write-Host "[start-cloud-tunnel]" $args }

# Start the dev server (npm run dev) in background, log to server.log
Log "Starting dev server (npm run dev) in background..."
$serverLog = Join-Path $PSScriptRoot "server.log"
$serverProc = Start-Process -FilePath "npm" -ArgumentList 'run','dev' -RedirectStandardOutput $serverLog -RedirectStandardError $serverLog -NoNewWindow -PassThru
Log "Dev server started (PID: $($serverProc.Id)). Waiting for server to respond on http://localhost:$Port ..."

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
  Log "Server did not start within $TimeoutSeconds seconds. Check server.log for details: $serverLog"
  Write-Host "You can inspect the server output and start the tunnel after the server is running." -ForegroundColor Yellow
  return
}

Log "Server is up. Looking for tunnel tools..."

# Choose tunnel: cloudflared preferred, fallback to localtunnel via npx
$cloudflared = Get-Command cloudflared -ErrorAction SilentlyContinue
$lt = Get-Command npx -ErrorAction SilentlyContinue
$tunnelUrl = $null
$tunnelLog = Join-Path $PSScriptRoot "tunnel.log"

if ($cloudflared) {
  Log "Starting cloudflared tunnel (public URL will be printed to tunnel log)..."
  # Start cloudflared in background and capture output to tunnel.log
  $cfProc = Start-Process -FilePath $cloudflared.Source -ArgumentList 'tunnel','--url',"http://localhost:$Port" -RedirectStandardOutput $tunnelLog -RedirectStandardError $tunnelLog -NoNewWindow -PassThru
  Start-Sleep -Seconds 3
  # Try to parse the public URL from the log
  for ($i=0; $i -lt 20; $i++) {
    if (Test-Path $tunnelLog) {
      $txt = Get-Content $tunnelLog -Raw -ErrorAction SilentlyContinue
      if ($txt -match 'https?://[a-z0-9\-\.]*trycloudflare\.com') { $tunnelUrl = $matches[0]; break }
      if ($txt -match 'https?://[a-z0-9\-\.]+') { $tunnelUrl = $matches[0]; break }
    }
    Start-Sleep -Milliseconds 500
  }
  if (-not $tunnelUrl) { Log "Could not parse cloudflared output. See $tunnelLog for details." }
} elseif ($lt) {
  Log "cloudflared not found. Using localtunnel via npx as fallback..."
  # localtunnel prints the URL to stdout; run in a process and capture first line
  $ltProc = Start-Process -FilePath $lt.Source -ArgumentList 'localtunnel','--port',$Port,'--print-url' -RedirectStandardOutput $tunnelLog -RedirectStandardError $tunnelLog -NoNewWindow -PassThru
  Start-Sleep -Seconds 3
  if (Test-Path $tunnelLog) {
    $first = Get-Content $tunnelLog -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($first -match 'https?://.+') { $tunnelUrl = $first.Trim() }
  }
} else {
  Log "No tunnel tool found. Please install cloudflared (recommended) or use npx localtunnel."
  Write-Host "Install cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/" -ForegroundColor Yellow
  Write-Host "Or use localtunnel: npm i -g localtunnel and then run: lt --port $Port" -ForegroundColor Yellow
  return
}

if (-not $tunnelUrl) {
  Log "Could not determine public URL. Check $tunnelLog for tunnel output."
  Write-Host "If the tunnel started, inspect tunnel.log and copy the public URL manually." -ForegroundColor Yellow
  return
}

Log "Public URL: $tunnelUrl"

# Generate QR code SVG using existing script
Log "Generating QR code SVG in docs/browser-qr.svg"
$env:URL = $tunnelUrl
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) { Write-Host "Node not found in PATH. Cannot generate QR." -ForegroundColor Yellow } else {
  # run the existing generate-qr.mjs script with URL env
  Start-Process -FilePath $node.Source -ArgumentList (Join-Path $PSScriptRoot 'generate-qr.mjs') -NoNewWindow -Wait
}

# Open default browser to public URL
Log "Opening browser..."
Start-Process $tunnelUrl

# After public URL is found, write docs/last-public-url.txt and docs/launch.html for easy sharing
if ($tunnelUrl) {
  try {
    $repoRoot = Resolve-Path -Path (Join-Path $PSScriptRoot '..') | Select-Object -ExpandProperty Path
    $docsDir = Join-Path $repoRoot 'docs'
    if (-not (Test-Path $docsDir)) { New-Item -ItemType Directory -Path $docsDir | Out-Null }

    $lastFile = Join-Path $docsDir 'last-public-url.txt'
    $launchFile = Join-Path $docsDir 'launch.html'

    # Write atomically: write to temp file then move
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
    # Write the launch.html atomically
    $tmpHtml = [IO.Path]::GetTempFileName()
    Set-Content -Path $tmpHtml -Value $html -Encoding UTF8
    Move-Item -Path $tmpHtml -Destination $launchFile -Force

    Log "Wrote $lastFile and $launchFile"
  } catch {
    Log "Failed to write docs files: $_"
  }
} else {
  Log "No public URL detected; not writing docs files."
}

Log "Done. Server log: $serverLog ; Tunnel log: $tunnelLog ; QR: docs/browser-qr.svg"
Write-Host "Scan docs/browser-qr.svg or open $tunnelUrl" -ForegroundColor Green

