# Phase 12I.1 — GEN External-Paid / API Orders Capability Resolution

**Branch:** `deploy/ach-launch-clean-2026`  
**Start SHA:** `1f555edb871b968b0085d3c901b6e460dc0e925c`  
**Staging:** `mxvaxkkwrbwhqasnsjpm`  
**Production touched:** **NO**  
**GEN auto-handoff:** **OFF**  
**New QA GEN order created:** **NO**

---

## Verdict

| Question | Answer |
|---|---|
| Root cause | **ACCOUNT_CAPABILITY** — GEN client lacks **API Orders** enablement |
| Code / payload bug? | **NO** for current staging-safe create shape |
| Product config forces GEN checkout payment? | **UNKNOWN** as primary cause (no explicit force-payment field; `pricing.amount=0`) |
| V2 post-create mark-paid endpoint proven? | **NO** (candidate paths return **404** on GET; not exercised mutating) |
| GEN support action required? | **YES** |
| Production Rx cutover | **BLOCKED** until API Orders / external-paid is enabled and re-verified on staging |

Classification matching the phase brief:

**E. a GEN account feature not yet enabled by support**  
(with documented V2 field behavior that is rejected until that feature is on)

---

## 1. Current create-order payload (staging code)

`createGenOrder` → `POST /v2/client/orders`

**Safe shape currently sent (default; API Orders flag off):**

```json
{
  "patient_id": "<genPatientId>",
  "order": {
    "clientProductId": "<gen clientProductId>",
    "transactionId": "<verified Tagada or fixture tx id>"
  }
}
```

| Field | Sent today? | Location / casing |
|---|---|---|
| `patient_id` | YES | **top level**, snake_case |
| `clientProductId` | YES | **`order.clientProductId`**, camelCase |
| `transactionId` | YES | **`order.transactionId`**, camelCase |
| `payment_status` | **NO** (omitted) | would be **`order.payment_status`** when `GEN_API_ORDERS_PAYMENT_STATUS_ENABLED=true` |
| top-level `payment_status` | NO | — |
| `order.paymentStatus` (camel) | NO | — |

Gate: `GEN_API_ORDERS_PAYMENT_STATUS_ENABLED` must be `true` before MBM sends `order.payment_status="paid"`. Default remains off so create does not 400.

---

## 2. Live GET — existing GEN order `rJhKvWQz8ylvB75FTQTs`

Read-only via staging probe (`get_order`). Payment-related safe fields:

| Field | Value |
|---|---|
| **GEN RAW ORDER STATE** | `pending_payment` |
| **GEN RAW PAYMENT STATE** | `unpaid` (`paymentStatus`) |
| `paymentVerificationStatus` | `trusted` |
| `paymentVerification.transactionId` | fixture tx accepted (`fixture_12i_tx_NOT_REAL_TAGADA_HANDOFF4_…`) |
| `paymentVerification.notes` | Payment status trusted from Client API request; no server-side verification… |
| `paymentVerification.source` | `client_api_requestConsult` |
| `paymentGateway` | `client_api` |
| `amount` | `0` |
| `orderType` | `product` |
| `productId` | `KXMm9SsbOEYnFy9phmZn` |
| GET `requiredActions` | often empty (create-time snapshot preserved in MBM) |

**Interpretation:** GEN accepted and stored the **transactionId** in payment verification metadata, but still leaves the order **`pending_payment` / `unpaid`** because **`order.payment_status` was never successfully applied**.

---

## 3. Documented external-paid contract (project GEN V2 guide)

From `docs/GEN_HEALTH_V2_INTEGRATION_DESIGN.md` (owner / GEN V2 guide paraphrase captured in-repo):

> Charge through your processor → send `order.payment_status = "paid"` → optional `transactionId`

| Doc check | Result |
|---|---|
| **DOCUMENTED EXTERNAL-PAID FLOW** | **YES** |
| **DOCUMENTED FIELD** | `payment_status` = `"paid"` |
| **DOCUMENTED LOCATION** | **`order.payment_status`** (nested under `order`) |
| **DOCUMENTED TRANSACTION FIELD** | `transactionId` (optional / supported) |

No public OpenAPI dump is in-repo; public web search does not expose GEN Health client V2 payment reference. Live staging API error text is treated as authoritative for capability gating.

---

## 4. Capability / settings evidence

### Reconfirmed live rejection (no order created)

Probe variant `probe_payment_field_rejection` posted:

```json
{
  "patient_id": "…",
  "order": {
    "clientProductId": "KXMm9SsbOEYnFy9phmZn",
    "payment_status": "paid",
    "transactionId": "fixture_12i_tx_NOT_REAL_TAGADA_payfield_12i1"
  }
}
```

**HTTP 400** error (safe):

> Setting order.payment_status is not enabled for this client. Remediation: Remove order.payment_status or ask your administrator to enable API Orders.

`createdOrderId`: **null**

| Capability | Classification |
|---|---|
| API Orders feature enabled | **REQUIRED** (explicit GEN error) |
| External Payments enabled | **UNKNOWN** (may be subsumed by API Orders) |
| Connect Payments configuration | **UNKNOWN** |
| API checkout mode | **UNKNOWN** |
| Client account permission | **REQUIRED** (admin must enable API Orders) |
| Provider-network permission | **UNKNOWN** |
| Product-level payment setting | **UNKNOWN** / not primary (see §5) |
| Account support activation | **REQUIRED** |

---

## 5. Product configuration (`KXMm9SsbOEYnFy9phmZn`)

Read-only GET `/v2/client/products/{id}` (safe fields):

| Field | Value |
|---|---|
| name | BPC-157 |
| type | product |
| pricing.amount | **0** |
| pricing.currency | USD |
| storefrontEligible | **false** |
| requiresSyncVisit | false |
| requiresLab / requiresLabs | false |
| checkoutLinks | productFirst / intakeFirst / assessmentFirst (GEN-hosted URLs present) |

**PRODUCT CONFIG CAN FORCE GEN PAYMENT:** **UNKNOWN** as sole cause — no explicit “must collect GEN payment” flag observed. Primary blocker remains the **API Orders** client capability (400 text). Product `amount=0` aligns with GET order `amount=0` but does not explain rejection of `payment_status`.

---

## 6. Post-create mark-paid / V1 vs V2

### Path discovery (GET / OPTIONS only — **no mutating calls**)

| Path | GET |
|---|---|
| `/v2/client/orders/{id}` | 200 |
| `/v2/client/orders/{id}/pay` | **404** |
| `/v2/client/orders/{id}/payment` | **404** |
| `/v2/client/orders/{id}/mark-paid` | **404** |
| `/v2/client/orders/{id}/mark_paid` | **404** |
| `/v2/client/orders/{id}/actions/mark-paid` | **404** |
| `/v2/client/orders/{id}/actions/pay` | **404** |
| `/v2/client/payments` | **404** |
| `/v2/client/orders/payment` | **404** |

OPTIONS on several paths returns a broad `Allow: GET,POST,PUT,PATCH,DELETE,OPTIONS` from the gateway; that is **not** treated as proof of a mark-paid action.

**V2 POST-CREATE MARK-PAID ENDPOINT:** **NO** (not proven / dedicated paths 404)

### V1 comparison (documentation-only)

Historical V1 references (cancel / mark paid / refund) exist in prior GEN materials referenced during design. **Do not call V1.** External-paid for V2 is documented as **create-time** `order.payment_status="paid"` (+ optional `transactionId`). Without API Orders, that create-time field is rejected; no verified V2 post-create substitute was found.

---

## 7. Did GEN ignore our field?

| Scenario | Evidence |
|---|---|
| Field omitted (current production-safe code path) | Order stays `pending_payment` / `unpaid`; tx id still lands in `paymentVerification` |
| Field included (`order.payment_status=paid`) | **HTTP 400** — not ignored; **explicitly rejected** pending API Orders |

**Likely cause enum:** **ACCOUNT_CAPABILITY_DISABLED**  
(not `API_FIELD_IGNORED`, not `IMPLEMENTATION_PAYLOAD_BUG` for the nested create shape)

---

## 8. Code fix decision

| Item | Decision |
|---|---|
| **CODE FIX REQUIRED** | **NO** |
| Change create nesting? | No — nesting already matches staging-confirmed working create |
| Force-send `payment_status` now? | **No** — would break handoff with 400 |
| Create new QA paid order? | **No** — current payload already correct for capability; payment field still rejected |
| Local pretend GEN paid / overwrite clinical? | **Forbidden** — not done |

Staging-only probe gained read-only diagnostics (`get_order` paymentSafe, `get_product`, path probe, payment-field rejection). **Do not deploy probe to production.**

---

## 9. RequiredActions preservation

MBM `order_gen_orders` for `rJhKvWQz8ylvB75FTQTs`:

- `clinical_status`: `GEN_ACTION_REQUIRED`
- `required_actions_json`: **3** — `uploads`, `forms`, `patient_continuation`
- GET often returns empty actions; sync preserve-empty behavior from 12I remains intact

**REQUIREDACTIONS PRESERVED:** **YES**

---

## 10. Production cutover impact

| Area | Status |
|---|---|
| **PRODUCTION RX CUTOVER** | **BLOCKED** |
| Accessories / non-Rx | Unaffected |
| Visits / labs | Unaffected |
| Membership rebill → GEN med | Still must **not** auto-create GEN orders |
| `REQUIRE_GEN_MAPPING_FOR_RX` | Keep fail-closed — do not loosen |
| `GEN_HANDOFF_AUTOMATION_ENABLED` | Remain **OFF** |
| `GEN_API_ORDERS_PAYMENT_STATUS_ENABLED` | Remain unset until GEN enables API Orders **and** staging re-verify shows paid/non-pending |

Until GEN orders created after Tagada paid can show non-`pending_payment` / non-`unpaid` payment state without workarounds, Rx clinical cutover must not proceed.

---

## 11. Copy-ready GEN support request

Subject: Enable API Orders / externally-paid V2 orders for My Bare Method staging client

Hello GEN Health support,

We integrate as an **external payment processor** architecture:

1. Customer pays on our commerce processor (Tagada)  
2. Our server verifies payment  
3. We create the clinical order via **GEN Health V2** `POST /v2/client/orders`

**Documented expectation:** send nested `order.payment_status = "paid"` with optional `transactionId`.

**Staging client behavior today:**

- Create **without** `payment_status` succeeds, but GEN order remains:
  - `orderStatus`: `pending_payment`
  - `paymentStatus`: `unpaid`
- Create **with** `order.payment_status = "paid"` returns HTTP **400**:
  - “Setting order.payment_status is not enabled for this client. Remediation: Remove order.payment_status or ask your administrator to enable API Orders.”

**Example staging GEN order id (QA/fixture only):** `rJhKvWQz8ylvB75FTQTs`  
**Product:** clientProductId ending in `KXMm9SsbOEYnFy9phmZn` (BPC-157 pairing)  
**QA patient only** (no real customer PHI in this request)

**Ask:** Can you enable/confirm **API Orders / externally-paid order support** so orders created through V2 with `payment_status=paid` and `transactionId` do **not** remain `pending_payment`?

Also please confirm:

1. Is create-time `order.payment_status="paid"` the only supported V2 external-paid path?  
2. Is there a supported V2 post-create mark-paid action (method/path/body)?  
3. Any product-level setting required in addition to API Orders?

Thank you.

---

## 12. Next step

**GEN SUPPORT ENABLEMENT REQUIRED**

Then re-run a single staging QA create **with** `GEN_API_ORDERS_PAYMENT_STATUS_ENABLED=true` after enablement confirmation.

Do **not** start 12J.  
Catalog mapping expansion (12I.2) may proceed in parallel only if it does not assume GEN paid parity.
