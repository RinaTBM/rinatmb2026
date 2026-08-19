import { LegalPageLayout, LegalBulletList } from '@/components/LegalPageLayout';

export function ConsumerDataPage() {
  return (
    <LegalPageLayout
      eyebrow="Privacy"
      title="Consumer Health Data Notice"
      intro="This notice explains how My Bare Method may collect, use, disclose, and protect consumer health data through mybaremethod.com and related non-HIPAA public-facing services."
      lastUpdated="July 31, 2026"
      sections={[
        {
          id: 'scope',
          title: 'Scope of This Notice',
          body: (
            <>
              <p>This notice does not replace a medical provider's Notice of Privacy Practices. Information entered directly into a provider's secure medical record or patient portal may be governed by separate privacy notices and applicable healthcare privacy laws.</p>
              <p>Certain state laws require additional transparency and consumer rights concerning health-related data. Washington's My Health My Data Act, for example, requires covered businesses to publish a distinct consumer health-data privacy policy and provides rights involving consent, access, withdrawal, and deletion. Minnesota's Consumer Data Privacy Act also provides eligible Minnesota consumers with privacy rights and imposes obligations on covered businesses.</p>
            </>
          ),
        },
        {
          id: 'data-we-collect',
          title: 'Consumer Health Data We May Collect',
          body: (
            <>
              <p>Depending on how a visitor uses the website, consumer health data may include:</p>
              <LegalBulletList items={[
                'Wellness goals or interests',
                'Products or service categories viewed',
                'Products added to a Wellness Request',
                'Interest in weight management, hormone wellness, sexual wellness, energy support, recovery, IV Therapy, or related services',
                'Requested treatment format',
                'State of residence',
                'Appointment or consultation preferences',
                'Communications sent to customer support',
                'Information voluntarily submitted through website forms',
                'Website activity that could reveal an interest in health-related products or services',
              ]} />
              <p>Do not submit diagnoses, medical history, medication lists, allergies, laboratory results, pregnancy information, medical photographs, or other detailed clinical information through the public website.</p>
              <p>Submit medical information only through the designated secure patient portal.</p>
            </>
          ),
        },
        {
          id: 'sources',
          title: 'Sources of Consumer Health Data',
          body: (
            <>
              <p>We may collect consumer health data:</p>
              <LegalBulletList items={[
                'Directly from the consumer',
                'Through website forms and Wellness Requests',
                'Through customer-support communications',
                'From service providers acting on our behalf',
                'From a provider, pharmacy, or platform when necessary to coordinate an authorized request',
                'Automatically through essential website technologies',
              ]} />
            </>
          ),
        },
        {
          id: 'why-we-collect',
          title: 'Why We Collect and Use It',
          body: (
            <>
              <p>We may use consumer health data to:</p>
              <LegalBulletList items={[
                'Process a Wellness Request',
                'Connect a client to secure intake',
                'Coordinate provider review',
                'Respond to questions',
                'Schedule requested services',
                'Process authorized payments',
                'Confirm eligibility by state',
                'Provide customer support',
                'Prevent fraud and protect security',
                'Comply with legal obligations',
                'Maintain records of consent and privacy requests',
                'Improve website functionality without using sensitive health interests for targeted advertising',
              ]} />
            </>
          ),
        },
        {
          id: 'data-we-share',
          title: 'Consumer Health Data We Share',
          body: (
            <>
              <p>We may disclose consumer health data when reasonably necessary to:</p>
              <LegalBulletList items={[
                'Licensed healthcare providers',
                'Telehealth and patient-portal platforms',
                'Dispensing pharmacies',
                'Laboratories',
                'Payment processors',
                'Scheduling and communication vendors',
                'Shipping or fulfillment partners',
                'Information-security and technical service providers',
                'Professional advisers',
                'Government authorities when legally required',
              ]} />
              <p>Each recipient should receive only the information reasonably necessary for its authorized purpose.</p>
            </>
          ),
        },
        {
          id: 'sale-of-data',
          title: 'Sale of Consumer Health Data',
          body: (
            <>
              <p>My Bare Method does not sell consumer health data for monetary consideration.</p>
              <p>We do not authorize third parties to use identifiable consumer health data for their own targeted advertising.</p>
            </>
          ),
        },
        {
          id: 'cookies-analytics',
          title: 'Cookies, Analytics, and Advertising',
          body: (
            <>
              <p>Do not configure advertising pixels, session-replay tools, or analytics to receive:</p>
              <LegalBulletList items={[
                'Selected medication names',
                'Peptide interests',
                'Hormone interests',
                'Wellness goals',
                'Intake answers',
                'Medical conditions',
                'Sensitive form contents',
              ]} />
              <p>Use only necessary or appropriately configured privacy-conscious analytics.</p>
              <p>Do not place sensitive health interests in URLs, page titles transmitted to advertisers, analytics event labels, email subject lines, or text-message previews.</p>
            </>
          ),
        },
        {
          id: 'consent',
          title: 'Consent',
          body: (
            <>
              <p>Where required, obtain consent before collecting or sharing consumer health data beyond what is necessary to provide a service requested by the consumer.</p>
              <p>A consumer may withdraw consent for future collection or sharing, subject to legal and operational limitations.</p>
              <p>Withdrawal does not affect processing that occurred before the request was received.</p>
            </>
          ),
        },
        {
          id: 'consumer-rights',
          title: 'Consumer Rights',
          body: (
            <>
              <p>Depending on applicable law, consumers may have the right to:</p>
              <LegalBulletList items={[
                'Confirm whether consumer health data is collected or shared',
                'Access the consumer health data held about them',
                'Request correction',
                'Request deletion',
                'Withdraw consent',
                'Obtain information about categories of data and recipients',
                'Appeal the denial of a request',
                'Opt out of certain data processing',
                'Receive a portable copy when required',
              ]} />
              <p>Rights may be subject to identity verification, exemptions, retention requirements, and applicable law.</p>
            </>
          ),
        },
        {
          id: 'submit-request',
          title: 'How to Submit a Request',
          body: (
            <>
              <p>Submit a privacy request through:</p>
              <LegalBulletList items={[
                'Email: info@thebaremethodmn.com',
                'Mail: 15115 Cedar Ave Suite 33, Apple Valley, MN 55124',
              ]} />
              <p>Use the subject: <strong>Consumer Health Data Request</strong></p>
              <p>We may request reasonable information to verify identity and prevent unauthorized access.</p>
            </>
          ),
        },
        {
          id: 'deletion-requests',
          title: 'Deletion Requests',
          body: (
            <>
              <p>A verified deletion request may require us to delete consumer health data from active systems and instruct applicable service providers to do the same, subject to legal exceptions.</p>
              <p>Some information may be retained when necessary to:</p>
              <LegalBulletList items={[
                'Complete an authorized transaction',
                'Maintain financial or tax records',
                'Prevent fraud',
                'Protect legal rights',
                'Comply with healthcare, pharmacy, or regulatory obligations',
                'Document consent or privacy-request history',
                'Maintain information within protected medical records governed by separate laws',
              ]} />
            </>
          ),
        },
        {
          id: 'security',
          title: 'Security',
          body: (
            <>
              <p>We use reasonable administrative, technical, and physical safeguards designed to protect consumer health data.</p>
              <p>No online system can guarantee absolute security.</p>
              <p>The FTC's Health Breach Notification Rule may require certain health-data businesses to notify affected consumers, the FTC, and sometimes the media following qualifying breaches of unsecured identifiable health information.</p>
            </>
          ),
        },
        {
          id: 'children',
          title: 'Children',
          body: (
            <>
              <p>The public Wellness Request service is intended for adults unless a specific service expressly permits participation by a minor with appropriate parent or legal-guardian involvement.</p>
              <p>Do not knowingly collect consumer health data from children through the public request process without legally required authorization.</p>
            </>
          ),
        },
        {
          id: 'changes',
          title: 'Changes to This Notice',
          body: (
            <>
              <p>We may update this notice to reflect changes in services, technologies, legal requirements, or data practices.</p>
              <p>Post the revised effective date at the top of the page. Obtain additional consent when legally required for material changes.</p>
            </>
          ),
        },
        {
          id: 'contact',
          title: 'Contact',
          body: (
            <>
              <p>Privacy and consumer health data questions:</p>
              <p>
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
