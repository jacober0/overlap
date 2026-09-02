import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialAppRecipes, editorialRecipes } from './editorialRecipes'
import { editorialRecipesBatch80 } from './editorialRecipesBatch80'

const expected = [
  ['overlap-346-rosenkohl-bohnen-dinkel-pithivier', 'Rosenkohl-Bohnen-Dinkel-Pithivier'],
  ['overlap-347-zander-kuerbis-buchweizen-papillote', 'Zander-Kürbis-Buchweizen-Papillote'],
  ['overlap-348-rind-linsen-wirsing-manti', 'Rind-Linsen-Wirsing-Manti'],
  ['overlap-349-tempeh-rote-bete-hirse-bao', 'Tempeh-Rote-Bete-Hirse-Bao'],
  ['overlap-350-garnelen-kohlrabi-polenta-spiesse', 'Garnelen-Kohlrabi-Polenta-Spieße'],
  ['overlap-351-kuerbis-lupinen-dinkel-cannelloni', 'Kürbis-Lupinen-Dinkel-Cannelloni'],
  ['overlap-352-ente-rotkohl-graupen-kroketten', 'Enten-Rotkohl-Graupen-Kroketten'],
  ['overlap-353-brokkoli-kichererbsen-teff-taler', 'Brokkoli-Kichererbsen-Teff-Taler'],
  ['overlap-354-forelle-lauch-kartoffel-samosa', 'Forellen-Lauch-Kartoffel-Samosa'],
  ['overlap-355-pilz-linsen-buchweizen-sarma', 'Pilz-Linsen-Buchweizen-Sarma'],
  ['overlap-356-puten-spinat-mais-arepas', 'Puten-Spinat-Mais-Arepas'],
  ['overlap-357-schwarzwurzel-bohnen-hafer-pie', 'Schwarzwurzel-Bohnen-Hafer-Pie'],
] as const

describe('redaktioneller Rezeptbatch 80', () => {
  it('ergänzt zwölf eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipesBatch80.map(recipe => [recipe.externalId, recipe.title])).toEqual(expected)

    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T23:59:00Z'))).toEqual([])
    for (const recipe of editorialRecipesBatch80) expect(editorialAppRecipes.map(item => item.id)).not.toContain(recipe.appId)
  })

  it('enthält vollständige, kalkulierte und bildspezifische redaktionelle Daten', () => {
    for (const recipe of editorialRecipesBatch80) {
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
