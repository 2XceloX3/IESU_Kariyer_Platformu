import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudentClubPortal from '../components/StudentClubPortal';

describe('StudentClubPortal Ticketing, Tasks and KGB Integration Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPresident = {
    id: 'STU-001',
    name: 'Mehmet Kerem Yılmaz',
    studentNo: '2023010482',
    tcKimlik: '39281749102',
    email: 'kerem.yilmaz@ogr.esenyurt.edu.tr',
    role: 'student'
  };

  const mockStudent = {
    id: 'STU-777',
    name: 'Zehra Arslan',
    studentNo: '2024010888',
    tcKimlik: '98765432101',
    email: 'zehra.arslan@ogr.esenyurt.edu.tr',
    role: 'student'
  };

  it('renders smart category pills and filters clubs accordingly', () => {
    render(
      <StudentClubPortal 
        currentUser={mockStudent}
        setView={vi.fn()}
      />
    );

    // Category pills exist
    expect(screen.getByText('Tümü')).toBeInTheDocument();
    expect(screen.getByText('Bilim & Teknoloji')).toBeInTheDocument();
    expect(screen.getByText('Girişimcilik & İnovasyon')).toBeInTheDocument();
    expect(screen.getByText('Kültür & Sanat')).toBeInTheDocument();

    // KGB badge in directory card
    const kgbBadges = screen.getAllByText(/KGB \+15 Puan/i);
    expect(kgbBadges.length).toBeGreaterThan(0);
  });

  it('allows student to register for an event, generates QR ticket pass with +5 KGB points', async () => {
    render(
      <StudentClubPortal 
        currentUser={mockStudent}
        setView={vi.fn()}
      />
    );

    // Open Yazılım Kulübü
    fireEvent.click(screen.getByText(/İESÜ Yazılım ve İnovasyon Kulübü/i));

    // Switch to Events tab
    const eventsTab = screen.getByText(/Etkinlikler/i);
    fireEvent.click(eventsTab);

    // Register button exists with +5 KGB
    const registerBtns = screen.getAllByText(/Bilet Al & Kaydol/i);
    expect(registerBtns.length).toBeGreaterThan(0);

    // Click register
    fireEvent.click(registerBtns[0]);

    // Digital Ticket Modal must pop up
    expect(screen.getByText(/Resmî Etkinlik Giriş Kartı/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Zehra Arslan/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/2024010888/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/\+5 KGB Transkript Katkısı/i)).toBeInTheDocument();
    expect(screen.getByText(/Kapıda görevli personel veya turnike tarafından okutunuz/i)).toBeInTheDocument();

    // Close ticket modal
    fireEvent.click(screen.getByText('Tamam'));
    expect(screen.queryByText(/Kapıda görevli personel veya turnike tarafından okutunuz/i)).not.toBeInTheDocument();

    // Button state changes to "QR Giriş Biletim"
    expect(screen.getByText(/QR Giriş Biletim/i)).toBeInTheDocument();
  });

  it('renders Tasks & Team Workspace tab and allows claiming a task for +10 KGB points', () => {
    render(
      <StudentClubPortal 
        currentUser={mockStudent}
        setView={vi.fn()}
      />
    );

    // Open Yazılım Kulübü
    fireEvent.click(screen.getByText(/İESÜ Yazılım ve İnovasyon Kulübü/i));

    // Switch to Tasks tab
    const tasksTab = screen.getByText(/Görev & Ekip Masası/i);
    fireEvent.click(tasksTab);

    // Task board title
    expect(screen.getByText(/Kulüp İçi Görev & Ekip Masası/i)).toBeInTheDocument();
    expect(screen.getByText(/İESÜ Hackathon 2026 Ana Sahne Ses & Projeksiyon Provası/i)).toBeInTheDocument();

    // Claim an unassigned task
    const claimBtns = screen.getAllByText(/Görevi Üstlen/i);
    expect(claimBtns.length).toBeGreaterThan(0);
    fireEvent.click(claimBtns[0]);

    // Claimed task reflects user assignment
    expect(screen.getByText(/Siz Üstlendiniz/i)).toBeInTheDocument();
  });

  it('provides quick cockpit navigation button for authorized officers to club admin panel', () => {
    const mockSetView = vi.fn();

    render(
      <StudentClubPortal 
        currentUser={mockPresident}
        setView={mockSetView}
      />
    );

    // Open Yazılım Kulübü
    fireEvent.click(screen.getByText(/İESÜ Yazılım ve İnovasyon Kulübü/i));

    // President sees "Kulüp Yönetim Masası"
    const cockpitBtn = screen.getByText(/Kulüp Yönetim Masası/i);
    expect(cockpitBtn).toBeInTheDocument();

    // Click cockpit button
    fireEvent.click(cockpitBtn);
    expect(mockSetView).toHaveBeenCalledWith('club_admin');
  });
});
