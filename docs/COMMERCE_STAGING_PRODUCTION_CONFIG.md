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
| `GEN_HANDOFF_AUTOMATION_ENABLED` | `false` | Post-paid auto handoff (must stay off until 12G+) |

## Commerce safety flags (Edge)

| Variable | Staging | Production | Purpose |
|---|---|---|---|
| `REQUIRE_GEN_MAPPING_FOR_RX` | unset → **false** | unset → **true** (fail-closed) | Block Rx checkout without READY/ACTIVE `gen_sku_map` |
| `MBM_RUNTIME_ENV` | `staging` (recommended) | `production` (recommended) | Explicit runtime marker (preferred over URL heuristics) |

`REQUIRE_GEN_MAPPING_FOR_RX` always wins when set (`true` / `false`).  
Accessories / non-Rx still sell without GEN mapping.  
Visits / labs keep existing workflows.

## Frontend (public)

| Variable | Notes |
|---|---|
| `VITE_SUPABASE_URL` | Project URL only |
| `VITE_SUPABASE_ANON_KEY` | Anon key only |
| `VITE_KASHU_CARD_ENABLED` | Card gate; unset defaults ON |
| `VITE_GEN_CLINICAL_UI_ENABLED` | Portal clinical next-steps shell only — **not** a GEN API secret |

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
| Staging-only Edge helpers | `gen-health-qa-patient`, `gen-health-qa-patient-probe` | STAGING-ONLY — do not deploy to production |

## Architecture reminder

- **MBM** = commerce / order / storefront authority  
- **Tagada** = payment authority (webhook marks paid)  
- **GEN Health** = clinical / provider / pharmacy authority (handoff automation off)
