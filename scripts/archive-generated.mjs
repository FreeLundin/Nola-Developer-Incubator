#!/usr/bin/env node
// scripts/archive-generated.mjs
// Archive generated/audit/tmp/log files into an archive directory.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const archiveDir = path.join(repoRoot, 'archive', `generated-2025-12-09`);
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
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', '.cache', 'archive']);

function walk(dir) {
  const results = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    let stat;
    try {
      stat = fs.statSync(full);
    } catch (e) { continue; }
    if (stat.isDirectory()) {
      if (SKIP_DIRS.has(path.basename(full))) continue;
      results.push(...walk(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

function isTrackedByGit(rel) {
  try {
    execSync(`git ls-files --error-unmatch -- "${rel.replace(/"/g, '\\"')}"`, { cwd: repoRoot, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const args = process.argv.slice(2);
const DO_RUN = args.includes('--run');
const VERBOSE = args.includes('--v') || args.includes('--verbose');

if (!DO_RUN) {
  console.log('Dry run: no files will be moved. Use --run to perform the archive.');
}

ensureDirExists(archiveDir);
const allFiles = walk(repoRoot);
const candidates = [];
for (const f of allFiles) {
  const rel = path.relative(repoRoot, f).replace(/\\/g, '/');
  // Skip this script
  if (rel === 'scripts/archive-generated.mjs') continue;
  for (const re of patterns) {
    if (re.test(rel)) {
      candidates.push({ full: f, rel });
      break;
    }
  }
}

if (candidates.length === 0) {
  console.log('No generated files found to archive.');
  process.exit(0);
}

console.log('Found', candidates.length, 'candidates to archive.');
if (VERBOSE) console.log(candidates.map(c => c.rel).join('\n'));

const moved = [];
const gitMoved = [];
for (const c of candidates) {
  const targetRel = path.join('archive', path.basename(archiveDir), c.rel).replace(/\\/g, '/');
  const targetFull = path.join(archiveDir, c.rel);
  ensureDirExists(path.dirname(targetFull));
  if (isTrackedByGit(c.rel)) {
    // Use git mv
    console.log('Tracked:', c.rel, '->', targetRel);
    if (DO_RUN) {
      try {
        execSync(`git mv -- "${c.rel.replace(/"/g, '\\"')}" "${targetRel.replace(/"/g, '\\"')}"`, { cwd: repoRoot, stdio: 'ignore' });
        gitMoved.push(c.rel);
      } catch (e) {
        console.warn('git mv failed for', c.rel, e.message);
      }
    }
  } else {
    console.log('Untracked:', c.rel, '->', targetRel);
    if (DO_RUN) {
      try {
        fs.renameSync(c.full, targetFull);
        moved.push(c.rel);
        // Add new file to git index so it's recorded
        try { execSync(`git add -- "${targetRel.replace(/"/g, '\\"')}"`, { cwd: repoRoot }); } catch {}
      } catch (e) {
        console.warn('move failed for', c.rel, e.message);
      }
    }
  }
}

if (DO_RUN && gitMoved.length > 0) {
  try { execSync('git add -A', { cwd: repoRoot }); } catch {}
  try { execSync('git commit -m "chore(archive): move generated artifacts to archive/generated-2025-12-09"', { cwd: repoRoot, stdio: 'inherit' }); } catch (e) { console.warn('git commit failed:', e.message); }
}

console.log('\nArchive run finished.');
console.log('Git-moved files:', gitMoved.length);
console.log('Moved files (untracked):', moved.length);

if (!DO_RUN) console.log('Dry run complete — rerun with --run to execute.');

