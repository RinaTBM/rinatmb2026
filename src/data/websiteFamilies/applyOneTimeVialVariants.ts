/**
 * Overlay: owner-approved one-time GLP-1 vial-specific variants + locked retail.
 *
 * Does not rewrite families.generated.ts. Applied at export time.
 * New variants reuse existing GEN Client Products (no new GEN products).
 * Backend doseTier / group names stay internal — patient UI must not render them.
 */

import type { WebsiteProductFamily, WebsiteProductVariant } from './types';

function cloneVariant(
  source: WebsiteProductVariant,
  patch: Partial<WebsiteProductVariant> &
    Pick<WebsiteProductVariant, 'websiteVariantId' | 'displayLabel' | 'finalRetailPrice' | 'startingPrice'>,
): WebsiteProductVariant {
  return {
    ...source,
    ...patch,
    genPairingVerified: source.genPairingVerified,
    routingStatus: 'ROUTING_READY',
    launchState: 'LAUNCH_READY',
    checkoutStatus: source.checkoutStatus,
    availabilityStatus: 'storefront',
  };
}

function find(family: WebsiteProductFamily, id: string): WebsiteProductVariant {
  const v = family.variants.find((row) => row.websiteVariantId === id);
  if (!v) throw new Error(`applyOneTimeVialVariants: missing source variant ${id}`);
  return v;
}

function lockOneTimeGroupPrices(family: WebsiteProductFamily): WebsiteProductFamily {
  return {
    ...family,
    startingAtPriceDisplay:
      family.familyId === 'semaglutide'
        ? 'Starting at $109 (vial-specific one-time); Membership $125'
        : family.familyId === 'tirzepatide'
          ? 'Starting at $139 (vial-specific one-time); Membership $179'
          : family.startingAtPriceDisplay,
    variants: family.variants.map((v) => {
      if (v.websiteVariantId === 'sem-b12-starting-low') {
        return { ...v, displayLabel: 'Vitamin B12', finalRetailPrice: 109, startingPrice: 109, exactFormularyRows: [3] };
      }
      if (v.websiteVariantId === 'sem-b12-mid') {
        return { ...v, displayLabel: 'Vitamin B12', finalRetailPrice: 119, startingPrice: 119, exactFormularyRows: [7] };
      }
      if (v.websiteVariantId === 'sem-b12-high') {
        return { ...v, displayLabel: 'Vitamin B12', finalRetailPrice: 129, startingPrice: 129, exactFormularyRows: [9] };
      }
      if (v.websiteVariantId === 'sem-glycine-starting-low') {
        return { ...v, displayLabel: 'Glycine', finalRetailPrice: 109, startingPrice: 109, exactFormularyRows: [2] };
      }
      if (v.websiteVariantId === 'sem-glycine-mid') {
        return { ...v, displayLabel: 'Glycine', finalRetailPrice: 119, startingPrice: 119, exactFormularyRows: [6] };
      }
      if (v.websiteVariantId === 'sem-glycine-high') {
        return { ...v, displayLabel: 'Glycine', finalRetailPrice: 129, startingPrice: 129, exactFormularyRows: [8] };
      }
      if (v.websiteVariantId === 'tir-b12-starting-low') {
        return { ...v, displayLabel: 'Vitamin B12', finalRetailPrice: 139, startingPrice: 139, exactFormularyRows: [14] };
      }
      if (v.websiteVariantId === 'tir-b12-mid') {
        return { ...v, displayLabel: 'Vitamin B12', finalRetailPrice: 179, startingPrice: 179, exactFormularyRows: [18] };
      }
      if (v.websiteVariantId === 'tir-b12-high') {
        return { ...v, displayLabel: 'Vitamin B12', finalRetailPrice: 199, startingPrice: 199, exactFormularyRows: [22] };
      }
      if (v.websiteVariantId === 'tir-glycine-starting-low') {
        return { ...v, displayLabel: 'Glycine', finalRetailPrice: 139, startingPrice: 139, exactFormularyRows: [13] };
      }
      if (v.websiteVariantId === 'tir-glycine-mid') {
        return { ...v, displayLabel: 'Glycine', finalRetailPrice: 179, startingPrice: 179, exactFormularyRows: [17] };
      }
      if (v.websiteVariantId === 'tir-glycine-high') {
        return { ...v, displayLabel: 'Glycine', finalRetailPrice: 199, startingPrice: 199, exactFormularyRows: [21] };
      }
      return v;
    }),
  };
}

export function applyOneTimeVialVariants(families: WebsiteProductFamily[]): WebsiteProductFamily[] {
  return families.map((family) => {
    if (family.familyId === 'semaglutide') {
      const locked = lockOneTimeGroupPrices(family);
      const b12Low = find(locked, 'sem-b12-starting-low');
      const b12High = find(locked, 'sem-b12-high');
      const glyLow = find(locked, 'sem-glycine-starting-low');
      const glyHigh = find(locked, 'sem-glycine-high');
      return {
        ...locked,
        variants: [
          ...locked.variants,
          cloneVariant(b12Low, {
            websiteVariantId: 'sem-b12-2mg',
            displayLabel: 'Vitamin B12',
            finalRetailPrice: 119,
            startingPrice: 119,
            exactFormularyRows: [5],
          }),
          cloneVariant(b12High, {
            websiteVariantId: 'sem-b12-10mg',
            displayLabel: 'Vitamin B12',
            finalRetailPrice: 139,
            startingPrice: 139,
            exactFormularyRows: [11],
          }),
          cloneVariant(glyLow, {
            websiteVariantId: 'sem-glycine-2mg',
            displayLabel: 'Glycine',
            finalRetailPrice: 119,
            startingPrice: 119,
            exactFormularyRows: [4],
          }),
          cloneVariant(glyHigh, {
            websiteVariantId: 'sem-glycine-10mg',
            displayLabel: 'Glycine',
            finalRetailPrice: 139,
            startingPrice: 139,
            exactFormularyRows: [10],
          }),
        ],
      };
    }
    if (family.familyId === 'tirzepatide') {
      const locked = lockOneTimeGroupPrices(family);
      const b12Low = find(locked, 'tir-b12-starting-low');
      const b12Mid = find(locked, 'tir-b12-mid');
      const b12High = find(locked, 'tir-b12-high');
      const glyLow = find(locked, 'tir-glycine-starting-low');
      const glyMid = find(locked, 'tir-glycine-mid');
      const glyHigh = find(locked, 'tir-glycine-high');
      return {
        ...locked,
        variants: [
          ...locked.variants,
          cloneVariant(b12Low, {
            websiteVariantId: 'tir-b12-10mg-ml',
            displayLabel: 'Vitamin B12',
            finalRetailPrice: 159,
            startingPrice: 159,
            exactFormularyRows: [16],
          }),
          cloneVariant(b12Mid, {
            websiteVariantId: 'tir-b12-20mg-ml',
            displayLabel: 'Vitamin B12',
            finalRetailPrice: 189,
            startingPrice: 189,
            exactFormularyRows: [20],
          }),
          cloneVariant(b12High, {
            websiteVariantId: 'tir-b12-30mg-ml',
            displayLabel: 'Vitamin B12',
            finalRetailPrice: 209,
            startingPrice: 209,
            exactFormularyRows: [24],
          }),
          cloneVariant(glyLow, {
            websiteVariantId: 'tir-glycine-10mg-ml',
            displayLabel: 'Glycine',
            finalRetailPrice: 159,
            startingPrice: 159,
            exactFormularyRows: [15],
          }),
          cloneVariant(glyMid, {
            websiteVariantId: 'tir-glycine-20mg-ml',
            displayLabel: 'Glycine',
            finalRetailPrice: 189,
            startingPrice: 189,
            exactFormularyRows: [19],
          }),
          cloneVariant(glyHigh, {
            websiteVariantId: 'tir-glycine-30mg-ml',
            displayLabel: 'Glycine',
            finalRetailPrice: 209,
            startingPrice: 209,
            exactFormularyRows: [23],
          }),
        ],
      };
    }
    return family;
  });
}
