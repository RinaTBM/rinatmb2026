# TagadaPay Hosted Checkout — Phase 1 Implementation Notes

**Branch:** `integration/tagadapay-hosted-checkout-2026`  
**Status:** Local implementation. Feature flag default OFF. No production deploy. No live card charge.

## Flow

```
CheckoutPage (kashu_card when flag + eligible)
→ create-invoice-order (awaiting_payment)
→ create-kashu-checkout-session (SKU → Tagada variant via kashu_sku_map)
→ Tagada GET /api/public/v1/checkout/init
→ checkout.mybaremethod.com
→ tagada-webhook (authoritative paid)
→ /order/card-result/:orderNumber (status poll only)
```

## Feature flag

`VITE_KASHU_CARD_ENABLED` — default/unset = OFF.

## Memberships

Card disabled for `membership_program` / `isMembership` carts. ACH/Wire remain.

## Shipping

MBM is source of truth. Tagada `checkout/init` has **no shipping amount field**.

- `shipping_cents === 0` → card eligible (service-only / free-shipping threshold)
- `shipping_cents > 0` → frontend blocks card; Edge returns `TAGADA_SHIPPING_PARITY_BLOCKER` unless mapped shipping SKUs exist:
  - `MBM-SHIP-TWO-DAY-001` ($30)
  - `MBM-SHIP-NEXT-DAY-001` ($50)

Those shipping SKUs are **not** in the current 52-row product map.

## Store ID

Expect Edge secret `TAGADA_STORE_ID` (`store_…`). Agent env may only expose digests → `TAGADA_STORE_ID_REQUIRED` for live init validation.
