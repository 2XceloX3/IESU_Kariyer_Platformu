import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CMSGeneralEvents from '../components/admin/CMSGeneralEvents';
import AdminDashboard from '../components/AdminDashboard';

describe('CMSGeneralEvents Component & Separation from CMSEvents', () => {
  const mockGeneralEvents = [
    {
      id: 'GEVT-101',
      title: '2025–2026 Akademik Yılı Mezuniyet Töreni',
      category: 'Rektörlük & Tören',
      date: '2026-06-28',
      time: '13:00',
      location: 'Yahya Kemal Beyatlı Gösteri Merkezi',
      organizer: 'T.C. İstanbul Esenyurt Üniversitesi Rektörlüğü',
      quota: 5000,
      registeredCount: 4200,
      description: 'Mezuniyet töreni ve diploma takdimi.',
      status: 'Yayında',
      featured: true
    },
    {
      id: 'GEVT-102',
      title: 'Cumhuriyet Kupası Fakülteler Arası Voleybol Turnuvası',
      category: 'Spor & Turnuvalar',
      date: '2026-04-25',
      time: '15:00',
      location: 'Kapalı Spor Salonu',
      organizer: 'Spor Kulübü',
      quota: 150,
      registeredCount: 112,
      description: 'Fakülteler arası voleybol turnuvası.',
      status: 'Yayında',
      featured: false
    }
  ];

  it('renders general events stats, title and event cards', () => {
    render(
      <CMSGeneralEvents
        generalEvents={mockGeneralEvents}
        setGeneralEvents={vi.fn()}
      />
    );

    expect(screen.getByText(/Genel Etkinlikler & Kampüs Yaşamı Portalı/i)).toBeInTheDocument();
    expect(screen.getByText('2025–2026 Akademik Yılı Mezuniyet Töreni')).toBeInTheDocument();
    expect(screen.getByText('Cumhuriyet Kupası Fakülteler Arası Voleybol Turnuvası')).toBeInTheDocument();
    expect(screen.getAllByText(/Rektörlük & Tören/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Spor & Turnuva/i).length).toBeGreaterThan(0);
  });

  it('filters general events by category tabs', () => {
    render(
      <CMSGeneralEvents
        generalEvents={mockGeneralEvents}
        setGeneralEvents={vi.fn()}
      />
    );

    const sportTab = screen.getByRole('button', { name: /Spor & Turnuvalar/i });
    fireEvent.click(sportTab);

    expect(screen.getByText('Cumhuriyet Kupası Fakülteler Arası Voleybol Turnuvası')).toBeInTheDocument();
    expect(screen.queryByText('2025–2026 Akademik Yılı Mezuniyet Töreni')).not.toBeInTheDocument();
  });

  it('AdminDashboard renders CMSGeneralEvents for cms_events and CMSEvents for etkinlik distinctly', () => {
    const mockSetView = vi.fn();
    const mockSetSelectedUserId = vi.fn();

    render(
      <AdminDashboard
        currentUser={{ id: 'admin1', name: 'Admin User' }}
        userRole="admin"
        academicRole="super_admin"
        setView={mockSetView}
        setSelectedUserId={mockSetSelectedUserId}
      />
    );

    // Navigate to Content category
    const contentCategoryBtn = screen.getByRole('button', { name: /İçerik & Platform/i });
    fireEvent.click(contentCategoryBtn);

    // Click "Genel Etkinlikler" (cms_events)
    const generalEventsTab = screen.getByRole('button', { name: /Genel Etkinlikler/i });
    fireEvent.click(generalEventsTab);

    // Must render CMSGeneralEvents header and NOT CMSEvents
    expect(screen.getByText(/Genel Etkinlikler & Kampüs Yaşamı Portalı/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Yeni Genel Etkinlik Ekle/i })).toBeInTheDocument();
    expect(screen.queryByText(/Kariyer Etkinlikleri Yönetimi/i)).not.toBeInTheDocument();

    // Now click "Kariyer Etkinlikleri" (etkinlik)
    const careerEventsTab = screen.getByRole('button', { name: /Kariyer Etkinlikleri/i });
    fireEvent.click(careerEventsTab);

    // Must render CMSEvents header and NOT CMSGeneralEvents
    expect(screen.queryByText(/Genel Etkinlikler & Kampüs Yaşamı Portalı/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Kariyer Etkinlikleri Yönetimi/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Yeni Kariyer Etkinliği Ekle/i })).toBeInTheDocument();
  });
});
