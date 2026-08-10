/** Client-side subscription + cancellation-request store (pre-portal). */

export type CancellationStatus =
  | 'submitted'
  | 'under_review'
  | 'processed'
  | 'cancellation_confirmed';

export type ManagedSubscriptionKind = 'active_wellness_membership' | 'auto_refill';

export interface ManagedSubscription {
  id: string;
  kind: ManagedSubscriptionKind;
  name: string;
  productId: string;
  slug: string;
  unitPrice: number;
  standardPrice: number;
  discountPercent: number;
  billingFrequency: 'monthly';
  renewalDate: string;
  status: 'active' | 'cancel_pending' | 'canceled';
  createdAt: string;
}

export interface CancellationRequest {
  id: string;
  subscriptionId: string;
  subscriptionName: string;
  kind: ManagedSubscriptionKind;
  submittedAt: string;
  status: CancellationStatus;
  customerEmail: string;
  customerNote?: string;
  adminNote?: string;
}

const SUBS_KEY = 'mybaremethod_managed_subscriptions';
const CANCEL_KEY = 'mybaremethod_cancellation_requests';

function read<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, rows: T[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(rows));
}

export function listManagedSubscriptions(): ManagedSubscription[] {
  return read<ManagedSubscription>(SUBS_KEY);
}

export function upsertManagedSubscription(sub: ManagedSubscription): void {
  const rows = listManagedSubscriptions();
  const idx = rows.findIndex(r => r.id === sub.id);
  if (idx >= 0) rows[idx] = sub;
  else rows.push(sub);
  write(SUBS_KEY, rows);
}

export function listCancellationRequests(): CancellationRequest[] {
  return read<CancellationRequest>(CANCEL_KEY);
}

export function submitCancellationRequest(input: {
  subscription: ManagedSubscription;
  customerEmail: string;
  customerNote?: string;
}): CancellationRequest {
  const req: CancellationRequest = {
    id: `cancel_${Date.now().toString(36)}`,
    subscriptionId: input.subscription.id,
    subscriptionName: input.subscription.name,
    kind: input.subscription.kind,
    submittedAt: new Date().toISOString(),
    status: 'submitted',
    customerEmail: input.customerEmail,
    customerNote: input.customerNote,
  };
  const requests = listCancellationRequests();
  requests.unshift(req);
  write(CANCEL_KEY, requests);

  const subs = listManagedSubscriptions().map(s =>
    s.id === input.subscription.id ? { ...s, status: 'cancel_pending' as const } : s,
  );
  write(SUBS_KEY, subs);
  return req;
}

export function updateCancellationStatus(
  id: string,
  status: CancellationStatus,
  adminNote?: string,
): CancellationRequest | null {
  const requests = listCancellationRequests();
  const idx = requests.findIndex(r => r.id === id);
  if (idx < 0) return null;
  requests[idx] = { ...requests[idx], status, adminNote: adminNote ?? requests[idx].adminNote };
  write(CANCEL_KEY, requests);

  if (status === 'cancellation_confirmed' || status === 'processed') {
    const subs = listManagedSubscriptions().map(s =>
      s.id === requests[idx].subscriptionId ? { ...s, status: 'canceled' as const } : s,
    );
    write(SUBS_KEY, subs);
  }
  return requests[idx];
}

export const CANCELLATION_POLICY_COPY =
  'Auto-Refill subscriptions renew automatically each month. To help us process your request before your next renewal, please submit cancellation requests at least 7 calendar days before your renewal date. Once processed, you will receive confirmation.';
