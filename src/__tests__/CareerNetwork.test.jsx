import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CareerNetwork from '../components/CareerNetwork';

describe('CareerNetwork Component', () => {
  const mockSetView = vi.fn();
  const mockSetSelectedUserId = vi.fn();

  const mockProps = {
    companies: [
      { id: 'c1', name: 'Tech Corp', industry: 'Software', status: 'Onaylı', source: 'user' },
      { id: 'c2', name: 'Health Inc', industry: 'Healthcare', status: 'Onaylı', source: 'user' }
    ],
    academicStaff: [
      { id: 'a1', name: 'Dr. Smith', department: 'Computer Science', source: 'user' }
    ],
    setView: mockSetView,
    setSelectedUserId: mockSetSelectedUserId,
    currentUser: { id: 'u1', name: 'Student 1' }
  };

  it('renders without crashing', () => {
    render(<CareerNetwork {...mockProps} />);
    expect(screen.getAllByText(/Akademik & Katılımcı Ağı|Katılımcılar & Kurullar/i).length).toBeGreaterThan(0);
  });

  it('renders companies by default', () => {
    render(<CareerNetwork {...mockProps} />);
    expect(screen.getAllByText(/Aselsan|Baykar|Katılımcı|Resmi|Teknoloji/i).length).toBeGreaterThan(0);
  });

  it('handles empty lists gracefully', () => {
    render(<CareerNetwork {...mockProps} companies={[]} academicStaff={[]} />);
    expect(screen.getAllByText(/Akademik & Katılımcı Ağı|Katılımcılar & Kurullar/i).length).toBeGreaterThan(0);
  });
});
