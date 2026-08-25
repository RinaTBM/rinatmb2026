# MBM GEN Pairing Verification Checklist

> **Policy:** `docs/MBM_GEN_PAIRING_POLICY_AMENDMENT_1.md` (amended).
>
> A pairing is acceptable when ≥1 **compatible** formulary medication is attached
> (correct family/additive/form + approved pharmacy) and **no material mismatches**.
> Multiple same-family strengths may remain — the **provider** chooses.
> Do **not** require exact strength/package equality when GEN API omits those fields.

- Live postcheck: `docs/MBM_GEN_PAIRING_POSTCHECK_3.md` (`2026-08-25T05:25:13Z`)
- Variants with GEN `clientProductId`: **23**
- Unique GEN client products: **15**
- `genPairingVerified` true (amended policy): **8**
- `genPairingVerified` false: **15** (of 23 with GEN CP) / **95** (of all 103 variants)
- Cutover: **OFF** · Real GEN orders: **OFF**

## Status (live postcheck-3)

| GEN CP | Name | Classification | Eligible |
|---|---|---|---|
| `SkqQHmsc0WdsbK9vmV1y` | Semaglutide Injection — Starting / Low (B12) | `PAIRING_ACCEPTABLE` | YES |
| `BLf8inX395YNc7WPCD4O` | Semaglutide Injection — Mid (B12) | `PAIRING_MISSING` | NO |
| `34I2X8MpVZf3AQTff3bo` | Semaglutide Injection — High (B12) | `PAIRING_ACCEPTABLE` | YES |
| `MkDIUw0NcJB7YL2pNzYW` | Semaglutide Injection — Any Dose (B12) | `PAIRING_ACCEPTABLE_MULTIPLE_OPTIONS` | YES |
| `tk2GW39OGr7JX4MCCoJP` | Semaglutide Injection — Starting / Low (Glycine) | `PAIRING_ACCEPTABLE` | YES |
| `CjqOUbPuGPZzxephqRou` | Semaglutide Injection — Mid (Glycine) | `PAIRING_ACCEPTABLE_MULTIPLE_OPTIONS` | YES |
| `sssEk3FDY4LFbQYGQsLx` | Semaglutide Injection — High (Glycine) | `PAIRING_ACCEPTABLE` | YES |
| `wQK2JsFnh7oFBf3Lag4n` | Semaglutide Injection — Any Dose (Glycine) | `PAIRING_ACCEPTABLE_MULTIPLE_OPTIONS` | YES |
| `5F8jESeVeXcpkLU5rrdK` | SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP | `PAIRING_MISSING` | NO |
| `E3MXZeeR01QROCuTLRLE` | TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP | `PAIRING_MISSING` | NO |
| `FVwkzvQqWIZRNAwbslGw` | NAD + Nasal Spray | `PAIRING_ACCEPTABLE_MULTIPLE_OPTIONS` | YES |
| `omhh3NabouO8AsNR5tkD` | Wolverine – BPC-157 + TB-500 Recovery Protocol | `PAIRING_MISSING` | NO |
| `iJtyig611AZEDBGdvRd9` | BPC-157/TB500 | `PAIRING_HAS_INCOMPATIBLE_MEDICATION` | NO |
| `BboYS4a2Uj7APetrFo6W` | Hair Loss – Dual Combo (Finasteride/Minoxidil) | `PAIRING_MISSING` | NO |
| `5dGkjdpLP7DkKKE2iVxh` | Women's Hormones (HRT) – Progesterone | `PAIRING_HAS_INCOMPATIBLE_MEDICATION` | NO |

## Owner actions still required

### Semaglutide Injection — Mid (B12) (`BLf8inX395YNc7WPCD4O`)

- Status: `PAIRING_MISSING`
- Variants: `sem-b12-mid`
- Action: Attach ≥1 compatible medication for this family (see click guide).

### SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP (`5F8jESeVeXcpkLU5rrdK`)

- Status: `PAIRING_MISSING`
- Variants: `sem-membership`
- Action: Attach ≥1 compatible medication for this family (see click guide).

### TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP (`E3MXZeeR01QROCuTLRLE`)

- Status: `PAIRING_MISSING`
- Variants: `tir-membership`
- Action: Attach ≥1 compatible medication for this family (see click guide).

### Wolverine – BPC-157 + TB-500 Recovery Protocol (`omhh3NabouO8AsNR5tkD`)

- Status: `PAIRING_MISSING`
- Variants: `wolverine-capsule`
- Action: Attach ≥1 compatible medication for this family (see click guide).

### BPC-157/TB500 (`iJtyig611AZEDBGdvRd9`)

- Status: `PAIRING_HAS_INCOMPATIBLE_MEDICATION`
- Variants: `wolverine-injection`
- Action: REMOVE: BPC-157 / TB500 Capsules @ Greenwich Pharmacy (`SLBdNaBijUHmDFSohdaM`); KEEP compatible same-family options.

### Hair Loss – Dual Combo (Finasteride/Minoxidil) (`BboYS4a2Uj7APetrFo6W`)

- Status: `PAIRING_MISSING`
- Variants: `minoxidil-fin-minox-0.1-5`
- Action: Attach ≥1 compatible medication for this family (see click guide).

### Women's Hormones (HRT) – Progesterone (`5dGkjdpLP7DkKKE2iVxh`)

- Status: `PAIRING_HAS_INCOMPATIBLE_MEDICATION`
- Variants: `prog-ir-r41`, `prog-ir-r42`, `prog-ir-r43`, `prog-ir-r44`, `prog-ir-r45`, `prog-ir-r46`, `prog-ir-r47`, `prog-ir-r48`, `prog-ir-r49`
- Action: REMOVE: Pregnenolone IR @ Vios (`LHAilcdBK0wULcdmoJVl`); Progesterone SR (DYE-FREE) @ Vios (`NRZXW0LomEaoyN5oA3WO`); Progesterone SR (DYE-FREE) @ Vios (`ORLfICIf7sgo1WTdXvEM`); Progesterone SR (DYE-FREE)(Lactose FREE) @ Vios (`KleUHs9VxvMycdhX0Z14`); Progesterone SR (DYE-FREE)(Lactose FREE) @ Vios (`xrMRDAQr9if9OrehgcH6`); KEEP compatible same-family options.

## Next

- Create preflight (not execute): `docs/MBM_GEN_NEXT_CREATE_PREFLIGHT.md` — 13 CPs.
- EXISTING GEN CP PAIRING PHASE COMPLETE: **NO** until remaining actions above are done.

