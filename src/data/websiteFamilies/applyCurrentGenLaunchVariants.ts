/**
 * Small, hand-verified GEN launch overrides.
 *
 * Keep generated catalog history immutable. Each override represents a
 * currently working MBM-owned GEN public checkout.
 */

import type { WebsiteProductFamily } from './types';

const GEN_CLIENT_PREFIX = 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_';
const NAD_INJECTABLE_GEN_PRODUCT_ID = 'SHJpGAACUFEeMONdpEbn';
const ESTRADIOL_PATCH_GEN_PRODUCT_ID = 'o7dNtf9QsnEqPCrLr2tR';
const PROGESTERONE_GEN_PRODUCT_ID = '5dGkjdpLP7DkKKE2iVxh';
const TESTOSTERONE_CREAM_GEN_PRODUCT_ID = 'AVNvVWBE98DfINxyz5Dm';
const TRETINOIN_GEN_PRODUCT_ID = 'EeWMcfCJf5EU2LkNQmp9';
const SELANK_SEMAX_GEN_PRODUCT_ID = 'LWkYtwm66dIeLuDSvSfi';
const TESAMORELIN_GEN_PRODUCT_ID = '2cYxVfvwpWyyrANZx06G';
const WOLVERINE_GEN_PRODUCT_ID = 'iJtyig611AZEDBGdvRd9';
const WOLVERINE_CAPSULE_GEN_PRODUCT_ID = 'omhh3NabouO8AsNR5tkD';
const SCREAM_CREAM_GEN_PRODUCT_ID = 'llc4XwX8XjHashrkv74r';
const MINOXIDIL_GEN_PRODUCT_ID = 'Raw7mUkuzzhVdAo88jpL';
const FAT_BURNER_GEN_PRODUCT_ID = '7Kix55LA15U0lNvY9QXI';

/**
 * Replace the retired r83 catalog placeholder with the live generic NAD+
 * Injection wrapper. The website deliberately shows no formulation,
 * concentration, or package; GEN presents the clinical details in its flow.
 */
export function applyCurrentGenLaunchVariants(
  families: readonly WebsiteProductFamily[],
): WebsiteProductFamily[] {
  return families.map((family) => {
    if (family.familyId === 'minoxidil') {
      return {
        ...family,
        displayName: 'Minoxidil Topical',
        startingAtPriceDisplay: 'Starting at $79',
        variants: family.variants.map((variant) => {
          if (variant.websiteVariantId !== 'minoxidil-fin-minox-0.1-5') {
            return {
              ...variant,
              genProductId: null,
              genClientProductId: null,
              genPairingVerified: false,
              routingStatus: 'FUTURE_HIDDEN',
              launchState: 'FUTURE_HIDDEN',
              availabilityStatus: 'preview_only',
            };
          }

          return makeLiveVariant(variant, {
            websiteVariantId: 'minoxidil-gen-live',
            displayLabel: 'Topical Solution',
            form: 'Topical Solution',
            finalRetailPrice: 79,
            genProductId: MINOXIDIL_GEN_PRODUCT_ID,
          });
        }),
      };
    }

    if (family.familyId === 'fat-burner') {
      return {
        ...family,
        startingAtPriceDisplay: 'Starting at $199',
        variants: family.variants.map((variant) =>
          makeLiveVariant(variant, {
            websiteVariantId: 'fat-burner-gen-live',
            displayLabel: 'Injection',
            form: 'Injection',
            finalRetailPrice: 199,
            genProductId: FAT_BURNER_GEN_PRODUCT_ID,
          }),
        ),
      };
    }

    if (family.familyId === 'scream-cream') {
      return {
        ...family,
        // This is an MBM-owned presentation wrapper. Keep the website copy
        // broad; GEN presents the provider-selected clinical details.
        category: 'Women\'s Hormone Therapy',
        currentWebsiteSlug: 'scream-cream',
        startingAtPriceDisplay: 'Starting at $129',
        variants: family.variants.map((variant) =>
          makeLiveVariant(variant, {
            websiteVariantId: 'scream-cream-gen-live',
            displayLabel: 'Cream',
            form: 'Cream',
            finalRetailPrice: 129,
            genProductId: SCREAM_CREAM_GEN_PRODUCT_ID,
          }),
        ),
      };
    }

    if (family.familyId === 'progesterone') {
      return {
        ...family,
        displayName: 'Progesterone Capsules',
        startingAtPriceDisplay: 'Starting at $59',
        variants: family.variants.map((variant) => {
          if (variant.websiteVariantId !== 'prog-ir-r41') {
            // The generated file contains several historical strength rows
            // sharing the same GEN product id. The live wrapper is one
            // provider-directed option, so keep the historical selectors out
            // of the customer path rather than presenting false choices.
            return {
              ...variant,
              genProductId: null,
              genClientProductId: null,
              genPairingVerified: false,
              routingStatus: 'FUTURE_HIDDEN',
              launchState: 'FUTURE_HIDDEN',
              availabilityStatus: 'preview_only',
            };
          }

          return makeLiveVariant(variant, {
            websiteVariantId: 'progesterone-gen-live',
            displayLabel: 'Capsules',
            form: 'Capsule',
            finalRetailPrice: 59,
            genProductId: PROGESTERONE_GEN_PRODUCT_ID,
          });
        }),
      };
    }

    if (family.familyId === 'testosterone') {
      return {
        ...family,
        // The live GEN wrapper includes a provider-selected hormone-therapy
        // formula. Keep the website name broad rather than promising a
        // testosterone-only product.
        displayName: 'Hormone Therapy Cream',
        startingAtPriceDisplay: 'Starting at $89',
        variants: family.variants.map((variant) => {
          if (variant.websiteVariantId !== 'testosterone-current') return { ...variant };

          return makeLiveVariant(variant, {
            websiteVariantId: 'hormone-therapy-cream-gen-live',
            displayLabel: 'Cream',
            form: 'Cream',
            finalRetailPrice: 89,
            genProductId: TESTOSTERONE_CREAM_GEN_PRODUCT_ID,
          });
        }),
      };
    }

    if (family.familyId === 'tretinoin') {
      return {
        ...family,
        startingAtPriceDisplay: 'Starting at $80',
        variants: family.variants.map((variant) => {
          if (variant.websiteVariantId !== 'tretinoin-0.025%') return { ...variant };

          return makeLiveVariant(variant, {
            websiteVariantId: 'tretinoin-gen-live',
            displayLabel: 'Cream',
            form: 'Cream',
            finalRetailPrice: 80,
            genProductId: TRETINOIN_GEN_PRODUCT_ID,
          });
        }),
      };
    }

    if (family.familyId === 'selank-semax-blend') {
      return {
        ...family,
        displayName: 'Selank + Semax Nasal Spray',
        startingAtPriceDisplay: 'Starting at $149',
        variants: family.variants.map((variant) => {
          if (variant.websiteVariantId !== 'selank-semax-blend-current') return { ...variant };

          return makeLiveVariant(variant, {
            websiteVariantId: 'selank-semax-gen-live',
            displayLabel: 'Nasal Spray',
            form: 'Nasal Spray',
            finalRetailPrice: 149,
            genProductId: SELANK_SEMAX_GEN_PRODUCT_ID,
          });
        }),
      };
    }

    if (family.familyId === 'tesamorelin') {
      return {
        ...family,
        startingAtPriceDisplay: 'Starting at $269',
        variants: family.variants.map((variant) => {
          if (variant.websiteVariantId !== 'tesamorelin-current') return { ...variant };

          return makeLiveVariant(variant, {
            websiteVariantId: 'tesamorelin-gen-live',
            displayLabel: 'Injection',
            form: 'Injection',
            finalRetailPrice: 269,
            genProductId: TESAMORELIN_GEN_PRODUCT_ID,
          });
        }),
      };
    }

    if (family.familyId === 'wolverine-bpc-tb') {
      return {
        ...family,
        startingAtPriceDisplay: 'Starting at $169',
        variants: family.variants.map((variant) => {
          if (variant.websiteVariantId === 'wolverine-capsule') {
            return makeLiveVariant(variant, {
              websiteVariantId: 'wolverine-capsule-gen-live',
              displayLabel: 'Capsules',
              form: 'Capsule',
              finalRetailPrice: 189,
              genProductId: WOLVERINE_CAPSULE_GEN_PRODUCT_ID,
            });
          }
          if (variant.websiteVariantId !== 'wolverine-injection') return { ...variant };

          return makeLiveVariant(variant, {
            websiteVariantId: 'wolverine-injection-gen-live',
            displayLabel: 'Injection',
            form: 'Injection',
            finalRetailPrice: 169,
            genProductId: WOLVERINE_GEN_PRODUCT_ID,
          });
        }),
      };
    }

    if (family.familyId === 'estradiol') {
      return {
        ...family,
        startingAtPriceDisplay: 'Starting at $129',
        variants: family.variants.map((variant) => {
          if (variant.websiteVariantId !== 'estradiol-patch-r27') return { ...variant };

          return makeLiveVariant(variant, {
            websiteVariantId: 'estradiol-patch-gen-live',
            displayLabel: 'Patch',
            form: 'Patch',
            finalRetailPrice: 129,
            genProductId: ESTRADIOL_PATCH_GEN_PRODUCT_ID,
          });
        }),
      };
    }

    if (family.familyId !== 'nad') return { ...family, variants: [...family.variants] };

    return {
      ...family,
      variants: family.variants.map((variant) => {
        if (variant.websiteVariantId !== 'nad-inj-selected-r83') return { ...variant };

        return makeLiveVariant(variant, {
          websiteVariantId: 'nad-injection-gen-live',
          displayLabel: 'Injection',
          form: 'Injection',
          finalRetailPrice: 139,
          genProductId: NAD_INJECTABLE_GEN_PRODUCT_ID,
        });
      }),
    };
  });
}

function makeLiveVariant(
  variant: WebsiteProductFamily['variants'][number],
  input: {
    websiteVariantId: string;
    displayLabel: string;
    form: string;
    finalRetailPrice: number;
    genProductId: string;
  },
) {
  return {
    ...variant,
    websiteVariantId: input.websiteVariantId,
    displayLabel: input.displayLabel,
    form: input.form,
    additive: null,
    strength: null,
    package: null,
    finalRetailPrice: input.finalRetailPrice,
    startingPrice: input.finalRetailPrice,
    genProductId: input.genProductId,
    genClientProductId: `${GEN_CLIENT_PREFIX}${input.genProductId}`,
    genPairingVerified: true,
    routingStatus: 'ROUTING_READY' as const,
    launchState: 'LAUNCH_READY' as const,
    checkoutStatus: 'GEN_PRODUCT_FIRST' as const,
    availabilityStatus: 'storefront' as const,
    exactFormularyRows: [],
  };
}
