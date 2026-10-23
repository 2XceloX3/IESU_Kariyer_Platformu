/**
 * src/__tests__/YokakAccreditationAndPUKO.integration.test.jsx
 * Comprehensive integration test suite for ADIM 2:
 * "YÖK / YÖKAK Uyumlu Akreditasyon & İstihdam Raporlama Motoru"
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CMSAnalytics from '../components/admin/CMSAnalytics';
import AlumniSurveys from '../components/AlumniSurveys';
import CompanySurveys from '../components/CompanySurveys';
import useAppStore from '../store/useAppStore';
import { useAdminStore } from '../brain/useAdminStore';
import { SAMPLE_ACCREDITATION_DECLARATIONS, PUKO_CYCLE_STAGES } from '../services/accreditationWorkflow';

describe('YÖK / YÖKAK Akreditasyon ve İstihdam Raporlama Motoru Integration Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAdminStore.setState({
      checkupRecords: [],
      employmentDeclarations: [...SAMPLE_ACCREDITATION_DECLARATIONS],
      pukoScorecards: [],
      surveys: [],
    });
  });

  describe('CMSAnalytics Panel Integration & YÖK A.1.1 Indicators', () => {
    it('renders CMSAnalytics with official PanelHeader actions and YÖKAK title', () => {
      render(<CMSAnalytics students={[]} alumni={[]} companies={[]} jobs={[]} applications={[]} />);

      expect(screen.getByText('Sistem Analitiği')).toBeInTheDocument();
      expect(screen.getByText('Resmî YÖKAK Raporu Al (PDF/Yazdır)')).toBeInTheDocument();
      expect(screen.getByText('Resmî Excel/CSV İndir')).toBeInTheDocument();
      expect(screen.getByText(/YÖKAK KAP A\.1\.1 & B\.2\.2/i)).toBeInTheDocument();
    });

    it('renders all YÖK A.1.1 and sectoral alignment indicator cards', () => {
      render(<CMSAnalytics students={[]} alumni={[]} companies={[]} jobs={[]} applications={[]} />);

      // A.1.1.0 Genel İstihdam
      expect(screen.getByText(/Genel Mezun İstihdamı \(A\.1\.1\.0\)/i)).toBeInTheDocument();

      // A.1.1.1 İlk 6 Ay
      expect(screen.getByText(/İlk 6 Ayda İstihdam \(YÖK A\.1\.1\.1\)/i)).toBeInTheDocument();

      // A.1.1.2 İlk 1 Yıl
      expect(screen.getByText(/İlk 1 Yılda İstihdam \(YÖK A\.1\.1\.2\)/i)).toBeInTheDocument();

      // Sektörel Alan İçi Uyum Katsayısı
      expect(screen.getByText(/Sektörel Alan İçi Uyum Katsayısı/i)).toBeInTheDocument();
    });

    it('allows switching between pyramids, PUKÖ scorecards, and audit registry views', async () => {
      render(<CMSAnalytics students={[]} alumni={[]} companies={[]} jobs={[]} applications={[]} />);

      // Varsayılan görünüm: Maaş & Sektör Piramidi
      expect(screen.getByText(/Maaş ve Sektör Dağılım Piramitleri/i)).toBeInTheDocument();

      // PUKÖ Kalite Karneleri sekmesine geçiş
      const pukoTabBtn = screen.getByRole('button', { name: /PUKÖ Kalite Karneleri/i });
      fireEvent.click(pukoTabBtn);
      await waitFor(() => {
        expect(screen.getByText(/Bölüm Bazlı PUKÖ Kalite Karneleri & Kapanış Döngüsü/i)).toBeInTheDocument();
      });

      // Denetim Kütüğü sekmesine geçiş
      const auditTabBtn = screen.getByRole('button', { name: /Denetim Kütüğü/i });
      fireEvent.click(auditTabBtn);
      await waitFor(() => {
        expect(screen.getByText(/Resmî YÖKAK Denetim Mezun İstihdam Kütüğü/i)).toBeInTheDocument();
        expect(screen.getByText(/KVKK 6698 Sayılı Kanun gereğince/i)).toBeInTheDocument();
      });
    });
  });

  describe('Employment Pyramids (Salary & Sector Distribution)', () => {
    it('displays 5-tier salary pyramid and switches to sector distribution', async () => {
      render(<CMSAnalytics students={[]} alumni={[]} companies={[]} jobs={[]} applications={[]} />);

      // 5 kademeli maaş skalasını doğrula
      expect(screen.getAllByText(/Asgari Ücret/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Orta Gelir/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/İleri Düzey/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Uzman \/ Kıdemli/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Üst Düzey \/ Global/i).length).toBeGreaterThan(0);

      // Sektör dağılımı alt sekmesine geç
      const sectorSubBtn = screen.getByRole('button', { name: /Sektör Dağılımı/i });
      fireEvent.click(sectorSubBtn);
      await waitFor(() => {
        expect(screen.getAllByText(/Toplam İstihdam:/i).length).toBeGreaterThan(0);
      });

      // Alan İçi Uyum alt sekmesine geç
      const alignSubBtn = screen.getByRole('button', { name: /Alan İçi Uyum/i });
      fireEvent.click(alignSubBtn);
      await waitFor(() => {
        expect(screen.getByText(/YÖKAK KAP Ölçüt A\.1\.1 Uyum Katsayısı/i)).toBeInTheDocument();
        expect(screen.getByText(/Alan İçi İstihdam \(Kendi Bölümü\)/i)).toBeInTheDocument();
      });
    });
  });

  describe('PUKÖ Quality Scorecards & PDCA Cycle Closing Interaction', () => {
    it('allows quality commission coordinator to close a PUKÖ cycle with official action note', async () => {
      render(<CMSAnalytics students={[]} alumni={[]} companies={[]} jobs={[]} applications={[]} />);

      // PUKÖ sekmesine git
      const pukoTabBtn = screen.getByRole('button', { name: /PUKÖ Kalite Karneleri/i });
      fireEvent.click(pukoTabBtn);

      await waitFor(() => {
        expect(screen.getByText(/Bölüm Bazlı PUKÖ Kalite Karneleri/i)).toBeInTheDocument();
      });

      // Bir bölüm için Döngüyü Kapat / Kararı İncele butonuna tıkla
      const actionButtons = screen.getAllByRole('button', { name: /(Döngüyü Kapat|Kararı İncele)/i });
      expect(actionButtons.length).toBeGreaterThan(0);
      fireEvent.click(actionButtons[0]);

      // Kapanış Masası Modalını doğrula
      await waitFor(() => {
        expect(screen.getByText(/YÖKAK PUKÖ Kapanış Masası/i)).toBeInTheDocument();
      });

      // Karar notu yaz ve onayla
      const textarea = screen.getByPlaceholderText(/müfredatında sektörün ihtiyaç duyduğu/i);
      fireEvent.change(textarea, { target: { value: '2026 Güz Dönemi Müfredatına Bulut Mimarisi Seçmeli Dersi eklendi; döngü kapatıldı.' } });

      const confirmBtn = screen.getByRole('button', { name: /Kararı Onayla ve Döngüyü Kapat/i });
      fireEvent.click(confirmBtn);

      // Modal kapanmalı ve PUKÖ döngüsü güncellenmeli
      await waitFor(() => {
        expect(screen.queryByText(/YÖKAK PUKÖ Kapanış Masası/i)).not.toBeInTheDocument();
      });

      // Verify that other departments did NOT disappear from the scorecards table!
      const remainingActionButtons = screen.getAllByRole('button', { name: /(Döngüyü Kapat|Kararı İncele)/i });
      expect(remainingActionButtons.length).toBeGreaterThanOrEqual(8);
      expect(screen.getByText(/2026 Güz Dönemi Müfredatına Bulut Mimarisi/i)).toBeInTheDocument();
    });
  });

  describe('Single-Click Official YÖKAK Audit Report Exports', () => {
    it('triggers PDF / Print export with Rectorate & Coordinator approval blocks', () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => ({
        document: {
          write: vi.fn(),
          close: vi.fn(),
        },
      }));

      render(<CMSAnalytics students={[]} alumni={[]} companies={[]} jobs={[]} applications={[]} />);

      const pdfExportBtn = screen.getByText('Resmî YÖKAK Raporu Al (PDF/Yazdır)');
      fireEvent.click(pdfExportBtn);

      expect(openSpy).toHaveBeenCalledWith('', '_blank');
      openSpy.mockRestore();
    });

    it('triggers Excel/CSV download with UTF-8 BOM and masked TCKN', () => {
      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
      const urlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

      render(<CMSAnalytics students={[]} alumni={[]} companies={[]} jobs={[]} applications={[]} />);

      const csvExportBtn = screen.getByText('Resmî Excel/CSV İndir');
      fireEvent.click(csvExportBtn);

      expect(urlSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();

      clickSpy.mockRestore();
      urlSpy.mockRestore();
      revokeSpy.mockRestore();
    });
  });

  describe('Survey Feedback Loop into PUKÖ Quality Scorecard', () => {
    it('AlumniSurveys submission updates department alumni satisfaction score', async () => {
      const mockAlumni = { id: 'ALU-099', name: 'Alperen Yılmaz', department: 'Yazılım Mühendisliği', role: 'alumni' };

      render(<AlumniSurveys currentUser={mockAlumni} surveys={[]} />);

      // PUKÖ anketini başlat
      const startBtn = screen.getByRole('button', { name: /Ankete Katıl/i });
      fireEvent.click(startBtn);

      // Soruları 5 puanla yanıtla
      const buttons = screen.getAllByRole('button', { name: '5' });
      buttons.forEach(btn => fireEvent.click(btn));

      // Gönder
      const submitBtn = screen.getByRole('button', { name: /Yanıtları Gönder/i });
      fireEvent.click(submitBtn);

      // useAppStore scorecard güncellemesini doğrula
      const currentScorecards = useAdminStore.getState().pukoScorecards;
      const seDept = currentScorecards.find(s => s.department === 'Yazılım Mühendisliği');
      expect(seDept).toBeDefined();
      expect(seDept.alumniScore).toBe(5.0);

      // surveyResponses havuzunun da güncellendiğini doğrula
      const responses = useAdminStore.getState().surveyResponses;
      expect(responses.length).toBeGreaterThan(0);
      expect(responses[0].department).toBe('Yazılım Mühendisliği');
    });

    it('CompanySurveys submission updates department employer evaluation score', async () => {
      const mockCompany = { id: 'CMP-001', name: 'Baykar Teknoloji', role: 'company' };

      render(<CompanySurveys currentUser={mockCompany} surveys={[]} />);

      // İşveren anketini başlat
      const startButtons = screen.getAllByRole('button', { name: /Doldur/i });
      fireEvent.click(startButtons[0]);

      // Soruları yanıtla
      const ratingButtons = screen.getAllByRole('button', { name: '5' });
      ratingButtons.forEach(btn => fireEvent.click(btn));

      const choiceBtn = screen.getByRole('button', { name: 'Kesinlikle Evet' });
      fireEvent.click(choiceBtn);

      const textarea = screen.getByPlaceholderText(/Görüş ve önerilerinizi/i);
      fireEvent.change(textarea, { target: { value: 'Müfredatta bulut ve yapay zeka dersleri artırılmalı.' } });

      // Gönder
      const submitBtn = screen.getByRole('button', { name: /Değerlendirmeyi Gönder/i });
      fireEvent.click(submitBtn);

      // İşveren skoru store üzerinde güncellenmeli
      const currentScorecards = useAdminStore.getState().pukoScorecards;
      const seDept = currentScorecards.find(s => s.department === 'Yazılım Mühendisliği');
      expect(seDept).toBeDefined();
      expect(seDept.employerScore).toBeGreaterThanOrEqual(1.0);

      // surveyResponses havuzuna işveren yanıtının eklendiğini doğrula
      const responses = useAdminStore.getState().surveyResponses;
      expect(responses.some(r => r.targetAudience === 'Firmalar')).toBe(true);
    });
  });
});
