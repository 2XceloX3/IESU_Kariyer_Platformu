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
  userRole = 'student' 
}) {
  const activeBranch = useAppStore(state => state.activePortalBranch);
  const storeCurrentUser = useAppStore(state => state.currentUser);
  const storeUserRole = useAppStore(state => state.userRole);
  const effectiveCurrentUser = currentUser || storeCurrentUser;
  
  // Kovan Dalı Egemenliği (Her kovan kendi temasını ve geri dönüş hedefini mutlak korur):
  // 1. activeBranch varsa (kullanıcı şu anda hangi kovan peteğindeyse o kovanın dock'u ve geri dönüşü geçerlidir)
  // 2. userRole prop (eğer özel olarak iletilmişse)
  // 3. effectiveCurrentUser.role
  const currentHive = (
    (activeBranch && ['student', 'alumni', 'academic', 'company', 'admin'].includes(activeBranch)) ? activeBranch :
    (userRole && ['student', 'alumni', 'academic', 'company', 'admin'].includes(userRole)) ? userRole :
    (effectiveCurrentUser?.role && ['student', 'alumni', 'academic', 'company', 'admin', 'employer', 'academic_staff'].includes(effectiveCurrentUser.role)) ? (effectiveCurrentUser.role === 'employer' ? 'company' : effectiveCurrentUser.role === 'academic_staff' ? 'academic' : effectiveCurrentUser.role) :
    'student'
  );

  const isAlumni = currentHive === 'alumni';
  const isAcademic = currentHive === 'academic' || currentHive === 'academic_staff';
  const isCompany = currentHive === 'company' || currentHive === 'employer';
  const isAdmin = currentHive === 'admin';
  const isStudent = !isAlumni && !isAcademic && !isCompany && !isAdmin;

  // Alt yüzen dock tüm kovanlarda ve alt panellerde kurumsal navigasyonu sunar

  const userName = effectiveCurrentUser?.name || (isAlumni ? 'Mezun' : isAcademic ? 'Akademik' : isCompany ? 'Kurumsal Firma' : isAdmin ? 'KGM Yönetici' : 'Öğrenci');
  const userAvatar = effectiveCurrentUser?.avatar || effectiveCurrentUser?.logo || '/iesu-logo.svg';

  const userId = effectiveCurrentUser?.id || effectiveCurrentUser?.uid || effectiveCurrentUser?.studentId || effectiveCurrentUser?.studentNo || 'self';

  const homeView = isAlumni ? 'alumni' : isAcademic ? 'academic' : isCompany ? 'company' : isAdmin ? 'admin' : 'student';

  // Tema Renkleri
  const borderColor = 
    isAlumni ? 'border-emerald-100' :
    isAcademic ? 'border-purple-200' :
    isCompany ? 'border-blue-200' :
    isAdmin ? 'border-amber-200' :
    'border-red-100';

  const shadowColor = 
    isAlumni ? 'shadow-[0_15px_40px_rgba(5,150,105,0.18)]' :
    isAcademic ? 'shadow-[0_15px_40px_rgba(124,58,237,0.18)]' :
    isCompany ? 'shadow-[0_15px_40px_rgba(30,58,95,0.18)]' :
    isAdmin ? 'shadow-[0_15px_40px_rgba(180,83,9,0.18)]' :
    'shadow-[0_15px_40px_rgba(153,0,0,0.18)]';

  const primaryBg = 
    isAlumni ? 'bg-[#059669]' :
    isAcademic ? 'bg-[#7c3aed]' :
    isCompany ? 'bg-[#1e3a5f]' :
    isAdmin ? 'bg-[#b45309]' :
    'bg-[#990000]';

  const primaryText = 
    isAlumni ? 'text-[#059669]' :
    isAcademic ? 'text-[#7c3aed]' :
    isCompany ? 'text-[#1e3a5f]' :
    isAdmin ? 'text-[#b45309]' :
    'text-[#990000]';

  const hoverBg = 
    isAlumni ? 'hover:bg-emerald-50' :
    isAcademic ? 'hover:bg-purple-50' :
    isCompany ? 'hover:bg-blue-50' :
    isAdmin ? 'hover:bg-amber-50' :
    'hover:bg-red-50';

  const gradientAction1 = 
    isAlumni ? 'bg-gradient-to-tr from-emerald-800 via-[#059669] to-teal-600 shadow-emerald-900/40 border-emerald-300/40' :
    isAcademic ? 'bg-gradient-to-tr from-[#4C1D95] via-[#7c3aed] to-indigo-600 shadow-purple-950/40 border-purple-300/40' :
    isCompany ? 'bg-gradient-to-tr from-indigo-700 via-[#1e3a5f] to-slate-900 shadow-blue-950/40 border-blue-300/40' :
    isAdmin ? 'bg-gradient-to-tr from-amber-700 via-[#b45309] to-yellow-600 shadow-amber-900/40 border-amber-300/40' :
    'bg-gradient-to-tr from-red-900 via-[#990000] to-rose-700 shadow-red-900/40 border-red-300/40';

  const gradientAction2 = 
    isAlumni ? 'bg-gradient-to-tr from-emerald-800 via-[#059669] to-teal-600 shadow-emerald-900/40 border-emerald-300/40' :
    isAcademic ? 'bg-gradient-to-tr from-purple-800 via-[#7c3aed] to-indigo-700 shadow-purple-900/40 border-purple-300/40' :
    isCompany ? 'bg-gradient-to-tr from-blue-700 via-[#1e3a5f] to-indigo-800 shadow-blue-950/40 border-blue-300/40' :
    isAdmin ? 'bg-gradient-to-tr from-amber-700 via-[#b45309] to-yellow-600 shadow-amber-900/40 border-amber-300/40' :
    'bg-gradient-to-tr from-red-900 via-[#990000] to-rose-700 shadow-red-900/40 border-red-300/40';

  const profileBorder = 
    isAlumni ? 'border-[#059669]' :
    isAcademic ? 'border-[#7c3aed]' :
    isCompany ? 'border-[#1e3a5f]' :
    isAdmin ? 'border-[#b45309]' :
    'border-[#990000]';

  // 2. Buton Hedefi ve Başlığı (Her Kovana Özgü Kimlik ve Eylem)
  const action1View = isCompany ? 'company_ats' : isAcademic ? 'research_hub' : isAlumni ? 'global_map' : 'jobs';
  const action1Title = isCompany ? 'ATS Aday Takip Panosu' : isAcademic ? 'Araştırma OS Hub' : isAlumni ? 'Küresel Mezun Haritası' : 'İş & Staj Olanakları';
  const Action1Icon = isCompany ? Briefcase : isAcademic ? BookOpen : isAlumni ? Globe : Briefcase;

  // 3. İkinci Buton Hedefi ve Başlığı
  const action2View = isCompany ? 'create_job' : 'explore';
  const action2Title = isCompany ? 'Yeni İlan Yayınla' : 'Keşfet & Sosyal Ağ Portalı';
  const Action2Icon = isCompany ? Plus : Search;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
      <div className={`bg-white/95 backdrop-blur-2xl border-2 ${borderColor} p-2 sm:p-2.5 rounded-full ${shadowColor} flex items-center justify-between px-4 text-gray-800`}>
        
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
              : `text-slate-600 hover:${primaryText} ${hoverBg}`
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
