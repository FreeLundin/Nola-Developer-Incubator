#!/usr/bin/env bash
# Archived copy of scripts/deploy-vercel.sh
# Original: scripts/deploy-vercel.sh
set -e
if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI not found. Install with: npm i -g vercel"
  exit 1
fi
vercel --prod

