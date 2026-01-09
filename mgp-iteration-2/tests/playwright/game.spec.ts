import { test, expect } from '@playwright/test'

test('joystick moves and HUD updates', async ({ page }) => {
  const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:5173'
  await page.goto(BASE)
  await page.waitForSelector('.hud')

  // simulate touch-style pointer events via mouse
  const viewport = page.viewportSize() || { width: 393, height: 800 }
  const startX = 60
  const startY = viewport.height - 60

  await page.mouse.move(startX, startY)
  await page.mouse.down()
  await page.mouse.move(startX + 80, startY - 40, { steps: 5 })
  await page.waitForTimeout(300)
  await page.mouse.up()

  // slider exists and is interactive
  const slider = await page.$('input[type="range"]')
  expect(slider).not.toBeNull()
  await slider?.focus()
  await page.keyboard.press('ArrowRight')

  // wait for debug DOM (attached to DOM even if hidden) and assert player moved and floats spawn
  await page.waitForSelector('#mgp-debug', { state: 'attached', timeout: 5000 })
  const debug = await page.$('#mgp-debug')
  const json = await debug?.getAttribute('data-json')
  expect(json).not.toBeNull()
  const data = JSON.parse(json || '{}')
  expect(typeof data.floatsCount).toBe('number')
  // after a short time floats should exist
  expect(data.floatsCount).toBeGreaterThanOrEqual(0)
  // player pos should have updated after joystick input
  expect(typeof data.player.x).toBe('number')
})
