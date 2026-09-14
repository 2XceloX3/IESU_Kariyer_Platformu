import React, { useState } from 'react';
import Logo from './Logo';
import { Search, LogIn, Menu, X } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function MainHeader({ setView, currentUser, userRole }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const siteConfig = useAppStore(state => state.siteConfig);
  return (
    <header className="sticky top-0 z-50 shadow-2xl">
      {/* Dynamic Crimson Red Navbar with corporate primary color */}
      <nav 
        style={{ backgroundColor: siteConfig?.primaryColor || '#990000' }}
        className="text-white relative border-b border-red-950/60 transition-colors duration-300 shadow-md"
      >
        {/* Subtle Background Accent Grid Pattern matching footer */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        <div className="w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between py-3.5 gap-4 relative z-10">
          
          {/* FAR LEFT: Official Logo + Title */}
          <div 
            className="flex items-center gap-3 cursor-pointer shrink-0" 
            onClick={() => {
              if (setView) {
                if (currentUser) {
                  const role = currentUser.role || userRole;
                  setView(role === 'admin' ? 'admin' : (role === 'employer' || role === 'company') ? 'company' : role === 'alumni' ? 'alumni' : role === 'academic' ? 'academic' : 'student');
                } else {
                  setView('landing');
                }
              }
            }}
          >
            <Logo size="lg" variant="white" />
            <div className="hidden sm:block">
              <h1 className="text-xs sm:text-sm font-black text-white leading-tight tracking-tight drop-shadow-md">İSTANBUL ESENYURT ÜNİVERSİTESİ</h1>
              <p className="text-[10px] font-bold text-red-100 uppercase tracking-widest">{siteConfig?.logoSubText || 'Kariyer Geliştirme Merkezi'}</p>
            </div>
          </div>

          {/* CENTER & RIGHT GROUP: Search Bar + Nav Links */}
          <div className="flex items-center gap-4 md:gap-6 overflow-x-auto py-1">
            {/* Search Bar */}
            <div className="relative hidden md:block w-40 lg:w-52 flex-shrink-0">
              <Search className="absolute left-3 top-2.5 text-white/60" size={14} />
              <input
                type="text"
                placeholder="İçerik veya Bölüm Ara..."
                aria-label="İçerik veya bölüm ara"
                className="w-full bg-white/10 text-white placeholder-white/60 text-xs font-medium pl-9 pr-3 py-1.5 rounded-xl border border-white/20 focus:outline-none focus:bg-white/20 transition shadow-inner"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    if (setView) setView('explore');
                  }
                }}
              />
            </div>

            {/* Nav Links (Desktop) */}
            <div className="hidden lg:flex items-center gap-5 text-xs font-extrabold text-white/90 whitespace-nowrap">
              <button onClick={() => setView && setView('about_us')} className="hover:text-white hover:scale-105 transition-all">Hakkımızda</button>
              <button onClick={() => setView && setView('services')} className="hover:text-white hover:scale-105 transition-all">Hizmetlerimiz</button>
              <button onClick={() => setView && setView('events_list')} className="hover:text-white hover:scale-105 transition-all">Etkinliklerimiz</button>
              <button onClick={() => setView && setView('contact_us')} className="hover:text-white hover:scale-105 transition-all">İletişim</button>
              <button onClick={() => setView && setView('haberler')} className="hover:text-white hover:scale-105 transition-all">Neler Oluyor?</button>
            </div>

            {/* FAR RIGHT: User Avatar or Portala Giriş Button */}
            {currentUser ? (
              <button 
                onClick={() => setView && setView(currentUser.role === 'admin' ? 'admin' : currentUser.role === 'student' ? 'student' : currentUser.role === 'alumni' ? 'alumni' : currentUser.role === 'company' ? 'company' : 'academic')}
                className="flex items-center gap-2 bg-white text-[#990000] hover:bg-red-50 px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all shadow-lg hover:scale-105 whitespace-nowrap flex-shrink-0"
              >
                <img src={currentUser.avatar || '/iesu-logo.svg'} alt="" className="w-5 h-5 rounded-full object-cover border border-[#990000]" />
                <span className="hidden sm:inline">Panelime Dön ({currentUser.name?.split(' ')[0]})</span>
                <span className="sm:hidden">Panel</span>
              </button>
            ) : (
              <button 
                onClick={() => setView && setView('login')}
                className="flex items-center gap-1.5 bg-white text-[#990000] hover:bg-red-50 px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all shadow-lg hover:shadow-xl whitespace-nowrap flex-shrink-0 hover:scale-105"
              >
                <LogIn size={15} strokeWidth={2.5} /> <span>Giriş</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition focus:outline-none flex-shrink-0"
              aria-label="Menüyü Aç/Kapat"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-6 py-4 space-y-3 animate-fade-in shadow-2xl">
            <div className="flex flex-col space-y-2 text-sm font-bold text-white/90">
              <button 
                onClick={() => { if (setView) setView('about_us'); setIsMobileMenuOpen(false); }} 
                className="text-left py-2 px-3 rounded-lg hover:bg-white/10 transition"
              >
                Hakkımızda
              </button>
              <button 
                onClick={() => { if (setView) setView('services'); setIsMobileMenuOpen(false); }} 
                className="text-left py-2 px-3 rounded-lg hover:bg-white/10 transition"
              >
                Hizmetlerimiz
              </button>
              <button 
                onClick={() => { if (setView) setView('events_list'); setIsMobileMenuOpen(false); }} 
                className="text-left py-2 px-3 rounded-lg hover:bg-white/10 transition"
              >
                Etkinliklerimiz
              </button>
              <button 
                onClick={() => { if (setView) setView('contact_us'); setIsMobileMenuOpen(false); }} 
                className="text-left py-2 px-3 rounded-lg hover:bg-white/10 transition"
              >
                İletişim
              </button>
              <button 
                onClick={() => { if (setView) setView('haberler'); setIsMobileMenuOpen(false); }} 
                className="text-left py-2 px-3 rounded-lg hover:bg-white/10 transition"
              >
                Neler Oluyor?
              </button>
            </div>
          </div>
        )}

      </nav>
    </header>
  );
}
