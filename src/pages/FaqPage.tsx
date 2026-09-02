import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  COMPOUNDED_FDA_FAQ,
  PHARMACY_503A_FAQ,
  PHARMACY_FULFILLMENT_SHORT,
} from '@/data/pharmacyFulfillmentCopy';

const faqCategories = [
  {
    title: 'Orders & Shipping',
    faqs: [
      {
        q: 'How does checkout work?',
        a: 'Add items to your cart, choose shipping when required, review totals, and complete payment by Credit / Debit Card through our secure hosted checkout. Processing and fulfillment begin only after payment is received and any required provider review/approval is complete.',
      },
      {
        q: 'How much is shipping?',
        a: 'Accessories are the only storefront items with a separate $10 shipping charge. Lab orders, provider-directed products, and prescription workflows may use GEN Health or the applicable dispensing partner path, with any required charges shown before payment whenever reasonably possible.',
      },
      {
        q: 'When will my order ship?',
        a: 'Processing and shipping timelines begin only after payment has been received and any required provider review/approval has been completed. Most eligible orders are then processed within 1–3 business days. Carrier transit begins after processing. You will receive tracking by email once your order ships. Payment does not guarantee treatment approval or shipment.',
      },
      {
        q: 'Which items have a separate shipping charge?',
        a: 'Labs and provider-directed prescription workflows do not add storefront accessory shipping. Accessories remain the storefront items with a separate $10 shipping charge.',
      },
      { q: 'Can I track my order?', a: 'Yes. Track from the Track Order page using your order number, or from your account dashboard.' },
      { q: 'Do you ship internationally?', a: 'We currently serve clients and ship eligible items within the United States only.' },
      {
        q: 'What happens if my shipment is lost, damaged, or delayed?',
        a: 'Eligible damaged, lost, or delayed-and-unusable shipments may be replaced at no additional product cost after verification. Notify us within 48 hours of delivery (or the expected delivery date for lost shipments) with photos when applicable. Refunds are not automatic for carrier delays or incorrect addresses — see our Refund & Replacement Policy and Shipping Policy.',
      },
    ],
  },
  {
    title: 'Payment & Taxes',
    faqs: [
      {
        q: 'How do I pay?',
        a: 'Public checkout uses Credit / Debit Card through our secure hosted card checkout. Your order remains unpaid until card payment is confirmed.',
      },
      {
        q: 'Are taxes added at checkout?',
        a: 'Applicable taxes are included in displayed prices where required. Tax is not added as a separate line at checkout.',
      },
      {
        q: 'Does paying guarantee treatment approval?',
        a: 'No. Purchase and payment do not guarantee a prescription or treatment approval. A licensed provider may require additional information, consultation, labs, or other steps. Fulfillment and shipping occur only when applicable requirements are satisfied.',
      },
      {
        q: 'Which promo codes can I use?',
        a: 'When available, FIRSTTIME provides $25 off eligible purchases and OGTBM provides $50 off each eligible unit. Internal testing codes may be restricted to authorized checkout emails. Enter one code at checkout. Promotions do not change recurring subscription renewal amounts.',
      },
      {
        q: 'What do promo codes exclude?',
        a: 'Promo codes apply to one-time purchases, including eligible accessory purchases, but exclude membership enrollment, Subscribe & Save, Auto-Refill, and recurring renewals. Shipping is not discounted. FIRSTTIME requires a signed-in customer account.',
      },
      {
        q: 'Can I pay over time with Cherry?',
        a: 'Financing options may be available through Cherry. Approval and terms are determined by Cherry. Cherry is a financing discovery option and does not replace My Bare Method checkout or recurring subscription card billing.',
      },
    ],
  },
  {
    title: 'Purchasing Options',
    faqs: [
      {
        q: 'What purchasing options do you offer?',
        a: 'Eligible prescription products may offer One-Time Purchase or Subscribe & Save when available. Subscribe & Save pricing and renewal details are shown before enrollment. Provider care, labs, services, and accessories remain one-time purchases unless a specific offer says otherwise.',
      },
      {
        q: 'Can I change my medication myself?',
        a: 'Medication strength and provider-directed treatment cannot be modified by customers in the account portal. Submit a request or contact support if you need help with an existing order or subscription.',
      },
    ],
  },
  {
    title: 'Telemedicine & Provider Care',
    faqs: [
      { q: 'What is Provider Care?', a: 'Provider Care includes services such as the Initial Provider Visit, Follow-Up Visit, and Laboratory Review. These involve scheduling and/or medical intake and review by a licensed provider when applicable. Provider Care is not included in prescription subscription savings.' },
      { q: 'What happens after I order a Provider Care product?', a: 'After payment has been received, you will receive an email link to complete a secure medical intake when required. A licensed provider reviews your case within 2 business days.' },
      { q: 'What if I am not approved?', a: 'If a licensed provider determines that a requested treatment is not medically appropriate, the provider-directed product will not be fulfilled. If payment for that product has already been received, eligible charges will be refunded in accordance with our refund policy.' },
      { q: 'Do you offer telemedicine appointments?', a: 'Yes. We offer telemedicine services via Zoom. Appointments are booked directly on our website by the patient.' },
      { q: 'Which states or jurisdictions do you serve?', a: 'Availability may vary by service, product, provider licensure, pharmacy, laboratory, and state requirements. We confirm eligibility during the applicable intake and review process.' },
      { q: 'Who is your Medical Director?', a: 'Our Medical Director is Dr. Jerry J. Cattelane Jr., D.O. He provides clinical leadership and supports the provider-directed wellness programs available through My Bare Method. Treatment decisions are made by the licensed provider responsible for your care.' },
      { q: 'Which pharmacy fulfills your prescriptions?', a: `${PHARMACY_FULFILLMENT_SHORT} The final pharmacy is selected based on the medication, state, prescription, and clinical workflow. Fulfillment begins only after payment has been received and a licensed provider determines treatment is appropriate and any required review is complete.` },
      { q: PHARMACY_503A_FAQ.q, a: PHARMACY_503A_FAQ.a },
      { q: COMPOUNDED_FDA_FAQ.q, a: COMPOUNDED_FDA_FAQ.a },
    ],
  },
  {
    title: 'Hormone Therapy Labs',
    faqs: [
      {
        q: 'Do I need labs for hormone therapy?',
        a: 'Some Women’s Hormone Therapy orders require labs before a licensed provider can make treatment decisions. When labs are needed, checkout prompts you to choose from the current lab options.',
      },
      {
        q: 'How do I choose hormone therapy labs?',
        a: 'You can choose from available in-home or walk-in lab options when more than one option is available. Lab ordering, intake, payment, and results are handled through the secure clinical lab workflow so your provider can review the correct information.',
      },
      {
        q: 'Is lab shipping included?',
        a: 'Lab pricing is shown before you order. Accessories are the only storefront items with a separate $10 shipping charge.',
      },
      {
        q: 'Will hormone therapy labs be chosen automatically?',
        a: 'No. If labs are required, checkout prompts you to choose the current lab option that fits your care path before you continue.',
      },
    ],
  },
  {
    title: 'Returns & Refunds',
    faqs: [
      { q: 'What is your return policy?', a: 'All sales are final once payment has been received and an order has been processed or shipped. Because many products are compounded, customized, or temperature-sensitive, returns are not accepted.' },
      { q: 'Are medications/products refundable?', a: 'Physical, compounded, customized, and temperature-sensitive products are generally final sale after processing or shipment. Eligible damaged, lost, or delayed-and-unusable shipments may be replaced after verification — see our Refund & Replacement Policy.' },
      { q: 'Are provider visits refundable?', a: 'Provider visits and lab services are not automatically refundable once the applicable service has begun. If a licensed provider does not approve a requested therapy after intake and payment was received for that product, eligible paid amounts for the unapproved product may be refunded per our Refund Policy.' },
      { q: 'What if my order arrives damaged or is lost in transit?', a: 'If your order arrives damaged, is lost in transit, or arrives after the expected delivery window due to carrier delays that make the product unusable, we will replace the item at no additional cost after verification. Notify us within 48 hours of delivery (or the expected delivery date for lost shipments) and provide photos when applicable.' },
      { q: 'How do I request a replacement?', a: 'Contact our support team with your order number within 48 hours. Include photos of the damaged item or packaging if applicable. We verify the claim and ship your replacement at no additional cost.' },
      { q: 'Where can I read the full policy?', a: 'The full Refund & Replacement Policy is available on our Refund Policy page. It is also displayed during checkout.' },
    ],
  },
  {
    title: 'Subscribe & Save',
    faqs: [
      {
        q: 'How does Subscribe & Save work?',
        a: 'Choose Subscribe & Save on an eligible prescription product to receive the recurring price shown before enrollment. Provider review is required; payment does not guarantee a prescription.',
      },
      {
        q: 'What receives the 15% savings?',
        a: 'The savings apply only to the eligible subscription item shown at enrollment. Provider visits, labs, services, and accessories are not discounted unless a specific offer says otherwise.',
      },
      {
        q: 'What is charged when I subscribe?',
        a: 'The monthly total is shown before enrollment. Any required provider service is charged separately and does not renew unless a specific offer says otherwise.',
      },
      {
        q: 'What is charged every month?',
        a: 'Each monthly renewal is the recurring amount shown for that subscription. Provider visits, labs, services, and accessories do not recur unless a specific offer says otherwise.',
      },
      {
        q: 'Does accessory shipping renew?',
        a: 'No. Accessories are one-time storefront purchases. Any subscription fulfillment details are shown in the applicable enrollment flow.',
      },
      {
        q: 'Can accessories be subscribed to?',
        a: 'No. Accessories, provider visits, labs, and other services remain one-time purchases.',
      },
      {
        q: 'Is there a minimum subscription term?',
        a: 'Subscribe & Save renews monthly until canceled under the Subscription & Cancellation Terms.',
      },
      {
        q: 'When can I cancel?',
        a: 'You may request cancellation under the Subscription & Cancellation Terms. Recurring billing continues until a valid cancellation becomes effective.',
      },
      {
        q: 'What happens if a subscription payment fails?',
        a: 'A failed payment may place the subscription in past-due or payment-issue status. Fulfillment may pause or delay until payment is resolved.',
      },
      {
        q: 'Will I keep the same price if the retail price changes?',
        a: 'The subscription discount remains 15%, but the underlying prescription price may change with notice as permitted by the Subscription & Cancellation Terms.',
      },
      {
        q: 'Can I buy without subscribing?',
        a: 'Yes. Eligible products can be purchased as a One-Time Purchase at standard pricing without a recurring commitment.',
      },
      {
        q: 'How do I cancel a subscription?',
        a: 'Submit a cancellation request from your account or contact us using the channels listed in the Subscription & Cancellation Terms.',
      },
    ],
  },
  {
    title: 'Products & Quality',
    faqs: [
      { q: 'Are your products third-party tested?', a: 'Testing and quality documentation vary by product, pharmacy, and fulfillment partner. Prescription therapies are dispensed only after provider review and through eligible U.S. pharmacy partners when approved.' },
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
          <p className="text-ink-500 mb-8">Find answers to common questions about orders, payment, purchasing options, Provider Care, subscriptions, and more.</p>
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
