import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialAppRecipes, editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'
import { editorialRecipesBatch81 } from './editorialRecipesBatch81'

const expected = [
  ['overlap-358-kohlrabi-erbsen-dinkel-knoedel-pilzbruehe', 'Kohlrabi-Erbsen-Dinkel-Knödel in Pilzbrühe'],
  ['overlap-359-dorade-bohnen-fenchel-papillote', 'Doraden-Bohnen-Fenchel-Papillote'],
  ['overlap-360-reh-rote-bete-buchweizen-rouladen', 'Reh-Rote-Bete-Buchweizen-Rouladen'],
  ['overlap-361-tofu-mangold-hirse-siu-mai', 'Tofu-Mangold-Hirse-Siu-Mai'],
  ['overlap-362-kabeljau-kuerbis-graupen-chowder', 'Kabeljau-Kürbis-Graupen-Chowder'],
  ['overlap-363-linsen-pastinaken-teff-enchiladas', 'Linsen-Pastinaken-Teff-Enchiladas'],
  ['overlap-364-haehnchen-rosenkohl-polenta-saltimbocca', 'Hähnchen-Rosenkohl-Polenta-Saltimbocca'],
  ['overlap-365-auberginen-bohnen-dinkel-moussaka', 'Auberginen-Bohnen-Dinkel-Moussaka'],
  ['overlap-366-forelle-spitzkohl-quinoa-kroketten', 'Forellen-Spitzkohl-Quinoa-Kroketten'],
  ['overlap-367-kuerbis-linsen-buchweizen-chebureki', 'Kürbis-Linsen-Buchweizen-Chebureki'],
  ['overlap-368-rind-brokkoli-hirse-dumplings', 'Rind-Brokkoli-Hirse-Dumplings'],
  ['overlap-369-weisse-bohnen-rote-bete-hafer-wellington', 'Weiße-Bohnen-Rote-Bete-Hafer-Wellington'],
] as const

describe('redaktioneller Rezeptbatch 81', () => {
  it('ergänzt zwölf eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipesBatch81.map(recipe => [recipe.externalId, recipe.title])).toEqual(expected)
    expect(editorialRecipes).toHaveLength(357)
    expect(publishableEditorialRecipes).toHaveLength(357)
    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T23:59:00Z'))).toEqual([])
    for (const recipe of editorialRecipesBatch81) expect(editorialAppRecipes.map(item => item.id)).not.toContain(recipe.appId)
  })

  it('enthält vollständige, kalkulierte und bildspezifische redaktionelle Daten', () => {
    for (const recipe of editorialRecipesBatch81) {
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
