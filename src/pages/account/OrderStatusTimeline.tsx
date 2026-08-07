import {
  labelOrderStatus,
  timelineForOrder,
  timelineStepIndex,
  isTerminalStatus,
  isOrderStatus,
} from '@/lib/orders/orderStatus';

type OrderStatusTimelineProps = {
  currentStatus: string;
  requiresProviderReview?: boolean;
};

export function OrderStatusTimeline({
  currentStatus,
  requiresProviderReview = false,
}: OrderStatusTimelineProps) {
  const status = isOrderStatus(currentStatus) ? currentStatus : 'order_received';
  const timeline = timelineForOrder(requiresProviderReview);
  const currentIndex = timelineStepIndex(timeline, status);
  const terminal = isTerminalStatus(status);

  return (
    <div aria-label="Order status timeline">
      {terminal ? (
        <p className="text-sm text-ink-700 mb-4" role="status">
          Current status: <span className="font-medium">{labelOrderStatus(status)}</span>
        </p>
      ) : null}

      <ol className="space-y-0">
        {timeline.map((step, index) => {
          const complete = currentIndex >= 0 && index <= currentIndex;
          const current = index === currentIndex;
          return (
            <li key={step} className="relative flex gap-4 pb-6 last:pb-0">
              {index < timeline.length - 1 ? (
                <span
                  className={`absolute left-[9px] top-5 h-[calc(100%-8px)] w-px ${
                    complete ? 'bg-gold-400' : 'bg-cream-300'
                  }`}
                  aria-hidden
                />
              ) : null}
              <span
                className={`relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  current
                    ? 'border-gold-500 bg-gold-400'
                    : complete
                      ? 'border-gold-400 bg-gold-100'
                      : 'border-cream-300 bg-white'
                }`}
                aria-hidden
              >
                {complete ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-900" />
                ) : null}
              </span>
              <div>
                <p
                  className={`text-sm ${current ? 'font-semibold text-ink-900' : complete ? 'text-ink-800' : 'text-ink-400'}`}
                >
                  {labelOrderStatus(step)}
                  {current ? (
                    <span className="sr-only"> (current stage)</span>
                  ) : null}
                </p>
                {current ? (
                  <p className="text-xs text-gold-700 mt-0.5" aria-hidden>
                    Current
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
