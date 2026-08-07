# Membership Backup Snapshot — 2026-08-06

Captured on branch `weight-membership-relaunch-2026` immediately before the weight-membership relaunch.
Raw source backups stored alongside this file:

- `docs/backup/products.pre-membership.ts` — `src/data/products.ts` (includes the pre-relaunch `memberships` array)
- `docs/backup/MembershipsPage.pre-membership.tsx`
- `docs/backup/MembershipTermsPage.pre-membership.tsx`

(Also see `docs/backup/products.original.ts` and `docs/backup/sync-stripe-products.original.ts` from the catalog relaunch.)

## Pre-relaunch membership configuration (in `src/data/products.ts`)

Three memberships (simple shape: id, name, price, priceLabel, tagline, description, features[], highlighted):

1. `semaglutide-membership` — "Bare Semaglutide Membership" — $175/month — tagline "Semaglutide program"
2. `tirzepatide-membership` — "Bare Tirzepatide Membership" — $225/month — tagline "Tirzepatide program" (highlighted)
3. `elite-wellness-membership` — "Bare Elite Wellness" — $49/month — "All other wellness products"

Consumers: `MembershipsPage` (cards + comparison + accessory-discount section + terms cards), `HomePage` (Members Save More mini-section), `ConcernPage` (`getMembershipsForConcern`, weight concern). Helper `getMembershipsForConcern` returned non-elite memberships for the weight concern.

## Payment mapping (Stripe seed `sync-stripe-products`)

- `m1` — "Bare Semaglutide Membership" — $150/mo — `type: recurring`
- `m2` — "Bare Tirzepatide Membership" — $200/mo — `type: recurring`

`create-checkout-session` looks up `stripe_price_id` by `app_product_id` and uses Stripe `subscription` mode when a synced product is `is_recurring` and the cart item is flagged `subscription`. The pre-relaunch `MembershipsPage.handleJoin` added a cart item with `productId = membership.id` (e.g. `semaglutide-membership`) — which does NOT match the seed ids `m1`/`m2`, so membership checkout would not resolve a Stripe price (pre-existing mismatch).

## Shipping (business model, from `ShippingPolicyPage` + `CheckoutPage`)

Shipping is charged, not a flat included benefit. Shipping Policy lists selectable paid options (Two-Day $20, Next-Day $30); checkout math applies free over $75 else $6.95 for one-time carts. Therefore memberships display "Shipping calculated separately."

## Membership terms / cancellation (pre-relaunch `MembershipTermsPage`)

Legal page listed "Bare Semaglutide Membership — $150 per month" and "Bare Tirzepatide Membership — $200 per month" plus general availability/cancellation language. (Note the $150/$200 legal figures differed from the $175/$225 display figures — a known pre-relaunch inconsistency.)

## Supabase records

No membership rows are modified by this relaunch beyond the `sync-stripe-products` seed (which is applied only when the sync function is run). No live Supabase writes performed.
