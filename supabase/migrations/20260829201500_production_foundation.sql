-- Overlap production foundation: catalog + owner-scoped user data.
-- Apply through Supabase migrations, never ad-hoc in the dashboard.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) between 1 and 80),
  household_size smallint not null default 1 check (household_size between 1 and 20),
  servings smallint not null default 2 check (servings between 1 and 20),
  diet text not null default 'omnivor' check (diet in ('omnivor', 'vegetarisch', 'vegan', 'pescetarisch')),
  allergens text[] not null default '{}',
  excluded_ingredients text[] not null default '{}',
  favorite_cuisines text[] not null default '{}',
  max_cook_minutes smallint not null default 45 check (max_cook_minutes between 5 and 360),
  weekly_budget_cents integer check (weekly_budget_cents is null or weekly_budget_cents between 0 and 1000000),
  budget_focus smallint not null default 70 check (budget_focus between 0 and 100),
  target_meals smallint not null default 5 check (target_meals between 1 and 7),
  overlap_preference smallint not null default 60 check (overlap_preference between 0 and 100),
  cooking_confidence text not null default 'alltag' check (cooking_confidence in ('anfänger', 'alltag', 'sicher')),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ingredients (
  id uuid primary key default gen_random_uuid(),
  canonical_name text not null unique,
  aliases text[] not null default '{}',
  default_unit text not null,
  supermarket_section text not null,
  allergens text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users(id) on delete set null,
  external_id text,
  title text not null check (char_length(title) between 3 and 160),
  description text not null,
  image_url text,
  image_alt text not null,
  servings smallint not null check (servings between 1 and 50),
  total_minutes smallint not null check (total_minutes between 1 and 1440),
  active_minutes smallint not null check (active_minutes between 1 and total_minutes),
  difficulty text not null check (difficulty in ('einfach', 'mittel', 'anspruchsvoll')),
  diet text not null check (diet in ('omnivor', 'vegetarisch', 'vegan', 'pescetarisch')),
  cuisine text not null,
  meal_types text[] not null default '{}',
  tags text[] not null default '{}',
  calories integer check (calories is null or calories >= 0),
  protein_grams numeric(7,2) check (protein_grams is null or protein_grams >= 0),
  carbs_grams numeric(7,2) check (carbs_grams is null or carbs_grams >= 0),
  fat_grams numeric(7,2) check (fat_grams is null or fat_grams >= 0),
  fiber_grams numeric(7,2) check (fiber_grams is null or fiber_grams >= 0),
  estimated_price_cents integer check (estimated_price_cents is null or estimated_price_cents >= 0),
  price_region text,
  price_checked_at date,
  source_name text not null,
  source_url text not null,
  content_license text not null,
  image_license text,
  attribution_text text,
  quality_status text not null default 'draft' check (quality_status in ('draft', 'review', 'published', 'rejected')),
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_name, external_id)
);

create table public.recipe_ingredients (
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id) on delete restrict,
  position smallint not null check (position > 0),
  amount numeric(10,3) check (amount is null or amount > 0),
  unit text not null,
  preparation text,
  optional boolean not null default false,
  primary key (recipe_id, position),
  unique (recipe_id, ingredient_id, preparation)
);

create table public.recipe_steps (
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  position smallint not null check (position > 0),
  instruction text not null check (char_length(instruction) between 10 and 2000),
  timer_seconds integer check (timer_seconds is null or timer_seconds between 1 and 86400),
  primary key (recipe_id, position)
);

create table public.recipe_rights (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  asset_kind text not null check (asset_kind in ('recipe_text', 'image', 'nutrition')),
  source_name text not null,
  source_url text not null,
  license text not null,
  territory text,
  storage_permitted boolean not null default false,
  modification_permitted boolean not null default false,
  valid_from date,
  valid_until date,
  deletion_deadline date,
  attribution_text text,
  metadata jsonb not null default '{}'::jsonb,
  unique (recipe_id, asset_kind)
);

create table public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

create table public.pantry_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id) on delete cascade,
  amount numeric(10,3) check (amount is null or amount >= 0),
  unit text not null,
  best_before date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, ingredient_id)
);

create table public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  title text,
  overlap_preference smallint not null check (overlap_preference between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create table public.meal_plan_entries (
  id uuid primary key default gen_random_uuid(),
  meal_plan_id uuid not null references public.meal_plans(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete restrict,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  meal_type text not null check (meal_type in ('frühstück', 'mittagessen', 'abendessen', 'snack')),
  servings smallint not null check (servings between 1 and 50),
  note text,
  unique (meal_plan_id, day_of_week, meal_type)
);

create table public.shopping_extras (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  meal_plan_id uuid references public.meal_plans(id) on delete cascade,
  label text not null check (char_length(label) between 1 and 160),
  checked boolean not null default false,
  created_at timestamptz not null default now()
);

create index recipes_catalog_idx on public.recipes (quality_status, diet, total_minutes);
create index recipe_ingredients_ingredient_idx on public.recipe_ingredients (ingredient_id);
create index pantry_items_user_idx on public.pantry_items (user_id);
create index meal_plans_user_week_idx on public.meal_plans (user_id, week_start desc);
create index meal_plan_entries_plan_idx on public.meal_plan_entries (meal_plan_id);

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger recipes_updated_at before update on public.recipes
for each row execute function public.set_updated_at();
create trigger pantry_items_updated_at before update on public.pantry_items
for each row execute function public.set_updated_at();
create trigger meal_plans_updated_at before update on public.meal_plans
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1)));
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.ingredients enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.recipe_steps enable row level security;
alter table public.recipe_rights enable row level security;
alter table public.favorites enable row level security;
alter table public.pantry_items enable row level security;
alter table public.meal_plans enable row level security;
alter table public.meal_plan_entries enable row level security;
alter table public.shopping_extras enable row level security;

-- Supabase may add schema-level defaults for API roles. Start fail-closed, then grant only
-- the operations the browser app needs. Catalog imports use a server-side role.
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.ingredients from anon, authenticated;
revoke all on table public.recipes from anon, authenticated;
revoke all on table public.recipe_ingredients from anon, authenticated;
revoke all on table public.recipe_steps from anon, authenticated;
revoke all on table public.recipe_rights from anon, authenticated;
revoke all on table public.favorites from anon, authenticated;
revoke all on table public.pantry_items from anon, authenticated;
revoke all on table public.meal_plans from anon, authenticated;
revoke all on table public.meal_plan_entries from anon, authenticated;
revoke all on table public.shopping_extras from anon, authenticated;

grant select, update on table public.profiles to authenticated;
grant select on table public.ingredients to authenticated;
grant select on table public.recipes to authenticated;
grant select on table public.recipe_ingredients to authenticated;
grant select on table public.recipe_steps to authenticated;
grant select, insert, delete on table public.favorites to authenticated;
grant select, insert, update, delete on table public.pantry_items to authenticated;
grant select, insert, update, delete on table public.meal_plans to authenticated;
grant select, insert, update, delete on table public.meal_plan_entries to authenticated;
grant select, insert, update, delete on table public.shopping_extras to authenticated;

create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "ingredients_read" on public.ingredients for select to authenticated using (true);
create policy "recipes_read_published" on public.recipes for select to authenticated
using (quality_status = 'published');

create policy "recipe_ingredients_read_published" on public.recipe_ingredients for select to authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id and r.quality_status = 'published'));
create policy "recipe_steps_read_published" on public.recipe_steps for select to authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id and r.quality_status = 'published'));

create policy "favorites_own_all" on public.favorites for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "pantry_own_all" on public.pantry_items for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "meal_plans_own_all" on public.meal_plans for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "meal_plan_entries_own_all" on public.meal_plan_entries for all to authenticated
using (exists (select 1 from public.meal_plans p where p.id = meal_plan_id and p.user_id = (select auth.uid())))
with check (exists (select 1 from public.meal_plans p where p.id = meal_plan_id and p.user_id = (select auth.uid())));
create policy "shopping_extras_own_all" on public.shopping_extras for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
