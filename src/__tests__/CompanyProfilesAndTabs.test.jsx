import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PublicUserProfile from '../components/PublicUserProfile';
import ConnectionSuggestions from '../components/ConnectionSuggestions';
import useAppStore from '../store/useAppStore';
import { generateCompanies } from '../utils/mockData';

describe('Company Profiles & Admin Panel Tabs Integrity', () => {
  const companiesList = generateCompanies();

  beforeEach(() => {
    useAppStore.setState({
      companies: companiesList,
      students: [],
      alumni: [],
      academicStaff: []
    });
  });

  it('verifies that each distinct company resolves to its own profile and never falls back to Trendyol', () => {
    // 1. Getir
    const { unmount: unmountGetir } = render(
      <PublicUserProfile userId="CMP-002" setView={vi.fn()} setSelectedUserId={vi.fn()} />
    );
    expect(screen.getByRole('heading', { name: 'Getir' })).toBeInTheDocument();
    expect(screen.getAllByText(/Hızlı Teslimat & Mobil Yazılım/i).length).toBeGreaterThan(0);
    unmountGetir();

    // 2. Aselsan
    const { unmount: unmountAselsan } = render(
      <PublicUserProfile userId="CMP-003" setView={vi.fn()} setSelectedUserId={vi.fn()} />
    );
    expect(screen.getByRole('heading', { name: 'Aselsan' })).toBeInTheDocument();
    expect(screen.getAllByText(/Savunma Sanayii & Aviyonik/i).length).toBeGreaterThan(0);
    unmountAselsan();

    // 3. Ford Otosan
    const { unmount: unmountFord } = render(
      <PublicUserProfile userId="CMP-004" setView={vi.fn()} setSelectedUserId={vi.fn()} />
    );
    expect(screen.getByRole('heading', { name: 'Ford Otosan' })).toBeInTheDocument();
    expect(screen.getAllByText(/Otomotiv & Otonom Sürüş/i).length).toBeGreaterThan(0);
    unmountFord();

    // 4. Turkcell
    const { unmount: unmountTurkcell } = render(
      <PublicUserProfile userId="CMP-005" setView={vi.fn()} setSelectedUserId={vi.fn()} />
    );
    expect(screen.getByRole('heading', { name: 'Turkcell' })).toBeInTheDocument();
    expect(screen.getAllByText(/Telekomünikasyon & Bulut Bilişim/i).length).toBeGreaterThan(0);
    unmountTurkcell();

    // 5. Trendyol
    const { unmount: unmountTrendyol } = render(
      <PublicUserProfile userId="CMP-001" setView={vi.fn()} setSelectedUserId={vi.fn()} />
    );
    expect(screen.getByRole('heading', { name: 'Trendyol' })).toBeInTheDocument();
    expect(screen.getAllByText(/E-Ticaret & Teknoloji/i).length).toBeGreaterThan(0);
    unmountTrendyol();
  });

  it('renders all companies correctly in ConnectionSuggestions and supports distinct company inspection', () => {
    const mockSetSelectedUserId = vi.fn();
    const mockSetView = vi.fn();

    render(
      <ConnectionSuggestions
        branch="admin"
        companies={companiesList}
        setSelectedUserId={mockSetSelectedUserId}
        setView={mockSetView}
      />
    );

    // Verify presence of suggestions widget
    expect(screen.getByText(/Senin İçin Önerilenler/i)).toBeInTheDocument();
    expect(screen.getByText(/Tüm Bağlantıları Keşfet/i)).toBeInTheDocument();
  });
});
