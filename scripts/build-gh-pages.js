#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';
import os from 'os';

// Compute a relative base path for GitHub Pages if running in CI with GITHUB_REPOSITORY
const repo = process.env.GITHUB_REPOSITORY || '';
const base = process.env.GH_PAGES_BASE || (repo.includes('/') ? `/${repo.split('/')[1]}/` : '/');

console.log('Using base:', base);

try {
  console.log('Building client with GH_PAGES_BASE set...');
  const buildCmd = os.platform() === 'win32' ? 'cmd /c "npm run build"' : 'npm run build';
  execSync(buildCmd, {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: { ...process.env, GH_PAGES_BASE: base },
    shell: true,
  });
  console.log('Build complete.');
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
