# November 2026 catalog and state-availability review

Base: deploy/ach-launch-clean-2026 at 632a8b5e7e623f5101a45787c50117af7b910e96.

Gen Health is authoritative for unavailable states, video visits and labs. This branch does not mirror per-product syncVisit or labsRequired booleans. Those requirements remain unchanged pending sections 1, 2 and 4; “not mirrored” is not false. Existing hormone-lab prompts and provider visit logic are preserved. No production API, database, payment provider or checkout URL is modified.

The table includes all catalog products, hidden entries and legacy membership records. Catalog variant prices and explicit hosted route prices are shown separately because the base branch already stores them separately; neither price source is changed by this PR. GLP-1 family selectors retain their existing prices: Semaglutide low $139, high $149, monthly $129; Tirzepatide low $259, high $279, monthly $249.

| Product | Visibility | Catalog price(s) | Hosted route price(s) | syncVisit | labsRequired | unavailableStates by form |
| --- | --- | --- | --- | --- | --- | --- |
| Semaglutide: GLP-1 Weight Management Injection | Visible | Vitamin B12, 1mL vials: $109.00<br>Vitamin B12, 1mL vials: $119.00<br>Vitamin B12, 1mL vials: $119.00<br>Vitamin B12, 1mL vials: $129.00<br>Vitamin B12, 1mL vials: $139.00<br>Vitamin B12, 1mL vials: $89.00<br>Glycine, 1mL vials: $109.00<br>Glycine, 1mL vials: $119.00<br>Glycine, 1mL vials: $119.00<br>Glycine, 1mL vials: $129.00<br>Glycine, 1mL vials: $139.00<br>Glycine, 1mL vials: $89.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Injection: PR |
| Tirzepatide: Dual GLP-1/GIP Weight Management Injection | Visible | Vitamin B12, 2mL vials: $139.00<br>Vitamin B12, 2mL vials: $159.00<br>Vitamin B12, 2mL vials: $179.00<br>Vitamin B12, 2mL vials: $189.00<br>Vitamin B12, 2mL vials: $199.00<br>Vitamin B12, 2mL vials: $209.00<br>Vitamin B12, 2mL vials: $119.00<br>Glycine, 2mL vials: $139.00<br>Glycine, 2mL vials: $159.00<br>Glycine, 2mL vials: $179.00<br>Glycine, 2mL vials: $189.00<br>Glycine, 2mL vials: $199.00<br>Glycine, 2mL vials: $209.00<br>Glycine, 2mL vials: $119.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Injection: PR |
| Fat Burner: Metabolic Body-Composition Peptide Blend | Visible | Provider-directed, Monthly supply: $199.00 | $199.00 | Not mirrored; unchanged | Not mirrored; unchanged | Injection: PR |
| AOD-9604: Lipotropic Body-Composition Peptide | Visible | Provider-directed, Monthly supply: $179.00 | $179.00 | Not mirrored; unchanged | Not mirrored; unchanged | Injection: AL, AR, CA, KY, SC, PR |
| Metabolic Triple: Three-Peptide Metabolic Protocol | Hidden | Provider-directed, Monthly supply: $219.00 | $219.00 | Not mirrored; unchanged | Not mirrored; unchanged | Injection: PR |
| BPC-157: Tissue Recovery & Gut-Health Peptide | Visible | Provider-directed, Monthly supply: $199.00 | $199.00 | Not mirrored; unchanged | Not mirrored; unchanged | Injection: PR |
| GHK-Cu + Minoxidil: Hair & Skin Renewal Topical | Visible | Provider-directed, Monthly supply: $69.00 | $69.00 | Not mirrored; unchanged | Not mirrored; unchanged | Cream: PR |
| Ondansetron ODT: Nausea & GI Support Tablet | Visible | Provider-directed, Monthly supply: $59.00 | $59.00 | Not mirrored; unchanged | Not mirrored; unchanged | Orally disintegrating tablet: PR |
| Estradiol: Transdermal Estrogen Support Patch | Visible | 0.025mg twice weekly, 8 patches: $129.00<br>0.05mg twice weekly, 8 patches: $138.98<br>0.1mg twice weekly, 8 patches: $149.00 | $129.00 | Not mirrored; unchanged | Not mirrored; unchanged | Patch: AL, PR |
| Progesterone: Oral Hormone Balance Capsules | Visible | Provider-directed, Monthly supply: $59.00 | $59.00 | Not mirrored; unchanged | Not mirrored; unchanged | Capsule: PR |
| Testosterone: Topical Hormone Support Cream | Visible | Provider-directed, Monthly supply: $89.00 | $89.00 | Not mirrored; unchanged | Not mirrored; unchanged | Cream: PR |
| Scream Cream: Sildenafil / Arginine / Testosterone | Visible | Provider-directed, Monthly supply: $129.00 | $129.00 | Not mirrored; unchanged | Not mirrored; unchanged | Cream: PR |
| NAD+: Cellular Energy & Longevity Coenzyme | Visible | Injection, 100mg/mL, 5 mL: $199.00<br>Injection, 100mg/mL, 10 mL: $229.00<br>Nasal Spray, 50mg/mL, 15mL: $79.00 | Injection: $139.00<br>Nasal Spray: $79.00 | Not mirrored; unchanged | Not mirrored; unchanged | Injection: PR<br>Nasal Spray: AR, CA, KS, KY, MA, MI, MS, NE, NC, OK, OR, SC, TN, VA, WV, PR |
| Selank: Calm-Focus & Stress Support Injection | Visible | Provider-directed, Monthly supply: $129.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Injection: AR, CA, KY, SC, PR |
| Semax: Cognitive Focus & Memory Support Injection | Visible | Provider-directed, Monthly supply: $129.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Injection: PR |
| Selank + Semax: Calm-Focus & Cognitive Nasal Spray | Visible | Provider-directed, Monthly supply: $149.00 | $149.00 | Not mirrored; unchanged | Not mirrored; unchanged | Nasal Spray: PR |
| Tesamorelin: GHRH Metabolic & Body-Composition Injection | Visible | Provider-directed, Monthly supply: $269.00 | $269.00 | Not mirrored; unchanged | Not mirrored; unchanged | Injection: PR |
| BPC-157 + TB-500: Quick Recovery & Tissue Repair Blend | Hidden | Injection, Provider-directed, Monthly supply: $169.00<br>Capsule, Provider-directed, Monthly supply: $189.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Injection: PR<br>Capsule: AL, AR, CA, CT, DE, GA, IL, IN, KY, LA, MI, MN, MS, NV, NH, NJ, NM, NC, ND, OH, OK, SC, SD, TN, VT, VA, WA, WV, PR |
| KLOW: Four-Peptide Tissue Repair & Recovery Blend | Visible | Quick Recovery, 5 mL vial: $159.00 | $159.00 | Not mirrored; unchanged | Not mirrored; unchanged | Injection: PR |
| Tretinoin: Prescription Skin Renewal Cream | Visible | Provider-directed, Monthly supply: $79.00 | $79.00 | Not mirrored; unchanged | Not mirrored; unchanged | Cream: PR |
| Minoxidil: Topical Hair Regrowth Solution | Visible | Provider-directed, Monthly supply: $79.00 | $79.00 | Not mirrored; unchanged | Not mirrored; unchanged | Topical Solution: PR |
| Bimatoprost: Lash & Brow Growth Serum | Hidden | 0.03%, 2.5mL: $89.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Solution: PR |
| Initial Provider Visit | Visible | 1 session, Visit: $75.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Service: PR |
| Follow-Up Provider Visit | Visible | 1 session, Visit: $55.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Service: PR |
| Lab Review | Visible | 1 session, Visit: $60.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Service: PR |
| Hormone Therapy Lab Options | Visible | Choose in GEN, Labs: $0.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Service: PR |
| Complete Injection Starter Kit | Visible | Bundle, 1 kit: $119.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Accessory: PR |
| Premium Protective Medication Case | Visible | Standard, 1 case: $34.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Accessory: PR |
| Temperature-Controlled Travel Case | Visible | Standard, 1 case: $59.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Accessory: PR |
| Discreet Travel Bag | Visible | Standard, 1 bag: $39.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Accessory: PR |
| Reusable Ice Pack | Visible | Standard, 1 pack: $12.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Accessory: PR |
| Daily & Weekly Wellness Planner | Visible | Standard, 1 planner: $29.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Accessory: PR |
| Sharps Container | Visible | Standard, 1 container: $10.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Accessory: PR |
| Alcohol Prep Wipes | Visible | 200 Count, 1 box: $9.99<br>500 Count, 1 box: $18.99 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Accessory: PR |
| Premium Insulin Syringes | Visible | 10 Pack, 1 pack: $3.99<br>20 Pack, 1 pack: $6.99<br>30 Pack, 1 pack: $9.49<br>40 Pack, 1 pack: $11.99<br>50 Pack, 1 pack: $14.49<br>60 Pack, 1 pack: $16.99<br>70 Pack, 1 pack: $19.49<br>80 Pack, 1 pack: $21.99<br>90 Pack, 1 pack: $24.49<br>100 Pack, 1 pack: $26.99 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Accessory: PR |
| Sermorelin: Growth Hormone-Releasing Peptide | Hidden | 9mg/mL, 3mL: $119.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Injection: PR |
| Minoxidil: Oral Hair Regrowth Tablets | Hidden | 2.5mg, 30 tablets: $79.00 | Family selector / existing route | Not mirrored; unchanged | Not mirrored; unchanged | Capsule: PR |
| Semaglutide Membership: Flat-Rate GLP-1 Weight Management Program | Visible | $125.00/mo (existing membership record) | Existing program selector | Not mirrored; unchanged | Not mirrored; unchanged | PR |
| Tirzepatide Membership: Flat-Rate Dual GLP-1/GIP Weight Management Program | Visible | $179.00/mo (existing membership record) | Existing program selector | Not mirrored; unchanged | Not mirrored; unchanged | PR |
| Bare Elite Wellness | Hidden | $49.00/mo (existing membership record) | Existing program selector | Not mirrored; unchanged | Not mirrored; unchanged | PR |

## Section 0 reconciliation

- Tirzepatide already uses GLP-1/GIP in this public catalog; no GLP-2 wording occurs in the public product definitions. The exact high/low/any-dose plan titles supplied by the owner are not separate public products here. No new names or prices are invented for them.
- Scream Cream is renamed to “Scream Cream: Sildenafil / Arginine / Testosterone”. Its existing catalog and hosted price are both $129 and remain unchanged. No public Papaverine wording was found.
- Estradiol's displayed short description is replaced with the supplied 0.025–0.1 mg/hr, 8-patch text. Its existing $129 entry and all other variant prices are preserved.
- MOTS-C, Pinealon / PE-22-28 / Selank Neuro-Sleep Protocol and PT-141 nasal spray are not public products in this base. Future architecture records are not activated, repriced or routed. Applying the supplied prices to a future launch needs the correct storefront product/GEN mapping.
- The no-price Semaglutide + Ondansetron and five Tirzepatide duplicate plans are absent from this public catalog. Nothing is removed by fuzzy name matching. The standalone Ondansetron product is preserved.

## Availability

- One fallback data file contains the supplied November 1, 2026 restrictions, including absent/future exception keys without publishing those treatments.
- Every other product defaults to PR unavailable; DC is available for all.
- NAD+ nasal and Wolverine capsule exceptions are form-specific. Injection alternatives retain the default rule. Catalog variants expose unavailableStates as well as their parent product.
- Cards remain visible and greyed with a badge and disabled order button. Product pages remove order actions for the unavailable state. Changing state also rechecks saved Care Basket items, including older nasal/capsule routes.
- Selector supports 50 states, DC and PR, safe localStorage persistence, memory fallback and cross-tab updates.

Regenerate this review with: pnpm exec tsx scripts/export-treatment-availability-review.ts
