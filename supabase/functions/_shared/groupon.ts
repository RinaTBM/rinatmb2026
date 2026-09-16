/** Manual voucher tracking only. Never passed to payment or clinical APIs. */
export const GROUPON_PACKAGES = [
  { id: 'GROUPON-ESTRADIOL', name: 'Estradiol Hormone Wellness Package', therapy: 'Requested therapy: Estradiol' },
  { id: 'GROUPON-TESTOSTERONE', name: 'Testosterone Hormone Wellness Package', therapy: 'Requested therapy: Testosterone' },
  { id: 'GROUPON-SCREAM', name: "Women's Sexual Wellness / Scream Cream Package", therapy: 'Requested therapy: Scream Cream' },
  { id: 'GROUPON-COMPLETE', name: "Complete Women's Hormone & Sexual Wellness Package", therapy: 'Evaluation for Estradiol, Testosterone, and Scream Cream therapies' },
] as const;

export const GROUPON_STATUSES = ['Pending Verification', 'Verified', 'Redeemed', 'Rejected', 'Cancelled'] as const;
export type GrouponStatus = typeof GROUPON_STATUSES[number];
export const GROUPON_DUPLICATE_MESSAGE = 'This Groupon redemption code has already been used or is already attached to an existing order. Please contact support if you believe this is an error.';
export const GROUPON_CARE_DISCLOSURE = 'Prescription therapies require medical eligibility and licensed-provider approval. Purchase of a Groupon does not guarantee a prescription, medication, dose, or treatment plan.';
// Owner brief reference metadata ONLY; never used as catalog or checkout prices.
export const GROUPON_REFERENCE_COMPONENTS = {
  authority: 'Owner brief reference only; current catalog remains pricing authority',
  consultation_cents: 7500, hormone_panel_cents: 11900, lab_review_cents: 5500, base_pathway_cents: 24900,
  requested_therapy_starting_prices_cents: { estradiol: 12900, testosterone: 8900, scream_cream: 12900 },
};

export function normalizeGrouponCode(value: unknown): string {
  // Preserve case, punctuation and internal spacing until Groupon specifies equivalence.
  return typeof value === 'string' ? value.trim() : '';
}
export function maskGrouponCode(code: string): string {
  return code.length > 4 ? `••••••${code.slice(-4)}` : '••••••';
}
export function validateGrouponSubmission(code: unknown, packageId: unknown): string | null {
  const normalized = normalizeGrouponCode(code);
  if (!normalized) return 'Enter your Groupon redemption code.';
  if (normalized.length > 128 || /[\x00-\x1f\x7f]/.test(normalized)) return 'Check your redemption code and enter it exactly as shown on your voucher.';
  if (!GROUPON_PACKAGES.some(p => p.id === packageId)) return 'Select the Groupon package you purchased.';
  return null;
}
export function canChangeGrouponStatus(from: GrouponStatus, to: GrouponStatus): boolean {
  if (from === to) return true;
  if (from === 'Pending Verification') return ['Verified', 'Rejected', 'Cancelled'].includes(to);
  if (from === 'Verified') return ['Redeemed', 'Rejected', 'Cancelled'].includes(to);
  return false;
}
