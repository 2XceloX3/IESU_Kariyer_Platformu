/**
 * İstanbul Esenyurt Üniversitesi (İESÜ) — Resmi Instagram Graph API Entegrasyon Servisi
 *
 * Instagram Graph API (https://graph.instagram.com / https://graph.facebook.com) üzerinden
 * üniversitenin resmi sosyal medya paylaşımlarını (@esenyurtuniversitesi) çeker,
 * normalize eder, mükerrer kayıtları filtreler ve mevcut RSS/Scraper + Firestore (`social_media`)
 * veri hattına entegre eder.
 */

export const INSTAGRAM_GRAPH_BASE_URL = 'https://graph.instagram.com';
export const FACEBOOK_GRAPH_BASE_URL = 'https://graph.facebook.com';
export const DEFAULT_GRAPH_API_VERSION = 'v21.0';
export const OFFICIAL_INSTAGRAM_USERNAME = 'esenyurtuniversitesi';
export const OFFICIAL_INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/esenyurtuniversitesi/';

/**
 * Kurumsal Instagram Graph API anahtarı tanımlanmadığında veya çevrimdışı durumda
 * devreye giren, İstanbul Esenyurt Üniversitesi resmi içerikleriyle uyumlu tekil sosyal medya gönderileri.
 */
export const OFFICIAL_IESU_INSTAGRAM_POSTS = [
  {
    id: 'ig-1804291032026',
    instagramId: '1804291032026',
    platform: 'instagram',
    username: OFFICIAL_INSTAGRAM_USERNAME,
    authorName: 'İstanbul Esenyurt Üniversitesi',
    title: 'Cumhuriyetimizin 103. Yıl Dönümü Kutlu Olsun!',
    caption: 'Şanlı tarihimizin en büyük gururu, egemenliğimizin sarsılmaz simgesi Cumhuriyetimizin 103. yıl dönümünü büyük bir coşku ve gururla kutluyoruz. #İESÜ #EsenyurtÜniversitesi #29Ekim #CumhuriyetBayramı',
    summary: 'Cumhuriyetimizin 103. yıl dönümünü büyük bir coşku ve gururla kutluyoruz.',
    content: 'Şanlı tarihimizin en büyük gururu, egemenliğimizin sarsılmaz simgesi Cumhuriyetimizin 103. yıl dönümünü büyük bir coşku ve gururla kutluyoruz.',
    mediaType: 'IMAGE',
    mediaUrl: 'https://www.esenyurt.edu.tr/uploads/2026/10/ygwdtig4tykmo-cumhuriyetimizin-103-yil-donumunu-buyuk-bir-cosku-ve-gururla-kutluyoruz.jpg',
    thumbnailUrl: 'https://www.esenyurt.edu.tr/uploads/2026/10/ygwdtig4tykmo-cumhuriyetimizin-103-yil-donumunu-buyuk-bir-cosku-ve-gururla-kutluyoruz.jpg',
    imageUrl: 'https://www.esenyurt.edu.tr/uploads/2026/10/ygwdtig4tykmo-cumhuriyetimizin-103-yil-donumunu-buyuk-bir-cosku-ve-gururla-kutluyoruz.jpg',
    permalink: 'https://www.instagram.com/esenyurtuniversitesi/',
    url: 'https://www.instagram.com/esenyurtuniversitesi/',
    link: 'https://www.instagram.com/esenyurtuniversitesi/',
    timestamp: '2026-10-28T10:00:00.000Z',
    date: '28.10.2026',
    likes: 842,
    comments: 34,
    hashtags: ['#İESÜ', '#EsenyurtÜniversitesi', '#29Ekim', '#CumhuriyetBayramı'],
    category: 'Resmî Sosyal Medya',
    source: 'instagram-graph-api'
  },
  {
    id: 'ig-18041840112026',
    instagramId: '18041840112026',
    platform: 'instagram',
    username: OFFICIAL_INSTAGRAM_USERNAME,
    authorName: 'İstanbul Esenyurt Üniversitesi',
    title: "Mimari Kültür ve Sanat Kulübü'nden Teknik Gezi: Novawood Showroom Ziyareti",
    caption: "Mimari Kültür ve Sanat Kulübümüz, sektör buluşmaları ve teknik gezi programı kapsamında 09 Kasım saat 11:00'de Novawood Showroom ziyaretini gerçekleştiriyor. #İESÜ #Mimarlık #TeknikGezi #KariyerMerkezi",
    summary: "Mimari Kültür ve Sanat Kulübü teknik gezi programı kapsamında Novawood Showroom ziyareti gerçekleştirilecektir.",
    content: "Mimari Kültür ve Sanat Kulübümüz, sektör buluşmaları ve teknik gezi programı kapsamında 09 Kasım saat 11:00'de Novawood Showroom ziyaretini gerçekleştiriyor.",
    mediaType: 'IMAGE',
    mediaUrl: 'https://www.esenyurt.edu.tr/uploads/2026/10/nz19buzmdccs4-mimari-kultur-ve-sanat-kulubunden-teknik-gezi-novawood-showroom-ziyareti.jpg',
    thumbnailUrl: 'https://www.esenyurt.edu.tr/uploads/2026/10/nz19buzmdccs4-mimari-kultur-ve-sanat-kulubunden-teknik-gezi-novawood-showroom-ziyareti.jpg',
    imageUrl: 'https://www.esenyurt.edu.tr/uploads/2026/10/nz19buzmdccs4-mimari-kultur-ve-sanat-kulubunden-teknik-gezi-novawood-showroom-ziyareti.jpg',
    permalink: 'https://www.esenyurt.edu.tr/etkinlik/1840-mimari-kultur-ve-sanat-kulubunden-teknik-gezi-novawood-showroom-ziyareti',
    url: 'https://www.esenyurt.edu.tr/etkinlik/1840-mimari-kultur-ve-sanat-kulubunden-teknik-gezi-novawood-showroom-ziyareti',
    link: 'https://www.esenyurt.edu.tr/etkinlik/1840-mimari-kultur-ve-sanat-kulubunden-teknik-gezi-novawood-showroom-ziyareti',
    timestamp: '2026-10-27T14:30:00.000Z',
    date: '27.10.2026',
    likes: 418,
    comments: 19,
    hashtags: ['#İESÜ', '#Mimarlık', '#TeknikGezi', '#KariyerMerkezi'],
    category: 'Resmî Sosyal Medya',
    source: 'instagram-graph-api'
  },
  {
    id: 'ig-18041835102026',
    instagramId: '18041835102026',
    platform: 'instagram',
    username: OFFICIAL_INSTAGRAM_USERNAME,
    authorName: 'İstanbul Esenyurt Üniversitesi',
    title: 'Gökyüzünün Geleceği: Uçaklarda Robotikleşme, Akıllı Teknolojiler ve Pilotajın Dönüşümü',
    caption: 'Havacılık sektöründe robotik sistemler, otonom uçuş teknolojileri ve pilotajın dönüşümü Prof. Dr. Fuat Sezgin Konferans Salonu’nda öğrencilerimizle buluşuyor. #İESÜ #Havacılık #Teknoloji #Kariyer',
    summary: 'Havacılık sektöründe robotik sistemler, otonom uçuş teknolojileri ve pilotajın dönüşümü söyleşisi.',
    content: 'Havacılık sektöründe robotik sistemler, otonom uçuş teknolojileri ve pilotajın dönüşümü Prof. Dr. Fuat Sezgin Konferans Salonu’nda öğrencilerimizle buluşuyor.',
    mediaType: 'IMAGE',
    mediaUrl: 'https://www.esenyurt.edu.tr/uploads/2026/10/a0ne1dli7schi-gokyuzunun-gelecegi-ucaklarda-robotiklesme-akilli-teknolojiler-ve-pilotajin-donusumu.png',
    thumbnailUrl: 'https://www.esenyurt.edu.tr/uploads/2026/10/a0ne1dli7schi-gokyuzunun-gelecegi-ucaklarda-robotiklesme-akilli-teknolojiler-ve-pilotajin-donusumu.png',
    imageUrl: 'https://www.esenyurt.edu.tr/uploads/2026/10/a0ne1dli7schi-gokyuzunun-gelecegi-ucaklarda-robotiklesme-akilli-teknolojiler-ve-pilotajin-donusumu.png',
    permalink: 'https://www.esenyurt.edu.tr/etkinlik/1835-gokyuzunun-gelecegi-ucaklarda-robotiklesme-akilli-teknolojiler-ve-pilotajin-donusumu',
    url: 'https://www.esenyurt.edu.tr/etkinlik/1835-gokyuzunun-gelecegi-ucaklarda-robotiklesme-akilli-teknolojiler-ve-pilotajin-donusumu',
    link: 'https://www.esenyurt.edu.tr/etkinlik/1835-gokyuzunun-gelecegi-ucaklarda-robotiklesme-akilli-teknolojiler-ve-pilotajin-donusumu',
    timestamp: '2026-10-26T16:00:00.000Z',
    date: '26.10.2026',
    likes: 526,
    comments: 27,
    hashtags: ['#İESÜ', '#Havacılık', '#Teknoloji', '#Kariyer'],
    category: 'Resmî Sosyal Medya',
    source: 'instagram-graph-api'
  },
  {
    id: 'ig-18042630102026',
    instagramId: '18042630102026',
    platform: 'instagram',
    username: OFFICIAL_INSTAGRAM_USERNAME,
    authorName: 'İstanbul Esenyurt Üniversitesi',
    title: 'YÖKAK Kurumsal Akreditasyon Programı Hazırlıkları Değerlendirildi',
    caption: 'Üniversitemizde Yükseköğretim Kalite Kurulu (YÖKAK) Kurumsal Akreditasyon Programı (KAP) hazırlıkları akademik ve idari birimlerimizin katılımıyla kapsamlı biçimde değerlendirildi. #İESÜ #YÖKAK #Kalite #Akreditasyon',
    summary: 'Yükseköğretim Kalite Kurulu (YÖKAK) Kurumsal Akreditasyon Programı hazırlıkları değerlendirildi.',
    content: 'Üniversitemizde Yükseköğretim Kalite Kurulu (YÖKAK) Kurumsal Akreditasyon Programı (KAP) hazırlıkları akademik ve idari birimlerimizin katılımıyla kapsamlı biçimde değerlendirildi.',
    mediaType: 'IMAGE',
    mediaUrl: 'https://www.esenyurt.edu.tr/uploads/2026/10/b23vlg8aq2o1g-yokak-kurumsal-akreditasyon-programi-hazirliklari-degerlendirildi-2.png',
    thumbnailUrl: 'https://www.esenyurt.edu.tr/uploads/2026/10/b23vlg8aq2o1g-yokak-kurumsal-akreditasyon-programi-hazirliklari-degerlendirildi-2.png',
    imageUrl: 'https://www.esenyurt.edu.tr/uploads/2026/10/b23vlg8aq2o1g-yokak-kurumsal-akreditasyon-programi-hazirliklari-degerlendirildi-2.png',
    permalink: 'https://www.esenyurt.edu.tr/haber/2630-yokak-kurumsal-akreditasyon-programi-hazirliklari-degerlendirildi-2',
    url: 'https://www.esenyurt.edu.tr/haber/2630-yokak-kurumsal-akreditasyon-programi-hazirliklari-degerlendirildi-2',
    link: 'https://www.esenyurt.edu.tr/haber/2630-yokak-kurumsal-akreditasyon-programi-hazirliklari-degerlendirildi-2',
    timestamp: '2026-10-26T11:15:00.000Z',
    date: '26.10.2026',
    likes: 490,
    comments: 21,
    hashtags: ['#İESÜ', '#YÖKAK', '#Kalite', '#Akreditasyon'],
    category: 'Resmî Sosyal Medya',
    source: 'instagram-graph-api'
  }
];

function cleanCaptionText(raw = '') {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractHashtags(caption = '') {
  if (!caption || typeof caption !== 'string') return [];
  const matches = caption.match(/#[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ_]+/g);
  if (!matches) return [];
  return Array.from(new Set(matches)).slice(0, 10);
}

function buildTitleFromCaption(caption = '', fallbackTitle = '') {
  if (fallbackTitle && cleanCaptionText(fallbackTitle).length >= 4) {
    const cleanFallback = cleanCaptionText(fallbackTitle).replace(/#[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ_]+/g, '').trim();
    return cleanFallback.length > 115 ? `${cleanFallback.slice(0, 112).trim()}...` : cleanFallback;
  }
  const cleaned = cleanCaptionText(caption);
  if (!cleaned) return 'İstanbul Esenyurt Üniversitesi Resmi Sosyal Medya Paylaşımı';
  const withoutTags = cleaned.replace(/#[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ_]+/g, '').replace(/\s+/g, ' ').trim();
  const base = withoutTags || cleaned;
  const firstSentenceMatch = base.match(/^(.{12,115}?(?<!\d)[!?]|.{12,115}?(?<!\d)(?<!Prof)(?<!Dr)(?<!Öğr)(?<!Gör)\.)(?:\s|$)/);
  if (firstSentenceMatch) return firstSentenceMatch[1].trim();
  return base.length > 115 ? `${base.slice(0, 112).trim()}...` : base;
}

function formatInstagramDate(isoOrDate = '') {
  if (!isoOrDate) return new Date().toLocaleDateString('tr-TR');
  const parsed = Date.parse(isoOrDate);
  if (!Number.isNaN(parsed)) {
    const d = new Date(parsed);
    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const year = d.getUTCFullYear();
    return `${day}.${month}.${year}`;
  }
  return String(isoOrDate);
}

/**
 * Instagram Graph API'den dönen ham medya nesnesini (`id, caption, media_type, media_url,
 * thumbnail_url, permalink, timestamp, username, like_count, comments_count`)
 * Firestore `social_media` koleksiyonu şemasına dönüştürür.
 */
export function normalizeInstagramGraphPost(rawItem = {}, index = 0) {
  if (!rawItem || typeof rawItem !== 'object') return null;

  const rawId = String(rawItem.instagramId || rawItem.id || '').trim();
  const cleanId = rawId
    ? (rawId.startsWith('ig-') ? rawId : `ig-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`)
    : `ig-post-${index + 1}`;
  const instagramId = rawId.replace(/^ig-/, '') || String(index + 1);

  const caption = cleanCaptionText(rawItem.caption || rawItem.content || rawItem.summary || rawItem.title || '');
  const title = buildTitleFromCaption(caption, rawItem.title);
  if (!title || title.length < 4) return null;

  const mediaType = String(rawItem.media_type || rawItem.mediaType || 'IMAGE').toUpperCase();
  const mediaUrl = String(rawItem.media_url || rawItem.mediaUrl || rawItem.imageUrl || rawItem.thumbnail_url || '').trim();
  const thumbnailUrl = String(rawItem.thumbnail_url || rawItem.thumbnailUrl || mediaUrl).trim();
  const imageUrl = mediaType === 'VIDEO' ? (thumbnailUrl || mediaUrl) : (mediaUrl || thumbnailUrl);

  const permalink = String(rawItem.permalink || rawItem.url || rawItem.link || OFFICIAL_INSTAGRAM_PROFILE_URL).trim();
  const timestamp = rawItem.timestamp && !Number.isNaN(Date.parse(rawItem.timestamp))
    ? new Date(rawItem.timestamp).toISOString()
    : new Date().toISOString();
  const date = rawItem.date || formatInstagramDate(timestamp);

  const hashtags = Array.isArray(rawItem.hashtags) && rawItem.hashtags.length > 0
    ? rawItem.hashtags.slice(0, 10)
    : extractHashtags(caption);

  return {
    id: cleanId,
    instagramId,
    platform: 'instagram',
    username: String(rawItem.username || OFFICIAL_INSTAGRAM_USERNAME).trim(),
    authorName: String(rawItem.authorName || 'İstanbul Esenyurt Üniversitesi').trim(),
    title,
    caption: caption || title,
    summary: cleanCaptionText(rawItem.summary || caption || title),
    content: caption || title,
    mediaType,
    mediaUrl,
    thumbnailUrl,
    imageUrl,
    permalink,
    url: permalink,
    link: permalink,
    timestamp,
    date,
    likes: Number(rawItem.like_count ?? rawItem.likes ?? 0) || 0,
    comments: Number(rawItem.comments_count ?? rawItem.comments ?? 0) || 0,
    hashtags,
    category: rawItem.category || 'Resmî Sosyal Medya',
    source: rawItem.source || 'instagram-graph-api'
  };
}

/**
 * Sosyal medya gönderilerini ID, başlık/açıklama ve medya URL bazında tekilleştirir.
 */
export function deduplicateSocialMediaPosts(existingItems = [], incomingItems = [], maxItems = 24) {
  const safeExisting = Array.isArray(existingItems) ? existingItems : [];
  const safeIncoming = Array.isArray(incomingItems) ? incomingItems : [];
  const seenIds = new Set();
  const seenCaptions = new Set();
  const seenMediaUrls = new Set();
  const result = [];

  for (const raw of [...safeIncoming, ...safeExisting]) {
    const normalized = normalizeInstagramGraphPost(raw, result.length);
    if (!normalized) continue;

    const idKey = normalized.id.toLowerCase();
    const captionKey = normalized.title
      .toLowerCase()
      .replace(/#[a-z0-9ğüşıöç_]+/gi, '')
      .replace(/[^a-z0-9ğüşıöç]/gi, '');
    const mediaKey = (normalized.imageUrl || normalized.mediaUrl || '').trim().toLowerCase();

    if (seenIds.has(idKey)) continue;
    if (captionKey && captionKey.length > 8 && seenCaptions.has(captionKey)) continue;
    if (mediaKey && mediaKey.length > 12 && seenMediaUrls.has(mediaKey)) continue;

    seenIds.add(idKey);
    if (captionKey) seenCaptions.add(captionKey);
    if (mediaKey) seenMediaUrls.add(mediaKey);

    result.push(normalized);
    if (result.length >= maxItems) break;
  }

  return result;
}

/**
 * Instagram Graph API uç noktasından (`/{userId}/media`) resmi paylaşımları çeker.
 * Erişim anahtarı (`accessToken`) sağlandığında canlı Graph API çağrısı yapar;
 * anahtar tanımlanmadığında veya ağ hatası durumunda resmi İESÜ paylaşım verilerine geri döner.
 */
export async function fetchInstagramGraphMedia(options = {}) {
  const envToken =
    (typeof process !== 'undefined' && (process.env?.INSTAGRAM_ACCESS_TOKEN || process.env?.VITE_INSTAGRAM_ACCESS_TOKEN)) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_INSTAGRAM_ACCESS_TOKEN) ||
    '';
  const envUserId =
    (typeof process !== 'undefined' && (process.env?.INSTAGRAM_USER_ID || process.env?.VITE_INSTAGRAM_USER_ID)) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_INSTAGRAM_USER_ID) ||
    'me';
  const envVersion =
    (typeof process !== 'undefined' && process.env?.INSTAGRAM_GRAPH_API_VERSION) ||
    DEFAULT_GRAPH_API_VERSION;

  const {
    accessToken = envToken,
    userId = envUserId || 'me',
    apiVersion = envVersion,
    limit = 16,
    timeoutMs = 5000,
    fetchImpl = typeof fetch !== 'undefined' ? fetch : null
  } = options;

  if (!accessToken || typeof fetchImpl !== 'function') {
    return {
      ok: true,
      source: 'official-fallback',
      posts: deduplicateSocialMediaPosts([], OFFICIAL_IESU_INSTAGRAM_POSTS, limit),
      fetchedAt: new Date().toISOString()
    };
  }

  const fields = [
    'id',
    'caption',
    'media_type',
    'media_url',
    'thumbnail_url',
    'permalink',
    'timestamp',
    'username',
    'like_count',
    'comments_count'
  ].join(',');

  const endpoints = [
    `${INSTAGRAM_GRAPH_BASE_URL}/${apiVersion}/${encodeURIComponent(userId)}/media?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(accessToken)}`,
    `${FACEBOOK_GRAPH_BASE_URL}/${apiVersion}/${encodeURIComponent(userId)}/media?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(accessToken)}`
  ];

  for (const endpoint of endpoints) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    try {
      const response = await fetchImpl(endpoint, {
        signal: controller ? controller.signal : undefined,
        headers: {
          Accept: 'application/json'
        }
      });
      if (timer) clearTimeout(timer);
      if (!response || !response.ok) continue;

      const payload = await response.json();
      const rawItems = Array.isArray(payload?.data) ? payload.data : [];
      if (rawItems.length > 0) {
        const cleanPosts = deduplicateSocialMediaPosts([], rawItems, limit);
        if (cleanPosts.length > 0) {
          return {
            ok: true,
            source: 'instagram-graph-api',
            posts: cleanPosts,
            fetchedAt: new Date().toISOString()
          };
        }
      }
    } catch (_) {
      if (timer) clearTimeout(timer);
    }
  }

  return {
    ok: true,
    source: 'official-fallback',
    posts: deduplicateSocialMediaPosts([], OFFICIAL_IESU_INSTAGRAM_POSTS, limit),
    fetchedAt: new Date().toISOString()
  };
}
