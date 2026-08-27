-- Prescription Subscribe & Save (15%) through Tagada recurring billing.
-- Historical membership tables remain read-only for existing records; new
-- enrollment uses customer_prescription_subscriptions.

alter table public.orders
  add column if not exists subscription_sku text,
  add column if not exists subscription_base_amount_cents integer,
  add column if not exists subscription_shipping_cents integer,
  add column if not exists subscription_monthly_amount_cents integer;

alter table public.orders
  drop constraint if exists orders_subscription_amounts_check;
alter table public.orders
  add constraint orders_subscription_amounts_check check (
    subscription_sku is null or (
      subscription_base_amount_cents > 0 and
      subscription_shipping_cents in (3000, 5000) and
      subscription_monthly_amount_cents =
        subscription_base_amount_cents + subscription_shipping_cents
    )
  );

create table if not exists public.customer_prescription_subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_user_id uuid references auth.users(id) on delete set null,
  customer_email text,
  enrollment_order_id uuid not null references public.orders(id) on delete restrict,
  enrollment_public_order_number text not null,
  prescription_sku text not null,
  status text not null default 'pending_payment' check (status in (
    'pending_payment', 'active', 'past_due', 'payment_issue', 'paused',
    'cancel_scheduled', 'canceled'
  )),
  tagada_subscription_id text,
  tagada_customer_id text,
  tagada_price_id text not null,
  tagada_variant_id text not null,
  medication_amount_cents integer not null check (medication_amount_cents > 0),
  shipping_cents integer not null check (shipping_cents in (3000, 5000)),
  selected_shipping_method text not null check (selected_shipping_method in ('two_day', 'next_day')),
  monthly_amount_cents integer not null check (monthly_amount_cents = medication_amount_cents + shipping_cents),
  discount_percent integer not null default 15 check (discount_percent = 15),
  currency text not null default 'USD',
  current_period_start timestamptz,
  current_period_end timestamptz,
  next_billing_at timestamptz,
  started_at timestamptz,
  minimum_term_ends_at timestamptz,
  last_rebill_at timestamptz,
  last_rebill_status text,
  last_rebill_payment_id text,
  past_due_at timestamptz,
  cancel_scheduled_at timestamptz,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (enrollment_order_id),
  unique (tagada_subscription_id)
);

create index if not exists customer_prescription_subscriptions_customer_idx
  on public.customer_prescription_subscriptions (customer_user_id, created_at desc);
create index if not exists customer_prescription_subscriptions_email_sku_idx
  on public.customer_prescription_subscriptions (lower(customer_email), prescription_sku, status);

alter table public.customer_prescription_subscriptions enable row level security;
drop policy if exists "customers_read_own_prescription_subscriptions"
  on public.customer_prescription_subscriptions;
create policy "customers_read_own_prescription_subscriptions"
  on public.customer_prescription_subscriptions for select
  to authenticated
  using (customer_user_id = auth.uid());

create table if not exists public.prescription_subscription_rebill_events (
  id uuid primary key default gen_random_uuid(),
  customer_subscription_id uuid not null
    references public.customer_prescription_subscriptions(id) on delete cascade,
  tagada_event_id text not null unique,
  tagada_payment_id text,
  event_type text not null,
  amount_cents integer,
  processing_result text not null,
  created_at timestamptz not null default now()
);

alter table public.prescription_subscription_rebill_events enable row level security;

create table if not exists public.prescription_subscription_renewals (
  id uuid primary key default gen_random_uuid(),
  customer_subscription_id uuid not null
    references public.customer_prescription_subscriptions(id) on delete restrict,
  tagada_event_id text not null unique,
  tagada_payment_id text,
  prescription_sku text not null,
  medication_amount_cents integer not null check (medication_amount_cents > 0),
  shipping_cents integer not null check (shipping_cents in (3000, 5000)),
  total_paid_cents integer not null check (total_paid_cents = medication_amount_cents + shipping_cents),
  fulfillment_status text not null default 'paid_awaiting_clinical_review' check (
    fulfillment_status in (
      'paid_awaiting_clinical_review', 'approved_for_manual_gen_handoff',
      'submitted_to_gen', 'fulfilled', 'held', 'canceled'
    )
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.prescription_subscription_renewals enable row level security;

grant select on public.customer_prescription_subscriptions to authenticated;
grant all on public.customer_prescription_subscriptions to service_role;
grant all on public.prescription_subscription_rebill_events to service_role;
grant all on public.prescription_subscription_renewals to service_role;

comment on table public.customer_prescription_subscriptions is
  'Tagada monthly prescription subscriptions at 15% off with selected shipping included on every renewal.';
