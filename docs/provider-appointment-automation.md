# Provider Appointment Automation

My Bare Method (MBM) Phase 2 — provider visit requirement, therapy-history source of truth, and **manual** CrossTx workflow.

**Does not** integrate or call CrossTx APIs.  
**Does not** change ACH/Wire behavior, Stripe, Kashu card enablement, or catalog prices/SKUs/slugs.

Related discovery: `docs/provider-appointment-automation-discovery.md`, `docs/provider-automation-product-scope.md`.

---

## Business rules (summary)

| Situation | Requirement | Visit billed |
| --- | --- | --- |
| No APPROVED history for therapy family, and no APPROVED history for any family | `INITIAL` | Initial Provider Visit — **$75** (`MBM-PC-IPV-SRV-001`) |
| APPROVED history for other families, none for requested family | `NEW_THERAPY` | Initial Provider Visit — **$75** (same product unless a separate visit is defined later) |
| Current APPROVED SKU == requested fulfillment SKU | `NONE` | None |
| Current APPROVED SKU ≠ requested fulfillment SKU (dose/formulation change) | `FOLLOW_UP` | Follow-Up Visit — **$55** (`MBM-PC-FUV-SRV-001`) |

Only **`APPROVED`** rows in `customer_therapy_history` count.  
`PENDING`, `REJECTED`, and `SUPERSEDED` do **not** count.  
**Paid / fulfilled / `provider_review_in_progress` orders do not establish approval.**

---

## Therapy-history source of truth

Table: `public.customer_therapy_history` (migration `20260812120000_provider_appointment_automation.sql`).

- Additive history: new `APPROVED` rows; prior `APPROVED` for same customer + therapy family become `SUPERSEDED`.
- Customers may **read** their own rows (checkout UX). Customers **cannot** insert/update.
- Writes: admin / service role only (`is_admin()` RLS).
- Admin action: **Record Provider Approval** (explicit confirmation required).

---

## Therapy family map

Explicit map for **15** provider-guided prescription products (product id / slug → family).  
Do **not** infer family from display-name strings.

Membership programs (`m1` / `m2`) resolve to `semaglutide` / `tirzepatide`, but provider comparison uses the **requested fulfillment vial SKU**, never the membership program SKU.

Accessories and provider-care products are ignored for requirement evaluation (except the injected visit itself).

Code: `src/lib/provider/therapyFamilies.ts` (mirrored under `supabase/functions/_shared/`).

---

## Initial vs Follow-Up vs New Therapy

Pure function: `determineProviderRequirement` in `src/lib/provider/determineProviderRequirement.ts`.

- Per-line decision, then **collapse to one visit max**.
- Priority: `INITIAL` / `NEW_THERAPY` > `FOLLOW_UP` > `NONE`.
- Examples: two new therapies → one Initial; same-dose reorder + new therapy → one Initial; two dose changes → one Follow-Up; same-dose only → none.

---

## Guest / auth requirement

Returning-customer matching uses **auth user id** only.  
Email matching is **not** used.

If the cart contains any provider-guided prescription / mapped membership and the customer is **not** authenticated → require sign-in / create account before finalizing.  
Accessory-only (and non-Rx) guest carts keep current guest behavior.

---

## Server-side visit injection

Authoritative path: `create-invoice-order` Edge Function.

1. Strip client `pc1` / `pc2` / visit SKUs.
2. Evaluate requirement from therapy history.
3. Inject correct visit at **server** price.
4. Recalculate subtotal / provider-care tax / total.
5. Persist `provider_*` fields on `orders` and `provider_visit_order_item_id`.

Client cannot omit, remove, or reprice the required visit. Wrong manual visit type is replaced/deduped.

ACH, Wire, and future `kashu_card` order creation share this total path (Kashu frontend flag remains off).

---

## Manual CrossTx workflow

After verified payment:

- `provider_requirement === NONE` → `provider_workflow_status = NOT_REQUIRED`
- otherwise → `MANUAL_ACTION_REQUIRED`

Admin action **Mark CrossTx Appointment Completed** moves  
`MANUAL_ACTION_REQUIRED` → `COMPLETED`  
(MBM tracking only — does **not** claim MBM created a CrossTx appointment).

---

## Admin approval workflow

On order detail:

- Show requirement, reason, previous/requested SKUs, required visit, charge, workflow status.
- **Record Provider Approval** prefills from order when possible; confirms; inserts `APPROVED` and supersedes prior approved row for that family.

---

## Fulfillment guard

Existing payment guard preserved.

For final fulfillment/shipping (`processing`, `preparing_for_shipment`, `shipped`, `delivered`):

1. `payment_status = paid`, **and**
2. Provider satisfied: `NONE` **or** (`provider_workflow_status = COMPLETED` **and** APPROVED therapy history for ordered therapy/variant as appropriate).

Accessory / provider-service-only / `NONE` orders are not blocked incorrectly.

**Conflict note:** `provider_review_in_progress` still only requires paid (manual CrossTx window). It does **not** require COMPLETED + approval; final shipping paths do.

---

## Future CrossTx API hook

When a CrossTx API exists, replace the manual “Mark Completed” step with an idempotent sync that still:

- Writes MBM `provider_workflow_status`
- Does **not** invent therapy approvals (approval remains explicit admin / provider action into `customer_therapy_history`)

---

## Pending migration

`supabase/migrations/20260812120000_provider_appointment_automation.sql`  
**Do not apply to production until explicitly approved.**
