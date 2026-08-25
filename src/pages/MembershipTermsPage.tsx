import { LegalPageLayout, LegalBulletList } from '@/components/LegalPageLayout';

export function MembershipTermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Membership & Cancellation Terms"
      intro="These terms apply to recurring Wellness Memberships offered through My Bare Method."
      lastUpdated="August 19, 2026"
      sections={[
        {
          id: 'available-memberships',
          title: 'Available Memberships',
          body: (
            <>
              <p>Current weight-management membership base rates:</p>
              <LegalBulletList items={[
                'Semaglutide Membership — $149 per month',
                'Tirzepatide Membership — $275 per month',
              ]} />
              <p>
                Selected shipping is billed with each monthly membership renewal and is not included in the base
                $149 / $275 membership price:
              </p>
              <LegalBulletList items={[
                'Two-Day Shipping — +$30 per month',
                'Next-Day Shipping — +$50 per month',
              ]} />
              <p>Therefore, your monthly card charge (membership + selected shipping) is:</p>
              <LegalBulletList items={[
                'Semaglutide + Two-Day — $179/month',
                'Semaglutide + Next-Day — $199/month',
                'Tirzepatide + Two-Day — $305/month',
                'Tirzepatide + Next-Day — $325/month',
              ]} />
              <p>
                Membership availability, pricing, inclusions, and treatment eligibility may change. Membership does
                not guarantee that a particular medication or prescription will be approved.
              </p>
            </>
          ),
        },
        {
          id: 'due-today-vs-monthly',
          title: 'Due Today vs Monthly Renewal',
          body: (
            <>
              <p>
                Your first charge may be higher than the ongoing monthly renewal when a required one-time Initial
                Provider Visit ($75) is added. The Initial Provider Visit does not recur.
              </p>
              <p>Examples (when the Initial Provider Visit is required):</p>
              <LegalBulletList items={[
                'Semaglutide + Two-Day — Due today $254; renews $179/month',
                'Semaglutide + Next-Day — Due today $274; renews $199/month',
                'Tirzepatide + Two-Day — Due today $380; renews $305/month',
                'Tirzepatide + Next-Day — Due today $400; renews $325/month',
              ]} />
              <p>
                Do not treat due-today totals ($254 / $274 / $380 / $400) as the ongoing monthly rate. Monthly renewal
                is membership base plus your selected shipping only.
              </p>
            </>
          ),
        },
        {
          id: 'locked-pricing-program-terms',
          title: 'Locked Pricing & Program Terms',
          body: (
            <>
              <p>
                Your initial membership term is three months. After the initial term, your membership continues month
                to month until a valid cancellation becomes effective.
              </p>
              <p>
                Your monthly membership rate (including the selected recurring shipping amount) remains locked while
                your membership stays continuously active and in good standing.
              </p>
              <p>
                If your membership is canceled or lapses beyond the permitted payment grace period, future enrollment
                will be subject to the membership pricing available at that time. Re-enrollment is not guaranteed to
                match a prior canceled price.
              </p>
              <p>
                Membership enrollment and payment do not guarantee that a prescription will be issued. Continued
                treatment, formulation, strength, and fulfillment remain subject to provider approval, pharmacy
                availability, applicable law, and completion of required follow-up information.
              </p>
              <p>
                If a licensed provider determines that continued treatment is not appropriate, future membership
                billing periods will be discontinued according to these terms.
              </p>
              <p>
                Switching between Semaglutide and Tirzepatide requires enrollment in the current rate for the new
                membership program.
              </p>
              <p>The $275 Tirzepatide locked rate includes eligible provider-selected formulations through 15mg.</p>
            </>
          ),
        },
        {
          id: 'initial-commitment',
          title: 'Initial Commitment',
          body: (
            <>
              <p>
                Wellness Memberships require an initial three-month minimum commitment. This is a My Bare Method
                membership rule.
              </p>
              <p>
                By enrolling, you agree to the three-month minimum term and to monthly card billing for membership
                plus your selected recurring shipping. Normal self-service cancellation is not available before the
                minimum term ends, unless enrollment is canceled by My Bare Method because treatment is unavailable,
                medically inappropriate, legally restricted, or otherwise cannot be provided.
              </p>
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
              <p>
                Medication eligibility, dosage, treatment continuation, and refill approval remain subject to provider
                review.
              </p>
              <p>Membership benefits have no cash value and cannot be transferred.</p>
            </>
          ),
        },
        {
          id: 'not-included',
          title: 'What Is Not Automatically Included',
          body: (
            <>
              <p>Unless expressly stated, the base membership price ($149 / $275) does not automatically include:</p>
              <LegalBulletList items={[
                'The $75 Initial Provider Visit (one-time when required; does not recur)',
                'Laboratory testing or the Required HRT Lab Package',
                'Shipping (selected shipping is billed separately and recurs monthly with membership)',
                'Supplies',
                'Additional provider visits',
                'Treatments outside the selected membership',
                'Replacement products caused by client error',
              ]} />
              <p>Applicable charges are shown before you complete payment whenever reasonably possible.</p>
            </>
          ),
        },
        {
          id: 'recurring-billing',
          title: 'Recurring Billing',
          body: (
            <>
              <p>
                Memberships are paid by Credit / Debit Card through secure hosted card checkout. Your card is billed
                monthly while your membership remains active. Selected shipping is included in each recurring monthly
                card charge as described above.
              </p>
              <p>
                Recurring billing continues until a valid cancellation becomes effective after the initial commitment,
                or until My Bare Method cancels the membership under these terms.
              </p>
              <p>
                Applicable taxes are included in displayed prices where required. Clients are responsible for keeping
                billing and contact information current.
              </p>
            </>
          ),
        },
        {
          id: 'cancellation-after-minimum',
          title: 'Cancellation After the Minimum Term',
          body: (
            <>
              <p>
                After the initial three-month commitment has been completed, you may cancel according to the current
                cancellation process before the next billing date.
              </p>
              <p>Cancellation requests must be submitted through:</p>
              <LegalBulletList items={[
                'The client account, when available',
                'Email: info@thebaremethodmn.com',
                'Cancellation Request Form: https://form.jotform.com/262115224996056',
              ]} />
              <p>
                Submitting a cancellation request does not reverse a payment that has already been received, or stop
                an order that has already entered provider, pharmacy, or fulfillment processing. Cancellation does not
                retroactively refund prior membership or recurring shipping charges except where required by law or
                expressly approved under our Refund Policy.
              </p>
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
              <p>
                The initial three-month commitment generally cannot be canceled early simply because the client changes
                their mind, does not complete required forms, or no longer wants to continue.
              </p>
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
              <p>
                The provider may recommend a different option, request testing, require a consultation, pause
                treatment, or decline treatment. Purchase and payment do not guarantee prescription or treatment
                approval. Fulfillment and shipping occur only when applicable requirements are satisfied.
              </p>
            </>
          ),
        },
        {
          id: 'failed-payments',
          title: 'Failed or Past-Due Payments',
          body: (
            <>
              <p>If a membership payment fails or is not completed, My Bare Method may:</p>
              <LegalBulletList items={[
                'Mark the membership as past due or under a payment issue status',
                'Retry or request updated payment',
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
              <p>
                Membership fees and recurring shipping charges are generally nonrefundable once the applicable billing
                period begins and payment has been received.
              </p>
              <p>
                Refunds may be issued when required by law or approved because of a verified billing error or service
                that My Bare Method is unable to provide.
              </p>
            </>
          ),
        },
        {
          id: 'changes-to-memberships',
          title: 'Changes to Memberships',
          body: (
            <>
              <p>
                We may update membership pricing, inclusions, or terms. When required, advance notice will be provided
                before a material change takes effect.
              </p>
              <p>
                Locked pricing applies only while the applicable membership remains continuously active and in good
                standing. Locked membership pricing does not automatically apply to laboratory services, pharmacy
                charges outside the program, or services outside the membership.
              </p>
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
