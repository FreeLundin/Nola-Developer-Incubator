# PR Preview Guide

This repo includes a GitHub Actions workflow that builds a preview site for pull requests and deploys it under `gh-pages` into `previews/<run_id>/`.

IMPORTANT: I created the workflow file locally. It will only run after you push the branch and open a PR — I did not push or trigger any remote action.

How it works

- When a pull request is opened or updated, the workflow builds the project (`npm run build`) and deploys the output to the `gh-pages` branch under `previews/<run_id>/`.
- The workflow comments the PR with a preview URL like:
  `https://<owner>.github.io/<repo>/previews/<run_id>/`

Prerequisites and notes

- The repository must have GitHub Pages configured to serve from the `gh-pages` branch (root). If not configured, follow GitHub Pages settings to enable it.
- The workflow uses the built `dist/public` folder produced by `npm run build`.
- The preview is intended for QA and development only — do not consider previews production.

Troubleshooting: lockfile / npm ci errors

You may see errors like:

```
npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
```

This happens when the lockfile in a fork or branch is out-of-sync with package.json (common in forks or when dependencies were updated locally). To make previews more robust for contributors and forks, the preview workflow uses `npm install` instead of `npm ci`. Maintainers should keep `package-lock.json` in sync with `package.json` in the default branch for reproducible CI builds.

How to get a preview locally (without pushing):

1. Run the dev server locally (fast feedback):

```powershell
npm run dev
```

2. If you need a public URL to test on mobile, use a tunnel (manually). The project previously included a `scripts/launch-cloudflared.ps1` helper but it is deprecated. You can use a local tunnel like `cloudflared` or `ngrok` separately to expose `http://localhost:5000`.

3. Use the `Dev Overlay` to toggle the Minimal HUD for quick UI tests. In development, open the Dev Overlay (top-right) and enable `Minimal HUD`. Game UI will immediately switch to the simplified HUD.

How to get a PR preview (recommended):

1. Create a feature branch and commit your changes.
2. Push the branch to GitHub.
3. Open a Pull Request targeting the default branch.
4. The `PR Preview` workflow will run and comment the PR with the preview URL when complete.

Security note

- The workflow uses `GITHUB_TOKEN` to push to the `gh-pages` branch. Only repository maintainers should enable this workflow.

If you want, I can create a sample branch and open a PR for you (I will not push without your permission).
