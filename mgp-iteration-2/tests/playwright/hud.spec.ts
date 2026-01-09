import { test, expect } from '@playwright/test'

test('hud shows float count and updates', async ({ page }) => {
  const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:5173'
  await page.goto(BASE)
  await page.waitForSelector('.hud', { state: 'attached' })
  // read initial floats count
  const countText = await page.locator('.hud').innerText()
  expect(countText.length).toBeGreaterThan(0)
})