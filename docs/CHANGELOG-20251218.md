# Changelog — 2025-12-18

Summary
- Implemented hardened graceful shutdown for the Express server.
- Tracks and destroys open sockets on shutdown to avoid hanging connections.
- Exposed a startServer() helper that returns a shutdown() function for pm2/test automation.
- Improved shutdown timeouts and logging.

Files changed
- server/index.ts — replaced inline startup with exported `startServer()` helper; added socket tracking and robust shutdown behavior.
- server/routes.ts — small cleanup (return created server directly).

Why
- Prevents the public tunnel or process manager (pm2/cloudflared) from hanging during restarts.
- Makes CI and Playwright test flows more reliable by allowing programmatic shutdown.

How to test locally
1. Start dev server: `npm run dev` (or `node dist/server/index.js` on production build).
2. Visit health endpoint: `curl http://localhost:5000/health` should return `{ "status": "ok" }`.
3. Stop server with Ctrl+C (SIGINT) and observe logs: server should report shutdown initiated and then server closed gracefully.
4. For programmatic shutdown (tests/pm2), require the module and call `startServer()` then call the returned `shutdown()`.

Notes
- This change is development-friendly: signal handlers are only attached when the server module is executed directly, so tests that `import` the module won't get duplicate listeners.
- Timeout values are conservative; adjust as needed for heavy-load environments.


