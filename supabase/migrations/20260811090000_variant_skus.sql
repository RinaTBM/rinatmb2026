-- Additive: variant-level SKU on catalog_variants + order line SKU persistence.
-- Does NOT alter existing IDs, prices, formulations, or checkout payment behavior.
-- Safe to apply after review. Do not drop or rewrite existing rows.

-- ---------------------------------------------------------------------------
-- catalog_variants.sku
-- ---------------------------------------------------------------------------
alter table public.catalog_variants
  add column if not exists sku text;

comment on column public.catalog_variants.sku is
  'Stable Scriptful/retail SKU for this selectable variant (MBM-…). NULL for rows without an assigned SKU.';

-- Non-null SKUs must be globally unique across catalog_variants.
create unique index if not exists catalog_variants_sku_unique
  on public.catalog_variants (sku)
  where sku is not null;

-- ---------------------------------------------------------------------------
-- order_items: preserve purchased SKU for future Scriptful fulfillment
-- ---------------------------------------------------------------------------
alter table public.order_items
  add column if not exists sku text;

alter table public.order_items
  add column if not exists variant_id text;

alter table public.order_items
  add column if not exists fulfillment_sku text;

comment on column public.order_items.sku is
  'SKU of the purchased line: retail variant SKU, or membership PROGRAM SKU for membership_program lines.';

comment on column public.order_items.variant_id is
  'Storefront ProductVariant.id / catalog variant_key when applicable.';

comment on column public.order_items.fulfillment_sku is
  'For membership lines: retail medication fulfillment SKU from the membership dose crosswalk. NULL for non-membership lines.';

-- Assign approved SKUs to existing DB-backed catalog variants (wellness sync set).
-- Accessories / provider-care remain storefront-only (SKU lives in TypeScript catalog).
update public.catalog_variants v
set sku = m.sku
from (values
  ('semaglutide-v1', 'MBM-WM-SEM-INJ-001'),
  ('semaglutide-v2', 'MBM-WM-SEM-INJ-002'),
  ('semaglutide-v3', 'MBM-WM-SEM-INJ-003'),
  ('semaglutide-v4', 'MBM-WM-SEM-INJ-004'),
  ('tirzepatide-v1', 'MBM-WM-TIR-INJ-001'),
  ('tirzepatide-v2', 'MBM-WM-TIR-INJ-002'),
  ('tirzepatide-v3', 'MBM-WM-TIR-INJ-003'),
  ('tirzepatide-v4', 'MBM-WM-TIR-INJ-004'),
  ('estradiol-patch-v1', 'MBM-HRT-EST-PAT-001'),
  ('estradiol-patch-v2', 'MBM-HRT-EST-PAT-002'),
  ('estradiol-patch-v3', 'MBM-HRT-EST-PAT-003'),
  ('progesterone-capsules-v1', 'MBM-HRT-PRG-CAP-001'),
  ('progesterone-capsules-v2', 'MBM-HRT-PRG-CAP-002'),
  ('testosterone-cream-v1', 'MBM-HRT-TST-CRM-001'),
  ('nad-plus-v1', 'MBM-LON-NAD-INJ-001'),
  ('nad-plus-v2', 'MBM-LON-NAD-INJ-002'),
  ('selank-v1', 'MBM-LON-SEL-INJ-001'),
  ('semax-v1', 'MBM-LON-SMX-INJ-001'),
  ('selank-semax-nasal-spray-v1', 'MBM-LON-SSN-NS-001'),
  ('bpc-157-tb-500-v1', 'MBM-RP-BPC-CAP-001'),
  ('bpc-157-tb-500-v2', 'MBM-RP-BPC-INJ-001'),
  ('tretinoin-cream-v1', 'MBM-SH-TRE-CRM-001'),
  ('tretinoin-cream-v2', 'MBM-SH-TRE-CRM-002'),
  ('tretinoin-cream-v3', 'MBM-SH-TRE-CRM-003'),
  ('minoxidil-topical-v1', 'MBM-SH-MIN-SOL-001'),
  ('bimatoprost-solution-v1', 'MBM-SH-BIM-SOL-001')
) as m(variant_key, sku)
where v.variant_key = m.variant_key
  and (v.sku is distinct from m.sku);
