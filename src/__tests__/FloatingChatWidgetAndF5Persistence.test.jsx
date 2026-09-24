import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FloatingChatWidget from '../components/FloatingChatWidget';
import AlumniFeed from '../components/AlumniFeed';
import KGMManagementConsole from '../components/admin/KGMManagementConsole';
import useAppStore from '../store/useAppStore';

describe('FloatingChatWidget F5 Persistence & Dock Theme Verification', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState({
      currentUser: null,
      userRole: 'alumni',
      applications: [],
      candidateChats: []
    });
  });

  it('does NOT render when user is not logged in or on landing page', () => {
    const { container } = render(<FloatingChatWidget setView={vi.fn()} currentView="landing" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders floating launcher button when user is logged in (F5 persistence simulation)', () => {
    localStorage.setItem('iesu_mock_user', JSON.stringify({
      id: 'ALU-999',
      name: 'F5 Mezun Test',
      role: 'alumni'
    }));

    render(<FloatingChatWidget setView={vi.fn()} currentView="alumni" />);

    const launcherBtn = screen.getByTitle(/Mezun Kariyer & Ağ İletişim Masası/i);
    expect(launcherBtn).toBeInTheDocument();
  });

  it('dynamically adapts to Academic portal leaf (GraduationCap & Purple) when viewing /academic', () => {
    localStorage.setItem('iesu_mock_user', JSON.stringify({
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Merkezi',
      role: 'admin'
    }));

    render(<FloatingChatWidget setView={vi.fn()} currentView="academic" />);

    // In academic portal, the title adapts to academic counseling
    const launcherBtn = screen.getByTitle(/Resmî Danışmanlık & Randevu Talepleri/i);
    expect(launcherBtn).toBeInTheDocument();
    expect(launcherBtn.className).toContain('via-[#4C1D95]');
  });

  it('dynamically adapts to Company portal leaf (Briefcase & Navy) when viewing /company', () => {
    localStorage.setItem('iesu_mock_user', JSON.stringify({
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Merkezi',
      role: 'admin'
    }));

    render(<FloatingChatWidget setView={vi.fn()} currentView="company" />);

    const launcherBtn = screen.getByTitle(/Aday Mesajları & İşe Alım Masası/i);
    expect(launcherBtn).toBeInTheDocument();
    expect(launcherBtn.className).toContain('via-[#0A2342]');
  });

  it('opens chat modal upon clicking launcher button and shows role-specific leaves', () => {
    localStorage.setItem('iesu_mock_user', JSON.stringify({
      id: 'STU-123',
      name: 'Test Öğrenci',
      role: 'student'
    }));

    render(<FloatingChatWidget setView={vi.fn()} currentView="student" />);

    const launcherBtn = screen.getByTitle(/Mesajlarım & Görüşmelerim/i);
    expect(launcherBtn).toBeInTheDocument();

    fireEvent.click(launcherBtn);

    expect(screen.getByText('Firma Mesajları')).toBeInTheDocument();
    expect(screen.getByText('Akademik Danışmanlık')).toBeInTheDocument();
  });

  it('opens chat modal in Alumni portal and renders alumni network messaging without error', () => {
    localStorage.setItem('iesu_mock_user', JSON.stringify({
      id: 'ALU-100',
      name: 'Mezun Kullanıcı',
      role: 'alumni'
    }));

    render(<FloatingChatWidget setView={vi.fn()} currentView="alumni" />);

    const launcherBtn = screen.getByTitle(/Mezun Kariyer & Ağ İletişim Masası/i);
    expect(launcherBtn).toBeInTheDocument();

    fireEvent.click(launcherBtn);

    expect(screen.getAllByText('Mezun & Mentörlük Ağı')[0]).toBeInTheDocument();
    expect(screen.getByText('Kurumsal İletişim')).toBeInTheDocument();
  });

  it('renders emerald dock in AlumniFeed without showing red admin styles', () => {
    const mockUser = {
      id: 'ALU-100',
      name: 'Mezun Kullanıcı',
      role: 'alumni'
    };

    render(
      <AlumniFeed
        currentUser={mockUser}
        userRole="alumni"
        setView={vi.fn()}
      />
    );

    const profileBtn = screen.getByTitle('Profilim');
    expect(profileBtn).toHaveClass('border-emerald-500');
  });

  it('renders Super Admin Root launcher with amber theme and opens 4-tab Central Evaluation Hub', () => {
    localStorage.setItem('iesu_mock_user', JSON.stringify({
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Koordinatörlüğü',
      role: 'admin'
    }));

    render(<FloatingChatWidget setView={vi.fn()} currentView="admin" />);

    // In admin portal, launcher adapts to Super Admin Crown & Amber root theme
    const launcherBtn = screen.getByTitle(/KGM Merkezi Yönetim & Değerlendirme Masası/i);
    expect(launcherBtn).toBeInTheDocument();
    expect(launcherBtn.className).toContain('to-amber-600');

    // Open the widget
    fireEvent.click(launcherBtn);

    // Verify all 4 Root Tabs are rendered
    expect(screen.getByText('Değerlendirme Havuzu')).toBeInTheDocument();
    expect(screen.getByText('Firma Talepleri')).toBeInTheDocument();
    expect(screen.getByText('Akademik Talepler')).toBeInTheDocument();
    expect(screen.getByText('ATS Aday Trafiği')).toBeInTheDocument();

    // Verify Evaluation Pool Metrics ribbon
    expect(screen.getByText('Bekleyen')).toBeInTheDocument();
    expect(screen.getByText('İncelenen')).toBeInTheDocument();
    expect(screen.getByText('Onaylanan')).toBeInTheDocument();
    expect(screen.getByText('Toplam')).toBeInTheDocument();
  });

  it('allows Super Admin to inspect request and submit official decision in Evaluation Desk', () => {
    localStorage.setItem('iesu_mock_user', JSON.stringify({
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Koordinatörlüğü',
      role: 'admin'
    }));

    render(<FloatingChatWidget setView={vi.fn()} currentView="admin" />);

    // Open widget
    const launcherBtn = screen.getByTitle(/KGM Merkezi Yönetim & Değerlendirme Masası/i);
    fireEvent.click(launcherBtn);

    // Click on the first evaluation request card
    const evalButtons = screen.getAllByText(/Karar Masası/i);
    expect(evalButtons.length).toBeGreaterThan(0);
    fireEvent.click(evalButtons[0]);

    // Verify Decision Section is rendered
    expect(screen.getByText(/KGM Resmî Yönetici Kararı & Notu/i)).toBeInTheDocument();
    expect(screen.getByText('✓ Onay Şablonu')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Onayla$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^İncele$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Reddet$/i })).toBeInTheDocument();

    // Click quick template chip
    fireEvent.click(screen.getByText('✓ Onay Şablonu'));

    // Click Onayla
    fireEvent.click(screen.getByRole('button', { name: /^Onayla$/i }));

    // Verify decision executed and status updated to Onaylandı
    expect(screen.getAllByText('Onaylandı').length).toBeGreaterThan(0);
  });

  it('navigates to yonetim_konsolu when clicking Yönetim Konsoluna Git button', () => {
    localStorage.setItem('iesu_mock_user', JSON.stringify({
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Koordinatörlüğü',
      role: 'admin'
    }));

    const mockSetView = vi.fn();
    render(<FloatingChatWidget setView={mockSetView} currentView="admin" />);

    // Open widget
    const launcherBtn = screen.getByTitle(/KGM Merkezi Yönetim & Değerlendirme Masası/i);
    fireEvent.click(launcherBtn);

    // Find and click "Yönetim Konsoluna Git" button
    const consoleBtn = screen.getByRole('button', { name: /Yönetim Konsoluna Git/i });
    expect(consoleBtn).toBeInTheDocument();
    fireEvent.click(consoleBtn);

    expect(mockSetView).toHaveBeenCalledWith('yonetim_konsolu');
  });

  it('renders KGMManagementConsole full panel, displays KPI metrics, and executes decisions', () => {
    const mockUser = {
      id: 'admin_1513',
      name: 'Kariyer Geliştirme Koordinatörlüğü',
      role: 'admin'
    };

    const mockSetView = vi.fn();
    render(<KGMManagementConsole setView={mockSetView} currentUser={mockUser} academicRole="super_admin" />);

    // Verify title and header
    expect(screen.getByText(/KGM Merkezi Yönetim Konsolu & Karar Masası/i)).toBeInTheDocument();
    expect(screen.getByText(/MERKEZİ YÖNETİM & DEĞERLENDİRME MASASI/i)).toBeInTheDocument();

    // Verify KPI ribbon
    expect(screen.getByText('TOPLAM HAVUZ')).toBeInTheDocument();
    expect(screen.getByText('BEKLEYEN KARAR')).toBeInTheDocument();

    // Verify branch tabs
    expect(screen.getByText('🌐 Tüm Ekosistem')).toBeInTheDocument();
    expect(screen.getByText(/Firma İş Birlikleri/i)).toBeInTheDocument();

    // Test quick decision execution on active item
    const approveBtn = screen.getByRole('button', { name: /^Onayla$/i });
    expect(approveBtn).toBeInTheDocument();

    fireEvent.click(approveBtn);

    // Verify status updated in active item
    expect(screen.getAllByText('Onaylandı').length).toBeGreaterThan(0);
  });
});
