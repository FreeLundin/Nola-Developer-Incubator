Deploy instructions: create branch, commit, push, and redeploy on Vercel

Run these commands locally in PowerShell (at repo root):

# Create branch from current main (or your working branch)
git checkout -b fix/server-entry-detection

# Stage the modified file and commit
git add server/index.ts
git commit -m "fix(server): robust server entry detection so dev and dist runs start server"

# Push to origin and create remote branch
git push --set-upstream origin fix/server-entry-detection

# OPTIONAL: open a PR on GitHub web UI to merge into main

# Fix Vercel root directory via web dashboard
# 1. Open https://vercel.com/noladeveloperincubator/mardi-gras-parade-game/settings
# 2. Set Root Directory to ./ (no trailing spaces) and save
# 3. Go to Deployments → Redeploy (or trigger via CLI after fix)

# Redeploy via CLI after dashboard change (or once push is merged to main):
# Ensure you're logged in to Vercel CLI:
# npx vercel login
# Deploy production:
# npx vercel --prod --confirm

# Verify the deployment is live (replace with actual URL returned by Vercel):
# Start local check or use Playwright for E2E tests:
# Open browser: https://mardi-gras-parade-game.vercel.app
# or run: npx playwright test --project=chromium

Notes:
- If you do not want to use the web dashboard, I can keep trying to update the project via the Vercel CLI/API here, but CLI attempts earlier failed due to a malformed project path stored in Vercel settings.
- If the Git push fails locally, ensure you have write permissions to the repository and that 'origin' is configured.

