import { LegalPageLayout, LegalBulletList } from '@/components/LegalPageLayout';

export function AccessibilityPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Accessibility Statement"
      intro="My Bare Method is committed to making mybaremethod.com accessible and usable for as many people as possible, including individuals with disabilities."
      lastUpdated="July 31, 2026"
      sections={[
        {
          id: 'commitment',
          title: 'Our Commitment',
          body: (
            <>
              <p>We are working to improve the website using recognized accessibility practices, including the Web Content Accessibility Guidelines as a reference. The U.S. Department of Justice explains that businesses open to the public should make their websites accessible to people with disabilities.</p>
            </>
          ),
        },
        {
          id: 'accessibility-efforts',
          title: 'Our Accessibility Efforts',
          body: (
            <>
              <p>We aim to provide:</p>
              <LegalBulletList items={[
                'Keyboard-accessible navigation',
                'Clear heading structure',
                'Descriptive links and buttons',
                'Alternative text for meaningful images',
                'Readable text sizes',
                'Sufficient color contrast',
                'Clearly labeled form fields',
                'Visible keyboard focus indicators',
                'Captions or text alternatives for important media',
                'Error messages that explain how to correct form entries',
                'Pages that work across common devices and screen sizes',
              ]} />
            </>
          ),
        },
        {
          id: 'ongoing-improvements',
          title: 'Ongoing Improvements',
          body: (
            <>
              <p>Accessibility is an ongoing process. New pages, third-party integrations, payment systems, scheduling platforms, and patient portals may have different accessibility features.</p>
              <p>We periodically review the website and work to correct barriers we identify.</p>
            </>
          ),
        },
        {
          id: 'need-assistance',
          title: 'Need Assistance?',
          body: (
            <>
              <p>Contact us if you:</p>
              <LegalBulletList items={[
                'Have difficulty using any part of the website',
                'Need information in another format',
                'Need assistance completing a request',
                'Encounter an inaccessible form, link, image, or feature',
              ]} />
              <p>Please include:</p>
              <LegalBulletList items={[
                'The page or feature involved',
                'A brief description of the problem',
                'Your preferred contact method',
                'The assistive technology or browser used, when relevant',
              ]} />
              <p>Accessibility support:</p>
              <p>
                Email: [ACCESSIBILITY EMAIL]<br />
                Phone: (218) 656-7189
              </p>
              <p>We will make reasonable efforts to provide the requested information, service, or assistance through an accessible alternative.</p>
            </>
          ),
        },
        {
          id: 'third-party-services',
          title: 'Third-Party Services',
          body: (
            <>
              <p>The website may link to independent scheduling, payment, pharmacy, laboratory, shipping, telehealth, and patient-portal services.</p>
              <p>We do not control every accessibility feature of third-party websites, but we welcome reports of accessibility issues so we can help identify an alternative when reasonably available.</p>
            </>
          ),
        },
      ]}
    />
  );
}
