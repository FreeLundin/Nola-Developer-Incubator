# Ticket: Improve mobile joystick & separate catch area

Priority: P0
Estimate: 5d

## Summary
Refine the on-screen joystick for mobile and tablet: ensure multi-touch support, separate the catch area (tap-to-catch) from the joystick region to avoid gesture conflicts, and improve visual affordances for accuracy and accessibility.

## Goals
- Joystick supports simultaneous pointer inputs (multi-touch) without interfering with catch interactions.
- Catch area is clearly separated; user can tap/click to attempt catches without moving the joystick.
- Visual indicators and hitboxes are adjusted for accessibility and consistency across devices.
- UX tests pass on iOS Safari, modern Android browsers, and desktop touch emulation.

## Acceptance Criteria
- Joystick responds to pointer/touch input and allows other touch inputs (taps) to be recognized independently.
- Catch interactions reliably trigger when tapping or clicking within the catch zone and do not move the joystick unless intentionally touched.
- Visual indicator shows remaining floats and basic catch feedback (success/fail) within 100ms of event.
- Automated Playwright smoke test verifies joystick toggle in settings and that the joystick element appears on screen when enabled.

## Subtasks
- [ ] Review `TouchControls.tsx` and `GameUI.tsx` to identify current input overlap issues (0.5d)
- [ ] Implement distinct DOM regions for joystick and catch area; ensure pointer events do not propagate across regions (1.5d)
- [ ] Add accessibility improvements: larger touch targets, clear affordance, optional vibration hooks (0.5d)
- [ ] Add visual remaining floats indicator (1d)
- [ ] QA: test on iOS, Android, and desktop emulation and mark pass/fail (1d)
- [ ] Add Playwright smoke test and wire to CI (0.5d)

## Notes & Implementation Hints
- Use pointer events and pointer capture APIs to manage touch/mouse input cleanly.
- Consider using a layered DOM where the joystick is a separate compositing layer to avoid repaint jank.
- Add `data-testid` attributes for the joystick and catch areas so tests can select them reliably.

## Related files
- `client/src/components/game/TouchControls.tsx`
- `client/src/components/game/GameUI.tsx`
- `client/src/lib/stores/useParadeGame.ts`

---

Created as part of initial backlog expansion on 2025-12-28.
