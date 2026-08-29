import type { Recipe, ShoppingItem } from './types'

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
