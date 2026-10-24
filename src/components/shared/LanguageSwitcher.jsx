/**
 * src/components/shared/LanguageSwitcher.jsx
 * İstanbul Esenyurt Üniversitesi (İESÜ) Çok Dilli (TR / EN / AR / DE) Dil Değiştirici
 */

import React, { useState, useRef, useEffect } from 'react';
import { Languages, Check, Globe } from 'lucide-react';
import { useTranslation, SUPPORTED_LANGUAGES } from '../../i18n';

export default function LanguageSwitcher({ variant = 'default', className = '' }) {
  const { language, setLanguage, isEn, isTr, isAr, isDe, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleLanguage = () => {
    // Cycle through languages: tr -> en -> ar -> de -> tr
    const order = ['tr', 'en', 'ar', 'de'];
    const idx = order.indexOf(language);
    const nextLang = order[(idx + 1) % order.length];
    setLanguage(nextLang);
  };

  if (variant === 'pill') {
    return (
      <div 
        role="group"
        aria-label={t('common.language')}
        className={`inline-flex items-center p-0.5 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-xs ${className}`}
      >
        {SUPPORTED_LANGUAGES.map((langItem) => {
          const isActive = language === langItem.code;
          return (
            <button
              key={langItem.code}
              type="button"
              onClick={() => setLanguage(langItem.code)}
              aria-pressed={isActive}
              title={langItem.nativeName}
              className={`px-2.5 py-1 rounded-full font-bold transition-all flex items-center gap-1 ${
                isActive 
                  ? 'bg-white text-[#990000] shadow-sm' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{langItem.flag}</span>
              <span>{langItem.code.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default compact toggle button with dropdown support
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(v => !v)}
        onDoubleClick={toggleLanguage}
        aria-label={`Dil Değiştir: ${currentLangObj.nativeName}`}
        aria-expanded={isOpen}
        title="Dili değiştir (Çift tıkla: Hızlı geçiş)"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
          variant === 'dark'
            ? 'bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/30 shadow-sm'
            : variant === 'compact' || variant === 'light'
            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-xs'
            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-xs'
        } ${className}`}
      >
        <Globe size={14} className="opacity-80" />
        <span className="font-mono uppercase">{language.toUpperCase()}</span>
        <span className="text-[11px] opacity-85">{currentLangObj.flag}</span>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-44 rounded-2xl bg-white shadow-2xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-gray-800"
          role="menu"
        >
          <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-gray-400 border-b border-gray-100">
            {t('common.language')}
          </div>
          {SUPPORTED_LANGUAGES.map((langItem) => {
            const isSelected = language === langItem.code;
            return (
              <button
                key={langItem.code}
                type="button"
                role="menuitem"
                onClick={() => {
                  setLanguage(langItem.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold hover:bg-gray-50 transition-colors text-left ${
                  isSelected ? 'text-[#990000] bg-red-50/50 font-bold' : 'text-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{langItem.flag}</span>
                  <span>{langItem.nativeName}</span>
                </span>
                {isSelected && <Check size={14} className="text-[#990000]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
