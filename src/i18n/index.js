/**
 * src/i18n/index.js
 * İstanbul Esenyurt Üniversitesi (İESÜ) Uluslararasılaşma (i18n) & Yerelleştirme (L10n) Çekirdek Motoru
 * TR (🇹🇷), EN (🇬🇧), AR (🇸🇦 RTL), DE (🇩🇪) Desteği & ICU MessageFormat & Canlı DOM Çeviricisi
 */

import { useState, useEffect, useCallback } from 'react';
import { translations } from './translations';
import { formatDate, formatCurrency, formatNumber, formatRelativeTime, getIntlLocale } from './formatters';
import { TAXONOMY, translateTaxonomy } from './taxonomy';
import eventBus from '../brain/eventBus';
import useAppStore from '../store/useAppStore';

const STORAGE_KEY = 'iesu_preferred_language';

export const SUPPORTED_LANGUAGES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷', nativeName: 'Türkçe', dir: 'ltr' },
  { code: 'en', label: 'English', flag: '🇬🇧', nativeName: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', nativeName: 'العربية', dir: 'rtl' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch', dir: 'ltr' }
];

export const VALID_CODES = ['tr', 'en', 'ar', 'de'];

export const UI_PHRASE_MAP = {
  'Ana Sayfa': { en: 'Home', ar: 'الرئيسية', de: 'Startseite' },
  'Hakkımızda': { en: 'About Us', ar: 'معلومات عنا', de: 'Über uns' },
  'Hizmetlerimiz': { en: 'Our Services', ar: 'خدماتنا', de: 'Unsere Dienste' },
  'Etkinlikler': { en: 'Events', ar: 'الفعاليات', de: 'Veranstaltungen' },
  'İletişim': { en: 'Contact', ar: 'اتصل بنا', de: 'Kontakt' },
  'Haberler & Duyurular': { en: 'News & Announcements', ar: 'الأخبار والإعلانات', de: 'News & Ankündigungen' },
  'Sistem Paneli': { en: 'System Dashboard', ar: 'لوحة النظام', de: 'System-Dashboard' },
  'Panele Dön': { en: 'Back to Panel', ar: 'العودة للوحة', de: 'Zurück zum Panel' },
  'Öğrenci Kovanı': { en: 'Student Hive', ar: 'خلية الطلاب', de: 'Studenten-Portal' },
  'Mezun Kovanı': { en: 'Alumni Hive', ar: 'خلية الخريجين', de: 'Alumni-Portal' },
  'Şirket Kovanı': { en: 'Company Hive', ar: 'خلية الشركات', de: 'Unternehmens-Portal' },
  'Akademik Kovan': { en: 'Academic Hive', ar: 'الخلية الأكاديمية', de: 'Akademisches Portal' },
  'Yönetim Paneli': { en: 'Admin Dashboard', ar: 'لوحة الإدارة', de: 'Admin-Konsole' },
  'Yönetici Akışı': { en: 'Admin Feed', ar: 'تغذية المشرف', de: 'Admin-Feed' },
  'Kampüs Akışı': { en: 'Campus Feed', ar: 'نبض الحرم الجامعي', de: 'Campus-Feed' },
  'Keşfet': { en: 'Explore', ar: 'استكشاف', de: 'Entdecken' },
  'İş & Staj İlanları': { en: 'Jobs & Internships', ar: 'فرص العمل والتدريب', de: 'Jobs & Praktika' },
  'İlanlar': { en: 'Job Listings', ar: 'الوظائف', de: 'Stellenangebote' },
  'Öğrenci Kulüpleri': { en: 'Student Clubs', ar: 'الأندية الطلابية', de: 'Studentenclubs' },
  'Kulüpler': { en: 'Clubs', ar: 'الأندية', de: 'Clubs' },
  'İESÜ Mezunlar Portalı': { en: 'Alumni Association', ar: 'جمعية الخريجين', de: 'Alumni-Vereinigung' },
  'Birlik Ağı': { en: 'Unity Network', ar: 'شبكة الاتحاد', de: 'Einheitsnetzwerk' },
  'Mezun Bilgi Sistemi': { en: 'Alumni Information System', ar: 'نظام معلومات الخريجين', de: 'Alumni-Informationssystem' },
  'Kariyer Check-Up': { en: 'Career Check-Up', ar: 'فحص المسار المهني', de: 'Karriere-Check-Up' },
  'Dijital Mezun Kartı': { en: 'Digital Alumni Card', ar: 'بطاقة الخريج الرقمية', de: 'Digitale Alumni-Karte' },
  'Mentorluk': { en: 'Mentorship', ar: 'الإرشاد المهني', de: 'Mentoring' },
  'Aday Takip (ATS)': { en: 'Applicant Tracking (ATS)', ar: 'تتبع المتقدمين (ATS)', de: 'Bewerbermanagement (ATS)' },
  'İlan Oluştur': { en: 'Create Job Post', ar: 'إنشاء إعلان وظيفة', de: 'Stellenanzeige erstellen' },
  'Kurumsal Protokoller': { en: 'Corporate Protocols', ar: 'البروتوكولات المؤسسية', de: 'Unternehmensprotokolle' },
  'Zorunlu Staj Onayları': { en: 'Mandatory Internship Approvals', ar: 'موافقات التدريب الإلزامي', de: 'Pflichtpraktikum-Freigaben' },
  'Akademik Danışmanlık': { en: 'Academic Advising', ar: 'الإرشاد الأكاديمي', de: 'Akademische Beratung' },
  'Araştırma Laboratuvarları': { en: 'Research Labs', ar: 'مختبرات الأبحاث', de: 'Forschungslabore' },
  'Denetim Kayıtları': { en: 'Audit Trail Logs', ar: 'سجلات التدقيق', de: 'Prüfprotokolle (Audit)' },
  'Onay Bekliyor': { en: 'Pending Approval', ar: 'بانتظار الموافقة', de: 'Wartet auf Freigabe' },
  'Beklemede': { en: 'Pending', ar: 'قيد الانتظار', de: 'Ausstehend' },
  'Onaylandı': { en: 'Approved', ar: 'تمت الموافقة', de: 'Genehmigt' },
  'Reddedildi': { en: 'Rejected', ar: 'مرفوض', de: 'Abgelehnt' },
  'Yayında': { en: 'Published', ar: 'منشور', de: 'Veröffentlicht' },
  'Aktif': { en: 'Active', ar: 'نشط', de: 'Aktiv' },
  'Başvur': { en: 'Apply Now', ar: 'تقدم الآن', de: 'Jetzt bewerben' },
  'Başvuruldu': { en: 'Applied', ar: 'تم التقديم', de: 'Beworben' },
  'Kulübe Katıl': { en: 'Join Club', ar: 'انضم للنادي', de: 'Club beitreten' },
  'Kulüpten Ayrıl': { en: 'Leave Club', ar: 'مغادرة النادي', de: 'Club verlassen' },
  'Kaydet': { en: 'Save', ar: 'حفظ', de: 'Speichern' },
  'İptal': { en: 'Cancel', ar: 'إلغاء', de: 'Abbrechen' },
  'Kapat': { en: 'Close', ar: 'إغلاق', de: 'Schließen' },
  'Düzenle': { en: 'Edit', ar: 'تعديل', de: 'Bearbeiten' },
  'Sil': { en: 'Delete', ar: 'حذف', de: 'Löschen' },
  'Onayla': { en: 'Approve', ar: 'موافقة', de: 'Genehmigen' },
  'Reddet': { en: 'Reject', ar: 'رفض', de: 'Ablehnen' },
  'Giriş Yap': { en: 'Sign In', ar: 'تسجيل الدخول', de: 'Anmelden' },
  'Çıkış Yap': { en: 'Sign Out', ar: 'تسجيل الخروج', de: 'Abmelden' },
  'Profilim': { en: 'My Profile', ar: 'ملفي الشخصي', de: 'Mein Profil' },
  'Ayarlar': { en: 'Settings', ar: 'الإعدادات', de: 'Einstellungen' },
  'Bildirimler': { en: 'Notifications', ar: 'الإشعارات', de: 'Benachrichtigungen' },
  'Mesajlar': { en: 'Messages', ar: 'الرسائل', de: 'Nachrichten' },
  'Anketler': { en: 'Surveys', ar: 'الاستطلاعات', de: 'Umfragen' },
  'Tümünü Gör': { en: 'See All', ar: 'عرض الكل', de: 'Alle anzeigen' },
  'Filtrele': { en: 'Filter', ar: 'تصفية', de: 'Filtern' },
  'Gönder': { en: 'Submit', ar: 'إرسال', de: 'Senden' },
  'Yükleniyor...': { en: 'Loading...', ar: 'جار التحميل...', de: 'Wird geladen...' }
};

export const getLanguage = () => {
  if (typeof window === 'undefined') return 'tr';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && VALID_CODES.includes(saved)) return saved;
    const storeLang = useAppStore.getState?.()?.language;
    if (storeLang && VALID_CODES.includes(storeLang)) return storeLang;
  } catch (_) {}
  return 'tr';
};

let currentLanguage = getLanguage();

export const applyLiveDOMLocalization = (lang = currentLanguage) => {
  if (typeof document === 'undefined' || !document.body) return;
  try {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      const parentTag = node.parentElement?.tagName;
      if (parentTag === 'SCRIPT' || parentTag === 'STYLE' || parentTag === 'TEXTAREA' || parentTag === 'CODE') continue;
      const raw = node.nodeValue || '';
      const trimmed = raw.trim();
      if (!trimmed) continue;

      if (node.__iesuOrigTr === undefined && UI_PHRASE_MAP[trimmed]) {
        node.__iesuOrigTr = trimmed;
      }
      const origTr = node.__iesuOrigTr;
      if (origTr && UI_PHRASE_MAP[origTr]) {
        const targetText = lang === 'tr' ? origTr : (UI_PHRASE_MAP[origTr][lang] || origTr);
        const nextVal = raw.replace(trimmed, targetText);
        if (node.nodeValue !== nextVal) {
          node.nodeValue = nextVal;
        }
      }
    }
  } catch (_) {}
};

const applyDocumentDirection = (lang) => {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(() => applyLiveDOMLocalization(lang));
    }
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
    const store = useAppStore.getState?.();
    if (store && store.language !== safeLang) {
      useAppStore.setState({ language: safeLang, lang: safeLang });
    }
  } catch (_) {}

  try {
    eventBus.emit('language:changed', { 
      language: safeLang, 
      dir: safeLang === 'ar' ? 'rtl' : 'ltr',
      isRtl: safeLang === 'ar'
    });
    eventBus.emit('i18n:languageChanged', { language: safeLang });
  } catch (_) {}

  return safeLang;
};

// Auto-apply direction on module load
applyDocumentDirection(currentLanguage);

if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
  let rafId = null;
  const observer = new MutationObserver(() => {
    if (currentLanguage === 'tr') return;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => applyLiveDOMLocalization(currentLanguage));
  });
  if (document?.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    });
  }
}

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
  VALID_CODES,
  UI_PHRASE_MAP,
  applyLiveDOMLocalization,
  translations,
  formatDate,
  formatCurrency,
  formatNumber,
  formatRelativeTime,
  TAXONOMY,
  translateTaxonomy
};
