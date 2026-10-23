import React, { useEffect, useState } from 'react';

// Banned external placeholder services and unsafe origins per AGENTS.md Rule 6
const BANNED_OR_PLACEHOLDER_SUBSTRINGS = [
  'pravatar',
  'ui-avatars',
  'gravatar',
  'placehold.it',
  'placeholder',
  'via.placeholder',
  'dummyimage'
];

function isInvalidOrPlaceholder(src) {
  if (!src || typeof src !== 'string') return true;
  const lower = src.toLowerCase().trim();
  if (!lower || lower === 'null' || lower === 'undefined' || lower === 'logo.png') return true;
  return BANNED_OR_PLACEHOLDER_SUBSTRINGS.some(pattern => lower.includes(pattern));
}

function getInitials(name) {
  if (!name || typeof name !== 'string') return '?';
  // Strip academic / professional titles so real person name initials are shown (e.g. Dr. Öğr. Üyesi Mehmet Selim -> MS)
  const cleanedName = name
    .replace(/^(Prof\.|Dr\.|Doç\.|Öğr\.|Gör\.|Arş\.|Uzm\.|Av\.|Yrd\.|Müh\.)\s+/gi, '')
    .replace(/^(Prof\.|Dr\.|Doç\.|Öğr\.|Gör\.|Arş\.|Uzm\.|Av\.|Yrd\.|Müh\.|Üyesi)\s+/gi, '')
    .replace(/^Üyesi\s+/gi, '')
    .trim();
  const target = (cleanedName && cleanedName.trim().length > 0) ? cleanedName.trim() : name.trim();
  if (!target) return '?';
  const parts = target.split(/\s+/).filter(Boolean);
  if (parts.length >= 2 && parts[0] && parts[parts.length - 1]) {
    const first = parts[0][0] || '';
    const last = parts[parts.length - 1][0] || '';
    return (first + last).toUpperCase() || '?';
  }
  return target.charAt(0).toUpperCase() || '?';
}

const BG_COLORS = [
  'bg-[#990000]','bg-[#0A2342]','bg-[#059669]','bg-[#7C3AED]',
  'bg-[#B45309]','bg-[#DC2626]','bg-[#0284C7]','bg-[#065F46]',
];

function getBgColor(name) {
  if (!name || typeof name !== 'string') return BG_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return BG_COLORS[Math.abs(hash) % BG_COLORS.length];
}

export default function SafeAvatar({ 
  src, 
  name = '', 
  size = 'md', 
  className = '', 
  alt = '', 
  isAdmin = false,
  rounded = 'rounded-full' 
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);
  
  const sizeClasses = {
    xs: 'w-6 h-6 text-[9px]', 
    sm: 'w-8 h-8 text-xs', 
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base', 
    xl: 'w-16 h-16 text-lg', 
    '2xl': 'w-20 h-20 text-xl font-black',
    full: 'w-full h-full text-2xl font-black',
  };
  const sizeClass = sizeClasses[size] || (typeof size === 'string' && sizeClasses[size]) || sizeClasses.md;
  
  const safeName = typeof name === 'string' ? name : '';
  const safeClassName = typeof className === 'string' ? className : '';
  const safeSrc = typeof src === 'string' ? src : '';

  const isInstitutional = isAdmin || (safeName && (
    safeName.toLowerCase().includes('kariyer') ||
    safeName.toLowerCase().includes('esenyurt') ||
    safeName.toLowerCase().includes('kgm') ||
    safeName.toLowerCase().includes('yönetici') ||
    safeName.toLowerCase().includes('admin') ||
    safeName.toLowerCase().includes('kurumsal') ||
    safeName.toLowerCase().includes('rektör')
  ));

  if (isInstitutional && (!safeSrc || isInvalidOrPlaceholder(safeSrc) || imgError)) {
    return (
      <div className={`${sizeClass} ${rounded} bg-white flex items-center justify-center shrink-0 border border-slate-200 p-1 shadow-sm overflow-hidden ${safeClassName}`}>
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label={alt || "İESÜ Logo"}>
          <rect width="40" height="40" rx="8" fill="#990000" />
          <path d="M20 7L32 14L20 21L8 14L20 7Z" fill="#F8FAFC" />
          <path d="M12 17V26C12 28.5 15.6 31 20 31C24.4 31 28 28.5 28 26V17" stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
          <path d="M32 14V24" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  const bg = getBgColor(safeName);
  const initials = getInitials(safeName);
  const showImage = safeSrc && !isInvalidOrPlaceholder(safeSrc) && !imgError;
  const isWhiteContainer = safeClassName.includes('bg-white');
  const textColorClass = isWhiteContainer ? 'text-slate-900 font-black' : 'text-white font-bold';

  return (
    <div className={`${sizeClass} ${rounded} shrink-0 overflow-hidden flex items-center justify-center ${showImage ? 'bg-gray-100' : `${bg} ${textColorClass}`} ${safeClassName}`}>
      {showImage ? (
        <img 
          src={safeSrc} 
          alt={alt || safeName || 'Avatar'} 
          className="w-full h-full object-cover" 
          loading="lazy"
          onError={() => setImgError(true)} 
        />
      ) : initials !== '?' ? (
        <span className="select-none leading-none tracking-tight">{initials}</span>
      ) : (
        <svg viewBox="0 0 24 24" className="w-1/2 h-1/2 opacity-80" fill="currentColor">
          <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  );
}
