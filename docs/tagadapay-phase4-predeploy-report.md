# Phase 4 — Pre-deploy report (STOP for approval)

**Date:** 2026-08-19  
**Branch:** `integration/tagadapay-hosted-checkout-2026` @ `94474212b38349188b1277533c91bf3e1efb8180`  
**Production Supabase:** `bsgtuuzwgeetsjjdrtrm`  
**No production frontend deploy performed** (awaiting owner approval).

## 1. Webhook live-payload fix

| Check | Result |
|-------|--------|
| Commit `9447421` is tip / includes fix | **YES** (parent `0f85788` nested extractor fix is in tree) |
| `data.customer.tags` | **YES** |
| `data.amount` | **YES** |
| `data.order.paidAmount` | **YES** |
| Unit test live envelope | **YES** (`extracts nested live Tagada payment/succeeded envelope (Phase 3)`) |
| Production Edge `tagada-webhook` | **Redeployed** from this branch tip (BSG) so deploy === branch |

## 2. Parity / safety gates

| Gate | Result |
|------|--------|
| Live Tagada vs MBM price (50 one-time SKUs) | **FAIL = 0** |
| Map `mbm_price_cents` vs `tagada_price_cents` | **FAIL = 0** |
| Tagada `isTaxable` products | **0** (taxableCount=0) |
| ShippingRates island | **ABSENT** |
| Store shipping rates | **ABSENT** |
| Membership card block | **PASS** (tests + eligibility) |
| Stripe disabled | **YES** |
| Shipping architecture | **PRESERVED** (MBM SoT, MBM-SHIP-*, no store rates) |

## 3. Tests

**261 passed / 0 failed**

## 4. Proposed merge / deploy plan (NOT executed)

1. Keep `main` untouched.
2. Fast-forward or merge `integration/tagadapay-hosted-checkout-2026` → `deploy/ach-launch-clean-2026` (current ACH production tip; 13 commits behind integration).
3. Set **production frontend** build env: `VITE_KASHU_CARD_ENABLED=true` (only this flag).
4. Deploy storefront via the existing Bolt / production frontend pipeline for `deploy/ach-launch-clean-2026` (or the owner’s designated production deploy branch after it receives the merge). Do **not** force-push; do **not** rewrite main.
5. Leave Edge functions as currently deployed on BSG (`tagada-webhook` already updated).
6. Limited rollout: monitor first **3** successful customer card payments individually; if any parity/webhook failure → immediately unset/disable `VITE_KASHU_CARD_ENABLED` and keep ACH/Wire.

## 5. Post-approval AGENTS note

After owner approves deploy, update AGENTS.md line that says the flag must remain false until controlled live testing completes — Phase 3 live test already **PASS**; Phase 4 is limited public enablement with monitoring.
