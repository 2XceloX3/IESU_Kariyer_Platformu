/**
 * src/components/shared/LanguageSwitcher.jsx
 * İstanbul Esenyurt Üniversitesi (İESÜ) Küresel Dil Seçici Bileşeni
 */

import React from 'react';
import { Languages, Check } from 'lucide-react';
import { useTranslation } from '../../i18n';

export default function LanguageSwitcher({ variant = 'default', className = '' }) {
  const { language, setLanguage, isEn, isTr, t } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = isTr ? 'en' : 'tr';
    setLanguage(nextLang);
  };

  if (variant === 'pill') {
    return (
      <div 
        role="group"
        aria-label={t('common.language')}
        className={`inline-flex items-center p-0.5 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-xs ${className}`}
      >
        <button
          type="button"
          onClick={() => setLanguage('tr')}
          aria-pressed={isTr}
          className={`px-2.5 py-1 rounded-full font-bold transition-all flex items-center gap-1 ${
            isTr 
              ? 'bg-white text-[#990000] shadow-sm' 
              : 'text-white/80 hover:text-white'
          }`}
        >
          <span>🇹🇷</span>
          <span>TR</span>
        </button>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          aria-pressed={isEn}
          className={`px-2.5 py-1 rounded-full font-bold transition-all flex items-center gap-1 ${
            isEn 
              ? 'bg-white text-[#990000] shadow-sm' 
              : 'text-white/80 hover:text-white'
          }`}
        >
          <span>🇬🇧</span>
          <span>EN</span>
        </button>
      </div>
    );
  }

  // Default compact toggle button
  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={`Dil Değiştir: ${isTr ? 'English' : 'Türkçe'}`}
      title={isTr ? 'Switch to English' : 'Türkçe Dilini Seç'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
        variant === 'dark'
          ? 'bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/30 shadow-sm'
          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-xs'
      } ${className}`}
    >
      <Languages size={14} className="opacity-80" />
      <span className="font-mono uppercase">{language.toUpperCase()}</span>
      <span className="text-[11px] opacity-75">{isTr ? '🇹🇷' : '🇬🇧'}</span>
    </button>
  );
}
