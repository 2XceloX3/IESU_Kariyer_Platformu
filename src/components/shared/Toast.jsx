import React, { useState, useEffect, useRef } from 'react';
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
  const timersRef = useRef({});

  useEffect(() => {
    addToastHandler = (toast) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { ...toast, id }]);
      
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        delete timersRef.current[id];
      }, 4000);
      
      timersRef.current[id] = timer;
    };
    return () => {
      addToastHandler = null;
      // Clear all active timers on unmount
      Object.values(timersRef.current).forEach(clearTimeout);
      timersRef.current = {};
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
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
          
          <button onClick={() => removeToast(t.id)} className="text-gray-500 hover:text-gray-600 transition-colors shrink-0">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
