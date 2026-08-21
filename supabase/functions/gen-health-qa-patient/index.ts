import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Staging-only QA helper for Phase 12E.1 GEN patient connectivity.
 * Uses server-side GEN_HEALTH_API_KEY. Does not log PHI.
 * DO NOT deploy to production.
 */

import {
  createOrReuseGenPatient,
  formatGenLog,
  resolveGenHealthConfig,
} from "../_shared/genHealth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const config = resolveGenHealthConfig();
  if (!config.enabled) {
    return json({
      ok: false,
      code: "GEN_DISABLED",
      message: "GEN_HEALTH_ENABLED!=true",
    }, 503);
  }
  if (!config.apiKey) {
    return json({ ok: false, code: "GEN_MISSING_API_KEY" }, 500);
  }

  let body: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: {
      street1?: string;
      street2?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
    persistProfileUserId?: string | null;
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const email = body.email?.trim();
  if (!email || !email.includes("@")) {
    return json({ error: "qa_email_required" }, 400);
  }
  // Reject obvious real-customer patterns? Keep simple: require qa+ prefix or .test. domain marker
  const qaOk =
    email.toLowerCase().startsWith("qa+") ||
    email.toLowerCase().includes("+qa") ||
    email.toLowerCase().endsWith(".invalid") ||
    email.toLowerCase().includes("@example.");
  if (!qaOk) {
    return json({
      error: "qa_email_required",
      message: "Use a QA-marked email (qa+... or example.com)",
    }, 400);
  }

  const firstName = body.firstName?.trim() || "QA";
  const lastName = body.lastName?.trim() || "GenHealth";
  const phone = body.phone?.trim();
  const dateOfBirth = body.dateOfBirth?.trim();
  const address = body.address;

  if (!phone || !dateOfBirth || !address?.street1 || !address?.city || !address?.state || !address?.zip) {
    return json({
      error: "qa_demographics_required",
      message:
        "GEN requires phone, dateOfBirth, and address.street1/city/state/zip (synthetic QA values only).",
    }, 400);
  }

  console.log(formatGenLog({
    operation: "qa_create_patient",
    // email/DOB/address intentionally omitted from logs
  }));

  const res = await createOrReuseGenPatient(
    {
      email,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      address: {
        street1: address.street1,
        street2: address.street2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country || "US",
      },
    },
    { config },
  );

  if (!res.ok) {
    let genSafeError: string | null = null;
    let genHttp: number | null = res.error.httpStatus ?? null;
    try {
      const url = `${config.baseUrl}/v2/client/patients`;
      const probe = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-API-Key": config.apiKey!,
        },
        body: JSON.stringify({
          patient: {
            email,
            firstName,
            lastName,
            phone,
            dateOfBirth,
            address: {
              street1: address.street1,
              city: address.city,
              state: address.state,
              zip: address.zip,
              country: address.country || "US",
            },
          },
        }),
      });
      genHttp = probe.status;
      const text = await probe.text();
      try {
        const parsed = JSON.parse(text) as Record<string, unknown>;
        const parts: string[] = [];
        for (const k of ["message", "error", "code", "error_code", "detail", "title", "type"]) {
          const v = parsed[k];
          if (typeof v === "string" && v.trim()) parts.push(`${k}=${v.trim().slice(0, 240)}`);
        }
        const nested = parsed.error;
        if (nested && typeof nested === "object") {
          const nm = (nested as Record<string, unknown>).message;
          if (typeof nm === "string" && nm.trim()) parts.push(`error.message=${nm.trim().slice(0, 240)}`);
        }
        genSafeError = parts.length ? parts.join("; ") : `unparsed_error_len=${text.length}`;
      } catch {
        genSafeError = `non_json_error_len=${text.length}`;
      }
    } catch {
      genSafeError = "probe_network_error";
    }

    console.log(formatGenLog({
      operation: "qa_create_patient",
      correlationId: res.correlationId,
      safeErrorCode: res.error.code,
      httpStatus: genHttp ?? undefined,
    }));
    return json({
      ok: false,
      code: res.error.code,
      message: res.error.message,
      retryable: res.error.retryable ?? false,
      correlationId: res.correlationId,
      httpStatus: genHttp,
      genSafeError,
    }, 502);
  }

  let persisted = false;
  const profileUserId = body.persistProfileUserId?.trim() || null;
  if (profileUserId) {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (supabaseUrl && serviceKey) {
      const { createClient } = await import("npm:@supabase/supabase-js@2");
      const sb = createClient(supabaseUrl, serviceKey);
      const { error } = await sb.from("customer_profiles").upsert({
        user_id: profileUserId,
        email,
        first_name: firstName,
        last_name: lastName,
        gen_patient_id: res.data.id,
      }, { onConflict: "user_id" });
      persisted = !error;
      if (error) {
        console.log(formatGenLog({
          operation: "qa_persist_patient",
          safeErrorCode: "PROFILE_PERSIST_ERROR",
        }));
      }
    }
  }

  return json({
    ok: true,
    genPatientId: res.data.id,
    correlationId: res.correlationId,
    httpStatus: res.httpStatus,
    persistedToProfile: persisted,
    // echo only safe QA markers, not full PHI beyond opaque id
    qaEmailDomain: email.split("@")[1] || null,
  });
});
