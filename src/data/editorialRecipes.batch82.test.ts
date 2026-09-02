import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialAppRecipes, editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'
import { editorialRecipesBatch82 } from './editorialRecipesBatch82'

const expected = [
  ['overlap-370-schwarzkohl-bohnen-graupen-suppe', 'Schwarzkohl-Bohnen-Graupen-Suppe mit Zitronenpesto'],
  ['overlap-371-seehecht-spinat-polenta-roulade', 'Seehecht-Spinat-Polenta-Roulade'],
  ['overlap-372-haehnchen-rote-bete-quinoa-taboule', 'Hähnchen-Rote-Bete-Quinoa-Taboulé'],
  ['overlap-373-linsen-pilz-dinkel-tourte', 'Linsen-Pilz-Dinkel-Tourte mit Wurzelgemüse'],
  ['overlap-374-tofu-brokkoli-buchweizen-tempura', 'Tofu-Brokkoli-Buchweizen-Tempura mit Rotkohlsalat'],
  ['overlap-375-kalb-kohlrabi-hirse-klopse', 'Kalb-Kohlrabi-Hirse-Klopse in Kapernsauce'],
  ['overlap-376-kuerbis-ricotta-graupen-gnocchi', 'Kürbis-Ricotta-Graupen-Gnocchi mit Salbei'],
  ['overlap-377-muschel-lauch-bohnen-pot-pie', 'Muschel-Lauch-Bohnen-Pot-Pie'],
  ['overlap-378-tempeh-wirsing-kartoffel-roesti', 'Tempeh-Wirsing-Kartoffel-Rösti mit Apfel-Senf-Salat'],
  ['overlap-379-lamm-auberginen-teff-kofta', 'Lamm-Auberginen-Teff-Kofta auf Tomatenbohnen'],
  ['overlap-380-zander-rote-linsen-fenchel-baellchen', 'Zander-Rote-Linsen-Fenchel-Bällchen mit Mangold'],
  ['overlap-381-pastinaken-edamame-reis-tteok', 'Pastinaken-Edamame-Reis-Tteok in Pilzbrühe'],
] as const

describe('redaktioneller Rezeptbatch 82', () => {
  it('ergänzt zwölf eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipesBatch82.map(recipe => [recipe.externalId, recipe.title])).toEqual(expected)
    expect(editorialRecipes).toHaveLength(369)
    expect(publishableEditorialRecipes).toHaveLength(369)
    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T23:59:00Z'))).toEqual([])
    for (const recipe of editorialRecipesBatch82) expect(editorialAppRecipes.map(item => item.id)).not.toContain(recipe.appId)
  })

  it('enthält vollständige, kalkulierte und bildspezifische redaktionelle Daten', () => {
    for (const recipe of editorialRecipesBatch82) {
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
