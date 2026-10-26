import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StudentProfileUpdate from '../components/profile/StudentProfileUpdate';

// Mocks
vi.mock('../components/Logo', () => ({
  default: () => <div data-testid="logo-mock">Logo</div>
}));

vi.mock('../components/shared/SafeAvatar', () => ({
  default: ({ name, className }) => <div data-testid="safe-avatar" className={className}>{name}</div>
}));

vi.mock('../components/SubPanelFloatingDock', () => ({
  default: () => <div data-testid="floating-dock">Dock</div>
}));

vi.mock('../components/AICVBuilder', () => ({
  default: () => <div data-testid="ai-cv-builder">AICVBuilder</div>
}));

vi.mock('../components/shared/Toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}));

describe('StudentProfileUpdate - LinkedIn & Kariyer.net Standards Verification', () => {
  const mockSetView = vi.fn();
  const mockSetCurrentUser = vi.fn();

  const mockStudentUser = {
    id: 'STU-TEST-001',
    name: 'Berkay Demir',
    studentNo: '2023010999',
    email: 'berkay.demir@ogr.esenyurt.edu.tr',
    phone: '0555 999 8877',
    faculty: 'Mühendislik ve Mimarlık Fakültesi',
    department: 'Bilgisayar Mühendisliği',
    year: '3. Sınıf',
    gpa: 3.65,
    militaryStatus: 'Tecilli',
    militaryDate: '2028-06-30',
    hasDrivingLicense: true,
    drivingLicenseClasses: ['B (Otomobil)'],
    experiences: [
      {
        id: 'exp-1',
        company: 'Savunma Teknolojileri A.Ş.',
        role: 'Aday Yazılım Mühendisi',
        type: 'Staj',
        location: 'İstanbul',
        startDate: '2025-06-01',
        endDate: '2025-08-30',
        isCurrent: false,
        description: 'C++ ve Qt ile yer kontrol istasyonu arayüz modülleri geliştirildi.',
        skills: ['C++', 'Qt', 'Git']
      }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Otonom Drone İniş Sistemi',
        role: 'Proje Lideri',
        date: '2025',
        liveUrl: 'https://drone.iesu.edu.tr',
        githubUrl: 'https://github.com/berkay/drone-landing',
        description: 'Görüntü işleme tabanlı hassas iniş algoritması.',
        technologies: ['Python', 'OpenCV']
      }
    ],
    certificates: [
      {
        id: 'cert-1',
        title: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        issueDate: '2025-04',
        credentialId: 'AWS-99418',
        credentialUrl: 'https://aws.amazon.com/verify'
      }
    ],
    languageExams: [
      {
        id: 'lexam-1',
        examType: 'YDS (ÖSYM)',
        score: '87.5',
        year: '2025',
        status: 'Doğrulandı'
      }
    ],
    references: [
      {
        id: 'ref-1',
        fullName: 'Prof. Dr. Deniz Demir',
        organization: 'İstanbul Esenyurt Üniversitesi',
        title: 'Bölüm Başkanı',
        phone: '0212 911 00 00',
        email: 'denizdemir@esenyurt.edu.tr',
        type: 'Akademik'
      }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all 11 LinkedIn & Kariyer.net tabs correctly', () => {
    render(
      <StudentProfileUpdate
        setView={mockSetView}
        currentUser={mockStudentUser}
        setCurrentUser={mockSetCurrentUser}
        userRole="student"
      />
    );

    // Verify all tabs exist in the DOM
    expect(screen.getByText('Akademik Eğitim & ÇAP')).toBeDefined();
    expect(screen.getByText('Kişisel, Askerlik & Ehliyet')).toBeDefined();
    expect(screen.getByText('İş & Staj Deneyimleri')).toBeDefined();
    expect(screen.getByText('Projeler & Bitirme Tezi')).toBeDefined();
    expect(screen.getByText('Sertifikalar & Lisanslar')).toBeDefined();
    expect(screen.getByText('Yetkinlikler & Dil Sınavları')).toBeDefined();
    expect(screen.getByText('Kariyer & Ön Yazı (Kapak)')).toBeDefined();
    expect(screen.getByText('Referanslar')).toBeDefined();
    expect(screen.getByText('Kulüp & Topluluklar')).toBeDefined();
    expect(screen.getByText('Özgeçmiş (PDF) & Portfolyo')).toBeDefined();
    expect(screen.getByText('Gizlilik & İzinler')).toBeDefined();
  });

  it('navigates to Work Experiences tab and displays existing experience', () => {
    render(
      <StudentProfileUpdate
        setView={mockSetView}
        currentUser={mockStudentUser}
        setCurrentUser={mockSetCurrentUser}
        userRole="student"
      />
    );

    // Click on Work & Internship Experiences tab
    const expTab = screen.getByText('İş & Staj Deneyimleri');
    fireEvent.click(expTab);

    // Check if the experience title and company are displayed
    expect(screen.getByText('Aday Yazılım Mühendisi')).toBeDefined();
    expect(screen.getByText(/Savunma Teknolojileri A\.Ş\./)).toBeDefined();
    expect(screen.getByText(/C\+\+ ve Qt ile yer kontrol istasyonu/)).toBeDefined();
  });

  it('navigates to Personal, Military & Driving License tab and displays legal fields', () => {
    render(
      <StudentProfileUpdate
        setView={mockSetView}
        currentUser={mockStudentUser}
        setCurrentUser={mockSetCurrentUser}
        userRole="student"
      />
    );

    // Click on Personal tab
    const personalTab = screen.getByText('Kişisel, Askerlik & Ehliyet');
    fireEvent.click(personalTab);

    // Verify military & driving license elements exist
    expect(screen.getByText(/Askerlik Durumu/i)).toBeDefined();
    expect(screen.getByText('Sürücü Belgesi (Ehliyet) Var mı?')).toBeDefined();
    expect(screen.getByText('B (Otomobil)')).toBeDefined();
  });

  it('navigates to Projects tab and displays project card', () => {
    render(
      <StudentProfileUpdate
        setView={mockSetView}
        currentUser={mockStudentUser}
        setCurrentUser={mockSetCurrentUser}
        userRole="student"
      />
    );

    // Click Projects tab
    const projTab = screen.getByText('Projeler & Bitirme Tezi');
    fireEvent.click(projTab);

    expect(screen.getByText('Otonom Drone İniş Sistemi')).toBeDefined();
    expect(screen.getByText('Görüntü işleme tabanlı hassas iniş algoritması.')).toBeDefined();
  });

  it('navigates to Certificates tab and displays certificate card', () => {
    render(
      <StudentProfileUpdate
        setView={mockSetView}
        currentUser={mockStudentUser}
        setCurrentUser={mockSetCurrentUser}
        userRole="student"
      />
    );

    // Click Certificates tab
    const certTab = screen.getByText('Sertifikalar & Lisanslar');
    fireEvent.click(certTab);

    expect(screen.getByText('AWS Certified Cloud Practitioner')).toBeDefined();
    expect(screen.getByText(/Amazon Web Services/)).toBeDefined();
  });

  it('saves changes and triggers custom event iesu_user_profile_updated', () => {
    const eventSpy = vi.fn();
    window.addEventListener('iesu_user_profile_updated', eventSpy);

    render(
      <StudentProfileUpdate
        setView={mockSetView}
        currentUser={mockStudentUser}
        setCurrentUser={mockSetCurrentUser}
        userRole="student"
      />
    );

    // Click Save button
    const saveButton = screen.getByText('Değişiklikleri Kaydet');
    fireEvent.click(saveButton);

    expect(eventSpy).toHaveBeenCalled();
    const eventDetail = eventSpy.mock.calls[0][0].detail;
    expect(eventDetail.name).toBe('Berkay Demir');
    expect(eventDetail.experiences.length).toBeGreaterThan(0);
    expect(eventDetail.projects.length).toBeGreaterThan(0);
    expect(eventDetail.certificates.length).toBeGreaterThan(0);

    window.removeEventListener('iesu_user_profile_updated', eventSpy);
  });
});
