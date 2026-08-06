# LIVE Stripe Dry-Run (read-only)

**Status: DRY-RUN ONLY. No live Stripe object was created, updated, archived, or deleted. No customer or subscription was read or altered. No secret/live key is exposed here.**

This plan is presented for review. **Nothing will be synced to live until the exact instruction `APPROVE LIVE STRIPE SYNC` is given.**

## How this plan was produced (and an important caveat)

- The plan is computed **offline** from the approved catalog (single source of truth → `src/lib/catalog/catalog.ts`, integer cents) using the same deterministic planner used for the test flow, with `environment = 'live'`.
- **Matching key:** the planner matches existing objects by stored **live** Stripe IDs (`catalog_products.stripe_product_id_live`, `catalog_variants.stripe_price_id_live`, `catalog_memberships.stripe_product_id_live` / `stripe_price_id_live`) and by verified Stripe **metadata** (`catalog_slug`, `catalog_variant_key`, `price_fingerprint`, `environment=live`).
- In the current repository state, **no live Stripe IDs are stored** (all `*_live` columns are null — nothing has ever been synced to live through this system). Therefore every entity is planned as a **create**, and there are **0 updates and 0 archivals**.

> ⚠️ **A true live-API comparison could not be executed in this environment** (no Stripe key is present, and — per `docs/live-stripe-release-checklist.md` — the sync tooling is intentionally **test-only** and **refuses live keys**; a dedicated live write-path has not been built yet). To detect duplicates against objects that may already exist in your live account (e.g. created earlier by the legacy `supabase/functions/sync-stripe-products` seed, or created manually), the owner must run a **read-only live dry-run using a restricted live key with read scopes only** before approving any live create. See "Possible duplicates" below.

## Summary of the proposed LIVE change plan

| Operation | Count |
| --- | --- |
| Create Product | **15** (13 products + 2 memberships) |
| Update Product (metadata only) | 0 |
| Create Price | **28** (26 one-time variant Prices + 2 recurring membership Prices) |
| Reuse existing Price | 0 |
| **Archive old Price** | **0** |
| **Delete anything** | **0 (never)** |
| Total operations | 43 |

## New Stripe Products proposed (15)

Products (13): `semaglutide`, `tirzepatide`, `estradiol-patch`, `progesterone-capsules`, `testosterone-cream`, `nad-plus`, `selank`, `semax`, `selank-semax-nasal-spray`, `bpc-157-tb-500`, `tretinoin-cream`, `minoxidil-topical`, `bimatoprost-solution`.
Memberships (2): `semaglutide-membership`, `tirzepatide-membership`.

Each Product carries metadata `app=my-bare-method`, `catalog_slug=<slug>`, `environment=live`, `schema_version=1`.

## New Stripe Prices proposed (28)

### One-time product Prices (26)

| Product | Variant | Amount | Type |
| --- | --- | --- | --- |
| semaglutide | semaglutide-v1 | $149.00 | one-time |
| semaglutide | semaglutide-v2 | $169.00 | one-time |
| semaglutide | semaglutide-v3 | $199.00 | one-time |
| tirzepatide | tirzepatide-v1 | $199.00 | one-time |
| tirzepatide | tirzepatide-v2 | $269.00 | one-time |
| tirzepatide | tirzepatide-v3 | $379.00 | one-time |
| tirzepatide | tirzepatide-v4 | $449.00 | one-time |
| estradiol-patch | estradiol-patch-v1 | $119.00 | one-time |
| estradiol-patch | estradiol-patch-v2 | $119.00 | one-time |
| estradiol-patch | estradiol-patch-v3 | $135.00 | one-time |
| progesterone-capsules | progesterone-capsules-v1 | $49.00 | one-time |
| progesterone-capsules | progesterone-capsules-v2 | $69.00 | one-time |
| testosterone-cream | testosterone-cream-v1 | $79.00 | one-time |
| nad-plus | nad-plus-v1 | $149.00 | one-time |
| nad-plus | nad-plus-v2 | $199.00 | one-time |
| nad-plus | nad-plus-v3 | $219.00 | one-time |
| selank | selank-v1 | $129.00 | one-time |
| semax | semax-v1 | $129.00 | one-time |
| selank-semax-nasal-spray | selank-semax-nasal-spray-v1 | $149.00 | one-time |
| bpc-157-tb-500 | bpc-157-tb-500-v1 | $99.00 | one-time |
| bpc-157-tb-500 | bpc-157-tb-500-v2 | $199.00 | one-time |
| tretinoin-cream | tretinoin-cream-v1 | $79.00 | one-time |
| tretinoin-cream | tretinoin-cream-v2 | $89.00 | one-time |
| tretinoin-cream | tretinoin-cream-v3 | $109.00 | one-time |
| minoxidil-topical | minoxidil-topical-v1 | $119.00 | one-time |
| bimatoprost-solution | bimatoprost-solution-v1 | $89.00 | one-time |

### Recurring membership Prices (2)

| Membership | Amount | Interval |
| --- | --- | --- |
| semaglutide-membership | **$199.00** | **month** |
| tirzepatide-membership | **$249.00** | **month** |

Each membership gets **exactly one** recurring monthly Price. There is **no per-dose membership Price**.

## Old Prices proposed for archival

**None (0).** On a first live sync there are no prior live Prices linked, so nothing is archived. For any future amount change, the tooling would create a **new** Price and archive the previous one **only after** the replacement is created and stored — it never overwrites or deletes a Price.

## Possible duplicates

- Against **this system's** live mapping: **none** — all `*_live` IDs are null, and creates use deterministic Stripe **idempotency keys** + metadata search, so retries will not create duplicates.
- Against **pre-existing** live objects not created by this system (e.g. the legacy `sync-stripe-products` seed used the OLD catalog names/prices such as "GLP-1" at $186): **cannot be confirmed offline.** Before approving live creates, run a restricted-live-read dry-run so the planner can search live Products by `catalog_slug` metadata and match; review any legacy live Products/Prices and decide whether to archive them separately (never delete).

## Required confirmations

- ✅ **Semaglutide Membership will be $199/month** (recurring, one Price).
- ✅ **Tirzepatide Membership will be $249/month** (recurring, one Price).
- ✅ **Tirzepatide is capped in website terms at 25mg/2mg per mL, 2mL** (`maximumIncludedFormulation`), and **30mg/2mg per mL, 2mL is excluded** (enforced by validation + unit test).
- ✅ **No customer can choose a dose through membership checkout** — memberships map to a single recurring Price; membership checkout has no variant/strength selector; dose is provider-directed.
- ✅ **Existing subscriptions will not be migrated or changed** — the sync only creates/updates Products and creates new Prices; it never touches Subscriptions, Customers, or invoices.
- ✅ **No product or price will be deleted** — there are no delete operations; retirement is via hide/archive only.

## What will NOT happen during (an eventual, approved) live sync

- No deletion of any live Product or Price.
- No overwrite of any existing live Price amount (new Price + archive-after-store instead).
- No changes to existing live Customers or Subscriptions.
- No secret/live key printed to terminal, browser, logs, docs, or git.

## Approval gate

This is a review artifact only. **Do not** run the live sync until the owner replies with exactly:

`APPROVE LIVE STRIPE SYNC`

Even then, the live write-path must be enabled deliberately per `docs/live-stripe-release-checklist.md` (restricted live key, live webhook, explicit per-object approval, one controlled live checkout).
