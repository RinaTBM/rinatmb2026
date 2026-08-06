# Catalog Backup Snapshot — 2026-08-05

Captured on branch `catalog-relaunch-final-2026` immediately before the catalog relaunch.
Raw source backups are stored alongside this file:

- `docs/backup/products.original.ts` — full original `src/data/products.ts`
- `docs/backup/sync-stripe-products.original.ts` — original Stripe sync seed (payment IDs/prices)
- `docs/backup/sitemap.original.xml` — original prerendered sitemap

The complete original catalog (names, prices, slugs, images, categories, descriptions,
variant data, and visibility) is fully preserved in the files above and in git history
(commit `2c19fc7` and the pre-relaunch state of this branch). Nothing was deleted.

## Original taxonomy (sections)

`weight-management`, `longevity`, `hrt-women`, `provider-care`, `research`, `accessories`

## Original products (id → name → price → section)

Slugs were auto-generated as `slugify(name)-<pid>` (e.g. `glp-1-1`, `glp-1-gip-5`).

- p1 GLP-1 — $150 (startingAt, sub $175) — weight-management/glp-1 — BEST SELLER
- p2 GLP-1 + B12 Injection — $150 (sub $175) — weight-management/glp-1
- p3 GLP-1 + L-Carnitine Injection — $150 (sub $175) — weight-management/glp-1
- p4 GLP-1 + Glycine Injection — $150 (sub $175) — weight-management/glp-1
- p5 GLP-1/GIP — $200 (startingAt, sub $225) — weight-management/glp-1-gip — BEST SELLER
- p6 GLP-1/GIP + B12 Injection — $200 (sub $225) — weight-management/glp-1-gip
- p7 GLP-1/GIP + L-Carnitine Injection — $200 (sub $225) — weight-management/glp-1-gip
- p8 GLP-1/GIP + Glycine Injection — $200 (sub $225) — weight-management/glp-1-gip
- p9 NAD+ Injection — $149.99 (startingAt) — longevity/injections — BEST SELLER
- p10 NAD+ Nasal Spray — $186 (startingAt) — longevity/nasal-spray
- p11 Glutathione Injection — $59.99 (startingAt) — longevity/injections
- p12 Sermorelin Injection — $119.99 — longevity/injections
- p13 Sermorelin Capsules — $211 — longevity/capsules
- p14 B12 Injection — $49 — longevity/injections — BEST SELLER
- p15–p22 Estrogen forms (Tablets/Capsules, Transdermal Patch, Topical Gel, Topical Spray, Vaginal Cream, Vaginal Tablets, Vaginal Ring, Pellets) — variablePricing ($0) — hrt-women/estrogen
- p23 Progesterone Capsules — variablePricing — hrt-women/progesterone
- p24 Sustained-Release Progesterone — variablePricing — hrt-women/progesterone
- p25 Progesterone Cream — variablePricing — hrt-women/progesterone
- p26 Progesterone Troches — variablePricing — hrt-women/progesterone
- p27 Testosterone Cream — variablePricing — hrt-women/testosterone
- p28 Testosterone Gel — variablePricing — hrt-women/testosterone
- p29 Testosterone Injections — $79.99 (startingAt) — hrt-women/testosterone
- p30 Testosterone Pellets — variablePricing — hrt-women/testosterone
- p31 Testosterone Troches — variablePricing — hrt-women/testosterone
- p32 Bi-Est, p33 Tri-Est, p34 Estrogen + Progesterone (BEST SELLER), p35 Estrogen + Progesterone + Testosterone — variablePricing — hrt-women/combination
- p36 Initial Provider Consultation — $75 — provider-care/consultation — BEST SELLER
- p37 Follow-Up Appointment — $55 — provider-care/consultation
- p38 Laboratory Review — $55 — provider-care/lab-review
- Research catalog (p39–p55): GHK-Cu, BPC-157/TB-500 Injection, BPC-157/TB-500 Capsules, Tesamorelin/Ipamorelin, Tesamorelin/KPV, MOTS-c, Thymosin Alpha-1, Semax Nasal Spray, Selank Nasal Spray, PT-141 Nasal Spray, Dihexa Capsules, Methylene Blue, KLOW/GLOW, PT-141 Injection, Oxytocin, Tadalafil — research (RESEARCH USE ONLY)
- Accessories (p56–p67): 3D Printed Peptide Case, Temperature-Controlled Travel Case, Discreet Travel Bag, Reusable Ice Pack, Wellness Planner, Sharps Container, Alcohol Prep Wipes (100/200), Insulin Syringes (10/50/100), Complete Injection Starter Kit (featured bundle) — accessories

## Original memberships

- glp1-membership "Bare GLP-1 Membership" — $175/month — semaglutide program
- glp1-gip-membership "Bare GLP-1/GIP Membership" — $225/month — tirzepatide program (highlighted)
- elite-wellness-membership "Bare Elite Wellness" — $49/month — all non-GLP-1 wellness products

## Original Stripe sync seed (payment-critical)

`supabase/functions/sync-stripe-products/index.ts` seeds Stripe products/prices keyed by
`app_product_id` (p1..p67, m1, m2). Notable: the seed prices differ from the catalog display
prices (e.g. GLP-1 synced at $186 vs. display $150). The checkout edge function looks up
`stripe_price_id` by `app_product_id`; products without a synced Stripe price fall back to
provider-invoice ("variable pricing") handling.
