# HighLevel Automation Setup

This is the working checklist for connecting My Bare Method website events to HighLevel automations.

## Website events now available

The storefront can send these events to Supabase Edge Function `highlevel-lead-capture`:

- `contact_form`
- `newsletter_signup`

The Edge Function forwards each event to a matching HighLevel inbound webhook URL stored as a secret.

Website leads also include broad marketing attribution when present:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `fbclid`
- `gclid`
- `msclkid`
- `landing_page`
- `referrer`

## Required Bolt / Supabase secrets

Preferred lean setup: use one shared HighLevel inbound webhook for website leads:

- `HIGHLEVEL_WEBSITE_LEAD_WEBHOOK_URL`

Optional split setup, if you later want separate workflows:

- `HIGHLEVEL_CONTACT_FORM_WEBHOOK_URL`
- `HIGHLEVEL_NEWSLETTER_WEBHOOK_URL`

Do not put HighLevel webhook URLs directly in frontend source.

## Optional Meta tracking

The storefront supports an optional Meta Pixel ID:

- `VITE_META_PIXEL_ID`

When this is present, the site sends standard `PageView` and broad `Lead` events only. Do not send diagnoses, medication names, lab selections, prescription categories, or other health-specific details to Meta.

It is okay if the current Meta Business setup is named `The Bare Method`. For cleaner reporting, use a Meta dataset/pixel named `My Bare Method` when it is available, then connect that pixel to the ads account. HighLevel attribution fields will still capture campaign source details from links even before a separate My Bare Method Meta account is created.

## HighLevel custom fields to map

Create matching custom fields in HighLevel so ad leads stay reportable:

- UTM Source
- UTM Medium
- UTM Campaign
- UTM Content
- UTM Term
- Facebook Click ID
- Google Click ID
- Microsoft Click ID
- Landing Page
- Referrer

## HighLevel workflows to create

### Shared Website Lead Capture

Trigger: Inbound webhook.

Premium-usage note: this uses one inbound webhook workflow for contact form and newsletter leads, then branches by `lead_type`. This keeps premium trigger usage lower than creating one premium trigger per event.

Suggested actions:

- Create or update contact by email.
- Map name, phone, lead type, subject, message, UTM fields, click IDs, landing page, and referrer.
- Add tags: `MBM Website`, `Website Lead`.
- Branch by `lead_type`.

### Contact Form Intake

Branch/filter: `lead_type = contact_form`.

Suggested actions:

- Create or update contact by email.
- Add tags: `MBM Website`, `Contact Form`.
- Map UTM and click-ID fields from the webhook payload.
- Create a task for manual follow-up.
- Send internal notification to the care team.
- Send a simple confirmation email/SMS when consent allows.

Suggested branches by subject:

- `Order Question`
- `Product Inquiry`
- `Therapy & Intake`
- `Subscription`
- `Other`

### Newsletter Signup

Branch/filter: `lead_type = newsletter_signup`.

Suggested actions:

- Create or update contact by email.
- Add tags: `MBM Website`, `Newsletter Signup`.
- Map UTM and click-ID fields from the webhook payload.
- Add to nurture sequence.
- Do not send health-condition-specific marketing based only on sensitive browsing behavior.

## Next automation candidates

These are not wired yet and should be added only after the corresponding production event is confirmed:

- Accessory order started
- Accessory order paid
- Lab option selected
- GEN Health checkout started
- Provider-care inquiry
- Abandoned cart
- Client portal signup

## Compliance guardrails

- Do not send detailed medical intake answers, diagnoses, medication lists, lab results, or PHI into general marketing workflows.
- Use broad tags such as `Hormone Interest` or `Lab Interest` only when the workflow has been reviewed for privacy and consent.
- Keep clinical intake and lab results inside GEN Health or the designated secure patient portal.
