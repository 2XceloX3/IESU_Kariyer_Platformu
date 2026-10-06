import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Global defensive fallback for window.toast
if (typeof window !== 'undefined' && !window.toast) {
  window.toast = {
    info: (msg) => console.info('[Toast:Info]', msg),
    success: (msg) => console.log('[Toast:Success]', msg),
    error: (msg) => console.error('[Toast:Error]', msg),
    warning: (msg) => console.warn('[Toast:Warning]', msg),
  };
}

// Otomatik surum guncellemesi ve kirik chunk kurtarma (ChunkLoadError / vite:preloadError)
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    const reloadKey = 'iesu_chunk_reload_ts';
    const lastReload = parseInt(sessionStorage.getItem(reloadKey) || '0', 10);
    const now = Date.now();
    if (now - lastReload > 8000) {
      sessionStorage.setItem(reloadKey, String(now));
      window.location.reload();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event?.message || '';
    if (
      msg.includes('dynamically imported module') ||
      msg.includes('Loading chunk') ||
      msg.includes('ChunkLoadError') ||
      msg.includes('Failed to fetch')
    ) {
      const reloadKey = 'iesu_chunk_reload_ts';
      const lastReload = parseInt(sessionStorage.getItem(reloadKey) || '0', 10);
      const now = Date.now();
      if (now - lastReload > 8000) {
        sessionStorage.setItem(reloadKey, String(now));
        window.location.reload();
      }
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
