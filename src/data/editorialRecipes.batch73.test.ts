import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'
import { editorialRecipesBatch73 } from './editorialRecipesBatch73'

const batch73Ids = [
  'overlap-272-spitzkohl-linsen-kartoffel-pithivier',
  'overlap-273-seelachs-rote-bete-buchweizen-gratin',
  'overlap-274-lupinen-karotten-hirse-kofta-spinat',
  'overlap-275-rind-kuerbis-graupen-krapfen-wirsing',
  'overlap-276-auberginen-bohnen-polenta-roulade',
  'overlap-277-saibling-lauch-dinkel-kloesse-fenchel',
  'overlap-278-haehnchen-rote-linsen-mais-pastilla',
  'overlap-279-pilz-sellerie-hafer-schnitzel-bohnensalat',
  'overlap-280-garnelen-kohlrabi-reisnudel-nester',
  'overlap-281-tempeh-rote-bete-hirse-terrine-apfelkraut',
]

describe('redaktioneller Rezeptbatch 73', () => {
  it('ergänzt zehn eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipesBatch73.map(recipe => recipe.externalId)).toEqual(batch73Ids)
    expect(editorialRecipes).toHaveLength(333)
    expect(publishableEditorialRecipes).toHaveLength(333)
    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T12:00:00Z'))).toEqual([])
  })

  it('enthält vollständige, kalkulierte und bildspezifische redaktionelle Daten', () => {
    for (const recipe of editorialRecipesBatch73) {
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
