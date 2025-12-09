# Archive: generated-2025-12-09

This folder contains generated artifacts that were moved out of the main repository tree to keep the working tree clean while preserving the files for later inspection.

Location
- `archive/generated-2025-12-09/`

Why these files were archived
- They are generated outputs (npm audit reports, test/run logs, temporary playtest files, tsc outputs, and a backup zip) that clutter commits and diffs.
- Keeping them in the main tree caused accidental commits and increased noise in PRs; archiving preserves the data without polluting ongoing development.

What was moved (examples — exact list is in the commit that created the archive)
- `npm-audit*.json` and `audit*.json`
- `playwright-run-output.txt`, `headless-run-output.txt`, `tsc-output.txt`, `repair-*.txt`
- `tmp_*` and playtest HTML/TSX files
- `backup-20251208-125948.zip`

How to inspect archived files
- From the repo root (PowerShell / terminal):

```powershell
# List archived files
ls -Recurse archive/generated-2025-12-09

# Show a specific file
type archive/generated-2025-12-09/npm-audit-report.json
```

How to restore archived files (if needed)
- To restore a single file using git (recommended so the move is recorded):

```powershell
# Example: restore audit.json from archive back to repo root
git mv archive/generated-2025-12-09/audit.json audit.json
git commit -m "chore(restore): put audit.json back from archive"
```

- To restore many files interactively, you can move them with `git mv` in a loop or use the provided script as a reference.

About the archive script
- A helper script was added: `scripts/archive-generated.mjs` (dry-run by default).
  - Dry-run: `node scripts/archive-generated.mjs --verbose`
  - Execute archive: `node scripts/archive-generated.mjs --run --verbose`

Notes and recommendations
- The archive is intentionally left in the repo to preserve historical artifacts for audits or debugging. If you'd prefer to keep these artifacts outside the repo, consider compressing the folder and storing it in external storage (S3, Google Drive) and removing it from the repo.
- `.gitignore` has been updated to ignore future generated artifacts so they won't be committed again.

If you want me to compress the archive and replace the folder with a single zip file, or remove it from the repo and push the zip to an external store, tell me and I'll implement that next.

