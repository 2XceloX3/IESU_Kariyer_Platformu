import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Register from '../components/Register';

const firebaseAuthMocks = vi.hoisted(() => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  credentialFromResult: vi.fn(() => ({ accessToken: null })),
}));

vi.mock('../utils/firebase', () => ({ auth: {}, db: {}, googleProvider: {}, oAuthClientId: '' }));
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: firebaseAuthMocks.createUserWithEmailAndPassword,
  signInWithPopup: firebaseAuthMocks.signInWithPopup,
  GoogleAuthProvider: {
    credentialFromResult: firebaseAuthMocks.credentialFromResult,
  },
}));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn().mockResolvedValue({ exists: () => false, data: () => ({}) }),
  getDocs: vi.fn().mockResolvedValue({ forEach: () => {}, docs: [] }),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  setDoc: vi.fn().mockResolvedValue(undefined),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  serverTimestamp: vi.fn(() => new Date().toISOString()),
}));

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
    fireEvent.click(screen.getByRole('checkbox', { name: /KVKK Aydınlatma Metni/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Mezun Hesabımı Aktifleştir' }));

    await waitFor(() => {
      expect(screen.getByText('Kayıt servisine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin.')).toBeInTheDocument();
    });

    expect(setCurrentUser).not.toHaveBeenCalled();
    expect(setUserRole).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Mezun Hesabımı Aktifleştir' })).toBeEnabled();
  });

  it('reflects real Google user and Workspace domain details onto the registration screen and activates company account', async () => {
    firebaseAuthMocks.signInWithPopup.mockResolvedValue({
      user: {
        uid: 'google-real-uid-101',
        email: 'selcuk.demir@baykartech.com',
        displayName: 'Selçuk Demir',
        phoneNumber: '+905324441513',
        photoURL: 'https://lh3.googleusercontent.com/a/real-avatar',
      },
    });
    const setView = vi.fn();
    const setCurrentUser = vi.fn();
    const setUserRole = vi.fn();

    render(
      <Register
        setView={setView}
        setCurrentUser={setCurrentUser}
        setUserRole={setUserRole}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Firma Kaydı/i }));
    fireEvent.click(screen.getByTestId('google-company-register-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('google-company-reflected-card')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Yetkili Kurumsal E-Posta').value).toBe('selcuk.demir@baykartech.com');
    expect(screen.getByLabelText('Yetkili Adı Soyadı').value).toBe('Selçuk Demir');
    expect(screen.getByLabelText('Şirket / Kurum Adı').value).toBe('Baykartech');
    expect(screen.getByLabelText('Şirket Web Sayfası / İletişim URL').value).toBe('https://baykartech.com');
    expect(screen.getByLabelText('Yetkili Telefon Numarası').value).toBe('05324441513');

    // Fill the job title that wasn't on the basic Google Auth token and activate
    fireEvent.change(screen.getByLabelText('Firmadaki Görev Tanımı / Unvan'), { target: { value: 'İK Direktörü' } });
    fireEvent.click(screen.getByTestId('instant-company-activate-btn'));

    await waitFor(() => {
      expect(setUserRole).toHaveBeenCalledWith('company');
      expect(setView).toHaveBeenCalledWith('company');
    });
  });

  it('does not inject fake mock company data when Google popup is closed by user', async () => {
    firebaseAuthMocks.signInWithPopup.mockRejectedValue({ code: 'auth/popup-closed-by-user' });

    render(
      <Register
        setView={vi.fn()}
        setCurrentUser={vi.fn()}
        setUserRole={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Firma Kaydı/i }));
    fireEvent.click(screen.getByTestId('google-company-register-btn'));

    await waitFor(() => {
      expect(screen.getByText(/Google oturum açma penceresi kapatıldı/i)).toBeInTheDocument();
    });

    expect(screen.queryByTestId('google-company-reflected-card')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Şirket / Kurum Adı').value).toBe('');
    expect(screen.getByLabelText('Yetkili Kurumsal E-Posta').value).toBe('');
  });

  it('conditionally renders specific required fields dynamically based on selected user role', () => {
    render(
      <Register
        setView={vi.fn()}
        setCurrentUser={vi.fn()}
        setUserRole={vi.fn()}
      />
    );

    // 1. Default role: Alumni (Mezun Kaydı)
    expect(screen.getByTestId('role-specific-fields-alumni')).toBeInTheDocument();
    expect(screen.getByLabelText('Öğrenci Numarası')).toBeRequired();
    expect(screen.getByLabelText('Mezuniyet Yılı')).toBeRequired();
    expect(screen.queryByLabelText('Kurumsal Vergi No / MERSİS No')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Kurum Sicil / YÖKSİS No')).not.toBeInTheDocument();

    // 2. Switch to Student (Öğrenci Kaydı)
    fireEvent.click(screen.getByRole('button', { name: /Öğrenci Kaydı/i }));
    expect(screen.getByTestId('role-specific-fields-student')).toBeInTheDocument();
    expect(screen.getByLabelText('Öğrenci Numarası')).toBeRequired();
    expect(screen.getByLabelText('Sınıf')).toBeRequired();
    expect(screen.queryByLabelText('Mezuniyet Yılı')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Kurumsal Vergi No / MERSİS No')).not.toBeInTheDocument();

    // 3. Switch to Staff / Academic (Akademik Personel)
    fireEvent.click(screen.getByRole('button', { name: /Akademik Personel/i }));
    expect(screen.getByTestId('role-specific-fields-academic')).toBeInTheDocument();
    expect(screen.getByLabelText('Unvan')).toBeRequired();
    expect(screen.getByLabelText('Bölüm / Fakülte')).toBeRequired();
    expect(screen.queryByLabelText('Kurum Sicil / YÖKSİS No')).not.toBeInTheDocument();
    expect(screen.queryByText(/Zorunlu Alanlar:/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Öğrenci Numarası')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Kurumsal Vergi No / MERSİS No')).not.toBeInTheDocument();

    // 4. Switch to Employer (Firma Kaydı)
    fireEvent.click(screen.getByRole('button', { name: /Firma Kaydı/i }));
    expect(screen.getByTestId('role-specific-fields-employer')).toBeInTheDocument();
    expect(screen.queryByLabelText('Kurumsal Vergi No / MERSİS No')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Şirket / Kurum Adı')).toBeRequired();
    expect(screen.getByLabelText('Faaliyet Sektörü')).toBeRequired();
    expect(screen.queryByLabelText('Öğrenci Numarası')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Kurum Sicil / YÖKSİS No')).not.toBeInTheDocument();
    expect(screen.queryByText(/e-Devlet ile Bağlan/i)).not.toBeInTheDocument();
  });

  it('validates employer contact person fields for empty and invalid formats before submission', async () => {
    const setCurrentUser = vi.fn();
    const setUserRole = vi.fn();

    render(
      <Register
        setView={vi.fn()}
        setCurrentUser={setCurrentUser}
        setUserRole={setUserRole}
      />
    );

    // Switch to Employer (Firma Kaydı)
    fireEvent.click(screen.getByRole('button', { name: /Firma Kaydı/i }));

    // Fill company fields but leave contact person empty
    fireEvent.change(screen.getByLabelText('Şirket / Kurum Adı'), { target: { value: 'Örnek Teknoloji A.Ş.' } });
    fireEvent.change(screen.getByLabelText('Faaliyet Sektörü'), { target: { value: 'Yazılım & Bilişim' } });
    fireEvent.change(screen.getByLabelText('Şirket Web Sayfası / İletişim URL'), { target: { value: 'https://www.ornekteknoloji.com.tr' } });
    fireEvent.change(screen.getByLabelText('Yetkili Adı Soyadı'), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /Firma Hesabımı Aktifleştir/i }));

    expect(screen.getByTestId('field-error-contactName')).toHaveTextContent('Yetkili kişi adı ve soyadı boş bırakılamaz.');
    expect(screen.getByTestId('field-error-title')).toHaveTextContent('Yetkili kişinin firmadaki görev tanımı / unvanı boş bırakılamaz.');
    expect(screen.getByTestId('field-error-email')).toHaveTextContent('Yetkili kurumsal e-posta adresi boş bırakılamaz.');
    expect(screen.getByTestId('field-error-phone')).toHaveTextContent('Yetkili telefon numarası boş bırakılamaz.');

    // Enter invalid format (single word or digits in contactName, invalid phone)
    fireEvent.change(screen.getByLabelText('Yetkili Adı Soyadı'), { target: { value: 'Ahmet123' } });
    fireEvent.blur(screen.getByLabelText('Yetkili Adı Soyadı'));
    expect(screen.getByTestId('field-error-contactName')).toHaveTextContent('Yetkili kişi bilgisi en az ad ve soyaddan oluşmalı, yalnızca harf içermelidir.');

    fireEvent.change(screen.getByLabelText('Yetkili Telefon Numarası'), { target: { value: '12345' } });
    fireEvent.blur(screen.getByLabelText('Yetkili Telefon Numarası'));
    expect(screen.getByTestId('field-error-phone')).toHaveTextContent('Yetkili telefon numarası geçerli formatta olmalıdır');

    // Fix contactName and phone to valid format and verify inline errors clear
    fireEvent.change(screen.getByLabelText('Yetkili Adı Soyadı'), { target: { value: 'Ahmet Yılmaz' } });
    fireEvent.change(screen.getByLabelText('Yetkili Telefon Numarası'), { target: { value: '05324441513' } });
    expect(screen.queryByTestId('field-error-contactName')).not.toBeInTheDocument();
    expect(screen.queryByTestId('field-error-phone')).not.toBeInTheDocument();
    expect(setCurrentUser).not.toHaveBeenCalled();
  });

  it('validates email format in real time on keystroke and prevents submitting invalid emails', () => {
    render(
      <Register
        setView={vi.fn()}
        setCurrentUser={vi.fn()}
        setUserRole={vi.fn()}
      />
    );

    const emailInput = screen.getByLabelText('E-Posta Adresi');
    const submitButton = screen.getByRole('button', { name: 'Mezun Hesabımı Aktifleştir' });

    // Type an invalid email without blurring -> real-time error appears & submit is disabled
    fireEvent.change(emailInput, { target: { value: 'gecersiz-eposta@' } });
    expect(screen.getByTestId('field-error-alumniEmail')).toHaveTextContent('Geçerli bir e-posta adresi formatı giriniz.');
    expect(screen.getByTestId('email-invalid-icon-alumniEmail')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Fix email in real time -> error clears, valid indicator appears & submit is re-enabled
    fireEvent.change(emailInput, { target: { value: 'ahmet.yilmaz@esenyurt.edu.tr' } });
    expect(screen.queryByTestId('field-error-alumniEmail')).not.toBeInTheDocument();
    expect(screen.getByTestId('email-valid-alumniEmail')).toHaveTextContent('Geçerli e-posta formatı doğrulandı.');
    expect(screen.getByTestId('email-valid-icon-alumniEmail')).toBeInTheDocument();
    expect(submitButton).toBeEnabled();
  });

  it('verifies student/alumni data in real time via e-Devlet service layer and displays "Kayıtlı öğrenci bilgisi bulunamadı" on mismatch', async () => {
    render(
      <Register
        setView={vi.fn()}
        setCurrentUser={vi.fn()}
        setUserRole={vi.fn()}
      />
    );

    // Switch to Student (Öğrenci Kaydı)
    fireEvent.click(screen.getByRole('button', { name: /Öğrenci Kaydı/i }));

    const studentIdInput = screen.getByLabelText('Öğrenci Numarası');
    const studentNameInput = screen.getByLabelText('Ad Soyadı');

    // 1. Enter an unregistered student number -> real-time error 'Kayıtlı öğrenci bilgisi bulunamadı'
    fireEvent.change(studentIdInput, { target: { value: '2099999999' } });
    expect(screen.getByTestId('field-error-studentId')).toHaveTextContent('Kayıtlı öğrenci bilgisi bulunamadı');

    // 2. Enter a valid registered student number (Ahmet Yılmaz - 2023010482) -> verified badge appears
    fireEvent.change(studentIdInput, { target: { value: '2023010482' } });
    expect(screen.queryByTestId('field-error-studentId')).not.toBeInTheDocument();
    expect(screen.getByTestId('edevlet-verified-studentId')).toHaveTextContent('Kayıtlı öğrenci/mezun bilgisi doğrulandı (Ahmet Yılmaz)');

    // 3. Enter a mismatched name for 2023010482 -> shows 'Kayıtlı öğrenci bilgisi bulunamadı'
    fireEvent.change(studentNameInput, { target: { value: 'Yanlış İsim' } });
    expect(screen.getByTestId('field-error-studentId')).toHaveTextContent('Kayıtlı öğrenci bilgisi bulunamadı');

    // 4. Correct the name to 'Ahmet Yılmaz' -> error clears and verified indicator returns
    fireEvent.change(studentNameInput, { target: { value: 'Ahmet Yılmaz' } });
    expect(screen.queryByTestId('field-error-studentId')).not.toBeInTheDocument();
    expect(screen.getByTestId('edevlet-verified-studentId')).toBeInTheDocument();
  });
});



