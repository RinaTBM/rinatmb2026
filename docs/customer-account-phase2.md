# Customer Account Portal — Phase 2 (Orders & Tracking)

**Branch:** `source-of-truth/customer-account-phase2-2026`  
**Tag:** `customer-account-phase2-v1`  
**Rollback (deploy):** `deploy-pre-account-phase2-v1`  
**Do not deploy / merge to main / apply migrations / run live Stripe sync from Cursor.**

---

## Architecture

- Orders are persisted in Bolt Database (Supabase) from Stripe webhook events (service role).
- Customers read own orders via Supabase Auth + RLS (`customer_user_id = auth.uid()`).
- Admins manage fulfillment via existing Google + `is_admin()` gate at `/admin/orders`.
- Product/price/variant snapshots are stored on `order_items` so catalog changes do not rewrite history.
- Phase 1 auth/profile remains unchanged.

---

## Customer routes

| Path | Purpose |
| --- | --- |
| `/account/orders` | Order history |
| `/account/orders/:orderId` | Order detail, timeline, tracking |
| Phase 1 routes | Preserved (`/account`, `/profile`, login/signup/callback/reset) |

Account Overview **Orders** card is functional (Recent Orders + View Orders).

---

## Order / payment / fulfillment statuses

**Order / fulfillment (customer-friendly):**  
Order Received → Payment Confirmed → (optional Provider Review In Progress) → Processing → Preparing for Shipment → Shipped → Delivered  
Also: Action Required, Canceled, Refunded  

**Not in Phase 2:** Prescription Approved / Denied.

**Payment:** Pending, Paid, Failed, Refunded, Partially Refunded — derived from Stripe/webhook, not editable by customers.

---

## Tracking

Admin-entered:

- Carrier: UPS, FedEx, USPS, Other  
- Tracking number  
- Trusted URL constructed for UPS/FedEx/USPS  
- Other requires validated HTTPS URL  
- `shipped_at` / `delivered_at`

Track Package opens in a new tab (`rel="noopener noreferrer"`).

---

## Ageless Pharma Rx

Manual fulfillment workflow for provider-directed orders:

1. Order created (webhook) with `requires_provider_review` when checkout flagged provider care.
2. Fulfillment may show pharmacy name **Ageless Pharma Rx**.
3. Customer copy: “Provider-approved prescriptions are fulfilled through Ageless Pharma Rx.”
4. Admin enters tracking after the pharmacy ships.

**No pharmacy API in Phase 2.** Phase 2.5: verified Ageless Pharma Rx API integration when available.

Accessories are not implied to ship from Ageless Pharma Rx.

---

## Stripe webhook

File: `supabase/functions/stripe-webhook/index.ts`

- Signature verified (unchanged).
- Idempotent via `processed_stripe_events`.
- `checkout.session.completed` → create order + items + fulfillment + status events if `stripe_checkout_session_id` not already present.
- Refund events update payment/order status when payment intent matches.
- Does not change live Stripe configuration.
- Checkout session metadata may include `customer_user_id`, shipping/tax snapshots, compact `item_snapshots`.

`create-checkout-session` accepts optional customer/shipping snapshot fields for metadata (TEST mode only).

---

## Admin workflow

`/admin/orders` (protected):

- List: order number, customer, date, total, payment/fulfillment, shipping, action required  
- Detail: customer, payment, items, shipping, fulfillment actions, tracking, status history, **internal notes**  
- Actions: Start Processing, Preparing for Shipment, Add Tracking / Mark Shipped, Delivered, Canceled  
- Cannot casually change charge amount, dose, provider decision, or Stripe transaction

---

## RLS / security summary

- Customers: read own orders/items/fulfillment/customer-visible events only  
- Customers: cannot update fulfillment/tracking/payment  
- Admin notes: admin-only  
- No service-role key in the browser  

---

## Privacy

Phase 2 is operational only. Do not store/display medical histories, diagnoses, labs, clinical notes, provider reasoning, or prescription instructions. Product names on orders are visible to the owning customer and authorized admins — flag for compliance review before broader health-data features.

---

## Email readiness

`order_status_events` (+ helpers in `src/lib/orders/webhookOrder.ts`) are extension points for later:

- order received / processing / shipped / delivered / action required  

Do not send duplicate messages if Stripe/pharmacy/Bolt already sends them.

---

## Processing / shipping copy

Processing policy:

> Most eligible orders are processed within 1–3 business days after required review and approval. Shipping transit time begins after processing is complete.

Approved shipping options for order records: Two-Day $30, Next-Day $50, free at $500+. Legacy $6.95 / $75 must not be used as the approved order-policy constants.

---

## Manual Bolt / Supabase setup

1. Apply `20260807220000_customer_orders.sql` after review.  
2. Redeploy edge functions: `stripe-webhook`, `create-checkout-session`.  
3. Confirm webhook endpoint still uses TEST secret; do not switch to live.  
4. Verify RLS with two customer users + one admin (see verification SQL).  
5. Place a TEST checkout while signed in → confirm order appears under `/account/orders`.  
6. Admin: add tracking → customer sees Track Package.

---

## Tests / commands

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

See also: `docs/customer-account-phase2-migration-plan.md`, `docs/customer-account-phase2-verification.sql`.
