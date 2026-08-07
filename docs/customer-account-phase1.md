# Customer Account Portal — Phase 1

Secure customer authentication and account dashboard for My Bare Method.

**Branch:** `source-of-truth/customer-account-phase1-2026`  
**Tag:** `customer-account-phase1-v1`  
**Do not deploy / merge / apply migrations from Cursor.**

---

## Architecture

- **Storefront:** Vite + React + TypeScript
- **Auth:** Supabase Auth (browser anon client only — see `src/lib/supabaseClient.ts`)
- **Database:** Bolt Database backed by Supabase
- **Customer session:** `CustomerAuthProvider` (`src/context/CustomerAuthContext.tsx`)
- **Admin session:** unchanged Google + `admins` / `is_admin()` (`src/admin/useAdminSession.ts`, `src/lib/auth/adminAccess.ts`)

Customer authentication and admin authorization are **separate**. A user may be both customer and admin; roles are not mutually exclusive. Customer Google Sign-In never grants admin access.

---

## Customer auth methods

1. **Email + password** — sign up / sign in via Supabase Auth  
2. **Google Sign-In** — OAuth via Supabase; redirects to `/account/auth/callback`  
3. **Password reset** — Supabase `resetPasswordForEmail` → `/account/reset-password`

Passwords are never stored by the app. No custom password tables.

Magic-link may remain available if already enabled in Supabase; it is not required for Phase 1.

---

## Routes

| Path | Access | Purpose |
| --- | --- | --- |
| `/account/login` | Public | Welcome Back — email/password + Google |
| `/account/signup` | Public | Create Your Account |
| `/account/auth/callback` | Public | OAuth / email confirmation callback |
| `/account/reset-password` | Public (recovery session) | Set new password |
| `/account` | Authenticated | Dashboard overview |
| `/account/profile` | Authenticated | Edit profile |
| `/account/orders` | Authenticated | Coming Soon |
| `/account/membership` | Authenticated | Coming Soon |
| `/account/auto-refill` | Authenticated | Coming Soon |
| `/account/requests` | Authenticated | Coming Soon |

**Unchanged admin routes:** `/admin/login`, `/admin/auth/callback`, `/admin/catalog` (and related admin pages).

Customer navigation never links to admin routes. After customer OAuth, users land on `/account` even if they are also admins.

---

## Profile schema

Table: `customer_profiles` (see migration plan)

Preferred fields: `id`, `user_id`, `first_name`, `last_name`, `email`, `phone`, `created_at`, `updated_at`.

Identity key: **Supabase Auth `user.id`**, not email alone.

No medical fields.

---

## RLS summary

Customers may:

- SELECT / INSERT / UPDATE their own `customer_profiles` row (`user_id = auth.uid()`)

Customers may not:

- Read/update another customer's profile
- Access admin records
- Modify catalog / Stripe sync / audit logs via this feature

Active admins may SELECT profiles via `is_admin()` for support.

Full SQL: `supabase/migrations/20260807210000_customer_profiles.sql`  
Plan: `docs/customer-account-phase1-migration-plan.md`

---

## Admin / customer separation

| Actor | `/account` | `/admin/catalog` |
| --- | --- | --- |
| Anonymous | Redirect → login | Redirect / blocked |
| Customer (non-admin) | Allowed | Access Denied |
| Active admin | Allowed if desired | Allowed |
| Authenticated non-admin | Allowed | Access Denied |

Frontend gates are UX only. Admin still requires server-side `is_admin()` / active `admins` row. Customer data protected by RLS.

---

## SEO

All `/account/*` pages set `robots` to `noindex, nofollow` (`useAccountNoIndex`).  
Prerender sitemap generation skips `/account/*`. Account routes are not in the public prerender route list.

---

## Header

Minimal account icon (`UserRound`) in the public header:

- Signed out → `/account/login`
- Signed in → `/account`

No text-heavy “Customer Portal” CTA in primary nav.

---

## Manual Bolt / Supabase setup required

### 1. Apply migration (after review)

Apply `supabase/migrations/20260807210000_customer_profiles.sql` in Bolt/Supabase. **Do not apply from Cursor.**

### 2. Auth redirect URLs

Add to Supabase Auth redirect allow-list:

- `{SITE_URL}/account/auth/callback`
- `{SITE_URL}/account/reset-password`
- Keep existing `{SITE_URL}/admin/auth/callback`

Set Site URL appropriately for each environment.

### 3. Email provider

Enable Email auth (email + password). Configure confirmation email template if confirmation is required.

### 4. Google OAuth

Enable Google provider for customers (may share the same Google OAuth client as admin login).

**Implication:** Completing Google Sign-In creates/uses a Supabase Auth user and customer session only. Admin access still requires an active row in `admins`. Customer Google login must not be treated as admin authorization.

### 5. Password reset

Configure reset email template. Redirect must land on `/account/reset-password` so the recovery session can call `updateUser({ password })`.

### 6. Environment variables (storefront)

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Never expose `SUPABASE_SERVICE_ROLE_KEY` or Stripe secrets to the browser.

---

## Testing instructions

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Unit coverage lives in `src/lib/auth/customerAccess.test.ts` (and existing `adminAccess.test.ts`):

- Anonymous redirect intent for `/account`
- Customer vs admin catalog separation
- Profile allowlist / forbidden medical fields
- Sitemap exclusion / noindex
- Password-reset public path
- Admin authorization unchanged

Manual checks after Supabase config:

1. Sign up with email + password → land on `/account` (or confirm email first).
2. Sign out → `/account` redirects to login.
3. Sign in with Google as a non-admin → `/account` works; `/admin/catalog` Access Denied.
4. Active admin Google → `/admin/catalog` works; `/account` also works.
5. Forgot password → email received → reset page updates password.
6. Profile save updates own `first_name` / `last_name` / `phone` only.

---

## Future Phase 2 extension points

- Orders history + tracking integrations  
- Membership management / switching  
- Auto-Refill controls  
- Refill / pause / cancellation request workflows  
- Prescription approval (with privacy review)  
- Provider messaging / clinical notes (separate security design)  
- Live Stripe customer linkage (reviewed release process)

Do not store health information in `customer_profiles`.
