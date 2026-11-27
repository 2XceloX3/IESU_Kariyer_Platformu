import React from 'react';
import {
  Home, CheckCircle2, GraduationCap, Award, Building2, Megaphone, FileSpreadsheet
} from 'lucide-react';
import SafeAvatar from './shared/SafeAvatar';

/**
 * StaffBottomDock — Yalnızca Kurumsal Personel Portalına (StaffPortal & Personel Profili) özel,
 * yazısız, sade ve akışlar arası tam ekran geçiş sağlayan ikonik yüzen alt panel.
 * Personel yalnızca yetkili olduğu çalışma sayfalarının ikonlarını görür;
 * mesajlaşma sağ alttaki özel Personel Mesaj Alanı (FloatingChatWidget) üzerinden yürütülür.
 */
export default function StaffBottomDock({
  activeTab = 'feed',
  activeDesk = 'stream',
  onSelectDesk,
  onOpenProfile,
  isProfilePage = false,
  allowedModules = [],
  pendingCount = 0,
  pendingStajCount = 0,
  pendingBizCount = 0,
  staffAvatar = null,
  staffName = 'Personel'
}) {
  const allowedSet = allowedModules instanceof Set ? allowedModules : new Set(allowedModules || []);

  const navButtons = [
    {
      id: 'stream',
      label: 'Ana Sayfa',
      title: 'Personel Ana Akışı',
      icon: Home,
      badge: 0,
      hero: false
    },
    {
      id: 'approvals',
      label: 'Onaylar',
      title: 'Personel Onay & İşlem Kuyruğu',
      icon: CheckCircle2,
      badge: pendingCount,
      hero: true
    }
  ];

  if (allowedSet.has('students_staj')) {
    navButtons.push({
      id: 'students_staj',
      label: 'Öğrenci & Staj',
      title: 'Öğrenci & Staj Masası',
      icon: GraduationCap,
      badge: pendingStajCount,
      hero: false
    });
  }
  if (allowedSet.has('alumni')) {
    navButtons.push({
      id: 'alumni',
      label: 'Mezun & MBS',
      title: 'Mezun & MBS Masası',
      icon: Award,
      badge: 0,
      hero: false
    });
  }
  if (allowedSet.has('companies_protocols') || allowedSet.has('jobs_applications')) {
    navButtons.push({
      id: 'companies_jobs',
      label: 'İlan & Firma',
      title: 'Firma, İlan & Protokol Stüdyosu',
      icon: Building2,
      badge: pendingBizCount,
      hero: true
    });
  }
  if (allowedSet.has('content')) {
    navButtons.push({
      id: 'content',
      label: 'İçerik & Duyuru',
      title: 'İçerik & Duyuru Masası',
      icon: Megaphone,
      badge: 0,
      hero: false
    });
  }
  if (allowedSet.has('reports_export')) {
    navButtons.push({
      id: 'reports_export',
      label: 'Rapor & Excel',
      title: 'Rapor, Excel & PDF Merkezi',
      icon: FileSpreadsheet,
      badge: 0,
      hero: false
    });
  }

  const isProfileActive = Boolean(isProfilePage);

  const selectDesk = (deskId) => {
    onSelectDesk?.(deskId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileClick = () => {
    if (onOpenProfile) onOpenProfile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Personel Alt Menüsü"
      data-testid="staff-bottom-dock"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up max-w-[94vw]"
    >
      <div className="bg-white/95 dark:bg-[#131c31]/95 backdrop-blur-2xl border-2 border-indigo-200/80 dark:border-indigo-500/40 shadow-[0_18px_45px_rgba(49,46,129,0.22)] dark:shadow-[0_18px_45px_rgba(15,23,42,0.65)] px-3 sm:px-4 py-2 sm:py-2.5 rounded-full flex items-center justify-center gap-1.5 sm:gap-2">
        {navButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = !isProfilePage && activeTab === 'feed' && activeDesk === btn.id;
          return (
            <button
              key={btn.id}
              type="button"
              onClick={() => selectDesk(btn.id)}
              aria-label={btn.label}
              title={btn.title}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 active:scale-95 ${
                btn.hero
                  ? `w-11 h-10 sm:w-12 sm:h-11 rounded-2xl bg-gradient-to-tr ${
                      btn.id === 'approvals'
                        ? 'from-slate-900 via-indigo-700 to-blue-700 shadow-indigo-900/30 border-indigo-300/40'
                        : 'from-indigo-800 via-indigo-600 to-sky-600 shadow-indigo-700/30 border-sky-300/40'
                    } text-white shadow-lg border hover:scale-105 ${
                      isActive ? 'ring-2 ring-indigo-400 dark:ring-indigo-300 ring-offset-2 dark:ring-offset-[#131c31] scale-105' : ''
                    }`
                  : `w-10 h-10 sm:w-11 sm:h-11 rounded-full ${
                      isActive
                        ? 'bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/35'
                        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50/90 dark:hover:bg-slate-800/80'
                    }`
              }`}
            >
              <Icon size={btn.hero ? 20 : 20} strokeWidth={isActive || btn.hero ? 2.4 : 2.1} />
              {btn.badge > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center leading-none border-2 border-white dark:border-[#131c31] shadow-sm"
                >
                  {btn.badge > 99 ? '99+' : btn.badge}
                </span>
              )}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hidden sm:block"
              >
                {btn.label}
              </span>
            </button>
          );
        })}

        {/* Personel Profili (Özgün Tam Sayfa Profil) */}
        <button
          type="button"
          onClick={handleProfileClick}
          aria-label="Profilim"
          title="Profilimi Görüntüle"
          aria-current={isProfileActive ? 'page' : undefined}
          className={`group relative w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-900 border-2 border-indigo-600 dark:border-indigo-400 shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 p-0.5 overflow-visible cursor-pointer ${
            isProfileActive ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-[#131c31] scale-105' : ''
          }`}
        >
          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
            <SafeAvatar src={staffAvatar} name={staffName} size="xs" alt="Personel Profilim" />
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hidden sm:block"
          >
            Profilim
          </span>
        </button>
      </div>
    </nav>
  );
}
