import React from 'react';
import { Moon, Sun } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export default function ThemeToggle({ variant = 'header', isDark = false, className = '' }) {
  const darkMode = useAppStore((state) => state.darkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);

  const isHeader = variant === 'header';

  return (
    <button
      type="button"
      role="switch"
      onClick={toggleDarkMode}
      data-testid="theme-toggle"
      aria-checked={Boolean(darkMode)}
      aria-pressed={Boolean(darkMode)}
      aria-label={darkMode ? 'Aydınlık temaya geç' : 'Karanlık temaya geç'}
      title={darkMode ? 'Aydınlık temaya geç' : 'Karanlık temaya geç'}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-200 cursor-pointer shrink-0 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
        isHeader
          ? darkMode
            ? 'bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-slate-700'
            : 'bg-white/15 hover:bg-white/25 text-white border border-white/25'
          : isDark || darkMode
            ? 'bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-slate-700'
            : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/90'
      } ${className}`}
    >
      {darkMode ? (
        <Sun size={17} strokeWidth={2.2} className="transition-transform duration-200 hover:rotate-12" />
      ) : (
        <Moon size={17} strokeWidth={2.2} className="transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
}
