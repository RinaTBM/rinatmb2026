-- Repair public_order_number allocation for concurrency + sequence drift.
-- Root cause: order_number_seq can lag behind existing MBM-YYYY-###### rows
-- (manual/QA inserts, cancelled orders), so nextval can collide with
-- orders_public_order_number_key.
--
-- This migration:
-- 1) Resyncs order_number_seq to at least MAX sequential suffix on orders
-- 2) Hardens generate_public_order_number() to skip candidates that already exist
-- Unique constraint orders_public_order_number_key is PRESERVED (not dropped).

-- Resync sequence from existing canonical MBM-YYYY-###### numbers only.
SELECT setval(
  'public.order_number_seq',
  GREATEST(
    COALESCE(
      (
        SELECT MAX(substring(public_order_number from '([0-9]{6})$')::bigint)
        FROM public.orders
        WHERE public_order_number ~ '^MBM-[0-9]{4}-[0-9]{6}$'
      ),
      0
    ),
    COALESCE((SELECT last_value FROM public.order_number_seq), 0)
  ),
  true
);

CREATE OR REPLACE FUNCTION public.generate_public_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n bigint;
  candidate text;
  tries int := 0;
BEGIN
  LOOP
    n := nextval('public.order_number_seq');
    candidate :=
      'MBM-' || to_char(timezone('utc', now()), 'YYYY') || '-' || lpad(n::text, 6, '0');
    EXIT WHEN NOT EXISTS (
      SELECT 1
      FROM public.orders o
      WHERE o.public_order_number = candidate
    );
    tries := tries + 1;
    IF tries > 1000 THEN
      RAISE EXCEPTION 'unable to allocate unique public_order_number after % tries', tries;
    END IF;
  END LOOP;
  RETURN candidate;
END;
$$;

REVOKE ALL ON FUNCTION public.generate_public_order_number() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.generate_public_order_number() TO service_role;
GRANT EXECUTE ON FUNCTION public.generate_public_order_number() TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_public_order_number() TO anon;
