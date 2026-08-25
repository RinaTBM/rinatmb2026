# MBM GEN Pairing Postcheck 1

**Read-only GEN compare** against `docs/MBM_GEN_PAIRING_OWNER_CLICK_GUIDE.md`. No GEN writes. No cutover. PR #19 stays open.

Generated: `2026-08-25T03:31:05Z`

## API limitation (critical)

GEN `?view=formulary` returns **standardizedMedicationName + pharmacyName + medicationId** only.
**Strength / form / package are not returned.** Therefore **PAIRING_VERIFIED was not awarded** to any CP — exact match cannot be proven from API alone even when counts look close.

## Summary

| Classification | Count |
|---|---:|
| PAIRING_VERIFIED | 0 |
| PAIRING_INCOMPLETE | 5 |
| PAIRING_INCORRECT | 2 |
| PAIRING_MISSING | 7 |
| PRICE_MISMATCH | 0 |
| UNABLE_TO_VERIFY | 1 |

**Registry update:** none (0 verified). **applyPairingVerification flips:** 0.

## Per-product results

### Task 1: Semaglutide Injection — Starting / Low (B12)

- **Classification:** `PAIRING_INCOMPLETE`
- **GEN ID:** `SkqQHmsc0WdsbK9vmV1y`
- **clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SkqQHmsc0WdsbK9vmV1y`
- **Expected price:** $89–99 (band; confirm GEN customer price aligns with architecture)
- **Actual GEN price:** 99.0
- **Expected pairings:** 2 · **Actual:** 1
- **Expected pharmacy:** Dirx-Hub
- **Actual pharmacy:** Dirx-Hub
- **Actual strength/form/package:** `NOT_RETURNED_BY_GEN_API`
- **Why not verified:** PAIRING_VERIFIED requires exact medication+pharmacy+strength+form+package match; attachment count below expected.

Expected selections:
  - r3: SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 1mg/0.5mg/mL · Vial · 1mL
  - r5: SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 2mg/0.5mg/mL · Vial · 1mL

Actual selections:
  - Semaglutide + Vitamin B12 · Dirx-Hub · `gqe6H8ay1sw6QlS32SMH`

### Task 2: Semaglutide Injection — Mid (B12)

- **Classification:** `PAIRING_MISSING`
- **GEN ID:** `BLf8inX395YNc7WPCD4O`
- **clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_BLf8inX395YNc7WPCD4O`
- **Expected price:** $109
- **Actual GEN price:** 109.0
- **Expected pairings:** 1 · **Actual:** 0
- **Expected pharmacy:** Dirx-Hub
- **Actual pharmacy:** (none)
- **Actual strength/form/package:** `NOT_RETURNED_BY_GEN_API`
- **Why not verified:** PAIRING_VERIFIED requires exact medication+pharmacy+strength+form+package match; no formulary attachments present.

Expected selections:
  - r7: SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 4mg/0.5mg/mL · Vial · 1mL

Actual selections:
  - _(none)_

### Task 3: Semaglutide Injection — High (B12)

- **Classification:** `PAIRING_INCOMPLETE`
- **GEN ID:** `34I2X8MpVZf3AQTff3bo`
- **clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_34I2X8MpVZf3AQTff3bo`
- **Expected price:** $109–119
- **Actual GEN price:** 119.0
- **Expected pairings:** 2 · **Actual:** 1
- **Expected pharmacy:** Dirx-Hub
- **Actual pharmacy:** Dirx-Hub
- **Actual strength/form/package:** `NOT_RETURNED_BY_GEN_API`
- **Why not verified:** PAIRING_VERIFIED requires exact medication+pharmacy+strength+form+package match; attachment count below expected.

Expected selections:
  - r9: SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 6mg/0.5mg/mL · Vial · 1mL
  - r11: SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 10mg/0.5mg/mL · Vial · 1mL

Actual selections:
  - Semaglutide + Vitamin B12 · Dirx-Hub · `YqrJ1qnOv3U3ecJHuSzr`

### Task 4: Semaglutide Injection — Any Dose (B12)

- **Classification:** `PAIRING_INCORRECT`
- **GEN ID:** `MkDIUw0NcJB7YL2pNzYW`
- **clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_MkDIUw0NcJB7YL2pNzYW`
- **Expected price:** $89–119
- **Actual GEN price:** 119.0
- **Expected pairings:** 5 · **Actual:** 8
- **Expected pharmacy:** Dirx-Hub
- **Actual pharmacy:** Dirx-Hub, Greenwich Pharmacy
- **Actual strength/form/package:** `NOT_RETURNED_BY_GEN_API`
- **Expected removals gone:** False
- **Why not verified:** PAIRING_VERIFIED requires exact medication+pharmacy+strength+form+package match; wrong/extra attachments and/or documented removals still present.

Expected selections:
  - r3: SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 1mg/0.5mg/mL · Vial · 1mL
  - r5: SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 2mg/0.5mg/mL · Vial · 1mL
  - r7: SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 4mg/0.5mg/mL · Vial · 1mL
  - r9: SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 6mg/0.5mg/mL · Vial · 1mL
  - r11: SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 10mg/0.5mg/mL · Vial · 1mL

Actual selections:
  - Semaglutide B12 ( , , ) · Dirx-Hub · `99BZowkyXTMiGTu5cosT`
  - Semaglutide B12 ( , , ) · Dirx-Hub · `ekw92avqC0Uf2thW7fA9`
  - Semaglutide B12 ( , , ) · Dirx-Hub · `iXnkfsa6XHugbDanwjUX`
  - Semaglutide + B12 · Greenwich Pharmacy · `BmyTz7FPA4wUuojkq2Hy`
  - Semaglutide + B12 · Greenwich Pharmacy · `Twz0VeW8olCbbL1UAuQr`
  - Semaglutide + B12 · Greenwich Pharmacy · `lPPKidpoLhkYCSV1sLse`
  - Semaglutide + B12 · Greenwich Pharmacy · `pBAQDkpmfv9FIcpoqhxa`
  - Semaglutide + B12 · Greenwich Pharmacy · `vCNPRlelLVcJmimIT7Wy`

### Task 5: Semaglutide Injection — Starting / Low (Glycine)

- **Classification:** `PAIRING_INCOMPLETE`
- **GEN ID:** `tk2GW39OGr7JX4MCCoJP`
- **clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_tk2GW39OGr7JX4MCCoJP`
- **Expected price:** $89–99
- **Actual GEN price:** 99.0
- **Expected pairings:** 2 · **Actual:** 1
- **Expected pharmacy:** Dirx-Hub
- **Actual pharmacy:** Dirx-Hub
- **Actual strength/form/package:** `NOT_RETURNED_BY_GEN_API`
- **Why not verified:** PAIRING_VERIFIED requires exact medication+pharmacy+strength+form+package match; attachment count below expected.

Expected selections:
  - r2: SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 1mg/0.5mg/mL · Vial · 1mL
  - r4: SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 2mg/0.5mg/mL · Vial · 1mL

Actual selections:
  - Semaglutide + Glycine · Dirx-Hub · `KFVdP0FaVZHpXt9ewjiV`

### Task 6: Semaglutide Injection — Mid (Glycine)

- **Classification:** `PAIRING_INCORRECT`
- **GEN ID:** `CjqOUbPuGPZzxephqRou`
- **clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_CjqOUbPuGPZzxephqRou`
- **Expected price:** $109
- **Actual GEN price:** 109.0
- **Expected pairings:** 1 · **Actual:** 2
- **Expected pharmacy:** Dirx-Hub
- **Actual pharmacy:** Dirx-Hub
- **Actual strength/form/package:** `NOT_RETURNED_BY_GEN_API`
- **Why not verified:** PAIRING_VERIFIED requires exact medication+pharmacy+strength+form+package match; wrong/extra attachments and/or documented removals still present.

Expected selections:
  - r6: SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 4mg/0.5mg/mL · Vial · 1mL

Actual selections:
  - Semaglutide + Glycine · Dirx-Hub · `KFVdP0FaVZHpXt9ewjiV`
  - Semaglutide + Glycine · Dirx-Hub · `SX8kyR4siUDVAUrm9CvN`

### Task 7: Semaglutide Injection — High (Glycine)

- **Classification:** `PAIRING_INCOMPLETE`
- **GEN ID:** `sssEk3FDY4LFbQYGQsLx`
- **clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_sssEk3FDY4LFbQYGQsLx`
- **Expected price:** $109–119
- **Actual GEN price:** 119.0
- **Expected pairings:** 2 · **Actual:** 1
- **Expected pharmacy:** Dirx-Hub
- **Actual pharmacy:** Dirx-Hub
- **Actual strength/form/package:** `NOT_RETURNED_BY_GEN_API`
- **Why not verified:** PAIRING_VERIFIED requires exact medication+pharmacy+strength+form+package match; attachment count below expected.

Expected selections:
  - r8: SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 6mg/0.5mg/mL · Vial · 1mL
  - r10: SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 10mg/0.5mg/mL · Vial · 1mL

Actual selections:
  - Semaglutide + Glycine · Dirx-Hub · `IHYsg7nVwVWB2LjoAR6a`

### Task 8: Semaglutide Injection — Any Dose (Glycine)

- **Classification:** `PAIRING_INCOMPLETE`
- **GEN ID:** `wQK2JsFnh7oFBf3Lag4n`
- **clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_wQK2JsFnh7oFBf3Lag4n`
- **Expected price:** $89–119
- **Actual GEN price:** 119.0
- **Expected pairings:** 5 · **Actual:** 4
- **Expected pharmacy:** Dirx-Hub
- **Actual pharmacy:** Dirx-Hub
- **Actual strength/form/package:** `NOT_RETURNED_BY_GEN_API`
- **Why not verified:** PAIRING_VERIFIED requires exact medication+pharmacy+strength+form+package match; attachment count below expected.

Expected selections:
  - r2: SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 1mg/0.5mg/mL · Vial · 1mL
  - r4: SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 2mg/0.5mg/mL · Vial · 1mL
  - r6: SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 4mg/0.5mg/mL · Vial · 1mL
  - r8: SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 6mg/0.5mg/mL · Vial · 1mL
  - r10: SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 10mg/0.5mg/mL · Vial · 1mL

Actual selections:
  - Semaglutide + Glycine · Dirx-Hub · `IHYsg7nVwVWB2LjoAR6a`
  - Semaglutide + Glycine · Dirx-Hub · `KFVdP0FaVZHpXt9ewjiV`
  - Semaglutide + Glycine · Dirx-Hub · `SX8kyR4siUDVAUrm9CvN`
  - Semaglutide + Glycine · Dirx-Hub · `WPEBtvCdn2I8l6tRmT9R`

### Task 9: SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP

- **Classification:** `PAIRING_MISSING`
- **GEN ID:** `5F8jESeVeXcpkLU5rrdK`
- **clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_5F8jESeVeXcpkLU5rrdK`
- **Expected price:** $149
- **Actual GEN price:** 149.0
- **Expected pairings:** 10 · **Actual:** 0
- **Expected pharmacy:** Dirx-Hub
- **Actual pharmacy:** (none)
- **Actual strength/form/package:** `NOT_RETURNED_BY_GEN_API`
- **Why not verified:** PAIRING_VERIFIED requires exact medication+pharmacy+strength+form+package match; no formulary attachments present.

Expected selections:
  - r2: SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 1mg/0.5mg/mL · Vial · 1mL
  - r3: SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 1mg/0.5mg/mL · Vial · 1mL
  - r4: SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 2mg/0.5mg/mL · Vial · 1mL
  - r5: SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 2mg/0.5mg/mL · Vial · 1mL
  - r6: SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 4mg/0.5mg/mL · Vial · 1mL
  - r7: SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 4mg/0.5mg/mL · Vial · 1mL
  - r8: SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 6mg/0.5mg/mL · Vial · 1mL
  - r9: SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 6mg/0.5mg/mL · Vial · 1mL
  - r10: SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 10mg/0.5mg/mL · Vial · 1mL
  - r11: SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) · Dirx-Hub · 10mg/0.5mg/mL · Vial · 1mL

Actual selections:
  - _(none)_

### Task 10: TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP

- **Classification:** `PAIRING_MISSING`
- **GEN ID:** `E3MXZeeR01QROCuTLRLE`
- **clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_E3MXZeeR01QROCuTLRLE`
- **Expected price:** $275
- **Actual GEN price:** 275.0
- **Expected pairings:** 12 · **Actual:** 0
- **Expected pharmacy:** Dirx-Hub
- **Actual pharmacy:** (none)
- **Actual strength/form/package:** `NOT_RETURNED_BY_GEN_API`
- **Why not verified:** PAIRING_VERIFIED requires exact medication+pharmacy+strength+form+package match; no formulary attachments present.

Expected selections:
  - r13: TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) · Dirx-Hub · 5mg/0.5mg/mL · Vial · 2mL
  - r14: TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL) · Dirx-Hub · 5mg/0.5mg/mL · Vial · 2mL
  - r15: TIRZEPATIDE + GLYCINE 10MG/0.5MG/ML (2ML VIAL) · Dirx-Hub · 10mg/0.5mg/mL · Vial · 2mL
  - r16: TIRZEPATIDE + VITAMIN B12 10MG/0.5MG/ML (2ML VIAL) · Dirx-Hub · 10mg/0.5mg/mL · Vial · 2mL
  - r17: TIRZEPATIDE + GLYCINE 15MG/0.5MG/ML (2ML VIAL) · Dirx-Hub · 15mg/0.5mg/mL · Vial · 2mL
  - r18: TIRZEPATIDE + VITAMIN B12 15MG/0.5MG/ML (2ML VIAL) · Dirx-Hub · 15mg/0.5mg/mL · Vial · 2mL
  - r19: TIRZEPATIDE + GLYCINE 20MG/0.5MG/ML (2ML VIAL) · Dirx-Hub · 20mg/0.5mg/mL · Vial · 2mL
  - r20: TIRZEPATIDE + VITAMIN B12 20MG/0.5MG/ML (2ML VIAL) · Dirx-Hub · 20mg/0.5mg/mL · Vial · 2mL
  - r21: TIRZEPATIDE + GLYCINE 25MG/0.5MG/ML (2ML VIAL) · Dirx-Hub · 25mg/0.5mg/mL · Vial · 2mL
  - r22: TIRZEPATIDE + VITAMIN B12 25MG/0.5MG/ML (2ML VIAL) · Dirx-Hub · 25mg/0.5mg/mL · Vial · 2mL
  - r23: TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) · Dirx-Hub · 30mg/0.5mg/mL · Vial · 2mL
  - r24: TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL) · Dirx-Hub · 30mg/0.5mg/mL · Vial · 2mL

Actual selections:
  - _(none)_

### Task 11: NAD + Nasal Spray

- **Classification:** `PAIRING_MISSING`
- **GEN ID:** `FVwkzvQqWIZRNAwbslGw`
- **clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_FVwkzvQqWIZRNAwbslGw`
- **Expected price:** $79
- **Actual GEN price:** 0.0 ⚠️ expected 79, actual 0.0
- **Expected pairings:** 1 · **Actual:** 0
- **Expected pharmacy:** St Luke
- **Actual pharmacy:** (none)
- **Actual strength/form/package:** `NOT_RETURNED_BY_GEN_API`
- **Why not verified:** PAIRING_VERIFIED requires exact medication+pharmacy+strength+form+package match; no formulary attachments present.

Expected selections:
  - r84: NAD+ 50mg/ml · St Luke · 50mg/ml · Nasal Spray · 15ml

Actual selections:
  - _(none)_

### Task 12: Wolverine – BPC-157 + TB-500 Recovery Protocol

- **Classification:** `PAIRING_MISSING`
- **GEN ID:** `omhh3NabouO8AsNR5tkD`
- **clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_omhh3NabouO8AsNR5tkD`
- **Expected price:** $29
- **Actual GEN price:** 0.0 ⚠️ expected 29, actual 0.0
- **Expected pairings:** 1 · **Actual:** 0
- **Expected pharmacy:** Greenwich Pharmacy
- **Actual pharmacy:** (none)
- **Actual strength/form/package:** `NOT_RETURNED_BY_GEN_API`
- **Why not verified:** PAIRING_VERIFIED requires exact medication+pharmacy+strength+form+package match; no formulary attachments present.

Expected selections:
  - r104: BPC-157/TB500 capsules 500MCG/500MCG · Greenwich Pharmacy · 500mcg/500mcg · (see GEN picker — SELECTED FORMULARY Form blank) · 1EA

Actual selections:
  - _(none)_

### Task 13: BPC-157/TB500

- **Classification:** `UNABLE_TO_VERIFY`
- **GEN ID:** `iJtyig611AZEDBGdvRd9`
- **clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_iJtyig611AZEDBGdvRd9`
- **Expected price:** $159
- **Actual GEN price:** 169.0 ⚠️ expected 159, actual 169.0
- **Expected pairings:** 1 · **Actual:** 1
- **Expected pharmacy:** Greenwich Pharmacy
- **Actual pharmacy:** Greenwich Pharmacy
- **Actual strength/form/package:** `NOT_RETURNED_BY_GEN_API`
- **Why not verified:** PAIRING_VERIFIED requires exact medication+pharmacy+strength+form+package match; GEN formulary read returns name+pharmacy+medicationId only — strength/form/package not available to prove exact match.

Expected selections:
  - r103: BPC-157/TB500 3mg/3mg/mL · Greenwich Pharmacy · 3mg/3mg/mL · (see GEN picker — SELECTED FORMULARY Form blank) · 5ML

Actual selections:
  - BPC-157 / TB500 · Greenwich Pharmacy · `27WtrIdo3z4Ssj5sDcc6`

### Task 14: Hair Loss – Dual Combo (Finasteride/Minoxidil)

- **Classification:** `PAIRING_MISSING`
- **GEN ID:** `BboYS4a2Uj7APetrFo6W`
- **clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_BboYS4a2Uj7APetrFo6W`
- **Expected price:** $79
- **Actual GEN price:** 0.0 ⚠️ expected 79, actual 0.0
- **Expected pairings:** 1 · **Actual:** 0
- **Expected pharmacy:** Vios
- **Actual pharmacy:** (none)
- **Actual strength/form/package:** `NOT_RETURNED_BY_GEN_API`
- **Why not verified:** PAIRING_VERIFIED requires exact medication+pharmacy+strength+form+package match; no formulary attachments present.

Expected selections:
  - r129: FINASTERIDE/MINOXIDIL (PER ML) 0.1/5 % · Vios · 0.1/5 % · Foam · 1 ml

Actual selections:
  - _(none)_

### Task 15: Women's Hormones (HRT) – Progesterone

- **Classification:** `PAIRING_MISSING`
- **GEN ID:** `5dGkjdpLP7DkKKE2iVxh`
- **clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_5dGkjdpLP7DkKKE2iVxh`
- **Expected price:** $29
- **Actual GEN price:** 0.0 ⚠️ expected 29, actual 0.0
- **Expected pairings:** 9 · **Actual:** 0
- **Expected pharmacy:** Vios
- **Actual pharmacy:** (none)
- **Actual strength/form/package:** `NOT_RETURNED_BY_GEN_API`
- **Why not verified:** PAIRING_VERIFIED requires exact medication+pharmacy+strength+form+package match; no formulary attachments present.

Expected selections:
  - r41: PROGESTERONE 100MG CAPSULE 100mg · Vios · 100mg · Capsule · 1 mg
  - r42: PROGESTERONE 200MG CAPSULE 200mg · Vios · 200mg · Capsule · 1 mg
  - r43: PROGESTERONE 50MG CAPSULE 50mg · Vios · 50mg · Capsule · 1 mg
  - r44: PROGESTERONE IR 100 MG · Vios · 100 MG · Capsule · 1 each
  - r45: PROGESTERONE IR 150 MG · Vios · 150 MG · Capsule · 1 each
  - r46: PROGESTERONE IR 200 MG · Vios · 200 MG · Capsule · 1 each
  - r47: PROGESTERONE IR (DYE-FREE)(LACTOSE-FREE) (M NEW) 200MG · Vios · 200MG · Capsule · 1 each
  - r48: PROGESTERONE IR 300 MG · Vios · 300 MG · Capsule · 1 each
  - r49: PROGESTERONE IR 400 MG · Vios · 400 MG · Capsule · 1 each

Actual selections:
  - _(none)_

## Owner correction table (do not execute here)

| GEN PRODUCT | GEN ID | STATUS | WHAT IS WRONG | ADD | REMOVE | PHARMACY | FINAL COUNT |
|---|---|---|---|---|---|---|---:|
| Semaglutide Injection — Starting / Low (B12) | `SkqQHmsc0WdsbK9vmV1y` | PAIRING_INCOMPLETE | 1 of 2 attachments; missing strengths must be added | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) (r3, Dirx-Hub, 1mg/0.5mg/mL, Vial, 1mL)<br>SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) (r5, Dirx-Hub, 2mg/0.5mg/mL, Vial, 1mL) | NONE unless an attached med fails strength check in GEN UI — then remove/replace | Dirx-Hub | 2 |
| Semaglutide Injection — Mid (B12) | `BLf8inX395YNc7WPCD4O` | PAIRING_MISSING | 0 of 1 expected formulary attachments | SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) (r7, Dirx-Hub, 4mg/0.5mg/mL, Vial, 1mL) | NONE (nothing attached yet) | Dirx-Hub | 1 |
| Semaglutide Injection — High (B12) | `34I2X8MpVZf3AQTff3bo` | PAIRING_INCOMPLETE | 1 of 2 attachments; missing strengths must be added | SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) (r9, Dirx-Hub, 6mg/0.5mg/mL, Vial, 1mL)<br>SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) (r11, Dirx-Hub, 10mg/0.5mg/mL, Vial, 1mL) | NONE unless an attached med fails strength check in GEN UI — then remove/replace | Dirx-Hub | 2 |
| Semaglutide Injection — Any Dose (B12) | `MkDIUw0NcJB7YL2pNzYW` | PAIRING_INCORRECT | Attachment set does not match locked guide (count=8, expected=5) | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) (r3, Dirx-Hub, 1mg/0.5mg/mL, Vial, 1mL)<br>SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) (r5, Dirx-Hub, 2mg/0.5mg/mL, Vial, 1mL)<br>SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) (r7, Dirx-Hub, 4mg/0.5mg/mL, Vial, 1mL)<br>… +2 more (see click guide) | Semaglutide + B12 @ Greenwich Pharmacy (BmyTz7FPA4wUuojkq2Hy)<br>Semaglutide + B12 @ Greenwich Pharmacy (Twz0VeW8olCbbL1UAuQr)<br>Semaglutide + B12 @ Greenwich Pharmacy (lPPKidpoLhkYCSV1sLse)<br>Semaglutide + B12 @ Greenwich Pharmacy (pBAQDkpmfv9FIcpoqhxa)<br>Semaglutide + B12 @ Greenwich Pharmacy (vCNPRlelLVcJmimIT7Wy)<br>All 5 Greenwich Semaglutide + B12 (see knownExactRemovals)<br>Any Dirx attachment that is not one of the five B12 1/2/4/6/10 mg 1mL vials | Dirx-Hub | 5 |
| Semaglutide Injection — Starting / Low (Glycine) | `tk2GW39OGr7JX4MCCoJP` | PAIRING_INCOMPLETE | 1 of 2 attachments; missing strengths must be added | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) (r2, Dirx-Hub, 1mg/0.5mg/mL, Vial, 1mL)<br>SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) (r4, Dirx-Hub, 2mg/0.5mg/mL, Vial, 1mL) | NONE unless an attached med fails strength check in GEN UI — then remove/replace | Dirx-Hub | 2 |
| Semaglutide Injection — Mid (Glycine) | `CjqOUbPuGPZzxephqRou` | PAIRING_INCORRECT | Attachment set does not match locked guide (count=2, expected=1) | SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) (r6, Dirx-Hub, 4mg/0.5mg/mL, Vial, 1mL) | Open both Dirx Glycine attachments; REMOVE the one that is NOT 4mg/0.5mg/mL 1mL (row 6) | Dirx-Hub | 1 |
| Semaglutide Injection — High (Glycine) | `sssEk3FDY4LFbQYGQsLx` | PAIRING_INCOMPLETE | 1 of 2 attachments; missing strengths must be added | SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) (r8, Dirx-Hub, 6mg/0.5mg/mL, Vial, 1mL)<br>SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) (r10, Dirx-Hub, 10mg/0.5mg/mL, Vial, 1mL) | NONE unless an attached med fails strength check in GEN UI — then remove/replace | Dirx-Hub | 2 |
| Semaglutide Injection — Any Dose (Glycine) | `wQK2JsFnh7oFBf3Lag4n` | PAIRING_INCOMPLETE | 4 of 5 attachments; missing strengths must be added | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) (r2, Dirx-Hub, 1mg/0.5mg/mL, Vial, 1mL)<br>SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) (r4, Dirx-Hub, 2mg/0.5mg/mL, Vial, 1mL)<br>SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) (r6, Dirx-Hub, 4mg/0.5mg/mL, Vial, 1mL)<br>… +2 more (see click guide) | NONE unless an attached med fails strength check in GEN UI — then remove/replace | Dirx-Hub | 5 |
| SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP | `5F8jESeVeXcpkLU5rrdK` | PAIRING_MISSING | 0 of 10 expected formulary attachments | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) (r2, Dirx-Hub, 1mg/0.5mg/mL, Vial, 1mL)<br>SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) (r3, Dirx-Hub, 1mg/0.5mg/mL, Vial, 1mL)<br>SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) (r4, Dirx-Hub, 2mg/0.5mg/mL, Vial, 1mL)<br>… +7 more (see click guide) | NONE (nothing attached yet) | Dirx-Hub | 10 |
| TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP | `E3MXZeeR01QROCuTLRLE` | PAIRING_MISSING | 0 of 12 expected formulary attachments | TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) (r13, Dirx-Hub, 5mg/0.5mg/mL, Vial, 2mL)<br>TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL) (r14, Dirx-Hub, 5mg/0.5mg/mL, Vial, 2mL)<br>TIRZEPATIDE + GLYCINE 10MG/0.5MG/ML (2ML VIAL) (r15, Dirx-Hub, 10mg/0.5mg/mL, Vial, 2mL)<br>… +9 more (see click guide) | NONE (nothing attached yet) | Dirx-Hub | 12 |
| NAD + Nasal Spray | `FVwkzvQqWIZRNAwbslGw` | PAIRING_MISSING | 0 of 1 expected formulary attachments; Price: expected 79, actual 0.0 | NAD+ 50mg/ml (r84, St Luke, 50mg/ml, Nasal Spray, 15ml) | NONE (nothing attached yet) | St Luke | 1 |
| Wolverine – BPC-157 + TB-500 Recovery Protocol | `omhh3NabouO8AsNR5tkD` | PAIRING_MISSING | 0 of 1 expected formulary attachments; Price: expected 29, actual 0.0 | BPC-157/TB500 capsules 500MCG/500MCG (r104, Greenwich Pharmacy, 500mcg/500mcg, (see GEN picker — SELECTED FORMULARY Form blank), 1EA) | NONE (nothing attached yet) | Greenwich Pharmacy | 1 |
| BPC-157/TB500 | `iJtyig611AZEDBGdvRd9` | UNABLE_TO_VERIFY | API cannot prove strength/form/package; owner UI confirmation still required; Price: expected 159, actual 169.0 | BPC-157/TB500 3mg/3mg/mL (r103, Greenwich Pharmacy, 3mg/3mg/mL, (see GEN picker — SELECTED FORMULARY Form blank), 5ML) | Confirm in GEN UI; remove if not exact row match | Greenwich Pharmacy | 1 |
| Hair Loss – Dual Combo (Finasteride/Minoxidil) | `BboYS4a2Uj7APetrFo6W` | PAIRING_MISSING | 0 of 1 expected formulary attachments; Price: expected 79, actual 0.0 | FINASTERIDE/MINOXIDIL (PER ML) 0.1/5 % (r129, Vios, 0.1/5 %, Foam, 1 ml) | NONE (nothing attached yet) | Vios | 1 |
| Women's Hormones (HRT) – Progesterone | `5dGkjdpLP7DkKKE2iVxh` | PAIRING_MISSING | 0 of 9 expected formulary attachments; Price: expected 29, actual 0.0 | PROGESTERONE 100MG CAPSULE 100mg (r41, Vios, 100mg, Capsule, 1 mg)<br>PROGESTERONE 200MG CAPSULE 200mg (r42, Vios, 200mg, Capsule, 1 mg)<br>PROGESTERONE 50MG CAPSULE 50mg (r43, Vios, 50mg, Capsule, 1 mg)<br>… +6 more (see click guide) | NONE (nothing attached yet) | Vios | 9 |

Full ADD lists remain in the click guide Tasks 1–15.

## Website routing recompute (after empty registry apply)

- ROUTING_READY: **0**
- GEN_PAIRING_PENDING: **23**
- FORMULARY_PENDING: **14**
- FUTURE_HIDDEN: **51**
- BLOCKED: **15**
- GEN CPs verified: **0 / 15**
- Website variants newly verified: **0 / 23**
- Still awaiting pairing verification: **23**

### Focus families

**Semaglutide** — statuses `{'GEN_PAIRING_PENDING': 9, 'BLOCKED': 1, 'FUTURE_HIDDEN': 1}` · GEN-id variants 9 · verified 0
**Tirzepatide** — statuses `{'BLOCKED': 9, 'GEN_PAIRING_PENDING': 1}` · GEN-id variants 1 · verified 0
**NAD+** — statuses `{'FORMULARY_PENDING': 2, 'FUTURE_HIDDEN': 3, 'GEN_PAIRING_PENDING': 1, 'BLOCKED': 1}` · GEN-id variants 1 · verified 0
**Wolverine / BPC-TB** — statuses `{'GEN_PAIRING_PENDING': 2}` · GEN-id variants 2 · verified 0
**Estradiol** — statuses `{'BLOCKED': 4, 'FUTURE_HIDDEN': 4}` · GEN-id variants 0 · verified 0
**Minoxidil** — statuses `{'GEN_PAIRING_PENDING': 1, 'FUTURE_HIDDEN': 3}` · GEN-id variants 1 · verified 0

## Next-phase (out of scope for this postcheck)

- TIR one-time GEN CP CREATE ×8: **STILL PENDING**
- Estradiol patch GEN CP CREATE ×4: **STILL PENDING**
- NAD nasal r85 GEN CP CREATE: **STILL PENDING**
- NAD injection 100mg/mL FORMULARY_PENDING / sourcing: **STILL PENDING**
- Tretinoin 0.025% / 0.05% / 0.1% FORMULARY_PENDING: **STILL PENDING**
- Other locked FORMULARY/SOURCING_PENDING products: **STILL PENDING**
- FUTURE_HIDDEN products (do not activate): **STILL PENDING**

## Final report

```
GEN_CPS_CHECKED: 15 / 15
PAIRING_VERIFIED: 0
PAIRING_INCOMPLETE: 5
PAIRING_INCORRECT: 2
PAIRING_MISSING: 7
PRICE_MISMATCH: 0
UNABLE_TO_VERIFY: 1
WEBSITE_VARIANTS_VERIFIED: 0 / 23
genPairingVerified_TRUE: 0
genPairingVerified_FALSE: 23
ROUTING_READY: 0
GEN_PAIRING_PENDING: 23
FORMULARY_PENDING: 14
FUTURE_HIDDEN: 51
BLOCKED: 15
TIR_CREATE_x8_STILL_PENDING: YES
ESTRADIOL_CREATE_x4_STILL_PENDING: YES
NAD_r85_CREATE_STILL_PENDING: YES
NAD_INJECTION_SOURCING_STILL_PENDING: YES
TRETINOIN_SOURCING_STILL_PENDING: YES
GEN_MODIFIED: NO
FORMULARY_PAIRINGS_MODIFIED: NO
REAL_GEN_ORDERS: 0
WEBSITE_PUBLISHED: NO
CUTOVER: OFF
LEGACY_B6_STOREFRONT: UNCHANGED
PR_19: OPEN / NOT MERGED
REGISTRY_UPDATED: NO — zero PAIRING_VERIFIED
APPLY_PAIRING_VERIFICATION_FLIPPED: 0
```

**STOP.** Do not publish. Do not enable cutover. Do not merge PR #19. Do not proceed to GEN create phase yet.
