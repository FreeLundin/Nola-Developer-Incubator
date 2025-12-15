import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Script to convert client/public/images/start-logo.svg into optimized PNGs
(async function main() {
  const repoRoot = process.cwd();
  const srcPath = path.join(repoRoot, 'client', 'public', 'images', 'start-logo.svg');
  const outDir = path.join(repoRoot, 'client', 'public', 'images');

  if (!fs.existsSync(srcPath)) {
    console.error('Source SVG not found at', srcPath);
    process.exit(2);
  }

  try {
    const svgBuffer = await fs.promises.readFile(srcPath);

    const outputs = [
      { name: 'start-logo.png', width: 1024 },
      { name: 'start-logo-512.png', width: 512 },
    ];

    for (const o of outputs) {
      const outPath = path.join(outDir, o.name);
      console.log(`Rendering ${o.name} (${o.width}px) -> ${outPath}`);

      // Use sharp to render the SVG to PNG with sRGB and reasonable compression
      await sharp(svgBuffer, { density: 300 })
        .resize({ width: o.width })
        .png({ quality: 90, compressionLevel: 9, adaptiveFiltering: true })
        .toFile(outPath);

      console.log(`Wrote ${outPath}`);
    }

    console.log('All exports complete.');
    process.exit(0);
  } catch (err) {
    console.error('Conversion failed:', err);
    process.exit(1);
  }
})();

