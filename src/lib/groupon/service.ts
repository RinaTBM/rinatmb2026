import { supabase } from '@/lib/supabaseClient';
export { GROUPON_PACKAGES, GROUPON_STATUSES, GROUPON_CARE_DISCLOSURE, validateGrouponSubmission, canChangeGrouponStatus } from '../../../supabase/functions/_shared/groupon';
import type { GrouponStatus } from '../../../supabase/functions/_shared/groupon';
export type { GrouponStatus };
export type GrouponRedemption = {
  id: string; groupon_package_id: string; groupon_package_name: string;
  masked_code: string; status: GrouponStatus; submitted_at: string;
  verified_at: string | null; redeemed_at: string | null;
  order_id: string | null; customer_id: string; source: 'groupon';
  customer_name?: string; customer_email?: string; redemption_code?: string;
  internal_notes?: string; version?: number;
  order?: { public_order_number: string; provider_workflow_status: string | null } | null;
};
export async function grouponRequest<T>(body: Record<string, unknown>): Promise<T> {
  if (!supabase) throw new Error('Voucher service is unavailable. Please contact support.');
  const { data, error } = await supabase.functions.invoke('groupon-redemptions', { body });
  if (error) {
    // Only our endpoint's bounded, safe messages; never raw transport/database errors.
    let message = 'We could not save or load your voucher. Please try again or contact support.';
    try {
      const payload = await error.context?.json();
      if (payload?.safe === true && typeof payload.error === 'string') message = payload.error;
    } catch { /* Keep the safe generic error. */ }
    throw new Error(message);
  }
  return data as T;
}
/** Manual review records only; does not verify against or redeem with Groupon. */
export function verifyGrouponVoucher(input: { id: string; status: GrouponStatus; notes: string; version: number; confirmRedeemed: boolean; orderId: string | null }) {
  return grouponRequest<{ redemption: GrouponRedemption }>({ action: 'update', ...input });
}
