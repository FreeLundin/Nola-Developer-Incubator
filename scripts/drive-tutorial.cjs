const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  try {
    await page.goto('http://127.0.0.1:5000', { waitUntil: 'load', timeout: 15000 });
    console.log('goto done');
    await page.waitForTimeout(500);
    // Click Start Game by text
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const b = buttons.find(el => el.textContent && el.textContent.trim() === 'Start Game');
      if (b) { console.log('clicking Start Game'); b.click(); }
    });
    await page.waitForTimeout(500);
    // Dump buttons
    const btns = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map(b => b.textContent && b.textContent.trim()).filter(Boolean));
    console.log('buttons after start:', btns);
    // Try clicking Skip or Start!
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      let b = buttons.find(el => el.textContent && el.textContent.trim() === 'Skip');
      if (b) { console.log('clicking Skip'); b.click(); return; }
      b = buttons.find(el => el.textContent && el.textContent.trim() === 'Start!');
      if (b) { console.log('clicking Start!'); b.click(); return; }
      // click Next repeatedly
      b = buttons.find(el => el.textContent && el.textContent.trim() === 'Next');
      if (b) { console.log('clicking Next'); b.click(); }
    });
    await page.waitForTimeout(500);
    const hasOpen = await page.$('[data-testid="open-shop"]') !== null;
    console.log('has open-shop:', hasOpen);
    const body = await page.evaluate(()=>document.body.innerText.slice(0,1000));
    console.log('body snippet:', body);
  } catch (e) {
    console.error('ERR', e.message);
  } finally {
    await browser.close();
  }
})();
