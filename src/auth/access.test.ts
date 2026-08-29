import { describe, expect, it } from 'vitest'
import { getAccessMode } from './access'

describe('Beta access mode', () => {
  it('erlaubt lokale Entwicklung nur ohne Supabase-Konfiguration', () => {
    expect(getAccessMode({ configured: false, loading: false, authenticated: false })).toBe('local')
  })

  it('zeigt während der Sessionprüfung keinen App-Inhalt', () => {
    expect(getAccessMode({ configured: true, loading: true, authenticated: false })).toBe('loading')
  })

  it('sperrt eine konfigurierte Beta ohne Session', () => {
    expect(getAccessMode({ configured: true, loading: false, authenticated: false })).toBe('login')
  })

  it('öffnet die App erst mit gültiger Session', () => {
    expect(getAccessMode({ configured: true, loading: false, authenticated: true })).toBe('app')
  })
})
