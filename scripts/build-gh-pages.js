#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';

// Compute a relative base path for GitHub Pages if running in CI with GITHUB_REPOSITORY
const repo = process.env.GITHUB_REPOSITORY || '';
let base = process.env.GH_PAGES_BASE || (repo.includes('/') ? `/${repo.split('/')[1]}/` : '/');
// Trim any accidental whitespace from environment or computed value
base = String(base).trim();

console.log('Using base:', base);

const clientIndexPath = path.resolve(process.cwd(), 'client', 'index.html');
const backupPath = path.resolve(process.cwd(), 'client', 'index.html.bak');

try {
  console.log('Preparing client index.html with base...');
  // Backup original
  if (fs.existsSync(clientIndexPath)) {
    fs.copyFileSync(clientIndexPath, backupPath);
    const content = fs.readFileSync(clientIndexPath, 'utf-8');
    const replaced = content.replace(/%BASE%/g, base);
    fs.writeFileSync(clientIndexPath, replaced, 'utf-8');
  }

  console.log('Building client with GH_PAGES_BASE set...');
  const buildCmd = os.platform() === 'win32' ? 'cmd /c "npm run build"' : 'npm run build';
  execSync(buildCmd, {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: { ...process.env, GH_PAGES_BASE: base },
    shell: true,
  });
  console.log('Build complete.');

  // Post-build: add cache-busting query param to built asset references in dist/public/index.html
  try {
    const distIndex = path.resolve(process.cwd(), 'dist', 'public', 'index.html');
    if (fs.existsSync(distIndex)) {
      const timestamp = Date.now();
      let html = fs.readFileSync(distIndex, 'utf-8');
      // Append ?v=<timestamp> to JS and CSS asset references that match index-*.js and index-*.css
      html = html.replace(/(src=")([^"]*index-[^"\s]*\.js)(")/g, `$1$2?v=${timestamp}$3`);
      html = html.replace(/(href=")([^"]*index-[^"\s]*\.css)(")/g, `$1$2?v=${timestamp}$3`);
      fs.writeFileSync(distIndex, html, 'utf-8');
      console.log('Applied cache-buster to dist/public/index.html:', timestamp);

      // Also write a debug.html copy so cached index isn't needed
      try {
        const debugPath = path.resolve(process.cwd(), 'dist', 'public', 'debug.html');
        fs.writeFileSync(debugPath, html, 'utf-8');
        console.log('Wrote debug page to dist/public/debug.html');
      } catch (e) {
        console.warn('Failed to write debug.html:', e);
      }
    }
  } catch (e) {
    console.warn('Cache-buster step failed:', e);
  }

} catch (err) {
  console.error('Build failed:', err);
  // Restore original if backup exists
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, clientIndexPath);
    fs.unlinkSync(backupPath);
  }
  process.exit(1);
} finally {
  // Restore original index.html if backup exists
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, clientIndexPath);
    fs.unlinkSync(backupPath);
  }
}
