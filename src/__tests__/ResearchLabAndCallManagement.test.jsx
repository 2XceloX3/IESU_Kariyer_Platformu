import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import useAppStore from '../store/useAppStore';
import CMSDataPoolExport from '../components/admin/CMSDataPoolExport';
import ResearchOSHub from '../components/ResearchOSHub';

describe('Research Lab & Calls Management and Revision Workflow', () => {
  beforeEach(() => {
    const store = useAppStore.getState();
    store.labReservations = [
      {
        id: 'LR-101',
        labId: 'LAB-01',
        labName: 'Yapay Zeka & Derin Öğrenme Ar-Ge Lab',
        name: 'Doç. Dr. Selin Kaya',
        academicTitle: 'Doç. Dr.',
        department: 'Bilgisayar Mühendisliği',
        email: 'selin.kaya@esenyurt.edu.tr',
        date: '2026-09-15',
        timeSlot: '09:00 - 11:00 (Sabah Seansı)',
        projectSubject: 'Otonom Drone Algoritmaları',
        attendeeCount: 3,
        status: 'Onay Bekliyor',
        adminNote: '',
        customAnswers: { 'Etik Kurul Onayı': 'Mevcut' }
      }
    ];

    store.researchCallApplications = [
      {
        id: 'RCA-201',
        callId: 'CALL-101',
        callTitle: 'TÜBİTAK 1001 — Otonom İHA Sürüsü Derin Pekiştirmeli Öğrenme',
        lead: 'Prof. Dr. Bahri Şahin',
        applicantName: 'Mert Demir',
        applicantStatus: 'Yüksek Lisans Öğrencisi',
        department: 'Bilgisayar Mühendisliği',
        appliedRole: 'YL Bursiyeri (Derin Pekiştirmeli Öğrenme & Kontrol)',
        weeklyHours: '20 Saat / Hafta',
        status: 'Onay Bekliyor',
        adminNote: '',
        customAnswers: { 'GitHub': 'https://github.com/mertdemir' }
      }
    ];

    store.researchLabs = [
      {
        id: 'LAB-01',
        name: 'Yapay Zeka & Derin Öğrenme Ar-Ge Lab',
        location: 'J Blok 4. Kat / Lab 402',
        capacity: '25 Araştırmacı',
        equipment: '8x NVIDIA H100 Tensor Core GPU Sunucu',
        status: 'Aktif / Rezervasyona Açık'
      }
    ];

    store.researchCalls = [
      {
        id: 'CALL-101',
        title: 'TÜBİTAK 1001 — Otonom İHA Sürüsü Derin Pekiştirmeli Öğrenme',
        lead: 'Prof. Dr. Bahri Şahin',
        positions: '2 Doktora / YL Bursiyeri',
        deadline: '2026-10-15',
        budget: '18.500 ₺ / Ay',
        status: 'Aktif'
      }
    ];

    store.researchConfig = {
      timeSlots: [
        "09:00 - 11:00 (Sabah Seansı)",
        "11:30 - 13:30 (Öğle Seansı)"
      ],
      labCustomQuestions: [
        { id: 'q1', label: 'Etik Kurul İzni', type: 'select', options: ['Var', 'Gerekmiyor'], required: true }
      ],
      callCustomQuestions: [
        { id: 'cq1', label: 'GitHub / Portfolyo Linki', type: 'text', required: false }
      ]
    };
  });

  it('allows store CRUD operations on researchLabs and researchCalls', () => {
    const store = useAppStore.getState();

    // Add Lab
    store.addResearchLab({
      id: 'LAB-99',
      name: 'Robotik Test Laboratuvarı',
      location: 'A Blok Z-01',
      capacity: '10 Araştırmacı',
      equipment: 'Robot Kolu',
      status: 'Aktif / Rezervasyona Açık'
    });
    expect(useAppStore.getState().researchLabs.find(l => l.id === 'LAB-99')).toBeDefined();

    // Update Lab
    store.updateResearchLab({
      id: 'LAB-99',
      name: 'İleri Robotik Test Laboratuvarı',
      location: 'A Blok Z-01',
      capacity: '15 Araştırmacı',
      equipment: '2x Robot Kolu',
      status: 'Aktif / Rezervasyona Açık'
    });
    expect(useAppStore.getState().researchLabs.find(l => l.id === 'LAB-99').name).toBe('İleri Robotik Test Laboratuvarı');

    // Delete Lab
    store.deleteResearchLab('LAB-99');
    expect(useAppStore.getState().researchLabs.find(l => l.id === 'LAB-99')).toBeUndefined();

    // Add Call
    store.addResearchCall({
      id: 'CALL-999',
      title: 'Kuantum Hesaplama Projesi',
      lead: 'Dr. Berk Öztürk',
      positions: '1 Doktora Bursiyeri',
      deadline: '2026-12-01',
      budget: '22.000 ₺ / Ay',
      status: 'Aktif'
    });
    expect(useAppStore.getState().researchCalls.find(c => c.id === 'CALL-999')).toBeDefined();

    // Delete Call
    store.deleteResearchCall('CALL-999');
    expect(useAppStore.getState().researchCalls.find(c => c.id === 'CALL-999')).toBeUndefined();
  });

  it('updates lab reservation status with revision note and admin feedback', () => {
    const store = useAppStore.getState();

    store.updateLabReservationStatus('LR-101', 'Revize İstendi', 'Deney güvenlik protokol formu yüklenmelidir.');
    const updated = useAppStore.getState().labReservations.find(r => r.id === 'LR-101');

    expect(updated.status).toBe('Revize İstendi');
    expect(updated.adminNote).toBe('Deney güvenlik protokol formu yüklenmelidir.');
  });

  it('updates research call application status with interview status and note', () => {
    const store = useAppStore.getState();

    store.updateResearchCallApplicationStatus('RCA-201', 'Mülakata Çağrıldı', 'Pazartesi saat 14:00 online mülakat planlandı.');
    const updated = useAppStore.getState().researchCallApplications.find(a => a.id === 'RCA-201');

    expect(updated.status).toBe('Mülakata Çağrıldı');
    expect(updated.adminNote).toBe('Pazartesi saat 14:00 online mülakat planlandı.');
  });

  it('renders CMSDataPoolExport Lab management and configuration correctly', () => {
    render(<CMSDataPoolExport />);

    // Click on Ar-Ge Lab & Form Yönetimi subtab
    const manageLabsTab = screen.getByText(/Ar-Ge Lab & Form Yönetimi/i);
    fireEvent.click(manageLabsTab);

    // Verify Laboratuvar Kataloğu heading is rendered
    expect(screen.getByText(/Ar-Ge Laboratuvar Kataloğu & Rezervasyon Kriterleri/i)).toBeInTheDocument();

    // Verify existing lab name is shown
    expect(screen.getByText(/Yapay Zeka & Derin Öğrenme Ar-Ge Lab/i)).toBeInTheDocument();

    // Verify time slots are rendered
    expect(screen.getByText(/09:00 - 11:00 \(Sabah Seansı\)/i)).toBeInTheDocument();

    // Verify custom question is rendered
    expect(screen.getByText(/Etik Kurul İzni/i)).toBeInTheDocument();
  });

  it('renders CMSDataPoolExport Research Calls management and criteria correctly', () => {
    render(<CMSDataPoolExport />);

    // Click on Proje Çağrıları & Soruları tab
    const manageCallsTab = screen.getByText(/Proje Çağrıları & Soruları/i);
    fireEvent.click(manageCallsTab);

    // Verify header
    expect(screen.getByText(/Proje & Bursiyer Çağrıları ve Başvuru Soru Kriterleri/i)).toBeInTheDocument();

    // Verify existing call is listed
    expect(screen.getAllByText(/TÜBİTAK 1001 — Otonom İHA Sürüsü Derin Pekiştirmeli Öğrenme/i).length).toBeGreaterThan(0);

    // Verify custom question
    expect(screen.getByText(/GitHub \/ Portfolyo Linki/i)).toBeInTheDocument();
  });

  it('allows adding a new time slot in manage_labs', () => {
    render(<CMSDataPoolExport />);

    fireEvent.click(screen.getByText(/Ar-Ge Lab & Form Yönetimi/i));

    const slotInput = screen.getByPlaceholderText(/Örn: 19:00 - 21:00 \(Gece Seansı\)/i);
    fireEvent.change(slotInput, { target: { value: '19:00 - 21:00 (Akşam Seansı 2)' } });

    const addSlotBtn = screen.getByText(/➕ Seans Ekle/i);
    fireEvent.click(addSlotBtn);

    expect(useAppStore.getState().researchConfig.timeSlots).toContain('19:00 - 21:00 (Akşam Seansı 2)');
  });

  it('renders ResearchOSHub with revision banner when a reservation needs revision', () => {
    const store = useAppStore.getState();
    store.updateLabReservationStatus('LR-101', 'Revize İstendi', 'Lütfen katılımcı listesini güncelleyiniz.');

    const mockUser = {
      id: 'usr-selin',
      name: 'Doç. Dr. Selin Kaya',
      role: 'academic',
      title: 'Doç. Dr.',
      department: 'Bilgisayar Mühendisliği',
      email: 'selin.kaya@esenyurt.edu.tr'
    };

    render(<ResearchOSHub currentUser={mockUser} setView={() => {}} />);

    // Switch to Laboratuvar Rezervasyonu tab
    const labsTab = screen.getByRole('button', { name: /Ar-Ge Laboratuvar Rezervasyonu/i });
    fireEvent.click(labsTab);

    // Check that the revision warning appears
    expect(screen.getByText(/Yönetici Notu:/i)).toBeInTheDocument();
    expect(screen.getByText(/Lütfen katılımcı listesini güncelleyiniz./i)).toBeInTheDocument();
    expect(screen.getByText(/Revizeyi Tamamla & Gönder/i)).toBeInTheDocument();
  });
});
