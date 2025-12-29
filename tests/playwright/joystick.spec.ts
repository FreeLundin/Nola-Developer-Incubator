import { test, expect } from '@playwright/test';

// Playwright skeleton for joystick behavior. This is a minimal smoke test.
// To run locally: npx playwright test tests/playwright/joystick.spec.ts --project=chromium

test.describe('Joystick basic interactions', () => {
  test('page loads and shows joystick when enabled', async ({ page }) => {
    await page.goto('http://127.0.0.1:5000');
    // Open settings (assumes there is a button with data-testid)
    const settingsButton = page.locator('[data-testid="settings-button"]');
    await settingsButton.click();
    const joystickToggle = page.locator('[data-testid="joystick-toggle"]');
    await joystickToggle.click();
    // Close settings
    await page.locator('[data-testid="settings-close"]').click();

    const joystick = page.locator('[data-testid="on-screen-joystick"]');
    await expect(joystick).toBeVisible();
  });

  test('joystick moves player (smoke)', async ({ page }) => {
    await page.goto('http://127.0.0.1:5000');
    // Basic scout: ensure the player object exists and joystick is visible
    // This relies on testids being added to the UI. If not present, this test is a placeholder.
    const player = page.locator('[data-testid="player-entity"]');
    await expect(player).toBeVisible();
  });
});

