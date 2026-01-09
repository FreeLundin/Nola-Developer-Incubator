import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/playwright',
  timeout: 30_000,
  expect: { timeout: 5000 },
  projects: [
    {
      name: 'Pixel 5',
      use: { ...devices['Pixel 5'] }
    }
  ]
});
