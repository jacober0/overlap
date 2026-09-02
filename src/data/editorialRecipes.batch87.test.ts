import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'
import { editorialRecipesBatch87 } from './editorialRecipesBatch87'

const expected = [
  ['overlap-454-sellerie-apfel-linsen-roesti', 'Sellerie-Apfel-Linsen-Rösti mit Senfkraut'],
  ['overlap-455-makrele-kuerbis-graupen-kedgeree', 'Makrelen-Kürbis-Graupen-Kedgeree'],
  ['overlap-456-pute-quitte-hirse-tagine', 'Puten-Quitten-Hirse-Tagine'],
  ['overlap-457-rote-bete-ziegenkaese-buchweizen-piroggen', 'Rote-Bete-Ziegenkäse-Buchweizen-Piroggen'],
  ['overlap-458-tempeh-wirsing-reis-roulade', 'Tempeh-Wirsing-Reis-Roulade'],
  ['overlap-459-seehecht-erbsen-hafer-fischkuechle', 'Seehecht-Erbsen-Hafer-Fischküchle'],
  ['overlap-460-kaninchen-mangold-polenta-schmortopf', 'Kaninchen-Mangold-Polenta-Schmortopf'],
  ['overlap-461-kichererbsen-fenchel-teff-socca', 'Kichererbsen-Fenchel-Teff-Socca'],
  ['overlap-462-muschel-sellerie-dinkel-chowder', 'Muschel-Sellerie-Dinkel-Chowder'],
  ['overlap-463-tofu-rotkohl-graupen-braten', 'Tofu-Rotkohl-Graupen-Braten'],
  ['overlap-464-rind-kohlrabi-buchweizen-pelmeni', 'Rind-Kohlrabi-Buchweizen-Pelmeni'],
  ['overlap-465-kuerbis-maronen-linsen-boerek', 'Kürbis-Maronen-Linsen-Börek'],
  ['overlap-466-forelle-brokkoli-hirse-quiche', 'Forellen-Brokkoli-Hirse-Quiche'],
  ['overlap-467-haehnchen-schwarzwurzel-hafer-frikassee', 'Hähnchen-Schwarzwurzel-Hafer-Frikassee'],
  ['overlap-468-bohnen-rote-bete-dinkel-salat', 'Bohnen-Rote-Bete-Dinkel-Salat mit Meerrettich'],
  ['overlap-469-lamm-blumenkohl-bulgur-moussaka', 'Lamm-Blumenkohl-Bulgur-Moussaka'],
  ['overlap-470-lupinen-lauch-kartoffel-kroketten', 'Lupinen-Lauch-Kartoffel-Kroketten'],
  ['overlap-471-kabeljau-apfel-wirsing-strudel', 'Kabeljau-Apfel-Wirsing-Strudel'],
  ['overlap-472-auberginen-edamame-buchweizen-nudeln', 'Auberginen-Edamame-Buchweizen-Nudeln'],
  ['overlap-473-schwein-birne-graupen-kohlrouladen', 'Schweine-Birnen-Graupen-Kohlrouladen'],
] as const

describe('redaktioneller Rezeptbatch 87', () => {
  it('ergänzt zwanzig eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipesBatch87.map(recipe => [recipe.externalId, recipe.title])).toEqual(expected)
    expect(editorialRecipesBatch87.every(recipe => recipe.steps.length >= 5)).toBe(true)
    expect(editorialRecipes).toHaveLength(481)
    expect(publishableEditorialRecipes).toHaveLength(481)
    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T23:59:00Z'))).toEqual([])
  })
})
