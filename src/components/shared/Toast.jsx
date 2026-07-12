import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';

let addToastHandler = null;

export const toast = {
  success: (message) => addToastHandler && addToastHandler({ type: 'success', message }),
  error: (message) => addToastHandler && addToastHandler({ type: 'error', message }),
  info: (message) => addToastHandler && addToastHandler({ type: 'info', message }),
  warning: (message) => addToastHandler && addToastHandler({ type: 'warning', message }),
};

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    addToastHandler = (toast) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { ...toast, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
    return () => {
      addToastHandler = null;
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 min-w-[250px] max-w-sm px-4 py-3 rounded-xl shadow-lg border animate-fade-in bg-white/90 backdrop-blur-md ${
            t.type === 'success' ? 'border-emerald-200 shadow-emerald-100' :
            t.type === 'error' ? 'border-red-200 shadow-red-100' :
            t.type === 'warning' ? 'border-amber-200 shadow-amber-100' :
            'border-blue-200 shadow-blue-100'
          }`}
        >
          {t.type === 'success' && <CheckCircle size={20} className="text-emerald-500 shrink-0" />}
          {t.type === 'error' && <XCircle size={20} className="text-red-500 shrink-0" />}
          {t.type === 'warning' && <AlertCircle size={20} className="text-amber-500 shrink-0" />}
          {t.type === 'info' && <Info size={20} className="text-blue-500 shrink-0" />}
          
          <p className="text-sm font-bold text-gray-800 flex-1">{t.message}</p>
          
          <button onClick={() => removeToast(t.id)} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
