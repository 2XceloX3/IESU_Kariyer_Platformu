import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ClubAdminPanel from '../components/ClubAdminPanel';
import useAppStore from '../store/useAppStore';

vi.mock('../store/useAppStore', () => ({
  __esModule: true,
  default: vi.fn()
}));

describe('ClubAdminPanel Component', () => {
  const currentUser = { id: 'user-1', name: 'Ahmet Yılmaz' };

  it('renders no management permission view when user has no managed clubs', () => {
    useAppStore.mockReturnValue({
      clubs: [],
      setClubs: vi.fn(),
      events: [],
      setEvents: vi.fn()
    });

    render(<ClubAdminPanel currentUser={currentUser} />);
    expect(screen.getByText(/Yönetim Yetkiniz Bulunmuyor/i)).toBeInTheDocument();
  });

  it('renders club admin panel when user is president of a club', () => {
    const mockClubs = [
      {
        id: 'club-1',
        name: 'Yazılım Kulübü',
        presidentId: 'user-1',
        members: [{ id: 'mem-1', userId: 'user-1', name: 'Ahmet Yılmaz' }],
        memberRequests: [
          {
            id: 'req-1',
            userId: 'user-2',
            name: 'Zehra Arslan',
            department: 'Bilgisayar Mühendisliği',
            studentNo: '2024010888',
            tcKimlik: '12345678901',
            motivation: 'Yapay zeka projelerinde yer almak istiyorum.'
          }
        ],
        budgetRequests: [
          {
            id: 'br-1',
            title: 'Yapay Zeka Çalıştayı',
            venue: 'Ömer Halisdemir Konferans Salonu',
            eventDate: '25 Kasım 2026',
            requester: 'Ahmet Yılmaz',
            status: 'approved',
            approvalNote: 'Ömer Halisdemir Konferans Salonu saat 13:00-17:00 arası tahsis edilmiştir.'
          }
        ]
      }
    ];

    useAppStore.mockReturnValue({
      clubs: mockClubs,
      setClubs: vi.fn(),
      events: [],
      setEvents: vi.fn()
    });

    render(<ClubAdminPanel currentUser={currentUser} />);
    expect(screen.getByText('Yazılım Kulübü')).toBeInTheDocument();
    expect(screen.getByText(/YÖNETİCİ PANELİ/i)).toBeInTheDocument();

    // President Official Powers Banner exists
    expect(screen.getByText(/Kulüp Başkanı Resmî Yetki Alanları & SKS İş Akışı/i)).toBeInTheDocument();
    expect(screen.getByText(/SKS Salon Tahsisi/i)).toBeInTheDocument();

    // Requests tab shows pending applicant details
    expect(screen.getByText('Zehra Arslan')).toBeInTheDocument();
    expect(screen.getByText(/No: 2024010888/i)).toBeInTheDocument();
    expect(screen.getByText(/TC: 123\*\*\*\*\*01/i)).toBeInTheDocument();
    expect(screen.getByText(/Yapay zeka projelerinde yer almak istiyorum/i)).toBeInTheDocument();
  });

  it('navigates to SKS venue requests tab and displays venue allocations and approval notes', () => {
    const mockClubs = [
      {
        id: 'club-1',
        name: 'Yazılım Kulübü',
        presidentId: 'user-1',
        members: [{ id: 'mem-1', userId: 'user-1', name: 'Ahmet Yılmaz' }],
        budgetRequests: [
          {
            id: 'br-1',
            title: 'TEKNOFEST Hackathon Hazırlık',
            venue: 'G Blok Çok Amaçlı Salon',
            eventDate: '14 Aralık 2026',
            requester: 'Ahmet Yılmaz',
            status: 'approved',
            approvalNote: 'Ses ve ışık sistemi SKS teknik ekibince kurulacaktır.'
          }
        ]
      }
    ];

    useAppStore.mockReturnValue({
      clubs: mockClubs,
      setClubs: vi.fn(),
      events: [],
      setEvents: vi.fn()
    });

    render(<ClubAdminPanel currentUser={currentUser} />);

    // Click SKS venue requests tab
    const venueTab = screen.getByText(/SKS Mekan & Etkinlik Talepleri/i);
    expect(venueTab).toBeInTheDocument();
    fireEvent.click(venueTab);

    // Displays SKS venue details
    expect(screen.getByText(/SKS Mekan & Etkinlik Tahsis Talepleri/i)).toBeInTheDocument();
    expect(screen.getByText(/TEKNOFEST Hackathon Hazırlık/i)).toBeInTheDocument();
    expect(screen.getByText(/G Blok Çok Amaçlı Salon/i)).toBeInTheDocument();
    expect(screen.getByText(/Tahsis Onaylandı/i)).toBeInTheDocument();
    expect(screen.getByText(/Ses ve ışık sistemi SKS teknik ekibince kurulacaktır/i)).toBeInTheDocument();
  });
});
