# Diagnostic script for local server issues
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\diagnose-local.ps1

param(
  [int]$Port = 5000
)

# Determine repository root reliably based on script location
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$repoRoot = Resolve-Path (Join-Path $scriptDir "..")
Set-Location -Path $repoRoot

$root = Get-Location
Write-Host "Running diagnostics in: $root"

# Ensure logs directory
$logDir = Join-Path $root 'logs'
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

# 1) Build
Write-Host "Building project (npm run build)..."
cmd /c "npm run build" | Tee-Object -FilePath (Join-Path $logDir 'build.log')

# 2) Start production server (redirect stdout/stderr)
Write-Host "Starting production server: node dist/index.js (NODE_ENV=production)"
$stdout = Join-Path $logDir 'server.out.log'
$stderr = Join-Path $logDir 'server.err.log'
# Use cmd to set environment variable for this process on Windows
$cmd = "set NODE_ENV=production && node dist/index.js"
$proc = Start-Process -FilePath 'cmd' -ArgumentList '/c', $cmd -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru
Start-Sleep -Seconds 3

# 3) Query health endpoint
$healthLog = Join-Path $logDir 'health.txt'
try {
  Invoke-WebRequest -Uri "http://127.0.0.1:$Port/api/health" -UseBasicParsing -TimeoutSec 10 | Select-Object StatusCode, Content | Out-File -FilePath $healthLog
  Write-Host "Wrote health response to $healthLog"
} catch {
  "ERROR: Health check failed: $_" | Out-File -FilePath $healthLog
  Write-Host "Health check failed; see $healthLog"
}

# 4) Fetch root
$rootLog = Join-Path $logDir 'root.html'
try {
  Invoke-WebRequest -Uri "http://127.0.0.1:$Port/" -UseBasicParsing -TimeoutSec 10 | Select-Object StatusCode, Content | Out-File -FilePath $rootLog
  Write-Host "Wrote root response to $rootLog"
} catch {
  "ERROR: Root fetch failed: $_" | Out-File -FilePath $rootLog
  Write-Host "Root fetch failed; see $rootLog"
}

# 5) Netstat for port
$netstatLog = Join-Path $logDir 'netstat.txt'
cmd /c "netstat -ano | findstr :$Port" | Out-File -FilePath $netstatLog
Write-Host "Wrote netstat output to $netstatLog"

# 6) Process info
$procLog = Join-Path $logDir 'proc.txt'
Get-Process -Id $proc.Id -ErrorAction SilentlyContinue | Out-File -FilePath $procLog
Write-Host "Wrote process info to $procLog (PID $($proc.Id))"

# 7) Display short excerpts
Write-Host "--- Server stdout (last 40 lines) ---"
Get-Content $stdout -Tail 40 | ForEach-Object { Write-Host $_ }
Write-Host "--- Server stderr (last 40 lines) ---"
if (Test-Path $stderr) { Get-Content $stderr -Tail 40 | ForEach-Object { Write-Host $_ } }
Write-Host "--- health.txt ---"
Get-Content $healthLog -ErrorAction SilentlyContinue | ForEach-Object { Write-Host $_ }
Write-Host "--- root.html (first 120 chars) ---"
if (Test-Path $rootLog) { Get-Content $rootLog -TotalCount 10 | ForEach-Object { Write-Host $_ } }

# 8) Stop server
try {
  Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
  Write-Host "Stopped server process $($proc.Id)"
} catch {
  Write-Host "Could not stop process $($proc.Id): $_"
}

Write-Host "Diagnostics complete. Logs in: $logDir"
