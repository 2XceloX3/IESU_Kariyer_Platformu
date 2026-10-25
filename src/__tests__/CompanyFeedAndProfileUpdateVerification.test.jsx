/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CompanyFeed from '../components/CompanyFeed';
import ProfileUpdate from '../components/ProfileUpdate';
import App from '../App';
import useAppStore from '../store/useAppStore';

describe('CompanyFeed and ProfileUpdate Verification', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    sessionStorage.clear();
  });
  it('verifies "İlanlarım" card is removed from CompanyFeed and 3 cards remain in 3-col grid', () => {
    const mockCurrentUser = {
      id: 'CMP-001',
      name: 'Trendyol',
      role: 'company',
      sector: 'E-Ticaret & Teknoloji'
    };

    useAppStore.setState({
      currentUser: mockCurrentUser,
      userRole: 'company',
      activePortalBranch: 'company'
    });

    const { container } = render(
      <MemoryRouter>
        <CompanyFeed 
          currentUser={mockCurrentUser}
          userRole="company"
          setView={vi.fn()}
          setSelectedUserId={vi.fn()}
        />
      </MemoryRouter>
    );

    // "İlanlarım" must NOT exist in the Kurumsal İşe Alım & Yönetim section
    expect(screen.queryByText('Yayınlanan fırsatlar')).toBeNull();

    // The other 3 cards must exist
    expect(screen.getAllByText('ATS Panosu').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Yeni İlan Yayınla').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Yetenek Havuzu').length).toBeGreaterThan(0);

    // The grid must have sm:grid-cols-3
    const gridDiv = container.querySelector('.sm\\:grid-cols-3');
    expect(gridDiv).not.toBeNull();
  });

  it('renders ProfileUpdate for Super Admin in Company portal without crashing', () => {
    const adminUser = {
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Koordinatörlüğü',
      role: 'admin',
      grade: 'Süper Yönetici',
      avatar: '/iesu-logo.svg'
    };

    useAppStore.setState({
      currentUser: adminUser,
      userRole: 'admin',
      activePortalBranch: 'company'
    });

    const { container } = render(
      <MemoryRouter>
        <ProfileUpdate 
          currentUser={adminUser}
          userRole="company"
          setView={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getAllByText(/Kurumsal Firma Bilgileri/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Beklenmeyen Bir Hata Oluştu/i)).toBeNull();
  });

  it('renders ProfileUpdate for Super Admin in Admin portal without crashing', () => {
    const adminUser = {
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Koordinatörlüğü',
      role: 'admin',
      grade: 'Süper Yönetici',
      avatar: '/iesu-logo.svg'
    };

    useAppStore.setState({
      currentUser: adminUser,
      userRole: 'admin',
      activePortalBranch: 'admin'
    });

    render(
      <MemoryRouter>
        <ProfileUpdate 
          currentUser={adminUser}
          userRole="admin"
          setView={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getAllByText(/Yönetici Kimliği & İletişim/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Beklenmeyen Bir Hata Oluştu/i)).toBeNull();
  });

  it('renders App when navigating to /profile_update as Admin without ErrorBoundary crash', async () => {
    const adminUser = {
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Koordinatörlüğü',
      role: 'admin',
      grade: 'Süper Yönetici',
      avatar: '/iesu-logo.svg',
      onboardingCompleted: true
    };

    localStorage.setItem('iesu_mock_user', JSON.stringify(adminUser));
    sessionStorage.setItem('iesu_mock_user', JSON.stringify(adminUser));
    sessionStorage.setItem('iesu_admin_session', 'active');
    const token = btoa('kariyer:Z.s.1513');
    sessionStorage.setItem('iesu_coordinator_token', token);
    localStorage.setItem('iesu_remember_me', 'true');

    useAppStore.setState({
      currentUser: adminUser,
      userRole: 'admin',
      activePortalBranch: 'admin',
      authenticatedUserId: 'admin_1513'
    });

    render(
      <MemoryRouter initialEntries={['/profile_update']}>
        <App />
      </MemoryRouter>
    );

    await new Promise(r => setTimeout(r, 200));

    expect(screen.queryByText(/Beklenmeyen Bir Hata Oluştu/i)).toBeNull();
  });

  it('renders App when navigating to /profile_update as Company user without ErrorBoundary crash', async () => {
    const companyUser = {
      id: 'CMP-001',
      name: 'Trendyol',
      role: 'company',
      sector: 'E-Ticaret & Teknoloji',
      email: 'ik@trendyol.com',
      avatar: 'https://ui-avatars.com/api/?name=Trendyol'
    };

    localStorage.setItem('iesu_mock_user', JSON.stringify(companyUser));
    sessionStorage.setItem('iesu_mock_user', JSON.stringify(companyUser));
    localStorage.setItem('iesu_remember_me', 'true');

    useAppStore.setState({
      currentUser: companyUser,
      userRole: 'company',
      activePortalBranch: 'company',
      authenticatedUserId: 'CMP-001'
    });

    render(
      <MemoryRouter initialEntries={['/profile_update']}>
        <App />
      </MemoryRouter>
    );

    await new Promise(r => setTimeout(r, 200));

    expect(screen.queryByText(/Beklenmeyen Bir Hata Oluştu/i)).toBeNull();
  });
});
