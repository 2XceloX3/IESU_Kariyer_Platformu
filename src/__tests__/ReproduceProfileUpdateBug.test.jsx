/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
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
    sessionStorage.setItem('iesu_mock_user', JSON.stringify(adminUser));

    // Simulate Firebase Admin being authenticated
    const authModule = require('firebase/auth');
    if (!authModule.onAuthStateChanged) {
      vi.mock('firebase/auth', () => ({
        signInWithEmailAndPassword: vi.fn(),
        signOut: vi.fn(),
        onAuthStateChanged: vi.fn((_auth, callback) => {
          callback({ uid: 'admin_1513', email: 'admin@iesu.edu.tr' });
          return vi.fn();
        }),
      }));
    } else {
      authModule.onAuthStateChanged = vi.fn((_auth, callback) => {
        callback({ uid: 'admin_1513', email: 'admin@iesu.edu.tr' });
        return vi.fn();
      });
    }

    useAppStore.setState({
      currentUser: adminUser,
      userRole: 'admin',
      activePortalBranch: 'company',
      authenticatedUserId: 'admin_1513'
    });

    const { container } = render(
      <MemoryRouter initialEntries={['/profile_update']}>
        <App />
      </MemoryRouter>
    );

    // Wait a tick for effects
    await new Promise(r => setTimeout(r, 200));

    // Check if ErrorBoundary triggered
    const errorHeading = screen.queryByText(/Beklenmeyen Bir Hata Oluştu/i);
    if (errorHeading) {
      console.error('ERROR BOUNDARY TRIGGERED! HTML:', container.innerHTML);
    }
    expect(errorHeading).toBeNull();
  });
});
