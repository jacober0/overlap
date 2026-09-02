import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'
import { editorialRecipesBatch72 } from './editorialRecipesBatch72'

const batch72Ids = [
  'overlap-262-wurzelgemuese-linsen-dinkel-cobbler',
  'overlap-263-zander-kuerbis-graupen-risotto',
  'overlap-264-tempeh-wirsing-kartoffel-gulasch',
  'overlap-265-haehnchen-fenchel-bohnen-schmortopf',
  'overlap-266-rote-bete-quark-hirse-nocken-spinat',
  'overlap-267-kabeljau-lauch-linsen-auflauf',
  'overlap-268-kichererbsen-pilz-buchweizen-laibchen',
  'overlap-269-pute-rote-bete-dinkel-pilaw',
  'overlap-270-tofu-blumenkohl-erdnuss-curry',
  'overlap-271-forelle-steckruebe-kartoffel-blech',
]

describe('redaktioneller Rezeptbatch 72', () => {
  it('ergänzt zehn eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipesBatch72.map(recipe => recipe.externalId)).toEqual(batch72Ids)
    expect(editorialRecipes).toHaveLength(345)
    expect(publishableEditorialRecipes).toHaveLength(345)
    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T12:00:00Z'))).toEqual([])
  })

  it('enthält vollständige, kalkulierte und bildspezifische redaktionelle Daten', () => {
    for (const recipe of editorialRecipesBatch72) {
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
