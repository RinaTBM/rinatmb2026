-- Additive: store applied storefront/server promo code on orders (e.g. OGTBM).
-- Does not alter historical totals.

alter table public.orders
  add column if not exists promo_code text;

comment on column public.orders.promo_code is
  'Normalized promo code applied at order creation (e.g. OGTBM). Discount amount is in discount_cents.';

create index if not exists orders_promo_code_idx
  on public.orders (promo_code)
  where promo_code is not null;
