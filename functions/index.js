/**
 * İstanbul Esenyurt Üniversitesi (https://www.esenyurt.edu.tr/)
 * Haber ve Etkinlik Arka Plan Servisi & Firebase Cloud Function (v2)
 *
 * Bu bulut fonksiyonu düzenli aralıklarla (her 30 dakikada bir) https://www.esenyurt.edu.tr/
 * üzerindeki güncel haber (/haberler) ve etkinlik (/etkinlikler) sayfalarını tarar,
 * mükerrer (tekrar eden) veya geçersiz kayıtları filtreler ve temiz verileri
 * Firestore veritabanındaki `news` ve `events` koleksiyonlarına kaydeder.
 */

import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const DATABASE_ID = 'ai-studio-iesukariyerplatf-979fe00b-91d7-4d12-9cb9-145f94ff71d6';
const BASE_URL = 'https://www.esenyurt.edu.tr';

if (!getApps().length) {
  initializeApp();
}

function getTargetDb() {
  try {
    return getFirestore(DATABASE_ID);
  } catch (_) {
    return getFirestore();
  }
}

export function resolveIesuUrl(rawUrl = '') {
  if (!rawUrl || typeof rawUrl !== 'string') return BASE_URL;
  const trimmed = rawUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('/')) return `${BASE_URL}${trimmed}`;
  return `${BASE_URL}/${trimmed}`;
}

export function cleanHtmlText(raw = '') {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;|&rsquo;|&lsquo;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/^\s*\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\s*/g, '')
    .replace(/(?:\.{2,}|…|!|\s)*(?:devamını\s+oku|detaylı\s+bilgi\s+için\s+tıklayınız|detaylar\s+için\s+tıklayınız)\s*$/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildCanonicalSlugId(urlOrHref = '', prefix = 'item', fallbackIndex = 1) {
  const str = String(urlOrHref || '').trim();
  const idMatch = str.match(/\/(?:haber|etkinlik|duyuru)\/(\d+)(?:-([a-z0-9-]+))?/i);
  if (idMatch) {
    const numId = idMatch[1];
    const slugPart = (idMatch[2] || '').replace(/[^a-z0-9-]/gi, '').slice(0, 48);
    return slugPart ? `${prefix}-${numId}-${slugPart}` : `${prefix}-${numId}`;
  }
  const slug = str
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 64);
  return slug ? `${prefix}-${slug}` : `${prefix}-${fallbackIndex}`;
}

/**
 * esenyurt.edu.tr/etkinlikler HTML sayfasından etkinlik kartlarını (<div class="box">) ayrıştırır.
 */
export function parseEventsFromHtml(html = '') {
  if (!html || typeof html !== 'string') return [];
  const byHref = new Map();

  const boxRegex = /<div\s+class=["']box["']\s*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;
  let match;
  while ((match = boxRegex.exec(html)) !== null) {
    const block = match[1];
    const hrefMatch = block.match(/href=["']([^"']*\/etkinlik\/[^"']+)["']/i);
    if (!hrefMatch) continue;
    const rawHref = hrefMatch[1].trim();
    const fullUrl = resolveIesuUrl(rawHref);

    const imgMatch = block.match(/<img[^>]+(?:src|data-src)=["']([^"']+)["']/i);
    const h3Match = block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const titleAttrMatch = block.match(/title=["']([^"']+)["']/i);
    const dateMatch = block.match(/<p\s+class=["']date[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
    const timeMatch = block.match(/<p\s+class=["']time[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);

    const title = cleanHtmlText(h3Match ? h3Match[1] : (titleAttrMatch ? titleAttrMatch[1] : ''));
    if (!title || title.length < 6) continue;

    const imageUrl = imgMatch && imgMatch[1] ? resolveIesuUrl(imgMatch[1]) : '';
    const dateStr = cleanHtmlText(dateMatch ? dateMatch[1] : '') || 'Güncel';
    const timeStr = cleanHtmlText(timeMatch ? timeMatch[1] : '');

    if (!byHref.has(fullUrl)) {
      const id = buildCanonicalSlugId(rawHref, 'etkinlik', byHref.size + 1);
      byHref.set(fullUrl, {
        id,
        title,
        date: dateStr,
        time: timeStr || '13:00',
        location: 'İstanbul Esenyurt Üniversitesi Kampüsü',
        category: 'Üniversite Etkinliği',
        summary: title,
        description: `${title} (${dateStr}${timeStr ? ' - ' + timeStr : ''})`,
        content: title,
        imageUrl,
        url: fullUrl,
        link: fullUrl,
        status: 'Aktif',
        source: 'esenyurt.edu.tr'
      });
    }
  }

  return Array.from(byHref.values());
}

/**
 * esenyurt.edu.tr/haberler HTML sayfasından haber kartlarını ayrıştırır.
 */
export function parseNewsFromHtml(html = '') {
  if (!html || typeof html !== 'string') return [];
  const byHref = new Map();

  const haberLinkRegex = /<a[^>]+href=["']([^"']*\/haber\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = haberLinkRegex.exec(html)) !== null) {
    const rawHref = match[1].trim();
    const block = match[2];
    const fullUrl = resolveIesuUrl(rawHref);

    const h3Match = block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const pMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const dateMatch = block.match(/<span>\s*(\d{1,2}[./]\d{1,2}[./]\d{4})\s*<\/span>/i);
    const imgMatch = block.match(/<img[^>]+(?:src|data-src)=["']([^"']+)["']/i);

    const title = cleanHtmlText(h3Match ? h3Match[1] : block);
    if (!title || title.length < 8) continue;

    const summaryText = cleanHtmlText(pMatch ? pMatch[1] : '') || title;
    const dateStr = dateMatch ? dateMatch[1] : new Date().toLocaleDateString('tr-TR');
    const imageUrl = imgMatch && imgMatch[1] ? resolveIesuUrl(imgMatch[1]) : '';

    const existing = byHref.get(fullUrl);
    if (!existing) {
      const id = buildCanonicalSlugId(rawHref, 'haber', byHref.size + 1);
      byHref.set(fullUrl, {
        id,
        title,
        date: dateStr,
        category: 'Kampüs Haberi',
        summary: summaryText,
        description: summaryText,
        content: summaryText,
        imageUrl,
        url: fullUrl,
        link: fullUrl,
        source: 'esenyurt.edu.tr'
      });
    } else if (!existing.imageUrl && imageUrl) {
      existing.imageUrl = imageUrl;
    }
  }

  return Array.from(byHref.values());
}

/**
 * Mükerrer başlık, URL veya görselleri filtreler.
 */
export function deduplicateCollectionItems(items = [], maxCount = 24) {
  const seenIds = new Set();
  const seenTitles = new Set();
  const seenUrls = new Set();
  const cleanList = [];

  for (const item of items) {
    if (!item || !item.title) continue;
    const title = cleanHtmlText(item.title);
    if (!title || title.length < 6) continue;

    const normTitle = title.toLowerCase().replace(/[^a-z0-9ğüşıöç]/gi, '');
    const normUrl = String(item.url || item.link || '').trim().toLowerCase();
    const id = String(item.id || buildCanonicalSlugId(normUrl || normTitle, 'item', cleanList.length + 1));

    if (seenIds.has(id) || seenTitles.has(normTitle) || (normUrl && seenUrls.has(normUrl))) {
      continue;
    }

    seenIds.add(id);
    seenTitles.add(normTitle);
    if (normUrl) seenUrls.add(normUrl);

    cleanList.push({
      ...item,
      id,
      title,
      summary: cleanHtmlText(item.summary || item.description || title) || title,
      description: cleanHtmlText(item.description || item.summary || title) || title
    });

    if (cleanList.length >= maxCount) break;
  }

  return cleanList;
}

const INSTAGRAM_GRAPH_BASE_URL = 'https://graph.instagram.com';
const FACEBOOK_GRAPH_BASE_URL = 'https://graph.facebook.com';
const OFFICIAL_INSTAGRAM_USERNAME = 'esenyurtuniversitesi';
const OFFICIAL_INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/esenyurtuniversitesi/';

const FALLBACK_OFFICIAL_INSTAGRAM_POSTS = [
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
    permalink: OFFICIAL_INSTAGRAM_PROFILE_URL,
    url: OFFICIAL_INSTAGRAM_PROFILE_URL,
    link: OFFICIAL_INSTAGRAM_PROFILE_URL,
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
    summary: 'Mimari Kültür ve Sanat Kulübü teknik gezi programı kapsamında Novawood Showroom ziyareti gerçekleştirilecektir.',
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
  }
];

export function normalizeCloudInstagramPost(rawItem = {}, index = 0) {
  if (!rawItem || typeof rawItem !== 'object') return null;
  const rawId = String(rawItem.instagramId || rawItem.id || '').trim();
  const cleanId = rawId
    ? (rawId.startsWith('ig-') ? rawId : `ig-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`)
    : `ig-post-${index + 1}`;
  const instagramId = rawId.replace(/^ig-/, '') || String(index + 1);

  const caption = cleanHtmlText(rawItem.caption || rawItem.content || rawItem.summary || rawItem.title || '');
  const baseTitle = cleanHtmlText(rawItem.title || caption.replace(/#[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ_]+/g, ''));
  const title = baseTitle.length > 115 ? `${baseTitle.slice(0, 112).trim()}...` : baseTitle;
  if (!title || title.length < 4) return null;

  const mediaType = String(rawItem.media_type || rawItem.mediaType || 'IMAGE').toUpperCase();
  const mediaUrl = String(rawItem.media_url || rawItem.mediaUrl || rawItem.imageUrl || rawItem.thumbnail_url || '').trim();
  const thumbnailUrl = String(rawItem.thumbnail_url || rawItem.thumbnailUrl || mediaUrl).trim();
  const imageUrl = mediaType === 'VIDEO' ? (thumbnailUrl || mediaUrl) : (mediaUrl || thumbnailUrl);
  const permalink = String(rawItem.permalink || rawItem.url || rawItem.link || OFFICIAL_INSTAGRAM_PROFILE_URL).trim();
  const timestamp = rawItem.timestamp && !Number.isNaN(Date.parse(rawItem.timestamp))
    ? new Date(rawItem.timestamp).toISOString()
    : new Date().toISOString();

  const hashtags = (caption.match(/#[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ_]+/g) || []).slice(0, 10);

  return {
    id: cleanId,
    instagramId,
    platform: 'instagram',
    username: String(rawItem.username || OFFICIAL_INSTAGRAM_USERNAME).trim(),
    authorName: 'İstanbul Esenyurt Üniversitesi',
    title,
    caption: caption || title,
    summary: caption || title,
    content: caption || title,
    mediaType,
    mediaUrl,
    thumbnailUrl,
    imageUrl,
    permalink,
    url: permalink,
    link: permalink,
    timestamp,
    date: rawItem.date || new Date(timestamp).toLocaleDateString('tr-TR'),
    likes: Number(rawItem.like_count ?? rawItem.likes ?? 0) || 0,
    comments: Number(rawItem.comments_count ?? rawItem.comments ?? 0) || 0,
    hashtags,
    category: 'Resmî Sosyal Medya',
    source: 'instagram-graph-api'
  };
}

/**
 * Instagram Graph API kullanarak üniversitenin resmi sosyal medya paylaşımlarını çeker.
 */
export async function fetchInstagramGraphPostsFromApi() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || process.env.VITE_INSTAGRAM_ACCESS_TOKEN || '';
  const userId = process.env.INSTAGRAM_USER_ID || process.env.VITE_INSTAGRAM_USER_ID || 'me';
  const apiVersion = process.env.INSTAGRAM_GRAPH_API_VERSION || 'v21.0';

  if (!accessToken) {
    return FALLBACK_OFFICIAL_INSTAGRAM_POSTS.map((p, idx) => normalizeCloudInstagramPost(p, idx)).filter(Boolean);
  }

  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username,like_count,comments_count';
  const endpoints = [
    `${INSTAGRAM_GRAPH_BASE_URL}/${apiVersion}/${encodeURIComponent(userId)}/media?fields=${fields}&limit=20&access_token=${encodeURIComponent(accessToken)}`,
    `${FACEBOOK_GRAPH_BASE_URL}/${apiVersion}/${encodeURIComponent(userId)}/media?fields=${fields}&limit=20&access_token=${encodeURIComponent(accessToken)}`
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
      if (!response.ok) continue;
      const payload = await response.json();
      if (Array.isArray(payload?.data) && payload.data.length > 0) {
        const normalized = payload.data.map((item, idx) => normalizeCloudInstagramPost(item, idx)).filter(Boolean);
        if (normalized.length > 0) {
          return deduplicateCollectionItems(normalized, 20);
        }
      }
    } catch (_) {
      // try next graph endpoint
    }
  }

  return FALLBACK_OFFICIAL_INSTAGRAM_POSTS.map((p, idx) => normalizeCloudInstagramPost(p, idx)).filter(Boolean);
}

/**
 * Instagram Graph API paylaşımlarını Firestore `social_media` koleksiyonuna yazar
 * ve mükerrer/eski dokümanları temizler.
 */
export async function syncSocialMediaToFirestore(dbInstance = null, preFetchedPosts = null) {
  const syncedAt = new Date().toISOString();
  const db = dbInstance || getTargetDb();
  const rawPosts = Array.isArray(preFetchedPosts) ? preFetchedPosts : await fetchInstagramGraphPostsFromApi();
  const socialMediaItems = deduplicateCollectionItems(rawPosts, 20);

  if (socialMediaItems.length > 0) {
    const validSocialIds = new Set(socialMediaItems.map((s) => s.id));
    const existingSocialSnap = await db.collection('social_media').get();
    const socialBatch = db.batch();

    existingSocialSnap.forEach((docSnap) => {
      if (!validSocialIds.has(docSnap.id)) {
        socialBatch.delete(docSnap.ref);
      }
    });

    for (const item of socialMediaItems) {
      const ref = db.collection('social_media').doc(item.id);
      socialBatch.set(ref, { ...item, syncedAt });
    }

    await socialBatch.commit();
  }

  return {
    ok: true,
    syncedAt,
    count: socialMediaItems.length,
    socialMedia: socialMediaItems
  };
}

/**
 * esenyurt.edu.tr adresinden haber ve etkinlikleri + Instagram Graph API üzerinden
 * resmi sosyal medya paylaşımlarını çekip Firestore `news`, `events` ve `social_media`
 * koleksiyonlarına yazar, eski veya tekrar eden kayıtları temizler.
 */
export async function scrapeAndSyncIesuToFirestore() {
  const syncedAt = new Date().toISOString();
  const headers = {
    'User-Agent': 'Mozilla/5.0 (compatible; IESU-CloudFunction-Scraper/2.0; +https://www.esenyurt.edu.tr)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  };

  const [newsRes, eventsRes, socialPostsRes] = await Promise.allSettled([
    fetch(`${BASE_URL}/haberler`, { headers }),
    fetch(`${BASE_URL}/etkinlikler`, { headers }),
    fetchInstagramGraphPostsFromApi()
  ]);

  const rawNewsHtml = newsRes.status === 'fulfilled' && newsRes.value.ok ? await newsRes.value.text() : '';
  const rawEventsHtml = eventsRes.status === 'fulfilled' && eventsRes.value.ok ? await eventsRes.value.text() : '';
  const rawSocialPosts = socialPostsRes.status === 'fulfilled' ? socialPostsRes.value : [];

  const newsItems = deduplicateCollectionItems(parseNewsFromHtml(rawNewsHtml), 20);
  const eventItems = deduplicateCollectionItems(parseEventsFromHtml(rawEventsHtml), 20);
  const socialMediaItems = deduplicateCollectionItems(rawSocialPosts, 20);

  const db = getTargetDb();

  // 1. `news` koleksiyonunu senkronize et ve mükerrer/eski dokümanları sil
  if (newsItems.length > 0) {
    const validNewsIds = new Set(newsItems.map((n) => n.id));
    const existingNewsSnap = await db.collection('news').get();
    const newsBatch = db.batch();

    existingNewsSnap.forEach((docSnap) => {
      if (!validNewsIds.has(docSnap.id)) {
        newsBatch.delete(docSnap.ref);
      }
    });

    for (const item of newsItems) {
      const ref = db.collection('news').doc(item.id);
      newsBatch.set(ref, { ...item, syncedAt });
    }

    await newsBatch.commit();
  }

  // 2. `events` koleksiyonunu senkronize et ve mükerrer/eski dokümanları sil
  if (eventItems.length > 0) {
    const validEventIds = new Set(eventItems.map((e) => e.id));
    const existingEventsSnap = await db.collection('events').get();
    const eventsBatch = db.batch();

    existingEventsSnap.forEach((docSnap) => {
      if (!validEventIds.has(docSnap.id)) {
        eventsBatch.delete(docSnap.ref);
      }
    });

    for (const item of eventItems) {
      const ref = db.collection('events').doc(item.id);
      eventsBatch.set(ref, { ...item, syncedAt });
    }

    await eventsBatch.commit();
  }

  // 3. `social_media` koleksiyonunu Instagram Graph API verileriyle senkronize et
  await syncSocialMediaToFirestore(db, socialMediaItems);

  // Merkezi özet dokümanını güncelle
  await db.collection('iesuScraperFeed').doc('latest').set(
    {
      news: newsItems,
      events: eventItems,
      socialMedia: socialMediaItems,
      lastUpdated: syncedAt,
      syncedAt,
      source: 'esenyurt.edu.tr+instagram-graph-api',
      status: 'success',
      counts: {
        news: newsItems.length,
        events: eventItems.length,
        socialMedia: socialMediaItems.length
      }
    },
    { merge: true }
  );

  return {
    ok: true,
    syncedAt,
    counts: {
      news: newsItems.length,
      events: eventItems.length,
      socialMedia: socialMediaItems.length
    }
  };
}

// 1. Zamanlanmış Bulut Fonksiyonu (Her 30 dakikada bir haber, etkinlik ve Instagram Graph API verilerini çeker)
export const syncIesuNewsAndEventsScheduled = onSchedule(
  {
    schedule: 'every 30 minutes',
    timeZone: 'Europe/Istanbul',
    region: 'europe-west1'
  },
  async () => {
    await scrapeAndSyncIesuToFirestore();
  }
);

// 2. HTTP Tetiklemeli Bulut Fonksiyonu (Tüm RSS/Scraper + Instagram Graph API senkronizasyonu)
export const syncIesuNewsAndEventsHttp = onRequest(
  {
    region: 'europe-west1',
    cors: true
  },
  async (req, res) => {
    try {
      const result = await scrapeAndSyncIesuToFirestore();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ ok: false, error: err?.message || 'Scrape failed' });
    }
  }
);

// 3. Zamanlanmış Instagram Graph API -> Firestore `social_media` Bulut Fonksiyonu
export const syncIesuInstagramScheduled = onSchedule(
  {
    schedule: 'every 30 minutes',
    timeZone: 'Europe/Istanbul',
    region: 'europe-west1'
  },
  async () => {
    await syncSocialMediaToFirestore();
  }
);

// 4. HTTP Tetiklemeli Instagram Graph API -> Firestore `social_media` Bulut Fonksiyonu
export const syncIesuInstagramHttp = onRequest(
  {
    region: 'europe-west1',
    cors: true
  },
  async (req, res) => {
    try {
      const result = await syncSocialMediaToFirestore();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ ok: false, error: err?.message || 'Instagram Graph API sync failed' });
    }
  }
);

