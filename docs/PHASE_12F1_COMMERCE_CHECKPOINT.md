# Phase 12F.1 — Commerce cleanup, productionization & checkpoint

**Branch:** `deploy/ach-launch-clean-2026`  
**Start HEAD:** `5473777fa21c54f084ca86b330ea03f93c7152eb`  
**Production touched:** NO  
**GEN auto-handoff:** OFF

See also: `docs/COMMERCE_STAGING_PRODUCTION_CONFIG.md`, `docs/PHASE_12F_PRODUCT_PURCHASE_READINESS.md`.

## File inventory (12B–12F)

| Path | Class |
|---|---|
| `docs/genhealth-migration-matrix.*` | DOC / KEEP |
| `docs/GEN_HEALTH_V2_INTEGRATION_DESIGN.md` | DOC / KEEP |
| `docs/GEN_HEALTH_V2_SCHEMA_DRAFT.sql` | DOC / KEEP |
| `docs/PHASE_12F_PRODUCT_PURCHASE_READINESS.md` | DOC / KEEP |
| `docs/COMMERCE_STAGING_PRODUCTION_CONFIG.md` | DOC / KEEP |
| `src/lib/commerce/*` | KEEP |
| `src/lib/genHealth/*` | KEEP (scaffolding; defaults disabled) |
| `src/lib/orders/adminStatusBadges*` | KEEP |
| `src/lib/payments/tagadaWebhookCorrelation*` | KEEP / TEST FIXTURE |
| `supabase/functions/_shared/genHealth*` | KEEP |
| `supabase/functions/_shared/commerceEnvPolicy.ts` | KEEP |
| `supabase/functions/_shared/tagadaWebhookCorrelation.ts` | KEEP |
| `supabase/functions/gen-health-handoff` | KEEP (scaffold; disabled) |
| `supabase/functions/gen-health-webhook` | KEEP (fail-closed) |
| `supabase/functions/gen-health-qa-patient` | STAGING-ONLY |
| `supabase/functions/gen-health-qa-patient-probe` | REMOVE from commit / STAGING-ONLY local |
| `supabase/functions/get-order-payment-status` | KEEP |
| `supabase/migrations/20260821120000_gen_health_v2.sql` | KEEP (additive; **do not apply to production** in this phase) |
| Demo shipping `1156` in create-kashu | REMOVED from staging deploy + rejected in repo |

## Production Rx GEN guard

- Env: `REQUIRE_GEN_MAPPING_FOR_RX` + `MBM_RUNTIME_ENV`
- Production default: **fail-closed** (Rx needs READY/ACTIVE `gen_sku_map`)
- Staging default: open for commerce testing
- Wired in `create-invoice-order` when guard is on
- Accessories/non-Rx unaffected

## Temp Demo shipping

**REMOVED** — staging `create-kashu-checkout-session` redeployed from clean workspace; invoice auth rejects `1156` / `demo_store_forced_shipping`.

## QA SKU

`MBM-QA-TAGADA-DEMO-001` — staging DB map only. **Not** in production catalog / local storefront product logic.
