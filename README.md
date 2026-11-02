# My Bare Method (`rinatmb2026`)

## Treatment availability (November 2026)

Gen Health's **Unavailable states** setting is the source of truth. This storefront has no live availability feed, so `src/data/treatmentAvailability.ts` contains the owner-supplied November 1, 2026 fallback snapshot. Edit one product/form row there to update restrictions. Other products default to Puerto Rico unavailable; DC remains available for every product. Product and variant `unavailableStates` fields are derived from this file.

The selector remembers the shopper's state when browser storage is available. Unavailable cards remain visible, greyed with a state badge and disabled order button. Product pages replace ordering with an availability notice. Saved Care Basket items are checked again when the state changes. NAD+ nasal and Wolverine capsule restrictions apply only to the selected form. Gen Health confirms final eligibility.

This update leaves provider video visits, labs and FAQs unchanged pending complete requirements. The review table records `syncVisit` and `labsRequired` as not mirrored where the existing storefront does not define per-product values; no requirements are inferred from product names.

Provider-guided wellness storefront (Vite + React + TypeScript).

## Active deployment branch

Work and Bolt sync should target:

**`deploy/my-bare-method-integrated-2026`**

Do not treat older Bolt project snapshots as the source of truth. Import this GitHub repository and select the deploy branch above so Shop UX, flat-rate Wellness Membership, and full-resolution product images stay in sync.

## Key storefront notes

- Semaglutide / Tirzepatide product pages offer flat-rate Wellness Membership ($149 / $275), Auto-Refill (10%), and One-Time Purchase by strength.
- Shop navigation uses **Shop** → Shop All + Shop by Category (no Shop by Concern). Accessories and Provider Care remain top-level destinations.
- Checkout uses electronic invoice + manual ACH/wire (Stripe is retired). See `docs/project-status-2026.md`.
