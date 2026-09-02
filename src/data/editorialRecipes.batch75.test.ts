import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'
import { editorialRecipesBatch75 } from './editorialRecipesBatch75'

const batch75Ids = [
  'overlap-292-wirsing-kichererbsen-buchweizen-paeckchen',
  'overlap-293-seelachs-pastinaken-hirse-brandade',
  'overlap-294-schweinefilet-spitzkohl-graupen-pfanne',
  'overlap-295-rote-linsen-mais-polenta-schnitten',
  'overlap-296-kohlrabi-quark-dinkel-nocken',
  'overlap-297-makrelen-kuerbis-buchweizen-kuechle',
  'overlap-298-tofu-rosenkohl-reisnudel-nester',
  'overlap-299-rind-pastinaken-bohnen-tagine',
  'overlap-300-lauch-bergkaese-kartoffel-pie',
  'overlap-301-auberginen-kichererbsen-hafer-kofta',
]

describe('redaktioneller Rezeptbatch 75', () => {
  it('ergänzt zehn eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipesBatch75.map(recipe => recipe.externalId)).toEqual(batch75Ids)
    expect(editorialRecipes).toHaveLength(345)
    expect(publishableEditorialRecipes).toHaveLength(345)
    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T20:00:00Z'))).toEqual([])
  })

  it('enthält vollständige, kalkulierte und bildspezifische redaktionelle Daten', () => {
    for (const recipe of editorialRecipesBatch75) {
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
