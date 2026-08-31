-- Meal plans are keyed by the first day of their ISO calendar week. Allowing an
-- arbitrary weekday as week_start makes the unique (user_id, week_start) key
-- admit overlapping representations of the same week. Keep new browser writes
-- canonical while avoiding a scan of the uninspected production dataset.

alter table public.meal_plans
  add constraint meal_plans_week_start_monday check (
    extract(isodow from week_start) = 1
  ) not valid;
