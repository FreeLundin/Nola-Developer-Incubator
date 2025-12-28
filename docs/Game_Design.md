# Game Design Document (GDD)

## Overview
NDI_MardiGrasParade is a short-session, browser-based 3D arcade game that simulates a Mardi Gras parade. Players move along a parade route and catch collectibles thrown by floats while avoiding obstacles and competing NPCs. The core loop is quick and satisfying: catch items, build combos, unlock cosmetic rewards.

Sessions: 30–120 seconds for most levels.
Target platforms: Desktop and Mobile (iOS / Android browsers).

## Core Systems
- Player movement & input
  - Keyboard (A/D/←/→), mouse, and on-screen joystick for touch.
  - Smooth acceleration, subtle inertia for a pleasing feel.
- Float spawning & collectible throws
  - Floats spawn on lanes at controlled intervals; difficulty increases with level.
  - Collectibles thrown with randomized trajectories and fall arc.
- Collision & catch logic
  - Distance-based catch radius using THREE.Vector3 distance checks.
  - Catch success triggers audio/haptic cue, score increment, and optional VFX.
- NPC competitors
  - Simple AI that moves along lanes and attempts to catch collectibles.
  - Some NPCs are aggressive (steal points) or create obstacles.
- Power-ups & helpers
  - Temporary magnets, helper bots, score multipliers.
- HUD & UX
  - Minimal, unobtrusive HUD by default; optional expanded HUD for debugging.
  - Visual indicator for remaining floats, combo meter, score, lives.

## Controls & UX
- Desktop
  - Keyboard for movement, mouse to interact with UI.
- Mobile (touch)
  - On-screen joystick: simple circular drag area (configurable size/position).
  - Separate catch area for competitors if needed to avoid input conflicts.
- Accessibility
  - Large hit targets for touch, high-contrast HUD, audio toggle, haptic optional.

## Visuals & Art
- Low-poly floats and instanced collectibles to preserve performance.
- Limited texture sizes (<= 2048) and compressed formats where possible.
- Use baked lighting where possible for static props; dynamic lighting for floats and important events.

## Audio & Haptics
- Short audio cues for catches, level complete, and warnings (obstacle spawn).
- Haptic feedback on supported devices for major events (catch, combo, fail).

## Analytics & Backend Integration
- Events to log (session start/stop, level start/complete, reward claimed, purchase, helper spawn).
- Free-tier ready backends supported: Supabase, Firebase, or SQLite-based endpoints.
- Session and cloud-save endpoints should be optional and togglable in development.

## Monetization (Design Notes)
- Cosmetics only (no pay-to-win): skins, particle trails, custom float colors.
- Optional rewarded ads for non-pay players to gain a temporary boost or coins (opt-in only).
- Seasonal bundles and limited-time events to encourage engagement.

## Performance Targets
- Desktop: 60 FPS target.
- Mobile: 45+ FPS target.
- Keep draw calls low, reuse geometry instances, and disable shadows on lower-end devices.

## Acceptance Criteria
- On mobile: joystick is responsive; no input conflicts with catch area.
- Visual remaining-floats indicator shows accurate count and updates in real time.
- Audio toggle works consistently across levels and persists between sessions.
- Build succeeds (`npm run build`) and game runs locally and in preview builds.

## Appendix: Implementation Notes
- Collision: use THREE.Vector3.distanceTo for catch checks.
- Physics: gravity and velocity vectors using THREE.Vector3; apply per-frame updates in `useFrame`.
- Stores: use Zustand stores in `client/src/lib/stores/` for player state and session state.

For implementation details and engineering guidelines, see `docs/PRODUCT_BACKLOG.md` for prioritized tickets and `docs/TICKET_TEMPLATE.md` for ticket structure.
