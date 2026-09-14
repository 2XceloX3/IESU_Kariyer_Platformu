import React, { useEffect, useState } from 'react';

const PLACEHOLDER_SRCS = ['logo.png', 'ui-avatars.com', 'gravatar.com', 'pravatar.cc'];

function isPlaceholder(src) {
  if (!src) return true;
  return PLACEHOLDER_SRCS.some(p => src.includes(p));
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.charAt(0).toUpperCase();
}

const BG_COLORS = [
  'bg-[#990000]','bg-[#0A2342]','bg-[#059669]','bg-[#7C3AED]',
  'bg-[#B45309]','bg-[#DC2626]','bg-[#0284C7]','bg-[#065F46]',
];

function getBgColor(name) {
  if (!name) return BG_COLORS[0];
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
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  const isInstitutional = isAdmin || (typeof name === 'string' && (
    name.toLowerCase().includes('kariyer') ||
    name.toLowerCase().includes('esenyurt') ||
    name.toLowerCase().includes('kgm') ||
    name.toLowerCase().includes('yönetici')
  ));

  if (isInstitutional && (!src || isPlaceholder(src) || imgError)) {
    return (
      <div className={`${sizeClass} ${rounded} bg-white flex items-center justify-center shrink-0 border border-gray-200 p-1 shadow-sm overflow-hidden ${className}`}>
        <img 
          src="/iesu-logo.svg" 
          alt={alt || "IESU Logo"} 
          className="w-full h-full object-contain"
          onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }} 
        />
      </div>
    );
  }

  const bg = getBgColor(name);
  const initials = getInitials(name);
  const showImage = src && !isPlaceholder(src) && !imgError;

  return (
    <div className={`${sizeClass} ${rounded} shrink-0 overflow-hidden flex items-center justify-center ${showImage ? 'bg-gray-100' : `${bg} text-white font-bold`} ${className}`}>
      {showImage ? (
        <img 
          src={src} 
          alt={alt || name || 'Avatar'} 
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
