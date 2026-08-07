import { FormEvent, useEffect, useState } from 'react';
import { Link, navigate } from '@/router';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useAccountNoIndex } from './useAccountNoIndex';
import { AccountAuthLayout } from './AccountAuthLayout';

const inputClass =
  'w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-ink-900 placeholder:text-ink-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:border-gold-400';

export function AccountLoginPage() {
  useAccountNoIndex('Sign In | My Bare Method');
  const {
    authenticated,
    loading,
    configured,
    signInWithEmail,
    signInWithGoogle,
    requestPasswordReset,
  } = useCustomerAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);

  useEffect(() => {
    if (!loading && authenticated) navigate('/account');
  }, [loading, authenticated]);

  if (!loading && authenticated) {
    return null;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    const result = await signInWithEmail(email, password);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate('/account');
  }

  async function onForgotPassword() {
    setError(null);
    setInfo(null);
    if (!email.trim()) {
      setError('Enter your email address first, then click Forgot Password.');
      return;
    }
    setResetBusy(true);
    const result = await requestPasswordReset(email);
    setResetBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setInfo('If an account exists for that email, a password reset link has been sent.');
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
      title="Welcome Back"
      subtitle="Sign in to access your My Bare Method account."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link
            to="/account/signup"
            className="text-ink-900 font-medium underline underline-offset-2 hover:text-gold-600"
          >
            Create Account
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        {!configured ? (
          <p className="text-sm text-ink-700 bg-cream-50 border border-cream-300 rounded-xl px-3 py-2" role="alert">
            Customer sign-in is unavailable until Supabase is configured for this environment.
          </p>
        ) : null}
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="account-login-email" className="block text-sm font-medium text-ink-800 mb-1.5">
                Email
              </label>
              <input
                id="account-login-email"
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
              <label htmlFor="account-login-password" className="block text-sm font-medium text-ink-800 mb-1.5">
                Password
              </label>
              <input
                id="account-login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => void onForgotPassword()}
                disabled={resetBusy || busy}
                className="text-sm text-ink-500 underline underline-offset-2 hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
              >
                {resetBusy ? 'Sending…' : 'Forgot Password'}
              </button>
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
              disabled={busy || loading || !configured}
              className="w-full rounded-full bg-ink-900 text-cream-50 py-3 text-sm font-medium tracking-wide hover:bg-ink-800 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
            >
              {busy ? 'Signing in…' : 'Sign In'}
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
            disabled={busy || !configured}
            className="w-full rounded-full border border-cream-300 bg-white py-3 text-sm font-medium text-ink-900 hover:border-gold-300 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
          >
            Continue with Google
          </button>
        </div>
    </AccountAuthLayout>
  );
}
