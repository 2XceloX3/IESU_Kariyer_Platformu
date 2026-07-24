import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';

// İstanbul Esenyurt Üniversitesi — Resmi Logo Bileşeni
export default function Logo({ className = '', size = 'md', ...props }) {
  const [imgError, setImgError] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  
  const chaosMode = useAppStore(state => state.chaosMode);
  const setChaosMode = useAppStore(state => state.setChaosMode);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 5) {
      setChaosMode(!chaosMode);
      setClickCount(0);
      if (window.toast) {
        if (!chaosMode) {
          window.toast.error("🔥 KAOS PROTOKOLÜ BAŞLATILDI! 🔥");
        } else {
          window.toast.success("Kaos Protokolü Kapatıldı.");
        }
      }
    }
  };

  const sizeMap = {
    sm: 'h-6',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  };
  const imgClass = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2 cursor-pointer transition-transform ${chaosMode ? 'animate-spin' : ''} ${className}`} onClick={handleLogoClick} {...props}>
      {!imgError ? (
        <img
          src="/logo.png"
          alt="İstanbul Esenyurt Üniversitesi"
          className={`${imgClass} w-auto object-contain shrink-0 ${chaosMode ? 'animate-pulse hue-rotate-180 scale-110' : ''}`}
          onError={() => setImgError(true)}
        />
      ) : (
        // Fallback Logo (If network drops or CDN blocks SVG)
        <div className="flex items-center gap-2 shrink-0 border-2 border-[#990000]/10 p-1.5 rounded-xl bg-[#990000]/5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm" style={{ background: '#990000' }}>
            İ
          </div>
          <div className="flex flex-col leading-none pr-2">
            <span className="font-black text-[13px]" style={{ color: '#990000' }}>İESÜ</span>
            <span className="font-bold text-[9px] text-[#cca26d] uppercase">Kariyer</span>
          </div>
        </div>
      )}
    </div>
  );
}
