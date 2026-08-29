import { describe, expect, it } from 'vitest'
import { isValidEmail } from './useAccount'

describe('Account validation', () => {
  it('akzeptiert plausible E-Mail-Adressen', () => {
    expect(isValidEmail('jacob@example.de')).toBe(true)
  })

  it('lehnt unvollständige E-Mail-Adressen ab', () => {
    expect(isValidEmail('jacob@')).toBe(false)
    expect(isValidEmail('jacob example.de')).toBe(false)
  })
})
