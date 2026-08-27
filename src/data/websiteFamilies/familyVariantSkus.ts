/**
 * Storefront SKUs for website-family variants.
 * Historical B6 SKUs stay in variantSkus.ts for prior orders — they are not
 * assigned to cutover catalog variants.
 */

export const FAMILY_VARIANT_SKU_BY_ID: Readonly<Record<string, string>> = {
  'sem-b12-starting-low': 'MBM-WM-SEM-B12-001',
  'sem-b12-mid': 'MBM-WM-SEM-B12-002',
  'sem-b12-high': 'MBM-WM-SEM-B12-003',
  'sem-b12-any-dose': 'MBM-WM-SEM-B12-004',
  'sem-b12-2mg': 'MBM-WM-SEM-B12-005',
  'sem-b12-10mg': 'MBM-WM-SEM-B12-006',
  'sem-glycine-starting-low': 'MBM-WM-SEM-GLY-001',
  'sem-glycine-mid': 'MBM-WM-SEM-GLY-002',
  'sem-glycine-high': 'MBM-WM-SEM-GLY-003',
  'sem-glycine-any-dose': 'MBM-WM-SEM-GLY-004',
  'sem-glycine-2mg': 'MBM-WM-SEM-GLY-005',
  'sem-glycine-10mg': 'MBM-WM-SEM-GLY-006',
  'tir-b12-starting-low': 'MBM-WM-TIR-B12-001',
  'tir-b12-mid': 'MBM-WM-TIR-B12-002',
  'tir-b12-high': 'MBM-WM-TIR-B12-003',
  'tir-b12-any-dose': 'MBM-WM-TIR-B12-004',
  'tir-b12-10mg-ml': 'MBM-WM-TIR-B12-005',
  'tir-b12-20mg-ml': 'MBM-WM-TIR-B12-006',
  'tir-b12-30mg-ml': 'MBM-WM-TIR-B12-007',
  'tir-glycine-starting-low': 'MBM-WM-TIR-GLY-001',
  'tir-glycine-mid': 'MBM-WM-TIR-GLY-002',
  'tir-glycine-high': 'MBM-WM-TIR-GLY-003',
  'tir-glycine-any-dose': 'MBM-WM-TIR-GLY-004',
  'tir-glycine-10mg-ml': 'MBM-WM-TIR-GLY-005',
  'tir-glycine-20mg-ml': 'MBM-WM-TIR-GLY-006',
  'tir-glycine-30mg-ml': 'MBM-WM-TIR-GLY-007',
  'nad-nasal-r84': 'MBM-LON-NAD-NS-001',
};

const PAYMENT_ONLY_VARIANT_SKU_BY_ID: Readonly<Record<string, string>> = {
  'nad-inj-5ml-500': 'MBM-LON-NAD-INJ-001',
  'nad-inj-10ml-1000': 'MBM-LON-NAD-INJ-002',
};

export function skuForFamilyVariantId(websiteVariantId: string | null | undefined): string | null {
  if (!websiteVariantId) return null;
  return FAMILY_VARIANT_SKU_BY_ID[websiteVariantId] ?? PAYMENT_ONLY_VARIANT_SKU_BY_ID[websiteVariantId] ?? null;
}

export function familyVariantIdForSku(sku: string | null | undefined): string | null {
  const want = (sku || '').trim().toUpperCase();
  if (!want) return null;
  for (const [id, mapped] of Object.entries(FAMILY_VARIANT_SKU_BY_ID)) {
    if (mapped === want) return id;
  }
  for (const [id, mapped] of Object.entries(PAYMENT_ONLY_VARIANT_SKU_BY_ID)) {
    if (mapped === want) return id;
  }
  return null;
}
