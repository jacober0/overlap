import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialRecipes } from './editorialRecipes'
import { editorialRecipesBatch77 } from './editorialRecipesBatch77'

const batch77Ids = [
  'overlap-312-kuerbis-lupinen-dinkel-strudel',
  'overlap-313-kabeljau-spitzkohl-linsen-topf',
  'overlap-314-pilz-kartoffel-hirse-moussaka',
  'overlap-315-pute-rote-bete-buchweizen-pfanne',
  'overlap-316-brokkoli-bohnen-polenta-tarte',
  'overlap-317-forelle-wirsing-graupen-paeckchen',
  'overlap-318-tofu-pastinaken-soba-gratin',
  'overlap-319-lamm-kohlrabi-kichererbsen-eintopf',
  'overlap-320-apfel-quark-hafer-auflauf',
  'overlap-321-rote-linsen-fenchel-dinkel-pide',
]

describe('redaktioneller Rezeptbatch 77', () => {
  it('ergänzt zehn eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipesBatch77.map(recipe => recipe.externalId)).toEqual(batch77Ids)

    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T22:00:00Z'))).toEqual([])
  })

  it('enthält vollständige, kalkulierte und bildspezifische redaktionelle Daten', () => {
    for (const recipe of editorialRecipesBatch77) {
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
