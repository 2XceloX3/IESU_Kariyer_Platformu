import React from 'react';
import { Home, Briefcase, Search, User } from 'lucide-react';
import SafeAvatar from './shared/SafeAvatar';
import useAppStore from '../store/useAppStore';

/**
 * SubPanelFloatingDock - Alt Navigasyon Menüsü (Yüzen Dock)
 * Tüm alt panellerde (Kariyer Haritası, Kariyer Testi, Kuluçka Merkezi, Kulüpler Portalı vb.)
 * platformun kurumsal navigasyonunu eksiksiz sunar.
 */
export default function SubPanelFloatingDock({ 
  currentUser, 
  setView, 
  setSelectedUserId, 
  activeTab = '', 
  userRole = 'student' 
}) {
  const store = useAppStore?.getState ? useAppStore.getState() : {};
  const userName = currentUser?.name || 'Öğrenci';
  const userAvatar = currentUser?.avatar || '/iesu-logo.svg';
  const userId = currentUser?.id || 'STU-001';

  const isAlumni = userRole === 'alumni';
  const isAdmin = userRole === 'admin';

  const homeView = isAdmin ? 'admin' : isAlumni ? 'alumni' : 'student';

  const borderColor = isAlumni ? 'border-emerald-100' : isAdmin ? 'border-amber-200' : 'border-red-100';
  const shadowColor = isAlumni 
    ? 'shadow-[0_15px_40px_rgba(5,150,105,0.18)]' 
    : isAdmin 
      ? 'shadow-[0_15px_40px_rgba(180,83,9,0.18)]' 
      : 'shadow-[0_15px_40px_rgba(153,0,0,0.18)]';

  const primaryBg = isAlumni ? 'bg-[#059669]' : isAdmin ? 'bg-[#b45309]' : 'bg-[#990000]';
  const primaryText = isAlumni ? 'text-[#059669]' : isAdmin ? 'text-[#b45309]' : 'text-[#990000]';
  const hoverBg = isAlumni ? 'hover:bg-emerald-50' : isAdmin ? 'hover:bg-amber-50' : 'hover:bg-red-50';

  const gradientJob = isAlumni
    ? 'bg-gradient-to-tr from-emerald-800 via-[#059669] to-teal-600 shadow-emerald-900/40 border-emerald-300/40'
    : isAdmin
      ? 'bg-gradient-to-tr from-amber-700 via-[#b45309] to-yellow-600 shadow-amber-900/40 border-amber-300/40'
      : 'bg-gradient-to-tr from-red-900 via-[#990000] to-rose-700 shadow-red-900/40 border-red-300/40';

  const gradientSearch = isAlumni
    ? 'bg-gradient-to-tr from-emerald-800 via-[#059669] to-teal-600 shadow-emerald-900/40 border-emerald-300/40'
    : isAdmin
      ? 'bg-gradient-to-tr from-amber-700 via-[#b45309] to-yellow-600 shadow-amber-900/40 border-amber-300/40'
      : 'bg-gradient-to-tr from-red-900 via-[#990000] to-rose-700 shadow-red-900/40 border-red-300/40';

  const profileBorder = isAlumni ? 'border-[#059669]' : isAdmin ? 'border-[#b45309]' : 'border-[#990000]';

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
      <div className={`bg-white/95 backdrop-blur-2xl border-2 ${borderColor} p-2 sm:p-2.5 rounded-full ${shadowColor} flex items-center justify-between px-4 text-gray-800`}>
        
        {/* 1. AKIŞ / ANA SAYFA */}
        <button 
          onClick={() => {
            if (setView) setView(homeView);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
            activeTab === 'feed' || activeTab === 'home'
              ? `${primaryBg} text-white shadow-md` 
              : `text-slate-600 hover:${primaryText} ${hoverBg}`
          }`} 
          title="Akış & Ana Sayfa"
        >
          <Home size={22} strokeWidth={2.2} />
        </button>
        
        {/* 2. İŞ & STAJ OLANAKLARI */}
        <button 
          onClick={() => {
            if (setView) setView('jobs');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className={`w-12 h-10 sm:w-14 sm:h-11 rounded-2xl ${gradientJob} text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border cursor-pointer ${
            activeTab === 'jobs' ? 'ring-2 ring-red-400 ring-offset-2' : ''
          }`} 
          title="İş & Staj Olanakları"
        >
          <Briefcase size={22} strokeWidth={2.5} />
        </button>
        
        {/* 3. KEŞFET & SOSYAL AĞ PORTALI */}
        <button 
          onClick={() => {
            if (setView) setView('explore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className={`w-12 h-10 sm:w-14 sm:h-11 rounded-2xl ${gradientSearch} text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border cursor-pointer ${
            activeTab === 'explore' ? 'ring-2 ring-red-400 ring-offset-2' : ''
          }`} 
          title="Keşfet & Sosyal Ağ Portalı"
        >
          <Search size={22} strokeWidth={2.8} />
        </button>
        
        {/* 4. PROFİLİM */}
        <button 
          onClick={() => {
            if (setSelectedUserId) setSelectedUserId(userId);
            else if (store.setSelectedUserId) store.setSelectedUserId(userId);
            if (setView) setView('user_profile');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className={`w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 ${profileBorder} shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer`} 
          title="Profilim"
        >
          <SafeAvatar src={userAvatar} name={userName} size="xs" alt="Profile" />
        </button>
      </div>
    </div>
  );
}
