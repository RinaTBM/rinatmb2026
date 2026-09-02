const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const leadFields = [
  "email",
  "firstName",
  "lastName",
  "phone",
  "subject",
  "message",
  "formType",
  "smsConsent",
  "source",
  "pagePath",
] as const;

type LeadField = (typeof leadFields)[number];

type LeadPayload = Partial<Record<LeadField, unknown>>;

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizeLeadPayload(payload: LeadPayload): Record<string, unknown> {
  const lead: Record<string, unknown> = {};
  for (const field of leadFields) {
    const value = payload[field];
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) lead[field] = trimmed.slice(0, 2000);
    } else if (typeof value === "boolean") {
      lead[field] = value;
    }
  }
  return lead;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const webhookUrl = Deno.env.get("HIGHLEVEL_WEBSITE_LEAD_WEBHOOK_URL")?.trim();
    if (!webhookUrl) {
      console.error("HIGHLEVEL_WEBSITE_LEAD_WEBHOOK_URL is not configured");
      return jsonResponse({ error: "Lead capture is unavailable" }, 503);
    }

    const body: unknown = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonResponse({ error: "Invalid lead payload" }, 400);
    }

    const lead = normalizeLeadPayload(body as LeadPayload);
    if (typeof lead.email !== "string" || !lead.email.includes("@")) {
      return jsonResponse({ error: "A valid email is required" }, 400);
    }

    const upstreamResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...lead,
        source: lead.source ?? "mybaremethod.com",
      }),
    });

    if (!upstreamResponse.ok) {
      console.error("HighLevel website lead webhook failed", upstreamResponse.status);
      return jsonResponse({ error: "Lead capture failed" }, 502);
    }

    return jsonResponse({ accepted: true });
  } catch (error) {
    console.error("HighLevel website lead capture error", error instanceof Error ? error.message : String(error));
    return jsonResponse({ error: "Lead capture failed" }, 500);
  }
});
