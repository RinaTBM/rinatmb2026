-- =============================================================================
-- Provider Appointment Automation — Phase 2
-- PENDING MIGRATION — do not apply from Cursor / this PR alone.
-- Additive only. Does not change catalog prices/SKUs/slugs, ACH/Wire behavior,
-- Stripe, or Kashu card enablement. Does not integrate CrossTx.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) Authoritative customer therapy / dose approval history
-- ---------------------------------------------------------------------------

create table if not exists public.customer_therapy_history (
  id uuid primary key default gen_random_uuid(),
  customer_user_id uuid not null references auth.users (id) on delete cascade,
  therapy_family text not null,
  product_id text not null,
  variant_id text not null,
  sku text not null,
  approval_status text not null,
  approved_at timestamptz,
  approved_by uuid references auth.users (id) on delete set null,
  source_order_id uuid references public.orders (id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_therapy_history_approval_status_check check (
    approval_status in ('PENDING', 'APPROVED', 'REJECTED', 'SUPERSEDED')
  )
);

create index if not exists customer_therapy_history_customer_idx
  on public.customer_therapy_history (customer_user_id);

create index if not exists customer_therapy_history_family_idx
  on public.customer_therapy_history (customer_user_id, therapy_family);

create index if not exists customer_therapy_history_approved_idx
  on public.customer_therapy_history (customer_user_id, therapy_family, approval_status)
  where approval_status = 'APPROVED';

drop trigger if exists customer_therapy_history_set_updated_at on public.customer_therapy_history;
create trigger customer_therapy_history_set_updated_at
  before update on public.customer_therapy_history
  for each row execute function public.set_updated_at();

alter table public.customer_therapy_history enable row level security;

-- Customers may read their own history (checkout UX). Writes are admin/service only.
drop policy if exists customer_therapy_history_select_own on public.customer_therapy_history;
create policy customer_therapy_history_select_own
  on public.customer_therapy_history
  for select
  to authenticated
  using (customer_user_id = auth.uid() or public.is_admin());

drop policy if exists customer_therapy_history_admin_all on public.customer_therapy_history;
create policy customer_therapy_history_admin_all
  on public.customer_therapy_history
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 2) Additive order provider-requirement / workflow fields
-- ---------------------------------------------------------------------------

alter table public.orders
  add column if not exists provider_requirement text,
  add column if not exists provider_requirement_reason text,
  add column if not exists previous_variant_sku text,
  add column if not exists requested_variant_sku text,
  add column if not exists required_provider_product_id text,
  add column if not exists provider_visit_order_item_id uuid,
  add column if not exists provider_workflow_status text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_provider_requirement_check'
  ) then
    alter table public.orders
      add constraint orders_provider_requirement_check
      check (
        provider_requirement is null
        or provider_requirement in ('INITIAL', 'FOLLOW_UP', 'NONE', 'NEW_THERAPY')
      );
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'orders_provider_workflow_status_check'
  ) then
    alter table public.orders
      add constraint orders_provider_workflow_status_check
      check (
        provider_workflow_status is null
        or provider_workflow_status in (
          'NOT_REQUIRED',
          'MANUAL_ACTION_REQUIRED',
          'COMPLETED',
          'ERROR'
        )
      );
  end if;
end $$;

comment on table public.customer_therapy_history is
  'Authoritative provider-approved therapy/dose history. Paid/fulfilled/provider_review_in_progress orders do NOT imply approval.';

comment on column public.orders.provider_requirement is
  'Collapsed cart-level provider visit requirement: INITIAL | FOLLOW_UP | NONE | NEW_THERAPY';

comment on column public.orders.provider_workflow_status is
  'Manual CrossTx tracking only (no API). After paid: MANUAL_ACTION_REQUIRED or NOT_REQUIRED.';
