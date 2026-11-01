import React, { useState, useEffect } from 'react';
import { OFFICIAL_FALLBACK_IMAGES, normalizeScrapedImageUrl } from '../../services/scraper';

/**
 * Resilient image component for university event posters, news, and announcements.
 * - Normalizes &amp; entities and relative esenyurt.edu.tr URLs
 * - Intercepts soft-404 responses (where server returns HTML instead of image) via onError
 * - Supports mode="poster" (clean vertical poster presentation), mode="contain" (modal full view),
 *   and mode="cover" (standard card cover)
 */
export default function SafeEventImage({
  src,
  alt = 'İstanbul Esenyurt Üniversitesi Etkinlik Afişi',
  fallbackType = 'event',
  className = '',
  imgClassName = '',
  mode = 'poster'
}) {
  const defaultFallback = OFFICIAL_FALLBACK_IMAGES[fallbackType] || OFFICIAL_FALLBACK_IMAGES.event;
  const normalizedInitial = normalizeScrapedImageUrl(src, fallbackType);
  const [imgSrc, setImgSrc] = useState(normalizedInitial);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    const nextUrl = normalizeScrapedImageUrl(src, fallbackType);
    setImgSrc(nextUrl);
    setHasFailed(false);
  }, [src, fallbackType]);

  const handleError = () => {
    if (!hasFailed && imgSrc !== defaultFallback) {
      setHasFailed(true);
      setImgSrc(defaultFallback);
    }
  };

  const effectiveSrc = imgSrc || defaultFallback;

  const fitClass =
    mode === 'contain'
      ? 'object-contain object-center'
      : mode === 'poster'
      ? 'object-cover object-top'
      : 'object-cover object-center';

  return (
    <div className={`relative overflow-hidden bg-slate-100 select-none ${className}`}>
      {mode === 'contain' && (
        <img
          src={effectiveSrc}
          alt=""
          aria-hidden="true"
          loading="lazy"
          onError={handleError}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-35 blur-xl scale-110 pointer-events-none select-none"
        />
      )}
      <img
        src={effectiveSrc}
        alt={alt}
        loading="lazy"
        onError={handleError}
        className={`relative z-10 w-full h-full ${fitClass} transition-transform duration-500 group-hover:scale-[1.03] ${imgClassName}`}
      />
    </div>
  );
}
