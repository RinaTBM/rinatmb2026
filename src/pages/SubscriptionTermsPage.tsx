import { Link } from '@/router';

export function SubscriptionTermsPage() {
  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <section className="py-14 md:py-20">
        <div className="container-lux max-w-3xl">
          <p className="eyebrow mb-3">Recurring billing</p>
          <h1 className="font-serif text-4xl md:text-5xl text-ink-900">Subscription &amp; Cancellation Terms</h1>
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-700">
            <p>When you select Subscribe &amp; Save, you authorize My Bare Method and its payment processor to charge your card monthly until the subscription is canceled.</p>
            <p>Each renewal includes the selected prescription medication at 15% off its one-time price plus the shipping method selected at enrollment: Two-Day Shipping ($30) or Next-Day Shipping ($50).</p>
            <p>Provider visits, laboratory services, other services, and accessories are not part of the subscription and do not renew automatically.</p>
            <p>Payment does not guarantee prescribing or fulfillment. Every prescription remains subject to licensed-provider review and approval. If treatment is changed, paused, or not approved, contact us before the next billing date so the subscription can be reviewed.</p>
            <p>You may request cancellation through your account or by contacting My Bare Method. A cancellation is effective only after confirmation and does not reverse a charge already processed or an order already sent to fulfillment, subject to the applicable Refund Policy.</p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/subscriptions" className="btn-primary">Subscribe &amp; Save</Link>
            <Link to="/refund-policy" className="btn-outline">Refund Policy</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
