# Product & Membership Admin System

A database-backed catalog admin for My Bare Method, at **`/admin/catalog`** (aliases: `/admin`, `/admin/products`, `/admin/memberships`, `/admin/sync`, …). Server-side writes and Stripe sync run in Supabase Edge Functions; the browser never sees a secret key.

## Architecture

> **Database: this project uses Bolt Database, which is backed by Supabase.** It is accessed as a normal Supabase project through the `@supabase/supabase-js` client (browser) and Supabase Edge Functions (server). Do **not** create a separate/second external Supabase project — use Bolt's connected Supabase backend. Bolt injects the frontend variables and Supabase auto-provides the server variables (see Prerequisites).

- **Single source of truth (code):** `src/lib/catalog/catalog.ts` normalizes the storefront catalog (`src/data/products.ts`) into products/variants/memberships in **integer cents**. It drives validation, dry-run, sync, tests, and the DB seed — so the storefront and admin never diverge.
- **Database:** Bolt/Supabase tables `catalog_products`, `catalog_variants`, `catalog_memberships`, `stripe_sync_log`, `admin_audit_log`, `processed_stripe_events`, plus an `admins` table + `is_admin()`. Migrations: `supabase/migrations/20260806090000_catalog_admin_schema.sql` (schema + RLS) and `20260806090100_seed_catalog.sql` (idempotent seed).
- **Authorization:** enforced in the UI (`useAdminSession`), in **RLS** (only `is_admin()` may write catalog rows; storefront may read only visible/active rows), and in **every server action** (the `stripe-sync` edge function verifies the caller is an admin before doing anything).
- **Admin UI:** `src/admin/AdminApp.tsx` — Dashboard, Products, Memberships, Categories, Future Releases, Stripe Sync, Sync History, Audit History.

> In an environment without Supabase configured, the admin renders a **read-only preview** from the local catalog and disables persistence/sync (clearly labeled). Connect Supabase (below) to enable full admin.

## Prerequisites (one-time, done by the owner)

1. **Connect Supabase in Bolt** (Bolt's built-in Supabase backend) — do not create a separate external Supabase project. Bolt automatically injects `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` into the frontend; you do not paste these into source code, and you never put a service-role key in the browser.
2. Apply migrations (via Bolt's Supabase migrations / `supabase db push`, or run the two migration SQL files in order).
3. Create a Supabase Auth user for yourself, then add your user id to `admins`:
   `insert into public.admins (user_id, email) values ('<your-auth-user-uuid>', '<you@example.com>');`
4. **The only secrets you configure manually** are the Stripe ones, added as Edge Function secrets: `STRIPE_SECRET_KEY_TEST` (test/admin sync; falls back to `STRIPE_SECRET_KEY` if that is what the environment already has) and `STRIPE_WEBHOOK_SECRET_TEST` (webhook; falls back to `STRIPE_WEBHOOK_SECRET`). The server Supabase variables `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are **auto-provided to Edge Functions by Supabase** — do not hand-set them, do not copy them into frontend code, and never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. **Never commit secret values.**
5. Deploy the edge functions: `stripe-sync`, `stripe-webhook`.

## How to…

- **Sign in as an admin:** visit `/admin`, sign in with your Supabase Auth email/password. Non-admins get "Access denied"; anonymous users get a sign-in form. (RLS blocks non-admin writes regardless of the UI.)
- **Create a product:** Products → (in a Supabase-connected deployment) add a row; set name, slug (unique), category, description, image + alt, visibility, status, launch phase/campaign for future items, and required-review flags.
- **Create variants:** in the product editor, each variant has form, strength, size, one-time price (dollars, stored as cents), and sort order. Prices are validated (no negative; no $0 active unless allowed; unique variant keys).
- **Hide or activate a product:** toggle Visibility / set Status `active`↔`future`. Hidden/future products are excluded from the storefront by RLS and by `syncableProducts()`.
- **Create a future release:** set Status `future`, Visibility off, and (optionally) launch phase + campaign theme. It appears under **Future Releases** only. Flip to `active` + visible to launch.
- **Edit a membership:** Memberships → edit name, price, billing interval (monthly), initial term, locked-rate, included formulations, maximum included formulation, description, visibility. Validation blocks a guaranteed-prescription flag and requires a monthly interval + positive price.
- **Preview Stripe changes:** Stripe Sync → **Preview Stripe Sync (dry-run)**. Produces the change plan (no writes, no secrets). The page also shows an offline first-sync plan even without Supabase.
- **Sync to Stripe test mode:** Stripe Sync → **Sync to Stripe Test** (admins only). Calls the `stripe-sync` edge function which creates/updates TEST objects idempotently and writes IDs + a `stripe_sync_log` entry back.
- **Review sync errors / history:** **Sync History** (`stripe_sync_log`) and **Audit History** (`admin_audit_log`).

## Safety

- No hard-delete of Stripe or catalog records — use **hide/archive** (visibility/status; Stripe prices are archived, never deleted).
- Validation warns before hiding a product used in checkout and before changing an amount already linked to a Stripe Price (a new Price is created instead of overwriting).
- Wholesale cost / markup / pharmacy-source / profit data is **not** stored in any catalog table.
