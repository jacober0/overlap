import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialAppRecipes, editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'
import { editorialRecipesBatch79 } from './editorialRecipesBatch79'

const batch79Ids = [
  'overlap-334-steckrueben-linsen-dinkel-gnocchi-gruenkohl',
  'overlap-335-saibling-rote-bete-hirse-kulebyaka',
  'overlap-336-puten-brokkoli-quinoa-paprika-rouladen',
  'overlap-337-kichererbsen-kohlrabi-buchweizen-katsu',
  'overlap-338-muschel-tomaten-bohnen-graupen-eintopf',
  'overlap-339-tofu-pastinaken-reispapier-paeckchen',
  'overlap-340-kalb-wirsing-polenta-involtini',
  'overlap-341-mais-linsen-hafer-tortilla',
  'overlap-342-lachs-lauch-dinkel-pastilla',
  'overlap-343-pilz-maronen-hirse-terrine',
  'overlap-344-auberginen-weisse-bohnen-dumplings-tomatensud',
  'overlap-345-haehnchen-spitzkohl-buchweizen-laab',
]

const batch79Titles = [
  'Steckrüben-Linsen-Dinkel-Gnocchi mit Grünkohl',
  'Saibling-Rote-Bete-Hirse-Kulebyaka',
  'Puten-Brokkoli-Quinoa-Paprika-Rouladen',
  'Kichererbsen-Kohlrabi-Buchweizen-Katsu',
  'Muschel-Tomaten-Bohnen-Graupen-Eintopf',
  'Tofu-Pastinaken-Reispapier-Päckchen',
  'Kalb-Wirsing-Polenta-Involtini',
  'Mais-Linsen-Hafer-Tortilla',
  'Lachs-Lauch-Dinkel-Pastilla',
  'Pilz-Maronen-Hirse-Terrine',
  'Auberginen-Weiße-Bohnen-Dumplings im Tomatensud',
  'Hähnchen-Spitzkohl-Buchweizen-Laab',
]

describe('redaktioneller Rezeptbatch 79', () => {
  it('ergänzt zwölf eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipesBatch79.map(recipe => recipe.externalId)).toEqual(batch79Ids)
    expect(editorialRecipesBatch79.map(recipe => recipe.title)).toEqual(batch79Titles)
    expect(editorialRecipes).toHaveLength(357)
    expect(publishableEditorialRecipes).toHaveLength(357)
    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T23:30:00Z'))).toEqual([])
    for (const recipe of editorialRecipesBatch79) {
      expect(editorialAppRecipes.map(item => item.id)).not.toContain(recipe.appId)
    }
  })

  it('enthält vollständige, kalkulierte und bildspezifische redaktionelle Daten', () => {
    for (const recipe of editorialRecipesBatch79) {
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
