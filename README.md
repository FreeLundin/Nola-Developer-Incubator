# Mardi Gras Parade Simulator

<!-- Project logo (prefer embedded logo if provided) -->
<p align="center">
  <picture>
    <source srcset="docs/images/logo-embedded.svg" type="image/svg+xml">
    <img src="docs/images/logo.svg" alt="Mardi Gras Parade Logo" width="420" />
  </picture>
</p>

A browser-based 3D Mardi Gras parade simulator (React + R3F + Howler) – catch throws, compete with bots, and enjoy the parade.

<!-- Link to Game Design Document -->
## Game Design

See the full Game Design Document (GDD) for vision, mechanics, balancing, assets, and quick-start instructions:

[docs/GAME_DESIGN.md](./docs/GAME_DESIGN.md)

Quick start and the project Quick Start in the GDD also describe how to generate a QR for testing on mobile devices.

## Quick start (dev)

1. Install dependencies:

```powershell
npm install
```

2. Start the dev server (Vite + Express):

```powershell
npm run dev
```

3. Open the game in your browser: http://localhost:5000

4. To test on a mobile device on the same LAN, generate a QR and scan it:

```powershell
npm run qr
# This writes docs/browser-qr.svg and prints an ASCII QR
```

## Using a custom project logo (local only)

Place a PNG you want to use as the project's logo (e.g., a 192×192 thumbnail) anywhere on your machine and run the import script. This copies the PNG into the repo and generates a small embedded SVG used by the docs.

```powershell
# From repo root, using your PNG path
node scripts/import-logo.js "C:\Users\BLund\OneDrive\Pictures\a 192x192 thumbnail .png"
# Regenerate the PDF (optional)
node scripts/md-to-pdf.mjs
```

The import script writes:
- `docs/images/logo-source.png` (copied PNG)
- `docs/images/logo-embedded.svg` (SVG wrapper referencing the PNG)

The documentation prefers `logo-embedded.svg` if present, and the in-game start screen uses `client/src/assets/start-logo.png` (generated from the embedded/built-in logo). You can regenerate icon sizes (favicons, app icons) with:

```powershell
node scripts/generate-logo-sizes.mjs
# outputs into docs/icons/logo-<size>.png
```

## Where the logo is used
- Docs header: `docs/GAME_DESIGN.md` and other docs reference `docs/images/logo-embedded.svg` (fallback `docs/images/logo.svg`).
- In-game start logo: `client/src/assets/start-logo.png` (used by `client/src/components/game/GameUI.tsx`).

## Committing
All logo assets and scripts are in the `feat/logo-assets` branch locally. Push the branch and open a PR in your remote to share changes:

```powershell
git push -u origin feat/logo-assets
gh pr create --title "feat(logo): add logo assets and UI integration" --body "Adds project logo assets and scripts, updates docs and UI to use PNG logo." --base main
```
