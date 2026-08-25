# MBM GEN Pairing Verification Checklist

> **Manual owner verification only.** Do not set `genPairingVerified=true` from name, price, title, or `clientProductId` existence. Verification means the exact intended medication/formulation is attached in GEN.

- Variants with GEN `clientProductId`: **23**
- Unique GEN client products to verify: **15**
- `genPairingVerified` true: **0**
- `genPairingVerified` false: **23**
- Cutover: **OFF** · Real GEN orders: **OFF**

Grouped by GEN client product so each GEN object is verified once.

---

## 1. Minoxidil → `BboYS4a2Uj7APetrFo6W`

| Field | Value |
|---|---|
| Website family | Minoxidil (`minoxidil`) |
| GEN product name | Hair Loss – Dual Combo (Finasteride/Minoxidil) |
| GEN clientProductId | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_BboYS4a2Uj7APetrFo6W` |
| Expected website price | 79 |
| Current `genPairingVerified` | `False` |

### Website variant(s)

| websiteVariantId | Label | Price | routingStatus |
|---|---|---|---|
| `minoxidil-fin-minox-0.1-5` | Finasteride/Minoxidil 0.1%/5% | 79 | GEN_PAIRING_PENDING |

### Expected formulary pairing(s)

| Row | Medication | Strength | Form | Package | Pharmacy |
|---:|---|---|---|---|---|
| 129 | FINASTERIDE/MINOXIDIL (PER ML) 0.1/5 % | 0.1/5 % | Foam | 1 ml | Vios |

### Owner verification

- [ ] **EXACT PAIRING CONFIRMED IN GEN**
- [ ] **PAIRING INCORRECT**
- Notes: ________________________________

After confirmation: add this `genClientProductId` to `src/data/websiteFamilies/pairingVerificationRegistry.ts` (do not flip flags by editing unrelated product fields).

---

## 2. NAD+ → `FVwkzvQqWIZRNAwbslGw`

| Field | Value |
|---|---|
| Website family | NAD+ (`nad`) |
| GEN product name | NAD + Nasal Spray |
| GEN clientProductId | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_FVwkzvQqWIZRNAwbslGw` |
| Expected website price | 79 |
| Current `genPairingVerified` | `False` |

### Website variant(s)

| websiteVariantId | Label | Price | routingStatus |
|---|---|---|---|
| `nad-nasal-r84` | Nasal Spray · NAD+ 50mg/ml · 15ml | 79 | GEN_PAIRING_PENDING |

### Expected formulary pairing(s)

| Row | Medication | Strength | Form | Package | Pharmacy |
|---:|---|---|---|---|---|
| 84 | NAD+ 50mg/ml | 50mg/ml | Nasal Spray | 15ml | St Luke |

### Owner verification

- [ ] **EXACT PAIRING CONFIRMED IN GEN**
- [ ] **PAIRING INCORRECT**
- Notes: ________________________________

After confirmation: add this `genClientProductId` to `src/data/websiteFamilies/pairingVerificationRegistry.ts` (do not flip flags by editing unrelated product fields).

---

## 3. Progesterone → `5dGkjdpLP7DkKKE2iVxh`

| Field | Value |
|---|---|
| Website family | Progesterone (`progesterone`) |
| GEN product name | Women's Hormones (HRT) – Progesterone |
| GEN clientProductId | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_5dGkjdpLP7DkKKE2iVxh` |
| Expected website price | 29 |
| Current `genPairingVerified` | `False` |

### Website variant(s)

| websiteVariantId | Label | Price | routingStatus |
|---|---|---|---|
| `prog-ir-r41` | Progesterone IR | 29 | GEN_PAIRING_PENDING |
| `prog-ir-r42` | Progesterone IR | 29 | GEN_PAIRING_PENDING |
| `prog-ir-r43` | Progesterone IR | 29 | GEN_PAIRING_PENDING |
| `prog-ir-r44` | Progesterone IR | 29 | GEN_PAIRING_PENDING |
| `prog-ir-r45` | Progesterone IR | 29 | GEN_PAIRING_PENDING |
| `prog-ir-r46` | Progesterone IR | 29 | GEN_PAIRING_PENDING |
| `prog-ir-r47` | Progesterone IR | 29 | GEN_PAIRING_PENDING |
| `prog-ir-r48` | Progesterone IR | 29 | GEN_PAIRING_PENDING |
| `prog-ir-r49` | Progesterone IR | 29 | GEN_PAIRING_PENDING |

### Expected formulary pairing(s)

| Row | Medication | Strength | Form | Package | Pharmacy |
|---:|---|---|---|---|---|
| 41 | PROGESTERONE 100MG CAPSULE 100mg | 100mg | Capsule | 1 mg | Vios |
| 42 | PROGESTERONE 200MG CAPSULE 200mg | 200mg | Capsule | 1 mg | Vios |
| 43 | PROGESTERONE 50MG CAPSULE 50mg | 50mg | Capsule | 1 mg | Vios |
| 44 | PROGESTERONE IR 100 MG | 100 MG | Capsule | 1 each | Vios |
| 45 | PROGESTERONE IR 150 MG | 150 MG | Capsule | 1 each | Vios |
| 46 | PROGESTERONE IR 200 MG | 200 MG | Capsule | 1 each | Vios |
| 47 | PROGESTERONE IR (DYE-FREE)(LACTOSE-FREE) (M NEW) 200MG | 200MG | Capsule | 1 each | Vios |
| 48 | PROGESTERONE IR 300 MG | 300 MG | Capsule | 1 each | Vios |
| 49 | PROGESTERONE IR 400 MG | 400 MG | Capsule | 1 each | Vios |

### Owner verification

- [ ] **EXACT PAIRING CONFIRMED IN GEN**
- [ ] **PAIRING INCORRECT**
- Notes: ________________________________

After confirmation: add this `genClientProductId` to `src/data/websiteFamilies/pairingVerificationRegistry.ts` (do not flip flags by editing unrelated product fields).

---

## 4. Semaglutide → `5F8jESeVeXcpkLU5rrdK`

| Field | Value |
|---|---|
| Website family | Semaglutide (`semaglutide`) |
| GEN product name | SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP |
| GEN clientProductId | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_5F8jESeVeXcpkLU5rrdK` |
| Expected website price | 149 |
| Current `genPairingVerified` | `False` |

### Website variant(s)

| websiteVariantId | Label | Price | routingStatus |
|---|---|---|---|
| `sem-membership` | SEMAGLUTIDE COMPOUND — ANY DOSE Membership | 149 | GEN_PAIRING_PENDING |

### Expected formulary pairing(s)

| Row | Medication | Strength | Form | Package | Pharmacy |
|---:|---|---|---|---|---|
| 2 | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | 1mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 3 | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | 1mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 4 | SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) | 2mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 5 | SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) | 2mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 6 | SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) | 4mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 7 | SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) | 4mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 8 | SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) | 6mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 9 | SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) | 6mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 10 | SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) | 10mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 11 | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | 10mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |

### Owner verification

- [ ] **EXACT PAIRING CONFIRMED IN GEN**
- [ ] **PAIRING INCORRECT**
- Notes: ________________________________

After confirmation: add this `genClientProductId` to `src/data/websiteFamilies/pairingVerificationRegistry.ts` (do not flip flags by editing unrelated product fields).

---

## 5. Semaglutide → `MkDIUw0NcJB7YL2pNzYW`

| Field | Value |
|---|---|
| Website family | Semaglutide (`semaglutide`) |
| GEN product name | Semaglutide Injection — Any Dose (B12) |
| GEN clientProductId | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_MkDIUw0NcJB7YL2pNzYW` |
| Expected website price | 89–119 |
| Current `genPairingVerified` | `False` |

### Website variant(s)

| websiteVariantId | Label | Price | routingStatus |
|---|---|---|---|
| `sem-b12-any-dose` | Any Dose · Vitamin B12 | 89–119 | GEN_PAIRING_PENDING |

### Expected formulary pairing(s)

| Row | Medication | Strength | Form | Package | Pharmacy |
|---:|---|---|---|---|---|
| 3 | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | 1mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 5 | SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) | 2mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 7 | SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) | 4mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 9 | SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) | 6mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 11 | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | 10mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |

### Owner verification

- [ ] **EXACT PAIRING CONFIRMED IN GEN**
- [ ] **PAIRING INCORRECT**
- Notes: ________________________________

After confirmation: add this `genClientProductId` to `src/data/websiteFamilies/pairingVerificationRegistry.ts` (do not flip flags by editing unrelated product fields).

---

## 6. Semaglutide → `wQK2JsFnh7oFBf3Lag4n`

| Field | Value |
|---|---|
| Website family | Semaglutide (`semaglutide`) |
| GEN product name | Semaglutide Injection — Any Dose (Glycine) |
| GEN clientProductId | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_wQK2JsFnh7oFBf3Lag4n` |
| Expected website price | 89–119 |
| Current `genPairingVerified` | `False` |

### Website variant(s)

| websiteVariantId | Label | Price | routingStatus |
|---|---|---|---|
| `sem-glycine-any-dose` | Any Dose · Glycine | 89–119 | GEN_PAIRING_PENDING |

### Expected formulary pairing(s)

| Row | Medication | Strength | Form | Package | Pharmacy |
|---:|---|---|---|---|---|
| 2 | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | 1mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 4 | SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) | 2mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 6 | SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) | 4mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 8 | SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) | 6mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 10 | SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) | 10mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |

### Owner verification

- [ ] **EXACT PAIRING CONFIRMED IN GEN**
- [ ] **PAIRING INCORRECT**
- Notes: ________________________________

After confirmation: add this `genClientProductId` to `src/data/websiteFamilies/pairingVerificationRegistry.ts` (do not flip flags by editing unrelated product fields).

---

## 7. Semaglutide → `34I2X8MpVZf3AQTff3bo`

| Field | Value |
|---|---|
| Website family | Semaglutide (`semaglutide`) |
| GEN product name | Semaglutide Injection — High (B12) |
| GEN clientProductId | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_34I2X8MpVZf3AQTff3bo` |
| Expected website price | 109–119 |
| Current `genPairingVerified` | `False` |

### Website variant(s)

| websiteVariantId | Label | Price | routingStatus |
|---|---|---|---|
| `sem-b12-high` | High · Vitamin B12 | 109–119 | GEN_PAIRING_PENDING |

### Expected formulary pairing(s)

| Row | Medication | Strength | Form | Package | Pharmacy |
|---:|---|---|---|---|---|
| 9 | SEMAGLUTIDE + VITAMIN B12 6MG/0.5MG/ML (1ML VIAL) | 6mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 11 | SEMAGLUTIDE + VITAMIN B12 10MG/0.5MG/ML (1ML VIAL) | 10mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |

### Owner verification

- [ ] **EXACT PAIRING CONFIRMED IN GEN**
- [ ] **PAIRING INCORRECT**
- Notes: ________________________________

After confirmation: add this `genClientProductId` to `src/data/websiteFamilies/pairingVerificationRegistry.ts` (do not flip flags by editing unrelated product fields).

---

## 8. Semaglutide → `sssEk3FDY4LFbQYGQsLx`

| Field | Value |
|---|---|
| Website family | Semaglutide (`semaglutide`) |
| GEN product name | Semaglutide Injection — High (Glycine) |
| GEN clientProductId | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_sssEk3FDY4LFbQYGQsLx` |
| Expected website price | 109–119 |
| Current `genPairingVerified` | `False` |

### Website variant(s)

| websiteVariantId | Label | Price | routingStatus |
|---|---|---|---|
| `sem-glycine-high` | High · Glycine | 109–119 | GEN_PAIRING_PENDING |

### Expected formulary pairing(s)

| Row | Medication | Strength | Form | Package | Pharmacy |
|---:|---|---|---|---|---|
| 8 | SEMAGLUTIDE + GLYCINE 6MG/0.5MG/ML (1ML VIAL) | 6mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 10 | SEMAGLUTIDE + GLYCINE 10MG/0.5MG/ML (1ML VIAL) | 10mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |

### Owner verification

- [ ] **EXACT PAIRING CONFIRMED IN GEN**
- [ ] **PAIRING INCORRECT**
- Notes: ________________________________

After confirmation: add this `genClientProductId` to `src/data/websiteFamilies/pairingVerificationRegistry.ts` (do not flip flags by editing unrelated product fields).

---

## 9. Semaglutide → `BLf8inX395YNc7WPCD4O`

| Field | Value |
|---|---|
| Website family | Semaglutide (`semaglutide`) |
| GEN product name | Semaglutide Injection — Mid (B12) |
| GEN clientProductId | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_BLf8inX395YNc7WPCD4O` |
| Expected website price | 109 |
| Current `genPairingVerified` | `False` |

### Website variant(s)

| websiteVariantId | Label | Price | routingStatus |
|---|---|---|---|
| `sem-b12-mid` | Mid · Vitamin B12 | 109 | GEN_PAIRING_PENDING |

### Expected formulary pairing(s)

| Row | Medication | Strength | Form | Package | Pharmacy |
|---:|---|---|---|---|---|
| 7 | SEMAGLUTIDE + VITAMIN B12 4MG/0.5MG/ML (1ML VIAL) | 4mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |

### Owner verification

- [ ] **EXACT PAIRING CONFIRMED IN GEN**
- [ ] **PAIRING INCORRECT**
- Notes: ________________________________

After confirmation: add this `genClientProductId` to `src/data/websiteFamilies/pairingVerificationRegistry.ts` (do not flip flags by editing unrelated product fields).

---

## 10. Semaglutide → `CjqOUbPuGPZzxephqRou`

| Field | Value |
|---|---|
| Website family | Semaglutide (`semaglutide`) |
| GEN product name | Semaglutide Injection — Mid (Glycine) |
| GEN clientProductId | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_CjqOUbPuGPZzxephqRou` |
| Expected website price | 109 |
| Current `genPairingVerified` | `False` |

### Website variant(s)

| websiteVariantId | Label | Price | routingStatus |
|---|---|---|---|
| `sem-glycine-mid` | Mid · Glycine | 109 | GEN_PAIRING_PENDING |

### Expected formulary pairing(s)

| Row | Medication | Strength | Form | Package | Pharmacy |
|---:|---|---|---|---|---|
| 6 | SEMAGLUTIDE + GLYCINE 4MG/0.5MG/ML (1ML VIAL) | 4mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |

### Owner verification

- [ ] **EXACT PAIRING CONFIRMED IN GEN**
- [ ] **PAIRING INCORRECT**
- Notes: ________________________________

After confirmation: add this `genClientProductId` to `src/data/websiteFamilies/pairingVerificationRegistry.ts` (do not flip flags by editing unrelated product fields).

---

## 11. Semaglutide → `SkqQHmsc0WdsbK9vmV1y`

| Field | Value |
|---|---|
| Website family | Semaglutide (`semaglutide`) |
| GEN product name | Semaglutide Injection — Starting / Low (B12) |
| GEN clientProductId | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SkqQHmsc0WdsbK9vmV1y` |
| Expected website price | 89–99 |
| Current `genPairingVerified` | `False` |

### Website variant(s)

| websiteVariantId | Label | Price | routingStatus |
|---|---|---|---|
| `sem-b12-starting-low` | Starting / Low · Vitamin B12 | 89–99 | GEN_PAIRING_PENDING |

### Expected formulary pairing(s)

| Row | Medication | Strength | Form | Package | Pharmacy |
|---:|---|---|---|---|---|
| 3 | SEMAGLUTIDE + VITAMIN B12 1MG/0.5MG/ML (1ML VIAL) | 1mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 5 | SEMAGLUTIDE + VITAMIN B12 2MG/0.5MG/ML (1ML VIAL) | 2mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |

### Owner verification

- [ ] **EXACT PAIRING CONFIRMED IN GEN**
- [ ] **PAIRING INCORRECT**
- Notes: ________________________________

After confirmation: add this `genClientProductId` to `src/data/websiteFamilies/pairingVerificationRegistry.ts` (do not flip flags by editing unrelated product fields).

---

## 12. Semaglutide → `tk2GW39OGr7JX4MCCoJP`

| Field | Value |
|---|---|
| Website family | Semaglutide (`semaglutide`) |
| GEN product name | Semaglutide Injection — Starting / Low (Glycine) |
| GEN clientProductId | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_tk2GW39OGr7JX4MCCoJP` |
| Expected website price | 89–99 |
| Current `genPairingVerified` | `False` |

### Website variant(s)

| websiteVariantId | Label | Price | routingStatus |
|---|---|---|---|
| `sem-glycine-starting-low` | Starting / Low · Glycine | 89–99 | GEN_PAIRING_PENDING |

### Expected formulary pairing(s)

| Row | Medication | Strength | Form | Package | Pharmacy |
|---:|---|---|---|---|---|
| 2 | SEMAGLUTIDE + GLYCINE 1MG/0.5MG/ML (1ML VIAL) | 1mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |
| 4 | SEMAGLUTIDE + GLYCINE 2MG/0.5MG/ML (1ML VIAL) | 2mg/0.5mg/mL | Vial | 1mL | Dirx-Hub |

### Owner verification

- [ ] **EXACT PAIRING CONFIRMED IN GEN**
- [ ] **PAIRING INCORRECT**
- Notes: ________________________________

After confirmation: add this `genClientProductId` to `src/data/websiteFamilies/pairingVerificationRegistry.ts` (do not flip flags by editing unrelated product fields).

---

## 13. Tirzepatide → `E3MXZeeR01QROCuTLRLE`

| Field | Value |
|---|---|
| Website family | Tirzepatide (`tirzepatide`) |
| GEN product name | TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP |
| GEN clientProductId | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_E3MXZeeR01QROCuTLRLE` |
| Expected website price | 275 |
| Current `genPairingVerified` | `False` |

### Website variant(s)

| websiteVariantId | Label | Price | routingStatus |
|---|---|---|---|
| `tir-membership` | TIRZEPATIDE COMPOUND — ANY DOSE Membership | 275 | GEN_PAIRING_PENDING |

### Expected formulary pairing(s)

| Row | Medication | Strength | Form | Package | Pharmacy |
|---:|---|---|---|---|---|
| 13 | TIRZEPATIDE + GLYCINE 5MG/0.5MG/ML (2ML VIAL) | 5mg/0.5mg/mL | Vial | 2mL | Dirx-Hub |
| 14 | TIRZEPATIDE + VITAMIN B12 5MG/0.5MG/ML (2ML VIAL) | 5mg/0.5mg/mL | Vial | 2mL | Dirx-Hub |
| 15 | TIRZEPATIDE + GLYCINE 10MG/0.5MG/ML (2ML VIAL) | 10mg/0.5mg/mL | Vial | 2mL | Dirx-Hub |
| 16 | TIRZEPATIDE + VITAMIN B12 10MG/0.5MG/ML (2ML VIAL) | 10mg/0.5mg/mL | Vial | 2mL | Dirx-Hub |
| 17 | TIRZEPATIDE + GLYCINE 15MG/0.5MG/ML (2ML VIAL) | 15mg/0.5mg/mL | Vial | 2mL | Dirx-Hub |
| 18 | TIRZEPATIDE + VITAMIN B12 15MG/0.5MG/ML (2ML VIAL) | 15mg/0.5mg/mL | Vial | 2mL | Dirx-Hub |
| 19 | TIRZEPATIDE + GLYCINE 20MG/0.5MG/ML (2ML VIAL) | 20mg/0.5mg/mL | Vial | 2mL | Dirx-Hub |
| 20 | TIRZEPATIDE + VITAMIN B12 20MG/0.5MG/ML (2ML VIAL) | 20mg/0.5mg/mL | Vial | 2mL | Dirx-Hub |
| 21 | TIRZEPATIDE + GLYCINE 25MG/0.5MG/ML (2ML VIAL) | 25mg/0.5mg/mL | Vial | 2mL | Dirx-Hub |
| 22 | TIRZEPATIDE + VITAMIN B12 25MG/0.5MG/ML (2ML VIAL) | 25mg/0.5mg/mL | Vial | 2mL | Dirx-Hub |
| 23 | TIRZEPATIDE + GLYCINE 30MG/0.5MG/ML (2ML VIAL) | 30mg/0.5mg/mL | Vial | 2mL | Dirx-Hub |
| 24 | TIRZEPATIDE + VITAMIN B12 30MG/0.5MG/ML (2ML VIAL) | 30mg/0.5mg/mL | Vial | 2mL | Dirx-Hub |

### Owner verification

- [ ] **EXACT PAIRING CONFIRMED IN GEN**
- [ ] **PAIRING INCORRECT**
- Notes: ________________________________

After confirmation: add this `genClientProductId` to `src/data/websiteFamilies/pairingVerificationRegistry.ts` (do not flip flags by editing unrelated product fields).

---

## 14. Wolverine / BPC-TB → `iJtyig611AZEDBGdvRd9`

| Field | Value |
|---|---|
| Website family | Wolverine / BPC-TB (`wolverine-bpc-tb`) |
| GEN product name | BPC-157/TB500 |
| GEN clientProductId | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_iJtyig611AZEDBGdvRd9` |
| Expected website price | 159 |
| Current `genPairingVerified` | `False` |

### Website variant(s)

| websiteVariantId | Label | Price | routingStatus |
|---|---|---|---|
| `wolverine-injection` | Injection | 159 | GEN_PAIRING_PENDING |

### Expected formulary pairing(s)

| Row | Medication | Strength | Form | Package | Pharmacy |
|---:|---|---|---|---|---|
| 103 | BPC-157/TB500 3mg/3mg/mL | 3mg/3mg/mL | — | 5ML | Greenwich Pharmacy |

### Owner verification

- [ ] **EXACT PAIRING CONFIRMED IN GEN**
- [ ] **PAIRING INCORRECT**
- Notes: ________________________________

After confirmation: add this `genClientProductId` to `src/data/websiteFamilies/pairingVerificationRegistry.ts` (do not flip flags by editing unrelated product fields).

---

## 15. Wolverine / BPC-TB → `omhh3NabouO8AsNR5tkD`

| Field | Value |
|---|---|
| Website family | Wolverine / BPC-TB (`wolverine-bpc-tb`) |
| GEN product name | Wolverine – BPC-157 + TB-500 Recovery Protocol |
| GEN clientProductId | `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_omhh3NabouO8AsNR5tkD` |
| Expected website price | 29 |
| Current `genPairingVerified` | `False` |

### Website variant(s)

| websiteVariantId | Label | Price | routingStatus |
|---|---|---|---|
| `wolverine-capsule` | Capsules | 29 | GEN_PAIRING_PENDING |

### Expected formulary pairing(s)

| Row | Medication | Strength | Form | Package | Pharmacy |
|---:|---|---|---|---|---|
| 104 | BPC-157/TB500 capsules 500MCG/500MCG | 500mcg/500mcg | — | 1EA | Greenwich Pharmacy |

### Owner verification

- [ ] **EXACT PAIRING CONFIRMED IN GEN**
- [ ] **PAIRING INCORRECT**
- Notes: ________________________________

After confirmation: add this `genClientProductId` to `src/data/websiteFamilies/pairingVerificationRegistry.ts` (do not flip flags by editing unrelated product fields).

---

## After verification

1. Update checklist boxes above.
2. Add verified GEN clientProductIds to `pairingVerificationRegistry.ts`.
3. Use `applyPairingVerification` to set `genPairingVerified=true` only on matching website variants.
4. Status may move toward `ROUTING_READY` only when pairing is verified **and** other gates allow — cutover still OFF.

**Do not auto-verify. Do not publish. Do not enable real GEN orders in this phase.**
