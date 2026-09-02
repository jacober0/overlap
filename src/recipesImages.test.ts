import { describe, expect, it } from 'vitest'
import { recipes } from './recipes'

describe('local recipe image manifest', () => {
  it('serves every publishable recipe from its deterministic local JPEG asset', () => {
    expect(recipes).toHaveLength(80)
    expect(recipes.slice(-3).map(recipe => recipe.id)).toEqual([
      'puten-zucchini-mais-laibchen',
      'herings-kartoffel-rote-bete-salat',
      'spargel-dinkel-crepes-kraeuterquark',
    ])
    for (const recipe of recipes) {
      expect(recipe.image).toBe(`/recipes/${recipe.id}.jpg`)
      expect(recipe.image).not.toContain('unsplash')
    }
  })
})
