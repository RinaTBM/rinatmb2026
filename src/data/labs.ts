export type LabCollection = 'in-home' | 'walk-in';
export type LabVendor = 'labcorp' | 'quest';

export interface LabOption {
  name: string;
  displayName: string;
  description: string;
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
  { name: 'In-Home LabCorp Female HRT Comprehensive Panel', displayName: 'Comprehensive Hormone Therapy Panel', description: 'A deeper baseline for hormone support, including key wellness markers, with collection arranged from home.', collection: 'in-home', vendor: 'labcorp', targetAudience: 'Female', markerCount: 11, costCents: 15649, productId: 'lab-junction-a530dda9-at-home-labcorp-female-hrt-comprehensive-panel' },
  { name: 'In-Home Quest Female HRT Comprehensive Panel', displayName: 'Comprehensive Hormone Therapy Panel', description: 'A convenient at-home option for initial hormone review when your provider wants a broader starting picture.', collection: 'in-home', vendor: 'quest', targetAudience: 'Any', markerCount: 14, costCents: 6975, productId: 'lab-junction-a530dda9-at-home-quest-female-hrt-comprehensive-panel' },
  { name: 'In-Home Quest Female HRT Follow-Up Panel', displayName: 'Hormone Therapy Follow-Up Panel', description: 'A focused check-in panel for monitoring progress after treatment has started or when fewer markers are needed.', collection: 'in-home', vendor: 'quest', targetAudience: 'Any', markerCount: 6, costCents: 5038, productId: 'lab-junction-a530dda9-at-home-quest-female-hrt-follow-up' },
  { name: 'In-Home Quest Thyroid Panel', displayName: 'Thyroid Panel', description: 'Helpful when thyroid symptoms, energy, metabolism, or medication monitoring are the main concern.', collection: 'in-home', vendor: 'quest', targetAudience: 'Any', markerCount: 9, costCents: 4242, productId: 'lab-junction-a530dda9-at-home-quest-thyroid-panel' },
  { name: 'Walk-In LabCorp Comprehensive Metabolic Panel', displayName: 'Comprehensive Metabolic Panel', description: 'A basic wellness screen for liver, kidney, electrolyte, glucose, and metabolic health markers.', collection: 'walk-in', vendor: 'labcorp', targetAudience: 'Any', markerCount: 0, costCents: 6500, productId: 'lab-junction-comprehensive-metabolic-panel' },
  { name: 'Walk-In LabCorp Female HRT Comprehensive Panel', displayName: 'Comprehensive Hormone Therapy Panel', description: 'A walk-in baseline panel for hormone review when a broader set of wellness markers is preferred.', collection: 'walk-in', vendor: 'labcorp', targetAudience: 'Any', markerCount: 11, costCents: 15649, productId: 'lab-junction-a530dda9-labcorp-female-hrt-comprehensive-panel' },
  { name: 'Walk-In Quest Female HRT Comprehensive Panel', displayName: 'Comprehensive Hormone Therapy Panel', description: 'A strong walk-in starting point for hormone therapy review with a wider marker set.', collection: 'walk-in', vendor: 'quest', targetAudience: 'Female', markerCount: 15, costCents: 7465, productId: 'lab-junction-a530dda9-quest-female-hrt-comprehensive-panel' },
  { name: 'Walk-In Quest Female HRT Follow-Up Panel', displayName: 'Hormone Therapy Follow-Up Panel', description: 'A focused follow-up option for reviewing hormone levels without ordering a full baseline panel.', collection: 'walk-in', vendor: 'quest', targetAudience: 'Female', markerCount: 6, costCents: 5038, productId: 'lab-junction-a530dda9-quest-female-hrt-follow-up' },
  { name: 'Advanced Panel - Mktg (Women)', displayName: 'Advanced Wellness Panel', description: 'The widest wellness review, adding hormones, metabolic health, cardiovascular markers, and nutrition-related labs.', collection: 'walk-in', vendor: 'quest', targetAudience: 'Any', markerCount: 36, costCents: 25212, productId: 'lab-junction-a530dda9-advanced-panel-mktg-women' },
  { name: 'Complete Panel - Mktg (Women)', displayName: 'Complete Wellness Panel', description: 'A broad wellness option for clients who want more than hormones without choosing the largest panel.', collection: 'walk-in', vendor: 'quest', targetAudience: 'Any', markerCount: 20, costCents: 13344, productId: 'lab-junction-a530dda9-complete-panel-mktg-women' },
  { name: 'LT-Quest Female HRT', displayName: 'Hormone Therapy Plus Panel', description: 'Useful for a fuller hormone review when thyroid and metabolic context may also matter.', collection: 'walk-in', vendor: 'quest', targetAudience: 'Any', markerCount: 14, costCents: 8628, productId: 'lab-junction-a530dda9-lt-quest-female-hrt' },
  { name: 'LT-Quest Initial', displayName: 'Initial Wellness Panel', description: 'A practical first-lab option for clients who need core wellness markers before provider review.', collection: 'walk-in', vendor: 'quest', targetAudience: 'Any', markerCount: 10, costCents: 7100, productId: 'lab-junction-a530dda9-lt-quest-initial' },
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
    return candidateDistance <= bestDistance ? candidate : best;
  });

  return niceDollar * 100;
}
