import { describe, expect, it } from 'vitest'
import { validateCatalog, validateCatalogRecipe, type CatalogRecipeCandidate } from './catalog'

const valid: CatalogRecipeCandidate = {
  externalId: 'editorial-001', title: 'Ofengemüse mit Zitronen-Tahini',
  description: 'Knuspriges saisonales Ofengemüse mit cremiger Zitronen-Tahini-Sauce.',
  servings: 2, totalMinutes: 40, activeMinutes: 15, diet: 'vegan',
  ingredients: [
    { canonicalId: 'potato', name: 'Kartoffeln', amount: 500, unit: 'g' },
    { canonicalId: 'carrot', name: 'Karotten', amount: 250, unit: 'g' },
    { canonicalId: 'tahini', name: 'Tahini', amount: 40, unit: 'g' },
    { canonicalId: 'lemon', name: 'Zitrone', amount: 1, unit: 'Stück' },
  ],
  steps: ['Backofen auf 210 Grad Ober-/Unterhitze vorheizen.', 'Gemüse gleichmäßig schneiden, würzen und auf einem Blech verteilen.', 'Gemüse goldbraun rösten und mit der angerührten Sauce servieren.'],
  nutrition: { kcal: 610, protein: 17, carbs: 82, fat: 22, fiber: 14 },
  estimatedPriceCents: 390, priceRegion: 'DE-BW', priceCheckedAt: '2026-08-01',
  sourceName: 'Overlap Redaktion', sourceUrl: 'https://example.org/recipes/editorial-001', contentLicense: 'Eigene redaktionelle Inhalte',
  imageUrl: 'https://images.example.org/editorial-001.jpg', imageLicense: 'Eigene Aufnahme', attributionText: 'Foto: Overlap Redaktion',
  reviewedBy: 'redaktion@example.org', reviewedAt: '2026-08-02',
}

describe('catalog publishing gate', () => {
  it('akzeptiert einen vollständigen, frischen und freigegebenen Datensatz', () => {
    expect(validateCatalogRecipe(valid, new Date('2026-08-29T00:00:00Z'))).toEqual([])
  })

  it('blockiert fehlende Rechte, veraltete Preise und unvollständige Anleitungen', () => {
    const broken = { ...valid, contentLicense: '', priceCheckedAt: '2025-01-01', steps: ['Kurz.'] }
    expect(validateCatalogRecipe(broken, new Date('2026-08-29T00:00:00Z'))).toEqual(expect.arrayContaining([
      'Inhaltslizenz fehlt', 'Preisschätzung ist veraltet oder liegt in der Zukunft', 'Kochschritte sind unvollständig',
    ]))
  })

  it('blockiert syntaktische ISO-Daten, die keine echten Kalendertage sind', () => {
    const broken = { ...valid, priceCheckedAt: '2026-02-30', reviewedAt: '2026-02-29' }
    expect(validateCatalogRecipe(broken, new Date('2026-03-01T00:00:00Z'))).toEqual(expect.arrayContaining([
      'Preisdatum ist ungültig', 'Menschliche Freigabe fehlt',
    ]))
  })

  it('akzeptiert einen echten Schalttag', () => {
    const leapDay = { ...valid, priceCheckedAt: '2024-02-29', reviewedAt: '2024-02-29' }
    expect(validateCatalogRecipe(leapDay, new Date('2024-03-01T00:00:00Z'))).toEqual([])
  })

  it('blockiert nicht-endliche und gebrochene Mengenangaben', () => {
    const broken = {
      ...valid,
      servings: Number.NaN,
      totalMinutes: Number.POSITIVE_INFINITY,
      activeMinutes: 12.5,
      ingredients: valid.ingredients.map((item, index) => index === 0 ? { ...item, amount: Number.NaN } : item),
    }
    expect(validateCatalogRecipe(broken, new Date('2026-08-29T00:00:00Z'))).toEqual(expect.arrayContaining([
      'Portionszahl ist ungültig', 'Zeitangaben sind inkonsistent', 'Zutat ist unvollständig',
    ]))
  })

  it('blockiert Zutatenfelder, die nur aus Leerraum bestehen', () => {
    const broken = {
      ...valid,
      ingredients: valid.ingredients.map((item, index) => index === 0
        ? { ...item, canonicalId: '  ', name: '\t', unit: '\n' }
        : item),
    }
    expect(validateCatalogRecipe(broken, new Date('2026-08-29T00:00:00Z'))).toContain('Zutat ist unvollständig')
  })

  it('blockiert doppelte Katalog-IDs und Titel', () => {
    expect(validateCatalog([valid, { ...valid }], new Date('2026-08-29T00:00:00Z'))).toEqual(expect.arrayContaining([
      { externalId: 'editorial-001', message: 'externalId ist nicht eindeutig' },
      { externalId: 'editorial-001', message: 'Titel ist nicht eindeutig' },
    ]))
  })
})
