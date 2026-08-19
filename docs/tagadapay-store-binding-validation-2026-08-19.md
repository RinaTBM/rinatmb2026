# Tagada hosted-checkout validation — Store ID binding

**Date:** 2026-08-19  
**Branch:** `integration/tagadapay-hosted-checkout-2026`  
**Supabase project verified:** `bsgtuuzwgeetsjjdrtrm` (RinaTBM's Project / My Bare Method BSG)

## Secrets updated (names only)

| Secret | Action |
|--------|--------|
| `TAGADA_STORE_ID` | Set/confirmed to production store id from Tracking Setup (`store_…`). Digest matches expected value. |
| `TAGADA_CHECKOUT_URL` | Updated to `https://checkout.mybaremethod.com/checkout` |

No `VITE_KASHU_CARD_ENABLED` change. No frontend production deploy. No card charge.

## Edge session validation

| Field | Result |
|-------|--------|
| Function | `create-kashu-checkout-session` |
| Test order | `MBM-2026-000070` (cancelled after QA) |
| Cart | `MBM-WM-SEM-INJ-001` × 5 @ $119 = $595 |
| Shipping | `$0` / `free_over_500` (MBM source of truth) |
| HTTP | **200** |
| Redirect host | `checkout.mybaremethod.com` |
| Redirect path | `/checkout` |
| `checkoutToken` | present |

## Hosted page validation

| Check | Result |
|-------|--------|
| Page loads | YES |
| `Store not found` | **NO** |
| Checkout UI | YES |
| Product | Semaglutide + B6 Injection |
| Quantity | **5** |
| Unit price | **$119.00** |
| Merchandise subtotal | **$595.00** |
| Shipping | **FREE** ($500+ Two Day) |
| Payment entered | **NO** |

```txt
TAGADA_STORE_BINDING_BLOCKER: RESOLVED
```

## Residual risks (not weakened)

1. **Tax parity:** Hosted UI showed tax **$10.71** → displayed total **$605.71** while MBM `orders.total_cents` was **59500**. Webhook amount-match remains enabled and would send mismatches to `payment_under_review` (do not weaken).
2. **Shipping mappings:** $30/$50 paid shipping still blocked (`TAGADA_SHIPPING_PARITY_BLOCKER`) until mapped Tagada shipping SKUs exist.
3. **Some mapped SKUs fail Tagada init** (provider visits + many accessories return `Failed to get checkout URL from session`). Wellness SEM/TIR/HRT variants init successfully. Investigate catalog/funnel assignment before enabling those SKUs for card.

## Cleanup

Validation orders `MBM-2026-000068` / `069` / `070` marked `cancelled` / `canceled` with admin note. No payment collected.
