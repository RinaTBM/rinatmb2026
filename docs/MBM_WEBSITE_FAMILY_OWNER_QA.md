# MBM Website Family Owner QA

> **Mode:** QA / verification only. Do **not** publish. Legacy production store unchanged. GEN/Whop cutover OFF. Real GEN orders OFF.

Generated: `2026-08-25T01:59:22Z` · Phase: `MBM-WEBSITE-GEN-QA-1`

## How to use

1. Open preview: `/preview/families` (focus families) or `/preview/families/:familyId` for any of the 30 families.
2. Confirm each family reads as **one** product with selectors only for choices that matter.
3. Confirm patients never see GEN IDs, pharmacy/formulary internals, or routing-status jargon in the eventual cutover UI.
4. Record pairing confirmation separately in `docs/MBM_GEN_PAIRING_VERIFICATION_CHECKLIST.md` — do **not** set `genPairingVerified=true` until exact GEN formulary attachment is confirmed.

## Family UX rule

- Customer sees **one** clean product family, then selectors.
- Do **not** expose: GEN IDs, pharmacy names (unless intentional), formulary rows, internal backend names, `GEN_PAIRING_PENDING`, technical routing language.

| Family | Selectors |
|---|---|
| NAD+ | Delivery Method → Injection / Nasal Spray → size/strength |
| Semaglutide | Purchase Type → Formulation → Dose/Tier |
| Tirzepatide | Purchase Type → Formulation → Dose/Tier |
| Wolverine | Delivery Method → Capsule / Injection |

## Focus family structure QA

| Family | Result |
|---|---|
| Semaglutide | **PASS** |
| Tirzepatide | **PASS** |
| NAD+ | **PASS** |
| Wolverine | **PASS** |

### Semaglutide checklist

- [ ] ONE-TIME B12: Starting / Low, Mid, High, Any Dose
- [ ] ONE-TIME Glycine: Starting / Low, Mid, High, Any Dose
- [ ] MEMBERSHIP $149/month (single card — no separate B12/Glycine membership cards)
- [ ] No B6 in new preview architecture (legacy B6 remains on live store until cutover)
- [ ] Every option has price, websiteVariantId, routing status, and GEN id when available

### Tirzepatide checklist

- [ ] ONE-TIME B12/Glycine: Starting / Low (5+10), Mid (15+20), High (25+30), Any Dose (5–30)
- [ ] MEMBERSHIP $275/month
- [ ] No B6 in preview architecture
- [ ] Legacy website $249 untouched until cutover
- [ ] One-time GEN CPs still CREATE/BLOCKED (no invented IDs) — expected

### NAD+ checklist

- [ ] ONE family: Delivery Method Injection / Nasal Spray
- [ ] Injection 100mg/mL FORMULARY_PENDING — **do not** substitute 200mg/mL
- [ ] Nasal r84 = $79, r85 = $109 (may route to separate GEN CPs)
- [ ] No separate NAD+ product cards; r81/r82 stay FUTURE_HIDDEN

### Wolverine checklist

- [ ] ONE family: Capsule ($29) + Injection ($159)
- [ ] Independent GEN routes
- [ ] Not two storefront cards

## Protections

- **FUTURE_HIDDEN:** 51 variants excluded from `listPatientVisibleVariants` (incl. PT-141 Nasal, Scream Cream, Selank/Semax nasal, etc.).
- **FORMULARY_PENDING:** 14 variants — null GEN id, gate blocks live submission, no fallback mapping.
- **Routing gate:** `src/lib/catalog/familyRoutingGate.ts` — browser cannot bypass server-side gate.

## Routing gate matrix (expected)

| Condition | Expected |
|---|---|
| GEN id present + `genPairingVerified=false` | BLOCKED |
| GEN id present + `genPairingVerified=true` | Structurally eligible, but cutover/real-order flags still block |
| FORMULARY_PENDING | BLOCKED |
| FUTURE_HIDDEN | BLOCKED |
| BLOCKED | BLOCKED |

## Safe verification update (later)

Source of truth after owner confirmation:

1. Check the box in `docs/MBM_GEN_PAIRING_VERIFICATION_CHECKLIST.md`
2. Add the GEN `clientProductId` to `src/data/websiteFamilies/pairingVerificationRegistry.ts`
3. Run / use `applyPairingVerification` to set `genPairingVerified=true` **only** on matching variants in `families.generated.ts` / `.json`

**This phase:** registry empty · all `genPairingVerified=false` · do not auto-verify.

## All 30 families

| Family | Preview | Live/Future | Variants | Price | Selectors | GEN ID | Pairing | Owner status |
|---|---|---|---:|---|---|---|---|---|
| Semaglutide | `/preview/families/semaglutide` | MIXED | 11 | OK | OK | 9 of 11 have GEN id | 9 unverified | **NEEDS_REVIEW** |
| Tirzepatide | `/preview/families/tirzepatide` | CURRENT | 10 | OK | OK | 1 of 10 have GEN id | 1 unverified | **NEEDS_REVIEW** |
| NAD+ | `/preview/families/nad` | MIXED | 7 | OK | OK | 1 of 7 have GEN id | 1 unverified | **NEEDS_REVIEW** |
| Wolverine / BPC-TB | `/preview/families/wolverine-bpc-tb` | CURRENT | 2 | OK | OK | 2 of 2 have GEN id | 2 unverified | **NEEDS_REVIEW** |
| Minoxidil | `/preview/families/minoxidil` | MIXED | 4 | OK | OK | 1 of 4 have GEN id | 1 unverified | **NEEDS_REVIEW** |
| Estradiol | `/preview/families/estradiol` | MIXED | 8 | OK | OK | NONE (expected) | N/A | **NEEDS_REVIEW** |
| Progesterone | `/preview/families/progesterone` | MIXED | 12 | OK | OK | 9 of 12 have GEN id | 9 unverified | **NEEDS_REVIEW** |
| Tretinoin | `/preview/families/tretinoin` | MIXED | 5 | OK | OK | NONE (expected) | N/A | **FORMULARY_PENDING** |
| Fat Burner | `/preview/families/fat-burner` | CURRENT | 1 | OK | OK | NONE (expected) | N/A | **FORMULARY_PENDING** |
| Testosterone | `/preview/families/testosterone` | MIXED | 3 | OK | OK | NONE (expected) | N/A | **FORMULARY_PENDING** |
| Selank | `/preview/families/selank` | MIXED | 2 | OK | OK | NONE (expected) | N/A | **FORMULARY_PENDING** |
| Semax | `/preview/families/semax` | MIXED | 2 | OK | OK | NONE (expected) | N/A | **FORMULARY_PENDING** |
| Selank + Semax Blend | `/preview/families/selank-semax-blend` | CURRENT | 1 | OK | OK | NONE (expected) | N/A | **FORMULARY_PENDING** |
| Tesamorelin | `/preview/families/tesamorelin` | CURRENT | 1 | OK | OK | NONE (expected) | N/A | **FORMULARY_PENDING** |
| Lash / Brow Growth Serum | `/preview/families/lash-brow` | CURRENT | 1 | OK | OK | NONE (expected) | N/A | **FORMULARY_PENDING** |
| PT-141 | `/preview/families/pt-141` | FUTURE | 3 | OK | OK | NONE (expected) | N/A | **FUTURE_HIDDEN** |
| Glutathione | `/preview/families/glutathione` | FUTURE | 2 | OK | OK | NONE (expected) | N/A | **FUTURE_HIDDEN** |
| GHK-Cu | `/preview/families/ghk-cu` | FUTURE | 4 | OK | OK | NONE (expected) | N/A | **FUTURE_HIDDEN** |
| MOTS-c | `/preview/families/mots-c` | FUTURE | 1 | OK | OK | NONE (expected) | N/A | **FUTURE_HIDDEN** |
| Thymosin Alpha-1 | `/preview/families/thymosin-a1` | FUTURE | 1 | OK | OK | NONE (expected) | N/A | **FUTURE_HIDDEN** |
| Dihexa | `/preview/families/dihexa` | FUTURE | 2 | OK | OK | NONE (expected) | N/A | **FUTURE_HIDDEN** |
| Methylene Blue | `/preview/families/methylene-blue` | FUTURE | 4 | OK | OK | NONE (expected) | N/A | **FUTURE_HIDDEN** |
| Custom HRT Cream | `/preview/families/hrt-custom-cream` | FUTURE | 4 | OK | OK | NONE (expected) | N/A | **FUTURE_HIDDEN** |
| Custom Hormone Troche | `/preview/families/hrt-custom-troche` | FUTURE | 4 | OK | OK | NONE (expected) | N/A | **FUTURE_HIDDEN** |
| Sildenafil / Testosterone Troche | `/preview/families/sildenafil-testosterone-troche` | FUTURE | 1 | OK | OK | NONE (expected) | N/A | **FUTURE_HIDDEN** |
| BPC Triple / Quad Blends | `/preview/families/bpc-advanced-blends` | FUTURE | 3 | OK | OK | NONE (expected) | N/A | **FUTURE_HIDDEN** |
| MOTS-c / Tesamorelin | `/preview/families/mots-tes` | FUTURE | 1 | OK | OK | NONE (expected) | N/A | **FUTURE_HIDDEN** |
| Oxytocin | `/preview/families/oxytocin` | CURRENT | 1 | OK | OK | NONE (expected) | N/A | **FORMULARY_PENDING** |
| Sexual Wellness Compound | `/preview/families/sexual-wellness-compound` | CURRENT | 1 | OK | OK | NONE (expected) | N/A | **FORMULARY_PENDING** |
| Scream Cream | `/preview/families/scream-cream` | FUTURE | 1 | OK | OK | NONE (expected) | N/A | **FUTURE_HIDDEN** |

### Per-family notes

**Semaglutide** (`semaglutide`)
- Structure PASS. Owner must still confirm GEN formulary pairings before ROUTING_READY.
- Legacy B6 variant retained as BLOCKED/internal only; excluded from patient-visible selectors.

**Tirzepatide** (`tirzepatide`)
- Structure PASS. Owner must still confirm GEN formulary pairings before ROUTING_READY.
- One-time TIR CPs not created yet (BLOCKED, no invented IDs). Membership $275 has GEN id.
- Legacy B6 variant retained as BLOCKED/internal only; excluded from patient-visible selectors.

**NAD+** (`nad`)
- Structure PASS. Owner must still confirm GEN formulary pairings before ROUTING_READY.
- Injection 100mg/mL FORMULARY_PENDING; nasal r84 GEN_PAIRING_PENDING; r85 BLOCKED (CREATE pending).

**Wolverine / BPC-TB** (`wolverine-bpc-tb`)
- Structure PASS. Owner must still confirm GEN formulary pairings before ROUTING_READY.

**Progesterone** (`progesterone`)
- Preview index lists focus families only — open via /preview/families/progesterone

**Tretinoin** (`tretinoin`)
- Preview index lists focus families only — open via /preview/families/tretinoin

**Fat Burner** (`fat-burner`)
- Preview index lists focus families only — open via /preview/families/fat-burner

**Testosterone** (`testosterone`)
- Preview index lists focus families only — open via /preview/families/testosterone

**Selank** (`selank`)
- Preview index lists focus families only — open via /preview/families/selank

**Semax** (`semax`)
- Preview index lists focus families only — open via /preview/families/semax

**Selank + Semax Blend** (`selank-semax-blend`)
- Preview index lists focus families only — open via /preview/families/selank-semax-blend

**Tesamorelin** (`tesamorelin`)
- Preview index lists focus families only — open via /preview/families/tesamorelin

**Lash / Brow Growth Serum** (`lash-brow`)
- Preview index lists focus families only — open via /preview/families/lash-brow

**PT-141** (`pt-141`)
- All variants FUTURE_HIDDEN — not purchasable in patient-visible catalog.
- Preview index lists focus families only — open via /preview/families/pt-141

**Glutathione** (`glutathione`)
- All variants FUTURE_HIDDEN — not purchasable in patient-visible catalog.
- Preview index lists focus families only — open via /preview/families/glutathione

**GHK-Cu** (`ghk-cu`)
- All variants FUTURE_HIDDEN — not purchasable in patient-visible catalog.
- Preview index lists focus families only — open via /preview/families/ghk-cu

**MOTS-c** (`mots-c`)
- All variants FUTURE_HIDDEN — not purchasable in patient-visible catalog.
- Preview index lists focus families only — open via /preview/families/mots-c

**Thymosin Alpha-1** (`thymosin-a1`)
- All variants FUTURE_HIDDEN — not purchasable in patient-visible catalog.
- Preview index lists focus families only — open via /preview/families/thymosin-a1

**Dihexa** (`dihexa`)
- All variants FUTURE_HIDDEN — not purchasable in patient-visible catalog.
- Preview index lists focus families only — open via /preview/families/dihexa

**Methylene Blue** (`methylene-blue`)
- All variants FUTURE_HIDDEN — not purchasable in patient-visible catalog.
- Preview index lists focus families only — open via /preview/families/methylene-blue

**Custom HRT Cream** (`hrt-custom-cream`)
- All variants FUTURE_HIDDEN — not purchasable in patient-visible catalog.
- Preview index lists focus families only — open via /preview/families/hrt-custom-cream

**Custom Hormone Troche** (`hrt-custom-troche`)
- All variants FUTURE_HIDDEN — not purchasable in patient-visible catalog.
- Preview index lists focus families only — open via /preview/families/hrt-custom-troche

**Sildenafil / Testosterone Troche** (`sildenafil-testosterone-troche`)
- All variants FUTURE_HIDDEN — not purchasable in patient-visible catalog.
- Preview index lists focus families only — open via /preview/families/sildenafil-testosterone-troche

**BPC Triple / Quad Blends** (`bpc-advanced-blends`)
- All variants FUTURE_HIDDEN — not purchasable in patient-visible catalog.
- Preview index lists focus families only — open via /preview/families/bpc-advanced-blends

**MOTS-c / Tesamorelin** (`mots-tes`)
- All variants FUTURE_HIDDEN — not purchasable in patient-visible catalog.
- Preview index lists focus families only — open via /preview/families/mots-tes

**Oxytocin** (`oxytocin`)
- Preview index lists focus families only — open via /preview/families/oxytocin

**Sexual Wellness Compound** (`sexual-wellness-compound`)
- Preview index lists focus families only — open via /preview/families/sexual-wellness-compound

**Scream Cream** (`scream-cream`)
- All variants FUTURE_HIDDEN — not purchasable in patient-visible catalog.
- Preview index lists focus families only — open via /preview/families/scream-cream

## Owner review items (non-blocking)

- `OTHER` — False
- `OTHER` — False
- `OTHER` — False

## Final report

```
FAMILIES_QA'D: 30
VARIANTS_QA'D: 103
FAMILY_UX_ISSUES: 0
PRICE_ISSUES: 0
SELECTOR_ISSUES: 0
ROUTING_ISSUES: 0
DUPLICATE_VARIANTS: 0
COPY_ISSUES: 0
GEN_CLIENT_PRODUCTS_TO_MANUALLY_VERIFY: 15
WEBSITE_VARIANTS_COVERED_BY_THOSE_GEN_CPS: 23
genPairingVerified_TRUE: 0
genPairingVerified_FALSE: 23
ROUTING_READY: 0
GEN_PAIRING_PENDING: 23
FORMULARY_PENDING: 14
FUTURE_HIDDEN: 51
BLOCKED: 15
SEM_FAMILY_QA: PASS
TIR_FAMILY_QA: PASS
NAD_FAMILY_QA: PASS
WOLVERINE_FAMILY_QA: PASS
PAIRING_VERIFICATION_CHECKLIST_CREATED: YES
SAFE_VERIFICATION_UPDATE_MECHANISM_PREPARED: YES
REAL_GEN_ORDER_SUBMISSION: OFF
LEGACY_PRODUCTION_STORE: UNCHANGED
WEBSITE_CUTOVER: OFF
GEN_WHOP_CUTOVER: OFF
GEN_MODIFIED: NO
PAIRINGS_MODIFIED: NO
```

**STOP FOR OWNER QA + MANUAL GEN PAIRING VERIFICATION. DO NOT PUBLISH.**
