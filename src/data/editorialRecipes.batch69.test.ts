import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'

const batch69Ids = [
  'overlap-226-linsen-polenta-schnitten-pilzragout',
  'overlap-227-puten-fenchel-dinkelbaellchen-tomatensauce',
  'overlap-228-kichererbsen-spinat-reisbaellchen-mango-chutney',
  'overlap-229-zander-kartoffel-lauch-puffer-gurkensalat',
  'overlap-230-auberginen-bohnen-hirse-musaka',
  'overlap-231-rind-karotten-buchweizen-gulasch',
  'overlap-232-tofu-brokkoli-dinkel-frikadellen-rettichsalat',
  'overlap-233-muscheln-tomaten-gerste-paprika',
  'overlap-234-kuerbis-linsen-mais-pastete',
  'overlap-235-haehnchen-rote-bete-haferklopse-meerrettichsauce',
  'overlap-236-weisse-bohnen-zucchini-quinoa-gratin',
  'overlap-237-saibling-wirsing-kartoffel-roulade-senfsauce',
]

describe('redaktioneller Rezeptbatch 69', () => {
  it('ergänzt zwölf eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipes.slice(-46, -34).map(recipe => recipe.externalId)).toEqual(batch69Ids)
    expect(editorialRecipes).toHaveLength(259)
    expect(publishableEditorialRecipes).toHaveLength(259)
    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T12:00:00Z'))).toEqual([])
  })

  it('enthält vollständige Koch-, Kosten-, Rechte- und Bilddaten', () => {
    for (const recipe of editorialRecipes.slice(-36, -24)) {
      expect(recipe.ingredients.length, recipe.externalId).toBeGreaterThanOrEqual(7)
      expect(recipe.steps.length, recipe.externalId).toBeGreaterThanOrEqual(5)
      expect(recipe.steps.every(step => step.length >= 12), recipe.externalId).toBe(true)
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
