import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CMSCareerOpportunities from '../components/admin/CMSCareerOpportunities';
import AdminDashboard from '../components/AdminDashboard';
import useAppStore from '../store/useAppStore';

describe('CMSCareerOpportunities Component & Separation from CMSJobs', () => {
  const mockOpportunities = [
    {
      id: 'OPP-101',
      title: 'Global Liderlik MT Programı',
      organization: 'Koç Holding',
      category: 'MT Programı',
      location: 'İstanbul (Hibrit)',
      deadline: '2026-10-01',
      targetAudience: 'Mühendislik & İİBF Son Sınıf',
      description: 'Liderlik ve rotasyon imkanı.',
      benefits: ['Rotasyon', 'Yüksek Maaş', 'Mentorluk'],
      status: 'Yayında',
      featured: true,
      applicantCount: 42
    },
    {
      id: 'OPP-102',
      title: 'Avrupa Birliği Erasmus+ Staj Konsorsiyumu',
      organization: 'IESU Dış İlişkiler',
      category: 'Global / Yurt Dışı',
      location: 'Almanya / Hollanda',
      deadline: '2026-11-15',
      targetAudience: 'Tüm Lisans Öğrencileri',
      description: 'Aylık hibe destekli yurt dışı staj olanağı.',
      benefits: ['Aylık Hibe', 'Dil Eğitimi'],
      status: 'Yayında',
      featured: false,
      applicantCount: 18
    }
  ];

  it('renders stats, tabs and career opportunities list properly', () => {
    render(
      <CMSCareerOpportunities
        careerOpportunities={mockOpportunities}
        setCareerOpportunities={vi.fn()}
      />
    );

    expect(screen.getByText(/Kariyer Fırsatları & Küresel Olanaklar Portalı/i)).toBeInTheDocument();
    expect(screen.getByText('Global Liderlik MT Programı')).toBeInTheDocument();
    expect(screen.getByText('Koç Holding')).toBeInTheDocument();
    expect(screen.getByText('Avrupa Birliği Erasmus+ Staj Konsorsiyumu')).toBeInTheDocument();
    expect(screen.getByText(/Yönetici Adayı & MT/i)).toBeInTheDocument();
    expect(screen.getByText(/Global & Erasmus\+/i)).toBeInTheDocument();
  });

  it('filters opportunities by category tabs', () => {
    render(
      <CMSCareerOpportunities
        careerOpportunities={mockOpportunities}
        setCareerOpportunities={vi.fn()}
      />
    );

    const mtTab = screen.getByRole('button', { name: /Yönetici Adayı \(MT\)/i });
    fireEvent.click(mtTab);

    expect(screen.getByText('Global Liderlik MT Programı')).toBeInTheDocument();
    expect(screen.queryByText('Avrupa Birliği Erasmus+ Staj Konsorsiyumu')).not.toBeInTheDocument();
  });

  it('AdminDashboard renders CMSCareerOpportunities for cms_jobs and CMSJobs for ilan distinctly', () => {
    const mockSetView = vi.fn();
    const mockSetSelectedUserId = vi.fn();

    const { rerender } = render(
      <AdminDashboard
        currentUser={{ id: 'admin1', name: 'Admin User' }}
        userRole="admin"
        academicRole="super_admin"
        setView={mockSetView}
        setSelectedUserId={mockSetSelectedUserId}
      />
    );

    // Navigate to Content category
    const contentCategoryBtn = screen.getByRole('button', { name: /İçerik & Platform/i });
    fireEvent.click(contentCategoryBtn);

    // Click "Kariyer Fırsatları" (cms_jobs)
    const careerOppTab = screen.getByRole('button', { name: /Kariyer Fırsatları/i });
    fireEvent.click(careerOppTab);

    // Must render CMSCareerOpportunities header and NOT standard CMSJobs table
    expect(screen.getByText(/Kariyer Fırsatları & Küresel Olanaklar Portalı/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Yeni Fırsat Yayınla/i })).toBeInTheDocument();

    // Now click "İş & Staj İlanları" (ilan)
    const jobsTab = screen.getByRole('button', { name: /İş & Staj İlanları/i });
    fireEvent.click(jobsTab);

    // Must render standard CMSJobs header and NOT CMSCareerOpportunities
    expect(screen.queryByText(/Kariyer Fırsatları & Küresel Olanaklar Portalı/i)).not.toBeInTheDocument();
    expect(screen.getByText(/İş İlanları ve Onay Havuzu/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Yeni İlan Ekle/i })).toBeInTheDocument();
  });
});
