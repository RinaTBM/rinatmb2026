// Shared storefront program prices and existing GEN checkout IDs.
// Keep monthly enrollment distinct from one-time starting prices.
export const LIVE_GLP1_PROGRAMS = {
  semaglutide: {
    low: { label: 'Low Dose', price: 139, id: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_7UMqZumyeXaWMX9zOPP3' },
    high: { label: 'High Dose', price: 149, id: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_uM0cXePP8e9c5hiMKcRt' },
    monthly: { label: 'Monthly', price: 129, id: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_1sgLVERqG9oWU9WKht9b' },
  },
  tirzepatide: {
    low: { label: 'Low Dose', price: 259, id: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_mhUSqSGlaFVCghW3V3DD' },
    high: { label: 'High Dose', price: 279, id: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_43kVbBgNLBocKyVUhQmG' },
    monthly: { label: 'Monthly', price: 249, id: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_YkHkffkLKFz3FjC7Wvno' },
  },
} as const;

export type Glp1ProgramChoice = 'low' | 'high' | 'monthly';


export function getLiveGlp1StartingPrice(slug: string): number | undefined {
  if (slug === 'semaglutide' || slug === 'tirzepatide') {
    return Math.min(LIVE_GLP1_PROGRAMS[slug].low.price, LIVE_GLP1_PROGRAMS[slug].high.price);
  }
  return undefined;
}
