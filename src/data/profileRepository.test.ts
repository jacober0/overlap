import { describe, expect, it } from 'vitest'
import type { Preferences } from '../domain/types'
import { mergeProfilePreferences, toProfileUpdate } from './profileRepository'

const local: Preferences = {
  diet: 'vegetarisch', maxMinutes: 35, budgetFocus: .7, variety: .45,
  anchorTags: ['italienisch'], excludedIngredients: [], pantryIngredients: [], servings: 2, targetMeals: 5,
}

describe('profile synchronization mapping', () => {
  it('serialisiert das vollständige Essensprofil in sichere Datenbankwerte', () => {
    expect(toProfileUpdate(local)).toMatchObject({
      diet: 'vegetarisch', servings: 2, max_cook_minutes: 35,
      budget_focus: 70, overlap_preference: 55, target_meals: 5,
      onboarding_completed: true,
    })
  })

  it('überschreibt lokale Defaults nur mit einem abgeschlossenen Remote-Profil', () => {
    const incomplete = { servings: 6, diet: 'vegan' as const, excluded_ingredients: [], favorite_cuisines: [], max_cook_minutes: 20, budget_focus: 20, overlap_preference: 80, target_meals: 7, onboarding_completed: false }
    expect(mergeProfilePreferences(local, incomplete)).toBe(local)
    expect(mergeProfilePreferences(local, { ...incomplete, onboarding_completed: true })).toMatchObject({ servings: 6, diet: 'vegan', maxMinutes: 20, budgetFocus: .2, variety: .2, targetMeals: 7 })
  })
})
