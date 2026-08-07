# Bolt/Supabase Clarification & Stripe Secret Handling — Summary

Scope: documentation clarifications + Stripe env-var consistency only. **No** database architecture change, **no** schema/RLS/admin-auth change, **no** product/membership value change, **no** checkout-behavior change, **no** Stripe object touched, **no** live sync run.

## Files changed

| File | Change |
| --- | --- |
| `docs/product-admin-system.md` | States the project uses **Bolt Database (backed by Supabase)**; clarified prerequisites (Bolt injects frontend vars, Supabase auto-provides server vars, only `STRIPE_*` set manually, never expose service-role key, never commit secrets). |
| `docs/stripe-sync-guide.md` | Rewrote the env-var section: Bolt-connected Supabase (no separate project), frontend-injected vs server auto-provided vars, and a **per-component Stripe secret lookup table**. |
| `.env.example` | Annotated that Bolt injects `VITE_SUPABASE_*` and Supabase auto-provides server `SUPABASE_*` to Edge Functions (don't hand-set), service-role key never in browser, only `STRIPE_*` set manually, documented lookup order. |
| `supabase/functions/stripe-sync/index.ts` | Test key lookup `STRIPE_SECRET_KEY_TEST` → `STRIPE_SECRET_KEY` (guard still refuses live keys); comment clarifying anon-key preference + that service-role is never used for caller auth. |
| `supabase/functions/stripe-webhook/index.ts` | Webhook secret lookup `STRIPE_WEBHOOK_SECRET_TEST` → `STRIPE_WEBHOOK_SECRET`. |
| `scripts/stripe-sync-test.ts` | Key lookup `STRIPE_SECRET_KEY_TEST` → `STRIPE_SECRET_KEY` (live keys refused by client guard). |
| `scripts/stripe-verify-test.ts` | Same key lookup fallback. |

## Documentation clarifications

- The project uses **Bolt's connected Supabase backend**; a **separate external Supabase project should not be created**.
- Bolt injects `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` for the frontend.
- Supabase automatically provides `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions.
- Those server Supabase variables must not be copied into frontend code; `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to the browser.
- The only manually configured secrets are the `STRIPE_*` secrets.
- Secret values must never be committed.

## Stripe secret lookup behavior by function

| Component | Secret name(s) accepted (in order) |
| --- | --- |
| `supabase/functions/stripe-sync` (admin/test sync) | `STRIPE_SECRET_KEY_TEST`, then `STRIPE_SECRET_KEY` |
| `supabase/functions/stripe-webhook` | `STRIPE_WEBHOOK_SECRET_TEST`, then `STRIPE_WEBHOOK_SECRET` |
| `scripts/stripe-sync-test.ts` | `STRIPE_SECRET_KEY_TEST`, then `STRIPE_SECRET_KEY` |
| `scripts/stripe-verify-test.ts` | `STRIPE_SECRET_KEY_TEST`, then `STRIPE_SECRET_KEY` |
| `supabase/functions/create-checkout-session` (existing checkout) | `STRIPE_SECRET_KEY` — **unchanged** (backward compatible) |
| `supabase/functions/sync-stripe-products` (legacy seed) | `STRIPE_SECRET_KEY` — **unchanged** |

- **No live-key fallback** was added to any test code: `assertTestKey()` / `StripeTestClient` refuse `sk_live_`/`rk_live_` keys regardless of which variable supplied them.
- **anon-key:** `stripe-sync` prefers `SUPABASE_ANON_KEY` with `VITE_SUPABASE_ANON_KEY` only as a backward-compatible fallback, used solely to verify the caller's session. The **service-role key is used only for authorized server-side DB operations, never for caller authentication**.

## Backward-compatibility preserved

- Existing checkout (`create-checkout-session`) and legacy `sync-stripe-products` still read `STRIPE_SECRET_KEY` — unchanged, so the currently deployed Bolt environment is not broken.
- New test/admin code adds `STRIPE_SECRET_KEY_TEST` preference **without removing** `STRIPE_SECRET_KEY` support (fallback), so no secret was renamed in a breaking way.

## Test results

- `npm run typecheck` → PASS (0 errors).
- `npm run lint` → PASS (0 errors; 4 pre-existing react-refresh warnings).
- `npm run test` (Vitest) → 16/16 PASS.
- `npm run build` → PASS (client + SSR prerender).

## Confirmations

- **No database migration changed** (`supabase/migrations/` clean).
- **No Stripe object or subscription was touched**; **no live sync ran**.
- **No product or membership values changed** (`src/data/products.ts` unchanged).
- **No secret files added**; `.env*` remain git-ignored (only `.env.example` placeholders tracked).
- **Bolt Database/Supabase architecture unchanged** — still Bolt's connected Supabase, accessed via the direct Supabase client + Edge Functions.
