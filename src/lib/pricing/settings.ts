/** Admin-configurable purchasing discounts. Defaults match the Active Wellness strategy. */

export const DEFAULT_MEMBER_DISCOUNT_PERCENT = 15;
export const DEFAULT_AUTO_REFILL_DISCOUNT_PERCENT = 10;
export const DEFAULT_ACCESSORY_MEMBER_DISCOUNT_PERCENT = 15;

export interface PurchaseDiscountSettings {
  /** 15% off eligible wellness products (not Semaglutide/Tirzepatide medication). */
  memberDiscountPercent: number;
  /** 10% Auto-Refill & Save on eligible wellness products. */
  autoRefillDiscountPercent: number;
  /** 15% off eligible accessories for Active Wellness Members. */
  accessoryMemberDiscountPercent: number;
  /** Global enable for accessory member savings. */
  accessoryMemberDiscountEnabled: boolean;
  /** Must remain false — accessory member discount never stacks. */
  accessoryMemberDiscountStackable: boolean;
}

const STORAGE_KEY = 'mybaremethod_purchase_discount_settings';

export function getDefaultPurchaseDiscountSettings(): PurchaseDiscountSettings {
  return {
    memberDiscountPercent: DEFAULT_MEMBER_DISCOUNT_PERCENT,
    autoRefillDiscountPercent: DEFAULT_AUTO_REFILL_DISCOUNT_PERCENT,
    accessoryMemberDiscountPercent: DEFAULT_ACCESSORY_MEMBER_DISCOUNT_PERCENT,
    accessoryMemberDiscountEnabled: true,
    accessoryMemberDiscountStackable: false,
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
      accessoryMemberDiscountPercent: clampPercent(
        parsed.accessoryMemberDiscountPercent,
        defaults.accessoryMemberDiscountPercent,
      ),
      accessoryMemberDiscountEnabled:
        typeof parsed.accessoryMemberDiscountEnabled === 'boolean'
          ? parsed.accessoryMemberDiscountEnabled
          : defaults.accessoryMemberDiscountEnabled,
      // Force non-stacking regardless of stored value (policy).
      accessoryMemberDiscountStackable: false,
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
    accessoryMemberDiscountPercent: clampPercent(
      settings.accessoryMemberDiscountPercent,
      DEFAULT_ACCESSORY_MEMBER_DISCOUNT_PERCENT,
    ),
    accessoryMemberDiscountEnabled: settings.accessoryMemberDiscountEnabled !== false,
    accessoryMemberDiscountStackable: false,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function clampPercent(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(100, Math.max(0, Math.round(n)));
}
