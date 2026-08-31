import { evaluateProviderPage, type ProviderRecipe, type RecipeRights } from './catalogProvider'
import type { Allergen, Category, Recipe } from '../domain/types'

export type EditorialIngredient = ProviderRecipe['ingredients'][number] & {
  category: Category
  estimatedCostCents: number
  allergens?: Allergen[]
}

export type EditorialRecipe = Omit<ProviderRecipe, 'ingredients'> & {
  appId: string
  tags: string[]
  ingredients: EditorialIngredient[]
  allergens: Allergen[]
  priceBasis: string
  provenance: string
  imagePrompt: string
}

const editorialRights: RecipeRights[] = [
  { assetKind: 'recipe_text', license: 'Overlap-eigene Originalproduktion © 2026', storagePermitted: true, modificationPermitted: true },
  { assetKind: 'image', license: 'Für Overlap erzeugtes Cloudflare-Workers-AI-Asset', storagePermitted: true, modificationPermitted: true },
  { assetKind: 'nutrition', license: 'Overlap-redaktionelle Schätzung; BLS-4.0-Berechnung ausstehend', storagePermitted: true, modificationPermitted: true },
]

const sourceUrl = (id: string) => `https://github.com/jacober0/overlap/blob/feat/vertical-slice/src/data/editorialRecipes.ts#${id}`
const imageUrl = (id: string) => `https://github.com/jacober0/overlap/blob/feat/vertical-slice/public/recipes/${id}.jpg`
const common = (appId: string) => ({
  appId,
  servings: 2,
  priceRegion: 'DE-BW, Discounter-/Supermarkt-Mischkorb',
  priceCheckedAt: '2026-08-31',
  sourceName: 'Overlap Originalproduktion',
  sourceUrl: sourceUrl(appId),
  contentLicense: 'Overlap-eigene Originalproduktion © 2026',
  imageUrl: imageUrl(appId),
  imageLicense: 'Für Overlap mit Cloudflare Workers AI erzeugt',
  attributionText: 'Rezept und Bildkonzept: Overlap Redaktion; Bild: Cloudflare Workers AI',
  reviewedBy: 'Hermes Agent – redaktionelle QA',
  reviewedAt: '2026-08-31',
  rights: editorialRights,
  provenance: 'Deutschsprachige Originalentwicklung für Overlap; ohne Übernahme aus einer Fremdrezeptdatenbank erstellt und im Repository versioniert.',
})

export const editorialRecipes: EditorialRecipe[] = [
  {
    ...common('rote-linsen-kokos-suppe'),
    externalId: 'overlap-013-rote-linsen-kokos-suppe',
    title: 'Rote-Linsen-Kokos-Suppe mit Limette',
    description: 'Cremige rote Linsen, Tomate und Kokos treffen auf frische Limette und eine milde Ingwerwürze.',
    totalMinutes: 32,
    activeMinutes: 14,
    diet: 'vegan',
    tags: ['suppe', 'vegan', 'meal-prep'],
    ingredients: [
      { canonicalId: 'rote-linsen', name: 'Rote Linsen', amount: 180, unit: 'g', category: 'Trockenwaren', estimatedCostCents: 70 },
      { canonicalId: 'kokosmilch', name: 'Kokosmilch', amount: 200, unit: 'ml', category: 'Trockenwaren', estimatedCostCents: 90 },
      { canonicalId: 'stueckige-tomaten', name: 'Stückige Tomaten', amount: 400, unit: 'g', category: 'Trockenwaren', estimatedCostCents: 80 },
      { canonicalId: 'karotte', name: 'Karotte', amount: 160, unit: 'g', category: 'Gemüse', estimatedCostCents: 35 },
      { canonicalId: 'zwiebel', name: 'Zwiebel', amount: 100, unit: 'g', category: 'Gemüse', estimatedCostCents: 20 },
      { canonicalId: 'ingwer', name: 'Ingwer', amount: 15, unit: 'g', category: 'Gemüse', estimatedCostCents: 20 },
      { canonicalId: 'limette', name: 'Limette', amount: 1, unit: 'Stück', category: 'Obst', estimatedCostCents: 45 },
      { canonicalId: 'rapsoel', name: 'Rapsöl', amount: 15, unit: 'ml', category: 'Trockenwaren', estimatedCostCents: 8 },
    ],
    allergens: [],
    steps: [
      'Zwiebel, Karotte und Ingwer schälen und in kleine, gleichmäßige Würfel schneiden.',
      'Rapsöl in einem Topf erhitzen und das vorbereitete Gemüse darin vier Minuten glasig anschwitzen.',
      'Rote Linsen in einem Sieb gründlich abspülen, in den Topf geben und eine Minute mitrösten.',
      'Tomaten, Kokosmilch und 350 Milliliter Wasser angießen, aufkochen und 18 Minuten leise köcheln lassen.',
      'Die Suppe teilweise pürieren, bis sie cremig bleibt und noch einzelne Linsen sichtbar sind.',
      'Limettenschale fein abreiben, den Saft auspressen und die Suppe damit sowie mit Salz abschmecken.',
    ],
    nutrition: { kcal: 568, protein: 23, carbs: 72, fat: 20, fiber: 15 },
    estimatedPriceCents: 268,
    priceBasis: 'Summierte Zutatenkosten für zwei Portionen anhand eines DE-BW-Mischkorbs vom 31.08.2026; Salz und Wasser als Vorrat nicht eingepreist.',
    imagePrompt: 'A deep charcoal bowl of creamy coral-red lentil coconut soup with visible red lentils, tiny carrot pieces, a restrained coconut swirl, lime zest and one lime wedge; entirely plant-based, no bread and no rice.',
  },
  {
    ...common('pilz-graupen-risotto'),
    externalId: 'overlap-014-pilz-graupen-risotto',
    title: 'Pilz-Graupen-Risotto mit Petersilie',
    description: 'Nussige Perlgraupen werden mit gebräunten Champignons, Lauch und würzigem Hartkäse besonders cremig.',
    totalMinutes: 42,
    activeMinutes: 20,
    diet: 'vegetarisch',
    tags: ['deutsch', 'comfort', 'herbst'],
    ingredients: [
      { canonicalId: 'perlgraupen', name: 'Perlgraupen', amount: 180, unit: 'g', category: 'Trockenwaren', estimatedCostCents: 55, allergens: ['gluten'] },
      { canonicalId: 'champignons', name: 'Braune Champignons', amount: 300, unit: 'g', category: 'Gemüse', estimatedCostCents: 150 },
      { canonicalId: 'lauch', name: 'Lauch', amount: 160, unit: 'g', category: 'Gemüse', estimatedCostCents: 60 },
      { canonicalId: 'hartkaese', name: 'Vegetarischer Hartkäse', amount: 50, unit: 'g', category: 'Kühlregal', estimatedCostCents: 85, allergens: ['milch'] },
      { canonicalId: 'butter', name: 'Butter', amount: 20, unit: 'g', category: 'Kühlregal', estimatedCostCents: 20, allergens: ['milch'] },
      { canonicalId: 'gemuesebruehe', name: 'Gemüsebrühe', amount: 700, unit: 'ml', category: 'Trockenwaren', estimatedCostCents: 20, allergens: ['sellerie'] },
      { canonicalId: 'petersilie', name: 'Glatte Petersilie', amount: 20, unit: 'g', category: 'Gemüse', estimatedCostCents: 55 },
    ],
    allergens: ['gluten', 'milch', 'sellerie'],
    steps: [
      'Champignons putzen und vierteln, Lauch längs waschen und anschließend in feine Ringe schneiden.',
      'Die Hälfte der Butter in einer breiten Pfanne erhitzen und die Pilze darin kräftig goldbraun braten.',
      'Pilze herausnehmen, übrige Butter und Lauch in die Pfanne geben und drei Minuten weich dünsten.',
      'Perlgraupen einrühren, heiße Gemüsebrühe angießen und zugedeckt 25 Minuten sanft garen.',
      'Während des Garens mehrfach umrühren und bei Bedarf wenig Wasser ergänzen, damit nichts ansetzt.',
      'Pilze und fein geriebenen Hartkäse unterheben und das cremige Graupenrisotto mit Petersilie servieren.',
    ],
    nutrition: { kcal: 594, protein: 23, carbs: 82, fat: 18, fiber: 11 },
    estimatedPriceCents: 445,
    priceBasis: 'Summierte Zutatenkosten für zwei Portionen anhand eines DE-BW-Mischkorbs vom 31.08.2026; Pfeffer und Salz als Vorrat nicht eingepreist.',
    imagePrompt: 'A shallow charcoal bowl of creamy pearl barley risotto with clearly visible glossy barley grains, many browned quartered mushrooms, pale-green leek rings, finely grated hard cheese and fresh parsley; no rice and no meat.',
  },
  {
    ...common('zucchini-kartoffel-roesti'),
    externalId: 'overlap-015-zucchini-kartoffel-roesti',
    title: 'Zucchini-Kartoffel-Rösti mit Kräuterquark',
    description: 'Knusprige kleine Rösti aus Kartoffeln und Zucchini kommen mit zitronigem Kräuterquark auf den Tisch.',
    totalMinutes: 35,
    activeMinutes: 27,
    diet: 'vegetarisch',
    tags: ['deutsch', 'pfannengericht', 'familie'],
    ingredients: [
      { canonicalId: 'kartoffel', name: 'Festkochende Kartoffeln', amount: 450, unit: 'g', category: 'Gemüse', estimatedCostCents: 75 },
      { canonicalId: 'zucchini', name: 'Zucchini', amount: 250, unit: 'g', category: 'Gemüse', estimatedCostCents: 100 },
      { canonicalId: 'ei', name: 'Ei', amount: 1, unit: 'Stück', category: 'Kühlregal', estimatedCostCents: 35, allergens: ['ei'] },
      { canonicalId: 'haferflocken', name: 'Feine Haferflocken', amount: 40, unit: 'g', category: 'Trockenwaren', estimatedCostCents: 10, allergens: ['gluten'] },
      { canonicalId: 'quark', name: 'Magerquark', amount: 250, unit: 'g', category: 'Kühlregal', estimatedCostCents: 75, allergens: ['milch'] },
      { canonicalId: 'schnittlauch', name: 'Schnittlauch', amount: 15, unit: 'g', category: 'Gemüse', estimatedCostCents: 45 },
      { canonicalId: 'zitrone', name: 'Zitrone', amount: 1, unit: 'Stück', category: 'Obst', estimatedCostCents: 45 },
      { canonicalId: 'rapsoel', name: 'Rapsöl', amount: 30, unit: 'ml', category: 'Trockenwaren', estimatedCostCents: 15 },
    ],
    allergens: ['ei', 'gluten', 'milch'],
    steps: [
      'Kartoffeln schälen, Zucchini putzen und beides auf der groben Seite einer Reibe raspeln.',
      'Die Raspelmasse leicht salzen, fünf Minuten ziehen lassen und in einem sauberen Tuch kräftig ausdrücken.',
      'Gemüseraspel mit Ei und Haferflocken vermengen und mit Pfeffer sowie wenig Salz würzen.',
      'Rapsöl portionsweise in einer Pfanne erhitzen und aus der Masse acht flache Rösti formen.',
      'Rösti bei mittlerer Hitze je Seite vier Minuten braten, bis beide Seiten goldbraun und knusprig sind.',
      'Quark mit gehacktem Schnittlauch, Zitronenabrieb und zwei Esslöffeln Wasser glatt rühren und dazu reichen.',
    ],
    nutrition: { kcal: 506, protein: 28, carbs: 62, fat: 17, fiber: 9 },
    estimatedPriceCents: 400,
    priceBasis: 'Summierte Zutatenkosten für zwei Portionen anhand eines DE-BW-Mischkorbs vom 31.08.2026; Salz und Pfeffer als Vorrat nicht eingepreist.',
    imagePrompt: 'A charcoal plate with four small crisp golden potato-zucchini roesti, visibly shredded vegetable texture and browned lacy edges, beside a small bowl of white herb quark with chives and lemon zest; no meat.',
  },
  {
    ...common('paprika-bohnen-reis'),
    externalId: 'overlap-016-paprika-bohnen-reis',
    title: 'Rauchiger Paprika-Bohnen-Reis',
    description: 'Ein würziger One-Pot-Reis mit roten Paprika, schwarzen Bohnen, Mais und frischer Limette.',
    totalMinutes: 34,
    activeMinutes: 16,
    diet: 'vegan',
    tags: ['one-pot', 'vegan', 'mexikanisch'],
    ingredients: [
      { canonicalId: 'langkornreis', name: 'Langkornreis', amount: 180, unit: 'g', category: 'Trockenwaren', estimatedCostCents: 45 },
      { canonicalId: 'schwarze-bohnen', name: 'Schwarze Bohnen, abgetropft', amount: 240, unit: 'g', category: 'Trockenwaren', estimatedCostCents: 90 },
      { canonicalId: 'rote-paprika', name: 'Rote Paprika', amount: 250, unit: 'g', category: 'Gemüse', estimatedCostCents: 125 },
      { canonicalId: 'mais', name: 'Mais, abgetropft', amount: 140, unit: 'g', category: 'Trockenwaren', estimatedCostCents: 55 },
      { canonicalId: 'stueckige-tomaten', name: 'Stückige Tomaten', amount: 200, unit: 'g', category: 'Trockenwaren', estimatedCostCents: 40 },
      { canonicalId: 'zwiebel', name: 'Zwiebel', amount: 100, unit: 'g', category: 'Gemüse', estimatedCostCents: 20 },
      { canonicalId: 'limette', name: 'Limette', amount: 1, unit: 'Stück', category: 'Obst', estimatedCostCents: 45 },
      { canonicalId: 'rapsoel', name: 'Rapsöl', amount: 15, unit: 'ml', category: 'Trockenwaren', estimatedCostCents: 8 },
    ],
    allergens: [],
    steps: [
      'Zwiebel schälen und fein würfeln, Paprika entkernen und in etwa zwei Zentimeter große Stücke schneiden.',
      'Rapsöl in einem weiten Topf erhitzen und Zwiebel sowie Paprika darin fünf Minuten kräftig anbraten.',
      'Reis zugeben, mit einem Teelöffel geräuchertem Paprikapulver bestäuben und eine Minute unter Rühren rösten.',
      'Tomaten und 350 Milliliter Wasser angießen, salzen und zugedeckt 16 Minuten bei kleiner Hitze garen.',
      'Bohnen und Mais unterheben und weitere fünf Minuten zugedeckt erwärmen, bis der Reis vollständig gar ist.',
      'Den Topf vom Herd ziehen, Limettensaft unterrühren und den Reis vor dem Servieren drei Minuten ruhen lassen.',
    ],
    nutrition: { kcal: 625, protein: 20, carbs: 113, fat: 9, fiber: 16 },
    estimatedPriceCents: 428,
    priceBasis: 'Summierte Zutatenkosten für zwei Portionen anhand eines DE-BW-Mischkorbs vom 31.08.2026; Gewürze, Salz und Wasser als Vorrat nicht eingepreist.',
    imagePrompt: 'A wide dark bowl of smoky tomato-red long-grain rice with distinct black beans, bright red pepper pieces and yellow corn kernels, finished with a fresh lime wedge and restrained cilantro; entirely plant-based, no meat and no cheese.',
  },
]

const evaluated = evaluateProviderPage({ recipes: editorialRecipes, nextCursor: null }, new Date('2026-08-31T12:00:00Z'))
export const publishableEditorialRecipes = evaluated.accepted as EditorialRecipe[]

export const editorialAppRecipes: Recipe[] = publishableEditorialRecipes.map(recipe => ({
  id: recipe.appId,
  title: recipe.title,
  description: recipe.description,
  image: `/recipes/${recipe.appId}.jpg`,
  minutes: recipe.totalMinutes,
  activeMinutes: recipe.activeMinutes,
  servings: recipe.servings,
  pricePerServing: recipe.estimatedPriceCents / 100 / recipe.servings,
  difficulty: recipe.totalMinutes <= 35 ? 'Einfach' : 'Mittel',
  diet: recipe.diet === 'pescetarisch' ? 'omnivor' : recipe.diet,
  tags: recipe.tags,
  nutrition: recipe.nutrition,
  ingredients: recipe.ingredients.map(ingredient => ({
    id: ingredient.canonicalId,
    name: ingredient.name,
    amount: ingredient.amount,
    unit: ingredient.unit,
    category: ingredient.category,
    estimatedCost: ingredient.estimatedCostCents / 100,
    allergens: ingredient.allergens,
  })),
  steps: recipe.steps,
}))
