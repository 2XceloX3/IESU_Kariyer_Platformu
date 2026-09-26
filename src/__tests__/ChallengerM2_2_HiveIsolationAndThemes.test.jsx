import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Component under test
import App from '../App';
import PublicUserProfile from '../components/PublicUserProfile';
import UserProfile from '../components/UserProfile';
import StudentHive from '../hives/student/StudentHive';
import AlumniHive from '../hives/alumni/AlumniHive';
import CompanyHive from '../hives/company/CompanyHive';
import AcademicHive from '../hives/academic/AcademicHive';

// Stores and contexts
import useAppStore from '../store/useAppStore';
import useStudentStore from '../hives/student/store/useStudentStore';
import useAlumniStore from '../hives/alumni/store/useAlumniStore';
import useCompanyStore from '../hives/company/store/useCompanyStore';
import useAcademicStore from '../hives/academic/store/useAcademicStore';

import { HiveProvider as StudentHiveProvider, useHiveContext as useStudentContext } from '../hives/student/HiveContext';
import { HiveProvider as AlumniHiveProvider, useHiveContext as useAlumniContext } from '../hives/alumni/HiveContext';
import { HiveProvider as CompanyHiveProvider, useHiveContext as useCompanyContext } from '../hives/company/HiveContext';
import { HiveProvider as AcademicHiveProvider, useHiveContext as useAcademicContext } from '../hives/academic/HiveContext';

// Mocks for Firebase & external dependencies
vi.mock('../utils/firebase', () => ({ auth: {}, db: {} }));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (_auth, callback) => {
    callback(null);
    return () => {};
  },
}));
vi.mock('firebase/firestore', () => ({ doc: vi.fn(), getDoc: vi.fn() }));

// Mock sub-views for App.test / Hive tests to prevent heavy DOM rendering
vi.mock('../components/LandingPage', () => ({ default: () => <div data-testid="landing-page">Landing Page</div> }));
vi.mock('../components/Login', () => ({ default: () => <div data-testid="login-page">Giriş Yap Login</div> }));
vi.mock('../components/Register', () => ({ default: () => <div data-testid="register-page">Kayıt Ol Register</div> }));
vi.mock('../components/ForgotPassword', () => ({ default: () => <div data-testid="forgot-password-page">Şifremi Unuttum</div> }));
vi.mock('../components/PublicNewsView', () => ({ default: () => <div data-testid="public-news-view">Haberler ve Duyurular</div> }));
vi.mock('../components/AdminFeed', () => ({ default: () => <div data-testid="admin-feed">👑 SÜPER YÖNETİCİ & KGM KONTROL PORTALI</div> }));
vi.mock('../components/AdminDashboard', () => ({ default: () => <div data-testid="admin-dashboard">Admin Dashboard CMS</div> }));

vi.mock('../components/StudentFeed', () => ({ default: () => <div data-testid="student-feed">Öğrenci Akışı</div> }));
vi.mock('../components/AlumniFeed', () => ({ default: () => <div data-testid="alumni-feed">Mezun Akışı</div> }));
vi.mock('../components/CompanyFeed', () => ({ default: () => <div data-testid="company-feed">Firma Akışı</div> }));
vi.mock('../components/AcademicStaffFeed', () => ({ default: () => <div data-testid="academic-feed">Akademik Akış</div> }));

describe('Challenger M2-2: Adversarial Hive Isolation, Route Protection & Invariant R5 Verification', () => {

  beforeEach(() => {
    window.localStorage.clear();
    useAppStore.setState({
      userRole: null,
      currentUser: null,
      selectedUserId: null,
      activePortalBranch: 'student',
      posts: [],
    });
    useStudentStore.getState().reset();
    useAlumniStore.getState().reset();
    useCompanyStore.getState().reset();
    useAcademicStore.getState().reset();
    if (typeof window.scrollTo !== 'function') {
      window.scrollTo = vi.fn();
    }
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // =========================================================================
  // 1. CRITICAL INVARIANT R5: THEME FOLLOWS VIEWER, NEVER PROFILE SUBJECT
  // =========================================================================
  describe('1. Critical Invariant R5: Cross-Hive Theme Persistence & Context Badge', () => {

    it('alumni viewer inspecting an academic profile renders emerald chrome and Alumni context badge', () => {
      render(
        <PublicUserProfile
          userId="ACAD-001"
          viewerHive="alumni"
          setView={vi.fn()}
          setSelectedUserId={vi.fn()}
          currentUser={{ id: 'ALU-001', role: 'alumni', name: 'Seda Çelik' }}
        />
      );

      // Context badge verification
      const badge = screen.getByTestId('hive-context-badge');
      expect(badge).toBeInTheDocument();
      expect(badge.textContent).toContain('You are viewing from Alumni portal');
      expect(badge.className).toContain('text-[#059669]');
      expect(badge.className).toContain('border-emerald-200');

      // Chrome header & branding
      expect(screen.getByText('İESÜ Mezunlar Portalı & Kariyer Ağı')).toBeInTheDocument();
      expect(screen.getByText("Mezunlar Portalı'na Dön")).toBeInTheDocument();

      // Profile subject content preserved (Academic info)
      expect(screen.getByText('Doç. Dr. Zeynep Çelik')).toBeInTheDocument();
      expect(screen.getByText('Bölüm Başkanı')).toBeInTheDocument();
    });

    it('student viewer inspecting an alumni profile renders red chrome (#990000) and Student context badge', () => {
      render(
        <PublicUserProfile
          userId="ALU-001"
          viewerHive="student"
          setView={vi.fn()}
          setSelectedUserId={vi.fn()}
          currentUser={{ id: 'STU-001', role: 'student', name: 'Alperen Yılmaz' }}
        />
      );

      // Context badge verification
      const badge = screen.getByTestId('hive-context-badge');
      expect(badge).toBeInTheDocument();
      expect(badge.textContent).toContain('You are viewing from Student portal');
      expect(badge.className).toContain('text-[#990000]');
      expect(badge.className).toContain('border-red-200');

      // Chrome header & branding
      expect(screen.getByText('Öğrenci Kariyer & Yetenek Portalı')).toBeInTheDocument();
      expect(screen.getByText("Öğrenci Portalı'na Dön")).toBeInTheDocument();

      // Profile subject content preserved (Alumni info)
      expect(screen.getByText(/Caner Öztürk|Seda Çelik/)).toBeInTheDocument();
      expect(screen.getByText(/Frontend Developer|Üretim ve Operasyon Yöneticisi|Üretim Planlama Uzmanı/)).toBeInTheDocument();
    });

    it('academic viewer inspecting a company profile renders violet chrome (#7c3aed) and Academic context badge', () => {
      render(
        <PublicUserProfile
          userId="CMP-001"
          viewerHive="academic"
          setView={vi.fn()}
          setSelectedUserId={vi.fn()}
          currentUser={{ id: 'ACAD-001', role: 'academic', name: 'Doç. Dr. Zeynep Çelik' }}
        />
      );

      const badge = screen.getByTestId('hive-context-badge');
      expect(badge).toBeInTheDocument();
      expect(badge.textContent).toContain('You are viewing from Academic portal');
      expect(badge.className).toContain('text-[#7c3aed]');
      expect(badge.className).toContain('border-violet-200');

      expect(screen.getByText('Akademik Kadro & Araştırma Portalı')).toBeInTheDocument();
      expect(screen.getByText("Akademik Portala Dön")).toBeInTheDocument();
    });

    it('company viewer inspecting a student profile renders corporate navy chrome (#1e3a5f) and Company context badge', () => {
      render(
        <PublicUserProfile
          userId="STU-001"
          viewerHive="company"
          setView={vi.fn()}
          setSelectedUserId={vi.fn()}
          currentUser={{ id: 'CMP-001', role: 'company', name: 'Tech Solutions A.Ş.' }}
        />
      );

      const badge = screen.getByTestId('hive-context-badge');
      expect(badge).toBeInTheDocument();
      expect(badge.textContent).toContain('You are viewing from Company portal');
      expect(badge.className).toContain('text-[#1e3a5f]');
      expect(badge.className).toContain('border-blue-200');

      expect(screen.getByText('Kurumsal İnsan Kaynakları Portalı')).toBeInTheDocument();
      expect(screen.getByText("Kurumsal Portala Dön")).toBeInTheDocument();
      expect(screen.getByText('Alperen Yılmaz')).toBeInTheDocument();
    });

    it('UserProfile component also adheres to viewerHive invariant and renders context badge', () => {
      render(
        <UserProfile
          userId="ACAD-001"
          viewerHive="alumni"
          setView={vi.fn()}
          setSelectedUserId={vi.fn()}
          currentUser={{ id: 'ALU-001', role: 'alumni', name: 'Seda Çelik' }}
        />
      );

      const badge = screen.getByTestId('hive-context-badge');
      expect(badge).toBeInTheDocument();
      expect(badge.textContent).toContain('You are viewing from Alumni portal');
      expect(badge.className).toContain('text-[#059669]');
      expect(badge.className).toContain('border-emerald-200');
    });
  });

  // =========================================================================
  // 2. ROUTE PROTECTION & HIVE SWITCHING IN App.jsx
  // =========================================================================
  describe('2. Route Protection & Hive Switching in App.jsx', () => {

    it('redirects unauthenticated users trying to access any ADMIN_CMS route to Login', async () => {
      const adminRoutes = ['/admin_cms', '/yonetim_konsolu', '/admin_console', '/audit_logs', '/idari_portal'];

      for (const route of adminRoutes) {
        const { unmount } = render(
          <MemoryRouter initialEntries={[route]}>
            <App />
          </MemoryRouter>
        );

        await waitFor(() => {
          expect(screen.getByTestId('login-page')).toBeInTheDocument();
        });

        expect(useAppStore.getState().userRole).not.toBe('admin');
        expect(window.localStorage.getItem('iesu_mock_user')).toBeNull();
        expect(window.localStorage.getItem('igu_mock_user')).toBeNull();
        unmount();
      }
    });

    it('renders PublicNewsView for public news routes when unauthenticated', async () => {
      const newsRoutes = ['/haberler', '/duyurular', '/etkinlikler', '/news', '/events'];

      for (const route of newsRoutes) {
        const { unmount } = render(
          <MemoryRouter initialEntries={[route]}>
            <App />
          </MemoryRouter>
        );

        await waitFor(() => {
          expect(screen.getByTestId('public-news-view')).toBeInTheDocument();
        });
        unmount();
      }
    });

    it('routes authenticated student to StudentHive', async () => {
      const studentUser = { id: 'STU-100', role: 'student', name: 'Ayşe Kaya' };
      window.localStorage.setItem('iesu_mock_user', JSON.stringify(studentUser));
      useAppStore.setState({ currentUser: studentUser, userRole: 'student' });

      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('student-feed')).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('routes authenticated alumni to AlumniHive', async () => {
      const alumniUser = { id: 'ALU-200', role: 'alumni', name: 'Mehmet Demir' };
      window.localStorage.setItem('iesu_mock_user', JSON.stringify(alumniUser));
      useAppStore.setState({ currentUser: alumniUser, userRole: 'alumni' });

      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('alumni-feed')).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('routes authenticated company to CompanyHive', async () => {
      const companyUser = { id: 'CMP-300', role: 'company', name: 'Aselsan IK' };
      window.localStorage.setItem('iesu_mock_user', JSON.stringify(companyUser));
      useAppStore.setState({ currentUser: companyUser, userRole: 'company' });

      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('company-feed')).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('routes authenticated academic to AcademicHive', async () => {
      const academicUser = { id: 'ACAD-400', role: 'academic', name: 'Prof. Dr. Ahmet Yılmaz' };
      window.localStorage.setItem('iesu_mock_user', JSON.stringify(academicUser));
      useAppStore.setState({ currentUser: academicUser, userRole: 'academic' });

      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('academic-feed')).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('routes authenticated admin to AdminDashboard when on ADMIN_CMS route', async () => {
      const adminUser = { id: 'admin_1513', role: 'admin', name: 'Süper Yönetici' };
      window.localStorage.setItem('iesu_mock_user', JSON.stringify(adminUser));
      useAppStore.setState({ currentUser: adminUser, userRole: 'admin' });

      render(
        <MemoryRouter initialEntries={['/admin_cms']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // 3. BOUNDARY INTEGRITY & ISOLATED CONTEXT TOKENS
  // =========================================================================
  describe('3. Boundary Integrity & Isolated Theme Tokens', () => {

    it('verifies student HiveContext provides #990000 red tokens', () => {
      let contextValue;
      const TestConsumer = () => {
        contextValue = useStudentContext();
        return <div>{contextValue.hiveColor}</div>;
      };

      render(
        <StudentHiveProvider>
          <TestConsumer />
        </StudentHiveProvider>
      );

      expect(contextValue.hiveColor).toBe('#990000');
      expect(contextValue.hiveName).toBe('student');
      expect(contextValue.hiveAccent).toBe('red');
    });

    it('verifies alumni HiveContext provides #059669 emerald tokens', () => {
      let contextValue;
      const TestConsumer = () => {
        contextValue = useAlumniContext();
        return <div>{contextValue.hiveColor}</div>;
      };

      render(
        <AlumniHiveProvider>
          <TestConsumer />
        </AlumniHiveProvider>
      );

      expect(contextValue.hiveColor).toBe('#059669');
      expect(contextValue.hiveName).toBe('alumni');
      expect(contextValue.hiveAccent).toBe('emerald');
    });

    it('verifies company HiveContext provides #1e3a5f blue tokens', () => {
      let contextValue;
      const TestConsumer = () => {
        contextValue = useCompanyContext();
        return <div>{contextValue.hiveColor}</div>;
      };

      render(
        <CompanyHiveProvider>
          <TestConsumer />
        </CompanyHiveProvider>
      );

      expect(contextValue.hiveColor).toBe('#1e3a5f');
      expect(contextValue.hiveName).toBe('company');
      expect(contextValue.hiveAccent).toBe('blue');
    });

    it('verifies academic HiveContext provides #7c3aed violet tokens', () => {
      let contextValue;
      const TestConsumer = () => {
        contextValue = useAcademicContext();
        return <div>{contextValue.hiveColor}</div>;
      };

      render(
        <AcademicHiveProvider>
          <TestConsumer />
        </AcademicHiveProvider>
      );

      expect(contextValue.hiveColor).toBe('#7c3aed');
      expect(contextValue.hiveName).toBe('academic');
      expect(contextValue.hiveAccent).toBe('violet');
    });
  });

  // =========================================================================
  // 4. VERIFICATION OF REMEDIATION: PublicUserProfile & Hive Root Navigation
  // =========================================================================
  describe('4. Verification: PublicUserProfile Navigation & Defensive Fallbacks', () => {
    it('demonstrates that PublicUserProfile displays "Kullanıcı Bulunamadı" when both userId prop and store selectedUserId are absent', () => {
      render(
        <PublicUserProfile
          viewerHive="student"
          setView={vi.fn()}
          setSelectedUserId={vi.fn()}
          currentUser={{ id: 'STU-001', role: 'student', name: 'Alperen Yılmaz' }}
        />
      );

      expect(screen.getByText('Kullanıcı Bulunamadı')).toBeInTheDocument();
      expect(screen.queryByTestId('hive-context-badge')).not.toBeInTheDocument();
    });

    it('verifies that StudentHive public_profile route renders target profile when selectedUserId is set in useAppStore', async () => {
      useAppStore.setState({ selectedUserId: 'ACAD-001' });

      render(
        <MemoryRouter initialEntries={['/public_profile']}>
          <StudentHive currentUser={{ id: 'STU-001', role: 'student', name: 'Alperen Yılmaz' }} />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Doç. Dr. Zeynep Çelik')).toBeInTheDocument();
      });
      expect(screen.getByTestId('hive-context-badge')).toBeInTheDocument();
      expect(screen.getByText(/You are viewing from Student portal/i)).toBeInTheDocument();
    });

    it('verifies that AlumniHive public_profile route renders target profile when selectedUserId is set in useAppStore', async () => {
      useAppStore.setState({ selectedUserId: 'ACAD-001' });

      render(
        <MemoryRouter initialEntries={['/public_profile']}>
          <AlumniHive currentUser={{ id: 'ALU-001', role: 'alumni', name: 'Seda Çelik' }} />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Doç. Dr. Zeynep Çelik')).toBeInTheDocument();
      });
      expect(screen.getByTestId('hive-context-badge')).toBeInTheDocument();
      expect(screen.getByText(/You are viewing from Alumni portal/i)).toBeInTheDocument();
    });

    it('verifies that CompanyHive forwards userId prop in public_profile route', async () => {
      useAppStore.setState({ selectedUserId: 'STU-001' });

      render(
        <MemoryRouter initialEntries={['/public_profile']}>
          <CompanyHive currentUser={{ id: 'CMP-001', role: 'company', name: 'Tech Solutions' }} />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Alperen Yılmaz')).toBeInTheDocument();
      });
      expect(screen.getByTestId('hive-context-badge')).toBeInTheDocument();
      expect(screen.getByText(/You are viewing from Company portal/i)).toBeInTheDocument();
    });

    it('verifies that user_profile in Hive roots forwards selectedUserId to UserProfile', async () => {
      useAppStore.setState({ selectedUserId: 'ALU-001' });

      render(
        <MemoryRouter initialEntries={['/user_profile']}>
          <StudentHive currentUser={{ id: 'STU-001', role: 'student', name: 'Alperen Yılmaz' }} />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Caner Öztürk|Seda Çelik/)).toBeInTheDocument();
      });
    });
  });
});
