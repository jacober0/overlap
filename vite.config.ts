import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Unit tests exercise the explicit local-mode contract, independent of a developer's
// .env.local. Authenticated Supabase flows are covered separately by contract and E2E tests.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  define:
    mode === 'test'
      ? {
          'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(''),
          'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(''),
        }
      : undefined,
}))
