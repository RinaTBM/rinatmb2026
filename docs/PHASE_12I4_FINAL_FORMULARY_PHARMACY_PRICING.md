# Phase 12I.4 — Final Formulary + Pharmacy + Retail Pricing Approval

**Branch:** `deploy/ach-launch-clean-2026`  
**Start SHA:** `b99cea04950ccd77f7faef66ec3c75db83641f47`  
**Staging:** `mxvaxkkwrbwhqasnsjpm` · **Production:** `bsgtuuzwgeetsjjdrtrm` (**untouched**)  
**Mode:** OWNER APPROVAL ANALYSIS ONLY  
**GEN auto-handoff:** OFF · **`GEN_API_ORDERS_ENABLED`:** FALSE  
**Tagada writes:** NO · **Website retail prices changed:** NO · **12J:** NOT STARTED  

Machine-readable: `docs/PHASE_12I4_FINAL_FORMULARY_PHARMACY_PRICING.json`

---

## OWNER_WORKBOOK_REQUIRED

The owner workbook **`MyBareMethod_Cheapest_Pharmacy_Formulary.xlsx`** was **not accessible** in this workspace (`/workspace`, `/home/ubuntu`, `/opt`, `/tmp`).

Therefore:

- Pharmacy “winners” from that workbook are **not** applied.
- Landed-cost comparisons across pharmacies are **not** inventable from repo data alone.
- Selected pharmacy for every product+delivery family remains **`null` / TBD** pending workbook upload + owner confirmation.
- Repository analysis continues from Phase 12I.2 GEN matrix + Phase 12I.3 readiness + Tagada mapping CSV.

**Do not treat this document as owner-approved.**

---

## Owner formulary rule (authoritative for decisions)

**ONE PHARMACY PER PRODUCT + DELIVERY TYPE.**

Do not switch pharmacies between dosage strengths merely to save a few dollars.

Selection priority:

1. Exact/appropriate formulation  
2. Lowest **verified landed** cost (medication + known shipping)  
3. Adequate strength coverage  
4. Consistent package/vial structure  
5. Shipping cost  
6. Keep dosage family at one pharmacy  
7. Existing GEN compatibility  

If shipping is unknown → mark **UNKNOWN**. Never assume $0. Never equate unlike formulations.

---

## Owner decision table

| PRODUCT | TYPE | SELECTED PHARMACY | FORMULATION | STRENGTH FAMILY | LANDED COST RANGE | CURRENT RETAIL RANGE | RECOMMENDED RETAIL RANGE | GEN STATUS | ACTION |
|---|---|---|---|---|---|---|---|---|---|
| Semaglutide | Injection | TBD — OWNER_WORKBOOK_REQUIRED | Current +B6; replacement TBD | 0.5 / 1 / 2.5 / 5 mg | UNKNOWN | $119–$329 | TBD after landed cost | NO_MATCH | NEW SKU NEEDED |
| Tirzepatide | Injection | TBD — OWNER_WORKBOOK_REQUIRED | Current +B6; replacement TBD | 2.5 / 7.5 / 12.5 / 15 mg | UNKNOWN | $189–$429 | TBD after landed cost | NO_MATCH | NEW SKU NEEDED |
| Fat Burner | Injection | TBD | AOD/MOTS-C/Tesamorelin triple | 5mL vial | UNKNOWN | $259 | TBD | AMBIGUOUS | REVIEW FORMULATION |
| Estradiol | Patch | TBD — OWNER_WORKBOOK_REQUIRED | Estradiol Patch | 0.025 / 0.05 / 0.1 mg | UNKNOWN | $129–$149 | TBD | NO_MATCH | SOURCE NEEDED |
| Estradiol | Cream / Troche (proposed) | TBD — OWNER_WORKBOOK_REQUIRED | TBD | TBD | UNKNOWN | N/A | TBD | NO_MATCH | SOURCE NEEDED |
| Progesterone | Capsule (IR/SR TBD) | TBD — OWNER_WORKBOOK_REQUIRED | Capsule 100/200mg | 100 / 200 mg | UNKNOWN | $39–$59 | TBD | NO_MATCH | SOURCE NEEDED |
| Progesterone | Cream / Troche (proposed) | TBD | TBD | TBD | UNKNOWN | N/A | TBD | NO_MATCH | SOURCE NEEDED |
| Testosterone (Women) | Cream | TBD — OWNER_WORKBOOK_REQUIRED | 5mg/g cream | 5mg/g · 30g | UNKNOWN | $79 | TBD | NO_MATCH | SOURCE NEEDED |
| NAD+ | Injection | TBD | 100mg/mL | 500mg / 1000mg | UNKNOWN | $199–$229 | TBD | NO_MATCH | SOURCE NEEDED |
| NAD+ | Nasal Spray (proposed) | TBD (may differ from injection) | TBD | TBD | UNKNOWN | N/A | TBD | NO_MATCH | SOURCE NEEDED |
| Selank | Injection | TBD | 5mg/mL | 2mL | UNKNOWN | $129 | TBD | NO_MATCH | KEEP BLOCKED |
| Semax | Injection | TBD | 5mg/mL | 2mL | UNKNOWN | $129 | TBD | NO_MATCH | KEEP BLOCKED |
| Selank + Semax | Nasal Spray | TBD | 50/50 mcg | 10mL | UNKNOWN | $169 | TBD | NO_MATCH | KEEP BLOCKED |
| Tesamorelin | Injection | TBD | 5mg/mL · 10mg total | 2mL | UNKNOWN | $149 | TBD | NO_MATCH | KEEP BLOCKED |
| BPC-157/TB-500 | Injection | Optimal Balance (**CANDIDATE** — workbook re-check) | BPC-157 / TB500 3 MG / 3 MG/ML (5 ML) | 5 mL vial | UNKNOWN (med $117; ship UNKNOWN) | $199 | med-only +50–+75 $175.50–$204.75; landed TBD | EXACT | REVIEW PRICE |
| BPC-157/TB-500 | Capsule | TBD | Current blend vs GEN oral BPC alone | TBD | UNKNOWN | $99 | TBD | AMBIGUOUS | NEW SKU NEEDED |
| Tretinoin | Cream | TBD | 0.025 / 0.05 / 0.1% | 20g | UNKNOWN | $79–$109 | TBD | NO_MATCH | SOURCE NEEDED |
| Minoxidil Combination | Topical Solution | TBD | Combination | Bottle | UNKNOWN | $129 | TBD | NO_MATCH | SOURCE NEEDED |
| Bimatoprost | Solution | TBD | 0.03% | 2.5mL | UNKNOWN | $89 | TBD | NO_MATCH | SOURCE NEEDED |
| Ondansetron | Tablet / ODT | TBD | generic Zofran | 4 mg / 8 mg | UNKNOWN | N/A | TBD | NO_MATCH | SOURCE NEEDED |

Actions are **recommendations for owner**, not approvals.

---

## Change summary

| Metric | Value |
|---|---|
| Existing Rx SKUs | **28** |
| Existing SKUs unchanged (identity) | **19** |
| Existing SKUs replacement required | **9** |
| New SKUs proposed (12I.3 SEM/TIR/BPC-cap) | **9** |
| Ondansetron proposed SKUs | **4** |
| HRT expanded delivery placeholders | **8** |
| Product/type pharmacy families reviewed | **26** |
| Families with known **landed** cost | **0** |
| Families with unknown shipping | **26** |
| Pharmacy changed vs 12I.2 | **0** (cannot change without workbook) |
| GEN EXACT | **1** |
| GEN VERIFIED_REPLACEMENT | **0** |
| GEN AMBIGUOUS | **2** |
| GEN NO_MATCH | **25** |
| Current price BELOW +50 | **0** |
| Current price BETWEEN +50 AND +75 | **1** (BPC, medication-only basis) |
| Current price BETWEEN +75 AND +100 | **0** |
| Current price ABOVE +100 | **0** |
| Current price UNKNOWN | **27** |
| Commercially attractive at current retail | **1** (BPC med-only band) |
| HRT families reviewed | **8** |
| Peptide/recovery families reviewed | **6** |
| Supply/accessory families reviewed | **4** |
| Ondansetron status | **BLOCKED_SOURCE_REQUIRED** |
| Production Rx ready | **0** |

---

## BPC re-review (do not auto-preserve)

| Field | Value |
|---|---|
| SKU | `MBM-RP-BPC-INJ-001` |
| GEN ID | `KXMm9SsbOEYnFy9phmZn` |
| Exact formulation | BPC-157 / TB500 3 MG / 3 MG/ML (5 ML) |
| 12I.2 pharmacy | Optimal Balance Pharmacy |
| Medication at-cost | **$117.00** |
| Shipping | **UNKNOWN** |
| Landed | **UNKNOWN** (do not invent) |
| Current retail | **$199.00** (unchanged) |
| Med-only +50 / +75 / +100 | $175.50 / $204.75 / $234.00 |
| Med-only band | BETWEEN +50 AND +75 |
| `CHEAPER_PHARMACY_FOUND` | **NOT_ASSESSABLE** (workbook missing) |
| `GEN_REMAP_REQUIRED` | **N/A until alternate verified** |
| Pharmacy changed from 12I.2 | **NO** |
| Production purchasable | **NO** (`GEN_API_ORDERS_ENABLED=false`) |

Unlike BPC formulations (lower dose, BPC/KPV/TB, BPC/GHK-Cu/TB, etc.) are **not** substitutes.

---

## Semaglutide / Tirzepatide

| | Semaglutide | Tirzepatide |
|---|---|---|
| Selected pharmacy | TBD — OWNER_WORKBOOK_REQUIRED | TBD — OWNER_WORKBOOK_REQUIRED |
| Formulation family | Current **+B6** preserved historically; replacement exact TBD | Same |
| New SKUs (prepared, not activated) | `MBM-WM-SEM-INJ-005`…`008` | `MBM-WM-TIR-INJ-005`…`008` |
| GEN status | NO_MATCH | NO_MATCH |
| Old SKUs | KEEP_HISTORICAL / BLOCK_NEW_SALES when replacement activates | Same |
| Membership | $149 unchanged; crosswalk update **pending** formulary approval; rebill auto-med **NO** | $249 unchanged; same |

Do not display “+ B6” on replacement variants if GEN formulation differs.

---

## Women’s HRT structure (catalog mapping only)

Preserve storefront model: **one product → delivery → strengths**.

### Estradiol
- **Existing:** Patch (`MBM-HRT-EST-PAT-001`…`003`) — SOURCE NEEDED / KEEP BLOCKED until pharmacy+GEN  
- **Proposed families:** Cream, Troche (placeholders `MBM-HRT-EST-CRM-001`, `MBM-HRT-EST-TRO-001`) — SOURCE NEEDED  

### Progesterone
- **Existing:** Capsule 100/200mg — IR vs SR not distinguished in current SKUs; workbook must classify  
- **Proposed:** Capsule IR / Capsule SR / Cream / Troche placeholders  

### Testosterone (women)
- **Existing:** Cream `MBM-HRT-TST-CRM-001`  
- **Proposed:** Troche placeholder  
- No men’s TRT positioning  

---

## Ondansetron (Supportive Medications) — proposed

| Field | Value |
|---|---|
| Website | Ondansetron → Tablet (4/8 mg) · ODT (4/8 mg) |
| Proposed SKUs | `MBM-SUP-OND-TAB-001/002`, `MBM-SUP-OND-ODT-001/002` |
| Pharmacy | **TBD** |
| Cost / Shipping | **TBD** |
| GEN product | **TBD** |
| Status | **BLOCKED_SOURCE_REQUIRED** |
| Purchasable | **NO** |

Not present in repo GEN catalog or accessible pharmacy workbook.

---

## Accessories / supplies

GEN: **NOT_REQUIRED**. Remain purchasable.

Reviewed families: syringes, alcohol prep pads, sharps container, injection starter kit.

Vendor economics require owner workbook — not inventable here.

---

## GEN crosswalk rules

| Match | Meaning |
|---|---|
| EXACT | Exact GEN product verified |
| VERIFIED_REPLACEMENT | Owner-approved replacement with GEN ID |
| AMBIGUOUS | Overlap but not exact — do not activate |
| NO_MATCH | No GEN product |
| NOT_REQUIRED | Accessories / non-clinical |

Fulfillment readiness ≠ pharmacy has the drug. **READY** requires GEN mapping + (for production) API Orders.

Storefront (12I.3 preserved): `COMING_SOON` / `TEMPORARILY_UNAVAILABLE` / `NEW_SKU_REQUIRED` / `BLOCKED_PENDING_GEN`.

---

## Tagada (READ ONLY — future plan)

Existing 28 Rx + accessories already have Tagada product/variant/price IDs (see JSON / `docs/tagada-product-mapping-review.csv`).

| Class | Future Tagada action |
|---|---|
| BPC injection | `NO_CHANGE` until owner price decision; then possible `PRICE_UPDATE` |
| 9 replacement SKUs | `CREATE_NEW_PRODUCT_VARIANT` — do not reuse old IDs for new formulations |
| Ondansetron / HRT expanded | `CREATE_NEW_PRODUCT` + variants when approved |
| Blocked existing | `BLOCK_CHECKOUT` (already enforced server-side when production guard on) |

**No Tagada writes in this phase.**

---

## Safety flags (unchanged)

| Flag | State |
|---|---|
| `GEN_HANDOFF_AUTOMATION_ENABLED` | OFF |
| `GEN_API_ORDERS_ENABLED` | **FALSE** |
| `GEN_API_ORDERS_PAYMENT_STATUS_ENABLED` | unset / false |
| Website retail prices | unchanged |
| Membership prices | unchanged |
| Membership rebill → med | **NO** |
| Production DB / Tagada / GEN | **untouched** |

Phase 12I.3 storefront/server guards remain in force (`AGENTS.md`).

---

## Blockers

1. **OWNER_WORKBOOK_REQUIRED** — upload `MyBareMethod_Cheapest_Pharmacy_Formulary.xlsx` into workspace  
2. Owner approve pharmacy per product+delivery family  
3. Owner approve exact formulations (esp. SEM/TIR ≠ +B6; BPC capsule; HRT IR/SR)  
4. Owner approve retail vs landed markups  
5. GEN clientProductId for all non-BPC Rx  
6. GEN API Orders enablement (Scriptful/GEN)  
7. Then controlled Tagada/SKU implementation → **12J** only after that  

---

## Next recommended phase

**After owner supplies workbook + decisions:** re-run 12I.4 pharmacy winner merge (or 12I.4b) → implement approved catalog/Tagada changes → then **12J** controlled production cutover.

**STOP AFTER PHASE 12I.4. DO NOT START 12J.**
