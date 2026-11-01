import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SubPanelFooter from '../components/SubPanelFooter';

describe('SubPanelFooter Component Audit', () => {
  it('renders correctly with default red theme without any ReferenceError', () => {
    const setView = vi.fn();
    render(<SubPanelFooter setView={setView} theme="red" />);

    expect(screen.getByText('İstanbul Esenyurt Üniversitesi')).toBeInTheDocument();
    expect(screen.getByText('Kariyer Geliştirme Koordinatörlüğü')).toBeInTheDocument();
    expect(screen.getByText('Hızlı Bağlantılar')).toBeInTheDocument();
    expect(screen.getByText('İletişim Bilgileri')).toBeInTheDocument();
    expect(screen.getByText('kariyer@esenyurt.edu.tr')).toBeInTheDocument();
    expect(screen.getByText('444 9 123 / 1322')).toBeInTheDocument();
  });

  it('renders correctly with emerald theme', () => {
    const setView = vi.fn();
    render(<SubPanelFooter setView={setView} theme="emerald" />);

    expect(screen.getByText('Resmî Sosyal Medya Hesaplarımız')).toBeInTheDocument();
    expect(screen.getByText('Öğrenci Bilgi Sistemi (OBS)')).toBeInTheDocument();
  });

  it('opens and closes KVKK modal properly without runtime errors', () => {
    render(<SubPanelFooter setView={vi.fn()} />);

    const kvkkBtn = screen.getByText('KVKK Aydınlatma Metni');
    fireEvent.click(kvkkBtn);

    expect(screen.getByText('KVKK Aydınlatma Metni', { selector: 'h3' })).toBeInTheDocument();
    
    const understandBtn = screen.getByText('Okudum, Anladım');
    fireEvent.click(understandBtn);

    expect(screen.queryByText('Okudum, Anladım')).not.toBeInTheDocument();
  });

  it('opens ContactModal when clicking İletişim & Bize Ulaşın', () => {
    render(<SubPanelFooter setView={vi.fn()} />);

    const contactLink = screen.getByText('İletişim & Bize Ulaşın');
    fireEvent.click(contactLink);

    expect(screen.getByTestId('contact-modal')).toBeInTheDocument();
  });
});
