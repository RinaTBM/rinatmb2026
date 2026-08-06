import { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';

const faqCategories = [
  {
    title: 'Orders & Shipping',
    faqs: [
      { q: 'How long does shipping take?', a: 'Eligible orders are processed and shipped within 3–5 business days. You will receive a tracking number by email once your order ships.' },
      { q: 'Do you offer free shipping?', a: 'Yes, orders over $75 ship free. Standard shipping is $6.95 for orders under $75.' },
      { q: 'Can I track my order?', a: 'Absolutely. You can track your order anytime from the Track Order page using your order number, or from your account dashboard.' },
      { q: 'Do you ship internationally?', a: 'We currently ship within the United States. International shipping is coming soon.' },
    ],
  },
  {
    title: 'Subscriptions',
    faqs: [
      { q: 'How does the subscription work?', a: 'Many products offer a subscription option at 20% off the regular price. Your product ships automatically each month or per your selected schedule.' },
      { q: 'Can I pause or cancel my subscription?', a: 'Yes. You can pause, skip, or cancel your subscription anytime from your account dashboard — no fees, no hassle.' },
      { q: 'Can I change my subscription products?', a: 'Yes, you can swap products, adjust quantities, or change your delivery frequency from your account at any time.' },
    ],
  },
  {
    title: 'Telemedicine & Provider Care',
    faqs: [
      { q: 'What is Provider Care?', a: 'Provider Care products involve a medical intake and review by a licensed provider. Fulfillment occurs only after provider approval.' },
      { q: 'What happens after I order a Provider Care product?', a: 'You will receive an email link to complete a secure medical intake. A licensed provider reviews your case within 2 business days.' },
      { q: 'What if I am not approved?', a: 'If the provider determines the product is not appropriate for you, you will receive a full refund within 3 business days.' },
      { q: 'Do you offer telemedicine appointments?', a: 'Yes. We offer telemedicine services via Zoom. Appointments are booked directly on our website by the patient.' },
      { q: 'Which states or jurisdictions do you serve?', a: 'Our Medical Director is licensed in all 50 US states, so our telemedicine services are available nationwide.' },
      { q: 'Who is your Medical Director?', a: 'Our Medical Director is Dr. Jerry Cattelane, DO. Dr. Cattelane oversees all provider care and telemedicine services.' },
      { q: 'Which pharmacy fulfills your prescriptions?', a: 'All prescriptions are fulfilled through ScriptfulRx, our partnered pharmacy.' },
    ],
  },
  {
    title: 'Research Products',
    faqs: [
      { q: 'What does "research use only" mean?', a: 'Research products are sold for laboratory and research purposes only. They are not dietary supplements and are not intended for human consumption.' },
      { q: 'Are research products FDA-approved?', a: 'No. Research products are not evaluated by the FDA and are not intended to diagnose, treat, cure, or prevent any disease.' },
      { q: 'How are research products shipped?', a: 'Research products are shipped with appropriate handling, including cold-chain options for temperature-sensitive reagents.' },
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
      { q: 'What is a membership?', a: 'A membership provides locked-in monthly pricing for your therapy, monthly fulfillment, provider review and support when required, and member-only discounts on accessories and wellness products.' },
      { q: 'What is the minimum commitment?', a: 'Both GLP-1 and GLP-1/GIP memberships require a 3-month minimum commitment. After that, you can cancel anytime.' },
      { q: 'Will my membership price increase?', a: 'No. Your price is locked in for as long as your membership remains active. No price increases while you are a member.' },
      { q: 'Can I buy products without a membership?', a: 'Yes. Eligible products can be purchased individually as a one-time purchase without a membership commitment.' },
    ],
  },
  {
    title: 'Products & Quality',
    faqs: [
      { q: 'Are your products third-party tested?', a: 'Yes. All applicable products undergo third-party testing for purity, potency, and contaminants.' },
      { q: 'Are your products vegan?', a: 'Product formulations vary. Check each product page for specific ingredient information.' },
      { q: 'Can I take these with my medications?', a: 'Always consult your healthcare provider before adding any supplement, especially if you take prescription medications.' },
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
    <div className="bg-cream-50 pt-16 md:pt-20">
      {/* Header */}
      <section className="py-16 md:py-24 text-center">
        <div className="container-lux max-w-2xl">
          <p className="eyebrow mb-3">We are here to help</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink-900 mb-4">Frequently Asked</h1>
          <p className="text-ink-500 mb-8">Find answers to common questions about orders, subscriptions, Provider Care, and more.</p>
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

      {/* FAQ sections */}
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
                            <span className="font-medium text-ink-900">{faq.q}</span>
                            <span className={`ml-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cream-200 text-ink-600 transition-transform ${open ? 'rotate-45' : ''}`}>
                              <span className="text-lg leading-none">+</span>
                            </span>
                          </button>
                          {open && (
                            <div className="px-5 pb-5 text-sm text-ink-500 leading-relaxed animate-fade-in">
                              {faq.a}
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

      {/* Still have questions */}
      <section className="py-16 bg-cream-100/50">
        <div className="container-lux text-center">
          <h2 className="font-serif text-3xl text-ink-900 mb-3">Still have questions?</h2>
          <p className="text-ink-500 mb-6">Our team is here to help you on your wellness journey.</p>
          <a href="#" className="btn-primary">Contact Support <ArrowRight size={16} /></a>
        </div>
      </section>
    </div>
  );
}
