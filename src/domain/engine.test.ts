import { describe, expect, it } from 'vitest'
import { rankRecipes } from './engine'
import type { Preferences, Recipe } from './types'

const recipes: Recipe[] = [
  {
    id: 'pasta', title: 'Tomatenpasta', description: '', image: '', minutes: 20, activeMinutes: 15,
    servings: 2, pricePerServing: 2.5, difficulty: 'Einfach', diet: 'vegetarisch',
    tags: ['italienisch', 'comfort'], nutrition: { kcal: 520, protein: 18, carbs: 78, fat: 14, fiber: 7 },
    ingredients: [{ id: 'tomate', name: 'Tomaten', amount: 400, unit: 'g', category: 'Gemüse', estimatedCost: 1.6 }],
    steps: ['Kochen'],
  },
  {
    id: 'steak', title: 'Steak', description: '', image: '', minutes: 35, activeMinutes: 30,
    servings: 2, pricePerServing: 8, difficulty: 'Mittel', diet: 'omnivor', tags: ['proteinreich'],
    nutrition: { kcal: 700, protein: 60, carbs: 10, fat: 40, fiber: 2 },
    ingredients: [{ id: 'rind', name: 'Rind', amount: 400, unit: 'g', category: 'Fleisch', estimatedCost: 12 }], steps: ['Braten'],
  },
]

const preferences: Preferences = {
  diet: 'vegetarisch', maxMinutes: 30, budgetFocus: 0.7, variety: 0.3,
  anchorTags: ['italienisch'], excludedIngredients: [], pantryIngredients: [], servings: 2, targetMeals: 5,
}

describe('rankRecipes', () => {
  it('respektiert harte Ernährungs- und Zeitfilter', () => {
    const ranked = rankRecipes(recipes, [], preferences)
    expect(ranked.map((item) => item.recipe.id)).toEqual(['pasta'])
  })

  it('liefert normalisierte Score-Komponenten und nachvollziehbare Gründe', () => {
    const [result] = rankRecipes(recipes, [], preferences)
    expect(result.total).toBeGreaterThan(0)
    expect(result.breakdown.anchorMatch).toBeGreaterThan(0)
    expect(result.breakdown.costFit).toBeGreaterThan(0)
    expect(result.reasons.join(' ')).toMatch(/Geschmack|Budget/)
  })

  it('bewertet und erklärt passende Vorratszutaten als Overlap', () => {
    const [result] = rankRecipes(recipes, [], { ...preferences, pantryIngredients: ['tomate'] })
    expect(result.breakdown.overlap).toBeGreaterThan(0)
    expect(result.reasons.join(' ')).toMatch(/Vorrat/)
  })
})
