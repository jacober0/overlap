-- Browser-managed tables contain generated identifiers and audit timestamps that
-- clients never need to choose or rewrite. Replace broad INSERT/UPDATE privileges
-- with explicit column allowlists; existing owner-scoped RLS policies remain the
-- tenant boundary and DELETE privileges are unchanged.

revoke insert, update on table public.favorites from authenticated;
grant insert (user_id, recipe_id)
  on table public.favorites to authenticated;

revoke insert, update on table public.pantry_items from authenticated;
grant insert (user_id, ingredient_id, amount, unit, best_before)
  on table public.pantry_items to authenticated;
grant update (ingredient_id, amount, unit, best_before)
  on table public.pantry_items to authenticated;

revoke insert, update on table public.meal_plans from authenticated;
grant insert (user_id, week_start, title, overlap_preference)
  on table public.meal_plans to authenticated;
grant update (week_start, title, overlap_preference)
  on table public.meal_plans to authenticated;

revoke insert, update on table public.meal_plan_entries from authenticated;
grant insert (meal_plan_id, recipe_id, day_of_week, meal_type, servings, note)
  on table public.meal_plan_entries to authenticated;
grant update (meal_plan_id, recipe_id, day_of_week, meal_type, servings, note)
  on table public.meal_plan_entries to authenticated;

revoke insert, update on table public.shopping_extras from authenticated;
grant insert (user_id, meal_plan_id, label, checked)
  on table public.shopping_extras to authenticated;
grant update (meal_plan_id, label, checked)
  on table public.shopping_extras to authenticated;
