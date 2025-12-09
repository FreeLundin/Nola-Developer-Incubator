#!/usr/bin/env node
// scripts/cleanup-generated.mjs
// Safely remove generated/audit/tmp/log files used in development
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Determine repo root reliably across platforms
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Regex-based patterns to match relative paths (safer than substring matches)
const patterns = [
  /^npm-audit/i,
  /^audit(?:_|\b)/i,
  /^backup-/i,
  /^tmp_/i,
  /^tmp/i,
  /tsc-output\.txt$/i,
  /playwright-run-output\.txt$/i,
  /headless-run-output\.txt$/i,
  /dev-log\.txt$/i,
  /dev-foreground\.txt$/i,
  /dev-err\.txt$/i,
  /repair-output\.txt$/i,
  /repair-install-output\.txt$/i,
  /docs\/GAME_DESIGN_summary\.txt$/i,
  /\.run-output\.txt$/i
];

// Directories to skip while walking the repo
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', '.cache']);

function walk(dir) {
  const results = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    let stat;
    try {
      stat = fs.statSync(full);
    } catch (e) {
      continue;
    }
    if (stat.isDirectory()) {
      const base = path.basename(full);
      if (SKIP_DIRS.has(base)) continue;
      results.push(...walk(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

function isTrackedByGit(relPath) {
  try {
    execSync(`git ls-files --error-unmatch -- "${relPath.replace(/"/g, '\\"')}"`, { stdio: 'ignore', cwd: repoRoot });
    return true;
  } catch {
    return false;
  }
}

// CLI flags
const args = process.argv.slice(2);
const DRY_RUN = !args.includes('--run');
const ALLOW_GIT_REMOVE = args.includes('--git');
const VERBOSE = args.includes('--v') || args.includes('--verbose');

if (VERBOSE) console.log(`Repo root: ${repoRoot}`);

const files = walk(repoRoot);
const toDelete = [];
const tracked = [];

for (const f of files) {
  const rel = path.relative(repoRoot, f).replace(/\\/g, '/');
  // Skip the script itself and .gitignore/package.json etc
  if (rel === 'scripts/cleanup-generated.mjs') continue;
  // Match patterns
  for (const re of patterns) {
    if (re.test(rel)) {
      if (isTrackedByGit(rel)) tracked.push({ full: f, rel });
      else toDelete.push({ full: f, rel });
      break;
    }
  }
}

if (toDelete.length === 0 && tracked.length === 0) {
  console.log('No generated files found to remove.');
  process.exit(0);
}

console.log('\nCandidates found:');
if (toDelete.length) {
  console.log('\nUntracked files (safe to delete):');
  for (const t of toDelete) console.log('  ', t.rel);
}
if (tracked.length) {
  console.log('\nTracked files (git-controlled):');
  for (const t of tracked) console.log('  ', t.rel);
}

if (DRY_RUN) {
  console.log('\nDry run (no deletions performed). To actually delete untracked files, run:');
  console.log('  node scripts/cleanup-generated.mjs --run');
  console.log('To remove tracked files via git, add --git (use with caution):');
  console.log('  node scripts/cleanup-generated.mjs --run --git');
  process.exit(0);
}

// Perform deletions
for (const t of toDelete) {
  try {
    fs.unlinkSync(t.full);
    console.log('Deleted:', t.rel);
  } catch (e) {
    console.warn('Failed to delete:', t.rel, e.message);
  }
}

if (tracked.length && ALLOW_GIT_REMOVE) {
  for (const t of tracked) {
    try {
      execSync(`git rm -q -- "${t.rel.replace(/"/g, '\\"')}"`, { cwd: repoRoot });
      console.log('git rm:', t.rel);
    } catch (e) {
      console.warn('Failed to git rm:', t.rel, e.message);
    }
  }
  try {
    execSync('git commit -m "chore(clean): remove generated artifacts (git)"', { cwd: repoRoot, stdio: 'inherit' });
  } catch (e) {
    console.warn('Git commit failed or nothing to commit.');
  }
} else if (tracked.length) {
  console.log('\nTracked files were listed but not removed. To remove them via git, re-run with --run --git');
}

console.log('\nCleanup finished.');
