/**
 * src/i18n/index.js
 * İstanbul Esenyurt Üniversitesi (İESÜ) Uluslararasılaşma (i18n) & Yerelleştirme (L10n) Çekirdek Motoru
 * TR (🇹🇷), EN (🇬🇧), AR (🇸🇦 RTL), DE (🇩🇪) Desteği & ICU MessageFormat Uyumu
 */

import { useState, useEffect, useCallback } from 'react';
import { translations } from './translations';
import { formatDate, formatCurrency, formatNumber, formatRelativeTime, getIntlLocale } from './formatters';
import { TAXONOMY, translateTaxonomy } from './taxonomy';
import eventBus from '../brain/eventBus';

const STORAGE_KEY = 'iesu_preferred_language';

export const SUPPORTED_LANGUAGES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷', nativeName: 'Türkçe', dir: 'ltr' },
  { code: 'en', label: 'English', flag: '🇬🇧', nativeName: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', nativeName: 'العربية', dir: 'rtl' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch', dir: 'ltr' }
];

const VALID_CODES = ['tr', 'en', 'ar', 'de'];

export const getLanguage = () => {
  if (typeof window === 'undefined') return 'tr';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && VALID_CODES.includes(saved)) return saved;
  } catch (_) {}
  return 'tr';
};

let currentLanguage = getLanguage();

const applyDocumentDirection = (lang) => {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
};

export const setLanguage = (lang) => {
  const safeLang = VALID_CODES.includes(lang) ? lang : 'tr';
  currentLanguage = safeLang;
  
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, safeLang);
    }
  } catch (_) {}

  applyDocumentDirection(safeLang);

  try {
    eventBus.emit('language:changed', { 
      language: safeLang, 
      dir: safeLang === 'ar' ? 'rtl' : 'ltr',
      isRtl: safeLang === 'ar'
    });
  } catch (_) {}

  return safeLang;
};

/**
 * ICU MessageFormat benzeri çoğul ayrıştırıcı
 * {count, plural, =0 {metin0} one {metin1} other {metinN}}
 */
function parseIcuPlural(template, count) {
  if (!template || typeof template !== 'string') return template;
  const trigger = '{count, plural,';
  const lower = template.toLowerCase();
  const startIdx = lower.indexOf(trigger);
  if (startIdx === -1) return template;

  // find matching closing brace
  let depth = 0;
  let endIdx = -1;
  for (let i = startIdx; i < template.length; i++) {
    if (template[i] === '{') depth++;
    else if (template[i] === '}') {
      depth--;
      if (depth === 0) {
        endIdx = i;
        break;
      }
    }
  }

  if (endIdx === -1) return template;

  const fullBlock = template.slice(startIdx, endIdx + 1);
  const inner = template.slice(startIdx + trigger.length, endIdx).trim();
  const num = Number(count);
  let resolvedText = '';

  // Extract branches: =0 {text}, one {text}, other {text}
  const branchRegex = /(=0|one|other|\d+)\s*\{([^}]*)\}/gi;
  const branches = {};
  let match;
  while ((match = branchRegex.exec(inner)) !== null) {
    branches[match[1].toLowerCase()] = match[2];
  }

  if (num === 0 && (branches['=0'] !== undefined || branches['0'] !== undefined)) {
    resolvedText = branches['=0'] ?? branches['0'];
  } else if ((num === 1 || num === -1) && branches['one'] !== undefined) {
    resolvedText = branches['one'];
  } else if (branches[String(num)] !== undefined) {
    resolvedText = branches[String(num)];
  } else if (branches['other'] !== undefined) {
    resolvedText = branches['other'];
  }

  if (resolvedText !== '') {
    resolvedText = resolvedText.replace(/#/g, String(count));
    return template.replace(fullBlock, resolvedText);
  }

  return template;
}

/**
 * Nested key lookup with parameter interpolation and ICU pluralization.
 * e.g. t('common.appName') or t('common.itemCount', { count: 3 })
 */
export const t = (key, params = {}, langOverride = null) => {
  const lang = langOverride || currentLanguage || 'tr';
  const dict = translations[lang] || translations.tr;
  
  if (!key || typeof key !== 'string') return '';

  // Pluralized key lookup: e.g. items_one / items_other if count exists
  let targetKey = key;
  if (params && params.count !== undefined) {
    const suffix = Number(params.count) === 1 ? '_one' : Number(params.count) === 0 ? '_zero' : '_other';
    const keysWithSuffix = `${key}${suffix}`.split('.');
    let checkVal = dict;
    let found = true;
    for (const k of keysWithSuffix) {
      if (checkVal && typeof checkVal === 'object' && k in checkVal) {
        checkVal = checkVal[k];
      } else {
        found = false;
        break;
      }
    }
    if (found && typeof checkVal === 'string') {
      targetKey = `${key}${suffix}`;
    }
  }

  const keys = targetKey.split('.');
  let value = dict;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to Turkish if missing in target language
      let fallbackValue = translations.tr;
      for (const fbKey of keys) {
        if (fallbackValue && typeof fallbackValue === 'object' && fbKey in fallbackValue) {
          fallbackValue = fallbackValue[fbKey];
        } else {
          fallbackValue = undefined;
          break;
        }
      }
      value = fallbackValue !== undefined ? fallbackValue : key;
      break;
    }
  }

  if (typeof value !== 'string') {
    return String(value ?? key);
  }

  // ICU Plural handling
  if (params && params.count !== undefined) {
    value = parseIcuPlural(value, params.count);
  }

  // Parameter interpolation: {name} -> params.name
  if (params && typeof params === 'object') {
    return value.replace(/\{(\w+)\}/g, (_, match) => {
      return params[match] !== undefined ? String(params[match]) : `{${match}}`;
    });
  }

  return value;
};

/**
 * React Hook for Reactive Translation & L10n Formatters
 */
export function useTranslation() {
  const [lang, setLangState] = useState(getLanguage);

  useEffect(() => {
    const handleLangChange = (data) => {
      if (data?.language) {
        setLangState(data.language);
        applyDocumentDirection(data.language);
      }
    };

    const unsub = eventBus.on('language:changed', handleLangChange);
    return () => {
      try {
        if (typeof unsub === 'function') unsub();
      } catch (_) {}
    };
  }, []);

  const changeLanguage = useCallback((newLang) => {
    const updated = setLanguage(newLang);
    setLangState(updated);
  }, []);

  const translate = useCallback((key, params) => {
    return t(key, params, lang);
  }, [lang]);

  const fDate = useCallback((date, options) => {
    return formatDate(date, lang, options);
  }, [lang]);

  const fCurrency = useCallback((amount, currency) => {
    return formatCurrency(amount, currency, lang);
  }, [lang]);

  const fNumber = useCallback((number, options) => {
    return formatNumber(number, lang, options);
  }, [lang]);

  const fRelativeTime = useCallback((date) => {
    return formatRelativeTime(date, lang);
  }, [lang]);

  const tTaxonomy = useCallback((category, termKey) => {
    return translateTaxonomy(category, termKey, lang);
  }, [lang]);

  return {
    t: translate,
    language: lang,
    setLanguage: changeLanguage,
    isEn: lang === 'en',
    isTr: lang === 'tr',
    isAr: lang === 'ar',
    isDe: lang === 'de',
    isRtl: lang === 'ar',
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    languages: SUPPORTED_LANGUAGES,
    formatDate: fDate,
    formatCurrency: fCurrency,
    formatNumber: fNumber,
    formatRelativeTime: fRelativeTime,
    translateTaxonomy: tTaxonomy,
    TAXONOMY
  };
}

export {
  formatDate,
  formatCurrency,
  formatNumber,
  formatRelativeTime,
  getIntlLocale,
  TAXONOMY,
  translateTaxonomy,
  translations
};

export default {
  t,
  getLanguage,
  setLanguage,
  useTranslation,
  SUPPORTED_LANGUAGES,
  translations,
  formatDate,
  formatCurrency,
  formatNumber,
  formatRelativeTime,
  TAXONOMY,
  translateTaxonomy
};
