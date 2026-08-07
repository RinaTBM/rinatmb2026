import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  displayFirstName,
  ensureCustomerProfile,
  updateCustomerProfile,
  type CustomerProfile,
} from '@/lib/auth/customerProfile';
import { sanitizeProfileUpdate } from '@/lib/auth/customerAccess';
import { navigate } from '@/router';

interface CustomerAuthContextValue {
  configured: boolean;
  loading: boolean;
  authenticated: boolean;
  user: User | null;
  session: Session | null;
  profile: CustomerProfile | null;
  firstName: string;
  error: string | null;
  refresh: () => Promise<void>;
  signUpWithEmail: (input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<{ error: string | null; needsEmailConfirmation?: boolean }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  saveProfile: (patch: {
    first_name?: string;
    last_name?: string;
    phone?: string | null;
  }) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (u: User) => {
    if (!supabase) return;
    const { profile: p, error: err } = await ensureCustomerProfile(supabase, u);
    if (err) setError(err);
    setProfile(p);
  }, []);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      setUser(null);
      setSession(null);
      setProfile(null);
      return;
    }
    setLoading(true);
    const { data: { session: s } } = await supabase.auth.getSession();
    setSession(s);
    setUser(s?.user ?? null);
    if (s?.user) await loadProfile(s.user);
    else setProfile(null);
    setLoading(false);
  }, [loadProfile]);

  useEffect(() => {
    refresh();
    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        void loadProfile(s.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh, loadProfile]);

  const signUpWithEmail: CustomerAuthContextValue['signUpWithEmail'] = useCallback(
    async input => {
      if (!supabase) return { error: 'Account services are not configured yet.' };
      const { data, error: err } = await supabase.auth.signUp({
        email: input.email.trim(),
        password: input.password,
        options: {
          data: {
            first_name: input.firstName.trim(),
            last_name: input.lastName.trim(),
            phone: input.phone?.trim() || null,
          },
          emailRedirectTo: `${window.location.origin}/account/auth/callback`,
        },
      });
      if (err) return { error: err.message };
      if (data.user && data.session) {
        await ensureCustomerProfile(supabase, data.user, {
          first_name: input.firstName,
          last_name: input.lastName,
          phone: input.phone?.trim() || null,
        });
        await refresh();
        return { error: null };
      }
      // Email confirmation required
      return { error: null, needsEmailConfirmation: true };
    },
    [refresh],
  );

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: 'Account services are not configured yet.' };
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (err) return { error: err.message };
    await refresh();
    return { error: null };
  }, [refresh]);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return { error: 'Account services are not configured yet.' };
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/account/auth/callback`,
        queryParams: { prompt: 'select_account' },
      },
    });
    if (err) return { error: err.message };
    return { error: null };
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    if (!supabase) return { error: 'Account services are not configured yet.' };
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });
    if (err) return { error: err.message };
    return { error: null };
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    if (!supabase) return { error: 'Account services are not configured yet.' };
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) return { error: err.message };
    return { error: null };
  }, []);

  const saveProfile: CustomerAuthContextValue['saveProfile'] = useCallback(
    async patch => {
      if (!supabase || !user) return { error: 'You must be signed in.' };
      const clean = sanitizeProfileUpdate(patch);
      const { profile: p, error: err } = await updateCustomerProfile(supabase, user.id, clean);
      if (err) return { error: err };
      setProfile(p);
      return { error: null };
    },
    [user],
  );

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    navigate('/account/login');
  }, []);

  const value = useMemo<CustomerAuthContextValue>(
    () => ({
      configured: isSupabaseConfigured,
      loading,
      authenticated: Boolean(user && session),
      user,
      session,
      profile,
      firstName: displayFirstName(profile, user),
      error,
      refresh,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      requestPasswordReset,
      updatePassword,
      saveProfile,
      signOut,
    }),
    [
      loading,
      user,
      session,
      profile,
      error,
      refresh,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      requestPasswordReset,
      updatePassword,
      saveProfile,
      signOut,
    ],
  );

  return (
    <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  return ctx;
}
