/**
 * src/services/ruploadClient.js
 * Meta RUpload (Resumable Upload) Protokolü İstemcisi
 * (Parçalı Yükleme, Ağ Kesintisi Kurtarma, Offset Takibi & Üstel Geri Çekilme)
 */

import { storeBlob, getBlob } from './draftStorage';

/**
 * Ağ bağlantı hızına göre dinamik parça (chunk) boyutu belirle
 */
export function getAdaptiveChunkSize() {
  if (typeof navigator !== 'undefined' && navigator.connection) {
    const effectiveType = navigator.connection.effectiveType;
    if (effectiveType === '4g') return 2 * 1024 * 1024; // 2 MB
    if (effectiveType === '3g') return 512 * 1024;      // 512 KB
    return 256 * 1024;                                  // 256 KB (2G / slow)
  }
  return 1024 * 1024; // 1 MB varsayılan
}

/**
 * RUpload Oturumu Oluştur
 */
export function createUploadSession(fileOrBlob, metadata = {}) {
  const sessionId = 'RUA-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  const waterfallId = 'WF-' + Math.random().toString(36).slice(2, 10);
  
  return {
    sessionId,
    waterfallId,
    totalBytes: fileOrBlob.size,
    uploadedBytes: 0,
    status: 'idle', // 'idle' | 'uploading' | 'paused' | 'completed' | 'error'
    metadata,
    createdAt: Date.now()
  };
}

/**
 * Kopan yükleme için sunucudan son offset bilgisini sorgula (Recovery GET)
 */
export async function getResumeOffset(sessionId) {
  // Simüle edilmiş RUpload recovery: IndexedDB veya oturum tablosundan son baytı getir
  try {
    const saved = localStorage.getItem(`rupload_offset_${sessionId}`);
    if (saved) return parseInt(saved, 10) || 0;
  } catch (_) {}
  return 0;
}

/**
 * Parçalı & Kesintiye Dayanıklı Dosya Yükle
 * @param {Blob|File} blob 
 * @param {Object} options
 * @param {Function} options.onProgress ({ loaded, total, percent })
 * @param {Function} options.onChunkUploaded ({ chunkIndex, offset, totalBytes })
 * @param {number} options.maxRetries
 * @returns {Promise<{ uploadId: string, url: string, totalBytes: number }>}
 */
export async function uploadResumableMedia(blob, options = {}) {
  if (!blob) throw new Error('Yüklenecek medya nesnesi bulunamadı.');

  const {
    onProgress,
    onChunkUploaded,
    maxRetries = 3,
    chunkSize = getAdaptiveChunkSize(),
    metadata = {}
  } = options;

  const totalBytes = blob.size;
  const sessionId = options.sessionId || ('RUA-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8));
  const waterfallId = options.waterfallId || ('WF-' + Math.random().toString(36).slice(2, 10));
  const session = {
    sessionId,
    waterfallId,
    totalBytes,
    uploadedBytes: 0,
    status: 'uploading',
    metadata,
    createdAt: Date.now()
  };
  let currentOffset = await getResumeOffset(session.sessionId);

  // Dosya blob'unu güvenlik için önce IndexedDB'ye yedekle
  try {
    await storeBlob(session.sessionId, blob, { ...metadata, totalBytes });
  } catch (_) {}

  let retries = 0;

  while (currentOffset < totalBytes) {
    const chunkEnd = Math.min(currentOffset + chunkSize, totalBytes);
    const chunk = blob.slice(currentOffset, chunkEnd);

    // RUpload Başlıkları (Meta Protocol)
    const headers = {
      'X-Entity-Name': `${session.waterfallId}_media`,
      'X-Entity-Length': String(totalBytes),
      'Offset': String(currentOffset),
      'X_FB_PHOTO_WATERFALL_ID': session.waterfallId,
      'Content-Type': 'application/octet-stream',
      'X-Instagram-Rupload-Params': JSON.stringify({
        upload_id: session.sessionId,
        media_type: blob.type?.includes('video') ? 2 : 1,
        upload_media_width: metadata.width || 1080,
        upload_media_height: metadata.height || 1080,
        carousel_share_id: metadata.carouselShareId || null
      })
    };

    try {
      // Simüle edilmiş TUS/RUpload HTTP chunk aktarımı
      await new Promise((resolve) => setTimeout(resolve, 30));

      currentOffset = chunkEnd;
      try {
        localStorage.setItem(`rupload_offset_${session.sessionId}`, String(currentOffset));
      } catch (_) {}

      const percent = Math.min(100, Math.round((currentOffset / totalBytes) * 100));

      if (typeof onProgress === 'function') {
        onProgress({
          loaded: currentOffset,
          total: totalBytes,
          percent
        });
      }

      if (typeof onChunkUploaded === 'function') {
        onChunkUploaded({
          offset: currentOffset,
          totalBytes
        });
      }

      retries = 0; // Başarılı parçada sıfırla
    } catch (err) {
      retries++;
      if (retries > maxRetries) {
        throw new Error(`RUpload yüklemesi ${maxRetries} denemeden sonra başarısız oldu: ${err.message}`);
      }
      // Üstel geri çekilme (Exponential backoff: 300ms, 600ms, 1200ms)
      await new Promise((r) => setTimeout(r, Math.pow(2, retries) * 150));
      currentOffset = await getResumeOffset(session.sessionId);
    }
  }

  // Temizlik
  try {
    localStorage.removeItem(`rupload_offset_${session.sessionId}`);
  } catch (_) {}

  // Yükleme tamamlandı URL'i üret
  const mockCdnUrl = (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function')
    ? URL.createObjectURL(blob)
    : `https://cdn.esenyurt.edu.tr/media/${session.sessionId}.webp`;

  return {
    uploadId: session.sessionId,
    blobId: session.sessionId,
    url: mockCdnUrl,
    totalBytes
  };
}

/**
 * Sayfa yenilenmesi veya oturum geçişlerinde IndexedDB'den kalıcı medya URL'i çöz
 */
export async function resolvePersistentMediaUrl(urlOrBlobId) {
  if (!urlOrBlobId) return null;
  if (typeof urlOrBlobId === 'string' && (urlOrBlobId.startsWith('http://') || urlOrBlobId.startsWith('https://') || urlOrBlobId.startsWith('data:'))) {
    return urlOrBlobId;
  }
  try {
    const blobRecord = await getBlob(urlOrBlobId);
    if (blobRecord) {
      const realBlob = blobRecord instanceof Blob ? blobRecord : blobRecord.data;
      if (realBlob && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
        return URL.createObjectURL(realBlob);
      }
    }
  } catch (_) {}
  return urlOrBlobId;
}

export default {
  createUploadSession,
  getResumeOffset,
  uploadResumableMedia,
  getAdaptiveChunkSize,
  resolvePersistentMediaUrl
};
