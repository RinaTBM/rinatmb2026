/**
 * Customer-facing public order numbers: MBM-YYYY-######
 * Database UUID is never used as the customer-facing order number.
 */

const ORDER_NUMBER_RE = /^MBM-(\d{4})-(\d{6})$/;

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
