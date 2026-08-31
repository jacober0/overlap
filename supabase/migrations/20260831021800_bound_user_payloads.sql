-- Bound fields writable by authenticated browser clients. RLS isolates tenants,
-- but it does not limit how much data a valid account can store in one row.
-- NOT VALID avoids an unsafe full-table validation against an uninspected
-- production dataset while still enforcing each constraint for new writes.

alter table public.profiles
  add constraint profiles_allergens_size check (
    cardinality(allergens) <= 50
    and char_length(array_to_string(allergens, '')) <= 1000
  ) not valid;

alter table public.profiles
  add constraint profiles_excluded_ingredients_size check (
    cardinality(excluded_ingredients) <= 100
    and char_length(array_to_string(excluded_ingredients, '')) <= 4000
  ) not valid;

alter table public.profiles
  add constraint profiles_favorite_cuisines_size check (
    cardinality(favorite_cuisines) <= 50
    and char_length(array_to_string(favorite_cuisines, '')) <= 2000
  ) not valid;

alter table public.pantry_items
  add constraint pantry_items_unit_size check (
    char_length(btrim(unit)) between 1 and 32
  ) not valid;

alter table public.meal_plans
  add constraint meal_plans_title_size check (
    title is null or char_length(title) <= 160
  ) not valid;

alter table public.meal_plan_entries
  add constraint meal_plan_entries_note_size check (
    note is null or char_length(note) <= 500
  ) not valid;
