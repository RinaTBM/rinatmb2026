/**
 * Orchestrate Tagada product sync via temporary Edge Function.
 * Never prints TAGADA secrets. Does not touch processors/flows/webhooks.
 */
import fs from 'fs';
import {
  VARIANT_SKU_BY_ID,
  MEMBERSHIP_PROGRAM_SKU_BY_APP_ID,
} from '../src/data/variantSkus.ts';
import { products, memberships } from '../src/data/products.ts';

const FN =
  process.env.TAGADA_SYNC_FN_URL ||
  'https://bsgtuuzwgeetsjjdrtrm.supabase.co/functions/v1/tagada-product-sync';

async function callFn(action: string, payload: Record<string, unknown> = {}) {
  const res = await fetch(FN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  });
  const text = await res.text();
  let data: unknown = text;
  try {
    data = JSON.parse(text);
  } catch {
    /* keep text */
  }
  return { http: res.status, data };
}

function cents(n: number) {
  return Math.round(n * 100);
}

function variantLabel(v: {
  dosageForm?: string;
  strength?: string;
  size?: string;
  id: string;
}) {
  return [v.dosageForm, v.strength, v.size].filter(Boolean).join(' · ') || v.id;
}

// Matched pairs from prior discovery (name+price). Do not invent.
const MATCHED: {
  mbmSku: string;
  mbmVariantId: string;
  tagadaProductId: string;
  tagadaVariantId: string;
  tagadaPriceId: string;
  price: number;
}[] = [
  { mbmSku: 'MBM-WM-SEM-INJ-001', mbmVariantId: 'semaglutide-v1', tagadaProductId: 'product_cfd1a23b5095', tagadaVariantId: 'variant_4786fced127f', tagadaPriceId: 'price_59b410d4149c', price: 119 },
  { mbmSku: 'MBM-WM-SEM-INJ-002', mbmVariantId: 'semaglutide-v2', tagadaProductId: 'product_cfd1a23b5095', tagadaVariantId: 'variant_e7e4aa7479b0', tagadaPriceId: 'price_45e11dcc8f3d', price: 139 },
  { mbmSku: 'MBM-WM-SEM-INJ-003', mbmVariantId: 'semaglutide-v3', tagadaProductId: 'product_cfd1a23b5095', tagadaVariantId: 'variant_1578824794e6', tagadaPriceId: 'price_a6e38799524f', price: 189.02 },
  { mbmSku: 'MBM-WM-SEM-INJ-004', mbmVariantId: 'semaglutide-v4', tagadaProductId: 'product_cfd1a23b5095', tagadaVariantId: 'variant_0858c18b808e', tagadaPriceId: 'price_dbc846be2af8', price: 329 },
  { mbmSku: 'MBM-WM-TIR-INJ-001', mbmVariantId: 'tirzepatide-v1', tagadaProductId: 'product_e29d94f9fa68', tagadaVariantId: 'variant_8ed93e38d4bb', tagadaPriceId: 'price_a638edd7e278', price: 189 },
  { mbmSku: 'MBM-WM-TIR-INJ-002', mbmVariantId: 'tirzepatide-v2', tagadaProductId: 'product_e29d94f9fa68', tagadaVariantId: 'variant_65197b99b7c1', tagadaPriceId: 'price_025ae1e10e81', price: 258.99 },
  { mbmSku: 'MBM-WM-TIR-INJ-003', mbmVariantId: 'tirzepatide-v3', tagadaProductId: 'product_e29d94f9fa68', tagadaVariantId: 'variant_c36104e1b53c', tagadaPriceId: 'price_3c12d8bb293b', price: 369 },
  { mbmSku: 'MBM-WM-TIR-INJ-004', mbmVariantId: 'tirzepatide-v4', tagadaProductId: 'product_e29d94f9fa68', tagadaVariantId: 'variant_89f15bb9ad30', tagadaPriceId: 'price_8a73862931ca', price: 429 },
  { mbmSku: 'MBM-HRT-EST-PAT-001', mbmVariantId: 'estradiol-patch-v1', tagadaProductId: 'product_85efa138a720', tagadaVariantId: 'variant_77a5809b96cc', tagadaPriceId: 'price_bb2cd434d6cb', price: 129 },
  { mbmSku: 'MBM-HRT-EST-PAT-002', mbmVariantId: 'estradiol-patch-v2', tagadaProductId: 'product_85efa138a720', tagadaVariantId: 'variant_96a619fecc8b', tagadaPriceId: 'price_bc07cb8899a4', price: 138.98 },
  { mbmSku: 'MBM-HRT-EST-PAT-003', mbmVariantId: 'estradiol-patch-v3', tagadaProductId: 'product_85efa138a720', tagadaVariantId: 'variant_48a704f13621', tagadaPriceId: 'price_22d08b77e3ac', price: 149 },
  { mbmSku: 'MBM-HRT-PRG-CAP-001', mbmVariantId: 'progesterone-capsules-v1', tagadaProductId: 'product_eafa22bb516b', tagadaVariantId: 'variant_e37d0c490dba', tagadaPriceId: 'price_a99f863c0fe1', price: 39 },
  { mbmSku: 'MBM-HRT-PRG-CAP-002', mbmVariantId: 'progesterone-capsules-v2', tagadaProductId: 'product_eafa22bb516b', tagadaVariantId: 'variant_bdbc2b9f0ade', tagadaPriceId: 'price_2e5104ff73e0', price: 59 },
  { mbmSku: 'MBM-HRT-TST-CRM-001', mbmVariantId: 'testosterone-cream-v1', tagadaProductId: 'product_d17c0fc61a9d', tagadaVariantId: 'variant_39c27962b958', tagadaPriceId: 'price_14296712e379', price: 79 },
  { mbmSku: 'MBM-LON-NAD-INJ-001', mbmVariantId: 'nad-plus-v1', tagadaProductId: 'product_e017c0328e4f', tagadaVariantId: 'variant_d2b5be492da2', tagadaPriceId: 'price_f7e899c11336', price: 199 },
  { mbmSku: 'MBM-LON-NAD-INJ-002', mbmVariantId: 'nad-plus-v2', tagadaProductId: 'product_e017c0328e4f', tagadaVariantId: 'variant_5085e02375d1', tagadaPriceId: 'price_94fd558220c1', price: 229 },
  { mbmSku: 'MBM-LON-SEL-INJ-001', mbmVariantId: 'selank-v1', tagadaProductId: 'product_2cf8d35d5ca5', tagadaVariantId: 'variant_35f9129e2cae', tagadaPriceId: 'price_0519a38f67b0', price: 129 },
  { mbmSku: 'MBM-LON-SMX-INJ-001', mbmVariantId: 'semax-v1', tagadaProductId: 'product_bebd3d185d9d', tagadaVariantId: 'variant_8f66246f1d44', tagadaPriceId: 'price_6aca1278605b', price: 129 },
  { mbmSku: 'MBM-LON-SSN-NS-001', mbmVariantId: 'selank-semax-nasal-spray-v1', tagadaProductId: 'product_19ba577f533d', tagadaVariantId: 'variant_7fa5cf5aab9c', tagadaPriceId: 'price_12025a97b268', price: 169 },
  { mbmSku: 'MBM-RP-BPC-CAP-001', mbmVariantId: 'bpc-157-tb-500-v1', tagadaProductId: 'product_73694d0d8088', tagadaVariantId: 'variant_5d38654f00fc', tagadaPriceId: 'price_548c95f3d3bd', price: 99 },
  { mbmSku: 'MBM-RP-BPC-INJ-001', mbmVariantId: 'bpc-157-tb-500-v2', tagadaProductId: 'product_73694d0d8088', tagadaVariantId: 'variant_28a362285cd1', tagadaPriceId: 'price_468c0be65863', price: 199 },
  { mbmSku: 'MBM-SH-TRE-CRM-001', mbmVariantId: 'tretinoin-cream-v1', tagadaProductId: 'product_175afd281f90', tagadaVariantId: 'variant_708bb1c9f5f0', tagadaPriceId: 'price_c7871c25c2eb', price: 79 },
  { mbmSku: 'MBM-SH-TRE-CRM-003', mbmVariantId: 'tretinoin-cream-v3', tagadaProductId: 'product_175afd281f90', tagadaVariantId: 'variant_8f7950e121d1', tagadaPriceId: 'price_26636d01db04', price: 109 },
  { mbmSku: 'MBM-SH-MIN-SOL-001', mbmVariantId: 'minoxidil-topical-v1', tagadaProductId: 'product_022a589de097', tagadaVariantId: 'variant_f9e5928143c7', tagadaPriceId: 'price_98520d872070', price: 129 },
  { mbmSku: 'MBM-SH-BIM-SOL-001', mbmVariantId: 'bimatoprost-solution-v1', tagadaProductId: 'product_c31c3e94d21d', tagadaVariantId: 'variant_321ade2267a1', tagadaPriceId: 'price_338fe6049a04', price: 89 },
];

const MATCHED_SKUS = new Set(MATCHED.map((m) => m.mbmSku));

type CreateProduct = {
  name: string;
  description?: string;
  isShippable: boolean;
  isTaxable: boolean;
  variants: {
    name: string;
    description?: string;
    sku: string;
    default?: boolean;
    price: { amountCents: number; recurring?: boolean; interval?: string | null; intervalCount?: number | null };
  }[];
};

function buildMissingCreates(): CreateProduct[] {
  const creates: CreateProduct[] = [];
  // Group missing retail variants by parent product
  const byParent = new Map<string, { product: (typeof products)[0]; variants: (typeof products)[0]['variants'] }>();
  for (const p of products) {
    for (const v of p.variants || []) {
      const sku = VARIANT_SKU_BY_ID[v.id as keyof typeof VARIANT_SKU_BY_ID];
      if (!sku || MATCHED_SKUS.has(sku)) continue;
      // Include tretinoin 0.05% (resolved ambiguous → create)
      // Skip nothing else matched
      const entry = byParent.get(p.id) || { product: p, variants: [] };
      entry.variants.push(v);
      byParent.set(p.id, entry);
    }
  }

  for (const { product: p, variants } of byParent.values()) {
    // If parent already exists in Tagada for tretinoin, create ONLY the missing 0.05% as its own product
    // to avoid duplicating 0.025%/0.1%. For brand-new parents, create full product.
    const existingParents: Record<string, string> = {
      p69: 'product_175afd281f90', // Tretinoin — only create missing 0.05% as separate product line item
    };
    if (existingParents[p.id]) {
      for (const v of variants) {
        const sku = VARIANT_SKU_BY_ID[v.id as keyof typeof VARIANT_SKU_BY_ID]!;
        const label = variantLabel(v);
        creates.push({
          name: `${p.name} — ${label}`,
          description: `${p.name} ${label}`,
          isShippable: p.category !== 'provider-care',
          isTaxable: true,
          variants: [
            {
              name: label,
              description: label,
              sku,
              default: true,
              price: { amountCents: cents(Number(v.price)), recurring: false },
            },
          ],
        });
      }
      continue;
    }

    creates.push({
      name: p.name,
      description: p.name,
      isShippable: p.category !== 'provider-care',
      isTaxable: true,
      variants: variants.map((v, idx) => {
        const sku = VARIANT_SKU_BY_ID[v.id as keyof typeof VARIANT_SKU_BY_ID]!;
        const label = variantLabel(v);
        return {
          name: label,
          description: label,
          sku,
          default: idx === 0,
          price: { amountCents: cents(Number(v.price)), recurring: false },
        };
      }),
    });
  }

  // Memberships — separate PROGRAM products (resolved from ambiguous)
  for (const m of memberships) {
    const appId = m.checkoutProductId || m.supabaseId || m.id;
    const sku =
      m.programSku ||
      MEMBERSHIP_PROGRAM_SKU_BY_APP_ID[
        appId as keyof typeof MEMBERSHIP_PROGRAM_SKU_BY_APP_ID
      ];
    if (!sku || !sku.includes('-MEM-')) continue;
    creates.push({
      name: m.displayName,
      description: `${m.displayName} program (monthly). Membership PROGRAM SKU — not medication fulfillment.`,
      isShippable: false,
      isTaxable: true,
      variants: [
        {
          name: 'Monthly membership program',
          description: 'Program SKU — fulfillment medication SKU selected separately at order time',
          sku,
          default: true,
          price: {
            amountCents: cents(Number(m.monthlyPrice)),
            recurring: true,
            interval: 'month',
            intervalCount: 1,
          },
        },
      ],
    });
  }

  return creates;
}

const step = process.argv[2] || 'all';

async function main() {
  const log: Record<string, unknown> = { step, at: new Date().toISOString() };

  if (step === 'list' || step === 'all' || step === 'verify') {
    const listed = await callFn('list');
    fs.writeFileSync('/tmp/tagada_sync_list.json', JSON.stringify(listed.data, null, 2));
    const items = (listed.data as { data?: { items?: unknown[] } })?.data?.items || [];
    log.listHttp = listed.http;
    log.productCount = Array.isArray(items) ? items.length : null;
    console.log('LIST products=', log.productCount, 'http=', listed.http);
  }

  if (step === 'set_skus' || step === 'all') {
    const updates = MATCHED.map((m) => ({
      productId: m.tagadaProductId,
      productName: m.mbmSku,
      variantId: m.tagadaVariantId,
      sku: m.mbmSku,
      expectedPriceCents: cents(m.price),
    }));
    const res = await callFn('set_skus', { updates });
    fs.writeFileSync('/tmp/tagada_sync_set_skus.json', JSON.stringify(res.data, null, 2));
    log.setSkusHttp = res.http;
    log.setSkus = res.data;
    console.log('SET_SKUS http=', res.http, JSON.stringify(res.data).slice(0, 500));
  }

  if (step === 'create' || step === 'all') {
    const productsToCreate = buildMissingCreates();
    fs.writeFileSync(
      '/tmp/tagada_sync_create_payload.json',
      JSON.stringify(productsToCreate, null, 2),
    );
    console.log('CREATE_PAYLOAD products=', productsToCreate.length, 'variants=', productsToCreate.reduce((n, p) => n + p.variants.length, 0));
    // Batch create
    const res = await callFn('create_products', { products: productsToCreate });
    fs.writeFileSync('/tmp/tagada_sync_create_result.json', JSON.stringify(res.data, null, 2));
    log.createHttp = res.http;
    log.create = res.data;
    console.log('CREATE http=', res.http);
    const results = (res.data as { results?: { ok?: boolean; name?: string; status?: number }[] })?.results || [];
    console.log(
      'CREATE summary',
      results.map((r) => `${r.ok ? 'OK' : 'FAIL'}:${r.name}:${r.status}`).join(' | '),
    );
  }

  fs.writeFileSync('/tmp/tagada_sync_log.json', JSON.stringify(log, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
