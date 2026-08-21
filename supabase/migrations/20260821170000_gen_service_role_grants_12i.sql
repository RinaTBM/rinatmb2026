-- Phase 12I — GEN table privileges for service_role / authenticated (staging verified gap).
-- Without these grants, Edge functions using service_role cannot read gen_sku_map /
-- customer_profiles.gen_patient_id and handoff/sync fail closed.
-- Safe / additive. Apply to production at cutover BEFORE enabling GEN handoff.

grant select, insert, update, delete on public.gen_sku_map to service_role;
grant select on public.gen_sku_map to authenticated;

grant select, insert, update, delete on public.order_gen_orders to service_role;
grant select on public.order_gen_orders to authenticated;

grant select, insert, update, delete on public.gen_sync_events to service_role;
grant select on public.gen_sync_events to authenticated;

grant select, insert, update, delete on public.gen_webhook_events to service_role;
grant select on public.gen_webhook_events to authenticated;

grant select, insert, update, delete on public.customer_profiles to service_role;
grant select, update on public.customer_profiles to authenticated;

grant select, insert, update, delete on public.orders to service_role;
grant select, insert, update, delete on public.order_items to service_role;
