import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Login from '../components/Login';
import useAppStore from '../store/useAppStore';

vi.mock('../utils/firebase', () => ({ auth: {}, db: {} }));
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn().mockRejectedValue(new Error('Firebase unavailable')),
}));
vi.mock('firebase/firestore', () => ({ doc: vi.fn(), getDoc: vi.fn() }));

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('Login fallback flow', () => {
  it('unlocks the form when fallback authentication rejects the credentials', async () => {
    useAppStore.setState({ alumni: [], students: [], companies: [], academicStaff: [] });

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
      expect(screen.getByText('Hatalı mezun numarası veya şifresi!')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /^giriş yap$/i })).toBeEnabled();
  });

  it('does not authenticate fixture accounts outside development', async () => {
    vi.stubEnv('DEV', false);
    const setView = vi.fn();
    useAppStore.setState({
      alumni: [{
        id: 'fixture-alumni',
        email: 'fixture@example.test',
        password: 'fixture-password',
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
      target: { value: 'fixture-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^giriş yap$/i }));

    await waitFor(() => {
      expect(screen.getByText('Giriş servisine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin.')).toBeInTheDocument();
    });

    expect(setView).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /^giriş yap$/i })).toBeEnabled();
  });

  it('authenticates super admin even outside development and redirects to admin view', async () => {
    vi.stubEnv('DEV', false);
    const setView = vi.fn();
    const setUserRole = vi.fn();

    render(
      <Login
        setView={setView}
        setUserRole={setUserRole}
        setAcademicRole={vi.fn()}
        setCurrentUser={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText('E-Posta veya Kullanıcı Adı'), {
      target: { value: 'kariyer' },
    });
    fireEvent.change(screen.getByLabelText('Şifre'), {
      target: { value: 'Z.s.1513' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^giriş yap$/i }));

    await waitFor(() => {
      expect(setView).toHaveBeenCalledWith('admin');
      expect(setUserRole).toHaveBeenCalledWith('admin');
    });
  });
});

