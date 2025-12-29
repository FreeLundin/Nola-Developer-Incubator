#!/usr/bin/env bash
# Archived legacy deploy script (renamed to remove provider name from filename)
# Original commands preserved in archive/vercel/ for full history.
set -e
if ! command -v vercel >/dev/null 2>&1; then
  echo "Legacy provider CLI not found."
  exit 1
fi
# Note: This is preserved for history; do not run in current workflow.

