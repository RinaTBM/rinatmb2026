# GEN Hosted Checkout → Whop routing (WHOP-2)

Status: **implemented, production cutover OFF**.

Do not enable `GEN_WHOP_CHECKOUT_ENABLED` or seed `checkout_enabled=true` map rows without owner approval.

## Current production checkout (preserved)

```
CheckoutPage
  → create-invoice-order (unpaid order)
  → create-kashu-checkout-session (kashu_sku_map → Tagada)
  → redirect checkout.mybaremethod.com
  → /order/card-result/:orderNumber (display only; never marks paid)
  → tagada-webhook marks payment_status=paid
```

Accessories, SEM/TIRZ membership recurring, and mixed membership carts stay on this Tagada path.

## GEN/Whop path (gated)

When **both** are true:

1. Edge secret `GEN_WHOP_CHECKOUT_ENABLED=true`
2. Vite `VITE_GEN_WHOP_CHECKOUT_ENABLED=true` (UI routing hint only)
3. Cart heuristic: single one-time Rx (no accessories, no membership SKUs)
4. Active `gen_whop_checkout_map` row with `checkout_enabled=true` + `storefront_eligible=true` + `purchase_mode=one_time`

```
CheckoutPage
  → create-invoice-order (payment_method=gen_whop)
  → create-gen-whop-checkout-session
       validates map + cart policy
       POST GEN storefront /v2/client/storefront/checkout/sessions
         (X-Storefront-Key + Origin mybaremethod.com — secrets server-side only)
  → redirect https://whop.com/checkout/...
  → /order/card-result/:orderNumber (display only)
  → future: server reconcile/webhook → gen_checkout_sessions.status=succeeded
       THEN mark orders.payment_status=paid
```

Browser return **never** marks paid.

## Product mapping

Table: `public.gen_whop_checkout_map`

| Column | Purpose |
|--------|---------|
| `mbm_sku` | MBM catalog SKU (unique) |
| `gen_product_id` | GEN productId |
| `gen_client_product_id` | GEN clientProductId for storefront |
| `purchase_mode` | `one_time` \| `recurring` \| `membership_program` \| `unsupported` |
| `retail_amount_cents` | Expected retail (do not invent from BPC alone) |
| `storefront_eligible` | GEN storefront flag |
| `checkout_enabled` | Ops gate — must stay false until cutover |
| `membership_required` | Blocks one-time GEN path |
| `visit_required` / `pharmacy_name` | Optional clinical metadata |

Separate from:

- `kashu_sku_map` (Tagada)
- clinical `gen_sku_map` (formulary / handoff)

**Do not hard-code BPC IDs in routers.** Example BPC row (owner insert only, keep disabled until approved):

```sql
-- EXAMPLE ONLY — do not apply with checkout_enabled=true without approval
insert into public.gen_whop_checkout_map (
  mbm_sku, gen_product_id, gen_client_product_id,
  purchase_mode, retail_amount_cents, currency,
  storefront_eligible, checkout_enabled, membership_required, active, notes
) values (
  'MBM-RP-BPC-INJ-001',
  'KXMm9SsbOEYnFy9phmZn',
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_KXMm9SsbOEYnFy9phmZn',
  'one_time', 19900, 'USD',
  true, false, false, false,
  'WHOP-1 validated product; leave checkout_enabled=false until cutover'
) on conflict (mbm_sku) do nothing;
```

SEM/TIRZ membership SKUs: `purchase_mode=unsupported` or `membership_program` with `checkout_enabled=false`. Never generalize from BPC one-time.

## Correlation

Table: `public.gen_checkout_sessions`

```
MBM order (public_order_number)
  ↔ gen_checkout_session_id
  ↔ whop_checkout_config_id / whop_payment_id
  ↔ gen_order_id / gen_patient_id
```

Statuses: `created` → `redirect_issued` → `processing` → `succeeded` | `failed` | `expired` | `cancelled`

Idempotency: unique `idempotency_key = gen_whop:{ORDER}:{SKU}` reuses open sessions.

Read-only status:

- `get-order-payment-status` (includes optional `genCheckout`)
- `get-gen-checkout-status` (full correlation; never marks paid)

## Mixed cart recommendation (not implemented)

| Cart | Current | Recommendation |
|------|---------|----------------|
| Accessories only | Tagada | Keep Tagada |
| Membership SEM/TIRZ (± IPV) | Tagada combo recurring | Keep Tagada; never GEN/Whop from BPC model |
| One-time Rx + accessories | Tagada today | **Do not** invent GEN mixed-cart. Prefer split checkout later (Rx→GEN, accessories→Tagada) or keep Tagada until designed |
| Multi Rx products | Tagada | GEN v1 blocks multi-product; checkout individually or Tagada |
| One-time Rx + IPV/SHIP | Tagada today; GEN v1 allows order with visit/ship lines but maps **only** the Rx SKU into GEN session | Document: visit remains MBM-side; GEN session is product-only |

## Webhook / payment truth (future — not enabled)

1. Whop payment succeeds in My Bare Method company `biz_UaG5nUeGhOa8NG`
2. GEN creates clinical order / exposes payment state
3. New Edge reconcile or webhook updates `gen_checkout_sessions` → `succeeded` with `whop_payment_id` + `gen_order_id`
4. Only then set `orders.payment_status=paid` (same discipline as `tagada-webhook`)

Do **not** treat browser redirect or a failed Whop test attempt as paid.

## Feature flags

| Flag | Where | Default |
|------|-------|---------|
| `GEN_WHOP_CHECKOUT_ENABLED` | Edge secret | **false** (authoritative) |
| `VITE_GEN_WHOP_CHECKOUT_ENABLED` | Frontend build | **false** / unset (routing hint) |

Also required when enabling: `GEN_STOREFRONT_KEY`, `GEN_HEALTH_BASE_URL`, `MBM_SITE_ORIGIN=https://mybaremethod.com`.

## Owner checklist before cutover

1. Apply migration `20260822120000_gen_whop_checkout_routing.sql` to staging then production
2. Insert verified `gen_whop_checkout_map` rows (`checkout_enabled=false` first)
3. Deploy Edge: `create-gen-whop-checkout-session`, `create-invoice-order`, `get-order-payment-status`, `get-gen-checkout-status`
4. Confirm Whop company + GEN billing processor unchanged
5. Controlled staging session create (no production payments)
6. Design/implement payment reconcile webhook
7. Flip `checkout_enabled=true` per SKU
8. Set `GEN_WHOP_CHECKOUT_ENABLED=true` then `VITE_GEN_WHOP_CHECKOUT_ENABLED=true`
9. Explicit owner approval for production cutover

**STOP before enabling production GEN/Whop checkout.**
