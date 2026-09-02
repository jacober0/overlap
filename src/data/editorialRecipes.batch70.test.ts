import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'

const batch70Ids = [
  'overlap-238-schwarzwurzel-hafer-roesti-linsen-remoulade',
  'overlap-239-garnelen-suesskartoffel-kokos-curry-schwarzreis',
  'overlap-240-tempeh-birnen-rotkohl-strudel-senfdip',
  'overlap-241-schweinefilet-apfel-sellerie-gerstentopf',
  'overlap-242-erbsen-hirse-nocken-tomaten-fenchel-sugo',
  'overlap-243-schellfisch-kichererbsen-kartoffel-blech-mangold',
  'overlap-244-karotten-ricotta-buchweizen-crepes-spinat',
  'overlap-245-lupinen-pilz-paprika-ragout-maisnocken',
  'overlap-246-haehnchen-wirsing-reisrouladen-aprikosensauce',
  'overlap-247-rote-bete-linsen-hirsewaffeln-meerrettichbohnen',
  'overlap-248-forellen-blumenkohl-dinkel-pilaw-kraeuterpesto',
  'overlap-249-kuerbis-schwarze-bohnen-enchilada-auflauf',
]

describe('redaktioneller Rezeptbatch 70', () => {
  it('ergänzt zwölf eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipes.slice(-54, -42).map(recipe => recipe.externalId)).toEqual(batch70Ids)
    expect(editorialRecipes).toHaveLength(279)
    expect(publishableEditorialRecipes).toHaveLength(279)
    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T12:00:00Z'))).toEqual([])
  })

  it('weist plausible Nährwerte pro Portion statt Zwei-Portionen-Summen aus', () => {
    for (const recipe of editorialRecipes.slice(-24, -12)) {
      expect(recipe.nutrition.kcal, recipe.externalId).toBeGreaterThanOrEqual(400)
      expect(recipe.nutrition.kcal, recipe.externalId).toBeLessThanOrEqual(950)
      expect(recipe.nutrition.protein, recipe.externalId).toBeLessThanOrEqual(80)
      expect(recipe.nutrition.fiber, recipe.externalId).toBeLessThanOrEqual(35)
    }
  })

  it('enthält vollständige Koch-, Kosten-, Rechte- und Bilddaten', () => {
    for (const recipe of editorialRecipes.slice(-24, -12)) {
      expect(recipe.ingredients.length, recipe.externalId).toBeGreaterThanOrEqual(7)
      expect(recipe.steps.length, recipe.externalId).toBeGreaterThanOrEqual(5)
      expect(recipe.steps.every(step => step.length >= 12), recipe.externalId).toBe(true)
      expect(recipe.totalMinutes, recipe.externalId).toBeGreaterThanOrEqual(recipe.activeMinutes)
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
