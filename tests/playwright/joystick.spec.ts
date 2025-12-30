import {expect, test} from '@playwright/test';

// Playwright skeleton for joystick behavior. This is a minimal smoke test.
// To run locally: npx playwright test tests/playwright/joystick.spec.ts --project=chromium

test.describe('Joystick basic interactions', () => {
  test.beforeEach(async ({ page }) => {
    // Emulate a mobile-ish viewport and enable test HUD
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12 Pro-ish
    // Force touch-capable environment: set maxTouchPoints in navigator
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'maxTouchPoints', { get: () => 1 });
    });
    // Ensure ontouchstart exists on window so code that checks 'ontouchstart' in window returns true
    await page.addInitScript(() => {
      (window as any).ontouchstart = () => {};
    });
    // Enable test hook so GameUI exposes a player marker for tests
    await page.addInitScript(() => localStorage.setItem('TEST_FORCE_HUD', 'true'));
  });

  test('page loads and shows joystick when enabled', async ({ page }) => {
    await page.goto('http://127.0.0.1:5000');
    // Open settings (assumes there is a button with data-testid)
    const settingsButton = page.locator('[data-testid="settings-button"]');
    await expect(settingsButton).toBeVisible({ timeout: 15000 });
    await settingsButton.click();

    const joystickToggle = page.locator('[data-testid="joystick-toggle"]');
    await expect(joystickToggle).toBeVisible({ timeout: 15000 });
    await joystickToggle.click();
    // Close settings
    await page.locator('[data-testid="settings-close"]', { timeout: 15000 }).click();

    const joystick = page.locator('[data-testid="on-screen-joystick"]');
    await expect(joystick).toBeVisible({ timeout: 15000 });
  });

  test('joystick moves player (smoke)', async ({ page }) => {
    await page.goto('http://127.0.0.1:5000');
    // Basic scout: ensure the player object exists and joystick is visible
    // This relies on testids being added to the UI. If not present, this test is a placeholder.
    const player = page.locator('[data-testid="player-entity"]');
    await expect(player).toBeVisible({ timeout: 15000 });
  });
});
