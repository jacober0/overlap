-- Browser clients render profile preference arrays as labels and filter chips.
-- PostgreSQL permits empty and whitespace-only text array members, which have no
-- product meaning and create visually blank controls. The canonical text output
-- for such an array member is a quoted empty/whitespace string; reject that form.
-- Existing shape constraints run first for new writes, so these casts only receive
-- flat arrays without null members. NOT VALID avoids scanning production rows.

alter table public.profiles
  add constraint profiles_allergens_nonblank check (
    allergens::text !~ E'(^|[,{])"[[:space:]]*"([,}]|$)'
  ) not valid;

alter table public.profiles
  add constraint profiles_excluded_ingredients_nonblank check (
    excluded_ingredients::text !~ E'(^|[,{])"[[:space:]]*"([,}]|$)'
  ) not valid;

alter table public.profiles
  add constraint profiles_favorite_cuisines_nonblank check (
    favorite_cuisines::text !~ E'(^|[,{])"[[:space:]]*"([,}]|$)'
  ) not valid;
