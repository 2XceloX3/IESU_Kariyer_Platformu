import React from 'react';
import { getTenantConfig } from '../config/tenantConfig';
import useAppStore from '../store/useAppStore';

export default function Logo({ size = 'md', variant = 'default', color = 'default', className = '', ...props }) {
  const tenant = getTenantConfig();
  const darkMode = useAppStore((state) => state.darkMode);

  const sizeMap = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
  };
  const imgClass = sizeMap[size] || sizeMap.md;
  const isWhite = variant === 'white' || Boolean(darkMode);

  // CSS Filter to recolor the original red SVG logo (#c81d3f) to exact target themes in light mode
  const colorFilterMap = {
    emerald: 'hue-rotate-[135deg] saturate-[3.8] brightness-[0.48]', // İdeal Zümrüt Yeşili (text-emerald-800)
    indigo: 'hue-rotate-[275deg] saturate-[4.5] brightness-[0.25]',  // Derin Koyu Lila / Mor (Akademik)
    purple: 'hue-rotate-[275deg] saturate-[4.5] brightness-[0.25]',  // Derin Koyu Lila / Mor
    blue: 'hue-rotate-[215deg] saturate-[4] brightness-[0.35]',      // Derin Koyu Lacivert (text-blue-900 / Deep Navy)
    navy: 'hue-rotate-[215deg] saturate-[4] brightness-[0.35]',      // Derin Koyu Lacivert
    red: '',                                                          // Orijinal Üniversite Kırmızısı (Öğrenci)
    default: ''
  };

  const colorFilterClass = colorFilterMap[color] || '';
  const logoSrc = props.src || tenant.logoUrl || '/iesu-logo.svg';
  const altText = props.alt || `${tenant.institutionName} ${tenant.coordinatorTitle}`;

  return (
    <div
      data-iesu-logo-container="true"
      className={`flex items-center gap-2 cursor-pointer shrink-0 ${className}`}
      {...props}
    >
      <img
        src={logoSrc}
        alt={altText}
        data-iesu-logo="true"
        data-logo-variant={isWhite ? 'white' : color}
        className={`${imgClass} w-auto object-contain shrink-0 transition-all duration-200 dark:brightness-0 dark:invert ${
          isWhite ? 'brightness-0 invert' : colorFilterClass
        }`}
      />
    </div>
  );
}
