import type { Preferences } from '../domain/types'
import { supabase } from '../lib/supabase'

type ProfileRow = {
  servings: number
  diet: Preferences['diet']
  allergens: Preferences['allergens']
  excluded_ingredients: string[]
  favorite_cuisines: string[]
  max_cook_minutes: number
  budget_focus: number
  overlap_preference: number
  target_meals: number
  onboarding_completed: boolean
}

export function toProfileUpdate(preferences: Preferences) {
  return {
    servings: preferences.servings,
    diet: preferences.diet,
    allergens: preferences.allergens,
    excluded_ingredients: preferences.excludedIngredients,
    favorite_cuisines: preferences.anchorTags,
    max_cook_minutes: preferences.maxMinutes,
    budget_focus: Math.round(preferences.budgetFocus * 100),
    overlap_preference: Math.round((1 - preferences.variety) * 100),
    target_meals: preferences.targetMeals,
    onboarding_completed: true,
  }
}

export function mergeProfilePreferences(local: Preferences, row: ProfileRow): Preferences {
  if (!row.onboarding_completed) return local
  return {
    ...local,
    servings: row.servings,
    diet: row.diet,
    allergens: row.allergens,
    excludedIngredients: row.excluded_ingredients,
    anchorTags: row.favorite_cuisines,
    maxMinutes: row.max_cook_minutes,
    budgetFocus: row.budget_focus / 100,
    variety: Math.round((1 - row.overlap_preference / 100) * 100) / 100,
    targetMeals: row.target_meals,
  }
}

export async function loadProfilePreferences(userId: string, local: Preferences) {
  if (!supabase) return local
  const { data, error } = await supabase
    .from('profiles')
    .select('servings,diet,allergens,excluded_ingredients,favorite_cuisines,max_cook_minutes,budget_focus,overlap_preference,target_meals,onboarding_completed')
    .eq('id', userId)
    .single()
  if (error) throw error
  return mergeProfilePreferences(local, data as ProfileRow)
}

export async function saveProfilePreferences(userId: string, preferences: Preferences) {
  if (!supabase) return
  const { error } = await supabase.from('profiles').update(toProfileUpdate(preferences)).eq('id', userId)
  if (error) throw error
}
