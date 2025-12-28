import { test, expect } from '@playwright/test';

test.describe('Joystick smoke tests', () => {
  test('Joystick appears when enabled in settings', async ({ page }) => {
    // Navigate to the app (use PLAYTEST_URL env var in CI) or localhost fallback
    const url = process.env.PLAYTEST_URL || 'http://localhost:5000';
    await page.goto(url);

    // Open settings modal
    await page.locator('[aria-label="Settings"]').click().catch(() => {});

    // Toggle joystick setting (assumes a checkbox or toggle exists)
    const joystickToggle = page.locator('[data-testid="joystick-toggle"]');
    if (await joystickToggle.count() === 0) {
      // Try a common label fallback
      await page.locator('text=Joystick Controls').click().catch(() => {});
    } else {
      await joystickToggle.check();
    }

    // Close settings if necessary
    await page.locator('button:has-text("Close")').click().catch(() => {});

    // Check that joystick container exists
    const joystick = page.locator('[data-testid="joystick-container"]');
    await expect(joystick).toBeVisible({ timeout: 5000 });
  });
});

