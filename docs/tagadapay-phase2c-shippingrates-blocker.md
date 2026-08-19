# Phase 2C — ShippingRates Removal (blocked on dashboard) + Pre-Launch Gate

**Date:** 2026-08-19  
**Branch:** `integration/tagadapay-hosted-checkout-2026`  
**Scope:** Disable Tagada Simple Checkout **ShippingRates** island so MBM mapped `MBM-SHIP-*` lines are the only shipping charge. Non-payment validation only.

**Safety:** `VITE_KASHU_CARD_ENABLED=false`. No production frontend deploy. No live card. Webhook amount equality unchanged. Main not modified.

---

## 1. Inspection (no guessing)

### Live funnel (API)

| Field | Value |
|-------|-------|
| Funnel ID | `funnelv2_834831bf5aa7` |
| Name | **Simple Checkout** |
| Status | active / default |
| Production domain | `checkout.mybaremethod.com` |
| Checkout step ID | `step_1786495418900` |
| Checkout plugin | `checkout-6d366d` |
| Checkout pageId | `checkout-5596ip` |
| Deployment | `msm89tihce4ek` |

Artifacts:

- `/opt/cursor/artifacts/phase2c-funnels-list.json`
- `/opt/cursor/artifacts/phase2c-funnel-get.json`
- `/opt/cursor/artifacts/phase2c-checkout-shell.html`

### Where ShippingRates lives

Hosted checkout HTML still contains:

```html
data-tagada-island="ShippingRates"
```

with title **Shipping Method**. Order Summary also has `showShipping: true`.

**Funnel GET config does NOT contain island layout / ShippingRates.**  
Islands are part of the **Studio checkout plugin page** (`pageId=checkout-5596ip`), not fields on `PUT /funnels/{id}` node config.

### What the Public API can / cannot do here

| Capability | Result |
|------------|--------|
| List funnels / get funnel | Works (read-only Edge actions added) |
| Remove ShippingRates via funnel API | **Not available** — island not in funnel JSON |
| List store shipping rates | Documented create only; list paths return **404** |
| Cursor Tagada Studio login | **No dashboard credentials** in agent env (only Edge digests for API key names) |

**Conclusion:** ShippingRates must be removed/disabled in the **Tagada Studio / dashboard page editor** for Simple Checkout. Cursor cannot safely invent a funnel/plugin mutation to do this.

```txt
SHIPPINGRATES DISABLED: NO
```

---

## 2. Exact dashboard steps (owner / Kashu)

Do **not** delete unrelated store config unless needed. Goal: Tagada must **not** add its own shipping amount; MBM `MBM-SHIP-TWO-DAY-001` / `MBM-SHIP-NEXT-DAY-001` remain the only shipping charges.

### Path A — Remove the ShippingRates island (preferred)

1. Open Tagada CRM / Studio: [https://app.tagada.io](https://app.tagada.io) (or Studio entry used for My Bare Method).
2. Select store **My Bare Method** (`store_041c3325dad9`).
3. Open **Funnels** → **Simple Checkout** (`funnelv2_834831bf5aa7`) — production domain `checkout.mybaremethod.com`.
4. Open the **Checkout** step (path `/checkout`, plugin `checkout-6d366d` / page `checkout-5596ip`).
5. Enter the **page / visual editor** for that checkout page.
6. Locate the island / block titled **Shipping Method** (`ShippingRates`).
7. **Delete / remove** that island from the page (do not only hide with CSS).
8. Optional but recommended: on **Order Summary** / **Compact Order Summary**, set **show shipping** off if shipping is only a cart line item (or leave on if it merely labels the mapped line — verify totals).
9. **Save** the page.
10. **Publish / promote** the funnel to production on `checkout.mybaremethod.com` (use the same publish flow you used for the last checkout update on 2026-08-19).
11. Hard-refresh a live checkout URL and confirm `data-tagada-island="ShippingRates"` is **gone** from the page source.

### Path B — If island cannot be removed: empty rates (fallback only)

Only if Studio will not allow removing the island:

1. In store settings, open **Shipping rates** for My Bare Method.
2. Deactivate or delete **Two Day Shipping $30**, **Next Day Shipping $50**, and any free-threshold rate that can still attach an amount.
3. Re-test carefully: CheckoutButton still has `selectShippingMessage` / incomplete-shipping copy — **empty rates may block Pay**. Prefer Path A.

### After either path — ping Cursor to resume Phase 2C validation

Re-run non-payment hosted checks for $30, $50, $0 free-ship, and service-only carts.

---

## 3. Shipping revalidation (not run — island still present)

Blocked until ShippingRates is disabled.

| Check | Status |
|-------|--------|
| TWO-DAY SHIPPING PARITY | **FAIL** (not revalidated; island still present) |
| NEXT-DAY SHIPPING PARITY | **FAIL** |
| FREE SHIPPING PARITY | Not re-run this phase (Phase 2B PASS; island still present) |
| SERVICE-ONLY SHIPPING | **FAIL** (not revalidated; island still present) |

---

## 4. Regression (still healthy)

| Check | Result |
|-------|--------|
| SKU INIT FAIL | **0** (50 PASS) |
| MEMBERSHIP DEFERRED | **2** |
| PRICE PARITY FAIL | **0** |
| Taxable products remaining | **0** |
| Provider visits `isShippable` | **false** (IPV/FUV/LAB) |
| Sem $595 session create | OK (`total_cents=59500`) |
| ShippingRates still in HTML | **YES** |

Artifact: `/opt/cursor/artifacts/phase2c-regression.json`

---

## 5. Final gate

```txt
READY FOR CONTROLLED LIVE TEST: NO
```

Blocked solely by Tagada ShippingRates island still charging independently of MBM mapped shipping lines.

---

## 6. Explicitly not done

- `VITE_KASHU_CARD_ENABLED` remains **false**
- No merge to main
- No production frontend deploy
- No live card
- Webhook amount equality **unchanged**
- Memberships remain ACH/Wire-only
