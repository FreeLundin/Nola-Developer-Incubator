#!/usr/bin/env node
// Usage: node scripts/set-pages-redirect.mjs <public-url> [--qr]
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/set-pages-redirect.mjs <public-url> [--qr]');
  process.exit(2);
}

const publicUrl = args[0];
const makeQr = args.includes('--qr');

const targetPath = path.resolve('./docs/MardiGrasParadeSim2026/redirect.json');
const data = { url: publicUrl };
fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Wrote redirect to ${targetPath}`);

if (makeQr) {
  try {
    const QR = await import('qrcode');
    const out = path.resolve('./docs/public-qr.svg');
    await QR.toFile(out, publicUrl, { type: 'svg' });
    console.log(`Wrote QR to ${out}`);
  } catch (err) {
    console.error('Failed to generate QR (is qrcode installed?):', err?.message || err);
  }
}

