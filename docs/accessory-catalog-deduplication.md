# Accessory Catalog Deduplication

Consolidated duplicate Accessories pack/count cards into single products with in-page Select Count variants. Wellness medication, membership, Auto-Refill, Stripe live, admin, and auth were not modified.

## Starting tip

Built on `deploy/my-bare-method-integrated-2026` at `16d654c` (accessory purchase flow) and later.

## Duplicate products removed (public catalog)

| Removed public listing | Disposition |
|------------------------|-------------|
| Alcohol Prep Wipes (100 Count) | Removed from catalog; slug aliases → `alcohol-prep-wipes` |
| Alcohol Prep Wipes (200 Count) | Removed as separate card; 200 Count retained as a **variant** |
| Premium Insulin Syringes (10 Pack) | Removed as separate card; 10 Pack retained as a **variant** |
| Premium Insulin Syringes (50 Pack) | Removed as separate card; 50 Pack retained as a **variant** |
| Premium Insulin Syringes (100 Pack) | Removed as separate card; 100 Pack retained as a **variant** |

## Products consolidated

### Alcohol Prep Wipes (`alcohol-prep-wipes`, app id `a8`)

| Variant | Price |
|---------|-------|
| 200 Count | $9.99 |
| 500 Count | $18.99 |

Catalog card: **From $9.99**  
Image retained: existing wipe image (`IMG_ALCOHOL_WIPES`).

### Premium Insulin Syringes (`premium-insulin-syringes`, app id `a10`)

| Variant | Price |
|---------|-------|
| 10 Pack | $3.99 |
| 20 Pack | $6.99 |
| 30 Pack | $9.49 |
| 40 Pack | $11.99 |
| 50 Pack | $14.49 |
| 60 Pack | $16.99 |
| 70 Pack | $19.49 |
| 80 Pack | $21.99 |
| 90 Pack | $24.49 |
| 100 Pack | $26.99 |

Catalog card: **From $3.99**  
Image retained: existing syringe image (`IMG_SYRINGE`).

## Final visible Accessories catalog (9 cards)

1. Complete Injection Starter Kit  
2. Premium 3D Printed Peptide Case  
3. Temperature-Controlled Travel Case  
4. Discreet Travel Bag  
5. Reusable Ice Pack  
6. Daily & Weekly Wellness Planner  
7. Sharps Container  
8. Alcohol Prep Wipes  
9. Premium Insulin Syringes  

## Variant mappings (PDP)

- Count options render as **Select Count** (not Select Strength)
- Cart quantity (1–10) remains separate from pack/count size
- Cart examples:
  - `Premium Insulin Syringes — 50 Pack` · Quantity 2 · $14.49 each
  - `Alcohol Prep Wipes — 500 Count` · Quantity 1 · $18.99

## Images retained

| Product | Image path | Notes |
|---------|------------|-------|
| Alcohol Prep Wipes | `/images/accessories/file_000000005a08820c8885cbb8b78888fd(2).png` | Shared former 100/200 image |
| Premium Insulin Syringes | `/images/accessories/file_000000005a08820c8885cbb8b78888fd(1).png` | Shared former pack images |
| Travel Bag / Temp Case | unchanged | Contain-fit preserved via Accessories category |

No image files were deleted.

## Search / index cleanup

- Header search now uses `visibleProducts` only (no hidden/duplicate SKUs)
- Shop Accessories / related products / sitemap derive from visible catalog
- Legacy slugs redirect via `SLUG_ALIASES` to consolidated products

## Obsolete Stripe test objects (do not archive without approval)

Identified for later archival review only — **not deleted, not live-synced**:

| Former `app_product_id` | Former slug | Note |
|-------------------------|-------------|------|
| `a8` | `alcohol-prep-wipes-100` | ID reused for consolidated wipes parent; old 100ct Price obsolete |
| `a9` | `alcohol-prep-wipes-200` | Duplicate wipe product obsolete |
| `a10` | `premium-insulin-syringes-10` | ID reused for consolidated syringes parent; old single 10pk Price obsolete |
| `a11` | `premium-insulin-syringes-50` | Duplicate syringe product obsolete |
| `a12` | `premium-insulin-syringes-100` | Duplicate syringe product obsolete |

New variant Stripe test Prices will be required for:

- Wipes: 999¢ / 1899¢  
- Syringes: 399, 699, 949, 1199, 1449, 1699, 1949, 2199, 2449, 2699¢  

No live Stripe operations were run.

## Files changed

- `src/data/products.ts` — consolidate products + slug aliases  
- `src/lib/accessories/accessoryPurchase.ts` — variant-based helpers + obsolete Stripe id list  
- `src/lib/accessories/accessoryPurchase.test.ts` — consolidation coverage  
- `src/components/AccessoryProductPage.tsx` — in-page Select Count on one product  
- `src/components/ProductCard.tsx` — accessories show “From $X.XX”  
- `src/components/Header.tsx` — search uses `visibleProducts`  
- `docs/accessory-catalog-deduplication.md` — this report  

## Wellness / membership confirmation

Untouched: Semaglutide/Tirzepatide memberships, Auto-Refill, medication One-Time, Provider Care, checkout Stripe edge functions, admin, auth.

## Verification

| Command | Result |
|---------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass (5 pre-existing react-refresh warnings) |
| `npm test` | Pass — 54 tests |
| `npm run build` | Pass |
