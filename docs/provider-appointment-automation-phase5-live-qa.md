# Provider Appointment Automation — Phase 5 live post-publish QA

**Date:** 2026-08-12  
**Live site:** https://mybaremethod.com  
**Production source tip (at QA time):** `deploy/ach-launch-clean-2026` @ `b2cc7a8`  
**Create-invoice-order:** v16 (unchanged; not redeployed this phase)

## Live deploy

| Item | Result |
| --- | --- |
| LIVE DEPLOY VERIFIED | **YES** |
| LIVE BUILD ASSET | `/assets/index-Co1A1eqq.js` |
| LIVE MARKER | **PROVIDER-APPT-2026-08-12-1** |

## Results

| Check | Result |
| --- | --- |
| Catalog 27 / 2 / 52 | PASS |
| Tesamorelin $149 / Fat Burner $259 / Lash-Brow $89 | PASS |
| INITIAL $75 | PASS |
| SAME-DOSE NONE | PASS |
| DOSE-CHANGE $55 | PASS |
| NEW-THERAPY $75 | PASS |
| GUEST RX auth | PASS |
| ACH | PASS |
| WIRE | PASS |
| ADMIN + Record Approval + CrossTx manual | PASS |
| Fulfillment guard | PASS |
| Memberships fulfillment SKU rule | PASS |
| Security / RLS / client bypass | PASS |
| Mobile | PASS |
| Kashu card frontend | **OFF** |
| Stripe storefront | **NO** |
| QA data cleaned | **YES** |
| Real customer data modified | **NO** |
| Ready for live provider automation | **YES** |

## Constraints honored

- No redeploy of Edge Functions this phase  
- No Kashu card enablement  
- No CrossTx API calls  
- No Stripe storefront invocation  
- No processor/payment-flow changes  
