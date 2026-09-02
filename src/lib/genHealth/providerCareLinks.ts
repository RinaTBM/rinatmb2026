import { GEN_HEALTH_APP_BASE_URL } from './portalLinks';

const GEN_HEALTH_CLIENT_PATH = 'f5e0mdyBYnDh7HGvek0C';

export type ProviderCareAction = {
  checkoutUrl?: string;
  triggerLabel: string;
  nextStepLabel: string;
};

const genProductUrl = (genProductId: string) =>
  `${GEN_HEALTH_APP_BASE_URL}${GEN_HEALTH_CLIENT_PATH}/product/${genProductId}`;

export const PROVIDER_CARE_GEN_ACTIONS: Record<string, ProviderCareAction> = {
  'initial-provider-consultation': {
    triggerLabel: 'New prescription start or first provider-guided care plan',
    nextStepLabel: 'Pay in GEN Health, then complete the required intake and visit steps there.',
  },
  'follow-up-appointment': {
    checkoutUrl: genProductUrl('lFf1pqSIvVe48XgVVu3H'),
    triggerLabel: 'Established patient refill review, medication change, or care check-in',
    nextStepLabel: 'Pay in GEN Health, then continue with scheduling and follow-up steps there.',
  },
  'laboratory-review': {
    checkoutUrl: genProductUrl('lFf1pqSIvVe48XgVVu3H'),
    triggerLabel: 'Provider interpretation after labs are completed or uploaded',
    nextStepLabel: 'Pay through the Follow-Up Clinical Visit checkout in GEN Health, then make sure your lab results are available there.',
  },
};

export function getProviderCareGenAction(slug: string): ProviderCareAction | undefined {
  return PROVIDER_CARE_GEN_ACTIONS[slug];
}
