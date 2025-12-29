# 🎭 NDI_MardiGrasParade — Playable 3D Mardi Gras Parade

This repository contains a browser-playable 3D Mardi Gras parade experience built with React, React Three Fiber, Three.js and TypeScript.

Public playtest (GitHub Pages): https://Nola-Developer-Incubator.github.io/MardiGrasParadeGame/

Quick references
- Canonical documentation and planning artifacts: `docs/README.md` (Game Design, Product Backlog, Roadmap, Ticket Template).
- Playwright tests: `tests/playwright/` (skeletons and test cases).
- PR preview workflow: `.github/workflows/pr-preview.yml` uploads preview artifacts and can publish previews to `gh-pages` when the `GH_PAGES_PAT` or `GH_PAGES_DEPLOY_TOKEN` secret is configured.

Quick start (developer)
1. Clone the repo and enter the directory:

   git clone https://github.com/Nola-Developer-Incubator/MardiGrasParadeGame.git
   cd MardiGrasParadeGame

2. Install dependencies and run dev server:

   npm ci
   npm run dev

3. Open in browser:
   - Public preview: https://Nola-Developer-Incubator.github.io/MardiGrasParadeGame/
   - Local dev server: http://localhost:5000

Documentation
- Full documentation and planning artifacts live under `docs/`. Start here: `docs/README.md`.

Contributing
- Run `npm ci` and `npm run dev` to test locally.
- Create a feature branch, open a PR, and link to the related doc/backlog item.
- PR previews upload an artifact and (if enabled) publish a live preview to GitHub Pages. See `.github/workflows/pr-preview.yml` for details.

If you'd like, I can:
- Expand backlog items into individual GitHub issues and attach Playwright test skeletons.
- Clean up UI/HUD code and implement the minimal HUD/joystick improvements described in the backlog.
- Enable and validate gh-pages publishing for PR previews (requires `GH_PAGES_PAT` secret).

Contact
- Project lead: Brian C Lundin
- Issues: https://github.com/Nola-Developer-Incubator/MardiGrasParadeGame/issues
