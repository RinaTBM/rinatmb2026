-- =============================================================================
-- Product & Membership Admin System — schema, logs, and Row Level Security.
-- Money is stored as integer cents. UUID primary keys. Test/live Stripe IDs
-- are stored in separate columns so the two environments never collide.
-- No wholesale cost, markup, pharmacy source, or profit fields exist here.
-- =============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Admin role
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER so RLS policies can check admin status without recursion.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Catalog tables
-- ---------------------------------------------------------------------------
create table if not exists public.catalog_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  app_product_id text unique,
  display_name text not null,
  short_name text,
  subtitle text,
  category text not null,
  dosage_form_summary text,
  short_description text,
  long_description text,
  image_url text,
  image_alt text,
  starting_price_cents integer not null default 0 check (starting_price_cents >= 0),
  currency text not null default 'usd',
  status text not null default 'active' check (status in ('active', 'future')),
  is_visible boolean not null default true,
  launch_phase integer,
  campaign_theme text,
  requires_provider_review boolean not null default true,
  requires_prescription boolean not null default true,
  requires_compliance_review boolean not null default true,
  requires_pharmacy_verification boolean not null default true,
  sort_order integer not null default 0,
  stripe_product_id_test text,
  stripe_product_id_live text,
  stripe_sync_status text not null default 'not_synced',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.catalog_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.catalog_products (id) on delete cascade,
  variant_key text not null,
  display_name text not null,
  dosage_form text,
  strength text,
  size text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'usd',
  billing_type text not null default 'one_time' check (billing_type in ('one_time', 'recurring')),
  billing_interval text check (billing_interval in ('month')),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  stripe_price_id_test text,
  stripe_price_id_live text,
  stripe_sync_status text not null default 'not_synced',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, variant_key)
);

create table if not exists public.catalog_memberships (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  app_product_id text unique,
  display_name text not null,
  brand_name text,
  short_description text,
  long_description text,
  monthly_price_cents integer not null check (monthly_price_cents >= 0),
  currency text not null default 'usd',
  billing_interval text not null default 'month' check (billing_interval in ('month')),
  initial_term_months integer not null default 3 check (initial_term_months >= 0),
  locked_rate boolean not null default true,
  included_formulations jsonb not null default '[]'::jsonb,
  maximum_included_formulation text,
  provider_review_required boolean not null default true,
  prescription_guaranteed boolean not null default false,
  shipping_included boolean not null default false,
  status text not null default 'active' check (status in ('active', 'inactive')),
  is_visible boolean not null default true,
  stripe_product_id_test text,
  stripe_product_id_live text,
  stripe_price_id_test text,
  stripe_price_id_live text,
  stripe_sync_status text not null default 'not_synced',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Operational logs
-- ---------------------------------------------------------------------------
create table if not exists public.stripe_sync_log (
  id uuid primary key default gen_random_uuid(),
  environment text not null check (environment in ('test', 'live')),
  entity_type text not null check (entity_type in ('product', 'variant', 'membership')),
  entity_id text,
  operation text not null,
  stripe_object_type text,
  stripe_object_id text,
  status text not null default 'pending',
  request_fingerprint text,
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users (id),
  action text not null,
  entity_type text,
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

-- Idempotent webhook processing: each Stripe event id processed at most once.
create table if not exists public.processed_stripe_events (
  event_id text primary key,
  environment text not null check (environment in ('test', 'live')),
  type text,
  processed_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_products_updated on public.catalog_products;
create trigger trg_products_updated before update on public.catalog_products
  for each row execute function public.set_updated_at();
drop trigger if exists trg_variants_updated on public.catalog_variants;
create trigger trg_variants_updated before update on public.catalog_variants
  for each row execute function public.set_updated_at();
drop trigger if exists trg_memberships_updated on public.catalog_memberships;
create trigger trg_memberships_updated before update on public.catalog_memberships
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.admins enable row level security;
alter table public.catalog_products enable row level security;
alter table public.catalog_variants enable row level security;
alter table public.catalog_memberships enable row level security;
alter table public.stripe_sync_log enable row level security;
alter table public.admin_audit_log enable row level security;
alter table public.processed_stripe_events enable row level security;

-- Admins table: an admin may read the admin list; no client writes (service role only).
drop policy if exists admins_select on public.admins;
create policy admins_select on public.admins for select to authenticated using (public.is_admin());

-- Storefront (anon + authenticated) may READ only visible/active catalog rows.
drop policy if exists products_public_read on public.catalog_products;
create policy products_public_read on public.catalog_products
  for select to anon, authenticated using (is_visible = true and status = 'active');

drop policy if exists variants_public_read on public.catalog_variants;
create policy variants_public_read on public.catalog_variants
  for select to anon, authenticated using (
    is_active = true and exists (
      select 1 from public.catalog_products p
      where p.id = catalog_variants.product_id and p.is_visible = true and p.status = 'active'
    )
  );

drop policy if exists memberships_public_read on public.catalog_memberships;
create policy memberships_public_read on public.catalog_memberships
  for select to anon, authenticated using (is_visible = true and status = 'active');

-- Admins may read + write ALL catalog rows (including hidden/future).
drop policy if exists products_admin_all on public.catalog_products;
create policy products_admin_all on public.catalog_products for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists variants_admin_all on public.catalog_variants;
create policy variants_admin_all on public.catalog_variants for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists memberships_admin_all on public.catalog_memberships;
create policy memberships_admin_all on public.catalog_memberships for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Logs: admins may read; writes happen via service role (bypasses RLS). No anon access.
drop policy if exists sync_log_admin_read on public.stripe_sync_log;
create policy sync_log_admin_read on public.stripe_sync_log for select to authenticated using (public.is_admin());
drop policy if exists audit_log_admin_read on public.admin_audit_log;
create policy audit_log_admin_read on public.admin_audit_log for select to authenticated using (public.is_admin());
-- processed_stripe_events: no client policies → only service role can access.
