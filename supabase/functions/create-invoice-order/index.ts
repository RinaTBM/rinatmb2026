import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Create a manual invoice order (ACH / wire / future kashu_card shell).
 * Does NOT call Stripe. Does NOT mark payment as paid.
 * Bank instructions come from Edge Function secrets only (never VITE_*).
 *
 * Provider appointment automation:
 * - Guest Rx carts require authenticated customer_user_id
 * - Server evaluates therapy history + injects required visit at authoritative price
 * - Client cannot omit/remove/reprice required provider visits
 */

import {
  buildAuthoritativeOrderLines,
  toPrescriptionLines,
  type RawOrderLine,
} from "../_shared/injectProviderVisit.ts";
import { guestPrescriptionRequiresAuth } from "../_shared/determineProviderRequirement.ts";
import type { ApprovedTherapyHistoryRow } from "../_shared/determineProviderRequirement.ts";
import {
  resolveRequireGenMappingForRx,
  resolveGenApiOrdersEnabled,
  isProductionCheckoutTestSkuCart,
} from "../_shared/commerceEnvPolicy.ts";
import {
  isLaunchReadyFamilyPaymentSku,
  resolveGenClientProductIdForSku,
} from "../_shared/familyCommerce.ts";
import {
  formatProviderReviewSnapshot,
  glp1FamilyIdFromProductId,
  glp1FamilyIdFromSku,
  glp1FamilyIdFromSlug,
  validateRequestedDose,
} from "../_shared/patientRequestedDose.ts";
import {
  authorizeGlp1OneTimeOrderLine,
  formatOneTimeProviderSnapshot,
} from "../_shared/oneTimeVialMapping.ts";
import { LAUNCH_READY_KASHU_MAP } from "../_shared/launchReadyKashuMap.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type PaymentMethod = "manual_ach" | "manual_wire" | "kashu_card";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function createPaymentAccessToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Never expose Postgres / PostgREST internals to customers. */
const CHECKOUT_ORDER_CREATE_FAILED_MESSAGE =
  "We couldn't start your checkout. Please try again.";

function isUniquePublicOrderNumberConflict(errorText: string): boolean {
  const t = errorText.toLowerCase();
  return (
    t.includes("23505") ||
    t.includes("duplicate key") ||
    t.includes("orders_public_order_number_key") ||
    (t.includes("unique constraint") && t.includes("public_order_number"))
  );
}

function sanitizeCheckoutOrderError(raw: string): string {
  const text = String(raw || "");
  if (!text.trim()) return CHECKOUT_ORDER_CREATE_FAILED_MESSAGE;
  if (
    isUniquePublicOrderNumberConflict(text) ||
    /postgres|postgrest|violates unique|duplicate key|schema cache|sqlstate/i.test(text) ||
    /unable to create order:/i.test(text) ||
    /unable to allocate order number:/i.test(text) ||
    text.trim().startsWith("{") ||
    text.includes("\n") ||
    text.length > 180
  ) {
    return CHECKOUT_ORDER_CREATE_FAILED_MESSAGE;
  }
  return text;
}

/** Conservative Rx SKU detector for production GEN mapping gate (accessories/visits/labs excluded). */
function isPrescriptionMedicationSku(sku: string | null | undefined): boolean {
  if (!sku?.trim()) return false;
  const s = sku.trim().toUpperCase();
  if (!s.startsWith("MBM-")) return false;
  if (s.startsWith("MBM-ACC-") || s.startsWith("MBM-MEM-") || s.startsWith("MBM-SHIP-")) return false;
  if (s.startsWith("MBM-PC-")) return false;
  if (s.includes("IPV") || s.includes("FUV") || s.includes("LAB")) return false;
  return true;
}

async function assertRxGenMappingsReady(input: {
  supabaseUrl: string;
  serviceKey: string;
  items: Array<{ sku?: string | null }>;
}): Promise<{ ok: true } | { ok: false; message: string; blockedSku?: string }> {
  if (!resolveRequireGenMappingForRx()) return { ok: true };
  const rxSkus = [
    ...new Set(
      input.items
        .map((i) => (typeof i.sku === "string" ? i.sku.trim() : ""))
        .filter((s) => isPrescriptionMedicationSku(s)),
    ),
  ];
  if (rxSkus.length === 0) return { ok: true };

  // Phase 12J.0 — payment-only single-SKU allowlist (GEN schema / API Orders may remain deferred).
  // Does not enable GEN handoff. Any other Rx SKU still fails closed below.
  if (isProductionCheckoutTestSkuCart(rxSkus)) {
    return { ok: true };
  }

  // Launch-ready website-family SKUs: Tagada payment may proceed while GEN API Orders
  // and GEN handoff stay OFF. Real automated GEN order creation remains fail-closed.
  const otherRx = rxSkus.filter((s) => !isLaunchReadyFamilyPaymentSku(s));
  if (otherRx.length === 0) {
    return { ok: true };
  }

  // GEN API Orders is fulfillment automation, not a Tagada payment gate. While
  // disabled, paid Rx orders remain in the admin-controlled clinical/GEN queue.
  if (!resolveGenApiOrdersEnabled()) {
    return { ok: true };
  }

  const unresolved = otherRx.filter((s) => !resolveGenClientProductIdForSku(s));
  if (unresolved.length === 0) {
    return { ok: true };
  }

  const inList = unresolved.map((s) => `"${s.replace(/"/g, "")}"`).join(",");
  const res = await fetch(
    `${input.supabaseUrl}/rest/v1/gen_sku_map?mbm_sku=in.(${inList})&select=mbm_sku,mapping_status,active`,
    {
      headers: {
        Authorization: `Bearer ${input.serviceKey}`,
        apikey: input.serviceKey,
      },
    },
  );
  if (!res.ok) {
    // Fail closed in production when gen_sku_map is unavailable / not migrated.
    return {
      ok: false,
      message:
        "Clinical product mapping is not available for checkout. Please contact support.",
      blockedSku: unresolved[0],
    };
  }
  const rows = (await res.json()) as Array<{
    mbm_sku?: string;
    mapping_status?: string;
    active?: boolean;
  }>;
  const bySku = new Map(
    (Array.isArray(rows) ? rows : []).map((r) => [String(r.mbm_sku || "").toUpperCase(), r]),
  );
  for (const sku of unresolved) {
    const row = bySku.get(sku.toUpperCase());
    const status = String(row?.mapping_status || "").toUpperCase();
    const ready =
      row &&
      row.active !== false &&
      (status === "READY" || status === "ACTIVE");
    if (!ready) {
      return {
        ok: false,
        message:
          "This medication cannot be checked out until clinical product mapping is ready. Please contact support.",
        blockedSku: sku,
      };
    }
  }
  return { ok: true };
}

async function allocatePublicOrderNumber(
  supabaseUrl: string,
  serviceKey: string,
): Promise<{ ok: true; publicOrderNumber: string } | { ok: false; detail: string }> {
  const numberRes = await fetch(`${supabaseUrl}/rest/v1/rpc/generate_public_order_number`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  if (!numberRes.ok) {
    const t = await numberRes.text();
    console.error("generate_public_order_number failed", t.slice(0, 500));
    return { ok: false, detail: t };
  }
  const publicOrderNumber = String(await numberRes.json()).trim().toUpperCase();
  if (!/^MBM-\d{4}-\d{6}$/.test(publicOrderNumber)) {
    console.error("generate_public_order_number returned unexpected value", publicOrderNumber);
    return { ok: false, detail: "invalid_order_number_format" };
  }
  return { ok: true, publicOrderNumber };
}

function bankInstructionsFromEnv(method: PaymentMethod) {
  if (method === "kashu_card") {
    return {
      method,
      configured: true,
      hostedCheckout: true,
      additionalInstructions:
        "You will be redirected to Kashu’s secure card checkout to complete payment.",
    };
  }
  if (method === "manual_ach") {
    const bankName = Deno.env.get("MANUAL_ACH_BANK_NAME")?.trim();
    const accountName = Deno.env.get("MANUAL_ACH_ACCOUNT_NAME")?.trim();
    const routingNumber = Deno.env.get("MANUAL_ACH_ROUTING_NUMBER")?.trim();
    const accountNumber = Deno.env.get("MANUAL_ACH_ACCOUNT_NUMBER")?.trim();
    const configured = Boolean(bankName && accountName && routingNumber && accountNumber);
    if (!configured) {
      return {
        method,
        configured: false,
        unavailableMessage:
          "Bank transfer details are being prepared. Please contact us with your order number for payment instructions.",
      };
    }
    return {
      method,
      configured: true,
      bankName,
      accountName,
      routingNumber,
      accountNumber,
      additionalInstructions: Deno.env.get("MANUAL_ACH_ADDITIONAL_INSTRUCTIONS")?.trim() || undefined,
    };
  }
  const wireBankName = Deno.env.get("MANUAL_WIRE_BANK_NAME")?.trim();
  const wireRoutingNumber = Deno.env.get("MANUAL_WIRE_ROUTING_NUMBER")?.trim();
  const wireAccountNumber = Deno.env.get("MANUAL_WIRE_ACCOUNT_NUMBER")?.trim();
  const configured = Boolean(wireBankName && wireRoutingNumber && wireAccountNumber);
  if (!configured) {
    return {
      method,
      configured: false,
      unavailableMessage:
        "Wire transfer details are being prepared. Please contact us with your order number for payment instructions.",
    };
  }
  return {
    method,
    configured: true,
    wireBankName,
    wireRoutingNumber,
    wireAccountNumber,
    wireSwift: Deno.env.get("MANUAL_WIRE_SWIFT")?.trim() || undefined,
    accountName: Deno.env.get("MANUAL_WIRE_ACCOUNT_NAME")?.trim() || undefined,
    additionalInstructions: Deno.env.get("MANUAL_WIRE_ADDITIONAL_INSTRUCTIONS")?.trim() || undefined,
  };
}

async function resolveCustomerUserId(
  req: Request,
  bodyUserId: unknown,
  supabaseUrl: string,
  anonKey: string,
): Promise<string | null> {
  const fromBody = typeof bodyUserId === "string" && bodyUserId.trim() ? bodyUserId.trim() : null;
  const auth = req.headers.get("Authorization") || "";
  const jwt = auth.replace(/^Bearer\s+/i, "").trim();
  if (!jwt || jwt === anonKey) return fromBody;
  try {
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${jwt}`, apikey: anonKey },
    });
    if (!userRes.ok) return fromBody;
    const user = await userRes.json();
    const id = typeof user?.id === "string" ? user.id : null;
    return id || fromBody;
  } catch {
    return fromBody;
  }
}

async function fetchApprovedTherapyHistory(
  supabaseUrl: string,
  serviceKey: string,
  customerUserId: string,
): Promise<ApprovedTherapyHistoryRow[]> {
  const url =
    `${supabaseUrl}/rest/v1/customer_therapy_history` +
    `?customer_user_id=eq.${encodeURIComponent(customerUserId)}` +
    `&select=therapy_family,product_id,variant_id,sku,approval_status,approved_at,created_at`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
    },
  });
  if (!res.ok) {
    // Table may not be applied yet — treat as empty history (safe: requires INITIAL).
    return [];
  }
  const rows = await res.json();
  return Array.isArray(rows) ? rows as ApprovedTherapyHistoryRow[] : [];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    const paymentMethod = body.paymentMethod as string;
    if (
      paymentMethod !== "manual_ach" &&
      paymentMethod !== "manual_wire" &&
      paymentMethod !== "kashu_card"
    ) {
      return json({
        error: "Please select ACH / Bank Transfer, Domestic Wire Transfer, or Credit / Debit Card.",
      }, 400);
    }

    const customerEmail = String(body.customerEmail ?? "").trim();
    const customerName = String(body.customerName ?? "").trim();
    if (!customerEmail.includes("@")) return json({ error: "A valid email is required." }, 400);
    if (!customerName) return json({ error: "Customer name is required." }, 400);

    const requestedShippingMethod = String(body.shippingMethod ?? "");
    const allowedShipping = new Set(["two_day", "next_day", "free_over_500", "none"]);
    if (!allowedShipping.has(requestedShippingMethod) || requestedShippingMethod === "standard") {
      return json({ error: "Invalid shipping method. Choose Two-Day or Next-Day shipping." }, 400);
    }

    const rawItems: RawOrderLine[] = Array.isArray(body.items) ? body.items : [];
    if (rawItems.length === 0) return json({ error: "Your cart is empty." }, 400);

    const subscriptionItems = rawItems.filter((item) =>
      item.purchaseType === "auto_refill" || item.subscription === true
    );
    for (const item of rawItems) {
      const purchaseType = typeof item.purchaseType === "string" ? item.purchaseType : "";
      const isMembershipLine =
        Boolean(item.isMembership) || purchaseType === "membership_program";
      if (
        !isMembershipLine &&
        (purchaseType === "auto_refill" || item.subscription === true) &&
        paymentMethod !== "kashu_card"
      ) {
        return json({
          error:
            "Prescription subscriptions require Credit / Debit Card checkout.",
        }, 400);
      }
    }
    if (subscriptionItems.length > 1 || subscriptionItems.some((item) => Number(item.quantity) !== 1)) {
      return json({
        error: "Subscribe & Save checkout supports one prescription at a time with quantity 1.",
      }, 400);
    }

    for (const item of rawItems) {
      const slug =
        (typeof item.membershipSlug === "string" && item.membershipSlug) ||
        (typeof item.slug === "string" && item.slug) ||
        "";
      const sku = typeof item.sku === "string" ? item.sku : "";
      const familyId =
        glp1FamilyIdFromSlug(slug) ||
        glp1FamilyIdFromSku(sku) ||
        glp1FamilyIdFromProductId(typeof item.productId === "string" ? item.productId : "");
      if (!familyId) continue;
      const dose = validateRequestedDose({
        requestedDose: typeof item.requestedDose === "string" ? item.requestedDose : null,
        familyId,
      });
      if (!dose.ok) {
        return json({ error: dose.error }, 400);
      }
      item.requestedDose = dose.value;
      const auth = authorizeGlp1OneTimeOrderLine({
        productId: typeof item.productId === "string" ? item.productId : null,
        slug,
        sku,
        purchaseType: typeof item.purchaseType === "string" ? item.purchaseType : null,
        isMembership: Boolean(item.isMembership),
        requestedFormulation: typeof item.requestedFormulation === "string"
          ? item.requestedFormulation
          : null,
        requestedDose: dose.value,
        unitAmountCents: typeof item.unitAmountCents === "number" ? item.unitAmountCents : null,
        variantId: typeof item.variantId === "string" ? item.variantId : null,
      });
      if (!auth.ok) {
        return json({ error: auth.error }, 400);
      }
      if (!auth.skipped) {
        const isSubscription = item.purchaseType === "auto_refill" || item.subscription === true;
        item.unitAmountCents = isSubscription
          ? Math.round(auth.mapping.retailPriceCents * 0.85)
          : auth.mapping.retailPriceCents;
        item.sku = auth.mapping.mbmSku;
        item.variantId = auth.mapping.websiteVariantId;
        item.variantLabel = formatOneTimeProviderSnapshot(
          auth.mapping,
          LAUNCH_READY_KASHU_MAP[auth.mapping.mbmSku]?.tagada_price_id ?? null,
        );
      }
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    if (!supabaseUrl || !serviceKey) {
      return json({ error: "Order service is not configured." }, 500);
    }

    const customerUserId = await resolveCustomerUserId(
      req,
      body.customerUserId,
      supabaseUrl,
      anonKey || serviceKey,
    );

    const prescriptionLines = toPrescriptionLines(rawItems);
    const hasProviderGuidedPrescription = prescriptionLines.length > 0;
    const authGate = guestPrescriptionRequiresAuth({
      customerUserId,
      hasProviderGuidedPrescription,
    });
    if (!authGate.ok) {
      return json({ error: authGate.error }, 401);
    }

    const history = customerUserId
      ? await fetchApprovedTherapyHistory(supabaseUrl, serviceKey, customerUserId)
      : [];

    const discountCentsIn = Number(body.discountCents) || 0;
    const shippingCentsIn = Number(body.shippingCents) || 0;
    const shippingMethodIn =
      typeof body.shippingMethod === "string" ? body.shippingMethod : null;
    const promoCodeIn =
      typeof body.promoCode === "string" ? body.promoCode : null;

    const built = buildAuthoritativeOrderLines({
      customerUserId,
      items: rawItems,
      approvedTherapyHistory: history,
      discountCents: discountCentsIn,
      shippingCents: shippingCentsIn,
      shippingMethod: shippingMethodIn,
      promoCode: promoCodeIn,
      customerEmail,
    });

    if (built.shippingError) {
      return json({ error: built.shippingError, blocker: "SHIPPING_AUTHORITY" }, 400);
    }

    // Production Rx fail-closed: REQUIRE_GEN_MAPPING_FOR_RX (or production runtime default).
    // Staging remains open unless the flag is explicitly true. Accessories skip this gate.
    const genGate = await assertRxGenMappingsReady({
      supabaseUrl,
      serviceKey,
      items: built.items,
    });
    if (!genGate.ok) {
      return json(
        {
          error: genGate.message,
          blocker: "GEN_MAPPING_REQUIRED",
          blockedSku: genGate.blockedSku,
        },
        409,
      );
    }

    // Server-authoritative totals (provider visit / HRT lab reinjected; OGTBM server-priced).
    const subtotalCents = built.subtotalCents;
    const discountCents = built.discountCents;
    const shippingCents = built.shippingCents;
    const taxCents = built.taxCents;
    const totalCents = built.totalCents;
    const promoCode = built.promoCode;
    const items = built.items;
    const subscriptionLine = items.find((item) =>
      item.purchaseType === "auto_refill" || item.subscription === true
    );
    const shippingMethod =
      built.shippingMethod ||
      (typeof body.shippingMethod === "string" ? body.shippingMethod : "two_day");

    const paymentAccessToken = createPaymentAccessToken();
    const now = new Date().toISOString();

    const requiresProviderReview =
      Boolean(body.requiresProviderReview) ||
      built.requirement.requirement !== "NONE" ||
      hasProviderGuidedPrescription;

    // Workflow status is finalized after verified payment; NONE can be set now.
    const providerWorkflowStatus =
      built.requirement.requirement === "NONE" ? "NOT_REQUIRED" : null;

    const MAX_ORDER_INSERT_ATTEMPTS = 5;
    let publicOrderNumber = "";
    let orderId = "";
    let usedLegacyInsert = false;

    for (let attempt = 1; attempt <= MAX_ORDER_INSERT_ATTEMPTS; attempt++) {
      const allocated = await allocatePublicOrderNumber(supabaseUrl, serviceKey);
      if (!allocated.ok) {
        return json({ error: CHECKOUT_ORDER_CREATE_FAILED_MESSAGE }, 500);
      }
      publicOrderNumber = allocated.publicOrderNumber;
      const paymentReference = publicOrderNumber;
      const invoiceNumber = `INV-${publicOrderNumber}`;

      const orderInsert: Record<string, unknown> = {
        customer_user_id: customerUserId,
        customer_email: customerEmail,
        customer_name: customerName,
        public_order_number: publicOrderNumber,
        stripe_checkout_session_id: null,
        stripe_payment_intent_id: null,
        stripe_customer_id: null,
        order_status: "order_received",
        payment_status: "awaiting_payment",
        payment_method: paymentMethod,
        payment_processor: paymentMethod === "kashu_card" ? "kashu_tagada" : "manual",
        payment_reference: paymentReference,
        invoice_number: invoiceNumber,
        payment_access_token: paymentAccessToken,
        subtotal_cents: subtotalCents,
        discount_cents: discountCents,
        promo_code: promoCode,
        shipping_cents: shippingCents,
        tax_cents: taxCents,
        total_cents: totalCents,
        shipping_method: shippingMethod,
        free_shipping_eligible: shippingMethod === "free_over_500" || shippingCents === 0,
        currency: "usd",
        requires_provider_review: requiresProviderReview,
        provider_requirement: built.requirement.requirement,
        provider_requirement_reason: built.requirement.reason,
        previous_variant_sku: built.requirement.previousVariantSku,
        requested_variant_sku: built.requirement.requestedVariantSku,
        required_provider_product_id: built.requirement.requiredProviderProductId,
        provider_workflow_status: providerWorkflowStatus,
        subscription_sku: subscriptionLine?.sku || null,
        subscription_base_amount_cents: subscriptionLine?.unitAmountCents || null,
        subscription_shipping_cents: subscriptionLine ? shippingCents : null,
        subscription_monthly_amount_cents: subscriptionLine
          ? Number(subscriptionLine.unitAmountCents) + shippingCents
          : null,
      };

      const orderRes = await fetch(`${supabaseUrl}/rest/v1/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(orderInsert),
      });

      if (orderRes.ok) {
        const orderRows = await orderRes.json();
        const order = Array.isArray(orderRows) ? orderRows[0] : orderRows;
        orderId = order.id as string;
        break;
      }

      const t = await orderRes.text();
      console.error("create-invoice-order insert failed", {
        attempt,
        publicOrderNumber,
        detail: t.slice(0, 500),
      });

      // Unique collision: allocate a fresh number and retry (sequence drift / race).
      if (isUniquePublicOrderNumberConflict(t) && attempt < MAX_ORDER_INSERT_ATTEMPTS) {
        continue;
      }

      // Fallback if provider columns not migrated yet — retry without them (same number).
      if (t.includes("provider_requirement") || t.includes("schema cache")) {
        const legacyInsert = { ...orderInsert };
        delete legacyInsert.provider_requirement;
        delete legacyInsert.provider_requirement_reason;
        delete legacyInsert.previous_variant_sku;
        delete legacyInsert.requested_variant_sku;
        delete legacyInsert.required_provider_product_id;
        delete legacyInsert.provider_workflow_status;
        delete legacyInsert.provider_visit_order_item_id;
        const retry = await fetch(`${supabaseUrl}/rest/v1/orders`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${serviceKey}`,
            apikey: serviceKey,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify(legacyInsert),
        });
        if (retry.ok) {
          const legacyRows = await retry.json();
          const legacyOrder = Array.isArray(legacyRows) ? legacyRows[0] : legacyRows;
          orderId = legacyOrder.id as string;
          usedLegacyInsert = true;
          break;
        }
        const retryText = await retry.text();
        console.error("create-invoice-order legacy insert failed", retryText.slice(0, 500));
        if (isUniquePublicOrderNumberConflict(retryText) && attempt < MAX_ORDER_INSERT_ATTEMPTS) {
          continue;
        }
        return json({ error: CHECKOUT_ORDER_CREATE_FAILED_MESSAGE }, 500);
      }

      if (
        t.includes("payment_status") || t.includes("payment_method")
      ) {
        return json({
          error:
            "Orders database needs the manual-payment migration before invoice checkout can run.",
        }, 500);
      }

      return json({ error: CHECKOUT_ORDER_CREATE_FAILED_MESSAGE }, 500);
    }

    if (!orderId || !publicOrderNumber) {
      return json({ error: CHECKOUT_ORDER_CREATE_FAILED_MESSAGE }, 500);
    }

    const paymentReference = publicOrderNumber;
    const invoiceNumber = `INV-${publicOrderNumber}`;

    return await finalizeOrderResponse({
      supabaseUrl,
      serviceKey,
      orderId,
      publicOrderNumber,
      paymentAccessToken,
      paymentReference,
      invoiceNumber,
      now,
      customerName,
      customerEmail,
      paymentMethod: paymentMethod as PaymentMethod,
      shippingMethod,
      items,
      subtotalCents,
      discountCents,
      shippingCents,
      taxCents,
      totalCents,
      visitSku: items.find((i) => i.requiredProviderVisit)?.sku ?? null,
      patchProviderVisitItemId: !usedLegacyInsert,
    });
  } catch (err) {
    console.error("create-invoice-order unexpected", err);
    return json({
      error: sanitizeCheckoutOrderError(err instanceof Error ? err.message : ""),
    }, 500);
  }
});

async function finalizeOrderResponse(input: {
  supabaseUrl: string;
  serviceKey: string;
  orderId: string;
  publicOrderNumber: string;
  paymentAccessToken: string;
  paymentReference: string;
  invoiceNumber: string;
  now: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: PaymentMethod;
  shippingMethod: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitAmountCents: number;
    variantId?: string;
    variantLabel?: string;
    sku: string;
    fulfillmentSku?: string;
    section?: string;
    requestedFormulation?: string;
    requestedDose?: string;
    requiredProviderVisit?: boolean;
  }>;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  visitSku: string | null;
  patchProviderVisitItemId: boolean;
}) {
  const itemRows = input.items.map((i) => {
    const qty = Math.max(1, Number(i.quantity) || 1);
    const unit = Math.max(0, Number(i.unitAmountCents) || 0);
    const formulation =
      typeof i.requestedFormulation === "string" ? i.requestedFormulation : null;
    const requestedDose = typeof i.requestedDose === "string" ? i.requestedDose : null;
    const snapshot = formatProviderReviewSnapshot({
      fulfillmentLabel: typeof i.variantLabel === "string" ? i.variantLabel : null,
      formulation,
      requestedDose,
    });
    const sku = typeof i.sku === "string" && i.sku.trim() ? i.sku.trim() : null;
    const variantId =
      typeof i.variantId === "string" && i.variantId.trim() ? i.variantId.trim() : null;
    const fulfillmentSku =
      typeof i.fulfillmentSku === "string" && i.fulfillmentSku.trim()
        ? i.fulfillmentSku.trim()
        : null;
    return {
      order_id: input.orderId,
      product_id: i.productId || null,
      product_name_snapshot: String(i.productName || "Item"),
      variant_snapshot: snapshot || null,
      sku,
      variant_id: variantId,
      fulfillment_sku: fulfillmentSku,
      quantity: qty,
      unit_price_cents: unit,
      discount_cents: 0,
      line_total_cents: unit * qty,
    };
  });

  const itemsRes = await fetch(`${input.supabaseUrl}/rest/v1/order_items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.serviceKey}`,
      apikey: input.serviceKey,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(itemRows),
  });
  if (!itemsRes.ok) {
    return json({ error: `Order created but items failed: ${await itemsRes.text()}` }, 500);
  }
  const insertedItems = await itemsRes.json();
  const insertedList = Array.isArray(insertedItems) ? insertedItems : [];

  if (input.patchProviderVisitItemId && input.visitSku) {
    const visitRow = insertedList.find(
      (r: { sku?: string }) => r.sku === input.visitSku,
    ) as { id?: string } | undefined;
    if (visitRow?.id) {
      await fetch(
        `${input.supabaseUrl}/rest/v1/orders?id=eq.${encodeURIComponent(input.orderId)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${input.serviceKey}`,
            apikey: input.serviceKey,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ provider_visit_order_item_id: visitRow.id }),
        },
      );
    }
  }

  await fetch(`${input.supabaseUrl}/rest/v1/order_fulfillment`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.serviceKey}`,
      apikey: input.serviceKey,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      order_id: input.orderId,
      fulfillment_status: "order_received",
    }),
  });

  await fetch(`${input.supabaseUrl}/rest/v1/order_status_events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.serviceKey}`,
      apikey: input.serviceKey,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      order_id: input.orderId,
      status: "order_received",
      customer_visible: true,
      note: "Order submitted — awaiting payment",
      created_by: "system",
    }),
  });

  const invoiceItems = itemRows.map((r) => ({
    productId: r.product_id ?? undefined,
    productName: r.product_name_snapshot,
    variantLabel: r.variant_snapshot,
    quantity: r.quantity,
    unitPriceCents: r.unit_price_cents,
    discountCents: r.discount_cents,
    lineTotalCents: r.line_total_cents,
  }));

  const invoice = {
    invoiceNumber: input.invoiceNumber,
    orderNumber: input.publicOrderNumber,
    paymentReference: input.paymentReference,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    orderDateIso: input.now,
    paymentMethod: input.paymentMethod,
    paymentStatus: "awaiting_payment",
    items: invoiceItems,
    subtotalCents: input.subtotalCents,
    discountCents: input.discountCents,
    shippingCents: input.shippingCents,
    taxCents: input.taxCents,
    totalCents: input.totalCents,
    shippingMethod: input.shippingMethod,
    currency: "usd",
    headline: "Order received — awaiting payment",
    memoInstruction:
      "Please include your order number in the memo/reference field. Processing begins after payment has been received and verified.",
  };

  const bankInstructions = bankInstructionsFromEnv(input.paymentMethod);
  const paymentPath =
    `/order/payment/${encodeURIComponent(input.publicOrderNumber)}?token=${encodeURIComponent(input.paymentAccessToken)}`;

  return json({
    orderId: input.orderId,
    publicOrderNumber: input.publicOrderNumber,
    paymentAccessToken: input.paymentAccessToken,
    paymentPath,
    invoice,
    bankInstructions,
  });
}
