import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import App from '../App';
import useAppStore from '../store/useAppStore';

vi.mock('../utils/firebase', () => ({ auth: {}, db: {} }));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (_auth, callback) => {
    callback(null);
    return () => {};
  },
}));
vi.mock('firebase/firestore', () => ({ doc: vi.fn(), getDoc: vi.fn() }));
vi.mock('../components/LandingPage', () => ({ default: () => <div>Giriş Yap Kariyer Platformu</div> }));
vi.mock('../components/Login', () => ({ default: () => <div>Giriş Yap Login</div> }));
vi.mock('../components/Register', () => ({ default: () => <div>Kayıt Ol Register</div> }));
vi.mock('../components/ExploreFeed', () => ({ default: ({ posts }) => <div>Explore posts: {posts?.length ?? 'missing'}</div> }));
vi.mock('../components/StudentFeed', () => ({ default: () => <div>Öğrenci Portalı</div> }));

beforeAll(() => {
  if (typeof window.scrollTo !== 'function') {
    window.scrollTo = vi.fn();
  }
});

beforeEach(() => {
  window.localStorage.clear();
  useAppStore.setState({ userRole: null });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('App Component', () => {
  it('renders landing page by default', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
    await waitFor(() => {
      expect(document.body.textContent).toMatch(/Kariyer|Giriş|Esenyurt|Üniversite|Portal/i);
    }, { timeout: 8000 });
  }, 15000);

  it('renders login view on /login route', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
    await waitFor(() => {
      expect(document.body.textContent).toMatch(/Giriş|Login|Portala|Öğrenci/i);
    }, { timeout: 5000 });
  });
  
  it('renders register view on /register route', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
    await waitFor(() => {
      expect(document.body.textContent).toMatch(/Kayıt|Register|Firma|Hesap/i);
    }, { timeout: 5000 });
  });

  it('redirects direct admin URLs to login without creating an admin session', async () => {
    render(
      <MemoryRouter initialEntries={['/admin_cms']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Giriş Yap Login')).toBeInTheDocument();
    }, { timeout: 5000 });

    expect(useAppStore.getState().userRole).not.toBe('admin');
    expect(window.localStorage.getItem('igu_mock_user')).toBeNull();
  });

  it('provides the store feed to an authenticated explore route', async () => {
    const testUser = JSON.stringify({
      id: 'student-test',
      name: 'Test Öğrenci',
      role: 'student',
    });
    window.localStorage.setItem('iesu_mock_user', testUser);
    window.localStorage.setItem('igu_mock_user', testUser);
    useAppStore.setState({
      userRole: 'student',
      posts: [{ id: 'post-1', text: 'Kariyer içeriği' }],
    });

    render(
      <MemoryRouter initialEntries={['/explore']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Explore posts: 1')).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('renders Super Admin Portal with 3-column layout on /explore route when authenticated as admin', async () => {
    window.localStorage.setItem('iesu_mock_user', JSON.stringify({
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Merkezi',
      role: 'admin',
    }));
    useAppStore.setState({
      userRole: 'admin',
      activePortalBranch: 'admin',
      posts: [{ id: 'post-1', text: 'Kariyer içeriği' }],
    });

    render(
      <MemoryRouter initialEntries={['/explore']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/👑 SÜPER YÖNETİCİ & KGM KONTROL PORTALI/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('does not trust a stored admin role outside development', async () => {
    vi.stubEnv('DEV', false);
    window.localStorage.setItem('igu_mock_user', JSON.stringify({
      id: 'forged-admin',
      name: 'Sahte Yönetici',
      role: 'admin',
    }));
    useAppStore.setState({ userRole: 'admin' });

    render(
      <MemoryRouter initialEntries={['/admin_cms']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Giriş Yap Login')).toBeInTheDocument();
    }, { timeout: 5000 });

    expect(useAppStore.getState().userRole).toBeNull();
    expect(window.localStorage.getItem('igu_mock_user')).toBeNull();
  });
});
