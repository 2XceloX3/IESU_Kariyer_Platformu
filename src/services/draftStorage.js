/**
 * src/services/draftStorage.js
 * İstanbul Esenyurt Üniversitesi (İESÜ) İkili Medya Depolama ve IndexedDB Taslak Motoru
 * (Instagram Katman 5 / Bellek Güvenliği & QuotaExceededError Önleme)
 */

const DB_NAME = 'iesu_media_drafts_v1';
const DB_VERSION = 1;
const STORE_DRAFTS = 'draft_posts';
const STORE_BLOBS = 'media_blobs';

// Bellek İçi Fallback (JSDOM / SSR / IndexedDB Desteksiz Ortamlar İçin)
const memoryStorage = {
  drafts: new Map(),
  blobs: new Map()
};

const isIndexedDBAvailable = () => {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
};

/**
 * IndexedDB Veritabanını Başlat / Aç
 */
export function openDraftDB() {
  if (!isIndexedDBAvailable()) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onblocked = () => {
        console.warn('[DraftStorage] IndexedDB open blocked (Safari private mode or version lock), falling back to memory');
        resolve(null);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_DRAFTS)) {
          const draftStore = db.createObjectStore(STORE_DRAFTS, { keyPath: 'id' });
          draftStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_BLOBS)) {
          const blobStore = db.createObjectStore(STORE_BLOBS, { keyPath: 'id' });
          blobStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => {
        console.warn('[DraftStorage] IndexedDB open error, falling back to memory:', event.target?.error);
        resolve(null);
      };
    } catch (e) {
      console.warn('[DraftStorage] Exception opening IndexedDB:', e);
      resolve(null);
    }
  });
}

/**
 * Taslak Gönderiyi Kaydet / Güncelle
 */
export async function saveDraft(draft) {
  if (!draft || !draft.id) {
    throw new Error('Geçersiz taslak nesnesi: id zorunludur.');
  }

  const record = {
    ...draft,
    updatedAt: draft.updatedAt || Date.now()
  };

  const db = await openDraftDB();
  if (!db) {
    memoryStorage.drafts.set(record.id, record);
    return record;
  }

  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(STORE_DRAFTS, 'readwrite');
      tx.onabort = () => {
        memoryStorage.drafts.set(record.id, record);
        resolve(record);
      };
      const store = tx.objectStore(STORE_DRAFTS);
      const req = store.put(record);

      req.onsuccess = () => resolve(record);
      req.onerror = () => {
        memoryStorage.drafts.set(record.id, record);
        resolve(record);
      };
    } catch (e) {
      memoryStorage.drafts.set(record.id, record);
      resolve(record);
    }
  });
}

/**
 * ID ile Taslak Getir
 */
export async function getDraft(id) {
  if (!id) return null;

  const db = await openDraftDB();
  if (!db) {
    return memoryStorage.drafts.get(id) || null;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_DRAFTS, 'readonly');
      tx.onabort = () => resolve(memoryStorage.drafts.get(id) || null);
      const store = tx.objectStore(STORE_DRAFTS);
      const req = store.get(id);

      req.onsuccess = () => resolve(req.result || memoryStorage.drafts.get(id) || null);
      req.onerror = () => resolve(memoryStorage.drafts.get(id) || null);
    } catch (e) {
      console.warn('[DraftStorage] Exception in getDraft:', e);
      resolve(memoryStorage.drafts.get(id) || null);
    }
  });
}

/**
 * Tüm Taslakları Listele
 */
export async function getAllDrafts() {
  const db = await openDraftDB();
  if (!db) {
    return Array.from(memoryStorage.drafts.values()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_DRAFTS, 'readonly');
      tx.onabort = () => resolve(Array.from(memoryStorage.drafts.values()));
      const store = tx.objectStore(STORE_DRAFTS);
      const req = store.getAll();

      req.onsuccess = () => {
        const results = req.result || [];
        if (results.length === 0 && memoryStorage.drafts.size > 0) {
          resolve(Array.from(memoryStorage.drafts.values()));
        } else {
          resolve(results.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)));
        }
      };
      req.onerror = () => resolve(Array.from(memoryStorage.drafts.values()));
    } catch (e) {
      console.warn('[DraftStorage] Exception in getAllDrafts:', e);
      resolve(Array.from(memoryStorage.drafts.values()));
    }
  });
}

/**
 * Taslak Sil
 */
export async function deleteDraft(id) {
  if (!id) return;
  memoryStorage.drafts.delete(id);

  const db = await openDraftDB();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_DRAFTS, 'readwrite');
      tx.onabort = () => resolve(true);
      const store = tx.objectStore(STORE_DRAFTS);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(true);
    } catch (e) {
      console.warn('[DraftStorage] Exception in deleteDraft:', e);
      resolve(true);
    }
  });
}

/**
 * İkili Medya Blob'unu IndexedDB'ye Yaz
 */
export async function storeBlob(blobId, blobData, metadata = {}) {
  if (!blobId || !blobData) {
    throw new Error('blobId ve blobData zorunludur.');
  }

  const record = {
    id: blobId,
    data: blobData,
    mimeType: blobData.type || metadata.mimeType || 'image/webp',
    size: blobData.size || metadata.size || 0,
    metadata,
    createdAt: metadata.createdAt || Date.now()
  };

  const db = await openDraftDB();
  if (!db) {
    memoryStorage.blobs.set(blobId, record);
    return record;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_BLOBS, 'readwrite');
      tx.onabort = () => {
        memoryStorage.blobs.set(blobId, record);
        resolve(record);
      };
      const store = tx.objectStore(STORE_BLOBS);
      const req = store.put(record);

      req.onsuccess = () => resolve(record);
      req.onerror = () => {
        memoryStorage.blobs.set(blobId, record);
        resolve(record);
      };
    } catch (e) {
      console.warn('[DraftStorage] Exception in storeBlob:', e);
      memoryStorage.blobs.set(blobId, record);
      resolve(record);
    }
  });
}

/**
 * İkili Medya Blob'unu Oku
 */
export async function getBlob(blobId) {
  if (!blobId) return null;

  const db = await openDraftDB();
  if (!db) {
    const mem = memoryStorage.blobs.get(blobId);
    return mem ? mem.data : null;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_BLOBS, 'readonly');
      tx.onabort = () => {
        const mem = memoryStorage.blobs.get(blobId);
        resolve(mem ? mem.data : null);
      };
      const store = tx.objectStore(STORE_BLOBS);
      const req = store.get(blobId);

      req.onsuccess = () => {
        if (req.result && req.result.data) {
          resolve(req.result.data);
        } else {
          const mem = memoryStorage.blobs.get(blobId);
          resolve(mem ? mem.data : null);
        }
      };
      req.onerror = () => {
        const mem = memoryStorage.blobs.get(blobId);
        resolve(mem ? mem.data : null);
      };
    } catch (e) {
      console.warn('[DraftStorage] Exception in getBlob:', e);
      const mem = memoryStorage.blobs.get(blobId);
      resolve(mem ? mem.data : null);
    }
  });
}

/**
 * Medya Blob'unu Sil
 */
export async function deleteBlob(blobId) {
  if (!blobId) return;
  memoryStorage.blobs.delete(blobId);

  const db = await openDraftDB();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_BLOBS, 'readwrite');
      tx.onabort = () => resolve(true);
      const store = tx.objectStore(STORE_BLOBS);
      const req = store.delete(blobId);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(true);
    } catch (e) {
      console.warn('[DraftStorage] Exception in deleteBlob:', e);
      resolve(true);
    }
  });
}

/**
 * Eski Taslakları Temizle (Varsayılan: 7 Günden Eski)
 */
export async function clearOldDrafts(maxAgeDays = 7) {
  const cutoff = Date.now() - (maxAgeDays * 24 * 60 * 60 * 1000);

  // Bellek temizliği (drafts & blobs)
  for (const [id, item] of memoryStorage.drafts.entries()) {
    if ((item.updatedAt || 0) < cutoff) {
      memoryStorage.drafts.delete(id);
    }
  }
  for (const [id, item] of memoryStorage.blobs.entries()) {
    if ((item.createdAt || 0) < cutoff) {
      memoryStorage.blobs.delete(id);
    }
  }

  const db = await openDraftDB();
  if (!db) return;

  try {
    // 1. Süresi dolan taslakları temizle (updatedAt cursor)
    const pDrafts = new Promise((resolve) => {
      try {
        const txDrafts = db.transaction(STORE_DRAFTS, 'readwrite');
        txDrafts.oncomplete = () => resolve();
        txDrafts.onerror = () => resolve();
        txDrafts.onabort = () => resolve();
        const draftStore = txDrafts.objectStore(STORE_DRAFTS);
        if (draftStore.indexNames.contains('updatedAt') && typeof IDBKeyRange !== 'undefined') {
          const draftIndex = draftStore.index('updatedAt');
          const draftRange = IDBKeyRange.upperBound(cutoff);
          const draftCursorReq = draftIndex.openCursor(draftRange);
          draftCursorReq.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
              cursor.delete();
              cursor.continue();
            }
          };
          draftCursorReq.onerror = () => resolve();
        } else {
          const draftCursorReq = draftStore.openCursor();
          draftCursorReq.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
              if ((cursor.value?.updatedAt || 0) < cutoff) {
                cursor.delete();
              }
              cursor.continue();
            }
          };
          draftCursorReq.onerror = () => resolve();
        }
      } catch (e) {
        console.warn('[DraftStorage] Exception in clearOldDrafts pDrafts:', e);
        resolve();
      }
    });

    // 2. Süresi dolan ikili blob nesnelerini createdAt indeksi üzerinde IDBKeyRange cursor ile temizle (OOM crash engelleme)
    const pBlobs = new Promise((resolve) => {
      try {
        const txBlobs = db.transaction(STORE_BLOBS, 'readwrite');
        txBlobs.oncomplete = () => resolve();
        txBlobs.onerror = () => resolve();
        txBlobs.onabort = () => resolve();
        const blobStore = txBlobs.objectStore(STORE_BLOBS);
        if (blobStore.indexNames.contains('createdAt') && typeof IDBKeyRange !== 'undefined') {
          const blobIndex = blobStore.index('createdAt');
          const blobRange = IDBKeyRange.upperBound(cutoff);
          const blobCursorReq = blobIndex.openCursor(blobRange);
          blobCursorReq.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
              cursor.delete();
              cursor.continue();
            }
          };
          blobCursorReq.onerror = () => resolve();
        } else {
          const blobCursorReq = blobStore.openCursor();
          blobCursorReq.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
              if ((cursor.value?.createdAt || 0) < cutoff) {
                cursor.delete();
              }
              cursor.continue();
            }
          };
          blobCursorReq.onerror = () => resolve();
        }
      } catch (e) {
        console.warn('[DraftStorage] Exception in clearOldDrafts pBlobs:', e);
        resolve();
      }
    });

    await Promise.all([pDrafts, pBlobs]);
  } catch (e) {
    console.warn('[DraftStorage] Exception in clearOldDrafts:', e);
  }
}

export default {
  openDraftDB,
  saveDraft,
  getDraft,
  getAllDrafts,
  deleteDraft,
  storeBlob,
  getBlob,
  deleteBlob,
  clearOldDrafts
};
