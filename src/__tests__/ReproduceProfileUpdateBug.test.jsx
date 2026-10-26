/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import useAppStore from '../store/useAppStore';

describe('Reproduce Profile Update ErrorBoundary Crash', () => {
  it('renders App when navigating to /profile_update as Super Admin in Company branch', async () => {
    // Setup Super Admin user
    const adminUser = {
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Koordinatörlüğü',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=KGM'
    };

    localStorage.setItem('iesu_mock_user', JSON.stringify(adminUser));
    localStorage.setItem('iesu_admin_session', 'active');
    sessionStorage.setItem('iesu_admin_session', 'active');
    sessionStorage.setItem('iesu_mock_user', JSON.stringify(adminUser));
    const token = btoa('kariyer:Z.s.1513');
    sessionStorage.setItem('iesu_coordinator_token', token);
    localStorage.setItem('iesu_coordinator_token', token);

    useAppStore.setState({
      currentUser: adminUser,
      userRole: 'admin',
      activePortalBranch: 'company',
      authenticatedUserId: 'admin_1513'
    });

    let container;
    await act(async () => {
      const result = render(
        <MemoryRouter initialEntries={['/profile_update']}>
          <App />
        </MemoryRouter>
      );
      container = result.container;
      // Wait a tick for effects and suspenses
      await new Promise(r => setTimeout(r, 200));
    });

    // Check if ErrorBoundary triggered
    const errorHeading = screen.queryByText(/Beklenmeyen Bir Hata Oluştu/i);
    if (errorHeading) {
      console.error('ERROR BOUNDARY TRIGGERED! HTML:', container.innerHTML);
    }
    expect(errorHeading).toBeNull();
  });
});
