import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudentClubPortal from '../components/StudentClubPortal';
import CMSClubs from '../components/admin/CMSClubs';
import { initialClubs, initialClubApplications } from '../data/mockClubsData';

describe('Student Clubs & SKS Governance Workflow Suite', () => {
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

  const mockRegularStudent = {
    id: 'STU-999',
    name: 'Ali Çetin',
    studentNo: '2024010555',
    tcKimlik: '12345678901',
    email: 'ali.cetin@ogr.esenyurt.edu.tr',
    role: 'student'
  };

  it('renders StudentClubPortal and displays rich clubs directory', () => {
    render(
      <StudentClubPortal 
        currentUser={mockRegularStudent}
        setView={vi.fn()}
      />
    );

    expect(screen.getByText(/Öğrenci Kulüpleri Portalı/i)).toBeInTheDocument();
    expect(screen.getByText(/İESÜ Yazılım ve İnovasyon Kulübü/i)).toBeInTheDocument();
  });

  it('opens club detail and ensures money amounts are NOT visible to students', () => {
    render(
      <StudentClubPortal 
        currentUser={mockRegularStudent}
        setView={vi.fn()}
      />
    );

    // Click on Yazılım Kulübü
    const clubCard = screen.getByText(/İESÜ Yazılım ve İnovasyon Kulübü/i);
    fireEvent.click(clubCard);

    // Detail page rendered
    expect(screen.getByText(/Kulüp Hakkında/i)).toBeInTheDocument();
    expect(screen.getByText(/SKS Etkinlik & Yer Talepleri/i)).toBeInTheDocument();

    // Switch to venue requests tab
    const venueTab = screen.getByText(/SKS Etkinlik & Yer Talepleri/i);
    fireEvent.click(venueTab);

    // Student should see venue requests, but NOT currency balance cards
    expect(screen.getByText(/SKS Etkinlik & Yer Tahsis Başvuruları/i)).toBeInTheDocument();
    expect(screen.queryByText(/45\.000 ₺/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/16\.500 ₺/i)).not.toBeInTheDocument();
  });

  it('blocks regular student from requesting venue/equipment and displays authorization notice', () => {
    render(
      <StudentClubPortal 
        currentUser={mockRegularStudent}
        setView={vi.fn()}
      />
    );

    // Click on Yazılım Kulübü
    fireEvent.click(screen.getByText(/İESÜ Yazılım ve İnovasyon Kulübü/i));

    // Regular student clicks "Etkinlik & Yer Tahsis Talebi"
    const reqButtons = screen.getAllByText(/Etkinlik & Yer Tahsis Talebi/i);
    fireEvent.click(reqButtons[0]);

    // Unauthorized notice should appear
    expect(screen.getByText(/Yetkili Yönetici Kısıtlaması/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Kulüp Başkanı/i).length).toBeGreaterThan(0);
  });

  it('allows authorized officer (President) to open SKS venue and equipment form', () => {
    render(
      <StudentClubPortal 
        currentUser={mockPresident}
        setView={vi.fn()}
      />
    );

    // Click on Yazılım Kulübü
    fireEvent.click(screen.getByText(/İESÜ Yazılım ve İnovasyon Kulübü/i));

    // President clicks "Etkinlik & Yer Tahsis Talebi"
    const reqButtons = screen.getAllByText(/Etkinlik & Yer Tahsis Talebi/i);
    fireEvent.click(reqButtons[0]);

    // SKS Venue form modal must open with venue dropdown and hours
    expect(screen.getByText(/SKS Daire Başkanlığı Mekan & Donanım Formu/i)).toBeInTheDocument();
    expect(screen.getByText(/Talep Edilen Yer \/ Salon/i)).toBeInTheDocument();
    expect(screen.getByText(/Başlangıç Saati/i)).toBeInTheDocument();
    expect(screen.getByText(/Bitiş Saati/i)).toBeInTheDocument();
    expect(screen.getByText(/Ses Sistemi & Kürsü Mikrofonu/i)).toBeInTheDocument();
  });

  it('opens detailed membership form asking for Student No and TC Kimlik', () => {
    render(
      <StudentClubPortal 
        currentUser={mockRegularStudent}
        setView={vi.fn()}
      />
    );

    // Click on Yazılım Kulübü
    fireEvent.click(screen.getByText(/İESÜ Yazılım ve İnovasyon Kulübü/i));

    // Click on "Kulübe Başvur & Katıl"
    const joinBtn = screen.getByText(/Kulübe Başvur & Katıl/i);
    fireEvent.click(joinBtn);

    // Modal with TC & Student No
    expect(screen.getByText(/Resmî Kulüp Üyelik Formu/i)).toBeInTheDocument();
    expect(screen.getByText(/T\.C\. Kimlik Numarası/i)).toBeInTheDocument();
    expect(screen.getByText(/Öğrenci Numarası/i)).toBeInTheDocument();
    expect(screen.getByText(/Sınıf Seviyesi/i)).toBeInTheDocument();
  });

  it('renders Instagram-style media post with music ambience and story highlights', () => {
    render(
      <StudentClubPortal 
        currentUser={mockPresident}
        setView={vi.fn()}
      />
    );

    // Click on Yazılım Kulübü
    fireEvent.click(screen.getByText(/İESÜ Yazılım ve İnovasyon Kulübü/i));

    // Media highlights & Instagram post
    expect(screen.getAllByText(/Hackathon/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Kulüp Medya & Etkinlik Akışı/i)).toBeInTheDocument();
    expect(screen.getByText(/Campus Synthwave & Tech Beats/i)).toBeInTheDocument();
  });

  it('CMSClubs renders 4th tab with complete member monitoring table and CSV export', () => {
    const mockSetClubs = vi.fn();
    const mockSetClubApps = vi.fn();

    render(
      <CMSClubs 
        clubs={initialClubs}
        setClubs={mockSetClubs}
        clubApplications={initialClubApplications}
        setClubApplications={mockSetClubApps}
        currentUser={{ role: 'admin' }}
      />
    );

    // Tab 4 must exist
    const membersTab = screen.getByText(/Kulüp Kadroları & Üye İzleme/i);
    expect(membersTab).toBeInTheDocument();

    // Click on Tab 4
    fireEvent.click(membersTab);

    // Table headers and student rows
    expect(screen.getByText(/Öğrenci No & TC/i)).toBeInTheDocument();
    expect(screen.getByText(/Kayıtlı Kulüp/i)).toBeInTheDocument();
    expect(screen.getByText(/CSV \/ Excel İndir/i)).toBeInTheDocument();

    // Search input exists
    const searchInput = screen.getByPlaceholderText(/İsim, No veya TC ile ara/i);
    expect(searchInput).toBeInTheDocument();

    // Filter by search
    fireEvent.change(searchInput, { target: { value: 'Mehmet Kerem' } });
    expect(screen.getByText(/Mehmet Kerem Yılmaz/i)).toBeInTheDocument();
  });

  it('hides floating bottom dock when any modal is opened to prevent collision and ensures action buttons are accessible', () => {
    render(
      <StudentClubPortal 
        currentUser={mockPresident}
        setView={vi.fn()}
      />
    );

    // Initial state in Discovery: Floating dock is visible
    expect(screen.getByTitle('Akış & Ana Sayfa')).toBeInTheDocument();

    // Open EK-1 New Club Modal
    const createBtn = screen.getByText(/Yeni Kulüp Kur \(EK-1\)/i);
    fireEvent.click(createBtn);

    // Floating dock must be hidden to prevent overlap
    expect(screen.queryByTitle('Akış & Ana Sayfa')).not.toBeInTheDocument();

    // Modal action buttons must be accessible in the fixed footer
    expect(screen.getByText(/Başvuruyu İlet \(EK-1\)/i)).toBeInTheDocument();
    const cancelBtn = screen.getByText('İptal');
    expect(cancelBtn).toBeInTheDocument();

    // Close modal
    fireEvent.click(cancelBtn);

    // Floating dock is restored
    expect(screen.getByTitle('Akış & Ana Sayfa')).toBeInTheDocument();
  });
});
