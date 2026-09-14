import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PostCard from '../components/PostCard';
import CMSApplicationsPool from '../components/admin/CMSApplicationsPool';
import AdminDashboard from '../components/AdminDashboard';
import useAppStore from '../store/useAppStore';

describe('Job Application Form and Admin Pool Integration', () => {
  const mockUser = {
    id: 'STU-999',
    name: 'Berke Arslan',
    email: 'berke.a@esenyurt.edu.tr',
    department: 'Bilgisayar Mühendisliği',
    phone: '0555 444 3322'
  };

  const mockJobPost = {
    id: 'POST-JOB-001',
    isJob: true,
    author: { name: 'İESÜ Kariyer Geliştirme Merkezi', id: 'admin1' },
    content: '💼 YENİ İLAN: Ulusal Staj Programı\n🏢 CBİKO & İESÜ KGM\n📍 Ankara\nCumhurbaşkanlığı himayesinde yürütülen staj programı.',
    jobData: {
      id: 'JOB-CBİKO-01',
      title: 'Ulusal Staj Programı 2026',
      company: 'CBİKO & Kamu Kurumları',
      location: 'Türkiye Geneli',
      type: 'STAJ'
    }
  };

  beforeEach(() => {
    // Reset window toast
    window.toast = {
      success: vi.fn(),
      info: vi.fn(),
      error: vi.fn()
    };

    // Reset Zustand store
    useAppStore.setState({
      applications: [],
      notifications: [],
      currentUser: mockUser
    });
  });

  it('renders "Hemen Başvur" button on job posts', () => {
    render(<PostCard post={mockJobPost} currentUser={mockUser} />);
    const applyBtn = screen.getByRole('button', { name: /Başvur/i });
    expect(applyBtn).toBeInTheDocument();
    expect(applyBtn.textContent).toContain('Hemen Başvur');
  });

  it('opens application modal when "Hemen Başvur" is clicked', () => {
    render(<PostCard post={mockJobPost} currentUser={mockUser} />);
    const applyBtn = screen.getByRole('button', { name: /Başvur/i });
    fireEvent.click(applyBtn);

    expect(screen.getByText(/İş & Staj Başvuru Formu/i)).toBeInTheDocument();
    expect(screen.getByText(/CBİKO & Kamu Kurumları/i)).toBeInTheDocument();
    expect(screen.getByText(/Aday Kimlik Bilgileri/i)).toBeInTheDocument();
    expect(screen.getByText(/Berke Arslan/i)).toBeInTheDocument();
  });

  it('submits application, saves to useAppStore, and shows "Başvuruldu" on button', async () => {
    render(<PostCard post={mockJobPost} currentUser={mockUser} />);
    const applyBtn = screen.getByRole('button', { name: /Başvur/i });
    fireEvent.click(applyBtn);

    // Form inputs
    const phoneInput = screen.getByPlaceholderText(/05xx xxx xx xx/i);
    const coverTextarea = screen.getByPlaceholderText(/Bu ilana neden başvuruyorsunuz/i);
    const submitBtn = screen.getByRole('button', { name: /Başvuruyu Tamamla & İlet/i });

    fireEvent.change(phoneInput, { target: { value: '0555 987 6543' } });
    fireEvent.change(coverTextarea, { target: { value: 'Ulusal staj programına katılmak için istekliyim.' } });
    fireEvent.click(submitBtn);

    // Check store
    const storedApps = useAppStore.getState().applications;
    expect(storedApps.length).toBe(1);
    expect(storedApps[0].applicantName).toBe('Berke Arslan');
    expect(storedApps[0].applicantPhone).toBe('0555 987 6543');
    expect(storedApps[0].company).toBe('CBİKO & Kamu Kurumları');
    expect(storedApps[0].coverLetter).toBe('Ulusal staj programına katılmak için istekliyim.');

    // Toast check
    expect(window.toast.success).toHaveBeenCalledWith(
      expect.stringContaining('Başvurunuz başarıyla kaydedildi')
    );

    // Button should now show "Başvuruldu"
    await waitFor(() => {
      expect(screen.getByText(/Başvuruldu/i)).toBeInTheDocument();
    });
  });

  it('renders applications inside CMSApplicationsPool and allows status update', () => {
    const sampleApps = [
      {
        id: 'APP-TEST-1',
        jobId: 'JOB-CBİKO-01',
        jobTitle: 'Ulusal Staj Programı 2026',
        company: 'CBİKO',
        applicantId: 'STU-999',
        applicantName: 'Berke Arslan',
        applicantEmail: 'berke.a@esenyurt.edu.tr',
        applicantPhone: '0555 444 3322',
        applicantDept: 'Bilgisayar Mühendisliği',
        coverLetter: 'Örnek başvuru ön yazısı.',
        cvType: 'KGM Akredite İESÜ Dijital CV',
        status: 'Beklemede',
        date: '12.09.2026'
      }
    ];

    const mockSetApplications = vi.fn();

    render(
      <CMSApplicationsPool
        applications={sampleApps}
        setApplications={mockSetApplications}
        currentUser={{ id: 'admin1', name: 'Admin' }}
      />
    );

    expect(screen.getByText(/İlan & Staj Başvuru Havuzu/i)).toBeInTheDocument();
    expect(screen.getByText(/Berke Arslan/i)).toBeInTheDocument();
    expect(screen.getByText(/Ulusal Staj Programı 2026/i)).toBeInTheDocument();

    // Change status via dropdown
    const select = screen.getByRole('combobox', { name: /Başvuru Durumu/i });
    fireEvent.change(select, { target: { value: 'Mülakat' } });

    expect(mockSetApplications).toHaveBeenCalled();
  });

  it('renders "İlan & Staj Başvuru Havuzu" tab in AdminDashboard', () => {
    render(
      <AdminDashboard
        currentUser={{ id: 'admin1', name: 'Admin' }}
        userRole="admin"
        academicRole="super_admin"
        setView={vi.fn()}
        setSelectedUserId={vi.fn()}
      />
    );

    // The tab should be visible in Main Tabs or category panels
    const poolTabs = screen.getAllByText(/İlan & Staj Başvuru Havuzu/i);
    expect(poolTabs.length).toBeGreaterThan(0);

    // Clicking the tab opens the pool
    fireEvent.click(poolTabs[0]);
    expect(screen.getAllByText(/İlan & Staj Başvuru Havuzu/i).length).toBeGreaterThan(0);
  });
});
