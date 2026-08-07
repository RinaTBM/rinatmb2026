/** Admin-configurable purchasing discounts. Defaults match the Active Wellness strategy. */

export const DEFAULT_MEMBER_DISCOUNT_PERCENT = 15;
export const DEFAULT_AUTO_REFILL_DISCOUNT_PERCENT = 10;

export interface PurchaseDiscountSettings {
  memberDiscountPercent: number;
  autoRefillDiscountPercent: number;
}

const STORAGE_KEY = 'mybaremethod_purchase_discount_settings';

export function getDefaultPurchaseDiscountSettings(): PurchaseDiscountSettings {
  return {
    memberDiscountPercent: DEFAULT_MEMBER_DISCOUNT_PERCENT,
    autoRefillDiscountPercent: DEFAULT_AUTO_REFILL_DISCOUNT_PERCENT,
  };
}

export function loadPurchaseDiscountSettings(): PurchaseDiscountSettings {
  const defaults = getDefaultPurchaseDiscountSettings();
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<PurchaseDiscountSettings>;
    return {
      memberDiscountPercent: clampPercent(parsed.memberDiscountPercent, defaults.memberDiscountPercent),
      autoRefillDiscountPercent: clampPercent(parsed.autoRefillDiscountPercent, defaults.autoRefillDiscountPercent),
    };
  } catch {
    return defaults;
  }
}

export function savePurchaseDiscountSettings(settings: PurchaseDiscountSettings): void {
  if (typeof window === 'undefined') return;
  const next: PurchaseDiscountSettings = {
    memberDiscountPercent: clampPercent(settings.memberDiscountPercent, DEFAULT_MEMBER_DISCOUNT_PERCENT),
    autoRefillDiscountPercent: clampPercent(settings.autoRefillDiscountPercent, DEFAULT_AUTO_REFILL_DISCOUNT_PERCENT),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function clampPercent(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(100, Math.max(0, Math.round(n)));
}
