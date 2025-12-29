#!/usr/bin/env bash
remote=${1:-origin}

echo "Publishing dist/public to gh-pages branch on remote '$remote'"
if [ ! -d dist/public ]; then
  echo "dist/public not found. Run npm run build first." >&2
  exit 1
fi

tmp=$(mktemp -d -t gh-pages-XXXX)

git worktree add -B gh-pages "$tmp"
cp -a dist/public/. "$tmp/"
cd "$tmp"
git add -A
if git commit -m "chore(deploy): publish gh-pages" -q; then
  echo "Pushing to remote $remote gh-pages branch..."
  git push "$remote" HEAD:gh-pages --force
else
  echo "No changes to publish."
fi

cd -
git worktree remove "$tmp" --force
rm -rf "$tmp"
echo "Done."

