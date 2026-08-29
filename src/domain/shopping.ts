import type { Recipe, ShoppingItem } from './types'

export function buildShoppingList(recipes: Recipe[]): ShoppingItem[] {
  const items = new Map<string, ShoppingItem>()
  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      const key = `${ingredient.id}:${ingredient.unit}`
      const current = items.get(key)
      if (current) {
        current.amount += ingredient.amount
        current.estimatedCost = Number((current.estimatedCost + ingredient.estimatedCost).toFixed(2))
        if (!current.recipes.includes(recipe.title)) current.recipes.push(recipe.title)
      } else {
        items.set(key, { ...ingredient, recipes: [recipe.title], checked: false })
      }
    }
  }
  return [...items.values()].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
}
