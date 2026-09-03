import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { editorialRecipes, publishableEditorialRecipes } from './data/editorialRecipes'
import { filterRecipesBySearch, rankRecipes } from './domain/engine'
import type { Preferences } from './domain/types'
import { recipes } from './recipes'

const fallback = '/recipe-placeholder.svg'
const permissivePreferences: Preferences = {
  diet: 'omnivor', maxMinutes: 1440, budgetFocus: 0.5, variety: 0.5,
  anchorTags: [], allergens: [], excludedIngredients: [], pantryIngredients: [], servings: 2, targetMeals: 5,
}

describe('beta catalog visibility and image fallback', () => {
  it('uses newly reviewed catalog images only after individual visual approval', () => {
    const approvedIds = [
      'linsen-walnuss-cevapcici-ajvar-hirse',
      'forellen-mais-buchweizen-tacos-krautsalat',
      'kartoffel-linsen-dinkelwaffeln-pilzragout',
      'blumenkohl-kaese-graupen-kroketten-lauchcreme',
      'forellen-spinat-kartoffel-piroggen-rote-bete-salat',
    ]

    expect(recipes.filter(recipe => approvedIds.includes(recipe.id)).map(recipe => recipe.imageStatus)).toEqual([
      'individual-visual-pass',
      'individual-visual-pass',
      'individual-visual-pass',
      'individual-visual-pass',
      'individual-visual-pass',
    ])
  })

  it('makes every accepted original plus all twelve legacy seeds available without broken image requests', () => {
    expect(editorialRecipes).toHaveLength(500)
    expect(publishableEditorialRecipes).toHaveLength(500)
    expect(recipes).toHaveLength(512)
    expect(new Set(recipes.map(recipe => recipe.id)).size).toBe(512)

    for (const recipe of recipes) {
      expect(['individual-visual-pass', 'neutral-fallback']).toContain(recipe.imageStatus)
      if (recipe.imageStatus === 'individual-visual-pass') {
        expect(recipe.image).toBe(`/recipes/${recipe.id}.jpg`)
        expect(existsSync(join(process.cwd(), 'public', recipe.image))).toBe(true)
      } else {
        expect(recipe.image).toBe(fallback)
      }
    }
    expect(existsSync(join(process.cwd(), 'public', fallback))).toBe(true)
  })

  it('keeps the complete beta catalog reachable through search and recommendations', () => {
    expect(filterRecipesBySearch(recipes, '')).toHaveLength(512)
    expect(rankRecipes(recipes, [], permissivePreferences)).toHaveLength(512)
    expect(filterRecipesBySearch(recipes, 'Sellerie Erbsen Dinkel Bao').map(recipe => recipe.id)).toEqual(['sellerie-erbsen-dinkel-bao'])
  })
})
