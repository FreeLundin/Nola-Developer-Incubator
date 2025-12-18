<#
Consolidate files from a source folder into the canonical project folder safely.

Usage (PowerShell, run from any location):
  # Dry run: list unique/changed files only
  .\scripts\consolidate-single-location.ps1 -SourcePath 'C:\Unreal_Projects_Active\MardiGrasParadeGame' -CanonicalPath 'C:\Coding_Projects\MardiGrasParadeSim' -DryRun

  # Backup source and copy missing/unique files interactively
  .\scripts\consolidate-single-location.ps1 -SourcePath 'C:\Unreal_Projects_Active\MardiGrasParadeGame' -CanonicalPath 'C:\Coding_Projects\MardiGrasParadeSim' -Backup -Interactive

  # Non-interactive copy of unique files (use with care)
  .\scripts\consolidate-single-location.ps1 -SourcePath 'C:\Unreal_Projects_Active\MardiGrasParadeGame' -CanonicalPath 'C:\Coding_Projects\MardiGrasParadeSim' -CopyAll -Backup

What it does:
  - Scans source and canonical directories recursively, ignoring .git and node_modules by default.
  - Reports files that exist only in source ("unique"), files that differ by hash ("modified"), and files that exist only in canonical ("extra-in-canonical").
  - In DryRun mode it only reports.
  - With -CopyAll it copies unique and modified files into canonical (modified files will be copied with a .incoming timestamped suffix unless -Overwrite is used).
  - With -Interactive it prompts before each copy.
  - With -Backup it zips the source folder to a timestamped archive before any copy.

Safety notes:
  - This script does NOT delete any files in either location.
  - Always run with -DryRun first to review the proposed changes.
  - Keep backups and review copied files before committing.

Parameters:
  -SourcePath   : Path to the folder you want to merge from (e.g., secondary copy)
  -CanonicalPath: Canonical project path (default: C:\Coding_Projects\MardiGrasParadeSim)
  -DryRun       : Switch - only report, do not copy
  -Backup       : Switch - create a zip backup of source before copying
  -Interactive  : Switch - prompt before copying each file
  -CopyAll      : Switch - perform copies for unique/modified files
  -Overwrite    : Switch - overwrite modified files in canonical (use with care)
#>

param(
  [Parameter(Mandatory=$true)] [string]$SourcePath,
  [string]$CanonicalPath = 'C:\Coding_Projects\MardiGrasParadeSim',
  [switch]$DryRun,
  [switch]$Backup,
  [switch]$Interactive,
  [switch]$CopyAll,
  [switch]$Overwrite
)

function Log { param($m) Write-Host "[consolidate]" $m }

# Normalize paths
$SourcePath = (Resolve-Path -Path $SourcePath).ProviderPath
$CanonicalPath = (Resolve-Path -Path $CanonicalPath).ProviderPath

# Safety checks
if (-not (Test-Path $SourcePath)) { Write-Error "SourcePath not found: $SourcePath"; exit 2 }
if (-not (Test-Path $CanonicalPath)) { Write-Error "CanonicalPath not found: $CanonicalPath"; exit 2 }

# Ignore patterns
$ignoreDirs = @('.git','node_modules','dist','.cache')

function Get-FileList([string]$base) {
  Get-ChildItem -Path $base -Recurse -File -ErrorAction SilentlyContinue | Where-Object {
    $p = $_.FullName.Substring($base.Length).TrimStart('\')
    foreach ($d in $ignoreDirs) { if ($p -like "$d*" -or $p -like "*$([IO.Path]::DirectorySeparatorChar)$d*") { return $false } }
    return $true
  }
}

Log "Scanning source files..."
$sourceFiles = Get-FileList $SourcePath
Log "Scanning canonical files..."
$canonFiles = Get-FileList $CanonicalPath

# Build lookup by relative path
$mapSource = @{}
foreach ($f in $sourceFiles) { $rel = $f.FullName.Substring($SourcePath.Length).TrimStart('\'); $mapSource[$rel] = $f }
$mapCanon = @{}
foreach ($f in $canonFiles) { $rel = $f.FullName.Substring($CanonicalPath.Length).TrimStart('\'); $mapCanon[$rel] = $f }

$uniqueInSource = @()
$modified = @()
$onlyInCanonical = @()

# Compare
foreach ($rel in $mapSource.Keys) {
  if (-not $mapCanon.ContainsKey($rel)) {
    $uniqueInSource += $rel
  } else {
    # compare hash
    try {
      $h1 = (Get-FileHash -Algorithm SHA256 -Path $mapSource[$rel].FullName).Hash
      $h2 = (Get-FileHash -Algorithm SHA256 -Path $mapCanon[$rel].FullName).Hash
      if ($h1 -ne $h2) { $modified += $rel }
    } catch {
      # if Get-FileHash fails (e.g., large files), consider modified and report
      $modified += $rel
    }
  }
}

foreach ($rel in $mapCanon.Keys) { if (-not $mapSource.ContainsKey($rel)) { $onlyInCanonical += $rel } }

# Report
Write-Host "\nSummary for Source: $SourcePath -> Canonical: $CanonicalPath\n" -ForegroundColor Cyan
Write-Host "Unique files in Source: $($uniqueInSource.Count)"
if ($uniqueInSource.Count -gt 0) { $uniqueInSource | ForEach-Object { Write-Host "  + $_" } }
Write-Host "Modified files (different content): $($modified.Count)"
if ($modified.Count -gt 0) { $modified | ForEach-Object { Write-Host "  ! $_" } }
Write-Host "Files only in Canonical (not in source): $($onlyInCanonical.Count)"
if ($onlyInCanonical.Count -gt 0) { $onlyInCanonical | ForEach-Object { Write-Host "  - $_" } }

if ($DryRun) { Log "DryRun specified - no files will be copied. Review above list."; exit 0 }

# Backup source if requested
if ($Backup) {
  try {
    $timestamp = (Get-Date).ToString('yyyyMMdd-HHmmss')
    # Prefer Desktop, but fall back to repo archive folder if Desktop path is not available or not writable
    try {
      $desktop = [Environment]::GetFolderPath('Desktop')
    } catch { $desktop = $null }

    $zipName = $null
    if ($desktop) {
      $candidate = Join-Path $desktop "mardi-consolidate-backup-$timestamp.zip"
      try {
        # try to ensure we can create a zero-byte file to check writability
        $tmp = [IO.Path]::GetTempFileName()
        Copy-Item -Path $tmp -Destination $candidate -Force
        Remove-Item $candidate -Force -ErrorAction SilentlyContinue
        Remove-Item $tmp -Force -ErrorAction SilentlyContinue
        $zipName = $candidate
      } catch {
        $zipName = $null
      }
    }

    if (-not $zipName) {
      $repoArchive = Join-Path $CanonicalPath 'archive'
      if (-not (Test-Path $repoArchive)) { New-Item -ItemType Directory -Path $repoArchive | Out-Null }
      $zipName = Join-Path $repoArchive "mardi-consolidate-backup-$timestamp.zip"
    }

    Log "Creating backup zip of source to: $zipName"
    Add-Type -AssemblyName 'System.IO.Compression.FileSystem'
    [System.IO.Compression.ZipFile]::CreateFromDirectory($SourcePath, $zipName)
    Log "Backup created"
  } catch {
    Write-Error "Backup failed: $_"; exit 3
  }
}

# Copy function
function Copy-FileToCanonical([string]$rel) {
  $src = Join-Path $SourcePath $rel
  $dst = Join-Path $CanonicalPath $rel
  $dstDir = Split-Path $dst -Parent
  if (-not (Test-Path $dstDir)) { New-Item -ItemType Directory -Path $dstDir -Force | Out-Null }
  if ((Test-Path $dst) -and -not $Overwrite) {
    # write incoming file next to existing with timestamp
    $ts = (Get-Date).ToString('yyyyMMdd-HHmmss')
    $dstIncoming = "$dst.incoming.$ts"
    Copy-Item -Path $src -Destination $dstIncoming -Force
    Write-Host "Copied modified file to: $dstIncoming"
  } else {
    Copy-Item -Path $src -Destination $dst -Force
    Write-Host "Copied: $rel -> $dst"
  }
}

# Perform copies
if ($CopyAll) {
  $toCopy = $uniqueInSource + $modified
  foreach ($rel in $toCopy) {
    if ($Interactive) {
      $ans = Read-Host "Copy $rel? (y/N)"
      if ($ans.ToLower() -ne 'y' -and $ans.ToLower() -ne 'yes') { Write-Host "Skipped $rel"; continue }
    }
    Copy-FileToCanonical $rel
  }
  Write-Host "Copy phase complete. Review canonical folder before committing." -ForegroundColor Green
} else {
  Log "No -CopyAll flag provided. Run again with -CopyAll to copy unique/modified files (use -DryRun first)."; exit 0
}

# Optional verification steps
Write-Host "\nRunning quick verification: TypeScript check (npm run check)." -ForegroundColor Cyan
try {
  Push-Location $CanonicalPath
  npm run check
  Pop-Location
} catch {
  Write-Host "TypeScript check failed or could not run. Inspect canonical folder and run 'npm run check' manually." -ForegroundColor Yellow
  Pop-Location
}

Write-Host "Consolidation script finished. Please review changes and commit in the canonical repo." -ForegroundColor Green

