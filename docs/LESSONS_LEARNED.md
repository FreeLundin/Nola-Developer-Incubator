# Lessons Learned — Mardi Gras Parade Simulator

Date: 2025-12-08

Summary
- Stabilized dev flow by preventing dev server process exits on transform errors and serving static assets reliably.
- Implemented defensive texture loading and a dev low-detail profile to avoid WebGL context losses.
- Added headless test tooling and CI scaffolding to detect regressions early.

Key takeaways
- Always guard external resource loading (textures/models): runtime failure of a single asset can terminate rendering or crash the scene.
- Keep dev defaults conservative: disable expensive shadows, reduce draw counts and DPR in development to make iteration reliable across contributor machines.
- Add small in-page debugging utilities (global error overlay, WebGL context guard) to surface errors for fast triage.
- Automate a smoke test in CI that waits for a `/health` endpoint before running headless tests — it reduces flakes.

Immediate best practices
- Use compressed textures (WebP/AVIF) and provide low-res placeholders.
- Use instancing for repeated geometry like crowds.
- Use a small, fast headless test in CI (Puppeteer or Playwright) and upload artifacts for debugging.

Follow-ups
- Add a CI policy to require smoke test passing before merging bigger changes.
- Audit and compress large assets; add an asset budget and automated check in CI.

This file is a living summary — update it when new patterns are discovered or when the CI process evolves.
