import { Ban, RefreshCw, Clock, Camera, ArrowRight } from 'lucide-react';
import { Link } from '@/router';
import { LegalBulletList } from '@/components/LegalPageLayout';

const detailSections = [
  {
    id: 'final-sales',
    title: 'Final Sales',
    body: (
      <>
        <p>
          All sales are final. No returns or refunds are issued after an order has been processed or shipped. Because
          many of our products are compounded, customized, or temperature-sensitive, they cannot be restocked or
          resold once they leave our facility.
        </p>
      </>
    ),
  },
  {
    id: 'no-returns',
    title: 'No Returns or Refunds',
    body: (
      <>
        <p>Once an order is processed or shipped, it cannot be returned for a refund, exchange, or store credit. This includes:</p>
        <LegalBulletList items={[
          'Compounded medications and therapies.',
          'Customized or personalized products.',
          'Temperature-sensitive items that have left our controlled storage.',
          'Subscription and membership fees after the billing cycle has begun.',
        ]} />
      </>
    ),
  },
  {
    id: 'replacement-eligibility',
    title: 'Replacement Eligibility',
    body: (
      <>
        <p>We will replace an item at no additional cost if your order meets any of the following conditions, subject to verification:</p>
        <LegalBulletList items={[
          'Lost in transit: the carrier confirms the package is lost, or it has not arrived within the expected delivery window plus 5 business days.',
          'Arrives damaged: the product or packaging is visibly damaged upon delivery.',
          'Late and unusable: the order arrives after the expected delivery window and the product is no longer usable due to the delay (e.g., temperature-sensitive compounds exposed to heat).',
        ]} />
      </>
    ),
  },
  {
    id: 'reporting-requirements',
    title: 'Reporting Requirements',
    body: (
      <>
        <p>To request a replacement, you must:</p>
        <LegalBulletList items={[
          'Contact us within 48 hours of delivery (or the expected delivery date for lost shipments).',
          'Provide your order number and a description of the issue.',
          'Include clear photos of the damaged product and packaging for damaged shipments.',
        ]} />
        <p>
          Claims submitted after 48 hours or without required documentation may be denied at our discretion. We aim to
          verify and ship replacements within 2 business days of approval.
        </p>
      </>
    ),
  },
  {
    id: 'provider-care',
    title: 'Provider Care and Therapy Orders',
    body: (
      <>
        <p>
          If a licensed provider does not approve a requested therapy after medical intake, a full refund is issued
          for that product. This is the only circumstance under which a refund is available.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Us',
    body: (
      <>
        <p>To report an issue or request a replacement:</p>
        <p>
          My Bare Method<br />
          Email: info@thebaremethodmn.com<br />
          Phone: (218) 656-7189<br />
          Mailing Address: 15115 Cedar Ave Suite 33, Apple Valley, MN 55124
        </p>
      </>
    ),
  },
];

export function RefundPolicyPage() {
  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      {/* Hero */}
      <section className="py-16 md:py-24 text-center">
        <div className="container-lux max-w-2xl">
          <p className="eyebrow mb-3">Policy</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink-900 mb-4">Refund &amp; Replacement Policy</h1>
          <p className="text-ink-500 mb-3">
            We want you to feel confident about every order. Please review our policy carefully before completing your
            purchase.
          </p>
          <p className="text-xs text-ink-400">Last updated: July 29, 2026</p>
        </div>
      </section>

      {/* All sales final */}
      <section className="pb-12">
        <div className="container-lux max-w-3xl">
          <div className="card-lux p-8 border-l-4 border-gold-400">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold-100">
                <Ban size={22} className="text-gold-600" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-ink-900 mb-3">All Sales Are Final</h2>
                <ul className="space-y-2 text-sm text-ink-600">
                  <li>No refunds or exchanges after an order has been processed or shipped.</li>
                  <li>
                    Because many products are compounded, customized, or temperature-sensitive, returns are not
                    accepted.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Replacement guarantee */}
      <section className="pb-16">
        <div className="container-lux max-w-3xl">
          <div className="card-lux p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                <RefreshCw size={22} className="text-green-600" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-ink-900 mb-2">Replacement Guarantee</h2>
                <p className="text-sm text-ink-500">
                  If your order arrives damaged, is lost in transit, or arrives after the expected delivery window due
                  to carrier delays that make the product unusable, My Bare Method will replace the item at no
                  additional cost after verification.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              <div className="rounded-xl bg-cream-100 p-4 flex items-start gap-3">
                <Clock size={18} className="flex-shrink-0 mt-0.5 text-gold-500" />
                <div>
                  <p className="text-sm font-medium text-ink-900 mb-0.5">48-Hour Notification</p>
                  <p className="text-xs text-ink-500">
                    Customers must notify us within 48 hours of delivery — or the expected delivery date for lost
                    shipments.
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-cream-100 p-4 flex items-start gap-3">
                <Camera size={18} className="flex-shrink-0 mt-0.5 text-gold-500" />
                <div>
                  <p className="text-sm font-medium text-ink-900 mb-0.5">Photo Documentation</p>
                  <p className="text-xs text-ink-500">
                    Provide photos of any damaged items or packaging when applicable to help us verify your claim.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-cream-50 border border-cream-300 p-4">
              <p className="text-xs font-medium text-ink-700 mb-2">How to request a replacement:</p>
              <ol className="space-y-1.5 text-xs text-ink-500 list-decimal list-inside">
                <li>Contact our support team with your order number within 48 hours.</li>
                <li>Include photos of the damaged item or packaging, if applicable.</li>
                <li>We verify the claim and ship your replacement at no additional cost.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Full policy details */}
      <section className="pb-20">
        <div className="container-lux max-w-3xl">
          <div className="space-y-10">
            {detailSections.map((s, i) => (
              <div key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-serif text-2xl text-ink-900 mb-4">{i + 1}. {s.title}</h2>
                <div className="space-y-3 text-sm leading-relaxed text-ink-600">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Acknowledgment note */}
      <section className="pb-20">
        <div className="container-lux max-w-3xl">
          <div className="rounded-xl bg-ink-900 p-6 text-center">
            <p className="text-sm text-cream-100 mb-4">
              By completing checkout, you acknowledge and accept this Refund Policy, our Terms &amp; Conditions, and
              our Privacy Policy.
            </p>
            <Link to="/checkout" className="btn-primary">
              Go to Checkout <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
