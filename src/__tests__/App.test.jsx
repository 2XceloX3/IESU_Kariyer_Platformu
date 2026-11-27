import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import App from '../App';
import Logo from '../components/Logo';
import useAppStore from '../store/useAppStore';

const authState = vi.hoisted(() => ({ user: null }));
vi.mock('../utils/firebase', () => ({
  auth: { get currentUser() { return authState.user; } },
  db: {},
}));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (_auth, callback) => {
    callback(authState.user);
    return () => {};
  },
}));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn().mockResolvedValue({ exists: () => false, data: () => ({}) }),
  getDocs: vi.fn().mockResolvedValue({ forEach: () => {}, docs: [] }),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  setDoc: vi.fn().mockResolvedValue(undefined),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  serverTimestamp: vi.fn(() => new Date().toISOString()),
}));
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
  authState.user = null;
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
    expect(window.localStorage.getItem('iesu_mock_user')).toBeNull();
  });

  it('renders the student portal for an authenticated student', async () => {
    const testUser = JSON.stringify({
      id: 'student-test',
      name: 'Test Öğrenci',
      role: 'student',
    });
    window.localStorage.setItem('iesu_mock_user', testUser);
    useAppStore.setState({
      userRole: 'student',
      posts: [{ id: 'post-1', text: 'Kariyer içeriği' }],
    });

    render(
      <MemoryRouter initialEntries={['/student']}>
        <App />
      </MemoryRouter>
    );

    // Beehive architecture: authenticated students → StudentHive
    // StudentHive defaults to 'feed' view → mocked StudentFeed → 'Öğrenci Portalı'
    await waitFor(() => {
      expect(document.body.textContent).toMatch(/Öğrenci|Kariyer|Portal/i);
    }, { timeout: 10000 });
  });

  it('renders Super Admin Portal with 3-column layout on /explore route when authenticated as admin', async () => {
    authState.user = { uid: 'firebase-admin-uid' };
    window.localStorage.setItem('iesu_mock_user', JSON.stringify({
      id: 'self',
      uid: 'firebase-admin-uid',
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
    window.localStorage.setItem('iesu_mock_user', JSON.stringify({
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
    expect(window.localStorage.getItem('iesu_mock_user')).toBeNull();
  });

  it('rejects sessionStorage iesu_admin_session console bypass on /admin_cms', async () => {
    window.sessionStorage.setItem('iesu_admin_session', 'active');
    window.sessionStorage.setItem('iesu_mock_user', JSON.stringify({
      id: 'attacker-123',
      name: 'Console Attacker',
      role: 'admin'
    }));

    render(
      <MemoryRouter initialEntries={['/admin_cms']}>
        <App />
      </MemoryRouter>
    );

    // Bypass must fail and redirect to Login
    await waitFor(() => {
      expect(screen.getByText('Giriş Yap Login')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('enforces positive whitelist: student accessing /company is restricted to StudentHive', async () => {
    window.sessionStorage.setItem('iesu_mock_user', JSON.stringify({
      id: 'student-wl-1',
      name: 'Öğrenci Whitelist',
      role: 'student'
    }));
    useAppStore.setState({ userRole: 'student' });

    render(
      <MemoryRouter initialEntries={['/company']}>
        <App />
      </MemoryRouter>
    );

    // Instead of CompanyHive, positive whitelist renders designated StudentHive
    await waitFor(() => {
      expect(document.body.textContent).toMatch(/Öğrenci|Kariyer|Portal/i);
    }, { timeout: 8000 });
  });

  it('toggles global dark mode and syncs the dark class on document.documentElement', () => {
    useAppStore.getState().setDarkMode(false);
    expect(useAppStore.getState().darkMode).toBe(false);
    expect(useAppStore.getState().theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    useAppStore.getState().toggleDarkMode();
    expect(useAppStore.getState().darkMode).toBe(true);
    expect(useAppStore.getState().theme).toBe('dark');
    expect(window.localStorage.getItem('iesu_theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    useAppStore.getState().toggleDarkMode();
    expect(useAppStore.getState().darkMode).toBe(false);
    expect(useAppStore.getState().theme).toBe('light');
    expect(window.localStorage.getItem('iesu_theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('switches Logo component to white logo variant in dark mode', () => {
    useAppStore.getState().setDarkMode(false);
    const { container, rerender } = render(<Logo color="emerald" />);
    const imgLight = container.querySelector('img[data-iesu-logo="true"]');
    expect(imgLight).toHaveAttribute('data-logo-variant', 'emerald');

    useAppStore.getState().setDarkMode(true);
    rerender(<Logo color="emerald" />);
    const imgDark = container.querySelector('img[data-iesu-logo="true"]');
    expect(imgDark).toHaveAttribute('data-logo-variant', 'white');
    expect(imgDark.className).toContain('brightness-0 invert');
  });

  it('routes authenticated Super Admin to Alumni Portal (/alumni) instead of AdminDashboard', async () => {
    authState.user = { uid: 'firebase-admin-uid' };
    window.localStorage.setItem('iesu_mock_user', JSON.stringify({
      id: 'admin_1513',
      uid: 'firebase-admin-uid',
      name: 'Kariyer Geliştirme Koordinatörlüğü',
      role: 'admin',
    }));
    useAppStore.setState({
      userRole: 'admin',
      activePortalBranch: 'alumni',
      posts: [{ id: 'post-alumni-1', content: 'Mezun akışı paylaşımı' }],
    });

    render(
      <MemoryRouter initialEntries={['/alumni']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/MEZUN AĞI & KARİYER PORTALI/i)).toBeInTheDocument();
    }, { timeout: 10000 });

    expect(screen.queryByText(/Yönetici Paneli/i)).not.toBeInTheDocument();
    expect(useAppStore.getState().activePortalBranch).toBe('alumni');
  }, 15000);

  it('routes authenticated Super Admin to Staff Portal (/staff) and keeps StaffBottomDock inside StaffPortal', async () => {
    authState.user = { uid: 'firebase-admin-uid' };
    window.localStorage.setItem('iesu_mock_user', JSON.stringify({
      id: 'admin_1513',
      uid: 'firebase-admin-uid',
      name: 'Kariyer Geliştirme Koordinatörlüğü',
      role: 'admin',
    }));
    useAppStore.setState({
      userRole: 'admin',
      activePortalBranch: 'staff',
      posts: [{ id: 'post-staff-1', content: 'Kurumsal personel paylaşımı' }],
    });

    render(
      <MemoryRouter initialEntries={['/staff']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/KURUMSAL PERSONEL PORTALI/i)).toBeInTheDocument();
      expect(screen.getByTestId('staff-bottom-dock')).toBeInTheDocument();
    }, { timeout: 10000 });

    const dock = screen.getByTestId('staff-bottom-dock');
    // Icon-only dock without duplicate message button (messages moved to bottom-right staff chat widget)
    expect(within(dock).queryByRole('button', { name: /Mesajlar/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Personel Profilim/i)).not.toBeInTheDocument();

    // Bottom-right floating widget renders Indigo Staff Messaging Area (not Super Admin Crown)
    const staffChatBtn = screen.getByTestId('staff-floating-chat-btn');
    expect(staffChatBtn).toHaveAttribute('title', 'Personel Mesaj & Talep Merkezi');
    fireEvent.click(staffChatBtn);
    await waitFor(() => {
      expect(screen.getByTestId('staff-floating-chat-panel')).toBeInTheDocument();
      expect(screen.getByText(/Personel Mesaj Alanı/i)).toBeInTheDocument();
    });

    // Clicking Onaylar opens dedicated full-width workspace (not squeezed in 3-column feed)
    fireEvent.click(within(dock).getByRole('button', { name: /Onaylar/i }));
    await waitFor(() => {
      expect(screen.getByTestId('staff-fullwidth-workspace')).toBeInTheDocument();
      expect(screen.getAllByText(/Onay & İşlem Kuyruğu/i).length).toBeGreaterThan(0);
    });

    // Clicking Profilim navigates to dedicated full-screen UserProfile page (staying in staff branch)
    fireEvent.click(within(dock).getByRole('button', { name: /Profilim/i }));
    await waitFor(() => {
      expect(screen.getByTestId('staff-bottom-dock')).toBeInTheDocument();
      expect(screen.getAllByText(/Kurumsal Personel & KGM Portalı/i).length).toBeGreaterThan(0);
    });

    // Returning via Ana Sayfa in StaffBottomDock comes straight back to StaffPortal stream
    fireEvent.click(within(screen.getByTestId('staff-bottom-dock')).getByRole('button', { name: /Ana Sayfa/i }));
    await waitFor(() => {
      expect(screen.getByText(/KURUMSAL PERSONEL PORTALI/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/SÜPER YÖNETİCİ & KGM KONTROL PORTALI/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Yönetici Paneli/i)).not.toBeInTheDocument();
    expect(useAppStore.getState().activePortalBranch).toBe('staff');
  }, 15000);
});


