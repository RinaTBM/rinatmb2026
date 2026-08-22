# AGENTS.md

## GEN/Whop checkout safety

- **GEN/Whop production cutover stays OFF by default.** Do not enable it without explicit owner approval.
- Keep the authoritative Edge flag `GEN_WHOP_CHECKOUT_ENABLED=false` unless the owner explicitly approves cutover.
- Keep the frontend hint `VITE_GEN_WHOP_CHECKOUT_ENABLED=false` unless the owner explicitly approves cutover.
- Do not treat successful GEN Hosted Checkout session creation or test transactions as approval to route production traffic through GEN/Whop.
- Preserve the existing Tagada/Kashu checkout path until an explicit cutover phase is approved.
- Do not enable recurring, auto-refill, SEM/TIRZ membership, mixed-cart, or accessory routing through GEN/Whop unless separately designed and explicitly approved.
- Browser return/redirect is never payment authority. Payment/order state must be reconciled server-side before MBM marks anything paid.
- Do not expose GEN or Whop secrets to the browser or commit them to source.

See `docs/GEN_WHOP_CHECKOUT_ROUTING.md` when present for the current routing design and cutover checklist.
