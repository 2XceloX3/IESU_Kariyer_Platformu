/**
 * src/__tests__/GlobalUniversityAndEuroPass.integration.test.jsx
 * Küresel Üniversite Omurgası (i18n, EuroPass CV, Bologna DS, PPP Yaşam Maliyeti ve QS/THE Sıralama) Entegrasyon Testleri
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { setLanguage, getLanguage, t } from '../i18n';
import LanguageSwitcher from '../components/shared/LanguageSwitcher';
import MainHeader from '../components/MainHeader';
import EuroPassExportModal from '../components/global/EuroPassExportModal';
import GlobalCareerCostCalculator, { GLOBAL_CITIES_PARITY_DATA, calculateLivingParity } from '../components/global/GlobalCareerCostCalculator';
import QSWorldRankingReportCard from '../components/accreditation/QSWorldRankingReportCard';
import CMSAnalytics from '../components/admin/CMSAnalytics';
import StudentKGBPanel from '../components/StudentKGBPanel';
import GlobalAlumniMap from '../components/GlobalAlumniMap';
import StudentApplicationRadar from '../components/student/StudentApplicationRadar';
import Form1InternshipModal from '../components/internship/Form1InternshipModal';
import { EUROPASS_STANDARDS } from '../services/euroPassWorkflow';
import { QS_RANKING_STANDARDS } from '../services/qsRankingWorkflow';

// Mock react-simple-maps to avoid SVG projection overhead in JSDOM
vi.mock('react-simple-maps', () => {
  return {
    ComposableMap: ({ children }) => <div data-testid="composable-map">{children}</div>,
    Geographies: ({ children }) => <div>{children({ geographies: [] })}</div>,
    Geography: () => <div data-testid="geography" />,
    ZoomableGroup: ({ children }) => <div data-testid="zoomable-group">{children}</div>,
    Marker: ({ children }) => <div>{children}</div>,
  };
});

describe('Global University Ecosystem Integration Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    setLanguage('tr');
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('1. Çok Dilli (TR / EN) Küresel Dil Motoru ve LanguageSwitcher', () => {
    it('switches between Turkish and English and updates storage', () => {
      render(<LanguageSwitcher variant="pill" />);

      const enBtn = screen.getByText('EN');
      fireEvent.click(enBtn);

      expect(getLanguage()).toBe('en');
      expect(localStorage.getItem('iesu_preferred_language')).toBe('en');

      const trBtn = screen.getByText('TR');
      fireEvent.click(trBtn);

      expect(getLanguage()).toBe('tr');
      expect(localStorage.getItem('iesu_preferred_language')).toBe('tr');
    });

    it('translates nested keys and performs fallback interpolation', () => {
      expect(t('common.appName')).toBe('İstanbul Esenyurt Üniversitesi');
      expect(t('nav.aboutUs', {}, 'en')).toBe('About Us');
      expect(t('radar.stageSubmitted', {}, 'en')).toBe('Application Submitted');
      expect(t('radar.vipProtocolBadge', {}, 'tr')).toContain('İESÜ Protokol Kontenjanı');
    });

    it('renders translated navigation links in MainHeader when English is active', () => {
      setLanguage('en');
      render(
        <MemoryRouter>
          <MainHeader currentUser={null} userRole="guest" />
        </MemoryRouter>
      );

      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Events')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(screen.getByText("What's Happening?")).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('renders StudentApplicationRadar with reactive bilingual support', () => {
      setLanguage('tr');
      const { rerender } = render(
        <MemoryRouter>
          <StudentApplicationRadar currentUser={{ id: 's1', name: 'Ahmet', role: 'student' }} />
        </MemoryRouter>
      );

      expect(screen.getByText('Canlı Başvuru Radarı & Mikro-Geri Bildirim')).toBeInTheDocument();
      expect(screen.getByText('Toplam Başvuru')).toBeInTheDocument();

      setLanguage('en');
      rerender(
        <MemoryRouter>
          <StudentApplicationRadar currentUser={{ id: 's1', name: 'Ahmet', role: 'student' }} />
        </MemoryRouter>
      );

      expect(screen.getByText('Live Application Radar & Micro-Feedback')).toBeInTheDocument();
      expect(screen.getByText('Total Applications')).toBeInTheDocument();
    });

    it('renders Form1InternshipModal with reactive bilingual support and LanguageSwitcher', () => {
      setLanguage('tr');
      const { rerender } = render(
        <Form1InternshipModal isOpen={true} onClose={vi.fn()} currentUser={{ id: 's1', name: 'Ayşe' }} />
      );

      expect(screen.getByText('Staj Kabul ve Resmî SGK Taahhüt Formu (Form-1)')).toBeInTheDocument();
      expect(screen.getByText('Form-1 • Resmî Başvuru')).toBeInTheDocument();

      setLanguage('en');
      rerender(
        <Form1InternshipModal isOpen={true} onClose={vi.fn()} currentUser={{ id: 's1', name: 'Ayşe' }} />
      );

      expect(screen.getByText('Traineeship Acceptance & Social Security Declaration (Form-1)')).toBeInTheDocument();
      expect(screen.getByText('Form-1 • Official Application')).toBeInTheDocument();
    });
  });

  describe('2. EuroPass CV, Bologna Diploma Eki ve Erasmus+ Modalı', () => {
    const studentMock = {
      name: 'Ahmet Yılmaz',
      studentNo: '2023010482',
      department: 'Bilgisayar Mühendisliği',
      faculty: 'Mühendislik ve Mimarlık Fakültesi',
      gano: 3.84,
      totalEcts: 240,
      completedEcts: 180,
      email: 'ahmet@esenyurt.edu.tr',
      skills: ['C++', 'Python', 'React', 'Cloud'],
      internships: [
        {
          company: 'Baykar Teknoloji',
          position: 'Yapay Zekâ Stajyeri',
          date: '07/2025 - 08/2025',
          duration: '20 İş Günü',
          summary: 'İHA telemetri optimizasyonu'
        }
      ]
    };

    it('renders EuroPass modal with dual institutional and EHEA branding', () => {
      render(
        <EuroPassExportModal
          isOpen={true}
          onClose={vi.fn()}
          studentProfile={studentMock}
        />
      );

      expect(screen.getByText(/EUROPASS & BOLOGNA EHEA/i)).toBeInTheDocument();
      expect(screen.getAllByText(/TR ISTANBU35/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/EuroPass Standartlarında CV/i)).toBeInTheDocument();
    });

    it('switches between EuroPass CV, Diploma Supplement, and Erasmus+ Agreement tabs', () => {
      render(
        <EuroPassExportModal
          isOpen={true}
          onClose={vi.fn()}
          studentProfile={studentMock}
        />
      );

      // Tab 1: CV
      expect(screen.getByText(/Work & Internship Experience|Staj ve İş Deneyimleri/i)).toBeInTheDocument();

      // Tab 2: DS
      const dsTabBtn = screen.getByText(/Bologna Diploma Eki \(DS\)|Bologna Diploma Supplement/i);
      fireEvent.click(dsTabBtn);
      expect(screen.getByText(/DS No: IESU-DS-2026-2023010482/i)).toBeInTheDocument();

      // Tab 3: Erasmus+
      const erasmusTabBtn = screen.getByText(/Erasmus\+ Staj Anlaşması|Erasmus\+ Traineeship Agreement/i);
      fireEvent.click(erasmusTabBtn);
      expect(screen.getByText(/Learning Agreement for Traineeships/i)).toBeInTheDocument();
    });

    it('copies JSON-LD payload to clipboard when copy button is clicked', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock
        }
      });

      render(
        <EuroPassExportModal
          isOpen={true}
          onClose={vi.fn()}
          studentProfile={studentMock}
        />
      );

      const copyBtn = screen.getByText(/JSON-LD Kopyala|Copy JSON-LD/i);
      fireEvent.click(copyBtn);

      await waitFor(() => {
        expect(writeTextMock).toHaveBeenCalled();
        const payload = JSON.parse(writeTextMock.mock.calls[0][0]);
        expect(payload['@context']).toBeDefined();
        expect(payload.id).toContain('2023010482');
      });
    });

    it('dispatches active document to print window for CV, DS, and Erasmus tabs', () => {
      const openMock = vi.fn().mockImplementation(() => ({
        document: { write: vi.fn(), close: vi.fn() },
        focus: vi.fn(),
        print: vi.fn()
      }));
      vi.stubGlobal('open', openMock);

      render(
        <EuroPassExportModal
          isOpen={true}
          onClose={vi.fn()}
          studentProfile={studentMock}
        />
      );

      // Tab 1: CV print
      const printBtn = screen.getByText(/Resmî Çıktı \/ HTML|Print \/ Export HTML/i);
      fireEvent.click(printBtn);
      expect(openMock).toHaveBeenCalled();
      const cvHtml = openMock.mock.results[0].value.document.write.mock.calls[0][0];
      expect(cvHtml).toContain('EUROPASS CURRICULUM VITAE');

      // Tab 2: DS print
      const dsTabBtn = screen.getByText(/Bologna Diploma Eki \(DS\)|Bologna Diploma Supplement/i);
      fireEvent.click(dsTabBtn);
      fireEvent.click(printBtn);
      const dsHtml = openMock.mock.results[1].value.document.write.mock.calls[0][0];
      expect(dsHtml).toContain('DIPLOMA SUPPLEMENT');

      // Tab 3: Erasmus print
      const erasmusTabBtn = screen.getByText(/Erasmus\+ Staj Anlaşması|Erasmus\+ Traineeship Agreement/i);
      fireEvent.click(erasmusTabBtn);
      fireEvent.click(printBtn);
      const erasmusHtml = openMock.mock.results[2].value.document.write.mock.calls[0][0];
      expect(erasmusHtml).toContain('LEARNING AGREEMENT FOR TRAINEESHIPS');
    });

    it('integrates EuroPass & Bologna export button in StudentKGBPanel', () => {
      render(
        <MemoryRouter>
          <StudentKGBPanel
            setView={vi.fn()}
            currentUser={{ ...studentMock, role: 'student' }}
            userRole="student"
          />
        </MemoryRouter>
      );

      const euroPassBtn = screen.getByText('EuroPass & Bologna Eki');
      expect(euroPassBtn).toBeInTheDocument();

      // Clicking opens the modal
      fireEvent.click(euroPassBtn);
      expect(screen.getAllByText(/EUROPASS & BOLOGNA EHEA/i).length).toBeGreaterThan(0);
    });
  });

  describe('3. Küresel Kariyer & Alım Gücü (PPP) Yaşam Maliyeti Hesaplayıcı', () => {
    it('renders city selector and updates parity KPIs when target city is changed', () => {
      render(<GlobalCareerCostCalculator initialCityKey="berlin" isModal={false} />);

      expect(screen.getByText(/Berlin vs İstanbul/i)).toBeInTheDocument();
      expect(screen.getByText(/Net Harcanabilir Gelir|Net Disposable Monthly Income/i)).toBeInTheDocument();

      // Select Amsterdam using test id
      const citySelect = screen.getByTestId('target-city-select');
      fireEvent.change(citySelect, { target: { value: 'amsterdam' } });

      expect(screen.getByText(/Amsterdam vs İstanbul/i)).toBeInTheDocument();
    });

    it('calculates living cost breakdown for various lifestyles', () => {
      render(<GlobalCareerCostCalculator initialCityKey="london" isModal={false} />);

      // Switch to Frugal (Tutumlu)
      const frugalBtn = screen.getByText('Tutumlu');
      fireEvent.click(frugalBtn);

      expect(screen.getByText(/Aylık Harcama Kalemleri Dağılımı/i)).toBeInTheDocument();
      expect(screen.getByText(/İstanbul'da Aynı Yaşam Standardı İçin Gereken/i)).toBeInTheDocument();
    });

    it('provides integration launcher in GlobalAlumniMap empty and active hub states', () => {
      render(
        <MemoryRouter>
          <GlobalAlumniMap
            setView={vi.fn()}
            currentUser={{ name: 'Ahmet', role: 'student' }}
            userRole="student"
          />
        </MemoryRouter>
      );

      const pppLauncher = screen.getByTestId('open-global-ppp-calc');
      expect(pppLauncher).toBeInTheDocument();

      fireEvent.click(pppLauncher);
      expect(screen.getAllByText(/Alım Gücü \(PPP\) Hesaplayıcı|Purchasing Power Parity/i).length).toBeGreaterThan(0);
    });
  });

  describe('4. QS / THE Dünya Sıralaması İtibar & İstihdam Raporlama Motoru', () => {
    it('renders QSWorldRankingReportCard with indicators and Fortune 500 employer logos', () => {
      render(<QSWorldRankingReportCard />);

      expect(screen.getByText(/QS & THE Graduate Employability Rankings Audit Engine/i)).toBeInTheDocument();
      expect(screen.getByText(/Genel QS İstihdam Skoru|Composite QS Employability Score/i)).toBeInTheDocument();
      expect(screen.getByText(/Akredite Global 2000 & Fortune 500 İşveren Temsiliyeti/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Google/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Siemens/i).length).toBeGreaterThan(0);
    });

    it('renders QS Ranking tab in CMSAnalytics and switches view cleanly', () => {
      render(
        <CMSAnalytics
          students={[{ id: 's1', name: 'Ali' }]}
          alumni={[{ id: 'a1', name: 'Zeynep', company: 'Google', country: 'Germany' }]}
          companies={[{ id: 'c1', name: 'Baykar' }]}
        />
      );

      const qsTabBtn = screen.getByTestId('tab-qs-the-ranking');
      expect(qsTabBtn).toBeInTheDocument();

      fireEvent.click(qsTabBtn);

      expect(screen.getByTestId('qs-ranking-content')).toBeInTheDocument();
      expect(screen.getByText(/QS & THE Graduate Employability Rankings Audit Engine/i)).toBeInTheDocument();
    });

    it('triggers audit dossier export without crashing', () => {
      const openMock = vi.fn().mockReturnValue({
        document: { write: vi.fn(), close: vi.fn() },
        focus: vi.fn(),
        print: vi.fn()
      });
      vi.stubGlobal('open', openMock);

      render(<QSWorldRankingReportCard />);

      const exportBtn = screen.getByTestId('export-qs-audit-report-btn');
      fireEvent.click(exportBtn);

      expect(openMock).toHaveBeenCalled();
    });
  });

  describe('5. AGENTS.md Kurumsal Kimlik & Veri Bütünlüğü Doğrulaması', () => {
    it('strictly maintains official institutional name: İstanbul Esenyurt Üniversitesi (İESÜ)', () => {
      expect(t('common.appName')).toBe('İstanbul Esenyurt Üniversitesi');
      expect(EUROPASS_STANDARDS.INSTITUTION_NAME).toBe('İstanbul Esenyurt Üniversitesi (İESÜ)');
      expect(QS_RANKING_STANDARDS.INSTITUTION_NAME).toBe('İstanbul Esenyurt Üniversitesi (İESÜ)');
    });

    it('strictly maintains official coordinator title: Kariyer Geliştirme Koordinatörlüğü', () => {
      expect(t('common.coordinatorTitle')).toBe('Kariyer Geliştirme Koordinatörlüğü');
      expect(EUROPASS_STANDARDS.COORDINATION_OFFICE).toBe('Kariyer Geliştirme Koordinatörlüğü');
    });

    it('strictly maintains official alumni portal title: İESÜ Mezunlar Portalı', () => {
      expect(t('common.alumniPortalTitle')).toBe('İESÜ Mezunlar Portalı');
    });
  });
});
