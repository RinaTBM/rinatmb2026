import { useEffect, useState } from 'react';
import { Link, navigate } from '@/router';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useAccountNoIndex } from './useAccountNoIndex';
import { AccountAuthLayout } from './AccountAuthLayout';

/**
 * Handles Supabase OAuth / email-confirmation redirects for customers.
 * Admins who land here are routed to /account (not /admin) unless they
 * intentionally open an admin route.
 */
export function AccountAuthCallbackPage() {
  useAccountNoIndex('Signing In | My Bare Method');
  const { authenticated, loading, refresh } = useCustomerAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function settle() {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      const search = typeof window !== 'undefined' ? window.location.search : '';
      const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
      const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
      const authError =
        params.get('error_description') ||
        hashParams.get('error_description') ||
        params.get('error');
      if (authError) {
        if (!cancelled) setError(decodeURIComponent(authError.replace(/\+/g, ' ')));
        return;
      }
      await refresh();
    }

    void settle();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  useEffect(() => {
    if (!loading && authenticated) {
      navigate('/account');
    }
  }, [authenticated, loading]);

  if (error) {
    return (
      <AccountAuthLayout
        title="Sign-in interrupted"
        subtitle="We could not complete authentication for your account."
        footer={
          <Link
            to="/account/login"
            className="text-ink-900 font-medium underline underline-offset-2 hover:text-gold-600"
          >
            Back to Sign In
          </Link>
        }
      >
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2" role="alert">
          {error}
        </p>
      </AccountAuthLayout>
    );
  }

  return (
    <AccountAuthLayout title="Signing you in" subtitle="Please wait while we verify your session.">
      <p className="text-sm text-ink-500 text-center" role="status">
        {loading ? 'Verifying…' : 'Preparing your account…'}
      </p>
    </AccountAuthLayout>
  );
}
