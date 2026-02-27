import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.test.ts',
  timeout: 30000,
  expect: { timeout: 5000 },
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3001',
    headless: true,
    viewport: { width: 1440, height: 900 },
    actionTimeout: 5000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
