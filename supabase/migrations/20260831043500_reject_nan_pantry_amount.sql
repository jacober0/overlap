-- PostgreSQL numeric treats NaN as greater than ordinary finite values, so the
-- original non-negative check accepts it. Pantry quantities are browser-writable
-- and must remain usable for shopping aggregation. NOT VALID avoids scanning
-- uninspected production rows while enforcing the constraint on new writes.

alter table public.pantry_items
  add constraint pantry_items_amount_not_nan check (
    amount is null or amount <> 'NaN'::numeric
  ) not valid;
