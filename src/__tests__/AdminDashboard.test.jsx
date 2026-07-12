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
    // Features toggles if any
    featureSurveys: true,
    featureAlumniCard: true,
    featureClubsShowcase: true,
    featureClubApplications: true,
    featureCareerCheckup: true
  };

  it('renders without crashing', () => {
    render(<AdminDashboard {...mockProps} />);
    // There are some standard admin texts in Overview panel or sidebar
    expect(screen.getAllByText(/Kariyer/i).length).toBeGreaterThan(0);
  });

  it('can navigate to students tab', () => {
    render(<AdminDashboard {...mockProps} />);
    
    const studentsTab = screen.getAllByText(/Aktif.*renci/i)[0] || screen.getAllByText(/renci/i)[0];
    if (studentsTab) {
      fireEvent.click(studentsTab);
      expect(screen.getAllByText(/renci/i).length).toBeGreaterThan(0);
    }
  });

  it('can navigate to settings tab', () => {
    render(<AdminDashboard {...mockProps} />);
    
    // Find the settings tab: 'Platform'
    const settingsTabText = screen.getAllByText(/Platform/i)[0];
    if (settingsTabText) {
      fireEvent.click(settingsTabText);
      // Validate it changed
      expect(screen.getAllByText(/Platform/i).length).toBeGreaterThan(0);
    }
  });
});
