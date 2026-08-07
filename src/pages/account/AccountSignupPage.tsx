import { FormEvent, useState } from 'react';
import { Link, navigate } from '@/router';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useAccountNoIndex } from './useAccountNoIndex';
import { AccountAuthLayout } from './AccountAuthLayout';

const inputClass =
  'w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-ink-900 placeholder:text-ink-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:border-gold-400';

export function AccountSignupPage() {
  useAccountNoIndex('Create Account | My Bare Method');
  const { authenticated, loading, configured, signUpWithEmail, signInWithGoogle } = useCustomerAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && authenticated) {
    navigate('/account');
    return null;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setBusy(true);
    const result = await signUpWithEmail({
      email,
      password,
      firstName,
      lastName,
      phone: phone.trim() || undefined,
    });
    setBusy(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.needsEmailConfirmation) {
      setInfo('Check your email to confirm your account, then sign in.');
      return;
    }

    navigate('/account');
  }

  async function onGoogle() {
    setError(null);
    setInfo(null);
    setBusy(true);
    const result = await signInWithGoogle();
    setBusy(false);
    if (result.error) setError(result.error);
  }

  return (
    <AccountAuthLayout
      title="Create Your Account"
      subtitle="Manage your account and access available order and membership information."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/account/login"
            className="text-ink-900 font-medium underline underline-offset-2 hover:text-gold-600"
          >
            Sign In
          </Link>
        </>
      }
    >
      {!configured ? (
        <p className="text-sm text-ink-500" role="alert">
          Account creation is unavailable until Supabase is configured for this environment.
        </p>
      ) : (
        <div className="space-y-5">
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="account-signup-first" className="block text-sm font-medium text-ink-800 mb-1.5">
                  First Name
                </label>
                <input
                  id="account-signup-first"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="account-signup-last" className="block text-sm font-medium text-ink-800 mb-1.5">
                  Last Name
                </label>
                <input
                  id="account-signup-last"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="account-signup-email" className="block text-sm font-medium text-ink-800 mb-1.5">
                Email
              </label>
              <input
                id="account-signup-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="account-signup-phone" className="block text-sm font-medium text-ink-800 mb-1.5">
                Phone <span className="text-ink-400 font-normal">(optional)</span>
              </label>
              <input
                id="account-signup-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="account-signup-password" className="block text-sm font-medium text-ink-800 mb-1.5">
                Password
              </label>
              <input
                id="account-signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="account-signup-confirm" className="block text-sm font-medium text-ink-800 mb-1.5">
                Confirm Password
              </label>
              <input
                id="account-signup-confirm"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            {error ? (
              <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2" role="alert">
                {error}
              </p>
            ) : null}
            {info ? (
              <p className="text-sm text-ink-800 bg-cream-50 border border-cream-300 rounded-xl px-3 py-2" role="status">
                {info}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy || loading}
              className="w-full rounded-full bg-ink-900 text-cream-50 py-3 text-sm font-medium tracking-wide hover:bg-ink-800 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
            >
              {busy ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-cream-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs uppercase tracking-wider text-ink-400">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void onGoogle()}
            disabled={busy}
            className="w-full rounded-full border border-cream-300 bg-white py-3 text-sm font-medium text-ink-900 hover:border-gold-300 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
          >
            Continue with Google
          </button>
        </div>
      )}
    </AccountAuthLayout>
  );
}
