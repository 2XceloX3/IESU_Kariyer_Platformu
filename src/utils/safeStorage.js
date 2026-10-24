/**
 * safeStorage.js
 * 5M Kullanıcı Ölçeğinde LocalStorage QuotaExceededError Kalkanı
 * 
 * Tarayıcıların 5 MB'lık yerel depolama sınırına ulaşıldığında (QuotaExceededError)
 * uygulamanın çökmesini engeller, eski önbellekleri otomatik budar ve 
 * gerektiğinde bellek (in-memory) yedeğine geçer.
 */

const memoryFallback = new Map();

export const safeStorage = {
  getJSON: (key, fallback = null) => {
    try {
      const val = safeStorage.getItem(key);
      if (val === null || val === undefined || val === '') return fallback;
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  },

  setJSON: (key, value) => {
    try {
      safeStorage.setItem(key, JSON.stringify(value));
    } catch {
      // safeStorage.setItem handles memory fallback automatically
    }
  },

  getItem: (key) => {
    try {
      const val = localStorage.getItem(key);
      if (val !== null) return val;
      return memoryFallback.has(key) ? memoryFallback.get(key) : null;
    } catch {
      return memoryFallback.has(key) ? memoryFallback.get(key) : null;
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      memoryFallback.set(key, value);
    } catch (err) {
      // QuotaExceededError veya Private Browsing SecurityError yakalama
      const isQuotaError = 
        err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        err.code === 22 ||
        err.code === 1014;

      if (isQuotaError) {
        console.warn(`[safeStorage] Yerel depolama kotası doldu (${key}). Otomatik temizlik başlatılıyor...`);
        
        // 1. Düşük öncelikli / geçici anahtarları temizle
        const ephemeralPrefixes = ['iesu_temp_', 'iesu_cache_', 'iesu_audit_log_', 'iesu_search_history_'];
        try {
          // Snapshot alarak döngü — removeItem çağrısı length'i azaltıp indis kaymasına neden olmasın
          const keysSnapshot = Object.keys(localStorage);
          keysSnapshot.forEach(k => {
            if (k && ephemeralPrefixes.some(prefix => k.startsWith(prefix))) {
              localStorage.removeItem(k);
            }
          });
          // Temizlik sonrası tekrar dene
          localStorage.setItem(key, value);
          memoryFallback.set(key, value);
          return;
        } catch {
          // İkinci deneme de başarısızsa bellek yedeğine geç
        }
      }

      // Kalıcı depolama başarısız olduğunda oturum belleğinde tut (Uygulama ASLA çökmez)
      memoryFallback.set(key, value);
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch { /* ignore */ }
    memoryFallback.delete(key);
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch { /* ignore */ }
    memoryFallback.clear();
  }
};

export default safeStorage;
