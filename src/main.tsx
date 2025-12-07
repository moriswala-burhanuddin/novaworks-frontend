import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { SmoothScrollProvider } from './context/SmoothScrollContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SmoothScrollProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </SmoothScrollProvider>
  </StrictMode>
);
