import { describe, it, expect, beforeEach } from 'vitest';
import useAppStore from '../store/useAppStore';

describe('M4 Empirical Stress & State Edge Cases: 2D Floorplan & Store Allocator', () => {
  beforeEach(() => {
    useAppStore.setState({
      careerFairApplications: [
        { id: 'APP-101', companyId: 'CMP-001', companyName: 'Baykar Teknoloji', status: 'Onaylandı', tableNumber: 'Stant A-01' },
        { id: 'APP-102', companyId: 'CMP-002', companyName: 'Aselsan', status: 'Onaylandı', tableNumber: 'Stant A-02' },
        { id: 'APP-103', companyId: 'CMP-003', companyName: 'Havelsan', status: 'Onaylandı', tableNumber: null }
      ],
      careerFairStands: [
        { id: 'A-01', code: 'Stant A-01', zone: 'A', status: 'Atandı', assignedCompanyId: 'CMP-001', assignedCompanyName: 'Baykar Teknoloji', tableNumber: 'Stant A-01' },
        { id: 'A-02', code: 'Stant A-02', zone: 'A', status: 'Atandı', assignedCompanyId: 'CMP-002', assignedCompanyName: 'Aselsan', tableNumber: 'Stant A-02' },
        ...Array.from({ length: 10 }, (_, i) => ({
          id: `A-${String(i + 3).padStart(2, '0')}`,
          code: `Stant A-${String(i + 3).padStart(2, '0')}`,
          zone: 'A',
          status: 'Boş',
          assignedCompanyId: null,
          assignedCompanyName: null,
          tableNumber: `Stant A-${String(i + 3).padStart(2, '0')}`
        })),
        ...Array.from({ length: 12 }, (_, i) => ({
          id: `B-${String(i + 1).padStart(2, '0')}`,
          code: `Stant B-${String(i + 1).padStart(2, '0')}`,
          zone: 'B',
          status: 'Boş',
          assignedCompanyId: null,
          assignedCompanyName: null,
          tableNumber: `Stant B-${String(i + 1).padStart(2, '0')}`
        }))
      ],
      notifications: [],
      unreadNotificationsCount: 0,
      auditLogs: []
    });
  });

  it('S1: High volume sequential stand allocations (Zone A & Zone B full saturation)', () => {
    const store = useAppStore.getState();

    // Assign 20 companies to stands sequentially
    for (let i = 1; i <= 12; i++) {
      const standId = `A-${String(i).padStart(2, '0')}`;
      const companyName = `Company A-${i}`;
      store.assignStandToCompany(standId, companyName, `CMP-A${i}`, 'Atandı');
    }

    for (let i = 1; i <= 8; i++) {
      const standId = `B-${String(i).padStart(2, '0')}`;
      const companyName = `Company B-${i}`;
      store.assignStandToCompany(standId, companyName, `CMP-B${i}`, 'Atandı');
    }

    const state = useAppStore.getState();
    const assignedA = state.careerFairStands.filter(s => s.zone === 'A' && s.status === 'Atandı');
    const assignedB = state.careerFairStands.filter(s => s.zone === 'B' && s.status === 'Atandı');

    expect(assignedA.length).toBe(12);
    expect(assignedB.length).toBe(8);
    expect(state.auditLogs.length).toBe(20);
    expect(state.notifications.length).toBe(20);
  });

  it('S2: Rapid reallocation and clearing of the same stand', () => {
    const store = useAppStore.getState();

    // Rapid state changes on Stant B-01
    store.assignStandToCompany('B-01', 'Company 1', 'CMP-1', 'Atandı');
    store.assignStandToCompany('B-01', 'Company 2', 'CMP-2', 'Rezerve');
    store.assignStandToCompany('B-01', null, null, 'Boş');

    const state = useAppStore.getState();
    const standB01 = state.careerFairStands.find(s => s.code === 'Stant B-01');

    expect(standB01.status).toBe('Boş');
    expect(standB01.assignedCompanyName).toBeNull();
    expect(state.auditLogs.length).toBe(3);
  });

  it('S3: Audit log capping at 100 entries under heavy usage', () => {
    const store = useAppStore.getState();

    // Perform 120 actions
    for (let i = 0; i < 120; i++) {
      store.assignStandToCompany('A-04', `Company ${i}`, `CMP-${i}`, 'Atandı');
    }

    const state = useAppStore.getState();
    expect(state.auditLogs.length).toBe(100);
    expect(state.notifications.length).toBe(50); // notifications cap is 50
  });

  it('S4: Defensive handling of undefined state in assignStandToCompany', () => {
    useAppStore.setState({
      careerFairStands: undefined,
      careerFairApplications: undefined,
      auditLogs: undefined,
      notifications: undefined
    });

    expect(() => {
      useAppStore.getState().assignStandToCompany('A-01', 'Test Corp', 'CMP-99', 'Atandı');
    }).not.toThrow();
  });
});
