import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminDashboard from '../components/AdminDashboard';

describe('AdminDashboard Component', () => {
  const mockSetView = vi.fn();
  const mockSetSelectedUserId = vi.fn();

  const mockProps = {
    currentUser: { id: 'admin1', name: 'Admin User' },
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

  it('can navigate to students tab', () => {
    render(<AdminDashboard {...mockProps} />);
    
    const userCategoryBtn = screen.getByRole('button', { name: /Kullanıcı Yönetimi/i });
    fireEvent.click(userCategoryBtn);

    const studentsTab = screen.getAllByRole('button', { name: /Öğrenci/i })[0];
    fireEvent.click(studentsTab);
    expect(screen.getAllByText(/Aktif Öğrenciler|Öğrenci Listesi/i).length).toBeGreaterThan(0);
  });

  it('can navigate to settings tab', () => {
    render(<AdminDashboard {...mockProps} />);
    
    const systemCatBtn = screen.getByRole('button', { name: /Sistem & Analiz/i });
    fireEvent.click(systemCatBtn);

    const settingsTab = screen.getByRole('button', { name: /Platform Ayarları/i });
    fireEvent.click(settingsTab);
    expect(screen.getAllByText(/Platform Ayarları/i).length).toBeGreaterThan(0);
  });

  it('strictly isolates branches: does NOT embed Super Admin Portal / Decision Desk inside AdminDashboard', () => {
    render(<AdminDashboard {...mockProps} />);

    // Must NOT contain the Super Admin Karar Masası / Console inside CMS tabs
    expect(screen.queryByText(/KGM Merkezi Yönetim Konsolu & Karar Masası/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Yönetim Konsolu & Karar Masası/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Süper Admin Merkezi/i })).not.toBeInTheDocument();

    // Default primary tab in Genel Bakış must be overview
    expect(screen.getAllByRole('button', { name: /Genel Bakış/i }).length).toBeGreaterThan(0);
  });
});
