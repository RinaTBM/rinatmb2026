import { LegalPageLayout, LegalBulletList } from '@/components/LegalPageLayout';

export function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="Your privacy matters to us. This policy explains what we collect, how we use it, and the rights you have over your data."
      lastUpdated="August 19, 2026"
      sections={[
        {
          id: 'information-we-collect',
          title: 'Information We Collect',
          body: (
            <>
              <p>We collect the following categories of personal and health-related information:</p>
              <LegalBulletList items={[
                'Account information: name, email address, password (hashed), and phone number when you create an account.',
                'Intake forms: medical history, current medications, symptoms, goals, and other health details submitted during provider-guided therapy intake.',
                'Payment information: billing name and address, payment method type (for example, Credit / Debit Card via our secure hosted checkout), order references, and payment status. Card details are processed by our payment processor; My Bare Method does not store full card numbers on the storefront.',
                'Shipping information: delivery name, address, and phone number provided at checkout.',
                'Order history: products purchased, dates, quantities, and order status.',
                'Usage data: pages visited, time on site, and interactions collected via cookies and analytics tools.',
              ]} />
            </>
          ),
        },
        {
          id: 'how-we-use-it',
          title: 'How We Use Your Information',
          body: (
            <>
              <p>We use the information we collect to:</p>
              <LegalBulletList items={[
                'Process and fulfill orders, including shipping and delivery.',
                'Verify identity and prevent fraud.',
                'Facilitate medical intake and provider review for therapy products.',
                'Communicate with you about your orders, account, and customer service requests.',
                'Send marketing emails only with your consent; you may opt out at any time.',
                'Improve our website, products, and services through analytics.',
                'Comply with legal, regulatory, and tax obligations.',
              ]} />
            </>
          ),
        },
        {
          id: 'storage-and-protection',
          title: 'Data Storage and Protection',
          body: (
            <>
              <p>
                Your data is stored on secure servers with access restricted to authorized personnel who need it to
                perform their duties. We use encryption in transit (TLS) and at rest. Customers complete public checkout
                through a secure hosted card payment flow. Card details are handled by our payment processor; My Bare
                Method does not store full card numbers collected through the website checkout.
              </p>
              <p>
                Despite our safeguards, no system is perfectly secure. In the event of a data breach affecting your
                personal information, we will notify affected users in accordance with applicable U.S. state laws.
              </p>
            </>
          ),
        },
        {
          id: 'hipaa',
          title: 'HIPAA and Protected Health Information',
          body: (
            <>
              <p>
                Certain products require a medical intake and review by a licensed provider. The health information
                you submit in intake forms may constitute Protected Health Information (PHI) under the Health Insurance
                Portability and Accountability Act (HIPAA) and the HIPAA Privacy and Security Rules.
              </p>
              <p>
                We handle PHI in accordance with HIPAA requirements. Access to PHI is limited to the minimum necessary
                workforce members and contracted providers involved in your care. We do not disclose PHI for marketing
                purposes without your written authorization. You may request access to, or an accounting of disclosures
                of, your PHI by contacting us using the information in the Contact section below.
              </p>
              <p>
                If a provider determines that a requested therapy is not appropriate for you, your PHI is retained only
                as long as necessary to document the review and then securely disposed of per our retention schedule.
              </p>
            </>
          ),
        },
        {
          id: 'cookies-analytics',
          title: 'Cookies and Analytics',
          body: (
            <>
              <p>
                We use cookies and similar technologies to keep you logged in, remember items in your cart, and
                understand how visitors use our site. You can disable cookies in your browser settings, though some
                features may not function properly without them.
              </p>
              <p>
                We use third-party analytics tools that collect aggregated, de-identified usage data to help us improve
                the website. These tools may use cookies but do not identify you personally.
              </p>
            </>
          ),
        },
        {
          id: 'third-party-services',
          title: 'Third-Party Services',
          body: (
            <>
              <p>We share limited data with trusted third-party service providers to operate our business:</p>
              <LegalBulletList items={[
                'Payment processors: process card payments on our behalf under their own terms and privacy practices. We receive confirmation details needed to match payment to your order.',
                'Shipping providers: receive your name, address, and phone number to deliver your order and provide tracking updates.',
                'Form and intake platforms: securely store medical intake responses for provider review.',
                'Email and SMS providers: receive your contact information to send transactional and, with consent, marketing messages.',
              ]} />
              <p>
                We do not sell your personal information to third parties. Service providers are bound by contracts
                requiring them to protect your data and use it only for the purposes we specify.
              </p>
            </>
          ),
        },
        {
          id: 'us-privacy-rights',
          title: 'Your Privacy Rights (U.S.)',
          body: (
            <>
              <p>
                Depending on your state of residence, you may have the following rights under U.S. privacy laws,
                including the California Consumer Privacy Act (CCPA), the California Privacy Rights Act (CPRA), and
                comparable state laws:
              </p>
              <LegalBulletList items={[
                'Know what personal information we collect about you and how it is used.',
                'Request access to or a copy of your personal information.',
                'Request deletion of your personal information, subject to legal retention obligations.',
                'Correct inaccurate personal information.',
                'Opt out of the sale or sharing of personal information for cross-context behavioral advertising.',
                'Limit the use of sensitive personal information.',
                'Non-discrimination: we will not deny service or charge different prices for exercising your rights.',
              ]} />
              <p>
                To exercise any of these rights, contact us using the information in the Contact section. We will verify
                your identity before processing your request and respond within 45 days, as required by law.
              </p>
            </>
          ),
        },
        {
          id: 'data-retention',
          title: 'Data Retention',
          body: (
            <>
              <p>
                We retain personal information only as long as necessary to fulfill the purposes described in this
                policy, comply with legal obligations, resolve disputes, and enforce our agreements. Medical intake
                data is retained per applicable healthcare record retention requirements. Order and tax records are
                retained for the period required by law.
              </p>
            </>
          ),
        },
        {
          id: 'children',
          title: "Children's Privacy",
          body: (
            <>
              <p>
                Our services are not intended for individuals under 18. We do not knowingly collect personal
                information from children. If you believe a child has provided us information, contact us and we will
                delete it.
              </p>
            </>
          ),
        },
        {
          id: 'changes',
          title: 'Changes to This Policy',
          body: (
            <>
              <p>
                We may update this Privacy Policy from time to time. The "Last updated" date at the top reflects the
                most recent revision. Material changes will be posted on this page and, where appropriate, communicated
                by email.
              </p>
            </>
          ),
        },
        {
          id: 'contact',
          title: 'Contact Us',
          body: (
            <>
              <p>If you have questions about this Privacy Policy or wish to exercise your privacy rights, contact us:</p>
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
