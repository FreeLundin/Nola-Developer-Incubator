<#
Accept incoming files: replace canonical files with the .incoming.* copies created by the consolidation script.

Usage (PowerShell from repo root):
  # Preview only (safe):
  .\scripts\accept-incoming.ps1 -Preview

  # Apply incoming files with backups of originals:
  .\scripts\accept-incoming.ps1 -Apply -Backup

Parameters:
  -Preview : Show what would be done, do not modify files.
  -Apply   : Actually replace originals with incoming files.
  -Backup  : When applying, back up original files as <file>.bak.<timestamp>
  -Overwrite: When applying, if original exists and Overwrite specified, overwrite without creating .incoming backup (use with care).

This script is conservative: it only moves files that match the pattern *.incoming.<timestamp> (timestamp format flexible).
#>

param(
  [switch]$Preview,
  [switch]$Apply,
  [switch]$Backup,
  [switch]$Overwrite
)

function Log { param($m) Write-Host "[accept-incoming]" $m }

$repoRoot = (Get-Location).ProviderPath
Log "Repo root: $repoRoot"

# Find incoming files
$incomingFiles = Get-ChildItem -Path $repoRoot -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -match '\.incoming\.' }
if (-not $incomingFiles -or $incomingFiles.Count -eq 0) {
  Log "No incoming files found. Nothing to do."; exit 0
}

$timestamp = (Get-Date).ToString('yyyyMMdd-HHmmss')

foreach ($f in $incomingFiles) {
  $name = $f.Name
  # Attempt to strip the .incoming.<timestamp> suffix to compute original name
  if ($name -match '^(.*)\.incoming\.[0-9]{8}-[0-9]{6}$') { $origName = $matches[1] }
  elseif ($name -match '^(.*)\.incoming\.(.+)$') { $origName = $matches[1] }
  else { Log "Could not parse incoming file name: $name - skipping"; continue }

  $origFull = Join-Path $f.DirectoryName $origName
  $incomingFull = $f.FullName

  if ($Preview) {
    Log "Would replace: $origFull  <=  $incomingFull"
    continue
  }

  # Apply
  if (Test-Path $origFull) {
    if ($Backup) {
      $bak = "$origFull.bak.$timestamp"
      Copy-Item -Path $origFull -Destination $bak -Force
      Log "Backed up original: $origFull -> $bak"
    }
    if (-not $Overwrite) {
      # keep original, move incoming to replace by overwriting
      Move-Item -Path $incomingFull -Destination $origFull -Force
      Log "Replaced (with backup): $origFull <= $incomingFull"
    } else {
      Move-Item -Path $incomingFull -Destination $origFull -Force
      Log "Overwritten: $origFull <= $incomingFull"
    }
  } else {
    # Original doesn't exist, move incoming into place
    Move-Item -Path $incomingFull -Destination $origFull -Force
    Log "Moved new file: $origFull <= $incomingFull"
  }
}

Log "Done. Run 'git status' to review changes, then commit/push as needed."
