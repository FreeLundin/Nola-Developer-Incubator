# create-savepoint.ps1
# Commits all changes, creates an annotated savepoint tag, and writes a result log.
$LOG = Join-Path $PSScriptRoot '..\git-savepoint-result.txt' | Resolve-Path -Relative
# Helper to write both console and log
function W($s) { $s | Tee-Object -FilePath $LOG -Append }
W "=== START create-savepoint.ps1 ==="
try {
  if (-not (Get-Command git -ErrorAction SilentlyContinue)) { W 'ERROR: git not found in PATH'; exit 1 }
  Push-Location (Split-Path -Parent $MyInvocation.MyCommand.Definition)
  Push-Location ..
  W "PWD: $(Get-Location)"
  $inside = git rev-parse --is-inside-work-tree 2>&1
  W "is-inside-work-tree: $inside"
  if ($inside -ne 'true') { W 'ERROR: Not a git repository'; exit 1 }
  W '--- git status (porcelain) ---'
  $status = git status --porcelain 2>&1
  W $status
  if (-not (git config user.name)) { git config user.name 'Auto SavePoint'; W 'Set git user.name to Auto SavePoint' }
  if (-not (git config user.email)) { git config user.email 'autosave@example.com'; W 'Set git user.email to autosave@example.com' }
  W 'Running: git add -A'
  git add -A 2>&1 | Tee-Object -FilePath $LOG -Append
  W 'Running: git commit -m "chore(save): save point"'
  & git commit -m 'chore(save): save point' 2>&1 | Tee-Object -FilePath $LOG -Append
  $commitExit = $LASTEXITCODE
  if ($commitExit -ne 0) { W "git commit exited with code $commitExit (maybe nothing to commit)" }
  W 'Getting HEAD commit hash'
  $hashFull = git rev-parse HEAD 2>&1
  $hashShort = git rev-parse --short HEAD 2>&1
  W "HEAD: $hashFull"
  W "HEAD-short: $hashShort"
  $tag = "savepoint-$hashShort"
  W "Attempting to create annotated tag: $tag"
  & git tag -a $tag -m "Save point at commit $hashShort (created on $(Get-Date -Format u))" 2>&1 | Tee-Object -FilePath $LOG -Append
  if ($LASTEXITCODE -ne 0) {
    W "git tag failed with exit code $LASTEXITCODE; falling back to writing ref file"
    $tagRefPath = Join-Path -Path (Join-Path .git refs) -ChildPath (Join-Path tags $tag)
    New-Item -ItemType Directory -Force -Path (Split-Path $tagRefPath) | Out-Null
    Set-Content -Path $tagRefPath -Value $hashFull
    W "Wrote manual tag ref: $tagRefPath -> $hashFull"
  } else {
    W "Created annotated tag: $tag"
  }
  W 'Listing matching tag refs (git show-ref --tags)'
  git show-ref --tags 2>&1 | Select-String $tag | Tee-Object -FilePath $LOG -Append
  W 'Recent tags:'
  git tag --list --sort=-creatordate | Select-Object -First 10 | ForEach-Object { W " - $_" }
  W 'Recent commits (last 5):'
  git log -n 5 --oneline | ForEach-Object { W " - $_" }
  Pop-Location; Pop-Location
} catch {
  W "ERROR: $_"
  Pop-Location -ErrorAction SilentlyContinue; Pop-Location -ErrorAction SilentlyContinue
  exit 1
}
W '=== END create-savepoint.ps1 ==='

