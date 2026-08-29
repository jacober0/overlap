import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const expectNoSeriousAccessibilityViolations = async (page: Parameters<typeof AxeBuilder>[0]['page']) => {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  const serious = result.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))
  expect(serious, serious.map((violation) => `${violation.id}: ${violation.help}`).join('\n')).toEqual([])
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('vollständiger lokaler MVP-Flow funktioniert', async ({ page }, testInfo) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await expect(page.getByRole('heading', { name: /Was soll diese Woche leichter machen/ })).toBeVisible()
  await page.getByLabel('Mahlzeiten pro Woche').selectOption('3')
  await page.getByLabel('Portionen pro Gericht').selectOption('4')
  await page.getByRole('button', { name: '+ Tomaten', exact: true }).click()
  await page.getByRole('button', { name: /Vorschläge entdecken/ }).click()

  await expect(page.getByRole('heading', { name: /Dein nächster Treffer/ })).toBeVisible()
  await page.getByRole('button', { name: /Smart Fill für 3 Gerichte/ }).click()
  await expect(page.getByRole('button', { name: /Wochenplan 3/ })).toBeVisible()
  await page.getByRole('button', { name: /Wochenplan 3/ }).click()

  await expect(page.getByRole('heading', { name: /Eine Woche, die zusammenpasst/ })).toBeVisible()
  await page.locator('.day-cook').first().click()
  await expect(page.getByText('Schritt 1 von 3')).toBeVisible()
  await page.getByRole('button', { name: 'Nächster Schritt' }).click()
  await expect(page.getByText('Schritt 2 von 3')).toBeVisible()
  await page.getByRole('button', { name: '← Wochenplan', exact: true }).click()

  await page.getByRole('button', { name: /Einkaufsliste erstellen/ }).click()
  await expect(page.getByRole('heading', { name: /Ein Einkauf. Alles für die Woche/ })).toBeVisible()
  await page.getByLabel('Eigene Einkaufsposition').fill('Hafermilch')
  await page.getByRole('button', { name: 'Hinzufügen' }).click()
  await page.getByRole('checkbox').first().check()
  await page.reload()
  await expect(page.getByText('Hafermilch')).toBeVisible()
  await expect(page.locator('.shopping-group label.checked, .custom-item.checked')).toHaveCount(1)

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /Als Text exportieren/ }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('overlap-wochenplan.txt')

  await page.screenshot({ path: `artifacts/${testInfo.project.name}-shopping.png`, fullPage: true })
  expect(pageErrors).toEqual([])
})

test('beschädigte Browserdaten führen sicher zum Onboarding', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('overlap-stage', 'plan')
    localStorage.setItem('overlap-preferences', '{kaputt')
    localStorage.setItem('overlap-selected', 'null')
  })
  await page.reload()
  await expect(page.getByRole('heading', { name: /Was soll diese Woche leichter machen/ })).toBeVisible()
})

test('Kernseiten haben keine ernsten WCAG-A/AA-Verstöße', async ({ page }) => {
  await expectNoSeriousAccessibilityViolations(page)
  await page.getByRole('button', { name: /Vorschläge entdecken/ }).click()
  await expect(page.getByRole('heading', { name: /Dein nächster Treffer/ })).toBeVisible()
  await expectNoSeriousAccessibilityViolations(page)
})
