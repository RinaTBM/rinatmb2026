# Provider Appointment Automation — Phase 1 Discovery

**Feature branch:** `cursor/provider-appointment-automation-2026`  
**Base:** `deploy/ach-launch-clean-2026` @ `1c2590e`  
**Date:** 2026-08-12  
**Mode:** READ-ONLY architecture audit — **no implementation**

Constraints honored: no checkout/ACH/Wire/Kashu/Stripe/catalog/SKU/price/copy changes; no CrossTx calls; no production data writes.

Related scope table: `docs/provider-automation-product-scope.md`

---

## STEP 1 — Feature branch

| Check | Result |
|-------|--------|
| Parent | `1c2590e` (known-good baseline) |
| Branch | `cursor/provider-appointment-automation-2026` |
| Tree | Docs-only discovery commits; no feature code |

---

## STEP 2 — Provider-care products

### Initial Provider Visit

| Field | Value |
|-------|-------|
| DISPLAY NAME | Initial Provider Visit |
| PRODUCT ID | `pc1` |
| VARIANT ID | `initial-provider-consultation-v1` |
| SKU | `MBM-PC-IPV-SRV-001` |
| PRICE | $75 |
| SLUG | `initial-provider-consultation` |
| ACTIVE | yes (`status=active`) |
| VISIBLE | yes |
| CATEGORY | `provider-care` |
| DESCRIPTION | Consultation with licensed clinician to review goals/history and whether treatment options make sense (not a medication). |

### Follow-Up Visit

| Field | Value |
|-------|-------|
| DISPLAY NAME | Follow-Up Visit |
| PRODUCT ID | `pc2` |
| VARIANT ID | `follow-up-appointment-v1` |
| SKU | `MBM-PC-FUV-SRV-001` |
| PRICE | $55 |
| SLUG | `follow-up-appointment` |
| ACTIVE | yes |
| VISIBLE | yes |
| CATEGORY | `provider-care` |
| DESCRIPTION | Follow-up visit to review progress, side effects/questions, and refine plan. |

### Laboratory Review

| Field | Value |
|-------|-------|
| DISPLAY NAME | Laboratory Review |
| PRODUCT ID | `pc3` |
| VARIANT ID | `laboratory-review-v1` |
| SKU | `MBM-PC-LAB-SRV-001` |
| PRICE | $55 |
| SLUG | `laboratory-review` |
| ACTIVE | yes |
| VISIBLE | yes |
| CATEGORY | `provider-care` |
| DESCRIPTION | Provider visit focused on interpreting lab results; does not automatically include ordering labs or prescribing. |

### Presence matrix

| Source | IPV | Follow-Up | Lab Review |
|--------|-----|-----------|------------|
| `products.ts` | YES | YES | YES |
| Backend `catalog_variants` seed | NO (storefront/TS only) | NO | NO |
| `order_items.sku` can store | YES (when client sends) | YES | YES |
| Scriptful export | YES | YES | YES |
| Tagada / `kashu_sku_map` seed docs | YES | YES | YES |

Values were **not** modified.

---

## STEP 3 — Customer identity

| Question | Answer |
|----------|--------|
| CAN RELIABLY IDENTIFY RETURNING CUSTOMER | **YES** only when authenticated and `orders.customer_user_id` set |
| PRIMARY CUSTOMER KEY | `auth.users.id` / `orders.customer_user_id` (not email) |
| GUEST CHECKOUT PRESENT | **YES** |
| RISKS OF MATCHING BY EMAIL | Email not unique on orders; typos/shared inboxes; guest→account leaves prior orders unlinked (`customer_user_id` null); never use email as clinical/approval identity |

Checkout passes optional `customerUserId: user?.id`; guest orders remain invisible to `/account/orders`. Profile table (`customer_profiles`) is contact-only.

---

## STEP 4 — Order history / statuses

### `order_status` / fulfillment / events (same allow-list)

`order_received` · `payment_confirmed` · `action_required` · `provider_review_in_progress` · `processing` · `preparing_for_shipment` · `shipped` · `delivered` · `canceled` · `refunded`

### `payment_status`

`awaiting_payment` · `payment_under_review` · `paid` · `payment_failed` · `cancelled` · `refunded` (+ legacy `pending`/`failed`/`partially_refunded`)

### Distinguishing concepts

| Concept | Represented? | How |
|---------|--------------|-----|
| Paid | YES | `payment_status=paid` |
| Provider review started | YES | `provider_review_in_progress` |
| Provider **approved** | **NO** | Not in schema |
| Processing / shipped / delivered | YES | statuses above |
| Cancelled / failed / refunded | YES | statuses above |

**IMPORTANT:** `paid` does **not** mean provider-approved. Fulfillment can advance to `processing` when paid without an approval record. Product copy: payment does not guarantee a prescription.

---

## STEP 5 — Variant / therapy identification

| Capability | Answer | Mechanism |
|------------|--------|-----------|
| CAN IDENTIFY THERAPY FAMILY | **YES** | Parent product `slug` / `id` (propose `therapy_family = slug`) |
| CAN IDENTIFY EXACT VARIANT | **YES** | `ProductVariant.id` / cart `variantId` / `order_items.variant_id` |
| CAN IDENTIFY SELECTED SKU | **YES** | `VARIANT_SKU_BY_ID` + `order_items.sku` |
| CAN COMPARE TWO VARIANTS AS SAME THERAPY | **YES** | Same parent product / same `therapy_family` key; different `sku`/`variant_id` = dose/form change |

Strength/formulation live on structured `strength` / `dosageForm` / `size` fields — do not parse display names.

---

## STEP 6 — Products requiring provider logic

See `docs/provider-automation-product-scope.md`.

| Class | Count (active+visible) | Automation applies |
|-------|------------------------:|--------------------|
| PROVIDER-GUIDED PRESCRIPTION | 15 | **YES** |
| ACCESSORY | 9 | NO |
| PROVIDER SERVICE | 3 | NO (visit SKUs are outputs, not triggers) |
| MEMBERSHIP | 2 | NO (program SKU; fulfillment uses retail vial SKUs) |

**PROVIDER-AUTOMATION PRODUCT COUNT: 15**

---

## STEP 7 — Current provider workflow / CrossTx

| Question | Answer |
|----------|--------|
| CROSSTX CODE INTEGRATION PRESENT | **NO** |
| CROSSTX CREDENTIALS PRESENT | **NO** (no CrossTx vars in `.env.example`) |
| API INTEGRATION AVAILABLE | **NO** / unavailable for MBM automation today |
| CURRENT MANUAL WORKFLOW | Checkout → ACH/Wire invoice → admin marks paid → optional admin “Provider Review In Progress” → medical intake **off-app** → provider approval **off-platform** → admin advances fulfillment / Ageless Pharma Rx manually. Provider-care visits are purchasable products with scheduling/intake disclaimers; **no appointment booking API**. |

---

## STEP 8 — Safe prior-history rule

| Field | Value |
|-------|-------|
| BEST CURRENT SOURCE OF PRIOR APPROVAL | **None reliable.** Closest weak signal: authenticated customer has prior `payment_status=paid` + `order_status ∈ {processing, preparing_for_shipment, shipped, delivered}` with matching `order_items.sku` / `variant_id` |
| WHY | Those statuses prove payment/fulfillment ops, not clinical approval |
| LIMITATIONS | Admin can skip `provider_review_in_progress`; no approval outcome; guest history unlinked; `variant_snapshot` is request text not approved dose |

**Conclusion:** A new provider approval / therapy-history field (or table) is **required** before safe same-dose / dose-change automation.

---

## STEP 9 — Desired rules vs current data model

| Rule | SUPPORTED TODAY | MISSING DATA |
|------|-----------------|--------------|
| A. FIRST THERAPY → Initial Visit | **PARTIAL** | Can detect no prior paid/fulfilled SKU for family **if logged-in**; cannot prove clinical “first”; guests fail |
| B. SAME THERAPY + SAME VARIANT → No appointment | **NO (safe)** | No approval record; paid/fulfilled ≠ approved |
| C. SAME THERAPY + DIFFERENT VARIANT → Follow-Up | **NO (safe)** | Same; SKU diff detectable but approval unknown |
| D. NEW THERAPY → Initial/new-therapy visit | **PARTIAL** | Therapy family via product slug; approval history missing |

---

## STEP 10 — Multi-product cart (proposal only)

Recommended (do not implement yet):

1. Evaluate each **provider-guided prescription** line independently for required visit type.
2. **Collapse** required visits to the **highest** needed intensity in the cart:
   - Any “first/new therapy” → require **one** Initial Provider Visit (not N).
   - Else any “dose change” → require **one** Follow-Up Visit.
   - Else all same-dose reorders → **no** visit.
3. If customer already added IPV/Follow-Up/Lab manually, **dedupe** against auto-required visit (don’t double-charge same visit type).
4. Membership + medication: apply rules to the **fulfillment medication variant**, not the membership program SKU.
5. Accessories / Lab Review: never auto-add from prescription rules (Lab Review remains optional add-on).

---

## STEP 11 — Price / line-item enforcement

| Question | Answer |
|----------|--------|
| CAN SERVER ADD REQUIRED LINE ITEM | **NO** today (`create-invoice-order` trusts client `items[]`) |
| CAN SERVER RECALCULATE TOTAL | **NO** today (only arithmetic identity check) |
| CAN CLIENT REMOVE REQUIRED LINE ITEM AFTER SERVER CHECK | **YES** (no server check exists) |
| CAN ORDER_ITEMS STORE PROVIDER VISIT SKU | **YES** |

**Required for Phase 2+:** server-side inject/validate visit SKU + authoritative price lookup + reject tampered carts.

---

## STEP 12 — Proposed MINIMUM additive schema (not created)

Prefer simplest safe architecture:

1. **`customer_therapy_history`** (or equivalent)  
   - `customer_user_id`, `therapy_family`, `variant_id`, `sku`, `approval_status`, `approved_at`, `source_order_id`, `notes`  
   - Written only by admin (or future CrossTx) when a dose is **actually approved**

2. **Order-level provider requirement (on `orders` or child table)**  
   - `provider_requirement` (`none` \| `initial_visit` \| `follow_up_visit`)  
   - `provider_requirement_reason`  
   - `previous_variant_sku` / `requested_variant_sku` (or JSON of per-line decisions)  
   - `provider_workflow_status` (`not_required` \| `manual_action_required` \| `completed` \| `error`)  
   - `provider_visit_order_item_id` (FK to injected visit line)

Optional later: persist per-line decisions in `order_items` metadata.  
Do **not** overload `provider_review_in_progress` as approval.

---

## STEP 13 — Manual CrossTx handoff (proposal)

Statuses: `NOT_REQUIRED` · `MANUAL_ACTION_REQUIRED` · `COMPLETED` · `ERROR`

Admin order detail should show:

- Requirement + reason  
- Prior therapy/dose (from history, if any)  
- Requested therapy/dose (cart SKUs)  
- Required visit type + linked order line  
- Manual CrossTx status + last updated by/at + note  

Ops: open CrossTx outside MBM → complete appointment/intake → mark COMPLETED in admin. No API calls in Phase 1–2 until credentials exist.

---

## STEP 14 — Test plan (future)

1. Brand-new customer + first prescription → Initial Visit  
2. Returning + exact same SKU (approved history) → No visit  
3. Returning + higher dose → Follow-Up  
4. Returning + lower dose → Follow-Up  
5. Returning + new therapy → Initial/new-therapy visit  
6. Prior failed payment only → treat as no approval  
7. Prior cancelled only → no approval  
8. Prior refunded → no approval (unless explicit history says otherwise)  
9. Prior fulfilled without approval record → **must not** auto-waive visit until history exists  
10. Multi-product cart collapse rules  
11. Guest checkout → cannot use history; require Initial (or force login)  
12. Client removes required visit line → server reject  
13. ACH order path  
14. Wire order path  
15. Future Kashu card path (flag still off)

---

## FINAL REPORT

```
FEATURE BRANCH: cursor/provider-appointment-automation-2026
BASE COMMIT: 1c2590e

INITIAL PROVIDER VISIT:
PRODUCT ID: pc1
VARIANT ID: initial-provider-consultation-v1
SKU: MBM-PC-IPV-SRV-001
PRICE: $75

FOLLOW-UP VISIT:
PRODUCT ID: pc2
VARIANT ID: follow-up-appointment-v1
SKU: MBM-PC-FUV-SRV-001
PRICE: $55

RETURNING CUSTOMER IDENTIFICATION: YES (auth user id only; guests NO)
PRIOR THERAPY IDENTIFICATION: YES (product slug / therapy_family)
PRIOR APPROVED VARIANT IDENTIFICATION: NO
SAME-DOSE DETECTION POSSIBLE: YES structurally / NO safely without approval history
DOSE-CHANGE DETECTION POSSIBLE: YES structurally / NO safely without approval history
NEW-THERAPY DETECTION POSSIBLE: YES structurally / PARTIAL without approval history

BEST CURRENT APPROVAL SOURCE:
  None reliable — new customer_therapy_history (or equivalent) required.
  Do not treat paid/fulfilled/provider_review_in_progress as approval.

PROVIDER-AUTOMATION PRODUCT COUNT: 15
  (see docs/provider-automation-product-scope.md)

SERVER-SIDE REQUIRED LINE ITEM POSSIBLE: NO (must be built)
CROSSTX INTEGRATION PRESENT: NO

DATABASE CHANGES NEEDED:
  - customer_therapy_history (approval truth)
  - order provider_requirement / reason / workflow_status / visit line link
  - server authoritative inject+price for visit SKUs

RECOMMENDED RULE ENGINE:
  Per prescription line → map to visit need → collapse cart to max(Initial, Follow-Up, None)
  → server inject one visit SKU when needed → persist requirement metadata
  → admin manual CrossTx handoff until API exists

MULTI-PRODUCT CART RECOMMENDATION:
  One visit charge max per checkout; Initial dominates Follow-Up; dedupe manual visit adds;
  memberships evaluated via fulfillment medication SKU; accessories ignored.

MANUAL CROSSTX ADMIN FLOW:
  NOT_REQUIRED | MANUAL_ACTION_REQUIRED | COMPLETED | ERROR
  Admin sees requirement, prior/requested dose, visit type, status; completes in CrossTx off-app.

IMPLEMENTATION RISKS:
  - Treating paid/shipped as “approved”
  - Email/guest identity false matches
  - Client-trusted cart totals / removable visit lines
  - Membership program SKU vs fulfillment vial SKU confusion
  - No CrossTx API — ops bottleneck / status drift
  - Therapy family must stay slug-stable (esp. bimatoprost-solution display rename)

SAFE TO IMPLEMENT PHASE 2: YES
  (discovery complete; Phase 2 should be schema + server enforcement + admin manual workflow
   behind feature flag; still no CrossTx API calls; no catalog/payment changes to baseline)
```

**Stop.** No production modifications. No provider rules implemented.
