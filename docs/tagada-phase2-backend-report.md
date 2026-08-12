# Kashu / Tagada Phase 2 — Backend Report

**Date:** 2026-08-11  
**Target:** BSG `bsgtuuzwgeetsjjdrtrm`  
**Branch:** `cursor/kashu-phase2-webhook-backend-945c`

## DATABASE MIGRATION

| Field | Value |
|-------|-------|
| APPLIED | YES — `supabase/migrations/20260811210000_kashu_card_payments.sql` |
| TARGET | `bsgtuuzwgeetsjjdrtrm` |
| ADDITIVE | YES (no deletes/truncates; ACH/Wire allow-list retained; Stripe columns untouched) |
| SECURITY | `kashu_sku_map` + `payment_webhook_events` RLS enabled; `anon`/`authenticated` privileges revoked (service-role Edge only) |

## KASHU_SKU_MAP

| Field | Value |
|-------|-------|
| ROWS | 52 |
| MISSING | 0 |
| DUPLICATE MBM SKUS | 0 |
| DUPLICATE TAGADA VARIANTS | 0 |
| ORPHAN TRETINOIN `$99` (`variant_312812933f47`) | **Not included** (untouched) |

## WEBHOOK

| Field | Value |
|-------|-------|
| MBM ENDPOINT REGISTERED | YES — `https://bsgtuuzwgeetsjjdrtrm.supabase.co/functions/v1/tagada-webhook` (`whe_036975f30449`) |
| EXISTING KASHU WEBHOOK | PRESERVED — `https://mrp.kashupay.com/api/webhooks/tagada-store` |
| EVENTS | `payment/succeeded`, `payment/failed`, `payment/refunded`, `payment/rejected`, `order/paid`, `order/failed`, `order/refunded` |
| SECRET STORED | YES — `TAGADA_WEBHOOK_SECRET` (value not printed) |
| SIGNATURE TEST | PASS (missing / malformed / invalid HMAC → 401) |
| IDEMPOTENCY TEST | PASS |
| WRONG AMOUNT TEST | PASS → `payment_under_review` (not paid) |
| FAILED PAYMENT TEST | PASS → `payment_failed` (not paid) |
| REFUND TEST | PASS → `refunded` |
| EVENT ID PERSISTED | PASS |

## EDGE FUNCTIONS

| Function | Status |
|----------|--------|
| `create-kashu-checkout-session` | DEPLOYED |
| `tagada-webhook` | DEPLOYED (`verify_jwt=false`) |
| `create-invoice-order` | DEPLOYED (accepts `kashu_card`; sets `payment_processor`) |
| Stripe functions | **Not deployed / not modified** |

Also set Edge secrets: `TAGADA_CHECKOUT_URL=https://checkout.mybaremethod.com`, `MBM_SITE_ORIGIN=https://mybaremethod.com`.

## CHECKOUT SESSION TEST

| Field | Value |
|-------|-------|
| TEST ORDER | `MBM-2026-000011` (`kashu_card`, $3.99, SKU `MBM-ACC-PIS-ACC-001`) |
| REDIRECT CREATED | YES (Tagada init `307` → `checkout.mybaremethod.com` + `checkoutToken`) |
| CORRECT SKU MAP | YES → `variant_2b159acf7906` |
| AMOUNT SERVER-CONTROLLED | YES (client override ignored; order `total_cents=399` authoritative for webhooks) |
| CHECKOUT DOMAIN | `checkout.mybaremethod.com` |
| ACH BANK INSTRUCTIONS | NOT returned (`hostedCheckout: true` only) |
| STRIPE INVOCATION | NONE |
| HOSTED PAGE LOAD | **FAIL — HTML title `Store not found`** (session token issued; storefront app not resolving store on domain) |

No card details entered. No real charge.

## PROCESSOR

| Field | Value |
|-------|-------|
| My Bare Method - Airwallex | Unchanged (not modified via API) |
| TEST MODE | TRUE (per prior approved state; not modified) |
| PROCESSOR MODIFIED | **NO** |
| Hosted UI clearly labeled test/sandbox | **UNKNOWN / NOT OBSERVABLE** (page returns Store not found before checkout UI) |

## ACH / WIRE REGRESSION

| Check | Result |
|-------|--------|
| `manual_ach` create + bank instructions | PASS (`MBM-2026-000012`) |
| `manual_wire` create + wire instructions | PASS (`MBM-2026-000013`) |
| Admin `mark-payment-received` | PASS (ACH marked paid; fulfillment → `payment_confirmed`) |
| Fulfillment guard (unpaid stays `order_received`) | PASS |
| Unit tests `manualInvoice.test.ts` | 15/15 PASS |
| Stripe invocation | NONE |

## MEMBERSHIP RECURRING CATALOG

| Program | Amount | Recurring | Interval | Interval count | Customer subscription |
|---------|-------:|-----------|----------|----------------|-----------------------|
| Semaglutide (`MBM-MEM-SEM-MEM-001` / `price_344d3dacb4ab`) | $149 | true | month | 1 | **Not created** |
| Tirzepatide (`MBM-MEM-TIR-MEM-001` / `price_5cf1fa89610c`) | $249 | true | month | 1 | **Not created** |

## FLAGS / READINESS

| Field | Value |
|-------|-------|
| `VITE_KASHU_CARD_ENABLED` | **FALSE** (not enabled) |
| READY FOR CONTROLLED TEST CARD | **NO** |
| READY FOR CUSTOMER CARD ENABLEMENT | **NO** |
| READY FOR PRODUCTION | **NO** |

## BLOCKERS

1. **Awaiting Kashu confirmation** regarding Airwallex `testMode` → live transition.
2. **Hosted checkout storefront** on `checkout.mybaremethod.com` returns **Store not found** for valid init tokens — Kashu/Tagada must confirm exact `checkoutUrl` / store binding before any test-card attempt.

Stop. Do not enable frontend card payments.
