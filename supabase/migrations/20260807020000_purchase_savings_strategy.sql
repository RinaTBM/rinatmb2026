-- =============================================================================
-- Active Wellness Membership + Auto-Refill & Save purchasing strategy
-- Pending migration — do not apply in production from this PR alone.
-- Stripe Live Mode is never modified by this schema.
-- =============================================================================

-- Store-level discount configuration (admin-editable; no code deploys for %).
create table if not exists public.store_purchase_settings (
  id text primary key default 'default',
  member_discount_percent integer not null default 15
    check (member_discount_percent >= 0 and member_discount_percent <= 100),
  auto_refill_discount_percent integer not null default 10
    check (auto_refill_discount_percent >= 0 and auto_refill_discount_percent <= 100),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

insert into public.store_purchase_settings (id)
values ('default')
on conflict (id) do nothing;

alter table public.catalog_products
  add column if not exists auto_refill_eligible boolean not null default false,
  add column if not exists member_pricing_eligible boolean not null default false,
  add column if not exists excluded_from_discounts boolean not null default false;

-- Seed eligibility for existing catalog rows from category rules.
update public.catalog_products
set
  excluded_from_discounts = (category in ('provider-care', 'accessories')),
  auto_refill_eligible = (status = 'active' and category not in ('provider-care', 'accessories')),
  member_pricing_eligible = (status = 'active' and category not in ('provider-care', 'accessories'))
where true;

-- Future products remain Auto-Refill OFF until manually approved.
update public.catalog_products
set auto_refill_eligible = false
where status = 'future';

create table if not exists public.cancellation_requests (
  id uuid primary key default gen_random_uuid(),
  subscription_kind text not null check (subscription_kind in ('active_wellness_membership', 'auto_refill')),
  subscription_ref text not null,
  subscription_name text not null,
  customer_email text not null,
  customer_note text,
  status text not null default 'submitted'
    check (status in ('submitted', 'under_review', 'processed', 'cancellation_confirmed')),
  submitted_at timestamptz not null default now(),
  processed_at timestamptz,
  admin_note text,
  admin_user_id uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.purchase_reporting_snapshots (
  id uuid primary key default gen_random_uuid(),
  active_wellness_members integer not null default 0,
  auto_refill_subscriptions integer not null default 0,
  pending_cancellation_requests integer not null default 0,
  discounts_applied_count integer not null default 0,
  recorded_at timestamptz not null default now()
);

alter table public.store_purchase_settings enable row level security;
alter table public.cancellation_requests enable row level security;
alter table public.purchase_reporting_snapshots enable row level security;

drop policy if exists store_purchase_settings_admin_all on public.store_purchase_settings;
create policy store_purchase_settings_admin_all on public.store_purchase_settings
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists cancellation_requests_admin_all on public.cancellation_requests;
create policy cancellation_requests_admin_all on public.cancellation_requests
  for all using (public.is_admin()) with check (public.is_admin());

-- Anonymous customers may insert cancellation requests (email + note only).
drop policy if exists cancellation_requests_public_insert on public.cancellation_requests;
create policy cancellation_requests_public_insert on public.cancellation_requests
  for insert to anon, authenticated
  with check (true);

drop policy if exists purchase_reporting_admin_all on public.purchase_reporting_snapshots;
create policy purchase_reporting_admin_all on public.purchase_reporting_snapshots
  for all using (public.is_admin()) with check (public.is_admin());
