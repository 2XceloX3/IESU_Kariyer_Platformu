/**
 * src/i18n/index.js
 * İstanbul Esenyurt Üniversitesi (İESÜ) Uluslararasılaşma (i18n) Çekirdek Motoru
 */

import { useState, useEffect, useCallback } from 'react';
import { translations } from './translations';
import eventBus from '../brain/eventBus';

const STORAGE_KEY = 'iesu_preferred_language';

export const SUPPORTED_LANGUAGES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'en', label: 'English', flag: '🇬🇧', nativeName: 'English' }
];

export const getLanguage = () => {
  if (typeof window === 'undefined') return 'tr';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (saved === 'tr' || saved === 'en')) return saved;
  } catch (_) {}
  return 'tr';
};

let currentLanguage = getLanguage();

export const setLanguage = (lang) => {
  const safeLang = lang === 'en' ? 'en' : 'tr';
  currentLanguage = safeLang;
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, safeLang);
    }
  } catch (_) {}
  try {
    eventBus.emit('language:changed', { language: safeLang });
  } catch (_) {}
  return safeLang;
};

/**
 * Nested key lookup with parameter interpolation.
 * e.g. t('common.appName') or t('radar.stageSubmitted')
 */
export const t = (key, params = {}, langOverride = null) => {
  const lang = langOverride || currentLanguage || 'tr';
  const dict = translations[lang] || translations.tr;
  
  if (!key || typeof key !== 'string') return '';

  const keys = key.split('.');
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

  // Parameter interpolation: {name} -> params.name
  if (params && typeof params === 'object') {
    return value.replace(/\{(\w+)\}/g, (_, match) => {
      return params[match] !== undefined ? String(params[match]) : `{${match}}`;
    });
  }

  return value;
};

/**
 * React Hook for Reactive Translation
 */
export function useTranslation() {
  const [lang, setLangState] = useState(getLanguage);

  useEffect(() => {
    const handleLangChange = (data) => {
      if (data?.language) {
        setLangState(data.language);
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

  return {
    t: translate,
    language: lang,
    setLanguage: changeLanguage,
    isEn: lang === 'en',
    isTr: lang === 'tr',
    languages: SUPPORTED_LANGUAGES
  };
}

export default {
  t,
  getLanguage,
  setLanguage,
  useTranslation,
  SUPPORTED_LANGUAGES,
  translations
};
