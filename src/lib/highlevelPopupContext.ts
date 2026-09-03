const GUIDED_POPUP_KEY = 'mbm_guided_popup_context';

export type GuidedPopupContext = {
  interestCategory: 'guided_popup';
  interestLabel: string;
};

export function rememberGuidedPopupInterest() {
  try {
    localStorage.setItem(
      GUIDED_POPUP_KEY,
      JSON.stringify({
        interestCategory: 'guided_popup',
        interestLabel: 'Wellness check-in completed',
      } satisfies GuidedPopupContext),
    );
  } catch {
    /* ignore */
  }
}

export function getGuidedPopupInterest(): GuidedPopupContext | null {
  try {
    const raw = localStorage.getItem(GUIDED_POPUP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GuidedPopupContext>;
    if (parsed.interestCategory !== 'guided_popup' || !parsed.interestLabel) return null;
    return {
      interestCategory: parsed.interestCategory,
      interestLabel: parsed.interestLabel,
    };
  } catch {
    return null;
  }
}
