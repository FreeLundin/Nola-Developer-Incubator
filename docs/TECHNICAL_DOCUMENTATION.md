# Technical Documentation

Date: 2025-12-09

This document provides an in-depth technical overview of the Mardi Gras Parade Simulator codebase, architecture, key systems, and developer workflows.

Table of contents
- Project overview
- Key folders & files
- State management (Zustand stores)
- Audio subsystem (Howler integration)
- Bot configuration & runtime overrides
- Testing & CI (Playwright + GitHub Actions)
- Dev commands and env
- Troubleshooting & common issues

Project overview
- Frontend: React + TypeScript + React Three Fiber (R3F) for 3D rendering
- Backend: Express.js (TypeScript) — lightweight API and health endpoint
- Shared: Drizzle ORM schema (`shared/schema.ts`) for future DB needs

Key folders & files
- `client/` — React frontend (source entry `client/src/main.tsx`)
  - `client/src/components/game/` — game screens, scene, UI, and components
  - `client/src/lib/stores/` — Zustand stores (game state, audio)
  - `client/src/config/bots.json` — bundled bot definitions (id, name, persona, color, startX, startZ, minLevel)
  - `client/public/` — static assets (textures, models, sounds)
- `server/` — Express backend
- `docs/` — project documentation (this folder)

State management (Zustand)
- `useParadeGame` (client/src/lib/stores/useParadeGame.tsx)
  - Central game store: `phase`, `score`, `level`, `collectibles`, `botScores`, `aggressiveNPCs`, power-ups, etc.
  - Key actions: `startGame`, `addCatch`, `addCollectible`, `claimCollectible`, `addBotCatch`.
  - `setBotScoresFromConfig()` added to reload bot list from runtime config (localStorage override or bundled JSON).
- `useAudio` (client/src/lib/stores/useAudio.tsx)
  - Howler-backed store with `setHowls`, `toggleMute`, `playHit`, `playSuccess`, `playFireworks`, `unlockAudio`.
  - `unlockAudio()` resumes the Howler audio context and sets a debug flag `window.__audioUnlocked` to help automated tests.

Audio subsystem
- Implemented with Howler.js for robust playback and mixing.
- `AudioManager` component (`client/src/components/game/AudioManager.tsx`) creates Howl instances for background, hit SFX, and success SFX, registers them in the `useAudio` store, and handles playback based on `phase` and `isMuted`.
- Browser autoplay policies handled by: visible `Enable Audio` button on tutorial overlay and `unlockAudio()` that resumes the audio context.

Bot configuration & runtime overrides
- Bundled definitions: `client/src/config/bots.json` (id, name, persona, color, startX, startZ, minLevel)
- Runtime loader hook: `useBotsConfig` (client/src/lib/hooks/useBotsConfig.ts)
  - Returns runtime bot list, preferring `localStorage['bots.override']` if present.
  - Listens for `bots:updated` event to hot-reload the config.
- Local admin UI: `client/src/components/game/BotAdmin.tsx` saves `bots.override` to localStorage and dispatches `bots:updated`.
- Rendering: `GameScene` reads `useBotsConfig().bots` to instantiate `CompetitorBot` components; `CompetitorBot` reads runtime metadata for reactive display names.

Testing & CI
- Playwright tests: `tests/playwright/audio-bots.spec.ts` — click Enable Audio, start game, assert audio unlocked flag and bot names in HUD.
- QR helper: `scripts/generate-qr.mjs` and `npm run qr` to generate an ASCII QR and `docs/browser-qr.svg` for mobile testing.
- GitHub Actions CI: `.github/workflows/playwright.yml` — runs on pull requests, starts dev server under pm2, waits for readiness, runs Playwright, captures pm2 logs and uploads them.

Dev commands & env
- `npm run dev` — start dev server (Express + Vite/R3F dev mode in this setup)
- `npm run build` — build client & server for production
- `npm start` — start production server
- `npm run check` — run TypeScript check
- `npm run qr` — generate QR for mobile testing
- Recommended env vars: `PORT=5000` (server), `DATABASE_URL` for DB if needed

Troubleshooting
- Audio not playing: use tutorial `Enable Audio` and check `window.__audioUnlocked` in browser console. Also ensure browser tab has focus and that the page received a user gesture.
- Hot reload of bot names: Save in Admin; if UI doesn't reflect immediately, click HUD → Reload config. The runtime hook listens for `bots:updated`.
- Playwright CI failures: check `pm2` logs attached as artifacts (workflow uploads `pm2-nola-dev.log`).

Contact & contribution notes
- For code changes, open PRs against `main` and follow conventional commit format. See `docs/CONTRIBUTING.md` for details.


