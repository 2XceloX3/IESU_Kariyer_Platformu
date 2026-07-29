import React from 'react';

export default function Logo({ size = 'md', variant = 'default', className = '', ...props }) {
  const sizeMap = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
  };
  const imgClass = sizeMap[size] || sizeMap.md;
  const isWhite = variant === 'white';

  return (
    <div className={`flex items-center gap-2 cursor-pointer shrink-0 ${className}`} {...props}>
      <img
        src="/iesu-logo.svg"
        alt="İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi"
        className={`${imgClass} w-auto object-contain shrink-0 ${isWhite ? 'brightness-0 invert' : ''}`}
      />
    </div>
  );
}
