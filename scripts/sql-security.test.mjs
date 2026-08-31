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
})
