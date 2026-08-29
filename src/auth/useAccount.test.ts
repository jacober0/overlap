import { describe, expect, it } from 'vitest'
import { getMagicLinkOptions, isValidEmail } from './useAccount'

describe('Account validation', () => {
  it('akzeptiert plausible E-Mail-Adressen', () => {
    expect(isValidEmail('jacob@example.de')).toBe(true)
  })

  it('lehnt unvollständige E-Mail-Adressen ab', () => {
    expect(isValidEmail('jacob@')).toBe(false)
    expect(isValidEmail('jacob example.de')).toBe(false)
  })

  it('erlaubt Magic Links ausschließlich für eingeladene Beta-Nutzer', () => {
    expect(getMagicLinkOptions('https://beta.overlap.app')).toEqual({
      emailRedirectTo: 'https://beta.overlap.app',
      shouldCreateUser: false,
    })
  })
})
