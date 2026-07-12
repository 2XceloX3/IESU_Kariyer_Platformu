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

    expect(screen.getByText('John Doe')).toBeTruthy();
    const ogrenciNodes = screen.getAllByText(/Öğrenci/i);
    expect(ogrenciNodes.length).toBeGreaterThan(0);
    // It should not show Super Admin panel switch
    expect(screen.queryByText(/Panel Geçişi/i)).toBeNull();
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

    expect(screen.getByText(/Kariyer Geliştirme/i)).toBeTruthy();
    
    const superAdminNodes = screen.getAllByText(/Süper Admin/i);
    expect(superAdminNodes.length).toBeGreaterThan(0);
    
    // It should show panel switches
    expect(screen.getByText(/PANEL GE/i)).toBeTruthy();
    
    const adminButton = screen.getByText(/Yönetim/i);
    expect(adminButton).toBeTruthy();
    
    // Check click logic for view change
    fireEvent.click(adminButton);
    expect(setView).toHaveBeenCalledWith('admin');
  });
});
