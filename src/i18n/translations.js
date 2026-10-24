/**
 * src/i18n/translations.js
 * İstanbul Esenyurt Üniversitesi (İESÜ) Çok Dilli (TR / EN / AR / DE) Küresel Çeviri Sözlüğü
 *
 * Kurumsal Kurallar (AGENTS.md):
 * - Resmi Kurum Adı: İstanbul Esenyurt Üniversitesi (İESÜ)
 * - Koordinatörlük Unvanı: Kariyer Geliştirme Koordinatörlüğü
 * - Mezunlar Portalı: İESÜ Mezunlar Portalı
 */

import tr from './locales/tr';
import en from './locales/en';
import ar from './locales/ar';
import de from './locales/de';
import { TAXONOMY } from './taxonomy';

export const translations = {
  tr: {
    ...tr,
    taxonomy: {
      titles: Object.fromEntries(Object.entries(TAXONOMY.titles).map(([k, v]) => [k, v.tr])),
      skills: Object.fromEntries(Object.entries(TAXONOMY.skills).map(([k, v]) => [k, v.tr])),
      departments: Object.fromEntries(Object.entries(TAXONOMY.departments).map(([k, v]) => [k, v.tr])),
      industries: Object.fromEntries(Object.entries(TAXONOMY.industries).map(([k, v]) => [k, v.tr])),
    }
  },
  en: {
    ...en,
    taxonomy: {
      titles: Object.fromEntries(Object.entries(TAXONOMY.titles).map(([k, v]) => [k, v.en])),
      skills: Object.fromEntries(Object.entries(TAXONOMY.skills).map(([k, v]) => [k, v.en])),
      departments: Object.fromEntries(Object.entries(TAXONOMY.departments).map(([k, v]) => [k, v.en])),
      industries: Object.fromEntries(Object.entries(TAXONOMY.industries).map(([k, v]) => [k, v.en])),
    }
  },
  ar: {
    ...ar,
    taxonomy: {
      titles: Object.fromEntries(Object.entries(TAXONOMY.titles).map(([k, v]) => [k, v.ar])),
      skills: Object.fromEntries(Object.entries(TAXONOMY.skills).map(([k, v]) => [k, v.ar])),
      departments: Object.fromEntries(Object.entries(TAXONOMY.departments).map(([k, v]) => [k, v.ar])),
      industries: Object.fromEntries(Object.entries(TAXONOMY.industries).map(([k, v]) => [k, v.ar])),
    }
  },
  de: {
    ...de,
    taxonomy: {
      titles: Object.fromEntries(Object.entries(TAXONOMY.titles).map(([k, v]) => [k, v.de])),
      skills: Object.fromEntries(Object.entries(TAXONOMY.skills).map(([k, v]) => [k, v.de])),
      departments: Object.fromEntries(Object.entries(TAXONOMY.departments).map(([k, v]) => [k, v.de])),
      industries: Object.fromEntries(Object.entries(TAXONOMY.industries).map(([k, v]) => [k, v.de])),
    }
  }
};

export default translations;
