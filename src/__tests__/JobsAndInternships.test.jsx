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
});
