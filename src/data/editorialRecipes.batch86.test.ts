import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'
import { editorialRecipesBatch86 } from './editorialRecipesBatch86'

const expected = [
  ['overlap-434-ziegenkaese-birnen-hirse-galette', 'Ziegenkäse-Birnen-Hirse-Galette'],
  ['overlap-435-schellfisch-kuerbis-bohnen-potpie', 'Schellfisch-Kürbis-Bohnen-Potpie'],
  ['overlap-436-lupinen-rosenkohl-buchweizen-bowl', 'Lupinen-Rosenkohl-Buchweizen-Bowl'],
  ['overlap-437-haehnchen-rote-bete-polenta-roulade', 'Hähnchen-Rote-Bete-Polenta-Roulade'],
  ['overlap-438-pilz-wirsing-dinkel-sarma', 'Pilz-Wirsing-Dinkel-Sarma'],
  ['overlap-439-garnelen-fenchel-hirse-paella', 'Garnelen-Fenchel-Hirse-Paella'],
  ['overlap-440-rind-pastinaken-hafer-pie', 'Rind-Pastinaken-Hafer-Pie'],
  ['overlap-441-kartoffel-mangold-linsen-knish', 'Kartoffel-Mangold-Linsen-Knish'],
  ['overlap-442-saibling-apfel-graupen-frikadellen', 'Saibling-Apfel-Graupen-Frikadellen'],
  ['overlap-443-tofu-blumenkohl-teff-curry', 'Tofu-Blumenkohl-Teff-Curry'],
  ['overlap-444-schwein-kuerbis-buchweizen-rouladen', 'Schweine-Kürbis-Buchweizen-Rouladen'],
  ['overlap-445-bohnen-lauch-polenta-crostata', 'Bohnen-Lauch-Polenta-Crostata'],
  ['overlap-446-kabeljau-spinat-hirse-kibbeh', 'Kabeljau-Spinat-Hirse-Kibbeh'],
  ['overlap-447-tempeh-rote-bete-dinkel-bao', 'Tempeh-Rote-Bete-Dinkel-Bao'],
  ['overlap-448-kalb-fenchel-linsen-lasagne', 'Kalb-Fenchel-Linsen-Lasagne'],
  ['overlap-449-kuerbis-edamame-reis-okonomiyaki', 'Kürbis-Edamame-Reis-Okonomiyaki'],
  ['overlap-450-forelle-schwarzwurzel-graupen-tarte', 'Forellen-Schwarzwurzel-Graupen-Tarte'],
  ['overlap-451-kichererbsen-brokkoli-hafer-dumplings', 'Kichererbsen-Brokkoli-Hafer-Dumplings'],
  ['overlap-452-pute-rotkohl-teff-kofta', 'Puten-Rotkohl-Teff-Kofta'],
  ['overlap-453-linsen-steckrueben-dinkel-cobbler', 'Linsen-Steckrüben-Dinkel-Cobbler'],
] as const

describe('redaktioneller Rezeptbatch 86', () => {
  it('ergänzt zwanzig eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipesBatch86.map(recipe => [recipe.externalId, recipe.title])).toEqual(expected)
    expect(editorialRecipesBatch86.every(recipe => recipe.steps.length >= 5)).toBe(true)
    expect(editorialRecipes).toHaveLength(441)
    expect(publishableEditorialRecipes).toHaveLength(441)
    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T23:59:00Z'))).toEqual([])
  })
})
