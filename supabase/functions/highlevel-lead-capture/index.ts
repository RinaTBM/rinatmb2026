import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface LeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  source?: string;
  page?: string;
  timestamp?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: LeadPayload = await req.json();
    const webhookUrl = Deno.env.get('HIGHLEVEL_WEBHOOK_URL');

    if (!webhookUrl) {
      return new Response(JSON.stringify({ ok: false, error: 'Webhook not configured' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload: LeadPayload = {
      ...body,
      source: body.source || 'highlevel-lead-capture',
      timestamp: body.timestamp || new Date().toISOString(),
    };

    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!upstream.ok) {
      return new Response(JSON.stringify({ ok: false, error: `Upstream HTTP ${upstream.status}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
