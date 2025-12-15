#!/usr/bin/env node
/**
 * scripts/convert-start-logo.mjs
 * Generate optimized PNG variants from client/public/images/start-logo.svg
 * Usage: node scripts/convert-start-logo.mjs
 */
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const repoRoot = path.resolve(new URL(import.meta.url).pathname, '..', '..');
const input = path.join(repoRoot, 'client', 'public', 'images', 'start-logo.svg');
const outDir = path.join(repoRoot, 'client', 'public', 'images');

if (!fs.existsSync(input)) {
  console.error('Input SVG not found:', input);
  process.exit(1);
}

const sizes = [64, 128, 256, 512, 1024];

async function run() {
  console.log('Converting', input, 'to PNG sizes:', sizes.join(', '));

  for (const size of sizes) {
    const outName = `start-logo-${size}.png`;
    const outPath = path.join(outDir, outName);

    try {
      await sharp(input, { density: 300 })
        .resize(size, size, { fit: 'contain' })
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(outPath);

      console.log('Wrote', outPath);
    } catch (err) {
      console.error('Failed to write', outPath, err);
      process.exitCode = 2;
    }
  }

  // Also write a friendly alias (start-logo.png -> 256px default)
  const defaultSrc = path.join(outDir, 'start-logo-256.png');
  const alias = path.join(outDir, 'start-logo.png');
  if (fs.existsSync(defaultSrc)) {
    try {
      await fs.promises.copyFile(defaultSrc, alias);
      console.log('Created alias', alias);
    } catch (err) {
      console.warn('Could not create alias:', err.message);
    }
  }

  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

