# Phase 3 — Controlled Live Card Test (verification)

**Date:** 2026-08-19  
**Branch:** `integration/tagadapay-hosted-checkout-2026` @ `0f85788`  
**Order:** `MBM-P3-LIVE-1787118084`  
**Amount:** `$33.99` (3399 cents)

## Safety preserved

- No second charge
- `VITE_KASHU_CARD_ENABLED` remains false / public card off
- No merge to `main`
- No production frontend deploy
- Webhook amount equality not weakened
- Stripe remains disabled; memberships ACH/Wire-only

## Tagada

- Display order **#1005** Confirmed (owner Thank You page)
- API `orderId`: `order_b2ee61c57a77`
- Success `paymentId`: `pay_1e0bd6751467`
- Charged amount: **3399** cents
- Line items: Syringes $3.99 + Two-Day Shipping $30.00; Tagada Shipping $0; tax $0
- Prior declined attempts on same checkout session used different `paymentId`s (insufficient_funds) — **one** successful charge only

## Webhook

- `payment/succeeded` event `7cf0c363-…` received with `signature_valid=true`
- Companion `order/paid` received with `signature_valid=true`
- Initial processing: `missing_order_reference` because live Tagada nests `mbmOrder:` under `data.customer.tags` and cents under `data.amount` / `data.order.paidAmount`
- Fix deployed: `tagada-webhook` nested extractors (`0f85788`)
- Stored signature-valid success event reprocessed (no new charge) → `applied_paid`
- Amount validation: expected 3399 === paid 3399

## MBM order (after reprocess)

- `payment_status`: **paid**
- `order_status`: **payment_confirmed**
- `paid_at` set; `paid_marked_by`: `tagada_webhook`
- External IDs stored: payment / order / checkout session
- `payment_under_review`: **no**
- Duplicate MBM orders for this payment: **no** (1 row)

## Decision

`CONTROLLED LIVE TEST: PASS` (with webhook nested-payload remediation applied during 3G)
