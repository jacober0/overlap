-- Keep user-owned references inside the published catalog boundary. Foreign-key
-- validation alone allows a client that knows or guesses a UUID to reference a
-- draft, review, or rejected recipe. USING also hides legacy references when a
-- previously published recipe is withdrawn.

drop policy if exists "favorites_own_all" on public.favorites;
drop policy if exists "meal_plan_entries_own_all" on public.meal_plan_entries;

create policy "favorites_own_all" on public.favorites for all to authenticated
using (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.recipes r
    where r.id = recipe_id
      and r.quality_status = 'published'
  )
)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.recipes r
    where r.id = recipe_id
      and r.quality_status = 'published'
  )
);

create policy "meal_plan_entries_own_all" on public.meal_plan_entries for all to authenticated
using (
  exists (
    select 1
    from public.meal_plans p
    where p.id = meal_plan_id
      and p.user_id = (select auth.uid())
  )
  and exists (
    select 1
    from public.recipes r
    where r.id = recipe_id
      and r.quality_status = 'published'
  )
)
with check (
  exists (
    select 1
    from public.meal_plans p
    where p.id = meal_plan_id
      and p.user_id = (select auth.uid())
  )
  and exists (
    select 1
    from public.recipes r
    where r.id = recipe_id
      and r.quality_status = 'published'
  )
);
