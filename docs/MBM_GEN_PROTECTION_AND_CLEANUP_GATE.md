# MBM GEN Protection and Cleanup Gate

**Generated:** 2026-08-24T22:03:51Z  
**Phase:** MBM-CATALOG-READY-GATE-1  
**Mode:** READ-ONLY — **no deactivations this phase** · GEN writes: 0
**Inventory:** 255 Client Products

Companion: [`MBM_SAFE_EXECUTION_SET.md`](./MBM_SAFE_EXECUTION_SET.md) · [`MBM_GEN_PROTECTION_AND_CLEANUP_GATE.json`](./MBM_GEN_PROTECTION_AND_CLEANUP_GATE.json)

---

## Classification rules

Every GEN object is classified into exactly one gate class:

| Class | Meaning |
|---|---|
| `KEEP_PROTECTED` | Must not deactivate; supports CURRENT_LIVE / locked Minoxidil / pending formulary |
| `SAFE_TO_REUSE` | Verified identity; can reuse as-is later |
| `SAFE_TO_REPAIR_LATER` | Exists and maps to a ready product; needs price/pairing/rename repair later |
| `SAFE_DEACTIVATION_CANDIDATE` | Meets all six safety criteria — **candidate only; no deactivation now** |
| `AMBIGUOUS_DO_NOT_TOUCH` | Identity or live-support risk unclear |

### SAFE_DEACTIVATION_CANDIDATE requires all of:

- not supporting CURRENT_LIVE
- not required by CUTOVER_READY
- not required by FUTURE_HIDDEN_READY
- not one of the protected 13
- identity verified rather than inferred from title alone
- removing it cannot remove a required formulary relationship

GLP/SEM/TIR-named legacy objects remain **AMBIGUOUS** while website B6 SEM/TIR are still CURRENT_LIVE (transitional until cutover).

---

## Counts

| Gate class | Count |
|---|---:|
| KEEP_PROTECTED | 13 |
| SAFE_TO_REUSE | 0 |
| SAFE_TO_REPAIR_LATER | 13 |
| SAFE_DEACTIVATION_CANDIDATE | 89 |
| AMBIGUOUS_DO_NOT_TOUCH | 140 |
| **TOTAL** | **255** |

---

## KEEP_PROTECTED (13)

| GEN ID | Name | Supports | Prior bucket |
|---|---|---|---|
| `7Kix55LA15U0lNvY9QXI` | AOD-9604 / MOTS-C / Tesamorelin Injection | Fat Burner | REUSE_RENAME |
| `yearpPaLo5H0k0FU5Ej8` | AOD-9604 / MOTS-C / Tesamorelin Metabolic Triple Protocol | Fat Burner | AMBIGUOUS_DO_NOT_TOUCH |
| `PRIG7DYPNNgco3lGf1zx` | AOD-9604 | Fat Burner | AMBIGUOUS_DO_NOT_TOUCH |
| `Gn4XaP00anr4q9oheSTe` | Men's Hormones (TRT) – Testosterone Cream | Testosterone Cream | AMBIGUOUS_DO_NOT_TOUCH |
| `Ukctbyh5Yrek3SnGSYA3` | Selank Anxiolytic & Cognitive Protocol | Selank Injection | AMBIGUOUS_DO_NOT_TOUCH |
| `YTHcdrlRICMpt56hdxeJ` | Semax Nootropic & Neuroprotective Protocol | Semax Injection | AMBIGUOUS_DO_NOT_TOUCH |
| `LWkYtwm66dIeLuDSvSfi` | Semax / Selank Neuro & Cognitive Protocol | Selank + Semax Blend Nasal Spray | REUSE_RENAME |
| `2cYxVfvwpWyyrANZx06G` | Peptides – Tesamorelin (Growth Hormone) | Tesamorelin | AMBIGUOUS_DO_NOT_TOUCH |
| `xSlOHrUWKRkKvzCGcsYc` | Tesamorelin Growth Hormone Protocol | Tesamorelin | AMBIGUOUS_DO_NOT_TOUCH |
| `BboYS4a2Uj7APetrFo6W` | Hair Loss – Dual Combo (Finasteride/Minoxidil) | Minoxidil Combination (locked) | REUSE_RENAME |
| `7sX9dhAxA6i21Jg1swrK` | Hair Loss – Triple Combo (Finasteride/Minoxidil/Tretinoin) | Minoxidil Combination (related) | AMBIGUOUS_DO_NOT_TOUCH |
| `Raw7mUkuzzhVdAo88jpL` | Hair Loss – Minoxidil (Topical) | Minoxidil Combination (related) | AMBIGUOUS_DO_NOT_TOUCH |
| `xKwPWxhRXlcoUonBXpg9` | Hair Loss - Minoxdil/Tretinoin/Fluocinolone/Finasteride Spray | Minoxidil Combination (related) | AMBIGUOUS_DO_NOT_TOUCH |

Dual Combo (`BboYS4a2Uj7APetrFo6W`) remains protected **and** is the Minoxidil **SAFE_TO_REPAIR** target later (price $79 + Vios r129 pairing). Still counted only under KEEP_PROTECTED.

---

## SAFE_TO_REUSE

**Count:** 0 — none meet as-is verified reuse without repair this gate.

---

## SAFE_TO_REPAIR_LATER

**Count:** 13

| GEN ID | Name | Note |
|---|---|---|
| `5iCQzEtTXw90ctEhIhkB` | BPC-157/TB-500/GHK-Cu 3/3/10 mg/mL (5 mL) Injection | BPC-157/TB-500/GHK-Cu (FUTURE) |
| `SHJpGAACUFEeMONdpEbn` | NAD+ (Injectable) | NAD+ Injection |
| `5F8jESeVeXcpkLU5rrdK` | SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP | SEM membership |
| `sN2ggSXRJINjElMYTQjf` | Semaglutide Injection — 3-Month (B12) | Semaglutide Injection — 3-Month (B12) |
| `MkDIUw0NcJB7YL2pNzYW` | Semaglutide Injection — Any Dose (B12) | sem-b12-any-dose |
| `wQK2JsFnh7oFBf3Lag4n` | Semaglutide Injection — Any Dose (Glycine) | sem-glycine-any-dose |
| `34I2X8MpVZf3AQTff3bo` | Semaglutide Injection — High (B12) | sem-b12-high |
| `sssEk3FDY4LFbQYGQsLx` | Semaglutide Injection — High (Glycine) | sem-glycine-high |
| `BLf8inX395YNc7WPCD4O` | Semaglutide Injection — Mid (B12) | sem-b12-mid |
| `CjqOUbPuGPZzxephqRou` | Semaglutide Injection — Mid (Glycine) | sem-glycine-mid |
| `SkqQHmsc0WdsbK9vmV1y` | Semaglutide Injection — Starting / Low (B12) | sem-b12-starting-low |
| `tk2GW39OGr7JX4MCCoJP` | Semaglutide Injection — Starting / Low (Glycine) | sem-glycine-starting-low |
| `E3MXZeeR01QROCuTLRLE` | TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP | TIR membership |

---

## SAFE_DEACTIVATION_CANDIDATE

**Count:** 89 — **DO NOT deactivate in this phase.**

Full ID list in JSON. These are prior DUPLICATE/LEGACY candidates that do not currently support CURRENT_LIVE, CUTOVER_READY, FUTURE_HIDDEN_READY, or the protected 13 under this audit.

---

## AMBIGUOUS_DO_NOT_TOUCH

**Count:** 140

Includes prior AMBIGUOUS, near-name REUSE_RENAME without verified pairing, and GLP/SEM/TIR objects retained while B6 CURRENT_LIVE remains.

Explicitly keep ambiguous (rejected formulations / wrong pairings):

- `Tirzepatide/B12/Glycine`
- `Tirzepatide/Glycine/B12`
- GHK-Cu/Minoxidil CP paired to GHK-CU only

---

## Minoxidil GEN action later

{
  "current_website_product": "Minoxidil Combination Topical Formula",
  "locked_formulation": "Finasteride / Minoxidil 0.1% / 5%",
  "pharmacy": "Vios",
  "selected_row": 129,
  "retail": 79,
  "gen_candidate": {
    "gen_id": "BboYS4a2Uj7APetrFo6W",
    "gen_name": "Hair Loss \u2013 Dual Combo (Finasteride/Minoxidil)",
    "current_price": 0,
    "formulary_paired": false,
    "storefront_eligible": false
  },
  "rejected_candidates": [
    {
      "gen_id": "489YrehNXRlL77fYPkOn",
      "gen_name": "GHK-Cu / Minoxidil Topical Combo",
      "reason": "Paired to GHK-CU only @ Greenwich \u2014 title contains Minoxidil but identity wrong"
    },
    {
      "gen_id": "7sX9dhAxA6i21Jg1swrK",
      "reason": "Triple combo includes Tretinoin \u2014 not locked formulation"
    },
    {
      "gen_id": "Raw7mUkuzzhVdAo88jpL",
      "reason": "Plain topical Minoxidil \u2014 not Fin/Minox combo"
    }
  ],
  "gen_action_later": "SAFE_TO_REPAIR",
  "note": "Reuse Dual Combo CP later: set retail $79; pair to Vios SELECTED r129 Fin/Minox 0.1%/5%. Remains KEEP_PROTECTED until then. Do not write this phase."
}

---

## FINAL REPORT

- **KEEP_PROTECTED:** 13
- **SAFE_TO_REUSE:** 0
- **SAFE_TO_REPAIR_LATER:** 13
- **SAFE_DEACTIVATION_CANDIDATE:** 89
- **AMBIGUOUS_DO_NOT_TOUCH:** 140
- **DEACTIVATIONS THIS PHASE:** 0
- **GEN WRITES:** 0

**STOP FOR OWNER REVIEW.** No GEN-CATALOG-2B. No execution script. No pairing checklist.
