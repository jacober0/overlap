// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'
import { recipes } from './recipes'

afterEach(cleanup)

describe('Overlap app flow', () => {
  it('führt vom Onboarding in die Rezeptauswahl', async () => {
    localStorage.clear()
    render(<App />)
    expect(screen.getByRole('heading', { name: /Was soll diese Woche leichter machen/i })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Vorschläge entdecken/i }))
    expect(screen.getByRole('heading', { name: /Dein nächster Treffer/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Geil/i })).toBeInTheDocument()
  })

  it('durchsucht Titel, Tags und Zutaten, ohne harte Profilfilter zu umgehen', async () => {
    localStorage.clear()
    localStorage.setItem('overlap-stage', 'discover')
    localStorage.setItem('overlap-selected', '[]')
    render(<App />)
    const search = screen.getByRole('searchbox', { name: 'Katalog durchsuchen' })

    await userEvent.type(search, 'Erdnüsse')
    expect(screen.getByRole('heading', { name: 'Crunchy Nudel-Salat' })).toBeInTheDocument()

    await userEvent.clear(search)
    await userEvent.type(search, 'Hähnchen')
    expect(screen.getByRole('heading', { name: 'Kein passendes Gericht gefunden' })).toBeInTheDocument()
  })

  it('speichert Mahlzeitenziel, Portionen und ausgeschlossene Zutaten', async () => {
    localStorage.clear()
    render(<App />)
    await userEvent.selectOptions(screen.getByLabelText('Mahlzeiten pro Woche'), '3')
    await userEvent.selectOptions(screen.getByLabelText('Portionen pro Gericht'), '4')
    await userEvent.click(screen.getByRole('button', { name: 'Tomaten ausschließen' }))
    await userEvent.click(screen.getByRole('button', { name: /Vorschläge entdecken/i }))

    expect(JSON.parse(localStorage.getItem('overlap-preferences') || '{}')).toMatchObject({
      targetMeals: 3,
      servings: 4,
      excludedIngredients: ['tomate'],
    })
  })

  it('speichert Allergene getrennt und filtert zugeordnete Zutaten', async () => {
    localStorage.clear()
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'Gluten' }))
    await userEvent.click(screen.getByRole('button', { name: /Vorschläge entdecken/i }))

    expect(JSON.parse(localStorage.getItem('overlap-preferences') || '{}')).toMatchObject({ allergens: ['gluten'] })
    expect(screen.queryByRole('heading', { name: 'Cremige Tomatenpasta' })).not.toBeInTheDocument()
  })

  it('entfernt ein Gericht aus dem Wochenplan und persistiert die Änderung', async () => {
    localStorage.clear()
    localStorage.setItem('overlap-stage', 'plan')
    localStorage.setItem('overlap-selected', JSON.stringify([recipes[0]]))
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: 'Cremige Tomatenpasta entfernen' }))

    expect(JSON.parse(localStorage.getItem('overlap-selected') || 'null')).toEqual([])
    expect(screen.queryByText('Cremige Tomatenpasta')).not.toBeInTheDocument()
  })

  it('fällt bei beschädigten Browserdaten sicher auf das Onboarding zurück', () => {
    localStorage.clear()
    localStorage.setItem('overlap-preferences', '{kaputt')
    localStorage.setItem('overlap-selected', 'keine-liste')

    expect(() => render(<App />)).not.toThrow()
    expect(screen.getByRole('heading', { name: /Was soll diese Woche/i })).toBeInTheDocument()
  })

  it('bereinigt strukturell ungültige Browserdaten vor dem Rendern', () => {
    localStorage.clear()
    localStorage.setItem('overlap-stage', 'plan')
    localStorage.setItem('overlap-selected', JSON.stringify([{ id: 'unbekannt', title: 42 }]))
    localStorage.setItem('overlap-preferences', JSON.stringify({
      allergens: 'gluten',
      excludedIngredients: null,
      maxMinutes: 15.5,
      servings: 99,
      targetMeals: -2,
    }))

    expect(() => render(<App />)).not.toThrow()
    expect(screen.getByRole('heading', { name: /Was soll diese Woche leichter machen/i })).toBeInTheDocument()
    expect(screen.getByLabelText('Maximale Kochzeit')).toHaveValue('35')
    expect(screen.getByLabelText('Portionen pro Gericht')).toHaveValue('2')
    expect(screen.getByLabelText('Mahlzeiten pro Woche')).toHaveValue('5')
  })

  it('persistiert abgehakte Positionen der Einkaufsliste', async () => {
    localStorage.clear()
    localStorage.setItem('overlap-stage', 'shopping')
    localStorage.setItem('overlap-selected', JSON.stringify([recipes[0]]))
    render(<App />)

    const firstItem = screen.getAllByRole('checkbox')[0]
    await userEvent.click(firstItem)

    expect(JSON.parse(localStorage.getItem('overlap-checked') || '[]')).toContain(firstItem.getAttribute('data-item-id'))
  })

  it('ergänzt und persistiert eigene Einkaufspositionen', async () => {
    localStorage.clear()
    localStorage.setItem('overlap-stage', 'shopping')
    localStorage.setItem('overlap-selected', JSON.stringify([recipes[0]]))
    render(<App />)

    await userEvent.type(screen.getByLabelText('Eigene Einkaufsposition'), 'Hafermilch')
    await userEvent.click(screen.getByRole('button', { name: 'Hinzufügen' }))

    expect(screen.getByText('Hafermilch')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('overlap-custom-items') || '[]')).toContain('Hafermilch')
  })

  it('führt schrittweise durch ein ausgewähltes Rezept', async () => {
    localStorage.clear()
    localStorage.setItem('overlap-stage', 'plan')
    localStorage.setItem('overlap-selected', JSON.stringify([recipes[0]]))
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: 'Cremige Tomatenpasta kochen' }))
    expect(screen.getByText(`Schritt 1 von ${recipes[0].steps.length}`)).toBeInTheDocument()
    expect(screen.getByText(recipes[0].steps[0])).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Nächster Schritt' }))
    expect(screen.getByText(recipes[0].steps[1])).toBeInTheDocument()
  })

  it('macht immer exakt die letzte Auswahlaktion rückgängig', async () => {
    localStorage.clear()
    localStorage.setItem('overlap-stage', 'discover')
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: /Geil/ }))
    await userEvent.click(screen.getByRole('button', { name: /Nein/ }))
    await userEvent.click(screen.getByRole('button', { name: /Geil/ }))
    expect(JSON.parse(localStorage.getItem('overlap-selected') || '[]')).toHaveLength(2)

    await userEvent.click(screen.getByRole('button', { name: /Letzte Aktion rückgängig/ }))
    expect(JSON.parse(localStorage.getItem('overlap-selected') || '[]')).toHaveLength(1)
  })

  it('füllt den Plan automatisch exakt bis zum Mahlzeitenziel', async () => {
    localStorage.clear()
    localStorage.setItem('overlap-stage', 'discover')
    localStorage.setItem('overlap-preferences', JSON.stringify({
      diet: 'vegetarisch', maxMinutes: 35, budgetFocus: .7, variety: .45,
      anchorTags: ['italienisch'], excludedIngredients: [], servings: 2, targetMeals: 3,
    }))
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: /Smart Fill für 3 Gerichte/ }))
    expect(JSON.parse(localStorage.getItem('overlap-selected') || '[]')).toHaveLength(3)
  })

  it('kann ein Gericht bewusst als Meal Prep wiederholen', async () => {
    localStorage.clear()
    localStorage.setItem('overlap-stage', 'plan')
    localStorage.setItem('overlap-selected', JSON.stringify([recipes[0]]))
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: `${recipes[0].title} als Meal Prep wiederholen` }))
    expect(JSON.parse(localStorage.getItem('overlap-selected') || '[]')).toHaveLength(2)
  })

  it('kennzeichnet den lokalen Modus transparent im Account-Panel', async () => {
    localStorage.clear()
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'Profil und Konto öffnen' }))
    expect(screen.getByRole('dialog', { name: 'Profil & Synchronisierung' })).toBeInTheDocument()
    expect(screen.getByText('Lokaler Testmodus')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Essensprofil bearbeiten/i })).toBeInTheDocument()
  })
})
