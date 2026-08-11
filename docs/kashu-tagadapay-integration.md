# Kashu / TagadaPay Card Payments — Integration Plan (Phase 1)

**Status:** Local implementation only. **Do not deploy** frontend, Edge Functions, or migrations until owner review + sandbox credentials + Tagada product sync.

**Live site:** https://mybaremethod.com  
**Live backend:** Supabase `bsgtuuzwgeetsjjdrtrm`  
**Kashu CRM:** https://crm.kashupay.com (TagadaPay family — official developer docs at https://docs.tagada.io/)

ACH (`manual_ach`) and Wire (`manual_wire`) remain unchanged and selectable.

---

## Official Tagada facts (do not invent)

| Item | Official value |
|---|---|
| Auth | `Authorization: Bearer <api-key>` |
| API base (prod) | `https://api.tagada.io/` |
| API base (sandbox) | `https://api.tagada.dev/` |
| Node SDK | `@tagadapay/node-sdk` (`new Tagada('your-api-key')`) |
| Checkout create | `tagada.checkout.createSession({ storeId, items:[{variantId,quantity}], currency, checkoutUrl, returnUrl?, customer* })` → `{ redirectUrl, checkoutToken }` |
| Public init equivalent | `GET /api/public/v1/checkout/init?...` (docs: initialize-checkout-session) |
| Webhook signature header | `X-TagadaPay-Signature: sha256=<hex>` |
| Webhook algorithm | HMAC-SHA256(secret, **raw body**), hex digest |
| Webhook create | `POST /api/public/v1/webhooks` with `storeId`, `url`, `eventTypes` → returns `secret` |
| Paid event types (slash) | `order/paid`, `payment/succeeded` (also failed/refunded variants — see docs) |
| Environments | CRM prod `crm.tagadapay.com` · sandbox `crm.tagadapay.dev` · Kashu CRM URL provided separately |

Sources: https://docs.tagada.io/ · checkout-sessions · webhooks-events · OpenAPI servers on docs pages.

---

## Required secret **names** (Edge / Supabase secrets only — never `VITE_*`)

| Secret name | Purpose |
|---|---|
| `TAGADA_API_KEY` | Bearer API key (product sync, optional order retrieve, webhook mgmt) |
| `TAGADA_STORE_ID` | Official `storeId` for checkout sessions |
| `TAGADA_CHECKOUT_URL` | Hosted checkout / funnel URL (likely `https://checkout.mybaremethod.com/...`) |
| `TAGADA_WEBHOOK_SECRET` | Per-endpoint signing secret returned by webhook create |
| `TAGADA_API_BASE` | Optional override (`https://api.tagada.io` or `https://api.tagada.dev`) |
| `TAGADA_ENV` | Optional `sandbox` / `production` helper |
| `MBM_SITE_ORIGIN` | Return URL origin (default `https://mybaremethod.com`) |

Frontend flag only (not a secret): `VITE_KASHU_CARD_ENABLED=true` to show the card radio.

Obtain keys/store/checkout URL from Kashu CRM / Tagada dashboard. **Do not commit values.**

---

## Product sync / SKU mapping

**PRODUCT SYNC REQUIRED: YES**

Official `createSession` requires Tagada `variantId`s (not MBM amounts). Tagada products/variants must exist first.

| MBM field | Role |
|---|---|
| MBM parent product id (`p73`, …) | Internal only — not replaced |
| MBM variant id (`semaglutide-v1`, …) | Stored on `order_items.variant_id` |
| **SKU** (`MBM-WM-SEM-INJ-001`, …) | Stable external commerce key → `kashu_sku_map.mbm_sku` |
| Tagada product id | `kashu_sku_map.tagada_product_id` |
| Tagada variant id | `kashu_sku_map.tagada_variant_id` (required for checkout items) |

Table: `public.kashu_sku_map` (migration `20260811210000_kashu_card_payments.sql`).

**Do not create Tagada products in this phase** until an approved sync step. Without map rows, `create-kashu-checkout-session` returns `409` with `missingSkus`.

**Amount risk:** Tagada charges Tagada catalog prices. Webhook marks `paid` only when extracted paid cents **equal** MBM `orders.total_cents`. Mismatch → `payment_under_review` (fulfillment stays locked). Shipping/tax/discount parity with Tagada catalog is an open ops requirement.

---

## Payment method

- Enum value: `kashu_card`
- UI label: **Credit / Debit Card**
- Help: **Processed securely by Kashu**
- ACH / Wire labels unchanged
- Stripe remains disabled (`isStripeCheckoutEnabled() === false`)

---

## Safe card flow

1. Customer submits checkout with `kashu_card`
2. `create-invoice-order` persists order (`awaiting_payment`, SKUs on `order_items`, public order number)
3. Frontend calls `create-kashu-checkout-session` with order number + payment access token
4. Edge Function maps SKUs → Tagada variants, builds official checkout init URL, returns `redirectUrl`
5. Browser redirects to hosted Kashu/Tagada checkout
6. Customer returns to `/order/card-result/:orderNumber?token=...` (**does not mark paid**)
7. `tagada-webhook` verifies signature, idempotently applies status, amount-checks, sets `paid` + fulfillment unlock

---

## Database (additive, not applied)

File: `supabase/migrations/20260811210000_kashu_card_payments.sql`

- Extend `orders.payment_method` check with `kashu_card`
- Add `payment_processor`, `external_payment_id`, `external_checkout_session_id`, `external_order_id`, `external_checkout_token`
- Add `payment_webhook_events` (idempotent `processor + event_id`)
- Add `kashu_sku_map`

---

## Edge Functions (not deployed)

| Function | Role |
|---|---|
| `create-kashu-checkout-session` | Server-side Tagada checkout init for persisted order |
| `tagada-webhook` | Signature verify + mark paid / failed / refunded |

---

## Memberships / recurring

Official Tagada docs include subscription APIs and webhook events (`subscription/*`, `rebill*`).

**Phase 1:** one-time card only. **Do not enable automatic recurring billing.**  
Manual membership invoice + ACH/Wire remains valid. Recurring card = Phase 2 after account capability confirmation.

---

## DNS / hosted checkout (report only — do not modify DNS)

| Domain | Likely role |
|---|---|
| `https://checkout.mybaremethod.com` | Primary hosted checkout domain (CNAME → Vercel DNS target provided by Kashu) — set as `TAGADA_CHECKOUT_URL` / funnel checkout URL once confirmed in CRM |
| `TBMGroup.site` | Merchant/domain verification or Kashu infra (A → `216.150.1.1`) — **confirm in Kashu CRM / Tagada Domains UI**; docs list a Domains API for custom checkout/funnel domains |

---

## Missing information from Kashu (blockers before production)

1. Exact API key + store id from `crm.kashupay.com`
2. Exact hosted `checkoutUrl` / funnel URL for `checkout.mybaremethod.com`
3. Webhook signing secret (create endpoint after Edge deploy)
4. Official webhook **payload JSON field names** for amount + order reference (implementation uses best-effort extractors + `customerTags: mbmOrder:<ORDER>`)
5. Whether Tagada catalog prices can include MBM shipping/tax/discount lines
6. Confirmation that this Kashu account supports card only vs subscriptions for Phase 2
7. Role of `TBMGroup.site` in the dashboard (verification vs checkout)

---

## Local code map

- `src/lib/payments/kashuTagada.ts` + `.test.ts`
- `src/lib/payments/paymentMethods.ts`
- `src/lib/payments/createKashuCheckoutSession.ts`
- `src/pages/CheckoutPage.tsx` / `KashuCardResultPage.tsx`
- `supabase/functions/create-kashu-checkout-session/`
- `supabase/functions/tagada-webhook/`
- `supabase/functions/create-invoice-order/` (accepts `kashu_card`)
- Migration above

---

## Deploy checklist (future — not now)

1. Apply migration on BSG  
2. Populate `kashu_sku_map` after Tagada product create/sync  
3. Set Edge secrets  
4. Deploy Edge Functions  
5. Register webhook URL → store `TAGADA_WEBHOOK_SECRET`  
6. Enable `VITE_KASHU_CARD_ENABLED=true` on frontend build  
7. Sandbox end-to-end test before production traffic  
