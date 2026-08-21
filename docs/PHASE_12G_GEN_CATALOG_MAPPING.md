# Phase 12G — GEN Catalog Mapping + Gated Post-Paid Handoff

**Generated:** 2026-08-21T16:22:28.774937+00:00  
**Updated:** Phase 12I.2 formulary re-audit (see `docs/PHASE_12I2_REMAINING_GEN_MAPPING.md`)

**Staging:** `mxvaxkkwrbwhqasnsjpm` · **Production touched:** NO · **Auto handoff:** OFF  
**API Orders:** NOT ENABLED (Phase 12I.1) — READY mapping ≠ production Rx cutover

## Summary

- GEN Products API (`x-api-key`) listed **22** products — no SEM/TIR vials, HRT, NAD, Selank/Semax, or skin/hair (reconfirmed 12I.2).
- Only owner-verified **BPC injection** is READY.
- Fat Burner name-match `yearpPaLo5H0k0FU5Ej8` remains AMBIGUOUS (not READY).
- BPC capsule remains AMBIGUOUS (GEN oral = BPC alone, not BPC/TB blend).
- Staging `gen_sku_map`: 1 READY + 27 BLOCKED.
- `canStartGenHandoff` + admin-gated `gen-health-handoff` implemented.
- Admin mapping UI distinguishes `GEN_MAPPING_READY` from `GEN_API_ORDERS_NOT_ENABLED`.

## BPC verified mapping

| Field | Value |
|---|---|
| MBM SKU | `MBM-RP-BPC-INJ-001` |
| GEN productId | `KXMm9SsbOEYnFy9phmZn` |
| GEN clientProductId | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_KXMm9SsbOEYnFy9phmZn` |
| Medication | BPC-157 / TB500 3 MG / 3 MG/ML (5 ML) |
| Pharmacy | Optimal Balance Pharmacy |
| Strength / form / package | 3 MG / 3 MG/ML / Injection / 5 mL |
| Med cost / ship | $117.00 / NULL |
| Status | **READY** |

| Current retail | +50% med | +75% | +100% | Gross over med |
|---|---|---|---|---|
| $199.00 | $175.50 | $204.75 | $234.00 | $82.00 |

Full 28-SKU matrix with at-cost / +50 / +75 / +100 / readiness: **`docs/PHASE_12I2_REMAINING_GEN_MAPPING.md`**.

## Semaglutide / Tirzepatide

Current +B6 SKUs **preserved**. GEN has no Semaglutide; no TIR vial SKU.
If GEN later supplies +B12/glycine/plain → propose `MBM-WM-SEM-INJ-005+` / `MBM-WM-TIR-INJ-005+` (do not reuse B6 SKUs).

| OLD SKU | NEW FORMULATION | PROPOSED NEW SKU | REASON |
|---|---|---|---|
| MBM-WM-SEM-INJ-001…004 | Semaglutide +B12/glycine/plain | MBM-WM-SEM-INJ-005+ | Additive change |
| MBM-WM-TIR-INJ-001…004 | Tirzepatide +B12/glycine/plain | MBM-WM-TIR-INJ-005+ | Additive change |

## GEN catalog (22)

| productId | name |
|---|---|
| `PRIG7DYPNNgco3lGf1zx` | AOD-9604 |
| `yearpPaLo5H0k0FU5Ej8` | AOD-9604 / MOTS-C / Tesamorelin Metabolic Triple Protocol |
| `7Kix55LA15U0lNvY9QXI` | AOD-9604/MOTS-C |
| `t1JOySXRCJBAeXbkEXW4` | Add Sync |
| `KXMm9SsbOEYnFy9phmZn` | BPC-157 |
| `MXsSZY2GpiCByJUQer1p` | BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol |
| `Kju2P3fGsc0mbI1UGVeF` | BPC-157 + KPV + TB-500 Anti-Inflammatory Recovery Protocol |
| `kAekLzXT2Wl2MDSBxjls` | BPC-157 + TB-500 + GHK-Cu Recovery & Anti-Aging Protocol |
| `afROXeaudxZUdh0Y1Qfc` | BPC-157 Gut & Recovery Protocol (Oral Capsules) |
| `TQBv1oBNGfwIGY8ypl86` | BPC-157 Recovery Protocol (Injectable) |
| `NTN40APqv0NQokAGmuyg` | BPC-157 Recovery Protocol (Oral Capsule) |
| `zpQmWLDx6QxyDz5N8IaI` | BPC-157/GHK-U/KPV/TB500 |
| `lkpQbjBhhWMeLUszAvbh` | BPC-157/GHK/TB500 |
| `26RwCZyLvfqRYRY7AG6T` | BPC-157/KPV/TB500 |
| `iJtyig611AZEDBGdvRd9` | BPC-157/TB500 |
| `Zd3nud61fajtnKM8EHae` | Elite Body Recomp |
| `lT5iApLmX80qlBQTr4qE` | Elite Regenesis |
| `gpwERWfomPpuJyY9oB8V` | Epitalon Longevity & Anti-Aging Protocol |
| `489YrehNXRlL77fYPkOn` | GHK-Cu |
| `qQKHHjPkPzs5D35Wgh2x` | GHK-Cu + Epitalon Anti-Aging Protocol |
| `2CVlt0n5ITgHB1cYxoNY` | GHK-Cu Anti-Aging & Skin Health Protocol (Injectable) |
| `Yq6xdybfGS55O4kUDVI8` | GHK-Cu/Epithalon |

Research/protocol products (Epitalon, GHK-Cu, Elite*, Add Sync) stay **candidates only** — never auto-activate for normal website sale.

## Membership impact

**Crosswalk changes required:** NO (no new vial SKUs activated).

## Handoff

- Gate: `canStartGenHandoff`
- Auto: OFF (`GEN_HANDOFF_AUTOMATION_ENABLED=false`)
- Manual: admin JWT + optional `forceManual=true`
- Paid preserved on GEN failure → `GEN_RETRY_REQUIRED`
- Visits/labs unchanged
- External-paid `order.payment_status` still requires GEN API Orders enablement
