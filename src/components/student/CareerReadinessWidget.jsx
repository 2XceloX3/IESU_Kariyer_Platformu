import React, { useMemo } from 'react';
import { Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { calculateCareerReadinessScore } from '../../services/studentRadarWorkflow';

export default function CareerReadinessWidget({
  currentUser,
  setView,
  onOpenCoffeeChat
}) {
  const storeCurrentUser = useAppStore((state) => state.currentUser);
  const effectiveCurrentUser = currentUser || storeCurrentUser || {};
  const internships = useAppStore((state) => state.internships) || [];
  const applications = useAppStore((state) => state.applications) || [];
  const storeCoffeeChats = useAppStore((state) => state.coffeeChats);

  const coffeeChats = useMemo(() => {
    if (Array.isArray(storeCoffeeChats) && storeCoffeeChats.length > 0) {
      return storeCoffeeChats;
    }
    try {
      const saved = localStorage.getItem('iesu_alumni_coffee_chats_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, [storeCoffeeChats]);

  const myInternships = useMemo(() => {
    const uid = effectiveCurrentUser?.id || effectiveCurrentUser?.uid;
    const email = (effectiveCurrentUser?.email || '').toLowerCase();
    return internships.filter((i) =>
      (uid && (i.studentId === uid || i.uid === uid)) ||
      (email && (i.studentEmail || '').toLowerCase() === email)
    );
  }, [internships, effectiveCurrentUser]);

  const myApplications = useMemo(() => {
    const uid = effectiveCurrentUser?.id || effectiveCurrentUser?.uid;
    const email = (effectiveCurrentUser?.email || '').toLowerCase();
    return applications.filter((a) =>
      (uid && (a.applicantId === uid || a.studentId === uid)) ||
      (email && (a.applicantEmail || '').toLowerCase() === email)
    );
  }, [applications, effectiveCurrentUser]);

  const myCoffeeChats = useMemo(() => {
    const uid = effectiveCurrentUser?.id || effectiveCurrentUser?.uid;
    return coffeeChats.filter((c) => !uid || !c.studentId || c.studentId === uid);
  }, [coffeeChats, effectiveCurrentUser]);

  const readiness = useMemo(() => {
    return calculateCareerReadinessScore({
      student: effectiveCurrentUser,
      internships: myInternships,
      applications: myApplications,
      coffeeChats: myCoffeeChats
    });
  }, [effectiveCurrentUser, myInternships, myApplications, myCoffeeChats]);

  const handleAction = (item) => {
    if (item.targetAction === 'open_coffee_chat' && onOpenCoffeeChat) {
      onOpenCoffeeChat(null);
      return;
    }
    if (item.targetView && setView) {
      setView(item.targetView);
    }
  };

  return (
    <div
      className="bg-white dark:bg-[#131c31] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4"
      data-testid="career-readiness-widget"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-rose-950/60 text-[#990000] dark:text-rose-400 flex items-center justify-center font-black">
            <Zap size={17} />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Kariyer Hazırlık Skoru
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Staj, CV ve Başvuru Analizi
            </p>
          </div>
        </div>
        <span className="text-xl font-black text-[#990000] dark:text-rose-400">
          %{readiness.score}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
        <div
          className="h-full bg-gradient-to-r from-red-800 via-[#990000] to-rose-500 rounded-full transition-all duration-700"
          style={{ width: `${readiness.score}%` }}
        />
      </div>

      {/* Level Badge */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0">Seviye:</span>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border truncate ${readiness.levelColor}`}>
          {readiness.level}
        </span>
      </div>

      {/* Etkileşimli Sıradaki Adımlar */}
      {readiness.missingItems && readiness.missingItems.length > 0 ? (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {readiness.missingItems.slice(0, 2).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleAction(item)}
              className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-red-50/70 dark:hover:bg-rose-950/30 border border-slate-200/70 dark:border-slate-700 text-left transition flex items-center justify-between gap-2 group cursor-pointer"
            >
              <div className="min-w-0">
                <p className="text-[11px] font-black text-slate-800 dark:text-slate-100 group-hover:text-[#990000] dark:group-hover:text-rose-300 truncate">
                  {item.ctaText}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {item.impactText}
                </p>
              </div>
              <ArrowRight size={13} className="text-slate-400 group-hover:text-[#990000] shrink-0" />
            </button>
          ))}
        </div>
      ) : (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
          <CheckCircle2 size={14} /> Tüm kariyer hazırlık adımları tamamlandı!
        </div>
      )}
    </div>
  );
}
