# MBM GEN Next Create Preflight

**PREFLIGHT ONLY — DO NOT EXECUTE CREATES.**

Generated: `2026-08-25T05:25:13Z`

Authority: `docs/MBM_GEN_FINAL_WRITE_MANIFEST.json` → `post_resolution_queues.create_variants` (13)

## Groups

| Group | Status | Count |
|---|---|---:|
| TIRZEPATIDE CREATE (B12×4 + Glycine×4) | **READY** | 8 |
| ESTRADIOL PATCH CREATE | **READY** | 4 |
| NAD+ NASAL r85 CREATE | **READY** | 1 |
| **TOTAL** | **READY** | **13 / 13** |

## Duplicate scan (live GEN)

- No existing GEN CP with proper TIR B12/Glycine dose-group naming for the 8 create slots (legacy GLP-2 / Tirzepatide/B12/Glycine objects must NOT be reused).
- No Estradiol patch CPs exist — only vaginal Estradiol CPs (do not reuse).
- Existing NAD + Nasal Spray CP FVwkzvQqWIZRNAwbslGw is r84 — create separate CP for r85; do not reuse.

## Create rows

### `tir-b12-starting-low` — Starting / Low (5+10) · Vitamin B12

- Family: Tirzepatide
- Form: Injection · Additive: Vitamin B12
- Price: 119–139
- Pharmacy basis: Dirx-Hub
- Duplicate exists: **NO**
- Status: **READY**
- Notes: Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. Do not reuse old GLP-2 plan titles.

### `tir-b12-mid` — Mid (15+20) · Vitamin B12

- Family: Tirzepatide
- Form: Injection · Additive: Vitamin B12
- Price: 149–159
- Pharmacy basis: Dirx-Hub
- Duplicate exists: **NO**
- Status: **READY**
- Notes: Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. Do not reuse old GLP-2 plan titles.

### `tir-b12-high` — High (25+30) · Vitamin B12

- Family: Tirzepatide
- Form: Injection · Additive: Vitamin B12
- Price: 169–179
- Pharmacy basis: Dirx-Hub
- Duplicate exists: **NO**
- Status: **READY**
- Notes: Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. Do not reuse old GLP-2 plan titles.

### `tir-b12-any-dose` — Any Dose (5–30) · Vitamin B12

- Family: Tirzepatide
- Form: Injection · Additive: Vitamin B12
- Price: 119–179
- Pharmacy basis: Dirx-Hub
- Duplicate exists: **NO**
- Status: **READY**
- Notes: Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. Do not reuse old GLP-2 plan titles.

### `tir-glycine-starting-low` — Starting / Low (5+10) · Glycine

- Family: Tirzepatide
- Form: Injection · Additive: Glycine
- Price: 119–139
- Pharmacy basis: Dirx-Hub
- Duplicate exists: **NO**
- Status: **READY**
- Notes: Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. Do not reuse old GLP-2 plan titles.

### `tir-glycine-mid` — Mid (15+20) · Glycine

- Family: Tirzepatide
- Form: Injection · Additive: Glycine
- Price: 149–159
- Pharmacy basis: Dirx-Hub
- Duplicate exists: **NO**
- Status: **READY**
- Notes: Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. Do not reuse old GLP-2 plan titles.

### `tir-glycine-high` — High (25+30) · Glycine

- Family: Tirzepatide
- Form: Injection · Additive: Glycine
- Price: 169–179
- Pharmacy basis: Dirx-Hub
- Duplicate exists: **NO**
- Status: **READY**
- Notes: Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. Do not reuse old GLP-2 plan titles.

### `tir-glycine-any-dose` — Any Dose (5–30) · Glycine

- Family: Tirzepatide
- Form: Injection · Additive: Glycine
- Price: 119–179
- Pharmacy basis: Dirx-Hub
- Duplicate exists: **NO**
- Status: **READY**
- Notes: Do not reuse Tirzepatide/B12/Glycine or Tirzepatide/Glycine/B12 ambiguous CPs. Do not reuse old GLP-2 plan titles.

### `nad-nasal-r85` — Nasal Spray · NAD+ 200mg/ml · 15ml

- Family: NAD+
- Form: Nasal Spray
- Price: 109
- Pharmacy basis: St Luke
- Duplicate exists: **NO**
- Status: **READY**
- Notes: PRICE-CONFLICT-RESOLUTION: GEN_CP_SPLIT — CREATE new nasal CP for r85 @ $109; do not share price with r84.

### `estradiol-patch-r26` — Estradiol transdermal

- Family: Estradiol
- Form: Patch
- Price: 119
- Pharmacy basis: Valiant
- Duplicate exists: **NO**
- Status: **READY**
- Notes: PRICE-CONFLICT-RESOLUTION: Do not use vaginal CP o7dNtf9QsnEqPCrLr2tR. CREATE dedicated patch CP for r26 @ $119.

### `estradiol-patch-r27` — Estradiol transdermal

- Family: Estradiol
- Form: Patch
- Price: 129
- Pharmacy basis: Valiant
- Duplicate exists: **NO**
- Status: **READY**
- Notes: PRICE-CONFLICT-RESOLUTION: Do not use vaginal CP o7dNtf9QsnEqPCrLr2tR. CREATE dedicated patch CP for r27 @ $129.

### `estradiol-patch-r28` — Estradiol transdermal

- Family: Estradiol
- Form: Patch
- Price: 139
- Pharmacy basis: Valiant
- Duplicate exists: **NO**
- Status: **READY**
- Notes: PRICE-CONFLICT-RESOLUTION: Do not use vaginal CP o7dNtf9QsnEqPCrLr2tR. CREATE dedicated patch CP for r28 @ $139.

### `estradiol-patch-r29` — Estradiol transdermal

- Family: Estradiol
- Form: Patch
- Price: 149
- Pharmacy basis: Valiant
- Duplicate exists: **NO**
- Status: **READY**
- Notes: PRICE-CONFLICT-RESOLUTION: Do not use vaginal CP o7dNtf9QsnEqPCrLr2tR. CREATE dedicated patch CP for r29 @ $149.

## Keep OUT of create set

- NAD injection 100mg/mL — FORMULARY/SOURCING_PENDING
- Tretinoin 0.025% / 0.05% / 0.1% — FORMULARY/SOURCING_PENDING
- other FORMULARY_PENDING
- FUTURE_HIDDEN
- Scream Cream
- legacy B6
- owner-rejected formulations
- ambiguous products

## Sourcing pending

- NAD injection 100mg/mL: **YES** (FORMULARY/SOURCING_PENDING)
- Tretinoin 0.025% / 0.05% / 0.1%: **YES** (FORMULARY/SOURCING_PENDING)

## Hard stops

- DO NOT CREATE the 13 GEN products in this run.
- DO NOT publish / cutover / enable real GEN orders.
- DO NOT remove legacy B6 storefront.
- DO NOT merge PR #19.

