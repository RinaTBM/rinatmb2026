# Production Source Reconciliation — 2026-08-12

## Merge order (executed)

Base: `origin/deploy/ach-launch-clean-2026` (`34b5d13`)

1. **PR #8** `cursor/lash-brow-growth-serum-rename-945c` — includes PR #7 publish commit (Tesamorelin + Fat Burner + Lash/Brow rename).  
2. **PR #12** `cursor/kashu-phase2-webhook-backend-945c` — Kashu Phase 2 backend/docs (no catalog display conflict with #8; only `AGENTS.md` auto-merged).  
3. **PR #13** `cursor/launch-readiness-qa-945c` — `/shop` alias, remove Stripe sample HTML, QA docs.

PR #7 alone was **not needed** (already contained in #8).  
PR #9/#10/#11 content is contained in #12 ancestry.

## Additional fix on reconcile tip

- Home Auto-Refill bullet updated from “Monthly automatic deliveries” → scheduled monthly refills paid by ACH/wire invoice (no auto-billing implication).

## Kashu card

- Frontend: no `VITE_KASHU_CARD_ENABLED`; checkout methods remain `manual_ach` / `manual_wire` only.  
- Backend: present; card must stay disabled until Kashu assigns final processor.  
- Airwallex Tagada entry: temporary/test — do not modify.

## Intended production tip

Merge this branch into `deploy/ach-launch-clean-2026` (normal merge, no force push, no deploy from this task).
