import { describe, expect, it } from 'vitest'
import { recipes } from './recipes'

describe('local recipe image manifest', () => {
  it('serves every publishable recipe from its deterministic local JPEG asset', () => {
    expect(recipes).toHaveLength(20)
    expect(recipes.slice(-4).map(recipe => recipe.id)).toEqual([
      'fenchel-bohnen-schmortopf',
      'suesskartoffel-kichererbsen-blech',
      'spinat-kartoffel-frittata',
      'haehnchen-linsen-pfanne',
    ])
    for (const recipe of recipes) {
      expect(recipe.image).toBe(`/recipes/${recipe.id}.jpg`)
      expect(recipe.image).not.toContain('unsplash')
    }
  })
})
