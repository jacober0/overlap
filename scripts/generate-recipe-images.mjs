#!/usr/bin/env node

import { existsSync } from 'node:fs'
import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ENV_PATH = '/opt/data/.env'
export const MODEL = '@cf/black-forest-labs/flux-1-schnell'
export const OVERLAP_STYLE_PRESET = 'Editorial landscape food photograph on a dark matte stone surface, warm natural side light from camera-left, soft directional shadows, consistent warm-neutral 4200K color temperature, consistent 45-degree camera angle at close table height, 50mm lens look, shallow but sufficient depth of field, realistic premium food styling, appetizing natural textures, restrained charcoal ceramic tableware. The same recognizable Overlap visual stage with subtle natural variations in plate, crop and one or two understated props.'

export const recipeImageManifest = [
  { id: 'tomatenpasta', dish: 'A shallow charcoal bowl of creamy tomato pasta, glossy coral-red sauce coating short pasta, crisp golden herb breadcrumbs and fresh basil leaves clearly visible; no meat.' },
  { id: 'kichererbsencurry', dish: 'A dark ceramic bowl of golden coconut chickpea curry, abundant whole chickpeas in creamy orange sauce, wilted spinach and tomato pieces, finished with a small cilantro garnish; no rice dominating the dish.' },
  { id: 'ofengemuese', dish: 'A rustic charcoal plate of roasted Mediterranean vegetables: browned potato wedges, red pepper and zucchini, topped with clearly crumbled white feta and a restrained lemon-yogurt drizzle.' },
  { id: 'linsenbolognese', dish: 'A deep matte bowl of pasta with a hearty red lentil Bolognese: clearly separate tiny orange-red lentils, finely diced carrot and smooth rich tomato sauce, finished with delicate Italian herbs; entirely plant-based, no ground meat, no chunks resembling minced meat and no cheese.' },
  { id: 'tacos', dish: 'Three small open corn tortillas filled with smoky kidney beans, sautéed red pepper, avocado slices, shredded fresh greens and lime, arranged for sharing; entirely plant-based, no meat and no cheese.' },
  { id: 'reisbowl', dish: 'A composed sesame rice bowl with distinct sections of white rice, crisp golden tofu cubes, cucumber ribbons and julienned carrot, sesame dressing sheen and scattered sesame seeds; no meat.' },
  { id: 'shakshuka', dish: 'A small dark skillet of green shakshuka: two softly set eggs nested in a thick spiced spinach base, small creamy white accents and rustic bread slices at the side; green rather than tomato-red sauce.' },
  { id: 'gnocchi', dish: 'A charcoal plate dominated by many unmistakable classic Italian gnocchi: small plump oval pillow-shaped dumplings with visible fork ridges and browned pan-seared patches, mixed with a little sautéed zucchini and cherry tomatoes, crumbled feta, lemon and herbs. The gnocchi must look like soft ridged pasta dumplings, never baby potatoes, cubes, rings or hollow shapes.' },
  { id: 'haehnchenblech', dish: 'A dark serving plate dominated by several large unmistakable juicy boneless paprika-roasted chicken thigh pieces with fibrous sliced chicken interiors and crisp browned edges, accompanied by fewer roasted potato wedges and red pepper plus a small spoonful of plain yogurt. Chicken must be the obvious main ingredient, not potatoes; no whole bird and no bones.' },
  { id: 'kartoffelsuppe', dish: 'A deep charcoal bowl of creamy pale-golden potato and leek soup topped with a generous clearly visible mound of sautéed pale-green sliced leek rings and a few tender potato cubes, subtle oat-cream swirl and exactly one slice of crusty bread nearby; entirely plant-based. The green leek rings must be unmistakable.' },
  { id: 'couscous', dish: 'A wide dark bowl of fluffy couscous topped with many thick diagonal roasted carrot pieces with dark caramelized edges, plus clearly separate whole beige chickpeas, fresh spinach, a lemon wedge and green herbs; no whole raw carrots and no round orange balls, entirely plant-based.' },
  { id: 'salat', dish: 'An isolated dark bowl filling the frame with crunchy Asian rice-noodle salad: translucent noodles mixed with cucumber half-moons, julienned carrot, cilantro and visibly crushed peanuts, lightly glossy lime dressing; fresh and plant-based, not a leafy green salad. Clean empty stone surface around the bowl with one pair of plain chopsticks as the only prop.' },
  { id: 'rote-linsen-kokos-suppe', dish: 'A deep charcoal bowl of creamy coral-red lentil coconut soup with visible red lentils, tiny carrot pieces, a restrained coconut swirl, lime zest and one lime wedge; entirely plant-based, no bread and no rice.' },
  { id: 'pilz-graupen-risotto', dish: 'A shallow charcoal bowl of creamy pearl barley risotto with clearly visible glossy barley grains, many browned quartered mushrooms, pale-green leek rings, finely grated hard cheese and fresh parsley; no rice and no meat.' },
  { id: 'zucchini-kartoffel-roesti', dish: 'A charcoal plate holding exactly three thin, flat, round pan-fried roesti pancakes, each about ten centimeters wide, made from visibly interwoven coarse potato shreds and abundant bright green zucchini shreds, with crisp irregular browned lacy edges. A separate small bowl of thick white herb quark with chopped chives and lemon zest sits beside the pancakes. Rustic German vegetable fritters, served as full flat discs.' },
  { id: 'paprika-bohnen-reis', dish: 'A wide dark bowl of smoky tomato-red long-grain rice with distinct black beans, bright red pepper pieces and yellow corn kernels, finished with a fresh lime wedge and restrained cilantro; entirely plant-based, no meat and no cheese.' },
  { id: 'fenchel-bohnen-schmortopf', dish: 'A deep charcoal bowl of rustic white bean and fennel stew in a rich tomato broth, abundant intact white beans, translucent fennel strips and carrot pieces, finished with lemon zest and delicate fennel fronds; entirely plant-based, no pasta and no meat.' },
  { id: 'suesskartoffel-kichererbsen-blech', dish: 'A charcoal serving plate of caramelized orange sweet potato cubes, crisp whole chickpeas and roasted broccoli florets, generously drizzled with pale creamy lemon tahini; distinct vegetables with dark roasted edges, entirely plant-based, no meat and no cheese.' },
  { id: 'spinat-kartoffel-frittata', dish: 'A dark ovenproof skillet holding a thick golden frittata cut into wedges, with unmistakable overlapping potato slices, wilted green spinach and browned melted mountain cheese visible throughout; rustic egg texture, no meat and no bread.' },
  { id: 'haehnchen-linsen-pfanne', dish: 'A wide charcoal bowl of mustard-braised black lentils with abundant sliced golden chicken breast pieces, pale-green leek rings and bright carrot coins in a glossy light broth; chicken and lentils clearly distinct, no rice and no cream sauce.' },
  { id: 'buchweizen-rote-bete-salat', dish: 'A wide charcoal bowl of warm buckwheat salad with distinct toasted triangular buckwheat groats, glossy deep-red beet wedges, thin green-skinned apple slices, fresh arugula and chopped toasted walnuts; entirely plant-based, no cheese and no bread.' },
  { id: 'wirsing-kartoffel-bohnen-pfanne', dish: 'A broad dark skillet of golden browned potato cubes, abundant crinkled pale-green savoy cabbage ribbons, intact creamy white beans and small orange carrot pieces in a light grainy-mustard glaze; entirely plant-based, no meat and no cream.' },
  { id: 'kabeljau-tomaten-orzo', dish: 'A wide shallow charcoal bowl of glossy tomato-red orzo pasta with visible zucchini pieces, topped by one generous flaky white cod fillet with lightly golden edges, fresh lemon zest and one lemon wedge; unmistakable fish over tiny rice-shaped pasta, no rice and no cream.' },
  { id: 'puten-hirse-baellchen', dish: 'A charcoal plate with six small evenly browned turkey meatballs beside a mound of fluffy golden millet grains and a separate pool of pale yogurt densely flecked with bright orange grated carrot and green parsley; meatballs clearly cooked through, no pasta and no bread.' },
  { id: 'kuerbis-dinkel-pfanne', dish: 'A broad charcoal skillet with distinct glossy spelt grains, caramelized orange Hokkaido pumpkin cubes, intact creamy white beans, crisp sage leaves and coarse white feta crumbles; rustic autumn dish with all components visible, no rice and no meat.' },
  { id: 'lachs-bohnen-kartoffel-salat', dish: 'A wide charcoal plate of warm potato and green bean salad with halved baby potatoes, slender bright green beans and thin pink radish slices, topped with generous flakes of moist roasted salmon and fresh dill; light mustard sheen, no leafy salad and no bread.' },
  { id: 'blumenkohl-erbsen-dal', dish: 'A deep charcoal bowl of creamy golden yellow lentil dal filled with many browned cauliflower florets, bright green peas and ribbons of wilted spinach, with a restrained coconut finish; thick legume texture, entirely plant-based, no rice and no bread.' },
  { id: 'rind-paprika-polenta', dish: 'A shallow charcoal bowl with a broad bed of smooth golden corn polenta topped by abundant browned beef strips, glossy red and yellow pepper ribbons and a rich tomato paprika sauce, finished with finely grated parmesan; beef clearly sliced, no pasta and no rice.' },
  { id: 'auberginen-linsen-bulgur', dish: 'A broad charcoal bowl of fluffy golden bulgur and distinct green lentils with abundant deeply roasted aubergine cubes, halved red cherry tomatoes, fresh mint leaves and fine lemon zest; entirely plant-based, no meat and no cheese.' },
  { id: 'tofu-brokkoli-erdnuss-nudeln', dish: 'A wide charcoal bowl of glossy wheat noodles coated in pale tan peanut-lime sauce, topped with abundant crisp golden tofu cubes and vivid green broccoli florets, with restrained crushed peanuts and lime zest; entirely plant-based, no meat and no egg.' },
  { id: 'schweinefilet-apfel-wirsing', dish: 'A dark dinner plate with three thick browned pork tenderloin medallions showing a moist pale sliced interior, beside creamy pale-green savoy cabbage with thin red-skinned apple wedges and small parsley potatoes; no gravy pool and no bones.' },
  { id: 'mangold-ricotta-cannelloni', dish: 'A dark rectangular baking dish with four distinct tubular cannelloni covered in rich red tomato sauce and a golden parmesan crust, one tube cut open to reveal abundant green chard and white ricotta filling; vegetarian baked pasta, no meat.' },
  { id: 'rosenkohl-kartoffel-linsen-blech', dish: 'A broad charcoal sheet-pan serving of deeply browned halved Brussels sprouts and golden potato cubes mixed with distinct brown lentils and thin red-skinned apple wedges, finished with a light grainy mustard sheen; entirely plant-based, no meat and no cheese.' },
  { id: 'seelachs-lauch-kartoffel-topf', dish: 'A deep charcoal bowl of light creamy potato and leek stew with generous unmistakable flaky white pollock chunks, golden potato cubes, pale-green leek rings and orange carrot coins, finished with abundant fresh dill; no salmon, no bread and no pasta.' },
  { id: 'paprika-hirse-pfanne-halloumi', dish: 'A broad charcoal skillet of fluffy tiny golden millet grains with glossy red and yellow pepper strips and browned zucchini half-moons, topped by several thick golden-seared halloumi slices and fresh parsley; vegetarian, no meat, no rice and no pasta.' },
  { id: 'kuerbis-bohnen-chili', dish: 'A deep charcoal bowl of thick smoky dark-red chili packed with distinct orange Hokkaido pumpkin cubes, abundant red kidney beans, yellow corn and red pepper pieces, finished only with restrained green herbs; entirely plant-based, no meat, no cheese and no rice.' },
  { id: 'pastinaken-weisse-bohnen-suppe', dish: 'A deep charcoal bowl of velvety ivory parsnip and white bean soup, topped with a small cluster of toasted chopped hazelnuts, a few intact white beans, thyme leaves and a restrained oat-cream swirl; entirely plant-based, no bread and no meat.' },
  { id: 'haehnchen-spitzkohl-reis-pfanne', dish: 'A broad charcoal skillet of distinct brown rice grains, abundant pale-green seared pointed cabbage ribbons and orange carrot sticks, topped with clearly cooked golden bite-sized chicken breast pieces and fresh parsley; no cream sauce and no noodles.' },
  { id: 'rote-bete-kartoffel-gratin', dish: 'A dark rectangular baking dish with neat overlapping layers of ruby beetroot and golden potato slices in pale horseradish cream, topped with a deeply browned mountain-cheese crust and scattered toasted pumpkin seeds; vegetarian, no meat and no bread.' },
  { id: 'garnelen-erbsen-dinkel-orzotto', dish: 'A wide shallow charcoal bowl of creamy glossy whole spelt grains with bright green peas and browned zucchini pieces, topped by six unmistakable curled pink cooked shrimp, fresh dill and fine lemon zest; no rice, no pasta and no cream pool.' },
  { id: 'weisse-bohnen-polenta-auflauf', dish: 'A dark oval baking dish with a visible golden polenta base beneath a rustic tomato and white bean layer, abundant dark-green chard ribbons and crisp herb breadcrumbs; entirely plant-based, no meat and no cheese.' },
  { id: 'puten-kuerbis-bulgur-pfanne', dish: 'A broad charcoal skillet of fluffy golden bulgur with caramelized orange Hokkaido pumpkin cubes and wilted spinach, topped by abundant fully cooked browned turkey strips, red onion slivers, fresh mint and lemon zest; no rice and no sauce pool.' },
  { id: 'linsen-wurzelgemuese-hirse-topf', dish: 'A deep charcoal bowl of thick rustic brown lentil and golden millet stew with abundant distinct cubes of pale-yellow swede, orange carrot and ivory celeriac, finished with lemon zest and restrained herbs; entirely plant-based, no meat and no bread.' },
  { id: 'forelle-rote-bete-graupen-salat', dish: 'A wide charcoal bowl of glossy pearl barley salad with ruby beetroot wedges, cucumber half-moons and pink radish slices, topped by generous unmistakable flakes of smoked trout and fresh dill; no leafy greens, no bread and no cheese.' },
  { id: 'gruenkohl-kartoffel-kichererbsen-pfanne', dish: 'A broad charcoal skillet of crisp golden potato cubes, abundant dark-green kale ribbons and whole roasted chickpeas, with a few thin red-skinned apple wedges and a light grainy mustard glaze; entirely plant-based, no meat and no cheese.' },
  { id: 'pilz-lauch-spaetzle-walnuss', dish: 'A broad charcoal skillet filled with unmistakable irregular golden German egg spaetzle noodles, many deeply browned quartered mushrooms and pale-green leek rings in a light creamy glaze, topped with toasted walnut pieces and fresh parsley; no meat.' },
  { id: 'ofenlachs-linsen-fenchel', dish: 'A wide charcoal plate with one generous moist oven-roasted salmon fillet resting on glossy dark mountain lentils, surrounded by caramelized fennel wedges and orange carrot slices, finished with fresh dill and a restrained mustard-lemon sheen; no potatoes and no rice.' },
  { id: 'tofu-rotkohl-soba-pfanne', dish: 'A wide charcoal bowl of dark buckwheat soba noodles tangled with glossy ruby-purple red cabbage, topped with abundant crisp golden tofu cubes, bright orange fillets, green spring-onion rings and sesame seeds; entirely plant-based, no meat and no egg.' },
  { id: 'miso-kuerbis-udon-pak-choi', dish: 'A wide charcoal bowl of thick glossy white udon noodles in a light amber miso glaze with caramelized orange Hokkaido pumpkin cubes, vivid green pak choi quarters and abundant crisp golden tofu cubes, finished with sesame seeds; entirely plant-based, no meat and no egg.' },
  { id: 'lauch-birnen-quiche', dish: 'A round golden baked quiche in a dark fluted tart pan with one wedge removed, clearly showing pale-green leek rings and thin pear slices in a set egg filling beneath browned mountain cheese and toasted walnut pieces; vegetarian, no meat and no salad.' },
  { id: 'rind-rote-bete-borschtsch', dish: 'A deep charcoal bowl of vivid ruby-red borscht with abundant distinct tender beef cubes, beetroot cubes, pale cabbage ribbons, golden potato and orange carrot pieces, topped with one restrained spoonful of sour cream and fresh dill; no bread and no noodles.' },
  { id: 'sellerie-schnitzel-kartoffel-gurken-salat', dish: 'A charcoal dinner plate with two broad golden-crisp breaded celeriac schnitzels showing a pale tender vegetable interior, beside a distinct German potato and cucumber salad with thin slices, yogurt-dill dressing and fresh dill; vegetarian, no meat and no fries.' },
  { id: 'haehnchen-apfel-curry-naturreis', dish: 'A deep charcoal bowl of mild golden chicken and apple curry with abundant fully cooked browned chicken breast strips, thin red-skinned apple wedges and dark-green spinach in a creamy sauce, beside a restrained mound of distinct brown rice; no bread and no noodles.' },
  { id: 'bohnen-mais-enchiladas', dish: 'A dark rectangular baking dish holding four distinct rolled corn tortillas filled with red and black beans, yellow corn and red pepper, covered in bright tomato sauce and a lightly browned plant-based cheese topping, with one enchilada cut open; entirely plant-based, no meat and no rice.' },
  { id: 'kartoffel-lauch-linsen-pastete', dish: 'A dark oval baking dish of vegan shepherd-style pie with a deeply golden ridged mashed-potato crust, one generous spoonful removed to reveal distinct brown lentils, pale-green leek rings and orange carrot cubes; no meat and no cheese.' },
  { id: 'kabeljau-kichererbsen-tagine', dish: 'A broad dark tagine-style serving bowl of rich red tomato stew with abundant whole chickpeas, red pepper strips and zucchini half-moons, topped by four generous flaky white cod pieces, lemon wedges and parsley; no couscous and no bread.' },
  { id: 'brokkoli-kaese-hirse-taler', dish: 'A charcoal dinner plate with four round golden pan-fried millet patties showing vivid green broccoli pieces and melted cheese flecks, beside a juicy salad of halved red cherry tomatoes, red onion and parsley; vegetarian, no meat and no bread.' },
  { id: 'kohlrabi-dinkel-erbsen-ragout', dish: 'A deep charcoal bowl of pale creamy kohlrabi ragout with abundant distinct ivory kohlrabi cubes, glossy whole spelt grains and bright green peas, finished with fresh parsley; entirely plant-based, no meat, no rice and no pasta.' },
  { id: 'haehnchen-pflaumen-couscous', dish: 'A broad charcoal plate of fluffy golden couscous topped with abundant browned chicken breast strips, glossy purple plum quarters, whole chickpeas and orange carrot sticks, finished with fresh parsley; chicken fully cooked, no rice and no sauce pool.' },
  { id: 'auberginen-quinoa-boote', dish: 'A dark oval baking dish with two roasted aubergine halves used as boats, generously filled with distinct ivory quinoa grains, green lentils and red cherry tomato pieces over tomato sauce, drizzled with pale lemon tahini; entirely plant-based, no meat and no cheese.' },
  { id: 'wirsing-pilz-buchweizen-rouladen', dish: 'A dark oval baking dish holding four distinct pale-green savoy cabbage rolls with lightly browned ridges in vivid tomato sauce, one roll cut open to reveal dark buckwheat grains, browned mushroom pieces and chopped walnuts; entirely plant-based, no meat and no rice.' },
  { id: 'muschel-fenchel-kartoffel-topf', dish: 'A deep charcoal bowl of light red Mediterranean seafood stew with abundant cooked orange mussel meat removed from the shells, golden potato cubes and translucent fennel wedges in tomato broth, finished with parsley and fennel fronds; no fish fillet, no pasta and no bread.' },
  { id: 'puten-suesskartoffel-erdnuss-eintopf', dish: 'A deep charcoal bowl of thick burnt-orange peanut tomato stew filled with abundant fully cooked browned turkey cubes, distinct orange sweet-potato chunks and dark-green kale ribbons, finished with a lime wedge and restrained crushed peanuts; no rice, no bread and no chicken.' },
  { id: 'schwarzwurzel-linsen-haselnuss-pfanne', dish: 'A broad charcoal skillet of ivory salsify batons with lightly caramelized edges, distinct dark mountain lentils and thin red-skinned apple wedges in a light grainy mustard glaze, topped with toasted chopped hazelnuts; entirely plant-based, no meat and no pasta.' },
  { id: 'heilbutt-spinat-kartoffel-paeckchen', dish: 'An opened parchment parcel on a charcoal plate revealing one thick opaque-white baked halibut fillet over abundant wilted dark-green spinach and pale leek rings, with small golden dill potatoes and lemon beside it; fish fully cooked, no salmon and no bread.' },
  { id: 'reh-wurzelgemuese-dinkel-topf', dish: 'A deep charcoal bowl of rich dark-red venison stew with abundant distinct lean browned venison cubes, glossy whole spelt grains, ivory parsnip, orange carrot and pale celeriac cubes, finished with fresh parsley; no noodles, no potatoes and no cream.' },
  { id: 'artischocken-erbsen-risotto', dish: 'A wide shallow charcoal bowl of creamy pale risotto with distinct glossy short rice grains and bright green peas, topped with several golden-seared halved artichoke hearts, fine lemon zest and restrained parsley; entirely plant-based, no cheese and no meat.' },
  { id: 'lamm-kofta-kichererbsen-blech', dish: 'A broad charcoal serving plate with four distinct browned oblong lamb kofta, roasted chickpeas, deeply caramelized aubergine cubes, blistered red cherry tomatoes and red onion wedges, beside a small bowl of lemon yogurt; meat fully cooked, no bread and no rice.' },
  { id: 'quark-mohn-schmarrn-zwetschgen', dish: 'A charcoal plate piled with irregular fluffy golden torn quark schmarrn pieces visibly speckled with blue poppy seeds, beside glossy warm purple plum quarters in a small pool of fruit juice; sweet skillet dish, no whole pancake and no ice cream.' },
  { id: 'eier-senfsauce-spinatkartoffeln', dish: 'A charcoal dinner plate with four clearly halved soft-boiled eggs in a pale creamy grainy-mustard sauce, beside a rustic mound of crushed potatoes marbled with abundant dark-green wilted spinach, finished with chopped chives; vegetarian, no meat and no bread.' },
  { id: 'maronen-rosenkohl-graupenpfanne', dish: 'A broad charcoal skillet of glossy pearl barley grains with abundant deeply browned halved Brussels sprouts, chunky golden chestnut pieces and thin red-skinned apple wedges in a light grainy-mustard glaze, finished with parsley; entirely plant-based, no meat and no cheese.' },
  { id: 'schweinegeschnetzeltes-kohlrabi-vollkornreis', dish: 'A broad charcoal bowl with distinct brown whole-grain rice beside abundant browned lean pork tenderloin strips and pale-green kohlrabi batons in a light creamy lemon-dill sauce, finished with fresh dill; pork fully cooked, no noodles and no potatoes.' },
  { id: 'raeuchertofu-steckrueben-gulasch', dish: 'A deep charcoal bowl of thick ruby-red paprika goulash with abundant browned smoked-tofu cubes, pale-golden swede cubes, small potatoes and red pepper strips, finished with restrained parsley; entirely plant-based, no meat, no noodles and no cream.' },
  { id: 'makrelen-linsen-apfel-salat', dish: 'A wide charcoal bowl of warm dark mountain-lentil salad with generous moist flakes of smoked mackerel, thin ivory fennel strips, crisp red-skinned apple wedges and fresh baby spinach, finished with dill; no bread, no potatoes and no canned fish.' },
  { id: 'kuerbis-spinat-polenta-schnitten', dish: 'A charcoal plate with three thick rectangular golden baked polenta slices topped with caramelized orange Hokkaido pumpkin cubes, dark-green wilted spinach, coarse white feta crumbles and toasted pumpkin seeds; vegetarian, no meat, no bread and no pasta.' },
  { id: 'linsen-pilz-walnuss-braten', dish: 'A charcoal serving plate with four thick slices of a dark golden vegan lentil mushroom walnut loaf showing a coarse moist interior, beside caramelized ivory parsley-root batons and a restrained thyme garnish; no meat, no gravy and no bread.' },
  { id: 'saibling-kohlrabi-dinkel-risotto', dish: 'A wide shallow charcoal bowl of creamy glossy whole spelt risotto with pale-green kohlrabi cubes and bright peas, topped by one crisp skin-on pan-fried arctic char fillet, lemon zest and fresh dill; no rice, no pasta and no salmon.' },
  { id: 'rind-bohnen-kuerbis-pfanne', dish: 'A broad charcoal skillet with abundant browned lean beef strips, caramelized orange Hokkaido pumpkin cubes, vivid green bean pieces and distinct toasted triangular buckwheat groats in a light mustard glaze; beef fully cooked, no rice, no noodles and no potatoes.' },
  { id: 'hirse-pilz-kohlrouladen', dish: 'A dark oval baking dish with four distinct pale-green savoy cabbage rolls lightly browned at the seams in a vivid smooth red pepper sauce, one roll cut open to show golden millet grains, dark mushroom pieces and chopped walnuts; entirely plant-based, no meat and no rice.' },
  { id: 'puten-zucchini-mais-laibchen', dish: 'A charcoal dinner plate with four flat golden-brown turkey patties visibly flecked with green zucchini shreds and yellow corn kernels, beside distinct brown rice in a chunky red tomato sauce; patties fully cooked, no beef, no potatoes and no bread.' },
  { id: 'birnen-bohnen-kartoffel-eintopf', dish: 'A deep charcoal bowl of clear golden rustic stew with distinct yellow potato chunks, abundant vivid green bean pieces, skin-on pale pear wedges and crisp dark-brown smoked-tofu cubes, finished with restrained savory leaves; entirely plant-based, no meat, no cream and no bread.' },
  { id: 'herings-kartoffel-rote-bete-salat', dish: 'A wide charcoal bowl of composed Nordic potato salad with generous silvery-pink matjes herring pieces, ruby beet cubes, golden potato slices, crisp cucumber half-moons and thin red-skinned apple wedges in a light dill yogurt dressing; no bread and no leafy greens.' },
  { id: 'okra-linsen-hirse-eintopf', dish: 'A deep charcoal bowl of thick brick-red tomato peanut stew filled with abundant sliced green okra pods showing star-shaped centers, distinct dark mountain lentils and tiny golden millet grains, finished with one lime wedge; entirely plant-based, no meat, no rice and no bread.' },
  { id: 'spargel-dinkel-crepes-kraeuterquark', dish: 'A charcoal dinner plate with three thin folded golden whole-spelt crepes visibly filled with bright green asparagus batons and peas, beside a small bowl of thick white lemon herb quark flecked with chives and parsley; vegetarian, no meat, no salad and no syrup.' },
  { id: 'miso-auberginen-edamame-reis', dish: 'A broad charcoal bowl of distinct brown rice mixed with vivid green edamame, topped by two glossy deeply caramelized miso-glazed aubergine halves with scored diamond patterns, sesame seeds and green spring-onion rings; entirely plant-based, no meat, no egg and no tofu cubes.' },
  { id: 'ricotta-spinat-knoedel-tomatenragout', dish: 'A wide shallow charcoal bowl of vivid chunky tomato ragout holding four round pale-golden bread dumplings visibly flecked with dark-green spinach, topped with finely grated parmesan and restrained basil; vegetarian Italian dumplings, no pasta, no meat and no bread slices.' },
  { id: 'haehnchen-aprikosen-gersten-pilaw', dish: 'A broad charcoal bowl of glossy pearl-barley pilaf with abundant fully cooked golden chicken pieces, orange carrot slices, dark-green wilted spinach and visible amber dried-apricot strips, topped with toasted chopped almonds; no rice, no couscous and no sauce pool.' },
]

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const outputDirectory = join(projectRoot, 'public', 'recipes')
const outputPath = (id) => join(outputDirectory, `${id}.jpg`)

export const buildPrompt = ({ dish }) => `${OVERLAP_STYLE_PRESET} Hero dish: ${dish} Landscape 4:3 composition with the food centered and fully visible, photographic realism. No text, no typography, no letters, no logo, no watermark, no people, no hands, no faces, no packaging, no branded objects, no duplicate plates.`

export function detectImageFormat(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg'
  if (bytes.length >= 8 && bytes.slice(0, 8).every((byte, index) => byte === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][index])) return 'png'
  if (bytes.length >= 12 && new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP') return 'webp'
  return 'unknown'
}

function findBase64Image(payload) {
  const candidates = [payload?.result?.image, payload?.result, payload?.image, payload?.data?.image]
  return candidates.find((candidate) => typeof candidate === 'string')
}

function safeApiMessage(bytes) {
  try {
    const payload = JSON.parse(new TextDecoder().decode(bytes))
    const messages = Array.isArray(payload?.errors) ? payload.errors.map((error) => error?.message).filter(Boolean) : []
    return messages.length ? `: ${messages.join('; ')}` : ''
  } catch {
    return ''
  }
}

export async function decodeImageResponse(response) {
  const bytes = new Uint8Array(await response.arrayBuffer())
  if (!response.ok) throw new Error(`Cloudflare API request failed (${response.status})${safeApiMessage(bytes)}`)

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''
  let imageBytes = bytes
  if (contentType.includes('json') || detectImageFormat(bytes) === 'unknown') {
    let payload
    try {
      payload = JSON.parse(new TextDecoder().decode(bytes))
    } catch {
      throw new Error(`Cloudflare returned neither an image nor valid JSON (${contentType || 'unknown content type'})`)
    }
    const encoded = findBase64Image(payload)
    if (!encoded) throw new Error('Cloudflare JSON response did not contain a base64 image')
    const normalized = encoded.includes(',') ? encoded.slice(encoded.indexOf(',') + 1) : encoded
    if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(normalized) || normalized.length === 0) {
      throw new Error('Cloudflare returned invalid base64 image data')
    }
    imageBytes = Uint8Array.from(Buffer.from(normalized, 'base64'))
  }

  const format = detectImageFormat(imageBytes)
  if (format !== 'jpeg') throw new Error(`Expected JPEG bytes, received ${format}`)
  if (imageBytes.length < 10) throw new Error('Cloudflare returned a truncated JPEG')
  return imageBytes
}

function parseEnvFile(contents) {
  const values = new Map()
  for (const rawLine of contents.split(/\r?\n/u)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const separator = line.indexOf('=')
    if (separator < 1) continue
    const key = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
    values.set(key, value)
  }
  return values
}

export async function loadCredentials() {
  let contents
  try {
    contents = await readFile(ENV_PATH, 'utf8')
  } catch {
    throw new Error(`Credential file is not readable: ${ENV_PATH}`)
  }
  const values = parseEnvFile(contents)
  const accountId = values.get('CLOUDFLARE_ACCOUNT_ID')
  const apiToken = values.get('CLOUDFLARE_API_TOKEN')
  if (!accountId || !apiToken) throw new Error(`Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN in ${ENV_PATH}`)
  return { accountId, apiToken }
}

export function parseArgs(args) {
  const options = { force: false, recipeId: undefined }
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === '--force') options.force = true
    else if (argument === '--recipe') {
      const id = args[index + 1]
      if (!id || id.startsWith('--')) throw new Error('--recipe requires an ID')
      if (!recipeImageManifest.some((recipe) => recipe.id === id)) throw new Error(`Unknown recipe id: ${id}`)
      options.recipeId = id
      index += 1
    } else throw new Error(`Unknown argument: ${argument}`)
  }
  return options
}

export function selectRecipes(options, fileExists = existsSync) {
  const requested = options.recipeId ? recipeImageManifest.filter(({ id }) => id === options.recipeId) : recipeImageManifest
  return requested.filter(({ id }) => options.force || !fileExists(outputPath(id)))
}

export async function requestImage(recipe, credentials, fetchImpl = fetch) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${credentials.accountId}/ai/run/${MODEL}`
  const response = await fetchImpl(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${credentials.apiToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: buildPrompt(recipe) }),
    signal: AbortSignal.timeout(120_000),
  })
  return decodeImageResponse(response)
}

async function persistAtomically(path, bytes) {
  const temporaryPath = `${path}.tmp-${process.pid}`
  await writeFile(temporaryPath, bytes, { flag: 'wx' })
  try {
    await rename(temporaryPath, path)
  } catch (error) {
    await unlink(temporaryPath).catch(() => undefined)
    throw error
  }
}

export async function main(args = process.argv.slice(2)) {
  const options = parseArgs(args)
  const selected = selectRecipes(options)
  if (!selected.length) {
    console.log('No images to generate; all requested JPEG files already exist. Use --force to overwrite.')
    return
  }

  const credentials = await loadCredentials()
  await mkdir(outputDirectory, { recursive: true })
  console.log(`Generating ${selected.length} recipe image(s) with ${MODEL}; credentials loaded from ${ENV_PATH}.`)

  for (const [index, recipe] of selected.entries()) {
    console.log(`[${index + 1}/${selected.length}] Generating ${recipe.id}...`)
    const bytes = await requestImage(recipe, credentials)
    await persistAtomically(outputPath(recipe.id), bytes)
    console.log(`[${index + 1}/${selected.length}] Saved public/recipes/${recipe.id}.jpg (${bytes.length} bytes, JPEG verified).`)
  }
}

const isDirectExecution = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (isDirectExecution) {
  main().catch((error) => {
    console.error(`Image generation failed: ${error instanceof Error ? error.message : 'unknown error'}`)
    process.exitCode = 1
  })
}
