import { Link } from '@/router';

export function SubscriptionsPage() {
  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <section className="py-16 md:py-24">
        <div className="container-lux max-w-4xl text-center">
          <p className="eyebrow mb-3">Prescription renewals</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink-900 mb-5">Recurring enrollment is coming soon</h1>
          <p className="mx-auto max-w-2xl text-lg text-ink-600 leading-relaxed">
            We are completing recurring payment and renewal verification with GEN Health. New prescription purchases currently use GEN Health’s secure payment, intake, assessment, and provider-review flow.
          </p>
          <Link to="/shop-all" className="btn-primary mt-10 inline-flex">Shop available prescriptions</Link>
          <p className="mt-5 text-xs text-ink-500">
            Payment does not guarantee a prescription. Medication fulfillment remains subject to clinical review and approval.
          </p>
        </div>
      </section>
    </div>
  );
}
