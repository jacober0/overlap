// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { activateLocalAccountData, isAccountSwitch, resetLocalAccountData } from './localAccountState'

describe('local account data isolation', () => {
  it('erkennt nur den Wechsel von einem bekannten anderen Konto', () => {
    expect(isAccountSwitch(null, 'user-1')).toBe(false)
    expect(isAccountSwitch('user-1', 'user-1')).toBe(false)
    expect(isAccountSwitch('user-1', 'user-2')).toBe(true)
    expect(isAccountSwitch('', 'user-1')).toBe(true)
  })

  it('entfernt persönliche Planungsdaten bei einem Kontowechsel', () => {
    localStorage.clear()
    localStorage.setItem('overlap-preferences', '{"diet":"vegan"}')
    localStorage.setItem('overlap-stage', 'shopping')
    localStorage.setItem('overlap-selected', '[{"id":"secret-plan"}]')
    localStorage.setItem('overlap-checked', '["tomate:g"]')
    localStorage.setItem('overlap-custom-items', '["Privater Artikel"]')
    localStorage.setItem('overlap-cooking', '{"recipeId":"secret-plan","step":2}')
    localStorage.setItem('overlap-profile-owner', 'user-1')
    localStorage.setItem('unrelated-setting', 'keep')

    resetLocalAccountData(localStorage, 'user-2')

    expect(localStorage.getItem('overlap-preferences')).toBeNull()
    expect(localStorage.getItem('overlap-stage')).toBeNull()
    expect(localStorage.getItem('overlap-selected')).toBeNull()
    expect(localStorage.getItem('overlap-checked')).toBeNull()
    expect(localStorage.getItem('overlap-custom-items')).toBeNull()
    expect(localStorage.getItem('overlap-cooking')).toBeNull()
    expect(localStorage.getItem('overlap-profile-owner')).toBe('user-2')
    expect(localStorage.getItem('unrelated-setting')).toBe('keep')
  })

  it('beansprucht lokale Daten sofort für das erste authentifizierte Konto', () => {
    localStorage.clear()
    localStorage.setItem('overlap-selected', '[{"id":"local-plan"}]')

    expect(activateLocalAccountData(localStorage, 'user-1')).toBe(false)

    expect(localStorage.getItem('overlap-profile-owner')).toBe('user-1')
    expect(localStorage.getItem('overlap-selected')).toBe('[{"id":"local-plan"}]')
  })

  it('löscht beanspruchte Daten beim nächsten Kontowechsel auch ohne Profilabruf', () => {
    localStorage.clear()
    activateLocalAccountData(localStorage, 'user-1')
    localStorage.setItem('overlap-selected', '[{"id":"private-plan"}]')

    expect(activateLocalAccountData(localStorage, 'user-2')).toBe(true)

    expect(localStorage.getItem('overlap-profile-owner')).toBe('user-2')
    expect(localStorage.getItem('overlap-selected')).toBeNull()
  })
})
