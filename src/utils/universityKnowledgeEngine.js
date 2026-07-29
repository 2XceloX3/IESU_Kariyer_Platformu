import { liveNewsData, liveAnnouncementData, liveEventData, liveSliderData } from './liveData';
import { innerPagesData } from './innerPagesData';

export const universityKnowledgeBase = {
  institution: {
    name: "İstanbul Esenyurt Üniversitesi",
    unit: "Kariyer Geliştirme Koordinatörlüğü",
    officialWebsite: "https://www.esenyurt.edu.tr/",
    careerWebsite: "https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu",
    candidateWebsite: "https://aday.esenyurt.edu.tr/kontenjanlar-ve-ucretler",
    phone: "444 9 123",
    email: "kariyer@esenyurt.edu.tr",
    address: "Zafer Mahallesi, Adile Naşit Bulvarı No:1, 34513 Esenyurt / İstanbul",
    verificationStatus: "VERIFIED",
    lastSynced: new Date().toISOString()
  },
  
  categories: [
    "Haberler",
    "Duyurular",
    "Etkinlikler",
    "Staj ve Kariyer",
    "Burslar ve İndirimler",
    "Erasmus & Uluslararası",
    "Formlar ve Belgeler",
    "Sıkça Sorulan Sorular"
  ],

  searchIndex(query, categoryFilter = 'all') {
    const safeNews = Array.isArray(liveNewsData) ? liveNewsData : [];
    const safeAnnouncements = Array.isArray(liveAnnouncementData) ? liveAnnouncementData : [];
    const safeEvents = Array.isArray(liveEventData) ? liveEventData : [];

    if (!query && categoryFilter === 'all') {
      return [...safeNews, ...safeAnnouncements, ...safeEvents];
    }

    const q = (query || '').toLowerCase().trim();
    const allItems = [
      ...safeNews.map(item => ({ ...item, section: 'Haber' })),
      ...safeAnnouncements.map(item => ({ ...item, section: 'Duyuru' })),
      ...safeEvents.map(item => ({ ...item, section: 'Etkinlik' }))
    ];

    return allItems.filter(item => {
      const matchQuery = !q || 
        (item.title || '').toLowerCase().includes(q) || 
        (item.description || '').toLowerCase().includes(q) ||
        (item.content || '').toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q);

      const matchCategory = categoryFilter === 'all' || 
        (item.section || '').toLowerCase() === categoryFilter.toLowerCase() ||
        (item.category || '').toLowerCase() === categoryFilter.toLowerCase();

      return matchQuery && matchCategory;
    });
  }
};
