/**
 * src/store/useAppStore.js
 * Core Session & Routing Zustand Store with Backward-Compatibility Delegation Facade.
 * Requirement R8 (Beehive Architecture): Core 9 session fields + delegation (<12KB).
 */

import { create, useStore } from 'zustand';
import { persist } from 'zustand/middleware';
import DOMPurify from 'dompurify';
import { useSharedStore } from '../brain/useSharedStore';
import { useAdminStore } from '../brain/useAdminStore';

const mapRoleToHive = (role) => {
  if (role === 'company' || role === 'employer') return 'company';
  if (role === 'academic') return 'academic';
  if (role === 'alumni') return 'alumni';
  if (role === 'admin') return 'admin';
  if (role === 'student') return 'student';
  return undefined;
};

// ── Core Zustand Store (Strictly Session / Routing & App Context) ───────────────
export const coreStore = create(
  persist(
    (set) => ({
      // 1. userRole
      userRole: null,
      setUserRole: (role) => {
        const hive = mapRoleToHive(role);
        set((state) => ({
          userRole: role,
          ...(hive ? { activeHive: hive, previousHive: state.activeHive !== hive ? state.activeHive : state.previousHive } : {})
        }));
      },

      // 2. currentUser
      currentUser: null,
      setCurrentUser: (user) => {
        const hive = mapRoleToHive(user?.role);
        set((state) => ({
          currentUser: user,
          ...(hive ? { activeHive: hive, previousHive: state.activeHive !== hive ? state.activeHive : state.previousHive } : {})
        }));
      },

      // 3. authenticatedUserId
      authenticatedUserId: null,
      setAuthenticatedUserId: (id) => set({ authenticatedUserId: id }),

      // 4. activeHive
      activeHive: 'student',
      setActiveHive: (hive) => set({ activeHive: hive }),

      // 5. previousHive
      previousHive: null,
      setPreviousHive: (hive) => set({ previousHive: hive }),

      // 6. selectedUserId
      selectedUserId: null,
      setSelectedUserId: (id) => set({ selectedUserId: id }),

      // 7. selectedGroupId
      selectedGroupId: null,
      setSelectedGroupId: (id) => set({ selectedGroupId: id }),

      // 8. activePortalBranch
      activePortalBranch: 'student',
      setActivePortalBranch: (branch) => {
        try {
          if (typeof window !== 'undefined') localStorage.setItem('iesu_active_portal_branch', branch);
        } catch {}
        set({ activePortalBranch: branch });
      },

      // 9. logAction (audit logger with DOMPurify sanitization & circular ref defense)
      logAction: (actionOrUser, userOrAction, moduleOrDetails = 'Genel', severityOrLevel = 'info', metadata = null) => {
        let action, user, moduleName, level;
        if (typeof userOrAction === 'string' && (moduleOrDetails === 'warning' || moduleOrDetails === 'critical' || moduleOrDetails === 'info')) {
          action = userOrAction;
          user = actionOrUser;
          moduleName = 'Genel';
          level = moduleOrDetails;
        } else if (typeof actionOrUser === 'string' && typeof userOrAction === 'string') {
          user = actionOrUser;
          action = userOrAction;
          moduleName = typeof moduleOrDetails === 'string' ? moduleOrDetails : 'Genel';
          level = typeof severityOrLevel === 'string' ? severityOrLevel : 'info';
        } else {
          action = String(actionOrUser || '');
          user = String(userOrAction || 'Sistem');
          moduleName = typeof moduleOrDetails === 'string' ? moduleOrDetails : 'Genel';
          level = typeof severityOrLevel === 'string' ? severityOrLevel : 'info';
        }

        const cleanAction = typeof action === 'string' ? DOMPurify.sanitize(action.slice(0, 500)) : String(action || '');
        const cleanUser = typeof user === 'string' ? DOMPurify.sanitize(user.slice(0, 100)) : String(user || 'Sistem');
        const cleanModule = typeof moduleName === 'string' ? DOMPurify.sanitize(moduleName.slice(0, 50)) : 'Genel';
        const cleanLevel = (level === 'warning' || level === 'critical') ? level : 'info';

        const now = new Date();
        const entry = {
          id: 'log_' + now.getTime() + '_' + Math.random().toString(36).substr(2, 6),
          timestamp: now.toLocaleTimeString('tr-TR'),
          isoTimestamp: now.toISOString(),
          user: cleanUser,
          action: cleanAction,
          module: cleanModule,
          level: cleanLevel,
          severity: cleanLevel,
          ip: typeof window !== 'undefined' ? (window.location?.hostname || 'localhost') : 'server'
        };

        try {
          if (metadata && typeof metadata === 'object') {
            JSON.stringify(metadata);
            entry.metadata = metadata;
          }
        } catch {
          entry.metadata = { note: '[circular reference ignored]' };
        }

        try {
          useAdminStore.getState().logAuditAction?.(cleanUser, cleanAction, cleanModule, cleanLevel, entry.metadata);
        } catch {}
      },

      // Secondary session / UI helpers for backwards compatibility
      userBP: 150,
      setUserBP: (bp) => set((s) => ({ userBP: typeof bp === 'function' ? bp(s.userBP) : bp })),
      purchasedItems: [],
      setPurchasedItems: (items) => set({ purchasedItems: items }),
      activeFrame: null,
      setActiveFrame: (frame) => set({ activeFrame: frame }),
      unlockedBadges: [],
      setUnlockedBadges: (b) => set({ unlockedBadges: b }),
      sharedBrainDictionary: {},
      setSharedBrainDictionary: (d) => set({ sharedBrainDictionary: d }),
      liveRooms: [],
      setLiveRooms: (r) => set({ liveRooms: r }),
      focusMode: false,
      setFocusMode: (m) => set({ focusMode: m }),
      ghostMode: false,
      setGhostMode: (m) => set({ ghostMode: m }),

      // Store reset helper
      reset: () => {
        set({
          userRole: null,
          currentUser: null,
          authenticatedUserId: null,
          activeHive: 'student',
          previousHive: null,
          selectedUserId: null,
          selectedGroupId: null,
          activePortalBranch: 'student',
          userBP: 150,
          purchasedItems: [],
          activeFrame: null,
          unlockedBadges: [],
          sharedBrainDictionary: {},
          liveRooms: [],
          focusMode: false,
          ghostMode: false
        });
        try { useSharedStore.getState().reset?.(); } catch {}
        try { useAdminStore.getState().reset?.(); } catch {}
      }
    }),
    {
      name: 'iesu_app_session_v1',
      partialize: (state) => ({
        userRole: state.userRole,
        currentUser: state.currentUser,
        activePortalBranch: state.activePortalBranch,
        activeHive: state.activeHive
      })
    }
  )
);

// ── Backward-Compatibility Delegation Facade (stable merged object) ───────────
// IMPORTANT: We use a MERGED PLAIN OBJECT (not Proxy) so that getSnapshot()
// always returns the same reference as long as no underlying store changed.
// This prevents useSyncExternalStore's tearing-detection from causing
// infinite re-renders ("Maximum update depth exceeded").
let _cachedState = null;
let _lastCore = null;
let _lastShared = null;
let _lastAdmin = null;

export function getFacadeState() {
  const core = coreStore.getState();
  const shared = useSharedStore.getState();
  const admin = useAdminStore.getState();

  // Return the same object reference if nothing actually changed
  if (_cachedState && core === _lastCore && shared === _lastShared && admin === _lastAdmin) {
    return _cachedState;
  }

  _lastCore = core;
  _lastShared = shared;
  _lastAdmin = admin;

  // Build stable aliases / dynamic setters
  const dynamicSetters = {};
  for (const key of Object.keys(shared)) {
    const setterName = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
    if (!(setterName in shared) && !(setterName in core)) {
      dynamicSetters[setterName] = (val) =>
        useSharedStore.setState((s) => ({ [key]: typeof val === 'function' ? val(s[key]) : val }));
    }
  }
  for (const key of Object.keys(admin)) {
    const setterName = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
    if (!(setterName in admin) && !(setterName in shared) && !(setterName in core)) {
      dynamicSetters[setterName] = (val) =>
        useAdminStore.setState((s) => ({ [key]: typeof val === 'function' ? val(s[key]) : val }));
    }
  }

  const plain = Object.assign(
    {},
    admin,          // CMS collections
    shared,         // Platform data
    dynamicSetters, // Auto-generated setters for un-wrapped keys
    {
      // Backward compat aliases
      auditLogs: admin.auditLogs,
      auditLog: admin.auditLogs,
      isScraperLoading: shared.isScraperLoading,
      source: shared.source,
      status: shared.status,
      lastUpdated: shared.lastUpdated,
      refreshScrapedData: shared.refreshScrapedData,
    },
    core            // Session / routing fields (highest priority)
  );

  _cachedState = new Proxy(plain, {
    set(target, prop, value) {
      target[prop] = value;
      facadeSetState({ [prop]: value });
      return true;
    }
  });

  return _cachedState;
}

function facadeSetState(partial, replace) {
  const current = getFacadeState();
  const update = typeof partial === 'function' ? partial(current) : partial;
  if (!update || typeof update !== 'object') return;

  const sharedUpdate = {};
  const adminUpdate = {};
  const coreUpdate = {};

  const sharedKeys = new Set(Object.keys(useSharedStore.getState()));
  const adminKeys  = new Set(Object.keys(useAdminStore.getState()));

  for (const [key, val] of Object.entries(update)) {
    if (key === 'auditLogs' || key === 'auditLog') {
      adminUpdate.auditLogs = val;
    } else if (sharedKeys.has(key)) {
      sharedUpdate[key] = val;
    } else if (adminKeys.has(key)) {
      adminUpdate[key] = val;
    } else {
      coreUpdate[key] = val;
    }
  }

  if (Object.keys(sharedUpdate).length > 0) useSharedStore.setState(sharedUpdate);
  if (Object.keys(adminUpdate).length > 0)  useAdminStore.setState(adminUpdate);
  if (Object.keys(coreUpdate).length > 0)   coreStore.setState(coreUpdate, replace);
}

function facadeSubscribe(listener) {
  // Three subscriptions fire when any underlying store changes.
  // With the stable merged-object cache, calls 2 & 3 return the same
  // _cachedState reference → listener fires with (same, same) → no re-render.
  let prevSnapshot = getFacadeState();
  const wrapped = () => {
    const nextSnapshot = getFacadeState();
    if (nextSnapshot !== prevSnapshot) {
      listener(nextSnapshot, prevSnapshot);
      prevSnapshot = nextSnapshot;
    }
  };
  const u1 = coreStore.subscribe(wrapped);
  const u2 = useSharedStore.subscribe(wrapped);
  const u3 = useAdminStore.subscribe(wrapped);
  return () => { u1(); u2(); u3(); };
}

const api = {
  getState:        getFacadeState,
  setState:        facadeSetState,
  subscribe:       facadeSubscribe,
  getInitialState: getFacadeState,
};

const identity   = (s) => s;
const useAppStore = (selector = identity) => useStore(api, selector);
Object.assign(useAppStore, api);

export default useAppStore;
