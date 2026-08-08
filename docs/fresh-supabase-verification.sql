-- =============================================================================
-- Fresh Supabase verification — My Bare Method pre-launch source
-- Branch: production-source/my-bare-method-prelaunch-final-2026
-- Commit: 0bd65f6
-- Tag:    my-bare-method-prelaunch-final-v1
--
-- Run in Supabase SQL editor AFTER applying migrations 1–9 in order.
-- READ-ONLY preferred. Do not truncate/drop production data from this script.
-- Do not apply migrations from Cursor. Do not touch Stripe from this script.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) Required tables exist
-- ---------------------------------------------------------------------------
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'stripe_products',
    'admins',
    'catalog_products',
    'catalog_variants',
    'catalog_memberships',
    'stripe_sync_log',
    'admin_audit_log',
    'processed_stripe_events',
    'store_purchase_settings',
    'cancellation_requests',
    'purchase_reporting_snapshots',
    'customer_profiles',
    'orders',
    'order_items',
    'order_fulfillment',
    'order_status_events',
    'order_admin_notes'
  )
order by table_name;
-- Expect: 17 rows

-- ---------------------------------------------------------------------------
-- 2) Required functions exist
-- ---------------------------------------------------------------------------
select p.proname as function_name
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('is_admin', 'set_updated_at', 'generate_public_order_number')
order by p.proname;
-- Expect: is_admin, generate_public_order_number, set_updated_at

-- ---------------------------------------------------------------------------
-- 3) is_admin() requires an ACTIVE admin (source body check)
-- ---------------------------------------------------------------------------
select pg_get_functiondef('public.is_admin()'::regprocedure) as is_admin_definition;
-- Expect definition contains: is_active = true
-- Expect definition is SECURITY DEFINER / search_path = public

select
  case
    when pg_get_functiondef('public.is_admin()'::regprocedure) ilike '%is_active = true%'
      then 'PASS: is_admin() requires active admin'
    else 'FAIL: is_admin() missing is_active = true gate'
  end as is_admin_active_check;

-- ---------------------------------------------------------------------------
-- 4) RLS enabled where required
-- ---------------------------------------------------------------------------
select c.relname as table_name, c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and c.relname in (
    'stripe_products',
    'admins',
    'catalog_products',
    'catalog_variants',
    'catalog_memberships',
    'stripe_sync_log',
    'admin_audit_log',
    'processed_stripe_events',
    'store_purchase_settings',
    'cancellation_requests',
    'purchase_reporting_snapshots',
    'customer_profiles',
    'orders',
    'order_items',
    'order_fulfillment',
    'order_status_events',
    'order_admin_notes'
  )
order by c.relname;
-- Expect: rls_enabled = true for every row

-- ---------------------------------------------------------------------------
-- 5) customer_profiles exists with expected columns
-- ---------------------------------------------------------------------------
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'customer_profiles'
order by ordinal_position;
-- Expect columns include: id, user_id, first_name, last_name, email, phone, created_at, updated_at

-- ---------------------------------------------------------------------------
-- 6) Orders / order_items / fulfillment / events / admin notes exist + key cols
-- ---------------------------------------------------------------------------
select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in (
    'orders',
    'order_items',
    'order_fulfillment',
    'order_status_events',
    'order_admin_notes'
  )
order by table_name, ordinal_position;

-- Spot-check critical order columns
select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'orders'
  and column_name in (
    'customer_user_id',
    'public_order_number',
    'stripe_checkout_session_id',
    'order_status',
    'payment_status',
    'shipping_method',
    'free_shipping_eligible',
    'requires_provider_review'
  )
order by column_name;
-- Expect: 8 rows

-- ---------------------------------------------------------------------------
-- 7) Admin authorization objects exist
-- ---------------------------------------------------------------------------
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'admins'
order by ordinal_position;
-- Expect: user_id, email, created_at, is_active, updated_at

select policyname, cmd, roles
from pg_policies
where schemaname = 'public'
  and tablename = 'admins'
order by policyname;
-- Expect: admins_select (SELECT)

-- ---------------------------------------------------------------------------
-- 8) Key RLS policies present (customer isolation + admin gates)
-- ---------------------------------------------------------------------------
select tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
  and (
    (tablename = 'customer_profiles' and policyname in (
      'customer_profiles_select_own',
      'customer_profiles_insert_own',
      'customer_profiles_update_own',
      'customer_profiles_admin_select'
    ))
    or (tablename = 'orders' and policyname in (
      'orders_select_own',
      'orders_admin_all'
    ))
    or (tablename = 'order_items' and policyname in (
      'order_items_select_own',
      'order_items_admin_all'
    ))
    or (tablename = 'order_fulfillment' and policyname in (
      'order_fulfillment_select_own',
      'order_fulfillment_admin_all'
    ))
    or (tablename = 'order_status_events' and policyname in (
      'order_status_events_select_own_visible',
      'order_status_events_admin_all'
    ))
    or (tablename = 'order_admin_notes' and policyname in (
      'order_admin_notes_admin_all'
    ))
    or (tablename = 'stripe_products' and policyname in (
      'anon_read_stripe_products'
    ))
  )
order by tablename, policyname;

-- Confirm stripe_products has NO client write policies
select policyname, cmd
from pg_policies
where schemaname = 'public'
  and tablename = 'stripe_products'
  and cmd in ('INSERT', 'UPDATE', 'DELETE');
-- Expect: zero rows

-- Confirm order_admin_notes has no customer-facing SELECT policy name pattern
select policyname, cmd
from pg_policies
where schemaname = 'public'
  and tablename = 'order_admin_notes'
  and policyname ilike '%own%';
-- Expect: zero rows (admin-only)

-- ---------------------------------------------------------------------------
-- 9) Customers cannot read other customers' records (manual RLS smoke)
-- ---------------------------------------------------------------------------
-- These checks require two authenticated sessions (User A / User B) or the
-- Supabase SQL role impersonation workflow. Run manually after creating two
-- customer accounts and (optionally) one order owned by User B via webhook.
--
-- As authenticated User A:
--   select * from public.customer_profiles;
--     -- only User A's profile
--   select * from public.customer_profiles where user_id = '<user-b-uuid>';
--     -- zero rows
--   select * from public.orders;
--     -- only rows where customer_user_id = auth.uid()
--   select * from public.orders where customer_user_id = '<user-b-uuid>';
--     -- zero rows
--   select * from public.order_items;
--     -- only items for User A's orders
--   select * from public.order_fulfillment;
--     -- only fulfillment for User A's orders
--   select * from public.order_status_events;
--     -- only customer_visible events for User A's orders
--   select * from public.order_admin_notes;
--     -- zero rows / denied for non-admin
--   update public.order_fulfillment set tracking_number = 'x';
--     -- should fail for customer
--
-- As active admin:
--   select * from public.customer_profiles;           -- allowed (support read)
--   select * from public.orders;                      -- allowed
--   select * from public.order_admin_notes;           -- allowed
--
-- As revoked admin (is_active = false):
--   select public.is_admin();                         -- false
--   admin catalog/order writes should be denied by RLS

-- Machine-checkable policy predicates for own-row isolation:
select tablename, policyname, qual
from pg_policies
where schemaname = 'public'
  and policyname in (
    'customer_profiles_select_own',
    'orders_select_own',
    'order_items_select_own',
    'order_fulfillment_select_own',
    'order_status_events_select_own_visible'
  )
order by tablename;
-- Expect quals to reference auth.uid() / customer_user_id = auth.uid()
-- and order_status_events policy to require customer_visible = true

select
  case
    when exists (
      select 1 from pg_policies
      where schemaname = 'public'
        and policyname = 'customer_profiles_select_own'
        and qual ilike '%auth.uid()%'
    )
    and exists (
      select 1 from pg_policies
      where schemaname = 'public'
        and policyname = 'orders_select_own'
        and qual ilike '%auth.uid()%'
    )
      then 'PASS: customer own-row policies reference auth.uid()'
    else 'FAIL: missing own-row auth.uid() predicates'
  end as customer_isolation_policy_check;

-- ---------------------------------------------------------------------------
-- 10) Purchase settings defaults + catalog eligibility columns
-- ---------------------------------------------------------------------------
select id, member_discount_percent, auto_refill_discount_percent
from public.store_purchase_settings
where id = 'default';
-- Expect: 15 / 10

select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'catalog_products'
  and column_name in (
    'auto_refill_eligible',
    'member_pricing_eligible',
    'excluded_from_discounts'
  )
order by column_name;
-- Expect: 3 rows

-- ---------------------------------------------------------------------------
-- 11) Seed presence (catalog) — not Stripe IDs
-- ---------------------------------------------------------------------------
select 'catalog_products' as entity, count(*)::int as n from public.catalog_products
union all
select 'catalog_variants', count(*)::int from public.catalog_variants
union all
select 'catalog_memberships', count(*)::int from public.catalog_memberships
union all
select 'admins', count(*)::int from public.admins
union all
select 'customer_profiles', count(*)::int from public.customer_profiles
union all
select 'orders', count(*)::int from public.orders
union all
select 'stripe_products', count(*)::int from public.stripe_products;
-- Fresh project expectations after migrations only:
--   catalog_* counts > 0 (from seed migration)
--   admins = 0 until first-admin bootstrap
--   customer_profiles / orders / stripe_products may be 0 until app/auth/sync/webhook

select slug, app_product_id, monthly_price_cents, is_visible, status
from public.catalog_memberships
where slug in ('semaglutide-membership', 'tirzepatide-membership')
order by slug;
-- Expect: m1 / 19900 and m2 / 24900

-- ---------------------------------------------------------------------------
-- 12) Public order number helper smoke
-- ---------------------------------------------------------------------------
select public.generate_public_order_number() as sample_order_number;
-- Expect: MBM-YYYY-000001 style value (sequence advances)

-- ---------------------------------------------------------------------------
-- 13) No medical columns on customer/order tables
-- ---------------------------------------------------------------------------
select table_name, column_name
from information_schema.columns
where table_schema = 'public'
  and table_name in (
    'customer_profiles',
    'orders',
    'order_items',
    'order_fulfillment',
    'order_status_events',
    'order_admin_notes'
  )
  and column_name in (
    'diagnosis',
    'medical_history',
    'clinical_notes',
    'provider_notes',
    'lab_results',
    'prescription_instructions',
    'symptoms'
  );
-- Expect: zero rows

-- ---------------------------------------------------------------------------
-- 14) Sequence for order numbers exists
-- ---------------------------------------------------------------------------
select sequencename
from pg_sequences
where schemaname = 'public'
  and sequencename = 'order_number_seq';
-- Expect: 1 row
