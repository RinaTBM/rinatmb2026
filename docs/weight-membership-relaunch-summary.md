# My Bare Method — Weight-Membership Relaunch Summary (2026)

Branch: `weight-membership-relaunch-2026` (created from the catalog-relaunch working tree).
**Not committed, pushed, merged, deployed, or published.** Awaiting approval.
Backups captured before editing in `docs/backup/` (`products.pre-membership.ts`, `MembershipsPage.pre-membership.tsx`, `MembershipTermsPage.pre-membership.tsx`, `membership-snapshot-2026-08-06.md`).

## Existing membership system identified

- Central data: `memberships` array in `src/data/products.ts` (3 memberships: Bare Semaglutide $175, Bare Tirzepatide $225, Bare Elite Wellness $49).
- Consumers: `MembershipsPage` (cards, comparison, accessory-discount section, terms cards), `HomePage` (Members Save More mini-section), `ConcernPage` (`getMembershipsForConcern`, weight concern).
- Recurring billing: `create-checkout-session` uses Stripe `subscription` mode when a synced `app_product_id` is `is_recurring` and the cart item is `subscription`. Seed `m1`/`m2` are recurring ($150/$200). Pre-relaunch cart used `productId = membership.id` (`semaglutide-membership`), which did **not** match seed ids `m1`/`m2` (mismatch, now fixed via `checkoutProductId`).
- Shipping: charged, not a flat included benefit (Shipping Policy lists paid options; checkout applies free-over-$75 for one-time carts).

## Files changed

- `src/data/products.ts` — replaced the `Membership` interface + `memberships` array with a **single rich central data source** (new schema below). Added `visibleMemberships`, `getMembership`. `getMembershipsForConcern` now returns visible memberships. Elite Wellness retained but hidden (`status: 'inactive'`, `isVisible: false`).
- `src/pages/MembershipsPage.tsx` — full rebuild: hero, two cards, how-it-works, locked-price explanation, comparison table, FAQ, terms summary, Shop Without a Membership CTA.
- `src/pages/MembershipTermsPage.tsx` — prices → $199/$249; added "Locked Pricing & Program Terms" section (continuous-pricing, lapse, treatment-eligibility, medically-necessary cancellation, program-switch, Tirzepatide cap); removed the unsupported accessory-discount benefit line.
- `src/context/CartContext.tsx` — `CartItem` gains `isMembership`, `billingFrequency`.
- `src/components/CartDrawer.tsx` — membership lines show `$X/month`, 3-month initial term, provider review, shipping-separate, cancellation summary; no quantity stepper; no dose.
- `src/pages/CheckoutPage.tsx` — order summary shows membership `$X/mo` + billing/term/provider meta.
- `src/pages/HomePage.tsx` — uses `visibleMemberships`; membership feature copy de-scoped from accessories.
- `src/pages/ConcernPage.tsx` — membership add-to-cart uses `checkoutProductId` + `isMembership`.
- `scripts/prerender.tsx` — `/memberships` meta description updated to Semaglutide/Tirzepatide locked-price copy (removed old GLP-1 membership wording).
- `supabase/functions/sync-stripe-products/index.ts` — `m1`/`m2` display names → "Semaglutide Membership"/"Tirzepatide Membership"; prices → **199/249** (recurring). No logic/ID changes.
- `public/sitemap.xml` — regenerated from build.
- `docs/backup/*`, `docs/weight-membership-relaunch-summary.md`.

## Database / Supabase records changed

- No live Supabase writes. The **seed** in `sync-stripe-products` was updated (names + $199/$249). It applies only when the sync function is run — **a Stripe sync must be run before publishing** so `m1`/`m2` reflect the new recurring prices.

## Old → new membership-name mapping

| Old (customer-facing) | New |
| --- | --- |
| Bare Semaglutide Membership ($175) / "GLP-1 Membership" | **Semaglutide Membership** — Bare Balance — **$199/mo** |
| Bare Tirzepatide Membership ($225) / "GLP-1/GIP Membership" | **Tirzepatide Membership** — Bare Momentum — **$249/mo** |
| Bare Elite Wellness ($49) | Retained but hidden (`isVisible: false`) |

No old GLP-1 / GLP-1/GIP membership names remain customer-facing (verified: 0 in the built bundle).

## Final Semaglutide membership configuration

- slug `semaglutide-membership`, brandName "Bare Balance", monthlyPrice **199**, billingFrequency monthly, initialTermMonths **3**, lockedRate true.
- includedProducts: Semaglutide + B6 Injection. includedFormulations: 1mg/1mg per mL 2mL; 2mg/2mg per mL 2mL; 5mg/2mg per mL 2mL. maximumIncludedFormulation **5mg/2mg per mL, 2mL**. exclusions: none.
- providerReviewRequired true, prescriptionGuaranteed **false**, shippingIncluded false. checkoutProductId `m1`.

## Final Tirzepatide membership configuration

- slug `tirzepatide-membership`, brandName "Bare Momentum", monthlyPrice **249**, billingFrequency monthly, initialTermMonths **3**, lockedRate true, highlighted.
- includedProducts: Tirzepatide + B6 Injection. includedFormulations: 5mg; 15mg; 25mg (per 2mg/mL, 2mL). maximumIncludedFormulation **25mg/2mg per mL, 2mL**.
- **excludedFormulations: 30mg/2mg per mL, 2mL** (not part of the $249 membership; shown prominently, not minimized).
- providerReviewRequired true, prescriptionGuaranteed **false**, shippingIncluded false. checkoutProductId `m2`.

## Included / excluded formulations

- Semaglutide included: 1mg, 2mg, 5mg (per stated concentrations). Excluded: none.
- Tirzepatide included: 5mg, 15mg, 25mg. **Excluded: 30mg/2mg per mL, 2mL.**

## Three-month initial term / locked-rate rules

- Initial term = 3 months, then month to month. Rate locked while continuously active and in good standing.
- Displayed on cards, cart, checkout, terms summary, and full Membership Terms page.

## Cancellation, lapse, program-switch rules

- Canceling ends the locked rate; future enrollment uses the price available at that time.
- Lapse beyond the permitted grace period → future enrollment at then-current pricing.
- Medically-necessary cancellation: if a provider deems continued treatment inappropriate, future charges are discontinued per terms.
- Switching Semaglutide ↔ Tirzepatide requires enrollment at the current rate for the new program.

## Shipping treatment

Shipping is **not** included. Memberships and cart display "Shipping calculated separately." FAQ points to the Shipping Policy (paid options at checkout; temperature-controlled packaging where required).

## Checkout behavior

- Customers select only the membership (no dose/strength selection anywhere).
- Cart label: "Semaglutide Membership" / "Tirzepatide Membership" with `$X/month` and membership meta; no concentration, no quantity stepper.
- Membership cart items use `checkoutProductId` (`m1`/`m2`) so the existing Stripe subscription lookup resolves. Then the existing intake → provider-review → fulfillment workflow proceeds unchanged.

## Intake behavior

Unchanged. Existing intake/provider-review workflow and checkout logic preserved; memberships flag `requiresIntake: true`.

## Existing recurring-billing logic

Unchanged. `create-checkout-session` still switches to Stripe `subscription` mode for recurring, subscription-flagged items. The relaunch aligns the membership cart `productId` to the recurring seed products `m1`/`m2`.

## Shop Without a Membership behavior

Preserved and prominent: label "Shop Without a Membership" with copy "Prefer flexibility? Choose an eligible product as a one-time purchase without monthly enrollment." Links to `/shop-all`; one-time product pages/routes and pricing remain fully functional (13 products).

## SEO updates

- `/memberships` prerender title/description updated to Semaglutide/Tirzepatide locked-price copy.
- Stripe seed display names updated. Old GLP-1 membership names removed from customer-facing surfaces and the built bundle (verified 0). Sitemap regenerated.

## Accessibility checks

Mobile (Samsung Galaxy S20, 412px) verified: cards, benefits, and the Tirzepatide cap render without horizontal overflow; comparison table scrolls horizontally within its container on small screens (`min-w` + `overflow-x-auto`) with `<th scope>` headers and aria labels on Yes/No cells; buttons are full-width and tappable; the 25mg program cap is shown in a full callout (not minimized). Desktop/tablet verified via the demo.

## Build / lint / console / links

- `npm run typecheck` → pass (0 errors).
- `npm run lint` → pass (0 errors; 4 pre-existing `react-refresh/only-export-components` warnings).
- `npm run build` → success; sitemap 50 URLs.
- Console: no errors during manual testing.
- Links: `/memberships`, `/shop-all`, `/section/weight-management`, `/membership-terms`, checkout — all working. No broken links observed.

## QA checklist result

Two public weight memberships ✓ · Semaglutide $199 ✓ · Tirzepatide $249 ✓ · 3-month initial term ✓ · locked-rate language ✓ · cancellation ends locked rate ✓ · no dose selection at checkout ✓ · Semaglutide includes only listed formulations ✓ · Tirzepatide only through 25mg ✓ · 30mg not included ✓ · no prescription guarantee ✓ · provider review required ✓ · Shop Without a Membership present ✓ · cart shows name + monthly price ✓ · intake/checkout/recurring logic intact ✓ · no old GLP-1 / GLP-1/GIP names customer-facing ✓ · mobile/tablet/desktop ✓ · no console errors ✓ · lint pass ✓ · build pass ✓.

## Unresolved issues before publishing

1. **Stripe sync required**: run `sync-stripe-products` so `m1`/`m2` reflect the new recurring prices ($199/$249) and names; until then, membership checkout would use the previously synced $150/$200 recurring prices.
2. **Dedicated membership imagery** optional: both cards currently reuse the injection-vial asset.
3. **Legal review** recommended on the updated Membership Terms clauses.
4. Depends on the prior catalog relaunch (`catalog-relaunch-final-2026`) changes, which are also uncommitted in this working tree.

## Local preview

- `npm run dev` → http://localhost:5173/memberships (currently running).
- Production preview: `npm run build` then `npm run preview`.
