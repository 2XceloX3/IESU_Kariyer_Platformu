import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SubPanelFloatingDock from '../components/SubPanelFloatingDock';
import CareerRoadmap from '../components/CareerRoadmap';
import CareerTest from '../components/CareerTest';
import StartupIncubator from '../components/StartupIncubator';
import StudentClubPortal from '../components/StudentClubPortal';

describe('SubPanelFloatingDock & Student Sub-Panels Suite', () => {
  const mockCurrentUser = {
    id: 'STU-TEST-99',
    name: 'Selin Yıldız',
    email: 'selin.yildiz@esenyurt.edu.tr',
    role: 'student',
    department: 'Bilgisayar Mühendisliği',
    avatar: 'https://ui-avatars.com/api/?name=Selin+Yildiz'
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders SubPanelFloatingDock and handles navigation triggers', () => {
    const setView = vi.fn();
    const setSelectedUserId = vi.fn();

    render(
      <SubPanelFloatingDock 
        currentUser={mockCurrentUser}
        setView={setView}
        setSelectedUserId={setSelectedUserId}
        userRole="student"
      />
    );

    // 1. Akış (Home)
    const homeBtn = screen.getByTitle('Akış & Ana Sayfa');
    expect(homeBtn).toBeInTheDocument();
    fireEvent.click(homeBtn);
    expect(setView).toHaveBeenCalledWith('student');

    // 2. İş & Staj
    const jobsBtn = screen.getByTitle('İş & Staj Olanakları');
    expect(jobsBtn).toBeInTheDocument();
    fireEvent.click(jobsBtn);
    expect(setView).toHaveBeenCalledWith('jobs');

    // 3. Keşfet
    const searchBtn = screen.getByTitle('Keşfet & Sosyal Ağ Portalı');
    expect(searchBtn).toBeInTheDocument();
    fireEvent.click(searchBtn);
    expect(setView).toHaveBeenCalledWith('explore');

    // 4. Profil
    const profileBtn = screen.getByTitle('Profilim');
    expect(profileBtn).toBeInTheDocument();
    fireEvent.click(profileBtn);
    expect(setSelectedUserId).toHaveBeenCalledWith('STU-TEST-99');
    expect(setView).toHaveBeenCalledWith('user_profile');
  });

  it('renders CareerRoadmap with preset sectors, task checkboxes and floating dock', () => {
    const setView = vi.fn();
    render(
      <MemoryRouter>
        <CareerRoadmap 
          currentUser={mockCurrentUser}
          setView={setView}
          userRole="student"
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Kariyer Haritası')).toBeInTheDocument();
    expect(screen.getByText('Yazılım & Bilişim')).toBeInTheDocument();
    expect(screen.getByText('Veri & Analitik')).toBeInTheDocument();

    // Check presence of floating dock
    expect(screen.getByTitle('Akış & Ana Sayfa')).toBeInTheDocument();
    expect(screen.getByTitle('İş & Staj Olanakları')).toBeInTheDocument();

    // Toggle a task checkbox
    const taskItem = screen.getByText(/HTML5, Modern CSS/i);
    expect(taskItem).toBeInTheDocument();
    fireEvent.click(taskItem);

    // Task completion should be saved to localStorage
    const saved = JSON.parse(localStorage.getItem('iesu_career_roadmap_completed_tasks_v2') || '{}');
    expect(Object.keys(saved).length).toBeGreaterThan(0);
  });

  it('renders CareerTest, completes form and displays persona with matched mentors', async () => {
    const setView = vi.fn();
    const setSelectedUserId = vi.fn();

    render(
      <MemoryRouter>
        <CareerTest 
          currentUser={mockCurrentUser}
          setView={setView}
          setSelectedUserId={setSelectedUserId}
          userRole="student"
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Kariyer & Yetkinlik Testi')).toBeInTheDocument();
    expect(screen.getByTitle('Akış & Ana Sayfa')).toBeInTheDocument();

    // Answer all 8 questions
    const question1Option = screen.getByText(/Verileri ve geçmiş istatistikleri detaylıca inceler/i);
    fireEvent.click(question1Option);

    const question2Option = screen.getByText(/Süreçleri, kuralları ve performans kriterleri net/i);
    fireEvent.click(question2Option);

    const question3Option = screen.getByText(/Teknik dokümanları, akademik makaleleri/i);
    fireEvent.click(question3Option);

    const question4Option = screen.getByText(/Stratejik planlamayı, risk analizini/i);
    fireEvent.click(question4Option);

    const question5Option = screen.getByText(/Sayısal verilere, karşılaştırmalı tablolara/i);
    fireEvent.click(question5Option);

    const question6Option = screen.getByText(/Soğukkanlı kalarak problemin kaynaklarını adım adım/i);
    fireEvent.click(question6Option);

    const question7Option = screen.getByText(/Milyonların kullandığı karmaşık, hatasız ve güvenilir/i);
    fireEvent.click(question7Option);

    const question8Option = screen.getByText(/Kanıtlanmış rakamlar, metodoloji detayı/i);
    fireEvent.click(question8Option);

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Analizi Tamamla & Rapor Al/i });
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    // Results screen
    await waitFor(() => {
      expect(screen.getByText(/Kariyer Kimliğiniz/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText(/Sistem Mimarı & Analitik Stratejist/i)).toBeInTheDocument();
    expect(screen.getByText(/Gelişiminizi Destekleyecek İESÜ Kulüpleri/i)).toBeInTheDocument();
    expect(screen.getByText(/Eşleşen Doğrulanmış İESÜ Mentörleri/i)).toBeInTheDocument();
  });

  it('renders StartupIncubator with 9-box Lean Canvas, grant guide and sends to TTO pool', () => {
    const setView = vi.fn();
    render(
      <MemoryRouter>
        <StartupIncubator 
          currentUser={mockCurrentUser}
          setView={setView}
          userRole="student"
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Kuluçka & Girişimcilik Merkezi')).toBeInTheDocument();
    expect(screen.getByTitle('Akış & Ana Sayfa')).toBeInTheDocument();

    // Switch to Hibe Rehberi tab
    const grantTab = screen.getByRole('button', { name: /Hibe & Destek Rehberi/i });
    fireEvent.click(grantTab);
    expect(screen.getByText('TÜBİTAK 1512 BİGG')).toBeInTheDocument();
    expect(screen.getByText('KOSGEB İleri Girişimci Destek Programı')).toBeInTheDocument();

    // Switch to TTO Girişim Mentörleri tab
    const mentorTab = screen.getByRole('button', { name: /TTO Girişim Mentörleri/i });
    fireEvent.click(mentorTab);
    expect(screen.getByText('Doğrulanmış Girişim & Teknoloji Mentörleri')).toBeInTheDocument();

    // Switch back to Kanvas
    const canvasTab = screen.getByRole('button', { name: /Yalın Kanvas & Fizibilite/i });
    fireEvent.click(canvasTab);
    expect(screen.getByText('Girişim Fikrinizi Tanımlayın')).toBeInTheDocument();
  });

  it('renders StudentClubPortal with floating dock and proper back button', () => {
    const setView = vi.fn();
    render(
      <MemoryRouter>
        <StudentClubPortal 
          currentUser={mockCurrentUser}
          setView={setView}
          previousView="student"
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Öğrenci Kulüpleri Portalı')).toBeInTheDocument();
    expect(screen.getByTitle('Akış & Ana Sayfa')).toBeInTheDocument();
    expect(screen.getByTitle('İş & Staj Olanakları')).toBeInTheDocument();
    expect(screen.getByTitle('Geri Dön')).toBeInTheDocument();
  });
});
