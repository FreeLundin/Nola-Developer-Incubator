# Project Optimizations & Improvements (Quick Win Checklist)

Date: 2025-12-09

This doc describes quick, high-value optimizations for the project tailored to the current tech stack (React, R3F, Three.js, Howler, Vite, Playwright).

1. Build & CI
- Add Playwright CI (PR) to run critical E2E checks. (.github/workflows/playwright-ci.yml added).
- Use `npm ci` in CI instead of `npm install` to ensure deterministic installs.

2. Dev experience
- Add `.editorconfig` to standardize line endings and indent size.
- Add `README.md` instructions for asset import and logo generation (done).

3. Performance
- Use image assets in `docs/icons/` and integrate compressed delivery for production. Use `sharp` or `pngquant` to compress.
- Use `r3f` instancing & pooled objects (already used in Environment via `InstancedMesh`). Review heavy meshes for LOD.
- Disable shadows and high map sizes in dev mode (`import.meta.env.DEV` toggle implemented).

4. Audio
- Use Howler for reliable audio; ensure `unlockAudio()` is called on user gesture (Enable Audio button exists).
- Add small test harness in Playwright to click Enable Audio and assert `window.__audioUnlocked` is set.

5. Code hygiene
- Run `npx eslint --fix` and `npm run check` pre-commit (add Husky if desired).
- Remove console.logs in production builds; use a small debug logger that can be disabled.

6. Asset pipeline
- `scripts/import-logo.js` and `scripts/generate-logo-sizes.mjs` automate logo and icon generation.
- Add an `npm run assets:gen` script alias that runs the scripts (recommended).

7. Packaging & Security
- Prefer Stripe Checkout for payments and keep webhook verification on server.
- Use environment variables and never commit secrets.

8. Next steps (medium effort)
- Add Lighthouse or PageSpeed CI step.
- Add bundle analysis in build step (vite-bundle-analyzer).
- Add optional PM2/pm2-dev startup scripts for CI acceptance tests where needed.


