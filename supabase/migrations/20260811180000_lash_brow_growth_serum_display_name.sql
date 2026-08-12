-- Additive display-name update only.
-- Does NOT change slug, app_product_id, variant keys, SKUs, prices, or formulations.
-- Customer-facing name: Lash/Brow Growth Serum
-- Underlying formulation remains Bimatoprost Solution.

update public.catalog_products
set
  display_name = 'Lash/Brow Growth Serum',
  short_name = 'Lash/Brow Growth Serum',
  subtitle = 'Prescription bimatoprost solution',
  image_alt = 'Lash/Brow Growth Serum — prescription bimatoprost solution'
where slug = 'bimatoprost-solution';
