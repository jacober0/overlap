import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

export const isSupabaseConfigured = Boolean(url && publishableKey)

export const supabaseAuthOptions = {
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: true,
  flowType: 'pkce',
} as const

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, publishableKey!, { auth: supabaseAuthOptions })
  : null
