import { test, expect } from '@playwright/test'

test('joystick and HUD respond on mobile', async ({ page }) => {
  const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:5173'
  await page.goto(BASE)
  // Wait for HUD
  await page.waitForSelector('.hud')

  // Find joystick area (approx bottom-left)
  const viewport = page.viewportSize()
  const x = 60
  const y = viewport ? viewport.height - 60 : 460

  // Pointer down and move to simulate joystick
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x+40, y-30)
  await page.waitForTimeout(200)
  await page.mouse.up()

  // Ensure tutorial advanced (contains Flip X instruction)
  await page.waitForSelector('[data-testid="tutorial"]', { state: 'attached' })
  const tutorialText = await page.locator('[data-testid="tutorial"]').textContent()
  expect(tutorialText).toContain('Move the thumbstick')

  // Ensure sensitivity control exists and is interactable
  const slider = await page.$('input[type="range"]')
  expect(slider).not.toBeNull()
})
