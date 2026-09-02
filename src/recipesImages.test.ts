import { describe, expect, it } from 'vitest'
import { recipes } from './recipes'

describe('local recipe image manifest', () => {
  it('serves every publishable recipe from its deterministic local JPEG asset', () => {
    expect(recipes).toHaveLength(83)
    expect(recipes.slice(-3).map(recipe => recipe.id)).toEqual([
      'herings-kartoffel-rote-bete-salat',
      'spargel-dinkel-crepes-kraeuterquark',
      'huehnchen-bohnen-jambalaya',
    ])
    for (const recipe of recipes) {
      expect(recipe.image).toBe(`/recipes/${recipe.id}.jpg`)
      expect(recipe.image).not.toContain('unsplash')
    }
  })
})
