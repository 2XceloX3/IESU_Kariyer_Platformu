import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import StudentSettings from '../components/student/StudentSettings';

describe('StudentSettings Component', () => {
  it('renders the main heading', () => {
    render(
      <MemoryRouter>
        <StudentSettings />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Ayarlar' })).toBeInTheDocument();
  });

  it('renders all settings sections', () => {
    render(
      <MemoryRouter>
        <StudentSettings />
      </MemoryRouter>
    );
    expect(screen.getByText('Hesap ve Güvenlik')).toBeInTheDocument();
    expect(screen.getByText('Bildirimler')).toBeInTheDocument();
    expect(screen.getByText('Ödemeler')).toBeInTheDocument();
  });

  it('renders links with correct href attributes', () => {
    render(
      <MemoryRouter>
        <StudentSettings />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /şifre değiştir/i })).toHaveAttribute('href', '/change-password');
    expect(screen.getByRole('link', { name: /güvenlik ayarları/i })).toHaveAttribute('href', '/security-settings');
    expect(screen.getByRole('link', { name: /bildirim tercihleri/i })).toHaveAttribute('href', '/notification-preferences');
    expect(screen.getByRole('link', { name: /fatura bilgileri/i })).toHaveAttribute('href', '/billing-info');
  });

  it('renders the item descriptions', () => {
    render(
      <MemoryRouter>
        <StudentSettings />
      </MemoryRouter>
    );
    expect(screen.getByText('Hesap şifrenizi güncellemek için')).toBeInTheDocument();
    expect(screen.getByText('2FA ve diğer güvenlik seçenekleri')).toBeInTheDocument();
    expect(screen.getByText('Hangi bildirimleri almak istediğinizi seçin')).toBeInTheDocument();
    expect(screen.getByText('Ödeme yöntemleri ve geçmişi')).toBeInTheDocument();
  });
});
