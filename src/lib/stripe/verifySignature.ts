// Stripe webhook signature verification using Web Crypto (works in Node 18+, Deno, browsers).
// Verifies against the RAW request body and the Stripe-Signature header with the
// environment-specific webhook secret, including timestamp tolerance.

function parseSigHeader(header: string): { t: number; v1: string[] } {
  const parts = header.split(',').map(p => p.trim());
  let t = 0;
  const v1: string[] = [];
  for (const p of parts) {
    const [k, v] = p.split('=');
    if (k === 't') t = parseInt(v, 10);
    else if (k === 'v1') v1.push(v);
  }
  return { t, v1 };
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

export async function computeSignature(payload: string, secret: string, timestamp: number): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`${timestamp}.${payload}`));
  return toHex(sig);
}

export interface VerifyOptions {
  toleranceSeconds?: number;
  nowSeconds?: number;
}

export async function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
  opts: VerifyOptions = {},
): Promise<boolean> {
  if (!signatureHeader || !secret) return false;
  const { t, v1 } = parseSigHeader(signatureHeader);
  if (!t || v1.length === 0) return false;

  const tolerance = opts.toleranceSeconds ?? 300;
  const now = opts.nowSeconds ?? Math.floor(Date.now() / 1000);
  if (Math.abs(now - t) > tolerance) return false;

  const expected = await computeSignature(rawBody, secret, t);
  return v1.some(candidate => timingSafeEqual(candidate, expected));
}
