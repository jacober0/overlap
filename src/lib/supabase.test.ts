import { describe, expect, it } from 'vitest'
import { supabaseAuthOptions } from './supabase'

describe('Supabase browser auth configuration', () => {
  it('erzwingt PKCE und persistente, automatisch erneuerte Sessions', () => {
    expect(supabaseAuthOptions).toMatchObject({
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    })
  })
})
