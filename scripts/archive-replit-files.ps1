<#
Archive Replit config files into archive/replit-removed-<timestamp>/ to declutter the repo.

Usage:
  # Preview only
  .\scripts\archive-replit-files.ps1 -Preview

  # Apply (move files)
  .\scripts\archive-replit-files.ps1 -Apply

Options:
  -Preview  : Show files that would be moved (no changes)
  -Apply    : Move the files into the archive folder
  -Verbose  : Show more output

Files targeted (conservative):
  .replit, .replit.lock, .replitrc, replit.nix
  Any files named starting with '.replit' or in a .replit specific folder
#>

param(
  [switch]$Preview,
  [switch]$Apply,
  [switch]$Verbose
)

function Log { param($m) Write-Host "[archive-replit]" $m }

$repoRoot = Resolve-Path -Path (Join-Path $PSScriptRoot '..') | Select-Object -ExpandProperty Path
Set-Location $repoRoot

# Patterns to look for
$patterns = @('.replit','*.replit*','replit.nix')

# Collect matches
$matches = @()
foreach ($p in $patterns) {
  $ms = Get-ChildItem -Path $repoRoot -Recurse -Force -ErrorAction SilentlyContinue -Filter $p | Where-Object { -not $_.PSIsContainer }
  if ($ms) { $matches += $ms }
}

if (-not $matches -or $matches.Count -eq 0) {
  Log "No Replit-related files found. Nothing to do."
  exit 0
}

$timestamp = (Get-Date).ToString('yyyyMMdd-HHmmss')
$archiveDir = Join-Path $repoRoot "archive\replit-removed-$timestamp"

if ($Preview) {
  Log "Preview mode: the following files would be moved to $archiveDir"
  $matches | ForEach-Object { Write-Host "  - " $_.FullName }
  exit 0
}

# Create archive dir
if (-not (Test-Path $archiveDir)) { New-Item -ItemType Directory -Path $archiveDir | Out-Null }

foreach ($f in $matches) {
  $rel = $f.FullName.Substring($repoRoot.Length).TrimStart('\')
  $dest = Join-Path $archiveDir $rel
  $destDir = Split-Path $dest -Parent
  if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
  try {
    Move-Item -Path $f.FullName -Destination $dest -Force
    Log "Moved: $rel -> archive/replit-removed-$timestamp/$rel"
  } catch {
    Write-Host "Failed to move $($f.FullName): $_" -ForegroundColor Yellow
  }
}

Log "Archive complete. Review files under: $archiveDir";

# Optionally print git status hint
Write-Host "Next steps: git add -A; git commit -m 'chore: archive Replit config files'" -ForegroundColor Cyan

