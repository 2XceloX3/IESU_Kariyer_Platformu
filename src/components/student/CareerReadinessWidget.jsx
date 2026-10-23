import React, { useMemo } from 'react';
import {
  Sparkles, Target, Award, CheckCircle2, AlertCircle, ArrowRight,
  TrendingUp, BookOpen, Coffee, FileText, ChevronRight, Zap
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { calculateCareerReadinessScore } from '../../services/studentRadarWorkflow';

export default function CareerReadinessWidget({
  currentUser,
  setView,
  onOpenCoffeeChat
}) {
  const storeCurrentUser = useAppStore((state) => state.currentUser);
  const effectiveCurrentUser = currentUser || storeCurrentUser;
  const internships = useAppStore((state) => state.internships) || [];
  const semCourses = useAppStore((state) => state.semCourses) || [];
  const clubs = useAppStore((state) => state.clubs) || [];

  // Coffee chats stored in store or locally
  const storeCoffeeChats = useAppStore((state) => state.coffeeChats);
  const coffeeChats = useMemo(() => {
    if (Array.isArray(storeCoffeeChats) && storeCoffeeChats.length > 0) {
      return storeCoffeeChats;
    }
    try {
      const saved = localStorage.getItem('iesu_alumni_coffee_chats_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  }, [storeCoffeeChats]);

  const readiness = useMemo(() => {
    return calculateCareerReadinessScore({
      student: effectiveCurrentUser || {},
      internships,
      semCertificates: (effectiveCurrentUser?.certificates || []).concat(
        semCourses.slice(0, 1)
      ),
      clubMemberships: clubs.slice(0, 1),
      coffeeChats
    });
  }, [effectiveCurrentUser, internships, semCourses, clubs, coffeeChats]);

  const handleAction = (item) => {
    if (item.targetAction === 'open_coffee_chat') {
      if (onOpenCoffeeChat) onOpenCoffeeChat();
      else if (setView) setView('radar');
    } else if (item.targetView && setView) {
      setView(item.targetView);
    }
  };

  return (
    <div
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 relative overflow-hidden"
      data-testid="career-readiness-widget"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center font-black">
            <Zap size={16} />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Kariyer Hazırlık Skoru
            </h4>
            <p className="text-[10px] text-slate-400 font-bold">
              Yapay Zekâ ve OBS Analizi
            </p>
          </div>
        </div>

        <span className="text-xl font-black text-[#990000]">
          %{readiness.score}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 mb-3">
        <div
          className="h-full bg-gradient-to-r from-red-800 via-[#990000] to-rose-600 rounded-full transition-all duration-700"
          style={{ width: `${readiness.score}%` }}
        />
      </div>

      {/* Level Badge */}
      <div className="flex items-center justify-between text-xs mb-5">
        <span className="text-[11px] font-bold text-slate-500">Aday Seviyesi:</span>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${readiness.levelColor}`}>
          {readiness.level}
        </span>
      </div>

      {/* Smart Advice Section: "Hedefine Ulaşmak İçin 2 Eksik" */}
      {readiness.missingItems && readiness.missingItems.length > 0 ? (
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-800 flex items-center gap-1 uppercase tracking-wider">
              <Sparkles size={12} className="text-amber-500" /> Hedefine Ulaşmak İçin {readiness.missingItems.length} Eksik:
            </span>
          </div>

          {readiness.missingItems.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-50 hover:bg-red-50/40 rounded-2xl border border-slate-200/80 transition-all space-y-2 group"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-black text-slate-900 leading-snug">
                  {item.title}
                </p>
                <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md shrink-0">
                  {item.impactText}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                {item.description}
              </p>

              <button
                type="button"
                onClick={() => handleAction(item)}
                className="w-full py-1.5 px-3 bg-white hover:bg-[#990000] text-slate-800 hover:text-white border border-slate-200 hover:border-[#990000] rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>{item.ctaText}</span>
                <ChevronRight size={13} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
          <CheckCircle2 size={18} className="text-emerald-600 mx-auto mb-1" />
          <p className="text-xs font-black text-emerald-900">Mükemmel Profil!</p>
          <p className="text-[11px] text-emerald-700 font-medium">
            Tüm zorunlu ve isteğe bağlı yetkinlik kriterlerini tamamladınız.
          </p>
        </div>
      )}
    </div>
  );
}
