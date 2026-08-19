# Phase 4 — Production card rollout status

**Date:** 2026-08-19  
**Deploy branch:** `deploy/ach-launch-clean-2026`  
**Deploy tip:** `bdb60ae86399870d274e6071b730c5cb039dce3b`  
**Merge:** normal merge of `integration/tagadapay-hosted-checkout-2026` (`c059d9e`) into deploy (FF not possible — deploy had cherry-pick `6afb12a`)  
**Main modified:** NO

## Git / flag

| Item | Status |
|------|--------|
| Post-merge tests | **261 passed / 0 failed** |
| `.env.production` | `VITE_KASHU_CARD_ENABLED=true` (no secrets) |
| `BUILD_VERSION` | `PHASE4-CARD-2026-08-19-1` |
| Local `npm run build` embeds marker | YES |
| Disposable Bolt mirrors synced | attempted force-with-lease to same tip |

## Pre-publish gates (immediately before publish attempt)

| Gate | Result |
|------|--------|
| Webhook nested live-payload fix | YES (in tree + Edge redeployed earlier) |
| checkout.mybaremethod.com | PASS |
| ShippingRates island | ABSENT |
| Store shipping rates | ABSENT |
| MBM-SHIP-* mapped | YES |
| Live price parity fail | **0** |
| Tagada taxable products | **0** |
| Membership card block | PASS |
| Stripe disabled | YES |
| ACH/Wire enabled in code | YES |

## Bolt Publish

| Item | Status |
|------|--------|
| Cursor Bolt login | **BLOCKED** (sign-in wall) |
| Production frontend published from this run | **NO** |
| Live JS still | `index-Co1A1eqq.js` (no `PHASE4-CARD-2026-08-19-1`) |
| Live `VITE_KASHU_CARD_ENABLED` | **not yet true on CDN** |

## Owner action required to finish publish

In Bolt.new (project → https://mybaremethod.com):

1. Sign in.
2. Sync/pull GitHub branch **`deploy/ach-launch-clean-2026`** @ `bdb60ae`.
3. Confirm build env picks up `.env.production` (`VITE_KASHU_CARD_ENABLED=true`) or set the same flag in Bolt env.
4. **Publish** to `mybaremethod.com`.
5. Confirm live HTML/JS contains **`PHASE4-CARD-2026-08-19-1`** and checkout shows **Credit / Debit Card** on eligible one-time carts (ACH/Wire still visible; membership carts no card).

## First 3 customer transactions

Monitoring **ACTIVE** once live build is verified — do not place another QA charge from agents.
