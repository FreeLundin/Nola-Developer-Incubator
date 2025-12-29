// This script publishes the prepared ./dist/public directory to the gh-pages branch.
// Publishing is intentionally gated: the script only runs the push when the
// environment variable GH_PAGES_CONFIRM is set to '1' or 'true'. This prevents
// accidental local publishes. In CI (GitHub Actions) set GH_PAGES_CONFIRM=1
// for the publish step, or use an actions-based publisher as in
// .github/workflows/publish-client-gh-pages.yml.
#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist', 'public');
const indexPath = path.join(distDir, 'index.html');

// Run the existing build helper which sets GH_PAGES_BASE correctly
try {
  console.log('Running build helper...');
  execSync('node ./scripts/build-gh-pages.js', { stdio: 'inherit', shell: true });
} catch (err) {
  console.error('Build helper failed:', err);
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  console.error('Expected build output not found at', indexPath);
  process.exit(2);
}

const confirm = (process.env.GH_PAGES_CONFIRM || '').toLowerCase();
if (confirm === '1' || confirm === 'true') {
  try {
    console.log('Publishing to gh-pages (this was confirmed by GH_PAGES_CONFIRM)...');
    execSync('npx gh-pages --dotfiles -d dist/public', { stdio: 'inherit', shell: true });
    console.log('Publish complete.');
  } catch (err) {
    console.error('Publish failed:', err);
    process.exit(3);
  }
} else {
  console.log('\nBuild succeeded. Publishing is gated to avoid accidental pushes.');
  console.log('To publish run (PowerShell):');
  console.log("$env:GH_PAGES_CONFIRM='1'; npm run publish:gh-pages\n");
  console.log('Or set GH_PAGES_CONFIRM=1 in CI and run the publish script.');
  process.exit(0);
}
