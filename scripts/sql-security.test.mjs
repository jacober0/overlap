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
})
