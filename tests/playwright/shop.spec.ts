import { test, expect } from '@playwright/test';

test('shop purchase helper', async ({ page }) => {
  await page.goto(process.env.PLAYTEST_URL ?? 'http://localhost:5000');
  // Wait for HUD and open shop button
  const open = page.getByTestId('open-shop');
  await open.waitFor({ timeout: 10000 });
  await open.click();

  // Wait for buy helper button
  const buy = page.getByTestId('buy-helper');
  await buy.waitFor({ timeout: 5000 });
  await buy.click();

  // Expect shop message to appear
  const msg = page.getByTestId('shop-message');
  await expect(msg).toBeVisible({ timeout: 5000 });
  const text = await msg.textContent();
  // Either NOT_ENOUGH_COINS or HELPER_PURCHASED
  expect(['NOT_ENOUGH_COINS', 'HELPER_PURCHASED']).toContain(text);
});
