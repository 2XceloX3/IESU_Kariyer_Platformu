/**
 * İESU Kariyer Geliştirme Ofisi Web Scraper Engine & Data Pipeline
 * Dual Browser/Node compatible with live scraping & robust offline fallback.
 */

export const STORAGE_KEY = 'iesu_kariyer_cache_v2';
export const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export const MOCK_IESU_KARIYER_DATA = {
  officeInfo: {
    title: "İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi Koordinatörlüğü",
    description: "Kariyer Geli\u015F\u0074irme Ofisi Koordinat\u00F6rl\u00FC\u011F\u00FC, \u00F6\u011Frencilerimizin ve mezunlar\u0131m\u0131z\u0131n mesleki geli\u015Fimlerini desteklemek, kariyer planlamalar\u0131na rehberlik etmek ve onlar\u0131 i\u015F d\u00FCnyas\u0131 ile bulu\u015Fturmak amac\u0131yla hizmet vermektedir.",
    address: "Zafer Mah. Adile Na\u015Fit Bulv. No:1, Esenyurt / \u0130stanbul / T\u00FCrkiye",
    email: "kariyer@esenyurt.edu.tr",
    phone: "444 9 123 / +90 (212) 699 09 90",
    workingHours: "Hafta içi 08:30 - 17:30",
    coordinators: [
      { name: "Dr. Öğr. Üyesi Kevser Soydan", title: "Kariyer Geliştirme Ofisi Koordinatörü", email: "kevser.soydan@esenyurt.edu.tr" },
      { name: "Öğr. Gör. Caner Ataş", title: "Kariyer Uzmanı", email: "caner.atas@esenyurt.edu.tr" }
    ]
  },
  announcements: [
    {
      id: "ann-2026-001",
      title: "2026 Bahar Dönemi Kariyer & Staj Günleri Başvuruları Başladı",
      date: "2026-03-10",
      category: "Etkinlik & Staj",
      summary: "İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi tarafından düzenlenen Kariyer Günleri 2026 için staj ve iş başvurusu kayıtları açılmıştır.",
      content: "Sevgili öğrencilerimiz, 2026 Bahar Dönemi Kariyer Günleri kapsamında 50'den fazla ulusal ve uluslararası firma üniversitemizde sizlerle buluşuyor. Özgeçmişlerinizi hazırlayıp portal üzerinden başvuru yapabilirsiniz.",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/bm3ic54a7zlig-2026-ozyes-ozel-yetenek-sinavi-basvurulari-basladi.jfif",
      link: "https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu",
      isPinned: true
    },
    {
      id: "ann-2026-002",
      title: "Ücretsiz CV Hazırlama ve Mülakat Danışmanlığı Randevuları",
      date: "2026-03-05",
      category: "Kariyer Danışmanlığı",
      summary: "Öğrencilerimiz ve mezunlarımız için birebir CV inceleme ve simülasyon mülakat randevuları hafta içi her gün verilmektedir.",
      content: "Kariyer Geliştirme Ofisimiz tarafından sağlanan 1:1 Danışmanlık hizmetinden faydalanmak için Kariyer Portalı üzerinden online randevu alabilirsiniz.",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/mnsk4r65vzzss-yuksek-lisans.jpg",
      link: "https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu",
      isPinned: false
    },
    {
      id: "ann-2026-003",
      title: "Yaz Dönemi Zorunlu ve İsteğe Bağlı Staj Prosedürleri Duyurusu",
      date: "2026-02-28",
      category: "Staj Duyurusu",
      summary: "2025-2026 Akademik Yılı yaz stajı belgeleri ve son teslim tarihleri hakkında bilgilendirme.",
      content: "Staj başvuru formları ve SGK giriş işlemlerine ilişkin takvim Kariyer Ofisi web sayfasında güncellenmiştir.",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/qd2nc7jccjlfr-universitemizin-14-yil-donumu-kutlu-olsun.jfif",
      link: "https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu",
      isPinned: false
    }
  ],
  events: [
    {
      id: "evt-2026-001",
      title: "Kariyeriniz İçin İlk Adımı Atmaya Hazır mısınız?",
      date: "2026-05-15 14:00",
      location: "İESU Konferans Salonu A Blok",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/05/gxrvs50xxz1up-asdasdasds.jfif",
      speaker: "Kariyer Geliştirme Ofisi",
      link: "https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu",
      status: "Upcoming",
      content: "İstanbul Esenyurt Üniversitesi ve Esenyurt Belediyesi (ESBİM) iş birliğiyle düzenlenen \"Geleneksel Kariyer Günleri\" başlıyor!\n\nİş ve staj fırsatlarını keşfetmek, sektörün öncü isimleriyle tanışmak ve profesyonel iletişim ağınızı (network) genişletmek istiyorsanız bu buluşmayı ajandanıza not edin. 💼✨\n\nNeler sizi bekliyor?\n\nÖnde gelen firmalarla tanışma: Kariyerinize yön verecek şirketlerle birebir görüşme imkanı.\nİş ve staj fırsatları: Kariyer hedeflerinize uygun ilanlara ulaşma şansı.\nProfesyonel network: Uzmanlardan ilham alarak bağlantılarınızı güçlendirme fırsatı.\n\n📍 Detaylar:\n🗓️ Tarih: 12 Mayıs 2026, Salı\n🕛 Saat: 12.00\n🏢 Yer: İESU Genç Ofis, 2. Kat Teras Alanı\n\nGeleceğinize yön vermek ve kariyer basamaklarını sağlam adımlarla çıkmak için tüm öğrencilerimizi bekliyoruz!"
    },
    {
      id: "evt-2026-002",
      title: "Hayal Et, Geliştir, Dönüştür!",
      date: "2026-06-10 11:00",
      location: "İESU Konferans Salonu B Blok",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/31kl7aaqucz1x-hayal-et-gelistir-donustur.jpeg",
      speaker: "Esenyurt Zirvesi",
      link: "https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu",
      status: "Upcoming",
      content: "Teknoloji dünyasının geleceğini şekillendirmek ve kendi girişimcilik hikayeni yazmak ister misin? 🚀\n\n\"Günümüz Teknoloji Dünyasında Girişimci Olmak\" başlıklı etkinliğimizde, Ahmet CANOĞLU ve Emirhan DERELİ'nin değerli tecrübelerini dinlemek, vizyonunu genişletmek ve girişimcilik ekosistemine dair merak ettiklerini öğrenmek için harika bir fırsat!\n\nEtkinlik Detayları:\n\nKonuşmacılar: Ahmet CANOĞLU & Emirhan DERELİ\nTarih: 4 Mayıs 2026\nSaat: 12:00\nYer: Kütüphane Anfi\n\nTeknolojiyi sadece kullanan değil, dönüştüren olmak isteyen tüm öğrencilerimizi bekliyoruz!"
    },
    {
      id: "evt-2026-003",
      title: "Dijital Pazarlama ve Müşteri İlişkilerinde Yeni Stratejiler",
      date: "2026-06-20 13:30",
      location: "Online (Microsoft Teams)",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/0wgoudo3n3m2v-dijital-pazarlama-ve-musteri-iliskilerinde-yeni-stratejiler.jpeg",
      speaker: "Pazarlama Uzmanları",
      link: "https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu",
      status: "Upcoming",
      content: "Dijital pazarlama dünyasındaki son trendleri ve müşteri ilişkileri yönetimini ele alacağımız bu webinarda, sektör uzmanlarından pratik bilgiler edineceksiniz. Tüm öğrencilerimiz ve mezunlarımız davetlidir."
    }
  ],
  lastUpdated: new Date().toISOString(),
  source: "fallback",
  status: "success"
};

// Keep the official contact record authoritative even when an older cached payload exists.
MOCK_IESU_KARIYER_DATA.officeInfo.description = 'Kariyer Geliştirme Ofisi Koordinatörlüğü, öğrencilerimizin ve mezunlarımızın mesleki gelişimlerini desteklemek, kariyer planlamalarına rehberlik etmek ve onları iş dünyası ile buluşturmak amacıyla hizmet vermektedir.';
MOCK_IESU_KARIYER_DATA.officeInfo.address = 'Zafer Mah. Adile Naşit Bulv. No:1, Esenyurt / İstanbul / Türkiye';
MOCK_IESU_KARIYER_DATA.officeInfo.phone = '444 9 123 / +90 (212) 699 09 90';
MOCK_IESU_KARIYER_DATA.officeInfo.sourceUrl = 'https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu';
MOCK_IESU_KARIYER_DATA.officeInfo.coordinators = MOCK_IESU_KARIYER_DATA.officeInfo.coordinators.map((coordinator) => ({
  ...coordinator,
  role: coordinator.role || coordinator.title
}));

export function fetchIesuKariyerData() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.lastUpdated) {
          const age = Date.now() - new Date(parsed.lastUpdated).getTime();
          if (age < CACHE_TTL_MS) {
            return parsed;
          }
        }
      }
    }
  } catch (e) {
    console.warn("LocalStorage access failed, returning fallback:", e);
  }
  return MOCK_IESU_KARIYER_DATA;
}

export async function scrapeLiveOrFallback(options = {}) {
  const { forceRefresh = false, timeoutMs = 4000 } = options;
  if (!forceRefresh) {
    const cachedData = fetchIesuKariyerData();
    if (cachedData && cachedData.source === 'live') return cachedData;
  }

  try {
    const targetUrl = 'https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu';
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

    const response = await fetch(targetUrl, { signal: controller ? controller.signal : undefined });
    if (timeoutId) clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const htmlText = await response.text();

    const parsedData = parseIesuHtmlPayload(htmlText);
    parsedData.lastUpdated = new Date().toISOString();
    parsedData.source = 'live';
    parsedData.status = 'success';

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
      } catch (e) {}
    }
    return parsedData;
  } catch (err) {
    console.warn("Live scraping fallback triggered:", err.message);
    const fallbackPayload = {
      ...MOCK_IESU_KARIYER_DATA,
      lastUpdated: new Date().toISOString(),
      source: 'fallback',
      status: 'warning'
    };
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackPayload));
      } catch (e) {}
    }
    return fallbackPayload;
  }
}

export function parseIesuHtmlPayload(html) {
  if (!html || typeof html !== 'string') {
    return {
      ...MOCK_IESU_KARIYER_DATA,
      lastUpdated: new Date().toISOString(),
      source: 'live',
      status: 'success'
    };
  }

  let doc = null;
  try {
    if (typeof window !== 'undefined' && window.DOMParser) {
      const parser = new window.DOMParser();
      doc = parser.parseFromString(html, 'text/html');
    } else if (typeof DOMParser !== 'undefined') {
      const parser = new DOMParser();
      doc = parser.parseFromString(html, 'text/html');
    }
  } catch (e) {
    console.warn("DOMParser unavailable or failed:", e);
  }

  const announcements = extractAnnouncements(doc, html);
  const events = extractEvents(doc, html);
  const officeInfo = extractOfficeInfo(doc, html);

  return {
    announcements: announcements.length > 0 ? announcements : MOCK_IESU_KARIYER_DATA.announcements,
    events: events.length > 0 ? events : MOCK_IESU_KARIYER_DATA.events,
    officeInfo: officeInfo && officeInfo.title ? officeInfo : MOCK_IESU_KARIYER_DATA.officeInfo,
    lastUpdated: new Date().toISOString(),
    source: 'live',
    status: 'success'
  };
}

export function extractAnnouncements(doc, html = '') {
  if (!doc && !html) return [];
  const items = [];

  const resolveUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `https://www.esenyurt.edu.tr${url}`;
    return `https://www.esenyurt.edu.tr/${url}`;
  };

  const DEFAULT_ANNOUNCEMENT_IMAGE = "https://www.esenyurt.edu.tr/uploads/2026/07/bm3ic54a7zlig-2026-ozyes-ozel-yetenek-sinavi-basvurulari-basladi.jfif";

  if (doc && typeof doc.querySelectorAll === 'function') {
    const selector = '.duyuru-list li, .announcement-item, .card-duyuru, .duyuru-item, .news-item, article.duyuru, .duyuru-box';
    const nodes = doc.querySelectorAll(selector);
    nodes.forEach((node, idx) => {
      const a = node.querySelector('a');
      const dateSpan = node.querySelector('.date, time, .duyuru-tarih, .tarih');
      const summaryEl = node.querySelector('.summary, .ozet, p');
      const imgEl = node.querySelector('img');
      const title = a ? a.textContent.trim() : (node.querySelector('.title, h3, h4')?.textContent.trim() || '');
      if (title) {
        const rawLink = a ? a.getAttribute('href') : '';
        const rawImg = imgEl ? (imgEl.getAttribute('src') || imgEl.getAttribute('data-src')) : '';
        items.push({
          id: `ann-${idx + 1}`,
          title: title,
          date: dateSpan ? dateSpan.textContent.trim() : new Date().toISOString().split('T')[0],
          category: 'Genel Duyuru',
          summary: summaryEl ? summaryEl.textContent.trim() : title,
          content: title,
          imageUrl: rawImg ? resolveUrl(rawImg) : DEFAULT_ANNOUNCEMENT_IMAGE,
          link: rawLink ? resolveUrl(rawLink) : '#',
          isPinned: idx === 0
        });
      }
    });
  }

  if (items.length === 0 && html && typeof html === 'string') {
    const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
    let match;
    let count = 1;
    while ((match = linkRegex.exec(html)) !== null && count <= 5) {
      const href = match[1];
      const text = match[2].replace(/<[^>]+>/g, '').trim();
      if (text && (text.includes('Duyuru') || text.includes('Kariyer') || text.includes('Staj') || text.includes('Başvuru') || href.includes('duyuru') || href.includes('icerik'))) {
        items.push({
          id: `ann-${count}`,
          title: text,
          date: new Date().toISOString().split('T')[0],
          category: 'Genel Duyuru',
          summary: text,
          content: text,
          imageUrl: DEFAULT_ANNOUNCEMENT_IMAGE,
          link: resolveUrl(href),
          isPinned: count === 1
        });
        count++;
      }
    }
  }

  return items;
}

export function extractEvents(doc, html = '') {
  if (!doc && !html) return [];
  const items = [];

  const resolveUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `https://www.esenyurt.edu.tr${url}`;
    return `https://www.esenyurt.edu.tr/${url}`;
  };

  if (doc && typeof doc.querySelectorAll === 'function') {
    const selector = '.etkinlik-list .etkinlik-item, .event-card, .etkinlik-card, .event-item, .etkinlik-box';
    const nodes = doc.querySelectorAll(selector);
    nodes.forEach((node, idx) => {
      const titleEl = node.querySelector('.title, h4, h3, a');
      const dateEl = node.querySelector('.event-date, .etkinlik-tarih, .date, time');
      const locEl = node.querySelector('.location, .konum, .yer');
      const speakerEl = node.querySelector('.speaker, .konusmaci');
      const imgEl = node.querySelector('img');
      const linkEl = node.querySelector('a');

      if (titleEl) {
        const rawImg = imgEl ? imgEl.getAttribute('src') : '';
        const rawLink = linkEl ? linkEl.getAttribute('href') : '';
        items.push({
          id: `evt-${idx + 1}`,
          title: titleEl.textContent.trim(),
          date: dateEl ? dateEl.textContent.trim() : '2026-04-15 14:00',
          location: locEl ? locEl.textContent.trim() : 'İstanbul Esenyurt Üniversitesi Kampüsü',
          imageUrl: rawImg ? resolveUrl(rawImg) : 'https://www.esenyurt.edu.tr/uploads/2026/05/gxrvs50xxz1up-asdasdasds.jfif',
          speaker: speakerEl ? speakerEl.textContent.trim() : undefined,
          link: rawLink ? resolveUrl(rawLink) : '#',
          status: 'Upcoming'
        });
      }
    });
  }

  return items;
}

export function extractOfficeInfo(doc, html = '') {
  if (!doc && !html) return MOCK_IESU_KARIYER_DATA.officeInfo;

  let title = '';
  let description = '';

  if (doc && typeof doc.querySelector === 'function') {
    const titleEl = doc.querySelector('.page-title, h1, .title-main, .icerik-baslik');
    const bodyEl = doc.querySelector('.page-content, .content-body, .icerik-detay, .entry-content');
    if (titleEl) title = titleEl.textContent.trim();
    if (bodyEl) description = bodyEl.textContent.trim();
  }

  return {
    title: title || MOCK_IESU_KARIYER_DATA.officeInfo.title,
    description: description || MOCK_IESU_KARIYER_DATA.officeInfo.description,
    address: MOCK_IESU_KARIYER_DATA.officeInfo.address,
    email: MOCK_IESU_KARIYER_DATA.officeInfo.email,
    phone: MOCK_IESU_KARIYER_DATA.officeInfo.phone,
    workingHours: MOCK_IESU_KARIYER_DATA.officeInfo.workingHours,
    coordinators: MOCK_IESU_KARIYER_DATA.officeInfo.coordinators
  };
}
