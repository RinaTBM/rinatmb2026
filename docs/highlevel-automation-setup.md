# HighLevel Automation Setup

This is the working checklist for connecting My Bare Method website events to HighLevel automations.

## Website events now available

The storefront can send these events to Supabase Edge Function `highlevel-lead-capture`:

- `contact_form`
- `newsletter_signup`
- `product_interest`
- `category_interest`
- `abandoned_cart`
- `new_client_welcome`

Payment-backed events also run server-side through the HighLevel Contacts API when enabled:

- `checkout_started`
- `purchase_completed`

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
- `HIGHLEVEL_PRODUCT_INTEREST_WEBHOOK_URL`
- `HIGHLEVEL_CATEGORY_INTEREST_WEBHOOK_URL`
- `HIGHLEVEL_ABANDONED_CART_WEBHOOK_URL`
- `HIGHLEVEL_NEW_CLIENT_WEBHOOK_URL`

Do not put HighLevel webhook URLs directly in frontend source.

## Optional Meta tracking

The storefront supports an optional Meta Pixel ID:

- `VITE_META_PIXEL_ID`

When this is present, the site sends standard `PageView` and broad `Lead` events only. Do not send diagnoses, medication names, lab selections, prescription categories, or other health-specific details to Meta.

It is okay if the current Meta Business setup is named `The Bare Method`. For cleaner reporting, use a Meta dataset/pixel named `My Bare Method` when it is available, then connect that pixel to the ads account. HighLevel attribution fields will still capture campaign source details from links even before a separate My Bare Method Meta account is created.

## Marketing readiness recommendation

Use the existing `The Bare Method` Meta Business setup only as the temporary account container if that is what is already connected and approved. The customer-facing ad assets, dataset/pixel naming, campaign names, UTMs, and reporting should all use `My Bare Method` so launch data does not get mixed with the older brand.

Recommended setup:

- Meta Business / ad account: keep `The Bare Method` only if it is already verified, funded, and easier to use now.
- Pixel/dataset: create or rename a dedicated dataset to `My Bare Method`.
- Domain: verify `mybaremethod.com` in the Meta business account before scaling ads.
- Site secret: set `VITE_META_PIXEL_ID` in Bolt only after the correct pixel/dataset is selected.
- Events: keep the site limited to `PageView` and broad `Lead`. Do not send product names, medication names, lab choices, diagnoses, intake answers, or condition-specific labels to Meta.

Use this link format for ads:

```text
https://mybaremethod.com/?utm_source=fb_ad&utm_medium={{adset.name}}&utm_campaign={{campaign.name}}&utm_content={{ad.name}}
```

HighLevel currently classifies paid social most cleanly when `utm_source` contains `fb_ad`. Keep campaign, ad set, and ad names simple, unique, and free of special characters.

## Starter ad audiences

Start broad and privacy-safe. Do not build audiences around sensitive health conditions, diagnoses, medication names, or lab-result behavior.

- Warm website visitors: all site visitors from the last 30, 60, and 180 days.
- Engaged social audience: people who engaged with the Instagram/Facebook account in the last 365 days.
- Lead list: newsletter and contact-form leads only when consent and privacy policy language support marketing follow-up.
- Purchasers/clients: use only for retention or exclusion audiences if consent and platform rules allow it.
- Broad prospecting: adults in the serviceable geography with general wellness positioning, not condition-specific targeting.
- Lookalike audience: wait until there is enough clean lead or purchaser volume, then use a consented list or broad lead event source.

## First soft-launch ads

Start with a small learning set so you can see what message resonates before spending heavily.

- Brand trust ad: introduce My Bare Method as provider-guided wellness with discreet, thoughtful care.
- Weight Management ad: use softer language such as `support for your metabolic goals` instead of aggressive before/after or quick-loss claims.
- Hormone Support ad: speak to guided care and lab-informed next steps, not personal-attribute claims like `Are you struggling with menopause?`.
- Labs ad: position Order Labs as an easier way to choose current lab options that support care decisions.
- Existing client ad/email: direct returning clients to the client portal and GEN Health access, primarily through owned channels and retargeting.

Do not use before/after body imagery, guaranteed outcomes, or copy that implies the viewer has a medical condition. Keep ads calm, supportive, and access-focused.

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
- Attribution Captured At
- Lead Type
- Source Page
- Interest Category
- Interest Label
- Cart Value

## HighLevel workflows to create

### Shared Website Lead Capture

Trigger: Inbound webhook.

Premium-usage note: this uses one inbound webhook workflow for contact form and newsletter leads, then branches by `lead_type`. This keeps premium trigger usage lower than creating one premium trigger per event.

Suggested actions:

- Create or update contact by email.
- Map name, phone, lead type, subject, message, UTM fields, click IDs, landing page, and referrer.
- Add tags: `MBM Website`, `Website Lead`.
- Branch by `lead_type`.

Suggested field mapping from the website webhook:

- `lead_type` -> Lead Type
- `source_page` -> Source Page
- `utm_source` -> UTM Source
- `utm_medium` -> UTM Medium
- `utm_campaign` -> UTM Campaign
- `utm_content` -> UTM Content
- `utm_term` -> UTM Term
- `fbclid` -> Facebook Click ID
- `gclid` -> Google Click ID
- `msclkid` -> Microsoft Click ID
- `landing_page` -> Landing Page
- `referrer` -> Referrer
- `attribution_captured_at` -> Attribution Captured At

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

### First-Time Visitor Welcome Popup

Branch/filter: `lead_type = new_client_welcome`.

Suggested actions:

- Create or update contact by email.
- Add tags: `MBM Website`, `New Client`, `Welcome Offer`.
- Map UTM and click-ID fields from the webhook payload.
- Send the soft welcome/account-created message when consent allows.
- Start a light nurture path that points to the client portal, shopping, and support.

Suggested first message:

```text
Welcome to My Bare Method. Your account is ready, and your welcome offer is available for your first order. You can return to your client portal anytime for orders, subscriptions, and care next steps.
```

### Newsletter Signup

Branch/filter: `lead_type = newsletter_signup`.

Suggested actions:

- Create or update contact by email.
- Add tags: `MBM Website`, `Newsletter Signup`.
- Map UTM and click-ID fields from the webhook payload.
- Add to nurture sequence.
- Do not send health-condition-specific marketing based only on sensitive browsing behavior.

## Conversion workflows to build next

### Checkout Started

Current status: wired server-side through `create-invoice-order` when HighLevel Contacts API secrets are enabled.

Trigger: tag added `mybaremethod-checkout-started`.

Suggested actions:

- Add broad tag: `checkout started`.
- Wait 30-60 minutes.
- If contact still has `mybaremethod-checkout-started` and does not have `mybaremethod-purchase-completed`, send a gentle reminder.
- Create an internal task only for higher-intent carts or carts over an owner-selected value.

Premium-usage note: use one workflow with one delay and one condition. Avoid multiple reminders until the first recovery test is proven.

### Abandoned Cart

Current status: no separate website event is required for first launch. Use the existing checkout-started tag as the abandoned-cart signal after a delay.

Trigger: tag `mybaremethod-checkout-started` remains after the delay.

Suggested tags:

- `abandoned cart`
- `checkout follow-up needed`

Suggested first message:

```text
Hi {{contact.first_name}}, it looks like your My Bare Method checkout may not have been completed. If you had trouble checking out or have a question before moving forward, reply here and we can help.
```

Do not reference specific prescription names, lab panels, diagnoses, or medical details in the automation message.

### Hormone Lab Choice Popup

Current status: tied to checkout, not a separate anonymous lead workflow.

Why: the popup appears when someone is already checking out with hormone support products. It is most useful as checkout context, because HighLevel needs an email or contact record before it can safely automate follow-up.

Suggested handling:

- Keep the popup on-site only until the shopper enters checkout contact information.
- Use `mybaremethod-checkout-started` for reminder timing.
- Use broad internal notes/tags only, such as `lab choice required`, when supported by the checkout payload.
- Do not send the selected lab name, prescription name, diagnosis, or clinical details into general marketing messages.

### Purchase Completed

Current status: wired server-side through `tagada-webhook` after confirmed payment.

Trigger: tag added `mybaremethod-purchase-completed`.

Suggested actions:

- Remove `abandoned cart` and `checkout follow-up needed` if present.
- Add `customer`.
- Add `new client` only if this is their first purchase or if no prior customer tag exists.
- Start the new-client welcome flow.

### New Client Welcome

Trigger: tag added `new client` or `mybaremethod-customer`.

Suggested actions:

- Send a soft welcome message with next steps.
- Point prescription/lab/client care actions back to GEN Health or the client portal.
- Create a manual task if the order requires provider review and no GEN action is visible after the expected time window.

Suggested first message:

```text
Welcome to My Bare Method. Your order is in progress. If your care path includes intake, labs, or provider review, please watch for the next secure step in GEN Health or your client portal.
```

### Product / Category Interest

Current status: supported by the website event handler, but should only be used when the visitor has identified themselves by email, such as newsletter signup, contact form, or a future guided quiz.

For the on-site wellness check-in popup, the website stores only a broad privacy-safe context. The next email-bearing website lead can include:

- `interest_category = guided_popup`
- `interest_label = Wellness check-in completed`

Suggested tags:

- `product interest`
- `category interest`
- `guided popup`
- Broad category only, such as `weight management interest`, `hormone support interest`, `lab interest`, `skin hair interest`.

Privacy guardrail: do not send feeling selections, symptoms, medication names, lab-result behavior, diagnoses, or intake answers into general marketing automations.

## Older next automation candidates

These are not wired yet and should be added only after the corresponding production event is confirmed:

- Accessory order started
- Accessory order paid
- Lab option selected
- GEN Health checkout started
- Provider-care inquiry
- Abandoned cart
- Client portal signup

## Minimum launch checklist

- Confirm `HIGHLEVEL_WEBSITE_LEAD_WEBHOOK_URL` is set in Bolt/Supabase Edge secrets.
- Submit one test contact form with `?utm_source=fb_ad&utm_medium=test_adset&utm_campaign=test_campaign&utm_content=test_ad`.
- Confirm the HighLevel contact has the mapped UTM fields and tags.
- Submit one newsletter signup with the same test URL.
- Confirm the contact branches into the newsletter path.
- Add `VITE_META_PIXEL_ID` only after the Meta dataset/pixel is chosen.
- Verify Meta Pixel sees `PageView` and `Lead`, with no health/product-specific custom event names.
- Keep Premium HighLevel workflow usage lean: one inbound webhook workflow, one branch by `lead_type`, and no duplicate workflows unless a specific conversion event needs its own path.

## Compliance guardrails

- Do not send detailed medical intake answers, diagnoses, medication lists, lab results, or PHI into general marketing workflows.
- Use broad tags such as `Hormone Interest` or `Lab Interest` only when the workflow has been reviewed for privacy and consent.
- Keep clinical intake and lab results inside GEN Health or the designated secure patient portal.
