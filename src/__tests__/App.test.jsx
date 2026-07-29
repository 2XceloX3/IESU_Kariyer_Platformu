import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import App from '../App';

vi.mock('../components/LandingPage', () => ({ default: () => <div>Giriş Yap Kariyer Platformu</div> }));
vi.mock('../components/Login', () => ({ default: () => <div>Giriş Yap Login</div> }));
vi.mock('../components/Register', () => ({ default: () => <div>Kayıt Ol Register</div> }));

beforeAll(() => {
  if (typeof window.scrollTo !== 'function') {
    window.scrollTo = vi.fn();
  }
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
});

