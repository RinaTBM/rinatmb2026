# Phase 2C v3 — ShippingRates island removed; auto-charge remains

**Date:** 2026-08-19  
**Branch:** `integration/tagadapay-hosted-checkout-2026`  
**Safety:** No card entry. `VITE_KASHU_CARD_ENABLED` unchanged (false). No main merge. No frontend production deploy.

## Page source check

After owner deleted ShippingRates island and published:

| Check | Result |
|-------|--------|
| `data-tagada-island="ShippingRates"` in live HTML | **ABSENT** on all 4 shells |
| Shipping Method selector UI | **Not shown** |
| Order Summary `showShipping` prop | still `true` (displays Shipping line) |

**SHIPPINGRATES REMOVED: YES** (island / selector gone)

## Hosted total revalidation (non-payment)

| Cart | MBM total | Hosted total | Tagada “Shipping” line | Parity |
|------|-----------|--------------|------------------------|--------|
| Two-Day ($119 + $30 line) | **$149** | **$199** | **$50** | **FAIL** |
| Next-Day ($119 + $50 line) | **$169** | **$219** | **$50** | **FAIL** |
| Free Sem×5 | **$595** | **$595** | **Free** | **PASS** |
| IPV service-only | **$75** | **$125** | **$50** | **FAIL** |

Artifacts: `/opt/cursor/artifacts/phase2c-v3-screenshots/`, `docs/tagadapay-phase2c-v3-validation.json`

```txt
SHIPPINGRATES REMOVED: YES
TWO-DAY SHIPPING PARITY: FAIL
NEXT-DAY SHIPPING PARITY: FAIL
FREE SHIPPING PARITY: PASS
SERVICE-ONLY SHIPPING: FAIL
TAGADA EXTRA SHIPPING CHARGE: YES
READY FOR CONTROLLED LIVE TEST: NO
```

## Conclusion

Removing the ShippingRates **island** removed the selector UI, but Tagada **still applies a $50 shipping amount** on carts below the free threshold (and on IPV). Free $595 still resolves to Free / $595.

**Next dashboard action required:** fully **delete or deactivate** store shipping rates (Two-Day $30, Next-Day $50, free-threshold), not only hide them or remove the island — then re-test. Until Tagada summary Shipping is $0 / absent (except reflecting Free with no extra cents) for $30/$50/IPV carts, keep card UI off.

Do not enable `VITE_KASHU_CARD_ENABLED` yet.
