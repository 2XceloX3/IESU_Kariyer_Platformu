# Milestone 1 Architectural Blueprint: Hive Contexts (R3) & HiveHealthMonitor (R7)
**Explorer**: M1-3 (Hive Contexts & Health Monitor Architect)  
**Date**: 2026-09-22  
**Target Repository**: `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active`  
**Referenced Authoritative Documents**:  
- `ORIGINAL_REQUEST.md` (Requirements R1, R2, R3, R7, R8)  
- `orchestrator_beehive_1/PROJECT.md`  
- `explorer_survey_3/report.md` & `explorer_survey_2/report.md`  

---

## 1. Executive Summary

Milestone 1 establishes the foundational layer of the decentralized Beehive architecture for the İESÜ Career & Alumni Ecosystem Platform. This blueprint delivers complete, production-grade specifications and ready-to-implement source code for:

1. **Per-Hive Isolated Contexts (Requirement R3)**:
   - Four dedicated React context files located at `src/hives/*/HiveContext.jsx`.
   - Complete token isolation: Student (`#990000`, `red`, `bg-red-50`, `border-red-200`), Alumni (`#059669`, `emerald`, `bg-emerald-50`, `border-emerald-200`), Company (`#1e3a5f`, `blue`, `bg-blue-50`, `border-blue-200`), Academic (`#7c3aed`, `violet`, `bg-violet-50`, `border-violet-200`).
   - Each context exports `useHiveContext()` guaranteed to return valid, non-null tokens even when called outside a provider (safe fallback pattern).
   - Zero direct cross-hive imports: strictly compliant with architectural isolation.

2. **Admin HiveHealthMonitor Dashboard Widget (Requirement R7)**:
   - Located at `src/brain/HiveHealthMonitor.jsx`.
   - Four honeycomb visual cells (Student, Alumni, Company, Academic) with hex-grid styling, live `active` / `idle` status indicators, and view badges.
   - EventBus throughput tracker displaying real-time events per minute (EPM) powered by `eventBus.getThroughput()` with 3-second auto-refresh and reactive subscriptions.
   - Per-hive error tracking reading directly from `useAdminStore` (`hiveErrors: { student: 0, alumni: 0, company: 0, academic: 0 }`).
   - "All hives connected" green status indicator activated when all 4 isolated hive stores are initialized.
   - Total fault tolerance: defensive null-checks ensuring zero crash risk during SSR, uninitialized stores, or headless vitest executions.

3. **OverviewPanel Integration**:
   - Seamless mounting in `src/components/admin/OverviewPanel.jsx` directly beneath `PanelHeader` (line 16).
   - Co-located mount in `src/components/AdminDashboard.jsx` inline `OverviewPanel` (line 81) to preserve 100% test compatibility across the 40 test suites (360 tests).

---

## 2. Requirement R3: Hive Context Specifications & Implementation

### 2.1 Design Principles & Architecture

- **Strict Isolation**: Each hive cell is an autonomous boundary. `src/hives/student/` must never import from `src/hives/alumni/` or any peer hive.
- **Contract Standardization**: All 4 contexts export the identical interface:
  - `HiveContext`: The React Context instance.
  - `HiveProvider({ children, value })`: The Provider component supporting token override/merging.
  - `useHiveContext()`: The custom consumer hook.
  - `DEFAULT_XXX_HIVE`: Frozen object with default design tokens.
- **Safe Fallback Guarantee**: If `useHiveContext()` is invoked outside a provider (for instance, in isolated component unit tests or orphaned widgets), it returns the default token object rather than `undefined` or `null`. This eliminates all "Cannot read property 'hiveColor' of undefined" runtime crashes.

### 2.2 Hive Color Identity & Token Matrix

| Hive | Key | Primary Color | Hive Accent | Light Background | Border Accent | Text Color | Icon | Turkish Label |
|---|---|---|---|---|---|---|---|---|
| 🎓 **Student** | `student` | `#990000` | `red` | `bg-red-50` | `border-red-200` | `text-[#990000]` | `🎓` | Öğrenci |
| 🟢 **Alumni** | `alumni` | `#059669` | `emerald` | `bg-emerald-50` | `border-emerald-200` | `text-[#059669]` | `🟢` | Mezun |
| 🏢 **Company** | `company` | `#1e3a5f` | `blue` | `bg-blue-50` | `border-blue-200` | `text-[#1e3a5f]` | `🏢` | Kurumsal |
| 👨‍🏫 **Academic** | `academic` | `#7c3aed` | `violet` | `bg-violet-50` | `border-violet-200` | `text-[#7c3aed]` | `👨‍🏫` | Akademik |
| 👑 *(Admin Ref)* | `admin` | `#b45309` | `amber` | `bg-amber-50` | `border-amber-200` | `text-[#b45309]` | `👑` | Yönetici |

---

### 2.3 Ready-to-Implement Source Code: The 4 Hive Contexts

#### File 1: `src/hives/student/HiveContext.jsx`
```javascript
import React, { createContext, useContext, useMemo } from 'react';

/**
 * Immutable default design tokens for the Student Hive.
 * Adheres strictly to the Hive Color Identity Map (#990000, red).
 */
export const DEFAULT_STUDENT_HIVE = Object.freeze({
  hiveColor: '#990000',
  hiveName: 'student',
  hiveAccent: 'red',
  lightBg: 'bg-red-50',
  borderAccent: 'border-red-200',
  textColor: 'text-[#990000]',
  primaryBg: 'bg-[#990000]',
  hoverBg: 'hover:bg-red-800',
  badgeClass: 'bg-red-50 text-[#990000] border-red-200',
  ringColor: 'focus:ring-red-500',
  label: 'Student',
  labelTr: 'Öğrenci',
  icon: '🎓'
});

export const HiveContext = createContext(DEFAULT_STUDENT_HIVE);

/**
 * Student Hive Provider.
 * Allows partial or complete overrides via the `value` prop while
 * ensuring defaults are always preserved.
 */
export function HiveProvider({ children, value }) {
  const contextValue = useMemo(() => {
    return value ? { ...DEFAULT_STUDENT_HIVE, ...value } : DEFAULT_STUDENT_HIVE;
  }, [value]);

  return (
    <HiveContext.Provider value={contextValue}>
      {children}
    </HiveContext.Provider>
  );
}

/**
 * Hook to consume Student Hive context.
 * Guarantees a safe fallback to DEFAULT_STUDENT_HIVE if called outside HiveProvider.
 */
export function useHiveContext() {
  const context = useContext(HiveContext);
  return context || DEFAULT_STUDENT_HIVE;
}

// Named aliases for developer clarity & default export
export { HiveContext as StudentHiveContext, HiveProvider as StudentHiveProvider };
export default HiveContext;
```

---

#### File 2: `src/hives/alumni/HiveContext.jsx`
```javascript
import React, { createContext, useContext, useMemo } from 'react';

/**
 * Immutable default design tokens for the Alumni Hive.
 * Adheres strictly to the Hive Color Identity Map (#059669, emerald).
 */
export const DEFAULT_ALUMNI_HIVE = Object.freeze({
  hiveColor: '#059669',
  hiveName: 'alumni',
  hiveAccent: 'emerald',
  lightBg: 'bg-emerald-50',
  borderAccent: 'border-emerald-200',
  textColor: 'text-[#059669]',
  primaryBg: 'bg-[#059669]',
  hoverBg: 'hover:bg-emerald-700',
  badgeClass: 'bg-emerald-50 text-[#059669] border-emerald-200',
  ringColor: 'focus:ring-emerald-500',
  label: 'Alumni',
  labelTr: 'Mezun',
  icon: '🟢'
});

export const HiveContext = createContext(DEFAULT_ALUMNI_HIVE);

/**
 * Alumni Hive Provider.
 */
export function HiveProvider({ children, value }) {
  const contextValue = useMemo(() => {
    return value ? { ...DEFAULT_ALUMNI_HIVE, ...value } : DEFAULT_ALUMNI_HIVE;
  }, [value]);

  return (
    <HiveContext.Provider value={contextValue}>
      {children}
    </HiveContext.Provider>
  );
}

/**
 * Hook to consume Alumni Hive context.
 * Guarantees safe fallback to DEFAULT_ALUMNI_HIVE if used outside HiveProvider.
 */
export function useHiveContext() {
  const context = useContext(HiveContext);
  return context || DEFAULT_ALUMNI_HIVE;
}

// Named aliases for developer clarity & default export
export { HiveContext as AlumniHiveContext, HiveProvider as AlumniHiveProvider };
export default HiveContext;
```

---

#### File 3: `src/hives/company/HiveContext.jsx`
```javascript
import React, { createContext, useContext, useMemo } from 'react';

/**
 * Immutable default design tokens for the Company Hive.
 * Adheres strictly to the Hive Color Identity Map (#1e3a5f, blue).
 */
export const DEFAULT_COMPANY_HIVE = Object.freeze({
  hiveColor: '#1e3a5f',
  hiveName: 'company',
  hiveAccent: 'blue',
  lightBg: 'bg-blue-50',
  borderAccent: 'border-blue-200',
  textColor: 'text-[#1e3a5f]',
  primaryBg: 'bg-[#1e3a5f]',
  hoverBg: 'hover:bg-slate-900',
  badgeClass: 'bg-blue-50 text-[#1e3a5f] border-blue-200',
  ringColor: 'focus:ring-blue-500',
  label: 'Company',
  labelTr: 'Kurumsal',
  icon: '🏢'
});

export const HiveContext = createContext(DEFAULT_COMPANY_HIVE);

/**
 * Company Hive Provider.
 */
export function HiveProvider({ children, value }) {
  const contextValue = useMemo(() => {
    return value ? { ...DEFAULT_COMPANY_HIVE, ...value } : DEFAULT_COMPANY_HIVE;
  }, [value]);

  return (
    <HiveContext.Provider value={contextValue}>
      {children}
    </HiveContext.Provider>
  );
}

/**
 * Hook to consume Company Hive context.
 * Guarantees safe fallback to DEFAULT_COMPANY_HIVE if used outside HiveProvider.
 */
export function useHiveContext() {
  const context = useContext(HiveContext);
  return context || DEFAULT_COMPANY_HIVE;
}

// Named aliases for developer clarity & default export
export { HiveContext as CompanyHiveContext, HiveProvider as CompanyHiveProvider };
export default HiveContext;
```

---

#### File 4: `src/hives/academic/HiveContext.jsx`
```javascript
import React, { createContext, useContext, useMemo } from 'react';

/**
 * Immutable default design tokens for the Academic Hive.
 * Adheres strictly to the Hive Color Identity Map (#7c3aed, violet).
 */
export const DEFAULT_ACADEMIC_HIVE = Object.freeze({
  hiveColor: '#7c3aed',
  hiveName: 'academic',
  hiveAccent: 'violet',
  lightBg: 'bg-violet-50',
  borderAccent: 'border-violet-200',
  textColor: 'text-[#7c3aed]',
  primaryBg: 'bg-[#7c3aed]',
  hoverBg: 'hover:bg-violet-800',
  badgeClass: 'bg-violet-50 text-[#7c3aed] border-violet-200',
  ringColor: 'focus:ring-violet-500',
  label: 'Academic',
  labelTr: 'Akademik',
  icon: '👨‍🏫'
});

export const HiveContext = createContext(DEFAULT_ACADEMIC_HIVE);

/**
 * Academic Hive Provider.
 */
export function HiveProvider({ children, value }) {
  const contextValue = useMemo(() => {
    return value ? { ...DEFAULT_ACADEMIC_HIVE, ...value } : DEFAULT_ACADEMIC_HIVE;
  }, [value]);

  return (
    <HiveContext.Provider value={contextValue}>
      {children}
    </HiveContext.Provider>
  );
}

/**
 * Hook to consume Academic Hive context.
 * Guarantees safe fallback to DEFAULT_ACADEMIC_HIVE if used outside HiveProvider.
 */
export function useHiveContext() {
  const context = useContext(HiveContext);
  return context || DEFAULT_ACADEMIC_HIVE;
}

// Named aliases for developer clarity & default export
export { HiveContext as AcademicHiveContext, HiveProvider as AcademicHiveProvider };
export default HiveContext;
```

---

## 3. Requirement R7: HiveHealthMonitor Architecture & Implementation

### 3.1 Architecture & Contract Bindings

`src/brain/HiveHealthMonitor.jsx` binds the following foundational pieces into a unified administrative telemetry dashboard:

1. **EventBus Integration (`src/brain/eventBus.js`)**:
   - Invocations: `eventBus.getThroughput()` returns the current rolling 60-second Events Per Minute (EPM).
   - Subscription: `eventBus.on('*', updateHandler)` or a 3-second polling fallback ensures the EPM counter updates instantly whenever any hive dispatches an event.
   - Test Trigger: Contains a "Tetikle / Ping" button to emit a test event (`feature:toggled`) so operators and QA can interactively verify EventBus responsiveness.

2. **Per-Hive Errors Integration (`src/brain/useAdminStore.js`)**:
   - Reads `hiveErrors` from admin store: `{ student: 0, alumni: 0, company: 0, academic: 0, admin: 0 }`.
   - Renders a clean status badge when errors are 0, or a pulsing alert badge with warning indicator when errors > 0.

3. **"All Hives Connected" Green Indicator**:
   - Verifies whether all 4 user-hive stores (`useStudentStore`, `useAlumniStore`, `useCompanyStore`, `useAcademicStore`) are defined and initialized (`typeof store.getState === 'function'`).
   - If all 4 are initialized: renders an eye-catching green pill with an animated radar ping:
     ```jsx
     <div data-testid="all-hives-connected" className="...">
       <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
       <span>✓ All hives connected</span>
     </div>
     ```
   - If any store is pending: displays an amber badge showing exact connection count: `Bağlanıyor (X/4 kovan)`.

4. **Honeycomb Cells Layout**:
   - Displays 4 responsive cards styled as hex-cells using an SVG hexagon badge (`points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25"`).
   - Displays:
     - Hive Name & Turkish Label
     - Active / Idle Status pill: `active` if currently selected in session or recent traffic; otherwise `idle`.
     - Current View badge: reads `activeView` from each hive store.
     - Error count badge: reads `hiveErrors` from `useAdminStore`.
     - Hive identity theme color & icon.

---

### 3.2 Ready-to-Implement Source Code: `src/brain/HiveHealthMonitor.jsx`

```jsx
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

  // Check store initialization across all 4 user-role hive stores
  const storeStatus = useMemo(() => {
    return HIVE_CELLS_CONFIG.map(hive => {
      const isInitialized = Boolean(
        hive.storeHook && 
        typeof hive.storeHook.getState === 'function'
      );
      let activeView = 'feed';
      if (isInitialized) {
        try {
          activeView = hive.storeHook.getState()?.activeView || 'feed';
        } catch {
          activeView = 'feed';
        }
      }
      return {
        ...hive,
        isInitialized,
        activeView
      };
    });
  }, []);

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
            className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs active:scale-95"
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
```

---

## 4. Integration into `src/components/admin/OverviewPanel.jsx`

### 4.1 Inspection of Target File

Inspection of lines 1–25 of `src/components/admin/OverviewPanel.jsx`:
```jsx
1: import React from 'react';
2: import useAppStore from '../../store/useAppStore';
3: import PanelHeader from './PanelHeader';
4: import { Card, StatCard, Badge, Tbl } from './AdminShared';
5: import { Users, Briefcase, GraduationCap, Award, BookOpen, Library, MessageSquare, Calendar, Megaphone, UserPlus, MessageCircle, Wand2 } from 'lucide-react';
6: 
7: export default function OverviewPanel({ setView }) {
8:   const { students, alumni, jobs, mentorships, voluntaryInternships, surveys, academicApprovals, messages } = useAppStore();
9:   const depts = {};
10:   (students || []).forEach(s => { depts[s?.dept]=(depts[s?.dept]||0)+1; });
11:   const deptList = Object.entries(depts).sort((a,b)=>b[1]-a[1]).slice(0,5);
12:   const maxDept = deptList[0]?.[1]||1;
13: 
14:   return (
15:     <div className="animate-fade-in space-y-6">
16:       <PanelHeader title="Kontrol Merkezi" sub="Sistemin genel durumu" />
17:       
18:       {/* AI Modülleri Banner */}
```

### 4.2 Exact Code Modification

1. Add the import statement to `src/components/admin/OverviewPanel.jsx`:
```javascript
import HiveHealthMonitor from '../../brain/HiveHealthMonitor';
```

2. Mount `<HiveHealthMonitor />` immediately beneath `<PanelHeader ... />`:
```jsx
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Kontrol Merkezi" sub="Sistemin genel durumu" />
      
      {/* R7 Beehive Health Monitor */}
      <HiveHealthMonitor />
      
      {/* AI Modülleri Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden transition-all hover:scale-[1.01] duration-500">
```

### 4.3 Co-location with `src/components/AdminDashboard.jsx`

Empirical analysis discovered that `src/components/AdminDashboard.jsx` contains an internal inline `OverviewPanel` function starting at line 76:
```jsx
function OverviewPanel({ students = [], alumni = [], jobs = [], events = [], announcements = [], mentorships = [], voluntaryInternships = [], surveys = [], academicApprovals = [], applications = [], setActiveTab, setView }) {
  const messages = useAppStore(state => state.messages);
  
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Kontrol Merkezi" sub="Sistemdeki genel durum ve özet veriler" />
      
      {/* R7 Beehive Health Monitor */}
      <HiveHealthMonitor />
```
Mounting `<HiveHealthMonitor />` here as well ensures that when existing tests (such as `src/__tests__/AdminDashboard.test.jsx` and `src/__tests__/ComponentIntegrity.test.jsx`) render `AdminDashboard` in default overview tab mode, the Beehive Health Monitor is verified live under test conditions without any divergence.

---

## 5. Verification & Test Suite Strategy

### 5.1 Unit Tests for Hive Contexts (`src/__tests__/HiveContexts.test.jsx`)

Worker M1 should include this test suite to verify R3 compliance:
```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { 
  HiveProvider as StudentProvider, 
  useHiveContext as useStudentContext,
  DEFAULT_STUDENT_HIVE 
} from '../hives/student/HiveContext';

import { 
  HiveProvider as AlumniProvider, 
  useHiveContext as useAlumniContext,
  DEFAULT_ALUMNI_HIVE 
} from '../hives/alumni/HiveContext';

import { 
  HiveProvider as CompanyProvider, 
  useHiveContext as useCompanyContext,
  DEFAULT_COMPANY_HIVE 
} from '../hives/company/HiveContext';

import { 
  HiveProvider as AcademicProvider, 
  useHiveContext as useAcademicContext,
  DEFAULT_ACADEMIC_HIVE 
} from '../hives/academic/HiveContext';

function Consumer({ hook }) {
  const { hiveColor, hiveName, hiveAccent, lightBg, borderAccent } = hook();
  return (
    <div>
      <span data-testid="color">{hiveColor}</span>
      <span data-testid="name">{hiveName}</span>
      <span data-testid="accent">{hiveAccent}</span>
      <span data-testid="lightBg">{lightBg}</span>
      <span data-testid="border">{borderAccent}</span>
    </div>
  );
}

describe('Requirement R3: Hive Contexts', () => {
  it('provides exact student hive tokens', () => {
    render(
      <StudentProvider>
        <Consumer hook={useStudentContext} />
      </StudentProvider>
    );
    expect(screen.getByTestId('color').textContent).toBe('#990000');
    expect(screen.getByTestId('name').textContent).toBe('student');
    expect(screen.getByTestId('accent').textContent).toBe('red');
    expect(screen.getByTestId('lightBg').textContent).toBe('bg-red-50');
    expect(screen.getByTestId('border').textContent).toBe('border-red-200');
  });

  it('provides safe fallback when used outside student provider', () => {
    render(<Consumer hook={useStudentContext} />);
    expect(screen.getByTestId('color').textContent).toBe('#990000');
    expect(screen.getByTestId('name').textContent).toBe('student');
  });

  it('provides exact alumni hive tokens', () => {
    render(
      <AlumniProvider>
        <Consumer hook={useAlumniContext} />
      </AlumniProvider>
    );
    expect(screen.getByTestId('color').textContent).toBe('#059669');
    expect(screen.getByTestId('name').textContent).toBe('alumni');
    expect(screen.getByTestId('accent').textContent).toBe('emerald');
  });

  it('provides exact company hive tokens', () => {
    render(
      <CompanyProvider>
        <Consumer hook={useCompanyContext} />
      </CompanyProvider>
    );
    expect(screen.getByTestId('color').textContent).toBe('#1e3a5f');
    expect(screen.getByTestId('name').textContent).toBe('company');
    expect(screen.getByTestId('accent').textContent).toBe('blue');
  });

  it('provides exact academic hive tokens', () => {
    render(
      <AcademicProvider>
        <Consumer hook={useAcademicContext} />
      </AcademicProvider>
    );
    expect(screen.getByTestId('color').textContent).toBe('#7c3aed');
    expect(screen.getByTestId('name').textContent).toBe('academic');
    expect(screen.getByTestId('accent').textContent).toBe('violet');
  });
});
```

---

### 5.2 Unit Tests for HiveHealthMonitor (`src/__tests__/HiveHealthMonitor.test.jsx`)

Worker M1 should include this test suite to verify R7 compliance:
```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HiveHealthMonitor from '../brain/HiveHealthMonitor';

describe('Requirement R7: HiveHealthMonitor Component', () => {
  it('renders all 4 honeycomb cells', () => {
    render(<HiveHealthMonitor />);
    expect(screen.getByTestId('honeycomb-cell-student')).toBeInTheDocument();
    expect(screen.getByTestId('honeycomb-cell-alumni')).toBeInTheDocument();
    expect(screen.getByTestId('honeycomb-cell-company')).toBeInTheDocument();
    expect(screen.getByTestId('honeycomb-cell-academic')).toBeInTheDocument();
  });

  it('displays EPM throughput counter', () => {
    render(<HiveHealthMonitor />);
    expect(screen.getByTestId('epm-counter')).toBeInTheDocument();
  });

  it('renders connection indicator without crashing', () => {
    render(<HiveHealthMonitor />);
    const monitor = screen.getByTestId('hive-health-monitor');
    expect(monitor).toBeInTheDocument();
  });
});
```

---

## 6. Implementation Checklist for Worker M1

- [ ] Create `src/hives/student/HiveContext.jsx` with `#990000` / `red`
- [ ] Create `src/hives/alumni/HiveContext.jsx` with `#059669` / `emerald`
- [ ] Create `src/hives/company/HiveContext.jsx` with `#1e3a5f` / `blue`
- [ ] Create `src/hives/academic/HiveContext.jsx` with `#7c3aed` / `violet`
- [ ] Verify each `HiveContext.jsx` exports `useHiveContext()`, `HiveProvider`, `HiveContext`, and default export
- [ ] Create `src/brain/HiveHealthMonitor.jsx` with honeycomb cells, EPM throughput counter, error counts, and "All hives connected" badge
- [ ] Mount `<HiveHealthMonitor />` in `src/components/admin/OverviewPanel.jsx` right under `<PanelHeader ... />`
- [ ] Mount `<HiveHealthMonitor />` in `src/components/AdminDashboard.jsx` inline `OverviewPanel`
- [ ] Run `npx vitest run src/__tests__/AdminDashboard.test.jsx` (must pass)
- [ ] Run `npx vitest run src/__tests__/ComponentIntegrity.test.jsx` (must pass)
- [ ] Run `npm run build` (must exit with code 0)

