// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Overlap app flow', () => {
  it('führt vom Onboarding in die Rezeptauswahl', async () => {
    localStorage.clear()
    render(<App />)
    expect(screen.getByRole('heading', { name: /Was soll diese Woche leichter machen/i })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Vorschläge entdecken/i }))
    expect(screen.getByRole('heading', { name: /Dein nächster Treffer/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Geil/i })).toBeInTheDocument()
  })
})
