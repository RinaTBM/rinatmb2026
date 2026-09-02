-- MBM-PRODUCTION-MANUAL-APPLY-PREP
-- Paste into Bolt Database Query editor for PRODUCTION ONLY.
--
-- Project ref (must match): bsgtuuzwgeetsjjdrtrm
-- Live site: https://mybaremethod.com/
--
-- DO NOT run on Phoenix Closing Co.
-- DO NOT run on staging mxvaxkkwrbwhqasnsjpm.
-- DO NOT run other migrations in the same session.
--
-- Source of truth (logic unchanged):
--   supabase/migrations/20260825104500_kashu_sku_map_launch_ready.sql
--
-- Safety:
--   INSERT ... ON CONFLICT (mbm_sku) DO UPDATE  — idempotent, no duplicates
--   NO DELETE / TRUNCATE / DROP
--   NO unrelated tables
--   NO GEN changes
--   Does NOT delete historical Tagada $249 / $279 / $299 price objects
--     (those live in Tagada; this only upserts kashu_sku_map rows)
--
-- If the editor only returns the last result set, run Section A first,
-- then highlight and run Section B.

-- =============================================================================
-- SECTION A — APPLY (exact approved migration)
-- =============================================================================

-- Additive kashu_sku_map upsert for MBM-FINAL-CHECKOUT-LAUNCH-1.
-- Live-verified Tagada IDs (2026-08-25). Apply via Bolt/Supabase after owner approval.
-- Does not delete historical TIR $249 Tagada prices. Does not enable GEN API Orders.
-- create-kashu-checkout-session also falls back to these IDs if DB rows are missing/stale.

insert into public.kashu_sku_map (
  mbm_sku, mbm_product_id, mbm_variant_id,
  tagada_product_id, tagada_variant_id, tagada_price_id,
  mbm_price_cents, tagada_price_cents, is_active, notes, updated_at
) values
  ('MBM-WM-SEM-B12-001', 'p1', 'sem-b12-starting-low', 'product_6b750325addf', 'variant_f9ac5ea25184', 'price_e31ac583370d', 8900, 8900, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now()),
  ('MBM-WM-SEM-B12-002', 'p1', 'sem-b12-mid', 'product_6b750325addf', 'variant_d839f0aab609', 'price_0bf0b622fd45', 10900, 10900, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now()),
  ('MBM-WM-SEM-B12-003', 'p1', 'sem-b12-high', 'product_6b750325addf', 'variant_d9dac92d2f71', 'price_3c22af390881', 10900, 10900, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now()),
  ('MBM-WM-SEM-B12-004', 'p1', 'sem-b12-any-dose', 'product_6b750325addf', 'variant_9ffb5ebc2ee4', 'price_0b4649e6fc5b', 8900, 8900, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now()),
  ('MBM-WM-SEM-GLY-001', 'p1', 'sem-glycine-starting-low', 'product_dcc64482bbbf', 'variant_c51c894cfee6', 'price_74822644bb1f', 8900, 8900, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now()),
  ('MBM-WM-SEM-GLY-002', 'p1', 'sem-glycine-mid', 'product_dcc64482bbbf', 'variant_398f72f8ca6b', 'price_9113997a5445', 10900, 10900, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now()),
  ('MBM-WM-SEM-GLY-003', 'p1', 'sem-glycine-high', 'product_dcc64482bbbf', 'variant_a71889d8f2e1', 'price_0c321507201f', 10900, 10900, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now()),
  ('MBM-WM-SEM-GLY-004', 'p1', 'sem-glycine-any-dose', 'product_dcc64482bbbf', 'variant_cea940cbbe1a', 'price_95d6839eb9c2', 8900, 8900, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now()),
  ('MBM-WM-TIR-B12-001', 'p5', 'tir-b12-starting-low', 'product_74cd4752c9d6', 'variant_2d96cc588f51', 'price_ed0142289010', 11900, 11900, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now()),
  ('MBM-WM-TIR-B12-002', 'p5', 'tir-b12-mid', 'product_74cd4752c9d6', 'variant_0acda4e3b2d7', 'price_3db063ba334a', 14900, 14900, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now()),
  ('MBM-WM-TIR-B12-003', 'p5', 'tir-b12-high', 'product_74cd4752c9d6', 'variant_5e13db7812ee', 'price_fb5946461765', 16900, 16900, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now()),
  ('MBM-WM-TIR-B12-004', 'p5', 'tir-b12-any-dose', 'product_74cd4752c9d6', 'variant_5be6af0494ac', 'price_a6eba9a2a721', 11900, 11900, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now()),
  ('MBM-WM-TIR-GLY-001', 'p5', 'tir-glycine-starting-low', 'product_861e0edd8ab2', 'variant_ddd60b897d66', 'price_5e4581d60278', 11900, 11900, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now()),
  ('MBM-WM-TIR-GLY-002', 'p5', 'tir-glycine-mid', 'product_861e0edd8ab2', 'variant_b7e1562ee522', 'price_0e41d6b0aeab', 14900, 14900, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now()),
  ('MBM-WM-TIR-GLY-003', 'p5', 'tir-glycine-high', 'product_861e0edd8ab2', 'variant_121e6d8cd921', 'price_9803c9a96da8', 16900, 16900, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now()),
  ('MBM-WM-TIR-GLY-004', 'p5', 'tir-glycine-any-dose', 'product_861e0edd8ab2', 'variant_6c383930239c', 'price_cb4042a35b42', 11900, 11900, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now()),
  ('MBM-LON-NAD-NS-001', 'p9', 'nad-nasal-r84', 'product_9dd959e8b3b2', 'variant_c41bb700e856', 'price_79f07341d00a', 7900, 7900, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now()),
  ('MBM-MEM-TIR-MEM-001', 'm2', 'm2', 'product_8b3bfb6614c4', 'variant_b3890c799e09', 'price_2d2dd07b2f73', 27500, 27500, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now()),
  ('MBM-SHIP-ACCESSORY-001', 'shipping', 'accessory', 'product_94e5e1cda1ac', 'variant_4b7853bf87dd', 'price_c2f2a57f7f9d', 1000, 1000, true, 'Accessory Shipping $10 live-created 2026-09-01', now())
on conflict (mbm_sku) do update set
  mbm_product_id = excluded.mbm_product_id,
  mbm_variant_id = excluded.mbm_variant_id,
  tagada_product_id = excluded.tagada_product_id,
  tagada_variant_id = excluded.tagada_variant_id,
  tagada_price_id = excluded.tagada_price_id,
  mbm_price_cents = excluded.mbm_price_cents,
  tagada_price_cents = excluded.tagada_price_cents,
  is_active = true,
  notes = excluded.notes,
  updated_at = now();

-- =============================================================================
-- SECTION B — READ-ONLY VERIFICATION
-- If the editor only shows the last result, run these SELECTs after Section A.
-- =============================================================================

-- B1. All launch-ready one-time SKU rows (expect 17)
select
  mbm_sku,
  mbm_product_id,
  mbm_variant_id,
  tagada_product_id,
  tagada_variant_id,
  tagada_price_id,
  mbm_price_cents,
  tagada_price_cents,
  is_active
from public.kashu_sku_map
where mbm_sku in (
  'MBM-WM-SEM-B12-001',
  'MBM-WM-SEM-B12-002',
  'MBM-WM-SEM-B12-003',
  'MBM-WM-SEM-B12-004',
  'MBM-WM-SEM-GLY-001',
  'MBM-WM-SEM-GLY-002',
  'MBM-WM-SEM-GLY-003',
  'MBM-WM-SEM-GLY-004',
  'MBM-WM-TIR-B12-001',
  'MBM-WM-TIR-B12-002',
  'MBM-WM-TIR-B12-003',
  'MBM-WM-TIR-B12-004',
  'MBM-WM-TIR-GLY-001',
  'MBM-WM-TIR-GLY-002',
  'MBM-WM-TIR-GLY-003',
  'MBM-WM-TIR-GLY-004',
  'MBM-LON-NAD-NS-001'
)
order by mbm_sku;

-- B2. Count of expected one-time launch mappings (expect 17)
select count(*) as one_time_launch_map_count
from public.kashu_sku_map
where is_active = true
  and mbm_sku in (
    'MBM-WM-SEM-B12-001',
    'MBM-WM-SEM-B12-002',
    'MBM-WM-SEM-B12-003',
    'MBM-WM-SEM-B12-004',
    'MBM-WM-SEM-GLY-001',
    'MBM-WM-SEM-GLY-002',
    'MBM-WM-SEM-GLY-003',
    'MBM-WM-SEM-GLY-004',
    'MBM-WM-TIR-B12-001',
    'MBM-WM-TIR-B12-002',
    'MBM-WM-TIR-B12-003',
    'MBM-WM-TIR-B12-004',
    'MBM-WM-TIR-GLY-001',
    'MBM-WM-TIR-GLY-002',
    'MBM-WM-TIR-GLY-003',
    'MBM-WM-TIR-GLY-004',
    'MBM-LON-NAD-NS-001'
  );

-- B3 / B4 / B5 / B6 / B7. Membership maps
-- SEM is not written by this migration; SELECT only (leave historical row as-is).
-- TIR expected:
--   mbm_sku = MBM-MEM-TIR-MEM-001
--   mbm_price_cents = 27500
--   tagada_price_cents = 27500
--   tagada_price_id = price_2d2dd07b2f73
select
  mbm_sku,
  mbm_product_id,
  mbm_variant_id,
  tagada_product_id,
  tagada_variant_id,
  tagada_price_id,
  mbm_price_cents,
  tagada_price_cents,
  is_active
from public.kashu_sku_map
where mbm_sku in (
  'MBM-MEM-SEM-MEM-001',
  'MBM-MEM-TIR-MEM-001'
)
order by mbm_sku;

-- B-GATE (run last if the editor shows only one result). Expect:
--   one_time_ok = 17
--   tir_ok = true
--   tir_uses_old_249_price = false
with expected_one_time(mbm_sku, expected_cents, expected_price_id) as (
  values
    ('MBM-WM-SEM-B12-001', 8900, 'price_e31ac583370d'),
    ('MBM-WM-SEM-B12-002', 10900, 'price_0bf0b622fd45'),
    ('MBM-WM-SEM-B12-003', 10900, 'price_3c22af390881'),
    ('MBM-WM-SEM-B12-004', 8900, 'price_0b4649e6fc5b'),
    ('MBM-WM-SEM-GLY-001', 8900, 'price_74822644bb1f'),
    ('MBM-WM-SEM-GLY-002', 10900, 'price_9113997a5445'),
    ('MBM-WM-SEM-GLY-003', 10900, 'price_0c321507201f'),
    ('MBM-WM-SEM-GLY-004', 8900, 'price_95d6839eb9c2'),
    ('MBM-WM-TIR-B12-001', 11900, 'price_ed0142289010'),
    ('MBM-WM-TIR-B12-002', 14900, 'price_3db063ba334a'),
    ('MBM-WM-TIR-B12-003', 16900, 'price_fb5946461765'),
    ('MBM-WM-TIR-B12-004', 11900, 'price_a6eba9a2a721'),
    ('MBM-WM-TIR-GLY-001', 11900, 'price_5e4581d60278'),
    ('MBM-WM-TIR-GLY-002', 14900, 'price_0e41d6b0aeab'),
    ('MBM-WM-TIR-GLY-003', 16900, 'price_9803c9a96da8'),
    ('MBM-WM-TIR-GLY-004', 11900, 'price_cb4042a35b42'),
    ('MBM-LON-NAD-NS-001', 7900, 'price_79f07341d00a')
),
one_time as (
  select
    e.mbm_sku,
    (m.mbm_sku is not null
      and m.is_active = true
      and m.mbm_price_cents is not distinct from e.expected_cents
      and m.tagada_price_cents is not distinct from e.expected_cents
      and m.tagada_price_id is not distinct from e.expected_price_id) as ok
  from expected_one_time e
  left join public.kashu_sku_map m on m.mbm_sku = e.mbm_sku
),
tir as (
  select *
  from public.kashu_sku_map
  where mbm_sku = 'MBM-MEM-TIR-MEM-001'
)
select
  (select count(*) filter (where ok) from one_time) as one_time_ok,
  (select count(*) from expected_one_time) as one_time_expected,
  (select mbm_sku from tir) as tir_mbm_sku,
  (select mbm_price_cents from tir) as tir_mbm_price_cents,
  (select tagada_price_cents from tir) as tir_tagada_price_cents,
  (select tagada_price_id from tir) as tir_tagada_price_id,
  (
    (select mbm_sku from tir) = 'MBM-MEM-TIR-MEM-001'
    and (select mbm_price_cents from tir) = 27500
    and (select tagada_price_cents from tir) = 27500
    and (select tagada_price_id from tir) = 'price_2d2dd07b2f73'
    and (select is_active from tir) = true
  ) as tir_ok,
  coalesce((select tagada_price_id from tir) = 'price_5cf1fa89610c', false) as tir_uses_old_249_price;
