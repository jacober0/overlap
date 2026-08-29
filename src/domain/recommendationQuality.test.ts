import { describe, expect, it } from 'vitest'
import { recipes } from '../recipes'
import { rankRecipes } from './engine'
import type { Diet, Preferences } from './types'

const base: Preferences = {
  diet: 'omnivor', maxMinutes: 60, budgetFocus: .7, variety: .45,
  anchorTags: [], allergens: [], excludedIngredients: [], pantryIngredients: [], servings: 2, targetMeals: 5,
}

describe('recommendation quality invariants', () => {
  it('verletzt in der gesamten Seed-Matrix niemals Ernährung, Zeit oder Ausschlüsse', () => {
    const diets: Diet[] = ['omnivor', 'vegetarisch', 'vegan']
    for (const diet of diets) {
      for (const maxMinutes of [20, 30, 45]) {
        for (const excluded of [[], ['tomate'], ['tofu', 'spinat']]) {
          const ranked = rankRecipes(recipes, [], { ...base, diet, maxMinutes, excludedIngredients: excluded })
          for (const { recipe } of ranked) {
            expect(recipe.minutes).toBeLessThanOrEqual(maxMinutes)
            expect(recipe.ingredients.some(item => excluded.includes(item.id))).toBe(false)
            if (diet === 'vegan') expect(recipe.diet).toBe('vegan')
            if (diet === 'vegetarisch') expect(recipe.diet).not.toBe('omnivor')
          }
        }
      }
    }
  })

  it('verletzt ausgewählte Allergene nie', () => {
    for (const allergen of ['gluten', 'milch', 'ei', 'soja', 'erdnuss'] as const) {
      const ranked = rankRecipes(recipes, [], { ...base, allergens: [allergen] })
      expect(ranked.every(({ recipe }) => recipe.ingredients.every((item) => !item.allergens?.includes(allergen)))).toBe(true)
    }
  })

  it('liefert nur normalisierte Scores und mindestens eine Erklärung', () => {
    for (const result of rankRecipes(recipes, [], base)) {
      expect(result.total).toBeGreaterThanOrEqual(0)
      expect(result.total).toBeLessThanOrEqual(100)
      expect(result.reasons.length).toBeGreaterThan(0)
      for (const value of Object.values(result.breakdown)) {
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThanOrEqual(1)
      }
    }
  })

  it('verschiebt den Sweetspot tatsächlich zwischen Overlap und Vielfalt', () => {
    const selected = [recipes[0]]
    const efficient = rankRecipes(recipes, selected, { ...base, variety: 0 })[0]
    const varied = rankRecipes(recipes, selected, { ...base, variety: 1 })[0]
    expect(efficient.breakdown.overlap).toBeGreaterThanOrEqual(varied.breakdown.overlap)
    expect(varied.breakdown.diversity).toBeGreaterThanOrEqual(efficient.breakdown.diversity)
  })
})
