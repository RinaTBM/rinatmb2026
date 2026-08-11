-- =============================================================================
-- Kashu / TagadaPay card payments (additive)
-- DO NOT APPLY until owner approval + Tagada product sync + secrets configured.
-- Does NOT remove manual_ach / manual_wire / plaid_ach.
-- Does NOT revive Stripe.
-- =============================================================================

-- Extend payment_method allow-list with kashu_card
alter table public.orders drop constraint if exists orders_payment_method_check;
alter table public.orders
  add constraint orders_payment_method_check check (
    payment_method is null
    or payment_method in ('manual_ach', 'manual_wire', 'plaid_ach', 'kashu_card')
  );

comment on column public.orders.payment_method is
  'Processor-neutral: manual_ach | manual_wire | plaid_ach (future) | kashu_card (Kashu/TagadaPay).';

-- External processor linkage (additive; Stripe columns retained for history)
alter table public.orders
  add column if not exists payment_processor text,
  add column if not exists external_payment_id text,
  add column if not exists external_checkout_session_id text,
  add column if not exists external_order_id text,
  add column if not exists external_checkout_token text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_payment_processor_check'
  ) then
    alter table public.orders
      add constraint orders_payment_processor_check check (
        payment_processor is null
        or payment_processor in ('manual', 'kashu_tagada', 'stripe_legacy')
      );
  end if;
end $$;

create index if not exists orders_external_checkout_session_id_idx
  on public.orders (external_checkout_session_id)
  where external_checkout_session_id is not null;

create index if not exists orders_external_order_id_idx
  on public.orders (external_order_id)
  where external_order_id is not null;

comment on column public.orders.payment_processor is
  'manual | kashu_tagada | stripe_legacy (historical only).';
comment on column public.orders.external_checkout_session_id is
  'Tagada/Kashu checkout session id when known.';
comment on column public.orders.external_checkout_token is
  'Tagada checkoutToken from createSession redirect URL (for asyncStatus polling).';
comment on column public.orders.external_order_id is
  'Tagada order id from webhook/API.';
comment on column public.orders.external_payment_id is
  'Tagada payment id from webhook/API.';

-- Idempotent webhook event log
create table if not exists public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  processor text not null,
  event_id text not null,
  event_type text,
  signature_valid boolean not null default false,
  public_order_number text,
  order_id uuid references public.orders(id) on delete set null,
  payload jsonb,
  processing_result text,
  error_message text,
  created_at timestamptz not null default now(),
  unique (processor, event_id)
);

create index if not exists payment_webhook_events_order_idx
  on public.payment_webhook_events (order_id)
  where order_id is not null;

comment on table public.payment_webhook_events is
  'Idempotent payment webhook receipts (Kashu/Tagada). Browser redirects never mark paid.';

-- SKU → Tagada product/variant mapping (products must be created in Tagada first)
create table if not exists public.kashu_sku_map (
  mbm_sku text primary key,
  mbm_variant_id text,
  tagada_product_id text not null,
  tagada_variant_id text not null,
  is_active boolean not null default true,
  notes text,
  updated_at timestamptz not null default now()
);

comment on table public.kashu_sku_map is
  'Maps MBM variant SKUs to Tagada product/variant IDs for hosted checkout. Do not replace MBM IDs.';
comment on column public.kashu_sku_map.mbm_sku is
  'Stable MBM SKU (e.g. MBM-WM-SEM-INJ-001). Source of external commerce reference.';
comment on column public.kashu_sku_map.tagada_variant_id is
  'Official Tagada variantId required by checkout.createSession items[].variantId.';
