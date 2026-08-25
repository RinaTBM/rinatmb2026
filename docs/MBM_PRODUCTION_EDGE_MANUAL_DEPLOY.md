# MBM production Edge — manual deploy (payment functions only)

Do **not** use the Cursor/cloud-agent `SUPABASE_ACCESS_TOKEN`. That token only has Phoenix Closing Co access and must not be used against My Bare Method.

Do **not** merge PR #19 or PR #20 from this package.  
Do **not** publish the frontend.  
Do **not** deploy GEN helpers.  
Do **not** enable `GEN_HANDOFF_AUTOMATION_ENABLED`, `REAL_GEN_ORDER_SUBMISSION_ENABLED`, or `GEN_API_ORDERS_ENABLED`.

**Production project:** `bsgtuuzwgeetsjjdrtrm`  
**Dashboard:** https://supabase.com/dashboard/project/bsgtuuzwgeetsjjdrtrm/functions  
**Approved source:** PR #20 branch `cursor/final-website-launch-ed1e` @ `07e13fe` (`fix: complete Tagada maps and TIR $275 membership checkout`)

---

## Functions to deploy (only these two)

| Function name | Entrypoint | Required `_shared` files (CLI bundles these) |
|---|---|---|
| `create-invoice-order` | `supabase/functions/create-invoice-order/index.ts` | `familyCommerce.ts` (launch-ready payment SKU exception), `commerceEnvPolicy.ts`, `injectProviderVisit.ts`, `determineProviderRequirement.ts`, `providerVisits.ts`, `therapyFamilies.ts`, `hrtLabPackage.ts`, `ogtbmPromo.ts` |
| `create-kashu-checkout-session` | `supabase/functions/create-kashu-checkout-session/index.ts` | `launchReadyKashuMap.ts` (in-code Tagada map fallback + TIR `$275` / `$305` / `$325`) |

PR #20 includes the final approved versions of both entrypoints and both new `_shared` modules.

**Do not deploy:** `tagada-product-sync`, `tagada-webhook`, any `gen-health-*`, any `stripe-*`, or other functions.

---

## Database / generated types

Neither function uses `supabase gen types` / generated Database types.

The Kashu map table `public.kashu_sku_map` already exists in production. Apply the SQL in `docs/MBM_PRODUCTION_KASHU_MANUAL_APPLY.sql` **before or with** this redeploy (upsert only). No other migration is required for these two functions.

Existing production Edge secrets stay as-is (`TAGADA_*`, `SUPABASE_*` auto-provided). Do not paste new secrets. Do not add GEN flags.

---

## Why the Dashboard function editor is not enough

Both functions import relative `_shared/*.ts` modules. Pasting only `index.ts` into the Supabase Dashboard code editor will fail to bundle those files (or will deploy a broken function).

Use CLI deploy from a checkout of PR #20, authenticated as an **MBM/BSG** Supabase user.

---

## Safest manual deploy (owner machine)

1. Confirm you are logged into the My Bare Method org (project `bsgtuuzwgeetsjjdrtrm`), **not** Phoenix.
   - Create a personal access token at https://supabase.com/dashboard/account/tokens if needed.
   - `npx supabase projects list` must show My Bare Method / `bsgtuuzwgeetsjjdrtrm`. If it only lists Phoenix, **stop**.

2. Check out PR #20 (do not merge):

```bash
git fetch origin cursor/final-website-launch-ed1e
git checkout 07e13fe
```

3. Deploy **only** the two payment functions. Do **not** pass extra env flags. Do **not** change the existing Dashboard “Verify JWT” toggle.

```bash
npx supabase functions deploy create-invoice-order --project-ref bsgtuuzwgeetsjjdrtrm
npx supabase functions deploy create-kashu-checkout-session --project-ref bsgtuuzwgeetsjjdrtrm
```

4. In the Dashboard function list for `bsgtuuzwgeetsjjdrtrm`, confirm both show a new version timestamp.

5. Leave GEN secrets unset/false. Do not redeploy GEN functions.

---

## Bolt path

Bolt Database Query editor is the right place for the **SQL** package. Bolt is **not** a safe Edge deploy path for this step: it can sync extra functions and is not the GitHub source of truth. Do not use Bolt to publish the frontend or to merge PRs.

---

## After deploy (no real payment)

Code in PR #20 `create-kashu-checkout-session`:

- SEM combo: `$149` `price_344d3dacb4ab` / `$179` `price_41179f7cafe2` / `$199` `price_7ce0f74a7509`
- TIR combo: `$275` `price_2d2dd07b2f73` / `$305` `price_94c92b6e5749` / `$325` `price_d6941e334598`
- Historical TIR `$249` `price_5cf1fa89610c` is **not** used for new enrollment
- Membership enrollment does **not** append `MBM-SHIP-*` (shipping is inside the combo `priceId`)
- `create-invoice-order` allows the 17 launch-ready family SKUs through Tagada payment while `GEN_API_ORDERS_ENABLED` stays off; other Rx remains fail-closed
- FORMULARY_PENDING / FUTURE_HIDDEN are storefront flags, not enabled by this deploy

Do not submit a live card charge from this package.
