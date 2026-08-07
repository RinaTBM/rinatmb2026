import { useState } from 'react';
import { Search } from 'lucide-react';
import { CANCELLATION_POLICY_COPY } from '@/lib/account/subscriptions';

const faqCategories = [
  {
    title: 'Orders & Shipping',
    faqs: [
      { q: 'How long does shipping take?', a: 'Eligible orders are processed and shipped within 3–5 business days. You will receive a tracking number by email once your order ships.' },
      { q: 'Do you offer free shipping?', a: 'Yes, orders over $75 ship free. Standard shipping is $6.95 for orders under $75. Shipping is never discounted by membership or Auto-Refill savings.' },
      { q: 'Can I track my order?', a: 'Absolutely. You can track your order anytime from the Track Order page using your order number, or from your account dashboard.' },
      { q: 'Do you ship internationally?', a: 'We currently ship within the United States. International shipping is coming soon.' },
    ],
  },
  {
    title: 'Purchasing Options',
    faqs: [
      {
        q: 'What purchasing options do you offer?',
        a: 'Eligible wellness products support three options: Active Wellness Membership (best value — members save 15%), Auto-Refill & Save (10% off with monthly deliveries), and One-Time Purchase (standard pricing). Discounts never stack.',
      },
      {
        q: 'How does Auto-Refill & Save work?',
        a: 'Auto-Refill & Save gives 10% off eligible wellness products with convenient monthly deliveries. No membership is required. Provider appointments, accessories, shipping, and taxes are never discounted.',
      },
      {
        q: 'Can I pause or cancel Auto-Refill?',
        a: `${CANCELLATION_POLICY_COPY} Cancellation is a request reviewed by our team — it is not an automatic Stripe billing rule, and submitting a request does not by itself cancel billing until processed.`,
      },
      {
        q: 'Can I change my Auto-Refill products myself?',
        a: 'You can view Auto-Refill subscriptions, renewal dates, and submit cancellation requests from your account. Medication strength and provider-directed treatment cannot be modified by customers in the account portal.',
      },
    ],
  },
  {
    title: 'Telemedicine & Provider Care',
    faqs: [
      { q: 'What is Provider Care?', a: 'Provider Care includes services such as the Initial Provider Visit, Follow-Up Visit, and Laboratory Review. These involve scheduling and/or medical intake and review by a licensed provider when applicable. Provider Care is never discounted by membership or Auto-Refill savings.' },
      { q: 'What happens after I order a Provider Care product?', a: 'You will receive an email link to complete a secure medical intake when required. A licensed provider reviews your case within 2 business days.' },
      { q: 'What if I am not approved?', a: 'If the provider determines the product is not appropriate for you, you will receive a full refund within 3 business days.' },
      { q: 'Do you offer telemedicine appointments?', a: 'Yes. We offer telemedicine services via Zoom. Appointments are booked directly on our website by the patient.' },
      { q: 'Which states or jurisdictions do you serve?', a: 'Our Medical Director is licensed in all 50 US states, so our telemedicine services are available nationwide.' },
      { q: 'Who is your Medical Director?', a: 'Our Medical Director is Dr. Jerry Cattelane, DO. Dr. Cattelane oversees all provider care and telemedicine services.' },
      { q: 'Which pharmacy fulfills your prescriptions?', a: 'All prescriptions are fulfilled through ScriptfulRx, our partnered pharmacy.' },
    ],
  },
  {
    title: 'Returns & Refunds',
    faqs: [
      { q: 'What is your return policy?', a: 'All sales are final. No refunds or exchanges are issued after an order has been processed or shipped. Because many products are compounded, customized, or temperature-sensitive, returns are not accepted.' },
      { q: 'What if my order arrives damaged or is lost in transit?', a: 'If your order arrives damaged, is lost in transit, or arrives after the expected delivery window due to carrier delays that make the product unusable, we will replace the item at no additional cost after verification. You must notify us within 48 hours of delivery (or the expected delivery date for lost shipments) and provide photos of any damaged items or packaging when applicable.' },
      { q: 'How do I request a replacement?', a: 'Contact our support team with your order number within 48 hours. Include photos of the damaged item or packaging if applicable. We verify the claim and ship your replacement at no additional cost.' },
      { q: 'Where can I read the full policy?', a: 'The full Refund & Replacement Policy is available on our Refund Policy page. It is also displayed during checkout and included in your order confirmation email.' },
    ],
  },
  {
    title: 'Memberships',
    faqs: [
      {
        q: 'What is an Active Wellness Membership?',
        a: 'Active Wellness Memberships are Semaglutide Membership ($199/month) and Tirzepatide Membership ($249/month). Members receive locked membership pricing while continuously enrolled, provider-guided care when prescribed, and 15% off eligible wellness products. Members receive our best available pricing. Accessories, Provider Care, shipping, and taxes are not discounted.',
      },
      {
        q: 'What is the minimum commitment?',
        a: 'Both Semaglutide and Tirzepatide memberships require a 3-month minimum commitment. After that, membership continues month to month until a cancellation request is submitted and processed.',
      },
      {
        q: 'Will my membership price increase?',
        a: 'Your monthly membership rate remains locked while your membership stays continuously active and in good standing and your provider-selected treatment remains within the included program.',
      },
      {
        q: 'Can I buy products without a membership?',
        a: 'Yes. Eligible products can be purchased as a One-Time Purchase at standard pricing, or with Auto-Refill & Save at 10% off, without an Active Wellness Membership.',
      },
      {
        q: 'How do I cancel a membership?',
        a: 'Submit a cancellation request from your account, or use the channels listed in Membership & Cancellation Terms. Requests are reviewed and processed by our team. Cancellation is not an automatic self-serve Stripe action from the storefront.',
      },
    ],
  },
  {
    title: 'Products & Quality',
    faqs: [
      { q: 'Are your products third-party tested?', a: 'Yes. All applicable products undergo third-party testing for purity, potency, and contaminants.' },
      { q: 'Are your products vegan?', a: 'Product formulations vary. Check each product page for specific ingredient information.' },
      { q: 'Can I take these with my medications?', a: 'Always consult your healthcare provider before starting or changing any therapy, especially if you take prescription medications.' },
    ],
  },
];

export function FaqPage() {
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = faqCategories
    .map(cat => ({
      ...cat,
      faqs: cat.faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())),
    }))
    .filter(cat => cat.faqs.length > 0);

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <section className="py-16 md:py-24 text-center">
        <div className="container-lux max-w-2xl">
          <p className="eyebrow mb-3">We are here to help</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink-900 mb-4">Frequently Asked</h1>
          <p className="text-ink-500 mb-8">Find answers to common questions about orders, purchasing options, Provider Care, memberships, and more.</p>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-lux pl-11"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-lux max-w-3xl">
          {filtered.length === 0 ? (
            <p className="text-center text-ink-500 py-12">No results found. Try a different search.</p>
          ) : (
            <div className="space-y-10">
              {filtered.map((cat, ci) => (
                <div key={ci}>
                  <h2 className="font-serif text-2xl text-ink-900 mb-4">{cat.title}</h2>
                  <div className="space-y-3">
                    {cat.faqs.map((faq, fi) => {
                      const id = `${ci}-${fi}`;
                      const open = openId === id;
                      return (
                        <div key={id} className="card-lux overflow-hidden">
                          <button
                            onClick={() => setOpenId(open ? null : id)}
                            className="flex w-full items-center justify-between p-5 text-left"
                          >
                            <span className="font-medium text-ink-900 pr-4">{faq.q}</span>
                            <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cream-200 text-ink-600 transition-transform ${open ? 'rotate-45' : ''}`}>
                              <span className="text-lg leading-none">+</span>
                            </span>
                          </button>
                          {open && (
                            <div className="px-5 pb-5">
                              <p className="text-sm text-ink-500 leading-relaxed">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
