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

# Ensure cloudflared is available
$cf = Get-Command cloudflared -ErrorAction SilentlyContinue
if (-not $cf) {
  Write-Host "cloudflared not found. Install it first: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/" -ForegroundColor Yellow
  return
}

# Check login (best-effort)
try {
  $who = & $cf.Source 'tunnel' 'list' 2>&1
  if ($LASTEXITCODE -ne 0) {
    Write-Host "It looks like you're not authenticated with Cloudflare. Running 'cloudflared login' now..." -ForegroundColor Yellow
    & $cf.Source 'login'
    if ($LASTEXITCODE -ne 0) { Write-Host "Login may have failed. Please run 'cloudflared login' manually and re-run this script." -ForegroundColor Red; return }
  }
} catch {
  Write-Host "Failed to check cloudflared login: $_" -ForegroundColor Red
}

# Create tunnel
Log "Creating tunnel named: $TunnelName"
$tunnelCreate = & $cf.Source 'tunnel' 'create' $TunnelName 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "Tunnel create failed. Output:"; Write-Host $tunnelCreate; return
}

# Parse created tunnel ID and credentials file location from output
# The command prints something like: 'Created tunnel <NAME> with id <UUID>' and 'credentials written to /path/to/credentials.json'
$tunnelId = ($tunnelCreate -join "`n") -match 'id\s+([0-9a-f\-]{36})' | Out-Null; $matches[1] | Out-Null
if ($matches -and $matches.Count -ge 2) { $tid = $matches[1] } else { $tid = '' }

if ($tid) { Log "Tunnel ID: $tid" } else { Log "Could not parse tunnel ID; please inspect output above." }

# Route DNS
Log "Routing DNS $Hostname to tunnel $TunnelName"
$routeOut = & $cf.Source 'tunnel' 'route' 'dns' $TunnelName $Hostname 2>&1
if ($LASTEXITCODE -ne 0) { Write-Host "DNS route failed. Output:"; Write-Host $routeOut; return }

Write-Host "Success. Your persistent tunnel should be available via https://$Hostname" -ForegroundColor Green
Write-Host "Notes:"
Write-Host " - If DNS change is required, log into Cloudflare dashboard and point the hostname to the Cloudflare tunnel as instructed."
Write-Host " - The credentials for the tunnel are stored in the cloudflared config directory; keep them safe."
Write-Host " - To run the tunnel locally: cloudflared tunnel run $TunnelName"

# Write docs/last-public-url.txt for convenience
$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Definition)
$docsDir = Join-Path $repoRoot 'docs'
if (-not (Test-Path $docsDir)) { New-Item -ItemType Directory -Path $docsDir | Out-Null }
$lastFile = Join-Path $docsDir 'last-public-url.txt'
Set-Content -Path $lastFile -Value "https://$Hostname" -Encoding UTF8
Write-Host "Wrote $lastFile" -ForegroundColor Cyan

# Print next steps
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host " 1) Verify DNS is published for $Hostname (may take time to propagate)."
Write-Host " 2) Start the tunnel on your host or server with: cloudflared tunnel run $TunnelName"
Write-Host " 3) Update README/docs to reference https://$Hostname or point GitHub Pages redirect to docs/launch.html if preferred."

