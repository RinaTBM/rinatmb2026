import { useEffect } from 'react';
import { navigate } from '@/router';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { isCustomerPublicAuthPath } from '@/lib/auth/customerAccess';
import { useAccountNoIndex } from './useAccountNoIndex';

type AccountGateProps = {
  children: React.ReactNode;
  /** When true, authenticated users are redirected away from public auth pages. */
  publicOnly?: boolean;
};

/**
 * Client-side account gate. RLS still enforces data access server-side.
 * Anonymous users cannot remain on protected /account routes.
 */
export function AccountGate({ children, publicOnly = false }: AccountGateProps) {
  useAccountNoIndex();
  const { loading, authenticated } = useCustomerAuth();
  const path = typeof window !== 'undefined' ? window.location.pathname : '/account';

  useEffect(() => {
    if (loading) return;
    if (publicOnly) {
      if (authenticated && isCustomerPublicAuthPath(path) && path !== '/account/reset-password') {
        navigate('/account');
      }
      return;
    }
    if (!authenticated) {
      navigate('/account/login');
    }
  }, [loading, authenticated, publicOnly, path]);

  if (loading) {
    return (
      <div className="min-h-[50vh] bg-cream-50 flex items-center justify-center px-4 pt-28">
        <p className="text-sm text-ink-500" role="status">
          Checking your account…
        </p>
      </div>
    );
  }

  if (publicOnly) {
    if (authenticated && isCustomerPublicAuthPath(path) && path !== '/account/reset-password') {
      return (
        <div className="min-h-[50vh] bg-cream-50 flex items-center justify-center px-4 pt-28">
          <p className="text-sm text-ink-500" role="status">
            Redirecting to your account…
          </p>
        </div>
      );
    }
    return <>{children}</>;
  }

  if (!authenticated) {
    return (
      <div className="min-h-[50vh] bg-cream-50 flex items-center justify-center px-4 pt-28">
        <p className="text-sm text-ink-500" role="status">
          Redirecting to sign in…
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
