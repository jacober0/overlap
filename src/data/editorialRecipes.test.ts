import { describe, expect, it } from 'vitest'
import { validateCatalog } from '../domain/catalog'
import { editorialAppRecipes, editorialRecipes, publishableEditorialRecipes } from './editorialRecipes'

describe('originaler redaktioneller Rezeptkatalog', () => {
  it('liefert 381 inhaltlich veröffentlichungsfähige Originalrezepte in 83 eigenständigen Batches', () => {
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
      'overlap-166-blumenkohl-linsen-socca-tomatenrelish',
      'overlap-167-rotbarsch-bohnen-rote-bete-paeckchen-dillkartoffeln',
      'overlap-168-puten-mangold-linsen-crepes-paprikasauce',
      'overlap-169-steckrueben-kichererbsen-roesti-apfelkraut',
      'overlap-170-forellen-linsen-wan-tan-pak-choi-bruehe',
      'overlap-171-kuerbis-bohnen-dinkel-calzone-mangold',
      'overlap-172-kichererbsen-fenchel-panisse-ratatouille',
      'overlap-173-kalb-lauch-dinkel-frikassee-erbsen',
      'overlap-174-pflaumen-quark-buchweizen-auflauf-mandeln',
      'overlap-175-kartoffel-linsen-bao-rotkohl',
      'overlap-176-muschel-bohnen-safranreis-fenchel',
      'overlap-177-mais-quark-nocken-pilzragout',
      'overlap-178-haehnchen-mais-dinkel-tamales-bohnen-salsa',
      'overlap-179-seehecht-kartoffel-mais-empanadas-bohnensalat',
      'overlap-180-lauch-kichererbsen-hafer-kloesse-paprikakraut',
      'overlap-181-miso-steckrueben-soba-edamame',
      'overlap-182-garnelen-linsen-polenta-baellchen-fenchel',
      'overlap-183-schweinefilet-kuerbis-dinkelknoedel-wirsing',
      'overlap-184-kichererbsen-spinat-msemen-karotten-linsen-salat',
      'overlap-185-makrelen-kartoffel-kedgeree-erbsen',
      'overlap-186-blumenkohl-kaese-graupen-kroketten-lauchcreme',
      'overlap-187-kartoffel-edamame-korokke-kohlsalat',
      'overlap-188-saibling-linsen-spinat-strudel-fenchel',
      'overlap-189-auberginen-hirse-involtini-bohnencreme',
      'overlap-190-rote-bete-linsen-dinkel-pasteten-meerrettichkraut',
      'overlap-191-seelachs-kichererbsen-baellchen-spinat-curry',
      'overlap-192-puten-bohnen-paprika-pide-joghurtsalat',
      'overlap-193-tempeh-kuerbis-reisnudel-laab-rotkohl',
      'overlap-194-spinat-bohnen-mais-tschadi-paprikajoghurt',
      'overlap-195-kabeljau-erbsen-graupen-pie-lauch',
      'overlap-196-tofu-rote-bete-buchweizen-nocken-meerrettichkraut',
      'overlap-197-herings-apfel-lauch-dinkelflammkuchen-bohnensalat',
      'overlap-198-pilz-linsen-kartoffel-zrazy-gurkenschmand',
      'overlap-199-erbsen-tofu-dinkel-siu-mai-pak-choi',
      'overlap-200-lachs-rote-bete-kartoffel-galette-bohnensalat',
      'overlap-201-rind-sellerie-hirse-manti-paprikajoghurt',
      'overlap-202-kartoffel-linsen-dinkelwaffeln-pilzragout',
      'overlap-203-garnelen-kuerbis-naturreis-congee-pak-choi',
      'overlap-204-puten-wirsing-hirse-kibbeh-rote-bete-joghurt',
      'overlap-205-lupinen-spinat-dinkel-pelmeni-paprikabruehe',
      'overlap-206-haehnchen-pastinaken-haferkuechle-lauchgemuese',
      'overlap-207-bohnen-kuerbis-teff-injera-mangold',
      'overlap-208-linsen-walnuss-cevapcici-ajvar-hirse',
      'overlap-209-forellen-mais-buchweizen-tacos-krautsalat',
      'overlap-210-zucchini-ricotta-dinkel-ravioli-tomatensauce',
      'overlap-211-kuerbis-kichererbsen-hirse-katsu-rotkohlsalat',
      'overlap-212-sardinen-bohnen-vollkornpasta-fenchel',
      'overlap-213-haehnchen-kichererbsen-dosa-spinat-chutney',
      'overlap-214-rote-bete-buchweizen-galettes-linsencreme',
      'overlap-215-seelachs-kartoffel-erbsen-pie',
      'overlap-216-schweinefilet-apfel-wirsing-polenta',
      'overlap-217-wels-kuerbis-dinkel-ragout-meerrettich',
      'overlap-218-blumenkohl-lupinen-hirse-bobotie',
      'overlap-219-kaninchen-bohnen-oliven-schmortopf',
      'overlap-220-tofu-kuerbis-dinkel-momos-wirsing',
      'overlap-221-saibling-pastinaken-linsen-rote-bete-salat',
      'overlap-222-rind-mangold-bohnen-polenta-lasagne',
      'overlap-223-weisse-bohnen-spargel-dinkel-taboule-erdbeeren',
      'overlap-224-haehnchen-zucchini-hirse-souvlaki-bohnencreme',
      'overlap-225-raeucherforelle-kohlrabi-buchweizen-auflauf',
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
      'overlap-238-schwarzwurzel-hafer-roesti-linsen-remoulade',
      'overlap-239-garnelen-suesskartoffel-kokos-curry-schwarzreis',
      'overlap-240-tempeh-birnen-rotkohl-strudel-senfdip',
      'overlap-241-schweinefilet-apfel-sellerie-gerstentopf',
      'overlap-242-erbsen-hirse-nocken-tomaten-fenchel-sugo',
      'overlap-243-schellfisch-kichererbsen-kartoffel-blech-mangold',
      'overlap-244-karotten-ricotta-buchweizen-crepes-spinat',
      'overlap-245-lupinen-pilz-paprika-ragout-maisnocken',
      'overlap-246-haehnchen-wirsing-reisrouladen-aprikosensauce',
      'overlap-247-rote-bete-linsen-hirsewaffeln-meerrettichbohnen',
      'overlap-248-forellen-blumenkohl-dinkel-pilaw-kraeuterpesto',
      'overlap-249-kuerbis-schwarze-bohnen-enchilada-auflauf',
      'overlap-250-steckrueben-kichererbsen-haselnuss-braten-wirsing',
      'overlap-251-lachs-lauch-dinkel-pastete-erbsen',
      'overlap-252-tofu-kuerbis-soba-baellchen-mangoldbruehe',
      'overlap-253-kalb-pastinaken-linsen-frikassee',
      'overlap-254-blumenkohl-bohnen-teff-taler-paprikacreme',
      'overlap-255-sardinen-fenchel-tomaten-polenta',
      'overlap-256-pilz-rote-bete-hirse-piroggen-sauerkraut',
      'overlap-257-puten-brokkoli-reisnudel-auflauf-sesam',
      'overlap-258-kuerbis-lupinen-dinkel-knoedel-salbeikraut',
      'overlap-259-seelachs-mais-kartoffel-chowder',
      'overlap-260-auberginen-linsen-reis-timbale-tomatensugo',
      'overlap-261-rind-wirsing-buchweizen-rouladen-pilzsauce',
      'overlap-262-wurzelgemuese-linsen-dinkel-cobbler',
      'overlap-263-zander-kuerbis-graupen-risotto',
      'overlap-264-tempeh-wirsing-kartoffel-gulasch',
      'overlap-265-haehnchen-fenchel-bohnen-schmortopf',
      'overlap-266-rote-bete-quark-hirse-nocken-spinat',
      'overlap-267-kabeljau-lauch-linsen-auflauf',
      'overlap-268-kichererbsen-pilz-buchweizen-laibchen',
      'overlap-269-pute-rote-bete-dinkel-pilaw',
      'overlap-270-tofu-blumenkohl-erdnuss-curry',
      'overlap-271-forelle-steckruebe-kartoffel-blech',
      'overlap-272-spitzkohl-linsen-kartoffel-pithivier',
      'overlap-273-seelachs-rote-bete-buchweizen-gratin',
      'overlap-274-lupinen-karotten-hirse-kofta-spinat',
      'overlap-275-rind-kuerbis-graupen-krapfen-wirsing',
      'overlap-276-auberginen-bohnen-polenta-roulade',
      'overlap-277-saibling-lauch-dinkel-kloesse-fenchel',
      'overlap-278-haehnchen-rote-linsen-mais-pastilla',
      'overlap-279-pilz-sellerie-hafer-schnitzel-bohnensalat',
      'overlap-280-garnelen-kohlrabi-reisnudel-nester',
      'overlap-281-tempeh-rote-bete-hirse-terrine-apfelkraut',
      'overlap-282-kichererbsen-artischocken-dinkel-paella',
      'overlap-283-pute-pastinake-buchweizen-rouladen',
      'overlap-284-forelle-erbsen-kartoffel-souffle',
      'overlap-285-schwarze-bohnen-kuerbis-empanadas',
      'overlap-286-kalb-mangold-hirse-frikassee',
      'overlap-287-tofu-fenchel-soba-taschen',
      'overlap-288-ei-rote-bete-linsen-tortilla',
      'overlap-289-kaninchen-wirsing-polenta-schmortopf',
      'overlap-290-blumenkohl-weisse-bohnen-dinkel-gnudi',
      'overlap-291-muschel-lauch-graupen-chowder',
      'overlap-292-wirsing-kichererbsen-buchweizen-paeckchen',
      'overlap-293-seelachs-pastinaken-hirse-brandade',
      'overlap-294-schweinefilet-spitzkohl-graupen-pfanne',
      'overlap-295-rote-linsen-mais-polenta-schnitten',
      'overlap-296-kohlrabi-quark-dinkel-nocken',
      'overlap-297-makrelen-kuerbis-buchweizen-kuechle',
      'overlap-298-tofu-rosenkohl-reisnudel-nester',
      'overlap-299-rind-pastinaken-bohnen-tagine',
      'overlap-300-lauch-bergkaese-kartoffel-pie',
      'overlap-301-auberginen-kichererbsen-hafer-kofta',
      'overlap-302-steckrueben-weisse-bohnen-roesti',
      'overlap-303-saibling-rote-linsen-lauch-paeckchen',
      'overlap-304-haehnchen-polenta-mangold-roulade',
      'overlap-305-blumenkohl-tempeh-buchweizen-bowl',
      'overlap-306-kalbs-hirse-paprika-frikassee',
      'overlap-307-artischocken-erbsen-gersten-paella',
      'overlap-308-ziegenkaese-birnen-gruenkern-tarte',
      'overlap-309-garnelen-wirsing-reisnudel-pfanne',
      'overlap-310-sellerie-kichererbsen-dinkel-klopse',
      'overlap-311-entenbrust-rote-bete-graupen-salat',
      'overlap-312-kuerbis-lupinen-dinkel-strudel',
      'overlap-313-kabeljau-spitzkohl-linsen-topf',
      'overlap-314-pilz-kartoffel-hirse-moussaka',
      'overlap-315-pute-rote-bete-buchweizen-pfanne',
      'overlap-316-brokkoli-bohnen-polenta-tarte',
      'overlap-317-forelle-wirsing-graupen-paeckchen',
      'overlap-318-tofu-pastinaken-soba-gratin',
      'overlap-319-lamm-kohlrabi-kichererbsen-eintopf',
      'overlap-320-apfel-quark-hafer-auflauf',
      'overlap-321-rote-linsen-fenchel-dinkel-pide',
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
      'overlap-334-steckrueben-linsen-dinkel-gnocchi-gruenkohl',
      'overlap-335-saibling-rote-bete-hirse-kulebyaka',
      'overlap-336-puten-brokkoli-quinoa-paprika-rouladen',
      'overlap-337-kichererbsen-kohlrabi-buchweizen-katsu',
      'overlap-338-muschel-tomaten-bohnen-graupen-eintopf',
      'overlap-339-tofu-pastinaken-reispapier-paeckchen',
      'overlap-340-kalb-wirsing-polenta-involtini',
      'overlap-341-mais-linsen-hafer-tortilla',
      'overlap-342-lachs-lauch-dinkel-pastilla',
      'overlap-343-pilz-maronen-hirse-terrine',
      'overlap-344-auberginen-weisse-bohnen-dumplings-tomatensud',
      'overlap-345-haehnchen-spitzkohl-buchweizen-laab',
      'overlap-346-rosenkohl-bohnen-dinkel-pithivier',
      'overlap-347-zander-kuerbis-buchweizen-papillote',
      'overlap-348-rind-linsen-wirsing-manti',
      'overlap-349-tempeh-rote-bete-hirse-bao',
      'overlap-350-garnelen-kohlrabi-polenta-spiesse',
      'overlap-351-kuerbis-lupinen-dinkel-cannelloni',
      'overlap-352-ente-rotkohl-graupen-kroketten',
      'overlap-353-brokkoli-kichererbsen-teff-taler',
      'overlap-354-forelle-lauch-kartoffel-samosa',
      'overlap-355-pilz-linsen-buchweizen-sarma',
      'overlap-356-puten-spinat-mais-arepas',
      'overlap-357-schwarzwurzel-bohnen-hafer-pie',
      'overlap-358-kohlrabi-erbsen-dinkel-knoedel-pilzbruehe',
      'overlap-359-dorade-bohnen-fenchel-papillote',
      'overlap-360-reh-rote-bete-buchweizen-rouladen',
      'overlap-361-tofu-mangold-hirse-siu-mai',
      'overlap-362-kabeljau-kuerbis-graupen-chowder',
      'overlap-363-linsen-pastinaken-teff-enchiladas',
      'overlap-364-haehnchen-rosenkohl-polenta-saltimbocca',
      'overlap-365-auberginen-bohnen-dinkel-moussaka',
      'overlap-366-forelle-spitzkohl-quinoa-kroketten',
      'overlap-367-kuerbis-linsen-buchweizen-chebureki',
      'overlap-368-rind-brokkoli-hirse-dumplings',
      'overlap-369-weisse-bohnen-rote-bete-hafer-wellington',
      'overlap-370-schwarzkohl-bohnen-graupen-suppe',
      'overlap-371-seehecht-spinat-polenta-roulade',
      'overlap-372-haehnchen-rote-bete-quinoa-taboule',
      'overlap-373-linsen-pilz-dinkel-tourte',
      'overlap-374-tofu-brokkoli-buchweizen-tempura',
      'overlap-375-kalb-kohlrabi-hirse-klopse',
      'overlap-376-kuerbis-ricotta-graupen-gnocchi',
      'overlap-377-muschel-lauch-bohnen-pot-pie',
      'overlap-378-tempeh-wirsing-kartoffel-roesti',
      'overlap-379-lamm-auberginen-teff-kofta',
      'overlap-380-zander-rote-linsen-fenchel-baellchen',
      'overlap-381-pastinaken-edamame-reis-tteok',
      'overlap-382-steckrueben-kichererbsen-kulcha',
      'overlap-383-forelle-lauch-buchweizen-kulebjaka',
      'overlap-384-rind-wirsing-reis-lemper',
      'overlap-385-blumenkohl-lupinen-polenta-sformato',
      'overlap-386-kabeljau-kuerbis-hirse-brandade',
      'overlap-387-seitan-rote-bete-dinkel-piroggen',
      'overlap-388-pute-mangold-hafer-roulade',
      'overlap-389-kohlrabi-erbsen-reis-idli',
      'overlap-390-schwein-apfel-graupen-cassoulet',
      'overlap-391-auberginen-tofu-hirse-moussaka',
      'overlap-392-saibling-pastinaken-linsen-kroketten',
      'overlap-393-ziegenkaese-kuerbis-buchweizen-galette',
    ])
    expect(validateCatalog(editorialRecipes, new Date('2026-09-02T12:00:00Z'))).toEqual([])
    expect(publishableEditorialRecipes).toHaveLength(381)
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

  it('leitet die Preisgrundlage des dreiundachtzigsten Batches ohne handgepflegte Abweichung aus den Zutaten ab', () => {
    for (const recipe of editorialRecipes.slice(-12)) {
      expect(recipe.estimatedPriceCents, recipe.externalId).toBe(
        recipe.ingredients.reduce((total, ingredient) => total + ingredient.estimatedCostCents, 0),
      )
    }
  })

  it('hält inhaltlich geprüfte Rezepte ohne bestandenes Bild aus dem App-Katalog zurück', () => {
    expect(editorialAppRecipes).toHaveLength(57)
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('erbsen-tofu-dinkel-siu-mai-pak-choi')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('lachs-rote-bete-kartoffel-galette-bohnensalat')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('rind-sellerie-hirse-manti-paprikajoghurt')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('kartoffel-linsen-dinkelwaffeln-pilzragout')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('garnelen-kuerbis-naturreis-congee-pak-choi')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('puten-wirsing-hirse-kibbeh-rote-bete-joghurt')
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
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('blumenkohl-linsen-socca-tomatenrelish')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('rotbarsch-bohnen-rote-bete-paeckchen-dillkartoffeln')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('puten-mangold-linsen-crepes-paprikasauce')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('steckrueben-kichererbsen-roesti-apfelkraut')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('forellen-linsen-wan-tan-pak-choi-bruehe')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('kuerbis-bohnen-dinkel-calzone-mangold')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('kichererbsen-fenchel-panisse-ratatouille')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('kalb-lauch-dinkel-frikassee-erbsen')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('pflaumen-quark-buchweizen-auflauf-mandeln')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('kartoffel-linsen-bao-rotkohl')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('muschel-bohnen-safranreis-fenchel')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('mais-quark-nocken-pilzragout')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('haehnchen-mais-dinkel-tamales-bohnen-salsa')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('seehecht-kartoffel-mais-empanadas-bohnensalat')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('lauch-kichererbsen-hafer-kloesse-paprikakraut')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('miso-steckrueben-soba-edamame')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('garnelen-linsen-polenta-baellchen-fenchel')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('schweinefilet-kuerbis-dinkelknoedel-wirsing')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('kichererbsen-spinat-msemen-karotten-linsen-salat')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('makrelen-kartoffel-kedgeree-erbsen')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('blumenkohl-kaese-graupen-kroketten-lauchcreme')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('kartoffel-edamame-korokke-kohlsalat')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('saibling-linsen-spinat-strudel-fenchel')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('auberginen-hirse-involtini-bohnencreme')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('rote-bete-linsen-dinkel-pasteten-meerrettichkraut')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('seelachs-kichererbsen-baellchen-spinat-curry')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('puten-bohnen-paprika-pide-joghurtsalat')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('tempeh-kuerbis-reisnudel-laab-rotkohl')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('spinat-bohnen-mais-tschadi-paprikajoghurt')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('kabeljau-erbsen-graupen-pie-lauch')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('tofu-rote-bete-buchweizen-nocken-meerrettichkraut')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('herings-apfel-lauch-dinkelflammkuchen-bohnensalat')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('pilz-linsen-kartoffel-zrazy-gurkenschmand')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('lupinen-spinat-dinkel-pelmeni-paprikabruehe')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('haehnchen-pastinaken-haferkuechle-lauchgemuese')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('bohnen-kuerbis-teff-injera-mangold')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('linsen-walnuss-cevapcici-ajvar-hirse')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('forellen-mais-buchweizen-tacos-krautsalat')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('zucchini-ricotta-dinkel-ravioli-tomatensauce')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('kuerbis-kichererbsen-hirse-katsu-rotkohlsalat')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('sardinen-bohnen-vollkornpasta-fenchel')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('haehnchen-kichererbsen-dosa-spinat-chutney')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('rote-bete-buchweizen-galettes-linsencreme')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('seelachs-kartoffel-erbsen-pie')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('schweinefilet-apfel-wirsing-polenta')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('weisse-bohnen-spargel-dinkel-taboule-erdbeeren')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('haehnchen-zucchini-hirse-souvlaki-bohnencreme')
    expect(editorialAppRecipes.map(recipe => recipe.id)).not.toContain('raeucherforelle-kohlrabi-buchweizen-auflauf')

  })
})
