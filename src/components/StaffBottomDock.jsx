import React from 'react';
import { Home, CheckCircle2, Briefcase, MessageSquare } from 'lucide-react';
import SafeAvatar from './shared/SafeAvatar';

/**
 * StaffBottomDock — Yalnızca Kurumsal Personel Portalına (StaffPortal) özel,
 * yazısız, sade ve modern ikonik yüzen alt menü (Safir / İndigo imza teması).
 * Personeli asla Süper Admin menülerine veya dış portallara atmaz;
 * doğrudan Personel Portalı içindeki yerel sayfalara geçiş yapar.
 */
export default function StaffBottomDock({
  activeTab,
  activeDesk,
  onSelectDesk,
  pendingCount = 0,
  unreadMessagesCount = 0,
  primaryOpsDesk = 'companies_jobs',
  primaryOpsLabel = 'İşlemler',
  commDesk = 'messages',
  commLabel = 'İletişim',
  staffAvatar = null,
  staffName = 'Personel'
}) {
  const isStreamActive = activeTab === 'feed' && activeDesk === 'stream';
  const isApprovalsActive = activeTab === 'feed' && activeDesk === 'approvals';
  const isOpsActive = activeTab === 'feed' && ['companies_jobs', 'students_staj', 'alumni', 'reports_export'].includes(activeDesk);
  const isCommActive = activeTab === 'feed' && ['messages', 'content'].includes(activeDesk);
  const isProfileActive = activeTab === 'feed' && activeDesk === 'staff_profile';

  const selectDesk = (deskId) => {
    onSelectDesk(deskId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Personel Alt Menüsü"
      data-testid="staff-bottom-dock"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[92%] max-w-[390px]"
    >
      <div className="bg-white/95 dark:bg-[#131c31]/95 backdrop-blur-2xl border-2 border-indigo-200/80 dark:border-indigo-500/40 shadow-[0_18px_45px_rgba(49,46,129,0.22)] dark:shadow-[0_18px_45px_rgba(15,23,42,0.65)] px-3.5 py-2 sm:py-2.5 rounded-full flex items-center justify-between gap-2">
        {/* 1. Ana Sayfa / Personel Akışı */}
        <button
          type="button"
          onClick={() => selectDesk('stream')}
          aria-label="Ana Sayfa"
          title="Personel Ana Akışı"
          aria-current={isStreamActive ? 'page' : undefined}
          className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 active:scale-95 ${
            isStreamActive
              ? 'bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/35'
              : 'text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50/90 dark:hover:bg-slate-800/80'
          }`}
        >
          <Home size={22} strokeWidth={isStreamActive ? 2.4 : 2.1} />
        </button>

        {/* 2. Onay & İşlem Kuyruğu */}
        <button
          type="button"
          onClick={() => selectDesk('approvals')}
          aria-label="Onaylar"
          title="Personel Onay & İşlem Kuyruğu"
          aria-current={isApprovalsActive ? 'page' : undefined}
          className={`relative w-12 h-10 sm:w-13 sm:h-11 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-700 to-blue-700 text-white shadow-lg shadow-indigo-900/30 border border-indigo-300/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shrink-0 ${
            isApprovalsActive ? 'ring-2 ring-indigo-400 dark:ring-indigo-300 ring-offset-2 dark:ring-offset-[#131c31] scale-105' : ''
          }`}
        >
          <CheckCircle2 size={21} strokeWidth={2.4} />
          {pendingCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center leading-none border-2 border-white dark:border-[#131c31] shadow-sm"
            >
              {pendingCount > 99 ? '99+' : pendingCount}
            </span>
          )}
        </button>

        {/* 3. Yetkili Operasyon Masası (İlan & Firma / Staj / Mezun / Rapor) */}
        <button
          type="button"
          onClick={() => selectDesk(primaryOpsDesk)}
          aria-label={primaryOpsLabel}
          title={primaryOpsLabel}
          aria-current={isOpsActive ? 'page' : undefined}
          className={`relative w-12 h-10 sm:w-13 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-800 via-indigo-600 to-sky-600 text-white shadow-lg shadow-indigo-700/30 border border-sky-300/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shrink-0 ${
            isOpsActive ? 'ring-2 ring-sky-400 dark:ring-sky-300 ring-offset-2 dark:ring-offset-[#131c31] scale-105' : ''
          }`}
        >
          <Briefcase size={20} strokeWidth={2.4} />
        </button>

        {/* 4. Gelen Talepler / Mesajlar / Duyurular */}
        <button
          type="button"
          onClick={() => selectDesk(commDesk)}
          aria-label={commLabel}
          title={commLabel}
          aria-current={isCommActive ? 'page' : undefined}
          className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 active:scale-95 ${
            isCommActive
              ? 'bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/35'
              : 'text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50/90 dark:hover:bg-slate-800/80'
          }`}
        >
          <MessageSquare size={21} strokeWidth={isCommActive ? 2.4 : 2.1} />
          {unreadMessagesCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute top-0.5 right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center leading-none border-2 border-white dark:border-[#131c31] shadow-sm"
            >
              {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
            </span>
          )}
        </button>

        {/* 5. Personel Profili & Yetki Kartı */}
        <button
          type="button"
          onClick={() => selectDesk('staff_profile')}
          aria-label="Profilim"
          title="Personel Profili & Yetki Kartım"
          aria-current={isProfileActive ? 'page' : undefined}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-900 border-2 border-indigo-600 dark:border-indigo-400 shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 p-0.5 overflow-hidden cursor-pointer ${
            isProfileActive ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-[#131c31] scale-105' : ''
          }`}
        >
          <SafeAvatar src={staffAvatar} name={staffName} size="xs" alt="Personel Profilim" />
        </button>
      </div>
    </nav>
  );
}
