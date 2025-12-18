# Admin UI & Bot Configuration

This page explains how the in-game admin UI works and how to modify bot names locally for testing.

Runtime config
- `bots.override.json` (optional) — contains runtime overrides for bot display names and persona metadata.

In-game Admin Modal
- Found under `client/src/components/ui/AdminModal.tsx`.
- Allows local edits to bot display names which are applied immediately via the `bots:updated` event.

Making bot names reactive
- `CompetitorBot` displays `displayName` sourced from the runtime store. Updates to the store are reactive and update the HUD immediately.

Quick debug
- Open browser console and dispatch `window.dispatchEvent(new Event('bots:updated'))` after changing `bots.override.json` (if the UI uses file watch) or use the Admin modal to apply changes.

If you need an admin-only route or encrypted local storage for the admin UI, I can add a small feature that persists edits to localStorage with a clear "apply" button.

---
