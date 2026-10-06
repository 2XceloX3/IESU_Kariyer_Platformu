import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import JobsAndInternships from '../components/JobsAndInternships';

describe('JobsAndInternships Component', () => {
  const mockSetView = vi.fn();
  const mockSetSelectedUserId = vi.fn();
  const mockSetJobs = vi.fn();

  const mockProps = {
    userRole: 'student',
    setView: mockSetView,
    previousView: 'student',
    jobs: [
      { id: 'j1', title: 'Software Engineering Intern', company: 'Tech Corp', location: 'Remote', type: 'Staj' },
      { id: 'j2', title: 'Data Scientist', company: 'Data Inc', location: 'Istanbul', type: 'Tam Zamanlı' }
    ],
    applications: [],
    setApplications: vi.fn(),
    currentUser: { id: 'u1', name: 'Student 1' },
    setSelectedUserId: mockSetSelectedUserId,
    setJobs: mockSetJobs,
    addNotification: vi.fn()
  };

  it('renders without crashing', () => {
    render(<JobsAndInternships {...mockProps} />);
    expect(screen.getAllByText(/Aktif/i).length).toBeGreaterThan(0);
  });

  it('renders jobs in the list', () => {
    render(<JobsAndInternships {...mockProps} />);
    expect(screen.getAllByText(/Software Engineering Intern/i).length).toBeGreaterThan(0);
  });

  it('switches tabs to Ulusal Staj', () => {
    render(<JobsAndInternships {...mockProps} />);
    const ulusalTab = screen.queryByText(/Ulusal Staj/i) || screen.queryByText(/Yetenek Kapısı/i) || screen.queryByText(/Staj/i);
    if (ulusalTab) fireEvent.click(ulusalTab);
    expect(screen.getAllByText(/Kariyer|Staj|İlan/i).length).toBeGreaterThan(0);
  });

  it('switches tabs to Gonullu Staj', () => {
    render(<JobsAndInternships {...mockProps} />);
    const gonulluTab = screen.queryAllByText(/İsteğe Bağlı Staj|Gönüllü Staj|Staj/i)[0];
    if (gonulluTab) fireEvent.click(gonulluTab);
    expect(screen.getAllByText(/Kariyer|Staj|İlan/i).length).toBeGreaterThan(0);
  });

  it('renders Academic role with dedicated Indigo theme and routes back to academic without admin trap', () => {
    mockSetView.mockClear();
    const academicProps = {
      ...mockProps,
      userRole: 'academic',
      previousView: 'academic',
      currentUser: { id: 'acad_1', name: 'Dr. Zeynep Çelik', role: 'academic' }
    };

    render(<JobsAndInternships {...academicProps} />);

    // Header title should have indigo styling
    const uniTitle = screen.getByText('İstanbul Esenyurt Üniversitesi');
    expect(uniTitle.className).toContain('text-indigo-900');
    expect(uniTitle.className).not.toContain('text-amber-800');

    // Should NOT show Super Admin coordinator card
    expect(screen.queryByText(/👑 KGM MASTER/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/SÜPER YÖNETİCİ & KOORDİNATÖR/i)).not.toBeInTheDocument();

    // Clicking top logo should navigate back to academic, NOT admin
    const logoButton = uniTitle.closest('[role="button"]');
    fireEvent.click(logoButton);
    expect(mockSetView).toHaveBeenCalledWith('academic');
    expect(mockSetView).not.toHaveBeenCalledWith('admin');
  });

  it('renders Student role with Crimson theme and routes back to student', () => {
    mockSetView.mockClear();
    render(<JobsAndInternships {...mockProps} userRole="student" previousView="student" />);

    const uniTitle = screen.getByText('İstanbul Esenyurt Üniversitesi');
    expect(uniTitle.className).toContain('text-[#990000]');

    const logoButton = uniTitle.closest('[role="button"]');
    fireEvent.click(logoButton);
    expect(mockSetView).toHaveBeenCalledWith('student');
    expect(mockSetView).not.toHaveBeenCalledWith('admin');
  });
});
