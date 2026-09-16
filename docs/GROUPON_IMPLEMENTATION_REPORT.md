# My Bare Method — Groupon implementation report

Status: merged and published in Bolt on 2026-09-16. Live: https://mybaremethod.com/groupon. Production database migration and Edge function deployed. PR #25 merged as `64b1c0fd6adb6ff73295eab5217ab9de250877af`.

Repository: `RinaTBM/rinatmb2026`. Base: `deploy/ach-launch-clean-2026`, commit `2c69ee8`. Feature branch: `feature/groupon-manual-redemption`.

## What is implemented

- Separate `/groupon` redemption page, plus an expandable section beside the existing checkout promo area for applicable hormone carts and in the hormone Care Basket.
- Four exact package names from the brief; internal package IDs are not presented as customer discount codes.
- Existing account sign-in is required. Account overview links back to Groupon after sign-in/signup. Customer name is collected; identity and email come from the server-validated account, never from a supplied customer ID.
- Pending Verification is the only initial state. Submission confirms receipt, explains provider eligibility, separate charges and the required care steps, and asks the customer to wait for manual coordination instead of purchasing the covered package again.
- Customers can revisit masked voucher status. Full codes and internal notes are returned only to administrators.
- `/admin/groupon` is part of the existing admin system. A Groupon section is also available below an existing order detail. Staff can verify, reject, cancel, record manual redemption, add notes, and link an existing order owned by that customer. The existing order page remains the source for clinical/provider approval status.
- Manual verification and redemption timestamps, reviewer events, optimistic concurrency checks and explicit redemption confirmation.

## Source inspection

| Requested inspection | Current implementation |
| --- | --- |
| Square checkout | No direct Square API client, checkout function or Square product-sync implementation was found in this source branch. Prescription product pages/Care Basket use GEN-hosted product-first checkout via `src/lib/commerce/genHostedCheckout.ts`. Square configuration behind that external checkout was not inspected or changed. |
| Other website checkout | `src/pages/CheckoutPage.tsx`, `src/lib/payments/submitInvoiceOrder.ts`, `supabase/functions/create-invoice-order/`, and legacy Kashu/Tagada helpers. These older paths coexist with GEN-hosted prescription checkout. |
| Promo codes | `src/lib/promo/genPromo.ts` and `supabase/functions/_shared/genPromo.ts`, plus the restricted MBMTEST90 path. FIRSTTIME is $25 (authenticated); OGTBM is 25%; TEST is restricted to the configured business email. Subscription/membership carts are excluded. Some older AGENTS documentation describes superseded promo rules; this change uses current code as evidence. |
| Customers/orders | `customer_profiles`, `orders`, `order_items`, `order_fulfillment`, `order_status_events`, `order_admin_notes`; customer linkage on orders is `customer_user_id`. |
| Hormone products | `src/data/websiteFamilies/`, its applied families and GEN pairing registry; SKU registries include `src/data/variantSkus.ts`. No product IDs or prices were edited. |
| Source/metadata | No suitable general source column was found on the core order schema. Existing subscription metadata is unrelated. `source='groupon'` is on the new voucher record, alongside customer/order linkage. |
| Shipping | Current shipping code is `src/lib/orders/shipping.ts`: accessory shipping $10; no separate storefront charge for non-accessory care; the existing threshold logic is retained. Values in older notes differ. No shipping code was edited. |

## Pricing and stacking boundary

This implementation is voucher tracking and manual review only. A Groupon submission/status produces **zero automatic pricing changes**, never becomes a Square/GEN coupon, never creates a payment discount, and never marks an order paid. Therefore this feature cannot stack a voucher discount with an existing promo discount.

The existing promo calculation and server validation remain unchanged. This does **not** implement a financial credit or covered-service allocation engine. Before adding such an engine, the precise included services, non-covered charges and promo eligibility would need to be defined and validated server-side. Verification alone does not authorize financial credit or medication fulfillment.

Reference metadata stores the brief's $75 consultation, $119 panel, $55 lab review, $249 base total and therapy starting amounts. It is explicitly marked reference-only and never used to overwrite live catalog prices or calculate payment.

## Database and service

Migration: `supabase/migrations/20260916003644_groupon_manual_redemptions.sql`.

New tables:

- `groupon_redemptions`: full code, package ID/name, authenticated customer ID/name/email, optional order ID, source, five permitted statuses, submission/verification/redemption timestamps, internal notes, version and reference metadata.
- `groupon_redemption_events`: internal reviewer audit trail. Submitted/verified/redeemed/rejected/cancelled events are recorded here; notes-only changes use `groupon_redemption_review_updated`. Event rows contain no voucher code. No new analytics vendor or Meta custom healthcare events were added. Opened-event analytics is not implemented.

Both tables enable RLS and revoke all browser-role access. Only the server can read/write them. The Edge function `groupon-redemptions` verifies the Auth token with `getUser`; admin actions additionally require the existing `is_admin()` RPC. Customer results use an explicit allowlist of safe fields and a masked code. Neither full codes nor authentication values are written to logs, analytics, URLs or local storage.

Two service-role-only SQL functions perform atomic submission and review transactions, using SECURITY INVOKER. They do not touch existing order totals, provider statuses or subscription records. Explicit grants accommodate current Supabase Data API behavior.

Duplicate handling:

1. Trim leading/trailing whitespace only. Preserve case, punctuation and internal spaces until Groupon documents which formats are equivalent.
2. A unique database constraint on the trimmed code prevents concurrent inserts from creating duplicate records.
3. A repeat pending submission by the same authenticated customer returns the original record, preserving its original package/order association.
4. Other customer submissions and verified/redeemed/rejected/cancelled codes receive a generic duplicate message without another customer's information.
5. Terminal codes stay reserved. Corrections require a separate reviewed support process; customers cannot recycle rejected/cancelled codes.

## Admin operation

1. Sign in through the existing admin flow; open **Groupon**.
2. Check the full code and selected package against Groupon Merchant manually.
3. Choose **Verified** and save notes. This only records voucher verification.
4. Coordinate the prepaid clinical entry described below; keep consultation, labs, lab review and licensed-provider approval in the existing clinical system.
5. If an MBM order exists, attach its UUID. The server requires an exact authenticated-customer match; email alone is not sufficient. Existing order links cannot be reassigned.
6. After actually redeeming in Groupon Merchant, choose **Redeemed**, check the explicit confirmation, then save. No automated call to Groupon occurs.

## Tests and limits

| Test | Result |
| --- | --- |
| Production build | PASS, including existing prerender build. |
| New Groupon rule tests | 4 PASS. |
| New Edge authorization/privacy tests | 6 PASS against the actual handler with isolated Auth/PostgREST doubles. |
| Existing GEN promo tests | 7 PASS. |
| Existing GEN-hosted checkout routing tests | 5 PASS. |
| Real PostgreSQL-engine migration/permission tests | PASS using local PGlite with synthetic fixtures: pending retries, different-customer duplicates, verification, redemption confirmation, stale writes, order ownership, immutable linkage, terminal states, timestamps, audit events, unchanged payment totals and denied browser-role access. |
| Full existing suite comparison | Baseline: 572 pass / 30 fail out of 602. Feature run before the final 6 endpoint tests: 576 pass / the same 30 fail out of 606. No added failures. The 6 endpoint tests then passed separately. |
| TypeScript comparison | Same existing errors as baseline; no new errors after fixes. Whole-project typecheck is not clean. |
| Browser checks | Bolt preview and live `/groupon` render the new page with sign-in required. Small-mobile and signed-in form visual checks remain unverified. |
| Hosted Square checkout/product sync/subscriptions | NOT end-to-end tested. No direct Square implementation or credentials were changed; the external service was not modified. |
| Deployed Supabase backend | Migration and function deployed to staging and production. Staging SQL transaction passed submit, verify, explicit redemption confirmation, redeem and audit assertions; synthetic records rolled back. Production RLS/grants checked; both endpoints reject unsigned requests with HTTP 401. Real signed-in customer/admin end-to-end journey remains untested. |
| Prepaid Groupon clinical handoff | Manual staff coordination remains required. No automatic prepaid GEN handoff or covered-service credit is implemented. |

Existing failing suites cover legacy shipping/payment expectations, provider lab expectations, catalog routing and visibility. They are outside this additive feature; this report does not certify the existing checkout as fully healthy.

Reproduce the new checks:

```sh
npm ci
npm run test -- src/lib/groupon src/lib/promo/genPromo.test.ts src/lib/commerce/genHostedCheckout.test.ts
npm install --prefix /tmp/mbm-groupon-qa @electric-sql/pglite@0.3.14
node scripts/test-groupon-db.mjs /tmp/mbm-groupon-qa/node_modules/@electric-sql/pglite/dist/index.js
npm run build
```

The local database test creates only an isolated in-memory database and never connects to Supabase.

## Deployment and operating boundary

The user authorized merge and publication. PR #25 is merged to `deploy/ach-launch-clean-2026`; Bolt confirmed publication on 2026-09-16, and the live `/groupon` page was checked afterward.

The additive migration and only the `groupon-redemptions` Edge function were deployed first to MyBareMethod Staging (`mxvaxkkwrbwhqasnsjpm`) and then production (`bsgtuuzwgeetsjjdrtrm`). Production and staging use the same function bundle. Supabase security advisors reported informational RLS-without-policy notices on the new tables: this is intentional, because browser roles have no access and only the authenticated server handler uses the service role. No customer-facing policies should be added to expose full voucher codes.

**Manual care coordination is required after voucher verification.** The existing GEN checkout is payment-first. Staff must use their approved prepaid patient process; sending a verified voucher customer through normal paid checkout risks charging for covered services again. The customer page asks customers to wait for staff coordination. Verification does not start clinical care, authorize fulfillment, mark an order paid, or create a financial credit.

No real vouchers or payments were submitted as tests. Existing Square/GEN settings, credentials, prices, subscription billing, shipping logic, promo calculations, payment webhooks and clinical gates were not changed. The scope of deployed verification and remaining test limits is recorded above.

## Files changed

Existing files (small insertion-only changes):

- `src/App.tsx`
- `src/admin/AdminApp.tsx`
- `src/components/PrescriptionBasketDrawer.tsx`
- `src/pages/CheckoutPage.tsx`
- `src/pages/account/AccountOverviewPage.tsx`

New files:

- `src/admin/AdminGroupon.tsx`
- `src/components/GrouponEntry.tsx`
- `src/pages/GrouponPage.tsx`
- `src/lib/groupon/service.ts`
- `src/lib/groupon/groupon.test.ts`
- `src/lib/groupon/endpoint.test.ts`
- `supabase/functions/_shared/groupon.ts`
- `supabase/functions/groupon-redemptions/index.ts`
- `supabase/migrations/20260916003644_groupon_manual_redemptions.sql`
- `scripts/test-groupon-db.mjs`
- `docs/GROUPON_IMPLEMENTATION_REPORT.md`

Documentation checked: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) and [explicit Data API grants](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically).
