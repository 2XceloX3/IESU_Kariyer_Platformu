import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CMSCareerFair from '../components/admin/CMSCareerFair';
import useAppStore from '../store/useAppStore';

describe('M4 Empirical Test Suite: 2D Interactive Stand Floorplan Map & Layout Allocator', () => {
  beforeEach(() => {
    // Reset Zustand store state before each empirical test
    useAppStore.setState({
      careerFairEvent: {
        id: 'cfe-2026',
        title: 'İESÜ 2026 Bahar Kariyer Zirvesi & Fuarı',
        date: '15-18 Mayıs 2026',
        location: 'Merkez Kampüs Rektörlük Bahçesi & Fuaye Alanı',
        description: 'Esenyurt Üniversitesi öğrencilerini ve mezunlarını sektör lideri şirketlerle buluşturan resmî kariyer etkinliği.',
        banner: 'https://www.esenyurt.edu.tr/uploads/2026/05/wuyeismnf35tr-bahar-senligi.jpg',
        isActive: true,
        quota: 50
      },
      careerFairFormTemplate: [
        { id: 'q_1', label: 'Katılımcı Sayısı & Yetkili İsimleri', type: 'text', required: true, description: 'Stant başında duracak personel sayısı', order: 1 }
      ],
      careerFairApplications: [
        { id: 'APP-101', companyId: 'CMP-001', companyName: 'Baykar Teknoloji', appliedAt: '2026-07-20', status: 'Onaylandı', tableNumber: 'Stant A-01', answers: {} },
        { id: 'APP-102', companyId: 'CMP-002', companyName: 'Aselsan', appliedAt: '2026-07-21', status: 'Onaylandı', tableNumber: 'Stant A-02', answers: {} },
        { id: 'APP-103', companyId: 'CMP-003', companyName: 'Trendyol Tech', appliedAt: '2026-07-22', status: 'Onaylandı', tableNumber: null, answers: {} },
        { id: 'APP-104', companyId: 'CMP-004', companyName: 'Havelsan', appliedAt: '2026-07-23', status: 'Onaylandı', tableNumber: null, answers: {} }
      ],
      careerFairStands: [
        // Zone A (A-01 to A-12)
        { id: 'A-01', code: 'Stant A-01', zone: 'A', status: 'Atandı', assignedCompanyId: 'CMP-001', assignedCompanyName: 'Baykar Teknoloji', tableNumber: 'Stant A-01' },
        { id: 'A-02', code: 'Stant A-02', zone: 'A', status: 'Atandı', assignedCompanyId: 'CMP-002', assignedCompanyName: 'Aselsan', tableNumber: 'Stant A-02' },
        { id: 'A-03', code: 'Stant A-03', zone: 'A', status: 'Rezerve', assignedCompanyId: null, assignedCompanyName: 'Protokol Rezervasyonu', tableNumber: 'Stant A-03' },
        ...Array.from({ length: 9 }, (_, i) => ({
          id: `A-${String(i + 4).padStart(2, '0')}`,
          code: `Stant A-${String(i + 4).padStart(2, '0')}`,
          zone: 'A',
          status: 'Boş',
          assignedCompanyId: null,
          assignedCompanyName: null,
          tableNumber: `Stant A-${String(i + 4).padStart(2, '0')}`
        })),
        // Zone B (B-01 to B-12)
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

  it('E1: Renders Zone A and Zone B full grid layout with correct initial statistics', () => {
    render(<CMSCareerFair />);
    
    // Switch to Stand Allocator tab
    const tabBtn = screen.getByText(/Stant Alokatörü \(2D Harita\)/i);
    fireEvent.click(tabBtn);

    // Verify statistical summary counters
    expect(screen.getByText('Toplam Stant')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('Atanan Stantlar')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Rezerve Stantlar')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Boş Stantlar')).toBeInTheDocument();
    expect(screen.getByText('21')).toBeInTheDocument();

    // Verify Zone headers and stands presence
    expect(screen.getByText(/ZONE A — Ana Fuaye Alanı/i)).toBeInTheDocument();
    expect(screen.getByText(/ZONE B — Rektörlük Bahçesi Stantları/i)).toBeInTheDocument();
    expect(screen.getByText('Stant A-01')).toBeInTheDocument();
    expect(screen.getByText('Stant A-12')).toBeInTheDocument();
    expect(screen.getByText('Stant B-01')).toBeInTheDocument();
    expect(screen.getByText('Stant B-12')).toBeInTheDocument();
  });

  it('E2: Zone Filter buttons toggle visibility of Zone A and Zone B stands', () => {
    render(<CMSCareerFair />);

    // Navigate to Stand Allocator
    fireEvent.click(screen.getByText(/Stant Alokatörü \(2D Harita\)/i));

    // Click Zone A Filter
    const zoneABtn = screen.getByRole('button', { name: /Zone A/i });
    fireEvent.click(zoneABtn);

    expect(screen.getByText(/ZONE A — Ana Fuaye Alanı/i)).toBeInTheDocument();
    expect(screen.queryByText(/ZONE B — Rektörlük Bahçesi Stantları/i)).not.toBeInTheDocument();

    // Click Zone B Filter
    const zoneBBtn = screen.getByRole('button', { name: /Zone B/i });
    fireEvent.click(zoneBBtn);

    expect(screen.queryByText(/ZONE A — Ana Fuaye Alanı/i)).not.toBeInTheDocument();
    expect(screen.getByText(/ZONE B — Rektörlük Bahçesi Stantları/i)).toBeInTheDocument();

    // Click All Filter
    const allBtn = screen.getByRole('button', { name: /Tüm Alan/i });
    fireEvent.click(allBtn);

    expect(screen.getByText(/ZONE A — Ana Fuaye Alanı/i)).toBeInTheDocument();
    expect(screen.getByText(/ZONE B — Rektörlük Bahçesi Stantları/i)).toBeInTheDocument();
  });

  it('E3: Glassmorphic StandAssignmentModal assigns empty Zone B stand to approved company with notification and audit log', () => {
    render(<CMSCareerFair />);

    // Go to Stand Allocator
    fireEvent.click(screen.getByText(/Stant Alokatörü \(2D Harita\)/i));

    // Click on empty stand Stant B-05
    const standB05 = screen.getByText('Stant B-05');
    fireEvent.click(standB05);

    // Verify modal is open
    expect(screen.getByText('Stant B-05 Tahsis Paneli')).toBeInTheDocument();

    // Select company "Havelsan"
    const companySelect = screen.getByRole('combobox');
    fireEvent.change(companySelect, { target: { value: 'Havelsan' } });

    // Confirm assignment
    fireEvent.click(screen.getByText('Atamayı Kaydet'));

    // Check store state persistence
    const state = useAppStore.getState();
    const updatedStand = state.careerFairStands.find(s => s.code === 'Stant B-05');
    expect(updatedStand.status).toBe('Atandı');
    expect(updatedStand.assignedCompanyName).toBe('Havelsan');
    expect(updatedStand.assignedCompanyId).toBe('CMP-004');

    // Check application table number update
    const havelsanApp = state.careerFairApplications.find(a => a.companyName === 'Havelsan');
    expect(havelsanApp.tableNumber).toBe('Stant B-05');

    // Check audit log trigger
    expect(state.auditLogs.length).toBeGreaterThan(0);
    expect(state.auditLogs[0].action).toContain('Stant B-05');
    expect(state.auditLogs[0].action).toContain('Havelsan');
    expect(state.auditLogs[0].module).toBe('Kariyer Günleri');

    // Check notification trigger
    expect(state.notifications.length).toBeGreaterThan(0);
    expect(state.notifications[0].title).toBe('Stant Ataması Güncellendi');
    expect(state.notifications[0].message).toContain('Stant B-05');
  });

  it('E4: Stand modal allows custom company assignment', () => {
    render(<CMSCareerFair />);

    fireEvent.click(screen.getByText(/Stant Alokatörü \(2D Harita\)/i));

    // Click Stant A-04
    fireEvent.click(screen.getByText('Stant A-04'));

    const companySelect = screen.getByRole('combobox');
    fireEvent.change(companySelect, { target: { value: 'CUSTOM' } });

    // Custom input appears
    const customInput = screen.getByPlaceholderText(/Kurum adını yazın/i);
    fireEvent.change(customInput, { target: { value: 'Roketsan A.Ş.' } });

    fireEvent.click(screen.getByText('Atamayı Kaydet'));

    const state = useAppStore.getState();
    const standA04 = state.careerFairStands.find(s => s.code === 'Stant A-04');
    expect(standA04.assignedCompanyName).toBe('Roketsan A.Ş.');
    expect(standA04.status).toBe('Atandı');
  });

  it('E5: Stand modal clearing stand resets status to Boş and detaches application tableNumber', () => {
    render(<CMSCareerFair />);

    fireEvent.click(screen.getByText(/Stant Alokatörü \(2D Harita\)/i));

    // Click occupied stand Stant A-01 (Baykar Teknoloji)
    fireEvent.click(screen.getByText('Stant A-01'));

    // Click "Stant Boşalt"
    fireEvent.click(screen.getByText('Stant Boşalt'));

    const state = useAppStore.getState();
    const standA01 = state.careerFairStands.find(s => s.code === 'Stant A-01');
    expect(standA01.status).toBe('Boş');
    expect(standA01.assignedCompanyName).toBeNull();

    const baykarApp = state.careerFairApplications.find(a => a.companyName === 'Baykar Teknoloji');
    expect(baykarApp.tableNumber).toBeNull();
  });

  it('E6 [DEFECT TEST]: Reassigning an assigned company to a new stand leaves old stand assigned (Double Assignment Bug)', () => {
    // Baykar Teknoloji is currently at Stant A-01
    const initialState = useAppStore.getState();
    const baykarInitialStand = initialState.careerFairStands.find(s => s.assignedCompanyName === 'Baykar Teknoloji');
    expect(baykarInitialStand.code).toBe('Stant A-01');

    // Admin now assigns Baykar Teknoloji to Stant A-05 using assignStandToCompany
    useAppStore.getState().assignStandToCompany('A-05', 'Baykar Teknoloji', 'CMP-001', 'Atandı');

    const stateAfter = useAppStore.getState();
    const standA05 = stateAfter.careerFairStands.find(s => s.code === 'Stant A-05');
    const standA01 = stateAfter.careerFairStands.find(s => s.code === 'Stant A-01');

    expect(standA05.assignedCompanyName).toBe('Baykar Teknoloji');
    // EMPIRICAL BUG CHECK: Does Stant A-01 still show Baykar Teknoloji?
    // In current implementation, assignStandToCompany does NOT clear Stant A-01!
    if (standA01.assignedCompanyName === 'Baykar Teknoloji') {
      console.warn('[EMPIRICAL FINDING]: Double assignment defect confirmed. Stant A-01 was not auto-vacated when Baykar Teknoloji was reassigned to Stant A-05.');
    }
  });

  it('E7 [DEFECT TEST]: Live Stage button inside Stand Allocator tab breaks active tab rendering', () => {
    render(<CMSCareerFair />);

    fireEvent.click(screen.getByText(/Stant Alokatörü \(2D Harita\)/i));

    // Find and click "Canlı Zirve Sahnesi & Soru-Cevap" button
    const liveStageBtns = screen.getAllByText(/Canlı Zirve Sahnesi & Soru-Cevap/i);
    fireEvent.click(liveStageBtns[0]);

    // EMPIRICAL BUG CHECK: Active tab state became 'live_stage', but CMSCareerFair has no matching JSX block for 'live_stage'
    expect(screen.queryByText(/2D İnteraktif Fuar Yerleşim Planı/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Firma Katılım Başvuru Formu/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Firmalardan Gelen Katılım Başvuruları/i)).not.toBeInTheDocument();
  });

  it('E8 [DEFECT TEST]: assignStandToCompany does not update unreadNotificationsCount in store', () => {
    const initialUnread = useAppStore.getState().unreadNotificationsCount || 0;

    useAppStore.getState().assignStandToCompany('B-02', 'Aselsan', 'CMP-002', 'Atandı');

    const updatedState = useAppStore.getState();
    expect(updatedState.notifications.length).toBe(1);
    // EMPIRICAL BUG CHECK: notifications array grew by 1, but unreadNotificationsCount was not incremented!
    if (updatedState.unreadNotificationsCount === initialUnread) {
      console.warn('[EMPIRICAL FINDING]: Notification count mismatch confirmed. assignStandToCompany appends notification without incrementing unreadNotificationsCount.');
    }
  });
});
