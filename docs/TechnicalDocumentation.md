# Technical Documentation (Overview)

This page summarizes the project's architecture and points to key files.

Architecture
- Client: React + TypeScript + React Three Fiber (3D)
  - Entry: `client/src/main.tsx`
  - Game components: `client/src/components/game/`
  - Stores: `client/src/lib/stores/`
- Server: Express + TypeScript
  - Entry: `server/index.ts`
  - Routes: `server/routes.ts`
- Shared: `shared/schema.ts` (Drizzle ORM schema)

Audio
- Howler.js is used for robust audio playback: `howler` dependency is already added.
- See `wiki/Audio.md` for playback and unlock flow details.

Bot config & Admin
- Runtime bot override is stored in `bots.override.json` (see `client/src/lib/useBotsConfig.ts`)
- In-game Admin UI: `client/src/components/ui/AdminModal.tsx` (wires to store and emits `bots:updated` event)

CI & Playwright
- Playwright tests: `tests/playwright` and `npm run test:playwright` to run tests.
- GitHub Actions workflow to run Playwright on PRs: `.github/workflows/playwright.yml` (exists or to be added)

Storage & Database
- Storage abstraction: `server/storage.ts` (IStorage interface)
- Drizzle schema: `shared/schema.ts`

Dev commands
- `npm run dev` - start dev server
- `npm run check` - TypeScript check
- `npm run qr` - generate QR for mobile testing

If you want, I can populate more detailed sub-pages (stores, audio flow, R3F patterns) under `wiki/`.

---
