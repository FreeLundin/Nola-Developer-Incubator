# One-click launcher for local dev + public tunnel using cloudflared
# - Starts cloudflared http tunnel to localhost:5000
# - Opens default browser to the public URL
# - Generates a QR SVG at docs/browser-qr.svg for quick mobile access

param(
  [string]$PublicHost = "mardigrasparadesim2026.busaradigitalstrategy.com",
  [int]$LocalPort = 5000
)

$cloudflared = Join-Path -Path $PSScriptRoot -ChildPath "..\scripts\cloudflared.exe"
if (-Not (Test-Path $cloudflared)) {
  Write-Host "cloudflared executable not found at $cloudflared. Make sure cloudflared is downloaded into scripts/ or installed globally." -ForegroundColor Yellow
  $cloudflared = "cloudflared"
}

# Start cloudflared as a background job
$arg = "tunnel --url http://localhost:$LocalPort --no-autoupdate --hostname $PublicHost"
Write-Host "Starting cloudflared with: $arg"
Start-Process -FilePath $cloudflared -ArgumentList $arg -WindowStyle Hidden
Start-Sleep -Seconds 2

# open public URL
$publicUrl = "https://$PublicHost"
Start-Process $publicUrl

# generate QR SVG using a simple base64-embedded approach
$qrDir = Join-Path $PSScriptRoot "..\docs"
if (-Not (Test-Path $qrDir)) { New-Item -ItemType Directory -Path $qrDir | Out-Null }
$svgPath = Join-Path $qrDir "browser-qr.svg"

# Using a minimal inline QR generator via Google Chart API for simplicity
$encoded = [System.Uri]::EscapeDataString($publicUrl)
$qrUrl = "https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=$encoded&choe=UTF-8"

try {
  Invoke-WebRequest -Uri $qrUrl -OutFile "$svgPath" -UseBasicParsing -ErrorAction Stop
  Write-Host "QR saved to $svgPath"
} catch {
  Write-Host "Failed to download QR from $qrUrl: $_" -ForegroundColor Yellow
}

Write-Host "Done. Opened $publicUrl and saved QR to $svgPath" -ForegroundColor Green

