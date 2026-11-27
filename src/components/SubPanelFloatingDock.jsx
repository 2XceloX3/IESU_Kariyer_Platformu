import React from 'react';
import { Home, Briefcase, Search, BookOpen, Plus, LayoutDashboard, Globe, Award, Users, FileText } from 'lucide-react';
import SafeAvatar from './shared/SafeAvatar';
import useAppStore from '../store/useAppStore';

/**
 * SubPanelFloatingDock - Alt Navigasyon Menüsü (Yüzen Dock)
 * Tüm kovanlarda (Öğrenci, Mezun, Akademik, Firma, Yönetici) ve alt panellerde
 * platformun kurumsal kimliğine ve rolüne özgü temayı ve navigasyonu eksiksiz sunar.
 */
export default function SubPanelFloatingDock({ 
  currentUser, 
  setView, 
  setSelectedUserId, 
  activeTab = '', 
  userRole = 'alumni' 
}) {
  const activeBranch = useAppStore(state => state.activePortalBranch);
  const storeCurrentUser = useAppStore(state => state.currentUser);
  const storeUserRole = useAppStore(state => state.userRole);
  const effectiveCurrentUser = currentUser || storeCurrentUser;
  
  const isActualAdmin = Boolean(
    storeUserRole === 'admin' || 
    effectiveCurrentUser?.role === 'admin'
  );
  const isActualStaff = !isActualAdmin && Boolean(
    storeUserRole === 'staff' ||
    effectiveCurrentUser?.role === 'staff'
  );

  const safeBranch = (
    (activeBranch === 'admin' && !isActualAdmin) ||
    (activeBranch === 'staff' && !isActualAdmin && !isActualStaff)
  ) ? null : activeBranch;
  const safePropRole = (
    (userRole === 'admin' && !isActualAdmin) ||
    (userRole === 'staff' && !isActualAdmin && !isActualStaff)
  ) ? null : userRole;

  // Kovan Dalı Egemenliği (Her kovan kendi temasını ve geri dönüş hedefini mutlak korur)
  const currentHive = (
    (safeBranch && ['student', 'alumni', 'company', 'staff', 'admin'].includes(safeBranch)) ? safeBranch :
    (safePropRole && ['student', 'alumni', 'company', 'staff', 'admin'].includes(safePropRole)) ? safePropRole :
    (effectiveCurrentUser?.role && ['student', 'alumni', 'company', 'staff', 'admin', 'employer'].includes(effectiveCurrentUser.role))
      ? (effectiveCurrentUser.role === 'employer' ? 'company' : effectiveCurrentUser.role)
      : 'alumni'
  );

  const isStudent = currentHive === 'student';
  const isAlumni = currentHive === 'alumni';
  const isStaff = currentHive === 'staff';
  const isCompany = currentHive === 'company' || currentHive === 'employer';
  const isAdmin = currentHive === 'admin';

  const userName = effectiveCurrentUser?.name || (isStudent ? 'Öğrenci' : isAlumni ? 'Mezun' : isStaff ? 'Kurumsal Personel' : isCompany ? 'Kurumsal Firma' : isAdmin ? 'Kariyer Geliştirme Koordinatörlüğü' : 'Kullanıcı');
  const userAvatar = effectiveCurrentUser?.avatar || effectiveCurrentUser?.logo || '/iesu-logo.svg';

  const userId = effectiveCurrentUser?.id || effectiveCurrentUser?.uid || 'self';

  const homeView = isStudent ? 'student' : isAlumni ? 'alumni' : isStaff ? 'staff' : isCompany ? 'company' : isAdmin ? 'admin' : 'alumni';

  // Tema Renkleri
  const borderColor = 
    isStudent ? 'border-red-100 dark:border-rose-500/40' :
    isAlumni ? 'border-emerald-100 dark:border-emerald-500/40' :
    isStaff ? 'border-indigo-200 dark:border-indigo-500/40' :
    isCompany ? 'border-blue-200 dark:border-blue-500/40' :
    'border-amber-200 dark:border-amber-500/40';

  const shadowColor = 
    isStudent ? 'shadow-[0_15px_40px_rgba(153,0,0,0.18)]' :
    isAlumni ? 'shadow-[0_15px_40px_rgba(5,150,105,0.18)]' :
    isStaff ? 'shadow-[0_15px_40px_rgba(67,56,202,0.18)]' :
    isCompany ? 'shadow-[0_15px_40px_rgba(30,58,95,0.18)]' :
    'shadow-[0_15px_40px_rgba(180,83,9,0.18)]';

  const primaryBg = 
    isStudent ? 'bg-[#990000]' :
    isAlumni ? 'bg-[#059669]' :
    isStaff ? 'bg-[#4338ca]' :
    isCompany ? 'bg-[#1e3a5f]' :
    'bg-[#b45309]';

  const primaryText = 
    isStudent ? 'text-[#990000] dark:text-rose-300' :
    isAlumni ? 'text-[#059669] dark:text-emerald-300' :
    isStaff ? 'text-[#4338ca] dark:text-indigo-300' :
    isCompany ? 'text-[#1e3a5f] dark:text-sky-300' :
    'text-[#b45309] dark:text-amber-300';

  const hoverBg = 
    isStudent ? 'hover:bg-red-50 dark:hover:bg-slate-800' :
    isAlumni ? 'hover:bg-emerald-50 dark:hover:bg-slate-800' :
    isStaff ? 'hover:bg-indigo-50 dark:hover:bg-slate-800' :
    isCompany ? 'hover:bg-blue-50 dark:hover:bg-slate-800' :
    'hover:bg-amber-50 dark:hover:bg-slate-800';

  const gradientAction1 = 
    isStudent ? 'bg-gradient-to-tr from-red-900 via-[#990000] to-rose-700 shadow-red-900/40 border-red-300/40' :
    isAlumni ? 'bg-gradient-to-tr from-emerald-800 via-[#059669] to-teal-600 shadow-emerald-900/40 border-emerald-300/40' :
    isStaff ? 'bg-gradient-to-tr from-indigo-900 via-[#4338ca] to-indigo-600 shadow-indigo-950/40 border-indigo-300/40' :
    isCompany ? 'bg-gradient-to-tr from-indigo-700 via-[#1e3a5f] to-slate-900 shadow-blue-950/40 border-blue-300/40' :
    'bg-gradient-to-tr from-amber-700 via-[#b45309] to-yellow-600 shadow-amber-900/40 border-amber-300/40';

  const gradientAction2 = 
    isStudent ? 'bg-gradient-to-tr from-red-900 via-[#990000] to-rose-700 shadow-red-900/40 border-red-300/40' :
    isAlumni ? 'bg-gradient-to-tr from-emerald-800 via-[#059669] to-teal-600 shadow-emerald-900/40 border-emerald-300/40' :
    isStaff ? 'bg-gradient-to-tr from-slate-800 via-[#4338ca] to-indigo-700 shadow-indigo-900/40 border-indigo-300/40' :
    isCompany ? 'bg-gradient-to-tr from-blue-700 via-[#1e3a5f] to-indigo-800 shadow-blue-950/40 border-blue-300/40' :
    'bg-gradient-to-tr from-amber-700 via-[#b45309] to-yellow-600 shadow-amber-900/40 border-amber-300/40';

  const profileBorder = 
    isStudent ? 'border-[#990000]' :
    isAlumni ? 'border-[#059669]' :
    isStaff ? 'border-[#4338ca]' :
    isCompany ? 'border-[#1e3a5f]' :
    'border-[#b45309]';

  // 2. Buton Hedefi ve Başlığı (Her Kovana Özgü Kimlik ve Eylem)
  const action1View = isStudent ? 'staj' : isCompany ? 'company_ats' : isStaff ? 'jobs' : isAlumni ? 'global_map' : 'admin_cms';
  const action1Title = isStudent ? 'Staj & Ulusal Staj Masası' : isCompany ? 'ATS Aday Takip Panosu' : isStaff ? 'İlan & Staj Havuzu' : isAlumni ? 'Küresel Mezun Haritası' : 'Yönetim Konsolu (CMS)';
  const Action1Icon = (isStudent || isCompany || isStaff) ? Briefcase : isAdmin ? LayoutDashboard : Globe;

  // 3. İkinci Buton Hedefi ve Başlığı
  const action2View = isCompany ? 'create_job' : isStaff ? 'staff' : 'explore';
  const action2Title = isCompany ? 'Yeni İlan Yayınla' : isStaff ? 'Personel Çalışma Masam' : 'Keşfet & Sosyal Ağ Portalı';
  const Action2Icon = isCompany ? Plus : isStaff ? LayoutDashboard : Search;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
      <div className={`bg-white/95 dark:bg-[#131c31]/95 backdrop-blur-2xl border-2 ${borderColor} p-2 sm:p-2.5 rounded-full ${shadowColor} flex items-center justify-between px-4 text-gray-800 dark:text-slate-100`}>
        
        {/* 1. AKIŞ / ANA SAYFA */}
        <button 
          onClick={() => {
            const store = useAppStore.getState();
            if (store.setActivePortalBranch) store.setActivePortalBranch(homeView);
            if (setView) setView(homeView);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
            activeTab === 'feed' || activeTab === 'home' || activeTab === homeView
              ? `${primaryBg} text-white shadow-md` 
              : `text-slate-600 dark:text-slate-300 hover:${primaryText} ${hoverBg}`
          }`} 
          title="Akış & Ana Sayfa"
        >
          {isAdmin ? <LayoutDashboard size={22} strokeWidth={2.2} /> : <Home size={22} strokeWidth={2.2} />}
        </button>
        
        {/* 2. ANA ROLLER EYLEM BUTONU (İş/Staj, ATS Panosu, Araştırma OS) */}
        <button 
          onClick={() => {
            const store = useAppStore.getState();
            if (store.setActivePortalBranch) store.setActivePortalBranch(homeView);
            if (setView) setView(action1View);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className={`w-12 h-10 sm:w-14 sm:h-11 rounded-2xl ${gradientAction1} text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border cursor-pointer ${
            activeTab === action1View || activeTab === 'jobs' ? 'ring-2 ring-white/80 ring-offset-2' : ''
          }`} 
          title={action1Title}
        >
          <Action1Icon size={22} strokeWidth={2.5} />
        </button>
        
        {/* 3. İKİNCİ EYLEM BUTONU (Keşfet veya Yeni İlan) */}
        <button 
          onClick={() => {
            const store = useAppStore.getState();
            if (store.setActivePortalBranch) store.setActivePortalBranch(homeView);
            if (setView) setView(action2View);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className={`w-12 h-10 sm:w-14 sm:h-11 rounded-2xl ${gradientAction2} text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border cursor-pointer ${
            activeTab === action2View || activeTab === 'explore' ? 'ring-2 ring-white/80 ring-offset-2' : ''
          }`} 
          title={action2Title}
        >
          <Action2Icon size={22} strokeWidth={isCompany ? 3 : 2.8} />
        </button>
        
        {/* 4. PROFİLİM */}
        <button 
          onClick={() => {
            const store = useAppStore.getState();
            if (store.setActivePortalBranch) store.setActivePortalBranch(homeView);
            if (setSelectedUserId) setSelectedUserId(userId);
            if (store.setSelectedUserId) store.setSelectedUserId(userId);
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
