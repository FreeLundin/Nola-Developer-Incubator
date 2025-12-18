Status — 2025-12-18

- Public playtest URL: https://mardigrasparadesim2026.busaradigitalstrategy.com (configured via Cloudflare tunnel)
- Server: graceful shutdown implemented (see `server/index.ts`)
- Playtest: health endpoint is available at `/health`
- Bot runtime override: `bots.override.json` at project root is read by the client via `/bots.override.json` route and applied at game start or when `bots:updated` is dispatched.

Quick verification checklist (run now)
1. Start dev server: `npm run dev`
2. Verify health: `curl http://localhost:5000/health` -> expect `{ "status": "ok" }`
3. Open browser to http://localhost:5000 and Start Game. Verify competitor HUD shows friendly bot names (e.g. "King Rex") instead of generic ids.
4. Edit `bots.override.json` and trigger live reload in the page by running in console: `fetch('/bots.override.json').then(()=>window.dispatchEvent(new Event('bots:updated')))`
5. Confirm in-game HUD and in-world bot labels update immediately to reflect changes.

Next actions
- Add Howler.js integration and test audio unlocking behavior
- Add Playwright test to assert bot names and audio playback
- Add admin in-game UI to edit bot names persistently (local only)
