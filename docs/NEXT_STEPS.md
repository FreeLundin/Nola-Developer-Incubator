# Next Steps — Visual Quality & Playability Roadmap

Date: 2025-12-08

Goal: Improve the visual fidelity and playability of the Mardi Gras Parade Simulator while keeping performance stable across desktop and mobile devices.

Milestone 1 — Immediate stability & polish (1-2 days)
- Make the default dev profile low-detail to prevent WebGL context loss (already implemented).
- Replace fallback textures with optimized compressed formats (e.g., WebP/AVIF) and add simple low-res fallbacks.
- Audit and fix any console errors found during headless smoke tests (texture load, missing assets).
- Add a visible FPS counter in dev (R3F Perf) for quick performance checks.

Milestone 2 — Visual improvements (2-4 days)
- Use instancing for crowd silhouettes and repeated geometry to reduce draw calls.
- Add baked ambient occlusion and lightmap textures for static objects (buildings, curbs) where appropriate.
- Implement LOD (level of detail) switching for floats and collectible models.
- Improve materials: use optimized PBR maps (albedo, roughness, normal) and proper mipmaps.

Milestone 3 — Playability & UX (2-4 days)
- Refine player input (tune move speed, smoothing, deadzones for joystick) and test on mobile.
- Improve tutorial and HUD clarity: concise instructions, visual callouts for first-time players.
- Add accessibility options: toggle large UI, high contrast, reduce motion.
- Implement better camera framing and dynamic adjustments for different aspect ratios.

Milestone 4 — Automation & testing (1-2 days)
- Add Playwright cross-browser smoke tests in CI (with caching for browsers) to avoid flaky installs.
- Add nightly or scheduled jobs to run the smoke test and upload artifacts.
- Add an automated performance budget check (fail CI if FPS < target or assets exceed budgets).

Milestone 5 — Release polish
- Create an optimized production asset pipeline (texture compression, LQ/HD build variants).
- Finalize onboarding/tutorial flow and record a short demo video for release notes.

Owners & Estimates
- Visual improvements: 2-4 days
- Playability & UX: 2-4 days
- CI & automation: 1-2 days

Notes
- Prioritize instancing and LOD first — they provide large FPS gains with relatively small code changes.
- Use device emulation and a small set of physical test devices for validation.
