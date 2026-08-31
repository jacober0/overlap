-- A CHECK expression that evaluates to NULL is considered satisfied. The prior
-- display-name length and blank checks therefore still allow an authenticated
-- browser client to clear this required UI label to NULL. Keep the existing
-- constraints intact and add the missing required-value boundary separately.
-- NOT VALID avoids scanning the uninspected production dataset while enforcing
-- the rule for new inserts and updates.

alter table public.profiles
  add constraint profiles_display_name_required check (
    display_name is not null
  ) not valid;
