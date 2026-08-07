import { useState } from 'react';

/** Single source for the official My Bare Method logo asset (PNG for Bolt reliability). */
export const BRAND_LOGO_SRC = '/images/logo/my-bare-method-logo.png';

type BrandLogoProps = {
  className?: string;
  /** Header logo should load eagerly (above the fold). */
  priority?: boolean;
};

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`inline-flex items-center font-serif text-xl md:text-2xl tracking-wide text-current ${className ?? ''}`}
        aria-label="My Bare Method"
      >
        My Bare Method
      </span>
    );
  }

  return (
    <img
      src={BRAND_LOGO_SRC}
      alt="My Bare Method Logo"
      className={className}
      width={878}
      height={431}
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
    />
  );
}
