/**
 * HighLevel (GoHighLevel / LeadConnector) Contacts API integration.
 *
 * Server-side only. All API keys and location settings come from Deno.env
 * (Edge Function secrets) — never from VITE_* or browser code.
 *
 * Data sent to HighLevel is limited to:
 *   email, firstName, phone (when SMS consent exists), event ID,
 *   source: mybaremethod.com, payment/order status, order total.
 *
 * No medical information, product names, prescription details, intake
 * answers, or diagnoses are ever sent.
 *
 * Secrets required:
 *   HIGHLEVEL_API_KEY      — LeadConnector API key (Bearer token)
 *   HIGHLEVEL_LOCATION_ID  — Sub-account location ID
 *
 * Opt-in toggle (safe default OFF):
 *   HIGHLEVEL_ENABLED=true   — enables HighLevel calls
 *   Unset / any other value  — HighLevel calls are skipped (default)
 */

const HIGHLEVEL_API_BASE = "https://services.leadconnectorhq.com";

const TAG_CHECKOUT_STARTED = "mybaremethod-checkout-started";
const TAG_PURCHASE_COMPLETED = "mybaremethod-purchase-completed";
const TAG_CUSTOMER = "mybaremethod-customer";
const SOURCE = "mybaremethod.com";

export interface HighLevelContactInput {
  email: string;
  firstName: string;
  /** E.164 phone (e.g. +1234567890). Only sent when smsConsent is true. */
  phone?: string | null;
  smsConsent?: boolean;
}

export interface HighLevelEventContext {
  /** MBM order/event ID — used for dedup. */
  eventId: string;
  /** Order or payment status string. */
  status: string;
  /** Order total in cents. */
  totalCents: number;
}

function isHighLevelEnabled(): boolean {
  const flag = Deno.env.get("HIGHLEVEL_ENABLED")?.trim().toLowerCase();
  return flag === "true";
}

function getCredentials(): { apiKey: string; locationId: string } | null {
  const apiKey = Deno.env.get("HIGHLEVEL_API_KEY")?.trim();
  const locationId = Deno.env.get("HIGHLEVEL_LOCATION_ID")?.trim();
  if (!apiKey || !locationId) return null;
  return { apiKey, locationId };
}

/**
 * Check whether this MBM event ID has already been processed for HighLevel.
 * Uses the highlevel_event_log table for durable cross-instance dedup.
 */
async function isEventProcessed(
  supabaseUrl: string,
  serviceKey: string,
  eventId: string,
): Promise<boolean> {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/highlevel_event_log?event_id=eq.${encodeURIComponent(eventId)}&select=event_id&limit=1`,
    { headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey } },
  );
  if (!res.ok) return false;
  const rows = await res.json();
  return Array.isArray(rows) && rows.length > 0;
}

/**
 * Record that this MBM event ID has been processed (idempotent insert).
 */
async function markEventProcessed(
  supabaseUrl: string,
  serviceKey: string,
  eventId: string,
  eventType: string,
  contactId: string | null,
): Promise<void> {
  await fetch(`${supabaseUrl}/rest/v1/highlevel_event_log`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates,return=minimal",
    },
    body: JSON.stringify({
      event_id: eventId,
      event_type: eventType,
      contact_id: contactId,
      processed_at: new Date().toISOString(),
    }),
  });
}

/**
 * Upsert a contact in HighLevel. Returns the HighLevel contact ID.
 * Uses the LeadConnector /contacts/upsert endpoint.
 */
async function upsertContact(
  creds: { apiKey: string; locationId: string },
  contact: HighLevelContactInput,
): Promise<string | null> {
  const body: Record<string, unknown> = {
    email: contact.email,
    firstName: contact.firstName,
    source: SOURCE,
    locationId: creds.locationId,
  };
  if (contact.smsConsent && contact.phone) {
    body.phone = contact.phone;
  }

  const res = await fetch(`${HIGHLEVEL_API_BASE}/v1/contacts/upsert`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creds.apiKey}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("HighLevel upsertContact failed", res.status, text.slice(0, 500));
    return null;
  }

  const data = await res.json();
  const contactId =
    (data?.contact?.id as string | undefined) ??
    (data?.id as string | undefined) ??
    null;
  return contactId;
}

/**
 * Add a single tag to a contact.
 * Uses /contacts/:contactId/tags (API version 2023-02-21).
 */
async function addTag(
  creds: { apiKey: string; locationId: string },
  contactId: string,
  tag: string,
): Promise<boolean> {
  const res = await fetch(
    `${HIGHLEVEL_API_BASE}/v1/contacts/${contactId}/tags`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.apiKey}`,
        "Content-Type": "application/json",
        Version: "2023-02-21",
      },
      body: JSON.stringify({ tags: [tag] }),
    },
  );
  if (!res.ok) {
    const text = await res.text();
    console.error("HighLevel addTag failed", tag, res.status, text.slice(0, 500));
    return false;
  }
  return true;
}

/**
 * Remove a single tag from a contact.
 * Uses /contacts/:contactId/tags (DELETE with body, API version 2023-02-21).
 */
async function removeTag(
  creds: { apiKey: string; locationId: string },
  contactId: string,
  tag: string,
): Promise<boolean> {
  const res = await fetch(
    `${HIGHLEVEL_API_BASE}/v1/contacts/${contactId}/tags`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${creds.apiKey}`,
        "Content-Type": "application/json",
        Version: "2023-02-21",
      },
      body: JSON.stringify({ tags: [tag] }),
    },
  );
  if (!res.ok) {
    const text = await res.text();
    console.error("HighLevel removeTag failed", tag, res.status, text.slice(0, 500));
    return false;
  }
  return true;
}

/**
 * checkout_started event:
 * 1. Upsert the consented contact.
 * 2. Add tag: mybaremethod-checkout-started.
 * Dedup via MBM order/event ID.
 */
export async function fireCheckoutStarted(input: {
  supabaseUrl: string;
  serviceKey: string;
  contact: HighLevelContactInput;
  event: HighLevelEventContext;
}): Promise<void> {
  if (!isHighLevelEnabled()) return;
  const creds = getCredentials();
  if (!creds) {
    console.log("HighLevel not configured — skipping checkout_started");
    return;
  }

  if (await isEventProcessed(input.supabaseUrl, input.serviceKey, input.event.eventId)) {
    console.log("HighLevel checkout_started already processed for", input.event.eventId);
    return;
  }

  const contactId = await upsertContact(creds, input.contact);
  if (!contactId) return;

  await addTag(creds, contactId, TAG_CHECKOUT_STARTED);
  await markEventProcessed(
    input.supabaseUrl,
    input.serviceKey,
    input.event.eventId,
    "checkout_started",
    contactId,
  );
  console.log("HighLevel checkout_started fired for", input.event.eventId);
}

/**
 * purchase_completed event:
 * 1. Upsert the consented contact.
 * 2. Remove tag: mybaremethod-checkout-started.
 * 3. Add tags: mybaremethod-purchase-completed + mybaremethod-customer.
 * Dedup via MBM order/event ID.
 */
export async function firePurchaseCompleted(input: {
  supabaseUrl: string;
  serviceKey: string;
  contact: HighLevelContactInput;
  event: HighLevelEventContext;
}): Promise<void> {
  if (!isHighLevelEnabled()) return;
  const creds = getCredentials();
  if (!creds) {
    console.log("HighLevel not configured — skipping purchase_completed");
    return;
  }

  if (await isEventProcessed(input.supabaseUrl, input.serviceKey, input.event.eventId)) {
    console.log("HighLevel purchase_completed already processed for", input.event.eventId);
    return;
  }

  const contactId = await upsertContact(creds, input.contact);
  if (!contactId) return;

  await removeTag(creds, contactId, TAG_CHECKOUT_STARTED);
  await addTag(creds, contactId, TAG_PURCHASE_COMPLETED);
  await addTag(creds, contactId, TAG_CUSTOMER);
  await markEventProcessed(
    input.supabaseUrl,
    input.serviceKey,
    input.event.eventId,
    "purchase_completed",
    contactId,
  );
  console.log("HighLevel purchase_completed fired for", input.event.eventId);
}
