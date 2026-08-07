# Accessory Purchase Flow Update

Simplified Accessories product pages into standard premium ecommerce purchase flows. Wellness medication pages, memberships, Auto-Refill, Stripe, admin, and auth were not modified.

## Files changed

| File | Change |
|------|--------|
| `src/components/AccessoryProductPage.tsx` | **New** — simplified accessory PDP (price, count, quantity, Add to Cart) |
| `src/lib/accessories/accessoryPurchase.ts` | **New** — count families, cart labels, quantity clamp, missing-price report |
| `src/lib/accessories/accessoryPurchase.test.ts` | **New** — unit tests for families / cart labels / missing prices |
| `src/pages/ProductPage.tsx` | Thin router: accessories → `AccessoryProductPage`; wellness path unchanged in `WellnessProductPage` |
| `src/pages/CheckoutPage.tsx` | Accessories no longer labeled “One-Time Purchase”; show Quantity instead |
| `docs/accessory-purchase-flow-update.md` | This summary |

## Accessory pages updated

All Accessories-category PDPs now use the simplified panel:

- Complete Injection Starter Kit
- Premium 3D Printed Peptide Case
- Temperature-Controlled Travel Case
- Discreet Travel Bag
- Reusable Ice Pack
- Daily & Weekly Wellness Planner
- Sharps Container
- Alcohol Prep Wipes (100 / 200 count SKUs)
- Premium Insulin Syringes (10 / 50 / 100 pack SKUs)

Removed from accessory pages:

- Select strength / strength-style variants
- Choose how you’d like to purchase
- One-Time Purchase card
- Buy Once — $X
- Auto-Refill / Wellness Membership controls
- Provider-review / eligibility / formulation medication tabs

## Alcohol Wipes options

**Select Count** (priced options only):

| Count | Price | Status |
|-------|-------|--------|
| 100 Count | $9 | Available (existing approved SKU `alcohol-prep-wipes-100`) |
| 200 Count | $15 | Available (existing approved SKU `alcohol-prep-wipes-200`) |
| **500 Count** | — | **Missing approved price — not enabled for checkout** |

After count selection, unit quantity 1–10 (boxes) is available.

## Syringe count options

**Select Count** requested 10–100 by tens. Priced options only:

| Count | Price | Status |
|-------|-------|--------|
| 10 | $12 | Available (`premium-insulin-syringes-10`) |
| 20 | — | **Missing — not enabled** |
| 30 | — | **Missing — not enabled** |
| 40 | — | **Missing — not enabled** |
| 50 | $39 | Available (`premium-insulin-syringes-50`) |
| 60 | — | **Missing — not enabled** |
| 70 | — | **Missing — not enabled** |
| 80 | — | **Missing — not enabled** |
| 90 | — | **Missing — not enabled** |
| 100 | $69 | Available (`premium-insulin-syringes-100`) |

No new prices were invented.

## CTA change

Accessory CTA is consistently **Add to Cart** (price displayed above the button, not inside it).

## Cart behavior

- Name examples: `Alcohol Prep Wipes — 200 Count`, `Premium Insulin Syringes — 50`, `Discreet Travel Bag`
- Count/size via `variantLabel` when applicable (`Count: 200 Count`)
- Quantity preserved on the line
- Accessories are not labeled “One-Time Purchase” in checkout
- `requiresIntake` forced false for accessory adds

## Confirmation: wellness purchase logic untouched

- Semaglutide / Tirzepatide / other wellness PDPs still render `WellnessProductPage`
- Flat-rate membership, Auto-Refill 10%, One-Time dose pricing unchanged
- `weightMembership.ts` / `purchaseOptions.ts` / accessory product prices not rewritten
- Stripe, admin, auth, Provider Care, navigation not modified

## Verification

| Command | Result |
|---------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass (5 pre-existing react-refresh warnings) |
| `npm test` | Pass — 52 tests |
| `npm run build` | Pass |
