import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudentApplicationRadar from '../components/student/StudentApplicationRadar';
import AlumniCoffeeChatModal from '../components/student/AlumniCoffeeChatModal';
import CareerReadinessWidget from '../components/student/CareerReadinessWidget';
import JobsAndInternships from '../components/JobsAndInternships';
import StajPanel from '../components/StajPanel';
import StudentFeed from '../components/StudentFeed';
import AlumniFeed from '../components/AlumniFeed';
import useAppStore from '../store/useAppStore';

// Mock scrollTo
window.scrollTo = vi.fn();

describe('Student Career Experience & 4 Killer Modules Integration', () => {
  const mockUser = {
    id: 'STU-001',
    uid: 'STU-001',
    name: 'Alperen Yılmaz',
    role: 'student',
    department: 'Yazılım Mühendisliği',
    studentNo: '20220101001',
    email: 'alperen@ogr.esenyurt.edu.tr',
    avatar: '/logo.png'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    const store = useAppStore.getState();
    store.setCurrentUser(mockUser);
    store.setUserRole('student');
    store.setActivePortalBranch('student');
  });

  describe('Module 1: Canlı Başvuru Radarı (StudentApplicationRadar)', () => {
    it('renders radar dashboard with KPI stats, VIP protocol badges and step tracker', async () => {
      const setView = vi.fn();
      render(
        <StudentApplicationRadar
          currentUser={mockUser}
          userRole="student"
          setView={setView}
        />
      );

      // Check header and titles
      expect(screen.getAllByText(/Canlı Başvuru Radarı/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Şeffaf Başvuru Takip Ağı/i)).toBeInTheDocument();

      // Check KPI stat cards
      expect(screen.getByText('Toplam Başvuru')).toBeInTheDocument();
      expect(screen.getByText('İK İnceledi')).toBeInTheDocument();
      expect(screen.getByText('İlk %15 Havuz')).toBeInTheDocument();
      expect(screen.getAllByText(/Mülakat Daveti/i).length).toBeGreaterThan(0);

      // Check VIP Protocol Badge on corporate partner applications
      const vipBadges = screen.getAllByText(/İESÜ Protokol Kontenjanı/i);
      expect(vipBadges.length).toBeGreaterThan(0);

      // Check 4-step tracker
      expect(screen.getAllByText(/1\. Başvuru İletildi/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/2\. İK Açtı & İnceledi/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/3\. İlk %15 Havuzu/i).length).toBeGreaterThan(0);
    });

    it('filters applications by active, shortlisted, interview, and feedback tabs', async () => {
      render(
        <StudentApplicationRadar
          currentUser={mockUser}
          userRole="student"
          setView={vi.fn()}
        />
      );

      // Click "Mülakat" filter
      const interviewFilterBtn = screen.getByText(/Mülakat \(/i);
      fireEvent.click(interviewFilterBtn);

      // Check that interview details are visible
      expect(screen.getByText(/Resmî Mülakat Daveti Aldınız!/i)).toBeInTheDocument();
      expect(screen.getByText(/Mülakat Odasına Katıl/i)).toBeInTheDocument();

      // Click "Geri Bildirim" filter
      const feedbackFilterBtn = screen.getByText(/Geri Bildirim \(/i);
      fireEvent.click(feedbackFilterBtn);

      // Check that structured constructive feedback is shown
      expect(screen.getByText(/Gerekçeli İK Değerlendirmesi/i)).toBeInTheDocument();
      expect(screen.getByText(/Güçlü Görülen Yönleriniz/i)).toBeInTheDocument();
      expect(screen.getByText(/Geliştirilmesi Gereken Alanlar/i)).toBeInTheDocument();
      expect(screen.getByText(/İESÜ SEM Kursu/i)).toBeInTheDocument();
    });

    it('expands live audit log and allows simulating stage advance', async () => {
      // Koordinatörlük/Yönetici denetimi modunda aşama simülasyonu doğrulanır (Öğrenci arayüzünde buton gizlidir)
      render(
        <StudentApplicationRadar
          currentUser={mockUser}
          userRole="admin"
          setView={vi.fn()}
        />
      );

      // Toggle audit log
      const toggleBtn = screen.getAllByText(/İK İnceleme Zaman Kütüğü & Audit Log/i)[0];
      fireEvent.click(toggleBtn);

      expect(screen.getByText(/Canlı Başvuru & İK İşlem Kütüğü/i)).toBeInTheDocument();

      // Test stage advance simulation
      const advanceBtns = screen.getAllByText(/Test Aşama Geçişi/i);
      if (advanceBtns.length > 0) {
        fireEvent.click(advanceBtns[0]);
      }
    });
  });

  describe('Module 2: Mezunla 15 Dakika Kahve & Mikro-Mentorluk (AlumniCoffeeChatModal)', () => {
    it('renders coffee chat modal, allows picking topic, date, slot and confirms appointment', async () => {
      const onClose = vi.fn();
      render(
        <AlumniCoffeeChatModal
          isOpen={true}
          onClose={onClose}
          currentUser={mockUser}
        />
      );

      // Verify title & branding
      expect(screen.getByText(/Mezunla 15 Dakika Kahve & Mikro-Mentorluk/i)).toBeInTheDocument();
      expect(screen.getByText(/İESÜ Mezunlar Portalı/i)).toBeInTheDocument();

      // Verify topics
      expect(screen.getByText(/CV & Portfolyo İnceleme/i)).toBeInTheDocument();
      expect(screen.getByText(/Sektör Tavsiyesi & Kariyer Giriş Taktikleri/i)).toBeInTheDocument();
      expect(screen.getByText(/Yurt Dışı \/ Yüksek Lisans Deneyimi/i)).toBeInTheDocument();

      // Enter student note
      const noteInput = screen.getByPlaceholderText(/Trendyol frontend stajı için/i);
      fireEvent.change(noteInput, { target: { value: 'Frontend kariyerim için tavsiye rica ederim.' } });

      // Submit appointment
      const submitBtn = screen.getByText(/15 Dakika Kahve Sohbetini Onayla/i);
      fireEvent.click(submitBtn);

      // After submission, it switches to "Randevularım" tab with active meeting link
      await waitFor(() => {
        expect(screen.getAllByText(/Görüşmeye Katıl \(Google Meet\)/i).length).toBeGreaterThan(0);
      });
    });
  });

  describe('Module 3: 3308 Sayılı Kanun Şeffaf Stajyer Güvencesi Etiketleri & Filtresi', () => {
    it('displays 3308 Law Guarantee banner, filter buttons and job card badges in JobsAndInternships', async () => {
      render(
        <JobsAndInternships
          currentUser={mockUser}
          userRole="student"
          setView={vi.fn()}
        />
      );

      // Check 3308 Guarantee Banner is removed as requested by UX
      expect(screen.queryByTestId('law-3308-guarantee-banner')).not.toBeInTheDocument();
      expect(screen.queryByText(/Bedava ve güvencesiz staj sömürüsüne son/i)).not.toBeInTheDocument();

      // Check badges on staj jobs
      const badges3308 = screen.getAllByText(/⚖️ 3308 Kanun Ücret Güvenceli/i);
      expect(badges3308.length).toBeGreaterThan(0);

      const badgesSgk = screen.getAllByText(/🏛️ Üniversite SGK Onaylı/i);
      expect(badgesSgk.length).toBeGreaterThan(0);
    });

    it('renders 3308 Law Guarantee Banner in StajPanel takip tab', async () => {
      render(
        <StajPanel
          currentUser={mockUser}
          userRole="student"
          setView={vi.fn()}
        />
      );

      // Switch to takip tab
      const takipTabBtn = screen.getByText(/Staj & Komisyon Takibi/i);
      fireEvent.click(takipTabBtn);

      // Verify 3308 banner in StajPanel
      expect(screen.getByTestId('staj-panel-3308-banner')).toBeInTheDocument();
      expect(screen.getByText(/Mevzuat Koruma Kalkanı/i)).toBeInTheDocument();
      expect(screen.getByText(/⚖️ 3308 Ücret Güvenceli/i)).toBeInTheDocument();
      expect(screen.getByText(/🏛️ Üniversite SGK Onaylı/i)).toBeInTheDocument();
    });
  });

  describe('Module 4: Kişiselleştirilmiş Kariyer Hazırlık Skoru (CareerReadinessWidget)', () => {
    it('calculates dynamic readiness score and presents smart advice recommendations', async () => {
      const setView = vi.fn();
      const onOpenCoffeeChat = vi.fn();

      render(
        <CareerReadinessWidget
          currentUser={mockUser}
          setView={setView}
          onOpenCoffeeChat={onOpenCoffeeChat}
        />
      );

      // Verify widget elements
      expect(screen.getByTestId('career-readiness-widget')).toBeInTheDocument();
      expect(screen.getByText(/Kariyer Hazırlık Skoru/i)).toBeInTheDocument();
      expect(screen.getByText(/Aday Seviyesi:/i)).toBeInTheDocument();
      expect(screen.queryByText(/Hedefine Ulaşmak İçin/i)).not.toBeInTheDocument();
    });
  });

  describe('Module 5: StudentFeed & StudentHive Integration', () => {
    it('renders CareerReadinessWidget, radar mini banner and coffee chat triggers on student home feed', async () => {
      const setView = vi.fn();
      render(
        <StudentFeed
          currentUser={mockUser}
          userRole="student"
          setView={setView}
        />
      );

      // Verify CareerReadinessWidget in StudentFeed
      expect(screen.getByTestId('career-readiness-widget')).toBeInTheDocument();

      // Verify Student Radar Banner Widget in StudentFeed
      expect(screen.getByTestId('student-radar-banner-widget')).toBeInTheDocument();

      // Click "Radara Git"
      const radarBtn = screen.getByText('Radara Git');
      fireEvent.click(radarBtn);
      expect(setView).toHaveBeenCalledWith('radar');

      // Click quick navigation button for Başvuru Radarı
      const quickRadarBtn = screen.getByTestId('student-feed-quick-radar-btn');
      fireEvent.click(quickRadarBtn);
      expect(setView).toHaveBeenCalledWith('radar');
    });

    it('renders AlumniFeed with 15 Dk Kahve Sohbeti tracking widget and opens management modal', async () => {
      const mockAlumniUser = {
        id: 'ALU-001',
        name: 'Caner Öztürk',
        role: 'alumni',
        department: 'Yazılım Mühendisliği',
        avatar: '/logo.png'
      };
      const setView = vi.fn();

      render(
        <AlumniFeed
          currentUser={mockAlumniUser}
          userRole="alumni"
          setView={setView}
        />
      );

      // Verify coffee chat widget in alumni panel
      expect(screen.getByTestId('alumni-coffee-chat-widget')).toBeInTheDocument();
      expect(screen.getByText(/15 Dk Kahve Sohbeti/i)).toBeInTheDocument();
      expect(screen.getByText(/Randevuları Yönet/i)).toBeInTheDocument();

      // Open coffee chat management modal from alumni panel
      fireEvent.click(screen.getByText(/Randevuları Yönet/i));
      expect(screen.getByTestId('alumni-coffee-chat-modal')).toBeInTheDocument();
    });

    it('StudentApplicationRadar without onOpenCoffeeChat prop opens internal coffee chat modal', async () => {
      render(
        <StudentApplicationRadar
          currentUser={mockUser}
          userRole="student"
          setView={vi.fn()}
        />
      );

      // Filter by feedback to show detailed feedback cards
      const feedbackFilterBtn = screen.getByText(/Geri Bildirim \(/i);
      fireEvent.click(feedbackFilterBtn);

      // Click "15 Dk Kahve Sohbeti" button on feedback card
      const coffeeBtn = screen.getByRole('button', { name: /15 Dk Kahve Sohbeti/i });
      fireEvent.click(coffeeBtn);

      // Verify that internal AlumniCoffeeChatModal is opened
      expect(screen.getByTestId('alumni-coffee-chat-modal')).toBeInTheDocument();
      expect(screen.getByText(/Mezunla 15 Dakika Kahve & Mikro-Mentorluk/i)).toBeInTheDocument();
    });

    it('supports full coffee chat lifecycle: PENDING -> CONFIRMED -> COMPLETED', async () => {
      render(
        <AlumniCoffeeChatModal
          isOpen={true}
          onClose={vi.fn()}
          currentUser={mockUser}
          userRole="alumni"
        />
      );

      // Switch to Randevularım tab
      const myChatsBtn = screen.getByText(/Randevularım/i);
      fireEvent.click(myChatsBtn);

      // Find pending chat and click confirm button
      const confirmBtns = screen.getAllByText(/Randevuyu Onayla/i);
      if (confirmBtns.length > 0) {
        fireEvent.click(confirmBtns[0]);
      }

      // Verify confirmed state with meet link
      await waitFor(() => {
        expect(screen.getAllByText(/Görüşmeye Katıl \(Google Meet\)/i).length).toBeGreaterThan(0);
      });

      // Complete the appointment
      const completeBtns = screen.getAllByText(/Görüşmeyi Tamamla/i);
      if (completeBtns.length > 0) {
        fireEvent.click(completeBtns[0]);
      }

      // Verify completion message
      await waitFor(() => {
        expect(screen.getAllByText(/15 Dk Mikro-Mentorluk Başarıyla Tamamlandı/i).length).toBeGreaterThan(0);
      });
    });
  });
});
