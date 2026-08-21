# Phase 12H — GEN clinical status + requiredActions sync

**Mode:** staging implementation only  
**Branch:** `deploy/ach-launch-clean-2026`  
**Clinical authority:** GEN Health  
**Payment authority:** Tagada  
**Auto handoff:** OFF  
**Webhook:** DISABLED (signature verification still undocumented)

## Goal

Make post-payment GEN clinical workflow understandable in MyBareMethod once a GEN order exists:

GEN order sync → requiredActions normalization → clinical status normalization → customer portal next steps → admin clinical visibility → manual refresh/retry

## Internal clinical states

| Internal | Meaning |
|---|---|
| `GEN_NOT_STARTED` | No clinical start yet |
| `GEN_PATIENT_PENDING` / `GEN_PATIENT_CREATED` | Patient provisioning |
| `GEN_ORDER_PENDING` / `GEN_ORDER_CREATED` | Order create path |
| `GEN_ACTION_REQUIRED` | Open requiredActions |
| `GEN_PROVIDER_REVIEW` | Care team review |
| `GEN_APPROVED` | Provider/prescription approved (only when GEN says so) |
| `GEN_DENIED` | Not approved / denied |
| `GEN_PHARMACY` | Pharmacy processing |
| `GEN_SHIPPED` / `GEN_COMPLETE` | Shipped / complete |
| `GEN_ERROR` / `GEN_RETRY_REQUIRED` | Operational failure — payment stays paid |
| `GEN_UNKNOWN` | Unmapped raw status — never auto-fulfill |

Mapping boundary: `normalizeGenClinicalStatus(raw)` in `src/lib/genHealth/clinicalStatus.ts` (mirrored under `supabase/functions/_shared/`).

## requiredActions categories

`FORM | UPLOAD | IDENTITY | LAB | VISIT | SCHEDULING | PAYMENT | OTHER`

Safe fields only: type, label/title, status, completed (if GEN exposes), continuation URL, due metadata, raw action id.

Completion is **never** inferred from customer click — only from GEN sync.

## Sync model

- `syncGenOrder(genOrderId)` — GET GEN V2 order → `buildGenOrderSyncPatch`
- Persists: `gen_order_status`, `required_actions_json`, `clinical_status`, `last_synced_at`, optional prescription/pharmacy fields
- Records `gen_sync_events` (safe metadata only)
- Does **not** modify MBM `payment_status`
- Does **not** auto-fulfill

### Manual refresh

Edge function `gen-health-sync` (admin JWT + `is_admin`):

- `refreshGenOrderStatus` / retry modes
- Rate-limited
- Never creates duplicate GEN orders (`unique(order_id, order_item_id)`)

### Customer status API

Edge function `get-order-clinical-status` (customer JWT):

- Reads **local** `order_gen_orders` only (no browser → GEN)
- Returns safe per-line snapshots
- `clinicalWritable: false`, `requiredActionsLocallyCompletable: false`

## Portal copy (non-promissory)

| Stage | Headline | Body |
|---|---|---|
| Payment / preparing / GEN failure | Payment Received | Payment confirmed / preparing clinical review |
| Action required | Action Required | Additional information is needed… |
| Provider review | Clinical Review | Information being reviewed by care team |
| Approved | Prescription Approved | Only when GEN status supports it |
| Pharmacy | Pharmacy Processing | Sent for pharmacy processing |
| Shipped | Shipped | Your order has shipped |
| Denied | Follow-up Needed | Requires follow-up from the care team |

Accessories / non-Rx: **no** GEN clinical stages.  
Multi-Rx: **per line item** status + actions.

## Admin clinical panel

Shows: MBM payment, Tagada tx id, GEN patient/order/clientProductId, raw + normalized status, requiredActions, prescription/pharmacy, last sync, handoff, retry count, safe error.

Actions: **Refresh GEN status**, **Retry GEN sync** (and existing gated manual handoff).

**Not** added: Mark Approved / Mark Shipped / Mark Paid clinical overrides.

## Pharmacy / prescription

Supported when GEN response exposes fields:

- `gen_prescription_id`, `prescription_status`, `last_prescription_sync_at`
- `pharmacy_status` (`PHARMACY_PENDING|PHARMACY_PROCESSING|SHIPPED|DELIVERED|UNKNOWN`)
- `tracking_number` only if GEN provides it

Migration: `supabase/migrations/20260821160000_gen_clinical_status_sync_12h.sql` (staging only unless approved).

## Webhook

`gen-health-webhook` remains **fail-closed** until signature header / algorithm / secret / replay rules are documented. Polling + manual refresh are the 12H path.

## Membership / visits / labs

Unchanged: membership rebill does **not** create GEN med orders. Visits/labs retain current behavior.

## Key files

- `src/lib/genHealth/clinicalStatus.ts`
- `src/lib/genHealth/genHealth.ts` (`syncGenOrder`, patch)
- `src/lib/commerce/clinicalNextSteps.ts`
- `src/pages/account/AccountOrderDetailPage.tsx`
- `src/admin/AdminOrders.tsx`
- `supabase/functions/gen-health-sync/`
- `supabase/functions/get-order-clinical-status/`

## Next

**12I** — final staging E2E + production cutover preparation (do not start in 12H).
