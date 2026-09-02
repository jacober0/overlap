import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'
import { editorialRecipesBatch88 } from './editorialRecipesBatch88'

const expected = [
  ['overlap-474-spitzkohl-kichererbsen-hirse-krapfen', 'Spitzkohl-Kichererbsen-Hirse-Krapfen'],
  ['overlap-475-saibling-pastinaken-buchweizen-gratin', 'Saibling-Pastinaken-Buchweizen-Gratin'],
  ['overlap-476-rind-mangold-polenta-pastete', 'Rind-Mangold-Polenta-Pastete'],
  ['overlap-477-tofu-quitte-reis-baellchen', 'Tofu-Quitten-Reisbällchen mit Pak Choi'],
  ['overlap-478-schellfisch-rote-bete-linsen-terrine', 'Schellfisch-Rote-Bete-Linsen-Terrine'],
  ['overlap-479-kuerbis-pilz-dinkel-dampfnudeln', 'Kürbis-Pilz-Dinkel-Dampfnudeln'],
  ['overlap-480-pute-rosenkohl-graupen-salat', 'Puten-Rosenkohl-Graupen-Salat'],
  ['overlap-481-bohnen-sellerie-hafer-wellington', 'Bohnen-Sellerie-Hafer-Wellington'],
  ['overlap-482-garnelen-lauch-teff-puffer', 'Garnelen-Lauch-Teff-Puffer'],
  ['overlap-483-lamm-wirsing-buchweizen-pie', 'Lamm-Wirsing-Buchweizen-Pie'],
  ['overlap-484-edamame-blumenkohl-reis-dumplings', 'Edamame-Blumenkohl-Reis-Dumplings'],
  ['overlap-485-forelle-karotte-hirse-souffle', 'Forellen-Karotten-Hirse-Soufflé'],
  ['overlap-486-schwein-steckruebe-linsen-ragout', 'Schweine-Steckrüben-Linsen-Ragout'],
  ['overlap-487-kohlrabi-lupinen-dinkel-tarte', 'Kohlrabi-Lupinen-Dinkel-Tarte'],
  ['overlap-488-muschel-kuerbis-buchweizen-paella', 'Muschel-Kürbis-Buchweizen-Paella'],
  ['overlap-489-haehnchen-fenchel-hafer-roulade', 'Hähnchen-Fenchel-Hafer-Roulade'],
  ['overlap-490-linsen-apfel-polenta-schnitten', 'Linsen-Apfel-Polenta-Schnitten'],
  ['overlap-491-zander-rotkohl-hirse-strudel', 'Zander-Rotkohl-Hirse-Strudel'],
  ['overlap-492-tempeh-brokkoli-graupen-bibimbap', 'Tempeh-Brokkoli-Graupen-Bibimbap'],
  ['overlap-493-kalb-kuerbis-teff-klopse', 'Kalb-Kürbis-Teff-Klopse'],
] as const

describe('redaktioneller Rezeptbatch 88', () => {
  it('ergänzt zwanzig eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipesBatch88.map(recipe => [recipe.externalId, recipe.title])).toEqual(expected)
    expect(editorialRecipesBatch88.every(recipe => recipe.ingredients.length >= 7)).toBe(true)
    expect(editorialRecipesBatch88.every(recipe => recipe.steps.length >= 5)).toBe(true)
    expect(editorialRecipes).toHaveLength(500)
    expect(publishableEditorialRecipes).toHaveLength(500)
    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T23:59:00Z'))).toEqual([])
  })
})
