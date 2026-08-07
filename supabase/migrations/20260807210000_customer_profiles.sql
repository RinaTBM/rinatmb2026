-- =============================================================================
-- Customer Account Portal — Phase 1
-- PENDING MIGRATION — do not apply from Cursor / this PR alone.
-- Additive only. Does not modify admin auth, catalog, Stripe, or existing data rows.
-- =============================================================================

-- Customer profile (account / contact info only — NO medical fields).
create table if not exists public.customer_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  email text not null default '',
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_profiles_no_user_id_empty check (user_id is not null)
);

create index if not exists customer_profiles_user_id_idx on public.customer_profiles (user_id);
create index if not exists customer_profiles_email_idx on public.customer_profiles (email);

drop trigger if exists trg_customer_profiles_updated on public.customer_profiles;
create trigger trg_customer_profiles_updated
  before update on public.customer_profiles
  for each row execute function public.set_updated_at();

alter table public.customer_profiles enable row level security;

-- Customers: read own profile
drop policy if exists customer_profiles_select_own on public.customer_profiles;
create policy customer_profiles_select_own on public.customer_profiles
  for select to authenticated
  using (user_id = auth.uid());

-- Customers: insert own profile (on first sign-in / sign-up)
drop policy if exists customer_profiles_insert_own on public.customer_profiles;
create policy customer_profiles_insert_own on public.customer_profiles
  for insert to authenticated
  with check (user_id = auth.uid());

-- Customers: update own profile (allowed contact fields only at app layer;
-- user_id cannot change because using + with check both require auth.uid())
drop policy if exists customer_profiles_update_own on public.customer_profiles;
create policy customer_profiles_update_own on public.customer_profiles
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- No customer delete policy (profiles persist with auth.users cascade).

-- Active admins may read profiles for support (existing is_admin() gate).
drop policy if exists customer_profiles_admin_select on public.customer_profiles;
create policy customer_profiles_admin_select on public.customer_profiles
  for select to authenticated
  using (public.is_admin());

-- Explicit: customers have NO write access to admins / catalog via this migration.
-- Existing catalog/admin RLS policies remain unchanged.
