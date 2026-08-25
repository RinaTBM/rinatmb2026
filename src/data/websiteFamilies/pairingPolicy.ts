/**
 * Owner-amended GEN formulary pairing policy (MBM-GEN-PAIRING-POLICY-AMENDMENT-1).
 *
 * Pairing purpose: route patient/order into the correct medication family and give
 * the prescribing provider appropriate formulary options. The provider chooses
 * strength/formulation from valid attached options.
 *
 * ACCEPTABLE when:
 * - At least one compatible formulary medication is attached for the website selection
 *   (correct active + additive/form family + approved pharmacy family)
 * - No materially incompatible medications are attached
 * - Multiple same-family strengths/packages MAY remain — do not collapse to one
 *
 * NOT required:
 * - Exact single strength/package equality
 * - GEN API exposure of strength/package fields
 *
 * REJECT (material mismatch):
 * - B12 on Glycine-only CP / Glycine on B12-only CP
 * - Injection on nasal-only / nasal on injection-only
 * - Unrelated active, wrong blend, legacy B6 when B12/Glycine required
 * - Clearly incorrect pharmacy/formulary family (e.g. Greenwich SEM when Dirx-Hub locked)
 * - Owner-rejected / prohibited formulations
 *
 * Authority: docs/MBM_GEN_PAIRING_POLICY_AMENDMENT_1.md
 */

export type AmendedPairingClassification =
  | 'PAIRING_ACCEPTABLE'
  | 'PAIRING_ACCEPTABLE_MULTIPLE_OPTIONS'
  | 'PAIRING_NEEDS_ADDITION'
  | 'PAIRING_HAS_INCOMPATIBLE_MEDICATION'
  | 'PAIRING_MISSING'
  | 'UNABLE_TO_VERIFY';

export const PAIRING_POLICY_AMENDMENT_META = {
  phase: 'MBM-GEN-PAIRING-POLICY-AMENDMENT-1',
  priorStandard: 'exact strength/package match (TOO STRICT — superseded)',
  requiresExactStrengthPackage: false,
  allowsMultipleCompatibleOptions: true,
  providerChoosesStrength: true,
  doc: 'docs/MBM_GEN_PAIRING_POLICY_AMENDMENT_1.md',
} as const;
