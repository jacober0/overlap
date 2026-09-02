import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'
import { editorialRecipesBatch76 } from './editorialRecipesBatch76'

const batch76Ids = [
  'overlap-302-steckrueben-weisse-bohnen-roesti',
  'overlap-303-saibling-rote-linsen-lauch-paeckchen',
  'overlap-304-haehnchen-polenta-mangold-roulade',
  'overlap-305-blumenkohl-tempeh-buchweizen-bowl',
  'overlap-306-kalbs-hirse-paprika-frikassee',
  'overlap-307-artischocken-erbsen-gersten-paella',
  'overlap-308-ziegenkaese-birnen-gruenkern-tarte',
  'overlap-309-garnelen-wirsing-reisnudel-pfanne',
  'overlap-310-sellerie-kichererbsen-dinkel-klopse',
  'overlap-311-entenbrust-rote-bete-graupen-salat',
]

describe('redaktioneller Rezeptbatch 76', () => {
  it('ergänzt zehn eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipesBatch76.map(recipe => recipe.externalId)).toEqual(batch76Ids)
    expect(editorialRecipes).toHaveLength(345)
    expect(publishableEditorialRecipes).toHaveLength(345)
    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T21:00:00Z'))).toEqual([])
  })

  it('enthält vollständige, kalkulierte und bildspezifische redaktionelle Daten', () => {
    for (const recipe of editorialRecipesBatch76) {
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
