-- MBM-GLP1-MODEL-B-PRICING
-- Additive production map cutover for 22 GLP-1 one-time vial SKUs and
-- 2 membership PROGRAM base prices. Existing Tagada price objects remain intact.
-- Membership combo recurring priceIds are code-mapped (base + $30/$50 shipping).
-- No deletes, no truncates, no GEN changes.

insert into public.kashu_sku_map (
  mbm_sku, mbm_product_id, mbm_variant_id,
  tagada_product_id, tagada_variant_id, tagada_price_id,
  mbm_price_cents, tagada_price_cents, is_active, notes, updated_at
) values
  (
    'MBM-WM-SEM-B12-001', 'p1', 'sem-b12-starting-low', 'product_6b750325addf', 'variant_f9ac5ea25184', 'price_7ca4c3abc69a', 10900, 10900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-SEM-B12-002', 'p1', 'sem-b12-mid', 'product_6b750325addf', 'variant_d839f0aab609', 'price_11ec89ad646a', 11900, 11900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-SEM-B12-003', 'p1', 'sem-b12-high', 'product_6b750325addf', 'variant_d9dac92d2f71', 'price_755359fc40cc', 12900, 12900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-SEM-B12-005', 'p1', 'sem-b12-2mg', 'product_6b750325addf', 'variant_a726bfe758b3', 'price_80723e21469c', 11900, 11900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-SEM-B12-006', 'p1', 'sem-b12-10mg', 'product_6b750325addf', 'variant_23afe7061b26', 'price_9dead884531e', 13900, 13900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-SEM-GLY-001', 'p1', 'sem-glycine-starting-low', 'product_dcc64482bbbf', 'variant_c51c894cfee6', 'price_6c22c5bf103d', 10900, 10900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-SEM-GLY-002', 'p1', 'sem-glycine-mid', 'product_dcc64482bbbf', 'variant_398f72f8ca6b', 'price_18ffbabbc121', 11900, 11900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-SEM-GLY-003', 'p1', 'sem-glycine-high', 'product_dcc64482bbbf', 'variant_a71889d8f2e1', 'price_1499a5df1238', 12900, 12900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-SEM-GLY-005', 'p1', 'sem-glycine-2mg', 'product_dcc64482bbbf', 'variant_1f6e4f4d2cb4', 'price_c433061826aa', 11900, 11900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-SEM-GLY-006', 'p1', 'sem-glycine-10mg', 'product_dcc64482bbbf', 'variant_6db94a24e1ad', 'price_a1f4ee6101c1', 13900, 13900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-TIR-B12-001', 'p5', 'tir-b12-starting-low', 'product_74cd4752c9d6', 'variant_2d96cc588f51', 'price_296f17fe8611', 13900, 13900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-TIR-B12-002', 'p5', 'tir-b12-mid', 'product_74cd4752c9d6', 'variant_0acda4e3b2d7', 'price_4ccf56c8f7e0', 17900, 17900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-TIR-B12-003', 'p5', 'tir-b12-high', 'product_74cd4752c9d6', 'variant_5e13db7812ee', 'price_86e638aabe8e', 19900, 19900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-TIR-B12-005', 'p5', 'tir-b12-10mg-ml', 'product_74cd4752c9d6', 'variant_1f1dab8b6177', 'price_d2f5088bdb5a', 15900, 15900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-TIR-B12-006', 'p5', 'tir-b12-20mg-ml', 'product_74cd4752c9d6', 'variant_dd351c9f2fd1', 'price_6471bd5ade2a', 18900, 18900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-TIR-B12-007', 'p5', 'tir-b12-30mg-ml', 'product_74cd4752c9d6', 'variant_56e8f07d6ab2', 'price_4039f14c59dd', 20900, 20900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-TIR-GLY-001', 'p5', 'tir-glycine-starting-low', 'product_861e0edd8ab2', 'variant_ddd60b897d66', 'price_4ae8c421cf18', 13900, 13900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-TIR-GLY-002', 'p5', 'tir-glycine-mid', 'product_861e0edd8ab2', 'variant_b7e1562ee522', 'price_993d0d4616fd', 17900, 17900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-TIR-GLY-003', 'p5', 'tir-glycine-high', 'product_861e0edd8ab2', 'variant_121e6d8cd921', 'price_7c361359593f', 19900, 19900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-TIR-GLY-005', 'p5', 'tir-glycine-10mg-ml', 'product_861e0edd8ab2', 'variant_7726800f83dd', 'price_f8f8e7b07150', 15900, 15900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-TIR-GLY-006', 'p5', 'tir-glycine-20mg-ml', 'product_861e0edd8ab2', 'variant_57cd2414aabf', 'price_b4a459a9223c', 18900, 18900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-WM-TIR-GLY-007', 'p5', 'tir-glycine-30mg-ml', 'product_861e0edd8ab2', 'variant_1446f75121d7', 'price_0f7eac35ed15', 20900, 20900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-MEM-SEM-MEM-001', 'm1', 'm1', 'product_e5fe772b62d6', 'variant_6973906c4bd6', 'price_307f4d84658d', 12500, 12500, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
  ),
  (
    'MBM-MEM-TIR-MEM-001', 'm2', 'm2', 'product_8b3bfb6614c4', 'variant_b3890c799e09', 'price_321bc7a3ea7e', 17900, 17900, true,
    'MBM-GLP1-MODEL-B-PRICING owner-approved 2026-08-26; historical price preserved', now()
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
