import { useEffect, useState, type FormEvent } from 'react';
import { Check, Gift, Lock, Mail, Phone, Sparkles, User, X } from 'lucide-react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { sendHighLevelLead } from '@/lib/highlevelLeadCapture';
import { navigate } from '@/router';

const DISMISS_KEY = 'mbm_welcome_popup_dismissed';
const SIGNED_KEY = 'mbm_welcome_popup_signed_up';
const SHOW_DELAY_MS = 5_000;

type Stage = 'form' | 'success';

export function WelcomePopup() {
  const { authenticated, loading, signUpWithEmail } = useCustomerAuth();
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState<Stage>('form');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading || authenticated) return;
    try {
      if (localStorage.getItem(DISMISS_KEY) || localStorage.getItem(SIGNED_KEY)) return;
    } catch {
      return;
    }
    const timer = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [loading, authenticated]);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {
      /* ignore */
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setBusy(true);

    const result = await signUpWithEmail({
      email: email.trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || undefined,
    });

    if (result.error) {
      setError(result.error);
      setBusy(false);
      return;
    }

    void sendHighLevelLead({
      event: 'new_client_welcome',
      name: `${firstName.trim()} ${lastName.trim()}`.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      subject: 'Welcome popup - $25 off first order',
      message: 'Customer signed up via the first-time visitor welcome popup for $25 off their first order.',
    });

    try {
      localStorage.setItem(SIGNED_KEY, Date.now().toString());
    } catch {
      /* ignore */
    }

    setBusy(false);
    setStage('success');
  };

  const handleShopNow = () => {
    setVisible(false);
    navigate('/shop-all');
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm animate-fade-in" onClick={dismiss} />
      <div className="relative w-full max-w-md animate-scale-in overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500" />

        {/* Close button */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close welcome offer"
          className="absolute right-4 top-5 z-10 rounded-full p-1.5 text-ink-400 transition-colors hover:bg-cream-100 hover:text-ink-700"
        >
          <X size={18} />
        </button>

        {stage === 'form' ? (
          <div className="px-7 pb-7 pt-8">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-gold-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gold-700">
              <Sparkles size={13} />
              First-Time Client Offer
            </div>

            {/* Headline */}
            <h2 className="font-serif text-3xl leading-tight text-ink-900">
              Enjoy <span className="text-gold-600">$25 Off</span><br />Your First Order
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Create your client account to unlock this one-time welcome gift. Your portal gives you access to order
              tracking, prescription management, and exclusive member pricing.
            </p>

            {/* Value props */}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-600">
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-gold-500" /> Instant $25 credit</span>
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-gold-500" /> Secure client portal</span>
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-gold-500" /> Priority support</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-3.5" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    type="text"
                    placeholder="First name"
                    autoComplete="given-name"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-cream-300 bg-cream-50 py-2.5 pl-10 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-300"
                  />
                </div>
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    type="text"
                    placeholder="Last name"
                    autoComplete="family-name"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-cream-300 bg-cream-50 py-2.5 pl-10 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-300"
                  />
                </div>
              </div>

              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-cream-300 bg-cream-50 py-2.5 pl-10 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-300"
                />
              </div>

              <div className="relative">
                <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  autoComplete="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-cream-300 bg-cream-50 py-2.5 pl-10 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-300"
                />
              </div>

              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="password"
                  placeholder="Create password (min 8 characters)"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-cream-300 bg-cream-50 py-2.5 pl-10 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-300"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">{error}</p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-ink-900 py-3.5 text-sm font-medium tracking-wide text-cream-50 transition-all duration-300 hover:bg-ink-800 hover:shadow-lg disabled:opacity-60"
              >
                {busy ? 'Creating your account…' : 'Claim My $25 Credit'}
              </button>
            </form>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-ink-400">
              <Lock size={11} /> Your information is encrypted and never shared.
            </p>
          </div>
        ) : (
          <div className="px-7 pb-8 pt-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold-100">
              <Gift size={30} className="text-gold-600" />
            </div>
            <h2 className="font-serif text-3xl text-ink-900">Welcome to My Bare Method</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Your account is ready and your <span className="font-semibold text-gold-700">$25 welcome credit</span> has
              been applied. Start shopping to use it at checkout.
            </p>
            <button
              type="button"
              onClick={handleShopNow}
              className="btn-gold mt-6 w-full text-sm"
            >
              Shop Now &amp; Use My $25
            </button>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="mt-3 text-xs text-ink-400 underline underline-offset-2 hover:text-ink-700"
            >
              Continue browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
