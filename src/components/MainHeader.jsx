import React, { useState } from 'react';
import SafeAvatar from './shared/SafeAvatar';
import Logo from './Logo';
import { Search, LogIn, Menu, X } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { getTenantConfig } from '../config/tenantConfig';
import LanguageSwitcher from './shared/LanguageSwitcher';
import { useTranslation } from '../i18n';

export default function MainHeader({ setView, currentUser, userRole }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const siteConfig = useAppStore(state => state.siteConfig);
  const activePortalBranch = useAppStore(state => state.activePortalBranch);
  const tenant = getTenantConfig();
  const { t } = useTranslation();

  const submitSearch = (event) => {
    event?.preventDefault?.();
    const query = searchQuery.trim();
    if (!query) return;
    try {
      sessionStorage.setItem('iesu_jobs_search_query', query);
    } catch (_) {}
    setView?.('jobs');
    setIsMobileMenuOpen(false);
  };

  const getDestination = () => {
    if (!currentUser) return 'landing';
    const role = currentUser.role || userRole;
    if (role === 'admin') return 'admin';
    if (activePortalBranch && activePortalBranch !== 'landing') return activePortalBranch;
    return (role === 'employer' || role === 'company') ? 'company' : role === 'alumni' ? 'alumni' : role === 'academic' ? 'academic' : 'student';
  };

  return (
    <header className="sticky top-0 z-50 shadow-2xl">
      {/* Dynamic Crimson Red Navbar with corporate primary color */}
      <nav 
        style={{ backgroundColor: siteConfig?.primaryColor || tenant.colors?.primary || '#990000' }}
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
                setView(getDestination());
              }
            }}
          >
            <Logo size="lg" variant="white" />
            <div className="hidden sm:block">
              <h1 className="text-xs sm:text-sm font-black text-white leading-tight tracking-tight drop-shadow-md">
                İstanbul Esenyurt Üniversitesi
              </h1>
              <p className="text-[10px] font-bold text-red-100 tracking-wider">{t('common.coordinatorTitle')}</p>
            </div>
          </div>

          {/* CENTER & RIGHT GROUP: Search Bar + Nav Links */}
          <div className="flex items-center gap-4 md:gap-6 overflow-x-auto py-1">
            {/* Search Bar */}
            <form onSubmit={submitSearch} role="search" className="relative hidden md:block w-40 lg:w-52 flex-shrink-0">
              <Search className="absolute left-3 top-2.5 text-white/60" size={14} />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('common.searchPlaceholder')}
                aria-label={t('common.searchPlaceholder')}
                className="w-full bg-white/10 text-white placeholder-white/60 text-xs font-medium pl-9 pr-3 py-2 rounded-xl border border-white/20 focus:outline-none focus:bg-white/20 focus-visible:ring-2 focus-visible:ring-white transition shadow-inner"
              />
            </form>

            {/* Nav Links (Desktop) */}
            <div className="hidden lg:flex items-center gap-5 text-xs font-extrabold text-white/90 whitespace-nowrap">
              <button onClick={() => setView && setView('about_us')} className="hover:text-white hover:scale-105 transition-all">{t('nav.aboutUs')}</button>
              <button onClick={() => setView && setView('services')} className="hover:text-white hover:scale-105 transition-all">{t('nav.services')}</button>
              <button onClick={() => setView && setView('events_list')} className="hover:text-white hover:scale-105 transition-all">{t('nav.events')}</button>
              <button onClick={() => setView && setView('contact_us')} className="hover:text-white hover:scale-105 transition-all">{t('nav.contact')}</button>
              <button onClick={() => setView && setView('haberler')} className="hover:text-white hover:scale-105 transition-all">{t('nav.news')}</button>
            </div>

            {/* Language Switcher */}
            <div className="hidden sm:block flex-shrink-0">
              <LanguageSwitcher />
            </div>

            {/* FAR RIGHT: User Avatar or Portala Giriş Button */}
            {currentUser ? (
              <button 
                onClick={() => setView && setView(getDestination())}
                className="flex items-center gap-2 bg-white text-[#990000] hover:bg-red-50 px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all shadow-lg hover:scale-105 whitespace-nowrap flex-shrink-0"
              >
                <SafeAvatar src={currentUser.avatar || '/iesu-logo.svg'} name={currentUser.name || 'U'} size={20} className="w-5 h-5 rounded-full object-cover border border-[#990000]" />
                <span className="hidden sm:inline">{t('nav.backToDashboard')} ({currentUser.name?.split(' ')[0]})</span>
                <span className="sm:hidden">{t('nav.panel')}</span>
              </button>
            ) : (
              <button 
                onClick={() => setView && setView('login')}
                className="flex items-center gap-1.5 bg-white text-[#990000] hover:bg-red-50 px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all shadow-lg hover:shadow-xl whitespace-nowrap flex-shrink-0 hover:scale-105"
              >
                <LogIn size={15} strokeWidth={2.5} /> <span>{t('nav.signIn')}</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
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
            <form onSubmit={submitSearch} role="search" className="flex gap-2">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">{t('common.searchPlaceholder')}</span>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={15} />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t('common.searchPlaceholder')}
                  className="w-full rounded-xl border border-white/20 bg-white/10 py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                />
              </label>
              <button type="submit" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#990000]">
                {t('common.search')}
              </button>
            </form>
            <div className="flex justify-end pb-1 border-b border-white/10">
              <LanguageSwitcher variant="pill" />
            </div>
            <div className="flex flex-col space-y-2 text-sm font-bold text-white/90">
              <button 
                onClick={() => { if (setView) setView('about_us'); setIsMobileMenuOpen(false); }} 
                className="text-left py-2 px-3 rounded-lg hover:bg-white/10 transition"
              >
                {t('nav.aboutUs')}
              </button>
              <button 
                onClick={() => { if (setView) setView('services'); setIsMobileMenuOpen(false); }} 
                className="text-left py-2 px-3 rounded-lg hover:bg-white/10 transition"
              >
                {t('nav.services')}
              </button>
              <button 
                onClick={() => { if (setView) setView('events_list'); setIsMobileMenuOpen(false); }} 
                className="text-left py-2 px-3 rounded-lg hover:bg-white/10 transition"
              >
                {t('nav.events')}
              </button>
              <button 
                onClick={() => { if (setView) setView('contact_us'); setIsMobileMenuOpen(false); }} 
                className="text-left py-2 px-3 rounded-lg hover:bg-white/10 transition"
              >
                {t('nav.contact')}
              </button>
              <button 
                onClick={() => { if (setView) setView('haberler'); setIsMobileMenuOpen(false); }} 
                className="text-left py-2 px-3 rounded-lg hover:bg-white/10 transition"
              >
                {t('nav.news')}
              </button>
            </div>
          </div>
        )}

      </nav>
    </header>
  );
}
