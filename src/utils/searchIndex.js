/**
 * IESU Platform — Universal Search Index
 * Tüm bilgi tabanı içeriklerini indexler ve arama yapar.
 */

import newsData from '../data/knowledge_base/news.json';
import announcementsData from '../data/knowledge_base/announcements.json';
import kariyerData from '../data/knowledge_base/kariyer_data.json';
import universityData from '../data/knowledge_base/university_data.json';

// ─── INDEX OLUŞTUR ────────────────────────────────────────────────────────────
function buildIndex() {
  const index = [];

  // Haberler
  (newsData.items || []).forEach(item => {
    index.push({
      id: item.id,
      type: 'haber',
      typeLabel: '📰 Haber',
      title: item.title,
      summary: item.summary || item.content?.slice(0, 150),
      content: item.content || '',
      date: item.date,
      category: item.category,
      tags: item.tags || [],
      imageUrl: item.imageUrl,
      sourceUrl: item.sourceUrl,
      verificationStatus: item.verificationStatus,
      searchText: [item.title, item.summary, item.content, ...(item.tags || [])].join(' ').toLowerCase(),
    });
  });

  // Duyurular
  (announcementsData.items || []).forEach(item => {
    index.push({
      id: item.id,
      type: 'duyuru',
      typeLabel: '📢 Duyuru',
      title: item.title,
      summary: item.summary || item.content?.slice(0, 150),
      content: item.content || '',
      date: item.date,
      category: item.category,
      tags: item.tags || [],
      attachments: item.attachments || [],
      applicationUrl: item.applicationUrl,
      sourceUrl: item.sourceUrl,
      isPinned: item.isPinned,
      verificationStatus: item.verificationStatus,
      searchText: [item.title, item.summary, item.content, ...(item.tags || []), item.category].join(' ').toLowerCase(),
    });
  });

  // Kariyer Hizmetleri
  (kariyerData.kariyer_ofisi?.services || []).forEach(svc => {
    index.push({
      id: svc.id,
      type: 'kariyer_hizmet',
      typeLabel: '🎯 Kariyer Hizmeti',
      title: svc.title,
      summary: svc.description,
      content: svc.description,
      date: null,
      category: 'Kariyer',
      tags: ['kariyer', 'hizmet'],
      sourceUrl: 'https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu',
      verificationStatus: 'VERIFIED',
      searchText: [svc.title, svc.description].join(' ').toLowerCase(),
    });
  });

  // Staj İlanları
  (kariyerData.internships || []).forEach(item => {
    index.push({
      id: item.id,
      type: 'staj',
      typeLabel: '💼 Staj',
      title: item.title,
      summary: item.description,
      content: item.description,
      date: item.deadline,
      category: 'Staj',
      tags: ['staj', item.type],
      applicationUrl: item.applicationUrl,
      attachments: item.documents || [],
      requirements: item.requirements || [],
      sourceUrl: item.sourceUrl,
      verificationStatus: item.verificationStatus,
      searchText: [item.title, item.description, item.organization, item.type].join(' ').toLowerCase(),
    });
  });

  // Fakülteler
  (universityData.faculties || []).forEach(fak => {
    index.push({
      id: fak.id,
      type: 'fakulte',
      typeLabel: '🏛️ Fakülte',
      title: fak.name,
      summary: `${fak.programs?.length || 0} lisans programı`,
      content: (fak.programs || []).map(p => p.name).join(', '),
      date: null,
      category: 'Akademik',
      tags: ['fakülte', 'lisans', ...(fak.programs || []).map(p => p.name)],
      programs: fak.programs || [],
      sourceUrl: 'https://www.esenyurt.edu.tr/fakulteler',
      verificationStatus: 'VERIFIED',
      searchText: [fak.name, ...(fak.programs || []).map(p => p.name)].join(' ').toLowerCase(),
    });
  });

  // Meslek Yüksekokulları
  (universityData.vocational_schools || []).forEach(myo => {
    index.push({
      id: myo.id,
      type: 'myo',
      typeLabel: '🏫 Meslek Yüksekokulu',
      title: myo.name,
      summary: `${myo.programs?.length || 0} önlisans programı`,
      content: (myo.programs || []).map(p => p.name).join(', '),
      date: null,
      category: 'Akademik',
      tags: ['meslek yüksekokulu', 'önlisans', ...(myo.programs || []).map(p => p.name)],
      programs: myo.programs || [],
      sourceUrl: 'https://www.esenyurt.edu.tr/akademik-birimler',
      verificationStatus: 'VERIFIED',
      searchText: [myo.name, ...(myo.programs || []).map(p => p.name)].join(' ').toLowerCase(),
    });
  });

  // SEM Kursları
  if (kariyerData.sem) {
    const sem = kariyerData.sem;
    (sem.programs || []).forEach((prog, i) => {
      index.push({
        id: `SEM-${i + 1}`,
        type: 'sem',
        typeLabel: '📚 SEM Kursu',
        title: prog.type,
        summary: `${prog.format} — ${prog.registration}`,
        content: `${prog.type}: ${prog.format}. Kayıt: ${prog.registration}`,
        date: null,
        category: 'Eğitim',
        tags: ['sem', 'sertifika', 'eğitim'],
        sourceUrl: sem.sourceUrl,
        verificationStatus: 'VERIFIED',
        searchText: [prog.type, prog.format, 'sem', 'sertifika'].join(' ').toLowerCase(),
      });
    });
  }

  return index;
}

// ─── TEKİL INDEX INSTANCE ────────────────────────────────────────────────────
let _cachedIndex = null;

export function getSearchIndex() {
  if (!_cachedIndex) {
    _cachedIndex = buildIndex();
  }
  return _cachedIndex;
}

export function invalidateIndex() {
  _cachedIndex = null;
}

// ─── ARAMA FONKSİYONU ────────────────────────────────────────────────────────
export function searchKnowledgeBase(query, options = {}) {
  const {
    types = null,       // filtre: ['haber', 'duyuru', 'staj', ...]
    limit = 20,
    dateFrom = null,
    dateTo = null,
  } = options;

  if (!query || query.trim().length < 2) return [];

  const index = getSearchIndex();
  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/);

  const scored = index
    .filter(item => !types || types.includes(item.type))
    .map(item => {
      let score = 0;

      // Tam başlık eşleşmesi — en yüksek puan
      if (item.title.toLowerCase().includes(q)) score += 100;

      // Her terimi ayrı ayrı puanla
      terms.forEach(term => {
        if (item.title.toLowerCase().includes(term)) score += 30;
        if (item.summary?.toLowerCase().includes(term)) score += 20;
        if (item.tags?.some(t => t.toLowerCase().includes(term))) score += 15;
        if (item.category?.toLowerCase().includes(term)) score += 10;
        if (item.searchText?.includes(term)) score += 5;
      });

      return { ...item, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

// ─── KATEGORİ İSTATİSTİKLERİ ─────────────────────────────────────────────────
export function getIndexStats() {
  const index = getSearchIndex();
  const stats = {};
  index.forEach(item => {
    stats[item.type] = (stats[item.type] || 0) + 1;
  });
  return {
    total: index.length,
    byType: stats,
  };
}
