import { test, expect } from '@playwright/test';

test('shop purchase helper', async ({ page }) => {
  // Ensure desktop viewport so shop button isn't hidden (hidden on small screens)
  await page.setViewportSize({ width: 1280, height: 800 });

  // Ensure debug overlays or forced HUD flags are disabled before page loads
  await page.addInitScript(() => {
    try {
      localStorage.setItem('showPersonas', 'false');
      localStorage.setItem('minimalHud', 'false');
    } catch (e) {
      // ignore
    }
  });

  await page.goto(process.env.PLAYTEST_URL ?? 'http://localhost:5000');

  // Ensure the main tutorial overlay is handled: click Start Game if present
  const startButton = page.getByRole('button', { name: /Start Game/i });
  try {
    if (await startButton.isVisible({ timeout: 3000 })) {
      // use DOM click to avoid Playwright interception
      await page.evaluate((sel) => { const b = document.querySelector(sel) as HTMLElement | null; if (b) b.click(); }, 'button:has-text("Start Game")');

      // If the first-level tutorial appears, click Skip (or click through to Start!)
      const skipBtn = page.getByRole('button', { name: /^Skip$/i });
      try {
        if (await skipBtn.isVisible({ timeout: 2000 })) {
          await page.evaluate((sel) => { const b = document.querySelector(sel) as HTMLElement | null; if (b) b.click(); }, 'button:has-text("Skip")');
        }
      } catch {
        // If Skip isn't visible, try final Start button in tutorial
        const finalStart = page.getByRole('button', { name: /Start!?$/i });
        try { if (await finalStart.isVisible({ timeout: 2000 })) await page.evaluate((sel) => { const b = document.querySelector(sel) as HTMLElement | null; if (b) b.click(); }, 'button:has-text("Start!")'); } catch { }
      }
    }
  } catch {
    // If the start button isn't present, assume we're already past tutorial
  }

  // Install a MutationObserver in the page to remove or hide any overlay elements that match 'Show Personas'
  await page.evaluate(() => {
    try {
      const removeOverlays = () => {
        const els = Array.from(document.querySelectorAll('*')).filter(el => {
          try {
            return el.textContent && el.textContent.includes('Show Personas');
          } catch { return false; }
        });
        for (const el of els) {
          try {
            if (el.parentNode) el.parentNode.removeChild(el);
          } catch (_) {
            try { (el as HTMLElement).style.pointerEvents = 'none'; (el as HTMLElement).style.opacity = '0'; } catch (_) {}
          }
        }
      };
      removeOverlays();
      const observer = new MutationObserver(() => removeOverlays());
      observer.observe(document.body || document.documentElement, { subtree: true, childList: true });
      // Stop observing after 5s
      setTimeout(() => observer.disconnect(), 5000);
    } catch (e) {
      // ignore
    }
  });

  // Wait a short moment to let overlay removals take effect
  await page.waitForTimeout(250);

  // Wait for HUD and open shop button
  await page.waitForSelector('[data-testid="open-shop"]', { timeout: 10000 });
  // Use DOM click to avoid pointer interception issues
  await page.evaluate(() => { const b = document.querySelector('[data-testid="open-shop"]') as HTMLElement | null; if (b) b.click(); });

  // Wait for buy helper button
  await page.waitForSelector('[data-testid="buy-helper"]', { timeout: 5000 });
  await page.evaluate(() => { const b = document.querySelector('[data-testid="buy-helper"]') as HTMLElement | null; if (b) b.click(); });

  // Expect shop message to appear
  const msg = page.getByTestId('shop-message');
  await expect(msg).toBeVisible({ timeout: 5000 });
  const text = (await msg.textContent())?.trim();
  // Either NOT_ENOUGH_COINS or HELPER_PURCHASED
  expect(['NOT_ENOUGH_COINS', 'HELPER_PURCHASED']).toContain(text);
});
