# Phase 2C v4 — Store rates deleted; shipping line items restored; parity PASS

**Date:** 2026-08-19  
**Branch:** `integration/tagadapay-hosted-checkout-2026`  
**Safety:** No card entry. `VITE_KASHU_CARD_ENABLED` remains false. No main merge. No frontend production deploy.

## Confirmed configuration

| Check | Result |
|-------|--------|
| `data-tagada-island="ShippingRates"` | **NO** |
| Store shipping rates auto-charge | **NO** (deleted/deactivated) |
| MBM `MBM-SHIP-*` Tagada products | **Recreated** (prior products were deleted during rate cleanup) |

### Recreated shipping product IDs

| SKU | Product | Variant | Price | Amount |
|-----|---------|---------|-------|--------|
| `MBM-SHIP-TWO-DAY-001` | `product_ae81dcd65373` | `variant_18c3ab5eadee` | `price_c65bb478d609` | $30 |
| `MBM-SHIP-NEXT-DAY-001` | `product_68cc1b3bf2a0` | `variant_6817c3c6e31a` | `price_53861f3e4cad` | $50 |

Both: one-time, `isTaxable=false`, `isShippable=false`. Mapped in `kashu_sku_map` + seed.

## Hosted non-payment validation

| Cart | MBM total | Hosted total | Tagada Shipping line | Parity |
|------|-----------|--------------|----------------------|--------|
| Two-Day (Sem $119 + ship line $30) | **$149** | **$149** | **$0.00** | **PASS** |
| Next-Day (Sem $119 + ship line $50) | **$169** | **$169** | **$0.00** | **PASS** |
| Free Sem×5 | **$595** | **$595** | **$0.00** | **PASS** |
| IPV service-only | **$75** | **$75** | **$0.00** | **PASS** |

Screenshots: `/opt/cursor/artifacts/phase2c-v4b-screenshots/`

```txt
TWO-DAY SHIPPING PARITY: PASS
NEXT-DAY SHIPPING PARITY: PASS
FREE SHIPPING PARITY: PASS
SERVICE-ONLY SHIPPING: PASS
TAGADA EXTRA SHIPPING CHARGE: NO
SHIPPINGRATES ISLAND PRESENT: NO
STORE SHIPPING RATES ACTIVE: NO
READY FOR CONTROLLED LIVE TEST: YES
LIVE CARD PAYMENT ENABLED: NO
```

Note: Ready for a **controlled** live test means shipping/tax/SKU blockers for hosted totals are cleared. Do **not** flip `VITE_KASHU_CARD_ENABLED` or deploy production frontend until owner explicitly approves.
