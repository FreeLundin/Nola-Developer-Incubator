import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

async function run() {
  const svgPath = path.resolve('docs/images/logo.svg');
  const outPath = path.resolve('docs/logo-raster.png');

  if (!fs.existsSync(svgPath)) {
    console.error('SVG not found:', svgPath);
    process.exit(1);
  }

  const svg = fs.readFileSync(svgPath, 'utf8');
  const html = `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:transparent">${svg}</body></html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 2048, height: 512 } });
  await page.setContent(html, { waitUntil: 'networkidle' });
  // Wait for fonts/images
  await page.waitForTimeout(200);
  await page.screenshot({ path: outPath, omitBackground: false });
  await browser.close();
  console.log('Wrote PNG to', outPath);
}

run().catch((err) => { console.error(err); process.exit(1); });

