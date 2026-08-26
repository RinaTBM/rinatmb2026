-- MBM-TAGADA-MANUAL-VARIANT-CREATION-1
-- Additive kashu_sku_map upsert for vial-specific one-time SKUs.
--
-- Live-verified 2026-08-26 via Edge tagada-product-sync GET (read-only) on
-- existing families:
--   product_6b750325addf  (SEM B12)
--   product_dcc64482bbbf  (SEM Glycine)
--   product_74cd4752c9d6  (TIR B12)
--   product_861e0edd8ab2  (TIR Glycine)
--
-- 8 / 10 SKUs verified. Still missing live Tagada variants:
--   MBM-WM-SEM-B12-006  (10 mg vial · $119)
--   MBM-WM-SEM-GLY-006  (10 mg vial · $119)
--
-- Rules:
--   - these SKUs only (no unrelated rows)
--   - INSERT ... ON CONFLICT (mbm_sku) DO UPDATE
--   - no deletes, no truncates
--   - no historical price deletion
--   - no GEN changes
--   - do not invent Tagada IDs
--
-- DO NOT APPLY from Cursor. Apply via Bolt/Supabase only after explicit
-- owner approval. Prefer waiting until SEM-006 variants exist so all 10
-- rows can be upserted together.

insert into public.kashu_sku_map (
  mbm_sku, mbm_product_id, mbm_variant_id,
  tagada_product_id, tagada_variant_id, tagada_price_id,
  mbm_price_cents, tagada_price_cents, is_active, notes, updated_at
) values
  -- SEM B12 · 2 mg vial · $99 · website weekly dose 0.5 mg
  (
    'MBM-WM-SEM-B12-005', 'p1', 'sem-b12-2mg',
    'product_6b750325addf',
    'variant_a726bfe758b3',
    'price_1c3c8051e3b5',
    9900, 9900, true,
    'MBM-TAGADA-MANUAL-VARIANT-CREATION-1 SEM B12 2mg vial live-verified 2026-08-26',
    now()
  ),
  -- SEM Glycine · 2 mg vial · $99 · website weekly dose 0.5 mg
  (
    'MBM-WM-SEM-GLY-005', 'p1', 'sem-glycine-2mg',
    'product_dcc64482bbbf',
    'variant_1f6e4f4d2cb4',
    'price_cea49d485af6',
    9900, 9900, true,
    'MBM-TAGADA-MANUAL-VARIANT-CREATION-1 SEM GLY 2mg vial live-verified 2026-08-26',
    now()
  ),
  -- TIR B12 · 20 mg vial · $139 · website weekly dose 5 mg
  (
    'MBM-WM-TIR-B12-005', 'p5', 'tir-b12-10mg-ml',
    'product_74cd4752c9d6',
    'variant_1f1dab8b6177',
    'price_ea84cec6ed40',
    13900, 13900, true,
    'MBM-TAGADA-MANUAL-VARIANT-CREATION-1 TIR B12 20mg vial live-verified 2026-08-26',
    now()
  ),
  -- TIR B12 · 40 mg vial · $159 · website weekly dose 10 mg
  (
    'MBM-WM-TIR-B12-006', 'p5', 'tir-b12-20mg-ml',
    'product_74cd4752c9d6',
    'variant_dd351c9f2fd1',
    'price_e6ef11aa3bd1',
    15900, 15900, true,
    'MBM-TAGADA-MANUAL-VARIANT-CREATION-1 TIR B12 40mg vial live-verified 2026-08-26',
    now()
  ),
  -- TIR B12 · 60 mg vial · $179 · website weekly dose 15 mg
  (
    'MBM-WM-TIR-B12-007', 'p5', 'tir-b12-30mg-ml',
    'product_74cd4752c9d6',
    'variant_56e8f07d6ab2',
    'price_bc09750e5e79',
    17900, 17900, true,
    'MBM-TAGADA-MANUAL-VARIANT-CREATION-1 TIR B12 60mg vial live-verified 2026-08-26',
    now()
  ),
  -- TIR Glycine · 20 mg vial · $139 · website weekly dose 5 mg
  (
    'MBM-WM-TIR-GLY-005', 'p5', 'tir-glycine-10mg-ml',
    'product_861e0edd8ab2',
    'variant_7726800f83dd',
    'price_33457ae01ee9',
    13900, 13900, true,
    'MBM-TAGADA-MANUAL-VARIANT-CREATION-1 TIR GLY 20mg vial live-verified 2026-08-26',
    now()
  ),
  -- TIR Glycine · 40 mg vial · $159 · website weekly dose 10 mg
  (
    'MBM-WM-TIR-GLY-006', 'p5', 'tir-glycine-20mg-ml',
    'product_861e0edd8ab2',
    'variant_57cd2414aabf',
    'price_2a8c8629ae5c',
    15900, 15900, true,
    'MBM-TAGADA-MANUAL-VARIANT-CREATION-1 TIR GLY 40mg vial live-verified 2026-08-26',
    now()
  ),
  -- TIR Glycine · 60 mg vial · $179 · website weekly dose 15 mg
  (
    'MBM-WM-TIR-GLY-007', 'p5', 'tir-glycine-30mg-ml',
    'product_861e0edd8ab2',
    'variant_1446f75121d7',
    'price_5bcb6c9f666c',
    17900, 17900, true,
    'MBM-TAGADA-MANUAL-VARIANT-CREATION-1 TIR GLY 60mg vial live-verified 2026-08-26',
    now()
  )
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

-- Still missing from live Tagada GET/list (do not invent IDs):
--   MBM-WM-SEM-B12-006  p1  sem-b12-10mg      product_6b750325addf  PASTE_TAGADA_VARIANT_ID  PASTE_TAGADA_PRICE_ID  11900
--   MBM-WM-SEM-GLY-006  p1  sem-glycine-10mg  product_dcc64482bbbf  PASTE_TAGADA_VARIANT_ID  PASTE_TAGADA_PRICE_ID  11900
