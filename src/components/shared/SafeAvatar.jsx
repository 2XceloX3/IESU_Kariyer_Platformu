import React, { useEffect, useState } from 'react';

const PLACEHOLDER_SRCS = ['logo.png', 'ui-avatars.com', 'gravatar.com', 'pravatar.cc'];

function isPlaceholder(src) {
  if (!src || typeof src !== 'string') return true;
  return PLACEHOLDER_SRCS.some(p => src.includes(p));
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

  if (isInstitutional && (!safeSrc || isPlaceholder(safeSrc) || imgError)) {
    return (
      <div className={`${sizeClass} ${rounded} bg-white flex items-center justify-center shrink-0 border border-gray-200 p-1 shadow-sm overflow-hidden ${safeClassName}`}>
        <img 
          src="/iesu-logo.svg" 
          alt={alt || "IESU Logo"} 
          className="w-full h-full object-contain"
          onError={(e) => { e.target.onerror = null; e.target.src = '/iesu-logo.svg'; }} 
        />
      </div>
    );
  }

  const bg = getBgColor(safeName);
  const initials = getInitials(safeName);
  const showImage = safeSrc && !isPlaceholder(safeSrc) && !imgError;
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
      ) : (
        <span className="select-none leading-none tracking-tight">{initials}</span>
      )}
    </div>
  );
}
