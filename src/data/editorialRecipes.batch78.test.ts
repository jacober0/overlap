import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialAppRecipes, editorialRecipes } from './editorialRecipes'
import { editorialRecipesBatch78 } from './editorialRecipesBatch78'

const batch78Ids = [
  'overlap-322-wirsing-weisse-bohnen-dinkel-lasagne',
  'overlap-323-seelachs-kuerbis-graupen-risotto',
  'overlap-324-haehnchen-pastinaken-linsen-blech',
  'overlap-325-rote-bete-kichererbsen-knoedel',
  'overlap-326-schweinefilet-apfel-polenta-pfanne',
  'overlap-327-blumenkohl-erbsen-hafer-korma',
  'overlap-328-forellen-kartoffel-spinat-roesti',
  'overlap-329-lupinen-paprika-buchweizen-gulasch',
  'overlap-330-rind-wurzelgemuese-hirse-pastete',
  'overlap-331-birnen-quark-dinkel-schmarrn',
  'overlap-332-tofu-rosenkohl-reisnudel-salat',
  'overlap-333-kabeljau-bohnen-fenchel-auflauf',
]

const batch78Titles = [
  'Wirsing-Weiße-Bohnen-Dinkel-Lasagne',
  'Seelachs-Kürbis-Graupen-Risotto',
  'Hähnchen-Pastinaken-Linsen-Blech',
  'Rote-Bete-Kichererbsen-Knödel',
  'Schweinefilet-Apfel-Polenta-Pfanne',
  'Blumenkohl-Erbsen-Hafer-Korma',
  'Forellen-Kartoffel-Spinat-Rösti',
  'Lupinen-Paprika-Buchweizen-Gulasch',
  'Rind-Wurzelgemüse-Hirse-Pastete',
  'Birnen-Quark-Dinkel-Schmarrn',
  'Tofu-Rosenkohl-Reisnudel-Salat',
  'Kabeljau-Bohnen-Fenchel-Auflauf',
]

describe('redaktioneller Rezeptbatch 78', () => {
  it('ergänzt zwölf eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipesBatch78.map(recipe => recipe.externalId)).toEqual(batch78Ids)
    expect(editorialRecipesBatch78.map(recipe => recipe.title)).toEqual(batch78Titles)

    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T23:00:00Z'))).toEqual([])
    for (const recipe of editorialRecipesBatch78) {
      expect(editorialAppRecipes.map(item => item.id)).not.toContain(recipe.appId)
    }
  })

  it('enthält vollständige, kalkulierte und bildspezifische redaktionelle Daten', () => {
    for (const recipe of editorialRecipesBatch78) {
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
