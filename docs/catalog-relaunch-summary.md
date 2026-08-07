# My Bare Method — Catalog Relaunch Summary (2026)

Branch: `catalog-relaunch-final-2026`. **Not committed, pushed, published, merged, or deployed.**
Backups captured in `docs/backup/` before any edits (raw `products.ts`, Stripe seed, sitemap, and a snapshot doc).

## Framework & catalog structure identified

- **Framework:** Vite + React 18 + TypeScript, Tailwind CSS. Custom hash/path SPA router (`src/router.tsx`). No backend server for local dev.
- **Catalog source of truth:** `src/data/products.ts` (single module; consumed by all pages/components).
- **Payments:** Supabase Edge Functions + Stripe. `sync-stripe-products` seeds Stripe products/prices keyed by `app_product_id`; `create-checkout-session` looks up `stripe_price_id` by `app_product_id` (the cart sends `product.id`). **Product IDs are load-bearing for payments.**
- **SSR/SEO:** `scripts/prerender.tsx` prerenders routes to static HTML and generates `sitemap.xml`. Structured data (JSON-LD) injected per product. `index.html` holds global meta.

## Files changed

- `src/data/products.ts` — full rewrite to the new central schema (variants, categories, visibility, campaign fields, compliance flags, slug aliases). Single source of truth; no duplicated hardcoded prices.
- `src/context/CartContext.tsx` — variant-aware cart lines (stable `key` = product + variant + purchase type; `variantId`/`variantLabel`).
- `src/components/CartDrawer.tsx` — shows variant label; keyed by line `key`.
- `src/components/ProductCard.tsx` — category label, dosage-form badge, starting price, "Provider review required".
- `src/components/Header.tsx` — nav = Shop All + 5 categories + Memberships/Contact/FAQs; search restricted to visible products.
- `src/components/Footer.tsx` — shop/concern links updated to the 5 categories; disclosure de-scoped from research.
- `src/pages/ProductPage.tsx` — variant selector updates price + cart label; compliant Overview/Eligibility/Formulation tabs; provider notice.
- `src/pages/ShopAllPage.tsx` — filters for Category, Dosage Form, Starting Price; visible products only.
- `src/pages/SectionPage.tsx` — 5-category pages with dosage-form filter + sort.
- `src/pages/ConcernPage.tsx`, `HomePage.tsx`, `AboutPage.tsx`, `AccountPage.tsx`, `MembershipsPage.tsx`, `MembershipTermsPage.tsx`, `FaqPage.tsx` — renames, dead-link fixes, removed references to retired sections.
- `src/pages/CheckoutPage.tsx` — order summary shows variant label; keyed by line `key`.
- `scripts/prerender.tsx` — prerenders **visible** products only; JSON-LD uses `displayName`/`startingPrice` (removed non-existent rating fields).
- `index.html` — SEO meta/keywords updated (removed GLP-1 as a marketing name).
- `public/sitemap.xml` — regenerated from the build (hidden products removed).
- `supabase/functions/sync-stripe-products/index.ts` — customer-facing **display names** renamed (GLP-1→Semaglutide, GLP-1/GIP→Tirzepatide, memberships). **No price/ID/structure changes.**
- `docs/backup/*`, `docs/catalog-relaunch-summary.md` — backups + this report.

## Supabase tables/queries changed

- No schema or query logic changed. `stripe_products` table and the checkout lookup are unchanged.
- Only the **seed display names** in `sync-stripe-products` were updated (see payment notes below). No re-sync was run.

## Old → new product-name mapping

| Old (customer-facing) | New display name |
| --- | --- |
| GLP-1 | Semaglutide + B6 Injection |
| GLP-1/GIP | Tirzepatide + B6 Injection |
| GLP-1 Membership | Bare Semaglutide Membership |
| GLP-1/GIP Membership | Bare Tirzepatide Membership |
| Bare Elite Wellness ("all non-GLP-1…") | Bare Elite Wellness ("all other wellness products") |

Class terms (e.g. "GLP-1 receptor agonist") are not used in customer copy. Old-URL redirect keys retain lowercase slug fragments (`glp-1-1`, etc.) by necessity.

## 13 active products, variants, prices, category

1. **Semaglutide + B6 Injection** — Weight Management — Starting at $149 — Injection 1mg/1mg/mL 2mL $149; 2mg/2mg/mL 2mL $169; 5mg/2mg/mL 2mL $199 — slug `semaglutide` (id p1)
2. **Tirzepatide + B6 Injection** — Weight Management — Starting at $199 — Injection 5/15/25/30mg per 2mg/mL, 2mL — $199/$269/$379/$449 — slug `tirzepatide` (id p5)
3. **Estradiol Patch** — Women's Hormone Therapy — Starting at $119 — Patch 0.025/0.05/0.1mg twice weekly, 8 patches — $119/$119/$135 — slug `estradiol-patch` (id p16)
4. **Progesterone Capsules** — Women's Hormone Therapy — Starting at $49 — Capsule 100mg/200mg, 30 caps — $49/$69 — slug `progesterone-capsules` (id p23)
5. **Testosterone Cream** — Women's Hormone Therapy — $79 — Cream 5mg/g, 30g — slug `testosterone-cream` (id p27)
6. **NAD+** — Longevity & Cognitive Health — Starting at $149 — Nasal Spray 50mcg/50mcg per spray 10mL $149; Injection 100mg/mL 5mL $199; Injection 100mg/mL 10mL $219 — slug `nad-plus` (id p9)
7. **Selank Injection** — Longevity & Cognitive Health — $129 — Injection 5mg/mL, 2mL — slug `selank` (id p48)
8. **Semax Injection** — Longevity & Cognitive Health — $129 — Injection 5mg/mL, 2mL — slug `semax` (id p47)
9. **Selank + Semax Blend Nasal Spray** — Longevity & Cognitive Health — $149 — Nasal Spray 50mcg/50mcg per spray, 10mL — slug `selank-semax-nasal-spray` (id p68 — new)
10. **BPC-157/TB-500 Blend** (Wolverine Blend) — Recovery & Performance — Starting at $99 — Capsule 500mcg/500mcg 30 caps $99; Injection 1.66mg/3.33mg/mL 3mL $199 — slug `bpc-157-tb-500` (id p41)
11. **Tretinoin Cream** — Prescription Skin & Hair — Starting at $79 — Cream 0.025%/0.05%/0.1%, 20g — $79/$89/$109 — slug `tretinoin-cream` (id p69 — new)
12. **Minoxidil Combination Topical Formula** — Prescription Skin & Hair — $119 — Topical Solution 1% plus pharmacy-selected actives, 60mL — slug `minoxidil-topical` (id p70 — new)
13. **Bimatoprost Solution** — Prescription Skin & Hair — $89 — Solution 0.03%, 2.5mL — slug `bimatoprost-solution` (id p71 — new)

## Public category structure (5)

Weight Management · Women's Hormone Therapy · Longevity & Cognitive Health · Recovery & Performance · Prescription Skin & Hair. Slugs: `weight-management`, `womens-hormone-therapy`, `longevity-cognitive`, `recovery-performance`, `prescription-skin-hair`.

## Hidden future products (preserved, not deleted)

- **Sermorelin** — `status: future`, `isVisible: false`, `launchPhase: 2`, `campaignTheme: "future longevity release"` (id p12). Injection 9mg/mL 3mL $119.
- **Minoxidil Tablets** — `status: future`, `isVisible: false`, `launchPhase: 2`, `campaignTheme: "future hair restoration release"` (id p72). 2.5mg, 30 tablets $79.
- All future flags: `requiresProviderReview/Prescription/ComplianceReview/PharmacyVerification: true`.
- To release later: set `status: 'active'` and `isVisible: true` in `src/data/products.ts` (and sync Stripe). No rebuild of the site needed.
- **Sermorelin removal** and **Minoxidil tablets removal** verified absent from Shop All, categories, search, recommendations, cart/checkout, sitemap, structured data, and nav.

## Product image mapping

- Semaglutide, Tirzepatide, NAD+, BPC-157/TB-500, Selank, Semax → existing injection vial asset. Selank/Semax blend → existing nasal spray asset. Estradiol Patch → patches asset. Progesterone/Minoxidil-tablets → capsule asset. Testosterone Cream / Tretinoin → cream asset. Minoxidil topical → gel asset. Bimatoprost → spray asset. No generated images; existing assets reused with accurate, claim-free alt text.

## Missing dedicated product images (flagged `needsDedicatedImage`)

- **Tirzepatide** (shares the injection vial with Semaglutide), **Minoxidil Combination Topical Formula** (uses gel image), **Bimatoprost Solution** (uses spray image). Functional/neutral placeholders; recommend dedicated photography before publishing.

## URL redirects / aliases

Old auto-slugs resolve to new products via `SLUG_ALIASES` + trailing-`-<id>` stripping in `getProduct()` (client-side route alias — old bookmarks render the new product, no 404). Covered: all `glp-1-*` / `glp-1-gip-*` → semaglutide/tirzepatide; `nad-injection-*`/`nad-nasal-spray-*` → nad-plus; `estrogen-transdermal-patch-*` → estradiol-patch; `progesterone-capsules-*`, `testosterone-cream-*`; `bpc-157-tb-500-*`; `semax-nasal-spray-*` → semax; `selank-nasal-spray-*` → selank. Verified: `/product/glp-1-1` resolves to Semaglutide.

## Existing membership pricing discovered (unchanged — reported per instructions)

- **Display memberships** (`memberships` array, shown on Memberships page & product membership option): Bare Semaglutide $175/mo, Bare Tirzepatide $225/mo, Bare Elite Wellness $49/mo.
- **`MembershipTermsPage`** legal copy lists $150/mo and $200/mo.
- **Stripe seed** (`m1`/`m2`): $150/mo and $200/mo.
- ⚠️ **Conflict to resolve before publishing:** membership pricing is inconsistent across these three sources ($175/$225 vs $150/$200). Pricing was **not changed** pending your decision.

## Existing recurring-order logic discovered

- Membership = subscription. Product pages offer a "Membership" option for Semaglutide/Tirzepatide ($175/$225 display). `create-checkout-session` switches Stripe to `subscription` mode when a synced product is `is_recurring` and the item is flagged `subscription`. No auto-applied discounts; no new subscription billing introduced. One-Time Purchase, Existing Membership, and recurring options are visually distinguished on the product page.

## Compliance flags (all 13 active + 2 future)

`requiresProviderReview`, `requiresPrescription`, `requiresComplianceReview`, `requiresPharmacyVerification` = **true** for every product. Provider-review notice, eligibility list, and neutral formulation note appear on every product page. `internalNotes` is **never** rendered and is **not shipped** in the client bundle (verified).

## Descriptions requiring final approval

All 13 active descriptions were rewritten to neutral, provider-directed language (no benefit/outcome/dosing claims, no branded names, no "FDA-approved compounded"/"generic <brand>"). Recommend medical/compliance sign-off on final wording, especially NAD+, BPC-157/TB-500, Selank, Semax, and the Selank/Semax blend.

## Payment / Stripe items to resolve before publishing

1. **New products** `p68` (Selank+Semax blend), `p69` (Tretinoin), `p70` (Minoxidil topical), `p71` (Bimatoprost) are **not synced** to Stripe → checkout for these will 400 until `sync-stripe-products` runs.
2. **Variant-level prices** differ from the single synced base price per `app_product_id`; the checkout charges the synced Stripe price, not the selected variant price. Per-variant Stripe prices should be created and mapped before publishing.
3. **Reused IDs** now describe new forms (`p9` NAD+, `p41` BPC, `p47`→Semax injection, `p48`→Selank injection); re-sync recommended so Stripe display matches.
4. **Sermorelin** (`p12`) remains in the Stripe seed but is hidden in the UI — acceptable (preserved, not surfaced).

## Build / lint / console results

- `npm run typecheck` → **pass** (0 errors).
- `npm run lint` → **pass** (0 errors; 4 pre-existing `react-refresh/only-export-components` warnings in `router.tsx` and `CartContext.tsx`).
- `npm run build` → **success**; prerenders exactly the **13 visible products** + 5 category pages; `sitemap.xml` = 50 URLs (was 109), no hidden/removed products.
- Console: no application errors during manual testing (only the React DevTools install suggestion).

## Manual QA performed

Desktop end-to-end (Shop All 13 products → filter to Prescription Skin & Hair = 3 → Semaglutide variant select updates price $149→$199 → cart shows variant + $199 → checkout summary shows variant + $199 → old `/product/glp-1-1` resolves to Semaglutide). Mobile (390×844): product page + Shop All render with no horizontal overflow, tappable controls, readable text.

## Outstanding items / must-resolve before publishing

1. Resolve membership pricing conflict ($175/$225 vs $150/$200) across display, legal terms, and Stripe seed.
2. Sync Stripe for new products (p68–p71) and create per-variant prices; the checkout currently maps one price per product ID.
3. Add dedicated images for Tirzepatide, Minoxidil topical, and Bimatoprost.
4. Obtain medical/compliance sign-off on rewritten descriptions.

## Local preview

- Dev server: `npm run dev` → http://localhost:5173/
- Production preview: `npm run build` then `npm run preview`
