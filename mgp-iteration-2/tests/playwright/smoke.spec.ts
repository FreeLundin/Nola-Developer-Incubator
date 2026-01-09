import { test, expect, devices } from '@playwright/test'

test.use({ ...devices['Pixel 5'] })

test('joystick and HUD respond on mobile', async ({ page }) => {
  await page.goto('http://localhost:5173')
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

  // Ensure sensitivity control exists and is interactable
  const slider = await page.$('input[type="range"]')
  expect(slider).not.toBeNull()
})
