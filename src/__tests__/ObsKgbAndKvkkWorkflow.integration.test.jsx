import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EDevletObsModal from '../components/modals/EDevletObsModal';
import StudentKGBPanel from '../components/StudentKGBPanel';
import UserProfile from '../components/UserProfile';
import CompanyFeed from '../components/CompanyFeed';
import useAppStore from '../store/useAppStore';
import { 
  OBS_STANDARDS, 
  maskSensitiveData, 
  generateOfficialKgbDocument,
  verifyStudentObsRecord 
} from '../services/obsVerificationWorkflow';

describe('Adım 4: Doğrulanmış OBS Entegrasyon Katmanı, QR Kodlu KGB Belgesi & KVKK Entegrasyon Test Suite', () => {

  const mockStudent = {
    id: 'STU-01',
    uid: 'STU-01',
    studentNo: '2023010482',
    name: 'Ahmet Yılmaz',
    role: 'student',
    tcNo: '10000000146',
    phone: '05321234512',
    email: 'ahmet.yilmaz@ogr.esenyurt.edu.tr',
    department: 'Bilgisayar Mühendisliği',
    faculty: 'Mühendislik ve Mimarlık Fakültesi',
    grade: '3. Sınıf',
    gano: 3.84,
    gpa: 3.84,
    obsVerified: true,
    yoksisVerified: true,
    obsVerificationCode: 'IESU-OBS-VERIFIED-9941A',
    verificationCode: 'IESU-OBS-VERIFIED-9941A',
    badges: ['verified', OBS_STANDARDS.BADGE_LABEL],
    advisorName: 'Doç. Dr. Selin Kaya',
    internships: 2,
    certifications: 3,
    workshopsAttended: 7,
    mentorMeetings: 4
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.print = vi.fn();
    window.toast = {
      success: vi.fn(),
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    };
  });

  /* -------------------------------------------------------------------------- */
  /* 1. EDevletObsModal ve OBS / YÖKSİS Doğrulama Akışı                         */
  /* -------------------------------------------------------------------------- */
  describe('1. EDevletObsModal & OBS Entegrasyon Akışı', () => {
    it('renders modal when open and displays corporate headers', () => {
      render(
        <EDevletObsModal
          isOpen={true}
          onClose={vi.fn()}
          mode="verify"
        />
      );

      expect(screen.getByText('İESÜ OBS & YÖKSİS Doğrulama')).toBeInTheDocument();
      expect(screen.getByText(/T.C. İstanbul Esenyurt Üniversitesi Rektörlüğü/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Örn: 2023010482 veya 10000000146/i)).toBeInTheDocument();
    });

    it('verifies student credentials via studentNo and transitions to verified state with cryptographic code', async () => {
      const onVerifiedData = vi.fn();
      const onClose = vi.fn();

      render(
        <EDevletObsModal
          isOpen={true}
          onClose={onClose}
          onVerifiedData={onVerifiedData}
          mode="autofill"
        />
      );

      const input = screen.getByPlaceholderText(/Örn: 2023010482 veya 10000000146/i);
      fireEvent.change(input, { target: { value: '2023010482' } });

      const submitBtn = screen.getByRole('button', { name: /OBS & YÖKSİS ile Doğrula/i });
      fireEvent.click(submitBtn);

      // Doğrulama sonucunda resmi verilerin görüntülenmesi
      await waitFor(() => {
        expect(screen.getByText('OBS & YÖKSİS Doğrulaması Onaylandı')).toBeInTheDocument();
      });

      expect(screen.getByText('Ahmet Yılmaz')).toBeInTheDocument();
      expect(screen.getByText(/3.84 \/ 4.00/)).toBeInTheDocument();
      expect(screen.getAllByText(OBS_STANDARDS.BADGE_LABEL).length).toBeGreaterThan(0);

      // Profili Onayla butonuna basıldığında callback tetiklenir
      const confirmBtn = screen.getByRole('button', { name: /Profili Onayla ve Devam Et/i });
      fireEvent.click(confirmBtn);

      expect(onVerifiedData).toHaveBeenCalledTimes(1);
      const payload = onVerifiedData.mock.calls[0][0];
      expect(payload.obsVerified).toBe(true);
      expect(payload.yoksisVerified).toBe(true);
      expect(payload.verificationCode).toMatch(/^IESU-OBS-VERIFIED-[A-Z0-9]+$/);
      expect(payload.gano).toBe(3.84);
      expect(payload.tcKimlikMasked).toBe('100*****146'); // KVKK Maskelemesi
      expect(onClose).toHaveBeenCalled();
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 2. StudentKGBPanel & Resmî KGB Belgesi / Diploma Eki Çıktısı              */
  /* -------------------------------------------------------------------------- */
  describe('2. StudentKGBPanel & Resmî QR Kodlu KGB Belgesi', () => {
    it('renders KGB panel with verified OBS badge and indicators', () => {
      render(
        <MemoryRouter>
          <StudentKGBPanel
            setView={vi.fn()}
            currentUser={mockStudent}
            userRole="student"
            previousView="student"
          />
        </MemoryRouter>
      );

      expect(screen.getAllByText('Ahmet Yılmaz').length).toBeGreaterThan(0);
      expect(screen.getByText('KGB Onaylı')).toBeInTheDocument();
      expect(screen.getAllByText(OBS_STANDARDS.BADGE_LABEL).length).toBeGreaterThan(0);
    });

    it('renders full official KGB transcript in "transkript" tab with 4 sections, QR code, seal and signatures', async () => {
      render(
        <MemoryRouter>
          <StudentKGBPanel
            setView={vi.fn()}
            currentUser={mockStudent}
            userRole="student"
            previousView="student"
          />
        </MemoryRouter>
      );

      // Transkript sekmesine tıkla
      const transcriptTab = screen.getByText('Resmi Transkript Önizlemesi');
      fireEvent.click(transcriptTab);

      // Belge Başlıkları
      expect(screen.getAllByText(/T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Kariyer Geliştirme Koordinatörlüğü & Yetenek Akademisi/i)).toBeInTheDocument();
      expect(screen.getByText(/RESMİ KARİYER GELİŞİM BELGESİ \(KGB\) VE YETENEK KARNESİ/i)).toBeInTheDocument();

      // Belge No & Kriptografik Kod
      expect(screen.getByText(/Kriptografik OBS Doğrulama Kodu:/i)).toBeInTheDocument();

      // 4 Resmî Faaliyet Bölümü
      // 1. Stajlar (Adım 1)
      expect(screen.getByText(/1. Tamamlanan Kurumsal ve Ar-Ge Stajları/i)).toBeInTheDocument();
      expect(screen.getByText('Baykar Teknoloji')).toBeInTheDocument();
      expect(screen.getByText('Aselsan A.Ş.')).toBeInTheDocument();

      // 2. Sertifikalar
      expect(screen.getByText(/2. Kazanılan Akredite Mesleki Sertifikalar/i)).toBeInTheDocument();
      expect(screen.getByText(/Full-Stack Web ve Bulut Mimarisi/i)).toBeInTheDocument();

      // 3. Kulüp Başkanlıkları
      expect(screen.getByText(/3. SKS Onaylı Kulüp Başkanlıkları/i)).toBeInTheDocument();
      expect(screen.getByText('Yazılım & Bilişim Kulübü')).toBeInTheDocument();

      // 4. Seminer ve Atölyeler
      expect(screen.getByText(/4. Mesleki Atölye, Seminer ve Vaka Çalışmaları/i)).toBeInTheDocument();

      // Kurumsal Mühür & Doğrulanabilir QR Kod
      expect(screen.getByText('İESÜ MÜHÜR & ONAY')).toBeInTheDocument();
      expect(screen.getByText('2026 Resmî İESÜ Damgası')).toBeInTheDocument();
      expect(screen.getByText(/YÖK \/ TYYÇ 6. Düzey Uyumlu/i)).toBeInTheDocument();

      // 3'lü Kurumsal İmza Blokları (Danışman, Koordinatörlük, Rektörlük)
      expect(screen.getByText('Doç. Dr. Selin Kaya')).toBeInTheDocument();
      expect(screen.getByText(/Kariyer Danışmanı & Bölüm Temsilcisi/i)).toBeInTheDocument();
      expect(screen.getByText(/Resmî Tescillidir/i)).toBeInTheDocument();
      expect(screen.getByText('Prof. Dr. Rektörlük Makamı')).toBeInTheDocument();
      expect(screen.getByText(/Rektörlük Tasdiklidir/i)).toBeInTheDocument();

      // PDF Yazdırma Butonu
      const printBtn = screen.getByRole('button', { name: /Resmi Belgeyi Yazdır/i });
      fireEvent.click(printBtn);
      await waitFor(() => {
        expect(window.print).toHaveBeenCalled();
      });

      // JSON İndirme Butonu
      const jsonBtn = screen.getByRole('button', { name: /Resmî KGB Verisi \(JSON\)/i });
      expect(jsonBtn).toBeInTheDocument();
      fireEvent.click(jsonBtn);
      // Hata fırlatmadan tamamlanır
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 3. UserProfile & KVKK Bilgi Güvenliği Maskeleme Entegrasyonu              */
  /* -------------------------------------------------------------------------- */
  describe('3. UserProfile OBS Rozeti & KVKK Maskeleme Entegrasyonu', () => {
    it('displays verified OBS badge and details chip in UserProfile student header', () => {
      useAppStore.setState({
        currentUser: mockStudent,
        userRole: 'student',
        activePortalBranch: 'student',
      });

      render(
        <MemoryRouter>
          <UserProfile
            userId="STU-01"
            setView={vi.fn()}
            currentUser={mockStudent}
            previousView="student"
          />
        </MemoryRouter>
      );

      // OBS Doğrulandı rozet ve çipi
      expect(screen.getByText(OBS_STANDARDS.BADGE_LABEL)).toBeInTheDocument();
      expect(screen.getByText(/OBS Doğrulandı:/i)).toBeInTheDocument();
      expect(screen.getByText('IESU-OBS-VERIFIED-9941A')).toBeInTheDocument();
    });

    it('enforces KVKK data masking when an employer / third-party views the profile', () => {
      const sanitized = maskSensitiveData(mockStudent, {
        viewerRole: 'company',
        viewerId: 'CMP-001',
        explicitConsent: false
      });

      expect(sanitized.isMasked).toBe(true);
      expect(sanitized.tcNo).toBe('100*****146');
      expect(sanitized.phone).toBe('0532 *** ** 12');
      expect(sanitized.email).toBe('ahm***@ogr.esenyurt.edu.tr');
      expect(sanitized.department).toBe('Bilgisayar Mühendisliği');
    });

    it('masks candidate phone and email in CompanyFeed and displays KVKK badge when consent is missing', () => {
      const testCompany = { id: 'CMP-TEST', name: 'Test A.Ş.', role: 'company' };
      const rawApplications = [
        {
          id: 'APP-TEST-01',
          companyId: 'CMP-TEST',
          applicantName: 'Merve Kaya',
          applicantDept: 'Bilgisayar Mühendisliği',
          applicantPhone: '05321234567',
          applicantEmail: 'merve.kaya@ogr.esenyurt.edu.tr',
          jobTitle: 'Frontend Developer',
          status: 'Beklemede',
          kvkkConsentAccepted: false,
        }
      ];

      useAppStore.setState({
        currentUser: testCompany,
        userRole: 'company',
        activePortalBranch: 'company',
        applications: rawApplications,
      });

      render(
        <MemoryRouter>
          <CompanyFeed
            currentUser={testCompany}
            userRole="company"
            setView={vi.fn()}
            initialTab="feed"
          />
        </MemoryRouter>
      );

      // Aday tablosu modalını aç
      const openModalBtn = screen.getByRole('button', { name: /Hızlı Aday Tablosu/i });
      fireEvent.click(openModalBtn);

      // Aday adı ve KVKK maskeli iletişim bilgileri doğrulanır
      expect(screen.getAllByText('Merve Kaya').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/0532 \*\*\* \*\* 67/)).toBeInTheDocument();
      expect(screen.getByText(/mer\*\*\*@ogr\.esenyurt\.edu\.tr/)).toBeInTheDocument();
      expect(screen.getByText(/🔒 KVKK Korumalı/)).toBeInTheDocument();
    });

    it('masks alumni email in UserProfile when viewed by third-party visitor', () => {
      const mockAlumniUser = {
        id: 'ALM-99',
        name: 'Caner Öztürk',
        role: 'alumni',
        department: 'Yazılım Mühendisliği',
        gradYear: '2023',
        email: 'caner.ozturk@mezun.esenyurt.edu.tr'
      };

      const visitorUser = {
        id: 'CMP-001',
        role: 'company',
        name: 'Baykar İK'
      };

      useAppStore.setState({
        currentUser: visitorUser,
        userRole: 'company',
        activePortalBranch: 'company',
        alumni: [mockAlumniUser]
      });

      render(
        <MemoryRouter>
          <UserProfile
            userId="ALM-99"
            userRole="company"
            currentUser={visitorUser}
            setView={vi.fn()}
          />
        </MemoryRouter>
      );

      // Email maskeli görünmelidir
      expect(screen.getByText(/can\*\*\*@mezun\.esenyurt\.edu\.tr/)).toBeInTheDocument();
    });
  });
});
