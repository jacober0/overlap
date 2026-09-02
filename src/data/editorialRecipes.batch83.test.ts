import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialAppRecipes, editorialRecipes } from './editorialRecipes'
import { editorialRecipesBatch83 } from './editorialRecipesBatch83'

const expected = [
  ['overlap-382-steckrueben-kichererbsen-kulcha', 'Steckrüben-Kichererbsen-Kulcha mit Spinat-Dal'],
  ['overlap-383-forelle-lauch-buchweizen-kulebjaka', 'Forellen-Lauch-Buchweizen-Kulebjaka'],
  ['overlap-384-rind-wirsing-reis-lemper', 'Rind-Wirsing-Reis-Lemper mit Gurkensalat'],
  ['overlap-385-blumenkohl-lupinen-polenta-sformato', 'Blumenkohl-Lupinen-Polenta-Sformato'],
  ['overlap-386-kabeljau-kuerbis-hirse-brandade', 'Kabeljau-Kürbis-Hirse-Brandade mit Bohnen'],
  ['overlap-387-seitan-rote-bete-dinkel-piroggen', 'Seitan-Rote-Bete-Dinkel-Piroggen mit Sauerkraut'],
  ['overlap-388-pute-mangold-hafer-roulade', 'Puten-Mangold-Hafer-Roulade mit Pilzrahm'],
  ['overlap-389-kohlrabi-erbsen-reis-idli', 'Kohlrabi-Erbsen-Reis-Idli mit Tomaten-Sambar'],
  ['overlap-390-schwein-apfel-graupen-cassoulet', 'Schweine-Apfel-Graupen-Cassoulet'],
  ['overlap-391-auberginen-tofu-hirse-moussaka', 'Auberginen-Tofu-Hirse-Moussaka'],
  ['overlap-392-saibling-pastinaken-linsen-kroketten', 'Saibling-Pastinaken-Linsen-Kroketten mit Feldsalat'],
  ['overlap-393-ziegenkaese-kuerbis-buchweizen-galette', 'Ziegenkäse-Kürbis-Buchweizen-Galette'],
] as const

describe('redaktioneller Rezeptbatch 83', () => {
  it('ergänzt zwölf eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipesBatch83.map(recipe => [recipe.externalId, recipe.title])).toEqual(expected)

    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T23:59:00Z'))).toEqual([])
    for (const recipe of editorialRecipesBatch83) expect(editorialAppRecipes.map(item => item.id)).not.toContain(recipe.appId)
  })

  it('enthält vollständige, kalkulierte und bildspezifische redaktionelle Daten', () => {
    for (const recipe of editorialRecipesBatch83) {
      expect(recipe.ingredients.length, recipe.externalId).toBeGreaterThanOrEqual(8)
      expect(recipe.steps.length, recipe.externalId).toBeGreaterThanOrEqual(5)
      expect(recipe.steps.every(step => step.length >= 12), recipe.externalId).toBe(true)
      expect(recipe.totalMinutes, recipe.externalId).toBeGreaterThanOrEqual(recipe.activeMinutes)
      expect(recipe.nutrition.kcal, recipe.externalId).toBeGreaterThanOrEqual(400)
      expect(recipe.nutrition.kcal, recipe.externalId).toBeLessThanOrEqual(950)
      expect(recipe.estimatedPriceCents, recipe.externalId).toBe(recipe.ingredients.reduce((sum, item) => sum + item.estimatedCostCents, 0))
      expect(recipe.priceBasis.length, recipe.externalId).toBeGreaterThanOrEqual(30)
      expect(recipe.provenance.length, recipe.externalId).toBeGreaterThanOrEqual(30)
      expect(recipe.imagePrompt.length, recipe.externalId).toBeGreaterThanOrEqual(80)
      expect(recipe.allergens).toEqual([...new Set(recipe.ingredients.flatMap(item => item.allergens ?? []))])
      expect(recipe.rights.map(right => right.assetKind).sort()).toEqual(['image', 'nutrition', 'recipe_text'])
    }
  })
})
