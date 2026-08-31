import { describe, expect, it } from 'vitest'
import { recipes } from './recipes'

describe('local recipe image manifest', () => {
  it('serves every publishable recipe from its deterministic local JPEG asset', () => {
    expect(recipes).toHaveLength(60)
    expect(recipes.slice(-3).map(recipe => recipe.id)).toEqual([
      'kohlrabi-dinkel-erbsen-ragout',
      'haehnchen-pflaumen-couscous',
      'auberginen-quinoa-boote',
    ])
    for (const recipe of recipes) {
      expect(recipe.image).toBe(`/recipes/${recipe.id}.jpg`)
      expect(recipe.image).not.toContain('unsplash')
    }
  })
})
