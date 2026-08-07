import type { SupabaseClient, User } from '@supabase/supabase-js';

export interface CustomerProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export function displayFirstName(profile: CustomerProfile | null, user: User | null): string {
  if (profile?.first_name?.trim()) return profile.first_name.trim();
  const meta = user?.user_metadata as Record<string, unknown> | undefined;
  if (typeof meta?.first_name === 'string' && meta.first_name.trim()) return meta.first_name.trim();
  if (typeof meta?.full_name === 'string' && meta.full_name.trim()) {
    return meta.full_name.trim().split(/\s+/)[0] ?? 'there';
  }
  if (user?.email) return user.email.split('@')[0] ?? 'there';
  return 'there';
}

/**
 * Ensure a customer_profiles row exists for the authenticated user.
 * Uses user.id as the authoritative key (never email alone).
 */
export async function ensureCustomerProfile(
  client: SupabaseClient,
  user: User,
  seed?: { first_name?: string; last_name?: string; phone?: string | null },
): Promise<{ profile: CustomerProfile | null; error: string | null }> {
  const { data: existing, error: readError } = await client
    .from('customer_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (readError) {
    return { profile: null, error: readError.message };
  }
  if (existing) {
    return { profile: existing as CustomerProfile, error: null };
  }

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const first =
    seed?.first_name?.trim() ||
    (typeof meta.first_name === 'string' ? meta.first_name : '') ||
    (typeof meta.given_name === 'string' ? meta.given_name : '') ||
    '';
  const last =
    seed?.last_name?.trim() ||
    (typeof meta.last_name === 'string' ? meta.last_name : '') ||
    (typeof meta.family_name === 'string' ? meta.family_name : '') ||
    '';

  const row = {
    user_id: user.id,
    first_name: first,
    last_name: last,
    email: user.email ?? '',
    phone: seed?.phone ?? null,
  };

  const { data: inserted, error: insertError } = await client
    .from('customer_profiles')
    .insert(row)
    .select('*')
    .single();

  if (insertError) {
    // Race: another tab inserted — re-read
    const { data: again } = await client
      .from('customer_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    if (again) return { profile: again as CustomerProfile, error: null };
    return { profile: null, error: insertError.message };
  }

  return { profile: inserted as CustomerProfile, error: null };
}

export async function updateCustomerProfile(
  client: SupabaseClient,
  userId: string,
  patch: { first_name?: string; last_name?: string; phone?: string | null },
): Promise<{ profile: CustomerProfile | null; error: string | null }> {
  const { data, error } = await client
    .from('customer_profiles')
    .update(patch)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) return { profile: null, error: error.message };
  return { profile: data as CustomerProfile, error: null };
}
