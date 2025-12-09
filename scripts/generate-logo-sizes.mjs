import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

async function generate() {
  const srcPath = path.resolve('docs/logo-raster.png');
  if (!fs.existsSync(srcPath)) {
    console.error('Source raster not found:', srcPath);
    process.exit(1);
  }

  const sizes = [32, 64, 128, 256, 512, 1024];
  const outDir = path.resolve('docs/icons');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const imgBase64 = fs.readFileSync(srcPath).toString('base64');
  const mime = 'image/png';
  const dataUrl = `data:${mime};base64,${imgBase64}`;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const size of sizes) {
    const html = `<!doctype html><html><body style="margin:0;display:flex;align-items:center;justify-content:center;background:transparent"><img src="${dataUrl}" style="width:${size}px;height:${size}px;object-fit:contain;"/></body></html>`;
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: size, height: size });
    const outPath = path.join(outDir, `logo-${size}.png`);
    await page.screenshot({ path: outPath, omitBackground: false });
    console.log('Wrote', outPath);
  }

  await browser.close();
}

generate().catch((err) => { console.error(err); process.exit(1); });

