import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'
import { editorialRecipesBatch74 } from './editorialRecipesBatch74'

const batch74Ids = [
  'overlap-282-kichererbsen-artischocken-dinkel-paella',
  'overlap-283-pute-pastinake-buchweizen-rouladen',
  'overlap-284-forelle-erbsen-kartoffel-souffle',
  'overlap-285-schwarze-bohnen-kuerbis-empanadas',
  'overlap-286-kalb-mangold-hirse-frikassee',
  'overlap-287-tofu-fenchel-soba-taschen',
  'overlap-288-ei-rote-bete-linsen-tortilla',
  'overlap-289-kaninchen-wirsing-polenta-schmortopf',
  'overlap-290-blumenkohl-weisse-bohnen-dinkel-gnudi',
  'overlap-291-muschel-lauch-graupen-chowder',
]

describe('redaktioneller Rezeptbatch 74', () => {
  it('ergänzt zehn eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipesBatch74.map(recipe => recipe.externalId)).toEqual(batch74Ids)
    expect(editorialRecipes).toHaveLength(345)
    expect(publishableEditorialRecipes).toHaveLength(345)
    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T18:00:00Z'))).toEqual([])
  })

  it('enthält vollständige, kalkulierte und bildspezifische redaktionelle Daten', () => {
    for (const recipe of editorialRecipesBatch74) {
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
