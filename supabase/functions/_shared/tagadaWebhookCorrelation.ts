/**
 * Pure Tagada webhook order-correlation helpers (Phase 12F.1).
 * Keep in sync with src/lib/payments/tagadaWebhookCorrelation.ts.
 * Never correlate by email alone.
 */

export type TagadaExternalIds = {
  externalOrderId: string | null;
  externalPaymentId: string | null;
  externalCheckoutSessionId: string | null;
};

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : undefined;
}

export function mbmOrderFromTags(tags: unknown): string | null {
  if (!Array.isArray(tags)) return null;
  for (const t of tags) {
    if (typeof t !== "string") continue;
    if (t.startsWith("mbmOrder:")) return t.slice("mbmOrder:".length).trim();
    const echoed = t.match(/(?:^|:)mbmOrder:([A-Z0-9-]+)/i);
    if (echoed?.[1]) return echoed[1];
  }
  return null;
}

export function extractOrderNumberFromTagadaPayload(
  payload: Record<string, unknown>,
): string | null {
  const data = asRecord(payload.data);
  const keys = ["mbmOrderNumber", "mbm_order_number", "payment_reference", "externalReference"];
  for (const layer of [payload, data, asRecord(payload.metadata), asRecord(data?.metadata)]) {
    if (!layer) continue;
    for (const k of keys) {
      const v = layer[k];
      if (typeof v === "string" && v.trim()) return v.trim().toUpperCase();
    }
  }
  const tagSets = [
    payload.customerTags,
    asRecord(payload.customer)?.tags,
    asRecord(data?.customer)?.tags,
    data?.customerTags,
  ];
  for (const tags of tagSets) {
    const fromTags = mbmOrderFromTags(tags);
    if (fromTags) return fromTags.toUpperCase();
  }
  const orderMeta = asRecord(data?.order_metadata);
  const qp = orderMeta?.queryParams;
  if (typeof qp === "string" && qp.includes("mbmOrder")) {
    try {
      const params = new URLSearchParams(qp.startsWith("?") ? qp.slice(1) : qp);
      const raw = params.get("customerTags") || "";
      const fromQuery = mbmOrderFromTags(raw.split(",").map((s) => s.trim()).filter(Boolean));
      if (fromQuery) return fromQuery.toUpperCase();
    } catch {
      /* ignore */
    }
  }
  return null;
}

export function extractAmountCentsFromTagadaPayload(
  payload: Record<string, unknown>,
): number | null {
  const data = asRecord(payload.data);
  const order = asRecord(payload.order) ?? asRecord(data?.order);
  const payment = asRecord(payload.payment) ?? asRecord(data?.payment);
  const candidates = [
    payload.amountCents,
    payload.amount_cents,
    payload.totalCents,
    payload.total_cents,
    data?.amount,
    data?.amountCents,
    order?.paidAmount,
    order?.amountCents,
    order?.totalCents,
    payment?.amountCents,
    payment?.amount,
    payload.amount,
  ];
  for (const c of candidates) {
    if (typeof c === "number" && Number.isFinite(c)) return Math.trunc(c);
    if (typeof c === "string" && c.trim() && !Number.isNaN(Number(c))) {
      return Math.trunc(Number(c));
    }
  }
  return null;
}

export function extractExternalIdsFromTagadaPayload(
  payload: Record<string, unknown>,
): TagadaExternalIds {
  const data = asRecord(payload.data);
  const order = asRecord(payload.order) ?? asRecord(data?.order);
  const payment = asRecord(payload.payment) ?? asRecord(data?.payment);
  const asId = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  return {
    externalOrderId:
      asId(payload.orderId) || asId(data?.orderId) || asId(order?.id) || asId(order?.orderId) || null,
    externalPaymentId:
      asId(payload.paymentId) ||
      asId(data?.paymentId) ||
      asId(payment?.id) ||
      asId(payment?.paymentId) ||
      null,
    externalCheckoutSessionId:
      asId(payload.checkoutSessionId) ||
      asId(payload.checkout_session_id) ||
      asId(data?.checkoutSessionId) ||
      null,
  };
}

export function evaluatePaidAmountMatch(input: {
  orderTotalCents: number;
  paidCents: number | null;
}): "ok" | "amount_mismatch" | "amount_missing" {
  if (input.paidCents === null || !Number.isFinite(input.paidCents)) return "amount_missing";
  if (Math.round(input.paidCents) !== Math.round(input.orderTotalCents)) return "amount_mismatch";
  return "ok";
}

export function evaluateDuplicatePaidEvent(input: {
  currentPaymentStatus: string;
  targetStatus: string;
}): "duplicate_already_paid" | "proceed" {
  if (input.currentPaymentStatus === "paid" && input.targetStatus === "paid") {
    return "duplicate_already_paid";
  }
  return "proceed";
}
