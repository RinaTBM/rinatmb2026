-- WHOP-2A: expand gen_checkout_sessions statuses for reconciliation foundation.
-- Additive. Safe on staging/production. Does not enable cutover.

alter table public.gen_checkout_sessions drop constraint if exists gen_checkout_sessions_status_chk;
alter table public.gen_checkout_sessions
  add constraint gen_checkout_sessions_status_chk check (
    status in (
      'created',
      'redirect_issued',
      'pending',
      'processing',
      'succeeded',
      'paid',
      'failed',
      'expired',
      'cancelled',
      'unknown'
    )
  );

comment on column public.gen_checkout_sessions.status is
  'created|redirect_issued|pending|processing|succeeded|paid|failed|expired|cancelled|unknown. paid/succeeded only from server reconcile — never browser return.';
