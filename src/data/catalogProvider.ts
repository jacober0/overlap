import { validateCatalog, type CatalogRecipeCandidate } from '../domain/catalog'

export type RecipeRights = {
  assetKind: 'recipe_text' | 'image' | 'nutrition'
  license: string
  storagePermitted: boolean
  modificationPermitted: boolean
  validUntil?: string
  deletionDeadline?: string
}

export type ProviderRecipe = CatalogRecipeCandidate & {
  rights: RecipeRights[]
}

export type CatalogPage = {
  recipes: ProviderRecipe[]
  nextCursor: string | null
}

export interface CatalogProvider {
  readonly id: string
  fetchPage(cursor?: string): Promise<CatalogPage>
}

export function evaluateProviderPage(page: CatalogPage, today = new Date()) {
  const catalogErrors = validateCatalog(page.recipes, today)
  const byId = new Map<string, string[]>()
  for (const error of catalogErrors) {
    const list = byId.get(error.externalId) ?? []
    list.push(error.message)
    byId.set(error.externalId, list)
  }
  for (const recipe of page.recipes) {
    const rightsErrors: string[] = []
    for (const kind of ['recipe_text', 'image', 'nutrition'] as const) {
      const right = recipe.rights.find(item => item.assetKind === kind)
      if (!right) rightsErrors.push(`Rechtenachweis fehlt: ${kind}`)
      else if (!right.storagePermitted) rightsErrors.push(`Lokale Speicherung unzulässig: ${kind}`)
    }
    if (rightsErrors.length) byId.set(recipe.externalId, [...(byId.get(recipe.externalId) ?? []), ...rightsErrors])
  }
  return {
    accepted: page.recipes.filter(recipe => !byId.has(recipe.externalId)),
    rejected: page.recipes.filter(recipe => byId.has(recipe.externalId)).map(recipe => ({ recipe, errors: byId.get(recipe.externalId)! })),
    nextCursor: page.nextCursor,
  }
}
