/**
 * src/i18n/formatters.js
 * İstanbul Esenyurt Üniversitesi (İESÜ) Uluslararasılaştırma ve Yerelleştirme Formatlayıcıları
 * (Kariyer.net ve LinkedIn Standartlarında tr-TR, en-US, ar-SA, de-DE uyumu)
 */

const LOCALE_MAP = {
  tr: 'tr-TR',
  en: 'en-US',
  ar: 'ar-SA',
  de: 'de-DE'
};

export const getIntlLocale = (lang = 'tr') => LOCALE_MAP[lang] || 'tr-TR';

/**
 * Tarih Biçimlendirici (Intl.DateTimeFormat)
 */
export function formatDate(date, lang = 'tr', options = {}) {
  if (!date) return '';
  const parsedDate = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) return String(date);

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };

  try {
    return new Intl.DateTimeFormat(getIntlLocale(lang), defaultOptions).format(parsedDate);
  } catch (_) {
    return parsedDate.toLocaleDateString();
  }
}

/**
 * Para Birimi Biçimlendirici (Intl.NumberFormat)
 */
export function formatCurrency(amount, currency = 'TRY', lang = 'tr') {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  if (isNaN(numericAmount)) return String(amount ?? '');

  const curr = (currency || 'TRY').toUpperCase();
  try {
    return new Intl.NumberFormat(getIntlLocale(lang), {
      style: 'currency',
      currency: curr,
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    }).format(numericAmount);
  } catch (_) {
    return `${numericAmount.toLocaleString()} ${curr}`;
  }
}

/**
 * Sayı Biçimlendirici (Intl.NumberFormat)
 */
export function formatNumber(number, lang = 'tr', options = {}) {
  const num = typeof number === 'string' ? parseFloat(number) : Number(number);
  if (isNaN(num)) return String(number ?? '');

  try {
    return new Intl.NumberFormat(getIntlLocale(lang), options).format(num);
  } catch (_) {
    return num.toLocaleString();
  }
}

/**
 * Bağıl Zaman Biçimlendirici (Relative Time / "X dakika önce", "X minutes ago", "منذ X دقيقة", "Vor X Minuten")
 */
export function formatRelativeTime(date, lang = 'tr') {
  if (!date) return '';
  const parsed = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (!(parsed instanceof Date) || isNaN(parsed.getTime())) return String(date);

  const now = Date.now();
  const diffSec = Math.floor((now - parsed.getTime()) / 1000);

  if (diffSec < 60) {
    switch (lang) {
      case 'en': return 'Just now';
      case 'ar': return 'منذ لحظات';
      case 'de': return 'Gerade eben';
      case 'tr':
      default: return 'Az önce';
    }
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    switch (lang) {
      case 'en': return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
      case 'ar': return `منذ ${diffMin} دقيقة`;
      case 'de': return `Vor ${diffMin} ${diffMin === 1 ? 'Minute' : 'Minuten'}`;
      case 'tr':
      default: return `${diffMin} dakika önce`;
    }
  }

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    switch (lang) {
      case 'en': return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
      case 'ar': return `منذ ${diffHours} ساعة`;
      case 'de': return `Vor ${diffHours} ${diffHours === 1 ? 'Stunde' : 'Stunden'}`;
      case 'tr':
      default: return `${diffHours} saat önce`;
    }
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    switch (lang) {
      case 'en': return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
      case 'ar': return `منذ ${diffDays} يوم`;
      case 'de': return `Vor ${diffDays} ${diffDays === 1 ? 'Tag' : 'Tagen'}`;
      case 'tr':
      default: return `${diffDays} gün önce`;
    }
  }

  return formatDate(parsed, lang, { day: 'numeric', month: 'short', year: 'numeric' });
}

export default {
  formatDate,
  formatCurrency,
  formatNumber,
  formatRelativeTime,
  getIntlLocale
};
