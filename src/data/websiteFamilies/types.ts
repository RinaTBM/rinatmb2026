/**
 * MBM website product-family → variant → GEN routing model.
 * Patient UI must never expose GEN IDs, pharmacy IDs, or formulary rows.
 */

export type WebsiteRoutingStatus =
  | 'ROUTING_READY'
  | 'GEN_PAIRING_PENDING'
  | 'FORMULARY_PENDING'
  | 'FUTURE_HIDDEN'
  | 'BLOCKED';

export type WebsitePurchaseType = 'one_time' | 'membership' | 'multi_month' | string;

export interface WebsiteProductVariant {
  websiteVariantId: string;
  familyId: string;
  displayLabel: string | null;
  form: string | null;
  additive: string | null;
  doseTier: string | null;
  strength: string | null;
  package: string | null;
  purchaseType: WebsitePurchaseType;
  /** Locked retail (number or band string like "89–99"). */
  finalRetailPrice: number | string | null;
  startingPrice: number | null;
  /** Short GEN product id when known from matrix — never invented. */
  genProductId: string | null;
  /** Full GEN clientProductId when known — never invented. */
  genClientProductId: string | null;
  /**
   * Owner/manual GEN formulary pairing verification.
   * Always false until explicitly verified — never auto-set true.
   */
  genPairingVerified: boolean;
  routingStatus: WebsiteRoutingStatus;
  launchState: string | null;
  checkoutStatus: string;
  availabilityStatus: string;
  /** Internal only — never render to patients. */
  exactFormularyRows?: number[];
}

export interface WebsiteProductFamily {
  familyId: string;
  displayName: string;
  category: string | null;
  architectureRule: string | null;
  availableSelectors: string[];
  currentWebsiteSlug: string | null;
  startingAtPriceDisplay: string | null;
  variants: WebsiteProductVariant[];
}

export interface FamilySelectorState {
  purchaseType?: 'one_time' | 'membership';
  additive?: 'Vitamin B12' | 'Glycine' | string;
  doseTier?: string;
  form?: string;
  strength?: string;
  package?: string;
  nasalOption?: 'r84' | 'r85' | string;
}

export interface FamilyRouteResolution {
  ok: boolean;
  familyId: string;
  variant: WebsiteProductVariant | null;
  reason?: string;
}

export interface GenOrderGateInput {
  genClientProductId: string | null | undefined;
  genPairingVerified: boolean;
  routingStatus: WebsiteRoutingStatus;
  /** Global cutover / live GEN order flags — must stay off in this phase. */
  realGenOrderSubmissionEnabled?: boolean;
  websiteFamilyCutoverEnabled?: boolean;
}

export interface GenOrderGateResult {
  allowed: boolean;
  code:
    | 'ALLOWED'
    | 'CUTOVER_OFF'
    | 'REAL_GEN_ORDERS_DISABLED'
    | 'MISSING_GEN_CLIENT_PRODUCT_ID'
    | 'PAIRING_NOT_VERIFIED'
    | 'ROUTING_NOT_READY'
    | 'FORMULARY_PENDING'
    | 'FUTURE_HIDDEN'
    | 'BLOCKED';
  message: string;
}
