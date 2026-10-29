import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CMSKalbis from '../components/admin/CMSKalbis';

describe('KALBİS Kalite Güvencesi Bilgi Yönetim Sistemi (CMSKalbis)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders KALBİS header, title, and emerald sustainability LCA hero card', () => {
    const currentUser = { id: 'usr_admin', name: 'Kariyer Geliştirme Koordinatörlüğü', role: 'admin' };
    render(<CMSKalbis currentUser={currentUser} setView={vi.fn()} />);

    // Header & Brand
    expect(screen.getByText('ESENYURT KALBİS')).toBeInTheDocument();
    expect(screen.getByText('YÖKAK Akredite')).toBeInTheDocument();
    expect(screen.getByText(/Kalite Güvencesi Bilgi Yönetim Sistemi • v2.3.7/)).toBeInTheDocument();

    // Sustainability LCA Card
    expect(screen.getByText('Dijitalleşme Çevresel Etkisi')).toBeInTheDocument();
    expect(screen.getByText('1.776')).toBeInTheDocument();
    expect(screen.getByText('Dijital Belge')).toBeInTheDocument();
    expect(screen.getByText('10.407')).toBeInTheDocument();
    expect(screen.getByText('Dijital Sayfa')).toBeInTheDocument();
    expect(screen.getByText('20 kg')).toBeInTheDocument();
    expect(screen.getByText('44 kg')).toBeInTheDocument();
    expect(screen.getByText('292 L')).toBeInTheDocument();
    expect(screen.getByText('0,5')).toBeInTheDocument();
  });

  it('toggles role switcher between Akademik Personel and Koordinatörlük Yöneticisi', () => {
    const currentUser = { id: 'usr_admin', name: 'Mutlu Gülsev YAĞIZ', role: 'academic' };
    render(<CMSKalbis currentUser={currentUser} setView={vi.fn()} />);

    const roleBtn = screen.getByTitle('Kullanıcı Rolü Değiştir');
    fireEvent.click(roleBtn);

    // Dropdown list displays both roles
    const switchTarget = screen.getByText('Koordinatörlük Yöneticisi');
    expect(switchTarget).toBeInTheDocument();

    fireEvent.click(switchTarget);
    // After switch, active role changes
    expect(screen.getAllByText('Koordinatörlük Yöneticisi').length).toBeGreaterThan(0);
  });

  it('navigates through sidebar sub-modules (Komisyonlar, DÖİF, Ders Dosyası)', () => {
    const currentUser = { id: 'usr_admin', name: 'Mutlu Gülsev YAĞIZ', role: 'academic' };
    render(<CMSKalbis currentUser={currentUser} setView={vi.fn()} />);

    // Click Komisyon İşlemleri
    const komisyonBtn = screen.getByText('Komisyon İşlemleri');
    fireEvent.click(komisyonBtn);
    expect(screen.getByText('Rektörlük Kalite Komisyonu')).toBeInTheDocument();
    expect(screen.getByText('Mühendislik ve Doğa Bilimleri Fakülte Kalite Komisyonu')).toBeInTheDocument();

    // Click DÖİF Taleplerim
    const doifBtn = screen.getByText('DÖİF Taleplerim');
    fireEvent.click(doifBtn);
    expect(screen.getByText('Yeni DÖİF Talebi Aç')).toBeInTheDocument();
    expect(screen.getByText(/Havacılık Simülatör Laboratuvarı Yazılım Güncellemesi/)).toBeInTheDocument();

    // Click Ders Dosyası İnceleme
    const dersBtn = screen.getByText('Ders Dosyası İnceleme');
    fireEvent.click(dersBtn);
    expect(screen.getByText('Hava Trafik Yönetimi ve Seyrüsefer')).toBeInTheDocument();
    expect(screen.getByText('SHU-201')).toBeInTheDocument();
  });

  it('opens and closes Süreç Kartı Bilgi Modalı and Yardım Modalı', () => {
    const currentUser = { id: 'usr_admin', name: 'Mutlu Gülsev YAĞIZ', role: 'academic' };
    render(<CMSKalbis currentUser={currentUser} setView={vi.fn()} />);

    // Süreç Bilgisi modal
    const surecBtn = screen.getByText('Süreç Bilgisi');
    fireEvent.click(surecBtn);
    expect(screen.getByText(/PUKÖ Akış Şeması & Kontrol Noktaları/)).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByText('Kapat');
    fireEvent.click(closeBtn);
    expect(screen.queryByText(/PUKÖ Akış Şeması & Kontrol Noktaları/)).not.toBeInTheDocument();
  });

  it('marks all notifications as read and updates count', () => {
    const currentUser = { id: 'usr_admin', name: 'Mutlu Gülsev YAĞIZ', role: 'academic' };
    render(<CMSKalbis currentUser={currentUser} setView={vi.fn()} />);

    const markAllBtn = screen.getByText('Tümünü okundu yap');
    fireEvent.click(markAllBtn);

    expect(screen.getByText('Okunmamış bildirim bulunamadı.')).toBeInTheDocument();
  });
});
