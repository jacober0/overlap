-- PostgreSQL accepts the special date literals infinity and -infinity. Browser
-- clients expect ISO calendar dates for pantry expiry and week navigation, so
-- reject non-finite values at the database boundary. NOT VALID avoids scanning
-- uninspected production rows while enforcing the constraints on new writes.

alter table public.pantry_items
  add constraint pantry_items_best_before_finite check (
    best_before is null or isfinite(best_before)
  ) not valid;

alter table public.meal_plans
  add constraint meal_plans_week_start_finite check (
    isfinite(week_start)
  ) not valid;
