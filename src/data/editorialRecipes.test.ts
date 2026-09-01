import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialAppRecipes, editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'

describe('originaler redaktioneller Rezeptkatalog', () => {
  it('liefert einhundertdreiundfünfzig inhaltlich veröffentlichungsfähige Originalrezepte in achtundvierzig eigenständigen Batches', () => {
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
      'overlap-097-rote-bete-bohnen-knoedel-wirsing',
      'overlap-098-sardinen-tomaten-vollkorn-couscous',
      'overlap-099-polenta-bohnen-tamale-auflauf',
      'overlap-100-gruenkern-zucchini-laibchen-tomatenbohnen',
      'overlap-101-schweinefilet-linsen-aprikosen-tagine',
      'overlap-102-tofu-mais-okonomiyaki',
      'overlap-103-seitan-pilz-wurzelgemuese-pie',
      'overlap-104-zander-senfkohl-hirse-paeckchen',
      'overlap-105-linsen-mangold-moussaka',
      'overlap-106-kuerbis-walnuss-lobio',
      'overlap-107-haehnchen-blumenkohl-buchweizen-blech',
      'overlap-108-spinat-paneer-kofta-curry',
      'overlap-109-gochujang-tempeh-glasnudelsalat',
      'overlap-110-ofenmakrele-rote-bete-meerrettich-hirse',
      'overlap-111-fenchel-linsen-lasagne-ziegenkaese',
      'overlap-112-kartoffel-erbsen-samosa-blech',
      'overlap-113-rind-brokkoli-udon-pfanne',
      'overlap-114-kichererbsen-mangold-farinata',
      'overlap-115-linsen-bulgur-koefte-schmorgemuese',
      'overlap-116-schweinehack-zitronengras-reisnudel-bowl',
      'overlap-117-lauch-linsen-buchweizen-galette',
      'overlap-118-aloo-tikki-linsen-raita',
      'overlap-119-garnelen-kuerbis-gnocchi-salbei',
      'overlap-120-puten-sellerie-paprikasch-dinkelspaetzle',
      'overlap-121-kimchi-tofu-kartoffel-eintopf',
      'overlap-122-seelachs-linsen-frikadellen-fenchelsalat',
      'overlap-123-mais-spinat-quinoa-puffer-bohnen-salsa',
      'overlap-124-weisse-bohnen-kuerbis-cassoulet',
      'overlap-125-saibling-mais-kartoffel-chowder',
      'overlap-126-rind-wirsing-pflaumen-schmortopf',
      'overlap-127-dinkel-maultaschen-kuerbis-linsen',
      'overlap-128-muschel-paprika-fregola',
      'overlap-129-brokkoli-kichererbsen-pakora-tomatenchutney',
      'overlap-130-rosenkohl-tempeh-bulgur-pilaw',
      'overlap-131-mangold-kartoffel-souffle',
      'overlap-132-puten-kohlrabi-rouladen-hirse',
      'overlap-133-erdnuss-auberginen-kochbananen-topf',
      'overlap-134-gochujang-lachs-gerste-pak-choi',
      'overlap-135-gefuellte-paprika-gruenkern-linsen',
      'overlap-136-spargel-linsen-erdbeer-salat',
      'overlap-137-forellen-hirse-kuechle-gurkensalat',
      'overlap-138-haehnchen-rhabarber-kichererbsen-tagine',
      'overlap-139-tofu-ananas-naturreis-pfanne',
      'overlap-140-tintenfisch-bohnen-polenta',
      'overlap-141-sellerie-linsen-strudel-apfelkraut',
      'overlap-142-raeuchertofu-brokkoli-dinkel-blech',
      'overlap-143-kabeljau-linsen-kokos-paeckchen',
      'overlap-144-pastinaken-buchweizen-gnocchi',
      'overlap-145-bohnen-rote-bete-falafel-hirse-taboule',
      'overlap-146-zander-sauerkraut-kartoffel-groestl',
      'overlap-147-puten-auberginen-bulgur-koefte-auflauf',
      'overlap-148-kartoffel-bohnen-pupusas-rotkohlsalat',
      'overlap-149-lachs-spinat-hirse-terrine-fenchelsalat',
      'overlap-150-rind-lauch-graupen-kroketten-rote-bete-joghurt',
      'overlap-151-tomaten-dill-gigantes-gerste-mangold',
      'overlap-152-lachs-kohl-okonomiyaki-edamame',
      'overlap-153-kuerbis-quark-knoedel-pilzragout',
      'overlap-154-sellerie-adzuki-miso-blech-sesam-hirse',
      'overlap-155-mangold-linsen-goezleme-paprika-joghurt',
      'overlap-156-haehnchen-shiitake-gyoza-spitzkohlsalat',
      'overlap-157-schwarze-bohnen-mais-arepas-kuerbis-salsa',
      'overlap-158-ei-pilz-buchweizen-bibimbap',
      'overlap-159-schellfisch-lauch-hafer-crumble',
      'overlap-160-weisse-bohnen-mangold-ribollita-polenta-crostini',
      'overlap-161-forellen-spinat-kartoffel-piroggen-rote-bete-salat',
      'overlap-162-rind-kuerbis-reis-kohlrouladen-paprikasauce',
      'overlap-163-rote-linsen-karotten-dhokla-erbsen-chutney',
      'overlap-164-sardinen-fenchel-kartoffel-tortilla',
      'overlap-165-zucchini-lamm-bulgur-rollen-tomatensauce',
    ])
    expect(validateCatalog(editorialRecipes, new Date('2026-08-31T12:00:00Z'))).toEqual([])
    expect(publishableEditorialRecipes).toHaveLength(153)
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

  it('leitet die Preisgrundlage des achtundvierzigsten Batches ohne handgepflegte Abweichung aus den Zutaten ab', () => {
    for (const recipe of editorialRecipes.slice(-3)) {
      expect(recipe.estimatedPriceCents, recipe.externalId).toBe(
        recipe.ingredients.reduce((total, ingredient) => total + ingredient.estimatedCostCents, 0),
      )
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
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('rote-bete-bohnen-knoedel-wirsing')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('sardinen-tomaten-vollkorn-couscous')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('polenta-bohnen-tamale-auflauf')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('gruenkern-zucchini-laibchen-tomatenbohnen')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('schweinefilet-linsen-aprikosen-tagine')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('tofu-mais-okonomiyaki')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('seitan-pilz-wurzelgemuese-pie')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('zander-senfkohl-hirse-paeckchen')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('linsen-mangold-moussaka')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('kuerbis-walnuss-lobio')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('haehnchen-blumenkohl-buchweizen-blech')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('spinat-paneer-kofta-curry')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('gochujang-tempeh-glasnudelsalat')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('ofenmakrele-rote-bete-meerrettich-hirse')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('fenchel-linsen-lasagne-ziegenkaese')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('kartoffel-erbsen-samosa-blech')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('rind-brokkoli-udon-pfanne')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('kichererbsen-mangold-farinata')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('linsen-bulgur-koefte-schmorgemuese')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('schweinehack-zitronengras-reisnudel-bowl')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('lauch-linsen-buchweizen-galette')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('aloo-tikki-linsen-raita')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('garnelen-kuerbis-gnocchi-salbei')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('puten-sellerie-paprikasch-dinkelspaetzle')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('kimchi-tofu-kartoffel-eintopf')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('seelachs-linsen-frikadellen-fenchelsalat')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('mais-spinat-quinoa-puffer-bohnen-salsa')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('weisse-bohnen-kuerbis-cassoulet')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('saibling-mais-kartoffel-chowder')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('rind-wirsing-pflaumen-schmortopf')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('dinkel-maultaschen-kuerbis-linsen')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('muschel-paprika-fregola')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('brokkoli-kichererbsen-pakora-tomatenchutney')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('rosenkohl-tempeh-bulgur-pilaw')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('mangold-kartoffel-souffle')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('puten-kohlrabi-rouladen-hirse')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('erdnuss-auberginen-kochbananen-topf')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('gochujang-lachs-gerste-pak-choi')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('gefuellte-paprika-gruenkern-linsen')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('spargel-linsen-erdbeer-salat')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('forellen-hirse-kuechle-gurkensalat')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('haehnchen-rhabarber-kichererbsen-tagine')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('tofu-ananas-naturreis-pfanne')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('tintenfisch-bohnen-polenta')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('sellerie-linsen-strudel-apfelkraut')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('raeuchertofu-brokkoli-dinkel-blech')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('kabeljau-linsen-kokos-paeckchen')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('pastinaken-buchweizen-gnocchi')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('bohnen-rote-bete-falafel-hirse-taboule')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('zander-sauerkraut-kartoffel-groestl')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('puten-auberginen-bulgur-koefte-auflauf')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('kartoffel-bohnen-pupusas-rotkohlsalat')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('lachs-spinat-hirse-terrine-fenchelsalat')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('rind-lauch-graupen-kroketten-rote-bete-joghurt')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('tomaten-dill-gigantes-gerste-mangold')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('lachs-kohl-okonomiyaki-edamame')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('kuerbis-quark-knoedel-pilzragout')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('sellerie-adzuki-miso-blech-sesam-hirse')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('mangold-linsen-goezleme-paprika-joghurt')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('haehnchen-shiitake-gyoza-spitzkohlsalat')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('schwarze-bohnen-mais-arepas-kuerbis-salsa')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('ei-pilz-buchweizen-bibimbap')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('schellfisch-lauch-hafer-crumble')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('weisse-bohnen-mangold-ribollita-polenta-crostini')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('forellen-spinat-kartoffel-piroggen-rote-bete-salat')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('rind-kuerbis-reis-kohlrouladen-paprikasauce')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('rote-linsen-karotten-dhokla-erbsen-chutney')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('sardinen-fenchel-kartoffel-tortilla')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('zucchini-lamm-bulgur-rollen-tomatensauce')
  })
})
