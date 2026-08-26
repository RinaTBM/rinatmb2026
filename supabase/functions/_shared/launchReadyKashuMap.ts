/**
 * Live-verified Tagada / kashu maps for MBM-FINAL-CHECKOUT-LAUNCH-1.
 *
 * IDs were read from Tagada via Edge `tagada-product-sync` list/get on 2026-08-25
 * (store bound to checkout.mybaremethod.com). GLP-1 vial-specific SKUs 005/006/007
 * re-read 2026-08-26: 8/10 live; SEM-B12-006 and SEM-GLY-006 still missing.
 * Do not invent IDs.
 *
 * One-time family products are isTaxable=false, isShippable=false, one-time USD.
 * Ordinary one-time carts still append MBM-SHIP-TWO-DAY-001 / MBM-SHIP-NEXT-DAY-001.
 * Membership enrollment does NOT append MBM-SHIP — shipping is inside the combo priceId.
 *
 * Historical TIR $249 / $279 / $299 Tagada prices remain in Tagada for old subscriptions.
 * New TIR enrollments use $275 / $305 / $325.
 */

export type LaunchReadyKashuMapRow = {
  mbm_sku: string;
  mbm_product_id: string;
  mbm_variant_id: string;
  tagada_product_id: string;
  tagada_variant_id: string;
  tagada_price_id: string;
  mbm_price_cents: number;
  tagada_price_cents: number;
  website_family: string;
  website_variant_id: string;
};

export const LAUNCH_READY_KASHU_MAP_ROWS: readonly LaunchReadyKashuMapRow[] = [
  {
    mbm_sku: 'MBM-WM-SEM-B12-001',
    mbm_product_id: 'p1',
    mbm_variant_id: 'sem-b12-starting-low',
    tagada_product_id: 'product_6b750325addf',
    tagada_variant_id: 'variant_f9ac5ea25184',
    tagada_price_id: 'price_e31ac583370d',
    mbm_price_cents: 8900,
    tagada_price_cents: 8900,
    website_family: 'semaglutide',
    website_variant_id: 'sem-b12-starting-low',
  },
  {
    mbm_sku: 'MBM-WM-SEM-B12-002',
    mbm_product_id: 'p1',
    mbm_variant_id: 'sem-b12-mid',
    tagada_product_id: 'product_6b750325addf',
    tagada_variant_id: 'variant_d839f0aab609',
    tagada_price_id: 'price_0bf0b622fd45',
    mbm_price_cents: 10900,
    tagada_price_cents: 10900,
    website_family: 'semaglutide',
    website_variant_id: 'sem-b12-mid',
  },
  {
    mbm_sku: 'MBM-WM-SEM-B12-003',
    mbm_product_id: 'p1',
    mbm_variant_id: 'sem-b12-high',
    tagada_product_id: 'product_6b750325addf',
    tagada_variant_id: 'variant_d9dac92d2f71',
    tagada_price_id: 'price_3c22af390881',
    mbm_price_cents: 10900,
    tagada_price_cents: 10900,
    website_family: 'semaglutide',
    website_variant_id: 'sem-b12-high',
  },
  {
    mbm_sku: 'MBM-WM-SEM-B12-004',
    mbm_product_id: 'p1',
    mbm_variant_id: 'sem-b12-any-dose',
    tagada_product_id: 'product_6b750325addf',
    tagada_variant_id: 'variant_9ffb5ebc2ee4',
    tagada_price_id: 'price_0b4649e6fc5b',
    mbm_price_cents: 8900,
    tagada_price_cents: 8900,
    website_family: 'semaglutide',
    website_variant_id: 'sem-b12-any-dose',
  },
  {
    mbm_sku: 'MBM-WM-SEM-B12-005',
    mbm_product_id: 'p1',
    mbm_variant_id: 'sem-b12-2mg',
    tagada_product_id: 'product_6b750325addf',
    tagada_variant_id: 'variant_a726bfe758b3',
    tagada_price_id: 'price_1c3c8051e3b5',
    mbm_price_cents: 9900,
    tagada_price_cents: 9900,
    website_family: 'semaglutide',
    website_variant_id: 'sem-b12-2mg',
  },
  {
    mbm_sku: 'MBM-WM-SEM-GLY-001',
    mbm_product_id: 'p1',
    mbm_variant_id: 'sem-glycine-starting-low',
    tagada_product_id: 'product_dcc64482bbbf',
    tagada_variant_id: 'variant_c51c894cfee6',
    tagada_price_id: 'price_74822644bb1f',
    mbm_price_cents: 8900,
    tagada_price_cents: 8900,
    website_family: 'semaglutide',
    website_variant_id: 'sem-glycine-starting-low',
  },
  {
    mbm_sku: 'MBM-WM-SEM-GLY-002',
    mbm_product_id: 'p1',
    mbm_variant_id: 'sem-glycine-mid',
    tagada_product_id: 'product_dcc64482bbbf',
    tagada_variant_id: 'variant_398f72f8ca6b',
    tagada_price_id: 'price_9113997a5445',
    mbm_price_cents: 10900,
    tagada_price_cents: 10900,
    website_family: 'semaglutide',
    website_variant_id: 'sem-glycine-mid',
  },
  {
    mbm_sku: 'MBM-WM-SEM-GLY-003',
    mbm_product_id: 'p1',
    mbm_variant_id: 'sem-glycine-high',
    tagada_product_id: 'product_dcc64482bbbf',
    tagada_variant_id: 'variant_a71889d8f2e1',
    tagada_price_id: 'price_0c321507201f',
    mbm_price_cents: 10900,
    tagada_price_cents: 10900,
    website_family: 'semaglutide',
    website_variant_id: 'sem-glycine-high',
  },
  {
    mbm_sku: 'MBM-WM-SEM-GLY-004',
    mbm_product_id: 'p1',
    mbm_variant_id: 'sem-glycine-any-dose',
    tagada_product_id: 'product_dcc64482bbbf',
    tagada_variant_id: 'variant_cea940cbbe1a',
    tagada_price_id: 'price_95d6839eb9c2',
    mbm_price_cents: 8900,
    tagada_price_cents: 8900,
    website_family: 'semaglutide',
    website_variant_id: 'sem-glycine-any-dose',
  },
  {
    mbm_sku: 'MBM-WM-SEM-GLY-005',
    mbm_product_id: 'p1',
    mbm_variant_id: 'sem-glycine-2mg',
    tagada_product_id: 'product_dcc64482bbbf',
    tagada_variant_id: 'variant_1f6e4f4d2cb4',
    tagada_price_id: 'price_cea49d485af6',
    mbm_price_cents: 9900,
    tagada_price_cents: 9900,
    website_family: 'semaglutide',
    website_variant_id: 'sem-glycine-2mg',
  },
  {
    mbm_sku: 'MBM-WM-TIR-B12-001',
    mbm_product_id: 'p5',
    mbm_variant_id: 'tir-b12-starting-low',
    tagada_product_id: 'product_74cd4752c9d6',
    tagada_variant_id: 'variant_2d96cc588f51',
    tagada_price_id: 'price_ed0142289010',
    mbm_price_cents: 11900,
    tagada_price_cents: 11900,
    website_family: 'tirzepatide',
    website_variant_id: 'tir-b12-starting-low',
  },
  {
    mbm_sku: 'MBM-WM-TIR-B12-002',
    mbm_product_id: 'p5',
    mbm_variant_id: 'tir-b12-mid',
    tagada_product_id: 'product_74cd4752c9d6',
    tagada_variant_id: 'variant_0acda4e3b2d7',
    tagada_price_id: 'price_3db063ba334a',
    mbm_price_cents: 14900,
    tagada_price_cents: 14900,
    website_family: 'tirzepatide',
    website_variant_id: 'tir-b12-mid',
  },
  {
    mbm_sku: 'MBM-WM-TIR-B12-003',
    mbm_product_id: 'p5',
    mbm_variant_id: 'tir-b12-high',
    tagada_product_id: 'product_74cd4752c9d6',
    tagada_variant_id: 'variant_5e13db7812ee',
    tagada_price_id: 'price_fb5946461765',
    mbm_price_cents: 16900,
    tagada_price_cents: 16900,
    website_family: 'tirzepatide',
    website_variant_id: 'tir-b12-high',
  },
  {
    mbm_sku: 'MBM-WM-TIR-B12-004',
    mbm_product_id: 'p5',
    mbm_variant_id: 'tir-b12-any-dose',
    tagada_product_id: 'product_74cd4752c9d6',
    tagada_variant_id: 'variant_5be6af0494ac',
    tagada_price_id: 'price_a6eba9a2a721',
    mbm_price_cents: 11900,
    tagada_price_cents: 11900,
    website_family: 'tirzepatide',
    website_variant_id: 'tir-b12-any-dose',
  },
  {
    mbm_sku: 'MBM-WM-TIR-B12-005',
    mbm_product_id: 'p5',
    mbm_variant_id: 'tir-b12-10mg-ml',
    tagada_product_id: 'product_74cd4752c9d6',
    tagada_variant_id: 'variant_1f1dab8b6177',
    tagada_price_id: 'price_ea84cec6ed40',
    mbm_price_cents: 13900,
    tagada_price_cents: 13900,
    website_family: 'tirzepatide',
    website_variant_id: 'tir-b12-10mg-ml',
  },
  {
    mbm_sku: 'MBM-WM-TIR-B12-006',
    mbm_product_id: 'p5',
    mbm_variant_id: 'tir-b12-20mg-ml',
    tagada_product_id: 'product_74cd4752c9d6',
    tagada_variant_id: 'variant_dd351c9f2fd1',
    tagada_price_id: 'price_e6ef11aa3bd1',
    mbm_price_cents: 15900,
    tagada_price_cents: 15900,
    website_family: 'tirzepatide',
    website_variant_id: 'tir-b12-20mg-ml',
  },
  {
    mbm_sku: 'MBM-WM-TIR-B12-007',
    mbm_product_id: 'p5',
    mbm_variant_id: 'tir-b12-30mg-ml',
    tagada_product_id: 'product_74cd4752c9d6',
    tagada_variant_id: 'variant_56e8f07d6ab2',
    tagada_price_id: 'price_bc09750e5e79',
    mbm_price_cents: 17900,
    tagada_price_cents: 17900,
    website_family: 'tirzepatide',
    website_variant_id: 'tir-b12-30mg-ml',
  },
  {
    mbm_sku: 'MBM-WM-TIR-GLY-001',
    mbm_product_id: 'p5',
    mbm_variant_id: 'tir-glycine-starting-low',
    tagada_product_id: 'product_861e0edd8ab2',
    tagada_variant_id: 'variant_ddd60b897d66',
    tagada_price_id: 'price_5e4581d60278',
    mbm_price_cents: 11900,
    tagada_price_cents: 11900,
    website_family: 'tirzepatide',
    website_variant_id: 'tir-glycine-starting-low',
  },
  {
    mbm_sku: 'MBM-WM-TIR-GLY-002',
    mbm_product_id: 'p5',
    mbm_variant_id: 'tir-glycine-mid',
    tagada_product_id: 'product_861e0edd8ab2',
    tagada_variant_id: 'variant_b7e1562ee522',
    tagada_price_id: 'price_0e41d6b0aeab',
    mbm_price_cents: 14900,
    tagada_price_cents: 14900,
    website_family: 'tirzepatide',
    website_variant_id: 'tir-glycine-mid',
  },
  {
    mbm_sku: 'MBM-WM-TIR-GLY-003',
    mbm_product_id: 'p5',
    mbm_variant_id: 'tir-glycine-high',
    tagada_product_id: 'product_861e0edd8ab2',
    tagada_variant_id: 'variant_121e6d8cd921',
    tagada_price_id: 'price_9803c9a96da8',
    mbm_price_cents: 16900,
    tagada_price_cents: 16900,
    website_family: 'tirzepatide',
    website_variant_id: 'tir-glycine-high',
  },
  {
    mbm_sku: 'MBM-WM-TIR-GLY-004',
    mbm_product_id: 'p5',
    mbm_variant_id: 'tir-glycine-any-dose',
    tagada_product_id: 'product_861e0edd8ab2',
    tagada_variant_id: 'variant_6c383930239c',
    tagada_price_id: 'price_cb4042a35b42',
    mbm_price_cents: 11900,
    tagada_price_cents: 11900,
    website_family: 'tirzepatide',
    website_variant_id: 'tir-glycine-any-dose',
  },
  {
    mbm_sku: 'MBM-WM-TIR-GLY-005',
    mbm_product_id: 'p5',
    mbm_variant_id: 'tir-glycine-10mg-ml',
    tagada_product_id: 'product_861e0edd8ab2',
    tagada_variant_id: 'variant_7726800f83dd',
    tagada_price_id: 'price_33457ae01ee9',
    mbm_price_cents: 13900,
    tagada_price_cents: 13900,
    website_family: 'tirzepatide',
    website_variant_id: 'tir-glycine-10mg-ml',
  },
  {
    mbm_sku: 'MBM-WM-TIR-GLY-006',
    mbm_product_id: 'p5',
    mbm_variant_id: 'tir-glycine-20mg-ml',
    tagada_product_id: 'product_861e0edd8ab2',
    tagada_variant_id: 'variant_57cd2414aabf',
    tagada_price_id: 'price_2a8c8629ae5c',
    mbm_price_cents: 15900,
    tagada_price_cents: 15900,
    website_family: 'tirzepatide',
    website_variant_id: 'tir-glycine-20mg-ml',
  },
  {
    mbm_sku: 'MBM-WM-TIR-GLY-007',
    mbm_product_id: 'p5',
    mbm_variant_id: 'tir-glycine-30mg-ml',
    tagada_product_id: 'product_861e0edd8ab2',
    tagada_variant_id: 'variant_1446f75121d7',
    tagada_price_id: 'price_5bcb6c9f666c',
    mbm_price_cents: 17900,
    tagada_price_cents: 17900,
    website_family: 'tirzepatide',
    website_variant_id: 'tir-glycine-30mg-ml',
  },
  {
    mbm_sku: 'MBM-LON-NAD-NS-001',
    mbm_product_id: 'p9',
    mbm_variant_id: 'nad-nasal-r84',
    tagada_product_id: 'product_9dd959e8b3b2',
    tagada_variant_id: 'variant_c41bb700e856',
    tagada_price_id: 'price_79f07341d00a',
    mbm_price_cents: 7900,
    tagada_price_cents: 7900,
    website_family: 'nad',
    website_variant_id: 'nad-nasal-r84',
  },
  {
    mbm_sku: 'MBM-MEM-TIR-MEM-001',
    mbm_product_id: 'm2',
    mbm_variant_id: 'm2',
    tagada_product_id: 'product_8b3bfb6614c4',
    tagada_variant_id: 'variant_b3890c799e09',
    tagada_price_id: 'price_2d2dd07b2f73',
    mbm_price_cents: 27500,
    tagada_price_cents: 27500,
    website_family: 'tirzepatide',
    website_variant_id: 'tir-membership',
  },
] as const;

export const LAUNCH_READY_ONE_TIME_SKUS = LAUNCH_READY_KASHU_MAP_ROWS.filter((r) =>
  r.mbm_sku.startsWith('MBM-WM-') || r.mbm_sku.startsWith('MBM-LON-'),
).map((r) => r.mbm_sku);

export const LAUNCH_READY_KASHU_MAP: Readonly<Record<string, LaunchReadyKashuMapRow>> =
  Object.fromEntries(LAUNCH_READY_KASHU_MAP_ROWS.map((r) => [r.mbm_sku, r]));

export type KashuLookupRow = {
  tagada_variant_id?: string | null;
  tagada_product_id?: string | null;
  tagada_price_id?: string | null;
  mbm_price_cents?: number | null;
  tagada_price_cents?: number | null;
};

/**
 * Prefer a live-verified launch map when the DB row is missing or stale
 * (e.g. TIR membership still mapped to historical $249).
 * Does not enable GEN handoff.
 */
export function resolveKashuSkuMapRow(
  sku: string,
  dbRow?: KashuLookupRow | null,
): KashuLookupRow | null {
  const launch = LAUNCH_READY_KASHU_MAP[sku];
  const hasDb = typeof dbRow?.tagada_variant_id === 'string' && dbRow.tagada_variant_id.trim().length > 0;
  if (!launch) return hasDb ? dbRow! : null;
  if (!hasDb) return launch;
  const cents = Number(dbRow!.tagada_price_cents ?? dbRow!.mbm_price_cents);
  const priceId = typeof dbRow!.tagada_price_id === 'string' ? dbRow!.tagada_price_id : '';
  if (cents === launch.tagada_price_cents && priceId === launch.tagada_price_id) {
    return dbRow!;
  }
  return launch;
}
