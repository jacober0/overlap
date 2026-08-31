import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'

describe('originaler redaktioneller Rezeptkatalog', () => {
  it('liefert zwanzig veröffentlichungsfähige Originalrezepte in fünf eigenständigen Batches', () => {
    expect(editorialRecipes.map(recipe => recipe.externalId)).toEqual([
      'overlap-013-rote-linsen-kokos-suppe',
      'overlap-014-pilz-graupen-risotto',
      'overlap-015-zucchini-kartoffel-roesti',
      'overlap-016-paprika-bohnen-reis',
      'overlap-017-fenchel-bohnen-schmortopf',
      'overlap-018-suesskartoffel-kichererbsen-blech',
      'overlap-019-spinat-kartoffel-frittata',
      'overlap-020-haehnchen-linsen-pfanne',
      'overlap-021-buchweizen-rote-bete-salat',
      'overlap-022-wirsing-kartoffel-bohnen-pfanne',
      'overlap-023-kabeljau-tomaten-orzo',
      'overlap-024-puten-hirse-baellchen',
      'overlap-025-kuerbis-dinkel-pfanne',
      'overlap-026-lachs-bohnen-kartoffel-salat',
      'overlap-027-blumenkohl-erbsen-dal',
      'overlap-028-rind-paprika-polenta',
      'overlap-029-auberginen-linsen-bulgur',
      'overlap-030-tofu-brokkoli-erdnuss-nudeln',
      'overlap-031-schweinefilet-apfel-wirsing',
      'overlap-032-mangold-ricotta-cannelloni',
    ])
    expect(validateCatalog(editorialRecipes, new Date('2026-08-31T12:00:00Z'))).toEqual([])
    expect(publishableEditorialRecipes).toHaveLength(20)
  })

  it('enthält Kochanleitung, Preisgrundlage, Allergene, Provenienz und Bildprompt vollständig', () => {
    for (const recipe of editorialRecipes) {
      expect(recipe.steps.length, recipe.externalId).toBeGreaterThanOrEqual(5)
      expect(recipe.steps.every(step => step.length >= 12), recipe.externalId).toBe(true)
      expect(recipe.priceBasis.length, recipe.externalId).toBeGreaterThanOrEqual(30)
      expect(recipe.provenance.length, recipe.externalId).toBeGreaterThanOrEqual(30)
      expect(recipe.imagePrompt.length, recipe.externalId).toBeGreaterThanOrEqual(80)
      expect(recipe.ingredients.every(ingredient => ingredient.category && ingredient.estimatedCostCents > 0), recipe.externalId).toBe(true)
      expect(recipe.allergens).toEqual([...new Set(recipe.ingredients.flatMap(ingredient => ingredient.allergens ?? []))])
      expect(recipe.rights.map(right => right.assetKind).sort()).toEqual(['image', 'nutrition', 'recipe_text'])
    }
  })
})
