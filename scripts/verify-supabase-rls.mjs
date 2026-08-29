import { randomBytes } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const required = ['SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_SERVICE_ROLE_KEY']
const missing = required.filter(name => !process.env[name])
if (missing.length) {
  console.error(`Fehlende Variablen: ${missing.join(', ')}`)
  process.exit(2)
}

const url = process.env.SUPABASE_URL
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const admin = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
const users = []

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function createTestUser(label) {
  const token = randomBytes(12).toString('hex')
  const email = `overlap-rls-${label}-${token}@example.invalid`
  const password = `${randomBytes(18).toString('base64url')}Aa1!`
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true })
  if (error || !data.user) throw error ?? new Error(`Testnutzer ${label} konnte nicht erstellt werden`)
  users.push(data.user.id)
  const client = createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const login = await client.auth.signInWithPassword({ email, password })
  if (login.error) throw login.error
  return { id: data.user.id, client }
}

try {
  const a = await createTestUser('a')
  const b = await createTestUser('b')

  const ownUpdate = await a.client.from('profiles').update({ display_name: 'RLS Nutzer A' }).eq('id', a.id).select('id')
  assert(!ownUpdate.error && ownUpdate.data?.length === 1, 'Nutzer A kann sein Profil nicht aktualisieren')

  const foreignRead = await a.client.from('profiles').select('id').eq('id', b.id)
  assert(!foreignRead.error && foreignRead.data?.length === 0, 'Nutzer A kann Profil B lesen')

  const foreignWrite = await a.client.from('profiles').update({ display_name: 'unerlaubt' }).eq('id', b.id).select('id')
  assert(!foreignWrite.error && foreignWrite.data?.length === 0, 'Nutzer A kann Profil B ändern')

  const planB = await b.client.from('meal_plans').insert({ user_id: b.id, week_start: '2099-01-05', title: 'RLS Test' }).select('id').single()
  if (planB.error) throw planB.error
  const foreignPlanRead = await a.client.from('meal_plans').select('id').eq('id', planB.data.id)
  assert(!foreignPlanRead.error && foreignPlanRead.data?.length === 0, 'Nutzer A kann Wochenplan B lesen')

  console.log('Supabase Live-RLS: PASS (Profile und Wochenpläne zwischen zwei Nutzern isoliert)')
} finally {
  for (const id of users) {
    const { error } = await admin.auth.admin.deleteUser(id)
    if (error) console.error(`Temporärer Testnutzer konnte nicht gelöscht werden: ${id}`)
  }
}
