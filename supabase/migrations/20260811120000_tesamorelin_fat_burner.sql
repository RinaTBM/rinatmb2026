-- Additive: Tesamorelin Injection + Fat Burner (AOD-9604/MOTS-C/Tesamorelin).
-- Does NOT modify existing catalog rows, prices, or SKUs.
-- Retail selling prices are NOT owner-approved yet — price_cents temporarily
-- stores at-cost placeholders (8333 / 15000). Do not publish until retail set.
-- Do NOT apply to production until explicit approval.

-- ---------------------------------------------------------------------------
-- Tesamorelin Injection (p73 / tesamorelin)
-- At-cost: $83.33 → provisional price_cents 8333
-- SKU: MBM-LON-TESA-INJ-001
-- ---------------------------------------------------------------------------
insert into public.catalog_products
  (slug, app_product_id, display_name, short_name, subtitle, category, dosage_form_summary,
   short_description, long_description, image_url, image_alt, starting_price_cents, currency,
   status, is_visible, launch_phase, campaign_theme, requires_provider_review, requires_prescription,
   requires_compliance_review, requires_pharmacy_verification)
values (
  'tesamorelin',
  'p73',
  'Tesamorelin Injection',
  'Tesamorelin',
  'Provider-directed compounded formulation',
  'longevity-cognitive',
  'Injection',
  'A provider-directed compounded Tesamorelin injection (growth hormone-releasing factor analog) available after eligibility review.',
  'Provider-directed compounded formulation available only following eligibility review. Exact formulation and availability are determined by the prescribing provider and dispensing pharmacy.',
  '/images/products/file_0000000081dc822f831112a2c1e5d3d9 copy.png',
  'Tesamorelin injection, a provider-directed compounded formulation',
  8333,
  'usd',
  'active',
  true,
  null,
  null,
  true,
  true,
  true,
  true
)
on conflict (slug) do update set
  app_product_id = excluded.app_product_id,
  display_name = excluded.display_name,
  short_name = excluded.short_name,
  subtitle = excluded.subtitle,
  category = excluded.category,
  dosage_form_summary = excluded.dosage_form_summary,
  short_description = excluded.short_description,
  long_description = excluded.long_description,
  image_url = excluded.image_url,
  image_alt = excluded.image_alt,
  starting_price_cents = excluded.starting_price_cents,
  currency = excluded.currency,
  status = excluded.status,
  is_visible = excluded.is_visible,
  requires_provider_review = excluded.requires_provider_review,
  requires_prescription = excluded.requires_prescription,
  requires_compliance_review = excluded.requires_compliance_review,
  requires_pharmacy_verification = excluded.requires_pharmacy_verification;

insert into public.catalog_variants
  (product_id, variant_key, display_name, dosage_form, strength, size, price_cents, currency,
   billing_type, billing_interval, is_active, sort_order, sku)
select p.id,
  'tesamorelin-v1',
  '10mg total · 5mg/mL, 2mL vial',
  'Injection',
  '10mg total · 5mg/mL',
  '2mL vial',
  8333,
  'usd',
  'one_time',
  null,
  true,
  0,
  'MBM-LON-TESA-INJ-001'
from public.catalog_products p
where p.slug = 'tesamorelin'
on conflict (product_id, variant_key) do update set
  display_name = excluded.display_name,
  dosage_form = excluded.dosage_form,
  strength = excluded.strength,
  size = excluded.size,
  price_cents = excluded.price_cents,
  currency = excluded.currency,
  billing_type = excluded.billing_type,
  billing_interval = excluded.billing_interval,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  sku = excluded.sku;

-- ---------------------------------------------------------------------------
-- Fat Burner: AOD-9604 / MOTS-C / Tesamorelin (p74 / fat-burner)
-- At-cost: $150.00 → provisional price_cents 15000
-- SKU: MBM-WM-FB3-INJ-001
-- Not SLU-PP-332.
-- ---------------------------------------------------------------------------
insert into public.catalog_products
  (slug, app_product_id, display_name, short_name, subtitle, category, dosage_form_summary,
   short_description, long_description, image_url, image_alt, starting_price_cents, currency,
   status, is_visible, launch_phase, campaign_theme, requires_provider_review, requires_prescription,
   requires_compliance_review, requires_pharmacy_verification)
values (
  'fat-burner',
  'p74',
  'Fat Burner',
  'Fat Burner',
  'AOD-9604 + MOTS-C + Tesamorelin',
  'weight-management',
  'Injection',
  'A provider-directed compounded injection combining AOD-9604, MOTS-C, and Tesamorelin for body-composition and metabolic wellness programs.',
  'Provider-directed compounded formulation available only following eligibility review. Exact formulation and availability are determined by the prescribing provider and dispensing pharmacy.',
  '/images/products/file_0000000081dc822f831112a2c1e5d3d9 copy.png',
  'Fat Burner compounded injection — AOD-9604, MOTS-C, and Tesamorelin',
  15000,
  'usd',
  'active',
  true,
  null,
  null,
  true,
  true,
  true,
  true
)
on conflict (slug) do update set
  app_product_id = excluded.app_product_id,
  display_name = excluded.display_name,
  short_name = excluded.short_name,
  subtitle = excluded.subtitle,
  category = excluded.category,
  dosage_form_summary = excluded.dosage_form_summary,
  short_description = excluded.short_description,
  long_description = excluded.long_description,
  image_url = excluded.image_url,
  image_alt = excluded.image_alt,
  starting_price_cents = excluded.starting_price_cents,
  currency = excluded.currency,
  status = excluded.status,
  is_visible = excluded.is_visible,
  requires_provider_review = excluded.requires_provider_review,
  requires_prescription = excluded.requires_prescription,
  requires_compliance_review = excluded.requires_compliance_review,
  requires_pharmacy_verification = excluded.requires_pharmacy_verification;

insert into public.catalog_variants
  (product_id, variant_key, display_name, dosage_form, strength, size, price_cents, currency,
   billing_type, billing_interval, is_active, sort_order, sku)
select p.id,
  'fat-burner-v1',
  'AOD-9604 6mg (1.2mg/mL) / MOTS-C 10mg (2mg/mL) / Tesamorelin 15mg (3mg/mL), 5mL vial',
  'Injection',
  'AOD-9604 6mg (1.2mg/mL) / MOTS-C 10mg (2mg/mL) / Tesamorelin 15mg (3mg/mL)',
  '5mL vial',
  15000,
  'usd',
  'one_time',
  null,
  true,
  0,
  'MBM-WM-FB3-INJ-001'
from public.catalog_products p
where p.slug = 'fat-burner'
on conflict (product_id, variant_key) do update set
  display_name = excluded.display_name,
  dosage_form = excluded.dosage_form,
  strength = excluded.strength,
  size = excluded.size,
  price_cents = excluded.price_cents,
  currency = excluded.currency,
  billing_type = excluded.billing_type,
  billing_interval = excluded.billing_interval,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  sku = excluded.sku;
