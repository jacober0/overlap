// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const migration = readFileSync(
  new URL('../../supabase/migrations/20260829201500_production_foundation.sql', import.meta.url),
  'utf8',
)

describe('Supabase security contract', () => {
  it('enables RLS for every user-owned table', () => {
    for (const table of ['profiles', 'favorites', 'pantry_items', 'meal_plans', 'meal_plan_entries', 'shopping_extras']) {
      expect(migration).toContain(`alter table public.${table} enable row level security`)
    }
  })

  it('binds user-owned records to auth.uid()', () => {
    expect(migration).toContain('(select auth.uid()) = id')
    expect(migration).toContain('(select auth.uid()) = user_id')
    expect(migration).toContain('p.user_id = (select auth.uid())')
  })

  it('never grants unrestricted writes to personal tables', () => {
    expect(migration).not.toMatch(/on public\.(profiles|favorites|pantry_items|meal_plans|meal_plan_entries|shopping_extras)[\s\S]{0,180}using \(true\)/)
  })

  it('requires provenance, review state and a protected rights manifest for catalog recipes', () => {
    for (const field of ['source_name text not null', 'source_url text not null', 'content_license text not null', 'quality_status text not null']) {
      expect(migration).toContain(field)
    }
    expect(migration).toContain("quality_status = 'published'")
    expect(migration).toContain('alter table public.recipe_rights enable row level security')
    expect(migration).toContain('storage_permitted boolean not null default false')
    expect(migration).not.toMatch(/recipe_rights[^;]+for select to anon/)
  })

  it('revokes implicit API grants before granting least privilege', () => {
    for (const table of ['profiles', 'ingredients', 'recipes', 'recipe_ingredients', 'recipe_steps', 'recipe_rights', 'favorites', 'pantry_items', 'meal_plans', 'meal_plan_entries', 'shopping_extras']) {
      expect(migration).toContain(`revoke all on table public.${table} from anon, authenticated`)
    }
    expect(migration).toContain('grant select, update on table public.profiles to authenticated')
    expect(migration).toContain('grant select on table public.recipes to authenticated')
    expect(migration).not.toMatch(/grant [^;]+ on table public\.[^;]+ to anon/)
  })

  it('keeps catalog writes and rights metadata out of browser roles', () => {
    expect(migration).not.toMatch(/grant (insert|update|delete|all)[^;]+public\.(recipes|recipe_ingredients|recipe_steps|recipe_rights)/)
    expect(migration).not.toMatch(/create policy "recipes_(insert|update|delete)/)
    expect(migration).not.toMatch(/create policy "recipe_rights_/)
  })

  it('does not expose internal trigger functions through the API', () => {
    expect(migration).toContain('revoke all on function public.set_updated_at() from public, anon, authenticated')
    expect(migration).toContain('revoke all on function public.handle_new_user() from public, anon, authenticated')
  })
})
