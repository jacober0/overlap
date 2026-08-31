-- Auth user metadata is client-controlled. Normalize it before inserting the
-- constrained profile row so blank or oversized names cannot roll back signup.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_display_name text := nullif(btrim(new.raw_user_meta_data ->> 'display_name'), '');
  email_display_name text := nullif(btrim(split_part(coalesce(new.email, ''), '@', 1)), '');
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(requested_display_name, email_display_name, 'Overlap Nutzer'), 80)
  );
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
