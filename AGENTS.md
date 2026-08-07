# AGENTS.md

## Cursor Cloud specific instructions

This is a **Vite + React + TypeScript** static e-commerce frontend ("My Bare Method"). It is a single-page app with a small custom hash/path router (`src/router.tsx`); there is no separate backend server to run for local development. Supabase Edge Functions (`supabase/functions/*`) plus Stripe are used only by the checkout "Place Order" action and are optional external services — the app runs and the full browse/add-to-cart/checkout-form flow works without them.

### Services / commands

There is a single service (the Vite frontend). Standard commands live in `package.json` scripts:

- Dev server: `npm run dev` (serves on http://localhost:5173).
- Lint: `npm run lint` (ESLint). Note: the checked-in code currently has pre-existing lint errors (unused imports, conditional-hook usage) and one `typecheck` error in `src/pages/ProductPage.tsx`. These are code issues, not environment issues — do not treat them as setup failures.
- Typecheck: `npm run typecheck` (`tsc --noEmit`).
- Build: `npm run build` — this does a normal `vite build`, then a second SSR build, then runs `node dist/prerender/prerender.js` to prerender ~109 static routes and generate `sitemap.xml`. The build does not run `tsc`, so the pre-existing type error does not block it.
- Preview production build: `npm run preview`.

### Non-obvious notes

- Stripe checkout (the final "Place Order" button on `/checkout`) calls a Supabase Edge Function using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (read from `import.meta.env`). Without a `.env` providing these, browsing/adding to cart/filling the checkout form all still work; only the final redirect-to-Stripe step will fail. Set those vars in a `.env` file only if you need to exercise real Stripe checkout.
- Node 22 is used here and works with Vite 5.
