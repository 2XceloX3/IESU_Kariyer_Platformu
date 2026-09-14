import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudentKGBPanel from '../components/StudentKGBPanel';

describe('StudentKGBPanel Component Integrity', () => {
  const mockSetView = vi.fn();
  const mockStudent = {
    id: 'STU-01',
    name: 'Ahmet Yılmaz',
    role: 'student',
    department: 'Bilgisayar Mühendisliği',
    faculty: 'Mühendislik ve Mimarlık Fakültesi',
    grade: '3. Sınıf',
    internships: 2,
    certifications: 3,
    workshopsAttended: 7,
    mentorMeetings: 4
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders student identity, scores, and badges correctly', () => {
    render(
      <MemoryRouter>
        <StudentKGBPanel setView={mockSetView} currentUser={mockStudent} userRole="student" previousView="student" />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Ahmet Yılmaz').length).toBeGreaterThan(0);
    expect(screen.getByText('KGB Onaylı')).toBeDefined();
    expect(screen.getByText('A+ Düzeyi (Pekiyi)')).toBeDefined();
  });

  it('navigates back to student portal on clicking return button', () => {
    render(
      <MemoryRouter>
        <StudentKGBPanel setView={mockSetView} currentUser={mockStudent} userRole="student" previousView="student" />
      </MemoryRouter>
    );

    const backButton = screen.getByTitle('Öğrenci Portalına Dön');
    fireEvent.click(backButton);
    expect(mockSetView).toHaveBeenCalledWith('student');
  });

  it('switches between tabs (stajlar, sertifikalar, etkinlikler, transkript)', () => {
    render(
      <MemoryRouter>
        <StudentKGBPanel setView={mockSetView} currentUser={mockStudent} userRole="student" previousView="student" />
      </MemoryRouter>
    );

    // Stajlar sekmesi
    const stajTab = screen.getByText('Staj & Deneyimler');
    fireEvent.click(stajTab);
    expect(screen.getByText('Baykar Teknoloji')).toBeDefined();
    expect(screen.getByText('Aselsan A.Ş.')).toBeDefined();

    // Sertifikalar sekmesi
    const certTab = screen.getByText('Sertifikalar');
    fireEvent.click(certTab);
    expect(screen.getByText(/Full-Stack Web ve Bulut Mimarisi/i)).toBeDefined();

    // Transkript sekmesi
    const transcriptTab = screen.getByText('Resmi Transkript Önizlemesi');
    fireEvent.click(transcriptTab);
    expect(screen.getByText(/T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ/i)).toBeDefined();
  });

  it('opens new activity request modal and submits', () => {
    render(
      <MemoryRouter>
        <StudentKGBPanel setView={mockSetView} currentUser={mockStudent} userRole="student" previousView="student" />
      </MemoryRouter>
    );

    const reqBtn = screen.getByText('Yeni Faaliyet / Belge Onayı İste');
    fireEvent.click(reqBtn);

    expect(screen.getByText('Faaliyet / Belge Başlığı')).toBeDefined();

    const input = screen.getByPlaceholderText(/Örn: Yapay Zekâ Eğitimi/i);
    fireEvent.change(input, { target: { value: 'Derin Öğrenme Workshop' } });

    const submitBtn = screen.getByText('Onaya Gönder');
    fireEvent.click(submitBtn);

    expect(screen.queryByPlaceholderText(/Örn: Yapay Zekâ Eğitimi/i)).toBeNull();
  });

  it('renders corporate floating dock with navigation items', () => {
    render(
      <MemoryRouter>
        <StudentKGBPanel setView={mockSetView} currentUser={mockStudent} userRole="student" previousView="student" />
      </MemoryRouter>
    );

    expect(screen.getByTitle('Akış')).toBeDefined();
    expect(screen.getByTitle('KGB Karnesi')).toBeDefined();
    expect(screen.getByTitle('Kariyer Fırsatları')).toBeDefined();
    expect(screen.getByTitle('Profilim')).toBeDefined();

    // Click on Akış button navigates to student
    fireEvent.click(screen.getByTitle('Akış'));
    expect(mockSetView).toHaveBeenCalledWith('student');

    // Click on Kariyer Fırsatları navigates to jobs
    fireEvent.click(screen.getByTitle('Kariyer Fırsatları'));
    expect(mockSetView).toHaveBeenCalledWith('jobs');
  });

  it('renders student selector and student data when admin views KGB panel', () => {
    const mockAdmin = {
      id: 'ADM-01',
      name: 'Kariyer Geliştirme Merkezi (Süper Yönetici)',
      role: 'admin'
    };

    render(
      <MemoryRouter>
        <StudentKGBPanel setView={mockSetView} currentUser={mockAdmin} userRole="admin" previousView="admin" />
      </MemoryRouter>
    );

    // Admin banner and select dropdown should be rendered
    expect(screen.getByText('Resmî KGB Karnesi & Portföy Doğrulama Masası')).toBeDefined();
    expect(screen.getByLabelText(/İncelenen Öğrenci Portföyü/i)).toBeDefined();

    // The card should display a student's record (e.g. Ahmet Yılmaz), NOT the admin's name
    expect(screen.queryByText(/Kariyer Geliştirme Merkezi \(Süper Yönetici\) - Öğrenci No/i)).toBeNull();
    expect(screen.getAllByText('Ahmet Yılmaz').length).toBeGreaterThan(0);
  });

  it('reactively updates student details when admin selects another student from dropdown', () => {
    const mockAdmin = {
      id: 'ADM-01',
      name: 'Kariyer Geliştirme Merkezi (Süper Yönetici)',
      role: 'admin'
    };

    render(
      <MemoryRouter>
        <StudentKGBPanel setView={mockSetView} currentUser={mockAdmin} userRole="admin" previousView="admin" />
      </MemoryRouter>
    );

    const select = screen.getByLabelText(/İncelenen Öğrenci Portföyü/i);
    fireEvent.change(select, { target: { value: 'STU-02' } });

    // Should switch to Zeynep Kaya (İşletme)
    expect(screen.getAllByText('Zeynep Kaya').length).toBeGreaterThan(0);
    expect(screen.getAllByText('İşletme').length).toBeGreaterThan(0);
    expect(screen.getByText('2023010485')).toBeDefined();
    expect(screen.getByText('Kurumsal Finans & Denetim')).toBeDefined();
  });

  it('renders official print area with id kgb-print-area for PDF export', () => {
    const { container } = render(
      <MemoryRouter>
        <StudentKGBPanel setView={mockSetView} currentUser={mockStudent} userRole="student" previousView="student" />
      </MemoryRouter>
    );

    // Switch to transcript tab
    fireEvent.click(screen.getByText('Resmi Transkript Önizlemesi'));
    const printArea = container.querySelector('#kgb-print-area');
    expect(printArea).not.toBeNull();
  });
});

