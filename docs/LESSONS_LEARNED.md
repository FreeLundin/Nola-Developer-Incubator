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

## 2025-12-09 — Runtime/Interface defaults audit and minor fixes

Summary
- Ran a repo-wide audit for function implementations that use default parameter initializers in signatures where the corresponding interface declares the method without defaults (pattern: interface contract must not rely on implementation defaults).
- Goal: avoid situations where an interface says `addCollectible(collectible: Collectible): void` but the implementation uses `addCollectible(collectible: Collectible = defaultCollectible) => {}` which changes the runtime contract and can mislead callers and type-checkers.

What I did
- Scanned `client/src/lib/stores` and related code for implementations that use parameter defaults in signatures.
- Confirmed the `ParadeGameState` interface methods do not include default parameter initializers. Implementations in `useParadeGame.tsx` follow the safe pattern (no `param = default` in signatures).
- Where applicable earlier in this session, store method signatures were tightened to avoid implicit `any` and to match interface types (e.g., `addCatch` typed as optional second parameter rather than providing a default in the interface).
- No occurrences were found that required automatic rewrites; therefore no mass changes were necessary.

Takeaways / recommended practice
- Keep interface method signatures declarative (no default parameter values). If you want defaults, apply them inside the function body using `const safeParam = providedParam ?? defaultValue;`.
- Prefer explicit parameter types in interfaces and implementations (avoid implicit any) to satisfy strict TypeScript settings.
- Add a small code search or an ESLint rule to flag `=(.*)` inside parameter lists for store/contract implementations if you want automated enforcement.

Next steps
- Optionally add a lightweight lint rule or a pre-commit grep check that fails when `functionName(param: Type =` is detected within `client/src/lib/stores` to prevent regressions.
- Continue updating the lessons log as we find other cross-cutting patterns.
