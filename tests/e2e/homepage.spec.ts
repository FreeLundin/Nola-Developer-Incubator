import { test, expect } from '@playwright/test';

test.describe('Homepage Smoke Test', () => {
  test('should load homepage successfully', async ({ page }) => {
    // Navigate to the homepage
    const response = await page.goto('/');
    
    // Assert that the response is OK (status 200)
    expect(response?.ok()).toBeTruthy();
    
    // Optionally, check that the page has loaded by looking for a common element
    // This helps ensure the page rendered correctly
    await expect(page.locator('body')).toBeVisible();
  });
test('homepage responds with 200', async ({ page }) => {
  const response = await page.goto('/');
  expect(response && response.ok()).toBeTruthy();
});
