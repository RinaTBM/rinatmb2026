-- =============================================================================
-- GEN Health V2 Schema Draft — Phase 12C
-- =============================================================================
-- DESIGN ONLY. DO NOT APPLY to production / BSG without explicit owner approval.
-- Baseline: deploy/ach-launch-clean-2026 @ 5473777fa21c54f084ca86b330ea03f93c7152eb
--
-- Rules:
-- - Additive only — do not rewrite historical SKUs, Tagada IDs, or order snapshots
-- - Service-role writes for map/webhook/handoff tables
-- - GEN secrets never stored in tables
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) Additive GEN patient reference on existing customer profiles
-- ---------------------------------------------------------------------------
-- alter table public.customer_profiles
--   add column if not exists gen_patient_id text;
--
-- create unique index if not exists customer_profiles_gen_patient_id_uidx
--   on public.customer_profiles (gen_patient_id)
--   where gen_patient_id is not null;

-- ---------------------------------------------------------------------------
-- 2) Optional rollup on orders (derived UI / retry)
-- ---------------------------------------------------------------------------
-- alter table public.orders
--   add column if not exists gen_handoff_status text,
--   add column if not exists gen_handoff_last_error text,
--   add column if not exists gen_handoff_attempts integer not null default 0,
--   add column if not exists gen_handoff_updated_at timestamptz;
--
-- Suggested gen_handoff_status values:
--   GEN_NOT_STARTED, GEN_PATIENT_PENDING, GEN_PATIENT_CREATED,
--   GEN_ORDER_PENDING, GEN_ORDER_CREATED, GEN_ACTION_REQUIRED,
--   GEN_PROVIDER_REVIEW, GEN_APPROVED, GEN_DENIED, GEN_PHARMACY,
--   GEN_SHIPPED, GEN_COMPLETE, GEN_ERROR, GEN_RETRY_REQUIRED

-- ---------------------------------------------------------------------------
-- 3) MBM SKU → GEN clinical product map (does NOT replace kashu_sku_map)
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
  mapping_status text not null default 'BLOCKED',
  -- mapping_status: CURRENT | READY | ACTIVE | BLOCKED | STALE | UNPAIRED | DEPRECATED
  replaces_mbm_sku text,
  active boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_verified_at timestamptz,
  constraint gen_sku_map_mbm_sku_key unique (mbm_sku),
  constraint gen_sku_map_status_chk check (
    mapping_status in (
      'CURRENT', 'READY', 'ACTIVE', 'BLOCKED', 'STALE', 'UNPAIRED', 'DEPRECATED'
    )
  )
);

create index if not exists gen_sku_map_status_idx
  on public.gen_sku_map (mapping_status, active);

comment on table public.gen_sku_map is
  'Phase 12C draft: clinical GEN mapping for MBM SKUs. Tagada commerce remains kashu_sku_map.';

-- ---------------------------------------------------------------------------
-- 4) MBM order_item → GEN clinical order (Option A: one GEN order per Rx line)
-- ---------------------------------------------------------------------------
create table if not exists public.order_gen_orders (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  order_item_id uuid references public.order_items (id) on delete set null,
  mbm_sku text not null,
  gen_patient_id text,
  gen_order_id text,
  gen_client_product_id text,
  gen_medication_pairing_id text,
  tagada_transaction_id text,
  gen_order_status text,
  clinical_status text,
  -- clinical_status / handoff_status may mirror section 10 of design doc
  handoff_status text not null default 'GEN_NOT_STARTED',
  required_actions_json jsonb,
  last_gen_payload_json jsonb,
  last_error text,
  attempt_count integer not null default 0,
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

comment on table public.order_gen_orders is
  'Phase 12C draft: idempotent link from MBM paid order lines to GEN clinical orders.';

-- ---------------------------------------------------------------------------
-- 5) Inbound GEN webhook inbox
-- ---------------------------------------------------------------------------
create table if not exists public.gen_webhook_events (
  id uuid primary key default gen_random_uuid(),
  event_id text,
  event_type text,
  gen_order_id text,
  signature_valid boolean,
  processing_result text,
  error_message text,
  raw_body jsonb,
  headers_json jsonb,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  constraint gen_webhook_events_event_id_uidx unique (event_id)
);

create index if not exists gen_webhook_events_gen_order_id_idx
  on public.gen_webhook_events (gen_order_id);

comment on table public.gen_webhook_events is
  'Phase 12C draft: raw GEN webhook signals. Authoritative clinical state comes from GET order.';

-- ---------------------------------------------------------------------------
-- 6) Handoff / sync attempt audit
-- ---------------------------------------------------------------------------
create table if not exists public.gen_sync_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id) on delete set null,
  order_gen_order_id uuid references public.order_gen_orders (id) on delete set null,
  direction text not null,
  -- direction: handoff | get_order | webhook_sync | admin_retry
  status text not null,
  mbm_sku text,
  gen_order_id text,
  tagada_transaction_id text,
  http_status integer,
  error_code text,
  detail text,
  created_at timestamptz not null default now(),
  constraint gen_sync_events_direction_chk check (
    direction in ('handoff', 'get_order', 'webhook_sync', 'admin_retry')
  )
);

create index if not exists gen_sync_events_order_id_idx
  on public.gen_sync_events (order_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 7) RLS sketch (not applied) — tighten before production
-- ---------------------------------------------------------------------------
-- alter table public.gen_sku_map enable row level security;
-- alter table public.order_gen_orders enable row level security;
-- alter table public.gen_webhook_events enable row level security;
-- alter table public.gen_sync_events enable row level security;
--
-- Revoke anon/authenticated direct access to webhook/sync/map cost columns.
-- Allow customers to SELECT limited clinical status fields for own orders only
-- via a narrow view or policy joining orders.user_id = auth.uid().
-- Admins: is_admin() select/update where appropriate.
-- Writes: service role (Edge Functions) only.

-- =============================================================================
-- END DRAFT — DO NOT APPLY WITHOUT APPROVAL
-- =============================================================================
