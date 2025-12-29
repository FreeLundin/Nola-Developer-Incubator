import { test, expect } from '@playwright/test';

test('shop purchase helper', async ({ page }) => {
  // desktop viewport
  await page.setViewportSize({ width: 1280, height: 800 });

  // disable debug overlays and minimal HUD flags early; force HUD for tests
  await page.addInitScript(() => {
    try {
      localStorage.setItem('showPersonas', 'false');
      localStorage.setItem('minimalHud', 'false');
      localStorage.setItem('TEST_FORCE_HUD', 'true');
    } catch {}
  });

  await page.goto(process.env.PLAYTEST_URL ?? 'http://localhost:5000', { waitUntil: 'load' });

  // If the app exposes the test helper, use it to open the shop directly
  const openedViaHelper = await page.evaluate(() => {
    try {
      // @ts-ignore
      if (typeof window !== 'undefined' && (window as any).__OPEN_SHOP) {
        // @ts-ignore
        (window as any).__OPEN_SHOP();
        return true;
      }
    } catch (e) { }
    return false;
  });

  if (!openedViaHelper) {
    // Try clicking 'Start Game' via DOM regardless of Playwright locators
    try {
      await page.waitForSelector('button:has-text("Start Game")', { state: 'attached', timeout: 3000 });
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button')) as HTMLElement[];
        const start = buttons.find(b => b.textContent && b.textContent.trim() === 'Start Game');
        if (start) start.click();
      });
    } catch {}

    // Aggressively click through tutorial buttons for up to 8s
    await page.evaluate(() => {
      const texts = ['Skip', 'Start!', 'Next'];
      const end = Date.now() + 8000;
      while (Date.now() < end) {
        const buttons = Array.from(document.querySelectorAll('button')) as HTMLElement[];
        let clicked = false;
        for (const t of texts) {
          const b = buttons.find(el => el.textContent && el.textContent.trim() === t);
          if (b) { try { b.click(); clicked = true; } catch {} }
        }
        if (!clicked) break;
      }
    });

    // Remove 'Show Personas' overlays defensively
    await page.evaluate(() => {
      try {
        const els = Array.from(document.querySelectorAll('*')).filter(e => e.textContent && e.textContent.includes('Show Personas'));
        for (const el of els) {
          try { if (el.parentNode) el.parentNode.removeChild(el); } catch { try { (el as HTMLElement).style.pointerEvents = 'none'; (el as HTMLElement).style.opacity = '0'; } catch {} }
        }
      } catch {}
    });

    // Wait up to 30s for HUD/shop to be attached to DOM (state: 'attached')
    await page.waitForSelector('[data-testid="open-shop"]', { state: 'attached', timeout: 30000 });
    await page.evaluate(() => { const b = document.querySelector('[data-testid="open-shop"]') as HTMLElement | null; if (b) b.click(); });
  }

  // Click buy-helper (wait for attached)
  await page.waitForSelector('[data-testid="buy-helper"]', { state: 'attached', timeout: 5000 });
  await page.evaluate(() => { const b = document.querySelector('[data-testid="buy-helper"]') as HTMLElement | null; if (b) b.click(); });

  // Assert shop message
  const msg = page.getByTestId('shop-message');
  await expect(msg).toBeVisible({ timeout: 5000 });
  const text = (await msg.textContent())?.trim();
  expect(['NOT_ENOUGH_COINS', 'HELPER_PURCHASED']).toContain(text);
});
