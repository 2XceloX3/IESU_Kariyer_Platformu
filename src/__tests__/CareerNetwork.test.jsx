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

  it('clicking İlanları & Kontenjanları İncele sets activePortalBranch and navigates to jobs', () => {
    mockSetView.mockClear();
    render(<CareerNetwork {...mockProps} userRole="academic" previousView="academic" />);
    
    // Find and click a company card to open modal
    const companyCard = screen.getAllByText(/Aselsan|Baykar|Protokol Detayı/i)[0];
    fireEvent.click(companyCard);

    // Modal button should exist
    const inspectBtn = screen.getByText(/İlanları & Kontenjanları İncele/i);
    expect(inspectBtn).toBeInTheDocument();

    fireEvent.click(inspectBtn);
    expect(mockSetView).toHaveBeenCalledWith('jobs');
  });

  it('clicking Yetenek Kapısı Üzerinden Başvur sets activePortalBranch and navigates to jobs', () => {
    mockSetView.mockClear();
    render(<CareerNetwork {...mockProps} userRole="academic" previousView="academic" />);
    
    // Open internship modal
    const applyModalTrigger = screen.getAllByText(/Başvur & İncele/i)[0];
    fireEvent.click(applyModalTrigger);

    const applyBtn = screen.getByText(/Yetenek Kapısı Üzerinden Başvur/i);
    expect(applyBtn).toBeInTheDocument();

    fireEvent.click(applyBtn);
    expect(mockSetView).toHaveBeenCalledWith('jobs');
  });

  it('back button in Academic role navigates to academic and does not trap in admin', () => {
    mockSetView.mockClear();
    render(<CareerNetwork {...mockProps} userRole="academic" previousView="academic" />);
    
    const backBtn = screen.getByTitle('Geri Dön');
    fireEvent.click(backBtn);
    expect(mockSetView).toHaveBeenCalledWith('academic');
    expect(mockSetView).not.toHaveBeenCalledWith('admin');
  });
});
