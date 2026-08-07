# Membership Accessory Benefit Update (2026)

## Summary

Active Semaglutide and Tirzepatide Wellness Members now receive **15% off eligible accessories** in addition to **15% off eligible wellness products**. Flat-rate weight-management membership prices, Auto-Refill (10%), One-Time medication pricing, Provider Care, shipping, and taxes are unchanged.

## Source-of-truth protection

| Item | Value |
|------|--------|
| Starting commit | `b5e08e093fdd68736924884069ec3e02f499d22a` |
| Completed commit | `a55f89ca3a4f6919136e40eb47d0ef921de68c41` |
| Work branch | `source-of-truth/membership-accessory-benefit-2026` |
| Local backup branch | `backup/membership-accessory-benefit-before-edit-2026` (not pushed) |
| Annotated tag | `membership-accessory-benefit-v1` |
| Base note | `source-of-truth/accessories-pricing-2026` did not exist; started from deploy tip `b5e08e0` (accessory catalog consolidation) |

Bolt-controlled branches (`deploy/my-bare-method-integrated-2026`, `main`, `website-improvements`) were **not** edited, force-pushed, merged, or deployed.

## Files changed

- `src/lib/pricing/settings.ts` — `accessoryMemberDiscountPercent` (15), enable flag, non-stackable
- `src/lib/pricing/accessoryMemberDiscount.ts` — eligibility + price resolution + checkout authorization helpers
- `src/lib/pricing/accessoryMemberDiscount.test.ts` — coverage for member/non-member/bundle/stacking/exclusions
- `src/lib/pricing/purchaseOptions.ts` — accessories use dedicated path (not wellness 15%)
- `src/data/products.ts` — membership benefit copy; accessories default `memberPricingEligible`; starter kit OFF
- `src/components/AccessoryProductPage.tsx` — Member Benefit UI (standard / savings / member price)
- `src/components/ProductCard.tsx` — restrained “Members Save 15%” badge for active members only
- `src/components/CartDrawer.tsx` — accessory member savings line display
- `src/pages/MembershipsPage.tsx` / `HomePage.tsx` / `FaqPage.tsx` / `AccountPage.tsx` — customer-facing copy
- `src/pages/CheckoutPage.tsx` — sends `section` for server-side accessory authorization
- `src/admin/AdminApp.tsx` — accessory member discount % + global enable
- `supabase/functions/create-checkout-session/index.ts` — recomputes accessory member unit cents; rejects deeper client cuts
- `docs/membership-accessory-benefit-update.md` — this report

## Membership copy updated

Preferred short line in use:

> Active Wellness Members save 15% on eligible wellness products and accessories.

Membership benefit lists include:

- Flat-rate membership pricing
- Save 15% on other eligible wellness products
- Save 15% on accessories
- Priority access / ongoing support / provider-guided care

Does **not** say “Semaglutide 15% off” or “Tirzepatide 15% off”.

## Accessory member-discount behavior

| Customer | Eligible accessory | Result |
|----------|-------------------|--------|
| Active Semaglutide / Tirzepatide member | `memberPricingEligible: true` | 15% off |
| Non-member | any | Standard retail |
| Inactive / canceled | any | Standard retail |
| Active member | Starter kit / bundle (`memberPricingEligible: false`) | Standard (bundle) price |
| Any | Provider Care | Excluded |
| Any | Shipping / taxes | Excluded |

Defaults:

- `accessory_member_discount_percent = 15`
- `accessory_member_discount_stackable = false`
- Individual accessories: `member_discount_eligible = true`
- Bundles: `member_discount_eligible = false` (`bundle_member_discount_eligible = false`)

## Cart behavior

For active members on eligible accessories:

- Standard price
- Member Savings (−15%)
- Final Member Price (computed via `resolveAccessoryUnitPrice`)

No Auto-Refill on accessories. No discount stacking.

## Admin configuration

Purchase Pricing admin panel supports:

- Global enable/disable for accessory member discount
- Accessory member discount percent (default 15; no code change required to adjust)
- Per-product `memberPricingEligible` (existing product editor)

Accessory % is persisted in local purchase-discount settings. Wellness/auto-refill % continue to upsert to `store_purchase_settings` when Supabase is connected. **No new database migration** was added in this change set.

## Bundle exclusion rule

Preserved: already-discounted accessory bundles do **not** automatically receive another 15% member discount. Admin can enable a specific SKU later via `memberPricingEligible`.

## Unchanged pricing confirmation

| Item | Value | Status |
|------|-------|--------|
| Semaglutide membership | $199/month | Unchanged |
| Tirzepatide membership | $249/month | Unchanged |
| Tirzepatide 30mg member-only | $350/month | Unchanged |
| Auto-Refill | 10% eligible wellness products only | Unchanged |
| One-Time medication pricing | Standard / no 15% on Sema/Tirz | Unchanged |
| Accessory retail list prices | Catalog prices | Unchanged |
| Accessory count/quantity variants | Unchanged | Unchanged |

## Server-side authorization

Checkout edge function:

1. Identifies accessory lines (`section === 'accessories'` or `aN` product ids)
2. Treats starter kit (`a1`) and `memberPricingEligible: false` as ineligible
3. Recomputes unit cents as `round(standard × (1 − 0.15))` for active members
4. Rejects client amounts below the authorized member price
5. Forces standard retail when membership is not active
6. Rejects Auto-Refill on accessories
7. Remains **TEST MODE only** (live Stripe keys rejected)

### Unresolved Stripe / auth dependency

Full verification of an authenticated user → Stripe customer → active Semaglutide/Tirzepatide subscription is **not** wired in this edge function yet. The function recomputes authorized accessory prices from `standardPriceCents` and does not trust a deeper client discount, but membership *claim* still arrives from the client (`isActiveMember`) until Stripe subscription lookup is connected. Documented for a follow-up; no live Stripe sync was run.

## Verification results

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass (0 errors; existing react-refresh warnings only) |
| `npm test` | Pass — 71 tests |
| `npm run build` | Pass (client + SSR prerender, 64 routes) |

## Operations confirmation

- No force-push
- No live Stripe sync / Live Mode operations
- No deploy / publish
- No merge to Bolt-controlled branches
- Annotated tag `membership-accessory-benefit-v1` created once on the completed commit
