const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  try {
    await page.goto('http://127.0.0.1:5000', { waitUntil: 'load', timeout: 15000 });
    console.log('goto done');
    // wait for app to initialize
    await page.waitForTimeout(3000);
    const html = await page.content();
    console.log('content length', html.length);
    const hasOpen = await page.$('[data-testid="open-shop"]') !== null;
    console.log('has open-shop:', hasOpen);
    const startBtn = await page.$('button:has-text("Start Game")');
    console.log('has Start Game button:', startBtn !== null);
    // dump a small sample of body
    const bodyHtml = await page.evaluate(()=>document.body.innerHTML.slice(0,2000));
    console.log('BODY SAMPLE:\n', bodyHtml);
  } catch (e) {
    console.error('ERR', e.message);
  } finally {
    await browser.close();
  }
})();

