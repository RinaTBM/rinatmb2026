-- =============================================================================
-- PRODUCTION ACH / WIRE FOUNDATION — MANUAL SQL EDITOR HANDOFF
-- Target project: dlmigmufqawlqtljqyny
-- Source branch tip: deploy/ach-launch-clean-2026 @ 812bb5a
--
-- PREPARE ONLY. Do NOT auto-execute from CI/Cursor.
-- Paste into PRODUCTION Supabase SQL Editor only after explicit owner approval.
--
-- Includes ONLY the minimum approved dependency chain:
--   1) public.set_updated_at()
--   2) public.admins (+ is_active, updated_at)
--   3) active-admin public.is_admin()
--   4) equivalent of 20260807220000_customer_orders.sql
--   5) equivalent of 20260810090000_manual_invoice_payments.sql
--
-- Explicitly excluded:
--   - catalog tables / seed
--   - customer_profiles
--   - Stripe schema changes / Stripe function deps
--   - Plaid
--   - admin user inserts
--   - bank secrets / bank detail rows
--   - DROP/TRUNCATE/DELETE of production data
--   - any modification of auth.users
--   - any touch of public.stripe_products
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0) Extension used by gen_random_uuid() on Supabase Postgres
-- ---------------------------------------------------------------------------
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1) public.set_updated_at()
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2) public.admins (PK -> auth.users) with is_active + updated_at
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admins add column if not exists email text;
alter table public.admins add column if not exists is_active boolean not null default true;
alter table public.admins add column if not exists created_at timestamptz not null default now();
alter table public.admins add column if not exists updated_at timestamptz not null default now();

-- ---------------------------------------------------------------------------
-- 3) active-admin public.is_admin()
-- SECURITY DEFINER so RLS policies can check admin status without recursion.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins a
    where a.user_id = auth.uid()
      and a.is_active = true
  );
$$;

alter table public.admins enable row level security;

drop policy if exists admins_select on public.admins;
create policy admins_select on public.admins
  for select to authenticated
  using (public.is_admin());

drop trigger if exists trg_admins_updated on public.admins;
create trigger trg_admins_updated
  before update on public.admins
  for each row execute function public.set_updated_at();

-- NOTE: Do NOT insert an admin row here.
-- After this script succeeds, bootstrap manually (example only — do not paste secrets):
--   insert into public.admins (user_id, email, is_active)
--   values ('<your-auth-user-uuid>', '<you@example.com>', true)
--   on conflict (user_id) do update
--     set is_active = true, email = excluded.email;

-- =============================================================================
-- 4) Customer orders foundation
--    Equivalent of supabase/migrations/20260807220000_customer_orders.sql
-- =============================================================================

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_user_id uuid references auth.users (id) on delete set null,
  customer_email text not null default '',
  customer_name text not null default '',
  public_order_number text not null unique,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  order_status text not null default 'order_received',
  payment_status text not null default 'pending',
  subtotal_cents integer not null default 0 check (subtotal_cents >= 0),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  tax_cents integer not null default 0 check (tax_cents >= 0),
  total_cents integer not null default 0 check (total_cents >= 0),
  shipping_method text not null default '',
  free_shipping_eligible boolean not null default false,
  currency text not null default 'usd',
  requires_provider_review boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_order_status_check check (order_status in (
    'order_received', 'payment_confirmed', 'action_required', 'provider_review_in_progress',
    'processing', 'preparing_for_shipment', 'shipped', 'delivered', 'canceled', 'refunded'
  )),
  constraint orders_payment_status_check check (payment_status in (
    'pending', 'paid', 'failed', 'refunded', 'partially_refunded'
  ))
);

create index if not exists orders_customer_user_id_idx on public.orders (customer_user_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_order_status_idx on public.orders (order_status);
create index if not exists orders_payment_status_idx on public.orders (payment_status);
create index if not exists orders_customer_email_idx on public.orders (customer_email);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text,
  product_name_snapshot text not null,
  variant_snapshot text,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  line_total_cents integer not null check (line_total_cents >= 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

create table if not exists public.order_fulfillment (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders (id) on delete cascade,
  fulfillment_status text not null default 'order_received',
  pharmacy_name text,
  carrier text,
  tracking_number text,
  tracking_url text,
  processing_started_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint order_fulfillment_status_check check (fulfillment_status in (
    'order_received', 'payment_confirmed', 'action_required', 'provider_review_in_progress',
    'processing', 'preparing_for_shipment', 'shipped', 'delivered', 'canceled', 'refunded'
  )),
  constraint order_fulfillment_carrier_check check (
    carrier is null or carrier in ('UPS', 'FedEx', 'USPS', 'Other')
  )
);

create index if not exists order_fulfillment_status_idx on public.order_fulfillment (fulfillment_status);

create table if not exists public.order_status_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  status text not null,
  customer_visible boolean not null default true,
  note text,
  event_at timestamptz not null default now(),
  created_by text not null default 'system',
  created_at timestamptz not null default now(),
  constraint order_status_events_status_check check (status in (
    'order_received', 'payment_confirmed', 'action_required', 'provider_review_in_progress',
    'processing', 'preparing_for_shipment', 'shipped', 'delivered', 'canceled', 'refunded'
  ))
);

create index if not exists order_status_events_order_id_idx on public.order_status_events (order_id, event_at);

-- Internal admin notes — never exposed to customers via RLS.
create table if not exists public.order_admin_notes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  note text not null,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists order_admin_notes_order_id_idx on public.order_admin_notes (order_id, created_at desc);

drop trigger if exists trg_orders_updated on public.orders;
create trigger trg_orders_updated
  before update on public.orders
  for each row execute function public.set_updated_at();

drop trigger if exists trg_order_fulfillment_updated on public.order_fulfillment;
create trigger trg_order_fulfillment_updated
  before update on public.order_fulfillment
  for each row execute function public.set_updated_at();

-- Public order number: MBM-YYYY-######
create sequence if not exists public.order_number_seq;

create or replace function public.generate_public_order_number()
returns text
language plpgsql
as $$
declare
  n bigint;
begin
  n := nextval('public.order_number_seq');
  return 'MBM-' || to_char(timezone('utc', now()), 'YYYY') || '-' || lpad(n::text, 6, '0');
end;
$$;

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_fulfillment enable row level security;
alter table public.order_status_events enable row level security;
alter table public.order_admin_notes enable row level security;

-- Customers: read own orders
drop policy if exists orders_select_own on public.orders;
create policy orders_select_own on public.orders
  for select to authenticated
  using (customer_user_id = auth.uid());

drop policy if exists orders_admin_all on public.orders;
create policy orders_admin_all on public.orders
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Customers cannot insert/update/delete orders (service role / Edge Functions only).

drop policy if exists order_items_select_own on public.order_items;
create policy order_items_select_own on public.order_items
  for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.customer_user_id = auth.uid()
    )
  );

drop policy if exists order_items_admin_all on public.order_items;
create policy order_items_admin_all on public.order_items
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists order_fulfillment_select_own on public.order_fulfillment;
create policy order_fulfillment_select_own on public.order_fulfillment
  for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.customer_user_id = auth.uid()
    )
  );

drop policy if exists order_fulfillment_admin_all on public.order_fulfillment;
create policy order_fulfillment_admin_all on public.order_fulfillment
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Customers see only customer_visible events
drop policy if exists order_status_events_select_own_visible on public.order_status_events;
create policy order_status_events_select_own_visible on public.order_status_events
  for select to authenticated
  using (
    customer_visible = true
    and exists (
      select 1 from public.orders o
      where o.id = order_id and o.customer_user_id = auth.uid()
    )
  );

drop policy if exists order_status_events_admin_all on public.order_status_events;
create policy order_status_events_admin_all on public.order_status_events
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Admin notes: admin only (no customer policies)
drop policy if exists order_admin_notes_admin_all on public.order_admin_notes;
create policy order_admin_notes_admin_all on public.order_admin_notes
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- 5) Manual ACH / Wire invoice payment columns + constraints
--    Equivalent of supabase/migrations/20260810090000_manual_invoice_payments.sql
-- =============================================================================

-- Extend payment_status for processor-neutral manual invoice flow while keeping
-- legacy Stripe-era values for historical / foundation rows.
alter table public.orders drop constraint if exists orders_payment_status_check;
alter table public.orders add constraint orders_payment_status_check check (
  payment_status in (
    'awaiting_payment',
    'payment_under_review',
    'paid',
    'payment_failed',
    'cancelled',
    'refunded',
    -- legacy
    'pending',
    'failed',
    'partially_refunded'
  )
);

alter table public.orders
  add column if not exists payment_method text,
  add column if not exists payment_reference text,
  add column if not exists invoice_number text,
  add column if not exists payment_access_token text,
  add column if not exists paid_at timestamptz,
  add column if not exists paid_marked_by text,
  add column if not exists payment_admin_note text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_payment_method_check'
  ) then
    alter table public.orders
      add constraint orders_payment_method_check check (
        payment_method is null
        or payment_method in ('manual_ach', 'manual_wire', 'plaid_ach')
      );
  end if;
end $$;

create unique index if not exists orders_payment_access_token_uidx
  on public.orders (payment_access_token)
  where payment_access_token is not null;

create index if not exists orders_payment_method_idx on public.orders (payment_method);
create index if not exists orders_invoice_number_idx on public.orders (invoice_number);

comment on column public.orders.payment_method is
  'Processor-neutral: manual_ach | manual_wire | plaid_ach (future).';
comment on column public.orders.payment_access_token is
  'Opaque token for post-order payment instructions page. Never expose on catalog pages.';
comment on column public.orders.stripe_checkout_session_id is
  'LEGACY — Stripe retired. Retained for historical rows only.';

-- =============================================================================
-- END production-ach-foundation.sql
-- After apply (separate owner-approved steps — NOT in this file):
--   A) Insert first active admin row
--   B) Set MANUAL_* Edge Function secrets (names/values via dashboard)
--   C) Deploy create-invoice-order / get-payment-instructions / mark-payment-received
-- =============================================================================
