# MBM-FINAL-WEBSITE-LAUNCH-1

Patient storefront cutover from `deploy/ach-launch-clean-2026`.
PR #19 is **not** the launch path and must **not** be merged.

Locked architecture is unchanged: one website family per medication; selectors underneath; SEM/TIR = B12/Glycine (not B6); SEM membership $149; TIR membership $275; TIR backend `SvFDJ7W4nmWL2bkLUMMS`; NAD+ one family; Wolverine one family; FORMULARY_PENDING must not block unrelated launch-ready products; real GEN order submission stays **OFF**.

---

VISIBLE PRODUCT FAMILIES:
3

VISIBLE LAUNCH-READY VARIANTS:
19

TEMPORARILY HELD VARIANTS:
29

FORMULARY_PENDING:
nad-inj-5ml-500
nad-inj-10ml-1000
tretinoin-0.025%
tretinoin-0.05%
tretinoin-0.1%
fat-burner-current
testosterone-current
selank-current
semax-current
selank-semax-blend-current
tesamorelin-current
lash-brow-current

SEM WEBSITE:
READY

TIR WEBSITE:
READY

NAD NASAL:
READY

NAD INJECTION:
HELD

WOLVERINE:
BLOCKED

WEBSITE STOREFRONT:
READY

CHECKOUT:
BLOCKED

GEN ROUTING:
PARTIAL

REAL GEN API ORDERS:
BLOCKED

TYPECHECK:
PENDING

TESTS:
PENDING

BUILD:
PENDING

READY TO DEPLOY WEBSITE:
YES

REMAINING TRUE LAUNCH BLOCKERS:
- GEN Health API Orders / external-paid is still blocked. Real GEN medication-order automation stays fail-closed.
- Launch-ready one-time family SKUs have no Tagada / kashu_sku_map rows, so card checkout cannot complete for those SKUs.
- Tirzepatide membership Tagada combo priceIds are still $249-based ($279 / $299). Website is $275. Combo parity fail-closes TIR card enrollment until $305 / $325 combo priceIds exist.
- Do not merge PR #19.

---

## Visible families (patient storefront)

- Semaglutide — B12 / Glycine, dose options, one-time, Membership $149/month
- Tirzepatide — B12 / Glycine, dose options, one-time, Membership $275/month (backend `SvFDJ7W4nmWL2bkLUMMS`)
- NAD+ — Nasal Spray only (50 mg/mL · 15 mL). Injection hidden. Do not substitute 200 mg/mL.

Accessories and provider-care remain on the shop as existing non-family cards. Held Rx families are hidden, not shown as empty family pages.

## Launch-ready variants (19)

SEM one-time 8 + SEM membership 1 + TIR one-time 8 + TIR membership 1 + NAD nasal r84.

## Held (do not block the 19)

NAD injection 100 mg/mL (FORMULARY_PENDING; do not substitute 200 mg/mL). NAD nasal r85 (empty pairing). Wolverine capsule + injection (form mismatch / empty pairing). Estradiol, minoxidil Dual Combo, progesterone, testosterone, fat burner, selank/semax/blend, tesamorelin, tretinoin, lash/brow.

## Flags

- `WEBSITE_FAMILY_CUTOVER_ENABLED = true`
- `REAL_GEN_ORDER_SUBMISSION_ENABLED = false`
- `familyRoutingGate` remains fail-closed for FORMULARY_PENDING / FUTURE_HIDDEN / unverified routes
- Browser UI never shows GEN IDs, pharmacy names, routing status, or QA panels

## Checkout honesty

SEM membership card enrollment (Tagada combo $179 / $199) remains the working membership path.
TIR membership card is fail-closed until new combo priceIds exist.
New one-time family SKUs can be selected and added to cart; invoice/card completion stays blocked until Tagada maps exist **and** GEN API Orders is enabled.
Medication retail already includes pharmacy fulfillment shipping. MBM Two-Day / Next-Day remains the checkout delivery selector (not a second pharmacy shipping add-on).
Provider visit rules are unchanged.

The website may be deployed while medication order automation remains fail-closed.
GEN ordering is **not** operational.
