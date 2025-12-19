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

# DEPRECATED: Cloudflare tunnel integration removed
#
# The project no longer uses Cloudflare Tunnels (cloudflared). This script
# previously created and routed a Cloudflare tunnel for local development.
# It has been intentionally neutralized to avoid accidental execution.
#
# If you need to restore the previous behavior, retrieve the original script
# from the repository history (git) or the PR that removed it.

Write-Host "DEPRECATED: Cloudflare tunnel scripts have been removed from this repository." -ForegroundColor Yellow
Write-Host "If you are maintaining a fork and require tunnel functionality, please consult the project README and the archived scripts in scripts/archived/." -ForegroundColor Yellow

# Exit successfully without performing any actions
exit 0
