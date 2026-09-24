import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import TopProfileMenu from '../components/TopProfileMenu';

describe('TopProfileMenu Component', () => {
  it('renders student profile menu correctly', () => {
    const dummyUser = { id: 'usr-1', name: 'John Doe', isSuperAdmin: false };
    const setView = vi.fn();

    render(
      <MemoryRouter>
        <TopProfileMenu currentUser={dummyUser} userRole="student" setView={setView} />
      </MemoryRouter>
    );

    // Open menu
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
    const ogrenciNodes = screen.getAllByText(/Öğrenci/i);
    expect(ogrenciNodes.length).toBeGreaterThan(0);
    // It should render panel transition section for all user roles
    expect(screen.getByText(/Portallar|Panel Geçişi/i)).toBeTruthy();
  });

  it('renders super admin menu and shows panel switches', () => {
    const adminUser = { id: 'admin-1', name: 'Admin', isSuperAdmin: true };
    const setView = vi.fn();

    render(
      <MemoryRouter>
        <TopProfileMenu currentUser={adminUser} userRole="admin" setView={setView} />
      </MemoryRouter>
    );

    // Open menu
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getAllByText(/Kariyer Geliştirme/i).length).toBeGreaterThan(0);
    
    const superAdminNodes = screen.getAllByText(/Süper Admin/i);
    expect(superAdminNodes.length).toBeGreaterThan(0);
    
    // It should show panel switches
    expect(screen.getAllByText(/Panel/i).length).toBeGreaterThan(0);
    
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems.length).toBeGreaterThan(0);
    fireEvent.click(menuItems[1]);
    expect(setView).toHaveBeenCalledWith('admin');
  });
});
