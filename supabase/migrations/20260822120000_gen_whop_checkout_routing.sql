-- Phase WHOP-2: GEN Hosted Checkout → Whop routing (cutover OFF by default).
-- Additive only. Does not enable production GEN/Whop checkout.
-- Tagada/Kashu commerce (kashu_sku_map) remains unchanged.

-- ---------------------------------------------------------------------------
-- 1) Extend payment_method / payment_processor allow-lists
-- ---------------------------------------------------------------------------
alter table public.orders drop constraint if exists orders_payment_method_check;
alter table public.orders
  add constraint orders_payment_method_check check (
    payment_method is null
    or payment_method in (
      'manual_ach',
      'manual_wire',
      'plaid_ach',
      'kashu_card',
      'gen_whop'
    )
  );

comment on column public.orders.payment_method is
  'Processor-neutral: manual_ach | manual_wire | plaid_ach | kashu_card (Tagada) | gen_whop (GEN Hosted Checkout → Whop).';

alter table public.orders drop constraint if exists orders_payment_processor_check;
alter table public.orders
  add constraint orders_payment_processor_check check (
    payment_processor is null
    or payment_processor in (
      'manual',
      'kashu_tagada',
      'stripe_legacy',
      'gen_whop'
    )
  );

comment on column public.orders.payment_processor is
  'manual | kashu_tagada | stripe_legacy | gen_whop. Browser redirect never marks paid.';

-- ---------------------------------------------------------------------------
-- 2) gen_whop_checkout_map — durable MBM → GEN storefront checkout mapping
--    Separate from clinical gen_sku_map and Tagada kashu_sku_map.
--    Do NOT hard-code product IDs in application checkout routers.
-- ---------------------------------------------------------------------------
create table if not exists public.gen_whop_checkout_map (
  id uuid primary key default gen_random_uuid(),
  mbm_sku text not null,
  gen_product_id text not null,
  gen_client_product_id text not null,
  -- Purchase model for THIS MBM SKU on GEN/Whop (not inferred from BPC alone)
  purchase_mode text not null default 'one_time',
  -- one_time | recurring | membership_program | unsupported
  retail_amount_cents integer not null,
  currency text not null default 'USD',
  storefront_eligible boolean not null default false,
  -- When false, mapping may exist for ops but checkout create is blocked
  checkout_enabled boolean not null default false,
  membership_required boolean not null default false,
  visit_required boolean,
  pharmacy_name text,
  notes text,
  active boolean not null default false,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gen_whop_checkout_map_mbm_sku_key unique (mbm_sku),
  constraint gen_whop_checkout_map_purchase_mode_chk check (
    purchase_mode in ('one_time', 'recurring', 'membership_program', 'unsupported')
  ),
  constraint gen_whop_checkout_map_currency_chk check (char_length(currency) between 3 and 3),
  constraint gen_whop_checkout_map_amount_chk check (retail_amount_cents >= 0)
);

create index if not exists gen_whop_checkout_map_active_idx
  on public.gen_whop_checkout_map (active, checkout_enabled, purchase_mode);

comment on table public.gen_whop_checkout_map is
  'MBM SKU → GEN storefront product for Whop hosted checkout. SEM/TIRZ membership SKUs must use purchase_mode=unsupported or membership_program with checkout_enabled=false until explicitly designed. Accessories never belong here.';

-- updated_at trigger (reuse pattern if function exists)
do $$
begin
  if exists (
    select 1 from pg_proc where proname = 'set_updated_at'
  ) then
    drop trigger if exists trg_gen_whop_checkout_map_updated on public.gen_whop_checkout_map;
    create trigger trg_gen_whop_checkout_map_updated
      before update on public.gen_whop_checkout_map
      for each row execute function public.set_updated_at();
  end if;
exception when others then
  null;
end $$;

alter table public.gen_whop_checkout_map enable row level security;

drop policy if exists gen_whop_checkout_map_admin_select on public.gen_whop_checkout_map;
create policy gen_whop_checkout_map_admin_select on public.gen_whop_checkout_map
  for select to authenticated
  using (public.is_admin());

-- Service role bypasses RLS; no public insert/update policies (admin via service or future admin UI)

-- ---------------------------------------------------------------------------
-- 3) gen_checkout_sessions — correlation: MBM attempt ↔ GEN session ↔ Whop config ↔ payment/order
-- ---------------------------------------------------------------------------
create table if not exists public.gen_checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  public_order_number text not null,
  mbm_sku text not null,
  gen_product_id text not null,
  gen_client_product_id text not null,
  purchase_mode text not null,
  expected_amount_cents integer not null,
  currency text not null default 'USD',
  -- GEN storefront session
  gen_checkout_session_id text,
  -- Whop
  whop_checkout_config_id text,
  whop_checkout_url text,
  whop_payment_id text,
  -- GEN clinical order (filled after payment/webhook correlation)
  gen_order_id text,
  gen_patient_id text,
  -- Explicit lifecycle — browser redirect never sets succeeded
  status text not null default 'created',
  -- created | redirect_issued | processing | succeeded | failed | expired | cancelled
  last_error_code text,
  last_error_message_safe text,
  correlation_id text not null,
  idempotency_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint gen_checkout_sessions_status_chk check (
    status in (
      'created',
      'redirect_issued',
      'processing',
      'succeeded',
      'failed',
      'expired',
      'cancelled'
    )
  ),
  constraint gen_checkout_sessions_idem_uidx unique (idempotency_key)
);

create index if not exists gen_checkout_sessions_order_id_idx
  on public.gen_checkout_sessions (order_id);

create index if not exists gen_checkout_sessions_public_order_idx
  on public.gen_checkout_sessions (public_order_number);

create index if not exists gen_checkout_sessions_gen_session_idx
  on public.gen_checkout_sessions (gen_checkout_session_id);

create index if not exists gen_checkout_sessions_whop_config_idx
  on public.gen_checkout_sessions (whop_checkout_config_id);

create index if not exists gen_checkout_sessions_status_idx
  on public.gen_checkout_sessions (status, created_at);

comment on table public.gen_checkout_sessions is
  'Correlation for GEN Hosted Checkout → Whop. Payment truth must come from server-side Whop/GEN state, never browser return alone.';

do $$
begin
  if exists (select 1 from pg_proc where proname = 'set_updated_at') then
    drop trigger if exists trg_gen_checkout_sessions_updated on public.gen_checkout_sessions;
    create trigger trg_gen_checkout_sessions_updated
      before update on public.gen_checkout_sessions
      for each row execute function public.set_updated_at();
  end if;
exception when others then
  null;
end $$;

alter table public.gen_checkout_sessions enable row level security;

-- Customers may read their own session rows via order ownership (display-only status)
drop policy if exists gen_checkout_sessions_owner_select on public.gen_checkout_sessions;
create policy gen_checkout_sessions_owner_select on public.gen_checkout_sessions
  for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = gen_checkout_sessions.order_id
        and o.customer_user_id = auth.uid()
    )
  );

drop policy if exists gen_checkout_sessions_admin_select on public.gen_checkout_sessions;
create policy gen_checkout_sessions_admin_select on public.gen_checkout_sessions
  for select to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4) Example mapping note (NOT inserted — owner must verify before enabling)
--    BPC: MBM-RP-BPC-INJ-001 → KXMm9SsbOEYnFy9phmZn / clientProductId / $199 one_time
--    SEM/TIRZ membership SKUs must remain checkout_enabled=false until membership design.
-- ---------------------------------------------------------------------------
comment on column public.gen_whop_checkout_map.checkout_enabled is
  'Must stay false until GEN_WHOP_CHECKOUT_ENABLED is approved AND row is owner-verified. SEM/TIRZ: do not enable from BPC one-time test.';

-- Service role needs explicit grants (RLS bypass alone is insufficient without GRANT).
grant select, insert, update, delete on table public.gen_whop_checkout_map to service_role;
grant select, insert, update, delete on table public.gen_checkout_sessions to service_role;
grant select on table public.gen_whop_checkout_map to authenticated;
grant select on table public.gen_checkout_sessions to authenticated;
