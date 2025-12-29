# Ticket Template

Use this template to create issues for backlog items.

## Title
Short descriptive title (e.g., "Improve mobile joystick responsiveness")

## Description
- What: Clear description of the change
- Why: User impact / motivation
- Where: Files, components, or systems affected

## Acceptance Criteria
- [ ] AC1 — Behavior is implemented and verified
- [ ] AC2 — No regressions in related systems
- [ ] AC3 — Unit/E2E tests added (if applicable)

## Implementation Notes
- Suggested files to modify or create
- Suggested approach and tradeoffs

## Estimates
- Story points: 
- Timebox: 

## QA Steps
1. Manual steps to reproduce and verify
2. Devices to test on (iOS Safari, Android Chrome, etc.)

## Playwright skeleton
- Path: `tests/playwright/<feature>.spec.ts`
- Example test cases:
  - open page, enable joystick, move the joystick, assert player moved
  - multi-touch test: simulate two concurrent inputs and assert no crash

## Related
- Backlog ID: PB-001
- Design doc: docs/Game_Design.md

