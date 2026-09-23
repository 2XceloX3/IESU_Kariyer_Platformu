import { describe, it, expect, beforeEach, vi } from 'vitest';
import useAppStore, { getFacadeState, coreStore } from '../store/useAppStore';
import { useAdminStore } from '../brain/useAdminStore';
import { useSharedStore } from '../brain/useSharedStore';
import eventBus from '../brain/eventBus';

describe('Challenger M2-1: Store Facade Remediation Verification', () => {
  beforeEach(() => {
    coreStore.getState().reset();
    useSharedStore.getState().reset();
    useAdminStore.getState().reset();
  });

  describe('1. Audit Log Delegation and Parameter Mapping', () => {
    it('correctly maps user as 1st argument and action as 2nd argument in logAuditAction', () => {
      useAppStore.getState().logAction('AdminUser', 'Stant A-01 tahsis edildi', 'Kariyer Günleri', 'info');

      const logs = useAdminStore.getState().auditLogs;
      expect(logs.length).toBeGreaterThan(0);
      const latest = logs[0];
      expect(latest.user).toBe('AdminUser');
      expect(latest.action).toBe('Stant A-01 tahsis edildi');
      expect(latest.module).toBe('Kariyer Günleri');
      expect(latest.severity).toBe('info');
    });

    it('emits audit:logged on eventBus exactly once per logAction call', () => {
      const auditListener = vi.fn();
      const unsub = eventBus.on('audit:logged', auditListener);

      useAppStore.getState().logAction('Coordinator', 'Yeni etkinlik oluşturuldu', 'Etkinlikler', 'info');

      expect(auditListener).toHaveBeenCalledTimes(1);
      const payload = auditListener.mock.calls[0][0];
      expect(payload.user).toBe('Coordinator');
      expect(payload.action).toBe('Yeni etkinlik oluşturuldu');

      unsub();
    });
  });

  describe('2. Elimination of State Shadowing in coreStore', () => {
    it('delegates careerFairApplications reads and writes directly to useAdminStore', () => {
      const initialApps = useAdminStore.getState().careerFairApplications;
      expect(Array.isArray(initialApps)).toBe(true);
      expect(initialApps.length).toBeGreaterThan(0);

      // Facade read should return useAdminStore's applications, not empty array
      const facadeApps = useAppStore.getState().careerFairApplications;
      expect(facadeApps).toEqual(initialApps);

      // Facade setState should update useAdminStore
      const updated = [{ id: 'APP-CUSTOM', companyName: 'Roketsan' }];
      useAppStore.setState({ careerFairApplications: updated });
      expect(useAdminStore.getState().careerFairApplications).toEqual(updated);
      expect(useAppStore.getState().careerFairApplications).toEqual(updated);

      // Dynamic setter setCareerFairApplications should update useAdminStore
      const dynamicUpdate = [{ id: 'APP-DYNAMIC', companyName: 'Havelsan' }];
      useAppStore.getState().setCareerFairApplications(dynamicUpdate);
      expect(useAdminStore.getState().careerFairApplications).toEqual(dynamicUpdate);
      expect(useAppStore.getState().careerFairApplications).toEqual(dynamicUpdate);
    });

    it('delegates adminActiveTab reads and writes directly to useAdminStore', () => {
      expect(useAppStore.getState().adminActiveTab).toBe('feed');

      useAppStore.getState().setAdminActiveTab('career_fair');
      expect(useAdminStore.getState().adminActiveTab).toBe('career_fair');
      expect(useAppStore.getState().adminActiveTab).toBe('career_fair');
    });
  });

  describe('3. Snapshot Referential Stability for React 18/19', () => {
    it('returns the identical memoized Proxy instance when underlying stores have not changed', () => {
      const snapshot1 = getFacadeState();
      const snapshot2 = getFacadeState();
      expect(snapshot1).toBe(snapshot2);

      const state1 = useAppStore.getState();
      const state2 = useAppStore.getState();
      expect(state1).toBe(state2);
    });

    it('returns a new Proxy instance when any underlying store mutates', () => {
      const snapshot1 = getFacadeState();

      // Mutate core store
      useAppStore.getState().setUserBP(250);
      const snapshot2 = getFacadeState();
      expect(snapshot2).not.toBe(snapshot1);

      // Second read after mutation remains stable
      const snapshot3 = getFacadeState();
      expect(snapshot3).toBe(snapshot2);

      // Mutate admin store
      useAdminStore.getState().setAdminActiveTab('surveys');
      const snapshot4 = getFacadeState();
      expect(snapshot4).not.toBe(snapshot3);
    });
  });

  describe('4. activeHive Synchronization on User/Role Updates', () => {
    it('synchronizes activeHive when setCurrentUser is called with different roles', () => {
      expect(useAppStore.getState().activeHive).toBe('student');

      useAppStore.getState().setCurrentUser({ id: 'ALU-001', role: 'alumni', name: 'Seda' });
      expect(useAppStore.getState().activeHive).toBe('alumni');
      expect(useAppStore.getState().previousHive).toBe('student');

      useAppStore.getState().setCurrentUser({ id: 'CMP-001', role: 'company', name: 'Baykar' });
      expect(useAppStore.getState().activeHive).toBe('company');
      expect(useAppStore.getState().previousHive).toBe('alumni');

      useAppStore.getState().setCurrentUser({ id: 'ACAD-001', role: 'academic', name: 'Doç. Dr.' });
      expect(useAppStore.getState().activeHive).toBe('academic');
      expect(useAppStore.getState().previousHive).toBe('company');

      useAppStore.getState().setCurrentUser(null);
      expect(useAppStore.getState().currentUser).toBeNull();
      // activeHive remains at last valid hive
      expect(useAppStore.getState().activeHive).toBe('academic');
    });

    it('synchronizes activeHive when setUserRole is called', () => {
      useAppStore.getState().setUserRole('alumni');
      expect(useAppStore.getState().activeHive).toBe('alumni');

      useAppStore.getState().setUserRole('student');
      expect(useAppStore.getState().activeHive).toBe('student');
      expect(useAppStore.getState().previousHive).toBe('alumni');
    });
  });
});
