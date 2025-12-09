const fs = require('fs');
const path = require('path');

const srcPaths = [
  path.resolve('docs/images/logo-source.png'),
  path.resolve('docs/logo-raster.png'),
];

let src;
for (const p of srcPaths) {
  if (fs.existsSync(p)) { src = p; break; }
}

if (!src) {
  console.error('No source PNG found. Place your PNG at docs/images/logo-source.png or ensure docs/logo-raster.png exists.');
  process.exit(1);
}

const buf = fs.readFileSync(src);
const b64 = buf.toString('base64');
const outPath = path.resolve('docs/images/logo-embedded.svg');

const svg = `<?xml version="1.0" encoding="utf-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="700" height="140" viewBox="0 0 700 140">\n  <rect width="100%" height="100%" fill="#0b0b12" rx="10"/>\n  <image href=\"data:image/png;base64,${b64}\" x=\"24\" y=\"10\" width=\"652\" height=\"120\" preserveAspectRatio=\"xMidYMid slice\" />\n</svg>`;

fs.writeFileSync(outPath, svg, 'utf8');
console.log('Wrote', outPath);

