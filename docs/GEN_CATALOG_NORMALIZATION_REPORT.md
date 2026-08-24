# GEN Catalog Normalization Report (GEN-CATALOG-1B)

**Generated:** 2026-08-24T06:02:46Z
**Mode:** READ-ONLY (comparison-only normalization — no GEN renames/writes)

## 1. GEN product field capture (254)

Captured per product when present in list payload:
`clientProductId`, `productId`, `name`, `displayName`, `description`, `pricing.amount` (customerPrice),
`storefrontEligible`, `categories`, `formularyPairingCount`, formulary medication/pharmacy rows.

**Often null/absent on list:** `showPatient`, `status`, `displayDescription` — noted in JSON `field_coverage_notes`.

### Naming normalization rules (comparison only)

| Input pattern | Normalized compound |
|---|---|
| GLP-1 | Semaglutide |
| GLP-1/GIP or GLP-2 (workbook TIR plans) | Tirzepatide |
| Tirzepitide typo | Tirzepatide |
| Epitalon | Epithalon |

### Category family counts (GEN)

| Family | Count |
|---|---:|
| Weight Management | 77 |
| Recovery / Performance | 51 |
| Other / Unclassified | 47 |
| Women's Hormone Therapy | 23 |
| Sexual Wellness | 21 |
| Longevity / Cognitive | 19 |
| Prescription Skin & Hair | 10 |
| Other / Metabolic-AntiInfective | 6 |

### Compound family counts (GEN)

| Compound | Count |
|---|---:|
| unknown | 54 |
| semaglutide | 44 |
| tirzepatide | 28 |
| bpc-157 | 16 |
| nad+ | 10 |
| testosterone | 7 |
| sildenafil | 7 |
| ivermectin | 5 |
| aod-9604 | 5 |
| ipamorelin | 5 |
| ghk-cu | 5 |
| sermorelin | 5 |
| tadalafil | 4 |
| tesamorelin | 4 |
| pt-141 | 4 |
| progesterone | 4 |
| 5-amino-1mq | 3 |
| finasteride | 3 |
| tretinoin | 3 |
| minoxidil | 3 |
| glutathione | 3 |
| dsip | 2 |
| epithalon | 2 |
| ll-37 | 2 |
| metformin | 2 |
| mots-c | 2 |
| pinealon | 2 |
| selank | 2 |
| scream cream | 2 |
| semax | 2 |
| tb-500 | 2 |
| thymosin | 2 |
| estradiol | 2 |
| oxytocin | 2 |
| dihexa | 1 |
| cjc | 1 |
| kpv | 1 |
| liraglutide | 1 |
| retatrutide | 1 |
| vardenafil | 1 |

## 2. Master workbook families (253)

| Family | Count |
|---|---:|
| Weight Management | 76 |
| Recovery / Performance | 52 |
| Other / Unclassified | 47 |
| Women's Hormone Therapy | 23 |
| Sexual Wellness | 21 |
| Longevity / Cognitive | 19 |
| Prescription Skin & Hair | 10 |
| Other / Metabolic-AntiInfective | 5 |

## 3. Duplicate / parent-product analysis (GEN 254)

| Parent classification | Count |
|---|---:|
| FUTURE_KEEP_HIDDEN | 189 |
| REVIEW_REQUIRED | 34 |
| KEEP_PRIMARY | 28 |
| DEACTIVATE_CANDIDATE | 3 |

### MERGE_CANDIDATE / DEACTIVATE_CANDIDATE (GEN)

| Name | productId | Class | Conflicts | Owner decision |
|---|---|---|---|---|
| Accelerate & Thrive | `8u8eyuwwVUcf0DzsmZJb` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol, Elite Body Recomp | Choose primary parent vs merge/hide |
| Add Sync | `t1JOySXRCJBAeXbkEXW4` | DEACTIVATE_CANDIDATE | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, BAM-15 Mitochondrial Uncoupler Protocol, Elite Body Recomp | Confirm deactivate (Metformin / junk) — no write this phase |
| Elite Body Recomp | `Zd3nud61fajtnKM8EHae` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Hormone + Intimacy | `atay7RC5bpe5rUqu7sPy` | REVIEW_REQUIRED | Kisspeptin-10 Reproductive Hormone Protocol, Men's Hormones (TRT) – Estrogen Management (Anastrozole), Men's Hormones (TRT) – Fertility / HPTA Support (Enclomiphene), Men's Hormones – Fertility (Clomiphene) | Choose primary parent vs merge/hide |
| IGF-1 LR3 | `17q5TysuAXRBu0rhqmxu` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Kisspeptin-10 | `u7HM54YdQSXpKjXII4uU` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Lean & Energized | `QkSaI34UCMMQC3KM5Tew` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Lean & Ready | `Bj0FZRaMRMbiNRGhpzQj` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Lean & Timeless | `I3igjBNEnlkC3yuZNpPJ` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Men's Hormones – Fertility (Clomiphene) | `iF24F3ACZ8Sr9nkX5Jll` | REVIEW_REQUIRED | Hormone + Intimacy, Kisspeptin-10 Reproductive Hormone Protocol, Men's Hormones (TRT) – Estrogen Management (Anastrozole), Men's Hormones (TRT) – Fertility / HPTA Support (Enclomiphene) | Choose primary parent vs merge/hide |
| Men's Hormones – Fertility (HCG) | `k8jaUtoBPlPpdOjERi1m` | REVIEW_REQUIRED | Hormone + Intimacy, Kisspeptin-10 Reproductive Hormone Protocol, Men's Hormones (TRT) – Estrogen Management (Anastrozole), Men's Hormones (TRT) – Fertility / HPTA Support (Enclomiphene) | Choose primary parent vs merge/hide |
| Men's Hormones – PCT / Estrogen Blocker (Tamoxifen) | `c6rOubV7WuNwZ4ZfyBng` | REVIEW_REQUIRED | Hormone + Intimacy, Kisspeptin-10 Reproductive Hormone Protocol, Men's Hormones (TRT) – Estrogen Management (Anastrozole), Men's Hormones (TRT) – Fertility / HPTA Support (Enclomiphene) | Choose primary parent vs merge/hide |
| Men's Hormones (TRT) – Estrogen Management (Anastrozole) | `uGTRP7x1JsFfBWD6bqCS` | REVIEW_REQUIRED | Hormone + Intimacy, Kisspeptin-10 Reproductive Hormone Protocol, Men's Hormones (TRT) – Fertility / HPTA Support (Enclomiphene), Men's Hormones – Fertility (Clomiphene) | Choose primary parent vs merge/hide |
| Men's Hormones (TRT) – Fertility / HPTA Support (Enclomiphene) | `NYxlwOZWsCpf8iEoJz2C` | REVIEW_REQUIRED | Hormone + Intimacy, Kisspeptin-10 Reproductive Hormone Protocol, Men's Hormones (TRT) – Estrogen Management (Anastrozole), Men's Hormones – Fertility (Clomiphene) | Choose primary parent vs merge/hide |
| Mens HRT/TRT In-Clinic Approval | `Dbg1d1sNMNesunEW4jrV` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Metformin (Metabolic / Weight Support) | `aWmuj8jNPv0S1vsLaMnN` | DEACTIVATE_CANDIDATE |  | Confirm deactivate (Metformin / junk) — no write this phase |
| Metformin / Topiramate | `XHU8xCrpXQmFzJGce7d7` | DEACTIVATE_CANDIDATE |  | Confirm deactivate (Metformin / junk) — no write this phase |
| PE-22-28 | `neCvRWepcSZ0q1llvTbM` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Peak Performance | `bdNMiPq0m4xsW4dI1OaM` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Peptides – Kisspeptin-10 | `WZWJ4qbjsdAZKFI2Csht` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Performance – Stanozolol | `BKkc62x29WwHyif4GrQ0` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Power & Recovery | `b3esGoVNqthSbXgbZ8Qf` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Pregnyl - HCG (Merck) | `1RKh7XAuwA2DM4fZ6exN` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Sculpt & Perform | `ec2MaascBt5fyIrrZYZC` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Slim & Sensational | `3HsBzXRECxbcK5J7YOlV` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Slim & Timeless | `OiT0J262CQhFOfVCLQg8` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Thyroid Support (BioThyroid) | `ubZ9icHlj8PVxaPWN8DT` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Topiramate+Bupropion+Yohimbine | `YRuOnlfY8zqhSDElCYh3` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Total Transformation | `TaiQzxr0U8439ANsQQWz` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Trimix T106 (Papaverine +Phentolamine +PGE) | `nKniwgJIqwyBvDQgxLpW` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Vitality & Longevity | `fIc1UhU0TMJ5w4irrEjw` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Wellness – Low-Dose Naltrexone (LDN) Starter | `7lI1GRxVr7sYLOsLLAHM` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Wellness – Low-Dose Naltrexone (LDN) Therapeutic | `Zv1Nrpfwy6CjjURO9A1j` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |
| Wellness – MIC-B12 (Lipotropic / Fat Burn) | `Ia4ee35szTk7xk02eBQp` | REVIEW_REQUIRED | Wellness – MIC-B12 (Lipotropic / Fat Burn) | Choose primary parent vs merge/hide |
| Wellness – MIC-B12 (Lipotropic / Fat Burn) | `wUSwuO9oB42LdW4ZfaCK` | REVIEW_REQUIRED | Wellness – MIC-B12 (Lipotropic / Fat Burn) | Choose primary parent vs merge/hide |
| Womens HRT GFE In-Clinic Approval | `5sAGuzAbWb0limbh0uwz` | REVIEW_REQUIRED | ARA-290 Neuroprotection & Nerve Repair Protocol, Accelerate & Thrive, Add Sync, BAM-15 Mitochondrial Uncoupler Protocol | Choose primary parent vs merge/hide |

## 4. Confirmed formulary pairings first (29)

These were mapped to master rows by `productId` before title-only inference.

Master rows with confirmed live formulary link: **18**

| Master product | Classification | Live medication | Pharmacy |
|---|---|---|---|
| AOD-9604 | EXISTING_NEEDS_UPDATE | AOD 9604 | Optimal Balance Pharmacy |
| AOD-9604 / MOTS-C / Tesamorelin Metabolic Triple Protocol | EXISTING_NEEDS_UPDATE | AOD 9604 / MOTS-C / Tesamorelin / Ipamorelin | Optimal Balance Pharmacy |
| AOD-9604/MOTS-C | EXISTING_NEEDS_UPDATE | AOD 9604 | Optimal Balance Pharmacy |
| BPC-157 | EXISTING_NEEDS_UPDATE | BPC-157 | Optimal Balance Pharmacy |
| BPC-157 + GHK-Cu + KPV + TB-500 Comprehensive Recovery Protocol | EXISTING_NEEDS_UPDATE | BPC-157 / GHK-CU / KPV / TB500 | Greenwich Pharmacy |
| BPC-157/TB500 | EXISTING_NEEDS_UPDATE | BPC-157 / TB500 | Greenwich Pharmacy |
| GHK-Cu | EXISTING_NEEDS_UPDATE | GHK-CU | Greenwich Pharmacy |
| GLP-1 Weight Loss – Semaglutide (High Dose) | REVIEW_REQUIRED | Semaglutide + Vitamin B12 | Dirx-Hub |
| GLP-1 Weight Loss – Semaglutide (Low Dose) | REVIEW_REQUIRED | Semaglutide / Pyridoxine | Epiq Scripts |
| GLP-1 Weight Loss Membership – Semaglutide / B12 (Any Dose) | REVIEW_REQUIRED | Semaglutide B12 ( , , ) | Dirx-Hub |
| GLP-1 Weight Loss Membership – Semaglutide / Glycine (Any Dose) | REVIEW_REQUIRED | Semaglutide + Glycine | Dirx-Hub |
| GLP-1 Weight Loss Plan – Semaglutide / B12 (High Dose) | REVIEW_REQUIRED | Semaglutide + Vitamin B12 | Dirx-Hub |
| GLP-1 Weight Loss Plan – Semaglutide / B12 (Starting Dose) | REVIEW_REQUIRED | Semaglutide + Vitamin B12 | Dirx-Hub |
| GLP-1 Weight Loss Plan – Semaglutide / Glycine (High Dose) | REVIEW_REQUIRED | Semaglutide + Glycine | Dirx-Hub |
| GLP-1 Weight Loss Plan – Semaglutide / Glycine (Mid Dose) | REVIEW_REQUIRED | Semaglutide + Glycine | Dirx-Hub |
| GLP-1 Weight Loss Plan – Semaglutide / Glycine (Starting Dose) | REVIEW_REQUIRED | Semaglutide + Glycine | Dirx-Hub |
| GLP-1 Weight Loss Plan – Semaglutide + B12 (Starting Dose / Micro-Dose) | REVIEW_REQUIRED | Semaglutide + Vitamin B12 | Dirx-Hub |
| GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (High: 4→6→10mg) | REVIEW_REQUIRED | Semaglutide B12 ( , , ) | Dirx-Hub |

## 5. Semaglutide / Tirzepatide dose ladder

- Semaglutide: **REVIEW**
- Tirzepatide: **REVIEW**

### Live website Semaglutide parents

| Product | Tier | Addon | Classification | productId |
|---|---|---|---|---|
| GLP-1 Weight Loss – Semaglutide (High Dose) | High | unspecified | REVIEW_REQUIRED | `uM0cXePP8e9c5hiMKcRt` |
| GLP-1 Weight Loss – Semaglutide (Low Dose) | Starting / Low | unspecified | REVIEW_REQUIRED | `7UMqZumyeXaWMX9zOPP3` |
| GLP-1 Weight Loss Membership – Semaglutide / B12 (Any Dose) | Any Dose | B12 | REVIEW_REQUIRED | `MkDIUw0NcJB7YL2pNzYW` |
| GLP-1 Weight Loss Membership – Semaglutide / Glycine (Any Dose) | Any Dose | Glycine | REVIEW_REQUIRED | `wQK2JsFnh7oFBf3Lag4n` |
| GLP-1 Weight Loss Plan – Semaglutide / B12 (High Dose) | High | B12 | REVIEW_REQUIRED | `34I2X8MpVZf3AQTff3bo` |
| GLP-1 Weight Loss Plan – Semaglutide / B12 (Starting Dose) | Starting / Low | B12 | REVIEW_REQUIRED | `TL7ikswK0XoNvUvHC1iz` |
| GLP-1 Weight Loss Plan – Semaglutide / Glycine (High Dose) | High | Glycine | REVIEW_REQUIRED | `sssEk3FDY4LFbQYGQsLx` |
| GLP-1 Weight Loss Plan – Semaglutide / Glycine (Mid Dose) | Mid | Glycine | REVIEW_REQUIRED | `CjqOUbPuGPZzxephqRou` |
| GLP-1 Weight Loss Plan – Semaglutide / Glycine (Starting Dose) | Starting / Low | Glycine | REVIEW_REQUIRED | `tk2GW39OGr7JX4MCCoJP` |
| GLP-1 Weight Loss Plan – Semaglutide + B12 (Starting Dose / Micro-Dose) | Starting / Low | B12 | REVIEW_REQUIRED | `SkqQHmsc0WdsbK9vmV1y` |
| GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (High: 4→6→10mg) | 3-Month | unspecified | REVIEW_REQUIRED | `sN2ggSXRJINjElMYTQjf` |

### Tirzepatide notes

Live website TIR parents in workbook: 0.
Future TIR plans present in GEN must remain hidden until owner launch approval.

## 6. Metformin

- `Metformin (Metabolic / Weight Support)` (`aWmuj8jNPv0S1vsLaMnN`) — **DEACTIVATE_CANDIDATE** (no write)
- `Metformin / Topiramate` (`XHU8xCrpXQmFzJGce7d7`) — **DEACTIVATE_CANDIDATE** (no write)

Workbook Metformin rows: **0** (excluded). Classification: **DO NOT ADD**.

## 7. Every REVIEW_REQUIRED master row

Total: **185**

| Product | Exact reason | Conflicting candidates | Owner decision needed |
|---|---|---|---|
| 5-Amino Injectable | Injectable product paired to capsule formulary — form mismatch; reviewBeforeApply=VERIFY FORM/STRENGTH/PACKAGE | 5-Amino-1MQ Metabolic Protocol (Injectable) | Resolve safety/storefront conflict before pairing |
| 5-Amino-1MQ Metabolic & Fat Loss Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| ARA-290 Neuroprotection & Nerve Repair Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Accelerate & Thrive | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Accelerate & Thrive – Tirzepatide + NAD+ Plan | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | GLP-2 Weight Loss – Tirzepatide (Any Dose), GLP-2 Weight Loss – Tirzepatide (High Dose), GLP-2 Weight Loss – Tirzepatide (Low Dose) | Choose exact formulary or leave unpaired/hidden |
| Add Sync | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Anti-Infective – Ivermectin (Oral) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Anti-Infective – Ivermectin Protocol (Oral) | Choose exact formulary or leave unpaired/hidden |
| Anti-Infective – Ivermectin (Topical) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Anti-Infective – Ivermectin Protocol (Topical) | Choose exact formulary or leave unpaired/hidden |
| Anti-Infective – Ivermectin Protocol (Oral) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Anti-Infective – Ivermectin (Oral) | Choose exact formulary or leave unpaired/hidden |
| Anti-Infective – Ivermectin Protocol (Topical) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Anti-Infective – Ivermectin (Topical) | Choose exact formulary or leave unpaired/hidden |
| BAM-15 Mitochondrial Uncoupler Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| CJC-1295 / Ipamorelin Growth Hormone Protocol (Oral / Troche) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| DSIP (Delta Sleep-Inducing Peptide) Sleep Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | DSIP | Choose exact formulary or leave unpaired/hidden |
| Depo-Testosterone (Pfizer) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Men's Hormones (TRT) – Testosterone Hypo Spray, Men's Hormones (TRT) – Testosterone Spray | Choose exact formulary or leave unpaired/hidden |
| Dihexa Cognitive Enhancement Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| ED – Caffeine / Sildenafil (Performance Boost) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | ED – Sildenafil (On-Demand), ED – Sildenafil / Tadalafil Combo, Sildenafil | Choose exact formulary or leave unpaired/hidden |
| ED – Sildenafil (On-Demand) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | ED – Caffeine / Sildenafil (Performance Boost), ED – Sildenafil / Tadalafil Combo, Sildenafil | Choose exact formulary or leave unpaired/hidden |
| ED – Sildenafil / Tadalafil Combo | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | ED – Caffeine / Sildenafil (Performance Boost), ED – Sildenafil (On-Demand), Sildenafil | Choose exact formulary or leave unpaired/hidden |
| ED – Tadalafil (Daily / Low Dose) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Tadalafil, Vardenafil+Tadalafil+Apormorphine | Choose exact formulary or leave unpaired/hidden |
| ED – Tadalafil (On-Demand / High Dose) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Tadalafil, Vardenafil+Tadalafil+Apormorphine | Choose exact formulary or leave unpaired/hidden |
| Elite Body Recomp | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Elite Regenesis | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES; FUTURE workbook row but GEN storefrontEligible=true — must force hidden before launch |  | Resolve safety/storefront conflict before pairing |
| Epitalon Longevity & Anti-Aging Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Epithalon | Choose exact formulary or leave unpaired/hidden |
| Finasteride, Tretinoin, Fluocinolone, VitaminE | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Hair Loss - Minoxdil/Tretinoin/Fluocinolone/Finasteride Spray, Hair Loss – Triple Combo (Finasteride/Minoxidil/Tretinoin) | Choose exact formulary or leave unpaired/hidden |
| GLP-1 Weight Loss Membership – Semaglutide / B12 (Any Dose) | Semaglutide Any Dose parent exists in GEN; workbook NO SAFE MATCH; addonFamily=B12; must pair only to matching formulation family (do not mix B12/Glycine/etc.); current links=['Semaglutide B12 ( , , )', 'Semaglutide B12 ( , , )', 'Semaglutide B12 ( , , )', 'Semaglutide + B12', 'Semaglutide + B12', 'Semaglutide + B12', 'Semaglutide + B12', 'Semaglutide + B12'] | Semaglutide/B12, Semaglutide/B12 (6 Months) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Membership – Semaglutide / Glycine (Any Dose) | Semaglutide Any Dose parent exists in GEN; workbook NO SAFE MATCH; addonFamily=Glycine; must pair only to matching formulation family (do not mix B12/Glycine/etc.); current links=['Semaglutide + Glycine', 'Semaglutide + Glycine', 'Semaglutide + Glycine', 'Semaglutide + Glycine'] |  | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Membership – Semaglutide / L-Carnitine (Any Dose) | Semaglutide Any Dose parent exists in GEN; workbook NO SAFE MATCH; addonFamily=L-Carnitine; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | Semaglutide/L-Carnitine | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide (Any Dose) | Semaglutide Any Dose parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | Lean & Ready – Semaglutide + BPC-157 + AOD-9604 Plan, Ozempic (Semaglutide), The Ultimate Semaglutide Stack | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide (Any Dose) – 3 Month Supply | Semaglutide 3-Month parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | GLP-1 Weight Loss Plan – Semaglutide (High Dose) – 3 Month Supply, GLP-1 Weight Loss Plan – Semaglutide (Mid Dose) – 3 Month Supply, GLP-1 Weight Loss Plan – Semaglutide (Starting Dose) – 3 Month Supply | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide (High Dose / Maintenance) | Semaglutide High parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | GLP-1 Weight Loss – Semaglutide (High Dose), Lean & Ready – Semaglutide + BPC-157 + AOD-9604 Plan, Ozempic (Semaglutide) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide (High Dose) – 3 Month Supply | Semaglutide 3-Month parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | GLP-1 Weight Loss Plan – Semaglutide (Any Dose) – 3 Month Supply, GLP-1 Weight Loss Plan – Semaglutide (Mid Dose) – 3 Month Supply, GLP-1 Weight Loss Plan – Semaglutide (Starting Dose) – 3 Month Supply | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide (Low Dose) | Semaglutide Starting / Low parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | GLP-1 Weight Loss – Semaglutide (Low Dose), Lean & Ready – Semaglutide + BPC-157 + AOD-9604 Plan, Ozempic (Semaglutide) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide (Mid Dose) | Semaglutide Mid parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | Lean & Ready – Semaglutide + BPC-157 + AOD-9604 Plan, Ozempic (Semaglutide), The Ultimate Semaglutide Stack | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide (Mid Dose) – 3 Month Supply | Semaglutide 3-Month parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | GLP-1 Weight Loss Plan – Semaglutide (Any Dose) – 3 Month Supply, GLP-1 Weight Loss Plan – Semaglutide (High Dose) – 3 Month Supply, GLP-1 Weight Loss Plan – Semaglutide (Starting Dose) – 3 Month Supply | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide (Oral Drops / Sublingual) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | GLP-1 Weight Loss Plan – Sublingual Semaglutide Oral Drops (High Dose 8–10mg/4ml), GLP-1 Weight Loss Plan – Sublingual Semaglutide Oral Drops (Mid Dose 4–6mg/4ml), GLP-1 Weight Loss Plan – Sublingual Semaglutide Oral Drops (Starting Dose 2mg/4ml) | Choose exact formulary or leave unpaired/hidden |
| GLP-1 Weight Loss Plan – Semaglutide (Starting Dose) – 3 Month Supply | Semaglutide 3-Month parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | GLP-1 Weight Loss Plan – Semaglutide (Any Dose) – 3 Month Supply, GLP-1 Weight Loss Plan – Semaglutide (High Dose) – 3 Month Supply, GLP-1 Weight Loss Plan – Semaglutide (Mid Dose) – 3 Month Supply | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide + B12 (Starting Dose / Micro-Dose) | Semaglutide Starting / Low parent exists in GEN; workbook NO SAFE MATCH; addonFamily=B12; must pair only to matching formulation family (do not mix B12/Glycine/etc.); current links=['Semaglutide + Vitamin B12'] | GLP-1 Weight Loss Plan – Semaglutide / B12 (Starting Dose), Semaglutide/B12, Semaglutide/B12 (6 Months) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide + Ondansetron (Nausea Support) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES; FUTURE workbook row but GEN storefrontEligible=true — must force hidden before launch |  | Resolve safety/storefront conflict before pairing |
| GLP-1 Weight Loss Plan – Semaglutide / B12 (High Dose) | Semaglutide High parent exists in GEN; workbook NO SAFE MATCH; addonFamily=B12; must pair only to matching formulation family (do not mix B12/Glycine/etc.); current links=['Semaglutide + Vitamin B12'] | Semaglutide/B12, Semaglutide/B12 (6 Months) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide / B12 (Starting Dose) | Semaglutide Starting / Low parent exists in GEN; workbook NO SAFE MATCH; addonFamily=B12; must pair only to matching formulation family (do not mix B12/Glycine/etc.); current links=['Semaglutide + Vitamin B12'] | GLP-1 Weight Loss Plan – Semaglutide + B12 (Starting Dose / Micro-Dose), Semaglutide/B12, Semaglutide/B12 (6 Months) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide / Glycine (High Dose) | Semaglutide High parent exists in GEN; workbook NO SAFE MATCH; addonFamily=Glycine; must pair only to matching formulation family (do not mix B12/Glycine/etc.); current links=['Semaglutide + Glycine'] |  | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide / Glycine (Mid Dose) | Semaglutide Mid parent exists in GEN; workbook NO SAFE MATCH; addonFamily=Glycine; must pair only to matching formulation family (do not mix B12/Glycine/etc.); current links=['Semaglutide + Glycine', 'Semaglutide + Glycine'] |  | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide / Glycine (Starting Dose) | Semaglutide Starting / Low parent exists in GEN; workbook NO SAFE MATCH; addonFamily=Glycine; must pair only to matching formulation family (do not mix B12/Glycine/etc.); current links=['Semaglutide + Glycine'] |  | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide / L-Carnitine (High Dose) | Semaglutide High parent exists in GEN; workbook NO SAFE MATCH; addonFamily=L-Carnitine; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | Semaglutide/L-Carnitine | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide / L-Carnitine (Mid Dose) | Semaglutide Mid parent exists in GEN; workbook NO SAFE MATCH; addonFamily=L-Carnitine; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | Semaglutide/L-Carnitine | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide / L-Carnitine (Starting Dose) | Semaglutide Starting / Low parent exists in GEN; workbook NO SAFE MATCH; addonFamily=L-Carnitine; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | Semaglutide/L-Carnitine | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (High: 4→6→10mg) | Semaglutide 3-Month parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.); current links=['Semaglutide B12 ( , , )'] | GLP-1 Weight Loss Plan – Semaglutide (Any Dose) – 3 Month Supply, GLP-1 Weight Loss Plan – Semaglutide (High Dose) – 3 Month Supply, GLP-1 Weight Loss Plan – Semaglutide (Mid Dose) – 3 Month Supply | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (Low: 1→2→4mg) | Semaglutide 3-Month parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | GLP-1 Weight Loss Plan – Semaglutide (Any Dose) – 3 Month Supply, GLP-1 Weight Loss Plan – Semaglutide (High Dose) – 3 Month Supply, GLP-1 Weight Loss Plan – Semaglutide (Mid Dose) – 3 Month Supply | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Semaglutide 3-Month Escalation Bundle (Mid: 2→4→6mg) | Semaglutide 3-Month parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | GLP-1 Weight Loss Plan – Semaglutide (Any Dose) – 3 Month Supply, GLP-1 Weight Loss Plan – Semaglutide (High Dose) – 3 Month Supply, GLP-1 Weight Loss Plan – Semaglutide (Mid Dose) – 3 Month Supply | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Sublingual Semaglutide Oral Drops (High Dose 8–10mg/4ml) | Semaglutide High parent exists in GEN; workbook NO SAFE MATCH; addonFamily=oral+sublingual; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | GLP-1 Weight Loss Plan – Semaglutide (Oral Drops / Sublingual) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Sublingual Semaglutide Oral Drops (Mid Dose 4–6mg/4ml) | Semaglutide Mid parent exists in GEN; workbook NO SAFE MATCH; addonFamily=oral+sublingual; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | GLP-1 Weight Loss Plan – Semaglutide (Oral Drops / Sublingual) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss Plan – Sublingual Semaglutide Oral Drops (Starting Dose 2mg/4ml) | Semaglutide Starting / Low parent exists in GEN; workbook NO SAFE MATCH; addonFamily=oral+sublingual; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | GLP-1 Weight Loss Plan – Semaglutide (Oral Drops / Sublingual) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss – Semaglutide (High Dose) | Semaglutide High parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.); current links=['Semaglutide + Vitamin B12'] | GLP-1 Weight Loss Plan – Semaglutide (High Dose / Maintenance), Lean & Ready – Semaglutide + BPC-157 + AOD-9604 Plan, Ozempic (Semaglutide) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss – Semaglutide (Low Dose) | Semaglutide Starting / Low parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.); current links=['Semaglutide / Pyridoxine'] | GLP-1 Weight Loss Plan – Semaglutide (Low Dose), Lean & Ready – Semaglutide + BPC-157 + AOD-9604 Plan, Ozempic (Semaglutide) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-1 Weight Loss – Semaglutide (Oral Drops) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Oral GLP-1 Weight Loss Plan – Orforglipron (Any Dose), Oral GLP-1 Weight Loss Plan – Orforglipron (High Dose 36 mg), Oral GLP-1 Weight Loss Plan – Orforglipron (Mid Dose 12 mg) | Choose exact formulary or leave unpaired/hidden |
| GLP-2 Weight Loss Membership – Tirzepatide Any Dose (3 Months) | Tirzepatide 3-Month parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | Accelerate & Thrive – Tirzepatide + NAD+ Plan, GLP-2 Weight Loss Plan – Tirzepatide (Any Dose) – 3 Month Supply, GLP-2 Weight Loss Plan – Tirzepatide (High Dose) – 3 Month Supply | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-2 Weight Loss Plan – Tirzepatide (Any Dose) | Tirzepatide Any Dose parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | Accelerate & Thrive – Tirzepatide + NAD+ Plan, GLP-2 Weight Loss – Tirzepatide (Any Dose), GLP-2 Weight Loss – Tirzepatide Any Dose (6 Months) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-2 Weight Loss Plan – Tirzepatide (Any Dose) – 3 Month Supply | Tirzepatide 3-Month parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | Accelerate & Thrive – Tirzepatide + NAD+ Plan, GLP-2 Weight Loss Membership – Tirzepatide Any Dose (3 Months), GLP-2 Weight Loss Plan – Tirzepatide (High Dose) – 3 Month Supply | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-2 Weight Loss Plan – Tirzepatide (Any Dose) – 6 Month Supply | Tirzepatide Any Dose parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | Accelerate & Thrive – Tirzepatide + NAD+ Plan, GLP-2 Weight Loss – Tirzepatide (Any Dose), GLP-2 Weight Loss – Tirzepatide Any Dose (6 Months) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-2 Weight Loss Plan – Tirzepatide (High Dose / Maintenance) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES; FUTURE workbook row but GEN storefrontEligible=true — must force hidden before launch | Accelerate & Thrive – Tirzepatide + NAD+ Plan, GLP-2 Weight Loss – Tirzepatide (High Dose), Tirzepatide | Resolve safety/storefront conflict before pairing |
| GLP-2 Weight Loss Plan – Tirzepatide (High Dose) – 3 Month Supply | Tirzepatide 3-Month parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | Accelerate & Thrive – Tirzepatide + NAD+ Plan, GLP-2 Weight Loss Membership – Tirzepatide Any Dose (3 Months), GLP-2 Weight Loss Plan – Tirzepatide (Any Dose) – 3 Month Supply | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-2 Weight Loss Plan – Tirzepatide (Low Dose) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES; FUTURE workbook row but GEN storefrontEligible=true — must force hidden before launch | Accelerate & Thrive – Tirzepatide + NAD+ Plan, GLP-2 Weight Loss – Tirzepatide (Low Dose), GLP-2 Weight Loss Plan – Tirzepatide (Starting Dose / Micro-Dose) | Resolve safety/storefront conflict before pairing |
| GLP-2 Weight Loss Plan – Tirzepatide (Mid Dose) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES; FUTURE workbook row but GEN storefrontEligible=true — must force hidden before launch | Accelerate & Thrive – Tirzepatide + NAD+ Plan, Tirzepatide, Zepbound (Tirzepatide) | Resolve safety/storefront conflict before pairing |
| GLP-2 Weight Loss Plan – Tirzepatide (Mid Dose) – 3 Month Supply | Tirzepatide 3-Month parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | Accelerate & Thrive – Tirzepatide + NAD+ Plan, GLP-2 Weight Loss Membership – Tirzepatide Any Dose (3 Months), GLP-2 Weight Loss Plan – Tirzepatide (Any Dose) – 3 Month Supply | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-2 Weight Loss Plan – Tirzepatide (Oral Drops / Sublingual) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| GLP-2 Weight Loss Plan – Tirzepatide (Starting Dose / Micro-Dose) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES; FUTURE workbook row but GEN storefrontEligible=true — must force hidden before launch | Accelerate & Thrive – Tirzepatide + NAD+ Plan, GLP-2 Weight Loss – Tirzepatide (Low Dose), GLP-2 Weight Loss Plan – Tirzepatide (Low Dose) | Resolve safety/storefront conflict before pairing |
| GLP-2 Weight Loss Plan – Tirzepatide (Starting Dose) – 3 Month Supply | Tirzepatide 3-Month parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | Accelerate & Thrive – Tirzepatide + NAD+ Plan, GLP-2 Weight Loss Membership – Tirzepatide Any Dose (3 Months), GLP-2 Weight Loss Plan – Tirzepatide (Any Dose) – 3 Month Supply | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-2 Weight Loss Plan – Tirzepatide + Ondansetron (Nausea Support) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES; FUTURE workbook row but GEN storefrontEligible=true — must force hidden before launch | GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (High Dose), GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (Low Dose) | Resolve safety/storefront conflict before pairing |
| GLP-2 Weight Loss – Tirzepatide (Any Dose) | Tirzepatide Any Dose parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | Accelerate & Thrive – Tirzepatide + NAD+ Plan, GLP-2 Weight Loss – Tirzepatide Any Dose (6 Months), GLP-2 Weight Loss Plan – Tirzepatide (Any Dose) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-2 Weight Loss – Tirzepatide (High Dose) | Tirzepatide High parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | Accelerate & Thrive – Tirzepatide + NAD+ Plan, GLP-2 Weight Loss Plan – Tirzepatide (High Dose / Maintenance), Tirzepatide | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-2 Weight Loss – Tirzepatide (Low Dose) | Tirzepatide Starting / Low parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | Accelerate & Thrive – Tirzepatide + NAD+ Plan, GLP-2 Weight Loss Plan – Tirzepatide (Low Dose), GLP-2 Weight Loss Plan – Tirzepatide (Starting Dose / Micro-Dose) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-2 Weight Loss – Tirzepatide (Oral Drops) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (High Dose) | Tirzepatide High parent exists in GEN; workbook NO SAFE MATCH; addonFamily=Ondansetron; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | GLP-2 Weight Loss Plan – Tirzepatide + Ondansetron (Nausea Support) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-2 Weight Loss – Tirzepatide / Ondansetron ODT (Low Dose) | Tirzepatide Starting / Low parent exists in GEN; workbook NO SAFE MATCH; addonFamily=Ondansetron; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | GLP-2 Weight Loss Plan – Tirzepatide + Ondansetron (Nausea Support) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| GLP-2 Weight Loss – Tirzepatide Any Dose (6 Months) | Tirzepatide Any Dose parent exists in GEN; workbook NO SAFE MATCH; addonFamily=unspecified; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | Accelerate & Thrive – Tirzepatide + NAD+ Plan, GLP-2 Weight Loss – Tirzepatide (Any Dose), GLP-2 Weight Loss Plan – Tirzepatide (Any Dose) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| Hair Loss - Minoxdil/Tretinoin/Fluocinolone/Finasteride Spray | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Finasteride, Tretinoin, Fluocinolone, VitaminE, Hair Loss – Triple Combo (Finasteride/Minoxidil/Tretinoin) | Choose exact formulary or leave unpaired/hidden |
| Hair Loss – Dual Combo (Finasteride/Minoxidil) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Hair Loss – Dutasteride (Oral) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Hair Loss – Finasteride (Oral) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Hair Loss – Finasteride (Topical) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Hair Loss – Minoxidil (Oral) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Hair Loss – Minoxidil (Topical) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Hair Loss – Triple Combo (Finasteride/Minoxidil/Tretinoin) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Finasteride, Tretinoin, Fluocinolone, VitaminE, Hair Loss - Minoxdil/Tretinoin/Fluocinolone/Finasteride Spray | Choose exact formulary or leave unpaired/hidden |
| Hormone + Intimacy | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| IGF-1 LR3 Growth Factor Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Ipamorelin Growth Hormone Secretagogue Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| KPV Anti-Inflammatory Gut & Systemic Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Kisspeptin-10 | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Kisspeptin-10 Reproductive Hormone Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| LL-37 Antimicrobial & Immune Peptide Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | LL-37 | Choose exact formulary or leave unpaired/hidden |
| Lean & Energized | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Lean & Ready | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Lean & Ready – Semaglutide + BPC-157 + AOD-9604 Plan | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | GLP-1 Weight Loss – Semaglutide (High Dose), GLP-1 Weight Loss – Semaglutide (Low Dose), GLP-1 Weight Loss Plan – Semaglutide (Any Dose) | Choose exact formulary or leave unpaired/hidden |
| Lean & Timeless | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| MK-677 (Ibutamoren) Oral Growth Hormone Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| MOTS-C | reviewBeforeApply=VERIFY FORM/STRENGTH/PACKAGE; FUTURE workbook row but GEN storefrontEligible=true — must force hidden before launch | MOTS-C Metabolic & Longevity Protocol | Resolve safety/storefront conflict before pairing |
| MOTS-C Metabolic & Longevity Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | MOTS-C | Choose exact formulary or leave unpaired/hidden |
| Melanotan 2 Tanning & Sexual Health Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Men's Hormones (TRT) – Estrogen Management (Anastrozole) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Men's Hormones (TRT) – Fertility / HPTA Support (Enclomiphene) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Men's Hormones (TRT) – Injectable Testosterone | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Men's Hormones (TRT) – Testosterone Cream | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Men's Hormones – Nandrolone / Testosterone Cream | Choose exact formulary or leave unpaired/hidden |
| Men's Hormones (TRT) – Testosterone Hypo Spray | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Depo-Testosterone (Pfizer), Men's Hormones (TRT) – Testosterone Spray | Choose exact formulary or leave unpaired/hidden |
| Men's Hormones (TRT) – Testosterone Spray | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Depo-Testosterone (Pfizer), Men's Hormones (TRT) – Testosterone Hypo Spray | Choose exact formulary or leave unpaired/hidden |
| Men's Hormones (TRT) – Testosterone Troche | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Men's Hormones – Fertility (Clomiphene) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Men's Hormones – Fertility (HCG) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Men's Hormones – Gonadorelin | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Men's Hormones – Nandrolone / Testosterone Cream | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Men's Hormones (TRT) – Testosterone Cream | Choose exact formulary or leave unpaired/hidden |
| Men's Hormones – PCT / Estrogen Blocker (Tamoxifen) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Mens HRT/TRT In-Clinic Approval | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Mens TRT/HRT 1 Month Plan | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Mens TRT/HRT 3 Month Plan | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Mens TRT/HRT 6 Month Plan | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| NAD + Nasal Spray | reviewBeforeApply=VERIFY FORM/STRENGTH/PACKAGE; FUTURE workbook row but GEN storefrontEligible=true — must force hidden before launch | NAD+ Cognitive & Energy Protocol (Nasal Spray), Wellness – NAD+ (Nasal Spray) | Resolve safety/storefront conflict before pairing |
| NAD+ Anti-Aging & Energy Protocol (Injectable) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | NAD+ (Injectable), NAD+ Anti-Aging & Energy Protocol (Injectable) – 3 Month Supply, NAD+ Anti-Aging & Energy Protocol (Injectable) – 6 Month Supply | Choose exact formulary or leave unpaired/hidden |
| NAD+ Anti-Aging & Energy Protocol (Injectable) – 3 Month Supply | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | NAD+ (Injectable), NAD+ Anti-Aging & Energy Protocol (Injectable), NAD+ Anti-Aging & Energy Protocol (Injectable) – 6 Month Supply | Choose exact formulary or leave unpaired/hidden |
| NAD+ Anti-Aging & Energy Protocol (Injectable) – 6 Month Supply | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | NAD+ (Injectable), NAD+ Anti-Aging & Energy Protocol (Injectable), NAD+ Anti-Aging & Energy Protocol (Injectable) – 3 Month Supply | Choose exact formulary or leave unpaired/hidden |
| NAD+ Cognitive & Energy Protocol (Nasal Spray) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | NAD + Nasal Spray, Wellness – NAD+ (Nasal Spray) | Choose exact formulary or leave unpaired/hidden |
| Oral GLP-1 Weight Loss Plan – Orforglipron (Any Dose) | Semaglutide Any Dose parent exists in GEN; workbook NO SAFE MATCH; addonFamily=oral; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | GLP-1 Weight Loss – Semaglutide (Oral Drops) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| Oral GLP-1 Weight Loss Plan – Orforglipron (High Dose 36 mg) | Semaglutide High parent exists in GEN; workbook NO SAFE MATCH; addonFamily=oral; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | GLP-1 Weight Loss – Semaglutide (Oral Drops) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| Oral GLP-1 Weight Loss Plan – Orforglipron (Mid Dose 12 mg) | Semaglutide Mid parent exists in GEN; workbook NO SAFE MATCH; addonFamily=oral; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | GLP-1 Weight Loss – Semaglutide (Oral Drops) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| Oral GLP-1 Weight Loss Plan – Orforglipron (Starting Dose 6 mg) | Semaglutide Starting / Low parent exists in GEN; workbook NO SAFE MATCH; addonFamily=oral; must pair only to matching formulation family (do not mix B12/Glycine/etc.) | GLP-1 Weight Loss – Semaglutide (Oral Drops) | Select exact vial/formulation set under this parent; confirm Any Dose multi-map if applicable |
| Ozempic (Semaglutide) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | GLP-1 Weight Loss – Semaglutide (High Dose), GLP-1 Weight Loss – Semaglutide (Low Dose), GLP-1 Weight Loss Plan – Semaglutide (Any Dose) | Choose exact formulary or leave unpaired/hidden |
| PE-22-28 | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| PE-22-28 Antidepressant & Cognitive Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| PT-141 (Bremelanotide) Sexual Desire Protocol (Nasal Spray) | Workbook Match Status = AUTO MATCH - REVIEW; reviewBeforeApply=YES; FUTURE workbook row but GEN storefrontEligible=true — must force hidden before launch |  | Resolve safety/storefront conflict before pairing |
| Peak Performance | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Peptides – BPC-157 (Oral) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | BPC-157 Gut & Recovery Protocol (Oral Capsules), BPC-157 Recovery Protocol (Oral Capsule) | Choose exact formulary or leave unpaired/hidden |
| Peptides – Kisspeptin-10 | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Peptides – Sermorelin (Injectable) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Sermorelin Growth Hormone Protocol (Injectable) | Choose exact formulary or leave unpaired/hidden |
| Peptides – Sermorelin (Oral / Troche) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Sermorelin Growth Hormone Protocol (Oral / Troche / Sublingual) | Choose exact formulary or leave unpaired/hidden |
| Peptides – Tesamorelin (Growth Hormone) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Tesamorelin / Ipamorelin Growth Hormone Protocol, Tesamorelin Growth Hormone Protocol, Tesamorelin/Ipamorelin | Choose exact formulary or leave unpaired/hidden |
| Performance – Oxandrolone (High Dose) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Performance – Oxandrolone (Low Dose) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Performance – Stanozolol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Pinealon / PE-22-28 / Selank Neuro-Sleep Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES; FUTURE workbook row but GEN storefrontEligible=true — must force hidden before launch | Selank Anxiolytic & Cognitive Protocol | Resolve safety/storefront conflict before pairing |
| Pinealon Neuroprotective & Anti-Aging Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Pinealon | Choose exact formulary or leave unpaired/hidden |
| Power & Recovery | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Retatrutide | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES; FUTURE workbook row but GEN storefrontEligible=true — must force hidden before launch |  | Resolve safety/storefront conflict before pairing |
| SLU-PP-332 Metabolic & Exercise Mimetic Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone | Sildenafil product proposed to Scream Cream formulary — do not silently substitute; Workbook Match Status = AUTO MATCH - REVIEW; reviewBeforeApply=YES; FUTURE workbook row but GEN storefrontEligible=true — must force hidden before launch | Women's Sexual Health – Arousal (Scream Cream) | Resolve safety/storefront conflict before pairing |
| Sculpt & Perform | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Selank Anxiolytic & Cognitive Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Pinealon / PE-22-28 / Selank Neuro-Sleep Protocol | Choose exact formulary or leave unpaired/hidden |
| Semax / Selank Neuro & Cognitive Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Semax Nootropic & Neuroprotective Protocol | Choose exact formulary or leave unpaired/hidden |
| Semax Nootropic & Neuroprotective Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Semax / Selank Neuro & Cognitive Protocol | Choose exact formulary or leave unpaired/hidden |
| Sermorelin Growth Hormone Protocol (Injectable) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Peptides – Sermorelin (Injectable) | Choose exact formulary or leave unpaired/hidden |
| Sermorelin Growth Hormone Protocol (Oral / Troche / Sublingual) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Peptides – Sermorelin (Oral / Troche) | Choose exact formulary or leave unpaired/hidden |
| Sildenafil (3 Month) | Sildenafil product proposed to Scream Cream formulary — do not silently substitute; reviewBeforeApply=VERIFY FORM/STRENGTH/PACKAGE | ED – Caffeine / Sildenafil (Performance Boost), ED – Sildenafil (On-Demand), ED – Sildenafil / Tadalafil Combo | Resolve safety/storefront conflict before pairing |
| Sildenafil (6 Month) | Sildenafil product proposed to Scream Cream formulary — do not silently substitute; reviewBeforeApply=VERIFY FORM/STRENGTH/PACKAGE | ED – Caffeine / Sildenafil (Performance Boost), ED – Sildenafil (On-Demand), ED – Sildenafil / Tadalafil Combo | Resolve safety/storefront conflict before pairing |
| Slim & Sensational | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Slim & Timeless | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Tesamorelin / Ipamorelin Growth Hormone Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Peptides – Tesamorelin (Growth Hormone), Tesamorelin Growth Hormone Protocol, Tesamorelin/Ipamorelin | Choose exact formulary or leave unpaired/hidden |
| Tesamorelin Growth Hormone Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Peptides – Tesamorelin (Growth Hormone), Tesamorelin / Ipamorelin Growth Hormone Protocol, Tesamorelin/Ipamorelin | Choose exact formulary or leave unpaired/hidden |
| The Ultimate Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| The Ultimate Semaglutide Stack | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | GLP-1 Weight Loss – Semaglutide (High Dose), GLP-1 Weight Loss – Semaglutide (Low Dose), GLP-1 Weight Loss Plan – Semaglutide (Any Dose) | Choose exact formulary or leave unpaired/hidden |
| Thymosin Beta-4 (TB-500) Tissue Repair Protocol | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | TB-500 Recovery Protocol | Choose exact formulary or leave unpaired/hidden |
| Thyroid Support (BioThyroid) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Total Transformation | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Vitality & Longevity | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Wellness – Glutathione (Injectable) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Wellness – Glutathione (Oral) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Wellness – Glutathione (Topical) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Wellness – Low-Dose Naltrexone (LDN) Starter | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Wellness – Low-Dose Naltrexone (LDN) Therapeutic | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Wellness – MIC-B12 (Lipotropic / Fat Burn) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Wellness – MIC-B12 (Lipotropic / Fat Burn) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Wellness – NAD+ (Nasal Spray) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | NAD + Nasal Spray, NAD+ Cognitive & Energy Protocol (Nasal Spray) | Choose exact formulary or leave unpaired/hidden |
| Wellness – NAD+ (Topical) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | NAD+ Anti-Aging Protocol (Topical) | Choose exact formulary or leave unpaired/hidden |
| Women's Hormones (HRT) – BiEst / Progesterone / Testosterone Combo Cream | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Women's Hormones (HRT) – BiEst / Progesterone Combo Cream | Choose exact formulary or leave unpaired/hidden |
| Women's Hormones (HRT) – BiEst / Progesterone Combo Cream | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Women's Hormones (HRT) – BiEst / Progesterone / Testosterone Combo Cream | Choose exact formulary or leave unpaired/hidden |
| Women's Hormones (HRT) – Progesterone | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Women's Hormones (HRT) – Progesterone Suppository | Choose exact formulary or leave unpaired/hidden |
| Women's Hormones (HRT) – Progesterone Suppository | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Women's Hormones (HRT) – Progesterone | Choose exact formulary or leave unpaired/hidden |
| Women's Hormones (HRT) – Vaginal Health (Estradiol / DHEA) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Women's Hormones (HRT) – Vaginal Health (Estradiol) | Choose exact formulary or leave unpaired/hidden |
| Women's Hormones (HRT) – Vaginal Health (Estradiol) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Women's Hormones (HRT) – Vaginal Health (Estradiol / DHEA) | Choose exact formulary or leave unpaired/hidden |
| Women's Sexual Health – Arousal (Scream Cream) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Scream Cream: Sildenafil / Arginine / Papaverine / Testosterone | Choose exact formulary or leave unpaired/hidden |
| Women's Sexual Health – Combo (Oxytocin + ED/PT-141) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | PT-141 (Bremelanotide), Women's Sexual Health – Desire (PT-141) | Choose exact formulary or leave unpaired/hidden |
| Women's Sexual Health – Desire (PT-141) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | PT-141 (Bremelanotide), Women's Sexual Health – Combo (Oxytocin + ED/PT-141) | Choose exact formulary or leave unpaired/hidden |
| Women's Sexual Health – Intimacy (Oxytocin) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Women's Sexual Health – Intimacy (Oxytocin) Nasal Spray | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Womens HRT GFE In-Clinic Approval | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Womens TRT/HRT 1 Month Plan | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Womens TRT/HRT 3 Month Plan | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Womens TRT/HRT 6 Month Plan | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES |  | Choose exact formulary or leave unpaired/hidden |
| Zepbound (Tirzepatide) | Workbook Match Status = NO SAFE MATCH; reviewBeforeApply=YES | Accelerate & Thrive – Tirzepatide + NAD+ Plan, GLP-2 Weight Loss – Tirzepatide (Any Dose), GLP-2 Weight Loss – Tirzepatide (High Dose) | Choose exact formulary or leave unpaired/hidden |

## 8. Write gates

| Metric | Value |
|---|---|
| GEN PRODUCTS CREATED | 0 |
| GEN PRODUCTS UPDATED | 0 |
| GEN PRODUCTS DEACTIVATED | 0 |
| GEN MODIFIED | NO |
| PRODUCTION WEBSITE MODIFIED | NO |
| GEN/WHOP CUTOVER | OFF |

**STOP FOR OWNER REVIEW.**
