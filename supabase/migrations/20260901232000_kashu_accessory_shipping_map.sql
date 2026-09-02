-- Additive kashu_sku_map upsert for $10 accessory-only shipping.
-- Live-created in Tagada via Edge tagada-product-sync on 2026-09-01.
-- Product is one-time, non-taxable, non-shippable.

insert into public.kashu_sku_map (
  mbm_sku,
  mbm_product_id,
  mbm_variant_id,
  tagada_product_id,
  tagada_variant_id,
  tagada_price_id,
  mbm_price_cents,
  tagada_price_cents,
  is_active,
  notes,
  updated_at
) values (
  'MBM-SHIP-ACCESSORY-001',
  'shipping',
  'accessory',
  'product_94e5e1cda1ac',
  'variant_4b7853bf87dd',
  'price_c2f2a57f7f9d',
  1000,
  1000,
  true,
  'Accessory Shipping $10 live-created 2026-09-01',
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
