import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ServicesPage from '../components/ServicesPage';

describe('ServicesPage Component', () => {
  it('renders official services catalog cards', () => {
    render(<ServicesPage setView={vi.fn()} currentUser={null} />);

    expect(screen.getByText('Bireysel Kariyer Danışmanlığı')).toBeInTheDocument();
    expect(screen.getByText('Çevrimiçi Mülakat Simülasyonu')).toBeInTheDocument();
    expect(screen.getByText('Etkili Özgeçmiş (CV) & Ön Yazı Eğitimi')).toBeInTheDocument();
  });

  it('redirects unauthenticated users to login when "Hizmete Git" is clicked', () => {
    const setView = vi.fn();
    render(<ServicesPage setView={setView} currentUser={null} />);

    const actionButtons = screen.getAllByText(/Hizmete Git/i);
    expect(actionButtons.length).toBeGreaterThan(0);

    // Click the first service's "Hizmete Git" button
    fireEvent.click(actionButtons[0]);

    // Should redirect to portal login ('login'), NOT 404
    expect(setView).toHaveBeenCalledWith('login');
  });

  it('navigates authenticated users directly to the specific service view', () => {
    const setView = vi.fn();
    const mockStudent = { id: 'STU-001', name: 'Ahmet Yılmaz', role: 'student' };
    render(<ServicesPage setView={setView} currentUser={mockStudent} userRole="student" />);

    const actionButtons = screen.getAllByText(/Hizmete Git/i);
    // Click the first service ("Bireysel Kariyer Danışmanlığı" -> 'mentor_booking')
    fireEvent.click(actionButtons[0]);

    expect(setView).toHaveBeenCalledWith('mentor_booking');
  });

  it('redirects unauthenticated users to login from the detail preview modal', () => {
    const setView = vi.fn();
    render(<ServicesPage setView={setView} currentUser={null} />);

    const detailButtons = screen.getAllByText(/Detaylı İncele/i);
    fireEvent.click(detailButtons[0]);

    // Modal should be open
    const modalActionBtn = screen.getByText(/Hemen Kullan & Başvur/i);
    expect(modalActionBtn).toBeInTheDocument();

    fireEvent.click(modalActionBtn);

    // Should redirect to portal login ('login'), NOT 404
    expect(setView).toHaveBeenCalledWith('login');
  });
});
