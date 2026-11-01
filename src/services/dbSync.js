/**
 * dbSync — Store → Firestore Senkronizasyon Servisi
 *
 * esenyurt.edu.tr üzerinden çekilen haber (`news`) ve etkinlik (`events`) verilerini
 * mükerrer kayıtları temizleyerek Firestore veritabanına kaydeder ve geri yükler.
 */
import { db } from '../utils/firebase';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import {
  deduplicateFeedItems,
  deduplicateSocialMediaPosts,
  OFFICIAL_IESU_INSTAGRAM_POSTS
} from './scraper';

const SYNC_COLLECTION = 'platformData';

export const SYNCABLE_SLICES = [
  { key: 'news', label: 'İESÜ Güncel Haberler (esenyurt.edu.tr)' },
  { key: 'events', label: 'İESÜ Etkinlik Takvimi (esenyurt.edu.tr)' },
  { key: 'announcements', label: 'İESÜ Resmi Duyurular (esenyurt.edu.tr)' },
  { key: 'socialMedia', label: 'İESÜ Resmi Sosyal Medya (Instagram Graph API)' },
  { key: 'checkupRecords', label: 'Mezun Kariyer Anketi' },
  { key: 'newsletterSubscribers', label: 'E-Bülten Aboneleri' },
  { key: 'staffList', label: 'Personel Listesi' },
  { key: 'adminMessages', label: 'Firma İletişim Havuzu' },
  { key: 'alumniAssocApplications', label: 'İESÜ Mezunlar Portalı Başvuruları' },
  { key: 'alumniAssocBoard', label: 'İESÜ Mezunlar Ağı Yönetimi' },
  { key: 'institutionalStatsData', label: 'Kurumsal İstatistikler' },
];

export async function syncSliceToFirestore(sliceKey, data) {
  try {
    if (!db) return { success: false, error: 'Firestore yapılandırılmadı' };
    const docRef = doc(db, SYNC_COLLECTION, sliceKey);
    const boundedData = Array.isArray(data) && data.length > 500
      ? data.slice(0, 500)
      : data;
    await setDoc(docRef, {
      data: boundedData,
      totalCount: Array.isArray(data) ? data.length : 1,
      lastSynced: new Date().toISOString(),
      version: 2,
    });
    return { success: true };
  } catch (err) {
    console.warn(`[dbSync] ${sliceKey} Firestore'a yazılamadı:`, err.message);
    return { success: false, error: err.message };
  }
}

function buildDeterministicDocId(item, prefix, idx) {
  if (prefix === 'ig' && item?.instagramId) {
    const cleanIgId = String(item.instagramId).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    if (cleanIgId) return `ig-${cleanIgId}`;
  }
  const urlStr = String(item?.url || item?.link || '');
  const idMatch = urlStr.match(/\/(?:haber|etkinlik|duyuru)\/(\d+)/i);
  if (idMatch) {
    return `${prefix}-${idMatch[1]}`;
  }
  const rawId = String(item?.id || '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64);
  if (rawId && !/^(evt|ann|live-news)-\d+$/i.test(rawId)) {
    return rawId;
  }
  const slug = String(item?.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9ğüşıöç]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return slug ? `${prefix}-${slug}` : `${prefix}-${idx + 1}`;
}

/**
 * Bir Firestore koleksiyonundaki (`news`, `events`, `announcements`, `social_media`) dokümanları
 * tekilleştirilmiş güncel liste ile senkronize eder ve eski/tekrar eden dokümanları siler.
 */
async function syncCleanCollection(collectionName, prefix, items, syncedAt) {
  if (!db || !Array.isArray(items) || items.length === 0) return;

  const defaultSource = collectionName === 'social_media' ? 'instagram-graph-api' : 'esenyurt.edu.tr';
  const prepared = items.slice(0, 20).map((item, idx) => {
    const docId = buildDeterministicDocId(item, prefix, idx);
    return {
      ...item,
      id: docId,
      source: item.source || defaultSource,
      syncedAt
    };
  });

  const validIds = new Set(prepared.map((x) => x.id));

  // 1. Mevcut koleksiyondaki eski/mükerrer kayıtları sil
  try {
    const existingSnap = await getDocs(collection(db, collectionName));
    const deletions = [];
    existingSnap.forEach((docSnap) => {
      if (!validIds.has(docSnap.id)) {
        deletions.push(deleteDoc(docSnap.ref));
      }
    });
    if (deletions.length > 0) {
      await Promise.allSettled(deletions);
    }
  } catch (_) {
    // Okuma/silme hatası olursa yazma işlemine devam et
  }

  // 2. Güncel ve benzersiz kayıtları yaz
  await Promise.allSettled(
    prepared.map((docData) =>
      setDoc(doc(db, collectionName, docData.id), docData)
    )
  );
}

/**
 * Instagram Graph API üzerinden çekilen resmi sosyal medya paylaşımlarını
 * Firestore `social_media` koleksiyonuna kaydeder.
 */
export async function syncSocialMediaPostsToFirestore(socialPosts = []) {
  const syncedAt = new Date().toISOString();
  const cleanSocial = deduplicateSocialMediaPosts(
    [],
    Array.isArray(socialPosts) && socialPosts.length > 0 ? socialPosts : OFFICIAL_IESU_INSTAGRAM_POSTS,
    20
  );

  if (!db) {
    return { success: false, syncedAt, count: cleanSocial.length, error: 'Firestore bağlantısı hazır değil' };
  }

  try {
    await syncCleanCollection('social_media', 'ig', cleanSocial, syncedAt);
    await syncSliceToFirestore('socialMedia', cleanSocial);
    await syncSliceToFirestore('social_media', cleanSocial);
    return { success: true, syncedAt, count: cleanSocial.length, socialMedia: cleanSocial };
  } catch (err) {
    console.warn('[dbSync] syncSocialMediaPostsToFirestore uyarısı:', err?.message);
    return { success: false, syncedAt, count: cleanSocial.length, error: err?.message };
  }
}

/**
 * esenyurt.edu.tr üzerinden çekilen haber, etkinlik, duyuru ve Instagram Graph API
 * sosyal medya paylaşımlarını mükerrer kayıtları arındırarak Firestore `news`, `events`,
 * `announcements` ve `social_media` koleksiyonlarına kaydeder.
 */
export async function saveScrapedFeedToFirestore(feedPayload) {
  const syncedAt = new Date().toISOString();
  const newsList = deduplicateFeedItems([], Array.isArray(feedPayload?.news) ? feedPayload.news : [], 20);
  const eventsList = deduplicateFeedItems([], Array.isArray(feedPayload?.events) ? feedPayload.events : [], 20);
  const announcementsList = deduplicateFeedItems([], Array.isArray(feedPayload?.announcements) ? feedPayload.announcements : [], 20);
  const socialMediaList = deduplicateSocialMediaPosts(
    [],
    Array.isArray(feedPayload?.socialMedia) && feedPayload.socialMedia.length > 0
      ? feedPayload.socialMedia
      : OFFICIAL_IESU_INSTAGRAM_POSTS,
    20
  );

  const counts = {
    news: newsList.length,
    events: eventsList.length,
    announcements: announcementsList.length,
    socialMedia: socialMediaList.length
  };

  if (!db) {
    return { success: false, syncedAt, counts, error: 'Firestore bağlantısı hazır değil' };
  }

  try {
    // 1. `news`, `events`, `announcements` ve `social_media` koleksiyonlarını senkronize et ve eski/mükerrer dokümanları sil
    await Promise.allSettled([
      syncCleanCollection('news', 'haber', newsList, syncedAt),
      syncCleanCollection('events', 'etkinlik', eventsList, syncedAt),
      syncCleanCollection('announcements', 'duyuru', announcementsList, syncedAt),
      syncCleanCollection('social_media', 'ig', socialMediaList, syncedAt)
    ]);

    // 2. Merkezi iesuScraperFeed/latest dokümanını temiz verilerle üzerine yaz
    const snapshotRef = doc(db, 'iesuScraperFeed', 'latest');
    await setDoc(snapshotRef, {
      news: newsList,
      events: eventsList,
      announcements: announcementsList,
      socialMedia: socialMediaList,
      officeInfo: feedPayload?.officeInfo || null,
      source: feedPayload?.source || 'live',
      status: feedPayload?.status || 'success',
      feedFormat: feedPayload?.feedFormat || 'rss+html-scraper+instagram-graph',
      lastUpdated: feedPayload?.lastUpdated || syncedAt,
      syncedAt,
      counts
    });

    // 3. platformData dilimlerini güncelle
    await Promise.allSettled([
      syncSliceToFirestore('news', newsList),
      syncSliceToFirestore('events', eventsList),
      syncSliceToFirestore('announcements', announcementsList),
      syncSliceToFirestore('socialMedia', socialMediaList),
      syncSliceToFirestore('social_media', socialMediaList)
    ]);

    return { success: true, syncedAt, counts };
  } catch (err) {
    console.warn('[dbSync] saveScrapedFeedToFirestore uyarısı:', err?.message);
    return { success: false, syncedAt, counts, error: err?.message };
  }
}

/**
 * Firestore `news`, `events`, `announcements` ve `social_media` koleksiyonlarından
 * (veya iesuScraperFeed/latest özetinden) en güncel ve tekilleştirilmiş verileri okur.
 */
export async function loadScrapedFeedFromFirestore() {
  if (!db) {
    return { success: false, error: 'Firestore yapılandırılmadı' };
  }

  try {
    const [newsColSnap, eventsColSnap, annColSnap, socialColSnap, latestSnap] = await Promise.allSettled([
      getDocs(collection(db, 'news')),
      getDocs(collection(db, 'events')),
      getDocs(collection(db, 'announcements')),
      getDocs(collection(db, 'social_media')),
      getDoc(doc(db, 'iesuScraperFeed', 'latest'))
    ]);

    const colNews = [];
    if (newsColSnap.status === 'fulfilled') {
      newsColSnap.value.forEach((d) => colNews.push({ id: d.id, ...d.data() }));
    }

    const colEvents = [];
    if (eventsColSnap.status === 'fulfilled') {
      eventsColSnap.value.forEach((d) => colEvents.push({ id: d.id, ...d.data() }));
    }

    const colAnnouncements = [];
    if (annColSnap.status === 'fulfilled') {
      annColSnap.value.forEach((d) => colAnnouncements.push({ id: d.id, ...d.data() }));
    }

    const colSocialMedia = [];
    if (socialColSnap.status === 'fulfilled') {
      socialColSnap.value.forEach((d) => colSocialMedia.push({ id: d.id, ...d.data() }));
    }

    const latestData = latestSnap.status === 'fulfilled' && latestSnap.value.exists()
      ? latestSnap.value.data()
      : null;

    const cleanNews = deduplicateFeedItems(
      Array.isArray(latestData?.news) ? latestData.news : [],
      colNews,
      20
    );
    const cleanEvents = deduplicateFeedItems(
      Array.isArray(latestData?.events) ? latestData.events : [],
      colEvents,
      20
    );
    const cleanAnnouncements = deduplicateFeedItems(
      Array.isArray(latestData?.announcements) ? latestData.announcements : [],
      colAnnouncements,
      20
    );
    const cleanSocialMedia = deduplicateSocialMediaPosts(
      Array.isArray(latestData?.socialMedia) ? latestData.socialMedia : OFFICIAL_IESU_INSTAGRAM_POSTS,
      colSocialMedia,
      20
    );

    if (
      cleanNews.length > 0 ||
      cleanEvents.length > 0 ||
      cleanAnnouncements.length > 0 ||
      cleanSocialMedia.length > 0
    ) {
      return {
        success: true,
        data: {
          news: cleanNews,
          events: cleanEvents,
          announcements: cleanAnnouncements,
          socialMedia: cleanSocialMedia,
          officeInfo: latestData?.officeInfo || null,
          lastUpdated: latestData?.lastUpdated || latestData?.syncedAt || new Date().toISOString(),
          source: 'firestore',
          status: 'aktif',
          feedFormat: 'firestore-collections'
        }
      };
    }

    return { success: false, error: 'Firestore üzerinde henüz senkronize edilmiş veri bulunamadı' };
  } catch (err) {
    console.warn('[dbSync] loadScrapedFeedFromFirestore uyarısı:', err?.message);
    return { success: false, error: err?.message };
  }
}

export async function syncAllToFirestore(storeState) {
  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (const slice of SYNCABLE_SLICES) {
    const data = storeState[slice.key];
    if (data === undefined || data === null) {
      failCount++;
      results.push({ key: slice.key, status: 'skipped', reason: 'Veri yok' });
      continue;
    }

    const result = await syncSliceToFirestore(slice.key, data);
    if (result.success) {
      successCount++;
      results.push({ key: slice.key, status: 'synced' });
    } else {
      failCount++;
      results.push({ key: slice.key, status: 'failed', error: result.error });
    }
  }

  return { success: successCount, failed: failCount, results };
}

export async function restoreSliceFromFirestore(sliceKey) {
  try {
    if (!db) return { success: false, error: 'Firestore yapılandırılmadı' };
    const docRef = doc(db, SYNC_COLLECTION, sliceKey);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data().data };
    }
    return { success: false, error: 'Yedek bulunamadı' };
  } catch (err) {
    console.warn(`[dbSync] ${sliceKey} okunamadı:`, err.message);
    return { success: false, error: err.message };
  }
}

export async function listFirestoreBackups() {
  try {
    if (!db) return [];
    const querySnapshot = await getDocs(collection(db, SYNC_COLLECTION));
    const backups = [];
    querySnapshot.forEach((docSnap) => {
      backups.push({
        key: docSnap.id,
        lastSynced: docSnap.data().lastSynced,
        dataSize: Array.isArray(docSnap.data().data) ? docSnap.data().data.length : 'N/A',
      });
    });
    return backups;
  } catch (err) {
    console.warn('[dbSync] Yedek listesi alınamadı:', err.message);
    return [];
  }
}
