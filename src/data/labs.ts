export type LabCollection = 'in-home' | 'walk-in';
export type LabVendor = 'labcorp' | 'quest';

export interface LabOption {
  name: string;
  displayName: string;
  collection: LabCollection;
  vendor: LabVendor;
  targetAudience: string;
  markerCount: number;
  costCents: number;
  productId: string;
}

export const GEN_LABS_CLIENT_ID = 'f5e0mdyBYnDh7HGvek0C';
export const GEN_LABS_BASE_URL = `https://app.genhealthehr.com/${GEN_LABS_CLIENT_ID}/product`;

export const labOptions: LabOption[] = [
  { name: 'In-Home LabCorp Female HRT Comprehensive Panel', displayName: 'Female HRT Comprehensive Panel', collection: 'in-home', vendor: 'labcorp', targetAudience: 'Female', markerCount: 11, costCents: 15649, productId: 'lab-junction-a530dda9-at-home-labcorp-female-hrt-comprehensive-panel' },
  { name: 'In-Home Quest Female HRT Comprehensive Panel', displayName: 'Female HRT Comprehensive Panel', collection: 'in-home', vendor: 'quest', targetAudience: 'Any', markerCount: 14, costCents: 6975, productId: 'lab-junction-a530dda9-at-home-quest-female-hrt-comprehensive-panel' },
  { name: 'In-Home Quest Female HRT Follow-Up Panel', displayName: 'Female HRT Follow-Up Panel', collection: 'in-home', vendor: 'quest', targetAudience: 'Any', markerCount: 6, costCents: 5038, productId: 'lab-junction-a530dda9-at-home-quest-female-hrt-follow-up' },
  { name: 'In-Home Quest Thyroid Panel', displayName: 'Thyroid Panel', collection: 'in-home', vendor: 'quest', targetAudience: 'Any', markerCount: 9, costCents: 4242, productId: 'lab-junction-a530dda9-at-home-quest-thyroid-panel' },
  { name: 'Walk-In LabCorp Comprehensive Metabolic Panel', displayName: 'Comprehensive Metabolic Panel', collection: 'walk-in', vendor: 'labcorp', targetAudience: 'Any', markerCount: 0, costCents: 6500, productId: 'lab-junction-comprehensive-metabolic-panel' },
  { name: 'Walk-In LabCorp Female HRT Comprehensive Panel', displayName: 'Female HRT Comprehensive Panel', collection: 'walk-in', vendor: 'labcorp', targetAudience: 'Any', markerCount: 11, costCents: 15649, productId: 'lab-junction-a530dda9-labcorp-female-hrt-comprehensive-panel' },
  { name: 'Walk-In Quest Female HRT Comprehensive Panel', displayName: 'Female HRT Comprehensive Panel', collection: 'walk-in', vendor: 'quest', targetAudience: 'Female', markerCount: 15, costCents: 7465, productId: 'lab-junction-a530dda9-quest-female-hrt-comprehensive-panel' },
  { name: 'Walk-In Quest Female HRT Follow-Up Panel', displayName: 'Female HRT Follow-Up Panel', collection: 'walk-in', vendor: 'quest', targetAudience: 'Female', markerCount: 6, costCents: 5038, productId: 'lab-junction-a530dda9-quest-female-hrt-follow-up' },
  { name: 'Advanced Panel - Mktg (Women)', displayName: 'Advanced Panel (Women)', collection: 'walk-in', vendor: 'quest', targetAudience: 'Any', markerCount: 36, costCents: 25212, productId: 'lab-junction-a530dda9-advanced-panel-mktg-women' },
  { name: 'Complete Panel - Mktg (Women)', displayName: 'Complete Panel (Women)', collection: 'walk-in', vendor: 'quest', targetAudience: 'Any', markerCount: 20, costCents: 13344, productId: 'lab-junction-a530dda9-complete-panel-mktg-women' },
  { name: 'LT-Quest Female HRT', displayName: 'Female HRT Panel', collection: 'walk-in', vendor: 'quest', targetAudience: 'Any', markerCount: 14, costCents: 8628, productId: 'lab-junction-a530dda9-lt-quest-female-hrt' },
  { name: 'LT-Quest Initial', displayName: 'Initial Panel', collection: 'walk-in', vendor: 'quest', targetAudience: 'Any', markerCount: 10, costCents: 7100, productId: 'lab-junction-a530dda9-lt-quest-initial' },
];

export function getLabDisplayPriceCents(lab: LabOption) {
  return roundToNearestNiceDollarCents(lab.costCents * 1.75);
}

export function getLabCheckoutUrl(lab: LabOption) {
  return `${GEN_LABS_BASE_URL}/${lab.productId}`;
}

function roundToNearestNiceDollarCents(cents: number) {
  const dollars = cents / 100;
  const lower = Math.floor(dollars / 10) * 10 - 1;
  const candidates = [lower, lower + 10, lower + 20].filter(value => value > 0);
  const niceDollar = candidates.reduce((best, candidate) => {
    const candidateDistance = Math.abs(candidate - dollars);
    const bestDistance = Math.abs(best - dollars);
    return candidateDistance < bestDistance ? candidate : best;
  });

  return niceDollar * 100;
}
