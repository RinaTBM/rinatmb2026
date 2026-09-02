import { describe, expect, it } from 'vitest';
import { getLabDisplayPriceCents, labOptions } from './labs';

describe('lab display pricing', () => {
  it('rounds cost x 1.75 to the nearest nice dollar ending in 9', () => {
    const lab = labOptions.find(option => option.name === 'In-Home LabCorp Female HRT Comprehensive Panel');

    expect(lab).toBeDefined();
    expect(getLabDisplayPriceCents(lab!)).toBe(26900);
  });
});
