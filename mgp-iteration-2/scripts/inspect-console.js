const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', (m) => console.log('CONSOLE:', m.type(), m.text()));
  page.on('pageerror', (err) => console.log('PAGEERROR:', err.toString()));
  await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:5174');
  await page.waitForTimeout(3000);
  await browser.close();
})();
