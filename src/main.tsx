import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import { captureMarketingAttribution } from './lib/marketingAttribution';
import { initMetaPixel } from './lib/metaPixel';
import './index.css';

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  captureMarketingAttribution();
  initMetaPixel();
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Unable to start My Bare Method: root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
