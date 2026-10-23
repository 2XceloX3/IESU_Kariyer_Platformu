import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import StudentHive from '../hives/student/StudentHive';
import AlumniHive from '../hives/alumni/AlumniHive';
import ExploreFeed from '../components/ExploreFeed';

describe('ExploreFeed Consistency and Portal Integration Suite', () => {
  const mockStudentUser = {
    id: 'STU-EXPLORE-1',
    name: 'Selin Yıldız',
    email: 'selin@esenyurt.edu.tr',
    role: 'student',
    onboardingCompleted: true
  };

  const mockAlumniUser = {
    id: 'ALU-EXPLORE-1',
    name: 'Merve Kaya',
    email: 'merve@alumni.esenyurt.edu.tr',
    role: 'alumni',
    onboardingCompleted: true
  };

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('renders StudentFeed with 3-column layout when StudentHive accesses explore view directly', async () => {
    useAppStore.setState({
      currentUser: mockStudentUser,
      userRole: 'student',
      activePortalBranch: 'student',
      posts: [
        { id: 'p1', author: 'Ahmet Demir', authorRole: 'student', content: 'Teknoloji zirvesi harikaydı!' }
      ]
    });

    render(
      <MemoryRouter initialEntries={['/explore']}>
        <StudentHive currentUser={mockStudentUser} setView={vi.fn()} />
      </MemoryRouter>
    );

    // Should render official Student Portal header
    await waitFor(() => {
      expect(screen.getByText('İstanbul Esenyurt Üniversitesi')).toBeInTheDocument();
      expect(screen.getByText(/Kariyer Geliştirme Koordinatörlüğü/i)).toBeInTheDocument();
      expect(screen.getByText(/ÖĞRENCİ AĞI & KARİYER PORTALI/i)).toBeInTheDocument();
    });

    // Keşfet & Sosyal Ağ content should be inside the page
    expect(screen.getByText('Keşfet & Sosyal Ağ')).toBeInTheDocument();
    expect(screen.getByText('Teknoloji zirvesi harikaydı!')).toBeInTheDocument();

    // Exactly one bottom floating dock should be present
    const homeBtns = screen.getAllByTitle('Akış');
    expect(homeBtns.length).toBe(1);

    // Clicking back button inside ExploreFeed should seamlessly switch activeTab to feed
    const backBtn = screen.getByTitle('Geri Dön');
    fireEvent.click(backBtn);

    // Main student feed header/bento items should now be visible
    await waitFor(() => {
      expect(screen.getByText(/Kariyer & Gelişim Araçları/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('renders AlumniFeed with dedicated Emerald layout when AlumniHive accesses explore view', async () => {
    useAppStore.setState({
      currentUser: mockAlumniUser,
      userRole: 'alumni',
      activePortalBranch: 'alumni',
      posts: [
        { id: 'p2', author: 'Mehmet Yılmaz', authorRole: 'alumni', content: 'Yeni şirketim için stajyer arıyorum.' }
      ]
    });

    render(
      <MemoryRouter initialEntries={['/explore']}>
        <AlumniHive currentUser={mockAlumniUser} setView={vi.fn()} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('İstanbul Esenyurt Üniversitesi')).toBeInTheDocument();
      expect(screen.getByText(/MEZUN AĞI & KARİYER PORTALI/i)).toBeInTheDocument();
      expect(screen.getByText('Keşfet & Sosyal Ağ')).toBeInTheDocument();
      expect(screen.getByText('Yeni şirketim için stajyer arıyorum.')).toBeInTheDocument();
    }, { timeout: 4000 });
  });

  it('ExploreFeed does not render redundant inner dock when hideDock is true', () => {
    render(
      <MemoryRouter>
        <ExploreFeed
          posts={[]}
          setView={vi.fn()}
          setSelectedUserId={vi.fn()}
          currentUser={mockStudentUser}
          hideDock={true}
          onBack={vi.fn()}
        />
      </MemoryRouter>
    );

    // Title of dock buttons should not exist
    expect(screen.queryByTitle('Akış & Ana Sayfa')).not.toBeInTheDocument();
    expect(screen.queryByTitle('İş & Staj Olanakları')).not.toBeInTheDocument();
  });
});
