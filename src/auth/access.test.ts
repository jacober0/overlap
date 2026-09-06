import { describe, expect, it } from 'vitest'
import { getAccessMode } from './access'

describe('Öffentlicher Zugriff', () => {
  it('öffnet die App ohne Supabase-Konfiguration (lokaler Modus)', () => {
    expect(getAccessMode({ configured: false, loading: false, authenticated: false })).toBe('app')
  })

  it('öffnet die App auch mit konfiguriertem Backend ohne Session', () => {
    expect(getAccessMode({ configured: true, loading: false, authenticated: false })).toBe('app')
  })

  it('öffnet die App mit gültiger Session', () => {
    expect(getAccessMode({ configured: true, loading: false, authenticated: true })).toBe('app')
  })

  it('öffnet die App auch während der Sessionprüfung', () => {
    expect(getAccessMode({ configured: true, loading: true, authenticated: false })).toBe('app')
  })
})
