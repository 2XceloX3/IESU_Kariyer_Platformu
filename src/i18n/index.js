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
  // Genel & Gezinme
  'Ana Sayfa': { en: 'Home', ar: 'الرئيسية', de: 'Startseite' },
  'Ana Sayfaya Dön': { en: 'Back to Home', ar: 'العودة للرئيسية', de: 'Zurück zur Startseite' },
  'Hakkımızda': { en: 'About Us', ar: 'معلومات عنا', de: 'Über uns' },
  'Hizmetlerimiz': { en: 'Our Services', ar: 'خدماتنا', de: 'Unsere Dienste' },
  'Etkinlikler': { en: 'Events', ar: 'الفعاليات', de: 'Veranstaltungen' },
  'İletişim': { en: 'Contact', ar: 'اتصل بنا', de: 'Kontakt' },
  'Haberler & Duyurular': { en: 'News & Announcements', ar: 'الأخبار والإعلانات', de: 'News & Ankündigungen' },
  'Sistem Paneli': { en: 'System Dashboard', ar: 'لوحة النظام', de: 'System-Dashboard' },
  'Panele Dön': { en: 'Back to Panel', ar: 'العودة للوحة', de: 'Zurück zum Panel' },
  'Akışa Dön': { en: 'Back to Feed', ar: 'العودة للتغذية', de: 'Zurück zum Feed' },
  '← Akışa Dön': { en: '← Back to Feed', ar: '← العودة للتغذية', de: '← Zurück zum Feed' },
  'Geri': { en: 'Back', ar: 'رجوع', de: 'Zurück' },
  'Geri Dön': { en: 'Go Back', ar: 'رجوع', de: 'Zurückkehren' },

  // Kurumsal Başlıklar (AGENTS.md uyumlu)
  'İstanbul Esenyurt Üniversitesi': { en: 'Istanbul Esenyurt University', ar: 'جامعة إسطنبول أسنيورت', de: 'Istanbul Esenyurt Universität' },
  'Kariyer Geliştirme Koordinatörlüğü': { en: 'Career Development Coordination', ar: 'منسقية التطوير المهني', de: 'Koordination für Karriereentwicklung' },
  'Kariyer Geliştirme Merkezi': { en: 'Career Development Center', ar: 'مركز التطوير المهني', de: 'Karriereentwicklungszentrum' },
  'İESÜ Mezunlar Portalı': { en: 'IESU Alumni Portal', ar: 'بوابة خريجي İESÜ', de: 'IESU Alumni-Portal' },
  '🎓 ÖĞRENCİ AĞI & KARİYER PORTALI': { en: '🎓 STUDENT NETWORK & CAREER PORTAL', ar: '🎓 شبكة الطلاب وبوابة المهنة', de: '🎓 STUDENTENNETZWERK & KARRIEREPORTAL' },
  'ÖĞRENCİ AĞI & KARİYER PORTALI': { en: 'STUDENT NETWORK & CAREER PORTAL', ar: 'شبكة الطلاب وبوابة المهنة', de: 'STUDENTENNETZWERK & KARRIEREPORTAL' },
  '🎓 MEZUN AĞI & KARİYER PORTALI': { en: '🎓 ALUMNI NETWORK & CAREER PORTAL', ar: '🎓 شبكة الخريجين وبوابة المهنة', de: '🎓 ALUMNINETZWERK & KARRIEREPORTAL' },
  'MEZUN AĞI & KARİYER PORTALI': { en: 'ALUMNI NETWORK & CAREER PORTAL', ar: 'شبكة الخريجين وبوابة المهنة', de: 'ALUMNINETZWERK & KARRIEREPORTAL' },
  '🏢 KURUMSAL İŞVEREN & SANAYİ PORTALI': { en: '🏢 CORPORATE EMPLOYER & INDUSTRY PORTAL', ar: '🏢 بوابة الشركات والصناعة', de: '🏢 UNTERNEHMENS- & INDUSTRIEPORTAL' },
  '🏛️ AKADEMİK PERSONEL & AR-GE PORTALI': { en: '🏛️ ACADEMIC STAFF & R&D PORTAL', ar: '🏛️ بوابة الهيئة الأكاديمية والبحث العلمي', de: '🏛️ AKADEMISCHES & F&E-PORTAL' },

  // Kovanlar & Roller
  'Öğrenci Kovanı': { en: 'Student Hive', ar: 'خلية الطلاب', de: 'Studenten-Portal' },
  'Mezun Kovanı': { en: 'Alumni Hive', ar: 'خلية الخريجين', de: 'Alumni-Portal' },
  'Şirket Kovanı': { en: 'Company Hive', ar: 'خلية الشركات', de: 'Unternehmens-Portal' },
  'Akademik Kovan': { en: 'Academic Hive', ar: 'الخلية الأكاديمية', de: 'Akademisches Portal' },
  'Yönetim Paneli': { en: 'Admin Dashboard', ar: 'لوحة الإدارة', de: 'Admin-Konsole' },
  'Yönetici Akışı': { en: 'Admin Feed', ar: 'تغذية المشرف', de: 'Admin-Feed' },
  'Kampüs Akışı': { en: 'Campus Feed', ar: 'نبض الحرم الجامعي', de: 'Campus-Feed' },
  'Akış': { en: 'Feed', ar: 'التغذية', de: 'Feed' },
  'Öğrenci': { en: 'Student', ar: 'طالب', de: 'Student' },
  'Mezun': { en: 'Alumni', ar: 'خريج', de: 'Alumni' },
  'İşveren': { en: 'Employer', ar: 'صاحب عمل', de: 'Arbeitgeber' },
  'Firma': { en: 'Company', ar: 'شركة', de: 'Unternehmen' },
  'Akademik': { en: 'Academic', ar: 'أكاديمي', de: 'Akademisch' },
  'Akademisyen': { en: 'Academician', ar: 'أكاديمي', de: 'Akademiker' },
  'Süper Yönetici': { en: 'Super Admin', ar: 'المشرف العام', de: 'Super-Administrator' },

  // Giriş & e-Devlet
  'Portala Giriş Yapın': { en: 'Sign In to Portal', ar: 'تسجيل الدخول إلى البوابة', de: 'Im Portal anmelden' },
  'Giriş Yap': { en: 'Sign In', ar: 'تسجيل الدخول', de: 'Anmelden' },
  'Giriş Yapılıyor...': { en: 'Signing In...', ar: 'جار تسجيل الدخول...', de: 'Anmeldung läuft...' },
  'Çıkış Yap': { en: 'Sign Out', ar: 'تسجيل الخروج', de: 'Abmelden' },
  'Beni Hatırla': { en: 'Remember Me', ar: 'تذكرني', de: 'Angemeldet bleiben' },
  'Şifremi Unuttum': { en: 'Forgot Password', ar: 'نسيت كلمة المرور', de: 'Passwort vergessen' },
  'İlk Kez Mi Giriyorsunuz?': { en: 'First Time Signing In?', ar: 'هل تسجل الدخول لأول مرة؟', de: 'Zum ersten Mal hier?' },
  'Hesabımı Aktifleştir': { en: 'Activate My Account', ar: 'تفعيل حسابي', de: 'Konto aktivieren' },
  'Firma Kaydı Oluştur': { en: 'Create Company Account', ar: 'إنشاء حساب شركة', de: 'Unternehmenskonto erstellen' },
  'e-Devlet Kapısı ile Giriş': { en: 'Sign In with e-Government Gateway', ar: 'الدخول عبر بوابة الحكومة الإلكترونية', de: 'Anmelden über e-Devlet Gateway' },
  'e-Devlet ile Giriş': { en: 'Sign In with e-Devlet', ar: 'الدخول عبر الحكومة الإلكترونية', de: 'Mit e-Devlet anmelden' },
  'veya': { en: 'or', ar: 'أو', de: 'oder' },

  // Akış, Sekmeler & Sosyal Etkileşim
  'Senin İçin': { en: 'For You', ar: 'لك', de: 'Für dich' },
  'Takip Edilenler': { en: 'Following', ar: 'المتابَعون', de: 'Gefolgt' },
  'Ağım': { en: 'My Network', ar: 'شبكتي', de: 'Mein Netzwerk' },
  'Kulüpler & Kampüs': { en: 'Clubs & Campus', ar: 'الأندية والحرم الجامعي', de: 'Clubs & Campus' },
  'Keşfet': { en: 'Explore', ar: 'استكشاف', de: 'Entdecken' },
  'Keşfet & Sosyal Ağ': { en: 'Explore & Social Network', ar: 'الاستكشاف والشبكة الاجتماعية', de: 'Entdecken & Soziales Netzwerk' },
  'Kampüs & Kulüp Vitrini': { en: 'Campus & Club Showcase', ar: 'واجهة الحرم والأندية', de: 'Campus- & Club-Schaufenster' },
  'Gönderi Paylaş & Düzenle': { en: 'Share & Edit Post', ar: 'مشاركة وتعديل المنشور', de: 'Beitrag teilen & bearbeiten' },
  'Beğen': { en: 'Like', ar: 'إعجاب', de: 'Gefällt mir' },
  'Yorum Yap': { en: 'Comment', ar: 'تعليق', de: 'Kommentieren' },
  'Paylaş': { en: 'Share', ar: 'مشاركة', de: 'Teilen' },
  'Kaydet': { en: 'Save', ar: 'حفظ', de: 'Speichern' },
  'Takip Et': { en: 'Follow', ar: 'متابعة', de: 'Folgen' },
  'Takip Ediliyor': { en: 'Following', ar: 'تتم المتابعة', de: 'Gefolgt' },

  // Kariyer, Staj, Mavi & Beyaz Yaka, YÖK & Sanayi İş Birlikleri
  'Kariyer & Gelişim Araçları': { en: 'Career & Development Tools', ar: 'أدوات المهنة والتطوير', de: 'Karriere- & Entwicklungstools' },
  'İş & Staj İlanları': { en: 'Jobs & Internships', ar: 'فرص العمل والتدريب', de: 'Jobs & Praktika' },
  'İlanlar': { en: 'Job Listings', ar: 'الوظائف', de: 'Stellenangebote' },
  'Öğrenci Kulüpleri': { en: 'Student Clubs', ar: 'الأندية الطلابية', de: 'Studentenclubs' },
  'Kulüpler': { en: 'Clubs', ar: 'الأندية', de: 'Clubs' },
  'Mezunlar Derneği': { en: 'Alumni Association', ar: 'جمعية الخريجين', de: 'Alumni-Vereinigung' },
  'Birlik Ağı': { en: 'Unity Network', ar: 'شبكة الاتحاد', de: 'Einheitsnetzwerk' },
  'Mezun Bilgi Sistemi': { en: 'Alumni Information System', ar: 'نظام معلومات الخريجين', de: 'Alumni-Informationssystem' },
  'Mezun Bilgi Sistemi (MBS)': { en: 'Alumni Info System (MBS)', ar: 'نظام معلومات الخريجين (MBS)', de: 'Alumni-Infosystem (MBS)' },
  'Kariyer Check-Up': { en: 'Career Check-Up', ar: 'فحص المسار المهني', de: 'Karriere-Check-Up' },
  'Dijital Mezun Kartı': { en: 'Digital Alumni Card', ar: 'بطاقة الخريج الرقمية', de: 'Digitale Alumni-Karte' },
  'Mezun Kartı': { en: 'Alumni Card', ar: 'بطاقة الخريج', de: 'Alumni-Karte' },
  'Küresel Harita': { en: 'Global Map', ar: 'الخريطة العالمية', de: 'Globale Karte' },
  'Özgeçmiş Hazırlayıcı': { en: 'Resume Builder', ar: 'منشئ السيرة الذاتية', de: 'Lebenslauf-Generator' },
  'CV Oluşturucu': { en: 'CV Builder', ar: 'منشئ السيرة الذاتية', de: 'CV-Generator' },
  'Mülakat Simülasyonu': { en: 'Interview Simulator', ar: 'محاكي المقابلات', de: 'Interview-Simulator' },
  'Kariyer Yol Haritası': { en: 'Career Roadmap', ar: 'خارطة الطريق المهنية', de: 'Karriere-Roadmap' },
  'Başvuru Radarı': { en: 'Application Radar', ar: 'رادار الطلبات', de: 'Bewerbungsradar' },
  'Mentorluk': { en: 'Mentorship', ar: 'الإرشاد المهني', de: 'Mentoring' },
  'Mentor Olun': { en: 'Become a Mentor', ar: 'كن مرشداً', de: 'Mentor werden' },
  'Mentorluk Başvurusu Yap': { en: 'Apply for Mentorship', ar: 'التقدم للإرشاد', de: 'Als Mentor bewerben' },
  '15 Dk Kahve Sohbeti': { en: '15-Min Coffee Chat', ar: 'جلسة قهوة ١٥ دقيقة', de: '15-Min Kaffee-Chat' },
  'Randevuları Yönet': { en: 'Manage Appointments', ar: 'إدارة المواعيد', de: 'Termine verwalten' },
  'Aday Takip (ATS)': { en: 'Applicant Tracking (ATS)', ar: 'تتبع المتقدمين (ATS)', de: 'Bewerbermanagement (ATS)' },
  'İlan Oluştur': { en: 'Create Job Post', ar: 'إنشاء إعلان وظيفة', de: 'Stellenanzeige erstellen' },
  'Kurumsal Protokoller': { en: 'Corporate Protocols', ar: 'البروتوكولات المؤسسية', de: 'Unternehmensprotokolle' },
  'Zorunlu Staj Onayları': { en: 'Mandatory Internship Approvals', ar: 'موافقات التدريب الإلزامي', de: 'Pflichtpraktikum-Freigaben' },
  'Akademik Danışmanlık': { en: 'Academic Advising', ar: 'الإرشاد الأكاديمي', de: 'Akademische Beratung' },
  'Araştırma Laboratuvarları': { en: 'Research Labs', ar: 'مختبرات الأبحاث', de: 'Forschungslabore' },
  'Denetim Kayıtları': { en: 'Audit Trail Logs', ar: 'سجلات التدقيق', de: 'Prüfprotokolle (Audit)' },
  'KGM Haberleri': { en: 'CDC News', ar: 'أخبار المركز المهني', de: 'KGM-Nachrichten' },
  'Canlı': { en: 'Live', ar: 'مباشر', de: 'Live' },
  'Tümü': { en: 'All', ar: 'الكل', de: 'Alle' },
  'Kulüpler & Etkinlikler': { en: 'Clubs & Events', ar: 'الأندية والفعاليات', de: 'Clubs & Events' },
  'Kariyer & Staj': { en: 'Career & Internship', ar: 'المهنة والتدريب', de: 'Karriere & Praktikum' },
  'Öğrenci Projeleri': { en: 'Student Projects', ar: 'مشاريع الطلاب', de: 'Studentenprojekte' },
  'Mezun Başarıları': { en: 'Alumni Success', ar: 'نجاحات الخريجين', de: 'Alumni-Erfolge' },
  'Kampüs Yaşamı': { en: 'Campus Life', ar: 'الحياة الجامعية', de: 'Campusleben' },

  // Durumlar & Eylemler
  'Onay Bekliyor': { en: 'Pending Approval', ar: 'بانتظار الموافقة', de: 'Wartet auf Freigabe' },
  'Beklemede': { en: 'Pending', ar: 'قيد الانتظار', de: 'Ausstehend' },
  'Onaylandı': { en: 'Approved', ar: 'تمت الموافقة', de: 'Genehmigt' },
  'Reddedildi': { en: 'Rejected', ar: 'مرفوض', de: 'Abgelehnt' },
  'Yayında': { en: 'Published', ar: 'منشور', de: 'Veröffentlicht' },
  'Aktif': { en: 'Active', ar: 'نشط', de: 'Aktiv' },
  'Başvur': { en: 'Apply Now', ar: 'تقدم الآن', de: 'Jetzt bewerben' },
  'Hemen Başvur': { en: 'Apply Now', ar: 'تقدم فوراً', de: 'Sofort bewerben' },
  'Başvuruldu': { en: 'Applied', ar: 'تم التقديم', de: 'Beworben' },
  'Kulübe Katıl': { en: 'Join Club', ar: 'انضم للنادي', de: 'Club beitreten' },
  'Kulüpten Ayrıl': { en: 'Leave Club', ar: 'مغادرة النادي', de: 'Club verlassen' },
  'İptal': { en: 'Cancel', ar: 'إلغاء', de: 'Abbrechen' },
  'Kapat': { en: 'Close', ar: 'إغلاق', de: 'Schließen' },
  'Düzenle': { en: 'Edit', ar: 'تعديل', de: 'Bearbeiten' },
  'Sil': { en: 'Delete', ar: 'حذف', de: 'Löschen' },
  'Onayla': { en: 'Approve', ar: 'موافقة', de: 'Genehmigen' },
  'Reddet': { en: 'Reject', ar: 'رفض', de: 'Ablehnen' },
  'Profilim': { en: 'My Profile', ar: 'ملفي الشخصي', de: 'Mein Profil' },
  'Profilimi Görüntüle': { en: 'View My Profile', ar: 'عرض ملفي الشخصي', de: 'Mein Profil ansehen' },
  'Mezun Profilimi Görüntüle': { en: 'View Alumni Profile', ar: 'عرض ملف الخريج', de: 'Alumni-Profil ansehen' },
  'Ayarlar': { en: 'Settings', ar: 'الإعدادات', de: 'Einstellungen' },
  'Bildirimler': { en: 'Notifications', ar: 'الإشعارات', de: 'Benachrichtigungen' },
  'Mesajlar': { en: 'Messages', ar: 'الرسائل', de: 'Nachrichten' },
  'Anketler': { en: 'Surveys', ar: 'الاستطلاعات', de: 'Umfragen' },
  'Tümünü Gör': { en: 'See All', ar: 'عرض الكل', de: 'Alle anzeigen' },
  'Filtrele': { en: 'Filter', ar: 'تصفية', de: 'Filtern' },
  'Gönder': { en: 'Submit', ar: 'إرسال', de: 'Senden' },
  'Yükleniyor...': { en: 'Loading...', ar: 'جار التحميل...', de: 'Wird geladen...' },
  'Hakkımızda': { en: 'About Us', ar: 'من نحن', de: 'Über uns' },
  'Erişilebilirlik': { en: 'Accessibility', ar: 'إمكانية الوصول', de: 'Barrierefreiheit' },
  'Yardım Merkezi': { en: 'Help Center', ar: 'مركز المساعدة', de: 'Hilfezentrum' },
  'Gizlilik ve Şartlar': { en: 'Privacy & Terms', ar: 'الخصوصية والشروط', de: 'Datenschutz & AGB' },
  'Kariyer': { en: 'Careers', ar: 'الوظائف', de: 'Karriere' },
  'Şifre': { en: 'Password', ar: 'كلمة المرور', de: 'Passwort' },
  'E-posta veya kullanıcı adı': { en: 'Email or username', ar: 'البريد الإلكتروني أو اسم المستخدم', de: 'E-Mail oder Benutzername' },
  'Kullanıcı Adı / E-Posta': { en: 'Username / Email', ar: 'اسم المستخدم / البريد الإلكتروني', de: 'Benutzername / E-Mail' },
  'Kulüp, etkinlik veya konu ara...': { en: 'Search clubs, events or topics...', ar: 'ابحث عن نادٍ أو فعالية أو موضوع...', de: 'Clubs, Events oder Themen suchen...' }
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
    // 1. Text Nodes
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

    // 2. Attributes (placeholder, title)
    const attrElements = document.body.querySelectorAll('[placeholder], [title]');
    attrElements.forEach((el) => {
      ['placeholder', 'title'].forEach((attr) => {
        const val = el.getAttribute(attr);
        if (!val) return;
        const propKey = `__iesuOrigAttr_${attr}`;
        const trimmed = val.trim();
        if (el[propKey] === undefined && UI_PHRASE_MAP[trimmed]) {
          el[propKey] = trimmed;
        }
        const origTr = el[propKey];
        if (origTr && UI_PHRASE_MAP[origTr]) {
          const targetText = lang === 'tr' ? origTr : (UI_PHRASE_MAP[origTr][lang] || origTr);
          if (el.getAttribute(attr) !== targetText) {
            el.setAttribute(attr, targetText);
          }
        }
      });
    });
  } catch (_) {}
};

const applyDocumentDirection = (lang) => {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(() => applyLiveDOMLocalization(lang));
    } else {
      applyLiveDOMLocalization(lang);
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
