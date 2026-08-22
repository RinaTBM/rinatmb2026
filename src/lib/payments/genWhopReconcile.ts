/**
 * GEN/Whop checkout reconciliation — pure payment authority rules.
 * Browser return / query params are NEVER authority.
 * Mirror: supabase/functions/_shared/genWhopReconcile.ts
 */

export type GenWhopReconcileSessionStatus =
  | 'created'
  | 'redirect_issued'
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'paid'
  | 'failed'
  | 'expired'
  | 'cancelled'
  | 'unknown';

export type GenWhopPaymentEvidence = {
  /** Whop payment id (pay_…) */
  whopPaymentId: string;
  /** Linked checkout configuration id (ch_…) when known */
  whopCheckoutConfigId?: string | null;
  status: string;
  amountCents: number | null;
  currency: string | null;
  /** GEN product id from Whop metadata when present */
  genProductId?: string | null;
  /** Optional GEN client product id from metadata */
  genClientProductId?: string | null;
};

export type GenWhopOrderEvidence = {
  genOrderId: string;
  genPatientId?: string | null;
  paymentStatus: string;
  amountCents: number | null;
  currency: string | null;
  genProductId?: string | null;
  genClientProductId?: string | null;
  paymentGateway?: string | null;
  /** Optional link to storefront / Whop session */
  genCheckoutSessionId?: string | null;
  whopCheckoutConfigId?: string | null;
  whopPaymentId?: string | null;
};

export type GenWhopReconcileInput = {
  mbmPaymentStatus: string;
  mbmPaymentMethod: string | null;
  expectedAmountCents: number;
  expectedCurrency: string;
  expectedGenProductId: string;
  expectedGenClientProductId?: string | null;
  expectedWhopCheckoutConfigId?: string | null;
  expectedGenCheckoutSessionId?: string | null;
  currentSessionStatus: GenWhopReconcileSessionStatus;
  /** Authoritative Whop payments already filtered for this company */
  whopPayments: GenWhopPaymentEvidence[];
  /** Authoritative GEN orders (server-fetched) */
  genOrders: GenWhopOrderEvidence[];
  /** Explicit: browser claim must be ignored for paid decision */
  browserClaimPaid?: boolean;
};

export type GenWhopReconcileResult =
  | {
      ok: true;
      action: 'mark_paid' | 'already_paid' | 'noop';
      sessionStatus: GenWhopReconcileSessionStatus;
      code: string;
      whopPaymentId: string | null;
      genOrderId: string | null;
      genPatientId: string | null;
      reason: string;
    }
  | {
      ok: false;
      action: 'refuse' | 'pending' | 'failed';
      sessionStatus: GenWhopReconcileSessionStatus;
      code: string;
      whopPaymentId: string | null;
      genOrderId: string | null;
      genPatientId: string | null;
      reason: string;
    };

const PAID_WHOP = new Set(['paid', 'succeeded', 'success', 'complete', 'completed']);
const FAILED_WHOP = new Set(['failed', 'canceled', 'cancelled', 'void', 'expired']);
const PAID_GEN = new Set(['paid', 'succeeded', 'success']);
const FAILED_GEN = new Set(['failed', 'cancelled', 'canceled', 'expired', 'unpaid']);

function normCurrency(c: string | null | undefined): string {
  return String(c || 'USD').trim().toUpperCase();
}

function isPaidWhopStatus(s: string): boolean {
  return PAID_WHOP.has(String(s || '').toLowerCase());
}

function isFailedWhopStatus(s: string): boolean {
  return FAILED_WHOP.has(String(s || '').toLowerCase());
}

function isPaidGenStatus(s: string): boolean {
  return PAID_GEN.has(String(s || '').toLowerCase());
}

function amountMatches(expected: number, actual: number | null): boolean {
  if (actual === null || !Number.isFinite(actual)) return false;
  return Math.round(actual) === Math.round(expected);
}

function currencyMatches(expected: string, actual: string | null | undefined): boolean {
  if (!actual) return false;
  return normCurrency(expected) === normCurrency(actual);
}

function productMatches(
  expectedProductId: string,
  expectedClientId: string | null | undefined,
  evidenceProductId: string | null | undefined,
  evidenceClientId: string | null | undefined,
): boolean {
  if (evidenceProductId && evidenceProductId === expectedProductId) return true;
  if (expectedClientId && evidenceClientId && evidenceClientId === expectedClientId) return true;
  // Allow missing product on Whop payment if checkout config id already scoped the search.
  if (!evidenceProductId && !evidenceClientId) return false;
  return false;
}

/**
 * Evaluate authoritative Whop + GEN evidence for one MBM gen_whop checkout attempt.
 * Never marks paid from browserClaimPaid alone.
 */
export function evaluateGenWhopReconcile(input: GenWhopReconcileInput): GenWhopReconcileResult {
  // Browser claim is explicitly non-authoritative.
  if (input.browserClaimPaid && input.mbmPaymentStatus !== 'paid') {
    // Continue evaluating server evidence; do not short-circuit to paid.
  }

  if (input.mbmPaymentMethod && input.mbmPaymentMethod !== 'gen_whop') {
    return {
      ok: false,
      action: 'refuse',
      sessionStatus: input.currentSessionStatus,
      code: 'WRONG_PAYMENT_METHOD',
      whopPaymentId: null,
      genOrderId: null,
      genPatientId: null,
      reason: 'Order is not a gen_whop checkout order.',
    };
  }

  if (input.mbmPaymentStatus === 'paid') {
    return {
      ok: true,
      action: 'already_paid',
      sessionStatus: 'paid',
      code: 'ALREADY_PAID',
      whopPaymentId: null,
      genOrderId: null,
      genPatientId: null,
      reason: 'Order already paid — idempotent no-op.',
    };
  }

  const paidWhop = input.whopPayments.filter((p) => isPaidWhopStatus(p.status));
  const failedWhop = input.whopPayments.filter((p) => isFailedWhopStatus(p.status));

  // Duplicate / ambiguous paid evidence
  if (paidWhop.length > 1) {
    const ids = new Set(paidWhop.map((p) => p.whopPaymentId));
    if (ids.size > 1) {
      return {
        ok: false,
        action: 'refuse',
        sessionStatus: 'unknown',
        code: 'AMBIGUOUS_PAYMENT_EVIDENCE',
        whopPaymentId: null,
        genOrderId: null,
        genPatientId: null,
        reason: 'Multiple distinct paid Whop payments matched — refusing auto-mark.',
      };
    }
  }

  const candidate = paidWhop[0] || null;

  if (candidate) {
    if (!amountMatches(input.expectedAmountCents, candidate.amountCents)) {
      return {
        ok: false,
        action: 'refuse',
        sessionStatus: 'unknown',
        code: 'AMOUNT_MISMATCH',
        whopPaymentId: candidate.whopPaymentId,
        genOrderId: null,
        genPatientId: null,
        reason: 'Whop paid amount does not match expected MBM/GEN retail amount.',
      };
    }
    if (!currencyMatches(input.expectedCurrency, candidate.currency)) {
      return {
        ok: false,
        action: 'refuse',
        sessionStatus: 'unknown',
        code: 'CURRENCY_MISMATCH',
        whopPaymentId: candidate.whopPaymentId,
        genOrderId: null,
        genPatientId: null,
        reason: 'Whop payment currency does not match expected currency.',
      };
    }
    if (
      input.expectedWhopCheckoutConfigId &&
      candidate.whopCheckoutConfigId &&
      candidate.whopCheckoutConfigId !== input.expectedWhopCheckoutConfigId
    ) {
      return {
        ok: false,
        action: 'refuse',
        sessionStatus: 'unknown',
        code: 'CHECKOUT_CONFIG_MISMATCH',
        whopPaymentId: candidate.whopPaymentId,
        genOrderId: null,
        genPatientId: null,
        reason: 'Whop payment is not correlated to the expected checkout configuration.',
      };
    }
    // Product correlation when metadata present
    if (candidate.genProductId || candidate.genClientProductId) {
      if (
        !productMatches(
          input.expectedGenProductId,
          input.expectedGenClientProductId,
          candidate.genProductId,
          candidate.genClientProductId,
        )
      ) {
        return {
          ok: false,
          action: 'refuse',
          sessionStatus: 'unknown',
          code: 'PRODUCT_MISMATCH',
          whopPaymentId: candidate.whopPaymentId,
          genOrderId: null,
          genPatientId: null,
          reason: 'Whop payment product metadata does not match expected GEN product.',
        };
      }
    }

    // Prefer matching GEN order when available; Whop paid alone can mark MBM paid
    // only when amount/currency/config correlation is solid (Whop is processor of record).
    const matchingGen = input.genOrders.filter((o) => {
      if (o.whopPaymentId && o.whopPaymentId === candidate.whopPaymentId) return true;
      if (
        input.expectedGenCheckoutSessionId &&
        o.genCheckoutSessionId &&
        o.genCheckoutSessionId === input.expectedGenCheckoutSessionId
      ) {
        return true;
      }
      if (
        input.expectedWhopCheckoutConfigId &&
        o.whopCheckoutConfigId &&
        o.whopCheckoutConfigId === input.expectedWhopCheckoutConfigId
      ) {
        return true;
      }
      return false;
    });

    if (matchingGen.length > 1) {
      return {
        ok: false,
        action: 'refuse',
        sessionStatus: 'unknown',
        code: 'AMBIGUOUS_GEN_ORDER',
        whopPaymentId: candidate.whopPaymentId,
        genOrderId: null,
        genPatientId: null,
        reason: 'Multiple GEN orders correlate to this payment — refusing auto-mark.',
      };
    }

    const gen = matchingGen[0] || null;
    if (gen) {
      if (gen.amountCents !== null && !amountMatches(input.expectedAmountCents, gen.amountCents)) {
        return {
          ok: false,
          action: 'refuse',
          sessionStatus: 'unknown',
          code: 'GEN_AMOUNT_MISMATCH',
          whopPaymentId: candidate.whopPaymentId,
          genOrderId: gen.genOrderId,
          genPatientId: gen.genPatientId ?? null,
          reason: 'Correlated GEN order amount does not match expected amount.',
        };
      }
      if (
        gen.genProductId &&
        !productMatches(
          input.expectedGenProductId,
          input.expectedGenClientProductId,
          gen.genProductId,
          gen.genClientProductId,
        )
      ) {
        return {
          ok: false,
          action: 'refuse',
          sessionStatus: 'unknown',
          code: 'GEN_PRODUCT_MISMATCH',
          whopPaymentId: candidate.whopPaymentId,
          genOrderId: gen.genOrderId,
          genPatientId: gen.genPatientId ?? null,
          reason: 'Correlated GEN order product does not match expected product.',
        };
      }
    }

    return {
      ok: true,
      action: 'mark_paid',
      sessionStatus: 'paid',
      code: 'AUTHORITATIVE_PAID',
      whopPaymentId: candidate.whopPaymentId,
      genOrderId: gen?.genOrderId ?? null,
      genPatientId: gen?.genPatientId ?? null,
      reason: 'Authoritative Whop paid evidence matched expected amount/currency/correlation.',
    };
  }

  // Failed payment evidence (no paid)
  if (failedWhop.length > 0 && paidWhop.length === 0) {
    return {
      ok: false,
      action: 'failed',
      sessionStatus: 'failed',
      code: 'PAYMENT_FAILED',
      whopPaymentId: failedWhop[0].whopPaymentId,
      genOrderId: null,
      genPatientId: null,
      reason: 'Authoritative Whop evidence shows failed/cancelled payment.',
    };
  }

  // GEN-only unpaid / pending
  const paidGenOnly = input.genOrders.filter((o) => isPaidGenStatus(o.paymentStatus));
  if (paidGenOnly.length === 1 && input.whopPayments.length === 0) {
    // Without Whop evidence, GEN "paid" alone is insufficient for MBM mark-paid
    // when processor is Whop (avoid trusting incomplete correlation).
    return {
      ok: false,
      action: 'pending',
      sessionStatus: 'processing',
      code: 'GEN_PAID_WITHOUT_WHOP',
      whopPaymentId: null,
      genOrderId: paidGenOnly[0].genOrderId,
      genPatientId: paidGenOnly[0].genPatientId ?? null,
      reason: 'GEN order looks paid but Whop payment evidence is missing — not marking MBM paid.',
    };
  }

  if (input.browserClaimPaid) {
    return {
      ok: false,
      action: 'pending',
      sessionStatus: 'processing',
      code: 'BROWSER_CLAIM_IGNORED',
      whopPaymentId: null,
      genOrderId: null,
      genPatientId: null,
      reason: 'Browser return claimed paid — ignored. Awaiting authoritative Whop/GEN evidence.',
    };
  }

  if (input.whopPayments.length === 0 && input.genOrders.length === 0) {
    return {
      ok: false,
      action: 'pending',
      sessionStatus:
        input.currentSessionStatus === 'created' ? 'pending' : 'processing',
      code: 'NO_EVIDENCE_YET',
      whopPaymentId: null,
      genOrderId: null,
      genPatientId: null,
      reason: 'No authoritative payment evidence yet.',
    };
  }

  return {
    ok: false,
    action: 'pending',
    sessionStatus: 'processing',
    code: 'PENDING_EVIDENCE',
    whopPaymentId: null,
    genOrderId: null,
    genPatientId: null,
    reason: 'Payment evidence present but not yet authoritative for mark-paid.',
  };
}

/** Convert Whop plan dollars (e.g. 199) to cents when amounts look like major units. */
export function normalizeWhopAmountToCents(amount: unknown, currency?: string | null): number | null {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return null;
  // Whop plan.initial_price often uses major units (199 for $199).
  // If value looks like cents already (>= 1000 and divisible patterns), keep as-is when >= 1000
  // Heuristic: if amount < 1000 treat as major units → cents; else assume already cents.
  if (amount > 0 && amount < 1000) return Math.round(amount * 100);
  return Math.round(amount);
}

export function mapWhopPaymentRecord(raw: Record<string, unknown>): GenWhopPaymentEvidence | null {
  const id =
    (typeof raw.id === 'string' && raw.id) ||
    (typeof raw.payment_id === 'string' && raw.payment_id) ||
    null;
  if (!id) return null;
  const status = String(raw.status || raw.payment_status || 'unknown');
  const meta = (raw.metadata && typeof raw.metadata === 'object'
    ? (raw.metadata as Record<string, unknown>)
    : {}) as Record<string, unknown>;
  const plan = raw.plan && typeof raw.plan === 'object' ? (raw.plan as Record<string, unknown>) : null;
  const amountRaw =
    raw.total ||
    raw.amount ||
    raw.final_amount ||
    raw.usd_total ||
    plan?.initial_price ||
    null;
  const currency =
    (typeof raw.currency === 'string' && raw.currency) ||
    (typeof plan?.currency === 'string' && plan.currency) ||
    null;
  return {
    whopPaymentId: id,
    whopCheckoutConfigId:
      (typeof raw.checkout_configuration_id === 'string' && raw.checkout_configuration_id) ||
      (typeof raw.checkout_config_id === 'string' && raw.checkout_config_id) ||
      null,
    status,
    amountCents: normalizeWhopAmountToCents(amountRaw, currency),
    currency,
    genProductId: typeof meta.productId === 'string' ? meta.productId : null,
    genClientProductId: typeof meta.clientProductId === 'string' ? meta.clientProductId : null,
  };
}
