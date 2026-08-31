import { describe, expect, it } from 'vitest'
import { recipes } from './recipes'

describe('local recipe image manifest', () => {
  it('serves every publishable recipe from its deterministic local JPEG asset', () => {
    expect(recipes).toHaveLength(16)
    expect(recipes.slice(-4).map(recipe => recipe.id)).toEqual([
      'rote-linsen-kokos-suppe',
      'pilz-graupen-risotto',
      'zucchini-kartoffel-roesti',
      'paprika-bohnen-reis',
    ])
    for (const recipe of recipes) {
      expect(recipe.image).toBe(`/recipes/${recipe.id}.jpg`)
      expect(recipe.image).not.toContain('unsplash')
    }
  })
})
