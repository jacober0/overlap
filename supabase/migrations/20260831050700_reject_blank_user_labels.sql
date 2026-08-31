-- PostgreSQL char_length counts whitespace, so the original checks permit
-- labels that render as empty. These fields are writable by authenticated browser
-- clients and appear directly in account and shopping-list UI. NOT VALID avoids
-- scanning uninspected production rows while enforcing the checks on new writes.

alter table public.profiles
  add constraint profiles_display_name_not_blank check (
    char_length(btrim(display_name)) between 1 and 80
  ) not valid;

alter table public.shopping_extras
  add constraint shopping_extras_label_not_blank check (
    char_length(btrim(label)) between 1 and 160
  ) not valid;
