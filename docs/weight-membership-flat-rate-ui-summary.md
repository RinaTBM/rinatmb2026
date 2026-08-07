# Weight Membership Flat-Rate UI Summary

Adds flat-rate **Wellness Membership** as the first purchasing option on the Semaglutide and Tirzepatide product pages only. Existing Auto-Refill & Save (10%) and One-Time Purchase dose pricing are preserved.

## Files changed

| File | Change |
|------|--------|
| `src/lib/pricing/weightMembership.ts` | **New** — authoritative $199 / $249 / $350 rates (dollars + cents), program copy, 30mg notice helper |
| `src/lib/pricing/weightMembership.test.ts` | **New** — flat-rate, dose independence, 30mg notice, auto-refill/one-time preservation |
| `src/lib/pricing/purchaseOptions.ts` | Adds `membership_program` option kind; prepends flat membership for Sema/Tirz; keeps 15% CTA for other eligible products |
| `src/lib/pricing/purchaseOptions.test.ts` | Updates Sema/Tirz expectation (no 15% CTA) |
| `src/pages/ProductPage.tsx` | Renders Wellness Membership card, cart join path, 30mg member-only notice |
| `docs/weight-membership-flat-rate-ui-summary.md` | This summary |

## Semaglutide membership implementation

- First option: **Wellness Membership** · BEST VALUE
- Flat price: **$199/month** (`19900` cents) — never derived from selected dose
- Supporting copy, included formulations (1mg / 2mg / 5mg), customer note, CTA:
  - `Join Semaglutide Membership — $199/month`
- Cart line:
  - `Semaglutide Wellness Membership — $199/month`
  - `productId: m1`, `purchaseType: membership_program`, `isMembership: true`
  - **No dose / variant** on the cart line
- No crossed-out dose price, no “Save 15%”, no calculated savings amount

## Tirzepatide membership implementation

- First option: **Wellness Membership** · BEST VALUE
- Flat price: **$249/month** (`24900` cents) through included program max (25mg)
- Supporting copy, included formulations (5mg / 15mg / 25mg), customer note, CTA:
  - `Join Tirzepatide Membership — $249/month`
- Cart line:
  - `Tirzepatide Wellness Membership — $249/month`
  - `productId: m2`, `purchaseType: membership_program`, `isMembership: true`
  - **No dose / variant** on the cart line

## 30mg member-only implementation

When Tirzepatide **30mg/2mg per mL, 2mL** is selected:

- Standard membership card still shows **$249/month**
- Supporting copy clarifies inclusion only through 25mg
- Informational block:
  - **30MG MEMBER-ONLY RATE**
  - **$350/month** (`35000` cents)
  - “Available only to active Tirzepatide Wellness Members when provider-directed.”
  - Explicitly not self-serve; requires active membership + provider + admin approval + acknowledgment
- `memberOnlyPurchasable: false` — no storefront CTA to activate $350
- One-Time remains **$449**; Auto-Refill remains **10% of $449** ($404.10)

## Confirmation: Auto-Refill unchanged

- Still dose-based: selected one-time price minus 10%
- Semaglutide: $149 → $134.10, $169 → $152.10, $199 → $179.10
- Tirzepatide: $199 → $179.10, $269 → $242.10, $379 → $341.10, $449 → $404.10
- Copy preserved: “Receive convenient monthly deliveries while saving on every eligible refill.”
- Does **not** create a Wellness Membership

## Confirmation: One-Time Purchase unchanged

| Product | Strengths / prices |
|---------|-------------------|
| Semaglutide | 1mg $149 · 2mg $169 · 5mg $199 |
| Tirzepatide | 5mg $199 · 15mg $269 · 25mg $379 · 30mg $449 |

Selected formulation continues to appear on cart lines for One-Time and Auto-Refill.

## 15% member benefit

- Active Wellness Members still receive **15% off other eligible wellness products**
- **Not** applied to Semaglutide / Tirzepatide medication (`memberPricingEligible: false`)
- Still excluded: provider care, consultations, lab reviews, accessories, shipping, taxes

## Cart and checkout behavior

- Membership join from the product page uses the same cart shape as `/memberships` (`m1` / `m2`, recurring, intake required)
- Checkout edge function continues to use **mapped Stripe Price IDs** for program memberships (not browser-trusted amounts)
- Auto-refill / discounted non-membership lines continue to use test-mode `price_data`
- No live Stripe operations; test mode only

## Test results

```
npm test
```

All pricing tests passed, including:

- Semaglutide $199 flat membership first
- Membership independent of selected dose
- Tirzepatide $249 through 25mg
- 30mg shows $350 member-only notice (not purchasable)
- 30mg One-Time $449; Auto-Refill 10%
- No 15% on Semaglutide / Tirzepatide
- Option order: membership → auto-refill → one-time

## Build result

| Command | Result |
|---------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass (5 pre-existing react-refresh warnings only) |
| `npm test` | Pass — 47 tests |
| `npm run build` | Pass — client + SSR prerender (67 routes, including `/product/semaglutide` and `/product/tirzepatide`) |

## Stripe test Prices still required

| App product | Amount | Notes |
|-------------|--------|-------|
| `m1` Semaglutide Membership | `19900` cents / month | Already seeded / mapped for program checkout |
| `m2` Tirzepatide Membership | `24900` cents / month | Already seeded / mapped for program checkout |
| Tirzepatide 30mg member-only | `35000` cents / month | **Not** a public storefront Price yet. Required later for provider/admin-approved subscription changes only — do not expose as a self-serve product |

No live Stripe sync was run as part of this change.
