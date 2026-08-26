/**
 * Launch-ready website-family SKU → GEN clientProductId.
 * Mirror of src/lib/catalog/familyCommerce.ts for Edge. Do not invent IDs.
 * Real GEN order submission remains fail-closed (REAL_GEN_ORDER_SUBMISSION_ENABLED=false).
 */

export const FAMILY_SKU_TO_GEN_CLIENT_PRODUCT_ID: Readonly<Record<string, string>> = {
  'MBM-WM-SEM-B12-001': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SkqQHmsc0WdsbK9vmV1y',
  'MBM-WM-SEM-B12-002': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_NF825utCtjVqbbGsnQN3',
  'MBM-WM-SEM-B12-003': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_34I2X8MpVZf3AQTff3bo',
  'MBM-WM-SEM-B12-004': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_MkDIUw0NcJB7YL2pNzYW',
  'MBM-WM-SEM-B12-005': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SkqQHmsc0WdsbK9vmV1y',
  'MBM-WM-SEM-B12-006': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_34I2X8MpVZf3AQTff3bo',
  'MBM-WM-SEM-GLY-001': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_tk2GW39OGr7JX4MCCoJP',
  'MBM-WM-SEM-GLY-002': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_CjqOUbPuGPZzxephqRou',
  'MBM-WM-SEM-GLY-003': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_sssEk3FDY4LFbQYGQsLx',
  'MBM-WM-SEM-GLY-004': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_wQK2JsFnh7oFBf3Lag4n',
  'MBM-WM-SEM-GLY-005': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_tk2GW39OGr7JX4MCCoJP',
  'MBM-WM-SEM-GLY-006': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_sssEk3FDY4LFbQYGQsLx',
  'MBM-WM-TIR-B12-001': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SvFDJ7W4nmWL2bkLUMMS',
  'MBM-WM-TIR-B12-002': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SvFDJ7W4nmWL2bkLUMMS',
  'MBM-WM-TIR-B12-003': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SvFDJ7W4nmWL2bkLUMMS',
  'MBM-WM-TIR-B12-004': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SvFDJ7W4nmWL2bkLUMMS',
  'MBM-WM-TIR-B12-005': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SvFDJ7W4nmWL2bkLUMMS',
  'MBM-WM-TIR-B12-006': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SvFDJ7W4nmWL2bkLUMMS',
  'MBM-WM-TIR-B12-007': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SvFDJ7W4nmWL2bkLUMMS',
  'MBM-WM-TIR-GLY-001': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SvFDJ7W4nmWL2bkLUMMS',
  'MBM-WM-TIR-GLY-002': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SvFDJ7W4nmWL2bkLUMMS',
  'MBM-WM-TIR-GLY-003': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SvFDJ7W4nmWL2bkLUMMS',
  'MBM-WM-TIR-GLY-004': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SvFDJ7W4nmWL2bkLUMMS',
  'MBM-WM-TIR-GLY-005': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SvFDJ7W4nmWL2bkLUMMS',
  'MBM-WM-TIR-GLY-006': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SvFDJ7W4nmWL2bkLUMMS',
  'MBM-WM-TIR-GLY-007': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SvFDJ7W4nmWL2bkLUMMS',
  'MBM-LON-NAD-NS-001': 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_FVwkzvQqWIZRNAwbslGw',
};

export function resolveGenClientProductIdForSku(sku: string | null | undefined): string | null {
  const key = (sku || '').trim().toUpperCase();
  if (!key) return null;
  return FAMILY_SKU_TO_GEN_CLIENT_PRODUCT_ID[key] ?? null;
}

/**
 * Launch-ready one-time family SKUs may complete Tagada payment while GEN API Orders
 * and GEN handoff automation remain OFF. Does not enable real GEN order creation.
 */
export function isLaunchReadyFamilyPaymentSku(sku: string | null | undefined): boolean {
  return resolveGenClientProductIdForSku(sku) != null;
}
