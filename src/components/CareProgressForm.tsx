import { useRef, useState, type FormEvent } from 'react';
import { saveCareProgress } from '@/lib/commerce/careProgress';

/** Shared consent capture. Saving preferences never enrolls a messaging workflow. */
export function CareProgressForm({ checkoutUrl, onContinue }: { checkoutUrl: string; onContinue: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailConsent, setEmailConsent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef('');
  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (!emailConsent && !smsConsent) { onContinue(); return; }
    requestId.current ||= crypto.randomUUID();
    setBusy(true); setError('');
    try {
      await saveCareProgress({ name, email, phone, emailConsent, smsConsent }, checkoutUrl, requestId.current);
      setSaved(true); setName(''); setEmail(''); setPhone('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Please retry or continue without reminders.');
    } finally { setBusy(false); }
  };
  if (saved) return <div role="status" className="mt-4 space-y-4">
    <p>Your reminder preferences are saved. Reminder delivery is not active yet. Saving does not place an order or complete payment or intake.</p>
    <button type="button" className="btn-primary w-full" onClick={onContinue}>Continue</button>
  </div>;
  return <form onSubmit={save} className="mt-4 space-y-4">
    <p className="text-sm leading-relaxed">Choose whether My Bare Method may remind you about an unfinished cart, checkout, payment, or intake. You can continue shopping without signing up.</p>
    <p className="rounded-lg bg-white p-3 text-sm">Reminder delivery is not active yet. You can save your preferences now; no reminders will be sent until the service is available.</p>
    <label className="block text-sm">Name<input autoComplete="name" required={emailConsent || smsConsent} maxLength={160} value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-lg border p-3" /></label>
    <label className="block text-sm">Email<input type="email" autoComplete="email" required={emailConsent || smsConsent} maxLength={254} value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded-lg border p-3" /></label>
    <label className="block text-sm">Mobile phone (optional)<input type="tel" autoComplete="tel" required={smsConsent} placeholder="+16125550123" maxLength={16} value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full rounded-lg border p-3" /><span className="mt-1 block text-xs">Include your country code, for example +1 for the United States.</span></label>
    <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={emailConsent} onChange={e => setEmailConsent(e.target.checked)} className="mt-1" />I agree to receive email reminders from My Bare Method about my unfinished cart, checkout, payment, or intake.</label>
    <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={smsConsent} onChange={e => setSmsConsent(e.target.checked)} className="mt-1" />I agree to receive automated text reminders from My Bare Method at the number provided about my unfinished cart, checkout, payment, or intake. Up to 3 texts per unfinished step, at 15 minutes, 1 hour, and 24 hours. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase.</label>
    <p className="text-xs leading-relaxed text-ink-600">Both choices are optional and start unchecked. Contact details and consent are used to manage your reminder preferences and delivery. Mobile information and SMS consent are not sold or shared with third parties or affiliates for their marketing. <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a> · <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms &amp; Conditions</a>. For help, email <a href="mailto:info@thebaremethodmn.com" className="underline">info@thebaremethodmn.com</a>.</p>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <button disabled={busy} className="btn-primary w-full" type="submit">{busy ? 'Saving…' : emailConsent || smsConsent ? 'Save my preferences' : 'Continue without reminders'}</button>
    {(emailConsent || smsConsent) && <button disabled={busy} type="button" className="w-full text-sm underline" onClick={onContinue}>Continue without reminders</button>}
  </form>;
}
