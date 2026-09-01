import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialAppRecipes, editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'

describe('originaler redaktioneller Rezeptkatalog', () => {
  it('liefert vierundachtzig inhaltlich veröffentlichungsfähige Originalrezepte in fünfundzwanzig eigenständigen Batches', () => {
    expect(editorialRecipes.map(recipe => recipe.externalId)).toEqual([
      'overlap-013-rote-linsen-kokos-suppe',
      'overlap-014-pilz-graupen-risotto',
      'overlap-015-zucchini-kartoffel-roesti',
      'overlap-016-paprika-bohnen-reis',
      'overlap-017-fenchel-bohnen-schmortopf',
      'overlap-018-suesskartoffel-kichererbsen-blech',
      'overlap-019-spinat-kartoffel-frittata',
      'overlap-020-haehnchen-linsen-pfanne',
      'overlap-021-buchweizen-rote-bete-salat',
      'overlap-022-wirsing-kartoffel-bohnen-pfanne',
      'overlap-023-kabeljau-tomaten-orzo',
      'overlap-024-puten-hirse-baellchen',
      'overlap-025-kuerbis-dinkel-pfanne',
      'overlap-026-lachs-bohnen-kartoffel-salat',
      'overlap-027-blumenkohl-erbsen-dal',
      'overlap-028-rind-paprika-polenta',
      'overlap-029-auberginen-linsen-bulgur',
      'overlap-030-tofu-brokkoli-erdnuss-nudeln',
      'overlap-031-schweinefilet-apfel-wirsing',
      'overlap-032-mangold-ricotta-cannelloni',
      'overlap-033-rosenkohl-kartoffel-linsen-blech',
      'overlap-034-seelachs-lauch-kartoffel-topf',
      'overlap-035-paprika-hirse-pfanne-halloumi',
      'overlap-036-kuerbis-bohnen-chili',
      'overlap-037-pastinaken-weisse-bohnen-suppe',
      'overlap-038-haehnchen-spitzkohl-reis-pfanne',
      'overlap-039-rote-bete-kartoffel-gratin',
      'overlap-040-garnelen-erbsen-dinkel-orzotto',
      'overlap-041-weisse-bohnen-polenta-auflauf',
      'overlap-042-puten-kuerbis-bulgur-pfanne',
      'overlap-043-linsen-wurzelgemuese-hirse-topf',
      'overlap-044-forelle-rote-bete-graupen-salat',
      'overlap-045-gruenkohl-kartoffel-kichererbsen-pfanne',
      'overlap-046-pilz-lauch-spaetzle-walnuss',
      'overlap-047-ofenlachs-linsen-fenchel',
      'overlap-048-tofu-rotkohl-soba-pfanne',
      'overlap-049-miso-kuerbis-udon-pak-choi',
      'overlap-050-lauch-birnen-quiche',
      'overlap-051-rind-rote-bete-borschtsch',
      'overlap-052-sellerie-schnitzel-kartoffel-gurken-salat',
      'overlap-053-haehnchen-apfel-curry-naturreis',
      'overlap-054-bohnen-mais-enchiladas',
      'overlap-055-kartoffel-lauch-linsen-pastete',
      'overlap-056-kabeljau-kichererbsen-tagine',
      'overlap-057-brokkoli-kaese-hirse-taler',
      'overlap-058-kohlrabi-dinkel-erbsen-ragout',
      'overlap-059-haehnchen-pflaumen-couscous',
      'overlap-060-auberginen-quinoa-boote',
      'overlap-061-wirsing-pilz-buchweizen-rouladen',
      'overlap-062-muschel-fenchel-kartoffel-topf',
      'overlap-063-puten-suesskartoffel-erdnuss-eintopf',
      'overlap-064-schwarzwurzel-linsen-haselnuss-pfanne',
      'overlap-065-heilbutt-spinat-kartoffel-paeckchen',
      'overlap-066-reh-wurzelgemuese-dinkel-topf',
      'overlap-067-artischocken-erbsen-risotto',
      'overlap-068-lamm-kofta-kichererbsen-blech',
      'overlap-069-quark-mohn-schmarrn-zwetschgen',
      'overlap-070-eier-senfsauce-spinatkartoffeln',
      'overlap-071-maronen-rosenkohl-graupenpfanne',
      'overlap-072-schweinegeschnetzeltes-kohlrabi-vollkornreis',
      'overlap-073-raeuchertofu-steckrueben-gulasch',
      'overlap-074-makrelen-linsen-apfel-salat',
      'overlap-075-kuerbis-spinat-polenta-schnitten',
      'overlap-076-linsen-pilz-walnuss-braten',
      'overlap-077-saibling-kohlrabi-dinkel-risotto',
      'overlap-078-rind-bohnen-kuerbis-pfanne',
      'overlap-079-hirse-pilz-kohlrouladen',
      'overlap-080-puten-zucchini-mais-laibchen',
      'overlap-081-birnen-bohnen-kartoffel-eintopf',
      'overlap-082-herings-kartoffel-rote-bete-salat',
      'overlap-083-okra-linsen-hirse-eintopf',
      'overlap-084-spargel-dinkel-crepes-kraeuterquark',
      'overlap-085-miso-auberginen-edamame-reis',
      'overlap-086-ricotta-spinat-knoedel-tomatenragout',
      'overlap-087-haehnchen-aprikosen-gersten-pilaw',
      'overlap-088-tempeh-sauerkraut-kartoffel-pfanne',
      'overlap-089-buchweizen-pilz-blini-rote-bete-quark',
      'overlap-090-dorade-fenchel-bohnen-blech',
      'overlap-091-lauch-tofu-wan-tan-suppe',
      'overlap-092-forellen-wirsing-kartoffel-auflauf',
      'overlap-093-rinderhack-paprika-buchweizen-pfanne',
      'overlap-094-lupinen-kartoffel-gulasch',
      'overlap-095-ziegenkaese-polenta-pfirsich',
      'overlap-096-huehnchen-bohnen-jambalaya',
    ])
    expect(validateCatalog(editorialRecipes, new Date('2026-08-31T12:00:00Z'))).toEqual([])
    expect(publishableEditorialRecipes).toHaveLength(84)
  })

  it('enthält Kochanleitung, Preisgrundlage, Allergene, Provenienz und Bildprompt vollständig', () => {
    for (const recipe of editorialRecipes) {
      expect(recipe.steps.length, recipe.externalId).toBeGreaterThanOrEqual(5)
      expect(recipe.steps.every(step => step.length >= 12), recipe.externalId).toBe(true)
      expect(recipe.priceBasis.length, recipe.externalId).toBeGreaterThanOrEqual(30)
      expect(recipe.provenance.length, recipe.externalId).toBeGreaterThanOrEqual(30)
      expect(recipe.imagePrompt.length, recipe.externalId).toBeGreaterThanOrEqual(80)
      expect(recipe.ingredients.every(ingredient => ingredient.category && ingredient.estimatedCostCents > 0), recipe.externalId).toBe(true)
      expect(recipe.allergens).toEqual([...new Set(recipe.ingredients.flatMap(ingredient => ingredient.allergens ?? []))])
      expect(recipe.rights.map(right => right.assetKind).sort()).toEqual(['image', 'nutrition', 'recipe_text'])
    }
  })

  it('hält inhaltlich geprüfte Rezepte ohne bestandenes Bild aus dem App-Katalog zurück', () => {
    expect(editorialAppRecipes).toHaveLength(57)
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('miso-auberginen-edamame-reis')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('ricotta-spinat-knoedel-tomatenragout')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('haehnchen-aprikosen-gersten-pilaw')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('tempeh-sauerkraut-kartoffel-pfanne')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('buchweizen-pilz-blini-rote-bete-quark')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('dorade-fenchel-bohnen-blech')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('lauch-tofu-wan-tan-suppe')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('forellen-wirsing-kartoffel-auflauf')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('rinderhack-paprika-buchweizen-pfanne')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('eier-senfsauce-spinatkartoffeln')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('maronen-rosenkohl-graupenpfanne')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('schweinegeschnetzeltes-kohlrabi-vollkornreis')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('raeuchertofu-steckrueben-gulasch')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('makrelen-linsen-apfel-salat')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('kuerbis-spinat-polenta-schnitten')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('linsen-pilz-walnuss-braten')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('saibling-kohlrabi-dinkel-risotto')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('rind-bohnen-kuerbis-pfanne')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('hirse-pilz-kohlrouladen')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('puten-zucchini-mais-laibchen')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('birnen-bohnen-kartoffel-eintopf')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('herings-kartoffel-rote-bete-salat')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('okra-linsen-hirse-eintopf')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('spargel-dinkel-crepes-kraeuterquark')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('lupinen-kartoffel-gulasch')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('ziegenkaese-polenta-pfirsich')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('huehnchen-bohnen-jambalaya')
  })
})
