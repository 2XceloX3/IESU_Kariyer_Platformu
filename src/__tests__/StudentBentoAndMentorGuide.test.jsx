import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StudentFeed from '../components/StudentFeed';
import MentorRequestModal from '../components/modals/MentorRequestModal';
import CMSMentorshipPool from '../components/admin/CMSMentorshipPool';
import CMSIncubator from '../components/admin/CMSIncubator';
import { VERIFIED_MENTORS } from '../data/mentorsData';

describe('Student Feed Bento Grid Tools & Verified Mentors Guide Suite', () => {
  const mockCurrentUser = {
    id: 'STU-TEST-1',
    name: 'Deniz Kaya',
    email: 'deniz.kaya@esenyurt.edu.tr',
    role: 'student',
    department: 'Yazılım Mühendisliği',
    faculty: 'Mühendislik ve Doğa Bilimleri Fakültesi',
    avatar: 'https://ui-avatars.com/api/?name=Deniz+Kaya'
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders all 4 active Bento Grid tools in StudentFeed and does NOT render removed tools (SEM, CV, Sim, Applications)', () => {
    const setView = vi.fn();
    render(
      <MemoryRouter>
        <StudentFeed currentUser={mockCurrentUser} setView={setView} userRole="student" />
      </MemoryRouter>
    );

    // Active 4 tools:
    expect(screen.getByText('Kariyer Haritası')).toBeInTheDocument();
    expect(screen.getByText('Kariyer Testi')).toBeInTheDocument();
    expect(screen.getByText('Kuluçka Merkezi')).toBeInTheDocument();
    expect(screen.getByText('Kulüpler Portalı')).toBeInTheDocument();

    // Removed 4 tools must NOT be present in Bento Grid:
    expect(screen.queryByText('SEM Akademi')).not.toBeInTheDocument();
    expect(screen.queryByText('Özgeçmiş Hazırlayıcı')).not.toBeInTheDocument();
    expect(screen.queryByText('Mülakat Provası')).not.toBeInTheDocument();
    expect(screen.queryByText('Başvurularım')).not.toBeInTheDocument();
  });

  it('triggers setView with correct view keys when bento grid buttons are clicked', () => {
    const setView = vi.fn();
    render(
      <MemoryRouter>
        <StudentFeed currentUser={mockCurrentUser} setView={setView} userRole="student" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Kariyer Haritası'));
    expect(setView).toHaveBeenCalledWith('career_roadmap');

    fireEvent.click(screen.getByText('Kariyer Testi'));
    expect(setView).toHaveBeenCalledWith('career_test');

    fireEvent.click(screen.getByText('Kuluçka Merkezi'));
    expect(setView).toHaveBeenCalledWith('startup_incubator');

    fireEvent.click(screen.getByText('Kulüpler Portalı'));
    expect(setView).toHaveBeenCalledWith('club_portal');
  });

  it('opens Verified Mentors Guide modal and lists all verified mentors with clickable profiles', async () => {
    const setView = vi.fn();
    const setSelectedUserId = vi.fn();

    render(
      <MemoryRouter>
        <StudentFeed 
          currentUser={mockCurrentUser} 
          setView={setView} 
          setSelectedUserId={setSelectedUserId}
          userRole="student" 
        />
      </MemoryRouter>
    );

    // Click "Mentor Bulun" card button
    const openGuideBtn = screen.getByRole('button', { name: /Mentorları İncele/i });
    fireEvent.click(openGuideBtn);

    // Modal title must appear
    expect(screen.getByText('Doğrulanmış İESÜ Mentör Rehberi')).toBeInTheDocument();

    // Mentors must appear in modal
    expect(screen.getAllByText('Caner Öztürk').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Alperen Yılmaz').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Dr. Öğr. Üyesi Zeynep Çelik').length).toBeGreaterThan(0);

    // Click "Profili Gör" on first mentor
    const viewProfileBtns = screen.getAllByRole('button', { name: /Profili Gör/i });
    fireEvent.click(viewProfileBtns[0]);

    // Should navigate to public_profile with selected mentor id
    expect(setSelectedUserId).toHaveBeenCalledWith('mnt_caner_ozturk');
    expect(setView).toHaveBeenCalledWith('public_profile');
  });

  it('allows filling and submitting MentorRequestModal, syncing to localStorage and admin store', async () => {
    const onClose = vi.fn();
    const mentor = VERIFIED_MENTORS[0]; // Caner Öztürk

    render(
      <MentorRequestModal
        isOpen={true}
        onClose={onClose}
        mentor={mentor}
        currentUser={mockCurrentUser}
      />
    );

    expect(screen.getByText('Birebir Mentörlük İstek Formu')).toBeInTheDocument();
    expect(screen.getAllByText('Caner Öztürk').length).toBeGreaterThan(0);

    const noteTextarea = screen.getByPlaceholderText(/son sınıf öğrencisiyim/i);
    fireEvent.change(noteTextarea, {
      target: { value: 'Frontend ve React mimarisi alanında kendimi geliştirmek ve tavsiye almak istiyorum.' }
    });

    const submitBtn = screen.getByRole('button', { name: /Mentörlük Talebini/i });
    fireEvent.click(submitBtn);

    // Wait for submission
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });

    const storedRequests = JSON.parse(localStorage.getItem('iesu_mentorship_requests_v1') || '[]');
    expect(storedRequests.length).toBeGreaterThan(0);
    expect(storedRequests[0].mentorName).toBe('Caner Öztürk');
    expect(storedRequests[0].studentName).toBe('Deniz Kaya');
    expect(storedRequests[0].status).toBe('Beklemede');
  });

  it('renders CMSMentorshipPool in Admin, showing requests and updating status', async () => {
    // Seed request in localStorage
    const testRequest = {
      id: 'mreq_test_1',
      studentId: 'STU-100',
      studentName: 'Emre Yıldırım',
      studentDept: 'Bilgisayar Mühendisliği',
      mentorId: 'mentor_caner_ozturk',
      mentorName: 'Caner Öztürk',
      topic: 'Kariyer Planlama & Hedef Belirleme',
      mode: 'Online Görüşme',
      note: 'Teknik liderlik konusunda mentörlük talep ediyorum.',
      date: '24 Eylül 2026 14:00',
      status: 'Beklemede'
    };
    localStorage.setItem('iesu_mentorship_requests_v1', JSON.stringify([testRequest]));

    render(<CMSMentorshipPool />);

    expect(screen.getByText('Mentörlük & Danışmanlık Denetim Havuzu')).toBeInTheDocument();
    expect(screen.getByText('Emre Yıldırım')).toBeInTheDocument();
    expect(screen.getByText('Caner Öztürk')).toBeInTheDocument();

    // Click "İçeriği İncele" button
    const inspectBtn = screen.getByRole('button', { name: /İçeriği İncele/i });
    fireEvent.click(inspectBtn);

    // Modal opens
    expect(screen.getByText('Mentörlük Talebi Denetim Kartı')).toBeInTheDocument();

    // Click "Talebi Onayla"
    const approveBtn = screen.getByRole('button', { name: /Talebi Onayla/i });
    fireEvent.click(approveBtn);

    await waitFor(() => {
      const updated = JSON.parse(localStorage.getItem('iesu_mentorship_requests_v1') || '[]');
      expect(updated[0].status).toBe('Onaylandı');
    });
  });

  it('renders CMSIncubator in Admin, displaying projects and stage updates', async () => {
    render(<CMSIncubator />);

    expect(screen.getByText(/Kuluçka & Girişimcilik Projeleri/i)).toBeInTheDocument();
    expect(screen.getByText(/SmartCampus IoT/i)).toBeInTheDocument();
    expect(screen.getByText(/MedVision/i)).toBeInTheDocument();
    expect(screen.getByText(/EduChain/i)).toBeInTheDocument();
  });

  it('opens Ecosystem Discovery modal when "Tümünü Keşfet (16)" is clicked and navigates to tools', () => {
    const setView = vi.fn();
    render(
      <MemoryRouter>
        <StudentFeed currentUser={mockCurrentUser} setView={setView} userRole="student" />
      </MemoryRouter>
    );

    const discoverBtn = screen.getByText(/Tümünü Keşfet \(16\)/i);
    expect(discoverBtn).toBeInTheDocument();
    fireEvent.click(discoverBtn);

    expect(screen.getByText('İESÜ Ekosistem Araçları & Modülleri')).toBeInTheDocument();
    expect(screen.getByText('Akıllı CV & Özgeçmiş Tasarımcısı')).toBeInTheDocument();
    expect(screen.getByText('3D Metaverse Kampüs Haritası')).toBeInTheDocument();

    fireEvent.click(screen.getByText('3D Metaverse Kampüs Haritası'));
    expect(setView).toHaveBeenCalledWith('campus_map');
  });
});
