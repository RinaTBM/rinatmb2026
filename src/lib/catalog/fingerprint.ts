// Deterministic request fingerprints + Stripe idempotency keys.
// The SAME logical create must yield the SAME fingerprint so retries never
// create duplicate Stripe Products or Prices.

export interface PriceIdentity {
  entityType: 'product' | 'membership';
  slug: string;
  variantKey: string; // '' for membership single price
  amountCents: number;
  currency: string;
  billingType: 'one_time' | 'recurring';
  billingInterval: 'month' | null;
}

/** Small, stable, dependency-free hash (djb2 → base36). */
export function stableHash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  }
  return h.toString(36);
}

export function productFingerprint(slug: string, environment: string): string {
  return `product:${environment}:${slug}`;
}

/** Canonical string identifying a unique Stripe Price. */
export function priceFingerprint(p: PriceIdentity, environment: string): string {
  return [
    'price',
    environment,
    p.entityType,
    p.slug,
    p.variantKey || '_',
    String(p.amountCents),
    p.currency,
    p.billingType,
    p.billingInterval ?? '_',
  ].join(':');
}

/** Idempotency key for a Stripe create call (product or price). */
export function idempotencyKey(kind: 'product' | 'price', fingerprint: string): string {
  return `mbm_${kind}_${stableHash(fingerprint)}`;
}
