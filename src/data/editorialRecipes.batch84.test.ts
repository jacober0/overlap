import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'

const expected = [
  ['overlap-394-lupinen-kuerbis-arancini', 'Lupinen-Kürbis-Arancini mit Mangoldragout'],
  ['overlap-395-seelachs-rote-bete-hirse-fishcakes', 'Seelachs-Rote-Bete-Hirse-Fishcakes'],
  ['overlap-396-ente-wirsing-buchweizen-pfanne', 'Enten-Wirsing-Buchweizen-Pfanne mit Birne'],
  ['overlap-397-pastinaken-linsen-dinkel-empanadas', 'Pastinaken-Linsen-Dinkel-Empanadas'],
  ['overlap-398-garnelen-polenta-paprika-spiesse', 'Garnelen-Polenta-Paprika-Spieße'],
  ['overlap-399-kalb-spinat-graupen-baellchen', 'Kalb-Spinat-Graupen-Bällchen in Tomatensugo'],
  ['overlap-400-kuerbis-adzuki-reisbaellchen', 'Kürbis-Adzuki-Reisbällchen mit Pak Choi'],
  ['overlap-401-zander-blumenkohl-dinkel-gratin', 'Zander-Blumenkohl-Dinkel-Gratin'],
  ['overlap-402-schwarzwurzel-tofu-buchweizen-tarte', 'Schwarzwurzel-Tofu-Buchweizen-Tarte'],
  ['overlap-403-huhn-fenchel-linsen-pastete', 'Hähnchen-Fenchel-Linsen-Pastete'],
  ['overlap-404-rote-bete-quark-hirse-nocken', 'Rote-Bete-Quark-Hirse-Nocken mit Lauch'],
  ['overlap-405-makrele-bohnen-dinkel-pide', 'Makrelen-Bohnen-Dinkel-Pide'],
  ['overlap-406-tempeh-kohlrabi-reis-katsu', 'Tempeh-Kohlrabi-Reis-Katsu'],
  ['overlap-407-rind-pilz-polenta-involtini', 'Rind-Pilz-Polenta-Involtini'],
  ['overlap-408-kichererbsen-lauch-buchweizen-pie', 'Kichererbsen-Lauch-Buchweizen-Pie'],
  ['overlap-409-forelle-kuerbis-hafer-kloesse', 'Forellen-Kürbis-Hafer-Klöße'],
  ['overlap-410-seitan-wirsing-hirse-paprikasch', 'Seitan-Wirsing-Hirse-Paprikasch'],
  ['overlap-411-schwein-mangold-kartoffel-dumplings', 'Schweine-Mangold-Kartoffel-Dumplings'],
  ['overlap-412-linsen-sellerie-teff-taler', 'Linsen-Sellerie-Teff-Taler mit Apfelkraut'],
  ['overlap-413-saibling-erbsen-dinkel-timbale', 'Saibling-Erbsen-Dinkel-Timbale'],
] as const

describe('redaktioneller Rezeptbatch 84', () => {
  it('ergänzt zwanzig eigenständige und inhaltlich veröffentlichungsfähige Originalrezepte', () => {
    const actual = editorialRecipes.filter(recipe => {
      const number = Number(recipe.externalId.split('-')[1])
      return number >= 394 && number <= 413
    })
    expect(actual.map(recipe => [recipe.externalId, recipe.title])).toEqual(expected)
    expect(editorialRecipes).toHaveLength(441)
    expect(publishableEditorialRecipes).toHaveLength(441)
    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T23:59:00Z'))).toEqual([])
  })
})
