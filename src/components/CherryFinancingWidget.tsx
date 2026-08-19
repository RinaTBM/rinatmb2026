import { useEffect } from 'react';
import {
  CHERRY_HOST_ELEMENT_ID,
  ensureCherryFloatingEstimator,
} from '@/lib/financing/cherryWidget';

/**
 * Site-wide Cherry floating financing estimator.
 * Mount once in the storefront shell — never inside checkout payment logic.
 */
export function CherryFinancingWidget() {
  useEffect(() => {
    ensureCherryFloatingEstimator();
  }, []);

  return (
    <div
      id={CHERRY_HOST_ELEMENT_ID}
      data-mbm-cherry-financing="true"
      aria-hidden="true"
    />
  );
}
