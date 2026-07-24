import React from 'react';
import { render, screen } from '@testing-library/react';
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
        memberRequests: []
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
  });
});
