# Designer Workflow — Quick, Practical Steps

Date: 2025-12-09

<!-- Project link for designers -->
**Project:** [Mardi Gras Parade Simulator — Repository](https://github.com/FreeLundin/Nola-Developer-Incubator)

Purpose: A concise workflow for designers to iterate on art, sound, and level content and verify changes in the running game locally.

1) Get the project running locally
- Install dependencies: `npm install`
- Start the dev server: `npm run dev`
- Open the game in your browser: `http://localhost:5000`

2) Quick art/sound iteration loop
- Place or update assets in `client/public/` (models, textures, sounds). Follow naming conventions and folders in `client/public/`.
- Tip: Use small, compressed texture variants for fast refresh (WebP/AVIF preferred).
- Refresh the browser (HMR will reload React code; some static asset caching may require a hard reload).

3) Preview changes inside the game
- Use the tutorial overlay to start a level quickly.
- For sound tests, use the `Enable Audio` button on the start screen to satisfy browser autoplay policies.
- Use the HUD Admin → “Reload config” to pick up any local bot name overrides without refreshing.

4) Local bot naming and persona checks
- Open HUD → Admin to change competitor names locally (saves to `localStorage` key `bots.override`).
- Save applies immediately; the HUD and running bots will update.
- Use the Persona toggle (HUD) to show persona labels for QA.

5) Quick testing checklist (designer-focused)
- Visual: new models display, correct textures, acceptable LOD and scaling.
- Audio: SFX play on catches; background music when unmuted (use Enable Audio first).
- Gameplay: collectible trajectories look correct; catches trigger effects.
- Mobile preview: generate a QR (`npm run qr`) and scan with a phone on same LAN.

6) Asset handoff / export guidelines
- Models: glTF or GLB; keep individual models under 10k tris where possible.
- Textures: WebP/PNG, keep 1–2 mipmap levels for quick iteration, max 2048×2048.
- Sounds: WAV or high-bitrate MP3 for master; use 44.1kHz.
- Provide a short README for any complex asset (anchor points, pivot, origin).

7) When ready to hand off to engineering
- Provide source assets and an optimized build variant (compressed textures & trimmed audio).
- If you changed bot names and want them persisted in repo, send the updated `client/src/config/bots.json` or open a PR with the change.

Notes
- Admin edits are local-only (saved to localStorage). This keeps designers from accidentally committing changes to the repo.
- For any release or shared changes, coordinate with engineering to update `client/src/config/bots.json` in the repo.
