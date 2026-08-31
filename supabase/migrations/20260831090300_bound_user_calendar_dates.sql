-- PostgreSQL supports calendar years far outside the product's planning horizon.
-- Those values are finite but unusable in pantry and week-navigation interfaces.
-- Keep authenticated browser writes inside the supported 2000–2100 calendar.
-- NOT VALID avoids scanning the uninspected production dataset while enforcing
-- both constraints for new inserts and updates.

alter table public.pantry_items
  add constraint pantry_items_best_before_range check (
    best_before is null
    or best_before between date '2000-01-01' and date '2100-12-31'
  ) not valid;

alter table public.meal_plans
  add constraint meal_plans_week_start_range check (
    week_start between date '2000-01-01' and date '2100-12-31'
  ) not valid;
