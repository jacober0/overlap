import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e-beta',
  retries: 0,
  reporter: 'line',
  use: { baseURL: 'http://127.0.0.1:48176', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 48176 --strictPort',
    url: 'http://127.0.0.1:48176',
    reuseExistingServer: false,
    timeout: 120000,
    env: process.env,
  },
  projects: [
    { name: 'beta-desktop', use: { ...devices['Desktop Chrome'], browserName: 'chromium' } },
    { name: 'beta-mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
  ],
})
