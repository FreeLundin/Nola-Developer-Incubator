const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const includeGlobs = ['client', 'server', 'shared', 'docs'];
const extensions = ['.html', '.htm', '.css', '.js', '.ts', '.tsx', '.jsx', '.md'];

const offending = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      // Skip node_modules and .git
      if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist') continue;
      walk(p);
    } else if (e.isFile()) {
      if (!extensions.includes(path.extname(e.name))) continue;
      const rel = path.relative(root, p);
      // Only look in the include globs
      if (!includeGlobs.some(g => rel.split(path.sep)[0] === g)) continue;
      const content = fs.readFileSync(p, 'utf8');
      const lines = content.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Find src="/something or href="/something or url('/something
        const regex = /(?:src|href)\s*=\s*"\/(?!\/)([^"]+)"|url\(['"]?\/(?!\/)([^'"\)]+)['"]?\)/g;
        let m;
        while ((m = regex.exec(line)) !== null) {
          // Ignore known whitelist files in docs/temp_index where we intentionally use absolute repo paths
          if (rel.includes('docs') && line.includes('/MardiGrasParadeGame')) continue;
          // Allow the dev-entry script to remain absolute (Vite dev server uses /src/main.tsx)
          if (line.includes('/src/main.tsx')) continue;
          offending.push({ file: rel, line: i + 1, match: m[0].trim() });
        }
      }
    }
  }
}

for (const g of includeGlobs) {
  const dir = path.join(root, g);
  if (fs.existsSync(dir)) walk(dir);
}

if (offending.length) {
  console.error('\nAsset path linter found absolute paths (leading "/") that will break when site is hosted on a subpath:');
  offending.forEach(o => console.error(`${o.file}:${o.line}: ${o.match}`));
  process.exit(1);
} else {
  console.log('Asset path linter: no offending absolute paths found.');
  process.exit(0);
}
