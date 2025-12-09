const fs = require('fs');
const path = require('path');

// Usage: node scripts/import-logo.js "C:\Users\BLund\OneDrive\Pictures\a 192x192 thumbnail .png"

(async function() {
  const src = process.argv[2];
  if (!src) {
    console.error('Usage: node scripts/import-logo.js <path-to-png>');
    process.exit(1);
  }
  if (!fs.existsSync(src)) {
    console.error('Source file not found:', src);
    process.exit(1);
  }
  const destDir = path.resolve('docs/images');
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const dest = path.join(destDir, 'logo-source.png');
  fs.copyFileSync(src, dest);
  console.log('Copied to', dest);

  // Write an embedded SVG that references the PNG; this SVG can be used directly.
  const svgPath = path.join(destDir, 'logo-embedded.svg');
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="700" height="140" viewBox="0 0 700 140">\n  <rect width="100%" height="100%" fill="#0b0b12" rx="10"/>\n  <image href="logo-source.png" x="24" y="10" width="652" height="120" preserveAspectRatio="xMidYMid slice" />\n</svg>`;
  fs.writeFileSync(svgPath, svgContent, 'utf8');
  console.log('Wrote embedded SVG to', svgPath);
})();

