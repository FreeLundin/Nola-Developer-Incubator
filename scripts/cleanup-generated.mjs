#!/usr/bin/env node
// scripts/cleanup-generated.mjs
// Safely remove generated/audit/tmp/log files used in development
import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(new URL(import.meta.url).pathname.replace(/\/scripts\/cleanup-generated.mjs$/, ''));
const patterns = [
  'npm-audit',
  'audit',
  'backup-',
  'tmp_',
  'tmp',
  'tsc-output.txt',
  'playwright-run-output.txt',
  'headless-run-output.txt',
  'dev-log.txt',
  'dev-foreground.txt',
  'dev-err.txt',
  'repair-output.txt',
  'repair-install-output.txt',
  'docs/GAME_DESIGN_summary.txt'
];

function walk(dir) {
  const results = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    try {
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        results.push(...walk(full));
      } else {
        results.push(full);
      }
    } catch (e) {
      // ignore permission errors
    }
  }
  return results;
}

const files = walk(repoRoot);
const removed = [];
for (const f of files) {
  const rel = path.relative(repoRoot, f).replace(/\\/g, '/');
  for (const p of patterns) {
    if (rel.includes(p)) {
      try {
        fs.unlinkSync(f);
        console.log('Removed', rel);
        removed.push(rel);
      } catch (e) {
        // ignore
      }
      break;
    }
  }
}

if (removed.length === 0) {
  console.log('No generated files found to remove.');
} else {
  console.log('\nCleanup complete. Removed files:');
  console.log(removed.join('\n'));
}

