# Product Backlog — Mardi Gras Parade Simulator

This file lists prioritized work items related to public playtests, CI, and documentation.

1. Public playtest visibility
   - Add prominent Public Playtest section to README with Project Lead (Done)
   - Add confirm helper to show/copy/open the public URL (Done)
   - Automate README insertion of current public URL (script added)
   - Ensure `docs/launch.html` is the canonical quick link for testers (Done)

2. CI and testing
   - Add GitHub Actions workflow to run Playwright on PRs using localtunnel (Done)
   - Ensure Playwright tests read PUBLIC_URL env var (Done)
   - Capture logs and artifacts for debugging (Done)

3. Persistent hosting
   - Create Cloudflare tunnel + DNS mapping helper
   - Optionally reserve a stable hostname (e.g., play.mardigras.example.com)

4. UX / Game
   - Ensure bot names are configurable and reactive
   - Fix audio playback issues using Howler.js (ensure user gesture unlock flow)
   - HUD persona labels toggle for debugging

5. Docs & Governance
   - Update DESIGNER_WORKFLOW.md and TECHNICAL_DOCUMENTATION.md to include playtest instructions (Updated)
   - Add release notes and single date-stamped summary of changes (TODO)

6. Clean up & polish
   - Remove unused assets and fix texture errors
   - Fix Hook render errors (Rendered more hooks than during the previous render.)

---

Notes:
- This backlog file is intended as a short, actionable list for the current sprint.
- Move completed items to a changelog or release notes entry when merged.
