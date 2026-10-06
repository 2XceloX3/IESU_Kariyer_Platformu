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
