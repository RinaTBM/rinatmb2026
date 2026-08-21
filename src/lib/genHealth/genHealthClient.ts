/**
 * Phase 12I.5 — Canonical GEN Health V2 white-label client facade.
 * All application/Edge code should use this surface instead of ad-hoc GEN fetch().
 * Browser must never call these with a real API key — Edge wrappers only.
 */

import {
  createOrReuseGenPatient,
  createGenOrder,
  createGenOrderUnpaid,
  ensureGenPatient,
  getGenOrder,
  getGenProductForms,
  getPrescriptionsForOrder,
  listGenConversations,
  listGenLabs,
  listGenPrescriptions,
  listGenVisits,
  markGenOrderPaid,
  assertGenMarkPaidEligible,
  sendGenConversationMessage,
  submitGenOrderForm,
  syncGenOrder,
  uploadsWrapperStatus,
  type GenClientDeps,
} from './genHealth';
import { normalizeProductFormsResponse } from './genForms';
import type { ClinicalFormSchema, ClinicalOrder, ClinicalPrescription } from './clinicalDomain';
import {
  normalizeGenClinicalStatus,
  normalizePharmacyShipmentStatus,
  normalizeRequiredActionsList,
  portalStageFromClinical,
} from './clinicalStatus';

export const genHealth = {
  patients: {
    create: createOrReuseGenPatient,
    ensure: ensureGenPatient,
    /** get/list/update deferred until confirmed GEN patient CRUD is needed beyond ensure */
  },
  products: {
    getForms: getGenProductForms,
    async getFormsNormalized(productId: string, deps: GenClientDeps = {}) {
      const res = await getGenProductForms(productId, deps);
      if (!res.ok) return res;
      const schemas: ClinicalFormSchema[] = normalizeProductFormsResponse(res.data, productId);
      return { ...res, data: schemas };
    },
  },
  orders: {
    create: createGenOrder,
    createUnpaid: createGenOrderUnpaid,
    get: getGenOrder,
    markPaid: markGenOrderPaid,
    sync: syncGenOrder,
    assertMarkPaidEligible: assertGenMarkPaidEligible,
  },
  forms: {
    listForProduct: getGenProductForms,
    submit: submitGenOrderForm,
  },
  prescriptions: {
    listForOrder: getPrescriptionsForOrder,
    list: listGenPrescriptions,
  },
  visits: {
    list: listGenVisits,
  },
  labs: {
    listForPatient: listGenLabs,
  },
  conversations: {
    list: listGenConversations,
    sendMessage: sendGenConversationMessage,
  },
  uploads: {
    status: uploadsWrapperStatus,
  },
} as const;

export type GenHealthClient = typeof genHealth;

/** Normalize GET order + optional prescriptions into ClinicalOrder (no PHI). */
export function toClinicalOrder(input: {
  genOrderId: string;
  orderStatus?: string | null;
  paymentStatus?: string | null;
  requiredActions?: unknown;
  prescriptionStatus?: string | null;
  pharmacyStatus?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
}): ClinicalOrder {
  const clinicalStatus = normalizeGenClinicalStatus(input.orderStatus);
  const actions = normalizeRequiredActionsList(
    Array.isArray(input.requiredActions) ? (input.requiredActions as never[]) : [],
  );
  const pharmacy = normalizePharmacyShipmentStatus(input.pharmacyStatus || input.orderStatus);
  return {
    externalOrderId: input.genOrderId,
    status: input.orderStatus ?? null,
    paymentStatus: input.paymentStatus ?? null,
    clinicalStatus,
    portalStage: portalStageFromClinical({
      paymentStatus: input.paymentStatus || 'paid',
      clinicalStatus,
      openRequiredActionCount: actions.filter((a) => !a.completed).length,
    }),
    requiredActions: actions.map((a) => ({
      id: a.id || a.rawActionId || a.label,
      category: a.category,
      label: a.label,
      completed: a.completed,
      continuationUrl: a.continuationUrl,
    })),
    prescriptionStatus: input.prescriptionStatus ?? null,
    pharmacyStatus: pharmacy,
    shippingStatus: pharmacy,
    trackingNumber: input.trackingNumber ?? null,
    trackingUrl: input.trackingUrl ?? null,
  };
}

export function toClinicalPrescriptions(
  list: Array<{ id?: string; status?: string; raw?: unknown }>,
): ClinicalPrescription[] {
  return list.map((p) => {
    const raw = p.raw && typeof p.raw === 'object' ? (p.raw as Record<string, unknown>) : {};
    const tracking =
      (typeof raw.trackingNumber === 'string' && raw.trackingNumber) ||
      (typeof raw.tracking_number === 'string' && raw.tracking_number) ||
      null;
    const trackingUrl =
      (typeof raw.trackingUrl === 'string' && raw.trackingUrl) ||
      (typeof raw.tracking_url === 'string' && raw.tracking_url) ||
      null;
    const carrier =
      (typeof raw.carrier === 'string' && raw.carrier) ||
      (typeof raw.shippingCarrier === 'string' && raw.shippingCarrier) ||
      null;
    const med =
      (typeof raw.medicationName === 'string' && raw.medicationName) ||
      (typeof raw.medication_name === 'string' && raw.medication_name) ||
      (typeof raw.displayName === 'string' && raw.displayName) ||
      null;
    return {
      externalPrescriptionId: p.id ?? null,
      status: p.status ?? null,
      medicationLabel: med,
      fulfillmentStatus: (typeof raw.fulfillmentStatus === 'string' && raw.fulfillmentStatus) || null,
      pharmacyStatus: (typeof raw.pharmacyStatus === 'string' && raw.pharmacyStatus) || null,
      trackingNumber: tracking,
      trackingUrl: trackingUrl,
      carrier,
    };
  });
}

/** Hard rule: browser must not hold GEN API keys or call GEN. */
export function browserMayCallGenDirectly(): false {
  return false;
}
