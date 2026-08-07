# Customer Account Phase 2 — Migration Plan

**Status:** PENDING — do not apply from Cursor. Review and apply through Bolt/Supabase after explicit approval.

**Migration file:** `supabase/migrations/20260807220000_customer_orders.sql`

**Additive:** Yes  
**Existing data modified:** No deletes/truncates. No catalog, membership pricing, admin auth, or Stripe live changes.

---

## Existing tables reused

| Table / function | Use |
| --- | --- |
| `auth.users` | FK for `orders.customer_user_id` |
| `public.is_admin()` | Admin RLS gate (unchanged) |
| `public.set_updated_at()` | `updated_at` triggers |
| `processed_stripe_events` | Webhook idempotency (existing; unchanged schema) |
| `customer_profiles` | Not altered; optional join for display name/email |

---

## New tables

### `orders`
`id`, `customer_user_id`, `customer_email`, `customer_name`, `public_order_number` (unique), `stripe_checkout_session_id` (unique), `stripe_payment_intent_id`, `stripe_customer_id`, `order_status`, `payment_status`, money columns (`subtotal_cents`, `discount_cents`, `shipping_cents`, `tax_cents`, `total_cents`), `shipping_method`, `free_shipping_eligible`, `currency`, `requires_provider_review`, timestamps.

### `order_items`
Snapshot line items: `product_id`, `product_name_snapshot`, `variant_snapshot`, `quantity`, `unit_price_cents`, `discount_cents`, `line_total_cents`.

### `order_fulfillment`
One row per order: `fulfillment_status`, `pharmacy_name`, `carrier`, `tracking_number`, `tracking_url`, `processing_started_at`, `shipped_at`, `delivered_at`.

### `order_status_events`
Timeline / email-ready events: `status`, `customer_visible`, `note`, `event_at`, `created_by`.

### `order_admin_notes`
Internal notes only (admin RLS; never customer-readable).

---

## New columns

None on existing tables.

---

## Functions / triggers / sequences

| Object | Purpose |
| --- | --- |
| `order_number_seq` | Sequence for public order numbers |
| `generate_public_order_number()` | Returns `MBM-YYYY-######` |
| `trg_orders_updated` | `set_updated_at` |
| `trg_order_fulfillment_updated` | `set_updated_at` |

---

## Indexes / foreign keys

- Indexes on `customer_user_id`, `created_at`, statuses, emails, `order_id` FKs
- FKs: `orders.customer_user_id → auth.users`, children → `orders(id)` ON DELETE CASCADE

---

## RLS policies

| Table | Customer | Admin |
| --- | --- | --- |
| `orders` | SELECT own (`customer_user_id = auth.uid()`) | ALL via `is_admin()` |
| `order_items` | SELECT own (join orders) | ALL via `is_admin()` |
| `order_fulfillment` | SELECT own | ALL via `is_admin()` |
| `order_status_events` | SELECT own **and** `customer_visible = true` | ALL via `is_admin()` |
| `order_admin_notes` | **none** | ALL via `is_admin()` |

Customers cannot insert/update/delete orders, fulfillment, or tracking. Service role (webhook) bypasses RLS for inserts.

---

## Existing data impact

- No rows deleted
- No product/customer/Stripe catalog rows modified
- Historical checkout sessions before this migration will not backfill automatically

---

## Rollback considerations

- Drop policies, then tables (`order_admin_notes`, `order_status_events`, `order_fulfillment`, `order_items`, `orders`), function, sequence
- Prefer soft disable over drop in production
- Do **not** run `reset` / truncate against production

---

## Verification

See `docs/customer-account-phase2-verification.sql`.
