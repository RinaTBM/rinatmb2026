-- =============================================================================
-- Google admin auth support (authentication-only; no product/catalog/price changes).
-- Extends the EXISTING `admins` role table with an `is_active` flag (for revocation)
-- and `updated_at`, and makes is_admin() require an ACTIVE admin. RLS policies that
-- already call is_admin() automatically inherit the active-admin requirement.
-- =============================================================================

alter table public.admins add column if not exists is_active boolean not null default true;
alter table public.admins add column if not exists updated_at timestamptz not null default now();

-- Only ACTIVE admins are considered admins now (revocation = set is_active = false).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where a.user_id = auth.uid() and a.is_active = true
  );
$$;

-- Keep updated_at fresh on the admins table.
drop trigger if exists trg_admins_updated on public.admins;
create trigger trg_admins_updated before update on public.admins
  for each row execute function public.set_updated_at();

-- First-admin bootstrap (run manually after your Google user exists in auth.users):
--   insert into public.admins (user_id, email, is_active)
--   values ('<your-auth-user-uuid>', '<you@example.com>', true)
--   on conflict (user_id) do update set is_active = true, email = excluded.email;
-- Revoke an admin (non-destructive):
--   update public.admins set is_active = false where email = '<person@example.com>';
