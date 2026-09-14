import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FloatingChatWidget from '../components/FloatingChatWidget';
import AdminFeed from '../components/AdminFeed';
import UserProfile from '../components/UserProfile';
import PublicUserProfile from '../components/PublicUserProfile';
import ConnectionSuggestions from '../components/ConnectionSuggestions';
import AlumniFeed from '../components/AlumniFeed';
import StudentFeed from '../components/StudentFeed';
import JobsAndInternships from '../components/JobsAndInternships';
import AdminOmniDock from '../components/AdminOmniDock';
import CompanyATSBoard from '../components/CompanyATSBoard';
import JobCreator from '../components/JobCreator';
import ResearchOSHub from '../components/ResearchOSHub';
import useAppStore from '../store/useAppStore';

describe('Branch Context Retention & Super Admin Root Command Center', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState({
      currentUser: null,
      userRole: 'admin',
      activePortalBranch: 'admin',
      posts: [],
      jobs: [
        { id: 'job_1', title: 'Frontend Developer', company: 'Aselsan', status: 'Onay Bekliyor' },
        { id: 'job_2', title: 'Backend Developer', company: 'Trendyol', status: 'Aktif' }
      ],
      students: [{ id: 's1', name: 'Ali' }, { id: 's2', name: 'Veli' }],
      alumni: [{ id: 'a1', name: 'Ayşe' }],
      companies: [{ id: 'c1', name: 'Aselsan' }],
      academicStaff: [{ id: 'ac1', name: 'Prof. Dr. Ahmet Yılmaz' }]
    });
  });

  it('preserves Academic Counseling leaf when viewing user_profile from Academic branch', () => {
    localStorage.setItem('iesu_mock_user', JSON.stringify({
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Merkezi',
      role: 'admin'
    }));
    localStorage.setItem('iesu_active_portal_branch', 'academic');
    useAppStore.setState({ activePortalBranch: 'academic' });

    // User is viewing profile while working in academic branch
    render(
      <FloatingChatWidget 
        setView={vi.fn()} 
        currentView="user_profile" 
        activeBranch="academic" 
      />
    );

    // Should retain the Academic counseling launcher, NOT jump to super admin evaluation pool!
    const launcherBtn = screen.getByTitle(/Resmî Danışmanlık & Randevu Talepleri/i);
    expect(launcherBtn).toBeInTheDocument();
    expect(launcherBtn.className).toContain('via-[#4C1D95]');
  });

  it('preserves Company Candidate Chat leaf when viewing profile_update from Company branch', () => {
    localStorage.setItem('iesu_mock_user', JSON.stringify({
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Merkezi',
      role: 'admin'
    }));
    localStorage.setItem('iesu_active_portal_branch', 'company');
    useAppStore.setState({ activePortalBranch: 'company' });

    render(
      <FloatingChatWidget 
        setView={vi.fn()} 
        currentView="profile_update" 
        activeBranch="company" 
      />
    );

    const launcherBtn = screen.getByTitle(/Aday Mesajları & İşe Alım Masası/i);
    expect(launcherBtn).toBeInTheDocument();
    expect(launcherBtn.className).toContain('via-[#0A2342]');
  });

  it('renders Super Admin Evaluation Pool when explicitly in Admin branch', () => {
    localStorage.setItem('iesu_mock_user', JSON.stringify({
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Merkezi',
      role: 'admin'
    }));
    localStorage.setItem('iesu_active_portal_branch', 'admin');
    useAppStore.setState({ activePortalBranch: 'admin' });

    render(
      <FloatingChatWidget 
        setView={vi.fn()} 
        currentView="admin" 
        activeBranch="admin" 
      />
    );

    const launcherBtn = screen.getByTitle(/KGM Merkezi Yönetim & Değerlendirme Masası/i);
    expect(launcherBtn).toBeInTheDocument();
    expect(launcherBtn.className).toContain('via-orange-500');
  });

  it('renders Super Admin Root Command Center (AdminFeed) with Bento deck and Branch Filters', () => {
    const mockUser = {
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Merkezi',
      role: 'admin'
    };

    render(
      <AdminFeed
        setView={vi.fn()}
        currentUser={mockUser}
        userRole="admin"
      />
    );

    // Redundant Bento deck removed per user request (accessible via floating widget)
    expect(screen.queryByText('Merkezi Yönetim Masası')).not.toBeInTheDocument();
    expect(screen.queryByText('Audit Logları')).not.toBeInTheDocument();

    // Portal Stream Filter Tabs
    expect(screen.getByText('👑 Tüm Portallar')).toBeInTheDocument();
    expect(screen.getByText('🎓 Öğrenci Portalı')).toBeInTheDocument();
    expect(screen.getByText('🎓 Mezun Portalı')).toBeInTheDocument();
    expect(screen.getByText('🏢 Firma & ATS')).toBeInTheDocument();
    expect(screen.getByText('🏛️ Akademik Portal')).toBeInTheDocument();

    // Click on Branch Filter
    fireEvent.click(screen.getByText('🎓 Öğrenci Portalı'));
    expect(screen.getByText(/Öğrenci portalında/i)).toBeInTheDocument();

    // KGM Master Talep & Onay Masası (Dual Intake)
    expect(screen.getByText(/KGM Master Talep & Onay Masası/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Firma İlan & Sponsorluk/i));
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
  });

  it('renders executive admin profile when admin views user_profile', () => {
    useAppStore.setState({ userRole: 'admin', activePortalBranch: 'admin' });
    const mockAdminUser = { id: 'admin_1513', name: 'Kariyer Geliştirme Merkezi', role: 'admin' };
    render(
      <UserProfile 
        userId="admin_1513"
        setView={vi.fn()}
        currentUser={mockAdminUser}
      />
    );

    expect(screen.getByText(/SÜPER YÖNETİCİ HESABI/i)).toBeInTheDocument();
    expect(screen.queryByText(/MEZUN PROFİLİ & KARİYER AĞI/i)).not.toBeInTheDocument();
  });

  it('navigates to user_profile and not profile_update when clicking profile in AlumniFeed', () => {
    useAppStore.setState({ userRole: 'alumni', activePortalBranch: 'alumni' });
    const mockAlumniUser = { id: 'ALU-001', name: 'Ayşe Yılmaz', role: 'alumni', department: 'Bilgisayar Mühendisliği' };
    const mockSetView = vi.fn();
    const mockSetSelectedUserId = vi.fn();

    render(
      <AlumniFeed 
        setView={mockSetView}
        setSelectedUserId={mockSetSelectedUserId}
        currentUser={mockAlumniUser}
        userRole="alumni"
      />
    );

    const viewProfileBtn = screen.getByRole('button', { name: /Mezun Profilimi Görüntüle/i });
    fireEvent.click(viewProfileBtn);

    expect(mockSetSelectedUserId).toHaveBeenCalledWith('ALU-001');
    expect(mockSetView).toHaveBeenCalledWith('user_profile');
    expect(mockSetView).not.toHaveBeenCalledWith('profile_update');
  });

  it('renders academic profile in owner mode without self-following', () => {
    useAppStore.setState({ userRole: 'academic', activePortalBranch: 'academic' });
    const mockAcadUser = { id: 'ACAD-001', name: 'Prof. Dr. Ahmet Yılmaz', role: 'academic' };
    render(
      <UserProfile 
        userId="ACAD-001"
        setView={vi.fn()}
        currentUser={mockAcadUser}
      />
    );

    expect(screen.getByText(/Profili Düzenle/i)).toBeInTheDocument();
    expect(screen.queryByText(/Hocayı Takip Et/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Resmî Danışmanlık & Randevu Talebi İlet/i)).not.toBeInTheDocument();
  });

  it('renders student profile in owner mode without self-following', () => {
    useAppStore.setState({ userRole: 'student', activePortalBranch: 'student' });
    const mockStudentUser = { id: 'STU-001', name: 'Alperen Yılmaz', role: 'student' };
    render(
      <UserProfile 
        userId="STU-001"
        setView={vi.fn()}
        currentUser={mockStudentUser}
      />
    );

    expect(screen.getByText(/Profili Düzenle/i)).toBeInTheDocument();
    expect(screen.getByText(/AI CV & Portfolyo/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Takip Et$/i })).not.toBeInTheDocument();
  });

  it('renders third-party student profile (e.g. from suggestions) in visitor mode with Takip Et and NO edit buttons', () => {
    useAppStore.setState({ 
      userRole: 'student', 
      activePortalBranch: 'student',
      students: [
        { id: 'STU-001', name: 'Alperen Yılmaz', role: 'student' },
        { id: 'STU-002', name: 'Zeynep Kaya', department: 'Bilgisayar Mühendisliği', role: 'student' }
      ]
    });
    const mockStudentUser = { id: 'STU-001', name: 'Alperen Yılmaz', role: 'student' };
    render(
      <UserProfile 
        userId="STU-002"
        setView={vi.fn()}
        currentUser={mockStudentUser}
      />
    );

    // Visitor mode: shows Follow button, does NOT show self-edit actions
    expect(screen.getByRole('button', { name: /Takip Et/i })).toBeInTheDocument();
    expect(screen.queryByText(/Profili Düzenle/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/AI CV & Portfolyo/i)).not.toBeInTheDocument();
  });

  it('renders third-party alumni profile from suggestions in visitor mode with Bağlantı Kur and NO MBS or edit buttons', () => {
    useAppStore.setState({ 
      userRole: 'student', 
      activePortalBranch: 'student',
      alumni: [
        { id: 'ALU-002', name: 'Seda Çelik', department: 'Endüstri Mühendisliği', role: 'alumni', company: 'Ford Otosan' }
      ]
    });
    const mockStudentUser = { id: 'STU-001', name: 'Alperen Yılmaz', role: 'student' };
    render(
      <UserProfile 
        userId="ALU-002"
        setView={vi.fn()}
        currentUser={mockStudentUser}
      />
    );

    // Visitor mode: shows connect button, does NOT show MBS or edit profile
    expect(screen.getByRole('button', { name: /Bağlantı Kur & Takip Et/i })).toBeInTheDocument();
    expect(screen.queryByText(/Mezun Bilgi Sistemi/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Profili Düzenle/i)).not.toBeInTheDocument();
  });

  it('renders third-party academic profile from suggestions in visitor mode with Hocayı Takip Et and NO edit buttons', () => {
    useAppStore.setState({ 
      userRole: 'student', 
      activePortalBranch: 'student',
      academicStaff: [
        { id: 'ACAD-002', name: 'Doç. Dr. Zeynep Çelik', department: 'Yazılım Mühendisliği', role: 'academic' }
      ]
    });
    const mockStudentUser = { id: 'STU-001', name: 'Alperen Yılmaz', role: 'student' };
    render(
      <UserProfile 
        userId="ACAD-002"
        setView={vi.fn()}
        currentUser={mockStudentUser}
      />
    );

    // Visitor mode: shows follow faculty and appointment request, does NOT show self-edit
    expect(screen.getByRole('button', { name: /Hocayı Takip Et/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Resmî Danışmanlık & Randevu Talebi İlet/i })).toBeInTheDocument();
    expect(screen.queryByText(/Profili Düzenle/i)).not.toBeInTheDocument();
  });

  it('routes to public_profile when clicking a suggestion in ConnectionSuggestions', () => {
    const mockSetView = vi.fn();
    const mockSetSelectedUserId = vi.fn();
    const mockUser = { id: 'admin_1513', name: 'KGM', email: 'kgm@esenyurt.edu.tr', role: 'admin' };

    useAppStore.setState({
      currentUser: mockUser,
      students: [
        { id: 'STU-001', name: 'Alperen Yılmaz', department: 'Yazılım Mühendisliği', role: 'student' }
      ]
    });

    render(
      <ConnectionSuggestions
        currentUser={mockUser}
        setView={mockSetView}
        setSelectedUserId={mockSetSelectedUserId}
        students={[{ id: 'STU-001', name: 'Alperen Yılmaz', department: 'Yazılım Mühendisliği', role: 'student' }]}
        alumni={[]}
        companies={[]}
        academicStaff={[]}
      />
    );

    const alperenCard = screen.getByText('Alperen Yılmaz');
    fireEvent.click(alperenCard);

    expect(mockSetSelectedUserId).toHaveBeenCalledWith('STU-001');
    expect(mockSetView).toHaveBeenCalledWith('public_profile');
    expect(mockSetView).not.toHaveBeenCalledWith('user_profile');
  });

  it('renders dedicated PublicUserProfile in 100% visitor mode with Takip Et, Send Message and NO self-edit controls', () => {
    const mockSetView = vi.fn();
    const mockViewer = { id: 'admin_1513', name: 'Kariyer Geliştirme Merkezi', role: 'student' };

    useAppStore.setState({
      students: [
        { id: 'STU-001', name: 'Alperen Yılmaz', department: 'Yazılım Mühendisliği', role: 'student', gpa: '3.84' }
      ]
    });

    render(
      <PublicUserProfile
        userId="STU-001"
        setView={mockSetView}
        setSelectedUserId={vi.fn()}
        previousView="student"
        currentUser={mockViewer}
        setDirectMessageUser={vi.fn()}
      />
    );

    expect(screen.getByText('Alperen Yılmaz')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Takip Et/i })).toBeInTheDocument();
    expect(screen.getAllByText(/İstanbul Esenyurt Üniversitesi/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/🎓 İESÜ Öğrenci Ağı • Üye Profili/i)).toBeInTheDocument();

    // CRITICAL: NEVER displays self-profile controls
    expect(screen.queryByText(/Profili Düzenle/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/AI CV & Portfolyo/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Kapak Değiştir/i)).not.toBeInTheDocument();
  });

  it('renders PublicUserProfile in Alumni branch with dedicated Emerald branding, leaf badge and Emerald dock', () => {
    const mockSetView = vi.fn();
    const mockViewer = { id: 'admin_1513', name: 'Kariyer Geliştirme Merkezi', role: 'admin' };

    useAppStore.setState({
      alumni: [
        { id: 'ALU-001', name: 'Seda Çelik', role: 'alumni', company: 'Ford Otosan', department: 'Endüstri Mühendisliği' }
      ]
    });

    render(
      <PublicUserProfile
        userId="ALU-001"
        setView={mockSetView}
        setSelectedUserId={vi.fn()}
        previousView="alumni"
        currentUser={mockViewer}
        setDirectMessageUser={vi.fn()}
      />
    );

    expect(screen.getByText('Seda Çelik')).toBeInTheDocument();
    expect(screen.getByText(/İESÜ Mezunlar Portalı & Kariyer Ağı/i)).toBeInTheDocument();
    expect(screen.getByText(/🎓 İESÜ Mezun Ağı • Üye Profili/i)).toBeInTheDocument();
    expect(screen.getAllByTitle(/Mezun Akışına Dön/i).length).toBeGreaterThan(0);
    expect(screen.getByTitle(/Mezun İş & Kariyer Olanakları/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Küresel Mezun Haritası & Ağı/i)).toBeInTheDocument();
  });

  it('renders PublicUserProfile in Academic branch with dedicated Purple branding, leaf badge and Purple dock', () => {
    const mockSetView = vi.fn();
    const mockViewer = { id: 'admin_1513', name: 'Kariyer Geliştirme Merkezi', role: 'admin' };

    useAppStore.setState({
      academicStaff: [
        { id: 'ACAD-001', name: 'Doç. Dr. Zeynep Çelik', role: 'academic', department: 'Yazılım Mühendisliği' }
      ]
    });

    render(
      <PublicUserProfile
        userId="ACAD-001"
        setView={mockSetView}
        setSelectedUserId={vi.fn()}
        previousView="academic"
        currentUser={mockViewer}
        setDirectMessageUser={vi.fn()}
      />
    );

    expect(screen.getByText('Doç. Dr. Zeynep Çelik')).toBeInTheDocument();
    expect(screen.getByText(/Akademik Kadro & Araştırma Portalı/i)).toBeInTheDocument();
    expect(screen.getByText(/🏛️ Akademik Kadro • Hoca Profili/i)).toBeInTheDocument();
    expect(screen.getAllByTitle(/Akademik Akışa Dön/i).length).toBeGreaterThan(0);
    expect(screen.getByTitle(/Araştırma OS Hub/i)).toBeInTheDocument();
  });

  it('renders PublicUserProfile in Company branch with dedicated Blue branding, leaf badge and Blue dock', () => {
    const mockSetView = vi.fn();
    const mockViewer = { id: 'admin_1513', name: 'Kariyer Geliştirme Merkezi', role: 'admin' };

    useAppStore.setState({
      companies: [
        { id: 'CMP-001', name: 'Trendyol', role: 'company', sector: 'E-Ticaret & Teknoloji' }
      ]
    });

    render(
      <PublicUserProfile
        userId="CMP-001"
        setView={mockSetView}
        setSelectedUserId={vi.fn()}
        previousView="company"
        currentUser={mockViewer}
        setDirectMessageUser={vi.fn()}
      />
    );

    expect(screen.getByText('Trendyol')).toBeInTheDocument();
    expect(screen.getByText(/Kurumsal İnsan Kaynakları Portalı/i)).toBeInTheDocument();
    expect(screen.getByText(/🏢 Akredite Kurumsal Partner/i)).toBeInTheDocument();
    expect(screen.getAllByTitle(/Kurumsal Firma Akışına Dön/i).length).toBeGreaterThan(0);
    expect(screen.getByTitle(/ATS Aday Takip Panosu/i)).toBeInTheDocument();
  });

  it('ensures handleBack strictly respects the active branch and never shortcuts to admin', () => {
    const mockSetView = vi.fn();
    const mockViewer = { id: 'admin_1513', name: 'Kariyer Geliştirme Merkezi', role: 'admin' };

    render(
      <PublicUserProfile
        userId="STU-001"
        setView={mockSetView}
        setSelectedUserId={vi.fn()}
        previousView="student"
        currentUser={mockViewer}
        setDirectMessageUser={vi.fn()}
      />
    );

    // Clicking top-left logo or dock home button should call handleBack and navigate strictly to 'student', NOT 'admin'
    const backTriggers = screen.getAllByTitle(/Öğrenci Akışına Dön/i);
    expect(backTriggers.length).toBeGreaterThan(0);
    fireEvent.click(backTriggers[0]);
    expect(mockSetView).toHaveBeenCalledWith('student');
    expect(mockSetView).not.toHaveBeenCalledWith('admin');
  });

  it('renders StudentFeed with 100% Student Crimson Dock and NEVER leaks AdminOmniDock or amber colors', () => {
    const mockStudentUser = { id: 'STU-001', name: 'Emre Şahin', role: 'student', department: 'Yazılım Mühendisliği' };
    useAppStore.setState({
      currentUser: mockStudentUser,
      userRole: 'student',
      activePortalBranch: 'student',
      posts: []
    });

    render(
      <StudentFeed
        setView={vi.fn()}
        setSelectedUserId={vi.fn()}
        currentUser={mockStudentUser}
        userRole="student"
      />
    );

    // Should render Student header and badge
    expect(screen.getByText(/ÖĞRENCİ AĞI & KARİYER PORTALI/i)).toBeInTheDocument();

    // Home button in dock should have crimson red bg (#990000)
    const homeBtn = screen.getByTitle('Akış');
    expect(homeBtn).toBeInTheDocument();
    expect(homeBtn.className).toContain('bg-[#990000]');

    // Search button in dock should be crimson gradient and NEVER contain amber-600
    const searchBtn = screen.getByTitle('Keşfet & Sosyal Ağ Portalı');
    expect(searchBtn).toBeInTheDocument();
    expect(searchBtn.className).toContain('from-red-900');
    expect(searchBtn.className).toContain('to-rose-700');
    expect(searchBtn.className).not.toContain('amber-600');

    // AdminOmniDock or amber admin elements should NOT be present
    expect(screen.queryByText(/👑 KGM MASTER/i)).not.toBeInTheDocument();
  });

  it('preserves Student Crimson theme in JobsAndInternships when accessed from Student branch even if previous session was admin', () => {
    const mockStudentUser = { id: 'STU-001', name: 'Emre Şahin', role: 'student', department: 'Yazılım Mühendisliği' };
    useAppStore.setState({
      currentUser: mockStudentUser,
      userRole: 'admin', // Stale role in storage
      previousView: 'student',
      activePortalBranch: 'student',
      jobs: [
        { id: 'job_test_1', title: 'Stajyer Yazılımcı', company: 'Havelsan', status: 'Aktif', type: 'STAJ' }
      ]
    });

    render(
      <JobsAndInternships
        setView={vi.fn()}
        currentUser={mockStudentUser}
        userRole="admin"
        jobs={[{ id: 'job_test_1', title: 'Stajyer Yazılımcı', company: 'Havelsan', status: 'Aktif', type: 'STAJ' }]}
      />
    );

    // Header title should be Crimson Red (#990000)
    const uniTitle = screen.getByText('İstanbul Esenyurt Üniversitesi');
    expect(uniTitle.className).toContain('text-[#990000]');
    expect(uniTitle.className).not.toContain('text-amber-800');

    // Badge should be Student Jobs Pool, NOT Admin Master
    expect(screen.getByText(/İŞ & STAJ OLANAKLARI HAVUZU/i)).toBeInTheDocument();
    expect(screen.queryByText(/👑 KGM MASTER İLAN & STAJ YÖNETİMİ/i)).not.toBeInTheDocument();

    // Side card and navbar should show student profile, NOT Super Admin Coordinator
    expect(screen.getAllByText('Emre Şahin').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/SÜPER YÖNETİCİ & KOORDİNATÖR/i)).not.toBeInTheDocument();

    // Dock search button should NOT have amber-600 gradient
    const dockSearchBtn = screen.getByTitle("Keşfet'e Dön");
    expect(dockSearchBtn.className).not.toContain('to-amber-600');
    expect(dockSearchBtn.className).toContain('to-rose-700');
  });

  it('renders dedicated Student profile without leaking Super Admin when opening user_profile from Student branch even if currentUser is admin', () => {
    useAppStore.setState({
      userRole: 'admin',
      activePortalBranch: 'student',
      previousView: 'student'
    });
    const mockAdminUser = { id: 'admin_1513', name: 'Kariyer Geliştirme Merkezi', role: 'admin' };

    render(
      <UserProfile
        userId="STU-001"
        previousView="student"
        currentUser={mockAdminUser}
        setView={vi.fn()}
      />
    );

    // Must show Student Profile with logged in user's name, NOT Admin executive portal
    expect(screen.getByText(/ÖĞRENCİ PORTALI/i)).toBeInTheDocument();
    expect(screen.getByText(/ÖĞRENCİ KARİYER PROFİLİ/i)).toBeInTheDocument();
    expect(screen.getAllByText(mockAdminUser.name).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/👑 KGM SÜPER YÖNETİCİ PORTALI/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Süper Yönetici & Koordinatör/i)).not.toBeInTheDocument();
  });

  it('renders dedicated Alumni profile without leaking Super Admin when opening user_profile from Alumni branch even if currentUser is admin', () => {
    useAppStore.setState({
      userRole: 'admin',
      activePortalBranch: 'alumni',
      previousView: 'alumni'
    });
    const mockAdminUser = { id: 'admin_1513', name: 'Kariyer Geliştirme Merkezi', role: 'admin' };

    render(
      <UserProfile
        userId="ALU-001"
        previousView="alumni"
        currentUser={mockAdminUser}
        setView={vi.fn()}
      />
    );

    // Must show Alumni Profile with logged in user's name, NOT Admin executive portal
    expect(screen.getByText(/MEZUN PROFİLİ & KARİYER AĞI/i)).toBeInTheDocument();
    expect(screen.getAllByText(mockAdminUser.name).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
    expect(screen.queryByText(/👑 KGM SÜPER YÖNETİCİ PORTALI/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Süper Yönetici & Koordinatör/i)).not.toBeInTheDocument();
  });

  it('recovers from alien admin_1513 ID and renders student profile when in student branch', () => {
    useAppStore.setState({
      userRole: 'admin',
      activePortalBranch: 'student',
      previousView: 'student'
    });
    const mockAdminUser = { id: 'admin_1513', name: 'Kariyer Geliştirme Merkezi', role: 'admin' };

    render(
      <UserProfile
        userId="admin_1513"
        previousView="student"
        currentUser={mockAdminUser}
        setView={vi.fn()}
      />
    );

    // Should gracefully route to Student profile with logged in user's name
    expect(screen.getByText(/ÖĞRENCİ PORTALI/i)).toBeInTheDocument();
    expect(screen.getAllByText(mockAdminUser.name).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/👑 KGM SÜPER YÖNETİCİ PORTALI/i)).not.toBeInTheDocument();
  });

  it('recovers from alien admin_1513 ID and renders alumni profile when in alumni branch', () => {
    useAppStore.setState({
      userRole: 'admin',
      activePortalBranch: 'alumni',
      previousView: 'alumni'
    });
    const mockAdminUser = { id: 'admin_1513', name: 'Kariyer Geliştirme Merkezi', role: 'admin' };

    render(
      <UserProfile
        userId="admin_1513"
        previousView="alumni"
        currentUser={mockAdminUser}
        setView={vi.fn()}
      />
    );

    // Should gracefully route to Alumni profile with logged in user's name
    expect(screen.getByText(/MEZUN PROFİLİ & KARİYER AĞI/i)).toBeInTheDocument();
    expect(screen.getAllByText(mockAdminUser.name).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/👑 KGM SÜPER YÖNETİCİ PORTALI/i)).not.toBeInTheDocument();
  });

  it('renders dedicated Academic profile with logged in user name when in academic branch', () => {
    useAppStore.setState({
      userRole: 'admin',
      activePortalBranch: 'academic',
      previousView: 'academic'
    });
    const mockAdminUser = { id: 'admin_1513', name: 'Kariyer Geliştirme Merkezi', role: 'admin' };

    render(
      <UserProfile
        userId="ACAD-001"
        previousView="academic"
        currentUser={mockAdminUser}
        setView={vi.fn()}
      />
    );

    expect(screen.getAllByText(mockAdminUser.name).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Akademik Özgeçmiş & Biyografi/i)).toBeInTheDocument();
    expect(screen.queryByText(/👑 KGM SÜPER YÖNETİCİ PORTALI/i)).not.toBeInTheDocument();
  });

  it('renders dedicated Company profile with logged in user name when in company branch', () => {
    useAppStore.setState({
      userRole: 'admin',
      activePortalBranch: 'company',
      previousView: 'company'
    });
    const mockAdminUser = { id: 'admin_1513', name: 'Kariyer Geliştirme Merkezi', role: 'admin' };

    render(
      <UserProfile
        userId="CMP-001"
        previousView="company"
        currentUser={mockAdminUser}
        setView={vi.fn()}
      />
    );

    expect(screen.getAllByText(mockAdminUser.name).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/İESÜ Akredite Kurumsal Partner/i)).toBeInTheDocument();
    expect(screen.queryByText(/👑 KGM SÜPER YÖNETİCİ PORTALI/i)).not.toBeInTheDocument();
  });

  it('renders complete 3-column layout (Navbar, Left, Center Explore, Right Live Summary) in AdminFeed when search tab is active', () => {
    const mockAdminUser = { id: 'admin_1513', name: 'Kariyer Geliştirme Merkezi', role: 'admin' };
    render(
      <AdminFeed
        setView={vi.fn()}
        currentUser={mockAdminUser}
        userRole="admin"
        initialTab="search"
      />
    );

    // 1. Top Navbar presence
    expect(screen.getByText(/👑 SÜPER YÖNETİCİ & KGM KONTROL PORTALI/i)).toBeInTheDocument();
    expect(screen.getByText(/Kariyer Geliştirme Merkezi \(KGM\)/i)).toBeInTheDocument();

    // 2. Left Column presence
    expect(screen.getByText(/SÜPER YÖNETİCİ & KOORDİNASYON MERKEZİ/i)).toBeInTheDocument();
    expect(screen.getByText(/Değerlendirme Masası/i)).toBeInTheDocument();

    // 3. Center Column with ExploreFeed
    expect(screen.getByText(/Keşfet & Sosyal Ağ/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Öğrenci, mezun, akademisyen veya konu ara.../i)).toBeInTheDocument();

    // 4. Right Column presence
    expect(screen.getByText(/Canlı Ekosistem Özeti/i)).toBeInTheDocument();
    expect(screen.getByText(/Yönetim Konsoluna Git/i)).toBeInTheDocument();
  });

  it('AdminOmniDock sets adminActiveTab to search and navigates to admin instead of naked explore', () => {
    const mockSetView = vi.fn();
    const mockSetActiveTab = vi.fn();
    useAppStore.setState({ activePortalBranch: 'admin' });

    render(
      <AdminOmniDock
        setView={mockSetView}
        setActiveTab={mockSetActiveTab}
        activeTab="feed"
        theme="amber"
      />
    );

    const searchBtn = screen.getByTitle(/Keşfet & Sosyal Ağ Portalı/i);
    fireEvent.click(searchBtn);

    expect(useAppStore.getState().adminActiveTab).toBe('search');
    expect(mockSetActiveTab).toHaveBeenCalledWith('search');
    expect(mockSetView).toHaveBeenCalledWith('admin');
    expect(mockSetView).not.toHaveBeenCalledWith('explore');
  });

  it('renders UserProfile in Super Admin branch with golden amber AdminOmniDock and no red buttons', () => {
    const mockSetView = vi.fn();
    const mockViewer = { id: 'admin_1513', name: 'Kariyer Geliştirme Merkezi', role: 'admin' };

    render(
      <UserProfile
        userId="admin_1513"
        setView={mockSetView}
        setSelectedUserId={vi.fn()}
        previousView="admin"
        currentUser={mockViewer}
        setDirectMessageUser={vi.fn()}
      />
    );

    // Should render AdminOmniDock
    expect(screen.getByTitle(/Akış & Ana Sayfa/i)).toBeInTheDocument();
    expect(screen.getByTitle(/İlan & Başvuru Havuzu/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Keşfet & Sosyal Ağ Portalı/i)).toBeInTheDocument();
    expect(screen.getByTitle(/KGM Yönetici Profili/i)).toBeInTheDocument();

    // Verify amber theme: check that dock container has amber styling
    const adminDock = screen.getByTitle(/Akış & Ana Sayfa/i).closest('.bg-white\\/95');
    expect(adminDock).toBeInTheDocument();
    expect(adminDock.className).toContain('border-amber-400/70');
  });

  it('renders UserProfile in Academic branch with dedicated purple dock (#4C1D95)', () => {
    const mockSetView = vi.fn();
    const mockAcademic = { id: 'acad_1', name: 'Doç. Dr. Zeynep Çelik', role: 'academic_staff' };
    useAppStore.setState({ activePortalBranch: 'academic', userRole: 'academic_staff' });

    render(
      <UserProfile
        userId="acad_1"
        setView={mockSetView}
        setSelectedUserId={vi.fn()}
        previousView="academic"
        currentUser={mockAcademic}
        setDirectMessageUser={vi.fn()}
      />
    );

    // Evrak & Staj Onayı
    expect(screen.getByTitle(/Evrak & Staj Onayı/i)).toBeInTheDocument();
    // Araştırma OS Hub
    expect(screen.getByTitle(/Araştırma OS Hub/i)).toBeInTheDocument();
    // Akademik Profilim
    expect(screen.getByTitle(/Akademik Profilim/i)).toBeInTheDocument();

    const academicDock = screen.getByTitle(/Evrak & Staj Onayı/i).closest('.bg-white\\/95');
    expect(academicDock).toBeInTheDocument();
    expect(academicDock.className).toContain('border-purple-200');
  });

  it('renders UserProfile in Company branch with dedicated navy dock (#0A2342)', () => {
    const mockSetView = vi.fn();
    const mockCompany = { id: 'cmp_1', name: 'Trendyol', role: 'company' };
    useAppStore.setState({ activePortalBranch: 'company', userRole: 'company' });

    render(
      <UserProfile
        userId="cmp_1"
        setView={mockSetView}
        setSelectedUserId={vi.fn()}
        previousView="company"
        currentUser={mockCompany}
        setDirectMessageUser={vi.fn()}
      />
    );

    // Yeni İlan Yayınla
    expect(screen.getByTitle(/Yeni İlan Yayınla/i)).toBeInTheDocument();
    // ATS Aday Takip Panosu
    expect(screen.getByTitle(/ATS Aday Takip Panosu/i)).toBeInTheDocument();
    // Firma Profilim
    expect(screen.getByTitle(/Firma Profilim/i)).toBeInTheDocument();

    const companyDock = screen.getByTitle(/Yeni İlan Yayınla/i).closest('.bg-white\\/95');
    expect(companyDock).toBeInTheDocument();
    expect(companyDock.className).toContain('border-blue-200');
  });

  it('renders CompanyATSBoard without text labels in the bottom dock and routes Home to company branch instead of admin', () => {
    const mockSetView = vi.fn();
    const adminUser = { id: 'admin_1513', name: 'Kariyer Geliştirme Merkezi', role: 'admin' };
    useAppStore.setState({ activePortalBranch: 'company', currentUser: adminUser });

    render(
      <CompanyATSBoard
        setView={mockSetView}
        currentUser={adminUser}
      />
    );

    // Verify header title shows Kariyer Geliştirme Merkezi
    expect(screen.getByText(/Kariyer Geliştirme Merkezi — İlan Başvuruları & ATS Aday Havuzu/i)).toBeInTheDocument();

    // Verify bottom dock exists
    const homeBtn = screen.getByTitle(/Kurumsal Akış & Ana Sayfaya Dön/i);
    expect(homeBtn).toBeInTheDocument();

    // Verify NO text names in bottom dock buttons (no "Yönetici Masası", no "Firma Portalı", no "ATS Kanban")
    const dockContainer = homeBtn.closest('.bg-white\\/95');
    expect(dockContainer).toBeInTheDocument();
    expect(dockContainer.textContent).toBe(''); // Pure icon buttons!

    // Click Home button in bottom dock
    fireEvent.click(homeBtn);

    // MUST navigate to 'company', NEVER to 'admin'
    expect(mockSetView).toHaveBeenCalledWith('company');
    expect(mockSetView).not.toHaveBeenCalledWith('admin');
    expect(useAppStore.getState().activePortalBranch).toBe('company');
  });

  it('routes logo click in CompanyATSBoard header to company branch instead of admin', () => {
    const mockSetView = vi.fn();
    const adminUser = { id: 'admin_1513', name: 'Kariyer Geliştirme Merkezi', role: 'admin' };
    useAppStore.setState({ activePortalBranch: 'company', currentUser: adminUser });

    render(
      <CompanyATSBoard
        setView={mockSetView}
        currentUser={adminUser}
      />
    );

    // Find header logo button
    const headerLogo = screen.getByTitle(/Firma Paneline Dön/i);
    fireEvent.click(headerLogo);

    // MUST navigate to 'company'
    expect(mockSetView).toHaveBeenCalledWith('company');
    expect(mockSetView).not.toHaveBeenCalledWith('admin');
    expect(useAppStore.getState().activePortalBranch).toBe('company');
  });

  it('renders JobCreator with institutional header, corporate hero, and icon-only dock routing to company', () => {
    const mockSetView = vi.fn();
    const companyUser = { id: 'cmp_1', name: 'Trendyol Tech', role: 'company' };
    useAppStore.setState({ activePortalBranch: 'company', currentUser: companyUser });

    render(
      <JobCreator
        setView={mockSetView}
        currentUser={companyUser}
      />
    );

    // Verify institutional header branding
    expect(screen.getByText(/Kurumsal İnsan Kaynakları & Yetenek Portalı/i)).toBeInTheDocument();
    expect(screen.getByText(/🏢 Yeni İlan & Yetenek Arama Masası/i)).toBeInTheDocument();

    // Verify hero banner
    expect(screen.getByText(/Yeni Kariyer & Staj İlanı Yayınlayın/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Trendyol Tech/i).length).toBeGreaterThanOrEqual(1);

    // Verify AI description button
    expect(screen.getByTitle(/İlan Başlığına Göre Otomatik Profesyonel Metin Oluştur/i)).toBeInTheDocument();

    // Verify live preview card
    expect(screen.getByText(/Canlı İlan Önizlemesi/i)).toBeInTheDocument();

    // Verify bottom dock: icon-only (no text labels)
    const homeDockBtn = screen.getByTitle(/Kurumsal Akış & Ana Sayfa/i);
    expect(homeDockBtn).toBeInTheDocument();

    const dockContainer = homeDockBtn.closest('.bg-white\\/95');
    expect(dockContainer).toBeInTheDocument();
    // Only avatar initials "TT", no button label strings like "Firma Portalı" or "Yeni İlan"
    expect(screen.queryByText(/Firma Portalı/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Yönetici Masası/i)).not.toBeInTheDocument();

    // Click Home dock button -> routes to company
    fireEvent.click(homeDockBtn);
    expect(mockSetView).toHaveBeenCalledWith('company');
    expect(useAppStore.getState().activePortalBranch).toBe('company');
  });

  it('renders ResearchOSHub with institutional purple header, academic branch badge, and dedicated 4-dock', () => {
    const mockSetView = vi.fn();
    const academicUser = {
      id: 'ACAD-TEST',
      name: 'Prof. Dr. Ayşe Yılmaz',
      role: 'academic',
      email: 'ayse@esenyurt.edu.tr'
    };

    useAppStore.setState({ activePortalBranch: 'academic', currentUser: academicUser, userRole: 'academic' });

    render(
      <ResearchOSHub 
        setView={mockSetView} 
        currentUser={academicUser} 
        userRole="academic" 
        setSelectedUserId={vi.fn()} 
      />
    );

    // Verify institutional header
    expect(screen.getAllByText(/İstanbul Esenyurt Üniversitesi/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Akademik Kadro & Bilimsel Araştırma Portalı/i)).toBeInTheDocument();
    expect(screen.getByText(/🏛️ Akademik Kadro • Research OS Hub/i)).toBeInTheDocument();

    // Verify top-right "Akademik Akışa Dön" button has been removed (handled via bottom dock and logo)
    expect(screen.queryByTitle(/^Akademik Akışa Dön$/i)).not.toBeInTheDocument();

    // Verify header logo routes to academic
    const headerLogoBtn = screen.getByTitle(/Akademik Kadro & Araştırma Portalı Akışına Dön/i);
    expect(headerLogoBtn).toBeInTheDocument();
    fireEvent.click(headerLogoBtn);
    expect(mockSetView).toHaveBeenCalledWith('academic');
    expect(useAppStore.getState().activePortalBranch).toBe('academic');

    // Verify dedicated 4'lü Mor Floating Dock
    const homeDockBtn = screen.getByTitle(/Akademik Akış & Ana Sayfa/i);
    const evrakDockBtn = screen.getByTitle(/Evrak & Staj Onayı/i);
    const researchHubDockBtn = screen.getByTitle(/Araştırma OS Hub/i);
    const profileDockBtn = screen.getByTitle(/Akademik Profilim/i);

    expect(homeDockBtn).toBeInTheDocument();
    expect(evrakDockBtn).toBeInTheDocument();
    expect(researchHubDockBtn).toBeInTheDocument();
    expect(profileDockBtn).toBeInTheDocument();

    // Verify clicking Home on dock routes to academic
    mockSetView.mockClear();
    fireEvent.click(homeDockBtn);
    expect(mockSetView).toHaveBeenCalledWith('academic');
    expect(useAppStore.getState().activePortalBranch).toBe('academic');

    // Verify clicking Staj & Evrak on dock routes to academic
    mockSetView.mockClear();
    fireEvent.click(evrakDockBtn);
    expect(mockSetView).toHaveBeenCalledWith('academic');
    expect(useAppStore.getState().activePortalBranch).toBe('academic');
  });

  it('opens detailed Lab Reservation modal, allows picking slot/date/project, and saves into store pool', () => {
    const mockSetView = vi.fn();
    const academicUser = {
      id: 'ACAD-PROF-1',
      name: 'Prof. Dr. Bahri Şahin',
      role: 'academic',
      department: 'Bilgisayar Mühendisliği',
      email: 'bahri.sahin@esenyurt.edu.tr'
    };

    useAppStore.setState({ 
      activePortalBranch: 'academic', 
      currentUser: academicUser, 
      userRole: 'academic',
      labReservations: []
    });

    render(
      <ResearchOSHub 
        setView={mockSetView} 
        currentUser={academicUser} 
        userRole="academic" 
        setSelectedUserId={vi.fn()} 
      />
    );

    // Switch to Labs tab
    const labsTabBtn = screen.getByRole('button', { name: /Ar-Ge Laboratuvar Rezervasyonu/i });
    fireEvent.click(labsTabBtn);

    // Find and click the first "Çalışma Saati Rezerve Et" button
    const bookBtns = screen.getAllByRole('button', { name: /Çalışma Saati Rezerve Et/i });
    expect(bookBtns.length).toBeGreaterThan(0);
    fireEvent.click(bookBtns[0]);

    // Modal should be open
    expect(screen.getByText(/Ar-Ge Laboratuvar Rezervasyon Formu/i)).toBeInTheDocument();

    // Fill project subject (required)
    const subjectInput = screen.getByPlaceholderText(/TÜBİTAK 1001 Kapsamında Derin Öğrenme Model Eğitimi/i);
    fireEvent.change(subjectInput, { target: { value: 'Büyük Dil Modelleri Çoklu Ajan Optimizasyonu' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Rezervasyon Talebini Yönetici Paneline Gönder/i });
    fireEvent.click(submitBtn);

    // Check store state: reservation should be recorded in labReservations
    const reservations = useAppStore.getState().labReservations;
    expect(reservations.length).toBe(1);
    expect(reservations[0].name).toBe('Prof. Dr. Bahri Şahin');
    expect(reservations[0].projectSubject).toBe('Büyük Dil Modelleri Çoklu Ajan Optimizasyonu');
    expect(reservations[0].status).toBe('Onay Bekliyor');
  });

  it('opens detailed Research Call application modal, allows entering credentials, and registers in researchCallApplications pool', () => {
    const mockSetView = vi.fn();
    const researcherUser = {
      id: 'STUDENT-RES-1',
      name: 'Mert Demir',
      role: 'student',
      department: 'Yazılım Mühendisliği',
      email: 'mert.demir@ogr.esenyurt.edu.tr'
    };

    useAppStore.setState({ 
      activePortalBranch: 'academic', 
      currentUser: researcherUser, 
      userRole: 'student',
      researchCallApplications: []
    });

    render(
      <ResearchOSHub 
        setView={mockSetView} 
        currentUser={researcherUser} 
        userRole="student" 
        setSelectedUserId={vi.fn()} 
      />
    );

    // Switch to Calls tab
    const callsTabBtn = screen.getByRole('button', { name: /Proje & Bursiyer Çağrıları/i });
    fireEvent.click(callsTabBtn);

    // Click "Araştırmacı Olarak Başvur"
    const applyBtns = screen.getAllByRole('button', { name: /Araştırmacı Olarak Başvur/i });
    expect(applyBtns.length).toBeGreaterThan(0);
    fireEvent.click(applyBtns[0]);

    // Modal should be open
    expect(screen.getByText(/Proje & Bursiyer Başvuru Formu/i)).toBeInTheDocument();

    // Fill Statement of Purpose (required)
    const motivationInput = screen.getByPlaceholderText(/Bu projede yer almayı neden istiyorsunuz\?/i);
    fireEvent.change(motivationInput, { target: { value: 'Projede dağıtık GPU optimizasyonu ve otonom navigasyon algoritmaları üzerine çalışmak istiyorum.' } });

    // Fill Role
    const roleInput = screen.getByPlaceholderText(/Yüksek Lisans Bursiyeri \/ Yazılım Araştırmacısı/i);
    fireEvent.change(roleInput, { target: { value: 'Derin Öğrenme Bursiyeri' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Başvuruyu Proje Yürütücüsü & Yönetici Paneline Gönder/i });
    fireEvent.click(submitBtn);

    // Verify store has the new application
    const applications = useAppStore.getState().researchCallApplications;
    expect(applications.length).toBe(1);
    expect(applications[0].applicantName).toBe('Mert Demir');
    expect(applications[0].appliedRole).toBe('Derin Öğrenme Bursiyeri');
    expect(applications[0].statementOfPurpose).toContain('dağıtık GPU optimizasyonu');
    expect(applications[0].status).toBe('Onay Bekliyor');
  });
});




