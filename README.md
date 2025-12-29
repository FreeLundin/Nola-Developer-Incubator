# 🎭 NDI_MardiGrasParade — Playable 3D Mardi Gras Parade

This repository provides a browser-playable 3D Mardi Gras parade experience built with React, React Three Fiber, Three.js and TypeScript.

Public playtest (GitHub Pages): https://Nola-Developer-Incubator.github.io/MardiGrasParadeGame/

Repository: https://github.com/Nola-Developer-Incubator/MardiGrasParadeGame

Summary
- Playable in the browser via GitHub Pages (see public link above).
- Local development: `npm run dev` (dev server with HMR).
- Production build served locally: `npm run build` then `npm start` (serves `dist/public` on port 5000).

About / Playtest
- Public demo: https://Nola-Developer-Incubator.github.io/MardiGrasParadeGame/
- Use the public playtest link above to share and verify gameplay without running a local server.

Quick start (developer)
1. Clone the repo:

   git clone https://github.com/Nola-Developer-Incubator/MardiGrasParadeGame.git
   cd MardiGrasParadeGame

2. Install dependencies and run dev server (Windows PowerShell may block npm wrappers; see troubleshooting):

   npm ci
   npm run dev

3. Open in browser (public preview or local dev server):

   - Public preview: https://Nola-Developer-Incubator.github.io/MardiGrasParadeGame/
   - Local dev server (if running): http://localhost:5000

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

---

## Key project artifacts (new)
The project now includes focused design and planning artifacts in the `docs/` folder. These are the canonical sources for game design, backlog, roadmap, and sprint planning.

- Game Design Document (GDD): `docs/Game_Design.md` — systems, mechanics, UX, controls, visuals, audio, and acceptance criteria.
- Product Strategy & Roadmap: `docs/PRODUCT_BACKLOG.md` — prioritized backlog, sprint candidates, and roadmap with monetization notes.
- Ticket template & QA: `docs/TICKET_TEMPLATE.md` — issue template and Playwright skeleton guidance.

Please review the linked docs for the expanded artifacts (gameplay goals, monetization notes, product backlog tables, and sprint planning estimates).

---

Game Design Document (GDD) — Overview
This project is a lightweight, family-friendly 3D arcade experience that simulates a Mardi Gras parade. Players move along a parade route, catching themed collectibles (beads, doubloons, cups) thrown from floats while avoiding obstacles and competing NPCs. The experience emphasizes short, replayable sessions, accessible mobile controls, and vibrant visual feedback.

Key systems
- Player movement and controls (keyboard, mouse, optional on-screen joystick for touch)
- Float spawning and collectible throws
- Collision detection & catch logic
- NPC competitors with simple AI
- Power-ups and temporary modifiers
- HUD, audio cues, and haptic feedback hooks

Design goals
- Easy to learn, satisfying to master
- 30–120 second play sessions for casual engagement
- High visual polish at small asset sizes for performance
- Competitive but fair AI competitors

For the full GDD, open `docs/Game_Design.md`.

Product Backlog (high-level priority list)
1. Improve UX & Controls: mobile joystick refinement, reduced HUD clutter, accessible hints. (P0)
2. Backend: session tracking & cloud save (free-tier ready: SQLite/Firebase/Supabase). (P0)
3. Analytics: session length, engagement, event logging. (P1)
4. Quality of Life: audio toggle fixes, stable joystick input on mobile. (P0)
5. New content: additional float types, collectibles, minor cosmetics. (P1)
6. Monetization plumbing: in-game shop UI, purchase flow mock, AdReward integration (P2)
7. Leaderboards and social sharing hooks. (P2)
8. Performance: reduce draw calls, instancing for repeated objects. (P1)

Product Roadmap (quarters) — includes monetization notes
- Q1 — Core polish: joystick and HUD improvements, audio fixes, analytics prototype.
- Q2 — Content & engagement: new floats, beginner rewards, cosmetic shop MVP (UI-only).
- Q3 — Social & retention: leaderboards, daily/weekly challenges, helper bot features.
- Q4 — Live ops & monetization experiments: seasonal bundles, A/B testing for cosmetic offers and rewarded ad placements.

Sprint Planning (next sprint — 2 weeks)
Goal: Improve mobile controls and HUD clarity.
Duration: 2 weeks
Team: 2 engineers, 1 designer, 1 product manager (suggested)

Planned tasks (examples)
- Refactor HUD for minimal mode and test VITE-based toggles (2d)
- Fix joystick multi-touch and prevent catch-area conflicts (3d)
- Stabilize audio toggle across sessions and platforms (1d)
- Add visual remaining-floats indicator and minor animations (2d)
- Create analytics events for session start/stop and level complete (2d)
- Test on iOS/Android and desktop; collect feedback (2d)

Acceptance criteria
- Mobile joystick is responsive and does not conflict with catch areas.
- Minimal HUD mode displays compact info and hides non-critical elements.
- Audio toggle correctly persists and toggles in all tested browsers.
- Analytics events are logged to the configured backend (stub/mock acceptable).

How to contribute
- Run `npm ci` then `npm run dev` to test locally.
- Create a branch for your feature or bugfix and open a PR. The PR preview workflow uploads a preview artifact and posts a link in the PR comment when available.

---

If you'd like, I can now:
- Expand any backlog item into a ticket template or Playwright test skeleton (I added a joystick skeleton under `tests/playwright/joystick.spec.ts`).
- Enable automatic gh-pages publishing for PR previews (requires adding `GH_PAGES_PAT` secret) so previews are publicly hosted instead of artifacts.

Tell me which one you want next and I'll proceed.
