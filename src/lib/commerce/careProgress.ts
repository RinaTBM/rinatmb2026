export type CareProgressInput = {
  name: string; email: string; phone: string;
  emailConsent: boolean; smsConsent: boolean;
};

export function validateCareProgress(input: CareProgressInput): string | null {
  if (!input.name.trim() || input.name.trim().length > 160) return 'Enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) || input.email.length > 254) return 'Enter a valid email address.';
  if (!input.emailConsent && !input.smsConsent) return 'Choose email or text reminders, or continue without reminders.';
  if (input.smsConsent && !/^\+[1-9]\d{7,14}$/.test(input.phone.trim())) return 'Enter your phone with country code, such as +16125550123.';
  return null;
}

export async function saveCareProgress(input: CareProgressInput, checkoutUrl: string, requestId: string): Promise<void> {
  const error = validateCareProgress(input);
  if (error) throw new Error(error);
  const base = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!base || !key) throw new Error('We could not save your progress. Please retry or continue without reminders.');
  // The server must persist consent and the attempt before returning accepted:true.
  // Never enroll a reminder based on a button click or an optimistic browser flag.
  const res = await fetch(`${base}/functions/v1/care-progress-save`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` },
    body: JSON.stringify({ name: input.name.trim(), email: input.email.trim(),
      phone: input.smsConsent ? input.phone.trim() : null,
      emailConsent: input.emailConsent, smsConsent: input.smsConsent,
      consentVersion: 'care-progress-2026-09-22', checkoutUrl, requestId }),
    signal: AbortSignal.timeout(12000),
  });
  const result = await res.json().catch(() => null);
  if (!res.ok || result?.accepted !== true) throw new Error('We could not save your progress. Please retry or continue without reminders.');
}
