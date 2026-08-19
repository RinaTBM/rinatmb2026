# Phase 2A — Tax, Shipping, and SKU Compatibility Audit

**Date:** 2026-08-19  
**Branch:** `integration/tagadapay-hosted-checkout-2026`  
**Supabase:** `bsgtuuzwgeetsjjdrtrm` (verified My Bare Method / BSG)  
**Scope:** Audit only. No `VITE_KASHU_CARD_ENABLED`. No production frontend deploy. No card charge. Webhook amount-match unchanged.

Artifacts:
- `/opt/cursor/artifacts/tagada-phase2a-sku-init-audit.json`
- `/opt/cursor/artifacts/tagada-phase2a-sku-init-audit.csv`

---

## 1. Tax parity

### MBM tax rules (authoritative app logic)

From `src/lib/checkout/checkoutConstants.ts` + `authorizeCheckout.ts`:

| Line type | MBM tax |
|-----------|---------|
| Wellness / weight meds / research | **$0** |
| Provider Care | **1.8%** of provider-care subtotal only |
| Accessories | interim **8%** of accessory subtotal only |
| Shipping | never taxed by MBM |

Order `MBM-2026-000070` was wellness Semaglutide only → MBM `tax_cents = 0`, `total_cents = 59500`.

### Why Tagada added $10.71

```txt
$595.00 × 0.018 = $10.71  (exact)
```

Observed Tagada configuration responsible:

1. **Product tax flag:** Semaglutide product `isTaxable: true` (all **30/30** live store products are taxable).
2. **TaxJar category on Semaglutide:** `mappedTaxCategory.slug = cosmetic-medical-procedure`, `taxjarCode = 80110517A0000`, `ticCode = 91120`.
3. **Checkout funnel UI:** `showTax: true` on the hosted checkout order-summary island.
4. **Store object:** `GET /stores/{id}` returns `integrations: []` (no separate integration block exposed); tax is driven by product taxable + TaxJar category / Tagada tax engine, not by MBM `tax_cents`.

Tagada therefore **independently** computed tax. MBM did not send `$10.71`.

### Tax source of truth (V1 recommendation)

**My Bare Method must remain tax source of truth** for amount parity with `orders.total_cents`.

Tagada must **not** independently add tax unless/until MBM can deterministically pre-compute the identical amount before `create-invoice-order` (not true today for destination TaxJar).

### Tax parity fix (recommended; not applied)

1. Set Tagada `isTaxable: false` on all card-checkout products **or** clear `mappedTaxCategory` / disable TaxJar for this store’s external checkout catalog.
2. Keep MBM computing `tax_cents` as today.
3. Keep webhook **strict** amount equality (do not ignore tax deltas).
4. Until Tagada tax is zeroed for card SKUs: treat card carts with any Tagada-auto-tax risk as blocked.

```txt
TAGADA_TAX_PARITY_BLOCKER: YES
```

---

## 2. Shipping parity

### MBM (source of truth)

| Method | Amount |
|--------|--------|
| Two-Day | **$30** (`3000` cents) |
| Next-Day | **$50** (`5000` cents) |
| Free | **$0** when eligible merchandise ≥ $500 (membership value excluded) |
| Service-only | **$0** / `none` |

### Tagada behavior observed

- Hosted checkout includes a **`ShippingRates`** island that loads rates by location/subtotal (**independent** of MBM).
- On the $595 validation cart, Tagada showed **“Free Two Day Shipping $500+”** (aligned that time, but not controlled by MBM).
- Official `checkout/init` has **no shipping amount field**.
- `shippingRateId` exists on **Pay V2** (out of scope / not used).
- Shipping-rate **list** API paths probed via Edge returned **404**; create-rate docs confirm rates are matched on country / cart subtotal / weight via `GET /checkout-sessions/:id/shipping-rates`.

Additionally: live **provider visit** products are marked `isShippable: true` (incorrect for services) — Tagada may solicit shipping on service carts.

### Shipping parity fix (recommended; not applied)

Keep **MBM as shipping source of truth**.

Safest supported pattern for hosted init:

1. **Disable / empty Tagada auto shipping rates** for the external Simple Checkout path (so Tagada does not add a second charge), **and**
2. Represent paid MBM shipping as **mapped Tagada shipping line items** appended by `create-kashu-checkout-session` when `shipping_cents > 0`.

### Exact records needed (not created)

| MBM SKU | Required Tagada role | Required amount |
|---------|----------------------|-----------------|
| `MBM-SHIP-TWO-DAY-001` | Active variant (+ price) | **3000** cents |
| `MBM-SHIP-NEXT-DAY-001` | Active variant (+ price) | **5000** cents |

Then `kashu_sku_map` rows:

```text
mbm_sku=MBM-SHIP-TWO-DAY-001  → tagada_variant_id=<new>  tagada_price_cents=3000  is_active=true
mbm_sku=MBM-SHIP-NEXT-DAY-001 → tagada_variant_id=<new>  tagada_price_cents=5000  is_active=true
```

No approved production shipping product/variant IDs exist in the repo today → **do not auto-create**.

Also set provider-care Tagada products to **`isShippable: false`**.

```txt
TAGADA_SHIPPING_PARITY_BLOCKER: YES
```

(Still blocked for `$30/$50` until shipping variants exist **and** Tagada auto-rates cannot double-charge.)

---

## 3. SKU compatibility audit (52 seed mappings)

Non-payment `GET /api/public/v1/checkout/init` against `store_041c3325dad9` + `https://checkout.mybaremethod.com/checkout`.

### Classification counts (by **current seed / map IDs**)

| Class | Count |
|-------|------:|
| **PASS** | **27** |
| **INIT_FAIL** | **23** |
| **MEMBERSHIP_DEFERRED** | **2** |
| SHIPPING_BLOCKED | 0 (init-level; shipping blocked separately in app for `shipping_cents>0`) |
| OTHER_BLOCKER | 0 |

### IPV failure cause

```txt
IPV FAILURE CAUSE: STALE TAGADA VARIANT ID IN SEED / kashu_sku_map
```

| Field | Seed (fails init) | Live store (passes init) |
|-------|-------------------|---------------------------|
| SKU | `MBM-PC-IPV-SRV-001` | `MBM-PC-IPV-SRV-001` |
| Product ID | `product_4d47da6193e4` | `product_0a40b08c46f5` |
| Variant ID | `variant_08bf53e519ce` | `variant_3b859fb20d65` |
| Price ID | `price_6b59dbc48752` | `price_6163adf08816` |
| Init | HTTP **500** `Failed to get checkout URL from session` | HTTP **307** → `checkout.mybaremethod.com` |

Same pattern for Follow-Up, Lab Review, Fat Burner, and **all accessories**: seed IDs are orphaned; **live variants with the same MBM SKU init successfully**.

### Remap note (by SKU, not by name)

All **23 INIT_FAIL** rows have a live SKU match that **would PASS** init.  
`LIVE_VARIANT_WOULD_PASS` counting live IDs ≈ **50/52** (remaining 2 are memberships — deferred by policy even though init can succeed).

**Do not** remap by product name. Refresh `kashu_sku_map` by **`mbm_sku` → current live `tagada_variant_id` / `tagada_price_id`**.

### Accessory price drift warning

Pen Injector Screw seed vs live amounts differ (e.g. `MBM-ACC-PIS-ACC-001` seed **399** vs live **499**). After remapping, reconcile MBM catalog prices or Tagada prices before enabling card — webhook amount-match will fail on drift.

### Memberships

`MBM-MEM-SEM-MEM-001` / `MBM-MEM-TIR-MEM-001` → **MEMBERSHIP_DEFERRED** (V1 card policy). Init can succeed; must not be offered as card checkout.

---

## 4. Safety posture (preserved)

| Control | Status |
|---------|--------|
| `VITE_KASHU_CARD_ENABLED` | still OFF |
| Webhook amount equality | unchanged / not weakened |
| ACH / Wire | unchanged |
| Memberships card-disabled | unchanged |
| Stripe | disabled |
| Production frontend deploy | not done |
| Live card payment | **NO** |

Read-only Edge audit actions added to `tagada-product-sync`: `list_shipping_rates`, `audit_product_tax` (no charges).

---

## 5. Final report block

```txt
TAX SOURCE OF TRUTH: My Bare Method (required for V1 amount parity)

CAUSE OF $10.71 TAX: Tagada auto-tax on taxable Semaglutide (isTaxable=true + TaxJar mappedTaxCategory cosmetic-medical-procedure / 80110517A0000) with funnel showTax=true; $595 × 1.8% = $10.71. MBM tax_cents was 0.

TAX PARITY FIX: Disable Tagada product tax (isTaxable=false and/or remove TaxJar categories) for card catalog so Tagada charged amount matches MBM total_cents; keep webhook strict equality.

SHIPPING SOURCE OF TRUTH: My Bare Method

SHIPPING PARITY FIX: Prevent Tagada ShippingRates from adding a second charge; represent $30/$50 via mapped line items MBM-SHIP-TWO-DAY-001 / MBM-SHIP-NEXT-DAY-001 (IDs not created); set service products isShippable=false.

SKU PASS COUNT: 27
SKU INIT_FAIL COUNT: 23
MEMBERSHIP_DEFERRED COUNT: 2

IPV FAILURE CAUSE: Stale seed/map Tagada variant ID (variant_08bf53e519ce); live SKU-matched variant_3b859fb20d65 initializes successfully.

TAGADA_TAX_PARITY_BLOCKER: YES
TAGADA_SHIPPING_PARITY_BLOCKER: YES

LIVE CARD PAYMENT ENABLED: NO
```

### Remediation order (next phases — not executed)

1. Refresh `kashu_sku_map` for 23 stale SKUs by **SKU** to live Tagada IDs; fix PIS price drift.  
2. Turn off Tagada tax on card catalog (`isTaxable=false` / clear TaxJar).  
3. Create+map shipping SKUs **or** keep card limited to `shipping_cents===0` **and** ensure Tagada rates cannot add shipping.  
4. Set provider visits `isShippable=false`.  
5. Re-run non-destructive init + total parity checks.  
6. Only then consider staging `VITE_KASHU_CARD_ENABLED=true`.
