# GEN Catalog 2A — Controlled Live GEN Catalog Write Report

**Generated:** 2026-08-24T08:07:34.542206+00:00
**Mode:** GEN CATALOG DATA ONLY — website / Tagada / Kashu / GEN-Whop cutover untouched
**Stop gate:** Do **not** start GEN-CATALOG-2B. Do **not** update the website yet.

## Final report

| Metric | Value |
|---|---|
| AUTHORIZED LIVE PRODUCTS | 14 |
| GEN PRODUCTS UPDATED | 10 |
| GEN PRODUCTS CREATED | 4 |
| GEN PRODUCTS DEACTIVATED | 3 |
| GEN PRODUCTS SKIPPED_ALREADY_CORRECT | 3 |
| GEN PRODUCTS FAILED | 0 |

### Semaglutide pricing (post-write)

| Product | clientProductId | Price |
|---|---|---:|
| SEM_START_LOW_B12 | `SkqQHmsc0WdsbK9vmV1y` | $99 |
| SEM_START_LOW_GLYCINE | `tk2GW39OGr7JX4MCCoJP` | $99 |
| SEM_MID_B12 | `BLf8inX395YNc7WPCD4O` | $109 |
| SEM_MID_GLYCINE | `CjqOUbPuGPZzxephqRou` | $109 |
| SEM_HIGH_B12 | `34I2X8MpVZf3AQTff3bo` | $119 |
| SEM_HIGH_GLYCINE | `sssEk3FDY4LFbQYGQsLx` | $119 |
| SEM_ANY_DOSE_B12 | `MkDIUw0NcJB7YL2pNzYW` | $119 |
| SEM_ANY_DOSE_GLYCINE | `wQK2JsFnh7oFBf3Lag4n` | $119 |
| SEM_3_MONTH_B12 | `sN2ggSXRJINjElMYTQjf` | $359 |

SEM 3-MONTH B12 uses **STANDARD ×3 model → $359** (not escalation $339).

SEM MEMBERSHIP: **$149** (`5F8jESeVeXcpkLU5rrdK`)
TIRZ MEMBERSHIP: **$275** (`E3MXZeeR01QROCuTLRLE`)

### BPC/TB/GHK blend

- **NAME:** BPC-157/TB-500/GHK-Cu 3/3/10 mg/mL (5 mL) Injection
- **PRICE:** $159
- **ID:** `5iCQzEtTXw90ctEhIhkB`
- **FORMULARY:** PAIRING_WRITE_API_UNKNOWN — approved Greenwich BPC-157/TB-500/GHK-CU 3/3/10MG/ML (5ml) not attachable via Client API; 0 pairings on new product

### Deferred (unchanged / not created)

| Product | Status |
|---|---|
| AOD-9604 | DEFERRED_COST_UNKNOWN — left unchanged |
| BPC/TB CAPSULES | DEFERRED_COST_UNKNOWN — left unchanged |
| PLAIN BPC-157 | DEFERRED_COST_UNKNOWN — left unchanged; no blend imported |
| SEM 3-MONTH GLYCINE | DEFERRED_FORMULARY — not created |

### Cleanup

| Target | Result |
|---|---|
| ADD SYNC | INACTIVE/ABSENT |
| METFORMIN | INACTIVE/ABSENT |
| METFORMIN/TOPIRAMATE | INACTIVE/ABSENT |
| BPC COPY 1 | NO separate GEN object (merge target already primary plain BPC) |

### Post-write inventory

- Products: **255** (`GET /v2/client/products?limit=500`)
- Formulary pairings: **29** (`?view=formulary`)

### Changed product verification

| DISPLAY NAME | clientProductId | STATUS | showPatient | CUSTOMER PRICE | FORM | PAIRINGS | PHARMACY | FORMULATION | WRITE ACTION |
|---|---|---|---|---:|---|---:|---|---|---|
| Semaglutide Injection — Starting / Low (Glycine) | `tk2GW39OGr7JX4MCCoJP` | active | True | $99 | Injection | 1 | Dirx-Hub | Semaglutide + Glycine | UPDATED |
| Semaglutide Injection — Mid (Glycine) | `CjqOUbPuGPZzxephqRou` | active | None | $109 | Injection | 2 | Dirx-Hub | Semaglutide + Glycine | UPDATED |
| Semaglutide Injection — High (Glycine) | `sssEk3FDY4LFbQYGQsLx` | active | None | $119 | Injection | 1 | Dirx-Hub | Semaglutide + Glycine | UPDATED |
| Semaglutide Injection — Any Dose (Glycine) | `wQK2JsFnh7oFBf3Lag4n` | active | None | $119 | Injection | 4 | Dirx-Hub | Semaglutide + Glycine | UPDATED |
| Semaglutide Injection — Starting / Low (B12) | `SkqQHmsc0WdsbK9vmV1y` | active | None | $99 | Injection | 1 | Dirx-Hub | Semaglutide + Vitamin B12 | UPDATED |
| Semaglutide Injection — Mid (B12) | `BLf8inX395YNc7WPCD4O` | active | True | $109 | Injection | 0 | — | — | CREATED |
| Semaglutide Injection — High (B12) | `34I2X8MpVZf3AQTff3bo` | active | None | $119 | Injection | 1 | Dirx-Hub | Semaglutide + Vitamin B12 | UPDATED |
| Semaglutide Injection — Any Dose (B12) | `MkDIUw0NcJB7YL2pNzYW` | active | None | $119 | Injection | 8 | Dirx-Hub | Semaglutide B12 ( , , ) | UPDATED |
| Semaglutide Injection — 3-Month (B12) | `sN2ggSXRJINjElMYTQjf` | active | True | $359 | Injection | 1 | Dirx-Hub | Semaglutide B12 ( , , ) | UPDATED |
| AOD-9604 / MOTS-C / Tesamorelin Injection | `7Kix55LA15U0lNvY9QXI` | active | None | $199 | Injection | 1 | Optimal Balance Pharmacy | AOD 9604 | UPDATED |
| BPC-157/TB-500/GHK-Cu 3/3/10 mg/mL (5 mL) Injection | `5iCQzEtTXw90ctEhIhkB` | active | True | $159 | Injection | 0 | — | — | CREATED |
| GHK-Cu / Minoxidil Topical Combo | `489YrehNXRlL77fYPkOn` | active | None | $69 | Product | 1 | Greenwich Pharmacy | GHK-CU | UPDATED |
| SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP | `5F8jESeVeXcpkLU5rrdK` | active | True | $149 | Membership | 0 | — | — | CREATED |
| TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP | `E3MXZeeR01QROCuTLRLE` | active | True | $275 | Membership | 0 | — | — | CREATED |

### API contract discovered

- `POST /v2/client/products` — create (`displayName` + `customerPrice` required; `showPatient`, `status` supported)
- `PATCH /v2/client/products/{id}` — update (`displayName`, `customerPrice`, `showPatient`, `status`, `quantityMonths`, …)
- `DELETE /v2/client/products/{id}` — deactivate/remove from list
- **Formulary pairing writes: NOT available** via Client Products API (documented gap)
- Staging proxy: `gen-health-catalog-write` (do not deploy to production)

### Formulary gaps (follow-up — not 2B)

- Client Products API cannot create/update formulary pairings (medicationId fields unsupported; pairing routes 404).
- CREATED products Mid B12 / BPC blend / SEM membership / TIR membership have 0 formulary pairings — attach in GEN admin.
- AOD product 7Kix55LA15U0lNvY9QXI still paired to AOD 9604 only (not full AOD/MOTS/Tesamorelin/Ipamorelin blend) — correct blend pairing exists on yearpPaLo5H0k0FU5Ej8 but was not moved (pairing API unknown).
- GHK-Cu / Minoxidil product still paired to Greenwich GHK-CU — approved Epiq Minoxidil/GHK/Apigenin/Fisetin pairing not writable via API.

### Safety

| Check | Value |
|---|---|
| GEN/WHOP CUTOVER | OFF |
| WEBSITE MODIFIED | NO |
| TAGADA MODIFIED | NO |
| PAYMENT CREATED | NO |
| FUTURE_HIDDEN WRITTEN | NO |
| GEN-CATALOG-2B STARTED | NO |

### TYPECHECK / TESTS / BUILD

| Check | Result |
|---|---|
| TYPECHECK | PASS (tsc --noEmit -p tsconfig.app.json) |
| TESTS | PASS (vitest run — 42 files / 517 tests) |
| BUILD | PASS (vite build + SSR prerender) |
| LINT | PREEXISTING_FAIL (1 unused-var error in src/lib/genHealth/genHealth.ts — unrelated to 2A) |

## STOP

Verification complete. **Do not start GEN-CATALOG-2B. Do not update the website.**
