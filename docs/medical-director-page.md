# Medical Director Page

**Branch:** `source-of-truth/medical-director-page-2026`  
**Route:** `/medical-director`  
**Commit message:** Add Medical Director page

## Summary

Added a public luxury trust page introducing Medical Director **Jerry Cattelane, DO**, with provider-directed process education, safety disclosures, and SEO metadata. Not added to primary navigation.

## Files changed

| File | Change |
|------|--------|
| `src/pages/MedicalDirectorPage.tsx` | **New** page component |
| `src/App.tsx` | Route `/medical-director` |
| `scripts/prerender.tsx` | Prerender + SEO title/description |
| `src/components/Footer.tsx` | Footer link under Legal & Support |
| `src/components/ProviderCareSection.tsx` | Link card on Provider Care page |
| `src/pages/AboutPage.tsx` | Link under Medical Director info |
| `docs/medical-director-page.md` | This report |

## Links added

- Footer → Meet Our Medical Director (`/medical-director`)
- Provider Care (`/section/provider-care`) → Meet Dr. Jerry Cattelane, DO
- About (`/about`) → Meet Our Medical Director

**Not** added to Header primary navigation.

## SEO metadata

| Field | Value |
|-------|-------|
| Title | Meet Our Medical Director \| My Bare Method |
| Meta description | Learn about the experienced medical leadership behind My Bare Method and our commitment to safe, provider-directed wellness care. |

Also set client-side via `useEffect` for SPA navigation. Included in prerender + sitemap (65 URLs).

## Content / compliance notes

- Introduces Jerry Cattelane, DO with professional tone.
- Explains Medical Director role (oversight, protocols, provider support, safety, QA, evidence-informed care).
- Includes provider-directed 6-step process.
- Includes commitment icons and patient-safety section.
- Includes required disclosure: Medical Director oversees protocols; **treatment decisions are made by the licensed provider responsible for your care** (does not imply Dr. Cattelane personally evaluates every patient).
- No invented board certifications, residencies, awards, or additional credentials.

### Licensure display

**Shown:** “Licensed in all 50 states”

**Source used:** Uploaded `LegitScript Licensure Template 09-2026` lists Jerry Cattelane, DO with telemedicine availability marked for all **50 U.S. states** (and District of Columbia).  

**Manual confirmation still recommended before public launch** that license numbers/expiration dates remain current and that public display of this statement is approved by the business/provider.

### Placeholders requiring manual completion before launch

1. **Professional headshot** — visual placeholder with `aria-label`; replace with approved photo asset when available (no broken image).
2. **Licensure public-display confirmation** — business/provider sign-off that “Licensed in all 50 states” may remain published (documentation supports the statement; final publish approval is operational).

## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass (0 errors; existing react-refresh warnings only) |
| `npm test` | Pass — 71 tests |
| `npm run build` | Pass — prerender includes `/medical-director` |
| Page HTTP (local preview) | 200 |
| Lighthouse accessibility | **100** (local `serve dist` on `/medical-director/`) |
| Primary nav | Unchanged |
| Broken images | None (headshot is CSS placeholder, not `<img>`) |

## Out of scope (unchanged)

Product catalog, memberships, checkout, Stripe, auth, Provider Care booking functionality, accessories, database, admin, pricing.

## Operations

- Pushed only to `source-of-truth/medical-director-page-2026`
- Local backup: `backup/medical-director-page-before-edit-2026`
- No deploy / publish / merge / live Stripe changes
