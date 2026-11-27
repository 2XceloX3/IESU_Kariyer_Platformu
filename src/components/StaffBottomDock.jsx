import React from 'react';
import { Home, CheckCircle2, Briefcase, MessageSquare, UserCheck } from 'lucide-react';

/**
 * StaffBottomDock — Yalnızca Kurumsal Personel Portalına (StaffPortal) özel yüzen alt menü.
 * Personeli asla Süper Admin menülerine veya dış portallara atmaz;
 * doğrudan Personel Portalı içindeki görev, onay, operasyon, iletişim ve personel profil sayfalarını açar.
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
  commLabel = 'İletişim'
}) {
  const isStreamActive = activeTab === 'feed' && activeDesk === 'stream';
  const isApprovalsActive = activeTab === 'feed' && activeDesk === 'approvals';
  const isOpsActive = activeTab === 'feed' && ['companies_jobs', 'students_staj', 'alumni', 'reports_export'].includes(activeDesk);
  const isCommActive = activeTab === 'feed' && ['messages', 'content'].includes(activeDesk);
  const isProfileActive = activeTab === 'feed' && activeDesk === 'staff_profile';

  const items = [
    {
      id: 'stream',
      label: 'Ana Sayfa',
      title: 'Personel Ana Akışı',
      icon: Home,
      isActive: isStreamActive,
      badge: 0,
      onClick: () => onSelectDesk('stream')
    },
    {
      id: 'approvals',
      label: 'Onaylar',
      title: 'Personel Onay & İşlem Kuyruğu',
      icon: CheckCircle2,
      isActive: isApprovalsActive,
      badge: pendingCount,
      onClick: () => onSelectDesk('approvals')
    },
    {
      id: 'ops',
      label: primaryOpsLabel,
      title: 'Yetkili Operasyon Masası',
      icon: Briefcase,
      isActive: isOpsActive,
      badge: 0,
      onClick: () => onSelectDesk(primaryOpsDesk)
    },
    {
      id: 'comm',
      label: commLabel,
      title: 'Kurumsal Duyuru & Mesajlar',
      icon: MessageSquare,
      isActive: isCommActive,
      badge: unreadMessagesCount,
      onClick: () => onSelectDesk(commDesk)
    },
    {
      id: 'staff_profile',
      label: 'Profilim',
      title: 'Personel Profili & Yetki Kartım',
      icon: UserCheck,
      isActive: isProfileActive,
      badge: 0,
      onClick: () => onSelectDesk('staff_profile')
    }
  ];

  return (
    <nav
      aria-label="Personel Alt Menüsü"
      data-testid="staff-bottom-dock"
      className="fixed bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[96%] max-w-[520px]"
    >
      <div className="bg-white/95 dark:bg-[#131c31]/95 backdrop-blur-2xl border-2 border-indigo-200/90 dark:border-indigo-500/40 shadow-[0_18px_45px_rgba(49,46,129,0.22)] px-2.5 py-2 rounded-full flex items-center justify-between gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                item.onClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title={item.title}
              aria-current={item.isActive ? 'page' : undefined}
              className={`relative flex-1 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 py-2 px-2 sm:px-3 rounded-full transition-all duration-200 cursor-pointer select-none ${
                item.isActive
                  ? 'bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 text-white shadow-md shadow-indigo-600/30 font-black'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50/80 dark:hover:bg-slate-800/80 font-bold'
              }`}
            >
              <div className="relative">
                <Icon size={18} strokeWidth={item.isActive ? 2.5 : 2.1} />
                {item.badge > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-black flex items-center justify-center leading-none border ${
                      item.isActive
                        ? 'bg-amber-400 text-slate-950 border-white/60'
                        : 'bg-rose-600 text-white border-white dark:border-slate-900'
                    }`}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] leading-none whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
