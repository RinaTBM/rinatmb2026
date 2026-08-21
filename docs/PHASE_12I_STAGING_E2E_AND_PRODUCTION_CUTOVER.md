# Phase 12I — Staging E2E + Production Cutover Preparation

**Branch:** `deploy/ach-launch-clean-2026`  
**Start SHA:** `3049f6c7fc793ea5983ef9c9910b9b885d45d1b2`  
**Mode:** Final staging validation + production cutover plan  
**Production touched:** NO  
**Main merge:** NO  
**GEN auto-handoff at cutover:** OFF  
**GEN webhook:** DISABLED / DEFER

---

## 0. Baseline

| Check | Result |
|---|---|
| Preflight typecheck | PASS |
| Preflight tests | **460** passed |
| Preflight build | PASS |
| STAGING TARGET VERIFIED | YES (`mxvaxkkwrbwhqasnsjpm`) |
| PRODUCTION WRITE GUARD VERIFIED | YES (`bsgtuuzwgeetsjjdrtrm` read-only only) |

---

## 1. Staging environment inventory (names only)

| Secret / flag | Staging | Safe value notes |
|---|---|---|
| `TAGADA_API_KEY` | PRESENT | — |
| `TAGADA_API_BASE` | PRESENT | non-secret base URL |
| `TAGADA_STORE_ID` | PRESENT | — |
| `TAGADA_CHECKOUT_URL` | PRESENT | allowlisted host |
| `TAGADA_WEBHOOK_SECRET` | PRESENT | — |
| `GEN_HEALTH_API_KEY` | PRESENT | — |
| `GEN_HEALTH_BASE_URL` | PRESENT | — |
| `GEN_HEALTH_ENABLED` | PRESENT | enabled for staging GEN ops |
| `GEN_HANDOFF_AUTOMATION_ENABLED` | PRESENT | **false / OFF** |
| `REQUIRE_GEN_MAPPING_FOR_RX` | PRESENT | staging may be open; prod defaults fail-closed |
| `MBM_RUNTIME_ENV` | PRESENT | `staging` |
| `GEN_HEALTH_WEBHOOK_SECRET` | ABSENT | expected — webhook deferred |
| `GEN_API_ORDERS_PAYMENT_STATUS_ENABLED` | ABSENT / unset | **must stay unset** until GEN enables API Orders |
| `MBM_SITE_ORIGIN` | ABSENT on staging secrets list (prod has it) | verify at cutover |

Do not print secret values.

---

## 2. Staging database state (read-only verified)

| Object | Result |
|---|---|
| `gen_sku_map` | Expected current count; **1 READY** (`MBM-RP-BPC-INJ-001`), **27 BLOCKED** |
| BPC READY map | `gen_client_product_id` → `KXMm9SsbOEYnFy9phmZn`; medication BPC-157 / TB500 3 MG / 3 MG/ML (5 ML); Optimal Balance Pharmacy; cost **11700** cents; shipping NULL/TBD |
| `order_gen_orders` / `gen_sync_events` / `gen_webhook_events` | Present; used by PATH B fixtures only |
| `orders.gen_handoff_*` + 12H clinical columns | Present on staging |
| Production GEN schema | **ABSENT** (gap for cutover) |

Mappings were **not** modified in this phase.

---

## 3. E2E strategy

| Path | Decision |
|---|---|
| **PATH A — real Tagada paid** | **NOT USED.** Prior 4242 session hit live rails despite CRM `testMode=true`. No authoritative confirmation of a true non-live sandbox rail. Do not retry blindly. |
| **PATH B — isolated fixture / internal staging E2E** | **USED.** |

### PATH B fixture rules (mandatory)

- Marker: `PHASE_12I_FIXTURE_NOT_REAL_TAGADA_PAYMENT`
- `payment_processor=manual` (not Tagada)
- `external_payment_id` / transactionId prefix: `fixture_12i_tx_NOT_REAL_TAGADA_*`
- QA emails `@example.com` only
- Never touch production Tagada / GEN / DB
- Cannot be mistaken for a real Tagada payment authority path
- Exercises the same post-paid GEN gate + sync logic

Public order numbers used (examples): `MBM-FIXTURE-12I-BPC-003`, `MBM-FIXTURE-12I-BPC-004`.

---

## 4. Commerce / payment authority (staging)

| Check | Result |
|---|---|
| Product / variant / cart / checkout create (no card charge required) | Exercised via existing commerce stack + fixture paid order |
| Browser return cannot mark paid | PASS — `get-order-payment-status` returns `markedPaid: false` |
| `get-order-payment-status` read-only | PASS (deployed on staging during 12I) |
| `tagada-webhook` sole external paid authority | Unchanged; fixtures never invoke Tagada paid path |
| Amount mismatch blocks paid | Covered by prior 12F.1 hardening (no regression in this phase) |
| Rx READY can pass GEN eligibility | PASS (BPC) |
| Rx BLOCKED fail-closed when guard enabled | Policy confirmed (production default); staging map remains 27 BLOCKED |
| Accessories / non-Rx without GEN | Unchanged |

---

## 5. Post-paid GEN gate (`canStartGenHandoff`)

Exercised against fixture paid order + BPC READY map.

| Condition | Result |
|---|---|
| Paid order required | PASS |
| Verified transaction ID required | PASS (fixture tx id) |
| Rx item required | PASS |
| READY/ACTIVE GEN map + `gen_client_product_id` | PASS (BPC only) |
| Duplicate GEN order prevented | PASS → `ALREADY_LINKED` |
| `GEN_HEALTH_ENABLED` required | PASS |
| Automation OFF → eligible but no auto call | PASS (`forceManual=true` for admin handoff only) |

---

## 6. Manual GEN handoff E2E (PATH B)

| Step | Result |
|---|---|
| QA GEN patient ensure/reuse | PASS — patient `J7oIrqyM47AIv9e7gq7L` (`@example.com`) |
| Manual admin handoff | PASS |
| GEN V2 order create | PASS — order id `rJhKvWQz8ylvB75FTQTs` (BPC-004 fixture) |
| `payment_status="paid"` in GEN payload | **OMITTED** (see launch blocker) |
| `requiredActions` returned | **PRESENT** — 3 tokens: `forms`, `uploads`, `patient_continuation` |
| Persist `order_gen_orders` | PASS |
| Idempotent re-handoff | PASS — **DUPLICATE GEN ORDER CREATED: NO** (`ALREADY_LINKED`) |
| Payment status on MBM after sync | Remains **`paid`** (`paymentUnchanged: true`) |

### GEN create contract (staging-confirmed)

Working body shape:

```json
{
  "patient_id": "<genPatientId>",
  "order": {
    "clientProductId": "<id>",
    "transactionId": "<id>"
  }
}
```

Sending `order.payment_status` / `paymentStatus` returns HTTP 400:

> Setting order.payment_status is not enabled for this client… enable API Orders.

Code now omits `payment_status` unless `GEN_API_ORDERS_PAYMENT_STATUS_ENABLED=true`.

**Consequence:** GEN order status may be `pending_payment` / GEN `paymentStatus: unpaid` even when MBM is `paid`. Clinical flow still proceeds with requiredActions. This is a **launch blocker** for true paid clinical parity until GEN enables API Orders for the client.

### Magic-link policy

GEN may return `magicLink` (email + token). MBM **must not** persist or expose magic-login / `token=` URLs (parse strip + normalize strip).

---

## 7. GEN status sync

| Check | Result |
|---|---|
| `gen-health-sync` (admin) | PASS |
| GET GEN order → normalized clinical status | PASS → `GEN_ACTION_REQUIRED` |
| requiredActions snapshot preserved | PASS (GET often omits actions; sync **must not wipe** create-time snapshot) |
| `last_synced_at` / `gen_sync_events` | PASS |
| Payment state changed by sync | **NO** |
| Prescription status | **NOT YET EXPECTED** |
| Pharmacy status | **NOT YET EXPECTED** |

---

## 8. Portal + admin clinical UX

| Surface | Result |
|---|---|
| Customer `get-order-clinical-status` | PASS — `clinicalWritable: false`, stage Action Required / health information needed |
| Action cards from real GEN requiredActions | PASS (FORM / UPLOAD / OTHER) — no fake local completion |
| Timeline stages | Only reached states shown as reached |
| Admin clinical panel fields | Handoff/sync/clinical fields available; admin cannot mark paid / approved / shipped / override clinical authority |

---

## 9. Multi-Rx / non-Rx / membership

| Check | Result |
|---|---|
| Multi-Rx display model | Code supports multiple `order_gen_orders` per MBM order (fixtures/mocks OK; no extra real GEN orders required) |
| Accessory checkout | Unaffected |
| Non-Rx → no GEN | Unaffected |
| Provider visit flow | Unchanged |
| Lab flow | Unchanged |
| Membership rebill → GEN med order | **NO** (must remain NO) |

### SEM / TIR membership safety (audit only — not fixed in 12I)

Membership pages still describe provider-guided medication programs. SEM/TIR GEN mappings remain **BLOCKED**. Under production `REQUIRE_GEN_MAPPING_FOR_RX` fail-closed, selling memberships that imply immediate medication fulfillment while vial SKUs are BLOCKED is a **launch blocker** unless storefront/copy clearly separates program enrollment from med fulfillment availability (or SEM/TIR maps become READY after verification).

---

## 10. Staging code fixes discovered in 12I (safe)

| Change | Why |
|---|---|
| Migration `20260821170000_gen_service_role_grants_12i.sql` | service_role lacked DML/SELECT on GEN tables / profiles → handoff fail-closed |
| Nested GEN order create payload | Flat / wrong nesting rejected by GEN |
| Omit `payment_status` by default | GEN API Orders not enabled |
| Parse string `requiredActions` + unwrap `data` envelopes | GEN returns string tokens |
| Strip magic-login URLs (parse + normalize) | PHI/token leakage prevention |
| Sync preserve requiredActions when GET empty | Avoid wiping create-time actions |
| Staging-only `gen-health-qa-order-probe` | Payload probe — **DO NOT deploy to production** |

---

## 11. Production cutover inventory

### 11.1 Database migrations (apply order — DO NOT APPLY in 12I)

| # | Migration | Classification |
|---|---|---|
| 1 | `20260821120000_gen_health_v2.sql` | **REQUIRED** |
| 2 | `20260821160000_gen_clinical_status_sync_12h.sql` | **REQUIRED** |
| 3 | `20260821170000_gen_service_role_grants_12i.sql` | **REQUIRED** (before any GEN handoff) |

Rollback: prefer **forward-only** additive migrations. Prefer feature-flag rollback over destructive DB rollback.

Production GEN tables today: **ABSENT** → migrations required.

### 11.2 Production GEN SKU seed (DO NOT APPLY in 12I)

| SKU | mapping_status |
|---|---|
| `MBM-RP-BPC-INJ-001` | **READY** only (`KXMm9SsbOEYnFy9phmZn`, Optimal Balance, 11700¢) |
| All other sellable Rx SKUs (27) | **BLOCKED** |

If production guard relies on row presence: seed **all** rows with correct READY/BLOCKED. Never seed 28 READY.

### 11.3 Secrets plan (names only)

| Secret | Classification |
|---|---|
| `TAGADA_API_KEY` | COPY/VERIFY EXISTING (present on prod) |
| `TAGADA_API_BASE` | COPY/VERIFY EXISTING |
| `TAGADA_STORE_ID` | COPY/VERIFY EXISTING |
| `TAGADA_CHECKOUT_URL` | COPY/VERIFY EXISTING |
| `TAGADA_WEBHOOK_SECRET` | COPY/VERIFY EXISTING |
| `GEN_HEALTH_API_KEY` | **CREATE** |
| `GEN_HEALTH_BASE_URL` | **CREATE** |
| `GEN_HEALTH_ENABLED` | **CREATE** (`true` only when ready to allow outbound GEN) |
| `GEN_HANDOFF_AUTOMATION_ENABLED` | **CREATE** as **`false`** — **DO NOT SET true yet** |
| `REQUIRE_GEN_MAPPING_FOR_RX` | **CREATE/VERIFY** → production fail-closed (`true`) |
| `MBM_RUNTIME_ENV` | **CREATE** → `production` |
| `GEN_API_ORDERS_PAYMENT_STATUS_ENABLED` | **DO NOT SET YET** (until GEN enables API Orders) |
| `GEN_HEALTH_WEBHOOK_SECRET` | **DO NOT SET YET** (webhook deferred) |

### 11.4 Edge functions

| Function | Classification |
|---|---|
| `create-invoice-order` | DEPLOY AT CUTOVER (ensure latest Rx guard) |
| `create-kashu-checkout-session` | DEPLOY AT CUTOVER |
| `tagada-webhook` | DEPLOY AT CUTOVER (must remain sole paid authority; no auto GEN) |
| `get-order-payment-status` | DEPLOY AT CUTOVER |
| `gen-health-handoff` | DEPLOY AT CUTOVER (manual only; automation off) |
| `gen-health-sync` | DEPLOY AT CUTOVER |
| `get-order-clinical-status` | DEPLOY AT CUTOVER |
| `gen-health-webhook` | **DEFER** (signature verification incomplete) |
| `gen-health-list-products` | **STAGING ONLY** |
| `gen-health-qa-patient` / `gen-health-qa-patient-probe` | **STAGING ONLY** |
| `gen-health-qa-order-probe` | **STAGING ONLY** |
| Legacy Stripe functions | Do not re-enable |

### 11.5 Frontend / DNS

| Item | Classification |
|---|---|
| Frontend build with clinical portal/admin UI | **REQUIRED** at cutover |
| DNS / domain changes | **NOT REQUIRED** for GEN (Tagada checkout domain already in use) |

### 11.6 Feature flag cutover sequence

1. Deploy schema + grants + functions + frontend; **`GEN_HANDOFF_AUTOMATION_ENABLED=false`**
2. Seed BPC READY + remaining Rx BLOCKED
3. Verify production read-only admin / mapping / clinical endpoints
4. One controlled production BPC checkout **only if owner explicitly approves**
5. Verify Tagada paid order
6. Manual GEN handoff
7. Verify clinical sync + portal/admin
8. Only then consider enabling automatic GEN handoff (separate approval)

Do **not** enable automation during initial production deployment.

---

## 12. Production Rx availability plan

| Category | Customer-facing behavior |
|---|---|
| BPC injection (`MBM-RP-BPC-INJ-001`) | Purchasable if Tagada mapping valid **and** production GEN map READY |
| Other Rx (27 BLOCKED) | **Temporarily unavailable** (fail-closed; do not silently sell) |
| Accessories | Available |
| Visits / labs | Preserve current behavior |
| Memberships | Must not promise medication fulfillment while SEM/TIR GEN maps BLOCKED — treat as launch blocker until copy/availability fixed or maps READY |

---

## 13. Go-live smoke test checklist (plan only — no production run)

- [ ] Homepage
- [ ] Shop
- [ ] BPC product PDP + add to cart
- [ ] Blocked Rx product (unavailable / fail-closed)
- [ ] Cart
- [ ] Checkout → Tagada redirect
- [ ] Payment return (browser does not mark paid)
- [ ] Portal clinical status (customer)
- [ ] Admin order + GEN clinical panel
- [ ] GEN mapping panel (BPC READY only)
- [ ] Clinical status endpoint
- [ ] Accessory purchase smoke
- [ ] Membership enrollment smoke (billing only; no auto med GEN)

---

## 14. Rollback plan

| Issue | Preferred lever |
|---|---|
| Frontend issue | Redeploy prior frontend build |
| Tagada checkout issue | `VITE_KASHU_CARD_ENABLED=false` + redeploy; keep webhook parity |
| GEN handoff issue | Keep / set `GEN_HANDOFF_AUTOMATION_ENABLED=false`; stop manual handoff |
| Clinical status issue | Disable clinical UI flag if needed; sync remains read-only to payment |
| Bad Rx sell-through | Set `gen_sku_map.mapping_status=BLOCKED` per SKU; `REQUIRE_GEN_MAPPING_FOR_RX=true` |
| Function regression | Function version rollback |

Prefer flags + map status over destructive DB rollback.

---

## 15. Security review (staging final)

| Check | Status |
|---|---|
| No secrets client-side (`VITE_*` only public) | PASS |
| No PHI / magic tokens in logs or portal URLs | PASS (strip policy) |
| No card data stored on MBM | PASS |
| Browser cannot write payment / clinical states | PASS |
| service-role server-only | PASS (+ grants migration) |
| Admin routes authenticated (`is_admin`) | PASS |
| RLS on clinical tables | Present (select-own / admin) |
| GEN API server-only | PASS |
| Tagada API server-only | PASS |

---

## 16. Launch blockers

1. **GEN API Orders / `payment_status=paid` not enabled** for this GEN client → clinical orders create as `pending_payment` while MBM is paid.
2. **Production missing** GEN schema, grants, secrets, and GEN edge functions (entire cutover package).
3. **SEM/TIR (+ 27 Rx) BLOCKED** vs membership/storefront sellability under production fail-closed GEN guard — do not silently sell blocked Rx or promise med fulfillment.
4. **Tagada true sandbox rail still unconfirmed** — PATH A blocked; controlled live card still needs owner approval.
5. **GEN webhook** remains undocumented → keep disabled.
6. **GEN auto-handoff must stay OFF** at first production cutover.

---

## 17. Final test gate (this phase)

Re-run after 12I code fixes:

- `npm run typecheck`
- `npm test` (expect ≥460; includes `genOrderParse12i.test.ts`)
- `npm run build`

---

## 18. Next phase

**12J — controlled production deployment / cutover**  
**OR** **BLOCKED — resolve launch blockers first**

Do **not** start 12J from this phase automatically.
