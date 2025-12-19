<#
Fix Node modules and reinstall dependencies on Windows.

Usage (run as Administrator, after reboot):
  powershell -ExecutionPolicy Bypass -File .\scripts\fix-node-mods.ps1

What it does:
  - Stops common Node/Esm build processes (node, tsx, esbuild, rollup)
  - Clears read-only attributes under node_modules
  - Removes node_modules (using rimraf)
  - Removes package-lock.json
  - Cleans npm cache
  - Reinstalls dependencies with --legacy-peer-deps
  - Runs TypeScript check and production build

Caveats:
  - Run this as Admin. If antivirus blocks native binaries, temporarily disable Defender while installing.
  - This script is a convenience; review before running.
#>

param(
  [switch]$DisableDefender = $false
)

function Assert-Admin { 
  $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)
  if (-not $isAdmin) {
    Write-Error "This script must be run as Administrator. Open PowerShell 'Run as administrator' and re-run the script."; exit 1
  }
}

Assert-Admin
Write-Host "Starting node_modules cleanup script..." -ForegroundColor Cyan

if ($DisableDefender) {
  Write-Host "Disabling Windows Defender real-time monitoring (temporary)..." -ForegroundColor Yellow
  try { Set-MpPreference -DisableRealtimeMonitoring $true } catch { Write-Warning "Unable to modify Defender settings (you may need to run with stricter privileges)." }
}

# Stop processes that commonly lock native binaries
$procs = Get-Process -Name node,tsx,esbuild,rollup -ErrorAction SilentlyContinue
if ($procs) {
  foreach ($p in $procs) {
    Write-Host "Stopping process: $($p.Name) (Id=$($p.Id))" -ForegroundColor Yellow
    try { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue } catch { }
  }
} else {
  Write-Host "No node/tsx/esbuild/rollup processes found." -ForegroundColor Green
}

# Ensure node_modules attributes are writable
if (Test-Path .\node_modules) {
  Write-Host "Clearing file attributes under node_modules..." -ForegroundColor Cyan
  try {
    Get-ChildItem -Path .\node_modules -Recurse -Force -ErrorAction SilentlyContinue | ForEach-Object { try { $_.Attributes = 'Normal' } catch {} }
  } catch { Write-Warning "Failed to clear attributes: $_" }
}

# Remove node_modules using rimraf
Write-Host "Removing node_modules (using rimraf if available)..." -ForegroundColor Cyan
try {
  npx rimraf node_modules
} catch {
  Write-Warning "rimraf failed or not available; attempting Remove-Item..."
  try { Remove-Item -Recurse -Force .\node_modules -ErrorAction SilentlyContinue } catch { Write-Warning "Remove-Item failed: $_" }
}

# Remove package-lock.json
if (Test-Path package-lock.json) { 
  Write-Host "Removing package-lock.json..." -ForegroundColor Cyan
  Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
}

# Clean npm cache
Write-Host "Cleaning npm cache (force)..." -ForegroundColor Cyan
npm cache clean --force

# Reinstall dependencies (legacy peer deps to avoid peer conflicts)
Write-Host "Installing dependencies (npm install --legacy-peer-deps)..." -ForegroundColor Cyan
$rc = npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) {
  Write-Error "npm install failed with exit code $LASTEXITCODE. See above output for details."; exit $LASTEXITCODE
}

# Run typecheck and build
Write-Host "Running TypeScript check (npm run check)..." -ForegroundColor Cyan
npm run check
if ($LASTEXITCODE -ne 0) { Write-Warning "TypeScript check reported issues (exit code $LASTEXITCODE)" }

Write-Host "Running production build (npm run build)..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { Write-Warning "Build failed (exit code $LASTEXITCODE)."; exit $LASTEXITCODE }

if ($DisableDefender) {
  Write-Host "Re-enabling Windows Defender real-time monitoring..." -ForegroundColor Cyan
  try { Set-MpPreference -DisableRealtimeMonitoring $false } catch { Write-Warning "Unable to re-enable Defender automatically." }
}

Write-Host "Done. If install succeeded, run 'npm run dev' and open http://localhost:5000 to test the app." -ForegroundColor Green

