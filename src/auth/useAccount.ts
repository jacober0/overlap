import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function getMagicLinkOptions(origin: string) {
  return { emailRedirectTo: origin, shouldCreateUser: false }
}

export function useAccount() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) return
    let mounted = true
    void supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session)
        setLoading(false)
      }
    })
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })
    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  const sendMagicLink = async (email: string) => {
    if (!supabase) throw new Error('Supabase ist noch nicht konfiguriert.')
    if (!isValidEmail(email)) throw new Error('Bitte gib eine gültige E-Mail-Adresse ein.')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: getMagicLinkOptions(window.location.origin),
    })
    if (error) throw error
  }

  const signOut = async () => {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return { configured: isSupabaseConfigured, loading, session, sendMagicLink, signOut }
}
