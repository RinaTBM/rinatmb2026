import { describe, expect, it } from 'vitest';
import { STATES, UNAVAILABLE_STATES, unavailableStatesFor, isUnavailableInState, basketUnavailableStates } from './treatmentAvailability';

describe('owner-supplied Gen Health availability snapshot', () => {
  it('supports 50 states, DC and Puerto Rico', () => {
    expect(Object.keys(STATES)).toHaveLength(52);
    expect(STATES.DC).toBe('District of Columbia');
    expect(STATES.PR).toBe('Puerto Rico');
  });
  it('uses PR as the default and leaves DC available for every treatment', () => {
    expect(unavailableStatesFor('other-product')).toEqual(['PR']);
    for (const states of Object.values(UNAVAILABLE_STATES)) {
      expect(isUnavailableInState(states, 'DC')).toBe(false);
      expect(isUnavailableInState(states, 'PR')).toBe(true);
      expect(states.every(code => Boolean(STATES[code]))).toBe(true);
    }
    expect(isUnavailableInState(['PR'], '')).toBe(false);
    expect(isUnavailableInState(['PR'], 'XX')).toBe(false);
  });
  it('applies the listed product exceptions', () => {
    expect(unavailableStatesFor('aod-9604')).toEqual(['AL', 'AR', 'CA', 'KY', 'SC', 'PR']);
    expect(unavailableStatesFor('selank')).toEqual(['AR', 'CA', 'KY', 'SC', 'PR']);
    expect(unavailableStatesFor('retatrutide')).toEqual(['OH', 'PR']);
    expect(unavailableStatesFor('elite-regenesis')).toEqual(['OH', 'PR']);
    expect(unavailableStatesFor('estradiol-patch')).toEqual(['AL', 'PR']);
  });
  it('restricts nasal NAD and capsule Wolverine without restricting the injections', () => {
    expect(unavailableStatesFor('nad-plus', 'Injection')).toEqual(['PR']);
    expect(unavailableStatesFor('nad-plus', 'Nasal Spray')).toEqual(['AR', 'CA', 'KS', 'KY', 'MA', 'MI', 'MS', 'NE', 'NC', 'OK', 'OR', 'SC', 'TN', 'VA', 'WV', 'PR']);
    expect(unavailableStatesFor('bpc-157-tb-500', 'Injection')).toEqual(['PR']);
    expect(unavailableStatesFor('bpc-157-tb-500', 'Capsule')).toHaveLength(29);
    expect(isUnavailableInState(unavailableStatesFor('bpc-157-tb-500', 'Capsule'), 'WA')).toBe(true);
  });
  it('rechecks new and previously saved Care Basket selections', () => {
    expect(basketUnavailableStates({ slug: 'aod-9604', genClientProductId: '', availabilityKey: 'aod-9604:Injection' })).toEqual(unavailableStatesFor('aod-9604'));
    expect(basketUnavailableStates({ slug: 'nad-plus', genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_FVwkzvQqWIZRNAwbslGw' })).toEqual(unavailableStatesFor('nad-plus', 'Nasal Spray'));
    expect(basketUnavailableStates({ slug: 'bpc-157-tb-500:legacy-id', genClientProductId: '', availabilityKey: 'bpc-157-tb-500:Capsule' })).toEqual(unavailableStatesFor('bpc-157-tb-500', 'Capsule'));
  });
});
