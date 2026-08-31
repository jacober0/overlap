-- Profiles contain both user preferences and server-managed identity/audit fields.
-- Replace the table-wide UPDATE privilege with an explicit browser allowlist so
-- authenticated clients cannot rewrite primary-key or timestamp columns. RLS
-- continues to restrict these updates to the caller's own row.

revoke update on table public.profiles from authenticated;

grant update (
  display_name,
  household_size,
  servings,
  diet,
  allergens,
  excluded_ingredients,
  favorite_cuisines,
  max_cook_minutes,
  weekly_budget_cents,
  budget_focus,
  target_meals,
  overlap_preference,
  cooking_confidence,
  onboarding_completed
) on table public.profiles to authenticated;
