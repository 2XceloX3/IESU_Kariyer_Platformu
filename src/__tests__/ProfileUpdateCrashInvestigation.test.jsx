/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import ProfileUpdate from '../components/ProfileUpdate';
import useAppStore from '../store/useAppStore';

describe('ProfileUpdate Crash Investigation', () => {
  it('renders ProfileUpdate for Super Admin browsing in Company branch', () => {
    useAppStore.setState({
      activePortalBranch: 'company',
      currentUser: { id: 'admin_1513', name: 'Kariyer Geliştirme Koordinatörlüğü', role: 'admin' }
    });

    expect(() => {
      render(
        <ProfileUpdate 
          currentUser={{ id: 'admin_1513', name: 'Kariyer Geliştirme Koordinatörlüğü', role: 'admin' }}
          userRole="company"
          setView={vi.fn()}
        />
      );
    }).not.toThrow();
  });

  it('renders ProfileUpdate for all branches and roles without crashing', () => {
    const roles = ['admin', 'company', 'alumni', 'student', 'academic'];
    const branches = ['admin', 'company', 'alumni', 'student', 'academic'];

    for (const role of roles) {
      for (const branch of branches) {
        useAppStore.setState({
          activePortalBranch: branch,
          currentUser: { id: 'user_1', name: 'Test User', role }
        });

        const { unmount } = render(
          <ProfileUpdate 
            currentUser={{ id: 'user_1', name: 'Test User', role }}
            userRole={role}
            setView={vi.fn()}
          />
        );
        unmount();
      }
    }
  });
});
