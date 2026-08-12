# Provider Appointment Automation — Phase 3 (BSG apply + controlled QA)

**Date:** 2026-08-12  
**Branch:** `cursor/provider-appointment-automation-2026` @ `a02daca`  
**Target:** BSG `bsgtuuzwgeetsjjdrtrm`  
**Frontend published:** NO  
**Kashu card enabled:** NO  
**CrossTx called:** NO  
**Stripe touched:** NO  

## Migration

| Item | Result |
| --- | --- |
| File | `supabase/migrations/20260812120000_provider_appointment_automation.sql` |
| Safe (additive only) | **YES** |
| Applied to BSG | **YES** |
| Schema verified | **YES** |
| Existing orders intact | **YES** (14 orders pre/post) |

## Edge Function

| Function | Deployed | Version |
| --- | --- | --- |
| `create-invoice-order` | YES | **16** |
| Other functions | Not redeployed | — |

## Controlled QA

Temporary QA users/emails tagged `qa-provider-auto-20260812` only. No real customer PHI. All QA rows deleted after tests.

| Test | Result |
| --- | --- |
| INITIAL ($75 IPV) | PASS |
| SAME-DOSE (NONE) | PASS |
| DOSE INCREASE (FOLLOW_UP $55) | PASS |
| DOSE DECREASE (FOLLOW_UP $55) | PASS |
| NEW THERAPY ($75 IPV) | PASS |
| NEGATIVE HISTORY | PASS |
| MULTI-PRODUCT collapse/dedupe | PASS |
| CLIENT BYPASS | PASS |
| GUEST RX AUTH | PASS |
| ADMIN DISPLAY | PASS |
| MANUAL CROSSTX STATUS | PASS |
| RECORD PROVIDER APPROVAL | PASS |
| SUPERSEDE HISTORY | PASS |
| FULFILLMENT GUARD | PASS |
| ACH E2E | PASS |
| WIRE E2E | PASS |
| KASHU STRUCTURAL | PASS |
| MEMBERSHIP FULFILLMENT SKU | PASS |
| RLS SECURITY | PASS |
| TEST DATA CLEANED | YES |
| REAL CUSTOMER DATA MODIFIED | NO |

## Validation

- `npm test` — 218 passed  
- `npm run typecheck` — pass  
- `npm run lint` — 0 errors (pre-existing warnings only)  
- `npm run build` — pass  

## Next

Safe for owner review / merge of provider automation code. **Do not publish frontend** until explicitly approved.
