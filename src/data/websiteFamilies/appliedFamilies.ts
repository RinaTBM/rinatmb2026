import { WEBSITE_PRODUCT_FAMILIES as GENERATED_FAMILIES, WEBSITE_FAMILY_BUILD_META } from './families.generated';
import { applyOneTimeVialVariants } from './applyOneTimeVialVariants';
import { applyCurrentGenLaunchVariants } from './applyCurrentGenLaunchVariants';

/** Generated families plus owner-approved one-time vial-specific variants/prices. */
export const WEBSITE_PRODUCT_FAMILIES = applyCurrentGenLaunchVariants(
  applyOneTimeVialVariants(GENERATED_FAMILIES),
);
export { WEBSITE_FAMILY_BUILD_META };
