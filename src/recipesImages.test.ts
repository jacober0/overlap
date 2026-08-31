import { describe, expect, it } from 'vitest'
import { recipes } from './recipes'

describe('local recipe image manifest', () => {
  it('serves every publishable recipe from its deterministic local JPEG asset', () => {
    expect(recipes).toHaveLength(51)
    expect(recipes.slice(-3).map(recipe => recipe.id)).toEqual([
      'miso-kuerbis-udon-pak-choi',
      'lauch-birnen-quiche',
      'rind-rote-bete-borschtsch',
    ])
    for (const recipe of recipes) {
      expect(recipe.image).toBe(`/recipes/${recipe.id}.jpg`)
      expect(recipe.image).not.toContain('unsplash')
    }
  })
})
