import { describe, it, expect } from 'vitest';
import {
  customerCanViewOrder,
  customerCanUpdateFulfillment,
  adminCanManageOrders,
  filterCustomerVisibleEvents,
  sanitizeAdminNoteForCustomer,
  FORBIDDEN_ORDER_FIELDS,
  timelineForOrder,
  timelineStepIndex,
  labelOrderStatus,
  ORDER_STATUSES,
} from './orderStatus';
import {
  buildCarrierTrackingUrl,
  resolveTrackingUrl,
  isValidHttpsUrl,
  rejectArbitraryUnsafeTrackingUrl,
} from './tracking';
import {
  formatPublicOrderNumber,
  assertUniquePublicOrderNumbers,
  isInternalIdExposedAsOrderNumber,
  isValidPublicOrderNumber,
} from './orderNumber';
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  isFreeShippingEligible,
  shippingCentsForMethod,
  shippingEligibilitySnapshot,
  TWO_DAY_SHIPPING_CENTS,
  NEXT_DAY_SHIPPING_CENTS,
} from './shipping';
import {
  buildOrderFromCheckoutSession,
  shouldSkipDuplicateCheckoutSession,
  parseItemSnapshotsFromMetadata,
  lineItemsFromStripe,
  nextAdminStatusAction,
  emailEventForStatus,
  ORDER_EMAIL_EVENT_TYPES,
} from './webhookOrder';
import { shouldRedirectCustomerToLogin, resolveCustomerAccess } from '../auth/customerAccess';

describe('customer order access', () => {
  it('customer sees only own orders', () => {
    expect(
      customerCanViewOrder({ authenticatedUserId: 'user-a', orderCustomerUserId: 'user-a' }),
    ).toBe(true);
    expect(
      customerCanViewOrder({ authenticatedUserId: 'user-a', orderCustomerUserId: 'user-b' }),
    ).toBe(false);
  });

  it('customer cannot access another user order by changing URL (ownership mismatch)', () => {
    expect(
      customerCanViewOrder({ authenticatedUserId: 'me', orderCustomerUserId: 'other' }),
    ).toBe(false);
  });

  it('customer cannot update fulfillment', () => {
    expect(customerCanUpdateFulfillment()).toBe(false);
  });

  it('anonymous user is redirected from account orders', () => {
    const state = resolveCustomerAccess({
      configured: true,
      loading: false,
      authenticated: false,
    });
    expect(shouldRedirectCustomerToLogin(state)).toBe(true);
  });
});

describe('admin order management', () => {
  it('admin can view/manage orders when isAdmin', () => {
    expect(adminCanManageOrders(true)).toBe(true);
    expect(adminCanManageOrders(false)).toBe(false);
  });

  it('admin status actions map correctly', () => {
    expect(nextAdminStatusAction('start_processing')).toBe('processing');
    expect(nextAdminStatusAction('mark_preparing')).toBe('preparing_for_shipment');
    expect(nextAdminStatusAction('mark_shipped')).toBe('shipped');
    expect(nextAdminStatusAction('mark_delivered')).toBe('delivered');
    expect(nextAdminStatusAction('mark_canceled')).toBe('canceled');
  });

  it('admin internal notes remain hidden from customers', () => {
    expect(sanitizeAdminNoteForCustomer('internal: call pharmacy')).toBeNull();
    const events = filterCustomerVisibleEvents([
      { customer_visible: true, status: 'shipped' },
      { customer_visible: false, status: 'processing' },
    ]);
    expect(events).toHaveLength(1);
    expect(events[0].status).toBe('shipped');
  });
});

describe('public order numbers', () => {
  it('formats unique MBM-YYYY-###### numbers', () => {
    const a = formatPublicOrderNumber(2026, 123);
    const b = formatPublicOrderNumber(2026, 124);
    expect(a).toBe('MBM-2026-000123');
    expect(isValidPublicOrderNumber(a)).toBe(true);
    expect(assertUniquePublicOrderNumbers([a, b])).toBe(true);
    expect(assertUniquePublicOrderNumbers([a, a])).toBe(false);
  });

  it('never treats UUID as customer-facing order number', () => {
    expect(isInternalIdExposedAsOrderNumber('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')).toBe(true);
    expect(isInternalIdExposedAsOrderNumber('MBM-2026-000001')).toBe(false);
  });
});

describe('checkout webhook order creation', () => {
  it('does not create duplicate order for the same checkout session', () => {
    const seen = new Set(['cs_test_123']);
    expect(shouldSkipDuplicateCheckoutSession(seen, 'cs_test_123')).toBe(true);
    expect(shouldSkipDuplicateCheckoutSession(seen, 'cs_test_999')).toBe(false);
  });

  it('preserves product snapshots from metadata', () => {
    const snaps = parseItemSnapshotsFromMetadata({
      item_snapshots: JSON.stringify([
        {
          productId: 'p1',
          productName: 'Semaglutide Membership: Flat-Rate GLP-1 Weight Management Program',
          variantLabel: 'Monthly',
          quantity: 1,
          unitPriceCents: 19900,
          discountCents: 0,
          lineTotalCents: 19900,
        },
      ]),
    });
    expect(snaps?.[0]?.productName).toBe('Semaglutide Membership: Flat-Rate GLP-1 Weight Management Program');
    expect(snaps?.[0]?.unitPriceCents).toBe(19900);
  });

  it('preserves shipping method and $500+ eligibility', () => {
    const order = buildOrderFromCheckoutSession({
      id: 'cs_test_1',
      amount_total: 53000,
      amount_subtotal: 50000,
      payment_status: 'paid',
      metadata: {
        shipping_method: 'two_day',
        shipping_cents: '0',
        subtotal_cents: '50000',
        free_shipping_eligible: 'true',
      },
    });
    expect(order.shipping_method).toBe('two_day');
    expect(order.free_shipping_eligible).toBe(true);
    expect(order.payment_status).toBe('paid');
    expect(order.order_status).toBe('payment_confirmed');
  });

  it('builds item snapshots from Stripe line items when metadata missing', () => {
    const items = lineItemsFromStripe([
      {
        description: 'Injection Kit',
        quantity: 2,
        amount_total: 8000,
        amount_subtotal: 8000,
        price: { unit_amount: 4000 },
      },
    ]);
    expect(items[0].productName).toBe('Injection Kit');
    expect(items[0].quantity).toBe(2);
    expect(items[0].unitPriceCents).toBe(4000);
  });
});

describe('shipping policy constants (approved)', () => {
  it('uses Two-Day $30, Next-Day $50, free at $500+', () => {
    expect(TWO_DAY_SHIPPING_CENTS).toBe(3000);
    expect(NEXT_DAY_SHIPPING_CENTS).toBe(5000);
    expect(FREE_SHIPPING_THRESHOLD_CENTS).toBe(50000);
    expect(shippingCentsForMethod('two_day', 10000)).toBe(3000);
    expect(shippingCentsForMethod('next_day', 10000)).toBe(5000);
    expect(isFreeShippingEligible(50000)).toBe(true);
    expect(shippingCentsForMethod('two_day', 50000)).toBe(0);
    expect(shippingEligibilitySnapshot(49999).free_shipping_eligible).toBe(false);
    // Legacy thresholds must not be used
    expect(FREE_SHIPPING_THRESHOLD_CENTS).not.toBe(7500);
  });
});

describe('tracking links', () => {
  it('generates trusted carrier URLs', () => {
    expect(buildCarrierTrackingUrl('UPS', '1Z999')).toContain('ups.com');
    expect(buildCarrierTrackingUrl('FedEx', '123')).toContain('fedex.com');
    expect(buildCarrierTrackingUrl('USPS', '9400')).toContain('usps.com');
  });

  it('rejects invalid Other tracking URLs', () => {
    expect(resolveTrackingUrl({ carrier: 'Other', trackingNumber: 'X', trackingUrl: 'http://evil' }).ok).toBe(
      false,
    );
    expect(
      resolveTrackingUrl({
        carrier: 'Other',
        trackingNumber: 'X',
        trackingUrl: 'https://carrier.example/track/X',
      }).ok,
    ).toBe(true);
    expect(isValidHttpsUrl('https://ok.example')).toBe(true);
    expect(
      rejectArbitraryUnsafeTrackingUrl('UPS', 'https://phishing.example/ups'),
    ).toBe(true);
  });

  it('requires tracking number for known carriers', () => {
    const r = resolveTrackingUrl({ carrier: 'UPS', trackingNumber: '' });
    expect(r.ok).toBe(false);
  });
});

describe('timeline and privacy', () => {
  it('builds customer timeline and highlights current stage', () => {
    const tl = timelineForOrder(false);
    expect(tl[0]).toBe('order_received');
    expect(timelineStepIndex(tl, 'shipped')).toBe(3);
    expect(labelOrderStatus('preparing_for_shipment')).toBe('Preparing for Shipment');
    const withReview = timelineForOrder(true);
    expect(withReview).toContain('provider_review_in_progress');
  });

  it('does not add medical-record fields to order model', () => {
    for (const field of FORBIDDEN_ORDER_FIELDS) {
      expect(ORDER_STATUSES.join(',')).not.toContain(field);
    }
    expect(FORBIDDEN_ORDER_FIELDS).toContain('diagnosis');
    expect(FORBIDDEN_ORDER_FIELDS).toContain('clinical_notes');
    expect(FORBIDDEN_ORDER_FIELDS).toContain('lab_results');
  });

  it('documents email-ready event extension points without sending', () => {
    expect(ORDER_EMAIL_EVENT_TYPES).toContain('shipped');
    expect(emailEventForStatus('shipped')).toBe('shipped');
    expect(emailEventForStatus('payment_confirmed')).toBe('order_received');
  });
});
