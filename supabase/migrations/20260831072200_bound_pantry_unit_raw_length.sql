-- The existing trimmed-unit check rejects blank labels but only bounds the
-- trimmed value. A browser client can otherwise store an arbitrarily large raw
-- string padded with whitespace. Bound the full value independently while
-- retaining the non-blank check. NOT VALID avoids scanning the uninspected
-- production dataset and still protects new inserts and updates.

alter table public.pantry_items
  add constraint pantry_items_unit_raw_size check (
    char_length(unit) between 1 and 32
  ) not valid;
