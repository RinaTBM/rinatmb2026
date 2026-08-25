# MBM GEN Pairing Verification Checklist

> **Policy:** `docs/MBM_GEN_PAIRING_POLICY_AMENDMENT_1.md` (amended).
>
> Latest closeout: `docs/MBM_GEN_PAIRING_FINAL_CLOSEOUT.md`

- Generated: `2026-08-25T05:40:24Z`
- EXISTING GEN CP PAIRING PHASE COMPLETE: **NO**
- Verified CPs: **8 / 15**
- genPairingVerified TRUE (website variants): **8**
- Cutover: **OFF** · Real GEN orders: **OFF**

## All 15

| GEN CP | Classification | Eligible |
|---|---|---|
| `SkqQHmsc0WdsbK9vmV1y` Semaglutide Injection — Starting / Low (B12) | `PAIRING_ACCEPTABLE` | YES |
| `BLf8inX395YNc7WPCD4O` Semaglutide Injection — Mid (B12) | `PAIRING_MISSING` | NO |
| `34I2X8MpVZf3AQTff3bo` Semaglutide Injection — High (B12) | `PAIRING_ACCEPTABLE` | YES |
| `MkDIUw0NcJB7YL2pNzYW` Semaglutide Injection — Any Dose (B12) | `PAIRING_ACCEPTABLE_MULTIPLE_OPTIONS` | YES |
| `tk2GW39OGr7JX4MCCoJP` Semaglutide Injection — Starting / Low (Glycine) | `PAIRING_ACCEPTABLE` | YES |
| `CjqOUbPuGPZzxephqRou` Semaglutide Injection — Mid (Glycine) | `PAIRING_ACCEPTABLE_MULTIPLE_OPTIONS` | YES |
| `sssEk3FDY4LFbQYGQsLx` Semaglutide Injection — High (Glycine) | `PAIRING_ACCEPTABLE` | YES |
| `wQK2JsFnh7oFBf3Lag4n` Semaglutide Injection — Any Dose (Glycine) | `PAIRING_ACCEPTABLE_MULTIPLE_OPTIONS` | YES |
| `5F8jESeVeXcpkLU5rrdK` SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP | `PAIRING_MISSING` | NO |
| `E3MXZeeR01QROCuTLRLE` TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP | `PAIRING_MISSING` | NO |
| `FVwkzvQqWIZRNAwbslGw` NAD + Nasal Spray | `PAIRING_ACCEPTABLE_MULTIPLE_OPTIONS` | YES |
| `omhh3NabouO8AsNR5tkD` Wolverine – BPC-157 + TB-500 Recovery Protocol | `PAIRING_MISSING` | NO |
| `iJtyig611AZEDBGdvRd9` BPC-157/TB500 | `PAIRING_HAS_INCOMPATIBLE_MEDICATION` | NO |
| `BboYS4a2Uj7APetrFo6W` Hair Loss – Dual Combo (Finasteride/Minoxidil) | `PAIRING_MISSING` | NO |
| `5dGkjdpLP7DkKKE2iVxh` Women's Hormones (HRT) – Progesterone | `PAIRING_HAS_INCOMPATIBLE_MEDICATION` | NO |

## Remaining actions

- **SEM Mid B12** (`BLf8inX395YNc7WPCD4O`): `PAIRING_MISSING` — Attach ≥1 Dirx Semaglutide + Vitamin B12 medication.
- **SEM Membership** (`5F8jESeVeXcpkLU5rrdK`): `PAIRING_MISSING` — Attach compatible Semaglutide + B12 and/or + Glycine options (may coexist). If GEN cannot hold both under one CP → GEN_BACKEND_SPLIT_REQUIRED (do not create in this run).
- **TIR Membership** (`E3MXZeeR01QROCuTLRLE`): `PAIRING_MISSING` — Attach compatible Tirzepatide + B12 and/or + Glycine options (may coexist). If GEN cannot hold both → GEN_BACKEND_SPLIT_REQUIRED.
- **Wolverine Capsule** (`omhh3NabouO8AsNR5tkD`): `PAIRING_MISSING` — Attach ≥1 compatible capsule medication (BPC/TB capsule).
- **Wolverine Injection** (`iJtyig611AZEDBGdvRd9`): `PAIRING_HAS_INCOMPATIBLE_MEDICATION` — REMOVE incompatible: BPC-157 / TB500 Capsules @ Greenwich Pharmacy (`SLBdNaBijUHmDFSohdaM`). Keep compatible same-family options.
- **Minoxidil Dual Combo** (`BboYS4a2Uj7APetrFo6W`): `PAIRING_MISSING` — Attach Vios Finasteride/Minoxidil 0.1%/5% to THIS CP (BboYS4…). Note: matching meds currently appear on Raw7m… (Minoxidil Topical) — move/reattach to locked Dual Combo CP.
- **Progesterone IR** (`5dGkjdpLP7DkKKE2iVxh`): `PAIRING_HAS_INCOMPATIBLE_MEDICATION` — REMOVE incompatible: Pregnenolone IR @ Vios (`LHAilcdBK0wULcdmoJVl`), Progesterone SR (DYE-FREE) @ Vios (`NRZXW0LomEaoyN5oA3WO`), Progesterone SR (DYE-FREE) @ Vios (`ORLfICIf7sgo1WTdXvEM`), Progesterone SR (DYE-FREE)(Lactose FREE) @ Vios (`KleUHs9VxvMycdhX0Z14`), Progesterone SR (DYE-FREE)(Lactose FREE) @ Vios (`xrMRDAQr9if9OrehgcH6`). Keep compatible same-family options.

- **Note:** Minoxidil 0.1%/5% Vios options currently on `Raw7mUkuzzhVdAo88jpL` not locked Dual Combo `BboYS4a2Uj7APetrFo6W`.

