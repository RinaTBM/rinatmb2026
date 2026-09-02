export type LabCollection = 'in-home' | 'walk-in';
export type LabVendor = 'labcorp' | 'quest';

export interface LabOption {
  name: string;
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
  { name: 'In-Home LabCorp Female HRT Comprehensive Panel', collection: 'in-home', vendor: 'labcorp', targetAudience: 'Female', markerCount: 11, costCents: 15649, productId: 'lab-junction-a530dda9-at-home-labcorp-female-hrt-comprehensive-panel' },
  { name: 'In-Home LabCorp Initial TRT Panel (Male)', collection: 'in-home', vendor: 'labcorp', targetAudience: 'Male', markerCount: 10, costCents: 16257, productId: 'lab-junction-a530dda9-at-home-initial-trt-panel-male-labcorp' },
  { name: 'In-Home LabCorp TRT Follow-Up Panel (Male)', collection: 'in-home', vendor: 'labcorp', targetAudience: 'Male', markerCount: 4, costCents: 8525, productId: 'lab-junction-a530dda9-at-home-trt-follow-up-panel-male-labcorp' },
  { name: 'In-Home Quest Female HRT Comprehensive Panel', collection: 'in-home', vendor: 'quest', targetAudience: 'Any', markerCount: 14, costCents: 6975, productId: 'lab-junction-a530dda9-at-home-quest-female-hrt-comprehensive-panel' },
  { name: 'In-Home Quest Female HRT Follow-Up Panel', collection: 'in-home', vendor: 'quest', targetAudience: 'Any', markerCount: 6, costCents: 5038, productId: 'lab-junction-a530dda9-at-home-quest-female-hrt-follow-up' },
  { name: 'In-Home Quest Initial TRT Panel (Male)', collection: 'in-home', vendor: 'quest', targetAudience: 'Any', markerCount: 11, costCents: 8486, productId: 'lab-junction-a530dda9-at-home-initial-trt-panel-male' },
  { name: 'In-Home Quest Thyroid Panel', collection: 'in-home', vendor: 'quest', targetAudience: 'Any', markerCount: 9, costCents: 4242, productId: 'lab-junction-a530dda9-at-home-quest-thyroid-panel' },
  { name: 'In-Home Quest TRT 1st Follow-Up Panel (Male)', collection: 'in-home', vendor: 'quest', targetAudience: 'Male', markerCount: 4, costCents: 4739, productId: 'lab-junction-a530dda9-at-home-trt-1st-follow-up-panel-male' },
  { name: 'In-Home Quest TRT Baseline Panel (Male)', collection: 'in-home', vendor: 'quest', targetAudience: 'Male', markerCount: 8, costCents: 8131, productId: 'lab-junction-a530dda9-at-home-trt-baseline-panel-male-q' },
  { name: 'Walk-In LabCorp Comprehensive Metabolic Panel', collection: 'walk-in', vendor: 'labcorp', targetAudience: 'Any', markerCount: 0, costCents: 6500, productId: 'lab-junction-comprehensive-metabolic-panel' },
  { name: 'Walk-In LabCorp Comprehensive TRT Panel (Male)', collection: 'walk-in', vendor: 'labcorp', targetAudience: 'Any', markerCount: 10, costCents: 16257, productId: 'lab-junction-a530dda9-initial-trt-panel-male-labcorp' },
  { name: 'Walk-In LabCorp Female HRT Comprehensive Panel', collection: 'walk-in', vendor: 'labcorp', targetAudience: 'Any', markerCount: 11, costCents: 15649, productId: 'lab-junction-a530dda9-labcorp-female-hrt-comprehensive-panel' },
  { name: 'Walk-In LabCorp TRT Follow-Up Panel (Male)', collection: 'walk-in', vendor: 'labcorp', targetAudience: 'Any', markerCount: 4, costCents: 8525, productId: 'lab-junction-a530dda9-trt-follow-up-panel-male-labcorp' },
  { name: 'Walk-In Quest Comprehensive TRT Panel (Male)', collection: 'walk-in', vendor: 'quest', targetAudience: 'Any', markerCount: 11, costCents: 8486, productId: 'lab-junction-a530dda9-initial-trt-panel-male' },
  { name: 'Walk-In Quest TRT Baseline Panel (Male)', collection: 'walk-in', vendor: 'quest', targetAudience: 'Male', markerCount: 8, costCents: 8131, productId: 'lab-junction-a530dda9-trt-baseline-panel-male' },
  { name: 'Walk-In Quest Female HRT Comprehensive Panel', collection: 'walk-in', vendor: 'quest', targetAudience: 'Female', markerCount: 15, costCents: 7465, productId: 'lab-junction-a530dda9-quest-female-hrt-comprehensive-panel' },
  { name: 'Walk-In Quest Female HRT Follow-Up Panel', collection: 'walk-in', vendor: 'quest', targetAudience: 'Female', markerCount: 6, costCents: 5038, productId: 'lab-junction-a530dda9-quest-female-hrt-follow-up' },
  { name: 'Walk-In Quest TRT 1st Follow-Up Panel (Male)', collection: 'walk-in', vendor: 'quest', targetAudience: 'Any', markerCount: 4, costCents: 4739, productId: 'lab-junction-a530dda9-trt-1st-follow-up-panel-male' },
  { name: 'Advanced Panel - Mktg (Men)', collection: 'walk-in', vendor: 'quest', targetAudience: 'Any', markerCount: 35, costCents: 25001, productId: 'lab-junction-a530dda9-advanced-panel-mktg-men' },
  { name: 'Advanced Panel - Mktg (Women)', collection: 'walk-in', vendor: 'quest', targetAudience: 'Any', markerCount: 36, costCents: 25212, productId: 'lab-junction-a530dda9-advanced-panel-mktg-women' },
  { name: 'Complete Panel - Mktg (Men)', collection: 'walk-in', vendor: 'quest', targetAudience: 'Any', markerCount: 19, costCents: 12634, productId: 'lab-junction-a530dda9-complete-panel-mktg-men' },
  { name: 'Complete Panel - Mktg (Women)', collection: 'walk-in', vendor: 'quest', targetAudience: 'Any', markerCount: 20, costCents: 13344, productId: 'lab-junction-a530dda9-complete-panel-mktg-women' },
  { name: 'Limitless Male | LabCorp | Walk-In', collection: 'walk-in', vendor: 'labcorp', targetAudience: 'Any', markerCount: 12, costCents: 21353, productId: 'lab-junction-a530dda9-limitless-male-labcorp-walk-in' },
  { name: 'LT-Quest Female HRT', collection: 'walk-in', vendor: 'quest', targetAudience: 'Any', markerCount: 14, costCents: 8628, productId: 'lab-junction-a530dda9-lt-quest-female-hrt' },
  { name: 'LT-Quest Initial', collection: 'walk-in', vendor: 'quest', targetAudience: 'Any', markerCount: 10, costCents: 7100, productId: 'lab-junction-a530dda9-lt-quest-initial' },
  { name: 'LT-Quest Mens TRT (Follow-Up)', collection: 'walk-in', vendor: 'quest', targetAudience: 'Any', markerCount: 6, costCents: 5002, productId: 'lab-junction-a530dda9-lt-quest-mens-trt-follow-up' },
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
