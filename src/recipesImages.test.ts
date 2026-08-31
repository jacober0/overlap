import { describe, expect, it } from 'vitest'
import { recipes } from './recipes'

describe('local recipe image manifest', () => {
  it('serves every publishable recipe from its deterministic local JPEG asset', () => {
    expect(recipes).toHaveLength(40)
    expect(recipes.slice(-4).map(recipe => recipe.id)).toEqual([
      'pastinaken-weisse-bohnen-suppe',
      'haehnchen-spitzkohl-reis-pfanne',
      'rote-bete-kartoffel-gratin',
      'garnelen-erbsen-dinkel-orzotto',
    ])
    for (const recipe of recipes) {
      expect(recipe.image).toBe(`/recipes/${recipe.id}.jpg`)
      expect(recipe.image).not.toContain('unsplash')
    }
  })
})
