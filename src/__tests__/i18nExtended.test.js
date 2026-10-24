/**
 * src/__tests__/i18nExtended.test.js
 * Comprehensive Unit & Stress Suite for IESU Multi-Language Engine (TR, EN, AR, DE)
 * Testing ICU Pluralization, RTL Support, L10n Formatters, and Taxonomy Dictionaries
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { 
  t, 
  getLanguage, 
  setLanguage, 
  SUPPORTED_LANGUAGES, 
  formatDate, 
  formatCurrency, 
  formatNumber, 
  formatRelativeTime,
  translateTaxonomy,
  TAXONOMY
} from '../i18n';

describe('IESU Multi-Language Engine (i18n & L10n Suite)', () => {
  beforeEach(() => {
    localStorage.clear();
    setLanguage('tr');
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('1. Supported Languages & RTL Direction', () => {
    it('supports 4 official languages: TR, EN, AR, DE', () => {
      const codes = SUPPORTED_LANGUAGES.map(l => l.code);
      expect(codes).toEqual(['tr', 'en', 'ar', 'de']);
    });

    it('sets RTL direction on documentElement when Arabic is activated', () => {
      setLanguage('ar');
      expect(getLanguage()).toBe('ar');
      if (typeof document !== 'undefined') {
        expect(document.documentElement.dir).toBe('rtl');
        expect(document.documentElement.lang).toBe('ar');
      }

      setLanguage('tr');
      expect(getLanguage()).toBe('tr');
      if (typeof document !== 'undefined') {
        expect(document.documentElement.dir).toBe('ltr');
        expect(document.documentElement.lang).toBe('tr');
      }
    });

    it('falls back to Turkish on invalid language code', () => {
      const lang = setLanguage('invalid_code_xyz');
      expect(lang).toBe('tr');
      expect(getLanguage()).toBe('tr');
    });
  });

  describe('2. ICU Pluralization & MessageFormat', () => {
    it('resolves ICU plural format for =0, one, and other counts in TR', () => {
      expect(t('common.itemCount', { count: 0 }, 'tr')).toBe('Kayıt yok');
      expect(t('common.itemCount', { count: 1 }, 'tr')).toBe('1 kayıt');
      expect(t('common.itemCount', { count: 15 }, 'tr')).toBe('15 kayıt');
    });

    it('resolves ICU plural format in English', () => {
      expect(t('common.itemCount', { count: 0 }, 'en')).toBe('No records');
      expect(t('common.itemCount', { count: 1 }, 'en')).toBe('1 record');
      expect(t('common.itemCount', { count: 5 }, 'en')).toBe('5 records');
    });

    it('resolves ICU plural format in Arabic', () => {
      expect(t('common.itemCount', { count: 0 }, 'ar')).toBe('لا توجد سجلات');
      expect(t('common.itemCount', { count: 1 }, 'ar')).toBe('1 سجل');
      expect(t('common.itemCount', { count: 7 }, 'ar')).toBe('7 سجلات');
    });

    it('resolves ICU plural format in German', () => {
      expect(t('common.itemCount', { count: 0 }, 'de')).toBe('Keine Einträge');
      expect(t('common.itemCount', { count: 1 }, 'de')).toBe('1 Eintrag');
      expect(t('common.itemCount', { count: 12 }, 'de')).toBe('12 Einträge');
    });
  });

  describe('3. L10n Formatters (Date, Currency, Number, Relative Time)', () => {
    it('formats currencies according to locale standards', () => {
      const tryStr = formatCurrency(50000, 'TRY', 'tr');
      expect(tryStr).toBeDefined();

      const usdStr = formatCurrency(2500, 'USD', 'en');
      expect(usdStr).toContain('$');

      const eurStr = formatCurrency(3000, 'EUR', 'de');
      expect(eurStr).toContain('€');
    });

    it('formats dates across locales', () => {
      const sampleDate = new Date('2026-05-15T12:00:00Z');
      const trDate = formatDate(sampleDate, 'tr');
      expect(trDate).toContain('2026');
      expect(trDate).toContain('Mayıs');

      const enDate = formatDate(sampleDate, 'en');
      expect(enDate).toContain('2026');
      expect(enDate).toContain('May');
    });

    it('formats relative time for recent, minute, hour, and day deltas', () => {
      const now = Date.now();
      const justNow = new Date(now - 10 * 1000);
      const fiveMinAgo = new Date(now - 5 * 60 * 1000);
      const twoHoursAgo = new Date(now - 2 * 3600 * 1000);
      const threeDaysAgo = new Date(now - 3 * 86400 * 1000);

      expect(formatRelativeTime(justNow, 'tr')).toBe('Az önce');
      expect(formatRelativeTime(justNow, 'en')).toBe('Just now');
      expect(formatRelativeTime(justNow, 'ar')).toBe('منذ لحظات');
      expect(formatRelativeTime(justNow, 'de')).toBe('Gerade eben');

      expect(formatRelativeTime(fiveMinAgo, 'tr')).toBe('5 dakika önce');
      expect(formatRelativeTime(fiveMinAgo, 'en')).toBe('5 minutes ago');
      expect(formatRelativeTime(fiveMinAgo, 'de')).toBe('Vor 5 Minuten');

      expect(formatRelativeTime(twoHoursAgo, 'tr')).toBe('2 saat önce');
      expect(formatRelativeTime(twoHoursAgo, 'en')).toBe('2 hours ago');

      expect(formatRelativeTime(threeDaysAgo, 'tr')).toBe('3 gün önce');
      expect(formatRelativeTime(threeDaysAgo, 'en')).toBe('3 days ago');
    });
  });

  describe('4. Localized Taxonomy Dictionaries (LinkedIn-style Taxonomies)', () => {
    it('translates job titles across 4 languages', () => {
      expect(translateTaxonomy('titles', 'softwareEngineer', 'tr')).toBe('Yazılım Mühendisi');
      expect(translateTaxonomy('titles', 'softwareEngineer', 'en')).toBe('Software Engineer');
      expect(translateTaxonomy('titles', 'softwareEngineer', 'ar')).toBe('مهندس برمجيات');
      expect(translateTaxonomy('titles', 'softwareEngineer', 'de')).toBe('Softwareentwickler');

      expect(translateTaxonomy('titles', 'civilEngineer', 'tr')).toBe('İnşaat Mühendisi');
      expect(translateTaxonomy('titles', 'civilEngineer', 'de')).toBe('Bauingenieur');
    });

    it('translates skills across 4 languages', () => {
      expect(translateTaxonomy('skills', 'aiMl', 'tr')).toBe('Yapay Zeka & Makine Öğrenimi');
      expect(translateTaxonomy('skills', 'aiMl', 'en')).toBe('AI & Machine Learning');
      expect(translateTaxonomy('skills', 'aiMl', 'ar')).toBe('الذكاء الاصطناعي وتعلم الآلة');
      expect(translateTaxonomy('skills', 'aiMl', 'de')).toBe('KI & Maschinelles Lernen');
    });

    it('translates academic departments across 4 languages', () => {
      expect(translateTaxonomy('departments', 'computerEngineering', 'tr')).toBe('Bilgisayar Mühendisliği');
      expect(translateTaxonomy('departments', 'computerEngineering', 'en')).toBe('Computer Engineering');
      expect(translateTaxonomy('departments', 'computerEngineering', 'ar')).toBe('هندسة الحاسوب');
      expect(translateTaxonomy('departments', 'computerEngineering', 'de')).toBe('Informatik');
    });

    it('translates industries across 4 languages', () => {
      expect(translateTaxonomy('industries', 'technology', 'tr')).toBe('Bilişim ve Teknoloji');
      expect(translateTaxonomy('industries', 'technology', 'en')).toBe('Information Technology');
      expect(translateTaxonomy('industries', 'technology', 'ar')).toBe('تكنولوجيا المعلومات');
      expect(translateTaxonomy('industries', 'technology', 'de')).toBe('Informationstechnologie');
    });
  });
});
