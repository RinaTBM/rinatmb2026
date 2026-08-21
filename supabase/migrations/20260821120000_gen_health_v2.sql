-- =============================================================================
-- GEN Health V2 — Phase 12D local migration (CREATE ONLY — DO NOT APPLY)
-- =============================================================================
-- Baseline: deploy/ach-launch-clean-2026 @ 5473777fa21c54f084ca86b330ea03f93c7152eb
--
-- Rules:
-- - Additive only — preserve all existing data
-- - Do NOT rename/drop columns
-- - Do NOT rewrite orders
-- - Do NOT modify kashu_sku_map
-- - Do NOT seed real GEN product/patient IDs
-- - GEN secrets never stored in tables
-- - GEN_HEALTH_ENABLED remains false until a later approved phase
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) Additive GEN patient reference on customer_profiles
--    (repo uses customer_profiles; Phase 12C "profiles.gen_patient_id")
-- ---------------------------------------------------------------------------
alter table public.customer_profiles
  add column if not exists gen_patient_id text;

create unique index if not exists customer_profiles_gen_patient_id_uidx
  on public.customer_profiles (gen_patient_id)
  where gen_patient_id is not null;

comment on column public.customer_profiles.gen_patient_id is
  'GEN Health patient id (1 MBM profile → 1 GEN patient). Service-role writes. No PHI beyond opaque id.';

-- Optional rollup on orders for retry / admin UI (derived; not clinical SoT)
alter table public.orders
  add column if not exists gen_handoff_status text,
  add column if not exists gen_handoff_last_error text,
  add column if not exists gen_handoff_attempts integer not null default 0,
  add column if not exists gen_handoff_updated_at timestamptz;

comment on column public.orders.gen_handoff_status is
  'Derived GEN handoff rollup (PENDING/RETRY_REQUIRED/etc). Clinical SoT remains GEN GET order + order_gen_orders.';

-- ---------------------------------------------------------------------------
-- 2) gen_sku_map — clinical GEN mapping (separate from kashu_sku_map)
-- ---------------------------------------------------------------------------
create table if not exists public.gen_sku_map (
  id uuid primary key default gen_random_uuid(),
  mbm_sku text not null,
  gen_client_product_id text,
  gen_product_name text,
  gen_medication_pairing_id text,
  gen_medication_name text,
  gen_pharmacy text,
  gen_strength text,
  gen_form text,
  gen_package text,
  medication_cost_cents integer,
  shipping_cost_cents integer,
  mapping_status text not null default 'DRAFT',
  replaces_mbm_sku text,
  active boolean not null default false,
  notes text,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gen_sku_map_mbm_sku_key unique (mbm_sku),
  constraint gen_sku_map_status_chk check (
    mapping_status in (
      'DRAFT',
      'CURRENT',
      'READY',
      'ACTIVE',
      'BLOCKED',
      'STALE',
      'UNPAIRED',
      'DEPRECATED'
    )
  )
);

create index if not exists gen_sku_map_status_idx
  on public.gen_sku_map (mapping_status, active);

comment on table public.gen_sku_map is
  'MBM SKU → GEN clinical product map. Tagada commerce remains kashu_sku_map. Empty until verified GEN IDs.';

-- ---------------------------------------------------------------------------
-- 3) order_gen_orders — MBM order_item → GEN clinical order (Option A)
--    unique(order_id, order_item_id) is the primary local idempotency guard
-- ---------------------------------------------------------------------------
create table if not exists public.order_gen_orders (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  order_item_id uuid not null references public.order_items (id) on delete cascade,
  mbm_sku text not null,
  gen_patient_id text,
  gen_order_id text,
  gen_client_product_id text,
  gen_medication_pairing_id text,
  tagada_transaction_id text,
  gen_order_status text,
  required_actions_json jsonb,
  clinical_status text,
  -- operational pipeline: PENDING | IN_PROGRESS | ORDER_CREATED | ACTION_REQUIRED |
  -- SYNCED | RETRY_REQUIRED | BLOCKED | FAILED | SKIPPED_NON_RX | GEN_NOT_STARTED
  handoff_status text not null default 'PENDING',
  attempt_count integer not null default 0,
  last_error_code text,
  last_error_message_safe text,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint order_gen_orders_order_item_uidx unique (order_id, order_item_id),
  constraint order_gen_orders_gen_order_uidx unique (gen_order_id)
);

create index if not exists order_gen_orders_order_id_idx
  on public.order_gen_orders (order_id);

create index if not exists order_gen_orders_handoff_status_idx
  on public.order_gen_orders (handoff_status);

create index if not exists order_gen_orders_pending_idx
  on public.order_gen_orders (handoff_status, created_at)
  where handoff_status in ('PENDING', 'RETRY_REQUIRED');

comment on table public.order_gen_orders is
  'Idempotent link from paid MBM Rx lines to GEN clinical orders. Also serves as post-payment handoff queue.';

-- ---------------------------------------------------------------------------
-- 4) gen_webhook_events — raw event identity + replay prevention
--    external_event_id nullable until GEN event id format confirmed;
--    content_hash supports replay strategy when event id absent
-- ---------------------------------------------------------------------------
create table if not exists public.gen_webhook_events (
  id uuid primary key default gen_random_uuid(),
  external_event_id text,
  content_hash text,
  event_type text,
  gen_order_id text,
  signature_verified boolean not null default false,
  signature_verify_result text,
  processing_status text not null default 'received',
  -- processing_status: received | rejected | processed | duplicate | error
  safe_error text,
  -- Minimal metadata only — avoid storing unnecessary PHI
  headers_safe_json jsonb,
  payload_safe_json jsonb,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  constraint gen_webhook_events_external_event_id_uidx unique (external_event_id),
  constraint gen_webhook_events_content_hash_uidx unique (content_hash)
);

create index if not exists gen_webhook_events_gen_order_id_idx
  on public.gen_webhook_events (gen_order_id);

create index if not exists gen_webhook_events_processing_status_idx
  on public.gen_webhook_events (processing_status, received_at desc);

comment on table public.gen_webhook_events is
  'GEN webhook inbox. Signature verification fail-closed until GEN spec documented. Clinical SoT = GET order.';

-- ---------------------------------------------------------------------------
-- 5) gen_sync_events — operational tracing (no PHI bodies)
-- ---------------------------------------------------------------------------
create table if not exists public.gen_sync_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id) on delete set null,
  order_item_id uuid references public.order_items (id) on delete set null,
  order_gen_order_id uuid references public.order_gen_orders (id) on delete set null,
  gen_order_id text,
  operation text not null,
  -- operation: handoff | create_patient | create_order | get_order | webhook_sync | admin_retry
  attempt integer not null default 1,
  status text not null,
  -- status: ok | error | skipped | retry
  http_status integer,
  safe_error_code text,
  mbm_sku text,
  tagada_transaction_id text,
  correlation_id text,
  created_at timestamptz not null default now(),
  constraint gen_sync_events_operation_chk check (
    operation in (
      'handoff',
      'create_patient',
      'create_order',
      'get_order',
      'webhook_sync',
      'admin_retry'
    )
  ),
  constraint gen_sync_events_status_chk check (
    status in ('ok', 'error', 'skipped', 'retry')
  )
);

create index if not exists gen_sync_events_order_id_idx
  on public.gen_sync_events (order_id, created_at desc);

create index if not exists gen_sync_events_gen_order_id_idx
  on public.gen_sync_events (gen_order_id)
  where gen_order_id is not null;

comment on table public.gen_sync_events is
  'GEN handoff/sync attempt audit. Never store full API bodies with PHI.';

-- ---------------------------------------------------------------------------
-- 6) updated_at triggers (reuse public.set_updated_at if present)
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'set_updated_at'
  ) then
    drop trigger if exists trg_gen_sku_map_updated on public.gen_sku_map;
    create trigger trg_gen_sku_map_updated
      before update on public.gen_sku_map
      for each row execute function public.set_updated_at();

    drop trigger if exists trg_order_gen_orders_updated on public.order_gen_orders;
    create trigger trg_order_gen_orders_updated
      before update on public.order_gen_orders
      for each row execute function public.set_updated_at();
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 7) RLS — enable; service role bypasses. Tighten policies before production.
-- ---------------------------------------------------------------------------
alter table public.gen_sku_map enable row level security;
alter table public.order_gen_orders enable row level security;
alter table public.gen_webhook_events enable row level security;
alter table public.gen_sync_events enable row level security;

-- Admins may read mapping + handoff status (no webhook raw inbox for anon)
drop policy if exists gen_sku_map_admin_select on public.gen_sku_map;
create policy gen_sku_map_admin_select on public.gen_sku_map
  for select to authenticated
  using (public.is_admin());

drop policy if exists order_gen_orders_admin_select on public.order_gen_orders;
create policy order_gen_orders_admin_select on public.order_gen_orders
  for select to authenticated
  using (public.is_admin());

drop policy if exists order_gen_orders_select_own on public.order_gen_orders;
create policy order_gen_orders_select_own on public.order_gen_orders
  for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_gen_orders.order_id
        and o.customer_user_id = auth.uid()
    )
  );

-- Webhook + sync tables: no authenticated policies (service role only)
drop policy if exists gen_webhook_events_admin_select on public.gen_webhook_events;
create policy gen_webhook_events_admin_select on public.gen_webhook_events
  for select to authenticated
  using (public.is_admin());

drop policy if exists gen_sync_events_admin_select on public.gen_sync_events;
create policy gen_sync_events_admin_select on public.gen_sync_events
  for select to authenticated
  using (public.is_admin());

-- =============================================================================
-- END Phase 12D migration — DO NOT APPLY without owner approval
-- =============================================================================
