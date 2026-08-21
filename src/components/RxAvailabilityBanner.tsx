import type { CustomerFacingRxStatus } from '@/lib/commerce/rxCatalogReadiness';

type Props = {
  status: CustomerFacingRxStatus;
  message?: string | null;
};

/**
 * Consistent Rx availability messaging for PDPs (Phase 12I.3).
 * Customer-safe copy only — never expose GEN / API Orders internals.
 */
export function RxAvailabilityBanner({ status, message }: Props) {
  if (status === 'AVAILABLE') return null;

  const title =
    status === 'COMING_SOON' ? 'Coming soon' : 'Temporarily unavailable';
  const body =
    message ||
    (status === 'COMING_SOON'
      ? 'This medication is not available for purchase yet. Check back soon.'
      : 'Temporarily unavailable. Check back soon.');

  return (
    <div
      className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"
      role="status"
      data-testid="rx-availability-banner"
      data-rx-status={status}
    >
      <p className="font-medium text-amber-900">{title}</p>
      <p className="mt-1 text-amber-800 leading-relaxed">{body}</p>
    </div>
  );
}
