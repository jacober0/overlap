import type { Preferences, RankedRecipe, Recipe } from './types'

const clamp = (value: number) => Math.max(0, Math.min(1, value))

export function rankRecipes(recipes: Recipe[], selected: Recipe[], preferences: Preferences): RankedRecipe[] {
  const selectedIngredientIds = new Set([...preferences.pantryIngredients, ...selected.flatMap((recipe) => recipe.ingredients.map((item) => item.id))])
  const selectedTags = new Set(selected.flatMap((recipe) => recipe.tags))

  return recipes
    .filter((recipe) => !selected.some((item) => item.id === recipe.id))
    .filter((recipe) => preferences.diet === 'omnivor' || recipe.diet === preferences.diet || (preferences.diet === 'vegetarisch' && recipe.diet === 'vegan'))
    .filter((recipe) => recipe.minutes <= preferences.maxMinutes)
    .filter((recipe) => !recipe.ingredients.some((item) => item.allergens?.some((allergen) => preferences.allergens.includes(allergen))))
    .filter((recipe) => !recipe.ingredients.some((item) => preferences.excludedIngredients.includes(item.id)))
    .map((recipe) => {
      const overlapCount = recipe.ingredients.filter((item) => selectedIngredientIds.has(item.id)).length
      const pantryCount = recipe.ingredients.filter((item) => preferences.pantryIngredients.includes(item.id)).length
      const hasOverlapContext = selected.length > 0 || preferences.pantryIngredients.length > 0
      const overlap = hasOverlapContext ? overlapCount / recipe.ingredients.length : 0
      const anchorMatch = preferences.anchorTags.length
        ? recipe.tags.filter((tag) => preferences.anchorTags.includes(tag)).length / preferences.anchorTags.length
        : 0.35
      const costFit = clamp(1 - recipe.pricePerServing / 9)
      const repeatedTags = recipe.tags.filter((tag) => selectedTags.has(tag)).length
      const diversity = selected.length ? clamp(1 - repeatedTags / Math.max(1, recipe.tags.length)) : 0.65
      const newIngredientPenalty = hasOverlapContext ? (recipe.ingredients.length - overlapCount) / Math.max(1, recipe.ingredients.length) : 0
      const efficiency = 1 - preferences.variety
      const total = Math.round(100 * clamp(
        overlap * (0.34 * efficiency) +
        anchorMatch * 0.25 +
        costFit * (0.16 + preferences.budgetFocus * 0.12) +
        diversity * (0.25 * preferences.variety) -
        newIngredientPenalty * (0.08 * efficiency)
      ))
      const reasons: string[] = []
      if (anchorMatch > 0.4) reasons.push('Passt zu deinem Geschmack')
      if (costFit > 0.6) reasons.push('Budgetfreundliche Portion')
      if (pantryCount > 0) reasons.push(`${pantryCount} Zutaten aus deinem Vorrat`)
      else if (overlap > 0) reasons.push(`${overlapCount} Zutaten nutzt du bereits`)
      if (diversity > 0.65) reasons.push('Bringt Abwechslung in die Woche')
      if (!reasons.length) reasons.push('Erfüllt deine Ernährungs- und Zeitvorgaben')
      return { recipe, total, breakdown: { overlap, anchorMatch, costFit, diversity, newIngredientPenalty }, reasons }
    })
    .sort((a, b) => b.total - a.total || a.recipe.title.localeCompare(b.recipe.title))
}
