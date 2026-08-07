# Customer Account Phase 1 — Migration Plan

**Status:** PENDING — do not apply from Cursor. Review in Bolt/Supabase before applying.

**Migration file:** `supabase/migrations/20260807210000_customer_profiles.sql`

**Additive:** Yes  
**Existing data modified:** No (no UPDATE/DELETE on existing tables; no catalog/admin/Stripe changes)

---

## Tables created

| Table | Purpose |
| --- | --- |
| `public.customer_profiles` | Basic customer contact/profile data keyed by Supabase Auth `user_id` |

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | `gen_random_uuid()` |
| `user_id` | `uuid` UNIQUE NOT NULL | FK → `auth.users(id)` ON DELETE CASCADE; authoritative identity key |
| `first_name` | `text` NOT NULL DEFAULT `''` | Editable by customer |
| `last_name` | `text` NOT NULL DEFAULT `''` | Editable by customer |
| `email` | `text` NOT NULL DEFAULT `''` | Display/sync from Auth; not edited via profile form |
| `phone` | `text` nullable | Optional; editable by customer |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Maintained by existing `set_updated_at()` trigger |

**Not created / not stored:** diagnosis, medical history, symptoms, prescriptions, labs, provider notes, Stripe IDs, membership status, admin flags.

---

## Indexes

- `customer_profiles_user_id_idx` on `user_id`
- `customer_profiles_email_idx` on `email`

---

## Functions changed

- None created or altered.
- Reuses existing `public.set_updated_at()` for the `updated_at` trigger.
- Reuses existing `public.is_admin()` for admin read policy only.

---

## RLS policies created

| Policy | Command | Who | Rule |
| --- | --- | --- | --- |
| `customer_profiles_select_own` | SELECT | `authenticated` | `user_id = auth.uid()` |
| `customer_profiles_insert_own` | INSERT | `authenticated` | `user_id = auth.uid()` |
| `customer_profiles_update_own` | UPDATE | `authenticated` | `using` + `with check`: `user_id = auth.uid()` |
| `customer_profiles_admin_select` | SELECT | `authenticated` | `public.is_admin()` |

**Not granted to customers:** DELETE on profiles; any write on `admins`, catalog, Stripe sync, audit logs.

**Admin write policies:** Unchanged. This migration does not add admin UPDATE/INSERT/DELETE on `customer_profiles` beyond existing patterns elsewhere.

---

## Impact on existing systems

| Area | Impact |
| --- | --- |
| Admin Google auth / `admins` / `is_admin()` | None |
| Catalog / products | None |
| Stripe sync | None |
| Existing auth users | None until they sign in and a profile row is inserted |
| Existing rows in other tables | Not modified |

---

## Apply checklist (manual Bolt/Supabase)

1. Review SQL in staging/Bolt project.
2. Confirm `public.set_updated_at()` and `public.is_admin()` already exist (admin auth migration).
3. Apply migration once approved.
4. Verify RLS with two test users (own read/update OK; cross-user denied).
5. Do not apply from this Cursor session.
