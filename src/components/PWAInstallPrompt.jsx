import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 left-6 z-[100] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 max-w-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-[#0A2342]/10 flex items-center justify-center text-[#0A2342] shrink-0">
            <Download size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-sm">Mobil Uygulamamızı İndir</h4>
            <p className="text-[11px] text-gray-500 mt-0.5">Daha hızlı ve çevrimdışı kullanım için hemen yükle.</p>
          </div>
          <div className="flex flex-col gap-2 ml-2">
            <button 
              onClick={handleInstallClick}
              className="px-4 py-1.5 bg-[#0A2342] text-white text-xs font-bold rounded-lg hover:bg-[#163B65] transition-colors shadow-md"
            >
              Yükle
            </button>
            <button 
              onClick={() => setShowPrompt(false)}
              className="px-4 py-1.5 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Kapat
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
