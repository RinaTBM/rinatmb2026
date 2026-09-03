import { LegalPageLayout, LegalBulletList } from '@/components/LegalPageLayout';

export function ShippingPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Shipping Policy"
      intro="My Bare Method coordinates wellness fulfillment after all required steps have been completed. Products requiring provider review cannot be shipped until the applicable intake, eligibility review, prescription, payment, and pharmacy processing are complete."
      lastUpdated="August 19, 2026"
      sections={[
        {
          id: 'before-an-order-ships',
          title: 'Before an Order Ships',
          body: (
            <>
              <p>Depending on the requested product, clients may be required to complete:</p>
              <LegalBulletList items={[
                'The secure medical intake',
                'Provider review',
                'A detailed consultation',
                'Laboratory testing',
                'Prescription approval',
                'Payment through secure hosted card checkout',
              ]} />
              <p>
                Submitting an order and completing payment do not guarantee treatment, medication, or shipment.
                Processing and shipping timelines begin only after payment is received and any required provider
                review/approval or other prerequisites are completed.
              </p>
            </>
          ),
        },
        {
          id: 'processing-time',
          title: 'Processing Time',
          body: (
            <>
              <p>
                Processing and shipping timelines begin only after payment has been received and any required provider
                review/approval has been completed. Once those steps are complete, most eligible orders are processed
                within 24–48 hours.
              </p>
              <p>Processing times may be longer because of:</p>
              <LegalBulletList items={[
                'Provider requests for additional information',
                'Required laboratory testing',
                'Pharmacy processing',
                'Prescription clarification',
                'Product availability',
                'Holidays or severe weather',
                'Carrier delays',
              ]} />
              <p>Processing time is separate from shipping transit time.</p>
            </>
          ),
        },
        {
          id: 'one-time-shipping',
          title: 'One-Time Order Shipping',
          body: (
            <>
              <p>
                Shipping charges are shown before payment whenever they apply:
              </p>
              <LegalBulletList items={[
                'Accessory-only storefront orders use $10 Accessory Shipping',
                'Lab orders are completed through the applicable GEN Health lab path',
                'Prescription and provider-directed order shipping is shown in the applicable checkout or patient-care flow',
              ]} />
              <p>
                Accessories are the only storefront items with a separate $10 shipping charge. Prescription, provider,
                and laboratory workflows may be handled through GEN Health or the dispensing partner, depending on the
                item and required care steps.
              </p>
              <p>
                Carrier transit times begin after payment has been received, any required provider review/approval has
                been completed, and the order has been processed and released for shipment. Shipping typically takes
                24–48 hours after processing. Delivery dates are not guaranteed.
              </p>
              <p>
                Certain medications may require temperature-controlled packaging or specific delivery methods.
                Available fulfillment options may vary by product, pharmacy, destination, and weather conditions.
              </p>
            </>
          ),
        },
        {
          id: 'subscription-shipping',
          title: 'Subscription Shipping',
          body: (
            <>
              <p>
                When you choose Subscribe &amp; Save, recurring billing covers the subscription items shown at enrollment.
                Any applicable fulfillment or shipping details are disclosed in the checkout or patient-care flow before
                payment whenever reasonably possible.
              </p>
              <p>
                Payment may be collected at enrollment and on each renewal, but medication fulfillment and shipment
                still depend on applicable provider review and approval.
              </p>
            </>
          ),
        },
        {
          id: 'hrt-lab-shipping',
          title: 'Hormone Therapy Lab Shipping',
          body: (
            <>
              <p>
                For applicable Women’s Hormone Therapy orders, customers choose from the current lab options when labs
                are required. Lab ordering, intake, payment, and results are handled through the secure clinical lab
                workflow.
              </p>
              <LegalBulletList items={[
                'No separate storefront shipping charge is added for lab orders',
                'Medication shipping follows the applicable pharmacy or GEN Health checkout path',
                'Accessories remain the only storefront items with a separate $10 shipping charge',
              ]} />
              <p>
                Accessories are shipped by My Bare Method and may carry the separate accessory shipping charge shown at
                checkout.
              </p>
            </>
          ),
        },
        {
          id: 'shipping-address',
          title: 'Shipping Address',
          body: (
            <>
              <p>Clients are responsible for entering a complete and accurate shipping address.</p>
              <p>
                Contact us immediately if an address needs to be corrected. We cannot guarantee that an address can be
                changed after an order has entered pharmacy processing or fulfillment.
              </p>
              <p>
                Additional charges may apply when an order must be replaced or reshipped because of an incorrect or
                incomplete address.
              </p>
            </>
          ),
        },
        {
          id: 'tracking',
          title: 'Tracking',
          body: (
            <>
              <p>
                Tracking information will be provided when available. Tracking may be sent directly by the dispensing
                pharmacy or fulfillment partner.
              </p>
              <p>
                The absence of an immediate tracking update does not necessarily mean the order has not entered
                processing.
              </p>
            </>
          ),
        },
        {
          id: 'delayed-missing-damaged',
          title: 'Delayed, Missing, or Damaged Packages',
          body: (
            <>
              <p>Contact us promptly if an order:</p>
              <LegalBulletList items={[
                'Arrives damaged',
                'Contains the wrong item',
                'Is marked delivered but cannot be located',
                'Does not arrive within a reasonable period after shipment',
              ]} />
              <p>Include the order number, delivery address, and clear photographs when reporting damage.</p>
              <p>
                My Bare Method will work with the applicable pharmacy, fulfillment partner, and carrier to investigate.
                Eligible damaged, incorrect, or confirmed lost shipments may be replaced at no additional product cost.
              </p>
              <p>
                Refunds are not automatically issued for carrier delays, unsuccessful delivery attempts, incorrect
                addresses, refusal of delivery, or packages left unattended after confirmed delivery.
              </p>
            </>
          ),
        },
        {
          id: 'temperature-sensitive',
          title: 'Temperature-Sensitive Products',
          body: (
            <>
              <p>Follow all storage directions provided by the dispensing pharmacy.</p>
              <p>
                If a temperature-sensitive package arrives late or feels warm, do not automatically discard it. Contact
                us or the dispensing pharmacy for product-specific guidance.
              </p>
              <p>Do not use a product that appears damaged, contaminated, opened, or otherwise unsafe.</p>
            </>
          ),
        },
        {
          id: 'shipping-restrictions',
          title: 'Shipping Restrictions',
          body: (
            <>
              <p>
                Products are shipped only to locations where the provider, pharmacy, and requested treatment are
                legally available.
              </p>
              <p>
                Availability may vary by state. We may cancel or decline a request when fulfillment is not legally or
                operationally available in the client&apos;s location.
              </p>
            </>
          ),
        },
        {
          id: 'contact',
          title: 'Contact',
          body: (
            <>
              <p>Shipping questions:</p>
              <p>
                Email: info@thebaremethodmn.com<br />
                Phone: (218) 656-7189
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
