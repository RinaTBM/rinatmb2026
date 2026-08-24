# GEN Catalog Import Plan (GEN-CATALOG-1)

**Mode:** READ-ONLY — no POST / PATCH / DELETE  
**Branch:** `cursor/gen-catalog-1-import-plan-945c`  
**Generated:** 2026-08-24  
**Production website modified:** NO  
**GEN modified:** NO  
**GEN/Whop cutover:** OFF  

Machine-readable twin: `docs/GEN_CATALOG_IMPORT_PLAN.json`

---

## Blockers (must clear before any import execution)

| Blocker | Status | Impact |
|---|---|---|
| Master workbook `MyBareMethod_FINAL_GEN_Smart_Product_Upload_2026-08-23.xlsx` | **MISSING** from workspace | Phases 3–5 cannot classify master rows or propose exact formulary pairings |
| Live GEN Products API (`GET /v2/client/products`) | Staging Edge returned **401 Invalid API key** (2026-08-24) | Fresh inventory / product-detail / forms / excluded-states GETs blocked |
| Public OpenAPI for create/update bodies | **Not found** (`api.gen-health.app/openapi.json` → 404) | Exact POST/PATCH request schemas remain **UNKNOWN** until owner docs or a successful OPTIONS/schema dump |

**Do not treat this document as an executable import script.**

---

## Phase 1 — Schema audit (read-only)

### Endpoints (owner-listed / repo-confirmed)

| Capability | Endpoint | Evidence | Classification |
|---|---|---|---|
| List products | `GET /v2/client/products` | Prior successful staging GETs (cached); auth `x-api-key` | **SUPPORTED** |
| Get product detail | `GET /v2/client/products/:id` | Repo docs + staging helper tries this path | **SUPPORTED** (live refresh blocked by key) |
| List product forms | `GET /v2/client/products/:id/forms` | Wrapper in `src/lib/genHealth/genHealth.ts` | **SUPPORTED** |
| Create client product/package | `POST /v2/client/products` (owner-listed) | Owner statement; **not exercised**; body schema not in repo | Endpoint **SUPPORTED** / body schema **UNKNOWN** |
| Update client product/package | `PATCH /v2/client/products/:id` (owner-listed) | Owner statement; **not exercised** | Endpoint **SUPPORTED** / body schema **UNKNOWN** |
| Deactivate | `DELETE …` (owner-listed) | Owner statement; **not called** | Endpoint **SUPPORTED** (unused this phase) |
| Categories / consult products / state codes / excluded states / multi-product forms | Owner-listed GETs | Not re-fetched this phase (key failure) | **SUPPORTED** (claimed) / payloads **UNKNOWN** until live GET |

Auth for Products API: header **`x-api-key`** (Bearer alone returns “API key required” — prior probe). Never print key values.

### Fields observed on list GET (cached)

From prior successful `GET /v2/client/products?limit=500` (22 products):

| Field | Observed | Notes |
|---|---|---|
| `productId` | yes | GEN product id |
| `clientProductId` | yes | Client-scoped composite id |
| `name` | yes | Display / internal name |
| `displayName` | yes | Often empty string |
| `description` | yes | Free text |
| `type` | yes (richer preview) | e.g. `product` |
| `pricing.amount` | yes | All cached rows were **0** |
| `pricing.currency` | yes | `USD` |
| `storefrontEligible` | yes | All cached rows were **false** |
| `requiresSyncVisit` | yes | Only “Add Sync” true in cache |
| `categories` / `displayCategoryIds` / `primaryCategory` | yes | Empty / null in cache |
| `panels` | yes (preview) | Empty in sample |
| `imageUrl` / `displayImageUrl` / `displayImageBackgroundColor` | yes (preview) | null in sample |
| `checkoutLinks` | yes (preview) | productFirst / intakeFirst / assessmentFirst GEN-hosted URLs |
| `sourceProductId` / `productRelationship` | yes (preview) | present |
| `requiresLab` / `requiresLabs` | documented on BPC detail historically | Not in list projection |
| **assessment price** | **not in list** | UNKNOWN whether separate from `pricing` |
| **shipping** | **not in list** | MBM rule: medication shipping included in retail — do not invent GEN shipping fields |
| **quantity / supply duration / subscription** | **not in list** | UNKNOWN |
| **included visits** | partial via `requiresSyncVisit` | UNKNOWN beyond flag |
| **forms** | separate GET `/forms` | Not embedded in list |
| **formulary / medication IDs** | **not in list** | UNKNOWN on create/patch without detail schema |
| **excluded states** | separate GET/PATCH (owner-listed) | Not fetched this phase |
| **active / inactive** | **not clearly exposed** on list | UNKNOWN vs `storefrontEligible` alone |

### Schema questions (owner checklist)

| Question | Answer |
|---|---|
| Exact POST create request schema | **UNKNOWN** — endpoint claimed; body not documented in-repo; not probed with mutating calls |
| Exact PATCH update request schema | **UNKNOWN** |
| One client product → multiple formulary meds/strengths? | **UNKNOWN** — protocol names imply multi-compound packages; list API does not expose medication arrays |
| Draft / hidden product possible? | **LIKELY SUPPORTED** via `storefrontEligible=false` (all 22 cached products hidden + `pricing.amount=0`) |
| Forms attachable on create vs follow-up? | **UNKNOWN** — forms fetched via separate GET today |
| Formulary pairings on create/update vs other endpoint? | **UNKNOWN** — no pairing field in list; prior medication path probes (`/v2/client/medications`, `/pairings`) returned 404 |

**MBM policy notes for future create payloads (not applied):**

- Medication retail includes pharmacy shipping — do not add a separate medication shipping charge on MBM checkout.
- Accessories stay outside GEN medication routing.
- Future / non–website-live products: GEN `storefrontEligible=false`, MBM hidden/off, `checkout_enabled=false`, no production routing.
- Metformin: **DO NOT ADD**.

---

## Phase 2 — Current GEN inventory (cached; live refresh failed)

**Source:** `/tmp/12i/products.json` / prior Phase 12G–12I staging list (22 products).  
**Live attempt 2026-08-24:** staging `gen-health-list-products` → GEN `401 Invalid API key`.  
**Paired formulary IDs / forms / excluded states:** not available without successful detail/forms GETs.

| productId | name | storefrontEligible | pricing.amount | requiresSyncVisit | categories | formulary IDs | forms |
|---|---|---|---:|---|---|---|---|
| `t1JOySXRCJBAeXbkEXW4` | Add Sync | false | 0 | true | [] | UNKNOWN | UNKNOWN |
| `PRIG7DYPNNgco3lGf1zx` | AOD-9604 | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `yearpPaLo5H0k0FU5Ej8` | AOD-9604 / MOTS-C / Tesamorelin Metabolic Triple Protocol | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `7Kix55LA15U0lNvY9QXI` | AOD-9604/MOTS-C | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `KXMm9SsbOEYnFy9phmZn` | BPC-157 | false | 0 | false | [] | UNKNOWN (historically Optimal Balance BPC/TB500 mapping for MBM SKU) | UNKNOWN |
| `MXsSZY2GpiCByJUQer1p` | BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `Kju2P3fGsc0mbI1UGVeF` | BPC-157 + KPV + TB-500 Anti-Inflammatory Recovery Protocol | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `kAekLzXT2Wl2MDSBxjls` | BPC-157 + TB-500 + GHK-Cu Recovery & Anti-Aging Protocol | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `afROXeaudxZUdh0Y1Qfc` | BPC-157 Gut & Recovery Protocol (Oral Capsules) | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `TQBv1oBNGfwIGY8ypl86` | BPC-157 Recovery Protocol (Injectable) | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `NTN40APqv0NQokAGmuyg` | BPC-157 Recovery Protocol (Oral Capsule) | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `zpQmWLDx6QxyDz5N8IaI` | BPC-157/GHK-U/KPV/TB500 | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `lkpQbjBhhWMeLUszAvbh` | BPC-157/GHK/TB500 | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `26RwCZyLvfqRYRY7AG6T` | BPC-157/KPV/TB500 | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `iJtyig611AZEDBGdvRd9` | BPC-157/TB500 | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `Zd3nud61fajtnKM8EHae` | Elite Body Recomp | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `lT5iApLmX80qlBQTr4qE` | Elite Regenesis | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `gpwERWfomPpuJyY9oB8V` | Epitalon Longevity & Anti-Aging Protocol | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `489YrehNXRlL77fYPkOn` | GHK-Cu | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `qQKHHjPkPzs5D35Wgh2x` | GHK-Cu + Epitalon Anti-Aging Protocol | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `2CVlt0n5ITgHB1cYxoNY` | GHK-Cu Anti-Aging & Skin Health Protocol (Injectable) | false | 0 | false | [] | UNKNOWN | UNKNOWN |
| `Yq6xdybfGS55O4kUDVI8` | GHK-Cu/Epithalon | false | 0 | false | [] | UNKNOWN | UNKNOWN |

**Inventory notes:**

- No Semaglutide / Tirzepatide / HRT / NAD / Selank / Semax / skin-hair client products in the 22-name catalog (reconfirmed prior Phase 12I.2).
- Elite Body Recomp description mentions Tirzepatide + Sermorelin — **not** a substitute for website Tirzepatide vial SKUs (do not silently map).
- BPC injection remains the only historically **READY** MBM↔GEN clinical map (`KXMm9SsbOEYnFy9phmZn`) per Phase 12G/12I — still subject to workbook re-check.

---

## Phase 3 — Master workbook mapping

**Status:** `MASTER_WORKBOOK_REQUIRED`

File not found anywhere under `/workspace`, `/home/ubuntu`, `/opt`, `/tmp`:

`MyBareMethod_FINAL_GEN_Smart_Product_Upload_2026-08-23.xlsx`

Therefore row classifications are **not** produced:

| Classification | Count |
|---|---:|
| EXISTING_EXACT | **N/A** |
| EXISTING_NEEDS_UPDATE | **N/A** |
| CREATE_NEW | **N/A** |
| FUTURE_CREATE_HIDDEN | **N/A** |
| REVIEW_REQUIRED | **N/A** |
| DO_NOT_ADD | **≥1 reserved** (Metformin — owner rule; apply when workbook parsed) |

### Owner structure rules (recorded for next pass)

- Website-live flag only for products currently live on MyBareMethod.com (`ProductStatus === 'active'` in `src/data/products.ts`).
- Future products may be prepared in GEN but must stay hidden/off on MBM + `storefrontEligible=false` + no production routing.
- Semaglutide / Tirzepatide: parent products (Starting/Low, Mid, High, Any Dose, 3-Month Supply) — **not** one customer-facing product per vial; Any Dose maps to verified ladder, not one arbitrary formulation.
- Do not silently substitute compound / form / strength / package.
- Accessories: outside GEN medication routing.

### Website-live reference (MBM catalog, for next-pass flags)

Active (non-exhaustive summary): weight meds (Semaglutide, Tirzepatide, Fat Burner), HRT (Estradiol Patch, Progesterone Capsules, Testosterone Cream), longevity (NAD+, Selank, Semax, Selank/Semax nasal, Tesamorelin, BPC), dermatology (Tretinoin, Minoxidil topical, Bimatoprost), provider care (IPV, FUV, Lab Review, Lab Kit), accessories (a1–a8, a10).  
Future (hidden on MBM): Sermorelin, Minoxidil Tablets.

---

## Phase 4 — Formulary pairing plan

**Status:** `BLOCKED` — requires master workbook + live product detail / formulary fields.

Known historical exact candidate (not re-verified this phase):

| MBM | GEN productId | Formulation (historical) | Pharmacy | Notes |
|---|---|---|---|---|
| `MBM-RP-BPC-INJ-001` | `KXMm9SsbOEYnFy9phmZn` | BPC-157 / TB500 3 MG / 3 MG/ML (5 ML) | Optimal Balance | Re-check against final workbook; shipping UNKNOWN historically |

All other pairings: **REVIEW_REQUIRED** until workbook + verified GEN formulary IDs.

---

## Phase 5 — Future products

**Status:** Policy recorded; no GEN creates.

When workbook lists future sexual wellness / peptide / hormone / skin-hair rows:

- Intended GEN action: `FUTURE_CREATE_HIDDEN` (after schema confirmed)
- `storefrontEligible=false`
- Not active on MyBareMethod.com
- `checkout_enabled=false` / no Whop/GEN production routing
- No production cutover

---

## Phase 6 — Output

This file + `docs/GEN_CATALOG_IMPORT_PLAN.json`.

**Products created / updated / deactivated this phase:** **0**  
**GEN modified:** **NO**  
**Production website modified:** **NO**

### Next actions for owner

1. Upload `MyBareMethod_FINAL_GEN_Smart_Product_Upload_2026-08-23.xlsx` into the cloud agent workspace.
2. Refresh staging `GEN_HEALTH_API_KEY` if invalid (Edge list currently 401).
3. Provide or point to GEN V2 Product create/update OpenAPI (or allow a follow-up read-only schema dump after key fix).
4. Re-run GEN-CATALOG-1 mapping pass — still no POST/PATCH until owner approves an execution phase.

---

## Summary counts (this phase)

| Metric | Value |
|---|---|
| TOTAL MASTER PRODUCTS | **UNKNOWN** (workbook missing) |
| EXISTING EXACT | UNKNOWN |
| EXISTING NEEDS UPDATE | UNKNOWN |
| CREATE NEW | UNKNOWN |
| FUTURE CREATE HIDDEN | UNKNOWN |
| REVIEW REQUIRED | UNKNOWN |
| DO NOT ADD | Metformin (rule reserved) |
| Cached GEN client products | **22** |
| SEMAGLUTIDE STRUCTURE | **REVIEW** (no GEN SEM products; workbook pending) |
| TIRZEPATIDE STRUCTURE | **REVIEW** (no GEN TIR vial products; Elite Body Recomp is not a substitute) |
| METFORMIN | **DO NOT ADD** |
| PRODUCTS CREATED / UPDATED / DEACTIVATED | **0 / 0 / 0** |
| GEN/WHOP CUTOVER | **OFF** |

**STOP FOR OWNER REVIEW.**
