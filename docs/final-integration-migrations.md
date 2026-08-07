# Pending migrations — ordered safety report

**Status:** NOT APPLIED in this integration. Files are present in the repo for owner/Bolt application later.

Existing Bolt/website migrations already on the storefront base:

| Order | Filename | Additive? | Affects `stripe_products`? | Deletes/modifies records? |
|---|---|---|---|---|
| 1 (already present) | `20260729050749_create_stripe_products_table.sql` | Yes (CREATE) | Creates table | No |
| 2 (already present) | `20260729055028_20260729060000_lock_down_stripe_products_writes.sql.sql` | Yes (policies) | RLS only | No data deletes |
| 3 (already present) | `20260729055033_20260729060001_drop_stripe_products_write_policies.sql.sql` | Policy change | RLS only | Drops write policies; no row deletes |

New migrations introduced by admin/Google-auth work (apply in this order after the three above):

| Order | Filename | Objects created or changed | Additive? | Affects existing `stripe_products` data? | Deletes or modifies existing records? |
|---|---|---|---|---|---|
| 4 | `20260806090000_catalog_admin_schema.sql` | `admins` table; `is_admin()`; `catalog_products`, `catalog_variants`, `catalog_memberships`; sync/audit log tables; `set_updated_at` trigger helper; RLS policies | **Yes** (`CREATE TABLE IF NOT EXISTS`, `CREATE OR REPLACE` function) | **No** — does not ALTER or DELETE from `stripe_products` | **No** row deletes. `CREATE OR REPLACE is_admin()` replaces function body only. |
| 5 | `20260806090100_seed_catalog.sql` | Idempotent `INSERT … ON CONFLICT DO UPDATE` into `catalog_*` tables from normalized catalog | **Yes** (upsert by slug / variant key) | **No** — seeds `catalog_*` only, not `stripe_products` | Updates matching `catalog_*` rows by conflict key; does not delete. Does not touch customers/subscriptions. |
| 6 | `20260806100000_admin_auth.sql` | `admins.is_active`, `admins.updated_at`; `is_admin()` requires `is_active = true`; `trg_admins_updated` | **Yes** (`ADD COLUMN IF NOT EXISTS`, replace function, trigger) | **No** | **No** deletes. Existing `admins` rows preserved; new columns default `is_active=true`, `updated_at=now()`. |
| 7 | `20260807020000_purchase_savings_strategy.sql` | `store_purchase_settings`; eligibility columns on `catalog_products`; `cancellation_requests`; `purchase_reporting_snapshots`; RLS | **Yes** (`CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`) | **No** | Updates eligibility flags on `catalog_*` only from category rules. No Stripe / customer deletes. Live Stripe untouched. |

### Explicit non-targets

These migrations must **not** alter:

- Product / membership / catalog **storefront** TypeScript (already handled in app code)
- Live Stripe objects
- Customer or subscription tables/data
- Existing `stripe_products` row contents (schema migrations above do not rewrite those rows)

### Recommended apply sequence (owner / Bolt SQL editor)

1. Confirm backups / snapshot of the Bolt-connected Supabase project.
2. Apply `20260806090000_catalog_admin_schema.sql`.
3. Apply `20260806090100_seed_catalog.sql`.
4. Apply `20260806100000_admin_auth.sql`.
5. Verify: `admins.is_active`, `admins.updated_at`, `is_admin()` contains `is_active = true`, admin row count unchanged.
