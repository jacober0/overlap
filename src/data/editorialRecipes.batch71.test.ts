import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'
import { editorialRecipesBatch71 } from './editorialRecipesBatch71'

const batch71Ids = [
  'overlap-250-steckrueben-kichererbsen-haselnuss-braten-wirsing',
  'overlap-251-lachs-lauch-dinkel-pastete-erbsen',
  'overlap-252-tofu-kuerbis-soba-baellchen-mangoldbruehe',
  'overlap-253-kalb-pastinaken-linsen-frikassee',
  'overlap-254-blumenkohl-bohnen-teff-taler-paprikacreme',
  'overlap-255-sardinen-fenchel-tomaten-polenta',
  'overlap-256-pilz-rote-bete-hirse-piroggen-sauerkraut',
  'overlap-257-puten-brokkoli-reisnudel-auflauf-sesam',
  'overlap-258-kuerbis-lupinen-dinkel-knoedel-salbeikraut',
  'overlap-259-seelachs-mais-kartoffel-chowder',
  'overlap-260-auberginen-linsen-reis-timbale-tomatensugo',
  'overlap-261-rind-wirsing-buchweizen-rouladen-pilzsauce',
]

describe('redaktioneller Rezeptbatch 71', () => {
  it('ergänzt zwölf eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipesBatch71.map(recipe => recipe.externalId)).toEqual(batch71Ids)
    expect(editorialRecipes).toHaveLength(381)
    expect(publishableEditorialRecipes).toHaveLength(381)
    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T12:00:00Z'))).toEqual([])
  })

  it('enthält pro Portion plausible Nährwerte und vollständige redaktionelle Daten', () => {
    for (const recipe of editorialRecipesBatch71) {
      expect(recipe.ingredients.length, recipe.externalId).toBeGreaterThanOrEqual(7)
      expect(recipe.steps.length, recipe.externalId).toBeGreaterThanOrEqual(5)
      expect(recipe.steps.every(step => step.length >= 12), recipe.externalId).toBe(true)
      expect(recipe.totalMinutes, recipe.externalId).toBeGreaterThanOrEqual(recipe.activeMinutes)
      expect(recipe.nutrition.kcal, recipe.externalId).toBeGreaterThanOrEqual(400)
      expect(recipe.nutrition.kcal, recipe.externalId).toBeLessThanOrEqual(950)
      expect(recipe.nutrition.protein, recipe.externalId).toBeLessThanOrEqual(80)
      expect(recipe.nutrition.fiber, recipe.externalId).toBeLessThanOrEqual(35)
      expect(recipe.estimatedPriceCents, recipe.externalId).toBe(
        recipe.ingredients.reduce((total, ingredient) => total + ingredient.estimatedCostCents, 0),
      )
      expect(recipe.priceBasis.length, recipe.externalId).toBeGreaterThanOrEqual(30)
      expect(recipe.provenance.length, recipe.externalId).toBeGreaterThanOrEqual(30)
      expect(recipe.imagePrompt.length, recipe.externalId).toBeGreaterThanOrEqual(80)
      expect(recipe.allergens).toEqual([...new Set(recipe.ingredients.flatMap(ingredient => ingredient.allergens ?? []))])
      expect(recipe.rights.map(right => right.assetKind).sort()).toEqual(['image', 'nutrition', 'recipe_text'])
    }
  })
})
