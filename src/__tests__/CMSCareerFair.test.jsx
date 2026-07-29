import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CMSCareerFair from '../components/admin/CMSCareerFair';
import useAppStore from '../store/useAppStore';

describe('CMSCareerFair - Live Side-by-Side Simulator & Question Builder Stress Harness', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.setState({
      careerFairEvent: {
        id: 'cfe-2026',
        title: 'İESÜ 2026 Bahar Kariyer Zirvesi & Fuarı',
        date: '15-18 Mayıs 2026',
        location: 'Merkez Kampüs Rektörlük Bahçesi & Fuaye Alanı',
        description: 'Esenyurt Üniversitesi öğrencilerini ve mezunlarını sektor lideri şirketlerle buluşturan resmî kariyer etkinliği.',
        banner: 'https://www.esenyurt.edu.tr/uploads/2026/05/wuyeismnf35tr-bahar-senligi.jpg',
        isActive: true,
        quota: 50
      },
      careerFairFormTemplate: [
        { id: 'q_1', label: 'Katılımcı Sayısı & Yetkili İsimleri', type: 'text', required: true, description: 'Stant başında duracak personel sayısı', order: 1 },
        { id: 'q_2', label: 'Elektrik & İnternet İhtiyacı', type: 'select', required: true, options: ['Standart Priz (220V)', 'Kablolu İnternet'], order: 2 }
      ],
      careerFairApplications: [
        { id: 'APP-101', companyId: 'CMP-001', companyName: 'Baykar Teknoloji', appliedAt: '2026-07-20', status: 'Onaylandı', tableNumber: 'Stant A-01', answers: {} },
        { id: 'APP-102', companyId: 'CMP-002', companyName: 'Aselsan', appliedAt: '2026-07-21', status: 'Onaylandı', tableNumber: null, answers: {} }
      ],
      careerFairStands: [
        { id: 'A-01', code: 'Stant A-01', zone: 'A', status: 'Atandı', assignedCompanyId: 'CMP-001', assignedCompanyName: 'Baykar Teknoloji', tableNumber: 'Stant A-01' },
        { id: 'A-02', code: 'Stant A-02', zone: 'A', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant A-02' },
        { id: 'A-03', code: 'Stant A-03', zone: 'A', status: 'Rezerve', assignedCompanyId: null, assignedCompanyName: 'Protokol Rezervasyonu', tableNumber: 'Stant A-03' },
        ...Array.from({ length: 9 }, (_, i) => ({
          id: `A-${String(i + 4).padStart(2, '0')}`,
          code: `Stant A-${String(i + 4).padStart(2, '0')}`,
          zone: 'A',
          status: 'Boş',
          assignedCompanyId: null,
          assignedCompanyName: null,
          tableNumber: `Stant A-${String(i + 4).padStart(2, '0')}`
        })),
        ...Array.from({ length: 12 }, (_, i) => ({
          id: `B-${String(i + 1).padStart(2, '0')}`,
          code: `Stant B-${String(i + 1).padStart(2, '0')}`,
          zone: 'B',
          status: 'Boş',
          assignedCompanyId: null,
          assignedCompanyName: null,
          tableNumber: `Stant B-${String(i + 1).padStart(2, '0')}`
        }))
      ],
      notifications: [],
      auditLogs: []
    });
  });

  it('R1: Renders Stitch UI Crimson Header and Navigation Tabs', () => {
    render(<CMSCareerFair />);
    
    // Check main Stitch title
    expect(screen.getAllByText(/İESÜ 2026 Bahar Kariyer Zirvesi & Fuarı/i).length).toBeGreaterThan(0);
    
    // Check Corporate Navigation Tabs
    expect(screen.getByText(/Form & Canlı Önizleme/i)).toBeInTheDocument();
    expect(screen.getByText(/Stant Alokatörü \(2D Harita\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Başvurular/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Duyuru & Bildirim/i)).toBeInTheDocument();
  });

  it('R2: Form Builder adds field and instantly updates Live Simulator', async () => {
    render(<CMSCareerFair />);

    // Check existing fields in form manager & simulator
    expect(screen.getAllByText(/Katılımcı Sayısı & Yetkili İsimleri/i).length).toBeGreaterThan(0);
    
    // Fill new question inputs
    const labelInput = screen.getByPlaceholderText(/Eşantiyon Dağıtacak Mısınız\?/i);
    fireEvent.change(labelInput, { target: { value: 'Özel Stant Tasarımı Var mı?' } });

    const addBtn = screen.getByText(/Forma Soru Ekle/i);
    fireEvent.click(addBtn);

    // Verify store template updated
    const storeState = useAppStore.getState();
    const addedQuestion = storeState.careerFairFormTemplate.find(q => q.label === 'Özel Stant Tasarımı Var mı?');
    expect(addedQuestion).toBeTruthy();

    // Check that question appears in simulator preview as well
    expect(screen.getAllByText(/Özel Stant Tasarımı Var mı\?/i).length).toBeGreaterThan(0);
  });

  it('STRESS-1: Stress tests question addition for all field types (text, textarea, select, file, checkbox)', () => {
    render(<CMSCareerFair />);

    const typesToTest = [
      { label: 'Şirket Tanıtım Filmi Linki', type: 'text' },
      { label: 'Fuar Beklentileri ve Özel Talepler', type: 'textarea' },
      { label: 'Katılım Türü', type: 'select', options: 'Sponsor, Stant Katılımcısı, Konuşmacı' },
      { label: 'Faaliyet Belgesi Yükleme', type: 'file' },
      { label: 'KVKK ve Açık Rıza Onayı', type: 'checkbox' }
    ];

    typesToTest.forEach(({ label, type, options }) => {
      const labelInput = screen.getByPlaceholderText(/Eşantiyon Dağıtacak Mısınız\?/i);
      fireEvent.change(labelInput, { target: { value: label } });

      // Change field type select box in Question Builder
      const typeSelects = screen.getAllByRole('combobox');
      const builderTypeSelect = typeSelects[0];
      fireEvent.change(builderTypeSelect, { target: { value: type } });

      if (type === 'select' && options) {
        const optionsInput = screen.getByPlaceholderText(/Konuşmacı, Stant, Sponsorluk/i);
        fireEvent.change(optionsInput, { target: { value: options } });
      }

      const addBtn = screen.getByText(/Forma Soru Ekle/i);
      fireEvent.click(addBtn);

      // Assert field added in store
      const template = useAppStore.getState().careerFairFormTemplate;
      const created = template.find(q => q.label === label);
      expect(created).toBeDefined();
      expect(created.type).toBe(type);

      if (type === 'select') {
        expect(created.options).toEqual(['Sponsor', 'Stant Katılımcısı', 'Konuşmacı']);
      }

      // Assert rendered in Live Simulator preview
      expect(screen.getAllByText(new RegExp(label, 'i')).length).toBeGreaterThan(0);
    });
  });

  it('STRESS-2: Stress tests question deletion and instant reactivity in Live Simulator', () => {
    render(<CMSCareerFair />);

    // Initially 2 items exist
    expect(useAppStore.getState().careerFairFormTemplate.length).toBe(2);
    expect(screen.getAllByText(/Katılımcı Sayısı & Yetkili İsimleri/i).length).toBeGreaterThan(0);

    // Find delete buttons (title="Sil")
    const deleteBtns = screen.getAllByTitle('Sil');
    expect(deleteBtns.length).toBe(2);

    // Click delete on first question
    fireEvent.click(deleteBtns[0]);

    // Check store
    const templateAfter = useAppStore.getState().careerFairFormTemplate;
    expect(templateAfter.length).toBe(1);
    expect(templateAfter[0].id).toBe('q_2');

    // Live simulator should no longer display q_1
    expect(screen.queryByText(/Katılımcı Sayısı & Yetkili İsimleri/i)).toBeNull();
  });

  it('STRESS-3: Stress tests question title updates, description edits, and field type switching via inline editor', () => {
    render(<CMSCareerFair />);

    // Click Edit button on the first field (q_1)
    const editBtns = screen.getAllByTitle('Düzenle');
    fireEvent.click(editBtns[0]);

    // Inline edit mode should display inputs with current data
    const labelInput = screen.getByDisplayValue('Katılımcı Sayısı & Yetkili İsimleri');
    fireEvent.change(labelInput, { target: { value: 'Görüşmeci Yetkili Sayısı & İsim Listesi' } });

    const descInput = screen.getByDisplayValue('Stant başında duracak personel sayısı');
    fireEvent.change(descInput, { target: { value: 'Lütfen isimleri virgülle ayırarak yazın' } });

    // Change type from text to textarea
    const inlineTypeSelect = screen.getByDisplayValue('Kısa Metin');
    fireEvent.change(inlineTypeSelect, { target: { value: 'textarea' } });

    // Toggle required flag to false inside inline editor box
    const inlineRequiredCheck = screen.getByText('Zorunlu').querySelector('input');
    fireEvent.click(inlineRequiredCheck);

    // Save edits
    const saveBtn = screen.getByText('Kaydet');
    fireEvent.click(saveBtn);

    // Verify store state updated
    const updatedQuestion = useAppStore.getState().careerFairFormTemplate.find(q => q.id === 'q_1');
    expect(updatedQuestion.label).toBe('Görüşmeci Yetkili Sayısı & İsim Listesi');
    expect(updatedQuestion.description).toBe('Lütfen isimleri virgülle ayırarak yazın');
    expect(updatedQuestion.type).toBe('textarea');
    expect(updatedQuestion.required).toBe(false);

    // Verify Live Simulator renders updated label and description
    expect(screen.getAllByText(/Görüşmeci Yetkili Sayısı & İsim Listesi/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Lütfen isimleri virgülle ayırarak yazın/i).length).toBeGreaterThan(0);
  });

  it('STRESS-4: Stress tests question reordering (moving questions up and down)', () => {
    render(<CMSCareerFair />);

    // Add a 3rd question first
    const labelInput = screen.getByPlaceholderText(/Eşantiyon Dağıtacak Mısınız\?/i);
    fireEvent.change(labelInput, { target: { value: 'Üçüncü Test Sorusu' } });
    fireEvent.click(screen.getByText(/Forma Soru Ekle/i));

    let template = useAppStore.getState().careerFairFormTemplate;
    expect(template.map(q => q.label)).toEqual([
      'Katılımcı Sayısı & Yetkili İsimleri',
      'Elektrik & İnternet İhtiyacı',
      'Üçüncü Test Sorusu'
    ]);

    // Click "Aşağı Taşı" on first item
    const moveDownBtns = screen.getAllByTitle('Aşağı Taşı');
    fireEvent.click(moveDownBtns[0]);

    template = useAppStore.getState().careerFairFormTemplate;
    expect(template.map(q => q.label)).toEqual([
      'Elektrik & İnternet İhtiyacı',
      'Katılımcı Sayısı & Yetkili İsimleri',
      'Üçüncü Test Sorusu'
    ]);

    // Click "Yukarı Taşı" on last item
    const moveUpBtns = screen.getAllByTitle('Yukarı Taşı');
    fireEvent.click(moveUpBtns[2]);

    template = useAppStore.getState().careerFairFormTemplate;
    expect(template.map(q => q.label)).toEqual([
      'Elektrik & İnternet İhtiyacı',
      'Üçüncü Test Sorusu',
      'Katılımcı Sayısı & Yetkili İsimleri'
    ]);
  });

  it('STRESS-5: Stress tests device view switcher modes (Desktop, Tablet, Mobile)', () => {
    render(<CMSCareerFair />);

    const tabletBtn = screen.getByText('Tablet');
    const mobileBtn = screen.getByText('Mobil');
    const desktopBtn = screen.getByText('Masaüstü');

    // Default view: desktop
    expect(desktopBtn.className).toContain('text-[#990000]');

    // Switch to Tablet mode
    fireEvent.click(tabletBtn);
    expect(tabletBtn.className).toContain('text-[#990000]');

    // Switch to Mobile mode
    fireEvent.click(mobileBtn);
    expect(mobileBtn.className).toContain('text-[#990000]');

    // Switch back to Desktop mode
    fireEvent.click(desktopBtn);
    expect(desktopBtn.className).toContain('text-[#990000]');
  });

  it('STRESS-6 (Edge Case Discovery): Tab switching to live_stage orphan button', () => {
    render(<CMSCareerFair />);

    // Switch to Stand Allocator tab first
    const tabBtn = screen.getByText(/Stant Alokatörü \(2D Harita\)/i);
    fireEvent.click(tabBtn);

    // Click the orphan button inside Stand Allocator tab
    const orphanBtns = screen.getAllByText(/Canlı Zirve Sahnesi & Soru-Cevap/i);
    fireEvent.click(orphanBtns[0]);

    // Verify component handles tab transition without crashing
    expect(screen.getByText(/İESÜ 2026 Bahar Kariyer Zirvesi & Fuarı/i)).toBeInTheDocument();
  });

  it('R3: Renders 2D Floorplan Map with 24 stands and opens Assignment Modal', async () => {
    render(<CMSCareerFair />);

    // Switch to Stand Allocator tab
    const tabBtn = screen.getByText(/Stant Alokatörü \(2D Harita\)/i);
    fireEvent.click(tabBtn);

    // Check stand statistics overview
    expect(screen.getByText('Toplam Stant')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();

    // Check Zone A & Zone B headings
    expect(screen.getByText(/ZONE A — Ana Fuaye Alanı/i)).toBeInTheDocument();
    expect(screen.getByText(/ZONE B — Rektörlük Bahçesi Stantları/i)).toBeInTheDocument();

    // Click on Stant A-02 (which is currently "Boş")
    const standCard = screen.getByText('Stant A-02');
    fireEvent.click(standCard);

    // Verify modal opens
    expect(screen.getByText(/Stant A-02 Tahsis Paneli/i)).toBeInTheDocument();

    // Select approved company "Aselsan"
    const companySelect = screen.getByRole('combobox');
    fireEvent.change(companySelect, { target: { value: 'Aselsan' } });

    // Click Save assignment
    const saveBtn = screen.getByText('Atamayı Kaydet');
    fireEvent.click(saveBtn);

    // Verify store state updated
    const updatedStands = useAppStore.getState().careerFairStands;
    const standA02 = updatedStands.find(s => s.code === 'Stant A-02');
    expect(standA02.status).toBe('Atandı');
    expect(standA02.assignedCompanyName).toBe('Aselsan');

    // Verify audit log recorded
    const logs = useAppStore.getState().auditLogs;
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].action).toContain('Stant A-02');
  });

  it('R4: Canlı Zirve Sahnesi & Soru-Cevap tab button navigation renders live stage panel', () => {
    render(<CMSCareerFair />);

    const liveStageTab = screen.getAllByRole('button', { name: /Canlı Zirve Sahnesi & Soru-Cevap/i })[0];
    fireEvent.click(liveStageTab);

    expect(screen.getByText(/Canlı Yayın: Rektörlük & Kariyer Merkezi Ana Sahne/i)).toBeInTheDocument();
    expect(screen.getByText(/Zirve Sahnesi Oturum Akışı/i)).toBeInTheDocument();
    expect(screen.getByText(/Salondan Gelen Sorular/i)).toBeInTheDocument();
  });

  it('Defensive Guards: Renders safely when store arrays are empty or undefined', () => {
    useAppStore.setState({
      careerFairFormTemplate: undefined,
      careerFairApplications: undefined,
      careerFairStands: undefined
    });

    expect(() => render(<CMSCareerFair />)).not.toThrow();
    expect(screen.getAllByText(/İESÜ 2026 Bahar Kariyer Zirvesi & Fuarı/i).length).toBeGreaterThan(0);
  });
});
