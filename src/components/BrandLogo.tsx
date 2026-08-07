/** Single source for the official My Bare Method logo asset. */
export const BRAND_LOGO_SRC = '/images/logo/my-bare-method-logo.svg';

type BrandLogoProps = {
  className?: string;
  /** Header logo should load eagerly (above the fold). */
  priority?: boolean;
};

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <img
      src={BRAND_LOGO_SRC}
      alt="My Bare Method Logo"
      className={className}
      decoding="async"
      {...(priority ? {} : { loading: 'lazy' as const })}
    />
  );
}
