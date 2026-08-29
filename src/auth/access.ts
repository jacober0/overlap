export type AccessMode = 'local' | 'loading' | 'login' | 'app'

export function getAccessMode(state: { configured: boolean; loading: boolean; authenticated: boolean }): AccessMode {
  if (!state.configured) return 'local'
  if (state.loading) return 'loading'
  return state.authenticated ? 'app' : 'login'
}
