-- Customer Account Phase 2 — verification queries
-- Run in Bolt/Supabase SQL editor AFTER applying the pending migration.
-- Read-only checks preferred. Do not truncate/drop production data.

-- 1) Required tables/columns exist
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('orders', 'order_items', 'order_fulfillment', 'order_status_events', 'order_admin_notes')
order by table_name;

select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'orders'
order by ordinal_position;

-- 2) RLS enabled
select relname, relrowsecurity
from pg_class
where relname in ('orders', 'order_items', 'order_fulfillment', 'order_status_events', 'order_admin_notes');

-- 3) Policies present
select tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('orders', 'order_items', 'order_fulfillment', 'order_status_events', 'order_admin_notes')
order by tablename, policyname;

-- 4) Public order number helper
select public.generate_public_order_number() as sample_order_number;

-- 5) Existing catalog / customer / stripe rows preserved (counts should be unchanged vs pre-migration snapshot)
select 'catalog_products' as entity, count(*) from public.catalog_products
union all
select 'customer_profiles', count(*) from public.customer_profiles
union all
select 'stripe_products', count(*) from public.stripe_products
union all
select 'admins', count(*) from public.admins;

-- 6) Manual RLS smoke (run as two distinct authenticated users in the SQL editor / client):
--    User A: select * from orders;  -- only A's rows
--    User A: select * from orders where customer_user_id = '<user-b-id>'; -- zero rows
--    User A: update order_fulfillment set tracking_number = 'x'; -- should fail
--    Admin: select * from order_admin_notes; -- allowed
--    Customer: select * from order_admin_notes; -- zero / denied

-- 7) No medical columns on order tables
select table_name, column_name
from information_schema.columns
where table_schema = 'public'
  and table_name like 'order%'
  and column_name in (
    'diagnosis', 'medical_history', 'clinical_notes', 'provider_notes',
    'lab_results', 'prescription_instructions', 'symptoms'
  );
-- Expect: zero rows
