import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import StudentRegisterPage from '../pages/auth/StudentRegisterPage';

vi.mock('../components/shared/Toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from '../components/shared/Toast';

describe('StudentRegisterPage Error Paths', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (mockAuthService) => {
    return render(
      <BrowserRouter>
        <StudentRegisterPage authService={mockAuthService} />
      </BrowserRouter>
    );
  };

  it('displays error toast when email is already in use', async () => {
    const mockAuthService = {
      register: vi.fn().mockRejectedValue({ code: 'auth/email-already-in-use' })
    };
    renderComponent(mockAuthService);

    fireEvent.submit(screen.getByTestId('register-form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Bu e-posta adresi zaten kullanımda. Lütfen başka bir tane deneyin.');
    });
  });

  it('displays error toast when password is weak', async () => {
    const mockAuthService = {
      register: vi.fn().mockRejectedValue({ code: 'auth/weak-password' })
    };
    renderComponent(mockAuthService);

    fireEvent.submit(screen.getByTestId('register-form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Şifreniz çok zayıf. Lütfen daha güçlü bir şifre seçin.');
    });
  });

  it('displays generic error toast for unknown errors', async () => {
    const mockAuthService = {
      register: vi.fn().mockRejectedValue({ message: 'Bilinmeyen ağ hatası' })
    };
    renderComponent(mockAuthService);

    fireEvent.submit(screen.getByTestId('register-form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Kayıt olurken bir hata oluştu: Bilinmeyen ağ hatası');
    });
  });

  it('displays generic error toast for unknown errors with no message', async () => {
    const mockAuthService = {
      register: vi.fn().mockRejectedValue({})
    };
    renderComponent(mockAuthService);

    fireEvent.submit(screen.getByTestId('register-form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Kayıt olurken bir hata oluştu: Bilinmeyen hata');
    });
  });
});
