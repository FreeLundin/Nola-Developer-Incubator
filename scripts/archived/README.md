# Archived Cloudflare artifacts

This folder documents Cloudflare / cloudflared artifacts that were present in the repository and why they were removed.

Files to consider manually archiving or deleting (not removed automatically):

- `scripts/cloudflared.exe` - Binary for cloudflared (large; OS-specific). Remove if you no longer need it.
- `scripts/cloudflared.log`, `scripts/cloudflared_run.log`, `scripts/cloudflared_automation.log` - Log files created by previous runs. Safe to delete.

Why not delete binaries automatically?
- Binaries may be large and platform-specific. They are left for maintainers to remove intentionally.

How to remove:
- Delete the files from the `scripts/` directory or move them to a separate backup archive before removing.

If you need to restore tunnel support:
- Retrieve the original scripts from git history (e.g., `git checkout <commit> -- scripts/setup-cloudflare-tunnel.ps1`) or see project history for the exact steps.

Commit message suggestion when deleting these files:
`chore(deploy): remove archived cloudflared binary and logs`

---

Archived on: 2025-12-19
Archive commit: 5563321

Files moved to: `scripts/archived/binbackup/`

If this archive needs to be reverted, restore files from git history or from `scripts/archived/binbackup/` and update the scripts accordingly.

# Archived: scripts/archived/README.md

This README has been archived. The canonical documentation and playtest link are in the top-level `README.md`.

See: ../.. /README.md
