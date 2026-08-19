import { describe, expect, it } from 'vitest';
import {
  determineProviderRequirement,
  guestPrescriptionRequiresAuth,
  selectCurrentApprovedForFamily,
  type ApprovedTherapyHistoryRow,
} from './determineProviderRequirement';
import { buildAuthoritativeOrderLines } from './injectProviderVisit';
import {
  FOLLOW_UP_PROVIDER_VISIT,
  INITIAL_PROVIDER_VISIT,
} from './providerVisits';
import {
  planMarkCrossTxAppointmentCompleted,
  planRecordProviderApproval,
  workflowStatusAfterPayment,
} from './therapyApproval';
import { THERAPY_FAMILIES, THERAPY_FAMILY_COUNT } from './therapyFamilies';
import { canAdvanceFulfillment } from '../payments/fulfillmentGuards';

const approved = (
  partial: Partial<ApprovedTherapyHistoryRow> &
    Pick<ApprovedTherapyHistoryRow, 'therapy_family' | 'sku'>,
): ApprovedTherapyHistoryRow => ({
  product_id: partial.product_id ?? 'p1',
  variant_id: partial.variant_id ?? 'semaglutide-v1',
  approval_status: partial.approval_status ?? 'APPROVED',
  approved_at: partial.approved_at ?? '2026-01-01T00:00:00.000Z',
  created_at: partial.created_at ?? '2026-01-01T00:00:00.000Z',
  therapy_family: partial.therapy_family,
  sku: partial.sku,
});

describe('therapy family map', () => {
  it('covers exactly 15 provider-guided prescription families', () => {
    expect(THERAPY_FAMILY_COUNT).toBe(15);
    expect(THERAPY_FAMILIES).toHaveLength(15);
  });
});

describe('determineProviderRequirement', () => {
  it('1. new authenticated customer + first Rx → INITIAL $75', () => {
    const r = determineProviderRequirement({
      customerUserId: 'user-1',
      prescriptionLines: [
        { productId: 'p1', slug: 'semaglutide', sku: 'MBM-WM-SEM-INJ-001' },
      ],
      approvedTherapyHistory: [],
    });
    expect(r.requirement).toBe('INITIAL');
    expect(r.requiredProviderProductId).toBe('pc1');
  });

  it('2. returning + same therapy + same approved SKU → NONE', () => {
    const r = determineProviderRequirement({
      customerUserId: 'user-1',
      prescriptionLines: [
        { productId: 'p1', slug: 'semaglutide', sku: 'MBM-WM-SEM-INJ-002' },
      ],
      approvedTherapyHistory: [
        approved({ therapy_family: 'semaglutide', sku: 'MBM-WM-SEM-INJ-002' }),
      ],
    });
    expect(r.requirement).toBe('NONE');
    expect(r.requiredProviderProductId).toBeNull();
  });

  it('3. returning + same therapy + higher dose → FOLLOW_UP $55', () => {
    const r = determineProviderRequirement({
      customerUserId: 'user-1',
      prescriptionLines: [
        { productId: 'p1', slug: 'semaglutide', sku: 'MBM-WM-SEM-INJ-004' },
      ],
      approvedTherapyHistory: [
        approved({ therapy_family: 'semaglutide', sku: 'MBM-WM-SEM-INJ-001' }),
      ],
    });
    expect(r.requirement).toBe('FOLLOW_UP');
    expect(r.requiredProviderProductId).toBe('pc2');
    expect(r.previousVariantSku).toBe('MBM-WM-SEM-INJ-001');
    expect(r.requestedVariantSku).toBe('MBM-WM-SEM-INJ-004');
  });

  it('4. returning + same therapy + lower dose → FOLLOW_UP $55', () => {
    const r = determineProviderRequirement({
      customerUserId: 'user-1',
      prescriptionLines: [
        { productId: 'p1', slug: 'semaglutide', sku: 'MBM-WM-SEM-INJ-001' },
      ],
      approvedTherapyHistory: [
        approved({ therapy_family: 'semaglutide', sku: 'MBM-WM-SEM-INJ-004' }),
      ],
    });
    expect(r.requirement).toBe('FOLLOW_UP');
  });

  it('5. returning + new therapy → INITIAL (NEW_THERAPY) $75', () => {
    const r = determineProviderRequirement({
      customerUserId: 'user-1',
      prescriptionLines: [
        { productId: 'p5', slug: 'tirzepatide', sku: 'MBM-WM-TIR-INJ-001' },
      ],
      approvedTherapyHistory: [
        approved({ therapy_family: 'semaglutide', sku: 'MBM-WM-SEM-INJ-001' }),
      ],
    });
    expect(r.requirement).toBe('NEW_THERAPY');
    expect(r.requiredProviderProductId).toBe('pc1');
  });

  it('6. prior PENDING therapy history does not count', () => {
    const r = determineProviderRequirement({
      customerUserId: 'user-1',
      prescriptionLines: [
        { productId: 'p1', slug: 'semaglutide', sku: 'MBM-WM-SEM-INJ-001' },
      ],
      approvedTherapyHistory: [
        approved({
          therapy_family: 'semaglutide',
          sku: 'MBM-WM-SEM-INJ-001',
          approval_status: 'PENDING',
        }),
      ],
    });
    expect(r.requirement).toBe('INITIAL');
  });

  it('7. prior REJECTED history does not count', () => {
    const r = determineProviderRequirement({
      customerUserId: 'user-1',
      prescriptionLines: [
        { productId: 'p1', slug: 'semaglutide', sku: 'MBM-WM-SEM-INJ-001' },
      ],
      approvedTherapyHistory: [
        approved({
          therapy_family: 'semaglutide',
          sku: 'MBM-WM-SEM-INJ-001',
          approval_status: 'REJECTED',
        }),
      ],
    });
    expect(r.requirement).toBe('INITIAL');
  });

  it('8. prior APPROVED history counts', () => {
    const r = determineProviderRequirement({
      customerUserId: 'user-1',
      prescriptionLines: [
        { productId: 'p1', slug: 'semaglutide', sku: 'MBM-WM-SEM-INJ-001' },
      ],
      approvedTherapyHistory: [
        approved({ therapy_family: 'semaglutide', sku: 'MBM-WM-SEM-INJ-001' }),
      ],
    });
    expect(r.requirement).toBe('NONE');
  });

  it('9. superseded history is not selected as current approval', () => {
    const current = selectCurrentApprovedForFamily(
      [
        approved({
          therapy_family: 'semaglutide',
          sku: 'MBM-WM-SEM-INJ-001',
          approval_status: 'SUPERSEDED',
          approved_at: '2026-02-01T00:00:00.000Z',
        }),
        approved({
          therapy_family: 'semaglutide',
          sku: 'MBM-WM-SEM-INJ-003',
          approval_status: 'APPROVED',
          approved_at: '2026-03-01T00:00:00.000Z',
        }),
      ],
      'semaglutide',
    );
    expect(current?.sku).toBe('MBM-WM-SEM-INJ-003');

    const r = determineProviderRequirement({
      customerUserId: 'user-1',
      prescriptionLines: [
        { productId: 'p1', slug: 'semaglutide', sku: 'MBM-WM-SEM-INJ-003' },
      ],
      approvedTherapyHistory: [
        approved({
          therapy_family: 'semaglutide',
          sku: 'MBM-WM-SEM-INJ-001',
          approval_status: 'SUPERSEDED',
        }),
        approved({ therapy_family: 'semaglutide', sku: 'MBM-WM-SEM-INJ-003' }),
      ],
    });
    expect(r.requirement).toBe('NONE');
  });

  it('10–12. failed/cancelled/paid-without-approval do not establish approval (history only)', () => {
    // Order payment state is intentionally ignored — only APPROVED history rows matter.
    const r = determineProviderRequirement({
      customerUserId: 'user-1',
      prescriptionLines: [
        { productId: 'p1', slug: 'semaglutide', sku: 'MBM-WM-SEM-INJ-001' },
      ],
      approvedTherapyHistory: [],
    });
    expect(r.requirement).toBe('INITIAL');
  });

  it('13. guest Rx checkout → authentication required', () => {
    const g = guestPrescriptionRequiresAuth({
      customerUserId: null,
      hasProviderGuidedPrescription: true,
    });
    expect(g.ok).toBe(false);
  });

  it('14. accessory-only guest checkout → auth not required', () => {
    const g = guestPrescriptionRequiresAuth({
      customerUserId: null,
      hasProviderGuidedPrescription: false,
    });
    expect(g.ok).toBe(true);
  });

  it('15. Initial + Follow-Up triggers in same cart → one Initial only', () => {
    const r = determineProviderRequirement({
      customerUserId: 'user-1',
      prescriptionLines: [
        { productId: 'p5', slug: 'tirzepatide', sku: 'MBM-WM-TIR-INJ-001' },
        { productId: 'p1', slug: 'semaglutide', sku: 'MBM-WM-SEM-INJ-004' },
      ],
      approvedTherapyHistory: [
        approved({ therapy_family: 'semaglutide', sku: 'MBM-WM-SEM-INJ-001' }),
      ],
    });
    expect(r.requirement).toBe('NEW_THERAPY');
    expect(r.requiredProviderProductId).toBe('pc1');
  });

  it('16. two Follow-Up triggers → one Follow-Up only', () => {
    const r = determineProviderRequirement({
      customerUserId: 'user-1',
      prescriptionLines: [
        { productId: 'p1', slug: 'semaglutide', sku: 'MBM-WM-SEM-INJ-004' },
        { productId: 'p5', slug: 'tirzepatide', sku: 'MBM-WM-TIR-INJ-004' },
      ],
      approvedTherapyHistory: [
        approved({ therapy_family: 'semaglutide', sku: 'MBM-WM-SEM-INJ-001' }),
        approved({ therapy_family: 'tirzepatide', sku: 'MBM-WM-TIR-INJ-001' }),
      ],
    });
    expect(r.requirement).toBe('FOLLOW_UP');
    expect(r.requiredProviderProductId).toBe('pc2');
  });

  it('23. membership uses fulfillment SKU not program SKU', () => {
    const same = determineProviderRequirement({
      customerUserId: 'user-1',
      prescriptionLines: [
        {
          productId: 'm1',
          slug: 'semaglutide-membership',
          sku: 'MBM-MEM-SEM-MEM-001',
          fulfillmentSku: 'MBM-WM-SEM-INJ-003',
          isMembership: true,
          purchaseType: 'membership_program',
        },
      ],
      approvedTherapyHistory: [
        approved({ therapy_family: 'semaglutide', sku: 'MBM-WM-SEM-INJ-003' }),
      ],
    });
    expect(same.requirement).toBe('NONE');

    const changed = determineProviderRequirement({
      customerUserId: 'user-1',
      prescriptionLines: [
        {
          productId: 'm1',
          slug: 'semaglutide-membership',
          sku: 'MBM-MEM-SEM-MEM-001',
          fulfillmentSku: 'MBM-WM-SEM-INJ-004',
          isMembership: true,
          purchaseType: 'membership_program',
        },
      ],
      approvedTherapyHistory: [
        approved({ therapy_family: 'semaglutide', sku: 'MBM-WM-SEM-INJ-003' }),
      ],
    });
    expect(changed.requirement).toBe('FOLLOW_UP');
    expect(changed.requestedVariantSku).toBe('MBM-WM-SEM-INJ-004');
  });
});

describe('server-side visit injection', () => {
  it('17. client removes required visit → server reinjects', () => {
    const built = buildAuthoritativeOrderLines({
      customerUserId: 'user-1',
      approvedTherapyHistory: [],
      items: [
        {
          productId: 'p1',
          productName: 'Semaglutide',
          sku: 'MBM-WM-SEM-INJ-001',
          slug: 'semaglutide',
          quantity: 1,
          unitAmountCents: 29900,
          section: 'weight-management',
        },
      ],
      shippingCents: 3000,
    });
    expect(built.requirement.requirement).toBe('INITIAL');
    expect(built.items.some(i => i.sku === INITIAL_PROVIDER_VISIT.sku)).toBe(true);
    expect(built.totalCents).toBe(
      29900 + INITIAL_PROVIDER_VISIT.priceCents + 3000,
    );
  });

  it('18. client changes visit price → server ignores client price', () => {
    const built = buildAuthoritativeOrderLines({
      customerUserId: 'user-1',
      approvedTherapyHistory: [],
      items: [
        {
          productId: 'p1',
          productName: 'Semaglutide',
          sku: 'MBM-WM-SEM-INJ-001',
          slug: 'semaglutide',
          quantity: 1,
          unitAmountCents: 29900,
          section: 'weight-management',
        },
        {
          productId: 'pc1',
          productName: 'Initial Provider Visit',
          sku: INITIAL_PROVIDER_VISIT.sku,
          quantity: 1,
          unitAmountCents: 1,
          section: 'provider-care',
        },
      ],
      shippingCents: 0,
    });
    const visit = built.items.find(i => i.sku === INITIAL_PROVIDER_VISIT.sku);
    expect(visit?.unitAmountCents).toBe(7500);
    expect(built.items.filter(i => i.sku === INITIAL_PROVIDER_VISIT.sku)).toHaveLength(1);
  });

  it('19. manual wrong visit SKU → corrected/deduped server-side', () => {
    const built = buildAuthoritativeOrderLines({
      customerUserId: 'user-1',
      approvedTherapyHistory: [
        approved({ therapy_family: 'semaglutide', sku: 'MBM-WM-SEM-INJ-001' }),
      ],
      items: [
        {
          productId: 'p1',
          productName: 'Semaglutide',
          sku: 'MBM-WM-SEM-INJ-004',
          slug: 'semaglutide',
          quantity: 1,
          unitAmountCents: 39900,
          section: 'weight-management',
        },
        {
          productId: 'pc1',
          productName: 'Initial Provider Visit',
          sku: INITIAL_PROVIDER_VISIT.sku,
          quantity: 1,
          unitAmountCents: 7500,
          section: 'provider-care',
        },
      ],
      shippingCents: 0,
    });
    expect(built.requirement.requirement).toBe('FOLLOW_UP');
    expect(built.items.some(i => i.sku === FOLLOW_UP_PROVIDER_VISIT.sku)).toBe(true);
    expect(built.items.some(i => i.sku === INITIAL_PROVIDER_VISIT.sku)).toBe(false);
  });

  it('20–22. ACH / Wire / Kashu totals include provider fee structurally', () => {
    const built = buildAuthoritativeOrderLines({
      customerUserId: 'user-1',
      approvedTherapyHistory: [],
      items: [
        {
          productId: 'p1',
          productName: 'Semaglutide',
          sku: 'MBM-WM-SEM-INJ-001',
          slug: 'semaglutide',
          quantity: 1,
          unitAmountCents: 20000,
          section: 'weight-management',
        },
      ],
      shippingCents: 3000,
      discountCents: 0,
    });
    // Same authoritative total regardless of payment method (ACH/Wire/future Kashu).
    // Tax-inclusive: no separate Provider Care Tax add-on.
    expect(built.subtotalCents).toBe(20000 + 7500);
    expect(built.taxCents).toBe(0);
    expect(built.totalCents).toBe(27500 + 3000);
  });
});

describe('admin approval + CrossTx workflow', () => {
  it('24–25. admin records approval and supersedes previous APPROVED', () => {
    const plan = planRecordProviderApproval({
      customerUserId: 'user-1',
      therapyFamily: 'semaglutide',
      productId: 'p1',
      variantId: 'semaglutide-v3',
      sku: 'MBM-WM-SEM-INJ-003',
      sourceOrderId: 'order-1',
      approvedBy: 'admin-1',
      currentApprovedRows: [
        {
          id: 'hist-old',
          customer_user_id: 'user-1',
          therapy_family: 'semaglutide',
          product_id: 'p1',
          variant_id: 'semaglutide-v1',
          sku: 'MBM-WM-SEM-INJ-001',
          approval_status: 'APPROVED',
        },
      ],
      nowIso: '2026-08-12T12:00:00.000Z',
    });
    expect(plan.supersedeIds).toEqual(['hist-old']);
    expect(plan.insertRow.approval_status).toBe('APPROVED');
    expect(plan.insertRow.sku).toBe('MBM-WM-SEM-INJ-003');
  });

  it('26. manual CrossTx status lifecycle', () => {
    expect(workflowStatusAfterPayment('NONE').provider_workflow_status).toBe('NOT_REQUIRED');
    expect(workflowStatusAfterPayment('INITIAL').provider_workflow_status).toBe(
      'MANUAL_ACTION_REQUIRED',
    );
    const done = planMarkCrossTxAppointmentCompleted({
      currentWorkflowStatus: 'MANUAL_ACTION_REQUIRED',
    });
    expect(done.ok).toBe(true);
    if (done.ok) expect(done.next).toBe('COMPLETED');
  });

  it('27. provider fulfillment guard', () => {
    const blocked = canAdvanceFulfillment({
      paymentStatus: 'paid',
      nextFulfillmentStatus: 'processing',
      providerRequirement: 'INITIAL',
      providerWorkflowStatus: 'MANUAL_ACTION_REQUIRED',
      hasApprovedTherapyForOrder: false,
    });
    expect(blocked.ok).toBe(false);

    const ok = canAdvanceFulfillment({
      paymentStatus: 'paid',
      nextFulfillmentStatus: 'processing',
      providerRequirement: 'INITIAL',
      providerWorkflowStatus: 'COMPLETED',
      hasApprovedTherapyForOrder: true,
    });
    expect(ok.ok).toBe(true);

    const accessory = canAdvanceFulfillment({
      paymentStatus: 'paid',
      nextFulfillmentStatus: 'shipped',
      providerRequirement: 'NONE',
      providerWorkflowStatus: 'NOT_REQUIRED',
      hasApprovedTherapyForOrder: false,
    });
    expect(accessory.ok).toBe(true);

    // provider_review_in_progress still only needs payment (manual CrossTx window).
    const review = canAdvanceFulfillment({
      paymentStatus: 'paid',
      nextFulfillmentStatus: 'provider_review_in_progress',
      providerRequirement: 'INITIAL',
      providerWorkflowStatus: 'MANUAL_ACTION_REQUIRED',
      hasApprovedTherapyForOrder: false,
    });
    expect(review.ok).toBe(true);
  });
});
