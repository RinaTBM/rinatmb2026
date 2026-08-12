# Provider Appointment Automation — Phase 5 publish status

**Date:** 2026-08-12  
**Production source:** `deploy/ach-launch-clean-2026` @ `b590760`  
**Approved content:** provider automation through Phase 4 + deploy marker `PROVIDER-APPT-2026-08-12-1`

## Pre-publish

| Check | Result |
| --- | --- |
| Branch clean / synced | YES (then marker commits) |
| `npm test` | 218 PASS |
| `npm run typecheck` | PASS |
| `npm run lint` | 0 errors |
| `npm run build` | PASS |

## Publish attempt

| Item | Result |
| --- | --- |
| Hosting | Bolt.new → Netlify (`site-dns.bolt.host`) |
| Cursor Bolt login | **BLOCKED** (sign-in required) |
| Live site updated | **NO** (still `ACH-LAUNCH-2026-08-10-1` / `index-Dz67ZosD.js`) |
| Git ready for Bolt sync | YES — `deploy/ach-launch-clean-2026` @ `b590760` |
| Disposable Bolt mirrors synced | YES — `release/my-bare-method-final-2026` + `deploy/my-bare-method-integrated-2026` force-updated to same tip |

## Owner action required

In Bolt.new (project that serves https://mybaremethod.com):

1. Sign in.
2. Sync / pull latest from GitHub branch **`deploy/ach-launch-clean-2026`** (commit `b590760`).
3. **Publish** to production custom domain `mybaremethod.com`.
4. Confirm live JS contains marker **`PROVIDER-APPT-2026-08-12-1`**.

Do **not** enable Kashu card. Do **not** change Airwallex/processor. Do **not** call CrossTx.

After publish is confirmed, resume Phase 5 live post-publish QA.
