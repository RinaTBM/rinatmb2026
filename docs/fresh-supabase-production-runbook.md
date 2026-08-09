# Fresh Supabase Production Runbook

**Source branch:** `production-source/my-bare-method-prelaunch-final-2026`  
**Source commit:** `0bd65f6`  
**Tag:** `my-bare-method-prelaunch-final-v1`

This document describes the **exact migration order and bootstrap steps** for a **brand-new Supabase project** matching the pre-launch source at `0bd65f6`.

> **Safety:** This runbook is documentation only. Do **not** apply migrations, deploy Edge Functions, configure Stripe, or mutate a live database from Cursor unless an explicit owner approval says so. Do not force-push Bolt-controlled branches.

---

## 1) Preconditions (before SQL)

1. Create / connect a Supabase project (Bolt-connected or standalone fresh project).
2. Enable Auth providers needed by the app:
   - **Google** (required for Product Admin + customer Google sign-in)
   - **Email** (required for customer email signup / login / password reset)
3. Configure Auth URL settings:
   - Site URL = production origin
   - Additional Redirect URLs must include:
     - `{origin}/admin/auth/callback`
     - `{origin}/account/auth/callback`
     - `{origin}/account/reset-password` (password recovery redirect)
4. Configure Google OAuth Client ID/Secret in Supabase Auth → Providers → Google.
5. Register Google redirect URI: `https://<PROJECT-REF>.supabase.co/auth/v1/callback`.
6. Do **not** expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.

---

## 2) Migration order (exact)

Apply every file under `supabase/migrations/` in filename / timestamp order. For a fresh project that is:

| # | Filename |
|---|---|
| 1 | `20260729050749_create_stripe_products_table.sql` |
| 2 | `20260729055028_20260729060000_lock_down_stripe_products_writes.sql.sql` |
| 3 | `20260729055033_20260729060001_drop_stripe_products_write_policies.sql.sql` |
| 4 | `20260806090000_catalog_admin_schema.sql` |
| 5 | `20260806090100_seed_catalog.sql` |
| 6 | `20260806100000_admin_auth.sql` |
| 7 | `20260807020000_purchase_savings_strategy.sql` |
| 8 | `20260807210000_customer_profiles.sql` |
| 9 | `20260807220000_customer_orders.sql` |

After SQL migrations, run verification: `docs/fresh-supabase-verification.sql`.

---

## 3) Migration detail

### 1. `20260729050749_create_stripe_products_table.sql`

| Field | Detail |
|---|---|
| **Purpose** | Create `stripe_products` lookup used by checkout Edge Function to map app product IDs → Stripe product/price IDs. |
| **Tables created** | `stripe_products` |
| **Columns added** | `id`, `app_product_id` (unique), `stripe_product_id`, `stripe_price_id` (nullable), `name`, `price` (cents), `is_recurring`, `updated_at` |
| **Functions created/updated** | None |
| **RLS policies** | Enable RLS. `anon_read_stripe_products` (SELECT to anon+authenticated). Temporary always-true INSERT/UPDATE/DELETE policies for anon+authenticated (`service_write_*` / `service_update_*` / `service_delete_*`) — removed by migration #3. |
| **Dependencies** | None (first migration). |
| **Additive?** | Yes (`CREATE TABLE IF NOT EXISTS`, policy recreate). |
| **Expects seed data?** | No rows inserted. Table starts empty until Stripe sync / legacy seed function populates it. |
| **Required for** | Product Admin: **partial** (admin catalog uses separate tables; checkout mapping uses this). Google Admin Auth: no. Customer Phase 1: no. Customer Phase 2 / Orders-Tracking: **yes for paid checkout → webhook orders**. Membership logic: **yes for membership Stripe price lookup**. Accessory member discount: no (pricing authorized in checkout function; Stripe row still needed to charge accessories). |

---

### 2. `20260729055028_20260729060000_lock_down_stripe_products_writes.sql.sql`

| Field | Detail |
|---|---|
| **Purpose** | Documentation-only migration describing why write policies on `stripe_products` must be dropped. |
| **Tables created** | None |
| **Columns added** | None |
| **Functions created/updated** | None |
| **RLS policies** | None applied in this file (comment block only). |
| **Dependencies** | Conceptually depends on migration #1 existing. |
| **Additive?** | Yes / no-op SQL. |
| **Expects seed data?** | No. |
| **Required for** | Keep in order for history fidelity. Functional lockdown happens in #3. Not specifically required for Product Admin / Auth / Accounts / Membership / Accessory discount beyond preserving sequence. |

---

### 3. `20260729055033_20260729060001_drop_stripe_products_write_policies.sql.sql`

| Field | Detail |
|---|---|
| **Purpose** | Remove client write access to `stripe_products`. Writes remain service-role only (RLS bypass). |
| **Tables created** | None |
| **Columns added** | None |
| **Functions created/updated** | None |
| **RLS policies** | Drops `service_write_stripe_products`, `service_update_stripe_products`, `service_delete_stripe_products`. Keeps SELECT policy from #1. |
| **Dependencies** | #1 (table + policies must exist). |
| **Additive?** | Policy-tightening (safe; no row deletes). |
| **Expects seed data?** | No. |
| **Required for** | Security baseline for all Stripe-backed checkout. Not feature-specific beyond securing the lookup table. |

---

### 4. `20260806090000_catalog_admin_schema.sql`

| Field | Detail |
|---|---|
| **Purpose** | Product/Membership Admin schema, admin role table, sync/audit/webhook idempotency tables, `is_admin()` helper, RLS. |
| **Tables created** | `admins`, `catalog_products`, `catalog_variants`, `catalog_memberships`, `stripe_sync_log`, `admin_audit_log`, `processed_stripe_events` |
| **Columns added** | Full create definitions (see file). Notable: separate `stripe_*_test` / `stripe_*_live` columns on catalog tables; money in integer cents. |
| **Functions created/updated** | `public.is_admin()` (SECURITY DEFINER; initial version = any `admins` row for `auth.uid()`). `public.set_updated_at()` trigger function. Triggers on catalog product/variant/membership updates. |
| **RLS policies** | RLS enabled on all tables above. Policies: `admins_select`; public read for visible/active catalog; admin ALL on catalog; admin read on sync/audit logs; **no client policies** on `processed_stripe_events` (service role only). |
| **Dependencies** | Requires `auth.users` (Supabase Auth). Extension `pgcrypto`. Independent of `stripe_products` data. |
| **Additive?** | Yes (`IF NOT EXISTS` / `CREATE OR REPLACE`). |
| **Expects seed data?** | No admin rows and no catalog rows yet (seed is next). |
| **Required for** | Product Admin: **yes**. Google Admin Auth: **yes** (`admins` + `is_admin()`). Customer Phase 1: **yes** (reuses `is_admin()` / `set_updated_at()`). Customer Phase 2 / Orders: **yes** (`is_admin()`, `set_updated_at()`, `processed_stripe_events`). Membership logic: **yes** (`catalog_memberships`). Accessory member discount: **indirect** (catalog product rows / admin editing). |

---

### 5. `20260806090100_seed_catalog.sql`

| Field | Detail |
|---|---|
| **Purpose** | Idempotent catalog seed generated from normalized catalog (`scripts/gen-seed-sql.ts`). Upserts products, variants, memberships. |
| **Tables created** | None |
| **Columns added** | None |
| **Functions created/updated** | None |
| **RLS policies** | None |
| **Dependencies** | **Requires #4** (`catalog_products`, `catalog_variants`, `catalog_memberships`). |
| **Additive?** | Yes (`INSERT … ON CONFLICT DO UPDATE` by slug / `(product_id, variant_key)`). |
| **Expects seed data?** | **This file IS the seed.** Seeds all catalog products (including hidden/future) and memberships (`m1` Semaglutide $19900, `m2` Tirzepatide $24900, plus retained elite membership row). Does **not** seed `stripe_products` or `admins`. |
| **Required for** | Product Admin: **yes** (DB-backed catalog). Google Admin Auth: no. Customer Phase 1/2: no. Membership logic: **yes for DB membership prices**. Accessory member discount: **partial** (accessory catalog rows exist; eligibility flags refined in #7). |

---

### 6. `20260806100000_admin_auth.sql`

| Field | Detail |
|---|---|
| **Purpose** | Google admin auth hardening: active-admin gate. |
| **Tables created** | None |
| **Columns added** | `admins.is_active` (bool, default true), `admins.updated_at` |
| **Functions created/updated** | Replaces `public.is_admin()` so it requires `is_active = true`. Adds `trg_admins_updated` using `set_updated_at()`. |
| **RLS policies** | None new; existing policies that call `is_admin()` inherit active-admin requirement. |
| **Dependencies** | **Requires #4** (`admins`, `is_admin()`, `set_updated_at()`). |
| **Additive?** | Yes (`ADD COLUMN IF NOT EXISTS`, `CREATE OR REPLACE`). |
| **Expects seed data?** | No. **Manual first-admin bootstrap required after Google user exists** (see §5). |
| **Required for** | Product Admin: **yes**. Google Admin Auth: **yes**. Customer Phase 1/2 admin support reads: **yes**. Orders admin portal: **yes**. Membership / accessory discount: no (auth gate only). |

---

### 7. `20260807020000_purchase_savings_strategy.sql`

| Field | Detail |
|---|---|
| **Purpose** | Persist Active Wellness / Auto-Refill discount settings and per-product eligibility; cancellation request + reporting tables. |
| **Tables created** | `store_purchase_settings`, `cancellation_requests`, `purchase_reporting_snapshots` |
| **Columns added** | On `catalog_products`: `auto_refill_eligible`, `member_pricing_eligible`, `excluded_from_discounts`. Settings defaults: member 15%, auto-refill 10%. |
| **Functions created/updated** | None |
| **RLS policies** | RLS on new tables. Admin ALL on settings/cancellations/reporting. Public INSERT on `cancellation_requests`. |
| **Dependencies** | **Requires #4** (catalog + `is_admin()`). Prefer after #5/#6 so seed rows get eligibility updates and active-admin gate is final. |
| **Additive?** | Yes. Also runs category-based `UPDATE` on `catalog_products` eligibility flags. |
| **Expects seed data?** | Inserts default `store_purchase_settings` row `id='default'`. Updates existing catalog eligibility from category rules (provider-care + accessories → excluded; active non-excluded → auto-refill + member eligible; future → auto-refill false). |
| **Required for** | Product Admin: **yes** (discount settings / eligibility flags). Google Admin Auth: no. Customer Phase 1/2: no. Orders/Tracking: no. Membership logic: **yes** (store discount defaults; membership base prices remain in catalog/frontend). Accessory member discount: **partial** — DB has general `member_pricing_eligible`, but accessory-specific 15% rule also lives in frontend (`accessoryMemberDiscount*`) + checkout Edge Function constant; this migration’s category UPDATE marks accessories `member_pricing_eligible=false` / `excluded_from_discounts=true`, so admin DB flags for accessories may need intentional review after seed if Product Admin is used as source of truth for accessory eligibility. |

---

### 8. `20260807210000_customer_profiles.sql`

| Field | Detail |
|---|---|
| **Purpose** | Customer Account Phase 1 profiles (contact only; no medical fields). |
| **Tables created** | `customer_profiles` |
| **Columns added** | `id`, `user_id` (unique → `auth.users`), `first_name`, `last_name`, `email`, `phone`, `created_at`, `updated_at` |
| **Functions created/updated** | None new; trigger uses existing `public.set_updated_at()`. |
| **RLS policies** | Enable RLS. Customers SELECT/INSERT/UPDATE own row (`user_id = auth.uid()`). Admins SELECT via `is_admin()`. No customer DELETE. |
| **Dependencies** | **Requires #4** (`set_updated_at`, `is_admin`) and ideally **#6** so `is_admin()` is active-admin aware. |
| **Additive?** | Yes. |
| **Expects seed data?** | No. Profiles created at signup/sign-in by the app. |
| **Required for** | Product Admin: no. Google Admin Auth: no. Customer Account Phase 1: **yes**. Phase 2: **yes** (account prerequisite). Orders/Tracking: optional join/display. Membership / accessory discount: no. |

---

### 9. `20260807220000_customer_orders.sql`

| Field | Detail |
|---|---|
| **Purpose** | Customer Account Phase 2 orders + fulfillment + events + admin notes. |
| **Tables created** | `orders`, `order_items`, `order_fulfillment`, `order_status_events`, `order_admin_notes`; sequence `order_number_seq` |
| **Columns added** | Full create definitions (customer refs, Stripe ids, money cents, shipping flags, fulfillment/tracking, admin notes). |
| **Functions created/updated** | `public.generate_public_order_number()` → `MBM-YYYY-######`. Triggers on `orders` / `order_fulfillment` use `set_updated_at()`. |
| **RLS policies** | Customers SELECT own orders/items/fulfillment; SELECT own **customer_visible** status events. Admins ALL on all five tables. **No customer policies on `order_admin_notes`**. Customers cannot insert/update/delete orders (webhook/service role). |
| **Dependencies** | **Requires #4** (`set_updated_at`, `is_admin`, `auth.users`). Prefer after **#6** and **#8**. Uses `processed_stripe_events` from #4 for webhook idempotency (table already exists). |
| **Additive?** | Yes. |
| **Expects seed data?** | No. Orders created by `stripe-webhook` on `checkout.session.completed`. |
| **Required for** | Product Admin: no. Google Admin Auth: no (but admin portal uses `is_admin()`). Customer Phase 1: no. Customer Phase 2: **yes**. Orders / Tracking: **yes**. Membership / accessory discount: no. |

---

## 4) Feature → migration matrix

| Feature | Required migrations |
|---|---|
| Product Admin | #4, #5, #6, #7 (+ Stripe sync for Stripe IDs) |
| Google Admin Auth | #4, #6 (+ Auth Google provider + first-admin insert) |
| Customer Account Phase 1 | #4, #6, #8 (+ Auth email/Google) |
| Customer Account Phase 2 | #4, #6, #8, #9 |
| Orders / Tracking | #4 (`processed_stripe_events`), #6, #9 + Edge Functions `create-checkout-session` + `stripe-webhook` + `#1–#3` for checkout price lookup |
| Membership logic | App constants + #4/#5 (`catalog_memberships`) + #7 (`store_purchase_settings` 15/10). Stripe membership prices via sync into catalog/`stripe_products`. |
| Accessory member discount | Primarily **app + `create-checkout-session`** (15%, non-stacking). DB support via #7 eligibility columns / Product Admin. No dedicated accessory-discount migration exists at `0bd65f6`. |

---

## 5) Seed scripts required after migrations

| Step | What | When |
|---|---|---|
| Catalog seed | Already included as migration **#5** `20260806090100_seed_catalog.sql` | Apply in migration order |
| Regenerate seed (optional, if catalog TS changes) | `scripts/gen-seed-sql.ts` → rewrite seed SQL, then re-apply seed migration | Dev only; not required for fresh project using committed seed |
| Stripe product/price mapping | Populate `stripe_products` **and/or** catalog Stripe test IDs via Edge Function | Required before real TEST checkout works |
| Preferred admin sync | Deploy + call **`stripe-sync`** (admin JWT required) | After first admin exists |
| Legacy seed function | **`sync-stripe-products`** exists and can upsert `stripe_products` from hardcoded seeds | Legacy/fallback; prefer `stripe-sync` for Product Admin flow |

**Not a SQL seed:** membership prices $199/$249/$350 and accessory 15% are also enforced in TypeScript + checkout Edge Function constants.

---

## 6) First-admin bootstrap (required)

After migrations and Google Auth are configured:

1. Open `/admin/login` and **Continue with Google** once (expect Access Denied). This creates `auth.users`.
2. Copy the user UUID from Supabase → Authentication → Users.
3. Run in SQL editor:

```sql
insert into public.admins (user_id, email, is_active)
values ('<your-auth-user-uuid>', '<you@example.com>', true)
on conflict (user_id) do update
  set is_active = true,
      email = excluded.email;
```

4. Reload `/admin/catalog` — authorized admin UI should load.
5. Revoke later (non-destructive):

```sql
update public.admins set is_active = false where email = '<person@example.com>';
```

Details also documented in `docs/google-admin-auth-setup.md`.

---

## 7) Edge Functions that must be deployed

Deploy all four functions present under `supabase/functions/` for a complete TEST checkout + admin sync + order persistence stack:

| Function | Required for | Notes |
|---|---|---|
| `create-checkout-session` | Checkout → Stripe Checkout Session; accessory member unit authorization; order metadata snapshots | TEST keys only (refuses live secret keys) |
| `stripe-webhook` | Order upsert on `checkout.session.completed`; refund status updates; idempotent via `processed_stripe_events` | Signature verification required |
| `stripe-sync` | Product Admin Stripe TEST sync / preview; writes catalog Stripe IDs + sync log | Requires caller JWT + active admin |
| `sync-stripe-products` | Legacy/hardcoded Stripe product seed into `stripe_products` | Keep available for recovery/bootstrap; prefer `stripe-sync` for ongoing admin |

Deploying functions does **not** by itself create Stripe objects or charge cards.

---

## 8) Environment variables / secrets

### Frontend (browser) — required

| Name | Required? | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | **Yes** | Supabase project URL for auth, account, admin, checkout function invoke |
| `VITE_SUPABASE_ANON_KEY` | **Yes** | Public anon key (RLS-enforced) |
| `VITE_STRIPE_PUBLISHABLE_KEY_TEST` | Optional | Publishable TEST key if/when client Stripe.js is used; checkout currently goes through Edge Function |

Never put service-role or Stripe secret keys in `VITE_*`.

### Edge Functions — auto-provided by Supabase

| Name | Required? | Purpose |
|---|---|---|
| `SUPABASE_URL` | **Yes** | Platform-provided |
| `SUPABASE_ANON_KEY` | **Yes** for `stripe-sync` admin JWT verification (`VITE_SUPABASE_ANON_KEY` accepted only as fallback) | Platform-provided |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Server DB writes (sync, webhook order upsert, stripe_products writes). **Never expose to browser.** |

### Edge Function secrets — configure manually

| Name | Required by | Purpose |
|---|---|---|
| `STRIPE_SECRET_KEY_TEST` | `create-checkout-session`, `stripe-webhook`, `stripe-sync`, `sync-stripe-products` (preferred) | Stripe TEST/restricted secret. Functions fall back to `STRIPE_SECRET_KEY` if present. Live keys refused by test guards. |
| `STRIPE_SECRET_KEY` | Fallback only | Backward-compatible fallback for TEST tooling |
| `STRIPE_WEBHOOK_SECRET_TEST` | `stripe-webhook` (preferred) | Stripe TEST webhook signing secret |
| `STRIPE_WEBHOOK_SECRET` | Fallback only | Backward-compatible webhook secret fallback |

### Auth provider secrets (Supabase dashboard, not Edge Function env)

| Name | Where | Purpose |
|---|---|---|
| Google OAuth Client ID | Supabase Auth → Providers → Google | Admin + customer Google login |
| Google OAuth Client Secret | Supabase Auth → Providers → Google | Admin + customer Google login |

### Explicitly out of scope for this fresh-project SQL bootstrap

- Live Stripe keys (`*_LIVE`) — not required for fresh TEST bootstrap; do not configure unless a separate live-release checklist is approved.
- Applying migrations from Cursor.
- Running live payment operations.

---

## 9) Recommended owner apply sequence (checklist)

1. Create fresh Supabase project / connect Bolt Database.
2. Enable Google + Email auth; set Site URL + redirect URLs.
3. Apply migrations **#1 → #9** in order.
4. Run `docs/fresh-supabase-verification.sql`.
5. Sign in once at `/admin/login` with Google; insert first admin row.
6. Set frontend `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
7. Deploy Edge Functions listed in §7.
8. Set Edge secrets: `STRIPE_SECRET_KEY_TEST`, `STRIPE_WEBHOOK_SECRET_TEST`.
9. Configure Stripe TEST webhook → `stripe-webhook` URL.
10. As admin, run `stripe-sync` (or carefully use legacy `sync-stripe-products`) to populate Stripe IDs / `stripe_products`.
11. Smoke-test: admin catalog, customer signup/login/profile, TEST checkout, webhook order appearance, tracking update.

---

## 10) Confirmation notes for operators

- Migration filenames with doubled `.sql.sql` suffixes are real repo filenames; apply as-is.
- File #2 is effectively a no-op comment; keep it for ordering compatibility.
- Customer/account/order migrations are marked pending in their headers historically; for a **fresh** project they are part of the required ordered set.
- Accessory 15% member benefit does **not** have its own SQL migration at this commit; do not expect an `accessory_member_discount_percent` column in `store_purchase_settings`.
- Membership flat rates ($199 / $249) and Tirzepatide 30mg member-only ($350) are enforced in application pricing code in addition to seeded catalog membership rows.
