import { test, expect } from '@playwright/test';

test('homepage responds with 200', async ({ page }) => {
  const response = await page.goto('/');
  expect(response && response.ok()).toBeTruthy();
});
