# MBM GEN Backend Completion 1

**Phase:** `MBM-GEN-BACKEND-COMPLETION-1`  
**Generated:** `2026-08-25T07:43:00Z`  
**Authority:** Owner-approved `docs/MBM_OWNER_SET_FINAL_ROUTING_PREFLIGHT.md`

## Phase 1 — AGENTS.md

Updated with locked family/selector architecture, provider-selection policy, MBM pricing authority ($149 SEM / $275 TIR), TIR SvFDJ7 collapse, owner 22 working set, and PR #19 open/not-merged publish/cutover gates.

## Phase 2–3 — Creates & repairs executed

### Live dedupe

- Estradiol patches: **0** existing patch CPs (vaginal CPs not reused)
- NAD r85: **no** compatible 200mg/ml CP (r84 kept separate)
- Wolverine Capsule: empty BPC-only shells **not** appropriate → **CREATE**
- Minoxidil Dual: existing empty `BboYS4…` Dual Combo shell → **REUSE** (no duplicate CREATE)

### NEW GEN CPs created (6)

| Key | GEN Product ID | Display name | Price |
|---|---|---|---:|
| estradiol-patch-r26 | `rziDZ07sJzDMXpdTvPcL` | Estradiol Transdermal Patch 0.025mg/hr (8 count) | $119 |
| estradiol-patch-r27 | `fxHkYJjkwqydini7s157` | Estradiol Transdermal Patch 0.0375mg/hr (8 count) | $129 |
| estradiol-patch-r28 | `BUKqtZJ3GDGMgBxJY0hM` | Estradiol Transdermal Patch 0.05mg/hr (8 count) | $139 |
| estradiol-patch-r29 | `T4kMQnbixxDm7f0Ptjtq` | Estradiol Transdermal Patch 0.1mg/hr (8 count) | $149 |
| nad-nasal-r85 | `3KnF8Ll7XPm7Vk0lr4Li` | NAD + Nasal Spray 200mg/ml · 15ml | $109 |
| wolverine-capsule | `RaEueocVyzaAOzXvRFwC` | Wolverine / BPC-TB Capsules | $29 |

### Metadata repairs (6) — pairing removals still manual

| Key | Product ID | API |
|---|---|---|
| tir-svfdj7-rename | `SvFDJ7W4nmWL2bkLUMMS` | OK |
| sem-mid-b12-nf825 | `NF825utCtjVqbbGsnQN3` | OK |
| nad-r84-price | `FVwkzvQqWIZRNAwbslGw` | OK |
| wolverine-injection-meta | `iJtyig611AZEDBGdvRd9` | OK |
| minoxidil-dual-bboys-reuse | `BboYS4a2Uj7APetrFo6W` | OK |
| progesterone-rename | `5dGkjdpLP7DkKKE2iVxh` | OK |

**Note:** Client Products API **cannot** attach/remove formulary medications. 3-PACK removal, capsule split, Dual Combo attach, Estradiol/NAD r85/Wolverine capsule pairings, Fat Burner triple, and Progesterone cleanup require **manual GEN admin**.

### Not created

- TIR tier CPs: **0** (SvFDJ7 single backend)
- Fat Burner: **0** — FORMULARY_PENDING (no non-Ipamorelin triple to attach)
- NAD Injection 100mg/mL: **0** — FORMULARY_PENDING
- Minoxidil Dual new CP: **0** — reused `BboYS4…`

## Phase 4 — Owner pairing handoff

| GEN PRODUCT NAME | GEN PRODUCT ID | DIRECT GEN URL | SELECT THIS MEDICATION | PHARMACY | REMOVE THESE | DO NOT SELECT | EXPECTED END STATE |
|---|---|---|---|---|---|---|---|
| Tirzepatide Injection — Any Dose (B12/Glycine) | `SvFDJ7W4nmWL2bkLUMMS` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SvFDJ7W4nmWL2bkLUMMS | Keep Dirx Tirzepatide + Vitamin B12 and Tirzepatide + Glycine strength options (provider chooses) | Dirx-Hub | Tirzepatide + Glycine (3 PACK)) | B6 / Pyridoxine; Semaglutide; unrelated blends | ≥1 TIR+B12 and ≥1 TIR+Glycine compatible options; no 3-PACK; then pairing-verify all TIR website selectors |
| Semaglutide Injection — Mid (B12) | `NF825utCtjVqbbGsnQN3` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_NF825utCtjVqbbGsnQN3 | Already has Dirx Semaglutide + Vitamin B12 (keep) | Dirx-Hub | — | Glycine-only; B6; Greenwich SEM if present | LIVE VERIFIED — ROUTING_READY (metadata repaired) |
| NAD + Nasal Spray 50mg/ml · 15ml | `FVwkzvQqWIZRNAwbslGw` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_FVwkzvQqWIZRNAwbslGw | Keep St Luke NAD+ nasal options for r84 | St Luke | — | 200mg/ml r85 (belongs on separate CP); Injection NAD | LIVE VERIFIED — ROUTING_READY (price repaired to $79) |
| NAD + Nasal Spray 200mg/ml · 15ml | `3KnF8Ll7XPm7Vk0lr4Li` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_3KnF8Ll7XPm7Vk0lr4Li | St Luke NAD+ 200mg/ml nasal 15ml (r85) | St Luke | — | 50mg/ml r84; NAD Injection; 200mg/mL injection substitute | ≥1 compatible r85 nasal medication; empty until owner pairs |
| Wolverine / BPC-TB Injection | `iJtyig611AZEDBGdvRd9` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_iJtyig611AZEDBGdvRd9 | Keep BPC-157 / TB500 injectable | Greenwich Pharmacy | BPC-157 / TB500 Capsules | Capsule-only products; plain BPC without TB500 if not Wolverine | Injectable only on this CP |
| Wolverine / BPC-TB Capsules | `RaEueocVyzaAOzXvRFwC` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_RaEueocVyzaAOzXvRFwC | BPC-157 / TB500 Capsules (Greenwich) | Greenwich Pharmacy | — | Injectable BPC/TB500; plain BPC capsule gut protocols | Capsule med(s) only; empty until owner pairs |
| Finasteride/Minoxidil 0.1%/5% Dual Combo | `BboYS4a2Uj7APetrFo6W` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_BboYS4a2Uj7APetrFo6W | Vios Finasteride / Minoxidil (PER ML) 0.1 / 5 % only | Vios | — | 0.1/7%; 0.1/10%; Tretinoin blends; plain Minoxidil; GHK-Cu 489Yreh | Only 0.1%/5% Vios attached; empty until owner pairs |
| Progesterone IR (shared strengths) | `5dGkjdpLP7DkKKE2iVxh` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_5dGkjdpLP7DkKKE2iVxh | Keep Progesterone IR options (multiple strengths OK) | (existing IR pharmacies) | Pregnenolone IR; Progesterone SR (DYE-FREE); Progesterone SR (DYE-FREE)(Lactose FREE) | SR as primary IR route; Pregnenolone | IR only; provider chooses strength |
| AOD-9604 / MOTS-C / Tesamorelin Injection (Fat Burner) | `7Kix55LA15U0lNvY9QXI` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_7Kix55LA15U0lNvY9QXI | AOD + MOTS-c + Tesamorelin WITHOUT Ipamorelin (when pharmacy sources) | Optimal Balance (or approved source) | AOD 9604 alone if replacing with full triple | AOD/MOTS/Tes/Ipamorelin quad (yearpPa); Ipamorelin | FORMULARY_PENDING until triple without Ipamorelin exists to attach |
| Estradiol Transdermal Patch 0.025mg/hr (8 count) | `rziDZ07sJzDMXpdTvPcL` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_rziDZ07sJzDMXpdTvPcL | ESTRADIOL TRANSDERMAL PATCH 0.025mg/hr 8 count | Valiant | — | Vaginal Estradiol CPs o7dNtf… / 5yKBz…; other strengths on wrong CP | Exactly that patch row paired; website price $119; empty until owner pairs |
| Estradiol Transdermal Patch 0.0375mg/hr (8 count) | `fxHkYJjkwqydini7s157` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_fxHkYJjkwqydini7s157 | ESTRADIOL TRANSDERMAL PATCH 0.0375mg/hr 8 count | Valiant | — | Vaginal Estradiol CPs o7dNtf… / 5yKBz…; other strengths on wrong CP | Exactly that patch row paired; website price $129; empty until owner pairs |
| Estradiol Transdermal Patch 0.05mg/hr (8 count) | `BUKqtZJ3GDGMgBxJY0hM` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_BUKqtZJ3GDGMgBxJY0hM | ESTRADIOL TRANSDERMAL PATCH 0.05mg/hr 8 count | Valiant | — | Vaginal Estradiol CPs o7dNtf… / 5yKBz…; other strengths on wrong CP | Exactly that patch row paired; website price $139; empty until owner pairs |
| Estradiol Transdermal Patch 0.1mg/hr (8 count) | `T4kMQnbixxDm7f0Ptjtq` | https://app.genhealthehr.com/f5e0mdyBYnDh7HGvek0C/product/f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_T4kMQnbixxDm7f0Ptjtq | ESTRADIOL TRANSDERMAL PATCH 0.1mg/hr 8 count | Valiant | — | Vaginal Estradiol CPs o7dNtf… / 5yKBz…; other strengths on wrong CP | Exactly that patch row paired; website price $149; empty until owner pairs |

## Phase 5 — Website routing data

- Updated `families.generated.json` / `.ts` with real GEN IDs
- Registry verified count: **9** (added SEM Mid `NF825…`)
- `ROUTING_READY`: **10** (8 SEM dose + membership + NAD r84)
- TIR mapped to `SvFDJ7…` but **not** pairing-verified until 3-PACK removed
- New CPs / Dual Combo / Wolverine inj: `GEN_PAIRING_PENDING`
- Fat Burner / NAD Injection: `FORMULARY_PENDING` (no invented activation)
- Cutover flags remain **OFF**; patient UI still must not expose GEN IDs

## Final report

```
OWNER WORKING SET: 22
TIR SINGLE BACKEND: YES
TIR NEW CPS CREATED: 0
ESTRADIOL CPS CREATED: 4 / 4
NAD NASAL CPS CREATED: 1 / 1
WOLVERINE CAPSULE CPS CREATED: 1 / 1
MINOXIDIL CPS CREATED: 0 / 1 (REUSED existing Dual Combo shell BboYS4)
TOTAL NEW GEN CPS CREATED: 6 / maximum 7
GEN CPS REPAIRED: 6
MANUAL PAIRINGS STILL REQUIRED: 11
PAIRINGS LIVE VERIFIED: 9
ROUTING READY: 10
FORMULARY PENDING: 14
FUTURE HIDDEN: 51
NAD INJECTION 100MG ML: FORMULARY_PENDING
FAT BURNER: FORMULARY_PENDING
WEBSITE FAMILY UX READY: YES
WEBSITE ROUTING CODE READY: YES
GEN BACKEND READY: NO
READY FOR FINAL STOREFRONT CUTOVER QA: NO
REAL GEN ORDERS: OFF
WEBSITE PUBLISHED: NO
CUTOVER: OFF
LEGACY B6: UNCHANGED
PR19: OPEN / NOT MERGED
```

## Validation

| Check | Result |
|---|---|
| TYPECHECK | PASS |
| TESTS | PASS (43 files / 531 tests) |
| BUILD | PASS |

**STOP before storefront publication/cutover.**

