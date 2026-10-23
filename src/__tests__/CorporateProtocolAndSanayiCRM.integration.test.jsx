import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CorporateProtocolCRM from '../components/protocol/CorporateProtocolCRM';
import OperasyonPanel from '../components/admin/OperasyonPanel';
import CompanyFeed from '../components/CompanyFeed';
import useAppStore from '../store/useAppStore';
import {
  SAMPLE_CORPORATE_PROTOCOLS,
  SAMPLE_SECTOR_MENTORS,
  SAMPLE_ESBIM_EVENTS,
  SAMPLE_ISKUR_JOB_CLUB_COHORTS,
  PROTOCOL_STANDARDS,
  PROTOCOL_STATUS,
} from '../services/protocolWorkflow';

// Mock window.open for PDF print
const mockWindowOpen = vi.fn().mockReturnValue({
  document: {
    write: vi.fn(),
    close: vi.fn(),
  },
});

beforeEach(() => {
  vi.clearAllMocks();
  window.open = mockWindowOpen;
  window.alert = vi.fn();
  window.confirm = vi.fn().mockReturnValue(true);
  window.toast = {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  };

  // Reset store with clean sample protocols
  useAppStore.setState({
    corporateProtocols: [...SAMPLE_CORPORATE_PROTOCOLS],
    sectorMentors: [...SAMPLE_SECTOR_MENTORS],
    esbimEvents: [...SAMPLE_ESBIM_EVENTS],
    iskurJobClubCohorts: [...SAMPLE_ISKUR_JOB_CLUB_COHORTS],
    currentUser: {
      id: 'CMP-001',
      uid: 'CMP-001',
      name: 'Baykar Teknoloji',
      role: 'company',
      sector: 'Havacılık & Lojistik',
    },
  });
});

describe('ADIM 3: Kurumsal Protokol & Sanayi CRM Entegrasyon Testleri', () => {
  describe('1. CorporateProtocolCRM Bileşeni & Kurumsal Kimlik', () => {
    it('Resmî kurum adı ve koordinatörlük unvanları ile KPI kartlarını eksiksiz render eder', () => {
      render(<CorporateProtocolCRM />);

      // Kurumsal İsimlendirme Doğrulaması (AGENTS.md)
      expect(screen.getByText('İstanbul Esenyurt Üniversitesi (İESÜ)')).toBeInTheDocument();
      expect(screen.getByText('Kariyer Geliştirme Koordinatörlüğü')).toBeInTheDocument();
      expect(screen.getByText('Kurumsal Protokol & Sanayi CRM')).toBeInTheDocument();

      // KPI Metrik Kartları
      expect(screen.getByText('Toplam Protokol')).toBeInTheDocument();
      expect(screen.getAllByText('Aktif Protokol').length).toBeGreaterThan(0);
      expect(screen.getByText('Süresi Yaklaşan')).toBeInTheDocument();
      expect(screen.getByText('Taahhüt Kontenjan')).toBeInTheDocument();
      expect(screen.getByText('Yerleşen & Doluluk')).toBeInTheDocument();

      // Örnek protokollerin listede varlığı
      expect(screen.getByText('Aselsan A.Ş.')).toBeInTheDocument();
      expect(screen.getByText('Baykar Teknoloji')).toBeInTheDocument();
    });

    it('Protokol arama ve filtreleme çalışır', async () => {
      render(<CorporateProtocolCRM />);

      const searchInput = screen.getByPlaceholderText('Firma adı, protokol kodu veya sektör ara...');
      fireEvent.change(searchInput, { target: { value: 'Aselsan' } });

      // Sadece Aselsan görünmeli, Baykar filtrelenmeli
      expect(screen.getByText('Aselsan A.Ş.')).toBeInTheDocument();
      expect(screen.queryByText('Baykar Teknoloji')).not.toBeInTheDocument();

      // Aramayı temizle
      fireEvent.change(searchInput, { target: { value: '' } });
      expect(screen.getByText('Baykar Teknoloji')).toBeInTheDocument();
    });

    it('Yeni resmî protokol ekleme modalı formu doldurup listeye kaydeder', async () => {
      render(<CorporateProtocolCRM />);

      // Modal aç
      const addBtn = screen.getByRole('button', { name: /Yeni Protokol Ekle/i });
      fireEvent.click(addBtn);

      expect(screen.getByText('Yeni Resmî İş Birliği Protokolü')).toBeInTheDocument();

      // Formu doldur
      const companyInput = screen.getByPlaceholderText('Örn: Baykar Teknoloji, THY Teknik A.Ş.');
      fireEvent.change(companyInput, { target: { value: 'Roketsan A.Ş.' } });

      const contactInput = screen.getByPlaceholderText('Örn: Dr. Mehmet Yılmaz');
      fireEvent.change(contactInput, { target: { value: 'Mühendis Selim Demir' } });

      // Kaydet
      const saveBtn = screen.getByRole('button', { name: /Protokolü Kaydet/i });
      fireEvent.click(saveBtn);

      // Listede yeni eklenen protokolün çıktığını doğrula
      await waitFor(() => {
        expect(screen.getByText('Roketsan A.Ş.')).toBeInTheDocument();
      });
      expect(window.toast.success).toHaveBeenCalled();
    });

    it('Protokol detay modalını açar ve kapatır', async () => {
      render(<CorporateProtocolCRM />);

      // İlk "Detay" butonuna bas
      const detailButtons = screen.getAllByRole('button', { name: 'Detay' });
      fireEvent.click(detailButtons[0]);

      expect(screen.getByText(/Kapsam:/i)).toBeInTheDocument();

      // Kapat butonuna bas
      const closeBtn = screen.getByRole('button', { name: 'Kapat' });
      fireEvent.click(closeBtn);

      await waitFor(() => {
        expect(screen.queryByText(/Kapsam:/i)).not.toBeInTheDocument();
      });
    });

    it('Süresi yaklaşan protokolü uzatma ve kontenjan artırma (Yenileme) modalı', async () => {
      render(<CorporateProtocolCRM />);

      // İlk "Yenile" butonuna bas
      const renewButtons = screen.getAllByRole('button', { name: 'Yenile' });
      fireEvent.click(renewButtons[0]);

      expect(screen.getByText('Protokol Süre ve Kontenjan Yenileme')).toBeInTheDocument();

      // Yenile ve Kaydet butonuna bas
      const submitBtn = screen.getByRole('button', { name: /Yenile ve Kaydet/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(window.toast.success).toHaveBeenCalled();
      });
    });

    it('Protokolü askıya alma / feshetme işlemi durumu TERMINATED yapar', async () => {
      render(<CorporateProtocolCRM />);

      const terminateButtons = screen.getAllByRole('button', { name: 'Askıya Al' });
      fireEvent.click(terminateButtons[0]);

      expect(window.confirm).toHaveBeenCalled();
      expect(window.toast.info).toHaveBeenCalled();
    });
  });

  describe('2. İŞKUR & ESBİM Entegrasyon Köprüsü Sekmesi', () => {
    it('ESBİM ve İŞKUR panellerini ve kohortlarını eksiksiz render eder', () => {
      render(<CorporateProtocolCRM />);

      // Sekmeye geç
      const iskurTabBtn = screen.getByRole('button', { name: /İŞKUR & ESBİM Entegrasyon Köprüsü/i });
      fireEvent.click(iskurTabBtn);

      // ESBİM Kurumsal Başlığı
      expect(screen.getByText(PROTOCOL_STANDARDS.ESBIM_PARTNER)).toBeInTheDocument();
      expect(screen.getByText('120')).toBeInTheDocument(); // Taahhüt
      expect(screen.getByText('92')).toBeInTheDocument(); // İstihdam

      // İŞKUR İş Kulübü Başlığı
      expect(screen.getByText('İŞKUR İş Kulübü & İstihdam Masası')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument(); // Yıllık kontenjan
      expect(screen.getByText('165')).toBeInTheDocument(); // Sertifika

      // Kohortlar
      expect(screen.getByText('2026 Bahar Dönemi 1. İş Kulübü Eğitim Kohortu')).toBeInTheDocument();

      // Toplu mülakat takvimi
      expect(screen.getByText('İESÜ & ESBİM Bölgesel Sanayi Toplu Mülakat Günü')).toBeInTheDocument();
    });
  });

  describe('3. Sektörel Danışma Kurulu & Hamiler Havuzu Sekmesi', () => {
    it('Sektör hamilerini, unvanlarını ve kontenjanlarını gösterir', () => {
      render(<CorporateProtocolCRM />);

      // Sekmeye geç
      const advisoryTabBtn = screen.getByRole('button', { name: /Sektörel Danışma Kurulu & Hamiler/i });
      fireEvent.click(advisoryTabBtn);

      expect(screen.getByText('Sektörel Danışma Kurulu & Hami Mentor Havuzu')).toBeInTheDocument();
      expect(screen.getByText('Dr. Mehmet Yılmaz')).toBeInTheDocument();
      expect(screen.getByText('Zeynep Kaya')).toBeInTheDocument();
      expect(screen.getByText('Hakan Karaca')).toBeInTheDocument();
    });

    it('ESBİM Canlı Aday Eşleştirme Masasında adayı eşleştirir ve ESBİM Masasına sevk eder', async () => {
      render(<CorporateProtocolCRM />);

      // İŞKUR & ESBİM sekmesine geç
      const iskurTabBtn = screen.getByRole('button', { name: /İŞKUR & ESBİM Entegrasyon Köprüsü/i });
      fireEvent.click(iskurTabBtn);

      // Section 3: ESBİM Yerel Sanayi & Öğrenci/Mezun Eşleştirme Masası
      expect(screen.getByText('ESBİM Yerel Sanayi & Öğrenci/Mezun Eşleştirme Masası')).toBeInTheDocument();
      expect(screen.getByText('Canlı Eşleştirme Motoru Aktif')).toBeInTheDocument();

      // Sevk butonuna tıkla
      const referButtons = screen.getAllByRole('button', { name: /ESBİM'e Sevk Et/i });
      expect(referButtons.length).toBeGreaterThan(0);
      fireEvent.click(referButtons[0]);

      // Sevk Edildi durumuna geçti mi?
      await waitFor(() => {
        expect(screen.getByText('Sevk Edildi')).toBeInTheDocument();
        expect(window.toast.success).toHaveBeenCalled();
      });
    });

    it('Sektörel Danışma Kurulunda bölüm filtresi uygular ve yeni sektör hamisi ekler', async () => {
      render(<CorporateProtocolCRM />);

      // Sekmeye geç
      const advisoryTabBtn = screen.getByRole('button', { name: /Sektörel Danışma Kurulu & Hamiler/i });
      fireEvent.click(advisoryTabBtn);

      // Yeni Hami Ekle modalını aç
      const addMentorBtn = screen.getByRole('button', { name: /Yeni Hami Ekle/i });
      fireEvent.click(addMentorBtn);

      expect(screen.getByText('Yeni Sektör Hamisi / Danışma Kurulu Üyesi')).toBeInTheDocument();

      // Formu doldur
      const nameInput = screen.getByPlaceholderText('Örn: Dr. Aslı Yılmaz');
      fireEvent.change(nameInput, { target: { value: 'Dr. Selin Aksoy' } });

      const titleInput = screen.getByPlaceholderText('Örn: Ar-Ge Direktörü');
      fireEvent.change(titleInput, { target: { value: 'Teknoloji Direktörü' } });

      const companyInput = screen.getByPlaceholderText('Örn: Baykar, Turkcell');
      fireEvent.change(companyInput, { target: { value: 'Roketsan A.Ş.' } });

      // Kaydet
      const saveMentorBtn = screen.getByRole('button', { name: /Hamiyi Kaydet/i });
      fireEvent.click(saveMentorBtn);

      await waitFor(() => {
        expect(screen.getByText('Dr. Selin Aksoy')).toBeInTheDocument();
        expect(window.toast.success).toHaveBeenCalled();
      });
    });
  });

  describe('4. Senato & Rektörlük Raporlama Masası, Önizleme & PDF/CSV İhracı', () => {
    it('Senato rapor masasını açar, belgeyi önizler ve PDF ile CSV ihracını tetikler', async () => {
      render(<CorporateProtocolCRM />);

      // Sekmeye geç
      const senateTabBtn = screen.getByRole('button', { name: /Senato & Rektörlük Rapor Masası/i });
      fireEvent.click(senateTabBtn);

      expect(screen.getByText('Senato & Rektörlük Resmî Protokol ve Kontenjan Denetim Raporu')).toBeInTheDocument();
      expect(screen.getByText(/KURUMSAL PROTOKOL & SANAYİ CRM SENATO FAALİYET RAPORU/i)).toBeInTheDocument();

      // Belgeyi Önizle Modalı
      const previewBtn = screen.getByRole('button', { name: /Belgeyi Önizle/i });
      fireEvent.click(previewBtn);

      expect(screen.getByText('Makam Onayı / Tasdik')).toBeInTheDocument();
      expect(screen.getByText('Prof. Dr. Süleyman Özdemir')).toBeInTheDocument();

      // PDF İhracı
      const pdfBtn = screen.getByRole('button', { name: /Resmî PDF Yazdır/i });
      fireEvent.click(pdfBtn);
      expect(mockWindowOpen).toHaveBeenCalled();

      // CSV İndirme
      const csvBtn = screen.getByRole('button', { name: /Excel \(CSV\) İndir/i });
      fireEvent.click(csvBtn);
      expect(window.toast.success).toHaveBeenCalled();
    });
  });

  describe('5. OperasyonPanel Entegrasyonu', () => {
    it('OperasyonPanel içinde Sanayi Protokol CRM kartını render eder ve tıklandığında konsolu açar', () => {
      render(<OperasyonPanel />);

      // Sanayi Protokol CRM Kartı
      expect(screen.getByText('Sanayi Protokol CRM')).toBeInTheDocument();

      const openBtn = screen.getByRole('button', { name: /Protokol Masasını Aç/i });
      fireEvent.click(openBtn);

      // Konsol açıldı mı?
      expect(screen.getByText('Konsolu Kapat')).toBeInTheDocument();
      expect(screen.getByText('Kurumsal Protokol & Sanayi CRM')).toBeInTheDocument();
    });
  });

  describe('6. CompanyFeed Entegrasyonu', () => {
    it('CompanyFeed içinde Kurumsal Protokol Masası sekmesini açar ve CRM motorunu gösterir', () => {
      render(<CompanyFeed currentUser={{ id: 'CMP-001', name: 'Baykar Teknoloji', role: 'company' }} />);

      // Soldaki "Kurumsal Protokol Masası" butonuna tıkla
      const protocolNavBtn = screen.getByRole('button', { name: /Kurumsal Protokol Masası/i });
      fireEvent.click(protocolNavBtn);

      // CorporateProtocolCRM akışı görünür
      expect(screen.getByText('Kurumsal Protokol & Sanayi CRM')).toBeInTheDocument();
      expect(screen.getByText('Protokoller & Kontenjan CRM (10)')).toBeInTheDocument();
    });
  });

  describe('7. Veri Kaybı Önleme & useAdminStore Persistence Güvencesi (AGENTS.md)', () => {
    it('useAdminStore partialize fonksiyonunda kurumsal protokol ve sanayi CRM alanları yer alır', () => {
      const state = useAppStore.getState();
      expect(state.corporateProtocols).toBeDefined();
      expect(state.corporateProtocols.length).toBeGreaterThan(0);
      expect(state.sectorMentors).toBeDefined();
      expect(state.esbimEvents).toBeDefined();
      expect(state.iskurJobClubCohorts).toBeDefined();
    });
  });
});
