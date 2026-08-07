# Provider Care UI + accessory image fit

Branch: `deploy/my-bare-method-integrated-2026`  
Re-applied as a new commit on top of remote tip `ebda77e` (image updates preserved).

## Files changed

| File | Change |
|---|---|
| `src/components/ProviderCareSection.tsx` | **New** luxury concierge layout for Provider Care |
| `src/pages/SectionPage.tsx` | Route Provider Care to dedicated section component |
| `src/data/products.ts` | Provider Care titles, copy, lifestyle images; section meta |
| `src/components/ProductCard.tsx` | `object-contain` + padding for Travel Bag + Temp Travel Case only |
| `src/pages/ProductPage.tsx` | Same contain-fit for those two product detail images |

## Provider Care layout updates

- Warm cream page background, centered eyebrow / serif title / supporting copy
- Three equal-height cards (`md:grid-cols-3`), `rounded-[20px]`, thin cream border, soft shadow
- Large 4:3 lifestyle images (`object-cover`) with lazy loading + width/height
- Circular line icons beside serif titles; italic subtitles; body descriptions
- **Book visit** CTA preserves existing product routes (`/product/{slug}`) and pricing

## Provider Care copy updates

| Service | Title | Subtitle | Description | Price (unchanged) |
|---|---|---|---|---|
| Initial | Initial Provider Visit | Your first step toward personalized care. | Discuss your goals… | $75 |
| Follow-Up | Follow-Up Visit | Review progress and adjust your treatment plan. | Monitor progress… | $55 |
| Lab | Laboratory Review | Provider interpretation of your lab results. | Review laboratory findings… | $55 |

Slugs unchanged: `initial-provider-consultation`, `follow-up-appointment`, `laboratory-review`.

## Provider images

No original local doctor/tablet assets existed in `public/images`. Temporary matching lifestyle photos (Pexels, same pattern as homepage/about):

- Initial: `pexels-photo-7579831`
- Follow-Up: `pexels-photo-7089401`
- Lab: `pexels-photo-6129507`

## Accessory image-fit (only two products)

| Product | Slug | Image file | Treatment |
|---|---|---|---|
| Discreet Travel Bag | `discreet-travel-bag` | unchanged `IMG_TRAVEL_BAG` | `object-contain` + padding |
| Temperature-Controlled Travel Case | `temperature-controlled-travel-case` | unchanged `IMG_TEMP_CASE` | `object-contain` + padding |

All other Accessories cards, names, prices, badges, buttons, and checkout behavior unchanged.

## Preserved

- Header/nav, cart/checkout, memberships, Stripe, DB, admin, Google auth, product/membership prices

## Verification

| Check | Result |
|---|---|
| typecheck | pass |
| lint | pass (4 pre-existing react-refresh warnings) |
| test | pass — 25 tests |
| build | pass |
