# Active Wellness Membership & Auto-Refill & Save

Premium purchasing strategy for My Bare Method. Implemented on the storefront + admin configuration layer. **Stripe Test Mode only** for discounted / Auto-Refill custom Checkout prices. Live Stripe is never modified.

## Purchasing options

### 1. Active Wellness Membership (Best Value)

Customers with an active:

- Semaglutide Membership — **$199/month** (unchanged)
- Tirzepatide Membership — **$249/month** (unchanged)

receive **15% off all eligible wellness products**.

Messaging: BEST VALUE · Members Save 15% · Exclusive / Preferred Member Pricing · Priority Wellness Benefits.

### 2. Auto-Refill & Save

Non-members (and members who prefer recurring delivery) may subscribe to individual eligible products:

- **10% off** eligible wellness products
- Monthly automatic deliveries (Stripe subscription `price_data`, test mode)
- Easy subscription management via Account → Subscriptions
- No membership required

### 3. One-Time Purchase

Standard pricing. No recurring commitment.

## Discount hierarchy (never stacks)

1. Active Wellness Membership → **15%** (wins)
2. Auto-Refill & Save → **10%**
3. One-Time → standard price

Maximum automatic savings: **15%**.

Active members who choose Auto-Refill still pay the **member** rate (15%), not 15%+10%.

## Eligible products

Each eligible wellness product supports One-Time, Auto-Refill & Save, and Member Pricing.

Defaults (from catalog builder):

| Rule | Behavior |
|------|----------|
| Active wellness categories | `autoRefillEligible` + `memberPricingEligible` = ON |
| Future products | `autoRefillEligible` = **OFF** until manually approved |
| Provider care / accessories | `excludedFromDiscounts` = ON |

Flags are editable per product in Admin → Products (and persist to `catalog_products` after migration).

## Excluded (never discounted)

- Initial Provider Visit / Follow-Up / Laboratory Review / consultations / intake fees
- Accessories
- Shipping
- Taxes
- Membership base monthly prices ($199 / $249)

## Product page UX

Options render in order:

1. 🥇 Active Wellness Membership — Become a Member (or Active Member Price when already a member)
2. ⭐ Auto-Refill & Save — Subscribe & Save
3. 🛒 One-Time Purchase — Buy Once

If the customer is already an Active Wellness Member:

- Hide “Become a Member” CTA
- Show Active Member Price / Save 15% / “You are receiving our best available pricing.”

## Membership page

Emphasizes lowest pricing, 15% savings, locked membership pricing, priority access, convenient monthly wellness, and provider-guided care.

## Shop collections

Tasteful badges on product cards:

1. Members Save 15% (priority)
2. else Auto-Refill 10%

## Checkout

Shows for eligible lines:

- Standard price
- Member / Auto-Refill savings
- Recurring price + billing frequency when Auto-Refill

Active members automatically receive member pricing on eligible cart lines.

Stripe Checkout (`create-checkout-session`):

- Program memberships (`m1` / `m2`) continue to use mapped Stripe Price IDs (base prices unchanged)
- Auto-Refill and discounted amounts use Checkout `price_data` and **require a Stripe test key**
- Live keys are rejected for custom discounted price paths

## Cancellation request policy

Communication policy (not an automatic Stripe billing rule):

> Auto-Refill subscriptions renew automatically each month. To help us process your request before your next renewal, please submit cancellation requests at least 7 calendar days before your renewal date. Once processed, you will receive confirmation.

Flow:

1. Customer submits request (Account → Subscriptions)
2. Submission date/time recorded
3. Admin notified via Admin → Cancellation Requests queue
4. Admin reviews → processes Stripe cancellation manually
5. Status: Submitted → Under Review → Processed → Cancellation Confirmed

Does **not**:

- Auto-reject for &lt;7 days notice
- Auto-charge an extra cycle because notice was short
- Auto-cancel Stripe subscriptions

## Customer account

Customers can:

- View Active Wellness Membership
- View Auto-Refill subscriptions + renewal dates
- Submit cancellation requests
- Update payment method (CTA placeholder until Customer Portal wiring)
- View subscription / request status

Customers cannot:

- Modify medication strength
- Modify provider-directed treatment

Demo control: Account → Subscriptions includes a local “simulate active membership” toggle for pricing UI verification before real auth/webhook membership state exists.

## Admin configuration

| Control | Default | Where |
|---------|---------|--------|
| Member Discount % | 15 | Admin → Purchase Pricing |
| Auto-Refill Discount % | 10 | Admin → Purchase Pricing |
| Auto-Refill Eligible | per product | Admin → Products |
| Member Pricing Eligible | per product | Admin → Products |
| Excluded From Discounts | per product | Admin → Products |

Future % / eligibility changes should be configuration-only (no code edits).

## Reporting

Admin dashboard tracks:

- Active Wellness Members (local portal until webhooks persist)
- Auto-Refill subscriptions
- Pending cancellation requests
- Member-pricing / Auto-Refill eligible product counts

## Pending migration

`supabase/migrations/20260807020000_purchase_savings_strategy.sql`

Adds:

- `store_purchase_settings`
- eligibility columns on `catalog_products`
- `cancellation_requests`
- `purchase_reporting_snapshots`

**Do not apply to production / Live Stripe from this change set alone.**

## Key code

| Area | Path |
|------|------|
| Pricing engine | `src/lib/pricing/purchaseOptions.ts` |
| Admin % settings | `src/lib/pricing/settings.ts` |
| Member state | `src/context/MemberContext.tsx` |
| Cancellation store | `src/lib/account/subscriptions.ts` |
| Checkout session | `supabase/functions/create-checkout-session/index.ts` |
| Tests | `src/lib/pricing/purchaseOptions.test.ts` |
