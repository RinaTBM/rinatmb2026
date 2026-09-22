begin;
create table public.care_reminder_gen_events (client_id text not null, event_id text not null, event_type text not null check (event_type in ('form.started','form.submitted','continuation.completed','order.created','order.payment_succeeded','order.status_updated')), patient_id text not null, order_id text, continuation_session_id text, occurred_at timestamptz not null, received_at timestamptz not null default now(), processing_status text not null default 'pending' check (processing_status in ('pending','processed','unmatched','failed')), primary key (client_id,event_id), check (order_id is not null or continuation_session_id is not null));
alter table public.care_reminder_gen_events enable row level security;
revoke all on public.care_reminder_gen_events from public, anon, authenticated;
grant select, insert, update on public.care_reminder_gen_events to service_role;
create index care_reminder_gen_pending_idx on public.care_reminder_gen_events (received_at) where processing_status = 'pending';
commit;