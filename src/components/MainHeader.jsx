import React from 'react';
import Logo from './Logo';
import { Search, LogIn } from 'lucide-react';

export default function MainHeader({ setView }) {
  return (
    <nav className="bg-gradient-to-r from-[#990000] via-[#800000] to-[#660000] text-white border-b border-red-800 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between py-3.5 gap-4">
        {/* Left: White Logo + Title */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setView('landing')}>
          <div className="brightness-0 invert flex-shrink-0">
            <Logo className="h-10 w-auto" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xs sm:text-sm font-black text-white leading-tight tracking-tight">İSTANBUL ESENYURT ÜNİVERSİTESİ</h1>
            <p className="text-[10px] font-bold text-red-200 uppercase tracking-widest">Kariyer Geliştirme Koordinatörlüğü</p>
          </div>
        </div>

        {/* Right Group: Search Bar + Nav Links + Portala Giriş */}
        <div className="flex items-center gap-4 md:gap-6 overflow-x-auto py-1">
          {/* Search Bar immediately to the left of Hakkımızda */}
          <div className="relative hidden md:block w-44 lg:w-56 flex-shrink-0">
            <Search className="absolute left-3 top-2.5 text-white/60" size={14} />
            <input
              type="text"
              placeholder="İçerik veya Bölüm Ara..."
              className="w-full bg-white/10 text-white placeholder-white/60 text-xs font-medium pl-9 pr-3 py-1.5 rounded-xl border border-white/20 focus:outline-none focus:bg-white/20 transition"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  if (setView) setView('explore');
                }
              }}
            />
          </div>

          {/* Nav Links immediately to the left of Portala Giriş */}
          <div className="hidden lg:flex items-center gap-5 text-xs font-extrabold text-white/90 whitespace-nowrap">
            <button onClick={() => setView('about_us')} className="hover:text-white hover:underline transition">Hakkımızda</button>
            <button onClick={() => setView('services')} className="hover:text-white hover:underline transition">Hizmetlerimiz</button>
            <button onClick={() => setView('events_list')} className="hover:text-white hover:underline transition">Etkinliklerimiz</button>
            <button onClick={() => setView('contact_us')} className="hover:text-white hover:underline transition">İletişim</button>
          </div>

          {/* Far Right: Portala Giriş Button */}
          <button 
            onClick={() => setView('login')}
            className="flex items-center gap-1.5 bg-white text-[#990000] hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md hover:shadow-lg whitespace-nowrap flex-shrink-0"
          >
            <LogIn size={15} /> Portala Giriş
          </button>
        </div>
      </div>
    </nav>
  );
}
