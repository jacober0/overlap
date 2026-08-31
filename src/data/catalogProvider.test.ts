import { describe, expect, it } from 'vitest'
import type { CatalogRecipeCandidate } from '../domain/catalog'
import { evaluateProviderPage, processProviderPage, type ImportLedger, type ProviderRecipe } from './catalogProvider'

const base: CatalogRecipeCandidate = {
  externalId: 'source-1', title: 'Testgericht mit Gemüse', description: 'Ein ausreichend ausführlich beschriebenes und geprüftes Testgericht.',
  servings: 2, totalMinutes: 30, activeMinutes: 15, diet: 'vegan',
  ingredients: [
    { canonicalId: 'a', name: 'A', amount: 1, unit: 'g' }, { canonicalId: 'b', name: 'B', amount: 1, unit: 'g' },
    { canonicalId: 'c', name: 'C', amount: 1, unit: 'g' }, { canonicalId: 'd', name: 'D', amount: 1, unit: 'g' },
  ],
  steps: ['Ersten vollständigen Arbeitsschritt sorgfältig ausführen.', 'Zweiten vollständigen Arbeitsschritt sorgfältig ausführen.', 'Dritten vollständigen Arbeitsschritt sorgfältig ausführen.'],
  nutrition: { kcal: 400, protein: 15, carbs: 50, fat: 12, fiber: 8 }, estimatedPriceCents: 450,
  priceRegion: 'DE-BW', priceCheckedAt: '2026-08-01', sourceName: 'Lizenzgeber', sourceUrl: 'https://example.org/1',
  contentLicense: 'Vertrag 1', imageUrl: 'https://example.org/1.jpg', imageLicense: 'Vertrag 1', attributionText: 'Quelle',
  reviewedBy: 'review@example.org', reviewedAt: '2026-08-02',
}
const rights: ProviderRecipe['rights'] = ['recipe_text', 'image', 'nutrition'].map(assetKind => ({
  assetKind: assetKind as ProviderRecipe['rights'][number]['assetKind'], license: 'Vertrag 1', storagePermitted: true, modificationPermitted: true,
}))

describe('catalog provider boundary', () => {
  it('lässt nur qualitäts- und rechtesichere Rezepte durch', () => {
    const recipe = { ...base, rights }
    expect(evaluateProviderPage({ recipes: [recipe], nextCursor: null }, new Date('2026-08-29')).accepted).toEqual([recipe])
  })

  it('blockiert Quellen ohne dauerhaftes Speicherrecht', () => {
    const recipe = { ...base, rights: rights.map(right => right.assetKind === 'recipe_text' ? { ...right, storagePermitted: false } : right) }
    const result = evaluateProviderPage({ recipes: [recipe], nextCursor: null }, new Date('2026-08-29'))
    expect(result.accepted).toEqual([])
    expect(result.rejected[0].errors).toContain('Lokale Speicherung unzulässig: recipe_text')
  })

  it('blockiert leere Lizenznachweise für einzelne Assets', () => {
    const recipe = { ...base, rights: rights.map(right => right.assetKind === 'nutrition' ? { ...right, license: '  ' } : right) }
    const result = evaluateProviderPage({ recipes: [recipe], nextCursor: null }, new Date('2026-08-29'))

    expect(result.accepted).toEqual([])
    expect(result.rejected[0].errors).toContain('Lizenznachweis fehlt: nutrition')
  })

  it('blockiert mehrdeutige doppelte Rechtenachweise', () => {
    const recipe = { ...base, rights: [...rights, { ...rights[1], license: 'Widersprüchlicher Vertrag' }] }
    const result = evaluateProviderPage({ recipes: [recipe], nextCursor: null }, new Date('2026-08-29'))

    expect(result.accepted).toEqual([])
    expect(result.rejected[0].errors).toContain('Rechtenachweis ist nicht eindeutig: image')
  })

  it('blockiert abgelaufene oder nicht bearbeitbare Rezepttexte', () => {
    const recipe = { ...base, rights: rights.map(right => right.assetKind === 'recipe_text' ? { ...right, modificationPermitted: false, validUntil: '2026-08-01' } : right) }
    const result = evaluateProviderPage({ recipes: [recipe], nextCursor: null }, new Date('2026-08-29T00:00:00Z'))
    expect(result.rejected[0].errors).toEqual(expect.arrayContaining([
      'Bearbeitung unzulässig: recipe_text', 'Nutzungsrecht abgelaufen: recipe_text',
    ]))
  })

  it('blockiert ungültige Ablaufdaten statt die Rechteprüfung zu umgehen', () => {
    const invalidDates = ['nicht-datiert', '2026-02-30', '2026-8-1']

    for (const validUntil of invalidDates) {
      const recipe = { ...base, rights: rights.map(right => right.assetKind === 'image' ? { ...right, validUntil } : right) }
      const result = evaluateProviderPage({ recipes: [recipe], nextCursor: null }, new Date('2026-08-29T00:00:00Z'))
      expect(result.accepted, validUntil).toEqual([])
      expect(result.rejected[0].errors, validUntil).toContain('Ungültiges Ablaufdatum: image')
    }
  })

  it('blockiert ungültige oder bereits verstrichene Löschfristen', () => {
    const cases = [
      { deletionDeadline: '2026-02-30', error: 'Ungültige Löschfrist: image' },
      { deletionDeadline: '2026-08-28', error: 'Löschfrist verstrichen: image' },
    ]

    for (const { deletionDeadline, error } of cases) {
      const recipe = { ...base, rights: rights.map(right => right.assetKind === 'image' ? { ...right, deletionDeadline } : right) }
      const result = evaluateProviderPage({ recipes: [recipe], nextCursor: null }, new Date('2026-08-29T00:00:00Z'))
      expect(result.accepted, deletionDeadline).toEqual([])
      expect(result.rejected[0].errors, deletionDeadline).toContain(error)
    }
  })

  it('ist über Wiederholung und Seiten hinweg idempotent und quarantänisiert Duplikate', () => {
    const ledger: ImportLedger = { byExternalKey: new Map(), byFingerprint: new Map() }
    const recipe = { ...base, rights }
    const first = processProviderPage('licensed-feed', { recipes: [recipe], nextCursor: '2' }, ledger, new Date('2026-08-29'))
    const repeated = processProviderPage('licensed-feed', { recipes: [recipe], nextCursor: null }, ledger, new Date('2026-08-29'))
    const duplicate = processProviderPage('other-feed', { recipes: [{ ...recipe, externalId: 'other-9' }], nextCursor: null }, ledger, new Date('2026-08-29'))

    expect(first.accepted).toHaveLength(1)
    expect(repeated.unchanged).toEqual(['source-1'])
    expect(duplicate.rejected[0].errors).toContain('Kanonisches Duplikat eines vorhandenen Rezepts')
    expect(ledger.byExternalKey.size).toBe(1)
  })
})
