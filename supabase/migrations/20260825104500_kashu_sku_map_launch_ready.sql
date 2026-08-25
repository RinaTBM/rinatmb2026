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
  ('MBM-MEM-TIR-MEM-001', 'm2', 'm2', 'product_8b3bfb6614c4', 'variant_b3890c799e09', 'price_2d2dd07b2f73', 27500, 27500, true, 'MBM-FINAL-CHECKOUT-LAUNCH-1 live-verified', now())
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
