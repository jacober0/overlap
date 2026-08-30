import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('reales Beta-Gate ist erreichbar, sicher und zugänglich', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Bei Overlap anmelden' })).toBeVisible()
  await expect(page.getByLabel('E-Mail-Adresse')).toBeVisible()
  await expect(page.getByRole('button', { name: /Sicheren Login-Link senden/ })).toBeVisible()

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  const serious = result.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))
  expect(serious, serious.map((violation) => `${violation.id}: ${violation.help}`).join('\n')).toEqual([])
  expect(pageErrors).toEqual([])
})
