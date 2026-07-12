import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

describe('App Component', () => {
  it('renders landing page by default', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
    // Assuming 'Kariyer Platformu' or 'Giriş' is on landing page
    expect(document.body.textContent).toMatch(/Kariyer|Giriş/i);
  });

  it('renders login view on /login route', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
    expect(document.body.textContent).toMatch(/Giriş|Login/i);
  });
  
  it('renders register view on /register route', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
    expect(document.body.textContent).toMatch(/Kayıt|Register/i);
  });
});
