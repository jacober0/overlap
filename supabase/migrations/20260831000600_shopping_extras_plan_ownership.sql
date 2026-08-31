-- Prevent authenticated users from attaching their shopping extras to another
-- household's meal plan. The row owner alone is insufficient because
-- shopping_extras.meal_plan_id is a cross-tenant foreign key.

drop policy if exists "shopping_extras_own_all" on public.shopping_extras;

create policy "shopping_extras_own_all" on public.shopping_extras for all to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    meal_plan_id is null
    or exists (
      select 1
      from public.meal_plans p
      where p.id = meal_plan_id
        and p.user_id = (select auth.uid())
    )
  )
);
