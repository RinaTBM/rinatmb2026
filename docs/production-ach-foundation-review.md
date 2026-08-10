# Production ACH Foundation SQL — Review

**SQL file:** `docs/production-ach-foundation.sql`  
**Target project:** `dlmigmufqawlqtljqyny`  
**Approved frontend source:** `deploy/ach-launch-clean-2026` @ `812bb5a`  
**Status:** PREPARE ONLY — do not auto-execute from Cursor/CI.

## Scope

Minimum dependency chain only:

1. `public.set_updated_at()`
2. `public.admins` (`user_id` PK → `auth.users`, `email`, `is_active`, `created_at`, `updated_at`)
3. Active-admin `public.is_admin()`
4. Equivalent of `20260807220000_customer_orders.sql`
5. Equivalent of `20260810090000_manual_invoice_payments.sql`

Excluded by design: catalog tables, seed data, customer_profiles, Stripe schema/function changes, Plaid, admin inserts, bank secrets/values, `auth.users` mutation, any touch of `public.stripe_products`.

---

## OBJECTS CREATED

### FUNCTIONS CREATED
- `public.set_updated_at()` — `CREATE OR REPLACE`
- `public.is_admin()` — active-admin `SECURITY DEFINER` — `CREATE OR REPLACE`
- `public.generate_public_order_number()` — `CREATE OR REPLACE`

### TABLES CREATED
- `public.admins` (`CREATE TABLE IF NOT EXISTS` + additive column alters)
- `public.orders`
- `public.order_items`
- `public.order_fulfillment`
- `public.order_status_events`
- `public.order_admin_notes`

### SEQUENCE
- `public.order_number_seq` (`CREATE SEQUENCE IF NOT EXISTS`)

### EXTENSION
- `pgcrypto` (`CREATE EXTENSION IF NOT EXISTS`) — supports `gen_random_uuid()`

---

## RLS POLICIES

| Table | Policy | Who | Effect |
|---|---|---|---|
| `admins` | `admins_select` | authenticated | select if `is_admin()` |
| `orders` | `orders_select_own` | authenticated | select own (`customer_user_id = auth.uid()`) |
| `orders` | `orders_admin_all` | authenticated | all if `is_admin()` |
| `order_items` | `order_items_select_own` | authenticated | select via own order |
| `order_items` | `order_items_admin_all` | authenticated | all if `is_admin()` |
| `order_fulfillment` | `order_fulfillment_select_own` | authenticated | select via own order |
| `order_fulfillment` | `order_fulfillment_admin_all` | authenticated | all if `is_admin()` |
| `order_status_events` | `order_status_events_select_own_visible` | authenticated | select visible events on own order |
| `order_status_events` | `order_status_events_admin_all` | authenticated | all if `is_admin()` |
| `order_admin_notes` | `order_admin_notes_admin_all` | authenticated | all if `is_admin()` (no customer policy) |

RLS enabled on: `admins`, `orders`, `order_items`, `order_fulfillment`, `order_status_events`, `order_admin_notes`.

Customer insert/update/delete on orders is intentionally absent (service role / Edge Functions only).

---

## TRIGGERS
- `trg_admins_updated` on `public.admins` → `set_updated_at()`
- `trg_orders_updated` on `public.orders` → `set_updated_at()`
- `trg_order_fulfillment_updated` on `public.order_fulfillment` → `set_updated_at()`

---

## CONSTRAINTS
- `orders_order_status_check`
- `orders_payment_status_check` (final form includes `awaiting_payment`, `payment_under_review`, `paid`, `payment_failed`, `cancelled`, `refunded`, plus legacy `pending` / `failed` / `partially_refunded`)
- `orders_payment_method_check` (`null` | `manual_ach` | `manual_wire` | `plaid_ach`)
- Money non-negative checks on `orders` / `order_items`
- `order_fulfillment_status_check`, `order_fulfillment_carrier_check`
- `order_status_events_status_check`
- Unique: `orders.public_order_number`, `orders.stripe_checkout_session_id`, `order_fulfillment.order_id`

---

## INDEXES
- `orders_customer_user_id_idx`
- `orders_created_at_idx`
- `orders_order_status_idx`
- `orders_payment_status_idx`
- `orders_customer_email_idx`
- `order_items_order_id_idx`
- `order_fulfillment_status_idx`
- `order_status_events_order_id_idx`
- `order_admin_notes_order_id_idx`
- `orders_payment_access_token_uidx` (unique partial, non-null tokens)
- `orders_payment_method_idx`
- `orders_invoice_number_idx`

---

## DATA MODIFIED: NO
## DESTRUCTIVE ROW OPERATIONS: NO
## STRIPE_PRODUCTS TOUCHED: NO

Script contains no `DELETE`, `TRUNCATE`, `UPDATE` of rows, and no references to `stripe_products`.

Non-row structural replacements only:
- `DROP TRIGGER IF EXISTS` / recreate
- `DROP POLICY IF EXISTS` / recreate
- `DROP CONSTRAINT IF EXISTS orders_payment_status_check` / recreate (required to add ACH statuses)
- `CREATE OR REPLACE FUNCTION`

---

## EXPECTED RESULT AFTER RUNNING
- Orders foundation present (`orders`, `order_items`, `order_fulfillment`, `order_status_events`, `order_admin_notes`)
- Manual ACH payment schema present (columns + constraints + indexes)
- Active `is_admin()` + empty-capable `admins` table present
- **No admin row yet**
- **No bank secrets yet**
- **No ACH Edge Functions yet**
- Existing `public.stripe_products` unchanged

---

## LOCAL STATIC CHECKS (repository only)
- File present and non-empty
- Contains required objects/policies/constraints in source order
- Does not contain catalog/seed/admin-insert/bank-secret patterns
- Does not reference `stripe_products` for DDL
- Customer orders section precedes manual payment section

---

## KNOWN RISKS
1. `CREATE TABLE IF NOT EXISTS` will not reshape an unexpected pre-existing `orders`/`admins` table with incompatible columns (production currently has no `orders` / `admins` via PostgREST).
2. Replacing `orders_payment_status_check` would fail if incompatible `payment_status` rows already existed (not applicable on greenfield orders table).
3. Admin checkout confirmation remains non-functional until an active `admins` row is inserted and ACH Edge Functions + `MANUAL_*` secrets are deployed (intentional; out of scope for this SQL).
4. Owner must paste into the **production** project SQL editor (`dlmigmufqawlqtljqyny`), not staging.
