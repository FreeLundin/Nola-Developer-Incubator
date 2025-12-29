// @ts-nocheck
import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYTEST_URL || 'http://localhost:5000';

test.describe('Basic Playtest', () => {
  test('health endpoint and bot names', async ({ request, page }) => {
    const health = await request.get(`${BASE}/health`);
    expect(health.ok()).toBeTruthy();
    const json = await health.json();
    expect(json.status).toBe('ok');

    await page.goto(BASE);
    // wait for canvas to load
    await page.waitForSelector('canvas', { timeout: 15000 });

    // start game by clicking Start Game button
    const startBtn = await page.locator('text=Start Game').first();
    await startBtn.click();

    // If tutorial modal appears, click 'Start!' or 'Skip'
    try {
      const startModalBtn = page.locator('text=Start!').first();
      await startModalBtn.waitFor({ timeout: 3000 });
      await startModalBtn.click();
    } catch (e) {
      try {
        const skipBtn = page.locator('text=Skip').first();
        await skipBtn.waitFor({ timeout: 1000 });
        await skipBtn.click();
      } catch {
        // no tutorial modal appeared
      }
    }

    // Wait for HUD competitor list to appear
    await page.waitForSelector('text=COMPETITOR CATCHES', { timeout: 15000 });

    // Check that a friendly name from bots.override.json appears
    const king = await page.locator('text=King Rex').count();
    expect(king).toBeGreaterThan(0);

    // Check that Howler is available on the page (audio library loaded)
    const howlerExists = await page.evaluate(() => { return typeof (window as any).Howler !== 'undefined' || typeof (window as any).Howl !== 'undefined'; });
    expect(howlerExists).toBeTruthy();
  });
});
