-- Phase 12H — additive GEN clinical sync columns (staging-safe).
-- Prescription / pharmacy fields are operational identifiers only — no PHI bodies.
-- Do NOT apply to production without explicit approval.

alter table public.order_gen_orders
  add column if not exists gen_prescription_id text,
  add column if not exists prescription_status text,
  add column if not exists last_prescription_sync_at timestamptz,
  add column if not exists pharmacy_status text,
  add column if not exists tracking_number text;

comment on column public.order_gen_orders.gen_prescription_id is
  'Safe GEN prescription id when exposed by GET order/prescriptions — no clinical body.';
comment on column public.order_gen_orders.prescription_status is
  'GEN prescription status string when exposed — operational only.';
comment on column public.order_gen_orders.pharmacy_status is
  'Normalized pharmacy/shipment status: PHARMACY_PENDING | PHARMACY_PROCESSING | SHIPPED | DELIVERED | UNKNOWN.';
comment on column public.order_gen_orders.tracking_number is
  'Carrier tracking only when GEN explicitly provides it — never invented.';

-- Allow admin refresh / status sync operations in gen_sync_events.
alter table public.gen_sync_events drop constraint if exists gen_sync_events_operation_chk;
alter table public.gen_sync_events add constraint gen_sync_events_operation_chk check (
  operation in (
    'handoff',
    'create_patient',
    'create_order',
    'get_order',
    'webhook_sync',
    'admin_retry',
    'admin_refresh'
  )
);
