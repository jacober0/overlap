export type CatalogIngredient = {
  canonicalId: string
  name: string
  amount: number
  unit: string
}

export type CatalogRecipeCandidate = {
  externalId: string
  title: string
  description: string
  servings: number
  totalMinutes: number
  activeMinutes: number
  diet: 'omnivor' | 'vegetarisch' | 'vegan' | 'pescetarisch'
  ingredients: CatalogIngredient[]
  steps: string[]
  nutrition: { kcal: number; protein: number; carbs: number; fat: number; fiber: number }
  estimatedPriceCents: number
  priceRegion: string
  priceCheckedAt: string
  sourceName: string
  sourceUrl: string
  contentLicense: string
  imageUrl: string
  imageLicense: string
  attributionText: string
  reviewedBy: string
  reviewedAt: string
}

const secureUrl = (value: string) => {
  try { return new URL(value).protocol === 'https:' } catch { return false }
}
const integerInRange = (value: number, min: number, max: number) => Number.isInteger(value) && value >= min && value <= max
const normalizeCanonicalId = (value: string) => value.trim().toLocaleLowerCase('de-DE')
const isoDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

export function validateCatalogRecipe(recipe: CatalogRecipeCandidate, today = new Date()) {
  const errors: string[] = []
  if (!recipe.externalId.trim()) errors.push('externalId fehlt')
  if (recipe.title.trim().length < 3) errors.push('Titel ist zu kurz')
  if (recipe.description.trim().length < 30) errors.push('Beschreibung ist zu kurz')
  if (!integerInRange(recipe.servings, 1, 50)) errors.push('Portionszahl ist ungültig')
  if (!integerInRange(recipe.activeMinutes, 1, 1440) || !integerInRange(recipe.totalMinutes, 1, 1440) || recipe.totalMinutes < recipe.activeMinutes) errors.push('Zeitangaben sind inkonsistent')
  if (recipe.ingredients.length < 4) errors.push('Mindestens vier Zutaten erforderlich')
  if (new Set(recipe.ingredients.map(item => normalizeCanonicalId(item.canonicalId))).size !== recipe.ingredients.length) errors.push('Doppelte kanonische Zutaten-ID')
  if (recipe.ingredients.some(item => !item.canonicalId.trim() || !item.name.trim() || !Number.isFinite(item.amount) || item.amount <= 0 || !item.unit.trim())) errors.push('Zutat ist unvollständig')
  if (recipe.steps.length < 3 || recipe.steps.some(step => step.trim().length < 12)) errors.push('Kochschritte sind unvollständig')
  if (Object.values(recipe.nutrition).some(value => !Number.isFinite(value) || value < 0)) errors.push('Nährwerte sind unvollständig')
  if (!Number.isInteger(recipe.estimatedPriceCents) || recipe.estimatedPriceCents <= 0) errors.push('Preisschätzung fehlt')
  if (!recipe.priceRegion.trim()) errors.push('Preisregion fehlt')
  if (!isoDate(recipe.priceCheckedAt)) errors.push('Preisdatum ist ungültig')
  else {
    const ageDays = (today.getTime() - new Date(`${recipe.priceCheckedAt}T00:00:00Z`).getTime()) / 86_400_000
    if (ageDays > 180 || ageDays < -1) errors.push('Preisschätzung ist veraltet oder liegt in der Zukunft')
  }
  if (!recipe.sourceName.trim() || !secureUrl(recipe.sourceUrl)) errors.push('Belastbare HTTPS-Quelle fehlt')
  if (!recipe.contentLicense.trim()) errors.push('Inhaltslizenz fehlt')
  if (!secureUrl(recipe.imageUrl) || !recipe.imageLicense.trim()) errors.push('Bildquelle oder Bildlizenz fehlt')
  if (!recipe.attributionText.trim()) errors.push('Attribution fehlt')
  if (!recipe.reviewedBy.trim() || !isoDate(recipe.reviewedAt)) errors.push('Menschliche Freigabe fehlt')
  else if (new Date(`${recipe.reviewedAt}T00:00:00Z`).getTime() > today.getTime()) errors.push('Menschliche Freigabe liegt in der Zukunft')
  return errors
}

export function validateCatalog(recipes: CatalogRecipeCandidate[], today = new Date()) {
  const normalizedIds = recipes.map(recipe => recipe.externalId.trim().toLocaleLowerCase('de-DE'))
  const normalizedTitles = recipes.map(recipe => recipe.title.trim().toLocaleLowerCase('de-DE'))
  const idCounts = new Map<string, number>()
  const titleCounts = new Map<string, number>()
  normalizedIds.forEach(value => idCounts.set(value, (idCounts.get(value) ?? 0) + 1))
  normalizedTitles.forEach(value => titleCounts.set(value, (titleCounts.get(value) ?? 0) + 1))

  return recipes.flatMap((recipe, index) => {
    const errors = validateCatalogRecipe(recipe, today)
    if ((idCounts.get(normalizedIds[index]) ?? 0) > 1) errors.push('externalId ist nicht eindeutig')
    if ((titleCounts.get(normalizedTitles[index]) ?? 0) > 1) errors.push('Titel ist nicht eindeutig')
    return errors.map(message => ({ externalId: recipe.externalId, message }))
  })
}
