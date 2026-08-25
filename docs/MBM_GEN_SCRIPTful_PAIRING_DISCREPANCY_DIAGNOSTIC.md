# MBM GEN / Scriptful Pairing Discrepancy Diagnostic

**READ ONLY.** No GEN writes. No pairing writes. No website routing changes. No registry changes. No creates. Cutover OFF. PR #19 open.

Generated: `2026-08-25T05:47:15Z`

## Why this run exists

Owner reports all 7 remaining products were manually updated in the Scriptful / GEN Products UI.
Subsequent pairing audits still reported the same 7 locked Client Products as missing/incompatible.
This diagnostic asks whether the **routing matrix points at the wrong GEN objects**, or whether edits landed elsewhere — **not** whether the owner “failed to save.”

## Audit data path (what we actually read)

| Layer | Endpoint / source | Evidence |
|---|---|---|
| GEN Client Products | `GET /v2/client/products?limit=500` via staging `gen-health-list-products` | 255 products |
| Client Product ↔ formulary medication pairings | `GET /v2/client/products?limit=500&view=formulary` → `data.formularyProducts[]` | 71 rows / 23 products with ≥1 pairing |
| Pairing writes | Client Products API | **NOT available** (`docs/GEN_CATALOG_2A_LIVE_WRITE_REPORT.md`, `docs/GEN_LIVE_FORMULARY_PAIRING_AUDIT.md`) — admin UI only |

### When owner edits medications under “Scriptful / GEN Products”, should the current audit see it?

**YES** — *if* those edits are formulary medication attach/detach on a **GEN Client Product**.

Reason: the audit reads the same Client Product formulary pairing inventory the admin UI updates. Pairings on other CPs are already visible through this path. There is no evidence of a second pairing store being read.

If “Scriptful Products” were a separate undocumented object type, visibility would be **UNKNOWN** — but **no Scriptful identifiers appear** on live Client Product payloads (`clientProductId`, `productId`, `displayName`, `pricing`, `pharmacies`, … only).

## Data model (evidence-backed)

| Concept | What evidence supports |
|---|---|
| **Scriptful (in this repo)** | Website/variant SKU export (`docs/scriptful-variant-skus.md`) — not a GEN API resource |
| **GEN Client Product** | `/v2/client/products` objects; website routing locks `genClientProductId` |
| **Formulary medication** | `medicationId` + `standardizedMedicationName` + `pharmacyName` |
| **Client Product ↔ medication pairing** | Readable via `?view=formulary`; writable only in GEN admin UI per 2A audit |

Intended architecture remains: website family → selectors → GEN Client Product(s) → compatible formulary options → provider chooses.

## Classification summary

| Diagnosis | Count |
|---|---:|
| `OWNER_CHANGE_VISIBLE_ON_EXPECTED_CP` | 0 |
| `OWNER_CHANGE_VISIBLE_ON_DIFFERENT_CP` | 3 |
| `SCRIPTful_CHANGE_NOT_VISIBLE_VIA_CURRENT_API` | 0 |
| `DUPLICATE_CP_ROUTING_TARGET_MISMATCH` | 0 |
| `OWNER_CHANGE_NOT_FOUND_ANYWHERE` | 4 |
| `UNABLE_TO_DETERMINE` | 0 |

## Per-product inventory + diagnosis

### SEM Mid B12

- **Website variant:** `sem-b12-mid`
- **Current locked CP:** `BLf8inX395YNc7WPCD4O` — Semaglutide Injection — Mid (B12)
- **Locked clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_BLf8inX395YNc7WPCD4O`
- **Locked price / storefrontEligible / attachments:** $109 / True / 0
- **Locked attachments:** _(none)_
- **Other matching CPs searched (selected):**
  - `CjqOUbPuGPZzxephqRou` Semaglutide Injection — Mid (Glycine) · $109 · atts=2 · storefront=True
  - `MkDIUw0NcJB7YL2pNzYW` Semaglutide Injection — Any Dose (B12) · $119 · atts=3 · storefront=True
  - `NF825utCtjVqbbGsnQN3` Semaglutide/B12 · $0 · atts=2 · storefront=True
  - `SkqQHmsc0WdsbK9vmV1y` Semaglutide Injection — Starting / Low (B12) · $99 · atts=1 · storefront=True
  - `34I2X8MpVZf3AQTff3bo` Semaglutide Injection — High (B12) · $119 · atts=1 · storefront=True
- **Where intended medication is actually found:**
  - {"note": "No Semaglutide+B12 attachment exists on any product titled Mid (B12)."}
  - {"note": "Semaglutide + Vitamin B12 / Semaglutide B12 meds currently live on Starting/High/Any-Dose B12 CPs, Semaglutide/B12 (NF825…), and legacy GLP-1 plan titles — not Mid B12."}
- **DIAGNOSIS:** `OWNER_CHANGE_NOT_FOUND_ANYWHERE`
- **Recommended next action:** Owner confirm in GEN Products UI they opened exactly “Semaglutide Injection — Mid (B12)” (BLf8in…). Attach ≥1 Dirx Semaglutide + Vitamin B12 there. Do not assume Mid Glycine CP. Do not retarget website to Semaglutide/B12 slash product without review.

### SEM Membership $149

- **Website variant:** `sem-membership`
- **Current locked CP:** `5F8jESeVeXcpkLU5rrdK` — SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP
- **Locked clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_5F8jESeVeXcpkLU5rrdK`
- **Locked price / storefrontEligible / attachments:** $149 / True / 0
- **Locked attachments:** _(none)_
- **Other matching CPs searched (selected):**
  - `MkDIUw0NcJB7YL2pNzYW` Semaglutide Injection — Any Dose (B12) · $119 · atts=3 · storefront=True
  - `wQK2JsFnh7oFBf3Lag4n` Semaglutide Injection — Any Dose (Glycine) · $119 · atts=4 · storefront=True
  - `1sgLVERqG9oWU9WKht9b` GLP-1 Weight Loss Membership – Semaglutide / L-Carnitine (Any Dose) · $0 · atts=0 · storefront=False
- **Where intended medication is actually found:**
  - {"note": "Locked membership CP has 0 formulary attachments."}
  - {"note": "Compatible Semaglutide B12/Glycine medications are attached to one-time / Any Dose dose-group CPs (already present before this discrepancy), not to the $149 membership CP."}
- **DIAGNOSIS:** `OWNER_CHANGE_NOT_FOUND_ANYWHERE`
- **Recommended next action:** Owner open exactly “SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP” ($149, 5F8jES…). Attach compatible B12 and/or Glycine options on THAT CP. Dose-group CPs are not membership.

### TIR Membership $275

- **Website variant:** `tir-membership`
- **Current locked CP:** `E3MXZeeR01QROCuTLRLE` — TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP
- **Locked clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_E3MXZeeR01QROCuTLRLE`
- **Locked price / storefrontEligible / attachments:** $275 / True / 0
- **Locked attachments:** _(none)_
- **Other matching CPs searched (selected):**
  - `SvFDJ7W4nmWL2bkLUMMS` GLP-2 Weight Loss – Tirzepatide (Any Dose) · $279 · atts=17 · storefront=True
  - `iWGB1hvWlU5AzzLsfuEj` Tirzepatide/B12/Glycine · $0 · atts=0 · storefront=False
  - `fvEsD7VkIu1c6EGu5slC` Tirzepatide/Glycine/B12 · $0 · atts=0 · storefront=False
  - `Mk6NCa9023u9hGBnFg8z` GLP-2 Weight Loss Membership – Tirzepatide Any Dose (3 Months) · $0 · atts=0 · storefront=False
- **Where intended medication is actually found:**
  - {"productId": "SvFDJ7W4nmWL2bkLUMMS", "name": "GLP-2 Weight Loss – Tirzepatide (Any Dose)", "price_usd": 279, "note": "ALL live Tirzepatide + B12 and Tirzepatide + Glycine formulary attachments currently sit on this GLP-2 Any Dose CP (17 attachments), not on the $275 membership CP."}
- **DIAGNOSIS:** `OWNER_CHANGE_VISIBLE_ON_DIFFERENT_CP`
- **Recommended next action:** Likely the owner configured GLP-2 Any Dose (SvFDJ7…) instead of “TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP” (E3MXZe…). Do NOT retarget website membership to GLP-2 (forbidden reuse / wrong product class / $279). Owner should attach compatible TIR B12/Glycine options onto the membership CP, or confirm GEN_BACKEND_SPLIT_REQUIRED. KEEP create-set TIR×8 separate.

### Wolverine Capsule

- **Website variant:** `wolverine-capsule`
- **Current locked CP:** `omhh3NabouO8AsNR5tkD` — Wolverine – BPC-157 + TB-500 Recovery Protocol
- **Locked clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_omhh3NabouO8AsNR5tkD`
- **Locked price / storefrontEligible / attachments:** $0 / False / 0
- **Locked attachments:** _(none)_
- **Other matching CPs searched (selected):**
  - `iJtyig611AZEDBGdvRd9` BPC-157/TB500 · $169 · atts=2 · storefront=True
  - `afROXeaudxZUdh0Y1Qfc` BPC-157 Gut & Recovery Protocol (Oral Capsules) · $0 · atts=0 · storefront=False
  - `NTN40APqv0NQokAGmuyg` BPC-157 Recovery Protocol (Oral Capsule) · $0 · atts=0 · storefront=False
  - `cDX2WRgzavWG4IhRLpXM` Peptides – BPC-157 (Oral) · $0 · atts=0 · storefront=False
- **Where intended medication is actually found:**
  - {"productId": "iJtyig611AZEDBGdvRd9", "name": "BPC-157/TB500", "medication": "BPC-157 / TB500 Capsules", "medicationId": "SLBdNaBijUHmDFSohdaM", "pharmacy": "Greenwich Pharmacy", "note": "Only capsule-titled Wolverine/BPC-TB medication in live formulary is attached to the INJECTION CP, not the Wolverine capsule CP."}
- **DIAGNOSIS:** `OWNER_CHANGE_VISIBLE_ON_DIFFERENT_CP`
- **Recommended next action:** Capsule medication appears on injection CP (iJtyig…). Move/attach capsule medication onto Wolverine capsule CP (omhh3N…). Do not treat injection CP as the capsule backend.

### Wolverine Injection

- **Website variant:** `wolverine-injection`
- **Current locked CP:** `iJtyig611AZEDBGdvRd9` — BPC-157/TB500
- **Locked clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_iJtyig611AZEDBGdvRd9`
- **Locked price / storefrontEligible / attachments:** $169 / True / 2
- **Locked attachments:**
  - BPC-157 / TB500 · Greenwich Pharmacy · `27WtrIdo3z4Ssj5sDcc6`
  - BPC-157 / TB500 Capsules · Greenwich Pharmacy · `SLBdNaBijUHmDFSohdaM`
- **Other matching CPs searched (selected):**
  - `omhh3NabouO8AsNR5tkD` Wolverine – BPC-157 + TB-500 Recovery Protocol · $0 · atts=0 · storefront=False
  - `TQBv1oBNGfwIGY8ypl86` BPC-157 Recovery Protocol (Injectable) · $0 · atts=0 · storefront=False
  - `f8iFGqOGRXlFbjSiyVU1` Peptides – BPC-157 (Injectable) · $0 · atts=0 · storefront=False
- **Where intended medication is actually found:**
  - {"note": "Compatible injection medication “BPC-157 / TB500” IS on the expected injection CP."}
  - {"note": "Claimed correction (remove capsule) is NOT reflected — capsule medication remains on the same CP."}
- **DIAGNOSIS:** `OWNER_CHANGE_NOT_FOUND_ANYWHERE`
- **Diagnosis note:** Applies to the claimed removal of capsule medication. Injection-compatible med already present on expected CP.
- **Recommended next action:** On injection CP iJtyig… remove “BPC-157 / TB500 Capsules”. Keep injection medication. Capsule belongs on omhh3N…

### Minoxidil

- **Website variant:** `minoxidil-fin-minox-0.1-5`
- **Current locked CP:** `BboYS4a2Uj7APetrFo6W` — Hair Loss – Dual Combo (Finasteride/Minoxidil)
- **Locked clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_BboYS4a2Uj7APetrFo6W`
- **Locked price / storefrontEligible / attachments:** $0 / False / 0
- **Locked attachments:** _(none)_
- **Other matching CPs searched (selected):**
  - `Raw7mUkuzzhVdAo88jpL` Hair Loss – Minoxidil (Topical) · $0 · atts=11 · storefront=True
  - `489YrehNXRlL77fYPkOn` GHK-Cu / Minoxidil Topical Combo · $69 · atts=1 · storefront=True
  - `7sX9dhAxA6i21Jg1swrK` Hair Loss – Triple Combo (Finasteride/Minoxidil/Tretinoin) · $0 · atts=0 · storefront=False
  - `M5oNllXUu1ikySSuXIR0` Hair Loss – Minoxidil (Oral) · $0 · atts=0 · storefront=False
- **Where intended medication is actually found:**
  - {"productId": "Raw7mUkuzzhVdAo88jpL", "name": "Hair Loss – Minoxidil (Topical)", "medications": [{"name": "Finasteride / Minoxidil (PER ML) 0.1 / 5 %", "pharmacy": "Vios", "medicationId": "9qNwEbSAfgVxUjuy3mNg"}, {"name": "Finasteride / Minoxidil (PER ML) 0.1 / 5 %", "pharmacy": "Vios", "medicationId": "R1KXXsuKlENVt3rnHUTI"}], "also_has": "0.1/10%, 0.1/7%, Fin/Minox/Tretinoin blends, plain Minoxidil 2/10/15%", "note": "Intended Vios Fin/Minox 0.1%/5% is attached here, NOT on Dual Combo BboYS…"}
- **DIAGNOSIS:** `OWNER_CHANGE_VISIBLE_ON_DIFFERENT_CP`
- **ROUTING_TARGET_REVIEW_REQUIRED:** `BboYS4a2Uj7APetrFo6W` → review `Raw7mUkuzzhVdAo88jpL` (**do not change yet**)
- **Recommended next action:** OWNER REVIEW before any redo: either (A) keep Dual Combo BboYS… as locked target and attach/move Vios 0.1%/5% there (and set price $79), or (B) approve retargeting website minoxidil-fin-minox-0.1-5 → Raw7m… after cleaning extras. Do NOT use GHK-Cu/Minoxidil. Do NOT change routing in this diagnostic run.

### Progesterone IR

- **Website variant:** `prog-ir-r41…r49 (shared CP)`
- **Current locked CP:** `5dGkjdpLP7DkKKE2iVxh` — Women's Hormones (HRT) – Progesterone
- **Locked clientProductId:** `f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_5dGkjdpLP7DkKKE2iVxh`
- **Locked price / storefrontEligible / attachments:** $79 / True / 14
- **Locked attachments:**
  - Pregnenolone IR · Vios · `LHAilcdBK0wULcdmoJVl`
  - Progesterone · Vios · `QbXdjaowZ1w0Ohc7RgB7`
  - Progesterone · Vios · `Z9joueirLKsW5uD8LkPg`
  - Progesterone · Vios · `tiJV7uCEsWhM2TOOycHF`
  - Progesterone IR · Vios · `DsXWglQ4j9epTGms7D5x`
  - Progesterone IR · Vios · `YT2RkB7DvqWxUnXfySDc`
  - Progesterone IR · Vios · `ZIAWU7zBZHPrezBdiexZ`
  - Progesterone IR · Vios · `dAWcMgzf6d7OH1JyKlEw`
  - Progesterone IR · Vios · `q21bosU7qNA9YLfqLnQH`
  - Progesterone IR (DYE-FREE)(Lactose-free) (M NEW) · Vios · `A4fU56tPD0DJTPPyUT3K`
  - Progesterone SR (DYE-FREE) · Vios · `NRZXW0LomEaoyN5oA3WO`
  - Progesterone SR (DYE-FREE) · Vios · `ORLfICIf7sgo1WTdXvEM`
  - Progesterone SR (DYE-FREE)(Lactose FREE) · Vios · `KleUHs9VxvMycdhX0Z14`
  - Progesterone SR (DYE-FREE)(Lactose FREE) · Vios · `xrMRDAQr9if9OrehgcH6`
- **Other matching CPs searched (selected):**
  - `Fu7uvywkCFT9R8t71BGf` Women's Hormones (HRT) – Progesterone Suppository · $0 · atts=0 · storefront=False
  - `AVNvVWBE98DfINxyz5Dm` Women's Hormones (HRT) – BiEst / Progesterone / Testosterone Combo Cream · $0 · atts=0 · storefront=False
  - `9MVuV5RWKZVFXorgD10h` Women's Hormones (HRT) – BiEst / Progesterone Combo Cream · $0 · atts=0 · storefront=False
- **Where intended medication is actually found:**
  - {"note": "Compatible Progesterone / Progesterone IR medications ARE on the locked CP."}
  - {"note": "Pregnenolone IR and Progesterone SR attachments remain on the same CP — claimed removals not visible."}
  - {"note": "No other GEN CP contains a clean IR-only Progesterone set."}
- **DIAGNOSIS:** `OWNER_CHANGE_NOT_FOUND_ANYWHERE`
- **Diagnosis note:** Applies to claimed removal of Pregnenolone/SR. IR options already present on expected CP.
- **Recommended next action:** On locked CP 5dGkjdp… remove Pregnenolone IR and all Progesterone SR rows. Keep multiple IR strengths. No alternate clean IR CP found to retarget.

## Cross-cutting answers

### Are Scriptful Products and the audited GEN Client Products the same data layer?

**UNKNOWN**

- In-repo “Scriptful” ≠ GEN Client Product.
- Owner “Scriptful / GEN Products” most likely means GEN Products admin.
- Live API exposes Client Products + formulary pairings only; no separate Scriptful Product resource found.

### Does our current API prove that the owner’s Scriptful edits did not save?

**NO**

Edits may have saved on **different Client Products** than the website-locked IDs. That is visible in live formulary data (especially Minoxidil → `Raw7m…`, TIR options → GLP-2 Any Dose `SvFDJ7…`, Wolverine capsule med → injection CP `iJtyig…`).

### Do any website routing targets appear to be wrong?

**YES** (review only — **not changed** this run):

| Website variant | Old locked CP | Proposed CP for review only |
|---|---|---|
| `minoxidil-fin-minox-0.1-5` | `BboYS4a2Uj7APetrFo6W` Dual Combo | `Raw7mUkuzzhVdAo88jpL` Minoxidil Topical |

Do **not** retarget TIR membership to GLP-2 Any Dose `SvFDJ7…` (wrong class / price / forbidden reuse).

### Does the owner actually need to redo any manual pairings?

Only after reading diagnoses:

- **SEM Mid B12:** No Mid B12 attachments found on locked or alternate Mid-titled CP.
- **SEM Membership:** Membership CP still has 0 attachments; dose-group CPs are not substitutes.
- **TIR Membership:** Intended TIR B12/Glycine options are on GLP-2 Any Dose CP, not membership CP — attach to E3MXZe… (do not reuse GLP-2 as membership).
- **Wolverine Capsule + Injection:** Capsule med is on injection CP; capsule CP empty; remove capsule from injection CP / attach on capsule CP.
- **Progesterone IR:** Pregnenolone + SR still on locked CP; remove them (IR already present).
- **Minoxidil:** OWNER REVIEW FIRST — intended meds on Raw7m…; decide retarget vs move to Dual Combo before redo.

### Next 13 create set

**UNCHANGED** — TIR×8 + Estradiol patches×4 + NAD r85×1 remain create-preflight; membership pairing confusion does not replace TIR one-time creates.

## Safety

- GEN modified: **NO**
- Pairings modified: **NO**
- Website routing modified: **NO**
- genPairingVerified modified: **NO**
- New GEN products created: **0**
- Published: **NO**
- Cutover: **OFF**
- PR #19: **OPEN / NOT MERGED**

**STOP FOR OWNER REVIEW.**

