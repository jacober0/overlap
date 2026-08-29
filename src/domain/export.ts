import type { Recipe, ShoppingItem } from './types'

const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const formatAmount = (amount: number) => Number.isInteger(amount) ? String(amount) : amount.toLocaleString('de-DE', { maximumFractionDigits: 2 })

export function createPlanExport(
  recipes: Recipe[],
  shopping: ShoppingItem[],
  servings: number,
  customItems: string[] = [],
): string {
  const planLines = recipes.map((recipe, index) => `${days[index] ?? `Tag ${index + 1}`} · ${recipe.title} · ${servings} Portionen`)
  const shoppingLines = shopping.map(item => `☐ ${formatAmount(item.amount)} ${item.unit} ${item.name}`)
  const customLines = customItems.map(item => `☐ ${item}`)

  return [
    'OVERLAP · WOCHENPLAN',
    '',
    ...planLines,
    '',
    'EINKAUFSLISTE',
    '',
    ...shoppingLines,
    ...customLines,
  ].join('\n').trimEnd()
}
