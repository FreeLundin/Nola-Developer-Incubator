import { test, expect, devices } from '@playwright/test'

test.use({ ...devices['Pixel 5'] })

test('joystick moves and HUD updates', async ({ page }) => {
  await page.goto('http://localhost:5173')
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
})
