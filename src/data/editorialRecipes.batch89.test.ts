import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'
import { editorialRecipesBatch89 } from './editorialRecipesBatch89'

const expected = [
  ['overlap-494-kichererbsen-mangold-polenta-gnocchi', 'Kichererbsen-Mangold-Polenta-Gnocchi'],
  ['overlap-495-kabeljau-kuerbis-hafer-kedgeree', 'Kabeljau-Kürbis-Hafer-Kedgeree'],
  ['overlap-496-rote-bete-lupinen-buchweizen-piroggen', 'Rote-Bete-Lupinen-Buchweizen-Piroggen'],
  ['overlap-497-pute-schwarzwurzel-graupen-frikadellen', 'Puten-Schwarzwurzel-Graupen-Frikadellen'],
  ['overlap-498-tofu-wirsing-reis-galette', 'Tofu-Wirsing-Reis-Galette'],
  ['overlap-499-reh-maronen-hirse-pastete', 'Reh-Maronen-Hirse-Pastete'],
  ['overlap-500-bohnen-fenchel-teff-gnocchi', 'Bohnen-Fenchel-Teff-Gnocchi'],
  ['overlap-501-forelle-steckruebe-linsen-roulade', 'Forellen-Steckrüben-Linsen-Roulade'],
  ['overlap-502-blumenkohl-tempeh-dinkel-biryani', 'Blumenkohl-Tempeh-Dinkel-Biryani'],
  ['overlap-503-kalb-kohlrabi-hafer-pilaw', 'Kalb-Kohlrabi-Hafer-Pilaw'],
  ['overlap-504-kuerbis-edamame-buchweizen-krapfen', 'Kürbis-Edamame-Buchweizen-Krapfen'],
  ['overlap-505-sardinen-lauch-kartoffel-clafoutis', 'Sardinen-Lauch-Kartoffel-Clafoutis'],
  ['overlap-506-schwarze-bohnen-pastinaken-mais-chilaquiles', 'Schwarze-Bohnen-Pastinaken-Mais-Chilaquiles'],
  ['overlap-507-haehnchen-rote-bete-graupen-dolma', 'Hähnchen-Rote-Bete-Graupen-Dolma'],
  ['overlap-508-seitan-rosenkohl-hirse-pastete', 'Seitan-Rosenkohl-Hirse-Pastete'],
  ['overlap-509-garnelen-mangold-linsen-lasagne', 'Garnelen-Mangold-Linsen-Lasagne'],
  ['overlap-510-quark-birne-mohn-hirseauflauf', 'Quark-Birnen-Mohn-Hirseauflauf'],
  ['overlap-511-lamm-aubergine-teff-moussaka', 'Lamm-Auberginen-Teff-Moussaka'],
  ['overlap-512-sellerie-erbsen-dinkel-bao', 'Sellerie-Erbsen-Dinkel-Bao'],
] as const

describe('redaktioneller Rezeptbatch 89', () => {
  it('erreicht mit neunzehn eigenständigen vollständigen Rezepten das Inhaltsgate von 500 Originalrezepten', () => {
    expect(editorialRecipesBatch89.map(recipe => [recipe.externalId, recipe.title])).toEqual(expected)
    expect(editorialRecipesBatch89.every(recipe => recipe.ingredients.length >= 7)).toBe(true)
    expect(editorialRecipesBatch89.every(recipe => recipe.steps.length >= 5)).toBe(true)
    expect(editorialRecipesBatch89.every(recipe => recipe.imagePrompt.length >= 100)).toBe(true)
    expect(editorialRecipes).toHaveLength(500)
    expect(publishableEditorialRecipes).toHaveLength(500)
    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T23:59:00Z'))).toEqual([])
  })
})
