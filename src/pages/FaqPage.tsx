import { useState } from 'react';
import { Search } from 'lucide-react';
import { CANCELLATION_POLICY_COPY } from '@/lib/account/subscriptions';

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
        a: 'For eligible one-time medication/product orders: Two-Day Shipping is $30 and Next-Day Shipping is $50 (fixed fees). Membership shipping is selected at enrollment and recurs monthly (+$30 Two-Day or +$50 Next-Day). Orders of $500 or more in eligible ordinary merchandise may qualify for free shipping; membership value is excluded from that threshold.',
      },
      {
        q: 'When will my order ship?',
        a: 'Processing and shipping timelines begin only after payment has been received and any required provider review/approval has been completed. Most eligible orders are then processed within 1–3 business days. Carrier transit begins after processing. You will receive tracking by email once your order ships. Payment does not guarantee treatment approval or shipment.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Orders of $500 or more in eligible ordinary merchandise are eligible for free shipping. Membership value is excluded from the $500 free-shipping threshold. Standard Shipping is not offered.',
      },
      { q: 'Can I track my order?', a: 'Yes. Track from the Track Order page using your order number, or from your account dashboard.' },
      { q: 'Do you ship internationally?', a: 'We currently ship within the United States. International shipping is coming soon.' },
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
        q: 'Can I use OGTBM?',
        a: 'Yes, when the promotion is available. Enter OGTBM at checkout. It provides $50 off each eligible item (not $50 off the entire order). Quantity applies per eligible item/unit where supported. A promo cannot reduce an item below $0. Promotions are generally non-stackable. OGTBM does not change ongoing recurring membership renewal amounts.',
      },
      {
        q: 'What does OGTBM exclude?',
        a: 'OGTBM excludes accessories; dermatology / prescription skin & hair; Initial Provider Visit; Follow-Up Visit; Lab Review; Lab Kit; other provider services; and shipping.',
      },
      {
        q: 'Can I pay over time with Cherry?',
        a: 'Financing options may be available through Cherry. Approval and terms are determined by Cherry. Cherry is a financing discovery option and does not replace My Bare Method checkout or recurring membership card billing.',
      },
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
        a: 'Auto-Refill saves 10% on eligible products with scheduled monthly deliveries. Each refill period is billed according to your selected payment method. Provider appointments, accessories, shipping, and taxes are never discounted by Auto-Refill.',
      },
      {
        q: 'Can I pause or cancel Auto-Refill?',
        a: `${CANCELLATION_POLICY_COPY} Cancellation is a request reviewed by our team. Submitting a request does not by itself end the next billing period until it is processed.`,
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
      { q: 'What happens after I order a Provider Care product?', a: 'After payment has been received, you will receive an email link to complete a secure medical intake when required. A licensed provider reviews your case within 2 business days.' },
      { q: 'What if I am not approved?', a: 'If a licensed provider determines that a requested treatment is not medically appropriate, the provider-directed product will not be fulfilled. If payment for that product has already been received, eligible charges will be refunded in accordance with our refund policy.' },
      { q: 'Do you offer telemedicine appointments?', a: 'Yes. We offer telemedicine services via Zoom. Appointments are booked directly on our website by the patient.' },
      { q: 'Which states or jurisdictions do you serve?', a: 'Our Medical Director is a licensed physician in all states, so our telemedicine services are available nationwide.' },
      { q: 'Who is your Medical Director?', a: 'Our Medical Director is Dr. Jerry J. Cattelane Jr., D.O. He provides clinical leadership and supports the provider-directed wellness programs available through My Bare Method. Treatment decisions are made by the licensed provider responsible for your care.' },
      { q: 'Which pharmacy fulfills your prescriptions?', a: 'Prescription therapies are fulfilled through U.S. compounding pharmacy partners, including Ageless Pharma Rx (503A) and ProCompounding Pharmacy (503A), as applicable. Provider review and a valid prescription are required. Fulfillment begins only after payment has been received and a licensed provider determines treatment is appropriate and any required review is complete.' },
    ],
  },
  {
    title: 'HRT Lab Package',
    faqs: [
      {
        q: 'Do I need labs for HRT?',
        a: 'For applicable initial Women’s Hormone Therapy orders, a Required HRT Lab Package is added once so a licensed provider can review laboratory results before treatment decisions. Established HRT customers with approved therapy history may not be charged the package again under current history rules.',
      },
      {
        q: 'What does the $260 HRT Lab Package include?',
        a: 'Required HRT Lab Package — $260. Breakdown: Lab Kit — $200 (includes Lab Kit shipping) and Lab Review — $60.',
      },
      {
        q: 'Is Lab Kit shipping included?',
        a: 'Yes. Lab Kit shipping is included in the $200 Lab Kit price. That does not include medication shipping, which remains separate where applicable.',
      },
      {
        q: 'Will I be charged the HRT Lab Package more than once in one order?',
        a: 'No. For an applicable initial HRT order, the required lab package is added once. Multiple HRT products in the same applicable initial order do not multiply the lab-package charge.',
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
    title: 'Memberships',
    faqs: [
      {
        q: 'How does the Semaglutide membership work?',
        a: 'Semaglutide Membership is $149/month base. You select Two-Day (+$30/month) or Next-Day (+$50/month) shipping at enrollment; that shipping recurs with each monthly card charge ($179 or $199/month). A one-time Initial Provider Visit ($75) may apply when required. Provider review is required; payment does not guarantee a prescription.',
      },
      {
        q: 'How does the Tirzepatide membership work?',
        a: 'Tirzepatide Membership is $249/month base. Selected shipping recurs monthly (+$30 Two-Day or +$50 Next-Day), so monthly card charges are $279 or $299. A one-time Initial Provider Visit ($75) may apply when required. The program includes eligible formulations through 15mg. Provider review is required; payment does not guarantee a prescription.',
      },
      {
        q: 'What is charged today when I join a membership?',
        a: 'Due today typically includes membership base + selected shipping + the $75 Initial Provider Visit when required. Examples: Semaglutide + Two-Day $254; Semaglutide + Next-Day $274; Tirzepatide + Two-Day $354; Tirzepatide + Next-Day $374. Those due-today totals are not the ongoing monthly rate.',
      },
      {
        q: 'What is charged every month?',
        a: 'Monthly renewal is membership base plus your selected shipping only: Semaglutide $179 or $199/month; Tirzepatide $279 or $299/month. The Initial Provider Visit does not recur.',
      },
      {
        q: 'Is shipping included in the membership price?',
        a: 'No. Shipping is not included in the base $149 / $249 membership price. You select shipping at enrollment and it is billed with each monthly renewal.',
      },
      {
        q: 'Is membership shipping recurring?',
        a: 'Yes. Selected membership shipping is included in each monthly card charge (+$30 Two-Day or +$50 Next-Day) until a valid cancellation becomes effective.',
      },
      {
        q: 'What is the 3-month minimum?',
        a: 'Both memberships require a 3-month minimum commitment under My Bare Method membership rules. Normal self-service cancellation is not available before that term ends.',
      },
      {
        q: 'When can I cancel?',
        a: 'After the initial three-month commitment, you may cancel according to the current cancellation process (account, email, or cancellation form). Recurring billing continues until a valid cancellation becomes effective.',
      },
      {
        q: 'What happens if a membership payment fails?',
        a: 'A failed payment may place your membership in past-due or payment-issue status. Benefits may pause, fulfillment may delay, and the membership may be canceled after notice if payment is not resolved.',
      },
      {
        q: 'Will I keep my same price if I cancel and rejoin?',
        a: 'No guarantee. Pricing remains locked while continuously active and in good standing. Cancellation or lapse does not guarantee the same prior price on re-enrollment.',
      },
      {
        q: 'Can I buy products without a membership?',
        a: 'Yes. Eligible products can be purchased as a One-Time Purchase at standard pricing, or with Auto-Refill & Save at 10% off, without an Active Wellness Membership.',
      },
      {
        q: 'How do I cancel a membership?',
        a: 'Submit a cancellation request from your account, or use the channels listed in Membership & Cancellation Terms. Requests are reviewed and processed by our team.',
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
          <p className="text-ink-500 mb-8">Find answers to common questions about orders, payment, purchasing options, Provider Care, memberships, and more.</p>
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
