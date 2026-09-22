import { describe, expect, it } from 'vitest';
import { getLabDisplayPriceCents, labOptions } from './labs';

describe('lab display pricing', () => {
  it('includes the verified home blood draw and processing costs for the Quest comprehensive panel', () => {
    const lab = labOptions.find(option => option.productId === 'lab-junction-a530dda9-at-home-quest-female-hrt-comprehensive-panel');
    expect(lab?.costCents).toBe(4975 + 8000 + 2000);
    expect(getLabDisplayPriceCents(lab!)).toBe(25900);
  });

  it('rounds cost x 1.75 to the nearest nice dollar ending in 9', () => {
    const lab = labOptions.find(option => option.name === 'In-Home LabCorp Female HRT Comprehensive Panel');

    expect(lab).toBeDefined();
    expect(getLabDisplayPriceCents(lab!)).toBe(26900);
  });
});
