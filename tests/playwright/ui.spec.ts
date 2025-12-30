// @ts-nocheck
import {expect, test} from '@playwright/test';

const BASE = process.env.PLAYTEST_URL || 'http://localhost:5000';

test.describe('UI and Settings', () => {
  test('Play button starts game and settings toggles persist', async ({ page, request }) => {
    // Health check
    const health = await request.get(`${BASE}/health`);
    expect(health.ok()).toBeTruthy();

    await page.goto(BASE);

    // Play overlay button should be visible
    const playBtn = page.locator('text=Play Mardi Gras Parade');
    await expect(playBtn).toBeVisible({ timeout: 10000 });

    // Hover to prefetch should not error
    await playBtn.hover();

    // Click Play -> should lazy-load canvas and show Start Game modal or HUD
    await playBtn.click();

    // Wait for canvas to appear
    await page.waitForSelector('canvas', { timeout: 15000 });

    // Open Settings
    const settingsBtn = page.locator('[data-testid="settings-button"]').first();
    await settingsBtn.waitFor({ timeout: 5000 });
    await settingsBtn.click();

    // Wait for settings modal close button
    const closeBtn = page.locator('[data-testid="settings-close"]').first();
    await closeBtn.waitFor({ timeout: 5000 });

    // Toggle Audio setting
    const audioToggle = page.locator('[data-testid="audio-toggle"]').first();
    await audioToggle.waitFor({ timeout: 2000 });
    const wasChecked = await audioToggle.isChecked();
    await audioToggle.click();
    expect(await audioToggle.isChecked()).toBe(!wasChecked);

    // Close settings
    await closeBtn.click();

    // Ensure HUD toggle reflects change in localStorage: open settings again to verify persistence
    await settingsBtn.click();
    await page.waitForSelector('[data-testid="settings-close"]', { timeout: 2000 });
    const audioToggle2 = page.locator('[data-testid="audio-toggle"]').first();
    expect(await audioToggle2.isChecked()).toBe(!wasChecked);

    // Close settings
    await closeBtn.click();
  });
});

