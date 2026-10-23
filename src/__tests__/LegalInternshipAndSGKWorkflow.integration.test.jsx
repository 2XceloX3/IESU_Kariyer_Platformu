import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Form1InternshipModal from '../components/internship/Form1InternshipModal';
import InternshipCommissionPanel from '../components/internship/InternshipCommissionPanel';
import SGKExportPanel from '../components/internship/SGKExportPanel';
import DigitalInternshipNotebook from '../components/internship/DigitalInternshipNotebook';
import StajPanel from '../components/StajPanel';
import { 
  INTERNSHIP_STATUS, 
  SAMPLE_ENTERPRISE_INTERNSHIPS,
  advanceInternshipStatus,
  calculateWorkDays 
} from '../services/internshipWorkflow';

describe('Adım 1: Resmî Staj, 3308 & 5510 SGK İş Akışı ve Komisyon Motoru Integration Suite', () => {

  const mockCurrentUser = {
    id: 'STD-001',
    uid: 'STD-001',
    name: 'Ayşe Kaya',
    studentNo: '20220101001',
    tcNo: '10000000146',
    faculty: 'Mühendislik ve Doğa Bilimleri Fakültesi',
    department: 'Bilgisayar Mühendisliği',
    role: 'student',
    phone: '0555 111 2233',
    email: 'ayse.kaya@ogr.esenyurt.edu.tr'
  };

  const mockAdvisorUser = {
    id: 'ACAD-001',
    uid: 'ACAD-001',
    name: 'Dr. Öğr. Üyesi Mehmet Can',
    title: 'Bölüm Staj Komisyonu Başkanı',
    role: 'academic',
    department: 'Bilgisayar Mühendisliği'
  };

  const mockAdminUser = {
    id: 'ADM-001',
    uid: 'ADM-001',
    name: 'Kariyer Geliştirme Koordinatörlüğü',
    role: 'admin'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.toast = {
      success: vi.fn(),
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn()
    };
  });

  /* -------------------------------------------------------------------------- */
  /* 1. Form-1 (Staj Kabul ve SGK Taahhüt Formu) İş Akışı                       */
  /* -------------------------------------------------------------------------- */
  describe('1. Form-1 (Staj Kabul ve SGK Taahhüt Formu) Modal & Validation', () => {
    it('renders 4-step wizard with student credentials prefilled', () => {
      render(
        <Form1InternshipModal
          isOpen={true}
          onClose={vi.fn()}
          currentUser={mockCurrentUser}
          onSaveInternship={vi.fn()}
        />
      );

      expect(screen.getByText(/Staj Kabul ve Resmî SGK Taahhüt Formu \(Form-1\)/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('Ayşe Kaya')).toBeInTheDocument();
      expect(screen.getByDisplayValue('10000000146')).toBeInTheDocument();
      expect(screen.getByText(/Algoritma Doğrulandı/i)).toBeInTheDocument();
    });

    it('advances from Step 1 to Step 2 when student data is valid', () => {
      render(
        <Form1InternshipModal
          isOpen={true}
          onClose={vi.fn()}
          currentUser={mockCurrentUser}
          onSaveInternship={vi.fn()}
        />
      );

      const nextBtn = screen.getByText('İlerle');
      fireEvent.click(nextBtn);

      expect(screen.getByText(/2\. Staj Yapılacak Kurum & Tarihler/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Örn: Baykar Teknoloji A\.Ş\./i)).toBeInTheDocument();
    });

    it('validates 5510 SGK declaration and employer approval in Steps 3 and 4', () => {
      const handleSave = vi.fn();
      render(
        <Form1InternshipModal
          isOpen={true}
          onClose={vi.fn()}
          currentUser={mockCurrentUser}
          onSaveInternship={handleSave}
        />
      );

      // Step 1 -> 2
      fireEvent.click(screen.getByText('İlerle'));

      // Step 2 -> 3
      fireEvent.click(screen.getByText('İlerle'));
      expect(screen.getByText(/3\. SGK 5510 \/ 5-b Yasal Sağlık Beyanı & Taahhüt/i)).toBeInTheDocument();

      // Step 3 -> 4
      fireEvent.click(screen.getByText('İlerle'));
      expect(screen.getByText(/4\. İşveren Onayı, 3308 Ücret & Form-1 Önizleme/i)).toBeInTheDocument();

      // Submit Form-1
      const submitBtn = screen.getByText('Komisyon Onayına Gönder');
      fireEvent.click(submitBtn);

      expect(handleSave).toHaveBeenCalledTimes(1);
      const savedPayload = handleSave.mock.calls[0][0];
      expect(savedPayload.status).toBe(INTERNSHIP_STATUS.COMMISSION_PENDING);
      expect(savedPayload.studentName).toBe('Ayşe Kaya');
      expect(savedPayload.hasFamilyGss).toBe(true);
      expect(window.toast.success).toHaveBeenCalledWith(expect.stringContaining('Bölüm Staj Komisyonu onayına'));
    });

    it('triggers PDF generation when Form-1 PDF İndir is clicked', () => {
      render(
        <Form1InternshipModal
          isOpen={true}
          onClose={vi.fn()}
          currentUser={mockCurrentUser}
          onSaveInternship={vi.fn()}
        />
      );

      // Jump to Step 4
      fireEvent.click(screen.getByText('İlerle'));
      fireEvent.click(screen.getByText('İlerle'));
      fireEvent.click(screen.getByText('İlerle'));

      const downloadPdfBtn = screen.getByText(/Form-1 PDF İndir/i);
      fireEvent.click(downloadPdfBtn);

      expect(window.toast.success).toHaveBeenCalledWith(expect.stringContaining('Form-1'));
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 2. Bölüm Staj Komisyonu Onay Paneli                                        */
  /* -------------------------------------------------------------------------- */
  describe('2. Bölüm Staj Komisyonu Onay Paneli', () => {
    const mockList = [
      {
        id: 'INT-TEST-01',
        studentName: 'Zeynep Yılmaz',
        studentNo: '20220101011',
        tcNo: '10000000146',
        department: 'Bilgisayar Mühendisliği',
        companyName: 'HAVELSAN A.Ş.',
        sgkSicilNo: '2.4510.01.01.1234567.034.01-44',
        startDate: '2026-07-01',
        endDate: '2026-07-31',
        workDays: 22,
        hasFamilyGss: true,
        status: INTERNSHIP_STATUS.COMMISSION_PENDING,
        employerScore: 90
      },
      {
        id: 'INT-TEST-02',
        studentName: 'Can Arslan',
        studentNo: '20220101012',
        tcNo: '10000000146',
        department: 'Endüstri Mühendisliği',
        companyName: 'Trendyol Tech',
        sgkSicilNo: '2.4520.02.02.9876543.034.02-88',
        startDate: '2026-07-15',
        endDate: '2026-08-15',
        workDays: 24,
        hasFamilyGss: false,
        status: INTERNSHIP_STATUS.COMMISSION_APPROVED,
        sgkBarcode: 'IESU-SGK-5510-12345678'
      }
    ];

    it('renders commission metrics and lists incoming student applications', () => {
      render(
        <InternshipCommissionPanel
          internships={mockList}
          onUpdateInternship={vi.fn()}
          currentUser={mockAdvisorUser}
        />
      );

      expect(screen.getByText(/Bölüm Staj Komisyonu Onay Paneli/i)).toBeInTheDocument();
      expect(screen.getByText('Zeynep Yılmaz')).toBeInTheDocument();
      expect(screen.getByText('HAVELSAN A.Ş.')).toBeInTheDocument();
      expect(screen.getByText('Trendyol Tech')).toBeInTheDocument();
    });

    it('filters applications by status tabs', () => {
      render(
        <InternshipCommissionPanel
          internships={mockList}
          onUpdateInternship={vi.fn()}
          currentUser={mockAdvisorUser}
        />
      );

      const pendingTab = screen.getByText(/Onay Bekleyen/i);
      fireEvent.click(pendingTab);

      expect(screen.getByText('Zeynep Yılmaz')).toBeInTheDocument();
      expect(screen.queryByText('Can Arslan')).not.toBeInTheDocument();
    });

    it('approves an application and calls onUpdateInternship with COMMISSION_APPROVED', () => {
      const handleUpdate = vi.fn();
      render(
        <InternshipCommissionPanel
          internships={mockList}
          onUpdateInternship={handleUpdate}
          currentUser={mockAdvisorUser}
        />
      );

      const reviewButtons = screen.getAllByText(/İncele & Karar/i);
      fireEvent.click(reviewButtons[0]);

      expect(screen.getByText(/Staj Dosyası İnceleme/i)).toBeInTheDocument();

      const applyDecisionBtn = screen.getByText(/Kararı Kaydet ve Uygula/i);
      fireEvent.click(applyDecisionBtn);

      expect(handleUpdate).toHaveBeenCalledTimes(1);
      const updated = handleUpdate.mock.calls[0][0];
      expect(updated.status).toBe(INTERNSHIP_STATUS.COMMISSION_APPROVED);
      expect(updated.reviewerName).toBe(mockAdvisorUser.name);
      expect(window.toast.success).toHaveBeenCalledWith(expect.stringContaining('Staj Komisyon Onayı verildi'));
    });

    it('submits revision request with required note', () => {
      const handleUpdate = vi.fn();
      render(
        <InternshipCommissionPanel
          internships={mockList}
          onUpdateInternship={handleUpdate}
          currentUser={mockAdvisorUser}
        />
      );

      const reviewButtons = screen.getAllByText(/İncele & Karar/i);
      fireEvent.click(reviewButtons[0]);

      const reviseTabBtn = screen.getByRole('button', { name: /Revizyon İste/i });
      fireEvent.click(reviseTabBtn);

      const textarea = screen.getByPlaceholderText(/eksik hane/i);
      fireEvent.change(textarea, { target: { value: 'Kurum sicil no kontrol edilmeli.' } });

      const applyDecisionBtn = screen.getByText(/Kararı Kaydet ve Uygula/i);
      fireEvent.click(applyDecisionBtn);

      expect(handleUpdate).toHaveBeenCalledTimes(1);
      const updated = handleUpdate.mock.calls[0][0];
      expect(updated.status).toBe(INTERNSHIP_STATUS.REVISION_REQUESTED);
      expect(updated.revisionNote).toBe('Kurum sicil no kontrol edilmeli.');
    });

    it('submits commission final grading and produces S/U mark', () => {
      const handleUpdate = vi.fn();
      render(
        <InternshipCommissionPanel
          internships={mockList}
          onUpdateInternship={handleUpdate}
          currentUser={mockAdvisorUser}
        />
      );

      const reviewButtons = screen.getAllByText(/İncele & Karar/i);
      fireEvent.click(reviewButtons[0]);

      const gradeTabBtn = screen.getByRole('button', { name: /Final Notlandır/i });
      fireEvent.click(gradeTabBtn);

      const applyDecisionBtn = screen.getByText(/Kararı Kaydet ve Uygula/i);
      fireEvent.click(applyDecisionBtn);

      expect(handleUpdate).toHaveBeenCalledTimes(1);
      const updated = handleUpdate.mock.calls[0][0];
      expect(updated.status).toBe(INTERNSHIP_STATUS.GRADED_PASSED);
      expect(updated.finalGrade).toBe('S');
      expect(updated.obsExportReady).toBe(true);
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 3. Personel Dairesi Başkanlığı Toplu SGK Bildirge İhracı                    */
  /* -------------------------------------------------------------------------- */
  describe('3. Personel Dairesi Başkanlığı Toplu SGK Bildirge İhracı', () => {
    const sgkEligibleList = [
      {
        id: 'INT-SGK-1',
        studentName: 'Ahmet Yıldız',
        studentNo: '20220101050',
        tcNo: '10000000146',
        department: 'Bilgisayar Mühendisliği',
        companyName: 'Aselsan A.Ş.',
        sgkSicilNo: '2.4510.01.01.1234567.034.01-44',
        startDate: '2026-07-01',
        endDate: '2026-07-31',
        workDays: 22,
        hasFamilyGss: true,
        status: INTERNSHIP_STATUS.COMMISSION_APPROVED,
        sgkBarcode: null
      },
      {
        id: 'INT-SGK-2',
        studentName: 'Seda Kurt',
        studentNo: '20220101051',
        tcNo: '10000000146',
        department: 'Yazılım Mühendisliği',
        companyName: 'Baykar Teknoloji',
        sgkSicilNo: '2.4520.02.02.9876543.034.02-88',
        startDate: '2026-07-15',
        endDate: '2026-08-15',
        workDays: 24,
        hasFamilyGss: false,
        status: INTERNSHIP_STATUS.SGK_REGISTERED,
        sgkBarcode: 'IESU-SGK-5510-77665544'
      }
    ];

    it('renders SGK export table with 5510/5-b branch code 07', () => {
      render(
        <SGKExportPanel
          internships={sgkEligibleList}
          onUpdateInternship={vi.fn()}
          currentUser={mockAdminUser}
        />
      );

      expect(screen.getByText(/Toplu SGK Bildirge İhraç ve Tescil Konsolu/i)).toBeInTheDocument();
      expect(screen.getByText('Ahmet Yıldız')).toBeInTheDocument();
      expect(screen.getAllByText(/07 - Çırak \/ Stajyer/i).length).toBeGreaterThan(0);
      expect(screen.getByText('Tescil Bekliyor')).toBeInTheDocument();
      expect(screen.getByText('IESU-SGK-5510-77665544')).toBeInTheDocument();
    });

    it('downloads bulk CSV when Toplu SGK CSV is clicked', () => {
      render(
        <SGKExportPanel
          internships={sgkEligibleList}
          onUpdateInternship={vi.fn()}
          currentUser={mockAdminUser}
        />
      );

      const csvBtn = screen.getByText(/Toplu SGK CSV/i);
      fireEvent.click(csvBtn);

      expect(window.toast.success).toHaveBeenCalledWith(expect.stringContaining('CSV dosyası indirildi'));
    });

    it('downloads Web Service JSON when SGK WebServis JSON is clicked', () => {
      render(
        <SGKExportPanel
          internships={sgkEligibleList}
          onUpdateInternship={vi.fn()}
          currentUser={mockAdminUser}
        />
      );

      const jsonBtn = screen.getByText(/SGK WebServis JSON/i);
      fireEvent.click(jsonBtn);

      expect(window.toast.success).toHaveBeenCalledWith(expect.stringContaining('JSON çıktısı indirildi'));
    });

    it('batch registers selected pending students and generates barcodes', () => {
      const handleUpdate = vi.fn();
      render(
        <SGKExportPanel
          internships={sgkEligibleList}
          onUpdateInternship={handleUpdate}
          currentUser={mockAdminUser}
        />
      );

      // Select all
      const selectAllBtn = screen.getByText(/Tümünü Seç/i);
      fireEvent.click(selectAllBtn);

      const registerBtn = screen.getByText(/Seçilenleri SGK'ya Tescil Et/i);
      fireEvent.click(registerBtn);

      expect(handleUpdate).toHaveBeenCalledTimes(1);
      const registeredItem = handleUpdate.mock.calls[0][0];
      expect(registeredItem.status).toBe(INTERNSHIP_STATUS.SGK_REGISTERED);
      expect(registeredItem.sgkBarcode).toContain('IESU-SGK-5510');
      expect(window.toast.success).toHaveBeenCalledWith(expect.stringContaining('tescil edildi'));
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 4. Dijital Staj Defteri & Final Notlandırma                                */
  /* -------------------------------------------------------------------------- */
  describe('4. Dijital Staj Defteri & Final Notlandırma', () => {
    const sampleInternshipForNotebook = {
      id: 'INT-NB-1',
      studentName: 'Ayşe Kaya',
      studentNo: '20220101001',
      companyName: 'Aselsan A.Ş.',
      workDays: 20,
      startDate: '2026-07-01',
      endDate: '2026-07-31',
      status: INTERNSHIP_STATUS.IN_PROGRESS,
      employerScore: 95,
      notebookEntries: [
        {
          day: 1,
          date: '2026-07-01',
          unit: 'Yazılım',
          activity: 'Oryantasyon programı ve kurumsal mimari eğitimi alındı.',
          skills: ['Mimari', 'Git']
        }
      ]
    };

    it('renders notebook header, progress percentage, and existing daily entries', () => {
      render(
        <DigitalInternshipNotebook
          internship={sampleInternshipForNotebook}
          onUpdateInternship={vi.fn()}
          currentUser={mockCurrentUser}
        />
      );

      expect(screen.getByText(/Dijital Staj Defteri ve Final Notlandırma/i)).toBeInTheDocument();
      expect(screen.getByText('Gün #1')).toBeInTheDocument();
      expect(screen.getByText(/Oryantasyon programı/i)).toBeInTheDocument();
      expect(screen.getByText('Doldurulan Gün:')).toBeInTheDocument();
    });

    it('adds a new daily technical log entry with skills', () => {
      const handleUpdate = vi.fn();
      render(
        <DigitalInternshipNotebook
          internship={sampleInternshipForNotebook}
          onUpdateInternship={handleUpdate}
          currentUser={mockCurrentUser}
        />
      );

      const addBtn = screen.getByText(/Yeni Gün Ekle/i);
      fireEvent.click(addBtn);

      const activityInput = screen.getByPlaceholderText(/veritabanı performans/i);
      fireEvent.change(activityInput, { target: { value: 'Bugün microservices mimarisi ve event bus mesajlaşma altyapısı kodlandı.' } });

      const skillsInput = screen.getByPlaceholderText(/PostgreSQL, Docker/i);
      fireEvent.change(skillsInput, { target: { value: 'Microservices, Docker, EventBus' } });

      const saveBtn = screen.getByText('Kaydet');
      fireEvent.click(saveBtn);

      expect(handleUpdate).toHaveBeenCalledTimes(1);
      const updated = handleUpdate.mock.calls[0][0];
      expect(updated.notebookEntries.length).toBe(2);
      expect(screen.getByText(/Gün #2/i)).toBeInTheDocument();
      expect(window.toast.success).toHaveBeenCalledWith(expect.stringContaining('deftere eklendi'));
    });

    it('blocks logging activities on Sundays with statutory warning', () => {
      const handleUpdate = vi.fn();
      render(
        <DigitalInternshipNotebook
          internship={sampleInternshipForNotebook}
          onUpdateInternship={handleUpdate}
          currentUser={mockCurrentUser}
        />
      );

      const addBtn = screen.getByText(/Yeni Gün Ekle/i);
      fireEvent.click(addBtn);

      // Select 2026-07-05 (Sunday)
      const dateInput = screen.getByDisplayValue(/2026-07-02/i);
      fireEvent.change(dateInput, { target: { value: '2026-07-05' } });

      const activityInput = screen.getByPlaceholderText(/veritabanı performans/i);
      fireEvent.change(activityInput, { target: { value: 'Pazar günü çalışarak veri tabanı yedeklerini aldım.' } });

      const saveBtn = screen.getByText('Kaydet');
      fireEvent.click(saveBtn);

      expect(handleUpdate).not.toHaveBeenCalled();
      expect(screen.getByText(/Pazar günleri yasal olarak staj faaliyeti gerçekleştirilemez/i)).toBeInTheDocument();
    });

    it('submits notebook to commission and triggers toast', () => {
      const handleUpdate = vi.fn();
      render(
        <DigitalInternshipNotebook
          internship={sampleInternshipForNotebook}
          onUpdateInternship={handleUpdate}
          currentUser={mockCurrentUser}
        />
      );

      const submitBtn = screen.getByText(/Komisyona Teslim Et/i);
      fireEvent.click(submitBtn);

      expect(handleUpdate).toHaveBeenCalledTimes(1);
      const updated = handleUpdate.mock.calls[0][0];
      expect(updated.status).toBe(INTERNSHIP_STATUS.NOTEBOOK_SUBMITTED);
      expect(window.toast.success).toHaveBeenCalledWith(expect.stringContaining('teslim edildi'));
    });

    it('downloads official digital logbook PDF', () => {
      render(
        <DigitalInternshipNotebook
          internship={sampleInternshipForNotebook}
          onUpdateInternship={vi.fn()}
          currentUser={mockCurrentUser}
        />
      );

      const downloadPdfBtn = screen.getByText(/Resmî Defter PDF İndir/i);
      fireEvent.click(downloadPdfBtn);

      expect(window.toast.success).toHaveBeenCalledWith(expect.stringContaining('Staj Defteri PDF'));
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 5. StajPanel Top-Level Integration                                         */
  /* -------------------------------------------------------------------------- */
  describe('5. StajPanel Top-Level Integration & Tab Navigation', () => {
    it('renders StajPanel and allows switching between Süreç, Belgeler, Takip and Defter tabs', () => {
      render(
        <StajPanel
          setView={vi.fn()}
          userRole="student"
          currentUser={mockCurrentUser}
        />
      );

      expect(screen.getByText('Yasal Başvuru ve Uygulama Adımları')).toBeInTheDocument();

      // Switch to Belgeler tab
      const belgelerTab = screen.getByRole('button', { name: /Resmî Belgeler/i });
      fireEvent.click(belgelerTab);
      expect(screen.getByText('Form-1: Resmî Staj Kabul ve SGK Taahhüt Formu (3308 / 5510)')).toBeInTheDocument();

      // Switch to Takip tab
      const takipTab = screen.getByRole('button', { name: /Staj & Komisyon Takibi/i });
      fireEvent.click(takipTab);
      expect(screen.getByText(/Staj & Fakülte Komisyon Takip Kartı/i)).toBeInTheDocument();

      // Switch to Defter tab
      const defterTab = screen.getByRole('button', { name: /Dijital Staj Defteri/i });
      fireEvent.click(defterTab);
      expect(screen.getByText(/Dijital Staj Defteri ve Final Notlandırma/i)).toBeInTheDocument();
    });

    it('opens Form-1 application modal from the hero CTA button', () => {
      render(
        <StajPanel
          setView={vi.fn()}
          userRole="student"
          currentUser={mockCurrentUser}
        />
      );

      const form1Btn = screen.getByRole('button', { name: /Form-1 Staj Başvurusu Yap/i });
      fireEvent.click(form1Btn);

      expect(screen.getByText(/Staj Kabul ve Resmî SGK Taahhüt Formu \(Form-1\)/i)).toBeInTheDocument();
    });

    it('renders Komisyon and SGK tabs when user is admin or academic staff', () => {
      render(
        <StajPanel
          setView={vi.fn()}
          userRole="admin"
          currentUser={mockAdminUser}
        />
      );

      expect(screen.getByText(/Staj Komisyonu Masası/i)).toBeInTheDocument();
      expect(screen.getByText(/SGK Bildirge Masası/i)).toBeInTheDocument();

      // Switch to Komisyon Masası
      const komisyonTab = screen.getByText(/Staj Komisyonu Masası/i);
      fireEvent.click(komisyonTab);
      expect(screen.getByText(/Bölüm Staj Komisyonu Onay Paneli/i)).toBeInTheDocument();

      // Switch to SGK Masası
      const sgkTab = screen.getByText(/SGK Bildirge Masası/i);
      fireEvent.click(sgkTab);
      expect(screen.getByText(/Toplu SGK Bildirge İhraç ve Tescil Konsolu/i)).toBeInTheDocument();
    });
  });

});
