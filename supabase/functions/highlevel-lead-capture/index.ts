const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

type LeadEvent = "contact_form" | "newsletter_signup";

type LeadPayload = {
  event?: LeadEvent;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  sourcePage?: string;
  attribution?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    fbclid?: string;
    gclid?: string;
    msclkid?: string;
    landingPage?: string;
    referrer?: string;
    capturedAt?: string;
  };
};

const EVENT_TO_ENV: Record<LeadEvent, string> = {
  contact_form: "HIGHLEVEL_CONTACT_FORM_WEBHOOK_URL",
  newsletter_signup: "HIGHLEVEL_NEWSLETTER_WEBHOOK_URL",
};

function clean(value: unknown, max = 1000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let body: LeadPayload;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const event = body.event;
  if (event !== "contact_form" && event !== "newsletter_signup") {
    return json({ error: "unsupported_event" }, 400);
  }

  const email = clean(body.email, 320).toLowerCase();
  if (!email || !email.includes("@")) {
    return json({ error: "valid_email_required" }, 400);
  }

  const webhookUrl =
    clean(Deno.env.get(EVENT_TO_ENV[event]), 2048) ||
    clean(Deno.env.get("HIGHLEVEL_WEBSITE_LEAD_WEBHOOK_URL"), 2048);
  if (!webhookUrl) {
    return json({ ok: true, skipped: true, reason: "highlevel_webhook_not_configured" });
  }

  const payload = {
    event: "website_lead",
    lead_type: event,
    source: "mybaremethod.com",
    source_page: clean(body.sourcePage, 500),
    utm_source: clean(body.attribution?.utmSource, 300),
    utm_medium: clean(body.attribution?.utmMedium, 300),
    utm_campaign: clean(body.attribution?.utmCampaign, 300),
    utm_content: clean(body.attribution?.utmContent, 300),
    utm_term: clean(body.attribution?.utmTerm, 300),
    fbclid: clean(body.attribution?.fbclid, 500),
    gclid: clean(body.attribution?.gclid, 500),
    msclkid: clean(body.attribution?.msclkid, 500),
    landing_page: clean(body.attribution?.landingPage, 500),
    referrer: clean(body.attribution?.referrer, 500),
    attribution_captured_at: clean(body.attribution?.capturedAt, 80),
    name: clean(body.name, 160),
    email,
    phone: clean(body.phone, 80),
    subject: clean(body.subject, 160),
    message: clean(body.message, 3000),
    submitted_at: new Date().toISOString(),
    tags:
      event === "newsletter_signup"
        ? ["MBM Website", "Newsletter Signup"]
        : ["MBM Website", "Contact Form"],
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return json({ error: "highlevel_webhook_failed" }, 502);
  }

  return json({ ok: true });
});
