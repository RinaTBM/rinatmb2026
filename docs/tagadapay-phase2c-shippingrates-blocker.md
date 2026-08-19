# Phase 2C — ShippingRates Removal + Pre-Launch Gate

**Date:** 2026-08-19  
**Branch:** `integration/tagadapay-hosted-checkout-2026`  
**Scope:** Disable Tagada Simple Checkout **ShippingRates** so MBM mapped `MBM-SHIP-*` lines are the only shipping charge. Non-payment validation only.

**Safety:** `VITE_KASHU_CARD_ENABLED=false`. No production frontend deploy. No live card. Webhook amount equality unchanged. Main not modified.

---

## Resume validation after “0 of 3 visible” (Phase 2C v2)

Owner hid all three Tagada shipping rates in Simple Checkout (**0 of 3 visible**), saved, and published.

**Hypothesis:** hidden rates ⇒ no Tagada shipping amount.  
**Result:** **REJECTED** — hide ≠ disable.

| Cart | MBM total | Hosted total | Tagada summary “Shipping” | UI Shipping Method | Parity |
|------|-----------|--------------|---------------------------|--------------------|--------|
| Two-Day ($119 + $30 line) | **$149** | **$199** | **$50** | “No shipping methods available…” | **FAIL** |
| Next-Day ($119 + $50 line) | **$169** | **$219** | **$50** | No selectable rates | **FAIL** |
| Free Sem×5 | **$595** | **$595** | **Free** | No selectable rates | **PASS** |
| IPV service-only | **$75** | **$125** | **$50** | “No shipping methods available…” | **FAIL** |

Also observed:

- `data-tagada-island="ShippingRates"` **still present** in checkout HTML
- Pay button **enabled** — checkout does **not** require selecting a Tagada rate
- Extra charge is consistently **$50** (Next-Day amount) even when the selector shows no visible rates

Artifacts:

- `docs/tagadapay-phase2c-v2-validation.json`
- `/opt/cursor/artifacts/phase2c-v2-screenshots/`

```txt
SHIPPINGRATES EFFECTIVELY DISABLED: NO
TWO-DAY SHIPPING PARITY: FAIL
NEXT-DAY SHIPPING PARITY: FAIL
FREE SHIPPING PARITY: PASS
SERVICE-ONLY SHIPPING: FAIL
TAGADA EXTRA SHIPPING CHARGE: YES
CHECKOUT REQUIRES TAGADA SHIPPING SELECTION: NO
READY FOR CONTROLLED LIVE TEST: NO
```

### Required next dashboard action (stronger than hide)

Unchecking / “0 of 3 visible” is **not** enough. Do one of:

1. **Preferred:** Remove the **Shipping Method / ShippingRates** island from the Checkout page editor, save, publish to `checkout.mybaremethod.com`.
2. **Or:** Fully **delete / deactivate** the store shipping rates (not merely hide from the funnel visibility list), then re-test. Confirm totals no longer show a $50 Shipping line when MBM already passed `MBM-SHIP-*` or `$0` shipping.

Then ask Cursor to re-run the four hosted non-payment checks.

---

## Funnel inspection (API)

| Field | Value |
|-------|-------|
| Funnel ID | `funnelv2_834831bf5aa7` |
| Name | **Simple Checkout** |
| Production domain | `checkout.mybaremethod.com` |
| Checkout plugin / page | `checkout-6d366d` / `checkout-5596ip` |

Funnel GET JSON does **not** include island layout. ShippingRates is Studio page content.

### Path A — Remove the ShippingRates island (preferred)

1. Open [https://app.tagada.io](https://app.tagada.io) → store **My Bare Method**
2. **Funnels** → **Simple Checkout**
3. **Checkout** step → page visual editor (`checkout-5596ip`)
4. Delete island **Shipping Method** (`ShippingRates`) — do not only hide CSS
5. Save → publish/promote to `checkout.mybaremethod.com`
6. Confirm page source no longer has `data-tagada-island="ShippingRates"`

### Path B — Fully deactivate rates (if island must stay)

1. Store **Shipping rates** for My Bare Method
2. **Delete or fully deactivate** Two-Day $30, Next-Day $50, and free-threshold rates (not only funnel “visible” unchecked)
3. Re-test IPV / $30 / $50 carts for **$0** Tagada Shipping line

---

## Explicitly not done

- `VITE_KASHU_CARD_ENABLED` remains **false**
- No merge to main / no production frontend deploy / no live card
- Webhook amount equality **unchanged**
- Memberships remain ACH/Wire-only
