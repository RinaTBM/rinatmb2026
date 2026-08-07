# Header / Footer Bolt logo fix

## Issue
Bolt preview was not reliably showing the header/footer brand mark after earlier SVG/logo overwrites. Header and Footer components themselves were still mounted in `App.tsx` for all non-admin routes.

## Fix
- Added cropped official logo PNG at `public/images/logo/my-bare-method-logo.png`
- Pointed `BrandLogo` at the PNG (more reliable than SVG data/asset quirks in Bolt)
- Added `onError` text fallback so header/footer never render an empty brand slot

## Verify
1. Open storefront `/` (not `/admin/*`)
2. Confirm logo in header and inverted logo in footer
3. Confirm `/images/logo/my-bare-method-logo.png` returns 200
