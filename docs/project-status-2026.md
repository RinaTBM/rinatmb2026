# My Bare Method — Project Status (2026 Launch Path)

## PHASE 1 — Catalog & Database Foundation
**COMPLETE**

## PHASE 2 — Catalog, Pricing & Memberships
**COMPLETE**

- Semaglutide membership: **$125/month** base (Two-Day $155 / Next-Day $175)
- Tirzepatide membership: **$179/month** base (Two-Day $209 / Next-Day $229)
- Auto-Refill 10%, Active Wellness Member 15%, accessory member 15% (non-stacking)
- Shipping: Two-Day **$30**, Next-Day **$50** (no Standard)
- Memberships excluded from $500 merchandise free-shipping threshold

## PHASE 3A — Checkout Architecture / Manual ACH Launch
**IN PROGRESS**

### Current payment method
- **Primary:** Electronic Invoice + Manual ACH / Bank Transfer
- **Secondary:** Domestic Wire Transfer
- Customer initiates transfer from their own bank
- Orders created as `awaiting_payment` (never auto-marked paid)
- Admin marks payment received after funds are verified

### Plaid Transfer
- Production approval **pending**
- Sandbox available
- `plaid_ach` is architected as a future payment method but **disabled**
- Do **not** integrate live Plaid ACH yet

### Stripe
- **Retired / unavailable** (merchant account closed)
- Storefront must not call `create-checkout-session`
- Legacy Edge Functions / scripts / columns retained for history only
- See `docs/stripe-legacy-inventory.md`

### Kashu / Airwallex
- **Not required** for temporary launch

## PHASE 3B — Plaid Transfer
**PENDING PRODUCTION APPROVAL**

## PHASE 4 — Production / Go Live
**PENDING** final QA

---

## Security notes (payments)

- Never put bank account/routing/wire details in `VITE_*` variables or frontend source
- Configure banking instructions as **Supabase Edge Function secrets** only:
  - `MANUAL_ACH_BANK_NAME`, `MANUAL_ACH_ACCOUNT_NAME`, `MANUAL_ACH_ROUTING_NUMBER`, `MANUAL_ACH_ACCOUNT_NUMBER`
  - `MANUAL_WIRE_BANK_NAME`, `MANUAL_WIRE_ROUTING_NUMBER`, `MANUAL_WIRE_ACCOUNT_NUMBER`, optional `MANUAL_WIRE_SWIFT`, `MANUAL_WIRE_ACCOUNT_NAME`
- Payment instructions are available only after order creation (`/order/payment/:orderNumber?token=...`)

## Pending migrations (do not apply without approval)

- `supabase/migrations/20260807220000_customer_orders.sql` (orders foundation)
- `supabase/migrations/20260810090000_manual_invoice_payments.sql` (manual payment columns/statuses)

## Edge Functions for manual checkout

- `create-invoice-order` — submit order + invoice
- `get-payment-instructions` — token-gated bank instructions
- `mark-payment-received` — admin mark paid

Do **not** deploy Stripe Edge Functions for launch.
