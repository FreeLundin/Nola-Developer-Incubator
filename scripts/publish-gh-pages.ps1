param(
  [string]$remote = 'origin'
)

Write-Host "Publishing dist/public to gh-pages branch on remote '$remote'"
if (-not (Test-Path 'dist/public')) {
  Write-Error 'dist/public not found. Run npm run build first.'; exit 1
}

# Create a temporary worktree to prepare the gh-pages branch
$tmp = Join-Path $env:TEMP "gh-pages-$(Get-Random)"
git worktree add -B gh-pages $tmp
Copy-Item -Path 'dist/public/*' -Destination $tmp -Recurse -Force
Set-Location $tmp
git add -A
git commit -m "chore(deploy): publish gh-pages" -q
Write-Host "Pushing to remote $remote gh-pages branch..."
git push $remote HEAD:gh-pages --force
Write-Host "Published. Cleaning up..."
Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Path)
git worktree remove $tmp --force
Remove-Item -Recurse -Force $tmp
Write-Host 'Done.'

