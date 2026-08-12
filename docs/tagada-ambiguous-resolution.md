# Tagada Ambiguous Mapping Resolution (pre-sync)

**Date:** 2026-08-11  
**Mode:** Plan before Tagada writes

## Ambiguous 1 — Tretinoin Cream 0.05%

| Field | Value |
|-------|-------|
| MBM Product | Tretinoin Cream |
| MBM Variant | Cream · 0.05% · 20g |
| MBM SKU | `MBM-SH-TRE-CRM-002` |
| MBM Price | $89.00 |
| Possible Tagada Product | `product_175afd281f90` (Tretinoin Cream) |
| Possible Tagada Variants | `variant_708bb1c9f5f0` ($79), `variant_312812933f47` ($99), `variant_8f7950e121d1` ($109) |
| Reason | No Tagada variant at **$89**. Existing $79/$109 already map to 0.025%/0.1%. Orphan $99 does not match any MBM SKU. |

**Classification: SHOULD CREATE NEW VARIANT** (implemented as new Tagada product line for 0.05% only; do not bind to $99 orphan; do not modify existing matched variants)

---

## Ambiguous 2 — Semaglutide Membership

| Field | Value |
|-------|-------|
| MBM Product | Semaglutide Membership |
| MBM Variant | Membership program (monthly) |
| MBM SKU | `MBM-MEM-SEM-MEM-001` |
| MBM Price | $149.00 |
| Possible Tagada Product | `product_cfd1a23b5095` (Semaglutide + B6 Injection) |
| Possible Tagada Variants | medication vials at $119/$139/$189.02/$329 |
| Reason | False name association to **medication** product. Membership PROGRAM SKU ≠ fulfillment SKU. |

**Classification: SHOULD CREATE NEW VARIANT** (new membership **program** product with recurring monthly price; no customer subscription created)

---

## Ambiguous 3 — Tirzepatide Membership

| Field | Value |
|-------|-------|
| MBM Product | Tirzepatide Membership |
| MBM Variant | Membership program (monthly) |
| MBM SKU | `MBM-MEM-TIR-MEM-001` |
| MBM Price | $249.00 |
| Possible Tagada Product | `product_e29d94f9fa68` (Tirzepatide + B6 Injection) |
| Possible Tagada Variants | medication vials at $189/$258.99/$369/$429 |
| Reason | False name association to **medication** product. Membership PROGRAM SKU ≠ fulfillment SKU. |

**Classification: SHOULD CREATE NEW VARIANT** (new membership **program** product with recurring monthly price; no customer subscription created)

---

## Sync policy for these three

- Do **not** attach MBM membership SKUs to medication variants.
- Do **not** reuse Tagada Tretinoin $99 orphan for $89.
- Create new Tagada catalog rows for all three as part of missing coverage.
- Leave existing matched medication/tretinoin variants unchanged except SKU stamping where blank.
