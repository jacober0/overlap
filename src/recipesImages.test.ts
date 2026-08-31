import { describe, expect, it } from 'vitest'
import { recipes } from './recipes'

describe('local recipe image manifest', () => {
  it('serves every publishable recipe from its deterministic local JPEG asset', () => {
    expect(recipes).toHaveLength(44)
    expect(recipes.slice(-4).map(recipe => recipe.id)).toEqual([
      'weisse-bohnen-polenta-auflauf',
      'puten-kuerbis-bulgur-pfanne',
      'linsen-wurzelgemuese-hirse-topf',
      'forelle-rote-bete-graupen-salat',
    ])
    for (const recipe of recipes) {
      expect(recipe.image).toBe(`/recipes/${recipe.id}.jpg`)
      expect(recipe.image).not.toContain('unsplash')
    }
  })
})
