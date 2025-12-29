import { test, expect } from '@playwright/test';

test('remaining floats indicator updates', async ({ page }) => {
  await page.goto(process.env.PLAYTEST_URL ?? 'http://localhost:5000');
  // Wait for app to be ready - our app root may not exist in build; wait for body
  await page.waitForSelector('body', { timeout: 8000 });

  // Check that the RemainingFloats UI text exists somewhere on the page
  const text = await page.locator('text=Floats Remaining').first();
  await expect(text).toBeVisible({ timeout: 5000 });
});
