#!/usr/bin/env bash
set -e
if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI not found. Install with: npm i -g vercel"
  exit 1
fi
# Use Vercel CLI to deploy production
vercel --prod
