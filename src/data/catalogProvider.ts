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

export type ImportLedger = {
  byExternalKey: Map<string, string>
  byFingerprint: Map<string, string>
}

const normalize = (value: string) => value.trim().toLocaleLowerCase('de-DE').replace(/[^a-z0-9äöüß]+/g, ' ').trim()
const isoDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

export function catalogFingerprint(recipe: ProviderRecipe) {
  const ingredients = recipe.ingredients.map(item => normalize(item.canonicalId)).sort().join('|')
  return `${normalize(recipe.title)}::${recipe.diet}::${ingredients}`
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
      else {
        if (!right.license.trim()) rightsErrors.push(`Lizenznachweis fehlt: ${kind}`)
        if (!right.storagePermitted) rightsErrors.push(`Lokale Speicherung unzulässig: ${kind}`)
        if (kind === 'recipe_text' && !right.modificationPermitted) rightsErrors.push(`Bearbeitung unzulässig: ${kind}`)
        if (right.validUntil && !isoDate(right.validUntil)) {
          rightsErrors.push(`Ungültiges Ablaufdatum: ${kind}`)
        } else if (right.validUntil && new Date(`${right.validUntil}T23:59:59Z`).getTime() < today.getTime()) {
          rightsErrors.push(`Nutzungsrecht abgelaufen: ${kind}`)
        }
      }
    }
    if (rightsErrors.length) byId.set(recipe.externalId, [...(byId.get(recipe.externalId) ?? []), ...rightsErrors])
  }
  return {
    accepted: page.recipes.filter(recipe => !byId.has(recipe.externalId)),
    rejected: page.recipes.filter(recipe => byId.has(recipe.externalId)).map(recipe => ({ recipe, errors: byId.get(recipe.externalId)! })),
    nextCursor: page.nextCursor,
  }
}

export function processProviderPage(providerId: string, page: CatalogPage, ledger: ImportLedger, today = new Date()) {
  const evaluated = evaluateProviderPage(page, today)
  const accepted: ProviderRecipe[] = []
  const rejected = [...evaluated.rejected]
  const unchanged: string[] = []

  for (const recipe of evaluated.accepted) {
    const externalKey = `${providerId}:${recipe.externalId}`
    const fingerprint = catalogFingerprint(recipe)
    const previousFingerprint = ledger.byExternalKey.get(externalKey)

    if (previousFingerprint === fingerprint) {
      unchanged.push(recipe.externalId)
      continue
    }

    const existingOwner = ledger.byFingerprint.get(fingerprint)
    if (existingOwner && existingOwner !== externalKey) {
      rejected.push({ recipe, errors: ['Kanonisches Duplikat eines vorhandenen Rezepts'] })
      continue
    }

    if (previousFingerprint && ledger.byFingerprint.get(previousFingerprint) === externalKey) {
      ledger.byFingerprint.delete(previousFingerprint)
    }
    ledger.byExternalKey.set(externalKey, fingerprint)
    ledger.byFingerprint.set(fingerprint, externalKey)
    accepted.push(recipe)
  }

  return { accepted, rejected, unchanged, nextCursor: evaluated.nextCursor }
}
