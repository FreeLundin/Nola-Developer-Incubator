# 🎭 NDI_MardiGrasParade — Playable 3D Mardi Gras Parade

This repository provides a browser-playable 3D Mardi Gras parade experience built with React, React Three Fiber, Three.js and TypeScript.

Public playtest (GitHub Pages): https://Nola-Developer-Incubator.github.io/MardiGrasParadeGame/

Repository: https://github.com/Nola-Developer-Incubator/MardiGrasParadeGame

Summary
- Playable in the browser via GitHub Pages (see public link above).
- Local development: `npm run dev` (dev server with HMR) and `http://localhost:5000`.
- Production build served locally: `npm run build` then `npm start` (serves `dist/public` on port 5000).

Definition of Done (DOD) — Sprint 1 (short)
- Frontend compiles and runs locally (npm run dev) and there is a production build (npm run build).
- Public, shareable build is published to GitHub Pages and the public URL above loads the game.
- Mobile joystick controls work and are documented in Settings and this README.
- Competitor (bot) scores are visible on desktop and a compact overlay appears on mobile when joystick is enabled.
- Audio is enabled by default when the page is first loaded (user can mute via the HUD).

Quick start (developer)
1. Clone the repo:

   git clone https://github.com/Nola-Developer-Incubator/MardiGrasParadeGame.git
   cd MardiGrasParadeGame

2. Install dependencies and run dev server (Windows PowerShell may block npm wrappers; see troubleshooting):

   npm ci
   npm run dev

3. Open in browser: http://localhost:5000

Joystick (mobile/tablet) — how to enable and use
- Open Settings (gear icon) while on a phone or tablet.
- Toggle "Joystick Controls" to enable the on-screen joystick.
- Use: touch and drag the circular joystick area to move the player. Release to stop. The joystick supports pointer events and multi-touch in modern browsers.

Build & publish (GitHub Pages)
- Local build only (inspect output):

  node ./scripts/build-gh-pages.js

- Build + publish to `gh-pages` branch (uses `gh-pages` package):

  npm run deploy:gh-pages:local

- Or use the included GitHub Actions workflow at `.github/workflows/deploy-gh-pages.yml` to publish on push to `main` or via manual dispatch. After a successful publish the site will be available at the public playtest URL above.

Troubleshooting
- Windows PowerShell may block `npm.ps1` wrappers. To allow for the session only:

  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force

  If `npm`/`npx` still errors, use a cmd fallback: `cmd /c "npm ci"` or `cmd /c "npm run dev"`.

- If the GitHub Pages site shows a blank page, clear browser cache and unregister service workers, then reload.

Files changed in this cleanup
- `README.md` — canonical, cleaned, includes public link and joystick instructions.
- UI: Settings modal and mobile HUD were updated to document joystick usage and show compact bot overlay.

Contact / Project lead
- Brian C Lundin
- Issues: https://github.com/Nola-Developer-Incubator/MardiGrasParadeGame/issues
