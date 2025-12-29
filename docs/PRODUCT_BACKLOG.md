# PRODUCT_BACKLOG — NDI_MardiGrasParade

Version: 0.1
Date: 2025-12-28

This backlog is a prioritized list of features, bugs, and chores for upcoming sprints. Use this as the single source of truth for short-term planning and sprint selection.

## Backlog Table
| Priority | Type | Item | Estimate | Notes |
|---|---|---|---:|---|
| P0 | Feature | Improve mobile joystick & separate catch area | 5d | Includes multi-touch fixes and UX testing on iOS/Android |
| P0 | Bug | Fix audio toggle persistence/inconsistency | 1d | Ensure persistence across reloads and iOS audio quirks |
| P0 | Feature | Session tracking & cloud save (free-tier) | 4d | Implement simple backend (Supabase or SQLite) and save/load endpoints |
| P1 | Feature | Analytics event logging (session/level/collect) | 3d | Hook into mock backend and add opt-out in settings |
| P1 | Perf | Reduce draw calls & add instancing for collectibles | 3d | Use R3F instancing where appropriate |
| P1 | Feature | Visual indicator for remaining floats | 2d | UI: compact progress bar or counter in HUD |
| P1 | Feature | Increased early-level float spawn rate & rewards | 2d | Adjust level configs and add beginner rewards |
| P2 | Feature | Cosmetic shop MVP (UI only) | 3d | No payment plumbing; mock purchases and inventory |
| P2 | Feature | AdReward flow integration (opt-in) | 4d | Use AdRewardScreen component as hook; mock provider for tests |
| P2 | Feature | Leaderboards (basic) | 5d | Server-side simple leaderboard with top-N scores |
| P3 | Chore | Add Playwright E2E tests for main flows | 4d | Automate start, play, catch, and finish flows |
| P3 | Chore | Improve README and onboarding docs | 1d | Expand quick start and developer notes |

## Sprint Candidates (2-week sprint suggestions)
- Sprint A (2w) — Controls & Stability (P0 + P1)
  - Improve joystick & separate catch area (P0)
  - Fix audio toggle (P0)
  - Visual remaining floats indicator (P1)
  - Analytics events for session start/stop (P1)

- Sprint B (2w) — Backend & Persistence (P0 + P2)
  - Session tracking & cloud save (P0)
  - Cosmetic shop UI (P2)
  - Mock AdReward flow (P2)

- Sprint C (2w) — Performance & Content (P1)
  - Reduce draw calls & instancing (P1)
  - Add new float types and early-level rewards (P1)
  - Start basic leaderboards (P2)

## Definition of Done (per backlog item)
- Code compiles (`npm run check`), unit/CI tests pass (where applicable), and manual QA passes on desktop & mobile.
- PR includes clear description, testing notes, and links to any updated docs or design artifacts.
- Back-end changes include migration scripts where needed and a rollback plan.

## Notes
- Estimates are rough and assume 2-person devs; adjust during sprint planning.
- Prioritize P0 items; keep P2+ items gated behind user-feedback and analytics signals.

---

If you'd like, I can now:
- Commit these docs to a branch and open a PR to trigger the preview workflow and produce a preview URL.
- Expand any backlog item into a ticket template or Playwright test skeleton.

# Product Backlog

This backlog organizes work into prioritized items for the next milestones. Each row includes: ID, Title, Priority, Estimate (story points), Owner, and Status.

| ID | Title | Priority | Estimate | Owner | Status |
|----|-------|----------|----------|-------|--------|
| PB-001 | Mobile & Desktop Joystick Improvements | P0 | 8 | Eng-A | In Progress |
| PB-002 | Minimal HUD / Compact UI Mode | P0 | 5 | Eng-B | To Do |
| PB-003 | Audio toggle persistence bugfix | P0 | 2 | Eng-A | To Do |
| PB-004 | Session analytics & cloud save (Supabase) | P0 | 13 | Eng-C | To Do |
| PB-005 | Visual remaining floats indicator | P1 | 3 | Eng-B | To Do |
| PB-006 | Helper bot spawn on combo/purchase | P1 | 5 | Eng-A | To Do |
| PB-007 | Leaderboard MVP (serverless) | P2 | 8 | Eng-C | Backlog |
| PB-008 | Monetization plumbing (shop UI) | P2 | 13 | Eng-PM | Backlog |

## Backlog Item — Expanded Example (PB-001)

Title: Mobile & Desktop Joystick Improvements

Description:
- Make joystick responsive across common mobile browsers.
- Separate competitor catch area from joystick when on mobile to avoid accidental input conflicts.
- Improve visual affordance and hit targets for accessibility.

Acceptance criteria:
- Joystick area size is configurable and defaults to 120px for small mobile screens.
- Joystick supports multi-touch and does not capture unrelated gestures (e.g., page scroll).
- No regressions in desktop keyboard/mouse input.

Implementation notes:
- Use pointer events and `touch-action` CSS hints.
- Extract joystick into `client/src/components/ui/Joystick.tsx` if not already separated.
- Add unit/Playwright tests for basic movement and multi-touch behavior.

Test/QA tasks:
- Manual: Test on iOS Safari, Android Chrome, and desktop Chrome/Firefox.
- Automated: Playwright skeleton test added in `tests/playwright/joystick.spec.ts` (placeholder).

## Sprint Planning (example)
Sprint goal: Ship joystick and minimal HUD improvements.
Sprint length: 2 weeks
Team: 2 engineers, 1 designer

Planned items for Sprint:
- PB-001 Joystick improvements (8 points)
- PB-002 Minimal HUD (5 points)
- PB-003 Audio toggle persistence (2 points)
- PB-005 Remaining floats indicator (3 points)

Total estimate: 18 points (fits 2-engineer cadence)

## Ticket linking & templates
Use the `docs/TICKET_TEMPLATE.md` for ticket content and acceptance criteria.
