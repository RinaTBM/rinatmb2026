# Google Admin Sign-In — Setup & Operations

The My Bare Method Product Admin (`/admin/catalog`) is protected by **Supabase Auth (Google OAuth)** on top of **Bolt Database (backed by Supabase)**. Signing in with Google is **not** sufficient — only Google accounts explicitly listed as **active** rows in the `admins` table can access admin features. Authorization is enforced in three layers: the UI route guard, Supabase **Row Level Security**, and the **`stripe-sync` Edge Function**.

> This project uses Bolt's connected Supabase backend — do **not** create a separate external Supabase project.

## How Google Sign-In works

1. Visitor opens `/admin/catalog` (or `/admin`). If not signed in, the guard redirects to **`/admin/login`**.
2. `/admin/login` shows the My Bare Method logo, "Administrator Sign In", a "Continue with Google" button, and a restricted-access notice.
3. The button calls:
   ```ts
   supabase.auth.signInWithOAuth({
     provider: 'google',
     options: { redirectTo: `${window.location.origin}/admin/auth/callback` },
   });
   ```
4. Google authenticates the user and redirects back to **`/admin/auth/callback`**. The Supabase client establishes the session automatically.
5. The callback verifies the session, reads the verified email + user id, and checks whether the user id is an **active** admin:
   - **Authorized** → redirect to `/admin/catalog`.
   - **Signed in but not an admin** → "Access denied" (admin UI never rendered).
   - **OAuth error** → error screen with a link back to `/admin/login`.
6. A **Sign Out** button in the admin sidebar ends the session and returns the visitor to `/admin/login`.

Routes: **login `/admin/login`**, **callback `/admin/auth/callback`**, **admin `/admin/catalog`** (sections: products, memberships, categories, future, sync, sync-history, audit). All `/admin/*` routes carry `noindex, nofollow` and are absent from public nav, footer, sitemap, and structured data.

## 1) Enable Google auth in Bolt/Supabase

In the Supabase dashboard for your Bolt-connected project → **Authentication → Providers → Google** → enable it. You will paste a Google **Client ID** and **Client Secret** (next step).

## 2) Configure the Google OAuth client

Google Cloud Console → **APIs & Services → Credentials → Create OAuth client ID → Web application**:
- **Authorized JavaScript origins:** your site origin(s), e.g. `https://your-app.bolt.host` and (for local preview) `http://localhost:5173`.
- **Authorized redirect URIs:** the **Supabase callback URL** (below). This is the Supabase auth callback, not your app route.
- Copy the generated **Client ID** and **Client Secret** into Supabase → Auth → Providers → Google.

## 3) The exact Supabase callback URL

Supabase → **Authentication → Providers → Google** shows the callback to register in Google:
```
https://<YOUR-PROJECT-REF>.supabase.co/auth/v1/callback
```
Add that exact URL to Google's **Authorized redirect URIs**.

## 4) Configure authorized redirect URLs (app-side)

Supabase → **Authentication → URL Configuration**:
- **Site URL:** your production origin (e.g. `https://your-app.bolt.host`).
- **Additional Redirect URLs:** add both app callback routes so `redirectTo` is allowed:
  - Production admin callback: `https://your-app.bolt.host/admin/auth/callback`
  - Local preview callback: `http://localhost:5173/admin/auth/callback`

## 5) Authorize your Google user as the FIRST admin

1. Sign in once with Google at `/admin/login`. You'll get "Access denied" (expected — not yet an admin). This creates your user in `auth.users`.
2. Find your user id: Supabase → **Authentication → Users** → copy the UUID for your email.
3. Insert an active admin row (Supabase SQL editor):
   ```sql
   insert into public.admins (user_id, email, is_active)
   values ('<your-auth-user-uuid>', '<you@example.com>', true)
   on conflict (user_id) do update set is_active = true, email = excluded.email;
   ```
4. Reload `/admin/catalog` — you now have access.

## 6) Revoke admin access (non-destructive)

```sql
update public.admins set is_active = false where email = '<person@example.com>';
```
The row is preserved (audit trail); the user immediately loses admin access in the UI, RLS, and Edge Functions.

## 7) Test unauthorized access

- **Anonymous:** open `/admin/catalog` in a private window → redirected to `/admin/login`.
- **Authenticated non-admin:** sign in with a Google account not in `admins` → "Access denied"; the admin UI never renders and RLS/Edge Functions reject writes.
- Automated unit tests cover these decisions (`src/lib/auth/adminAccess.test.ts`).

## 8) Sign out

Click **Sign out** in the admin sidebar (or on the Access Denied screen). The session is cleared and you are returned to `/admin/login`.

## 9) How RLS and Edge Functions protect admin actions

- **RLS:** `catalog_products` / `catalog_variants` / `catalog_memberships` allow writes only when `public.is_admin()` is true; `is_admin()` requires an **active** `admins` row for `auth.uid()`. The storefront may read only visible/active rows. Logs (`stripe_sync_log`, `admin_audit_log`) are admin-read only; `processed_stripe_events` is service-role only.
- **Edge Function (`stripe-sync`):** validates the caller's Supabase access token via `/auth/v1/user`, then confirms an **active** admin row before any Stripe preview/test/dry-run/sync or catalog Stripe write. Missing/invalid JWT → 401; non-admin/revoked → 403.
- **Webhook (`stripe-webhook`):** intentionally **not** behind Google login — it is protected by **Stripe signature verification** (raw body + `Stripe-Signature` + `STRIPE_WEBHOOK_SECRET_TEST`) and idempotent event storage.

## Environment variables

- Frontend (injected by Bolt): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Edge Functions (auto-provided by Supabase): `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Never expose the service-role key to the browser.
- Manually set (Edge Function secrets): `STRIPE_SECRET_KEY_TEST`, `STRIPE_WEBHOOK_SECRET_TEST` (see `docs/stripe-sync-guide.md`).
- **No secret values are committed.** Google Client Secret lives only in Supabase Auth settings.

## Migration

`supabase/migrations/20260806100000_admin_auth.sql` adds `is_active` + `updated_at` to `admins` and makes `is_admin()` require an active admin. Apply it via Bolt's Supabase migrations (or `supabase db push`).
