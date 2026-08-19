/**
 * One-shot / idempotent repair for public_order_number allocation.
 * Resyncs order_number_seq and hardens generate_public_order_number()
 * to skip candidates that already exist. Does NOT drop the unique constraint.
 *
 * Invoke with service role only. Safe to re-run.
 */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import postgres from "https://deno.land/x/postgresjs@v3.4.5/mod.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const REPAIR_SQL = `
SELECT setval(
  'public.order_number_seq',
  GREATEST(
    COALESCE(
      (
        SELECT MAX(substring(public_order_number from '([0-9]{6})$')::bigint)
        FROM public.orders
        WHERE public_order_number ~ '^MBM-[0-9]{4}-[0-9]{6}$'
      ),
      0
    ),
    COALESCE((SELECT last_value FROM public.order_number_seq), 0)
  ),
  true
);

CREATE OR REPLACE FUNCTION public.generate_public_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n bigint;
  candidate text;
  tries int := 0;
BEGIN
  LOOP
    n := nextval('public.order_number_seq');
    candidate :=
      'MBM-' || to_char(timezone('utc', now()), 'YYYY') || '-' || lpad(n::text, 6, '0');
    EXIT WHEN NOT EXISTS (
      SELECT 1
      FROM public.orders o
      WHERE o.public_order_number = candidate
    );
    tries := tries + 1;
    IF tries > 1000 THEN
      RAISE EXCEPTION 'unable to allocate unique public_order_number after % tries', tries;
    END IF;
  END LOOP;
  RETURN candidate;
END;
$$;

REVOKE ALL ON FUNCTION public.generate_public_order_number() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.generate_public_order_number() TO service_role;
GRANT EXECUTE ON FUNCTION public.generate_public_order_number() TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_public_order_number() TO anon;
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const auth = req.headers.get("Authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  let authorized = Boolean(serviceKey && token && token === serviceKey);
  if (!authorized && token.split(".").length >= 2) {
    try {
      const payloadJson = atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"));
      const payload = JSON.parse(payloadJson);
      authorized = payload?.role === "service_role";
    } catch {
      authorized = false;
    }
  }
  if (!authorized) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const dbUrl = Deno.env.get("SUPABASE_DB_URL");
  if (!dbUrl) {
    return new Response(JSON.stringify({ error: "SUPABASE_DB_URL not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const sql = postgres(dbUrl, { prepare: false, max: 1 });
  try {
    const before = await sql`select last_value, is_called from public.order_number_seq`;
    const maxRow = await sql`
      select max(substring(public_order_number from '([0-9]{6})$')::bigint) as max_suffix
      from public.orders
      where public_order_number ~ '^MBM-[0-9]{4}-[0-9]{6}$'
    `;
    await sql.unsafe(REPAIR_SQL);
    const after = await sql`select last_value, is_called from public.order_number_seq`;
    const sample = await sql`select public.generate_public_order_number() as n`;
    const exists70 = await sql`
      select exists(
        select 1 from public.orders where public_order_number = 'MBM-2026-000070'
      ) as exists
    `;
    return new Response(
      JSON.stringify({
        ok: true,
        before: before[0],
        maxSequentialSuffix: maxRow[0]?.max_suffix ?? null,
        after: after[0],
        sampleAllocated: sample[0]?.n ?? null,
        order000070Exists: Boolean(exists70[0]?.exists),
        uniqueConstraintPreserved: true,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("repair-order-number-allocator failed", err);
    return new Response(
      JSON.stringify({
        ok: false,
        error: err instanceof Error ? err.message : "Repair failed",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } finally {
    await sql.end({ timeout: 5 });
  }
});
