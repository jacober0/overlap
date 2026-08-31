-- Protect both new and pre-existing shopping extras from cross-household plan
-- references. USING governs row visibility and mutation targets; WITH CHECK
-- governs inserted or updated values, so the ownership predicate is required
-- in both clauses.

drop policy if exists "shopping_extras_own_all" on public.shopping_extras;

create policy "shopping_extras_own_all" on public.shopping_extras for all to authenticated
using (
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
)
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
