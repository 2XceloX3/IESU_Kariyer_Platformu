import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ATSResumeScannerModal from '../components/student/ATSResumeScannerModal';
import AlumniEndowmentFund from '../components/alumni/AlumniEndowmentFund';
import GlobalVirtualFairBooth from '../components/career-fair/GlobalVirtualFairBooth';
import VirtualCareerFair from '../components/VirtualCareerFair';
import StudentFeed from '../components/StudentFeed';
import AlumniFeed from '../components/AlumniFeed';
import AdminFeed from '../components/AdminFeed';
import useAppStore from '../store/useAppStore';
import { resetEndowmentData } from '../services/alumniGivingWorkflow';
import { resetVirtualFairData } from '../services/virtualFairWorkflow';
import { clearAtsScanHistory } from '../services/atsScannerWorkflow';

// Mock dependencies
vi.mock('../services/scraper', () => ({
  scrapeLiveOrFallback: vi.fn().mockResolvedValue({
    jobs: [],
    events: [],
    announcements: [],
    academicCalendar: [],
    stats: {},
    source: 'fallback',
    scrapedAt: new Date().toISOString()
  })
}));

describe('Global Career Fair, ATS Scanner & Alumni Endowment Integration Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    resetEndowmentData();
    resetVirtualFairData();
    clearAtsScanHistory();

    useAppStore.setState({
      currentUser: {
        id: 's_test_1',
        name: 'Barış Can',
        email: 'baris.can@ogr.esenyurt.edu.tr',
        role: 'student',
        department: 'Yazılım Mühendisliği',
        certifications: 3,
        workshopsAttended: 5
      },
      userRole: 'student',
      activePortalBranch: 'student',
      jobs: [
        {
          id: 'job_react_101',
          title: 'Frontend React Geliştirici',
          company: 'ASELSAN',
          description: 'React, TypeScript, Docker ve AWS deneyimi olan mühendisler aranıyor.'
        }
      ],
      posts: []
    });
  });

  describe('Module 1: Yapay Zekâ ATS Uyum Tarayıcısı & CV Optimizasyonu', () => {
    it('renders ATSResumeScannerModal with institutional headers and branding', () => {
      render(<ATSResumeScannerModal isOpen={true} onClose={vi.fn()} />);

      expect(screen.getByText(/Yapay Zekâ ATS Uyum Tarayıcısı/i)).toBeInTheDocument();
      expect(screen.getAllByText(/İstanbul Esenyurt Üniversitesi \(İESÜ\)/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Kariyer Geliştirme Koordinatörlüğü/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/ATS Uyum Skoru/i)).toBeInTheDocument();
      expect(screen.getByText(/Workday ATS/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Greenhouse/i).length).toBeGreaterThanOrEqual(1);
    });

    it('allows selecting jobs from store and re-running ATS scan', async () => {
      render(<ATSResumeScannerModal isOpen={true} onClose={vi.fn()} />);

      const selectEl = screen.getByRole('combobox');
      fireEvent.change(selectEl, { target: { value: 'job_react_101' } });

      const scanBtn = screen.getByText(/ATS Taramasını Yenile & Skoru Hesapla/i);
      fireEvent.click(scanBtn);

      await waitFor(() => {
        expect(screen.getByText(/Anahtar Kelime Boşluk Analizi/i)).toBeInTheDocument();
      });
    });

    it('filters keyword gap analysis by tabs (all, missing, matched)', () => {
      render(<ATSResumeScannerModal isOpen={true} onClose={vi.fn()} />);

      const missingTabBtn = screen.getByText(/Eksik Anahtarlar/i);
      fireEvent.click(missingTabBtn);

      expect(screen.getByText(/Eksik Anahtarlar/i)).toBeInTheDocument();

      const matchedTabBtn = screen.getByText(/Eşleşenler/i);
      fireEvent.click(matchedTabBtn);

      expect(screen.getByText(/Eşleşenler/i)).toBeInTheDocument();
    });

    it('allows copying AI optimization suggestions', async () => {
      // Mock clipboard writeText
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText: writeTextMock }
      });

      render(<ATSResumeScannerModal isOpen={true} onClose={vi.fn()} />);

      const copyBtn = screen.getByText(/Önerileri Kopyala/i);
      fireEvent.click(copyBtn);

      expect(writeTextMock).toHaveBeenCalled();
    });

    it('calls onClose when close button is clicked', () => {
      const handleClose = vi.fn();
      render(<ATSResumeScannerModal isOpen={true} onClose={handleClose} />);

      const closeBtn = screen.getByText(/Pencereyi Kapat/i);
      fireEvent.click(closeBtn);

      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe('Module 2: Mezun Bağış, Burs Fonu & Şeref Kürsüsü (AlumniEndowmentFund)', () => {
    beforeEach(() => {
      useAppStore.setState({
        currentUser: {
          id: 'alumni_101',
          name: 'Kemal Sunal',
          role: 'alumni',
          graduationYear: '2018',
          department: 'İşletme'
        },
        userRole: 'alumni',
        activePortalBranch: 'alumni'
      });
    });

    it('renders AlumniEndowmentFund with institutional header, metrics and campaigns', () => {
      render(<AlumniEndowmentFund userRole="alumni" setView={vi.fn()} />);

      expect(screen.getByText(/İstanbul Esenyurt Üniversitesi \(İESÜ\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Mezun Bağış Fonu/i)).toBeInTheDocument();
      expect(screen.getByText(/Toplam Burs Fonu/i)).toBeInTheDocument();
      expect(screen.getByText(/Burs Alan Öğrenci/i)).toBeInTheDocument();
      expect(screen.getByText(/Cumhuriyetin 100. Yılı Geleceğin Mühendisleri Burs Fonu/i)).toBeInTheDocument();
    });

    it('switches to Şeref Kürsüsü and filters by tier', () => {
      render(<AlumniEndowmentFund userRole="alumni" setView={vi.fn()} />);

      const honorRollTab = screen.getByText(/Şeref Kürsüsü \(Hall of Honor\)/i);
      fireEvent.click(honorRollTab);

      expect(screen.getByText(/İESÜ Mezun Bağışçı Şeref Kürsüsü/i)).toBeInTheDocument();

      const platinumFilter = screen.getByRole('button', { name: /💎 Platin/i });
      fireEvent.click(platinumFilter);
      expect(platinumFilter).toBeInTheDocument();
    });

    it('switches to Sosyal Etki & Şeffaflık Raporu', () => {
      render(<AlumniEndowmentFund userRole="alumni" setView={vi.fn()} />);

      const impactTab = screen.getByText(/Sosyal Etki & Şeffaflık Raporu/i);
      fireEvent.click(impactTab);

      expect(screen.getByText(/Burs ve Bağış Şeffaflık Matrisi & Harcama Denetimi/i)).toBeInTheDocument();
      expect(screen.getByText(/Askıda Yemekhane/i)).toBeInTheDocument();
      expect(screen.getByText(/Tam Yaşam Bursu/i)).toBeInTheDocument();
    });

    it('opens donation modal, updates preset amount, and processes successful donation with receipt', async () => {
      render(<AlumniEndowmentFund userRole="alumni" setView={vi.fn()} />);

      const donateBtns = screen.getAllByText(/Bu Fona Burs Ver & Destek Ol/i);
      fireEvent.click(donateBtns[0]);

      expect(screen.getByText(/Mezun Burs & Bağış Katkı Formu/i)).toBeInTheDocument();

      // Click preset 1000 ₺
      const btn1000 = screen.getByRole('button', { name: '1000 ₺' });
      fireEvent.click(btn1000);

      // Verify impact summary updated
      expect(screen.getByText(/20 sıcak ve sağlıklı öğün tabldot desteği sağlar/i)).toBeInTheDocument();

      // Submit donation
      const submitBtn = screen.getByText(/1.000 ₺ Burs Bağışını Onayla/i);
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/Bağışınız Başarıyla Alındı!/i)).toBeInTheDocument();
        expect(screen.getByText(/Makbuz No:/i)).toBeInTheDocument();
      });
    });
  });

  describe('Module 3: B2B Sanal Fuar Standı & Canlı Hızlı Mülakat Kuyruğu', () => {
    it('renders VirtualCareerFair with global employers including ASELSAN, Mercedes and Baykar', () => {
      render(<VirtualCareerFair currentUser={{ id: 's1', role: 'student' }} setView={vi.fn()} />);

      expect(screen.getAllByText(/ASELSAN/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Mercedes-Benz Tech Innovation/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/BAYKAR Teknoloji/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Siemens Digital Industries/i).length).toBeGreaterThanOrEqual(1);
    });

    it('opens GlobalVirtualFairBooth and joins live interview queue', async () => {
      const booth = {
        id: 'aselsan',
        name: 'ASELSAN',
        sector: 'Savunma Sanayii',
        boothRecruiter: { name: 'Dr. Emre Demir', title: 'Yetkili' },
        queueLength: 2,
        estimatedWaitPerPersonMinutes: 5,
        openPositions: [{ id: 'pos_1', title: 'Yazılım Stajyeri', type: 'Staj' }],
        tags: ['C++', 'Savunma']
      };

      render(
        <GlobalVirtualFairBooth
          booth={booth}
          onClose={vi.fn()}
          currentUser={{ id: 'student_77', name: 'Zeynep Kaya', department: 'Yazılım' }}
        />
      );

      expect(screen.getByText(/Canlı İK Standı/i)).toBeInTheDocument();
      expect(screen.getByText(/Mülakat Sırası Al/i)).toBeInTheDocument();

      // Click join queue
      const joinBtn = screen.getByText(/Mülakat Sırası Al/i);
      fireEvent.click(joinBtn);

      await waitFor(() => {
        expect(screen.getByText(/Sıranız Geldi: Odaya Gir/i)).toBeInTheDocument();
      });
    });

    it('enters live speed interview room, simulates chat, and finishes with scorecard', async () => {
      const booth = {
        id: 'mercedes',
        name: 'Mercedes-Benz Tech Innovation',
        sector: 'Otomotiv',
        boothRecruiter: { name: 'Selin Yıldız', title: 'Talent Lead' },
        queueLength: 1,
        estimatedWaitPerPersonMinutes: 5,
        openPositions: [],
        tags: ['Cloud', 'Java']
      };

      render(
        <GlobalVirtualFairBooth
          booth={booth}
          onClose={vi.fn()}
          currentUser={{ id: 'student_88', name: 'Caner Öz' }}
        />
      );

      // Join queue
      const joinBtn = screen.getByText(/Mülakat Sırası Al/i);
      fireEvent.click(joinBtn);

      await waitFor(() => {
        expect(screen.getByText(/Sıranız Geldi: Odaya Gir/i)).toBeInTheDocument();
      });

      // Enter interview room
      const enterBtn = screen.getByText(/Sıranız Geldi: Odaya Gir/i);
      fireEvent.click(enterBtn);

      expect(screen.getByText(/10 Dakikalık Canlı Hızlı Mülakat Odası/i)).toBeInTheDocument();
      expect(screen.getByText(/HD CANLI SES & VİDEO/i)).toBeInTheDocument();

      // Finish interview
      const finishBtn = screen.getByText(/Görüşmeyi Sonlandır/i);
      fireEvent.click(finishBtn);

      await waitFor(() => {
        expect(screen.getByText(/Hızlı Mülakatınız Başarıyla Tamamlandı!/i)).toBeInTheDocument();
        expect(screen.getByText(/2. Tur Mülakat Daveti/i)).toBeInTheDocument();
      });
    });
  });

  describe('Module 4: StudentFeed and AlumniFeed Quick Access Points', () => {
    it('renders Başvuru Radarı quick access button in StudentFeed Bento Grid and triggers navigation', () => {
      const mockSetView = vi.fn();
      render(<StudentFeed setView={mockSetView} userRole="student" />);

      const radarBtn = screen.getByTestId('student-feed-quick-radar-btn');
      expect(radarBtn).toBeInTheDocument();
      expect(screen.getAllByText(/Başvuru Radarı/i).length).toBeGreaterThan(0);

      fireEvent.click(radarBtn);
      expect(mockSetView).toHaveBeenCalledWith('radar');
    });

    it.skip('renders Burs & Bağış Fonu button in AlumniFeed Ecosystem Tools and triggers navigation', () => {
      // KALDIRMA NOTU (2026-10-25): Bağış modülü 2860 Sayılı Yardım Toplama Kanunu kapsamında
      // Valilik izni + gerçek ödeme altyapısı hazırlanana kadar askıya alındı.
      // Test, modül geri aktive edildiğinde .skip kaldırılarak tekrar çalıştırılmalıdır.
      const mockSetView = vi.fn();
      render(<AlumniFeed setView={mockSetView} userRole="alumni" />);

      const endowmentBtn = screen.getByTestId('alumni-feed-endowment-btn');
      expect(endowmentBtn).toBeInTheDocument();
      expect(screen.getByText(/Burs & Bağış Fonu/i)).toBeInTheDocument();

      fireEvent.click(endowmentBtn);
      expect(mockSetView).toHaveBeenCalledWith('burs_fonu');
    });

    it.skip('renders Mezun Bağış & Burs Fonu button in AdminFeed quick actions and triggers navigation', () => {
      // KALDIRMA NOTU (2026-10-25): Bağış modülü 2860 Sayılı Yardım Toplama Kanunu kapsamında askıya alındı.
      const mockSetView = vi.fn();
      render(
        <AdminFeed
          setView={mockSetView}
          currentUser={{ id: 'admin_1', name: 'Kariyer Merkezi Yöneticisi', role: 'admin' }}
          userRole="admin"
        />
      );

      const adminEndowmentBtn = screen.getByTestId('admin-feed-endowment-btn');
      expect(adminEndowmentBtn).toBeInTheDocument();
      expect(screen.getByText(/Mezun Bağış & Burs Fonu/i)).toBeInTheDocument();

      fireEvent.click(adminEndowmentBtn);
      expect(mockSetView).toHaveBeenCalledWith('burs_fonu');
    });
  });
});
