-- =============================================================================
-- Customer wellness memberships (Tagada native recurring)
-- Additive only. DO NOT APPLY to production until controlled test approval.
-- Does NOT store card PAN/CVC. Does NOT revive Stripe.
-- =============================================================================

create table if not exists public.customer_memberships (
  id uuid primary key default gen_random_uuid(),
  customer_user_id uuid references auth.users(id) on delete set null,
  customer_email text,
  enrollment_order_id uuid references public.orders(id) on delete set null,
  enrollment_public_order_number text,
  membership_sku text not null,
  membership_type text not null,
  status text not null default 'pending_payment',
  tagada_subscription_id text,
  tagada_customer_id text,
  tagada_price_id text not null,
  tagada_variant_id text,
  monthly_amount_cents integer not null,
  currency text not null default 'USD',
  started_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  next_billing_at timestamptz,
  minimum_term_ends_at timestamptz,
  cancel_scheduled_at timestamptz,
  canceled_at timestamptz,
  past_due_at timestamptz,
  last_rebill_status text,
  last_rebill_at timestamptz,
  last_rebill_payment_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_memberships_sku_check check (
    membership_sku in ('MBM-MEM-SEM-MEM-001', 'MBM-MEM-TIR-MEM-001')
  ),
  constraint customer_memberships_type_check check (
    membership_type in ('semaglutide', 'tirzepatide')
  ),
  constraint customer_memberships_status_check check (
    status in (
      'pending_payment',
      'active',
      'past_due',
      'paused',
      'cancel_scheduled',
      'canceled',
      'payment_issue'
    )
  ),
  constraint customer_memberships_currency_check check (currency = 'USD'),
  constraint customer_memberships_amount_positive check (monthly_amount_cents > 0)
);

comment on table public.customer_memberships is
  'MBM wellness membership enrollments backed by Tagada native recurring subscriptions. Browser return never activates.';

comment on column public.customer_memberships.tagada_subscription_id is
  'Authoritative Tagada subscription id. Unique when present.';

comment on column public.customer_memberships.minimum_term_ends_at is
  '3-month minimum commitment end (MBM-enforced). Tagada does not natively lock cancellation.';

-- One Tagada subscription cannot be inserted twice.
create unique index if not exists customer_memberships_tagada_subscription_uidx
  on public.customer_memberships (tagada_subscription_id)
  where tagada_subscription_id is not null;

-- At most one open enrollment per program per email (active / past_due / paused / cancel_scheduled / pending).
create unique index if not exists customer_memberships_open_email_sku_uidx
  on public.customer_memberships (lower(customer_email), membership_sku)
  where customer_email is not null
    and status in ('pending_payment', 'active', 'past_due', 'paused', 'cancel_scheduled', 'payment_issue');

create unique index if not exists customer_memberships_open_user_sku_uidx
  on public.customer_memberships (customer_user_id, membership_sku)
  where customer_user_id is not null
    and status in ('pending_payment', 'active', 'past_due', 'paused', 'cancel_scheduled', 'payment_issue');

create index if not exists customer_memberships_email_idx
  on public.customer_memberships (lower(customer_email))
  where customer_email is not null;

create index if not exists customer_memberships_status_idx
  on public.customer_memberships (status);

create index if not exists customer_memberships_enrollment_order_idx
  on public.customer_memberships (enrollment_order_id)
  where enrollment_order_id is not null;

-- Idempotent rebill / renewal order linkage (optional future use).
create table if not exists public.membership_rebill_events (
  id uuid primary key default gen_random_uuid(),
  customer_membership_id uuid not null references public.customer_memberships(id) on delete cascade,
  tagada_event_id text not null,
  tagada_payment_id text,
  event_type text not null,
  amount_cents integer,
  processing_result text,
  created_at timestamptz not null default now(),
  unique (tagada_event_id)
);

create unique index if not exists membership_rebill_events_payment_uidx
  on public.membership_rebill_events (tagada_payment_id)
  where tagada_payment_id is not null;

comment on table public.membership_rebill_events is
  'Idempotent Tagada rebill/payment linkage for membership renewals.';

alter table public.customer_memberships enable row level security;
alter table public.membership_rebill_events enable row level security;

-- Customers can read their own memberships; writes via service role (webhooks / Edge).
drop policy if exists customer_memberships_select_own on public.customer_memberships;
create policy customer_memberships_select_own
  on public.customer_memberships
  for select
  to authenticated
  using (
    customer_user_id = auth.uid()
    or lower(customer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

drop policy if exists membership_rebill_events_select_own on public.membership_rebill_events;
create policy membership_rebill_events_select_own
  on public.membership_rebill_events
  for select
  to authenticated
  using (
    exists (
      select 1 from public.customer_memberships cm
      where cm.id = membership_rebill_events.customer_membership_id
        and (
          cm.customer_user_id = auth.uid()
          or lower(cm.customer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        )
    )
  );
