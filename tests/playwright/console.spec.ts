// @ts-nocheck
import { test, expect } from '@playwright/test';

// Use PLAYTEST_URL so tests can run against a public host or localhost fallback
const BASE = process.env.PLAYTEST_URL || 'http://localhost:5000';

// This test opens the app, captures console messages, starts the game, and fails if there are console.error messages.
test('app loads with no console.error', async ({ page }) => {
  const errors = [];
  const warns = [];

  // Filter function for benign console messages
  const isBenign = (text) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    // Ignore Cloudflare performance beacon tracking-prevention warnings
    if (lower.includes('tracking prevention blocked access to storage')) return true;
    if (lower.includes('performance.radar.cloudflare.com')) return true;
    // Ignore Copilot explain helper prompt (devtools UI message)
    if (lower.includes('explain console errors by using copilot')) return true;
    // ignore common webgl warnings from headless chromium reported as warnings
    if (lower.includes('automatic fallback to software webgl') || lower.includes('gpu stall due to readpixels')) return true;
    return false;
  };

  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    if (isBenign(text)) return; // ignore known benign messages
    if (type === 'error') errors.push(text);
    if (type === 'warning') warns.push(text);
  });

  // Block known telemetry/beacon scripts that trigger privacy warnings
  await page.route('**/performance.radar.cloudflare.com/**', route => route.abort());
  await page.route('**/beacon.js', route => route.abort());

  // Use configurable base so CI can point at a public domain via PLAYTEST_URL
  await page.goto(BASE);
  await page.waitForSelector('canvas', { timeout: 15000 });

  // Start the game
  const startBtn = page.locator('text=Start Game').first();
  await startBtn.click();

  // Handle tutorial if present
  try { const startModalBtn = page.locator('text=Start!').first(); await startModalBtn.waitFor({ timeout: 3000 }); await startModalBtn.click(); } catch {}
  try { const skip = page.locator('text=Skip').first(); await skip.waitFor({ timeout: 1000 }); await skip.click(); } catch {}

  // Wait for HUD to show up
  await page.waitForSelector('text=COMPETITOR CATCHES', { timeout: 15000 });

  // Small wait to capture delayed console errors
  await page.waitForTimeout(1000);

  if (errors.length > 0) {
    console.log('CONSOLE ERRORS:\n', errors.join('\n---\n'));
  }
  if (warns.length > 0) {
    console.log('CONSOLE WARNINGS:\n', warns.join('\n---\n'));
  }

  expect(errors.length, `Console errors found: ${errors.join('\n')}`).toBe(0);
});
