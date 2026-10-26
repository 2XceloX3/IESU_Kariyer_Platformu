import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import MainLayout, { useNavActive } from './MainLayout';
import { describe, it, expect, vi } from 'vitest';

// A test component to test useNavActive hook
const TestComponent = ({ basePath, activePatterns }) => {
  const [isActive] = useNavActive(basePath, activePatterns);
  const location = useLocation();
  return (
    <div data-testid="test-active" data-active={isActive} data-path={location.pathname}>
      {isActive ? 'Active' : 'Inactive'}
    </div>
  );
};

describe('MainLayout', () => {
  it('renders children correctly', () => {
    render(
      <MemoryRouter>
        <MainLayout>
          <div data-testid="child-element">Child Content</div>
        </MainLayout>
      </MemoryRouter>
    );
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('renders with all props without crashing', () => {
    const mockSetSearchOpen = vi.fn();
    const mockSetCommandOpen = vi.fn();
    const mockHandleLogout = vi.fn();
    const mockHandleLogin = vi.fn();

    render(
      <MemoryRouter>
        <MainLayout
          searchOpen={false}
          setSearchOpen={mockSetSearchOpen}
          commandOpen={false}
          setCommandOpen={mockSetCommandOpen}
          currentUser={{ uid: '123' }}
          handleLogout={mockHandleLogout}
          handleLogin={mockHandleLogin}
        >
          <div>Test</div>
        </MainLayout>
      </MemoryRouter>
    );
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
  });

  describe('useNavActive', () => {
    it('returns true when pathname exactly matches basePath', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <TestComponent basePath="/dashboard" activePatterns={[]} />
        </MemoryRouter>
      );
      expect(screen.getByTestId('test-active')).toHaveTextContent('Active');
    });

    it('returns true when pathname matches basePath with trailing slash', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard/']}>
          <TestComponent basePath="/dashboard" activePatterns={[]} />
        </MemoryRouter>
      );
      expect(screen.getByTestId('test-active')).toHaveTextContent('Active');
    });

    it('returns false when pathname does not match basePath', () => {
      render(
        <MemoryRouter initialEntries={['/profile']}>
          <TestComponent basePath="/dashboard" activePatterns={[]} />
        </MemoryRouter>
      );
      expect(screen.getByTestId('test-active')).toHaveTextContent('Inactive');
    });

    it('returns true when pathname matches one of the activePatterns', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard/settings']}>
          <TestComponent basePath="/dashboard" activePatterns={['/dashboard/settings', '/dashboard/profile']} />
        </MemoryRouter>
      );
      expect(screen.getByTestId('test-active')).toHaveTextContent('Active');
    });

    it('returns false when pathname matches neither basePath nor activePatterns', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard/other']}>
          <TestComponent basePath="/dashboard" activePatterns={['/dashboard/settings', '/dashboard/profile']} />
        </MemoryRouter>
      );
      expect(screen.getByTestId('test-active')).toHaveTextContent('Inactive');
    });
  });
});
