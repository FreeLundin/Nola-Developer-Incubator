# Project Landing Page (docs/website)

This folder contains a minimal static landing page for the Mardi Gras Parade Simulator project.

Files
- `index.html` - simple landing page with quick links and instructions
- `style.css` - local stylesheet

How to view locally
1. Open `docs/website/index.html` in your browser (double-click or `open`).
2. Or, run a minimal static server from the repo root:

```powershell
# From repo root
npm run open:site
# Then open http://127.0.0.1:8081
```

How to contribute to docs/website
- Edit `docs/website/index.html` and `style.css` and push changes to `docs/site` branch.
- A GitHub Action will automatically deploy the site to GitHub Pages after the PR is merged.

Testing notes
- For a visual smoke check of the game, start the dev server and run `npm run open:browser` to open the game when `GET /health` responds.
- Use `node scripts/headless-puppeteer.mjs` locally to run a headless smoke test and capture console logs and a screenshot.

Deployment
- The repository includes `.github/workflows/gh-pages.yml` which will upload and deploy `docs/website` to GitHub Pages when the PR is merged to `main`.
- After deployment, visit the Pages URL provided in the Action logs.

Support and issues
- If the site does not render correctly after deployment, check the Action artifacts for `playwright-playtest.png` and `playwright-console.log` to diagnose failures.
