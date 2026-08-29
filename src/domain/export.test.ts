import { describe, expect, it } from 'vitest'
import { recipes } from '../recipes'
import { buildShoppingList } from './shopping'
import { createPlanExport } from './export'


describe('createPlanExport', () => {
  it('exportiert Wochenplan, skalierte Einkaufsliste und eigene Ergänzungen', () => {
    const selected = [recipes[0]]
    const shopping = buildShoppingList(selected, 4)
    const text = createPlanExport(selected, shopping, 4, ['Hafermilch'])

    expect(text).toContain('OVERLAP · WOCHENPLAN')
    expect(text).toContain('Mo · Cremige Tomatenpasta · 4 Portionen')
    expect(text).toContain('800 g Tomaten')
    expect(text).toContain('Hafermilch')
  })
})
