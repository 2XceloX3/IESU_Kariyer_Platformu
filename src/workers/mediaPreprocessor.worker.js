/**
 * src/workers/mediaPreprocessor.worker.js
 * Instagram Tarzı İstemci Ön İşleme Web Worker'ı
 * (Kademeli Piramit Boyutlandırma, sRGB Renk Uzayı, EXIF Yönlendirme & KVKK GPS Temizliği)
 */

/**
 * JPEG ArrayBuffer üzerinden EXIF Orientation (0x0112) değerini oku
 */
function readExifOrientation(buffer) {
  if (!buffer || buffer.byteLength < 16) return 1;
  const view = new DataView(buffer);
  
  // JPEG SOI (0xFFD8) kontrolü
  if (view.getUint16(0, false) !== 0xFFD8) return 1;

  let offset = 2;
  const length = view.byteLength;

  while (offset < length) {
    if (offset + 4 > length) break;
    const marker = view.getUint16(offset, false);
    offset += 2;

    // APP1 Marker (0xFFE1) -> EXIF
    if (marker === 0xFFE1) {
      /* app1Length */ void view.getUint16(offset, false);
      offset += 2;
      
      // "Exif\0\0" (0x45786966 0000) kontrolü
      if (view.getUint32(offset, false) === 0x45786966 && view.getUint16(offset + 4, false) === 0x0000) {
        const tiffOffset = offset + 6;
        const littleEndian = view.getUint16(tiffOffset, false) === 0x4949; // "II" = Little Endian, "MM" = Big Endian

        // 0x002A kontrolü
        if (view.getUint16(tiffOffset + 2, littleEndian) !== 0x002A) return 1;

        const firstIfdOffset = view.getUint32(tiffOffset + 4, littleEndian);
        let ifdOffset = tiffOffset + firstIfdOffset;
        if (ifdOffset + 2 > length) return 1;

        const entryCount = view.getUint16(ifdOffset, littleEndian);
        ifdOffset += 2;

        for (let i = 0; i < entryCount; i++) {
          const entryPos = ifdOffset + (i * 12);
          if (entryPos + 12 > length) break;

          const tag = view.getUint16(entryPos, littleEndian);
          if (tag === 0x0112) { // Orientation tag
            const orientation = view.getUint16(entryPos + 8, littleEndian);
            if (orientation >= 1 && orientation <= 8) return orientation;
          }
        }
      }
      break;
    } else if ((marker & 0xFF00) === 0xFF00) {
      // Diğer marker'ları atla
      if (marker === 0xFFDA || marker === 0xFFD9) break; // SOS veya EOI
      const segmentLen = view.getUint16(offset, false);
      offset += segmentLen;
    } else {
      break;
    }
  }

  return 1;
}

/**
 * Kademeli Piramit Boyutlandırma (Stepped Pyramid Downsampling)
 */
async function processImage(data) {
  const { buffer, targetWidth = 1080, quality = 0.87 } = data;
  const orientation = readExifOrientation(buffer);

  let bitmap;
  try {
    const blob = new Blob([buffer]);
    bitmap = await createImageBitmap(blob);
  } catch (err) {
    throw new Error('createImageBitmap başarısız: ' + err.message);
  }

  let srcW = bitmap.width;
  let srcH = bitmap.height;

  // EXIF 90 / 270 derece dönmüşse en-boy yer değiştirir
  const isRotated = orientation === 5 || orientation === 6 || orientation === 7 || orientation === 8;
  const originalWidth = isRotated ? srcH : srcW;
  const originalHeight = isRotated ? srcW : srcH;

  // Hedef boyutları hesapla (Instagram max 1080px genişlik kuralı)
  let destW = originalWidth;
  let destH = originalHeight;

  if (destW > targetWidth) {
    const scale = targetWidth / destW;
    destW = targetWidth;
    destH = Math.round(originalHeight * scale);
  }

  // Kademeli boyutlandırma için geçici canvas
  let currentW = originalWidth;
  let currentH = originalHeight;

  // İlk canvas (Orientation düzeltmeli)
  let canvas = new OffscreenCanvas(currentW, currentH);
  let ctx = canvas.getContext('2d', { colorSpace: 'srgb', alpha: false });

  // Orientation dönüşümü (Canvas 2D koordinat dönüşümleri)
  ctx.save();
  switch (orientation) {
    case 2:
      ctx.translate(currentW, 0);
      ctx.scale(-1, 1);
      break;
    case 3:
      ctx.translate(currentW, currentH);
      ctx.rotate(Math.PI);
      break;
    case 4:
      ctx.translate(0, currentH);
      ctx.scale(1, -1);
      break;
    case 5:
      ctx.translate(currentW, 0);
      ctx.rotate(Math.PI / 2);
      ctx.scale(1, -1);
      break;
    case 6:
      ctx.translate(currentW, 0);
      ctx.rotate(Math.PI / 2);
      break;
    case 7:
      ctx.translate(0, currentH);
      ctx.rotate(-Math.PI / 2);
      ctx.scale(1, -1);
      break;
    case 8:
      ctx.translate(0, currentH);
      ctx.rotate(-Math.PI / 2);
      break;
    default:
      break;
  }
  ctx.drawImage(bitmap, 0, 0);
  ctx.restore();

  // Kademeli piramit: Hedefin 2 katına inene kadar 0.5x indir
  while (currentW * 0.5 >= destW) {
    const nextW = Math.floor(currentW * 0.5);
    const nextH = Math.floor(currentH * 0.5);
    const stepCanvas = new OffscreenCanvas(nextW, nextH);
    const stepCtx = stepCanvas.getContext('2d', { colorSpace: 'srgb', alpha: false });
    stepCtx.imageSmoothingEnabled = true;
    stepCtx.imageSmoothingQuality = 'high';
    stepCtx.drawImage(canvas, 0, 0, nextW, nextH);

    canvas = stepCanvas;
    currentW = nextW;
    currentH = nextH;
  }

  // Son adım: Hedef genişlik ve yüksekliğe pürüzsüz indir
  if (currentW !== destW || currentH !== destH) {
    const finalCanvas = new OffscreenCanvas(destW, destH);
    const finalCtx = finalCanvas.getContext('2d', { colorSpace: 'srgb', alpha: false });
    finalCtx.imageSmoothingEnabled = true;
    finalCtx.imageSmoothingQuality = 'high';
    finalCtx.drawImage(canvas, 0, 0, destW, destH);
    canvas = finalCanvas;
  }

  // WebP kodlama (KVKK gereği GPS başlıkları yok edilmiş saf piksel çıktısı)
  let outputBlob;
  try {
    outputBlob = await canvas.convertToBlob({ type: 'image/webp', quality });
  } catch {
    outputBlob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
  }

  return {
    blob: outputBlob,
    width: destW,
    height: destH,
    mimeType: outputBlob.type || 'image/webp',
    orientationFixed: orientation !== 1,
    gpsStripped: true
  };
}

if (typeof self !== 'undefined' && typeof self.addEventListener === 'function') {
  self.addEventListener('message', async (e) => {
    const { id, type, payload } = e.data || {};
    if (type === 'PROCESS_IMAGE') {
      try {
        const result = await processImage(payload);
        self.postMessage({ id, success: true, ...result });
      } catch (err) {
        self.postMessage({ id, success: false, error: err.message });
      }
    }
  });
}

export { readExifOrientation };
