# Phase 12I.5 — White-Label GEN V2 API Wrapper + MBM Clinical Flow

**Branch:** `deploy/ach-launch-clean-2026`  
**Start note:** Expected brief SHA `b99cea0` already superseded by 12I.3/12I.4 on this branch; work continued from tip.  
**Staging:** `mxvaxkkwrbwhqasnsjpm` · **Production:** `bsgtuuzwgeetsjjdrtrm` (**untouched**)  
**GEN auto-handoff:** OFF · **`GEN_API_ORDERS_ENABLED`:** FALSE  

This phase builds the white-label clinical engine wrapper. It does **not** launch Rx purchasing, enable API Orders, or start 12J.

---

## Architecture

```
MyBareMethod Frontend (branded UI)
        ↓  authenticated JWT
MBM Edge Functions (gen-health-clinical, gen-health-handoff, gen-health-sync, …)
        ↓
Canonical GEN wrapper (src/lib/genHealth + Edge _shared mirror)
        ↓  X-API-Key (server only)
GEN Health V2 API
```

**Hard rule:** NO browser → GEN. NO `VITE_GEN_API_KEY`.

---

## Canonical client

Facade: `src/lib/genHealth/genHealthClient.ts` → `genHealth.*`

| Area | Methods |
|---|---|
| patients | `ensure` / `create` (`ensureGenPatient` = `createOrReuseGenPatient`) |
| products | `getForms` / `getFormsNormalized` |
| orders | `create`, `createUnpaid`, `get`, `markPaid`, `sync`, `assertMarkPaidEligible` |
| forms | `listForProduct`, `submit` |
| prescriptions | `listForOrder`, `list` |
| conversations | `list`, `sendMessage` |
| visits / labs | `list` (wrapper readiness) |
| uploads | `status()` → **DEFERRED** until upload/token docs confirmed |

Low-level HTTP: `genRequest` in `genHealth.ts` (mirrored to Edge `_shared/genHealth.ts`).

---

## Normalized MBM domain types

`src/lib/genHealth/clinicalDomain.ts`:

ClinicalPatient, ClinicalProduct, ClinicalFormSchema/Field, ClinicalOrder, ClinicalRequiredAction, ClinicalPrescription, ClinicalVisit, ClinicalLab, ClinicalConversation, ClinicalMessage.

Application code should depend on these — not raw GEN JSON.

---

## Two-phase external-paid flow

1. `createGenOrderUnpaid` → `POST /v2/client/orders` (no `payment_status`)  
2. Tagada verifies paid (payment authority)  
3. `markGenOrderPaid` → `PATCH /v2/client/orders/:id` `{ payment_status: "paid", transaction_id }`  

`markPaid` **requires** `GEN_API_ORDERS_ENABLED=true`. When false → `GEN_API_ORDERS_DISABLED` (no workaround).

Eligibility: `assertGenMarkPaidEligible` — MBM paid + verified Tagada tx + READY map + GEN order + API Orders.

---

## Forms (white-label)

- Schema: `GET /v2/client/products/:id/forms` via wrapper  
- Normalize: `genForms.ts` (`normalizeProductFormsResponse`)  
- UI: `ClinicalFormRenderer` (MBM branding; no GEN logo)  
- Submit: `POST /v2/client/orders/:id/forms/submissions` via Edge `gen-health-clinical`  
- **Answers are not stored in MBM** (no localStorage; not logged)  
- Unknown required field types → fail gracefully (`GEN_UNKNOWN_FIELD`)

---

## Customer clinical API (Edge)

`supabase/functions/gen-health-clinical`

Actions (POST, customer JWT, order ownership enforced):

| action | Behavior |
|---|---|
| `status` | Local `order_gen_orders` safe snapshot |
| `get_forms` | Proxy product forms |
| `submit_form` | Proxy form submission (no answer logs) |
| `list_messages` / `send_message` | Conversation wrappers |

Cross-user order/patient IDs → 404.

---

## Customer journey UI

Portal `/account/orders/:id` → **Your care journey** with stages:

Payment Received → Health Information → Provider Review → Prescription → Pharmacy Processing → Shipped → Complete

Derived from normalized GEN clinical status (`clinicalJourney.ts`). Stages not marked complete by frontend clicks.

---

## Required actions (customer copy)

| GEN category | Customer label |
|---|---|
| FORM | Complete Health Information |
| UPLOAD | Upload Required Information |
| VISIT | Schedule Required Visit |
| LAB | Complete Lab Requirement |
| CONTINUATION | Continue Clinical Review |

---

## Admin

Existing AdminOrders GEN clinical refresh/sync preserved. Admin may view GEN IDs/statuses. Admin cannot mark paid / prescribed / shipped clinically.

Manual handoff still via `gen-health-handoff` + `forceManual` when automation off.

---

## Error model (normalized)

`GEN_API_DISABLED`, `GEN_API_ORDERS_DISABLED`, `GEN_PATIENT_ERROR`, `GEN_ORDER_CREATE_ERROR`, `GEN_MARK_PAID_ERROR`, `GEN_FORM_FETCH_ERROR`, `GEN_FORM_SUBMIT_ERROR`, `GEN_PRESCRIPTION_SYNC_ERROR`, `GEN_MESSAGE_ERROR`, `GEN_RETRY_REQUIRED`, `GEN_CONFLICT`, …

Customers never see raw GEN payloads.

---

## Observability

Logs: operation, MBM order/item IDs, GEN order ID, HTTP status, error code, correlation ID, duration.  

**Never log:** API keys, DOB, address, form answers, messages, uploads, magic links, full GEN bodies.

---

## Safety flags (unchanged)

| Flag | State |
|---|---|
| `GEN_HANDOFF_AUTOMATION_ENABLED` | **false** |
| `GEN_API_ORDERS_ENABLED` | **false** |
| `GEN_API_ORDERS_PAYMENT_STATUS_ENABLED` | unset / false |
| Tagada payment authority | preserved |
| Membership rebill → GEN med | **NO** |
| Accessories GEN-free | **YES** |
| Phase 12I.4 formulary / prices | **unchanged** |

---

## Gaps / deferred

1. **API Orders** — mark-paid capability off until Scriptful/GEN enables  
2. **Uploads** — wrapper deferred pending confirmed upload/token docs  
3. **patient_continuation** — prefer API; if only GEN-hosted URL exists, continue documenting deep-link limitation  
4. **Visits/labs billing** — wrapper ready; MBM visit/lab products not migrated  

---

## Next

Scriptful enables API Orders → **Phase 12I.6** controlled staging white-label clinical E2E → then **12J** cutover.

**STOP AFTER 12I.5. DO NOT START 12I.6 OR 12J.**
