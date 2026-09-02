# MBM-FINAL-CHECKOUT-LAUNCH-1

Fix **true payment blockers only**. Storefront QA already passed. PR #19 stays **OPEN / NOT MERGED**. Launch path is PR #20.

Tagada objects below were created/read live via Edge `tagada-product-sync` on **2026-08-25**. IDs are not guessed.

GEN API Orders / external-paid remains **BLOCKED**. GEN handoff automation remains **OFF**. Payment may proceed; medication fulfillment is **manual** until GEN API Orders is enabled.

---

## Inventory — 17 launch-ready one-time SKUs

| Family | Variant | MBM SKU | Price | Tagada product | Tagada variant | Tagada price | Map status |
|---|---|---|---|---|---|---|---|
| SEM | sem-b12-starting-low | MBM-WM-SEM-B12-001 | $89 | product_6b750325addf | variant_f9ac5ea25184 | price_e31ac583370d | MAP_CREATE_REQUIRED → created |
| SEM | sem-b12-mid | MBM-WM-SEM-B12-002 | $109 | product_6b750325addf | variant_d839f0aab609 | price_0bf0b622fd45 | MAP_CREATE_REQUIRED → created |
| SEM | sem-b12-high | MBM-WM-SEM-B12-003 | $109 | product_6b750325addf | variant_d9dac92d2f71 | price_3c22af390881 | MAP_CREATE_REQUIRED → created |
| SEM | sem-b12-any-dose | MBM-WM-SEM-B12-004 | $89 | product_6b750325addf | variant_9ffb5ebc2ee4 | price_0b4649e6fc5b | MAP_CREATE_REQUIRED → created |
| SEM | sem-glycine-starting-low | MBM-WM-SEM-GLY-001 | $89 | product_dcc64482bbbf | variant_c51c894cfee6 | price_74822644bb1f | MAP_CREATE_REQUIRED → created |
| SEM | sem-glycine-mid | MBM-WM-SEM-GLY-002 | $109 | product_dcc64482bbbf | variant_398f72f8ca6b | price_9113997a5445 | MAP_CREATE_REQUIRED → created |
| SEM | sem-glycine-high | MBM-WM-SEM-GLY-003 | $109 | product_dcc64482bbbf | variant_a71889d8f2e1 | price_0c321507201f | MAP_CREATE_REQUIRED → created |
| SEM | sem-glycine-any-dose | MBM-WM-SEM-GLY-004 | $89 | product_dcc64482bbbf | variant_cea940cbbe1a | price_95d6839eb9c2 | MAP_CREATE_REQUIRED → created |
| TIR | tir-b12-starting-low | MBM-WM-TIR-B12-001 | $119 | product_74cd4752c9d6 | variant_2d96cc588f51 | price_ed0142289010 | MAP_CREATE_REQUIRED → created |
| TIR | tir-b12-mid | MBM-WM-TIR-B12-002 | $149 | product_74cd4752c9d6 | variant_0acda4e3b2d7 | price_3db063ba334a | MAP_CREATE_REQUIRED → created |
| TIR | tir-b12-high | MBM-WM-TIR-B12-003 | $169 | product_74cd4752c9d6 | variant_5e13db7812ee | price_fb5946461765 | MAP_CREATE_REQUIRED → created |
| TIR | tir-b12-any-dose | MBM-WM-TIR-B12-004 | $119 | product_74cd4752c9d6 | variant_5be6af0494ac | price_a6eba9a2a721 | MAP_CREATE_REQUIRED → created |
| TIR | tir-glycine-starting-low | MBM-WM-TIR-GLY-001 | $119 | product_861e0edd8ab2 | variant_ddd60b897d66 | price_5e4581d60278 | MAP_CREATE_REQUIRED → created |
| TIR | tir-glycine-mid | MBM-WM-TIR-GLY-002 | $149 | product_861e0edd8ab2 | variant_b7e1562ee522 | price_0e41d6b0aeab | MAP_CREATE_REQUIRED → created |
| TIR | tir-glycine-high | MBM-WM-TIR-GLY-003 | $169 | product_861e0edd8ab2 | variant_121e6d8cd921 | price_9803c9a96da8 | MAP_CREATE_REQUIRED → created |
| TIR | tir-glycine-any-dose | MBM-WM-TIR-GLY-004 | $119 | product_861e0edd8ab2 | variant_6c383930239c | price_cb4042a35b42 | MAP_CREATE_REQUIRED → created |
| NAD | nad-nasal-r84 | MBM-LON-NAD-NS-001 | $79 | product_9dd959e8b3b2 | variant_c41bb700e856 | price_79f07341d00a | MAP_CREATE_REQUIRED → created |

All 17 Tagada products: `isTaxable=false`, `isShippable=false`, one-time USD. Medication retail already includes pharmacy shipping. Checkout appends `MBM-SHIP-ACCESSORY-001` ($10), `MBM-SHIP-TWO-DAY-001` ($30), or `MBM-SHIP-NEXT-DAY-001` ($50) for one-time carts when shipping applies. `tax_cents = 0`.

FORMULARY_PENDING / FUTURE_HIDDEN / NAD injection / Wolverine were not created or mapped.

## Membership

| Program | Base | Two-Day combo | Next-Day combo |
|---|---|---|---|
| SEM `MBM-MEM-SEM-MEM-001` | $149 `price_344d3dacb4ab` | $179 `price_41179f7cafe2` | $199 `price_7ce0f74a7509` |
| TIR new enrollment | $275 `price_2d2dd07b2f73` | $305 `price_94c92b6e5749` | $325 `price_d6941e334598` |

TIR historical (keep, do not delete, not used for new enrollments):

- $249 `price_5cf1fa89610c`
- $279 `price_e0ebef9851a8`
- $299 `price_ef9ea132d6cf`

Variant remains `variant_b3890c799e09` / product `product_8b3bfb6614c4`. Persist `base_membership_amount_cents=27500`, `shipping_cents=3000|5000`, `monthly_amount_cents=30500|32500`, `tagada_price_id` = combo. Do **not** append MBM-SHIP on membership enrollment. IPV remains one-time.

## Maps

- Additive SQL (apply via Bolt after owner approval): `supabase/migrations/20260825104500_kashu_sku_map_launch_ready.sql`
- Seed JSON updated: `docs/kashu-sku-map-seed.json`
- In-code fallback in `create-kashu-checkout-session` repairs missing one-time rows **and** stale TIR $249 map rows after that Edge function is redeployed
- Optional: redeploy `tagada-product-sync` and POST `upsert_kashu_sku_map`

## Owner deploy steps (do not skip)

1. Do **not** merge PR #19.
2. Apply the kashu_sku_map upsert SQL in Bolt/Supabase (production).
3. Redeploy Edge: `create-invoice-order`, `create-kashu-checkout-session` (and `tagada-product-sync` if using upsert). `tagada-webhook` rebill still uses stored `monthly_amount_cents`.
4. Keep `GEN_API_ORDERS_ENABLED` unset/false. Keep `GEN_HANDOFF_AUTOMATION_ENABLED=false`. Keep `REAL_GEN_ORDER_SUBMISSION_ENABLED=false`.
5. Stop for owner approval before merging PR #20 or publishing the website.

## Operational limitation

The website can take card payment for the 19 launch-ready variants. Real GEN medication-order automation stays fail-closed. Fulfillment is manual until GEN API Orders / external-paid is enabled. Do not fake GEN order readiness.

---

LAUNCH-READY ONE-TIME SKUS:
17

TAGADA/KASHU MAPPED:
17 / 17

TAGADA OBJECTS CREATED:
5 products (17 one-time variants) + 3 TIR recurring prices

TAGADA MAPS CREATED/UPDATED:
18 (17 one-time + TIR membership base $275)

SEM MEMBERSHIP:
$149 / $179 / $199 — READY

TIR MEMBERSHIP:
$275 / $305 / $325 — READY

OLD TIR $249 NEW-ENROLLMENT PATH REMOVED:
YES

ONE-TIME CARD CHECKOUT:
READY

SEM MEMBERSHIP CHECKOUT:
READY

TIR MEMBERSHIP CHECKOUT:
READY

CHECKOUT:
READY

WEBSITE:
READY

GEN ROUTING:
PARTIAL

REAL GEN API ORDERS:
BLOCKED / OFF

GEN HANDOFF AUTOMATION:
OFF

FORMULARY_PENDING:
UNCHANGED / HIDDEN

FUTURE_HIDDEN:
UNCHANGED / HIDDEN

TYPECHECK:
PASS

TESTS:
PASS (544)

BUILD:
PASS

READY TO MERGE PR #20:
YES (after tests; owner approval required)

READY TO DEPLOY WEBSITE:
YES (after merge + Edge redeploy + kashu_sku_map SQL)

PR #19:
OPEN / NOT MERGED

STOP FOR OWNER APPROVAL BEFORE MERGING OR DEPLOYING.
