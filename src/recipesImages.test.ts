import { describe, expect, it } from 'vitest'
import { recipes } from './recipes'

describe('local recipe image manifest', () => {
  it('serves every publishable recipe from its deterministic local JPEG asset', () => {
    expect(recipes).toHaveLength(63)
    expect(recipes.slice(-3).map(recipe => recipe.id)).toEqual([
      'wirsing-pilz-buchweizen-rouladen',
      'muschel-fenchel-kartoffel-topf',
      'puten-suesskartoffel-erdnuss-eintopf',
    ])
    for (const recipe of recipes) {
      expect(recipe.image).toBe(`/recipes/${recipe.id}.jpg`)
      expect(recipe.image).not.toContain('unsplash')
    }
  })
})
