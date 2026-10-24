import React, { useMemo } from 'react';
import { Zap } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { calculateCareerReadinessScore } from '../../services/studentRadarWorkflow';

export default function CareerReadinessWidget({
  currentUser,
  setView: _setView,
  onOpenCoffeeChat: _onOpenCoffeeChat
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
    } catch {
      return [];
    }
  }, [storeCoffeeChats]);

  const readiness = useMemo(() => {
    return calculateCareerReadinessScore(
      effectiveCurrentUser,
      internships,
      semCourses,
      clubs,
      coffeeChats
    );
  }, [effectiveCurrentUser, internships, semCourses, clubs, coffeeChats]);

  return (
    <div
      className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4"
      data-testid="career-readiness-widget"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center font-black">
            <Zap size={16} />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Kariyer Hazırlık Skoru
            </h4>
            <p className="text-[10px] text-slate-500 font-medium">Yapay Zekâ ve OBS Analizi</p>
          </div>
        </div>
        <span className="text-lg font-black text-[#990000]">
          %{readiness.score}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
        <div
          className="h-full bg-gradient-to-r from-red-800 via-[#990000] to-rose-600 rounded-full transition-all duration-700"
          style={{ width: `${readiness.score}%` }}
        />
      </div>

      {/* Level Badge */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-[11px] font-bold text-slate-500">Aday Seviyesi:</span>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${readiness.levelColor}`}>
          {readiness.level}
        </span>
      </div>
    </div>
  );
}
