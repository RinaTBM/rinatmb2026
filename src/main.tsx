import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import { captureMarketingAttribution } from './lib/marketingAttribution';
import { initMetaPixel } from './lib/metaPixel';
import './index.css';

captureMarketingAttribution();
initMetaPixel();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
