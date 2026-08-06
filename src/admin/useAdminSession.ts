import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export interface AdminSessionState {
  configured: boolean;
  loading: boolean;
  authenticated: boolean;
  email: string | null;
  accessToken: string | null;
  isAdmin: boolean;
  error: string | null;
}

/** Reads an OAuth error surfaced by Supabase on the callback URL (query or hash). */
export function readOAuthError(): string | null {
  if (typeof window === 'undefined') return null;
  const q = new URLSearchParams(window.location.search);
  const h = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return q.get('error_description') || q.get('error') || h.get('error_description') || h.get('error') || null;
}

export function useAdminSession() {
  const [state, setState] = useState<AdminSessionState>({
    configured: isSupabaseConfigured,
    loading: isSupabaseConfigured,
    authenticated: false,
    email: null,
    accessToken: null,
    isAdmin: false,
    error: null,
  });

  const refresh = useCallback(async () => {
    if (!supabase) {
      setState(s => ({ ...s, configured: false, loading: false }));
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setState(s => ({ ...s, loading: false, authenticated: false, email: null, accessToken: null, isAdmin: false }));
      return;
    }
    // Authorization is enforced by RLS: this select returns a row only for an ACTIVE admin
    // (is_admin() requires is_active = true). We additionally filter is_active for clarity.
    const { data, error } = await supabase
      .from('admins')
      .select('user_id, is_active')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .maybeSingle();
    setState({
      configured: true,
      loading: false,
      authenticated: true,
      email: session.user.email ?? null,
      accessToken: session.access_token,
      isAdmin: Boolean(data) && !error,
      error: null,
    });
  }, []);

  useEffect(() => {
    refresh();
    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange(() => { refresh(); });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return { error: 'Supabase not configured' };
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/admin/auth/callback` },
    });
    if (error) return { error: error.message };
    return {};
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    await refresh();
  }, [refresh]);

  return { ...state, signInWithGoogle, signOut, refresh };
}
