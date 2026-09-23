import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Layers, Zap, AlertTriangle, CheckCircle2, 
  RefreshCw, Radio, Activity, ShieldCheck, Play
} from 'lucide-react';

// Shared Brain & Admin Store Imports
import eventBus from './eventBus';
import useAdminStore from './useAdminStore';

// 4 Isolated Hive Store Imports
import useStudentStore from '../hives/student/store/useStudentStore';
import useAlumniStore from '../hives/alumni/store/useAlumniStore';
import useCompanyStore from '../hives/company/store/useCompanyStore';
import useAcademicStore from '../hives/academic/store/useAcademicStore';

// Session Store (for determining active hive view)
import useAppStore from '../store/useAppStore';

/**
 * Metadata configuration for the 4 autonomous hives.
 */
const HIVE_CELLS_CONFIG = [
  {
    key: 'student',
    role: 'student',
    name: 'Student Hive',
    nameTr: 'Öğrenci Kovanı',
    color: '#990000',
    accent: 'red',
    lightBg: 'bg-red-50/70',
    borderAccent: 'border-red-200',
    hoverBorder: 'hover:border-red-400',
    textColor: 'text-[#990000]',
    badgeBg: 'bg-red-100',
    iconText: '🎓',
    storeHook: useStudentStore
  },
  {
    key: 'alumni',
    role: 'alumni',
    name: 'Alumni Hive',
    nameTr: 'Mezun Kovanı',
    color: '#059669',
    accent: 'emerald',
    lightBg: 'bg-emerald-50/70',
    borderAccent: 'border-emerald-200',
    hoverBorder: 'hover:border-emerald-400',
    textColor: 'text-[#059669]',
    badgeBg: 'bg-emerald-100',
    iconText: '🟢',
    storeHook: useAlumniStore
  },
  {
    key: 'company',
    role: 'company',
    name: 'Company Hive',
    nameTr: 'Kurumsal Kovan',
    color: '#1e3a5f',
    accent: 'blue',
    lightBg: 'bg-blue-50/70',
    borderAccent: 'border-blue-200',
    hoverBorder: 'hover:border-blue-400',
    textColor: 'text-[#1e3a5f]',
    badgeBg: 'bg-blue-100',
    iconText: '🏢',
    storeHook: useCompanyStore
  },
  {
    key: 'academic',
    role: 'academic',
    name: 'Academic Hive',
    nameTr: 'Akademik Kovan',
    color: '#7c3aed',
    accent: 'violet',
    lightBg: 'bg-violet-50/70',
    borderAccent: 'border-violet-200',
    hoverBorder: 'hover:border-violet-400',
    textColor: 'text-[#7c3aed]',
    badgeBg: 'bg-violet-100',
    iconText: '👨‍🏫',
    storeHook: useAcademicStore
  }
];

export default function HiveHealthMonitor() {
  const [epm, setEpm] = useState(0);
  const [lastPingTime, setLastPingTime] = useState(null);

  // Read error states from useAdminStore with safe fallback
  const hiveErrors = useAdminStore?.(state => state.hiveErrors) || {
    student: 0,
    alumni: 0,
    company: 0,
    academic: 0,
    admin: 0
  };

  // Read active session info from useAppStore
  const activeHive = useAppStore?.(state => state.activeHive || state.userRole || state.currentUser?.role) || 'student';

  // Reactive activeView subscriptions from each hive store
  const studentView = useStudentStore(s => s.activeView);
  const alumniView = useAlumniStore(s => s.activeView);
  const companyView = useCompanyStore(s => s.activeView);
  const academicView = useAcademicStore(s => s.activeView);

  // Check store initialization across all 4 user-role hive stores
  const storeStatus = useMemo(() => {
    const viewsMap = {
      student: studentView,
      alumni: alumniView,
      company: companyView,
      academic: academicView
    };

    return HIVE_CELLS_CONFIG.map(hive => {
      const isInitialized = Boolean(
        hive.storeHook && 
        typeof hive.storeHook.getState === 'function'
      );
      const activeView = viewsMap[hive.key] || 'feed';
      return {
        ...hive,
        isInitialized,
        activeView
      };
    });
  }, [studentView, alumniView, companyView, academicView]);

  const connectedCount = storeStatus.filter(s => s.isInitialized).length;
  const allConnected = connectedCount === HIVE_CELLS_CONFIG.length;

  // Poll and subscribe to EventBus throughput
  const refreshThroughput = useCallback(() => {
    if (typeof eventBus?.getThroughput === 'function') {
      try {
        const val = eventBus.getThroughput();
        setEpm(typeof val === 'number' && !isNaN(val) ? val : 0);
      } catch {
        setEpm(0);
      }
    }
  }, []);

  useEffect(() => {
    refreshThroughput();
    const interval = setInterval(refreshThroughput, 3000);

    // Event-driven update if eventBus supports wildcard subscription
    let unsubscribe = null;
    if (typeof eventBus?.on === 'function') {
      try {
        unsubscribe = eventBus.on('*', () => refreshThroughput());
      } catch {
        unsubscribe = null;
      }
    }

    return () => {
      clearInterval(interval);
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [refreshThroughput]);

  // Test event dispatch for interactive verification
  const handleTriggerTestEvent = () => {
    if (typeof eventBus?.emit === 'function') {
      eventBus.emit('feature:toggled', { 
        feature: 'health-monitor-ping', 
        timestamp: Date.now() 
      });
      setLastPingTime(new Date().toLocaleTimeString());
      refreshThroughput();
    }
  };

  return (
    <div 
      data-testid="hive-health-monitor" 
      className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs transition-all hover:shadow-md duration-300"
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
            <Layers size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-gray-900 tracking-tight">Beehive Mesh Monitor</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                M1 Core
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Merkezi EventBus & 4 Kovan Durum ve İzolasyon Takibi
            </p>
          </div>
        </div>

        {/* Global Indicators: Connected Badge & EPM Counter */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Connection Pill */}
          {allConnected ? (
            <div 
              data-testid="all-hives-connected"
              className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-300/80 px-3.5 py-1.5 rounded-full text-xs font-black shadow-xs tracking-tight"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              <span>✓ All hives connected</span>
            </div>
          ) : (
            <div 
              data-testid="hives-connecting"
              className="flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-300/80 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs tracking-tight"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-pulse relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span>Bağlanıyor ({connectedCount}/4 kovan)</span>
            </div>
          )}

          {/* EPM Throughput Counter */}
          <div 
            data-testid="epm-counter"
            className="flex items-center gap-2 bg-slate-900 text-white px-3.5 py-1.5 rounded-xl shadow-xs border border-slate-700"
            title="Events Per Minute (Son 60 saniye olay frekansı)"
          >
            <Zap size={14} className="text-amber-400 animate-pulse" />
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-black tracking-tight font-mono">{epm}</span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-bold">EPM</span>
            </div>
          </div>

          {/* Test Dispatch Button */}
          <button
            onClick={handleTriggerTestEvent}
            className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
            title="EventBus test olayı tetikle"
          >
            <Play size={12} className="text-gray-500" />
            <span className="hidden md:inline text-[11px]">Ping</span>
          </button>
        </div>
      </div>

      {/* Honeycomb Cells Grid (4 Role Hives) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {storeStatus.map(hive => {
          const isActive = activeHive === hive.role;
          const errors = hiveErrors[hive.key] || 0;

          return (
            <div
              key={hive.key}
              data-testid={`honeycomb-cell-${hive.key}`}
              className={`relative rounded-xl border ${hive.borderAccent} ${hive.lightBg} p-4 transition-all duration-300 hover:shadow-md ${hive.hoverBorder}`}
            >
              {/* Header: Hex Icon + Status Pill */}
              <div className="flex items-center justify-between mb-3">
                {/* Honeycomb Hexagon Motif */}
                <div className="w-10 h-10 flex items-center justify-center relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xs">
                    <polygon
                      points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25"
                      fill={hive.color}
                      fillOpacity="0.12"
                      stroke={hive.color}
                      strokeWidth="4"
                    />
                  </svg>
                  <span className="absolute text-base select-none">{hive.iconText}</span>
                </div>

                {/* Status Indicator (active vs idle) */}
                {isActive ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-gray-800 border border-gray-200 shadow-2xs">
                    <span 
                      className="w-2 h-2 rounded-full animate-pulse" 
                      style={{ backgroundColor: hive.color }}
                    ></span>
                    <span>Aktif</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/70 text-gray-500 border border-gray-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    <span>Boşta</span>
                  </span>
                )}
              </div>

              {/* Title & Role Info */}
              <div className="mb-3">
                <h4 className={`text-sm font-black ${hive.textColor} tracking-tight`}>
                  {hive.name}
                </h4>
                <p className="text-xs text-gray-500 font-medium">
                  {hive.nameTr}
                </p>
              </div>

              {/* Store State & Error Counter */}
              <div className="space-y-1.5 pt-2 border-t border-gray-200/60 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <span className="text-[11px] text-gray-500">Zustand Store:</span>
                  <span className="font-semibold flex items-center gap-1">
                    {hive.isInitialized ? (
                      <>
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        <span className="text-emerald-700">Bağlı</span>
                      </>
                    ) : (
                      <span className="text-amber-600">Hazırlanıyor</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span className="text-[11px] text-gray-500">Görünüm:</span>
                  <span className="font-mono text-[11px] px-1.5 py-0.5 bg-white/80 rounded border border-gray-200 font-medium">
                    {hive.activeView}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-gray-500">Hata Sayacı:</span>
                  {errors > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 border border-red-300 text-red-700 font-black text-[11px] animate-pulse">
                      <AlertTriangle size={11} />
                      {errors} hata
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/80 border border-gray-200 text-gray-600 font-medium text-[11px]">
                      <ShieldCheck size={11} className="text-emerald-600" />
                      0 hata
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {lastPingTime && (
        <div className="mt-3 text-right">
          <span className="text-[10px] text-gray-400 font-mono">
            Son Olay Tetiklendi: {lastPingTime}
          </span>
        </div>
      )}
    </div>
  );
}
