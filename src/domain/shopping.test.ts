import { describe, expect, it } from 'vitest'
import { buildShoppingList } from './shopping'
import type { Recipe } from './types'

const base: Omit<Recipe, 'id' | 'title' | 'ingredients'> = {
  description: '', image: '', imageStatus: 'neutral-fallback', minutes: 20, activeMinutes: 10, servings: 2,
  pricePerServing: 2, difficulty: 'Einfach', diet: 'vegan', tags: [],
  nutrition: { kcal: 400, protein: 15, carbs: 50, fat: 12, fiber: 8 }, steps: ['Kochen'],
}

const recipes: Recipe[] = [
  { ...base, id: 'a', title: 'A', ingredients: [{ id: 'tomate', name: 'Tomaten', amount: 300, unit: 'g', category: 'Gemüse', estimatedCost: 1.2 }] },
  { ...base, id: 'b', title: 'B', ingredients: [{ id: 'tomate', name: 'Tomaten', amount: 200, unit: 'g', category: 'Gemüse', estimatedCost: 0.8 }] },
]

describe('buildShoppingList', () => {
  it('aggregiert gleiche kanonische Zutaten samt Rezeptquellen', () => {
    const list = buildShoppingList(recipes)
    expect(list).toHaveLength(1)
    expect(list[0]).toMatchObject({ id: 'tomate', amount: 500, unit: 'g', category: 'Gemüse', estimatedCost: 2 })
    expect(list[0].recipes).toEqual(['A', 'B'])
  })

  it('skaliert Mengen und Kosten auf die gewünschte Portionszahl', () => {
    const list = buildShoppingList([recipes[0]], 4)
    expect(list[0]).toMatchObject({ amount: 600, estimatedCost: 2.4 })
  })
})
