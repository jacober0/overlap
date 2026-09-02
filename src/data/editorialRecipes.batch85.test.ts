import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialRecipes } from './editorialRecipes'
import { editorialRecipesBatch85 } from './editorialRecipesBatch85'

const expected = [
  ['overlap-414-mangold-bohnen-dinkel-strudel', 'Mangold-Bohnen-Dinkelstrudel mit Paprikasauce'],
  ['overlap-415-kabeljau-steckrueben-graupen-chowder', 'Kabeljau-Steckrüben-Graupen-Chowder'],
  ['overlap-416-tofu-pilz-hirse-terrine', 'Tofu-Pilz-Hirse-Terrine mit Karottenragout'],
  ['overlap-417-rind-kuerbis-linsen-samosas', 'Rind-Kürbis-Linsen-Samosas mit Minzjoghurt'],
  ['overlap-418-fenchel-erbsen-buchweizen-risotto', 'Fenchel-Erbsen-Buchweizen-Risotto'],
  ['overlap-419-saibling-wirsing-polenta-roulade', 'Saibling-Wirsing-Polenta-Roulade'],
  ['overlap-420-kichererbsen-rote-bete-teff-baellchen', 'Kichererbsen-Rote-Bete-Teff-Bällchen'],
  ['overlap-421-pute-lauch-kartoffel-pie', 'Puten-Lauch-Kartoffel-Pie mit Erbsen'],
  ['overlap-422-auberginen-lupinen-reis-kofta', 'Auberginen-Lupinen-Reis-Kofta'],
  ['overlap-423-muschel-tomaten-dinkel-paella', 'Muschel-Tomaten-Dinkel-Paella'],
  ['overlap-424-schwarzwurzel-linsen-hafer-gratin', 'Schwarzwurzel-Linsen-Hafer-Gratin'],
  ['overlap-425-haehnchen-brokkoli-buchweizen-momos', 'Hähnchen-Brokkoli-Buchweizen-Momos'],
  ['overlap-426-kuerbis-bohnen-mais-pozole', 'Kürbis-Bohnen-Mais-Pozole'],
  ['overlap-427-forelle-kohlrabi-dinkel-frikadellen', 'Forellen-Kohlrabi-Dinkel-Frikadellen'],
  ['overlap-428-tempeh-pastinaken-gersten-tagine', 'Tempeh-Pastinaken-Gersten-Tagine'],
  ['overlap-429-schwein-spinat-hirse-cannelloni', 'Schweine-Spinat-Hirse-Cannelloni'],
  ['overlap-430-blumenkohl-erbsen-reis-dosa', 'Blumenkohl-Erbsen-Reis-Dosa'],
  ['overlap-431-zander-apfel-wirsing-kroketten', 'Zander-Apfel-Wirsing-Kroketten'],
  ['overlap-432-linsen-paprika-polenta-tarte', 'Linsen-Paprika-Polenta-Tarte'],
  ['overlap-433-kalb-maronen-dinkel-ragout', 'Kalb-Maronen-Dinkel-Ragout'],
] as const

describe('redaktioneller Rezeptbatch 85', () => {
  it('ergänzt zwanzig eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    expect(editorialRecipesBatch85.map(recipe => [recipe.externalId, recipe.title])).toEqual(expected)
    expect(editorialRecipesBatch85.every(recipe => recipe.steps.length >= 5)).toBe(true)

    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T23:59:00Z'))).toEqual([])
  })
})
