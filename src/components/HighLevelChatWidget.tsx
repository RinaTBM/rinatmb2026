import { useEffect } from 'react';

const SCRIPT_SRC = 'https://widgets.leadconnectorhq.com/loader.js';
const WIDGET_ID = '6a7dfa997c66d2cc05375b0a';
const SCRIPT_ATTR = 'data-mbm-highlevel-chat';

/**
 * HighLevel / LeadConnector chat widget (phone capture).
 * Loads once on the storefront; skipped on admin routes by not mounting there.
 */
export function HighLevelChatWidget() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.querySelector(`script[${SCRIPT_ATTR}]`)) return;

    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.setAttribute(SCRIPT_ATTR, '1');
    script.setAttribute('data-resources-url', 'https://widgets.leadconnectorhq.com/chat-widget/loader.js');
    script.setAttribute('data-widget-id', WIDGET_ID);
    script.setAttribute('data-source', 'WEB_USER');
    document.body.appendChild(script);

    return () => {
      // Keep the script loaded across storefront navigations; only remove if
      // the host unmounts permanently (admin transition). Widget DOM cleanup
      // is handled by LeadConnector when the page is left.
      script.remove();
    };
  }, []);

  return null;
}
