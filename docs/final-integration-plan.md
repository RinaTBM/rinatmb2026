# Final Integration Plan — Website Storefront + Admin/Catalog/Google Auth

## Critical branch note (read first)

| Ref | Commit | What it actually is |
|---|---|---|
| `origin/website-improvements` | `5a0b578` (“Start repository”) | **Source of truth for the public storefront UX** (Header/Footer/Home/Provider Care/Accessories/mobile nav, etc.). |
| `origin/google-admin-auth-2026` | `8c494d3` (“Start repository”) | **Force-updated by Bolt.** Tree is **identical** to `origin/website-improvements` (`git diff` = **0 files**). **Do not use this remote branch as the source of admin/catalog/Google-auth work.** |
| **Local** `google-admin-auth-2026` tip / commit **`9435f67`** | `9435f67` (“Add protected Google admin sign-in”) | **Real technical work** lives here: product admin UI, catalog utilities, Stripe sync Edge Functions + CLI, Google admin login, migrations, docs, vitest, `.env.example`, and catalog relaunch data model. |

```
# Verified
git diff --name-status origin/website-improvements origin/google-admin-auth-2026   # empty
git diff --name-status origin/website-improvements 9435f67                        # full inventory below
```

**Integration goal:** Keep the public storefront from `origin/website-improvements`, then **import ADD-only technical files from `9435f67`**, and **manually reconcile** the overlapping `M` files so catalog/variant/membership/auth wiring lands without wiping website UX.

**Ancestry caveat:** `9435f67` is **not** a descendant of `5a0b578` (rewritten roots: `2c19fc7` vs `5a0b578`). Treat this as a **content merge / cherry-pick by path**, not a clean `git merge`.

Command used for this inventory:

```bash
git diff --name-status origin/website-improvements 9435f67
```

---

## A) Public storefront features on `website-improvements` that must remain

Base: `origin/website-improvements` @ `5a0b578`. These UX surfaces must not be replaced by the thinner nav/copy/catalog relaunch present on `9435f67`.

### Homepage
- **File:** `src/pages/HomePage.tsx`
- **Keep website sections:** Hero, Shop by Concern, Shop by Category, Best Sellers, Memberships vs One-Time Purchase, How It Works, **Accessories**, Why Us, FAQs, Email signup.
- **Key related data:** `src/data/products.ts` (`concerns`, `sections`, `memberships`, `getBestSellers`, `getProductsBySection('accessories')`).

### Header (desktop + mobile)
- **File:** `src/components/Header.tsx`
- **Keep website UX:**
  - “Shop By” mega-menu with nested **Shop by Concern** + **Shop by Category** (`ChevronRight` flyouts).
  - Top-level **Provider Care** → `/section/provider-care`.
  - Top-level **Accessories** → `/section/accessories`.
  - Memberships / Contact / FAQs.
  - Search overlay + cart badge.
  - Mobile drawer: Shop By → Concern/Category expanders; Provider Care; Accessories; secondary links (Best Sellers, One-Time Purchase, About, Refund, Track, Account).
- **Do not** adopt `9435f67`’s flattened “Shop” dropdown that drops Concern flyouts / Provider Care / Accessories links.

### Footer
- **File:** `src/components/Footer.tsx`
- **Keep website links:** Shop All, Memberships, Shop Without a Membership, **Accessories**, Best Sellers, Weight Management, Longevity (`/section/longevity`), HRT for Women (`/section/hrt-women`), Shop-by-Concern list (incl. Sleep & Stress), full Legal & Support column.
- **Related:** logo under `public/images/logo/…`.

### Provider Care / Consultations / Laboratory review
- **Section meta + products:** `src/data/products.ts` — section `provider-care` with subcategories `consultation`, `lab-review`.
- **Products on website:** Initial Provider Consultation, Follow-Up Appointment, Laboratory Review (`requiresIntake: true`).
- **Routes/pages:**
  - `src/pages/SectionPage.tsx` — `/section/provider-care` (icons, disclosures, subcategory grouping).
  - `src/pages/ProductPage.tsx` — provider-care badges / intake copy.
  - `src/pages/ConcernPage.tsx` — provider-guided buckets + memberships.
  - Header/Footer links as above.
- **Checkout intake messaging:** `src/pages/CheckoutPage.tsx` (`hasProviderCare`, “Begin Intake — Invoice After Review”).

### Visit / payment options
- **Cart:** `src/components/CartDrawer.tsx`, `src/context/CartContext.tsx`.
- **Checkout / Stripe redirect:** `src/pages/CheckoutPage.tsx` → `supabase/functions/create-checkout-session/index.ts`.
- **Success / Cancel:** `src/pages/SuccessPage.tsx`, `src/pages/CancelPage.tsx` (identical on both sides — keep website).
- **One-time vs membership paths:** `src/pages/AlaCartePage.tsx` (`/alacarte`), `src/pages/MembershipsPage.tsx` (`/memberships`), Home “Two ways to shop”.

### Accessories
- **Section + SKUs:** `src/data/products.ts` (`section: 'accessories'`, featured bundle, syringes/cases/kits).
- **Images:** `public/images/accessories/*` (and some under `public/images/products/*` via `IMG_*` constants).
- **Surfaces:** Home Accessories section, Header/Footer links, `SectionPage`, `ConcernPage` accessories block, `ProductCard` `object-contain` for accessories.

### Memberships
- **Data (website baseline UI copy):** `src/data/products.ts` `memberships` (Bare GLP-1 / GLP-1/GIP / Elite Wellness — note prices differ from relaunch).
- **Pages:** `src/pages/MembershipsPage.tsx`, `src/pages/MembershipTermsPage.tsx`.
- **Nav:** Header + Footer + Home CTA.

### Shop
- **Shop All:** `src/pages/ShopAllPage.tsx` (`/shop-all`).
- **Sections:** `src/pages/SectionPage.tsx` (`/section/:id`) — website sections: `weight-management`, `longevity`, `hrt-women`, `provider-care`, `research`, `accessories`.
- **Concerns:** `src/pages/ConcernPage.tsx` (`/concern/:id`).
- **Goals:** `src/pages/GoalsPage.tsx`, `src/pages/GoalPage.tsx`.
- **Best sellers:** `src/pages/BestSellersPage.tsx`.
- **Product detail:** `src/pages/ProductPage.tsx`.
- **Product card:** `src/components/ProductCard.tsx`.

### Photos / assets
- `public/images/logo/*`
- `public/images/products/*`
- `public/images/accessories/*`
- Image constants + `getFormImage()` in `src/data/products.ts`.

### Cart / Checkout
- `src/context/CartContext.tsx`
- `src/components/CartDrawer.tsx`
- `src/pages/CheckoutPage.tsx`
- `supabase/functions/create-checkout-session/index.ts` (present on website; unchanged by `9435f67` name-status)

### Intake
- Product flags / copy: `requiresIntake`, provider-reviewed disclosures in `products.ts` + `ProductPage` + `CheckoutPage`.
- Concern/section disclosures for provider-guided fulfillment.

### Legal
- Identical on both sides (keep website as-is):  
  `PrivacyPolicyPage`, `TermsPage`, `RefundPolicyPage`, `ShippingPolicyPage`, `AccessibilityPage`, `ConsumerDataPage`, `ContactPage`, `LegalPageLayout`.
- Membership terms **differs** — see §C (reconcile copy with relaunch pricing while keeping LegalPageLayout pattern).

### Mobile
- Entire mobile drawer + body-scroll lock in `src/components/Header.tsx` (website version).
- Responsive grids on Home / Shop / Section / Concern.

### Public routing shell (website) — must remain
**File:** `src/App.tsx` on `website-improvements`:

- Hash→path redirect on mount.
- `CartProvider` + storefront chrome: `<Header />`, `<main>{renderPage()}</main>`, `<Footer />`, `<CartDrawer />`.
- Public routes (all must stay):

| Path | Page |
|---|---|
| `/`, `''` | `HomePage` |
| `/goals` | `GoalsPage` |
| `/goal/:id` | `GoalPage` |
| `/concern/:id` | `ConcernPage` |
| `/section/:id` | `SectionPage` (+ `?sub=`) |
| `/best-sellers` | `BestSellersPage` |
| `/product/:slug` | `ProductPage` |
| `/checkout` | `CheckoutPage` |
| `/success` | `SuccessPage` |
| `/cancel` | `CancelPage` |
| `/account` | `AccountPage` |
| `/track` | `TrackPage` |
| `/about` | `AboutPage` |
| `/faq` | `FaqPage` |
| `/memberships` | `MembershipsPage` |
| `/alacarte` | `AlaCartePage` |
| `/refund-policy` | `RefundPolicyPage` |
| `/shipping-policy` | `ShippingPolicyPage` |
| `/membership-terms` | `MembershipTermsPage` |
| `/accessibility` | `AccessibilityPage` |
| `/consumer-data` | `ConsumerDataPage` |
| `/contact` | `ContactPage` |
| `/shop-all` | `ShopAllPage` |
| `/privacy-policy` | `PrivacyPolicyPage` |
| `/terms` | `TermsPage` |

Router helper: `src/router.tsx` (identical — keep).

---

## B) Technical features at `9435f67` to import

### Product admin UI (`src/admin/*`)
| Path | Role |
|---|---|
| `src/admin/AdminApp.tsx` | Admin shell: login, OAuth callback, guarded catalog UI (dashboard/products/memberships/categories/future/sync/history/audit). Own chrome (no storefront Header/Footer/Cart). |
| `src/admin/useAdminSession.ts` | Supabase session + Google OAuth + admin flag + `readOAuthError()`. |

**Admin routes (inside `AdminApp`, after App.tsx early return):**
- `/admin/login` — Google sign-in
- `/admin/auth/callback` — OAuth return
- `/admin` and `/admin/catalog` → Dashboard
- `/admin/products`, `/admin/products/:slug`
- `/admin/memberships`, `/admin/categories`, `/admin/future`
- `/admin/sync`, `/admin/sync-history`, `/admin/audit`

### Catalog utilities (`src/lib/catalog/*`)
| Path | Role |
|---|---|
| `src/lib/catalog/catalog.ts` | Normalized catalog (cents) derived from `products.ts` |
| `src/lib/catalog/validate.ts` | Catalog validation |
| `src/lib/catalog/fingerprint.ts` | Fingerprints for sync drift |
| `src/lib/catalog/syncPlan.ts` | Stripe sync plan builder |
| `src/lib/catalog/stripeClient.ts` | Stripe client helpers for scripts/functions |
| `src/lib/catalog/catalog.test.ts` | Vitest coverage |

### Stripe sync
| Path | Role |
|---|---|
| `scripts/catalog-validate.ts` | CLI validate |
| `scripts/gen-seed-sql.ts` | Generate seed SQL |
| `scripts/stripe-sync-test.ts` | Test-mode sync (dry-run / `--apply`) |
| `scripts/stripe-verify-test.ts` | Verify test Stripe vs catalog |
| `supabase/functions/stripe-sync/index.ts` | Edge Function invoked by admin Sync UI |
| `supabase/functions/stripe-webhook/index.ts` | Webhook receiver |
| `src/lib/stripe/verifySignature.ts` (+ `.test.ts`) | Webhook signature verify |

Also **modify** (see §C): `supabase/functions/sync-stripe-products/index.ts` (legacy seed rename for relaunch).

### Google admin login / auth
| Path | Role |
|---|---|
| `src/lib/auth/adminAccess.ts` | Access-state machine (`authorized` / `unauthorized` / …) |
| `src/lib/auth/adminAccess.test.ts` | Unit tests |
| `src/lib/supabaseClient.ts` | Browser anon client (`VITE_SUPABASE_*`) |
| `src/admin/useAdminSession.ts` | OAuth + `admins` table check |
| `src/admin/AdminApp.tsx` | Route guards + UI |
| `docs/google-admin-auth-setup.md` | Ops setup |

### Migrations (`supabase/migrations/*` — ADD at `9435f67`)
| Path | Role |
|---|---|
| `supabase/migrations/20260806090000_catalog_admin_schema.sql` | Catalog admin schema |
| `supabase/migrations/20260806090100_seed_catalog.sql` | Seed catalog |
| `supabase/migrations/20260806100000_admin_auth.sql` | `admins` + RLS / auth helpers |

(Website already has older `20260729*` stripe_products migrations — keep those; add the three above.)

### Docs (ADD from `9435f67`)
- `docs/google-admin-auth-setup.md`
- `docs/product-admin-system.md`
- `docs/stripe-sync-guide.md`
- `docs/stripe-test-results.md`
- `docs/stripe-live-dry-run.md`
- `docs/stripe-live-sync-results.md`
- `docs/live-stripe-release-checklist.md`
- `docs/admin-stripe-audit.md`
- `docs/catalog-relaunch-summary.md`
- `docs/weight-membership-relaunch-summary.md`
- `docs/bolt-supabase-clarification-summary.md`
- `docs/backup/*` (snapshots / patches — reference only)
- `AGENTS.md` (Cursor Cloud notes from that line of work)

### `package.json` script / deps changes (`9435f67`)
**Scripts to add:**
```json
"test": "vitest run",
"test:watch": "vitest",
"catalog:validate": "tsx scripts/catalog-validate.ts",
"stripe:sync:test:dry-run": "tsx scripts/stripe-sync-test.ts",
"stripe:sync:test": "tsx scripts/stripe-sync-test.ts --apply",
"stripe:verify:test": "tsx scripts/stripe-verify-test.ts"
```
**DevDependencies to add:** `tsx`, `vitest`  
**Also refresh:** `package-lock.json` from `9435f67` (or regenerate after installing).

### Vitest config
- `vitest.config.ts` — Node env, `@` alias, `src/**/*.{test,spec}.ts`

### `.env.example`
- `A .env.example` — Bolt/Supabase + Stripe **test** placeholders; documents that live keys are refused by sync tooling.

### Related tooling diffs (not pure ADD)
- `eslint.config.js` — ignore `docs/backup`, `supabase/functions/**`; Node globals for `scripts/**` + config.
- `.gitignore` — `.env.local`, `.env.*.local`, `.env.test`, `.env.production`, `scripts/.stripe-sync-state.test.json`

### `App.tsx` route wiring — what to **add** (do **not** replace public routes)

On `website-improvements` `src/App.tsx`, cherry-pick **only** these `9435f67` additions:

1. Import:
   ```ts
   import { AdminApp } from '@/admin/AdminApp';
   ```
2. **Early return before** storefront chrome / `renderPage()`:
   ```ts
   // Admin area renders with its own chrome (no storefront header/footer/cart).
   if (path === '/admin' || path.startsWith('/admin/')) {
     return <AdminApp route={route} />;
   }
   ```
3. Leave every public `renderPage()` branch and the `CartProvider` + Header/Footer/CartDrawer layout **exactly as on website-improvements**.

**`9435f67` App.tsx vs website:** identical public routes; only the admin import + early return differ (+6 lines).

---

## C) Files modified in BOTH — manual reconciliation

These exist on the website storefront **and** differ at `9435f67`. For each: **keep website UX**, **cherry-pick technical/catalog wiring** from `9435f67` where needed.

| File | Keep from `website-improvements` | Cherry-pick / adapt from `9435f67` |
|---|---|---|
| **`src/App.tsx`** | Entire public `renderPage()` + CartProvider chrome | Admin import + `/admin` early return only |
| **`src/components/Header.tsx`** | Nested Shop By Concern/Category, Provider Care + Accessories links, full mobile drawer | Wire search to relaunch fields (`displayName`/`shortName`/`dosageForms`) **if** products schema is upgraded; optionally drive category list from `sections` **without** dropping Concern flyouts |
| **`src/components/Footer.tsx`** | Accessories + longevity/hrt-women section IDs + fuller concern list + research/provider disclosure wording if still selling those | Only if catalog relaunch is adopted: update section hrefs/labels to new category IDs; update disclosure if research removed |
| **`src/components/CartDrawer.tsx`** | Overall drawer UX | `item.key` line identity; `variantLabel`; `isMembership` monthly copy; `removeItem`/`updateQuantity(key)` API |
| **`src/components/ProductCard.tsx`** | Accessories `object-contain` treatment; website badge layout if still applicable | Relaunch fields: `product.category`, `displayName`, `imageAlt`, `dosageForms`, `startingPrice` / provider badge |
| **`src/context/CartContext.tsx`** | Persistence + open/close behavior | `lineKey`, `variantId`/`variantLabel`/`isMembership`/`billingFrequency`/`key`; key-based remove/update; key backfill from localStorage |
| **`src/data/products.ts`** | **Hardest merge.** Website has Provider Care, Research, Accessories, broad concern map, large SKU set, older `Product` shape (`name`/`section`/`price`) | Relaunch model: `displayName`, `category`, `variants[]`, `startingPrice`, `visibleProducts`, Semaglutide/Tirzepatide memberships @ $199/$249, `PROVIDER_ELIGIBILITY_NOTICE`, `SLUG_ALIASES`. **Decision required:** either (1) port relaunch schema then **re-add** website-only sections (provider-care / accessories / research) onto that schema, or (2) keep website catalog and adapt admin/catalog layer to website shape (more work on `src/lib/catalog/*`). Do **not** drop website Provider Care / Accessories / photos without an explicit product decision. |
| **`src/pages/HomePage.tsx`** | Accessories section; Shop by Concern; richer layout; website trust/FAQ blocks | `visibleMemberships` + `displayName`/`monthlyPrice` if relaunch memberships adopted; fix `/shop`→`/shop-all` CTA (9435 already fixed) while keeping Accessories |
| **`src/pages/MembershipsPage.tsx`** | Website page structure/chrome | Relaunch Semaglutide/Tirzepatide program copy, $199/$249, comparison table, add-to-cart with `isMembership` + `checkoutProductId` |
| **`src/pages/MembershipTermsPage.tsx`** | LegalPageLayout structure | Locked-pricing section; Semaglutide/Tirzepatide $199/$249 bullets; remove “25% off accessories” if accessories discount retired |
| **`src/pages/CheckoutPage.tsx`** | Intake callouts, Stripe redirect flow, variable-pricing TBD UI | Order summary: `item.key`, membership monthly lines, `variantLabel`, “Provider review required” wording |
| **`src/pages/ProductPage.tsx`** | Provider-care / research badges, bundle/FBT blocks, accessories image treatment, intake paragraphs | Variant picker, `displayName`, cart payload with `variantId`/`variantLabel`, `requiresProviderReview`, `PROVIDER_ELIGIBILITY_NOTICE` |
| **`src/pages/ShopAllPage.tsx`** | Simple section filter UX if preferred | `visibleProducts`, category + dosage-form + price-band filters from relaunch |
| **`src/pages/AlaCartePage.tsx`** | Filter that respects `alaCarte` / priced SKUs (don’t dump entire catalog) | Switch data source to `visibleProducts` **with** an equivalent filter once schema lands |
| **`src/pages/SectionPage.tsx`** | Subcategory grouping, accessories featured bundle, research/provider disclosure styling | Category typing, dosage-form filters if relaunch sections lack website subcats |
| **`src/pages/GoalPage.tsx`** | Page as-is (diff is unused import only) | Optional: unused-import cleanup from 9435 |
| **`src/pages/ConcernPage.tsx`** | Split sections: provider-guided / general wellness / research / **accessories**; membership cards UX | Membership `addItem` payload (`displayName`, `monthlyPrice`, `isMembership`, `checkoutProductId`, image) once membership shape updates |
| **`src/pages/AboutPage.tsx`** | Collections including Provider Care + Research Catalog + website section IDs | Only rewrite collection cards if catalog categories officially change |
| **`src/pages/FaqPage.tsx`** | FAQ structure | Rename GLP-1 → Semaglutide / Tirzepatide membership wording if relaunch adopted |
| **`src/pages/AccountPage.tsx`** | Rest of page | Prefer “Start a Subscription” → `/memberships` (9435) over `/section/longevity` |
| **`package.json`** | Existing scripts (`dev`/`build`/`lint`/`typecheck`) | Add test/catalog/stripe scripts + `tsx`/`vitest` deps |
| **`package-lock.json`** | — | Regenerate or take 9435 lockfile after dep add |
| **`.gitignore`** | Existing ignores | Add env + stripe sync state ignores from 9435 |
| **`eslint.config.js`** | Existing React rules | Add ignores + Node globals block from 9435 |
| **`index.html`** | Website meta if still marketing research/accessories | Relaunch keywords/description only if catalog messaging changes |
| **`public/sitemap.xml`** | URLs for provider-care / research / accessories / full concern set / current product slugs | Add any new relaunch section/product URLs; **do not** delete website section URLs that still ship |
| **`scripts/prerender.tsx`** | Route list covering website sections/products | `visibleProducts` / `displayName` / `startingPrice` when schema upgrades; membership description update |
| **`supabase/functions/sync-stripe-products/index.ts`** | Function structure | Relaunch display names + m1/m2 price/name updates (Semaglutide $199 / Tirzepatide $249) |

### Catalog schema conflict (summary)

| | `website-improvements` | `9435f67` |
|---|---|---|
| Sections | `weight-management`, `longevity`, `hrt-women`, **`provider-care`**, **`research`**, **`accessories`** | `weight-management`, `womens-hormone-therapy`, `longevity-cognitive`, `recovery-performance`, `prescription-skin-hair` |
| Product shape | `name`, `section`, `price`, no variants | `displayName`, `category`, `variants[]`, `startingPrice`, visibility/status |
| Memberships | GLP-1 $175 / GLP-1/GIP $225 / Elite $49 | Semaglutide $199 / Tirzepatide $249 / Elite hidden or inactive |
| Accessories / Provider Care SKUs | Present | Removed / emptied (`getAccessoriesForConcern` → `[]`) |

**Recommended merge posture:** storefront chrome + Provider Care + Accessories + photos from website; membership/pricing/variant/admin pipeline from `9435f67`; reintroduce missing website sections onto the relaunch product model (or explicitly document retirement).

---

## D) ADD-only from `9435f67` (safe to copy)

These paths are **Added** vs `origin/website-improvements` — copy as-is (then run migrations / install deps).

```
.env.example
AGENTS.md
vitest.config.ts

docs/admin-stripe-audit.md
docs/bolt-supabase-clarification-summary.md
docs/catalog-relaunch-summary.md
docs/google-admin-auth-setup.md
docs/live-stripe-release-checklist.md
docs/product-admin-system.md
docs/stripe-live-dry-run.md
docs/stripe-live-sync-results.md
docs/stripe-sync-guide.md
docs/stripe-test-results.md
docs/weight-membership-relaunch-summary.md
docs/backup/MembershipTermsPage.pre-membership.tsx
docs/backup/MembershipsPage.pre-membership.tsx
docs/backup/catalog-snapshot-2026-08-05.md
docs/backup/membership-snapshot-2026-08-06.md
docs/backup/pre-admin-worktree.patch
docs/backup/products.original.ts
docs/backup/products.pre-membership.ts
docs/backup/sitemap.original.xml
docs/backup/sync-stripe-products.original.ts

scripts/catalog-validate.ts
scripts/gen-seed-sql.ts
scripts/stripe-sync-test.ts
scripts/stripe-verify-test.ts

src/admin/AdminApp.tsx
src/admin/useAdminSession.ts

src/lib/auth/adminAccess.ts
src/lib/auth/adminAccess.test.ts
src/lib/catalog/catalog.ts
src/lib/catalog/catalog.test.ts
src/lib/catalog/fingerprint.ts
src/lib/catalog/stripeClient.ts
src/lib/catalog/syncPlan.ts
src/lib/catalog/validate.ts
src/lib/stripe/verifySignature.ts
src/lib/stripe/verifySignature.test.ts
src/lib/supabaseClient.ts

supabase/functions/stripe-sync/index.ts
supabase/functions/stripe-webhook/index.ts
supabase/migrations/20260806090000_catalog_admin_schema.sql
supabase/migrations/20260806090100_seed_catalog.sql
supabase/migrations/20260806100000_admin_auth.sql
```

---

## E) Suggested integration sequence

1. Branch from `origin/website-improvements` (`5a0b578`).
2. Copy all **§D ADD-only** paths from `9435f67`.
3. Patch `src/App.tsx` with admin early-return only (§B).
4. Merge `package.json` / lockfile / `eslint` / `.gitignore` / `vitest.config.ts` / `.env.example`.
5. Reconcile **§C** files, starting with `products.ts` + cart types, then ProductCard/ProductPage/Header/Footer/Home, then memberships/checkout/sitemap/prerender.
6. Apply new Supabase migrations; configure Google OAuth per `docs/google-admin-auth-setup.md`.
7. Verify: public routes unchanged; `/admin/login` → Google → `/admin/catalog`; `npm test` + `npm run catalog:validate`.

---

## F) Full `git diff --name-status origin/website-improvements 9435f67`

```
A	.env.example
M	.gitignore
A	AGENTS.md
A	docs/admin-stripe-audit.md
A	docs/backup/MembershipTermsPage.pre-membership.tsx
A	docs/backup/MembershipsPage.pre-membership.tsx
A	docs/backup/catalog-snapshot-2026-08-05.md
A	docs/backup/membership-snapshot-2026-08-06.md
A	docs/backup/pre-admin-worktree.patch
A	docs/backup/products.original.ts
A	docs/backup/products.pre-membership.ts
A	docs/backup/sitemap.original.xml
A	docs/backup/sync-stripe-products.original.ts
A	docs/bolt-supabase-clarification-summary.md
A	docs/catalog-relaunch-summary.md
A	docs/google-admin-auth-setup.md
A	docs/live-stripe-release-checklist.md
A	docs/product-admin-system.md
A	docs/stripe-live-dry-run.md
A	docs/stripe-live-sync-results.md
A	docs/stripe-sync-guide.md
A	docs/stripe-test-results.md
A	docs/weight-membership-relaunch-summary.md
M	eslint.config.js
M	index.html
M	package-lock.json
M	package.json
M	public/sitemap.xml
A	scripts/catalog-validate.ts
A	scripts/gen-seed-sql.ts
M	scripts/prerender.tsx
A	scripts/stripe-sync-test.ts
A	scripts/stripe-verify-test.ts
M	src/App.tsx
A	src/admin/AdminApp.tsx
A	src/admin/useAdminSession.ts
M	src/components/CartDrawer.tsx
M	src/components/Footer.tsx
M	src/components/Header.tsx
M	src/components/ProductCard.tsx
M	src/context/CartContext.tsx
M	src/data/products.ts
A	src/lib/auth/adminAccess.test.ts
A	src/lib/auth/adminAccess.ts
A	src/lib/catalog/catalog.test.ts
A	src/lib/catalog/catalog.ts
A	src/lib/catalog/fingerprint.ts
A	src/lib/catalog/stripeClient.ts
A	src/lib/catalog/syncPlan.ts
A	src/lib/catalog/validate.ts
A	src/lib/stripe/verifySignature.test.ts
A	src/lib/stripe/verifySignature.ts
A	src/lib/supabaseClient.ts
M	src/pages/AboutPage.tsx
M	src/pages/AccountPage.tsx
M	src/pages/AlaCartePage.tsx
M	src/pages/CheckoutPage.tsx
M	src/pages/ConcernPage.tsx
M	src/pages/FaqPage.tsx
M	src/pages/GoalPage.tsx
M	src/pages/HomePage.tsx
M	src/pages/MembershipTermsPage.tsx
M	src/pages/MembershipsPage.tsx
M	src/pages/ProductPage.tsx
M	src/pages/SectionPage.tsx
M	src/pages/ShopAllPage.tsx
A	supabase/functions/stripe-sync/index.ts
A	supabase/functions/stripe-webhook/index.ts
M	supabase/functions/sync-stripe-products/index.ts
A	supabase/migrations/20260806090000_catalog_admin_schema.sql
A	supabase/migrations/20260806090100_seed_catalog.sql
A	supabase/migrations/20260806100000_admin_auth.sql
A	vitest.config.ts
```
