# Stripe Sync Guide

Stripe owns payment objects (Products/Prices). The catalog/display metadata lives in **Bolt Database (backed by Supabase)**. Sync is **one-way** (catalog → Stripe), explicit, idempotent, and **TEST-only** in this task.

> **This project uses Bolt's connected Supabase backend — not a separate external Supabase project.** Do not create a second Supabase project.

## Environment variables (names only — never commit values)

**Frontend — injected by Bolt (do not hand-set or paste into code):** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, optional `VITE_STRIPE_PUBLISHABLE_KEY_TEST`.

**Server Supabase vars — auto-provided to Edge Functions by Supabase (do not hand-set; never expose to the browser):** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. `SUPABASE_SERVICE_ROLE_KEY` must **never** reach browser code.

**Manually configured secrets (the only ones you set) — Edge Function secrets:** `STRIPE_SECRET_KEY_TEST`, `STRIPE_WEBHOOK_SECRET_TEST`.

Secret lookup order by component (no live-key fallback in test code; live keys are refused regardless):

| Component | Secret it reads |
| --- | --- |
| `supabase/functions/stripe-sync` (admin/test sync) | `STRIPE_SECRET_KEY_TEST`, then `STRIPE_SECRET_KEY` |
| `supabase/functions/stripe-webhook` | `STRIPE_WEBHOOK_SECRET_TEST`, then `STRIPE_WEBHOOK_SECRET` |
| `scripts/stripe-sync-test.ts`, `scripts/stripe-verify-test.ts` | `STRIPE_SECRET_KEY_TEST`, then `STRIPE_SECRET_KEY` |
| `supabase/functions/create-checkout-session` (existing checkout) | `STRIPE_SECRET_KEY` (unchanged, for backward compatibility) |
| `supabase/functions/sync-stripe-products` (legacy seed) | `STRIPE_SECRET_KEY` (unchanged) |

`stripe-sync` reads the caller's Supabase anon key as `SUPABASE_ANON_KEY` (with `VITE_SUPABASE_ANON_KEY` only as a backward-compatible fallback) purely to verify the caller's session; the **service-role key is used only for authorized server-side database operations, never for caller authentication**.

Where to configure:
- **Bolt / Supabase Edge Functions:** add the `STRIPE_*` secrets in Supabase → Edge Functions → Secrets (the Supabase vars are already auto-provided).
- **Local CLI scripts:** `.env.local` (git-ignored) or your shell — see `.env.example`.

Prefer a **restricted** Stripe TEST key limited to: Products (write), Prices (write), Checkout Sessions (write), Customers (read), Subscriptions (read), Billing Portal (only if used). Broader scopes are unnecessary.

## Test vs live

- All tooling here targets **test** mode and **refuses any live key** (`sk_live_`/`rk_live_` throw `LiveKeyRefusedError`). Test/live Stripe IDs are stored in separate columns (`*_test` / `*_live`) so they never collide.

## How Product & Price IDs are stored

- After a successful sync, `stripe_product_id_test` (products/memberships) and `stripe_price_id_test` (variants/memberships) are written back to Supabase. The storefront checkout resolves the correct **test** Price ID for the selected variant / chosen membership.
- Mapping is anchored by Stripe **metadata**: `app=my-bare-method`, `catalog_entity_type`, `catalog_entity_id`/`catalog_slug`, `catalog_variant_key`, `price_fingerprint`, `environment=test`, `schema_version=1`.

## Why new Prices instead of editing amounts

Stripe Price amounts are immutable. When an amount/currency/interval/billing-type changes, the sync **creates a new Price** and, only **after** the replacement is created and stored, **archives** the old Price (`active:false`). Historical Prices are preserved; existing customer subscriptions are never migrated, canceled, or altered.

## Idempotency & duplicate prevention

- Deterministic **fingerprints** (`priceFingerprint`, `productFingerprint`) and **Stripe idempotency keys** (`Idempotency-Key`) make every create retry-safe.
- Before creating a Product, the sync searches by stored id and by `catalog_slug`+`environment` metadata. Before creating a Price, it checks for an existing **active** Price on the product matching `price_fingerprint`. The same request never creates duplicate Products/Prices.
- Memberships get **exactly one** recurring monthly Price each ($199 / $249). Doses are provider-directed and are **never** modeled as selectable subscription Prices.

## Commands

- `npm run catalog:validate` — validate the catalog (no network).
- `npm run stripe:sync:test:dry-run` — print the change plan (no writes; no secrets printed). Uses live Stripe state when a test key is present, otherwise an offline first-sync plan.
- `npm run stripe:sync:test` — apply to Stripe **test** mode (requires `STRIPE_SECRET_KEY_TEST`).
- `npm run stripe:verify:test` — verify products/prices exist, membership amounts are $199/$249 monthly, and there are no duplicates.

## Webhooks

- Endpoint: the `stripe-webhook` Edge Function. Configure the Stripe **test** webhook to point at its URL and set `STRIPE_WEBHOOK_SECRET_TEST`.
- The function verifies the signature against the **raw** body + `Stripe-Signature` header + the environment secret (see `src/lib/stripe/verifySignature.ts`, unit-tested), rejects invalid/expired signatures, and records each `event_id` in `processed_stripe_events` so duplicates are ignored. Only the events the app needs are handled. No medical/intake detail is stored in Stripe.
