#!/usr/bin/env node
// finalize-release.cjs
// After a release PR is merged, this script tags and creates a GitHub Release for the merged version.

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

function run(cmd) { return execSync(cmd, { stdio: 'pipe' }).toString().trim(); }
function safeRun(cmd) { try { return run(cmd); } catch (e) { return null; } }

const repoRoot = path.resolve(__dirname, '..');
process.chdir(repoRoot);

// Read version
const pkgPath = path.resolve(repoRoot, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;
if (!version) { console.error('No version in package.json'); process.exit(1); }

console.log('Finalize release for', version);

// Ensure we are up-to-date on main
run('git fetch origin main --depth=1');
run('git checkout main');
run('git reset --hard origin/main');

// Create tag if missing
const tag = `v${version}`;
const existing = safeRun(`git tag -l ${tag}`);
if (existing && existing.trim() !== '') {
  console.log('Tag already exists:', tag);
} else {
  run(`git tag -a ${tag} -m "Release ${version}"`);
  console.log('Created tag', tag);
}

// Push tag
run(`git push origin ${tag}`);
console.log('Pushed tag', tag);

// Create GitHub release via API if token provided
const ghToken = process.env.GITHUB_TOKEN;
const ghRepo = process.env.GITHUB_REPOSITORY;
if (ghToken && ghRepo) {
  const [owner, repo] = ghRepo.split('/');
  const releaseBody = `Automated release for ${version}. See changes in PRs and docs/RELEASES.md`;
  const cmd = `curl -s -X POST -H \"Authorization: token ${ghToken}\" -H \"Accept: application/vnd.github+json\" https://api.github.com/repos/${owner}/${repo}/releases -d \"{\\\"tag_name\\\":\\\"${tag}\\\",\\\"name\\\":\\\"${tag}\\\",\\\"body\\\":\\\"${releaseBody}\\\",\\\"draft\\\":false,\\\"prerelease\\\":false}\"`;
  const res = run(cmd);
  console.log('GitHub release response (truncated):', res.substring(0,300));
} else {
  console.warn('Missing GITHUB_TOKEN/GITHUB_REPOSITORY; skipping GitHub release creation.');
}

console.log('Finalize complete.');
process.exit(0);

