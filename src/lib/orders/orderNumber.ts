/**
 * Customer-facing public order numbers: MBM-YYYY-######
 * Database UUID is never used as the customer-facing order number.
 */

const ORDER_NUMBER_RE = /^MBM-(\d{4})-(\d{6})$/;

/** Safe customer-facing message when order creation fails (never include DB internals). */
export const CHECKOUT_ORDER_CREATE_FAILED_MESSAGE =
  "We couldn't start your checkout. Please try again.";

export function formatPublicOrderNumber(year: number, sequence: number): string {
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    throw new Error('Invalid order year');
  }
  if (!Number.isInteger(sequence) || sequence < 1) {
    throw new Error('Invalid order sequence');
  }
  return `MBM-${year}-${String(sequence).padStart(6, '0')}`;
}

export function isValidPublicOrderNumber(value: string): boolean {
  return ORDER_NUMBER_RE.test(value);
}

export function parsePublicOrderSequence(value: string): number | null {
  const m = ORDER_NUMBER_RE.exec(value);
  if (!m) return null;
  return Number.parseInt(m[2], 10);
}

export function assertUniquePublicOrderNumbers(numbers: string[]): boolean {
  const set = new Set(numbers);
  return set.size === numbers.length && numbers.every(isValidPublicOrderNumber);
}

/** Never expose internal UUIDs as customer-facing order numbers. */
export function isInternalIdExposedAsOrderNumber(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

/** Detect Postgres unique_violation / PostgREST duplicate key payloads. */
export function isUniquePublicOrderNumberConflict(errorText: string): boolean {
  const t = errorText.toLowerCase();
  return (
    t.includes('23505') ||
    t.includes('duplicate key') ||
    t.includes('orders_public_order_number_key') ||
    (t.includes('unique constraint') && t.includes('public_order_number'))
  );
}

/**
 * Sanitize Edge/PostgREST errors before returning to the browser.
 * Raw Postgres / constraint text must never reach customers.
 */
export function sanitizeCheckoutOrderError(raw: string | null | undefined): string {
  const text = String(raw || '');
  if (!text.trim()) return CHECKOUT_ORDER_CREATE_FAILED_MESSAGE;
  if (
    isUniquePublicOrderNumberConflict(text) ||
    /code["']?\s*:\s*["']?23505/i.test(text) ||
    /postgres|postgrest|violates unique|duplicate key|schema cache|sqlstate/i.test(text) ||
    /unable to create order:/i.test(text) ||
    /unable to allocate order number:/i.test(text)
  ) {
    return CHECKOUT_ORDER_CREATE_FAILED_MESSAGE;
  }
  // Known safe product messages may pass through; anything that looks like JSON/DB dump is hidden.
  if (text.trim().startsWith('{') || text.includes('\n') || text.length > 180) {
    return CHECKOUT_ORDER_CREATE_FAILED_MESSAGE;
  }
  return text;
}

/**
 * Pure allocator simulation: given existing numbers + a nextval-like counter,
 * skip collisions until unique. Mirrors hardened SQL generate_public_order_number.
 */
export function allocateNextPublicOrderNumber(input: {
  year: number;
  existing: ReadonlySet<string> | readonly string[];
  nextSequence: () => number;
  maxTries?: number;
}): string {
  const existing =
    input.existing instanceof Set ? input.existing : new Set(input.existing);
  const maxTries = input.maxTries ?? 1000;
  for (let tries = 0; tries < maxTries; tries++) {
    const candidate = formatPublicOrderNumber(input.year, input.nextSequence());
    if (!existing.has(candidate)) return candidate;
  }
  throw new Error('unable to allocate unique public_order_number');
}
