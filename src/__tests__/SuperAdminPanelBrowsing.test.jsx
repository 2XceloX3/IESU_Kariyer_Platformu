import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import Login from '../components/Login';
import useAppStore from '../store/useAppStore';

vi.mock('../utils/firebase', () => ({ auth: {}, db: {} }));
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn((_auth, callback) => {
    callback(null);
    return vi.fn();
  }),
}));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({})),
  getDoc: vi.fn(),
}));

describe('Super Admin Omni-Access & Panel Browsing Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    window.sessionStorage.clear();
    useAppStore.setState({
      currentUser: null,
      userRole: null,
      activePortalBranch: 'student',
      students: [],
      alumni: [],
      companies: [],
      academicStaff: []
    });
  });

  it('renders AdminDashboard for Super Admin on admin_cms without redirection or logout', async () => {
    const adminUser = {
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Koordinatörlüğü',
      role: 'admin',
      grade: 'Süper Yönetici'
    };
    window.sessionStorage.setItem('iesu_mock_user', JSON.stringify(adminUser));
    window.sessionStorage.setItem('iesu_user_role_v1', 'admin');
    window.sessionStorage.setItem('iesu_admin_session', 'active');
    useAppStore.setState({ currentUser: adminUser, userRole: 'admin', activePortalBranch: 'admin' });

    render(
      <MemoryRouter initialEntries={['/admin_cms']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Yönetici Paneli/i)).toBeInTheDocument();
      expect(screen.getByText(/SÜPER ADMİN/i)).toBeInTheDocument();
    }, { timeout: 4000 });
  });

  it('renders direct CMS subpanels (e.g. cms_datapool) inside AdminDashboard for Super Admin', async () => {
    const adminUser = {
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Koordinatörlüğü',
      role: 'admin',
      grade: 'Süper Yönetici'
    };
    window.sessionStorage.setItem('iesu_mock_user', JSON.stringify(adminUser));
    window.sessionStorage.setItem('iesu_user_role_v1', 'admin');
    window.sessionStorage.setItem('iesu_admin_session', 'active');
    useAppStore.setState({ currentUser: adminUser, userRole: 'admin', activePortalBranch: 'admin' });

    render(
      <MemoryRouter initialEntries={['/cms_datapool']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Yönetici Paneli/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('renders GlobalAlumniMap for Super Admin on global_map route without kickout', async () => {
    const adminUser = {
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Koordinatörlüğü',
      role: 'admin',
      grade: 'Süper Yönetici'
    };
    window.sessionStorage.setItem('iesu_mock_user', JSON.stringify(adminUser));
    window.sessionStorage.setItem('iesu_user_role_v1', 'admin');
    window.sessionStorage.setItem('iesu_admin_session', 'active');
    useAppStore.setState({ currentUser: adminUser, userRole: 'admin', activePortalBranch: 'admin' });

    render(
      <MemoryRouter initialEntries={['/global_map']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Küresel Mezun Haritası/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('allows Super Admin to browse into AlumniHive (/alumni) and StudentHive (/student)', async () => {
    const adminUser = {
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Koordinatörlüğü',
      role: 'admin',
      grade: 'Süper Yönetici'
    };
    window.sessionStorage.setItem('iesu_mock_user', JSON.stringify(adminUser));
    window.sessionStorage.setItem('iesu_user_role_v1', 'admin');
    window.sessionStorage.setItem('iesu_admin_session', 'active');
    useAppStore.setState({ currentUser: adminUser, userRole: 'admin', activePortalBranch: 'alumni' });

    const { unmount } = render(
      <MemoryRouter initialEntries={['/alumni']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/İESÜ Mezunlar Portalı/i).length).toBeGreaterThan(0);
    }, { timeout: 4000 });
    unmount();

    useAppStore.setState({ currentUser: adminUser, userRole: 'admin', activePortalBranch: 'student' });
    render(
      <MemoryRouter initialEntries={['/student']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Kariyer Geliştirme Koordinatörlüğü/i).length).toBeGreaterThan(0);
    }, { timeout: 4000 });
  });
});
