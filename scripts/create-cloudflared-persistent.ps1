<#
Create a persistent Cloudflare Tunnel and route DNS to it.

Usage (PowerShell):
  1. Ensure `cloudflared` is installed and you are logged in: `cloudflared login`
  2. Run this script: `.	ools\create-cloudflared-persistent.ps1 -TunnelName my-mardi-tunnel -Hostname play.mardigras.example.com`

This script is interactive and prints the exact commands you need to run in Cloudflare if some steps require web auth.
#>
param(
  [Parameter(Mandatory=$true)] [string]$TunnelName,
  [Parameter(Mandatory=$true)] [string]$Hostname
)

function Log { Write-Host "[create-cloudflared-persistent]" $args }

# Check cloudflared
$cloudCmd = Get-Command cloudflared -ErrorAction SilentlyContinue
if ($cloudCmd) {
  $cloudPath = $cloudCmd.Source
} else {
  $bundled = Join-Path $PSScriptRoot 'cloudflared.exe'
  if (Test-Path $bundled) {
    Write-Host "Using bundled cloudflared at $bundled"
    $cloudPath = $bundled
  } else {
    Write-Host "cloudflared not found in PATH or scripts folder. Install it first: winget install --id Cloudflare.Cloudflared -e or place cloudflared.exe in scripts/." -ForegroundColor Yellow
    exit 2
  }
}

Log "Using cloudflared: $cloudPath"

# Ensure user has logged in
try {
  $who = & $cloudPath 'tunnel' 'login' 2>&1 | Out-String
  if ($who -match 'open a browser') {
    Write-Host "Please complete the browser-based login that was just opened, then re-run this script." -ForegroundColor Cyan
    exit 0
  }
} catch { }

# Create tunnel (idempotent: if exists, command returns info)
Log "Creating tunnel named: $TunnelName"
$createOut = & $cloudPath 'tunnel' 'create' $TunnelName 2>&1 | Out-String
Write-Host $createOut

# Attempt to add DNS route for the hostname
Log "Mapping DNS: $Hostname -> tunnel $TunnelName"
try {
  $routeOut = & $cloudPath 'tunnel' 'route' 'dns' $TunnelName $Hostname 2>&1 | Out-String
  Write-Host $routeOut
} catch {
  Write-Host "Failed to map DNS via cloudflared tunnel route dns. You may need to run 'cloudflared login' and ensure your Cloudflare account has permission to edit DNS for the zone." -ForegroundColor Yellow
  Write-Host "Error: $_"
}

Write-Host "\nDone. To run the tunnel now (on this machine):" -ForegroundColor Green
Write-Host "  cloudflared tunnel run $TunnelName" -ForegroundColor Cyan
Write-Host "After the tunnel starts, the hostname https://$Hostname should resolve to your local server (http://localhost:5000)." -ForegroundColor Green

Write-Host "If the DNS does not appear immediately, allow a minute and then check: nslookup $Hostname" -ForegroundColor Yellow
