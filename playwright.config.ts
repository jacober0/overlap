import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  retries: 0,
  reporter: 'line',
  use: { baseURL: 'http://127.0.0.1:48173', trace: 'retain-on-failure' },
  webServer: { command: 'npm run dev -- --host 127.0.0.1 --port 48173 --strictPort', url: 'http://127.0.0.1:48173', reuseExistingServer: false, timeout: 120000 },
  projects: [{ name: 'mobile-chromium', use: { ...devices['iPhone 13'], browserName: 'chromium' } }],
})
