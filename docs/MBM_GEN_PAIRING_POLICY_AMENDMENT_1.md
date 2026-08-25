# MBM GEN Pairing Policy Amendment 1

**Owner clarification:** The prior exact strength/package verification standard was **too strict**.

GEN was **not** modified in this pass. Cutover remains **OFF**. PR #19 stays **open / unmerged**.

## New standard

A GEN client product **may** have multiple formulary medications attached.

Purpose: route the patient into the correct **medication family** and give the provider appropriate formulary options. The **provider** chooses the appropriate strength/formulation.

### Acceptable

- ≥1 clinically/formulation-compatible medication for the website selection
- Multiple same-family strengths/packages **kept** (do not collapse)
- Do **not** fail verification merely because the GEN API omits strength/package

### Still reject (material mismatch)

- B12 on Glycine-only CP or Glycine on B12-only CP
- Injection on nasal-only or nasal on injection-only
- Unrelated active ingredient or materially different blend
- Legacy B6 when architecture requires B12/Glycine
- Clearly incorrect pharmacy/formulary family
- Prohibited or owner-rejected formulations

### SEM / TIR

- Website: ONE family each with selectors (Purchase Type → Formulation → Dose)
- Backend: separate B12 vs Glycine GEN CPs allowed; each may hold a strength range
- Membership: SEM **$149**/mo · TIR **$275**/mo
- Never expose GEN IDs / pharmacy rows / vials as separate storefront cards

## Re-audit of 15 GEN CPs (live read-only)

| Classification | Count |
|---|---:|
| PAIRING_ACCEPTABLE | 5 |
| PAIRING_ACCEPTABLE_MULTIPLE_OPTIONS | 2 |
| PAIRING_NEEDS_ADDITION | 0 |
| PAIRING_HAS_INCOMPATIBLE_MEDICATION | 1 |
| PAIRING_MISSING | 7 |
| UNABLE_TO_VERIFY | 0 |

**Website variants now eligible for routing:** 7

**Website variants still blocked (of 23 with GEN id):** 16

### Eligible (registry + ROUTING_READY)

- `sem-b12-high`
- `sem-b12-starting-low`
- `sem-glycine-any-dose`
- `sem-glycine-high`
- `sem-glycine-mid`
- `sem-glycine-starting-low`
- `wolverine-injection`

### Per-CP classification

#### Semaglutide Injection — Starting / Low (B12) (`SkqQHmsc0WdsbK9vmV1y`)

- **Status:** `PAIRING_ACCEPTABLE`
- **Eligible:** True
- **Reason:** At least one compatible formulary medication; no material mismatches.
- Attachments: 1 (compatible 1, incompatible 0)
  - [OK] Semaglutide + Vitamin B12 · Dirx-Hub · `gqe6H8ay1sw6QlS32SMH`

#### Semaglutide Injection — Mid (B12) (`BLf8inX395YNc7WPCD4O`)

- **Status:** `PAIRING_MISSING`
- **Eligible:** False
- **Reason:** No formulary medications attached.
- Attachments: 0 (compatible 0, incompatible 0)

#### Semaglutide Injection — High (B12) (`34I2X8MpVZf3AQTff3bo`)

- **Status:** `PAIRING_ACCEPTABLE`
- **Eligible:** True
- **Reason:** At least one compatible formulary medication; no material mismatches.
- Attachments: 1 (compatible 1, incompatible 0)
  - [OK] Semaglutide + Vitamin B12 · Dirx-Hub · `YqrJ1qnOv3U3ecJHuSzr`

#### Semaglutide Injection — Any Dose (B12) (`MkDIUw0NcJB7YL2pNzYW`)

- **Status:** `PAIRING_HAS_INCOMPATIBLE_MEDICATION`
- **Eligible:** False
- **Reason:** 5 incompatible attachment(s) present; also 3 compatible
- Attachments: 8 (compatible 3, incompatible 5)
  - [OK] Semaglutide B12 ( , , ) · Dirx-Hub · `99BZowkyXTMiGTu5cosT`
  - [OK] Semaglutide B12 ( , , ) · Dirx-Hub · `ekw92avqC0Uf2thW7fA9`
  - [OK] Semaglutide B12 ( , , ) · Dirx-Hub · `iXnkfsa6XHugbDanwjUX`
  - [INCOMPAT] Semaglutide + B12 · Greenwich Pharmacy · `BmyTz7FPA4wUuojkq2Hy`
  - [INCOMPAT] Semaglutide + B12 · Greenwich Pharmacy · `Twz0VeW8olCbbL1UAuQr`
  - [INCOMPAT] Semaglutide + B12 · Greenwich Pharmacy · `lPPKidpoLhkYCSV1sLse`
  - [INCOMPAT] Semaglutide + B12 · Greenwich Pharmacy · `pBAQDkpmfv9FIcpoqhxa`
  - [INCOMPAT] Semaglutide + B12 · Greenwich Pharmacy · `vCNPRlelLVcJmimIT7Wy`

#### Semaglutide Injection — Starting / Low (Glycine) (`tk2GW39OGr7JX4MCCoJP`)

- **Status:** `PAIRING_ACCEPTABLE`
- **Eligible:** True
- **Reason:** At least one compatible formulary medication; no material mismatches.
- Attachments: 1 (compatible 1, incompatible 0)
  - [OK] Semaglutide + Glycine · Dirx-Hub · `KFVdP0FaVZHpXt9ewjiV`

#### Semaglutide Injection — Mid (Glycine) (`CjqOUbPuGPZzxephqRou`)

- **Status:** `PAIRING_ACCEPTABLE_MULTIPLE_OPTIONS`
- **Eligible:** True
- **Reason:** 2 compatible formulary options — keep all; provider chooses strength.
- Attachments: 2 (compatible 2, incompatible 0)
  - [OK] Semaglutide + Glycine · Dirx-Hub · `KFVdP0FaVZHpXt9ewjiV`
  - [OK] Semaglutide + Glycine · Dirx-Hub · `SX8kyR4siUDVAUrm9CvN`

#### Semaglutide Injection — High (Glycine) (`sssEk3FDY4LFbQYGQsLx`)

- **Status:** `PAIRING_ACCEPTABLE`
- **Eligible:** True
- **Reason:** At least one compatible formulary medication; no material mismatches.
- Attachments: 1 (compatible 1, incompatible 0)
  - [OK] Semaglutide + Glycine · Dirx-Hub · `IHYsg7nVwVWB2LjoAR6a`

#### Semaglutide Injection — Any Dose (Glycine) (`wQK2JsFnh7oFBf3Lag4n`)

- **Status:** `PAIRING_ACCEPTABLE_MULTIPLE_OPTIONS`
- **Eligible:** True
- **Reason:** 4 compatible formulary options — keep all; provider chooses strength.
- Attachments: 4 (compatible 4, incompatible 0)
  - [OK] Semaglutide + Glycine · Dirx-Hub · `IHYsg7nVwVWB2LjoAR6a`
  - [OK] Semaglutide + Glycine · Dirx-Hub · `KFVdP0FaVZHpXt9ewjiV`
  - [OK] Semaglutide + Glycine · Dirx-Hub · `SX8kyR4siUDVAUrm9CvN`
  - [OK] Semaglutide + Glycine · Dirx-Hub · `WPEBtvCdn2I8l6tRmT9R`

#### SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP (`5F8jESeVeXcpkLU5rrdK`)

- **Status:** `PAIRING_MISSING`
- **Eligible:** False
- **Reason:** No formulary medications attached.
- Attachments: 0 (compatible 0, incompatible 0)

#### TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP (`E3MXZeeR01QROCuTLRLE`)

- **Status:** `PAIRING_MISSING`
- **Eligible:** False
- **Reason:** No formulary medications attached.
- Attachments: 0 (compatible 0, incompatible 0)

#### NAD + Nasal Spray (`FVwkzvQqWIZRNAwbslGw`)

- **Status:** `PAIRING_MISSING`
- **Eligible:** False
- **Reason:** No formulary medications attached.
- Attachments: 0 (compatible 0, incompatible 0)

#### Wolverine – BPC-157 + TB-500 Recovery Protocol (`omhh3NabouO8AsNR5tkD`)

- **Status:** `PAIRING_MISSING`
- **Eligible:** False
- **Reason:** No formulary medications attached.
- Attachments: 0 (compatible 0, incompatible 0)

#### BPC-157/TB500 (`iJtyig611AZEDBGdvRd9`)

- **Status:** `PAIRING_ACCEPTABLE`
- **Eligible:** True
- **Reason:** At least one compatible formulary medication; no material mismatches.
- Attachments: 1 (compatible 1, incompatible 0)
  - [OK] BPC-157 / TB500 · Greenwich Pharmacy · `27WtrIdo3z4Ssj5sDcc6`

#### Hair Loss – Dual Combo (Finasteride/Minoxidil) (`BboYS4a2Uj7APetrFo6W`)

- **Status:** `PAIRING_MISSING`
- **Eligible:** False
- **Reason:** No formulary medications attached.
- Attachments: 0 (compatible 0, incompatible 0)

#### Women's Hormones (HRT) – Progesterone (`5dGkjdpLP7DkKKE2iVxh`)

- **Status:** `PAIRING_MISSING`
- **Eligible:** False
- **Reason:** No formulary medications attached.
- Attachments: 0 (compatible 0, incompatible 0)

## Remaining OWNER MANUAL GEN ACTIONS

| GEN PRODUCT | GEN ID | STATUS | REASON / ACTION |
|---|---|---|---|
| Semaglutide Injection — Mid (B12) | `BLf8inX395YNc7WPCD4O` | PAIRING_MISSING | No formulary medications attached. — Attach at least one compatible Dirx/St Luke/Vios/Greenwich medication for this product family (see click guide). Do not invent formulations. |
| Semaglutide Injection — Any Dose (B12) | `MkDIUw0NcJB7YL2pNzYW` | PAIRING_HAS_INCOMPATIBLE_MEDICATION | 5 incompatible attachment(s) present; also 3 compatible — REMOVE incompatible medication(s): Semaglutide + B12 @ Greenwich Pharmacy (BmyTz7FPA4wUuojkq2Hy); Semaglutide + B12 @ Greenwich Pharmacy (Twz0VeW8olCbbL1UAuQr); Semaglutide + B12 @ Greenwich Pharmacy (lPPKidpoLhkYCSV1sLse); Semaglutide + B12 @ Greenwich Pharmacy (pBAQDkpmfv9FIcpoqhxa); Semaglutide + B12 @ Greenwich Pharmacy (vCNPRlelLVcJmimIT7Wy). Keep compatible same-family strengths. |
| SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP | `5F8jESeVeXcpkLU5rrdK` | PAIRING_MISSING | No formulary medications attached. — Attach at least one compatible Dirx/St Luke/Vios/Greenwich medication for this product family (see click guide). Do not invent formulations. |
| TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP | `E3MXZeeR01QROCuTLRLE` | PAIRING_MISSING | No formulary medications attached. — Attach at least one compatible Dirx/St Luke/Vios/Greenwich medication for this product family (see click guide). Do not invent formulations. |
| NAD + Nasal Spray | `FVwkzvQqWIZRNAwbslGw` | PAIRING_MISSING | No formulary medications attached. — Attach at least one compatible Dirx/St Luke/Vios/Greenwich medication for this product family (see click guide). Do not invent formulations. |
| Wolverine – BPC-157 + TB-500 Recovery Protocol | `omhh3NabouO8AsNR5tkD` | PAIRING_MISSING | No formulary medications attached. — Attach at least one compatible Dirx/St Luke/Vios/Greenwich medication for this product family (see click guide). Do not invent formulations. |
| Hair Loss – Dual Combo (Finasteride/Minoxidil) | `BboYS4a2Uj7APetrFo6W` | PAIRING_MISSING | No formulary medications attached. — Attach at least one compatible Dirx/St Luke/Vios/Greenwich medication for this product family (see click guide). Do not invent formulations. |
| Women's Hormones (HRT) – Progesterone | `5dGkjdpLP7DkKKE2iVxh` | PAIRING_MISSING | No formulary medications attached. — Attach at least one compatible Dirx/St Luke/Vios/Greenwich medication for this product family (see click guide). Do not invent formulations. |

## Code / docs updates (no GEN writes)

- `src/data/websiteFamilies/pairingPolicy.ts` — amended policy constants
- `src/data/websiteFamilies/pairingVerificationRegistry.ts` — 7 acceptable CPs
- `applyPairingVerification.ts` — sets `genPairingVerified` + promotes `GEN_PAIRING_PENDING` → `ROUTING_READY`
- `families.generated.*` — 7 variants verified / ROUTING_READY
- Gate comments reference amended policy; cutover still blocks real GEN orders

## Final report

```
GEN_CPS_REAUDITED: 15
PAIRING_ACCEPTABLE: 5
PAIRING_ACCEPTABLE_MULTIPLE_OPTIONS: 2
PAIRING_NEEDS_ADDITION: 0
PAIRING_HAS_INCOMPATIBLE_MEDICATION: 1
PAIRING_MISSING: 7
UNABLE_TO_VERIFY: 0
WEBSITE_VARIANTS_NOW_ELIGIBLE_FOR_ROUTING: 7
WEBSITE_VARIANTS_STILL_BLOCKED: 16
genPairingVerified_TRUE: 7
genPairingVerified_FALSE_among_23: 16
ROUTING_READY: 7
GEN_PAIRING_PENDING: 16
FORMULARY_PENDING: 14
FUTURE_HIDDEN: 51
BLOCKED: 15
GEN_MODIFIED: NO
PAIRINGS_MODIFIED: NO
REAL_GEN_ORDERS: 0
WEBSITE_PUBLISHED: NO
CUTOVER: OFF
LEGACY_B6_STOREFRONT: UNCHANGED
PR_19: OPEN / NOT MERGED
```

**STOP FOR OWNER REVIEW.**
