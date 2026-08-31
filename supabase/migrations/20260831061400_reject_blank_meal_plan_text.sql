-- Optional meal-plan labels should use NULL to represent absence. PostgreSQL
-- char_length counts whitespace, so the existing size checks permit titles and
-- notes that render as empty. NOT VALID avoids scanning uninspected production
-- rows while enforcing these constraints for new writes.

alter table public.meal_plans
  add constraint meal_plans_title_not_blank check (
    title is null or char_length(btrim(title)) between 1 and 160
  ) not valid;

alter table public.meal_plan_entries
  add constraint meal_plan_entries_note_not_blank check (
    note is null or char_length(btrim(note)) between 1 and 500
  ) not valid;
