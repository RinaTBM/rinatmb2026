# MBM GEN Final Manual Fix Plan

**Owner manual GEN admin actions only.** This agent run does **not** modify GEN, pairings, website routing, or registry.

Generated: `2026-08-25T05:56:59Z`

Authority:
- Diagnostic: `docs/MBM_GEN_SCRIPTful_PAIRING_DISCREPANCY_DIAGNOSTIC.md`
- Policy: `docs/MBM_GEN_PAIRING_POLICY_AMENDMENT_1.md` (≥1 compatible + no material mismatch; multi-strength OK)

## Safety locks

- GEN modified: **NO** (this run)
- Pairings modified: **NO** (this run)
- Website routing modified: **NO**
- New GEN products created: **0**
- Published: **NO** · Cutover: **OFF** · PR #19: **OPEN / NOT MERGED**
- GLP-2 TIR product used for membership: **NO**
- Next 13 create set: **UNCHANGED**

## Click-by-click — 6 direct fixes

| PRODUCT | GEN CP | SELECT / ATTACH | REMOVE | KEEP | EXPECTED RESULT |
|---|---|---|---|---|---|
| SEM Mid B12 | `BLf8inX395YNc7WPCD4O`<br>Semaglutide Injection — Mid (B12)<br>$109 | Dirx **Semaglutide + Vitamin B12** (≥1). Multi strengths OK. Prefer Mid/~4mg vial if labeled in UI. | Glycine-only · B6 · Greenwich SEM+B12 · unrelated | Compatible Dirx SEM+B12 options on **this** CP | `PAIRING_ACCEPTABLE` / `_MULTIPLE_OPTIONS` |
| SEM Membership $149 | `5F8jESeVeXcpkLU5rrdK`<br>SEMAGLUTIDE COMPOUND — ANY DOSE MEMBERSHIP<br>$149 | Dirx **SEM + B12** and/or **SEM + Glycine** (≥1 total). Both additives may coexist. Multi strengths OK. | B6 · Greenwich (if not locked path) · Tirzepatide · unrelated | Compatible SEM B12/Glycine on **membership CP only** | Acceptable on dedicated $149 CP — **not** dose-group CPs |
| TIR Membership $275 | `E3MXZeeR01QROCuTLRLE`<br>TIRZEPATIDE COMPOUND — ANY DOSE MEMBERSHIP<br>$275 | Dirx **TIR + B12** and/or **TIR + Glycine** (≥1). Multi strengths OK. Same formulary rows may exist on GLP-2 — attach **here**. | B6 · Glycine **3-PACK** · Semaglutide · blend substitutes | Compatible TIR B12/Glycine on **membership CP only** | Acceptable on $275 CP. **Do not use** `SvFDJ7…` GLP-2 Any Dose $279 |
| Wolverine Capsule | `omhh3NabouO8AsNR5tkD`<br>Wolverine – BPC-157 + TB-500 Recovery Protocol | **BPC-157 / TB500 Capsules** @ Greenwich (`SLBdNaBijUHmDFSohdaM`) — move/attach from injection CP | Injection-only meds on capsule CP (if any) | Compatible capsule option(s) on `omhh3N…` | `PAIRING_ACCEPTABLE` for capsule selector |
| Wolverine Injection | `iJtyig611AZEDBGdvRd9`<br>BPC-157/TB500<br>$169 | No new attach required if injection med stays | **BPC-157 / TB500 Capsules** (`SLBdNaBijUHmDFSohdaM`) | **BPC-157 / TB500** injection (`27WtrIdo3z4Ssj5sDcc6`) | `PAIRING_ACCEPTABLE` (no capsule mismatch) |
| Progesterone IR | `5dGkjdpLP7DkKKE2iVxh`<br>Women's Hormones (HRT) – Progesterone<br>$79 | None required if IR remains after removals. Multi IR OK. | **Pregnenolone IR** (`LHAilcd…`)<br>**All Progesterone SR** (`NRZX…`, `ORLf…`, `KleU…`, `xrMR…`) | Progesterone / Progesterone IR / IR dye-free lactose-free @ Vios | `PAIRING_ACCEPTABLE` / `_MULTIPLE_OPTIONS` (IR only) |

### How to click (every fix)

1. GEN Health → **Products**
2. Search by the **exact GEN CP name** above (not a similarly named GLP / dose-group / topical twin)
3. Open product → **Formulary / Medication**
4. **REMOVE** listed mismatches first
5. **ATTACH** listed compatible family options (multi OK)
6. **Save**
7. Re-run live pairing closeout before CREATE authorization

### Hard “do not open” list

| Mistake target | Why |
|---|---|
| Semaglutide Injection — Mid (**Glycine**) `CjqOUb…` | Wrong additive for Mid B12 fix |
| SEM / TIR dose-group Any Dose CPs | Not membership backends |
| `SvFDJ7W4nmWL2bkLUMMS` GLP-2 Tirzepatide Any Dose $279 | **Not** TIR membership |
| `Tirzepatide/B12/Glycine` / `Tirzepatide/Glycine/B12` | Forbidden ambiguous objects |
| `489Yreh…` GHK-Cu / Minoxidil | Rejected Minoxidil substitute |

## MINOXIDIL — OWNER DECISION (routing not changed)

**RAW7 CP:** `Raw7mUkuzzhVdAo88jpL` — Hair Loss – Minoxidil (Topical)

**CURRENT PRICE:** $0
**TARGET PRICE:** $79

### CURRENT ATTACHMENTS (live)

| Medication | medicationId | Pharmacy | Compatible Fin/Minox family? | Material mismatch? |
|---|---|---|---|---|
| Finasteride / Minoxidil (PER ML) 0.1 / 10 % | `TbZGZNFAzrChVQoGgkXs` | Vios | YES | NO |
| Finasteride / Minoxidil (PER ML) 0.1 / 5 % | `9qNwEbSAfgVxUjuy3mNg` | Vios | YES | NO |
| Finasteride / Minoxidil (PER ML) 0.1 / 5 % | `R1KXXsuKlENVt3rnHUTI` | Vios | YES | NO |
| Finasteride / Minoxidil (PER ML) 0.1 / 7 % | `VjSceyy4fZ3UUL7aZubm` | Vios | YES | NO |
| Finasteride / Minoxidil (PER ML) 0.1 / 7 % | `yLLv6cvly0vgq82P4Za3` | Vios | YES | NO |
| Finasteride / Minoxidil / Tretinoin (PER ML) 0.25 / 5 / 0.01 % | `0XBMtwTFsCYJvHzZbGmv` | Vios | NO | YES |
| Finasteride / Minoxidil / Tretinoin (PER ML) 0.25 / 5 / 0.03 % | `lMf2Pgs0Kyzil511S3AA` | Vios | NO | YES |
| Finasteride / Minoxidil / Tretinoin (PER ML) 0.5 / 5 / 0.01 % | `O4SZ6tx6jbWFV6eb6Mvh` | Vios | NO | YES |
| Minoxidil 10% | `dkG7xeZ0vEysUIK8m4ze` | Vios | NO | YES |
| Minoxidil 15% | `TzPHypfsr7APpXLmTJAi` | Vios | NO | YES |
| Minoxidil 2% | `8mc7RjVdMx0gNm1JZEiz` | Vios | NO | YES |

**COMPATIBLE ATTACHMENTS:** 5 (Finasteride/Minoxidil family incl. 0.1%/5%, 0.1%/7%, 0.1%/10%)

**INCOMPATIBLE ATTACHMENTS:** 6

- Finasteride/Minoxidil/**Tretinoin** blends (3)
- Plain **Minoxidil** without Finasteride (3)

**IS Raw7m a clean/acceptable backend CP for the intended website Minoxidil product?** **NO**

### Recommendation

**RECOMMENDED ROUTING TARGET:** **BboYS4** (`BboYS4a2Uj7APetrFo6W` Dual Combo)

**MINOXIDIL DECISION:** `KEEP_BBOYS_AND_ATTACH`

**WHY:**

- Intended website product is Finasteride/Minoxidil Dual Combo @ **$79**.
- Dual Combo CP name matches locked intent; currently **0** attachments / price **$0** (needs attach + later price repair).
- Raw7m **does** hold Vios 0.1%/5%, but also holds **material mismatches** (Tretinoin blends + plain Minoxidil) → fails amended compatibility as a clean backend.
- Therefore: **keep** website lock on `BboYS4…`, **attach** Vios Finasteride/Minoxidil **0.1%/5%** there (`9qNwEbSAfgVxUjuy3mNg` and/or `R1KXXsuKlENVt3rnHUTI`), repair retail to **$79** when authorized.
- Do **not** retarget routing to Raw7m in this phase.

If owner later wants Raw7m: first strip incompatibles on Raw7m, keep Fin/Minox-only options, set $79, then authorize a separate routing retarget.

## After the 6 fixes (+ Minoxidil attach when decided)

1. Re-run live GEN pairing closeout
2. Update `pairingVerificationRegistry.ts` only for newly acceptable CPs
3. Then — and only then — owner may authorize the **13 CREATE** preflight set

**STOP FOR OWNER REVIEW.**

