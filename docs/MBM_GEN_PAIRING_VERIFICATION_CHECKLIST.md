# MBM GEN Pairing Verification Checklist

> **Policy:** `docs/MBM_GEN_PAIRING_POLICY_AMENDMENT_1.md` (amended).
>
> A pairing is acceptable when ≥1 **compatible** formulary medication is attached
> (correct family/additive/form + approved pharmacy) and **no material mismatches**.
> Multiple same-family strengths may remain — the **provider** chooses.
> Do **not** require exact strength/package equality when GEN API omits those fields.

- Variants with GEN `clientProductId`: **23**
- Unique GEN client products: **15**
- `genPairingVerified` true (amended policy): **7**
- `genPairingVerified` false: **16**
- Cutover: **OFF** · Real GEN orders: **OFF**

## Status (live re-audit)

| GEN CP | Name | Classification | Eligible |
|---|---|---|---|
| `SkqQHmsc0WdsbK9vmV1y` | Semaglutide Injection — Starting / Low (B12) | `PAIRING_ACCEPTABLE` | YES |
| `BLf8inX395YNc7WPCD4O` | Semaglutide Injection — Mid (B12) | `PAIRING_MISSING` | NO |
| `34I2X8MpVZf3AQTff3bo` | Semaglutide Injection — High (B12) | `PAIRING_ACCEPTABLE` | YES |
| `MkDIUw0NcJB7YL2pNzYW` | Semaglutide Injection — Any Dose (B12) | `PAIRING_HAS_INCOMPATIBLE_MEDICATION` | NO |
| `tk2GW39OGr7JX4MCCoJP` | Semaglutide Injection — Starting / Low (Glycine) | `PAIRING_ACCEPTABLE` | YES |
| `CjqOUbPuGPZzxephqRou` | Semaglutide Injection — Mid (Glycine) | `PAIRING_ACCEPTABLE_MULTIPLE_OPTIONS` | YES |
| `sssEk3FDY4LFbQYGQsLx` | Semaglutide Injection — High (Glycine) | `PAIRING_ACCEPTABLE` | YES |
| `wQK2JsFnh7oFBf3Lag4n` | Semaglutide Injection — Any Dose (Glycine) | `PAIRING_ACCEPTABLE_MULTIPLE_OPTIONS` | YES |
| `5F8jESeVeXcpkLU5rrdK` | SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP | `PAIRING_MISSING` | NO |
| `E3MXZeeR01QROCuTLRLE` | TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP | `PAIRING_MISSING` | NO |
| `FVwkzvQqWIZRNAwbslGw` | NAD + Nasal Spray | `PAIRING_MISSING` | NO |
| `omhh3NabouO8AsNR5tkD` | Wolverine – BPC-157 + TB-500 Recovery Protocol | `PAIRING_MISSING` | NO |
| `iJtyig611AZEDBGdvRd9` | BPC-157/TB500 | `PAIRING_ACCEPTABLE` | YES |
| `BboYS4a2Uj7APetrFo6W` | Hair Loss – Dual Combo (Finasteride/Minoxidil) | `PAIRING_MISSING` | NO |
| `5dGkjdpLP7DkKKE2iVxh` | Women's Hormones (HRT) – Progesterone | `PAIRING_MISSING` | NO |

## Owner actions still required

### Semaglutide Injection — Mid (B12) (`BLf8inX395YNc7WPCD4O`)

- Status: `PAIRING_MISSING`
- Variants: `sem-b12-mid`
- Action: Attach at least one compatible Dirx/St Luke/Vios/Greenwich medication for this product family (see click guide). Do not invent formulations.

### Semaglutide Injection — Any Dose (B12) (`MkDIUw0NcJB7YL2pNzYW`)

- Status: `PAIRING_HAS_INCOMPATIBLE_MEDICATION`
- Variants: `sem-b12-any-dose`
- Action: REMOVE incompatible medication(s): Semaglutide + B12 @ Greenwich Pharmacy (BmyTz7FPA4wUuojkq2Hy); Semaglutide + B12 @ Greenwich Pharmacy (Twz0VeW8olCbbL1UAuQr); Semaglutide + B12 @ Greenwich Pharmacy (lPPKidpoLhkYCSV1sLse); Semaglutide + B12 @ Greenwich Pharmacy (pBAQDkpmfv9FIcpoqhxa); Semaglutide + B12 @ Greenwich Pharmacy (vCNPRlelLVcJmimIT7Wy). Keep compatible same-family strengths.

### SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP (`5F8jESeVeXcpkLU5rrdK`)

- Status: `PAIRING_MISSING`
- Variants: `sem-membership`
- Action: Attach at least one compatible Dirx/St Luke/Vios/Greenwich medication for this product family (see click guide). Do not invent formulations.

### TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP (`E3MXZeeR01QROCuTLRLE`)

- Status: `PAIRING_MISSING`
- Variants: `tir-membership`
- Action: Attach at least one compatible Dirx/St Luke/Vios/Greenwich medication for this product family (see click guide). Do not invent formulations.

### NAD + Nasal Spray (`FVwkzvQqWIZRNAwbslGw`)

- Status: `PAIRING_MISSING`
- Variants: `nad-nasal-r84`
- Action: Attach at least one compatible Dirx/St Luke/Vios/Greenwich medication for this product family (see click guide). Do not invent formulations.

### Wolverine – BPC-157 + TB-500 Recovery Protocol (`omhh3NabouO8AsNR5tkD`)

- Status: `PAIRING_MISSING`
- Variants: `wolverine-capsule`
- Action: Attach at least one compatible Dirx/St Luke/Vios/Greenwich medication for this product family (see click guide). Do not invent formulations.

### Hair Loss – Dual Combo (Finasteride/Minoxidil) (`BboYS4a2Uj7APetrFo6W`)

- Status: `PAIRING_MISSING`
- Variants: `minoxidil-fin-minox-0.1-5`
- Action: Attach at least one compatible Dirx/St Luke/Vios/Greenwich medication for this product family (see click guide). Do not invent formulations.

### Women's Hormones (HRT) – Progesterone (`5dGkjdpLP7DkKKE2iVxh`)

- Status: `PAIRING_MISSING`
- Variants: `prog-ir-r41`, `prog-ir-r42`, `prog-ir-r43`, `prog-ir-r44`, `prog-ir-r45`, `prog-ir-r46`, `prog-ir-r47`, `prog-ir-r48`, `prog-ir-r49`
- Action: Attach at least one compatible Dirx/St Luke/Vios/Greenwich medication for this product family (see click guide). Do not invent formulations.

## Guidance lists (additions — not single-strength mandates)

Full SELECTED FORMULARY row guidance remains in `docs/MBM_GEN_PAIRING_OWNER_CLICK_GUIDE.md`.
Under the amended policy, those lists describe the **compatible option set**, not a requirement to attach exactly one strength.

After owner fixes remaining CPs: re-run postcheck / add IDs to `pairingVerificationRegistry.ts` / apply.
