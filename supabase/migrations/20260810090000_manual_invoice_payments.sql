-- =============================================================================
-- Manual ACH / Wire invoice checkout (additive)
-- PENDING MIGRATION — do not apply from Cursor alone without explicit approval.
-- Does NOT drop Stripe columns. Does NOT modify catalog pricing.
-- =============================================================================

-- Extend payment_status for processor-neutral manual invoice flow while keeping
-- legacy Stripe-era values for historical rows.
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
