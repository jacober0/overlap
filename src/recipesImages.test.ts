import { describe, expect, it } from 'vitest'
import { recipes } from './recipes'

describe('local recipe image manifest', () => {
  it('serves every publishable recipe from its deterministic local JPEG asset', () => {
    expect(recipes).toHaveLength(36)
    expect(recipes.slice(-4).map(recipe => recipe.id)).toEqual([
      'rosenkohl-kartoffel-linsen-blech',
      'seelachs-lauch-kartoffel-topf',
      'paprika-hirse-pfanne-halloumi',
      'kuerbis-bohnen-chili',
    ])
    for (const recipe of recipes) {
      expect(recipe.image).toBe(`/recipes/${recipe.id}.jpg`)
      expect(recipe.image).not.toContain('unsplash')
    }
  })
})
