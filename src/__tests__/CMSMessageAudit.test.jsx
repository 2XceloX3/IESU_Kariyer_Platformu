import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CMSMessageAudit from '../components/admin/CMSMessageAudit';

describe('CMSMessageAudit & Central Messaging Audit System', () => {
  const superAdminUser = {
    id: 'admin_1513',
    name: 'Süper Yönetici',
    role: 'admin'
  };

  const regularStudentUser = {
    id: 'stu_123',
    name: 'Ahmet Yılmaz',
    role: 'student'
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('denies access to non-superadmin users and displays security notice', () => {
    render(<CMSMessageAudit currentUser={regularStudentUser} />);
    expect(screen.getByText('Erişim Yetkisi Bulunmuyor')).toBeInTheDocument();
    expect(screen.getByText(/Bu denetim masası yalnızca Süper Yönetici yetkisine sahip hesaplar tarafından görüntülenebilir/i)).toBeInTheDocument();
  });

  it('grants full access to superadmin user and renders audit table & metric cards', () => {
    render(<CMSMessageAudit currentUser={superAdminUser} />);
    expect(screen.getByText('Merkezi Mesajlaşma & İletişim Denetim Masası')).toBeInTheDocument();
    expect(screen.getAllByText('Toplam Mesaj')[0]).toBeInTheDocument();
    expect(screen.getByText('Aktif İletişimci')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/İsim, bölüm, e-posta veya ID ara/i)).toBeInTheDocument();
  });

  it('filters users in table based on search input', () => {
    render(<CMSMessageAudit currentUser={superAdminUser} />);
    const searchInput = screen.getByPlaceholderText(/İsim, bölüm, e-posta veya ID ara/i);
    
    // Type a specific user name
    fireEvent.change(searchInput, { target: { value: 'Zeynep' } });
    expect(screen.getByText('Zeynep Kaya')).toBeInTheDocument();
  });

  it('opens conversation inspection modal when clicking on a user row', () => {
    render(<CMSMessageAudit currentUser={superAdminUser} />);
    
    // Click on the first "Görüşmeleri İncele" button
    const reviewBtns = screen.getAllByText(/Görüşmeleri İncele/i);
    fireEvent.click(reviewBtns[0]);

    // Modal should appear
    expect(screen.getByText(/Mesajlaştığı Kişiler/i)).toBeInTheDocument();
  });

  it('allows super admin to export audit logs to CSV', () => {
    const originalToast = window.toast;
    window.toast = { success: vi.fn(), info: vi.fn(), error: vi.fn() };

    render(<CMSMessageAudit currentUser={superAdminUser} />);
    const exportBtn = screen.getByText(/Denetim Kayıtlarını İndir/i);
    fireEvent.click(exportBtn);

    expect(window.toast.success).toHaveBeenCalledWith(expect.stringContaining('CSV'));
    window.toast = originalToast;
  });
});
