# Commerce + Tagada + GEN — Staging / Production Config (Phase 12F.1)

Non-secret variable **names** only. Never commit secret values.

## Supabase projects

| Environment | Supabase ref |
|---|---|
| Staging | `mxvaxkkwrbwhqasnsjpm` |
| Production | `bsgtuuzwgeetsjjdrtrm` |

## Tagada / Kashu (Edge secrets)

| Variable | Purpose |
|---|---|
| `TAGADA_API_KEY` | Server Tagada API auth |
| `TAGADA_API_BASE` | Tagada API base URL |
| `TAGADA_STORE_ID` | Store binding |
| `TAGADA_CHECKOUT_URL` | Hosted checkout base (allowlisted) |
| `TAGADA_WEBHOOK_SECRET` | HMAC for `tagada-webhook` |

## GEN Health (Edge secrets — never `VITE_*`)

| Variable | Default | Purpose |
|---|---|---|
| `GEN_HEALTH_ENABLED` | `false` | Master outbound GEN HTTP gate |
| `GEN_HEALTH_BASE_URL` | `https://api.gen-health.app` | GEN API base |
| `GEN_HEALTH_API_KEY` | unset | Server-only GEN key |
| `GEN_HEALTH_WEBHOOK_SECRET` | unset | Future GEN webhook HMAC |
| `GEN_HANDOFF_AUTOMATION_ENABLED` | `false` | Post-paid auto handoff (must stay off until explicitly approved) |
| `GEN_API_ORDERS_ENABLED` | unset / `false` | Production Rx checkout capability: READY/ACTIVE map **and** this flag when `REQUIRE_GEN_MAPPING_FOR_RX` is on. Also required for `markGenOrderPaid` PATCH. Distinct from `GEN_HEALTH_ENABLED` and from payment-status payload flag. Keep `false` until Scriptful/GEN confirms API Orders enablement |
| `GEN_API_ORDERS_PAYMENT_STATUS_ENABLED` | unset / `false` | Only set `true` after GEN enables “API Orders” for the client; otherwise create omits `payment_status` |
| `REQUIRE_GEN_MAPPING_FOR_RX` | staging `false` / prod default true | Rx checkout fail-closed without READY/ACTIVE map |
| `MBM_RUNTIME_ENV` | `staging` / `production` | Runtime marker for commerce policy |

## Commerce safety flags (Edge)

| Variable | Staging | Production | Purpose |
|---|---|---|---|
| `REQUIRE_GEN_MAPPING_FOR_RX` | unset → **false** | unset → **true** (fail-closed) | Block Rx checkout without READY/ACTIVE `gen_sku_map` |
| `GEN_API_ORDERS_ENABLED` | unset → **false** | unset → **false** until GEN enables API Orders | When mapping guard is on, also require API Orders capability for Rx |
| `PRODUCTION_CHECKOUT_TEST_SKU` | unset | unset (set only for controlled 12J.0 live test) | Exact one MBM Rx SKU (e.g. `MBM-RP-BPC-INJ-001`). Temporarily bypasses GEN map + API Orders gates for **that SKU only** (payment validation). Does **not** enable GEN handoff or other Rx. Remove after test. |
| `MBM_RUNTIME_ENV` | `staging` (recommended) | `production` (recommended) | Explicit runtime marker (preferred over URL heuristics) |

`REQUIRE_GEN_MAPPING_FOR_RX` always wins when set (`true` / `false`).  
When that guard is on, production Rx also requires `GEN_API_ORDERS_ENABLED=true` (default false), **unless** the cart is exactly the single `PRODUCTION_CHECKOUT_TEST_SKU` allowlist (Phase 12J.0 payment-only).  
Accessories / non-Rx still sell without GEN mapping.  
Visits / labs keep existing workflows.

Do not conflate:

- `GEN_HEALTH_ENABLED` — GEN HTTP integration present
- `GEN_API_ORDERS_ENABLED` — client may use API Orders / external-paid checkout path
- `GEN_API_ORDERS_PAYMENT_STATUS_ENABLED` — may send nested `order.payment_status="paid"`

Website catalog alignment (Phase 12I.3): `docs/PHASE_12I3_WEBSITE_CATALOG_ALIGNMENT.md`.

## Frontend (public)

| Variable | Notes |
|---|---|
| `VITE_SUPABASE_URL` | Project URL only |
| `VITE_SUPABASE_ANON_KEY` | Anon key only |
| `VITE_KASHU_CARD_ENABLED` | Card gate; unset defaults ON |
| `VITE_GEN_CLINICAL_UI_ENABLED` | Portal clinical next-steps shell only — **not** a GEN API secret |
| `VITE_GEN_API_ORDERS_ENABLED` | UX-only storefront mirror (`Coming soon` vs Available). **Never** trusted by server guards |

## Shipping (authoritative MBM cents)

`0` / `3000` / `5000` only. Demo Tagada `1156` is **not** authorized in repo or production.

## Staging QA artifacts (DO NOT PROMOTE TO PROD)

| Artifact | ID / value | Class |
|---|---|---|
| Demo Store | `store_27201ef9c0b4` | KEEP FOR STAGING QA |
| Test flow | `flow_9474c6c86f76` | KEEP FOR STAGING QA |
| Test processor | `processor_a78cf10f354b` | KEEP FOR STAGING QA |
| QA SKU | `MBM-QA-TAGADA-DEMO-001` | KEEP FOR STAGING QA (DB map only — not storefront catalog) |
| QA order | `MBM-QA-12E7D-001` | KEEP FOR STAGING QA |
| Demo webhook | `whe_755a478e5398` | KEEP FOR STAGING QA |
| Staging-only Edge helpers | `gen-health-qa-patient`, `gen-health-qa-patient-probe`, `gen-health-qa-order-probe`, `gen-health-list-products` | STAGING-ONLY — do not deploy to production |
| Phase 12I PATH B fixtures | `fixture_12i_tx_NOT_REAL_TAGADA_*`, `@example.com`, `PHASE_12I_FIXTURE_NOT_REAL_TAGADA_PAYMENT` | KEEP FOR STAGING QA — never treat as Tagada payment |
| Phase 12I.1 blocker | GEN API Orders not enabled → `order.payment_status` HTTP 400; GEN order stays `pending_payment`/`unpaid` | See `docs/PHASE_12I1_GEN_EXTERNAL_PAID_RESOLUTION.md` |

## Architecture reminder

- **MBM** = commerce / order / storefront authority  
- **Tagada** = payment authority (webhook marks paid)  
- **GEN Health** = clinical / provider / pharmacy authority (handoff automation off)
- Cutover plan: `docs/PHASE_12I_STAGING_E2E_AND_PRODUCTION_CUTOVER.md`
- GEN create shape: `{ patient_id, order: { clientProductId, transactionId } }`; omit `payment_status` unless API Orders enabled
- Never persist GEN magic-login / token URLs
