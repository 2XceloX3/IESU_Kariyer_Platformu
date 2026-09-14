import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Register from '../components/Register';

const firebaseAuthMocks = vi.hoisted(() => ({
  createUserWithEmailAndPassword: vi.fn(),
}));

vi.mock('../utils/firebase', () => ({ auth: {}, db: {} }));
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: firebaseAuthMocks.createUserWithEmailAndPassword,
}));
vi.mock('firebase/firestore', () => ({ doc: vi.fn(), setDoc: vi.fn() }));

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe('Register production safety', () => {
  it('does not create a local alumni session when Firebase registration is unavailable', async () => {
    vi.stubEnv('DEV', false);
    firebaseAuthMocks.createUserWithEmailAndPassword.mockRejectedValue({ code: 'auth/network-request-failed' });
    const setCurrentUser = vi.fn();
    const setUserRole = vi.fn();

    render(
      <Register
        setView={vi.fn()}
        setCurrentUser={setCurrentUser}
        setUserRole={setUserRole}
      />
    );

    fireEvent.change(screen.getByLabelText('Ad Soyadı'), { target: { value: 'Test Mezun' } });
    fireEvent.change(screen.getByLabelText('Öğrenci Numarası'), { target: { value: '202400001' } });
    fireEvent.change(screen.getByLabelText('Mezun Olunan Bölüm'), { target: { value: 'Yazılım Mühendisliği' } });
    fireEvent.change(screen.getByLabelText('Mezuniyet Yılı'), { target: { value: '2024' } });
    fireEvent.change(screen.getByLabelText('E-Posta Adresi'), { target: { value: 'mezun@example.test' } });
    fireEvent.change(screen.getByLabelText('Yeni Şifre'), { target: { value: 'guvenli-sifre' } });
    fireEvent.change(screen.getByLabelText('Yeni Şifre Tekrar'), { target: { value: 'guvenli-sifre' } });
    fireEvent.click(screen.getByRole('button', { name: 'Mezun Hesabımı Aktifleştir' }));

    await waitFor(() => {
      expect(screen.getByText('Kayıt servisine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin.')).toBeInTheDocument();
    });

    expect(setCurrentUser).not.toHaveBeenCalled();
    expect(setUserRole).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Mezun Hesabımı Aktifleştir' })).toBeEnabled();
  });
});
