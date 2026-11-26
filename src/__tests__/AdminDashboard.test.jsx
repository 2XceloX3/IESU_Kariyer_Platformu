import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminDashboard from '../components/AdminDashboard';
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

  it('can navigate to alumni tab and does not expose closed student/academic tabs', () => {
    render(<AdminDashboard {...mockProps} />);
    
    const alumniCatBtn = screen.getByRole('button', { name: /Mezun & Firma Yönetimi/i });
    fireEvent.click(alumniCatBtn);

    expect(screen.queryByRole('button', { name: /Aktif Öğrenciler/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Akademik Kadro/i })).not.toBeInTheDocument();

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
    expect(screen.queryByRole('button', { name: /Kullanıcı Tipi/i })).not.toBeInTheDocument();
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

  it('authenticates active staff via hashed credentials and rejects wrong passwords', () => {
    const hash = hashStaffPassword('iesu2026');
    expect(hash).toMatch(/^shv1_/);
    expect(hash).not.toContain('iesu2026');

    const ok = verifyStaffCredentials('personel@iesu.edu.tr', 'iesu2026');
    expect(ok.ok).toBe(true);
    expect(ok.user?.role).toBe('staff');

    const bad = verifyStaffCredentials('personel@iesu.edu.tr', 'wrongpass');
    expect(bad.ok).toBe(false);
    expect(bad.reason).toBe('invalid_password');
  });
});
