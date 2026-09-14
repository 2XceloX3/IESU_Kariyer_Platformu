import React from 'react';
import { Home, Briefcase, Crown, Search } from 'lucide-react';
import Logo from './Logo';
import useAppStore from '../store/useAppStore';

/**
 * AdminOmniDock — KGM Süper Yönetici için Temiz 4'lü Alt Navigasyon Dock'u.
 * Orijinal 4'lü dock boyutlarında (max-w-[420px]), beyaz temalı ve hızlı erişimli.
 */
export default function AdminOmniDock({ activeTab, setActiveTab, setView, setSelectedUserId, currentUser, theme, homeView }) {
  const store = useAppStore.getState();
  const currentBranch = store.activePortalBranch;
  
  const isEmerald = theme === 'emerald' || (theme !== 'amber' && theme !== 'red' && currentBranch === 'alumni');
  const isRed = theme === 'red' || (theme !== 'amber' && theme !== 'emerald' && currentBranch === 'student');
  const isAmber = !isEmerald && !isRed;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[999] animate-fade-in-up w-[95%] max-w-[420px]">
      <div className={`bg-white/95 backdrop-blur-2xl border-2 ${
        isEmerald 
          ? 'border-emerald-100 shadow-[0_15px_40px_rgba(6,78,59,0.18)]' 
          : isAmber
            ? 'border-amber-400/70 shadow-[0_15px_40px_rgba(217,119,6,0.22)]'
            : 'border-red-100 shadow-[0_15px_40px_rgba(153,0,0,0.18)]'
      } p-2 sm:p-2.5 rounded-full flex items-center justify-between px-4 text-gray-800`}>
        
        {/* 1. AKIŞ / ANA SAYFA (EV BUTONU) */}
        <button 
          onClick={() => { 
            const s = useAppStore.getState();
            if (isEmerald) {
              if (s.setActivePortalBranch) s.setActivePortalBranch('alumni');
              if (setActiveTab) setActiveTab('feed');
              // homeView prop'u varsa ona git; yoksa alumni ana akışına git
              if (setView) setView(homeView || 'alumni');
            } else if (isRed) {
              if (s.setActivePortalBranch) s.setActivePortalBranch('student');
              if (setActiveTab) setActiveTab('feed');
              if (setView) setView(homeView || 'student');
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
                  : isAmber
                    ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-white font-black shadow-md shadow-amber-500/30 border border-yellow-200/50'
                    : 'bg-[#990000] text-white shadow-md') 
              : (isEmerald 
                  ? 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50' 
                  : isAmber
                    ? 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                    : 'text-slate-600 hover:text-[#990000] hover:bg-red-50')
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
            } else if (isRed) {
              if (s.setActivePortalBranch) s.setActivePortalBranch('student');
              if (setView) setView('jobs');
            } else {
              if (s.setActivePortalBranch) s.setActivePortalBranch('admin');
              if (setView) setView('jobs');
              if (setActiveTab) setActiveTab('cms_jobs');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className={`w-11 h-10 sm:w-12 sm:h-11 rounded-2xl ${
            isEmerald 
              ? 'bg-gradient-to-tr from-emerald-800 via-teal-700 to-emerald-600 border-emerald-300/40' 
              : isRed 
                ? 'bg-gradient-to-tr from-[#990000] via-red-800 to-rose-700 border-red-300/40'
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
            } else if (isRed) {
              if (s.setActivePortalBranch) s.setActivePortalBranch('student');
              if (setView) setView('student');
              if (setActiveTab) setActiveTab('search');
            } else {
              if (s.setActivePortalBranch) s.setActivePortalBranch('admin');
              if (s.setAdminActiveTab) s.setAdminActiveTab('search');
              if (setActiveTab) setActiveTab('search');
              if (setView) setView('admin');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className={`w-12 h-10 sm:w-14 sm:h-11 rounded-2xl ${
            isEmerald 
              ? 'bg-gradient-to-tr from-emerald-800 via-teal-700 to-emerald-600 border-emerald-300/40 shadow-emerald-900/30' 
              : isRed 
                ? 'bg-gradient-to-tr from-[#990000] via-red-700 to-rose-800 border-red-300/40 shadow-red-900/30'
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
            if (isEmerald) {
              if (s.setActivePortalBranch) s.setActivePortalBranch('alumni');
              const targetId = currentUser?.id || 'ALU-001';
              if (setSelectedUserId) setSelectedUserId(targetId); 
              if (setView) setView('user_profile'); 
            } else if (isRed) {
              if (s.setActivePortalBranch) s.setActivePortalBranch('student');
              const targetId = currentUser?.id || 'STU-001';
              if (setSelectedUserId) setSelectedUserId(targetId); 
              if (setView) setView('user_profile'); 
            } else {
              if (s.setActivePortalBranch) s.setActivePortalBranch('admin');
              const targetId = currentUser?.id || 'admin_1513';
              if (setSelectedUserId) setSelectedUserId(targetId); 
              if (setView) setView('user_profile'); 
            }
          }} 
          className={`w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 ${
            isEmerald 
              ? 'border-emerald-700' 
              : isRed 
                ? 'border-[#990000]'
                : 'border-amber-500 shadow-amber-500/20'
          } shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer`} 
          title={isEmerald ? 'Mezun Profilim' : isRed ? 'Öğrenci Profilim' : 'KGM Yönetici Profili'}
        >
          <Logo size="sm" className="w-full h-full justify-center" color={isEmerald ? 'emerald' : isRed ? 'red' : 'amber'} />
        </button>
      </div>
    </div>
  );
}
