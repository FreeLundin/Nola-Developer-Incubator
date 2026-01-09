# Deploy instructions: create branch, commit, push, and deploy via GitHub Actions / GitHub Pages

Run these commands locally in PowerShell (at repo root):

# Create branch from current main (or your working branch)
git checkout -b fix/server-entry-detection

# Stage the modified file and commit
git add server/index.ts
git commit -m "fix(server): robust server entry detection so dev and dist runs start server"

# Push to origin and create remote branch
git push --set-upstream origin fix/server-entry-detection

# OPTIONAL: open a PR on GitHub web UI to merge into main

# Deploy via GitHub Pages workflow
# See also: `docs/GITHUB_PAGES_DEPLOYMENT.md` for a canonical GitHub Pages blueprint with asset path guidance and an optional GitHub Actions workflow.
# 1. Push changes to `main` (the workflow will build and publish automatically), or run the workflow via the Actions UI.
# 2. Ensure `npm run build` completes successfully and `dist/public/index.html` is created.
# 3. The site will be available at https://Nola-Developer-Incubator.github.io/MardiGrasParadeGame/ when the gh-pages branch is published.

# Verify the deployment is live (replace with your GitHub Pages URL):
# Start local check or use Playwright for E2E tests:
# or run: npx playwright test --project=chromium

Notes:
- If the Git push fails locally, ensure you have write permissions to the repository and that 'origin' is configured.
