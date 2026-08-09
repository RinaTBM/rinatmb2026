import { LegalPageLayout, LegalBulletList } from '@/components/LegalPageLayout';

export function MembershipTermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Membership & Cancellation Terms"
      intro="These terms apply to recurring Wellness Memberships offered through My Bare Method."
      lastUpdated="July 31, 2026"
      sections={[
        {
          id: 'available-memberships',
          title: 'Available Memberships',
          body: (
            <>
              <p>Current weight-management membership options:</p>
              <LegalBulletList items={[
                'Semaglutide Membership — $199 per month',
                'Tirzepatide Membership — $249 per month',
              ]} />
              <p>Membership availability, pricing, inclusions, and treatment eligibility may change. Membership does not guarantee that a particular medication or prescription will be approved.</p>
            </>
          ),
        },
        {
          id: 'locked-pricing-program-terms',
          title: 'Locked Pricing & Program Terms',
          body: (
            <>
              <p>Your initial membership term is three months. After the initial term, your membership continues month to month until canceled.</p>
              <p>Your monthly membership rate remains locked while your membership stays continuously active and in good standing.</p>
              <p>If your membership is canceled or lapses beyond the permitted payment grace period, future enrollment will be subject to the membership pricing available at that time.</p>
              <p>Membership enrollment and payment do not guarantee that a prescription will be issued. Continued treatment, formulation, strength, and fulfillment remain subject to provider approval, pharmacy availability, applicable law, and completion of required follow-up information.</p>
              <p>If a licensed provider determines that continued treatment is not appropriate, future membership charges will be discontinued according to the membership terms.</p>
              <p>Switching between Semaglutide and Tirzepatide requires enrollment in the current rate for the new membership program.</p>
              <p>The $249 Tirzepatide locked rate includes eligible provider-selected formulations through 25mg/2mg per mL, 2mL. Formulations above the included maximum are not part of this membership.</p>
            </>
          ),
        },
        {
          id: 'initial-commitment',
          title: 'Initial Commitment',
          body: (
            <>
              <p>Wellness Memberships require an initial three-month minimum commitment.</p>
              <p>By enrolling, the client authorizes recurring monthly charges for the three-month minimum term unless enrollment is canceled by My Bare Method because treatment is unavailable, medically inappropriate, legally restricted, or otherwise cannot be provided.</p>
            </>
          ),
        },
        {
          id: 'membership-benefits',
          title: 'Membership Benefits',
          body: (
            <>
              <p>Active membership benefits may include:</p>
              <LegalBulletList items={[
                'Member pricing',
                'Locked membership pricing while continuously active',
                'Monthly recurring fulfillment when approved',
                'Provider-directed treatment adjustments within the included program',
                'Access to designated member benefits',
              ]} />
              <p>Medication eligibility, dosage, treatment continuation, and refill approval remain subject to provider review.</p>
              <p>Membership benefits have no cash value and cannot be transferred.</p>
            </>
          ),
        },
        {
          id: 'not-included',
          title: 'What Is Not Automatically Included',
          body: (
            <>
              <p>Unless expressly stated, membership pricing does not automatically include:</p>
              <LegalBulletList items={[
                'The $25 Initial Wellness Intake',
                'A $75 Detailed Wellness Consultation',
                'Laboratory testing',
                'Shipping',
                'Supplies',
                'Additional provider visits',
                'Treatments outside the selected membership',
                'Replacement products caused by client error',
              ]} />
              <p>Display all applicable charges before payment whenever reasonably possible.</p>
            </>
          ),
        },
        {
          id: 'recurring-billing',
          title: 'Recurring Billing',
          body: (
            <>
              <p>The client authorizes My Bare Method or its payment processor to charge the payment method on file each billing cycle.</p>
              <p>Billing may continue automatically until canceled in accordance with these terms.</p>
              <p>Clients are responsible for maintaining a valid payment method and current contact information.</p>
            </>
          ),
        },
        {
          id: 'cancellation-after-minimum',
          title: 'Cancellation After the Minimum Term',
          body: (
            <>
              <p>After the initial three-month commitment has been completed, the membership may be canceled before the next billing date.</p>
              <p>Cancellation requests must be submitted through:</p>
              <LegalBulletList items={[
                'The client account, when available',
                'Email: info@thebaremethodmn.com',
                'Cancellation Request Form: https://form.jotform.com/262115224996056',
              ]} />
              <p>Submitting a cancellation request does not reverse a charge that has already been processed or stop an order that has already entered provider, pharmacy, or fulfillment processing.</p>
            </>
          ),
        },
        {
          id: 'cancellation-deadline',
          title: 'Cancellation Deadline',
          body: (
            <>
              <p>Submit cancellation at least three business days before the next scheduled billing date.</p>
              <p>Requests received after that deadline may take effect during the following billing cycle.</p>
            </>
          ),
        },
        {
          id: 'early-cancellation',
          title: 'Early Cancellation',
          body: (
            <>
              <p>The initial three-month commitment generally cannot be canceled early simply because the client changes their mind, does not complete required forms, or no longer wants to continue.</p>
              <p>Contact customer support regarding exceptional circumstances.</p>
              <p>My Bare Method may cancel or modify a membership when:</p>
              <LegalBulletList items={[
                'Treatment is no longer medically appropriate',
                'The provider requires treatment to stop',
                'Required information or monitoring is not completed',
                'Payment repeatedly fails',
                'The membership is misused',
                'Service is unavailable in the client\'s location',
                'A product becomes unavailable',
                'Legal, pharmacy, clinical, or regulatory requirements change',
              ]} />
            </>
          ),
        },
        {
          id: 'provider-decisions',
          title: 'Provider Decisions',
          body: (
            <>
              <p>Providers retain independent clinical judgment.</p>
              <p>A membership does not guarantee:</p>
              <LegalBulletList items={[
                'Approval',
                'A prescription',
                'A particular medication',
                'A specific dose',
                'Continued treatment',
                'Specific results',
              ]} />
              <p>The provider may recommend a different option, request testing, require a consultation, pause treatment, or decline treatment.</p>
            </>
          ),
        },
        {
          id: 'failed-payments',
          title: 'Failed Payments',
          body: (
            <>
              <p>If a recurring payment fails, My Bare Method may:</p>
              <LegalBulletList items={[
                'Retry the payment',
                'Request another payment method',
                'Pause member benefits',
                'Delay fulfillment',
                'Cancel the membership after notice',
              ]} />
            </>
          ),
        },
        {
          id: 'refunds',
          title: 'Refunds',
          body: (
            <>
              <p>Membership fees are generally nonrefundable once the applicable billing period begins.</p>
              <p>Refunds may be issued when required by law or approved because of a verified billing error or service that My Bare Method is unable to provide.</p>
            </>
          ),
        },
        {
          id: 'changes-to-memberships',
          title: 'Changes to Memberships',
          body: (
            <>
              <p>We may update membership pricing, inclusions, or terms. When required, advance notice will be provided before a material change takes effect.</p>
              <p>Locked pricing applies only while the applicable membership remains continuously active and may not apply to taxes, shipping, labs, pharmacy charges, or services outside the membership.</p>
            </>
          ),
        },
        {
          id: 'contact',
          title: 'Contact',
          body: (
            <>
              <p>Membership questions or cancellation requests:</p>
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
