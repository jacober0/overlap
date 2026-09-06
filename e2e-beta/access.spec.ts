import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('öffentlicher Zugriff: App lädt direkt ohne Login-Gate, sicher und zugänglich', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.goto('/')
  // Kein Login-Gate mehr: Die App startet direkt im Onboarding.
  await expect(page.getByRole('heading', { name: /Was soll diese Woche/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Vorschläge entdecken/ })).toBeVisible()

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  const serious = result.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))
  expect(serious, serious.map((violation) => `${violation.id}: ${violation.help}`).join('\n')).toEqual([])
  expect(pageErrors).toEqual([])
})
