import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EDevletStudentDiscoveryModal from '../components/modals/EDevletStudentDiscoveryModal';

describe('EDevletStudentDiscoveryModal - Otomatik Öğrenci Kimlik Keşif Merkezi', () => {
  it('renders modal without asking for student number and displays zero-prompt guarantee banner', () => {
    render(
      <EDevletStudentDiscoveryModal
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText('e-Devlet Kapısı Öğrenci Kimlik Merkezi')).toBeInTheDocument();
    expect(screen.getByText(/Öğrenci numarası girmenize gerek yoktur/i)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Öğrenci numaranızı giriniz/i)).not.toBeInTheDocument();
  });

  it('automatically resolves student record and student number via 1-click discovery without asking for student number', async () => {
    const onSuccessLogin = vi.fn();
    const onClose = vi.fn();

    render(
      <EDevletStudentDiscoveryModal
        isOpen={true}
        onClose={onClose}
        onSuccessLogin={onSuccessLogin}
        mode="login"
      />
    );

    const directBtn = screen.getByRole('button', { name: /e-Devlet ile Kimliğimi Otomatik Bul ve Çek/i });
    fireEvent.click(directBtn);

    await waitFor(() => {
      expect(screen.getByText('Öğrenci Kimliği e-Devlet Kütüğünden Başarıyla Çekildi')).toBeInTheDocument();
    }, { timeout: 4000 });

    expect(screen.getByText('Ahmet Yılmaz')).toBeInTheDocument();
    expect(screen.getByText('2023010482')).toBeInTheDocument(); // Otomatik çekilen öğrenci no
    expect(screen.getByText(/3.84 \/ 4.00/)).toBeInTheDocument();

    const submitLoginBtn = screen.getByRole('button', { name: /Doğrulanan Kimlikle Giriş Yap/i });
    fireEvent.click(submitLoginBtn);

    expect(onSuccessLogin).toHaveBeenCalledWith(
      expect.objectContaining({
        studentNo: '2023010482',
        fullName: 'Ahmet Yılmaz',
        eDevletVerified: true
      })
    );
  });
});
