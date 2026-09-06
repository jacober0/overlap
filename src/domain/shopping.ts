import type { Category, Recipe, ShoppingItem } from './types'

const customCategoryByKeyword: [Category, string[]][] = [
  ['Kühlregal', ['milch', 'joghurt', 'käse', 'quark', 'butter', 'tofu', 'eier', 'ei ', 'schmand', 'sahne', 'creme fraiche', 'frischkäse', 'mozzarella', 'feta', 'currypasta', 'kräuterbutter', 'hafermilch', 'sojamilch', 'linsen-bio', 'frische gnocchi']],
  ['Obst', ['apfel', 'birne', 'banane', 'orange', 'zitrone', 'limette', 'beere', 'beeren', 'erdbeer', 'himbeer', 'blaubeer', 'heidelbeer', 'pfirsich', 'nektarine', 'pflaume', 'traube', 'melone', 'kiwi', 'mango', 'ananas']],
  ['Gemüse', ['tomate', 'gurke', 'salat', 'spinat', 'paprika', 'zucchini', 'karotte', 'möhre', 'lauch', 'zwiebel', 'knoblauch', 'pilz', 'champignon', 'brokkoli', 'blumenkohl', 'kohl', 'sellerie', 'kartoffel', 'süßkartoffel', 'kürbis', 'aubergine', 'frischware']],
  ['Fleisch', ['hack', 'rind', 'schwein', 'hähnchen', 'huhn', 'puten', 'lamm', 'wurst', 'salami', 'schinken', 'speck', 'filet', 'fleisch']],
  ['Backwaren', ['brot', 'brötchen', 'toast', 'baguette', 'ciabatta', 'pita', 'brötle', 'semmel', 'tortilla wrap']],
  ['Gewürze', ['salz', 'pfeffer', 'paprikapulver', 'curry', 'kümmel', 'oregano', 'basilikum getrocknet', 'thymian', 'zimt', 'essig', 'öl']],
]

export function categorizeCustomItem(name: string, fallback: Category = 'Trockenwaren'): Category {
  const lower = name.toLocaleLowerCase('de-DE')
  for (const [category, keywords] of customCategoryByKeyword) {
    if (keywords.some(keyword => lower.includes(keyword))) return category
  }
  return fallback
}

export interface CustomShoppingEntry { name: string; category: Category; checked: boolean; custom: true }

export function buildShoppingList(recipes: Recipe[], servings?: number): ShoppingItem[] {
  const items = new Map<string, ShoppingItem>()
  for (const recipe of recipes) {
    const scale = servings ? servings / recipe.servings : 1
    for (const ingredient of recipe.ingredients) {
      const scaledIngredient = {
        ...ingredient,
        amount: Number((ingredient.amount * scale).toFixed(2)),
        estimatedCost: Number((ingredient.estimatedCost * scale).toFixed(2)),
      }
      const key = `${scaledIngredient.id}:${scaledIngredient.unit}`
      const current = items.get(key)
      if (current) {
        current.amount += scaledIngredient.amount
        current.estimatedCost = Number((current.estimatedCost + scaledIngredient.estimatedCost).toFixed(2))
        if (!current.recipes.includes(recipe.title)) current.recipes.push(recipe.title)
      } else {
        items.set(key, { ...scaledIngredient, recipes: [recipe.title], checked: false })
      }
    }
  }
  return [...items.values()].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
}
