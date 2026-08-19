/**
 * Approved variant-level SKU registry (53 total).
 * 51 retail/selectable variant SKUs + 2 membership program SKUs.
 * Do not invent abbreviations or renumber sequences.
 */

export const SKU_PATTERN = /^MBM-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[0-9]{3}$/;

/** variant_key / ProductVariant.id → retail SKU */
export const VARIANT_SKU_BY_ID: Readonly<Record<string, string>> = {
  'semaglutide-v1': 'MBM-WM-SEM-INJ-001',
  'semaglutide-v2': 'MBM-WM-SEM-INJ-002',
  'semaglutide-v3': 'MBM-WM-SEM-INJ-003',
  'semaglutide-v4': 'MBM-WM-SEM-INJ-004',
  'tirzepatide-v1': 'MBM-WM-TIR-INJ-001',
  'tirzepatide-v2': 'MBM-WM-TIR-INJ-002',
  'tirzepatide-v3': 'MBM-WM-TIR-INJ-003',
  'tirzepatide-v4': 'MBM-WM-TIR-INJ-004',
  'fat-burner-v1': 'MBM-WM-FB3-INJ-001',
  'estradiol-patch-v1': 'MBM-HRT-EST-PAT-001',
  'estradiol-patch-v2': 'MBM-HRT-EST-PAT-002',
  'estradiol-patch-v3': 'MBM-HRT-EST-PAT-003',
  'progesterone-capsules-v1': 'MBM-HRT-PRG-CAP-001',
  'progesterone-capsules-v2': 'MBM-HRT-PRG-CAP-002',
  'testosterone-cream-v1': 'MBM-HRT-TST-CRM-001',
  'nad-plus-v1': 'MBM-LON-NAD-INJ-001',
  'nad-plus-v2': 'MBM-LON-NAD-INJ-002',
  'selank-v1': 'MBM-LON-SEL-INJ-001',
  'semax-v1': 'MBM-LON-SMX-INJ-001',
  'selank-semax-nasal-spray-v1': 'MBM-LON-SSN-NS-001',
  'tesamorelin-v1': 'MBM-LON-TESA-INJ-001',
  'bpc-157-tb-500-v1': 'MBM-RP-BPC-CAP-001',
  'bpc-157-tb-500-v2': 'MBM-RP-BPC-INJ-001',
  'tretinoin-cream-v1': 'MBM-SH-TRE-CRM-001',
  'tretinoin-cream-v2': 'MBM-SH-TRE-CRM-002',
  'tretinoin-cream-v3': 'MBM-SH-TRE-CRM-003',
  'minoxidil-topical-v1': 'MBM-SH-MIN-SOL-001',
  'bimatoprost-solution-v1': 'MBM-SH-BIM-SOL-001',
  'initial-provider-consultation-v1': 'MBM-PC-IPV-SRV-001',
  'follow-up-appointment-v1': 'MBM-PC-FUV-SRV-001',
  'laboratory-review-v1': 'MBM-PC-LAB-SRV-001',
  'lab-kit-v1': 'MBM-PC-LAB-KIT-001',
  'complete-injection-starter-kit-v1': 'MBM-ACC-CIS-ACC-001',
  'premium-3d-printed-peptide-case-v1': 'MBM-ACC-PPC-ACC-001',
  'temperature-controlled-travel-case-v1': 'MBM-ACC-TTC-ACC-001',
  'discreet-travel-bag-v1': 'MBM-ACC-DTB-ACC-001',
  'reusable-ice-pack-v1': 'MBM-ACC-ICE-ACC-001',
  'daily-weekly-wellness-planner-v1': 'MBM-ACC-DWP-ACC-001',
  'sharps-container-v1': 'MBM-ACC-SHP-ACC-001',
  'alcohol-prep-wipes-v1': 'MBM-ACC-APW-ACC-001',
  'alcohol-prep-wipes-v2': 'MBM-ACC-APW-ACC-002',
  'premium-insulin-syringes-v1': 'MBM-ACC-PIS-ACC-001',
  'premium-insulin-syringes-v2': 'MBM-ACC-PIS-ACC-002',
  'premium-insulin-syringes-v3': 'MBM-ACC-PIS-ACC-003',
  'premium-insulin-syringes-v4': 'MBM-ACC-PIS-ACC-004',
  'premium-insulin-syringes-v5': 'MBM-ACC-PIS-ACC-005',
  'premium-insulin-syringes-v6': 'MBM-ACC-PIS-ACC-006',
  'premium-insulin-syringes-v7': 'MBM-ACC-PIS-ACC-007',
  'premium-insulin-syringes-v8': 'MBM-ACC-PIS-ACC-008',
  'premium-insulin-syringes-v9': 'MBM-ACC-PIS-ACC-009',
  'premium-insulin-syringes-v10': 'MBM-ACC-PIS-ACC-010',
};

/** Membership checkoutProductId (m1/m2) → program SKU */
export const MEMBERSHIP_PROGRAM_SKU_BY_APP_ID: Readonly<Record<string, string>> = {
  m1: 'MBM-MEM-SEM-MEM-001',
  m2: 'MBM-MEM-TIR-MEM-001',
};

export const EXPECTED_RETAIL_SKU_COUNT = 51;
export const EXPECTED_MEMBERSHIP_PROGRAM_SKU_COUNT = 2;
export const EXPECTED_TOTAL_SKU_COUNT =
  EXPECTED_RETAIL_SKU_COUNT + EXPECTED_MEMBERSHIP_PROGRAM_SKU_COUNT;

export function skuForVariantId(variantId: string | undefined | null): string | null {
  if (!variantId) return null;
  const key = variantId.replace(/-refill$/i, '');
  return VARIANT_SKU_BY_ID[key] ?? null;
}

export function programSkuForMembershipAppId(appId: string | undefined | null): string | null {
  if (!appId) return null;
  return MEMBERSHIP_PROGRAM_SKU_BY_APP_ID[appId] ?? null;
}
