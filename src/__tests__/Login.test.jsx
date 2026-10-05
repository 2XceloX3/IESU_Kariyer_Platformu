import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Login from '../components/Login';
import useAppStore from '../store/useAppStore';

vi.mock('../utils/firebase', () => ({ auth: {}, db: {} }));
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({})),
  getDoc: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe('Login Firebase-only flow', () => {
  it('shows error and unlocks form when Firebase Auth rejects credentials', async () => {
    signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/invalid-credential' });
    useAppStore.setState({ setRegisterAccountType: vi.fn() });

    render(
      <Login
        setView={vi.fn()}
        setUserRole={vi.fn()}
        setAcademicRole={vi.fn()}
        setCurrentUser={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText('E-Posta veya Kullanıcı Adı'), {
      target: { value: 'unknown@example.test' },
    });
    fireEvent.change(screen.getByLabelText('Şifre'), {
      target: { value: 'incorrect-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^giriş yap$/i }));

    await waitFor(() => {
      expect(screen.getByText('E-posta veya şifre hatalı.')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /^giriş yap$/i })).toBeEnabled();
  });

  it('does not fall back to fixture/local passwords when Firebase fails', async () => {
    signInWithEmailAndPassword.mockRejectedValue(new Error('Firebase unavailable'));
    const setView = vi.fn();
    useAppStore.setState({
      alumni: [{
        id: 'fixture-alumni',
        email: 'fixture@example.test',
        role: 'alumni',
      }],
      students: [],
      companies: [],
      academicStaff: [],
    });

    render(
      <Login
        setView={setView}
        setUserRole={vi.fn()}
        setAcademicRole={vi.fn()}
        setCurrentUser={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText('E-Posta veya Kullanıcı Adı'), {
      target: { value: 'fixture@example.test' },
    });
    fireEvent.change(screen.getByLabelText('Şifre'), {
      target: { value: 'any-local-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^giriş yap$/i }));

    await waitFor(() => {
      expect(screen.getByText('Giriş servisine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin.')).toBeInTheDocument();
    });

    expect(setView).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /^giriş yap$/i })).toBeEnabled();
  });
});
