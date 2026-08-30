import type { Preferences } from '../domain/types'
import { supabase } from '../lib/supabase'

type ProfileRow = {
  servings: unknown
  diet: unknown
  allergens: unknown
  excluded_ingredients: unknown
  favorite_cuisines: unknown
  max_cook_minutes: unknown
  budget_focus: unknown
  overlap_preference: unknown
  target_meals: unknown
  onboarding_completed: unknown
}

type ValidProfileRow = {
  servings: number
  diet: Preferences['diet']
  allergens: Preferences['allergens']
  excluded_ingredients: string[]
  favorite_cuisines: string[]
  max_cook_minutes: number
  budget_focus: number
  overlap_preference: number
  target_meals: number
  onboarding_completed: true
}

const supportedDiets = new Set<Preferences['diet']>(['omnivor', 'vegetarisch', 'vegan'])
const supportedAllergens = new Set<Preferences['allergens'][number]>(['gluten', 'milch', 'ei', 'erdnuss', 'soja', 'sesam', 'schalenfruechte', 'fisch'])
const isIntegerInRange = (value: unknown, min: number, max: number): value is number => Number.isInteger(value) && (value as number) >= min && (value as number) <= max
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every(item => typeof item === 'string')

function isValidCompletedProfile(row: ProfileRow): row is ValidProfileRow {
  return row.onboarding_completed === true
    && supportedDiets.has(row.diet as Preferences['diet'])
    && isIntegerInRange(row.servings, 1, 6)
    && isIntegerInRange(row.max_cook_minutes, 15, 60)
    && isIntegerInRange(row.budget_focus, 0, 100)
    && isIntegerInRange(row.overlap_preference, 0, 100)
    && isIntegerInRange(row.target_meals, 1, 7)
    && isStringArray(row.allergens)
    && row.allergens.every(item => supportedAllergens.has(item as Preferences['allergens'][number]))
    && isStringArray(row.excluded_ingredients)
    && isStringArray(row.favorite_cuisines)
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
  if (!isValidCompletedProfile(row)) return local
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

export function resolveProfileLoad(local: Preferences, row: ProfileRow) {
  return {
    preferences: mergeProfilePreferences(local, row),
    // Only a genuine database `false` identifies a fresh profile. Malformed values
    // must never authorize an automatic write that could overwrite remote data.
    needsInitialization: row.onboarding_completed === false,
  }
}

function arePreferenceValuesEqual(
  first: Preferences[keyof Preferences],
  second: Preferences[keyof Preferences],
) {
  if (!Array.isArray(first) || !Array.isArray(second)) return first === second
  return first.length === second.length && first.every((value, index) => value === second[index])
}

export function preserveConcurrentProfileEdits(
  localAtRequest: Preferences,
  currentLocal: Preferences,
  loaded: Preferences,
): Preferences {
  if (currentLocal === localAtRequest) return loaded
  const value = <Key extends keyof Preferences>(key: Key): Preferences[Key] =>
    arePreferenceValuesEqual(currentLocal[key], localAtRequest[key]) ? loaded[key] : currentLocal[key]
  return {
    diet: value('diet'),
    maxMinutes: value('maxMinutes'),
    budgetFocus: value('budgetFocus'),
    variety: value('variety'),
    anchorTags: value('anchorTags'),
    allergens: value('allergens'),
    excludedIngredients: value('excludedIngredients'),
    pantryIngredients: value('pantryIngredients'),
    servings: value('servings'),
    targetMeals: value('targetMeals'),
  }
}

export function resolveProfileSynchronization(
  localAtRequest: Preferences,
  currentLocal: Preferences,
  result: { preferences: Preferences; needsInitialization: boolean },
) {
  const preferences = preserveConcurrentProfileEdits(localAtRequest, currentLocal, result.preferences)
  return {
    preferences,
    // A fresh profile must receive edits made while the read was in flight,
    // rather than the stale snapshot captured before that read started.
    initializationPreferences: result.needsInitialization ? preferences : null,
  }
}

export function resolveLocalProfileForUser(
  currentLocal: Preferences,
  storedOwnerId: string | null,
  userId: string,
  defaults: Preferences,
): Preferences {
  // Legacy/unowned local data may seed the first authenticated profile. Once
  // ownership is known, never expose or copy one account's profile to another.
  return storedOwnerId !== null && storedOwnerId !== userId ? defaults : currentLocal
}

export async function loadProfilePreferences(userId: string, local: Preferences) {
  if (!supabase) return { preferences: local, needsInitialization: false }
  const { data, error } = await supabase
    .from('profiles')
    .select('servings,diet,allergens,excluded_ingredients,favorite_cuisines,max_cook_minutes,budget_focus,overlap_preference,target_meals,onboarding_completed')
    .eq('id', userId)
    .single()
  if (error) throw error
  return resolveProfileLoad(local, data as ProfileRow)
}

type ProfileWriter = (userId: string, preferences: Preferences) => Promise<void>

export function createProfileSaveQueue(write: ProfileWriter): ProfileWriter {
  const pendingByUser = new Map<string, Promise<void>>()

  return (userId, preferences) => {
    const previous = pendingByUser.get(userId) ?? Promise.resolve()
    const current = previous.catch(() => undefined).then(() => write(userId, preferences))
    pendingByUser.set(userId, current)
    void current.then(
      () => { if (pendingByUser.get(userId) === current) pendingByUser.delete(userId) },
      () => { if (pendingByUser.get(userId) === current) pendingByUser.delete(userId) },
    )
    return current
  }
}

const writeProfilePreferences: ProfileWriter = async (userId, preferences) => {
  if (!supabase) return
  const { error } = await supabase.from('profiles').update(toProfileUpdate(preferences)).eq('id', userId)
  if (error) throw error
}

export const saveProfilePreferences = createProfileSaveQueue(writeProfilePreferences)
