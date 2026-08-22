-- WHOP-2A: grants so Edge service_role can read/write GEN/Whop tables.
-- RLS still applies to authenticated; service_role bypasses RLS but needs GRANT.

grant select, insert, update, delete on table public.gen_whop_checkout_map to service_role;
grant select, insert, update, delete on table public.gen_checkout_sessions to service_role;
grant select on table public.gen_whop_checkout_map to authenticated;
grant select on table public.gen_checkout_sessions to authenticated;
