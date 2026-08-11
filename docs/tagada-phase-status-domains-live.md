# Kashu / Tagada Phase Status — Domains Live, Processor Still testMode

**Date:** 2026-08-11  
**Branch:** `cursor/kashu-tagada-product-sync-945c`

## Domains (live Tagada API)

| Domain | Verified | Active | verifiedAt |
|--------|----------|--------|------------|
| `tbmgroup.site` | **YES** | **YES** | 2026-08-11T23:04:09Z |
| `checkout.mybaremethod.com` | **YES** | **YES** | 2026-08-11T21:07:59Z |

DNS was not modified by this agent.

## Product sync (already executed; re-verified)

| Metric | Value |
|--------|------:|
| MBM SKUs expected | 52 |
| MATCHED (by Tagada variant SKU) | **52** |
| MISSING | 0 |
| AMBIGUOUS | 0 |
| DUPLICATE | 0 |
| PRICE MISMATCH | 0 |
| Tagada products | 30 |
| Tagada variants | 53 |
| Tagada prices | 53 |
| Blank Tagada SKUs | 1 (orphan Tretinoin $99 — not an MBM SKU) |
| Existing variants updated with MBM SKU | 25 |
| Products created | 17 |
| Variants created | 27 |

Ambiguous resolutions: see `docs/tagada-ambiguous-resolution.md`.

Membership PROGRAM SKUs created with recurring monthly prices; **no customer subscriptions** created.

## kashu_sku_map

Seed prepared (not applied to production DB):

- `docs/kashu-sku-map-seed.json` (52 rows)
- `docs/kashu-sku-map-seed.sql` (commented upsert template)

**KASHU SKU MAP READY: YES** — awaiting approved migration apply on BSG.

## Webhook

**Not registered in this pass.**

Reasons (safety):

1. MBM `tagada-webhook` Edge Function is **not deployed** on this branch/environment.
2. Kashu card payment migration / `payment_webhook_events` table **not applied**.
3. Registering a Tagada webhook without a verified receiver would drop or mis-handle payment events.
4. Registering a webhook does **not** by itself charge cards, but must wait until the MBM receiver + HMAC secret storage are ready.

**Prepared target (when approved):**

```
POST https://bsgtuuzwgeetsjjdrtrm.supabase.co/functions/v1/tagada-webhook
```

Subscribe (slash format): `order/paid`, `payment/succeeded`, `payment/failed`, `payment/rejected`, `order/failed`, `order/refunded`, `payment/refunded`.

Store returned signing secret as Edge secret `TAGADA_WEBHOOK_SECRET` (never `VITE_*`).

**WEBHOOK READY: YES** (design + URL ready) · **WEBHOOK REGISTERED: NO**

## Processor / payment flow (unchanged)

| Item | Value |
|------|--------|
| Processor | My Bare Method - Airwallex (`processor_c4deb160d3cd`) |
| Enabled | true |
| **testMode** | **TRUE** (not modified) |
| Payment flow | My Bare Method – Primary Checkout (`flow_de19e5fca1e7`) — active |
| Processor modified | **NO** |
| Payment flow modified | **NO** |

## Card checkout

| Flag / action | Status |
|---------------|--------|
| `VITE_KASHU_CARD_ENABLED` | **false** / not enabled |
| Hosted checkout sessions | not created |
| Card charges | none |
| ACH / Wire | unchanged |
| Stripe | untouched |

## Readiness

| Gate | Status |
|------|--------|
| READY FOR SANDBOX/TEST CARD | **NO** — processor still `testMode=true`; awaiting Kashu procedure; MBM webhook not registered; card UI off; migration not applied |
| READY FOR LIVE CARD | **NO** |
| BLOCKER | Awaiting Kashu confirmation on Airwallex testMode → live-mode transition |

Stop before any card transaction.
