-- PostgreSQL text[] permits multidimensional values and null members, while the
-- browser and TypeScript profile contract model each preference as a flat
-- string[]. Keep malformed values from entering new rows without scanning the
-- uninspected production dataset. CASE avoids calling array_position on a
-- multidimensional value, which PostgreSQL does not support.

alter table public.profiles
  add constraint profiles_allergens_shape check (
    case
      when coalesce(array_ndims(allergens), 1) = 1
        then array_position(allergens, null) is null
      else false
    end
  ) not valid;

alter table public.profiles
  add constraint profiles_excluded_ingredients_shape check (
    case
      when coalesce(array_ndims(excluded_ingredients), 1) = 1
        then array_position(excluded_ingredients, null) is null
      else false
    end
  ) not valid;

alter table public.profiles
  add constraint profiles_favorite_cuisines_shape check (
    case
      when coalesce(array_ndims(favorite_cuisines), 1) = 1
        then array_position(favorite_cuisines, null) is null
      else false
    end
  ) not valid;
