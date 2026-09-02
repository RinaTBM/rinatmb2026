import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import { captureAttribution } from './lib/marketingAttribution';
import { initMetaPixel } from './lib/metaPixel';
import './index.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}

try {
  captureAttribution();
  initMetaPixel();
} catch {
  /* Ignore tracking init failures in prerender or restricted environments. */
}
