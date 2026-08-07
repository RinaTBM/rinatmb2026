# Medical Director and Launch FAQ Update

**Branch:** `source-of-truth/medical-director-page-2026`  
**Commit message:** Update Medical Director and launch FAQs

## Files changed

| File | Change |
|------|--------|
| `src/pages/MedicalDirectorPage.tsx` | Approved name, bio, SEO, layout, headshot path + fallback |
| `scripts/prerender.tsx` | Updated Medical Director meta description |
| `src/pages/FaqPage.tsx` | Shipping, pharmacy, not-approved, Medical Director FAQs |
| `src/pages/ShippingPolicyPage.tsx` | Free ≥$500; Two-Day $30; Next-Day $50; process 1–3 days |
| `src/components/Footer.tsx` | Name + Ageless Pharma Rx |
| `src/pages/AboutPage.tsx` | Name + Ageless Pharma Rx |
| `src/components/ProviderCareSection.tsx` | Updated Medical Director link label |
| `src/pages/HomePage.tsx` | Processing timing copy |
| `src/pages/SuccessPage.tsx` | Processing timing copy |
| `src/pages/CheckoutPage.tsx` | Estimated processing copy only (shipping **logic** unchanged) |
| `public/images/team/.gitkeep` | Directory for approved headshot |
| `docs/medical-director-and-faq-update.md` | This report |

## Medical Director page updates

- Eyebrow: **Medical Leadership**
- Heading: **Meet Our Medical Director**
- Name: **Jerry J. Cattelane Jr., D.O.**
- Role: **Medical Director**
- Approved intro (NYIT 1997; Emergency Medicine, Medical Genetics, Family Medicine; licensed in all states)
- Expanded My Bare Method bio (oversight language; does not imply personal evaluation of every patient)
- Section: **Clinical Leadership & Oversight** + required disclosure
- Section: **Provider-Directed Care** + non-guarantee of prescription
- No invented board certifications, awards, fellowships, affiliations, license numbers, or personal quotes

### Headshot asset

| Item | Detail |
|------|--------|
| Expected path | **`public/images/team/jerry-j-cattelane-jr-do.jpg`** |
| Status | **Missing from repository** — not substituted with another person |
| Runtime behavior | `<img>` loads expected path; `onError` shows cream placeholder (no broken-image icon) |
| Action needed | Add the approved B&W professional headshot at the path above before publish |

Public URL once file is added: `/images/team/jerry-j-cattelane-jr-do.jpg`

## FAQ updates

### Shipping — “Do you offer free shipping?”
- Free shipping for orders of **$500 or more**
- Two-Day Shipping — **$30**
- Next-Day Shipping — **$50**
- Processing **1–3 business days** after provider review/approval when applicable
- Removed **$75** free-shipping threshold and **$6.95** language

Also updated “How long does shipping take?” to 1–3 business days processing.

### Pharmacy — “Which pharmacy fulfills your prescriptions?”
- Now **Ageless Pharma Rx**
- Removed **ScriptfulRx**

### Not approved — “What if I am not approved?”
- Unapproved provider-directed product not fulfilled
- Eligible charges refunded per refund policy
- Typically reflected within **3–10 business days** (institution-dependent)
- Removed “within 3 business days” guarantee framing

### Medical Director FAQ
- Updated to **Dr. Jerry J. Cattelane Jr., D.O.** with clinical leadership framing

## Outdated references removed (customer-facing `src/`)

| Old reference | Status |
|---------------|--------|
| ScriptfulRx / Scriptful | Removed from Footer, About, FAQ |
| $75 free shipping / $6.95 standard | Removed from FAQ; Shipping Policy updated |
| Two-Day $20 / Next-Day $30 | Updated to $30 / $50 in Shipping Policy + FAQ |
| 3–5 business day processing (customer copy) | Updated to 1–3 where applicable (Home, FAQ, Shipping Policy, Success, Checkout display text) |
| “refund within 3 business days” | Replaced with 3–10 business days language in FAQ |
| Old Medical Director name format | Updated to Jerry J. Cattelane Jr., D.O. |

### Intentionally unchanged

| Item | Reason |
|------|--------|
| Checkout shipping **calculation** (`subtotal > 75 ? 0 : 6.95`) | User forbade modifying checkout logic — still outdated vs new FAQ/policy; follow-up needed |
| Membership Terms “$75 Detailed Wellness Consultation” | Different fee, not shipping |
| Historical / audit docs under `docs/` | Left as historical records |
| Product pricing / memberships / Stripe / admin | Out of scope |

## SEO

| Field | Value |
|-------|-------|
| Title | Meet Our Medical Director \| My Bare Method |
| Meta description | Meet Dr. Jerry J. Cattelane Jr., D.O., Medical Director for My Bare Method, and learn about the clinical leadership supporting our provider-directed wellness programs. |

## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass (0 errors; existing react-refresh warnings) |
| `npm test` | Pass — 71 tests |
| `npm run build` | Pass — 65 routes including `/medical-director` |

## Operations

- Pushed only to `source-of-truth/medical-director-page-2026`
- No merge / deploy / publish / live Stripe sync
