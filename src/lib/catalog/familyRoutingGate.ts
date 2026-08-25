import {
  REAL_GEN_ORDER_SUBMISSION_ENABLED,
  WEBSITE_FAMILY_CUTOVER_ENABLED,
  isOwnerVerifiedGenClientProductId,
} from '@/data/websiteFamilies';
import type { GenOrderGateInput, GenOrderGateResult } from '@/data/websiteFamilies/types';

/**
 * Final GEN handoff/order gate for family/variant routing.
 *
 * Requires:
 * - cutover enabled (currently OFF)
 * - real GEN order submission enabled (currently OFF)
 * - genClientProductId exists
 * - pairing verified (variant flag OR owner registry)
 * - routingStatus === ROUTING_READY
 *
 * GEN_PAIRING_PENDING may be built on the website but must not submit live GEN orders.
 * Browser UI must never bypass this server-side gate.
 */
export function assertFamilyVariantGenOrderAllowed(
  input: GenOrderGateInput,
): GenOrderGateResult {
  const cutover =
    input.websiteFamilyCutoverEnabled ?? WEBSITE_FAMILY_CUTOVER_ENABLED;
  const realOrders =
    input.realGenOrderSubmissionEnabled ?? REAL_GEN_ORDER_SUBMISSION_ENABLED;

  if (!cutover) {
    return {
      allowed: false,
      code: 'CUTOVER_OFF',
      message: 'Website family architecture cutover is OFF.',
    };
  }
  if (!realOrders) {
    return {
      allowed: false,
      code: 'REAL_GEN_ORDERS_DISABLED',
      message: 'Real GEN order submission is disabled for this phase.',
    };
  }
  if (input.routingStatus === 'FORMULARY_PENDING') {
    return {
      allowed: false,
      code: 'FORMULARY_PENDING',
      message: 'Variant is formulary-pending — no live GEN route.',
    };
  }
  if (input.routingStatus === 'FUTURE_HIDDEN') {
    return {
      allowed: false,
      code: 'FUTURE_HIDDEN',
      message: 'Variant is future-hidden — not storefront purchasable.',
    };
  }
  if (input.routingStatus === 'BLOCKED') {
    return {
      allowed: false,
      code: 'BLOCKED',
      message: 'Variant is blocked from purchase.',
    };
  }
  if (!input.genClientProductId?.trim()) {
    return {
      allowed: false,
      code: 'MISSING_GEN_CLIENT_PRODUCT_ID',
      message: 'No GEN clientProductId — never invent IDs.',
    };
  }
  const pairingVerified =
    Boolean(input.genPairingVerified) ||
    isOwnerVerifiedGenClientProductId(input.genClientProductId);
  if (!pairingVerified) {
    return {
      allowed: false,
      code: 'PAIRING_NOT_VERIFIED',
      message: 'genPairingVerified is false — complete manual GEN pairing verification first.',
    };
  }
  if (input.routingStatus !== 'ROUTING_READY') {
    return {
      allowed: false,
      code: 'ROUTING_NOT_READY',
      message: `routingStatus ${input.routingStatus} cannot submit live GEN orders.`,
    };
  }
  return {
    allowed: true,
    code: 'ALLOWED',
    message: 'Family variant GEN order gate passed.',
  };
}
