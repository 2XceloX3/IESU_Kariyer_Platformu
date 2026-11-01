/**
 * İstanbul Esenyurt Üniversitesi (https://www.esenyurt.edu.tr/)
 * Arka Plan Haber, Etkinlik & Instagram Graph API (`social_media`) Senkronizasyon Servisi
 *
 * Bu servis kullanıcı arayüzünde herhangi bir telemetri veya durum paneli göstermeden
 * arka planda düzenli aralıklarla (varsayılan: 15 dakika) esenyurt.edu.tr üzerindeki
 * güncel haberleri, etkinlikleri ve Instagram Graph API resmi sosyal medya paylaşımlarını çeker,
 * mükerrer (tekrar eden) kayıtları temizler ve Firestore veritabanındaki
 * `news`, `events` ve `social_media` koleksiyonlarına kaydeder.
 */

import {
  scrapeLiveOrFallback,
  deduplicateFeedItems,
  deduplicateSocialMediaPosts,
  fetchInstagramGraphMedia,
  OFFICIAL_IESU_INSTAGRAM_POSTS
} from './scraper';
import {
  saveScrapedFeedToFirestore,
  loadScrapedFeedFromFirestore,
  syncSocialMediaPostsToFirestore
} from './dbSync';

const DEFAULT_INTERVAL_MS = 15 * 60 * 1000; // 15 dakika
let activeSchedulerId = null;
let isSyncInProgress = false;

/**
 * Instagram Graph API kullanarak üniversitenin resmi sosyal medya paylaşımlarını çeker
 * ve Firestore'da `social_media` koleksiyonunda saklar.
 */
export async function runBackgroundSocialMediaSync({ accessToken, userId, onUpdate } = {}) {
  try {
    const igResult = await fetchInstagramGraphMedia({ accessToken, userId });
    const cleanSocial = deduplicateSocialMediaPosts(
      [],
      igResult?.posts || OFFICIAL_IESU_INSTAGRAM_POSTS,
      20
    );
    await syncSocialMediaPostsToFirestore(cleanSocial);

    if (typeof onUpdate === 'function') {
      onUpdate({
        socialMedia: cleanSocial,
        lastUpdated: igResult?.fetchedAt || new Date().toISOString(),
        source: igResult?.source || 'instagram-graph-api'
      });
    }

    return cleanSocial;
  } catch (err) {
    console.warn('[BackgroundScraperService] Instagram Graph API senkronizasyon uyarısı:', err?.message);
    return OFFICIAL_IESU_INSTAGRAM_POSTS;
  }
}

/**
 * Tek seferlik arka plan senkronizasyon döngüsünü çalıştırır:
 * 1. `esenyurt.edu.tr` + Instagram Graph API arka plan uç noktasından (`/api/iesu-rss-scraper`) güncel verileri çeker.
 * 2. Tekilleştirilmiş verileri Firestore `news`, `events` ve `social_media` koleksiyonlarına yazar ve eski/mükerrer kayıtları siler.
 * 3. Canlı uç noktaya ulaşılamazsa Firestore'daki son temiz kayıtlara geri döner.
 */
export async function runBackgroundNewsAndEventsSync({ onUpdate, forceRefresh = true } = {}) {
  if (isSyncInProgress) return null;
  isSyncInProgress = true;

  try {
    const liveData = await scrapeLiveOrFallback({
      forceRefresh,
      persistToFirestore: false
    });

    if (liveData && (liveData.news?.length > 0 || liveData.events?.length > 0 || liveData.socialMedia?.length > 0)) {
      const cleanPayload = {
        ...liveData,
        news: deduplicateFeedItems([], liveData.news, 20),
        events: deduplicateFeedItems([], liveData.events, 20),
        announcements: deduplicateFeedItems([], liveData.announcements, 20),
        socialMedia: deduplicateSocialMediaPosts(
          [],
          liveData.socialMedia || OFFICIAL_IESU_INSTAGRAM_POSTS,
          20
        )
      };

      await saveScrapedFeedToFirestore(cleanPayload);

      if (typeof onUpdate === 'function') {
        onUpdate({
          news: cleanPayload.news,
          events: cleanPayload.events,
          announcements: cleanPayload.announcements,
          socialMedia: cleanPayload.socialMedia,
          lastUpdated: cleanPayload.lastUpdated || new Date().toISOString(),
          source: cleanPayload.source || 'live'
        });
      }

      return cleanPayload;
    }

    // Fallback: Firestore'dan son temiz kayıtları yükle
    const firestoreCached = await loadScrapedFeedFromFirestore();
    if (firestoreCached?.success && firestoreCached.data && typeof onUpdate === 'function') {
      onUpdate({
        news: deduplicateFeedItems([], firestoreCached.data.news, 20),
        events: deduplicateFeedItems([], firestoreCached.data.events, 20),
        announcements: deduplicateFeedItems([], firestoreCached.data.announcements, 20),
        socialMedia: deduplicateSocialMediaPosts(
          [],
          firestoreCached.data.socialMedia || OFFICIAL_IESU_INSTAGRAM_POSTS,
          20
        ),
        lastUpdated: firestoreCached.data.lastUpdated,
        source: 'firestore'
      });
      return firestoreCached.data;
    }
  } catch (err) {
    console.warn('[BackgroundScraperService] Arka plan senkronizasyon uyarısı:', err?.message);
  } finally {
    isSyncInProgress = false;
  }

  return null;
}

/**
 * Düzenli aralıklarla çalışan arka plan servisini başlatır.
 */
export function startBackgroundScraperService({ intervalMs = DEFAULT_INTERVAL_MS, onUpdate } = {}) {
  const isTestEnv =
    typeof process !== 'undefined' &&
    (process.env?.NODE_ENV === 'test' || import.meta.env?.MODE === 'test');
  if (isTestEnv) return () => {};

  if (activeSchedulerId) {
    clearInterval(activeSchedulerId);
    activeSchedulerId = null;
  }

  // İlk açılışta arka planda çalıştır
  runBackgroundNewsAndEventsSync({ onUpdate, forceRefresh: true }).catch(() => {});

  // Düzenli aralıklarla tekrarla
  activeSchedulerId = setInterval(() => {
    runBackgroundNewsAndEventsSync({ onUpdate, forceRefresh: true }).catch(() => {});
  }, intervalMs);

  return () => {
    if (activeSchedulerId) {
      clearInterval(activeSchedulerId);
      activeSchedulerId = null;
    }
  };
}

