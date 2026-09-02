import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import { captureMarketingAttribution } from './lib/marketingAttribution';
import { initMetaPixel } from './lib/metaPixel';
import './index.css';

try {
  captureMarketingAttribution();
} catch {
  // Attribution is helpful, not required — never block app startup.
}

try {
  initMetaPixel();
} catch {
  // Pixel is helpful, not required — never block app startup.
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}
