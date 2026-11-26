import React from 'react';
import { Home, Briefcase, Search } from 'lucide-react';
import Logo from './Logo';
import useAppStore from '../store/useAppStore';

/**
 * AdminOmniDock — KGM Süper Yönetici & Kurumsal Personel için 4'lü Alt Navigasyon Dock'u.
 * Orijinal 4'lü dock boyutlarında (max-w-[420px]), reaktif tema destekli ve z-50 uyumlu.
 */
export default function AdminOmniDock({ activeTab, setActiveTab, setView, setSelectedUserId, currentUser, theme, homeView }) {
  const currentBranch = useAppStore(state => state.activePortalBranch);
  const storeCurrentUser = useAppStore(state => state.currentUser);
  const effectiveUser = currentUser || storeCurrentUser;
  const isStaff = theme === 'indigo' || homeView === 'staff' || currentBranch === 'staff' || (effectiveUser?.role === 'staff' && theme !== 'emerald');
  const isEmerald = theme === 'emerald' || (!isStaff && theme !== 'amber' && currentBranch === 'alumni');
  const isAmber = !isEmerald && !isStaff;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
      <div className={`bg-white/95 dark:bg-[#131c31]/95 backdrop-blur-2xl border-2 ${
        isEmerald 
          ? 'border-emerald-100 dark:border-emerald-500/40 shadow-[0_15px_40px_rgba(6,78,59,0.18)]' 
          : isStaff
            ? 'border-indigo-300/70 dark:border-indigo-500/40 shadow-[0_15px_40px_rgba(67,56,202,0.22)]'
            : 'border-amber-400/70 dark:border-amber-500/40 shadow-[0_15px_40px_rgba(217,119,6,0.22)]'
      } p-2 sm:p-2.5 rounded-full flex items-center justify-between px-4 text-gray-800 dark:text-slate-100`}>
        
        {/* 1. AKIŞ / ANA SAYFA (EV BUTONU) */}
        <button 
          onClick={() => { 
            const s = useAppStore.getState();
            if (isEmerald) {
              if (s.setActivePortalBranch) s.setActivePortalBranch('alumni');
              if (setActiveTab) setActiveTab('feed');
              if (setView) setView(homeView || 'alumni');
            } else if (isStaff) {
              if (s.setActivePortalBranch) s.setActivePortalBranch('staff');
              if (s.setAdminActiveTab) s.setAdminActiveTab('feed');
              if (setActiveTab) setActiveTab('feed');
              if (setView) setView(homeView || 'staff');
            } else {
              if (s.setActivePortalBranch) s.setActivePortalBranch('admin');
              if (s.setAdminActiveTab) s.setAdminActiveTab('feed');
              if (setActiveTab) setActiveTab('feed'); 
              if (setView) setView(homeView || 'admin'); 
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
            activeTab === 'feed' 
              ? (isEmerald 
                  ? 'bg-emerald-700 text-white shadow-md' 
                  : isStaff
                    ? 'bg-gradient-to-tr from-indigo-600 via-indigo-700 to-slate-800 text-white font-black shadow-md shadow-indigo-500/30 border border-indigo-200/50'
                    : 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-white font-black shadow-md shadow-amber-500/30 border border-yellow-200/50') 
              : (isEmerald 
                  ? 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-800' 
                  : isStaff
                    ? 'text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-800'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-800')
          }`}
          title="Akış & Ana Sayfa"
        >
          <Home size={22} strokeWidth={2.2} className={activeTab === 'feed' ? 'text-white drop-shadow-xs' : ''} />
        </button>
        
        {/* 2. İŞ & STAJ / İLAN HAVUZU */}
        <button 
          onClick={() => { 
            const s = useAppStore.getState();
            if (isEmerald) {
              if (s.setActivePortalBranch) s.setActivePortalBranch('alumni');
              if (setView) setView('jobs');
            } else if (isStaff) {
              if (s.setActivePortalBranch) s.setActivePortalBranch('staff');
              if (setView) setView('jobs');
            } else {
              if (s.setActivePortalBranch) s.setActivePortalBranch('admin');
              if (setView) setView('jobs');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className={`w-11 h-10 sm:w-12 sm:h-11 rounded-2xl ${
            isEmerald 
              ? 'bg-gradient-to-tr from-emerald-800 via-teal-700 to-emerald-600 border-emerald-300/40' 
              : isStaff 
                ? 'bg-gradient-to-tr from-indigo-800 via-indigo-600 to-slate-800 border-indigo-300/40 shadow-indigo-600/20'
                : 'bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-700 border-amber-300/40 shadow-amber-600/20'
          } text-white shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all shrink-0 border cursor-pointer`} 
          title="İlan & Başvuru Havuzu"
        >
          <Briefcase size={20} strokeWidth={2.5} />
        </button>

        {/* 3. KEŞFET & SOSYAL AĞ PORTALI (SEARCH) */}
        <button 
          onClick={() => {
            const s = useAppStore.getState();
            if (isEmerald) {
              if (s.setActivePortalBranch) s.setActivePortalBranch('alumni');
              if (setView) setView('alumni');
              if (setActiveTab) setActiveTab('search');
            } else if (isStaff) {
              if (s.setActivePortalBranch) s.setActivePortalBranch('staff');
              if (s.setAdminActiveTab) s.setAdminActiveTab('search');
              if (setActiveTab) setActiveTab('search');
              if (setView) setView(homeView || 'staff');
            } else {
              if (s.setActivePortalBranch) s.setActivePortalBranch('admin');
              if (s.setAdminActiveTab) s.setAdminActiveTab('search');
              if (setActiveTab) setActiveTab('search');
              if (setView) setView(homeView || 'admin');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className={`w-12 h-10 sm:w-14 sm:h-11 rounded-2xl ${
            isEmerald 
              ? 'bg-gradient-to-tr from-emerald-800 via-teal-700 to-emerald-600 border-emerald-300/40 shadow-emerald-900/30' 
              : isStaff 
                ? 'bg-gradient-to-tr from-indigo-700 via-indigo-600 to-slate-800 border-indigo-200 shadow-lg shadow-indigo-500/30 text-white'
                : 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 border-yellow-200 shadow-lg shadow-amber-500/30 text-white'
          } text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border cursor-pointer`} 
          title="Keşfet & Sosyal Ağ Portalı"
        >
          <Search size={22} strokeWidth={2.8} />
        </button>

        {/* 4. PROFİL / LOGO */}
        <button 
          onClick={() => { 
            const s = useAppStore.getState();
            const effectiveCurrentUser = currentUser || s.currentUser;
            const targetId = effectiveCurrentUser?.id || effectiveCurrentUser?.uid || (isAmber ? 'admin_1513' : 'self');
            if (isEmerald) {
              if (s.setActivePortalBranch) s.setActivePortalBranch('alumni');
            } else if (isStaff) {
              if (s.setActivePortalBranch) s.setActivePortalBranch('staff');
            } else {
              if (s.setActivePortalBranch) s.setActivePortalBranch('admin');
            }
            if (setSelectedUserId) setSelectedUserId(targetId); 
            if (s.setSelectedUserId) s.setSelectedUserId(targetId);
            if (setView) setView('user_profile'); 
          }} 
          className={`w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 ${
            isEmerald 
              ? 'border-emerald-700' 
              : isStaff 
                ? 'border-indigo-600 shadow-indigo-500/20'
                : 'border-amber-500 shadow-amber-500/20'
          } shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer`} 
          title={isEmerald ? 'Mezun Profilim' : isStaff ? 'Personel Profilim' : 'KGM Yönetici Profili'}
        >
          <Logo size="sm" className="w-full h-full justify-center" color={isEmerald ? 'emerald' : isStaff ? 'indigo' : 'amber'} />
        </button>
      </div>
    </div>
  );
}
