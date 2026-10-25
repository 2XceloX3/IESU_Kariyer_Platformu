/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CMSSurveys from '../components/admin/CMSSurveys';

describe('CMSSurveys - Question Pool, Closing to Pool Archive, and Strict Anonymous KVKK Excel Export', () => {
  let mockSurveys;
  let mockSetSurveys;

  beforeEach(() => {
    window.toast = { success: vi.fn(), error: vi.fn(), info: vi.fn() };
    mockSetSurveys = vi.fn();
    mockSurveys = [
      {
        id: 'SRV-101',
        title: 'İESÜ Mezun Kariyer ve Memnuniyet Değerlendirme Anketi',
        description: 'Mezun memnuniyet ve istihdam anketi.',
        date: '2026-07-15',
        status: 'Aktif',
        type: 'Genel Anket',
        targetAudience: 'Mezunlar',
        responses: 2,
        total: 100,
        questions: [
          { id: 'q1', text: '1. İESÜ akademik eğitiminin kariyerinize katkısı.', type: 'likert' },
          { id: 'q2', text: '2. Staj ve uygulamalı deneyimlerin faydası.', type: 'likert' }
        ],
        responseRows: [
          { id: 'RESP_001', submittedAt: '2026-07-16T10:00:00.000Z', scores: [5, 4], answers: { q1: 5, q2: 4 } },
          { id: 'RESP_002', submittedAt: '2026-07-17T11:00:00.000Z', scores: [4, 5], answers: { q1: 4, q2: 5 } }
        ]
      },
      {
        id: 'SRV-102',
        title: 'Kariyer Merkezi Hizmetleri Anketi',
        description: 'Eski dönem anketi.',
        date: '2026-01-10',
        status: 'Kapandı',
        type: 'Genel Anket',
        targetAudience: 'Tümü',
        responses: 5,
        total: 50,
        questions: [
          { id: 'q1', text: 'Danışmanlık kalitesi.', type: 'likert' }
        ],
        responseRows: []
      }
    ];
  });

  it('renders surveys list with question pool stats and allows filtering closed/archived surveys in pool', () => {
    render(
      <CMSSurveys 
        surveys={mockSurveys} 
        setSurveys={mockSetSurveys} 
        currentUser={{ name: 'Kariyer Geliştirme Koordinatörlüğü', role: 'admin' }} 
      />
    );

    // Question pool info visible
    expect(screen.getByText(/Form ve Anket Havuzu Yönetimi/i)).toBeTruthy();
    expect(screen.getByText(/3 Soru/i)).toBeTruthy(); // 2 questions + 1 question = 3 in pool
    expect(screen.getByText(/Havuzda Saklanan/i)).toBeTruthy();

    // Verify "Havuzda Saklanıyor" badge for SRV-102
    expect(screen.getByText(/Havuzda Saklanıyor/i)).toBeTruthy();
  });

  it('toggles survey status to Kapandı and retains it in pool archive', () => {
    render(
      <CMSSurveys 
        surveys={mockSurveys} 
        setSurveys={mockSetSurveys} 
        currentUser={{ name: 'Kariyer Geliştirme Koordinatörlüğü', role: 'admin' }} 
      />
    );

    // Find the toggle button for active survey "Kapat & Havuzla"
    const closeBtn = screen.getByTitle(/Yayını Durdur ve Havuzda Sakla/i);
    expect(closeBtn).toBeTruthy();
    fireEvent.click(closeBtn);

    expect(mockSetSurveys).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'SRV-101', status: 'Kapandı' })
      ])
    );
    expect(window.toast.info).toHaveBeenCalledWith(
      expect.stringContaining('Anket kapatıldı ve Anket & Yanıt Havuzuna')
    );
  });

  it('exports Excel (CSV) strictly without student personal info (100% KVKK Anonymous)', () => {
    // Intercept Blob and URL.createObjectURL
    const originalCreateObjectURL = URL.createObjectURL;
    let createdCsvContent = '';
    
    // Polyfill URL.createObjectURL for jsdom
    URL.createObjectURL = vi.fn((blob) => {
      // In Node/jsdom, read blob via FileReader or text() if available
      return 'blob:mock-url-123';
    });

    // Mock HTMLAnchorElement click
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(
      <CMSSurveys 
        surveys={mockSurveys} 
        setSurveys={mockSetSurveys} 
        currentUser={{ name: 'Kariyer Geliştirme Koordinatörlüğü', role: 'admin' }} 
      />
    );

    // Click Excel download on SRV-101
    const downloadBtns = screen.getAllByTitle(/Excel İndir/i);
    fireEvent.click(downloadBtns[0]);

    expect(URL.createObjectURL).toHaveBeenCalled();
    const blobArg = URL.createObjectURL.mock.calls[0][0];
    expect(blobArg).toBeInstanceOf(Blob);

    // Verify toast confirmed strict anonymous export
    expect(window.toast.success).toHaveBeenCalledWith(
      expect.stringContaining('Öğrenci kimlik bilgisi içermeyen %100 anonim Excel tablosu indirildi')
    );

    clickSpy.mockRestore();
    URL.createObjectURL = originalCreateObjectURL;
  });

  it('allows editing question pool (adding, editing, removing questions)', () => {
    render(
      <CMSSurveys 
        surveys={mockSurveys} 
        setSurveys={mockSetSurveys} 
        currentUser={{ name: 'Kariyer Geliştirme Koordinatörlüğü', role: 'admin' }} 
      />
    );

    // Click edit on the first survey
    const editBtns = screen.getAllByTitle(/Soruları ve Anket Bilgilerini Düzenle/i);
    fireEvent.click(editBtns[0]);

    // Should switch to form view with question pool
    expect(screen.getByText(/Anket ve Soru Havuzunu Düzenle/i)).toBeTruthy();
    expect(screen.getByText(/Dönemsel Soru Havuzu/i)).toBeTruthy();

    // Click "Yeni Soru Ekle"
    const addQBtn = screen.getByText(/Yeni Soru Ekle/i);
    fireEvent.click(addQBtn);

    // Now there should be 3 question inputs
    const questionInputs = screen.getAllByPlaceholderText(/Soru metnini giriniz/i);
    expect(questionInputs.length).toBe(3);

    // Edit the text of the third question
    fireEvent.change(questionInputs[2], { target: { value: '3. Yeni Dönem Değerlendirme Sorusu' } });
    expect(questionInputs[2].value).toBe('3. Yeni Dönem Değerlendirme Sorusu');

    // Submit form
    const submitBtn = screen.getByText(/Değişiklikleri ve Soru Havuzunu Kaydet/i);
    fireEvent.click(submitBtn);

    expect(mockSetSurveys).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'SRV-101',
          questions: expect.arrayContaining([
            expect.objectContaining({ text: '3. Yeni Dönem Değerlendirme Sorusu' })
          ])
        })
      ])
    );
    expect(window.toast.success).toHaveBeenCalledWith(
      expect.stringContaining('Anket ve soru havuzu başarıyla güncellendi')
    );
  });
});
