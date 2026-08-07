import { FormEvent, useEffect, useState } from 'react';
import { Link, navigate } from '@/router';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useAccountNoIndex } from './useAccountNoIndex';
import { AccountAuthLayout } from './AccountAuthLayout';

const inputClass =
  'w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:border-gold-400';

export function AccountResetPasswordPage() {
  useAccountNoIndex('Reset Password | My Bare Method');
  const { authenticated, loading, configured, updatePassword } = useCustomerAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading) setReady(true);
  }, [loading]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!authenticated) {
      setError('Open the password reset link from your email to continue.');
      return;
    }

    setBusy(true);
    const result = await updatePassword(password);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setInfo('Your password has been updated.');
    window.setTimeout(() => navigate('/account'), 800);
  }

  return (
    <AccountAuthLayout
      title="Reset Password"
      subtitle="Choose a new password for your My Bare Method account."
      footer={
        <Link
          to="/account/login"
          className="text-ink-900 font-medium underline underline-offset-2 hover:text-gold-600"
        >
          Back to Sign In
        </Link>
      }
    >
      {!configured ? (
        <p className="text-sm text-ink-500" role="alert">
          Password reset is unavailable until Supabase is configured for this environment.
        </p>
      ) : !ready ? (
        <p className="text-sm text-ink-500 text-center" role="status">
          Preparing secure reset…
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {!authenticated ? (
            <p className="text-sm text-ink-500 bg-cream-50 border border-cream-300 rounded-xl px-3 py-2" role="status">
              Open the reset link from your email to verify your identity, then set a new password here.
            </p>
          ) : null}

          <div>
            <label htmlFor="account-reset-password" className="block text-sm font-medium text-ink-800 mb-1.5">
              New Password
            </label>
            <input
              id="account-reset-password"
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
            <label htmlFor="account-reset-confirm" className="block text-sm font-medium text-ink-800 mb-1.5">
              Confirm New Password
            </label>
            <input
              id="account-reset-confirm"
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
            disabled={busy || !authenticated}
            className="w-full rounded-full bg-ink-900 text-cream-50 py-3 text-sm font-medium tracking-wide hover:bg-ink-800 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
          >
            {busy ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      )}
    </AccountAuthLayout>
  );
}
