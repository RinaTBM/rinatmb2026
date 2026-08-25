import { LegalPageLayout, LegalBulletList } from '@/components/LegalPageLayout';

export function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Terms"
      title="Terms & Conditions"
      intro="These terms govern your use of our website and products. Please read them carefully before placing an order."
      lastUpdated="August 19, 2026"
      sections={[
        {
          id: 'agreement',
          title: 'Agreement to Terms',
          body: (
            <>
              <p>
                By accessing or using the My Bare Method website (the "Site") and purchasing our products, you agree to
                be bound by these Terms & Conditions and our Privacy Policy and Refund & Replacement Policy. If you do
                not agree, do not use the Site or purchase our products.
              </p>
            </>
          ),
        },
        {
          id: 'website-use',
          title: 'Website Use',
          body: (
            <>
              <p>
                You may use this Site for lawful purposes only. You agree not to misuse, disrupt, or attempt to gain
                unauthorized access to the Site, its systems, or data. We may modify or discontinue any part of the Site
                at any time without notice.
              </p>
            </>
          ),
        },
        {
          id: 'eligibility',
          title: 'Eligibility',
          body: (
            <>
              <p>
                You must be at least 18 years of age and legally able to enter into contracts to use this Site and
                purchase products. By placing an order, you represent and warrant that you meet these requirements.
              </p>
            </>
          ),
        },
        {
          id: 'accounts',
          title: 'Accounts',
          body: (
            <>
              <p>
                When you create an account, you agree to provide accurate and complete information and to keep your
                password confidential. You are responsible for all activity under your account. Notify us immediately of
                any unauthorized use.
              </p>
            </>
          ),
        },
        {
          id: 'pricing',
          title: 'Pricing and Availability',
          body: (
            <>
              <p>
                All prices are listed in U.S. dollars and are subject to change without notice. We strive for accuracy
                but may occasionally display incorrect pricing. In the event of a pricing error, we may cancel your
                order and, if payment has already been received and verified, issue a refund of applicable paid amounts.
                Some products, including Provider Care therapies, have variable pricing determined after medical intake
                and provider review.
              </p>
            </>
          ),
        },
        {
          id: 'payment',
          title: 'Payment Terms',
          body: (
            <>
              <p>
                Public checkout is completed by Credit / Debit Card through our secure hosted card checkout. Your order
                remains unpaid until card payment is confirmed.
              </p>
              <LegalBulletList items={[
                'Order submission alone does not constitute payment.',
                'Processing and fulfillment do not begin solely because checkout was submitted. Processing begins after payment has been received and, where applicable, required provider review has been completed.',
                'Applicable taxes are included in displayed prices where required.',
                'Purchase and payment do not guarantee prescription or treatment approval.',
              ]} />
            </>
          ),
        },
        {
          id: 'subscriptions',
          title: 'Memberships, Auto-Refill, and Recurring Periods',
          body: (
            <>
              <p>
                Certain products are available as memberships or Auto-Refill. Memberships are billed monthly to your
                card while active. Selected membership shipping is included in each monthly card charge. Auto-Refill
                savings apply per eligible refill period according to the option selected at checkout.
              </p>
              <LegalBulletList items={[
                'You may submit a cancellation request from your account or by contacting support after any applicable minimum term. Requests are reviewed by our team and do not reverse a payment that has already been received, or stop an order that has already entered provider, pharmacy, or fulfillment processing.',
                'We may change subscription or membership pricing with at least 30 days notice when required.',
                'Failed or past-due payments may result in pause or suspension of benefits until payment is resolved.',
              ]} />
            </>
          ),
        },
        {
          id: 'memberships',
          title: 'Memberships and 3-Month Commitment',
          body: (
            <>
              <p>
                Semaglutide Membership is $149/month and Tirzepatide Membership is $275/month. Selected shipping
                recurs monthly (Two-Day +$30/month or Next-Day +$50/month). A one-time Initial Provider Visit ($75)
                may apply on enrollment when required and does not recur. See Membership &amp; Cancellation Terms for
                due-today versus monthly renewal examples.
              </p>
              <p>
                <strong>3-Month Commitment:</strong> By purchasing a membership, you commit to a minimum of three (3)
                consecutive monthly billing cycles. Normal self-service cancellation is not available before the end of
                this commitment period. After the 3-month commitment is fulfilled, your membership continues
                month-to-month and may be cancelled according to the current cancellation process, taking effect when
                a valid cancellation becomes effective.
              </p>
              <p>
                Pricing remains locked while your membership stays continuously active and in good standing.
                Cancellation or lapse does not guarantee the same prior price on re-enrollment. Membership benefits are
                non-transferable and may not be shared.
              </p>
            </>
          ),
        },
        {
          id: 'shipping',
          title: 'Shipping and Order Processing',
          body: (
            <>
              <p>
                Processing and shipping timelines begin only after payment has been received and any required provider
                review/approval has been completed. For eligible one-time orders, Two-Day Shipping is $30 and Next-Day
                Shipping is $50 (fixed fees). Carrier transit times vary by destination; delivery dates are not
                guaranteed. We are not liable for carrier delays beyond our control.
              </p>
              <p>
                Provider Care and therapy products require medical intake and provider approval before fulfillment.
                Fulfillment occurs only after applicable requirements are satisfied. If a provider does not approve the
                therapy after payment has been received, eligible paid amounts for the unapproved product are refunded
                in accordance with our Refund Policy.
              </p>
              <p>
                For applicable initial Women’s Hormone Therapy orders, a Required HRT Lab Package ($260) may be added
                once (Lab Kit $200 with Lab Kit shipping included; Lab Review $60). Medication shipping remains
                separate where applicable.
              </p>
            </>
          ),
        },
        {
          id: 'promotions',
          title: 'Promotional Codes',
          body: (
            <>
              <p>
                When offered, promotional codes such as OGTBM provide $50 off each eligible item (not a flat $50 off
                the entire order). Quantity applies per eligible item/unit where supported. A promo cannot reduce an
                eligible item below $0. Promotions are generally non-stackable. Exclusions typically include
                accessories, dermatology / prescription skin &amp; hair, Initial Provider Visit, Follow-Up Visit, Lab
                Review, Lab Kit, other provider services, and shipping. Promotional discounts do not change ongoing
                recurring membership renewal amounts.
              </p>
            </>
          ),
        },
        {
          id: 'intellectual-property',
          title: 'Intellectual Property',
          body: (
            <>
              <p>
                All content on this Site, including text, graphics, logos, product names, and design, is the property
                of My Bare Method or its licensors and is protected by U.S. and international intellectual property
                laws. You may not copy, reproduce, distribute, or create derivative works without our written
                permission.
              </p>
            </>
          ),
        },
        {
          id: 'prohibited-use',
          title: 'Prohibited Use',
          body: (
            <>
              <p>You agree not to:</p>
              <LegalBulletList items={[
                'Use the Site for any unlawful purpose or in violation of these Terms.',
                'Resell, redistribute, or mislabel our products.',
                'Use provider-directed or prescription products without required licensed-provider review, or contrary to applicable law and labeling.',
                'Attempt to reverse engineer, decompile, or otherwise extract source code or proprietary data.',
                'Interfere with the Site\'s security, operation, or functionality.',
                'Scrape, harvest, or collect user data without authorization.',
              ]} />
            </>
          ),
        },
        {
          id: 'limitation-of-liability',
          title: 'Limitation of Liability',
          body: (
            <>
              <p>
                To the maximum extent permitted by law, My Bare Method and its affiliates, officers, employees, and
                providers shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages, or any loss of profits or revenues, arising from your use of the Site or products.
              </p>
              <p>
                Our total liability for any claim arising from your use of the Site or purchase of products shall not
                exceed the amount you paid us in the preceding 12 months. Some states do not allow certain liability
                limitations, so these limits may not fully apply to you.
              </p>
            </>
          ),
        },
        {
          id: 'governing-law',
          title: 'Governing Law',
          body: (
            <>
              <p>
                These Terms are governed by the laws of the State of Texas, without regard to its conflict of laws
                principles. You agree to the exclusive jurisdiction of the state and federal courts located in Travis
                County, Texas, for any dispute arising from these Terms or your use of the Site.
              </p>
            </>
          ),
        },
        {
          id: 'dispute-resolution',
          title: 'Dispute Resolution',
          body: (
            <>
              <p>
                Any dispute, claim, or controversy arising out of these Terms or your use of the Site shall first be
                addressed through good-faith negotiation. If unresolved within 30 days, the dispute shall be resolved
                through binding arbitration administered by the American Arbitration Association in Austin, Texas,
                under its Consumer Arbitration Rules.
              </p>
              <p>
                You and My Bare Method waive any right to participate in a class action or class-wide arbitration. A
                party may seek injunctive relief in court only to protect intellectual property rights.
              </p>
            </>
          ),
        },
        {
          id: 'changes',
          title: 'Changes to These Terms',
          body: (
            <>
              <p>
                We may update these Terms from time to time. The "Last updated" date reflects the most recent revision.
                Your continued use of the Site after changes constitutes acceptance of the updated Terms.
              </p>
            </>
          ),
        },
        {
          id: 'contact',
          title: 'Contact Us',
          body: (
            <>
              <p>If you have questions about these Terms, contact us:</p>
              <p>
                My Bare Method<br />
                Email: info@thebaremethodmn.com<br />
                Phone: (218) 656-7189<br />
                Mailing Address: 15115 Cedar Ave Suite 33, Apple Valley, MN 55124
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
