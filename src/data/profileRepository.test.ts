import { describe, expect, it } from 'vitest'
import type { Preferences } from '../domain/types'
import { createProfileSaveQueue, mergeProfilePreferences, resolveProfileLoad, toProfileUpdate } from './profileRepository'

const local: Preferences = {
  diet: 'vegetarisch', maxMinutes: 35, budgetFocus: .7, variety: .45,
  anchorTags: ['italienisch'], allergens: [], excludedIngredients: [], pantryIngredients: [], servings: 2, targetMeals: 5,
}

describe('profile synchronization mapping', () => {
  it('serialisiert das vollständige Essensprofil in sichere Datenbankwerte', () => {
    expect(toProfileUpdate(local)).toMatchObject({
      diet: 'vegetarisch', servings: 2, allergens: [], max_cook_minutes: 35,
      budget_focus: 70, overlap_preference: 55, target_meals: 5,
      onboarding_completed: true,
    })
  })

  it('überschreibt lokale Defaults nur mit einem abgeschlossenen Remote-Profil', () => {
    const incomplete = { servings: 6, diet: 'vegan' as const, allergens: ['gluten' as const], excluded_ingredients: [], favorite_cuisines: [], max_cook_minutes: 20, budget_focus: 20, overlap_preference: 80, target_meals: 7, onboarding_completed: false }
    expect(mergeProfilePreferences(local, incomplete)).toBe(local)
    expect(mergeProfilePreferences(local, { ...incomplete, onboarding_completed: true })).toMatchObject({ servings: 6, diet: 'vegan', maxMinutes: 20, budgetFocus: .2, variety: .2, targetMeals: 7 })
  })

  it('markiert einen neuen Remote-Datensatz explizit zur Initialisierung', () => {
    const row = { servings: 2, diet: 'vegetarisch' as const, allergens: [], excluded_ingredients: [], favorite_cuisines: [], max_cook_minutes: 30, budget_focus: 50, overlap_preference: 50, target_meals: 5, onboarding_completed: false }
    expect(resolveProfileLoad(local, row)).toEqual({ preferences: local, needsInitialization: true })
    expect(resolveProfileLoad(local, { ...row, onboarding_completed: true })).toMatchObject({ needsInitialization: false })
  })

  it('startet bei einem ungültigen Completion-Wert keine überschreibende Initialisierung', () => {
    const row = { servings: 2, diet: 'vegetarisch', allergens: [], excluded_ingredients: [], favorite_cuisines: [], max_cook_minutes: 30, budget_focus: 50, overlap_preference: 50, target_meals: 5, onboarding_completed: null }
    expect(resolveProfileLoad(local, row)).toEqual({ preferences: local, needsInitialization: false })
  })

  it('übernimmt keine ungültigen oder vom Client nicht unterstützten Remote-Werte', () => {
    const malformed = {
      servings: 20,
      diet: 'pescetarisch',
      allergens: ['gluten', 'unbekannt', 42],
      excluded_ingredients: null,
      favorite_cuisines: 'italienisch',
      max_cook_minutes: 360,
      budget_focus: -1,
      overlap_preference: 101,
      target_meals: 0,
      onboarding_completed: true,
    }

    expect(mergeProfilePreferences(local, malformed)).toEqual(local)
  })

  it('serialisiert schnelle Profiländerungen, damit der neueste Stand zuletzt geschrieben wird', async () => {
    const writes: number[] = []
    let releaseFirst!: () => void
    let markFirstStarted!: () => void
    const firstWrite = new Promise<void>(resolve => { releaseFirst = resolve })
    const firstStarted = new Promise<void>(resolve => { markFirstStarted = resolve })
    const save = createProfileSaveQueue(async (_userId, preferences) => {
      writes.push(preferences.servings)
      if (preferences.servings === 2) {
        markFirstStarted()
        await firstWrite
      }
    })

    const first = save('user-1', local)
    const second = save('user-1', { ...local, servings: 4 })
    await firstStarted
    expect(writes).toEqual([2])

    releaseFirst()
    await Promise.all([first, second])
    expect(writes).toEqual([2, 4])
  })

  it('führt den neuesten Profilstand auch nach einem fehlgeschlagenen Vorgänger aus', async () => {
    const writes: number[] = []
    const save = createProfileSaveQueue(async (_userId, preferences) => {
      writes.push(preferences.servings)
      if (preferences.servings === 2) throw new Error('offline')
    })

    const first = save('user-1', local)
    const second = save('user-1', { ...local, servings: 4 })
    await expect(first).rejects.toThrow('offline')
    await expect(second).resolves.toBeUndefined()
    expect(writes).toEqual([2, 4])
  })
})
