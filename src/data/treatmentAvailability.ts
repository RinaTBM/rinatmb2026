/**
 * Gen Health's "Unavailable states" setting is authoritative.
 * Owner-supplied fallback snapshot: 2026-11-01. No live availability feed is exposed by this storefront.
 * Keys are stable product slugs, optionally followed by ":" and a dosage form.
 */
export const STATES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon',
  PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
  TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia',
  WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming', PR: 'Puerto Rico',
};

export const DEFAULT_UNAVAILABLE_STATES: string[] = ['PR'];
export const UNAVAILABLE_STATES: Record<string, string[]> = {
  'aod-9604': ['AL', 'AR', 'CA', 'KY', 'SC', 'PR'],
  'selank': ['AR', 'CA', 'KY', 'SC', 'PR'],
  'nad-plus:Nasal Spray': ['AR', 'CA', 'KS', 'KY', 'MA', 'MI', 'MS', 'NE', 'NC', 'OK', 'OR', 'SC', 'TN', 'VA', 'WV', 'PR'],
  'retatrutide': ['OH', 'PR'],
  'elite-regenesis': ['OH', 'PR'],
  'estradiol-patch': ['AL', 'PR'],
  'estradiol-transdermal-patch-00375mg-hr-8-count': ['AL', 'PR'],
  'bpc-157-tb-500:Capsule': ['AL', 'AR', 'CA', 'CT', 'DE', 'GA', 'IL', 'IN', 'KY', 'LA', 'MI', 'MN', 'MS', 'NV', 'NH', 'NJ', 'NM', 'NC', 'ND', 'OH', 'OK', 'SC', 'SD', 'TN', 'VT', 'VA', 'WA', 'WV', 'PR'],
};

/** Saved care baskets can predate the selector, so also resolve form-specific GEN routes. */
const GEN_AVAILABILITY_KEYS: Record<string, string> = {
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_FVwkzvQqWIZRNAwbslGw': 'nad-plus:Nasal Spray',
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_3KnF8Ll7XPm7Vk0lr4Li': 'nad-plus:Nasal Spray',
  'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_RaEueocVyzaAOzXvRFwC': 'bpc-157-tb-500:Capsule',
};

export function unavailableStatesFor(slug: string, form?: string): string[] {
  return UNAVAILABLE_STATES[form ? `${slug}:${form}` : slug]
    ?? UNAVAILABLE_STATES[slug]
    ?? DEFAULT_UNAVAILABLE_STATES;
}

export function isUnavailableInState(states: readonly string[], state: string): boolean {
  return state !== 'DC' && Boolean(STATES[state]) && states.includes(state);
}

export function basketUnavailableStates(item: { slug: string; genClientProductId: string; availabilityKey?: string }): string[] {
  const key = item.availabilityKey ?? GEN_AVAILABILITY_KEYS[item.genClientProductId] ?? item.slug.split(':')[0];
  const [slug, form] = key.split(':');
  return unavailableStatesFor(slug, form);
}
