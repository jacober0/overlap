import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const migrationDirectory = join(root, 'supabase', 'migrations')
const migrations = readdirSync(migrationDirectory)
  .filter(file => file.endsWith('.sql'))
  .sort()
  .map(file => readFileSync(join(migrationDirectory, file), 'utf8'))
  .join('\n')

function latestPolicyDefinition(policyName) {
  const escapedName = policyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const definitions = [...migrations.matchAll(new RegExp(`create policy "${escapedName}"[\\s\\S]*?;`, 'gi'))]
  return definitions.at(-1)?.[0] ?? ''
}

function expectPublishedRecipeBoundary(policyName) {
  const policy = latestPolicyDefinition(policyName)

  // USING must hide legacy references after a recipe is unpublished; WITH CHECK
  // must reject new references to draft/review/rejected catalog records.
  expect(policy.match(/from\s+public\.recipes/gi)).toHaveLength(2)
  expect(policy.match(/r\.id\s*=\s*recipe_id/gi)).toHaveLength(2)
  expect(policy.match(/r\.quality_status\s*=\s*'published'/gi)).toHaveLength(2)
}

describe('SQL tenant boundaries', () => {
  it('bindet eigene Einkaufszusätze auch an einen eigenen Wochenplan', () => {
    const policy = latestPolicyDefinition('shopping_extras_own_all')

    expect(policy).toMatch(/auth\.uid\(\)\)\s*=\s*user_id/i)
    expect(policy).toMatch(/meal_plan_id\s+is\s+null/i)
    // Both USING (existing-row visibility/mutation) and WITH CHECK (new row
    // values) must verify plan ownership. Checking only WITH CHECK leaves any
    // pre-existing inconsistent row visible to its user_id owner.
    expect(policy.match(/from\s+public\.meal_plans/gi)).toHaveLength(2)
    expect(policy.match(/p\.id\s*=\s*meal_plan_id/gi)).toHaveLength(2)
    expect(policy.match(/p\.user_id\s*=\s*\(select\s+auth\.uid\(\)\)/gi)).toHaveLength(2)
  })

  it('exposes favorites only for published catalog recipes', () => {
    expectPublishedRecipeBoundary('favorites_own_all')
  })

  it('exposes meal-plan entries only for published catalog recipes', () => {
    expectPublishedRecipeBoundary('meal_plan_entries_own_all')
  })

  it('normalizes untrusted signup metadata before creating a profile', () => {
    const definitions = [...migrations.matchAll(/create\s+or\s+replace\s+function\s+public\.handle_new_user\(\)[\s\S]*?\$\$;/gi)]
    const handler = definitions.at(-1)?.[0] ?? ''

    // Auth metadata is client-controlled. Blank or oversized display names must
    // not violate the profile constraint and roll back an otherwise valid signup.
    expect(handler).toMatch(/nullif\s*\(\s*btrim\s*\(\s*new\.raw_user_meta_data\s*->>\s*'display_name'\s*\)\s*,\s*''\s*\)/i)
    expect(handler).toMatch(/left\s*\([\s\S]*,\s*80\s*\)/i)
    expect(handler).toMatch(/coalesce\s*\([\s\S]*'Overlap Nutzer'[\s\S]*\)/i)
  })

  it('bounds authenticated user-controlled text and array payloads', () => {
    // These columns are directly writable through PostgREST. Database limits
    // prevent a valid account from storing arbitrarily large payloads.
    for (const constraint of [
      'profiles_allergens_size',
      'profiles_excluded_ingredients_size',
      'profiles_favorite_cuisines_size',
      'pantry_items_unit_size',
      'meal_plans_title_size',
      'meal_plan_entries_note_size',
    ]) {
      expect(migrations).toMatch(new RegExp(`add\\s+constraint\\s+${constraint}[\\s\\S]*?not\\s+valid`, 'i'))
    }
    expect(migrations).toMatch(/cardinality\s*\(\s*allergens\s*\)\s*<=\s*50/i)
    expect(migrations).toMatch(/char_length\s*\(\s*array_to_string\s*\(\s*excluded_ingredients[\s\S]*?\)\s*<=\s*4000/i)
    expect(migrations).toMatch(/char_length\s*\(\s*btrim\s*\(\s*unit\s*\)\s*\)\s+between\s+1\s+and\s+32/i)
    expect(migrations).toMatch(/title\s+is\s+null\s+or\s+char_length\s*\(\s*title\s*\)\s*<=\s*160/i)
    expect(migrations).toMatch(/note\s+is\s+null\s+or\s+char_length\s*\(\s*note\s*\)\s*<=\s*500/i)
  })

  it('rejects non-finite dates from authenticated browser writes', () => {
    // PostgreSQL accepts the special date values infinity and -infinity. They are
    // not ISO calendar dates and can break week navigation or expiry handling in
    // browser clients, so writable date columns must reject them at the boundary.
    for (const constraint of [
      'pantry_items_best_before_finite',
      'meal_plans_week_start_finite',
    ]) {
      expect(migrations).toMatch(new RegExp(`add\\s+constraint\\s+${constraint}[\\s\\S]*?not\\s+valid`, 'i'))
    }
    expect(migrations).toMatch(/best_before\s+is\s+null\s+or\s+isfinite\s*\(\s*best_before\s*\)/i)
    expect(migrations).toMatch(/isfinite\s*\(\s*week_start\s*\)/i)
  })

  it('keeps server-managed profile columns immutable through the browser role', () => {
    const revokeAt = migrations.search(/revoke\s+update\s+on\s+table\s+public\.profiles\s+from\s+authenticated/i)
    const columnGrant = migrations.match(/grant\s+update\s*\(([^)]+)\)\s+on\s+table\s+public\.profiles\s+to\s+authenticated/i)

    expect(revokeAt).toBeGreaterThan(-1)
    expect(columnGrant).not.toBeNull()
    expect(columnGrant?.index).toBeGreaterThan(revokeAt)

    const writableColumns = columnGrant?.[1].split(',').map(column => column.trim()) ?? []
    expect(writableColumns).toEqual([
      'display_name',
      'household_size',
      'servings',
      'diet',
      'allergens',
      'excluded_ingredients',
      'favorite_cuisines',
      'max_cook_minutes',
      'weekly_budget_cents',
      'budget_focus',
      'target_meals',
      'overlap_preference',
      'cooking_confidence',
      'onboarding_completed',
    ])
  })

  it('keeps identity and audit columns immutable on browser-managed user data', () => {
    const expectedGrants = {
      favorites: {
        insert: ['user_id', 'recipe_id'],
      },
      pantry_items: {
        insert: ['user_id', 'ingredient_id', 'amount', 'unit', 'best_before'],
        update: ['ingredient_id', 'amount', 'unit', 'best_before'],
      },
      meal_plans: {
        insert: ['user_id', 'week_start', 'title', 'overlap_preference'],
        update: ['week_start', 'title', 'overlap_preference'],
      },
      meal_plan_entries: {
        insert: ['meal_plan_id', 'recipe_id', 'day_of_week', 'meal_type', 'servings', 'note'],
        update: ['meal_plan_id', 'recipe_id', 'day_of_week', 'meal_type', 'servings', 'note'],
      },
      shopping_extras: {
        insert: ['user_id', 'meal_plan_id', 'label', 'checked'],
        update: ['meal_plan_id', 'label', 'checked'],
      },
    }

    for (const [table, operations] of Object.entries(expectedGrants)) {
      const revoke = new RegExp(`revoke\\s+insert\\s*,\\s*update\\s+on\\s+table\\s+public\\.${table}\\s+from\\s+authenticated`, 'i')
      const revokeAt = migrations.search(revoke)
      expect(revokeAt, `${table} must revoke broad writes`).toBeGreaterThan(-1)

      for (const [operation, columns] of Object.entries(operations)) {
        const grant = migrations.match(new RegExp(`grant\\s+${operation}\\s*\\(([^)]+)\\)\\s+on\\s+table\\s+public\\.${table}\\s+to\\s+authenticated`, 'i'))
        expect(grant, `${table} needs a column-level ${operation} grant`).not.toBeNull()
        expect(grant?.index, `${table} must grant only after revoking`).toBeGreaterThan(revokeAt)
        expect(grant?.[1].split(',').map(column => column.trim())).toEqual(columns)
      }
    }
  })
})
