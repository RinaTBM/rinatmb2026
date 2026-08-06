# Final Integration Plan — My Bare Method 2026

## Source of truth for this integration

| Ref | Role | Notes |
|---|---|---|
| `origin/website-improvements` (`5a0b578`) | **Storefront base** | Homepage, Header, Footer, Provider Care, Accessories, visit/service paths, photos, checkout/intake chrome |
| `origin/google-admin-auth-2026` (`8c494d3`) | **Unusable for tech import** | Bolt force-updated this remote; it is **byte-identical** to `origin/website-improvements` (0 file diffs). Unrelated histories; do **not** merge. |
| Local `9435f67` (`google-admin-auth-2026` tip before remote squash) | **Technical import source** | Product admin, catalog utilities, Stripe test-sync, Google admin auth, migrations, docs |

**Policy:** create `release/my-bare-method-final-2026` from `origin/website-improvements` only. Manually copy/reconcile technical features from `9435f67`. Never merge unrelated histories. Never force-push. Never apply migrations or touch live Stripe in this step.

---

## A. Public storefront features that must remain (`website-improvements`)

| Feature | Primary files |
|---|---|
| Homepage design | `src/pages/HomePage.tsx` |
| Header / nav (Provider Care, Accessories, Memberships) | `src/components/Header.tsx` |
| Footer | `src/components/Footer.tsx` |
| Provider Care (consultations, laboratory review) | `src/data/products.ts` (section + SKUs), `/section/provider-care` |
| Visit / payment-adjacent service paths | Provider Care products (Initial Consultation, Follow-Up, Laboratory Review) + checkout Stripe flow |
| Accessories | `src/data/products.ts`, `/section/accessories`, homepage accessories strip |
| Memberships page chrome (public) | Route `/memberships` (content updated to $199/$249 programs) |
| Shop pages | `ShopAllPage`, `SectionPage`, `ProductPage`, `ProductCard` |
| Product photographs | `public/images/products/*`, `public/images/accessories/*` |
| Cart + checkout + intake flags | `CartContext`, `CartDrawer`, `CheckoutPage` |
| Legal / policy pages | Privacy, Terms, Refund, Shipping, Accessibility, Consumer Data, Membership Terms |
| Mobile styling | Existing Tailwind responsive classes on Header/Home/Footer |

---

## B. Technical features imported from `9435f67`

| Feature | Paths |
|---|---|
| Product / membership admin UI | `src/admin/AdminApp.tsx`, `src/admin/useAdminSession.ts` |
| Central catalog utilities | `src/lib/catalog/*` |
| Google admin login + access resolution | `src/lib/auth/adminAccess.ts`, `src/lib/supabaseClient.ts` |
| Admin route guard | `src/App.tsx` early `/admin` branch (no storefront chrome) |
| Stripe test-sync infrastructure | `scripts/stripe-*.ts`, `supabase/functions/stripe-sync`, `stripe-webhook`, updated `sync-stripe-products` |
| Stripe signature helper | `src/lib/stripe/verifySignature.ts` |
| Required migrations (not applied here) | `20260806090000_catalog_admin_schema.sql`, `20260806090100_seed_catalog.sql`, `20260806100000_admin_auth.sql` |
| Docs | `docs/google-admin-auth-setup.md`, `docs/product-admin-system.md`, Stripe/catalog docs |
| Tooling | `vitest.config.ts`, `.env.example`, package scripts `test`, `catalog:validate`, `stripe:sync:test*` |

Protected admin routes (not linked from nav/footer/sitemap):

- `/admin/login`
- `/admin/auth/callback`
- `/admin/catalog` (and internal admin sections)

---

## C. Files modified on both sides — manual reconciliation

| File | Keep from website | Take from `9435f67` |
|---|---|---|
| `src/App.tsx` | All public routes + layout | Add `AdminApp` early-return for `/admin/*` only |
| `src/components/Header.tsx` | Full chrome, Provider Care / Accessories / Memberships links, mobile menu | Update Shop-by-Category targets to relaunch category ids |
| `src/components/Footer.tsx` | **Website version unchanged** | — |
| `src/pages/HomePage.tsx` | Design, sections, accessories strip, how-it-works | `visibleMemberships` ($199/$249 only); unused-import cleanup |
| `src/data/products.ts` | Provider Care + Accessories SKUs + photos | 13 approved therapy products + variants + membership model |
| `src/pages/ProductPage.tsx` / `ProductCard.tsx` | — | Variant-aware admin versions |
| `src/context/CartContext.tsx` / `CartDrawer.tsx` / `CheckoutPage.tsx` | Intake/checkout flow | Line keys, variant/membership fields |
| `src/pages/MembershipsPage.tsx` / `MembershipTermsPage.tsx` | Public route | $199/$249 no-dose-selection copy |
| `src/pages/SectionPage.tsx` / `ShopAllPage.tsx` / `ConcernPage.tsx` | — | Catalog-aware listing (icons restored for Provider Care / Accessories) |
| `package.json` / `.gitignore` / `eslint.config.js` | Base scripts | test/catalog/stripe scripts + vitest/tsx |

**ADD-only (safe copy):** admin/, lib/auth, lib/catalog, lib/stripe, supabase new migrations + stripe-sync/webhook, docs/*, vitest, `.env.example`, catalog/stripe scripts.

---

## Integration approach (executed)

1. Branch from `origin/website-improvements` → `release/my-bare-method-final-2026`
2. Copy ADD-only technical files from `9435f67`
3. Build hybrid `src/data/products.ts` (relaunch catalog + preserved Provider Care + Accessories)
4. Wire admin routes; keep public Header/Footer/Home design
5. Document pending migrations; **do not apply SQL**
6. Typecheck / lint / test / production build
