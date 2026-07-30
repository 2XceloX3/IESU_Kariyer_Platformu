/**
 * dbSync — Store → Firestore Senkronizasyon Servisi
 * 
 * Veri tiplerini Zustand store'dan Firestore'a yedekler.
 * Her işlem try/catch ile sarılıdır -> Firestore çalışmazsa uygulama etkilenmez.
 */
import { db } from '../utils/firebase';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

const SYNC_COLLECTION = 'platformData';

// Hangi store slice'larının Firestore'a yedekleneceği
export const SYNCABLE_SLICES = [
  { key: 'checkupRecords', label: 'Mezun Kariyer Anketi' },
  { key: 'newsletterSubscribers', label: 'E-Bülten Aboneleri' },
  { key: 'staffList', label: 'Personel Listesi' },
  { key: 'adminMessages', label: 'Firma İletişim Havuzu' },
  { key: 'alumniAssocApplications', label: 'Mezun Derneği Başvuruları' },
  { key: 'alumniAssocBoard', label: 'Mezun Derneği Yönetimi' },
  { key: 'institutionalStatsData', label: 'Kurumsal İstatistikler' },
];

/**
 * Store'dan alınan veriyi Firestore'a yedekler.
 * @param {string} sliceKey - Store slice adı (örn. 'checkupRecords')
 * @param {any} data - Kaydedilecek veri
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function syncSliceToFirestore(sliceKey, data) {
  try {
    const docRef = doc(db, SYNC_COLLECTION, sliceKey);
    await setDoc(docRef, {
      data,
      lastSynced: new Date().toISOString(),
      version: 1,
    });
    return { success: true };
  } catch (err) {
    console.warn(`[dbSync] ${sliceKey} Firestore'a yazılamadı:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Tüm belirtilen slice'ları Firestore'a yedekler.
 * @param {object} storeState - useAppStore.getState() sonucu
 * @returns {Promise<{success: number, failed: number, results: object[]}>}
 */
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

/**
 * Firestore'dan bir slice'ın yedeğini geri yükler.
 * @param {string} sliceKey
 * @returns {Promise<{success: boolean, data?: any}>}
 */
export async function restoreSliceFromFirestore(sliceKey) {
  try {
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

/**
 * Firestore'daki tüm yedeklenmiş verileri listeler.
 */
export async function listFirestoreBackups() {
  try {
    const querySnapshot = await getDocs(collection(db, SYNC_COLLECTION));
    const backups = [];
    querySnapshot.forEach((doc) => {
      backups.push({
        key: doc.id,
        lastSynced: doc.data().lastSynced,
        dataSize: Array.isArray(doc.data().data) ? doc.data().data.length : 'N/A',
      });
    });
    return backups;
  } catch (err) {
    console.warn('[dbSync] Yedek listesi alınamadı:', err.message);
    return [];
  }
}
