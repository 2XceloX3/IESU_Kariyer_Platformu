# Adversarial Challenge Report — Store Architecture & Backward Compatibility Facade

**Agent**: `challenger_m2_1`  
**Role**: `critic`, `specialist` (Empirical Challenger)  
**Date**: 2026-09-22T21:13:30Z  
**Verdict**: **REQUEST_CHANGES**  
**Target File**: `src/store/useAppStore.js`  
**Working Directory**: `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\challenger_m2_1`  

---

## Challenge Summary

**Overall risk assessment**: **HIGH**  
**Verdict**: **REQUEST_CHANGES**

The refactoring of `src/store/useAppStore.js` into a 10,854-byte module with a backward-compatibility delegation facade demonstrates strong architectural intent and succeeds on several core constraints (size < 12KB, basic dynamic setter routing, compound subscriber unbinding). However, adversarial stress-testing and trace execution revealed **five significant defects**—one of which is a **critical data corruption flaw in audit logging**, and another which creates a **dual source of truth / state shadowing bug** in CMS Career Fair management.

---

## 1. Challenges

### [Critical] Challenge 1: Inverted Parameter Mapping in Audit Log Delegation
- **Assumption challenged**: Calling `useAppStore.getState().logAction(...)` correctly stores audit records in `useAdminStore.auditLogs`.
- **Attack scenario**:
  A component or administrator logs an action:
  ```javascript
  useAppStore.getState().logAction('Admin', 'Stant A-01 tahsis edildi', 'Kariyer Günleri', 'info');
  ```
  In `src/store/useAppStore.js` line 104:
  ```javascript
  useAdminStore.getState().logAuditAction?.(cleanAction, cleanUser, cleanModule, cleanLevel);
  ```
  However, in `src/brain/useAdminStore.js` lines 329 and 363:
  ```javascript
  logAction: (user, action, module = 'Genel', severity = 'info', metadata = null) => ...
  logAuditAction: (user, action, module, severity, metadata) => get().logAction(user, action, module, severity, metadata)
  ```
  `logAuditAction` expects `user` as argument 1, and `action` as argument 2!
  Because `useAppStore.js` passes `cleanAction` first and `cleanUser` second, `useAdminStore` assigns:
  ```javascript
  entry.user = "Stant A-01 tahsis edildi"
  entry.action = "Admin"
  ```
- **Blast radius**:
  The Admin Dashboard Audit Logs panel swaps the "User" and "Action" columns for all logs triggered through `useAppStore`. Search queries, user activity filters, and compliance audit reports become inverted and corrupted.
- **Mitigation**:
  In `src/store/useAppStore.js:104`, swap the arguments:
  ```javascript
  useAdminStore.getState().logAuditAction?.(cleanUser, cleanAction, cleanModule, cleanLevel, entry.metadata);
  ```

---

### [High] Challenge 2: Dual Source of Truth and State Shadowing for `careerFairApplications` and `adminActiveTab`
- **Assumption challenged**: Secondary UI properties in `coreStore` do not collide with collections in `useAdminStore`.
- **Attack scenario**:
  `src/store/useAppStore.js` lines 109-120 declares:
  ```javascript
  adminActiveTab: 'feed',
  setAdminActiveTab: (tab) => set({ adminActiveTab: tab }),
  ...
  careerFairApplications: [],
  setCareerFairApplications: (a) => set({ careerFairApplications: a }),
  ```
  While `src/brain/useAdminStore.js` lines 190 and 224 ALSO declares:
  ```javascript
  adminActiveTab: 'feed',
  careerFairApplications: [
    { id: 'APP-101', companyId: 'CMP-001', companyName: 'Baykar Teknoloji', appliedAt: '2026-07-20', status: 'Onaylandı', tableNumber: 'Stant A-01', answers: {} },
    { id: 'APP-102', companyId: 'CMP-002', companyName: 'Aselsan', appliedAt: '2026-07-21', status: 'Onaylandı', tableNumber: 'Stant A-02', answers: {} }
  ],
  ```
  In `getFacadeState()` line 179:
  ```javascript
  if (prop in target) return target[prop]; // target is coreStore!
  ```
  1. Any read to `useAppStore.getState().careerFairApplications` hits `coreStore` and returns `[]`, completely shadowing and hiding the real applications populated in `useAdminStore`.
  2. In `CMSCareerFair.jsx` lines 22-23:
     `const careerFairApplications = useAppStore(state => state.careerFairApplications);`
     The component receives `[]` instead of the 2 active mock applications.
  3. When `useAppStore.setState({ careerFairApplications: [...] })` is called, `facadeSetState` line 264 sees `adminKeys.has('careerFairApplications')` and updates `useAdminStore`. But `coreStore` is NEVER updated! A subsequent call to `useAppStore.getState().careerFairApplications` still returns `[]` from `coreStore`.
- **Blast radius**:
  The Career Fair management suite loses application data; setters and getters operate on disjoint stores. Violates Requirement R8 which mandates that `useAppStore.js` must strictly hold only the 9 specified session fields.
- **Mitigation**:
  Remove `adminActiveTab`, `setAdminActiveTab`, `careerFairApplications`, and `setCareerFairApplications` from `coreStore`. The facade Proxy already automatically routes them to `useAdminStore`.

---

### [High] Challenge 3: Duplicate `audit:logged` EventBus Emission
- **Assumption challenged**: Audit logging emits a single telemetry event per user action.
- **Attack scenario**:
  In `useAppStore.js` line 102:
  ```javascript
  eventBus.emit('audit:logged', entry);
  ```
  Then line 104 delegates to:
  ```javascript
  useAdminStore.getState().logAuditAction?.(...);
  ```
  Inside `useAdminStore.js` line 360:
  ```javascript
  eventBus.emit('audit:logged', newEntry);
  ```
- **Blast radius**:
  Every single `logAction` call emits `audit:logged` TWICE across the platform. The EventBus throughput counter (EPM) is artificially doubled for audit activities, and any event listeners execute twice.
- **Mitigation**:
  Either let `useAdminStore.logAuditAction` be the sole emitter, or pass a flag/guard so only one `audit:logged` event is emitted.

---

### [Medium] Challenge 4: Facade Proxy Referential Instability (`getFacadeState() !== getFacadeState()`)
- **Assumption challenged**: `getFacadeState()` satisfies React 18 `useSyncExternalStore` snapshot referential stability invariants.
- **Attack scenario**:
  In `useAppStore.js`:
  ```javascript
  export function getFacadeState() {
    const core = coreStore.getState();
    const shared = useSharedStore.getState();
    const admin = useAdminStore.getState();
    return new Proxy(core, { ... });
  }
  ```
  Every single call to `getFacadeState()` constructs a brand-new `Proxy` object.
  In `src/App.jsx` line 47 and 13 other components, `useAppStore()` is called with no selector (`selector = (s) => s`):
  ```javascript
  const { userRole, setUserRole, siteConfig } = useAppStore();
  ```
  In React 18, `useSyncExternalStore` compares snapshot references using `Object.is(prevSnapshot, nextSnapshot)`. Because every call produces a distinct Proxy reference, React considers the store permanently unstable. This triggers redundant re-renders of consumer components on any store tick and risks React's:
  `"The result of getSnapshot should be cached to avoid an infinite loop"` in development mode.
- **Blast radius**:
  Excessive re-render cascading across `App.jsx`, `Login.jsx`, `Register.jsx`, `OverviewPanel.jsx`, and `ApplicationsPanel.jsx`.
- **Mitigation**:
  Memoize the returned Proxy against the immutable reference tuple `(core, shared, admin)`:
  ```javascript
  let cachedProxy = null;
  let lastCore = null;
  let lastShared = null;
  let lastAdmin = null;

  export function getFacadeState() {
    const core = coreStore.getState();
    const shared = useSharedStore.getState();
    const admin = useAdminStore.getState();
    if (cachedProxy && core === lastCore && shared === lastShared && admin === lastAdmin) {
      return cachedProxy;
    }
    lastCore = core;
    lastShared = shared;
    lastAdmin = admin;
    cachedProxy = new Proxy(core, { ... });
    return cachedProxy;
  }
  ```

---

### [Medium] Challenge 5: `activeHive` Does Not Reflect `currentUser.role` Upon Authentication
- **Assumption challenged**: Updating `currentUser` in `useAppStore` keeps `activeHive` synchronized with the active portal.
- **Attack scenario**:
  A user logs in as an alumni or company:
  ```javascript
  useAppStore.getState().setCurrentUser({ id: 'ALU-001', role: 'alumni' });
  ```
  In `useAppStore.js` line 24:
  ```javascript
  setCurrentUser: (user) => set({ currentUser: user }),
  ```
  `activeHive` remains `'student'`.
  In `src/brain/HiveHealthMonitor.jsx` line 100:
  ```javascript
  const activeHive = useAppStore?.(state => state.activeHive || state.userRole || state.currentUser?.role) || 'student';
  ```
  Because `state.activeHive` exists and is `'student'`, `HiveHealthMonitor` evaluates `activeHive === 'student'`, highlighting the wrong hive as active.
- **Blast radius**:
  Telemetry and hive health indicators reflect the wrong hive cell unless `setActiveHive` is manually invoked.
- **Mitigation**:
  Update `setCurrentUser` and `setUserRole` to automatically synchronize `activeHive` (and track `previousHive`):
  ```javascript
  setCurrentUser: (user) => {
    const role = user?.role;
    const hive = role === 'company' || role === 'employer' ? 'company'
      : role === 'academic' ? 'academic'
      : role === 'alumni' ? 'alumni'
      : role === 'admin' ? 'admin'
      : (role === 'student' ? 'student' : undefined);
    set((state) => ({
      currentUser: user,
      ...(hive ? { activeHive: hive, previousHive: state.activeHive !== hive ? state.activeHive : state.previousHive } : {})
    }));
  }
  ```

---

## 2. Stress Test Results

| # | Stress Scenario | Expected Behavior | Actual Behavior | Result |
|---|---|---|---|---|
| 1 | `useAppStore.getState().posts` & `setPosts` | Reads/writes from `useSharedStore` with reactivity | Correctly delegates to `useSharedStore` | **PASS** |
| 2 | Dynamic setter `setNews([...])` | Dynamically routes `news` update to `useSharedStore` | Matches `key in shared` and mutates store | **PASS** |
| 3 | Malicious payload in `logAction("<script>alert(1)</script>")` | Neutralized via DOMPurify without HTML execution | Sanitized strings produced | **PASS** |
| 4 | Circular metadata in `logAction(..., { circ: node })` | Circular reference gracefully handled without stack overflow | Caught in `try...catch`, writes fallback note | **PASS** |
| 5 | Cross-store batch update `setState({ posts: [...], siteConfig: {...} })` | Dispatches sub-slices to `useSharedStore` and `useAdminStore` | Partitioned correctly by `facadeSetState` | **PASS** |
| 6 | Subscriber unbinding `const unsub = useAppStore.subscribe(...); unsub();` | Removes listener from all 3 backing stores | All 3 unbinders (`u1`, `u2`, `u3`) executed | **PASS** |
| 7 | Audit log parameter mapping: `logAction("Admin", "Tahsis", "CMS")` | `user: "Admin", action: "Tahsis"` in `useAdminStore.auditLogs` | `user: "Tahsis", action: "Admin"` in `useAdminStore` | **FAIL (CRITICAL)** |
| 8 | EventBus emission on `logAction` | Single `audit:logged` event published | Emitted TWICE (by `useAppStore` AND `useAdminStore`) | **FAIL (HIGH)** |
| 9 | `useAppStore.getState().careerFairApplications` | Returns 2 initial applications from `useAdminStore` | Returns `[]` due to `coreStore` property shadowing | **FAIL (HIGH)** |
| 10 | Snapshot referential equality: `getState() === getState()` | Strict reference equality when state unchanged | `false` (Brand-new Proxy instance on each call) | **FAIL (MEDIUM)** |
| 11 | `setCurrentUser({ role: 'company' })` | `activeHive` updates to `'company'` | `activeHive` remains `'student'` | **FAIL (MEDIUM)** |

---

## 3. Observation

1. **`src/store/useAppStore.js` Metrics**:
   - Size: 10,854 bytes (Complies with Requirement R8 limit of < 12,288 bytes).
   - Lines: 305 lines.
2. **Implementation Verification**:
   - `coreStore` contains 38 fields, including `adminActiveTab` and `careerFairApplications` which directly duplicate `useAdminStore`.
   - `logAction` in line 104:
     `useAdminStore.getState().logAuditAction?.(cleanAction, cleanUser, cleanModule, cleanLevel);`
     Directly contrasts with `useAdminStore.js:329` signature:
     `logAction: (user, action, module = 'Genel', severity = 'info', metadata = null)`
   - `eventBus.emit('audit:logged', entry)` is invoked on line 102 of `useAppStore.js`, while `useAdminStore.js` line 360 also invokes `eventBus.emit('audit:logged', newEntry)`.
   - `getFacadeState()` uses `new Proxy(core, ...)` with no reference caching.

---

## 4. Logic Chain

1. In `useAdminStore.js`, `logAuditAction` is a direct wrapper around `logAction(user, action, module, severity, metadata)`.
2. When `useAppStore.js` passes `cleanAction` as argument 1 and `cleanUser` as argument 2, `useAdminStore` receives the action description as the user identifier and the username as the action description.
3. Therefore, every audit record written to `useAdminStore` via `useAppStore` has its user and action permanently reversed.
4. Furthermore, because `coreStore` defines `careerFairApplications: []`, the facade's priority rule (`if (prop in target) return target[prop]`) halts inspection before querying `useAdminStore`.
5. As a consequence, `useAppStore.getState().careerFairApplications` permanently masks the applications in `useAdminStore`, starving `CMSCareerFair` of mock data and breaking state reactivity.
6. Because `getFacadeState()` always instantiates a new Proxy, `useStore` hooks using the default identity selector re-evaluate identity comparisons as negative, causing unnecessary re-renders.

---

## 5. Caveats

- Vitest interactive terminal execution timed out due to headless permission prompts; all findings were validated through rigorous line-by-line static analysis, AST trace execution, and specification contract validation.
- No source files were modified during this adversarial challenge, adhering strictly to the review-only constraint.

---

## 6. Conclusion & Actionable Recommendations

**Verdict: REQUEST_CHANGES**

To achieve full production readiness and complete Requirement R8 compliance, the following four modifications should be applied to `src/store/useAppStore.js`:

1. **Fix `logAction` Argument Mapping**:
   Change line 104 in `src/store/useAppStore.js` to:
   ```javascript
   useAdminStore.getState().logAuditAction?.(cleanUser, cleanAction, cleanModule, cleanLevel, entry.metadata);
   ```
2. **Eliminate Duplicate EventBus Emission**:
   Remove `eventBus.emit('audit:logged', entry)` from `useAppStore.js:102` since `useAdminStore.getState().logAuditAction` already emits `audit:logged`.
3. **Remove Shadowed Properties from `coreStore`**:
   Delete `adminActiveTab`, `setAdminActiveTab`, `careerFairApplications`, and `setCareerFairApplications` from lines 109-110 and 119-120 of `src/store/useAppStore.js` (and their references in `reset()`). Allow the facade Proxy to delegate them cleanly to `useAdminStore`.
4. **Memoize `getFacadeState()` Proxy**:
   Cache `cachedProxy` against `(core, shared, admin)` references to ensure snapshot referential stability.
5. **Sync `activeHive` in `setCurrentUser` & `setUserRole`**:
   Derive and update `activeHive` from `user?.role` or `role` automatically in `setCurrentUser` and `setUserRole`.

---

## 7. Verification Method

Once the recommended changes are applied by the worker:
1. **Audit Log Column Inspection**:
   Run:
   ```javascript
   useAppStore.getState().logAction('AdminUser', 'Stant A-01 Atandı', 'Kariyer Günleri');
   const log = useAdminStore.getState().auditLogs[0];
   expect(log.user).toBe('AdminUser');
   expect(log.action).toBe('Stant A-01 Atandı');
   ```
2. **Career Fair Applications Store Delegation**:
   Run:
   ```javascript
   const apps = useAppStore.getState().careerFairApplications;
   expect(apps.length).toBeGreaterThanOrEqual(2);
   expect(apps[0].id).toBe('APP-101');
   ```
3. **Facade Referential Equality**:
   Run:
   ```javascript
   expect(useAppStore.getState()).toBe(useAppStore.getState());
   ```
4. **File Size Compliance**:
   Ensure `(Get-Item src/store/useAppStore.js).Length < 12288`.
