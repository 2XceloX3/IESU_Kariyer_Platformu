import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminDashboard from '../components/AdminDashboard';
import UserProfile from '../components/UserProfile';
import StaffPortal from '../components/StaffPortal';
import TopProfileMenu from '../components/TopProfileMenu';
import { verifyStaffCredentials, hashStaffPassword } from '../utils/staffAuth';

describe('AdminDashboard Component', () => {
  const mockSetView = vi.fn();
  const mockSetSelectedUserId = vi.fn();

  const mockProps = {
    currentUser: { id: 'admin_1513', name: 'Kariyer Geliştirme Koordinatörlüğü', role: 'admin' },
    userRole: 'admin',
    setView: mockSetView,
    setSelectedUserId: mockSetSelectedUserId,
    posts: [], setPosts: vi.fn(),
    news: [], setNews: vi.fn(),
    announcements: [], setAnnouncements: vi.fn(),
    events: [], setEvents: vi.fn(),
    semCourses: [], setSemCourses: vi.fn(),
    surveys: [], setSurveys: vi.fn(),
    students: [], setStudents: vi.fn(),
    alumni: [], setAlumni: vi.fn(),
    companies: [], setCompanies: vi.fn(),
    jobs: [], setJobs: vi.fn(),
    featuredOpportunities: [], setFeaturedOpportunities: vi.fn(),
    mentorships: [], setMentorships: vi.fn(),
    voluntaryInternships: [], setVoluntaryInternships: vi.fn(),
    messages: [], setMessages: vi.fn(),
    applications: [], setApplications: vi.fn(),
    academicStaff: [], setAcademicStaff: vi.fn(),
    alumniCardApplications: [], setAlumniCardApplications: vi.fn(),
    groups: [], setGroups: vi.fn(),
    clubs: [], setClubs: vi.fn(),
    clubApplications: [], setClubApplications: vi.fn(),
    featureSurveys: true,
    featureAlumniCard: true,
    featureClubsShowcase: true,
    featureClubApplications: true,
    featureCareerCheckup: true,
    academicRole: 'super_admin'
  };

  it('renders without crashing', () => {
    render(<AdminDashboard {...mockProps} />);
    expect(screen.getByText(/Yönetici Paneli/i)).toBeInTheDocument();
  });

  it('exposes reactivated student and alumni tabs while keeping academic and clubs tabs strictly closed', () => {
    render(<AdminDashboard {...mockProps} />);
    
    const userCatBtn = screen.getByRole('button', { name: /Öğrenci, Mezun & Firma/i });
    fireEvent.click(userCatBtn);

    expect(screen.getAllByRole('button', { name: /Öğrenci/i }).length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: /Akademik Personel/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Öğrenci Kulüpleri/i })).not.toBeInTheDocument();

    const alumniTab = screen.getAllByRole('button', { name: /Mezun/i })[0];
    fireEvent.click(alumniTab);
    expect(screen.getAllByText(/Mezun/i).length).toBeGreaterThan(0);
  });

  it('can navigate to settings tab as super admin', () => {
    render(<AdminDashboard {...mockProps} />);
    
    const systemCatBtn = screen.getByRole('button', { name: /Sistem & Analiz/i });
    fireEvent.click(systemCatBtn);

    const settingsTab = screen.getByRole('button', { name: /Platform Ayarları/i });
    fireEvent.click(settingsTab);
    expect(screen.getAllByText(/Platform Ayarları/i).length).toBeGreaterThan(0);
  });

  it('enforces strict RBAC for staff users: hides superAdminOnly tabs and blocks direct initialTab bypass', () => {
    render(
      <AdminDashboard
        {...mockProps}
        currentUser={{ id: 'STAFF-001', name: 'KGM Çalışan Personel', role: 'staff', staffTitle: 'Kariyer Uzmanı' }}
        userRole="staff"
        academicRole="staff"
        initialTab="platform_ayarlari"
      />
    );

    expect(screen.getByText(/Personel Çalışma Paneli/i)).toBeInTheDocument();
    expect(screen.queryByText(/SÜPER YÖNETİCİ/i)).not.toBeInTheDocument();

    const systemCatBtn = screen.getByRole('button', { name: /Sistem & Analiz/i });
    fireEvent.click(systemCatBtn);

    expect(screen.queryByRole('button', { name: /Platform Ayarları/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Personel & Yetki Yönetimi/i })).not.toBeInTheDocument();
  });

  it('strictly isolates branches: does NOT embed Super Admin Portal / Decision Desk inside AdminDashboard', () => {
    render(<AdminDashboard {...mockProps} />);

    expect(screen.queryByText(/KGM Merkezi Yönetim Konsolu & Karar Masası/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Yönetim Konsolu & Karar Masası/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Süper Admin Merkezi/i })).not.toBeInTheDocument();

    expect(screen.getAllByRole('button', { name: /Genel Bakış/i }).length).toBeGreaterThan(0);
  });

  it('does NOT render bottom dock in AdminDashboard', () => {
    render(<AdminDashboard {...mockProps} />);
    expect(screen.queryByTitle(/Akış & Ana Sayfa/i)).not.toBeInTheDocument();
  });

  it('permanently removes 389834 covert message surveillance system (keyboard & modal triggers disabled)', () => {
    render(<AdminDashboard {...mockProps} />);

    const systemCatBtn = screen.getByRole('button', { name: /Sistem & Analiz/i });
    fireEvent.click(systemCatBtn);

    expect(screen.queryByRole('button', { name: /Mesajlaşma & İletişim Denetimi/i })).not.toBeInTheDocument();
    expect(screen.queryByTitle('Güvenlik Doğrulama Kodu')).not.toBeInTheDocument();

    // Typing old 389834 sequence must do nothing
    for (const char of '389834') {
      fireEvent.keyDown(window, { key: char });
    }

    expect(screen.queryByText(/GİZLİ İLETİŞİM DENETİM/i)).not.toBeInTheDocument();
    expect(screen.queryByText('GÜVENLİK YETKİ PROTOKOLÜ')).not.toBeInTheDocument();
  });

  it('authenticates active staff via username or email with salted hash and rejects wrong passwords', () => {
    const hash = hashStaffPassword('iesu2026');
    expect(hash).toMatch(/^shv1_/);
    expect(hash).not.toContain('iesu2026');

    const okEmail = verifyStaffCredentials('personel@iesu.edu.tr', 'iesu2026');
    expect(okEmail.ok).toBe(true);
    expect(okEmail.user?.role).toBe('staff');

    const okUsername = verifyStaffCredentials('kgm_personel', 'iesu2026');
    expect(okUsername.ok).toBe(true);
    expect(okUsername.user?.role).toBe('staff');
    expect(okUsername.user?.username).toBe('kgm_personel');

    const bad = verifyStaffCredentials('kgm_personel', 'wrongpass');
    expect(bad.ok).toBe(false);
    expect(bad.reason).toBe('invalid_password');

    const missing = verifyStaffCredentials('hayali_kullanici', 'iesu2026');
    expect(missing.ok).toBe(false);
    expect(missing.reason).toBe('not_found');
  });

  it('never impersonates Caner (ALU-001) or Trendyol (CMP-001) when Super Admin views own profile in Alumni or Company portal', () => {
    const adminUser = {
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Koordinatörlüğü',
      email: 'kariyer@iesu.edu.tr',
      role: 'admin',
      avatar: '/iesu-logo.svg'
    };

    const { unmount } = render(
      <UserProfile
        userId="admin_1513"
        viewerHive="alumni"
        previousView="alumni"
        currentUser={adminUser}
        setView={mockSetView}
        setSelectedUserId={mockSetSelectedUserId}
      />
    );
    expect(screen.getAllByText(/Kariyer Geliştirme Koordinatörlüğü/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Caner Öztürk/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/caner@mezun/i)).not.toBeInTheDocument();
    unmount();

    render(
      <UserProfile
        userId="admin_1513"
        viewerHive="company"
        previousView="company"
        currentUser={adminUser}
        setView={mockSetView}
        setSelectedUserId={mockSetSelectedUserId}
      />
    );
    expect(screen.getAllByText(/Kariyer Geliştirme Koordinatörlüğü/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/^Trendyol$/i)).not.toBeInTheDocument();
  });

  it('enforces granular staff allowedModules in StaffPortal, AdminDashboard, and removes Student/Alumni/Company switchers from TopProfileMenu', () => {
    const contentOnlyStaff = {
      id: 'STAFF-999',
      staffAccountId: '999',
      username: 'icerik_uzmani',
      name: 'İçerik Uzmanı Test',
      email: 'icerik@iesu.edu.tr',
      role: 'staff',
      staffTypeId: '2',
      staffTitle: 'İçerik Editörü',
      department: 'Kurumsal İletişim',
      allowedModules: ['content', 'messages']
    };

    // 1. StaffPortal renders bespoke staff workspace and ONLY granted modules
    const { unmount: unmountPortal } = render(
      <StaffPortal
        currentUser={contentOnlyStaff}
        userRole="staff"
        academicRole="staff"
        setView={mockSetView}
        setSelectedUserId={mockSetSelectedUserId}
      />
    );
    expect(screen.getByText(/KGM Personel Çalışma Portalı/i)).toBeInTheDocument();
    expect(screen.getByText(/İçerik, Haber & Etkinlik/i)).toBeInTheDocument();
    expect(screen.queryByText(/Öğrenci & Staj Yönetimi/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Firma & İş Birliği Protokolleri/i)).not.toBeInTheDocument();
    unmountPortal();

    // 2. TopProfileMenu for Staff MUST NOT expose Öğrenci / Mezun / Firma portal switchers
    const { unmount: unmountMenu } = render(
      <TopProfileMenu
        currentUser={contentOnlyStaff}
        userRole="staff"
        academicRole="staff"
        currentView="staff"
        setView={mockSetView}
        setSelectedUserId={mockSetSelectedUserId}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Profil Menüsünü Aç\/Kapat/i }));
    expect(screen.getByText(/Çalışma Masam/i)).toBeInTheDocument();
    expect(screen.getByText(/Yetkili Modüller/i)).toBeInTheDocument();
    expect(screen.queryByText(/Mezun Portalı/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Firma Portalı/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Öğrenci & Staj Portalı/i)).not.toBeInTheDocument();
    unmountMenu();

    // 3. AdminDashboard for content-only staff hides unauthorized categories/tabs (students, companies, alumni)
    render(
      <AdminDashboard
        {...mockProps}
        currentUser={contentOnlyStaff}
        userRole="staff"
        academicRole="staff"
        initialTab="companies"
      />
    );
    expect(screen.queryByRole('button', { name: /Öğrenci, Mezun & Firma/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Veri Havuzu & Excel/i })).not.toBeInTheDocument();
  });
});
