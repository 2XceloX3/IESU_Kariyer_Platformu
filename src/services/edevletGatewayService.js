import { db } from '../utils/firebase';
import { doc, setDoc } from 'firebase/firestore';

const EDEVLET_CONFIG = {
  enabled: typeof import.meta !== 'undefined' && import.meta.env?.VITE_EDEVLET_ENABLED === 'true',
  clientId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EDEVLET_CLIENT_ID) || '',
  redirectUri:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EDEVLET_REDIRECT_URI) ||
    (typeof window !== 'undefined' ? window.location.origin + '/auth/edevlet/callback' : ''),
  authUrl:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EDEVLET_AUTH_URL) ||
    'https://giris.turkiye.gov.tr/OAuth2AuthorizationServer/AuthorizationController',
};

/**
 * Resmi e-Devlet Kapısı OAuth2 / OIDC Giriş ve YÖKSİS Bilgi Çekme Yönlendirmesi
 * Resmi kurum izinleri (VITE_EDEVLET_ENABLED=true ve VITE_EDEVLET_CLIENT_ID) aktif edildiğinde
 * doğrudan giris.turkiye.gov.tr adresine yönlendirir.
 */
export const initiateEDevletOAuthLogin = (role = 'student') => {
  if (EDEVLET_CONFIG.enabled && EDEVLET_CONFIG.clientId) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: EDEVLET_CONFIG.clientId,
      redirect_uri: EDEVLET_CONFIG.redirectUri,
      scope: 'Kimlik-Dogrulama Yoksis-Ogrenim-Bilgileri',
      state: JSON.stringify({ role, ts: Date.now() }),
    });
    window.location.assign(`${EDEVLET_CONFIG.authUrl}?${params.toString()}`);
    return { enabled: true, redirecting: true };
  }

  return {
    enabled: false,
    message:
      'e-Devlet Kapısı (YÖKSİS) resmi kurum entegrasyonu API izinleri tanımlandığında aktif olacaktır. Şu an kurumsal e-posta ve şifrenizle giriş yapabilirsiniz.',
  };
};

/**
 * Resmi e-Devlet OAuth2 Callback Veri İşleyicisi
 * e-Devlet'ten dönen T.C. Kimlik, Ad Soyad, Fakülte, Bölüm, Sınıf, GANO ve Mezuniyet verilerini
 * çekip Firestore 'users' koleksiyonuna işler.
 */
export const handleEDevletOAuthCallback = async (code, state) => {
  const response = await fetch('/api/auth/edevlet/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, state }),
  });

  if (!response.ok) {
    throw new Error('e-Devlet Kapısı kimlik ve öğrenim verileri alınamadı.');
  }

  const data = await response.json();
  const userId = String(data.uid || data.tcNo || 'EDEVLET-' + Date.now());
  const normalizedRole = data.educationStatus === 'Mezun' || data.role === 'alumni' ? 'alumni' : 'student';

  const userProfile = {
    id: userId,
    tcNo: data.tcNo || '',
    studentNo: data.studentNo || '',
    name: data.fullName || data.name || '',
    email: data.email || '',
    faculty: data.faculty || 'İstanbul Esenyurt Üniversitesi',
    department: data.department || '',
    grade: data.grade || (normalizedRole === 'alumni' ? 'Mezun' : ''),
    gpa: data.gano || data.gpa || '',
    graduationYear: data.graduationYear || '',
    role: normalizedRole,
    status: 'Aktif',
    eDevletVerified: true,
    yoksisVerified: true,
    authProvider: 'edevlet_oauth2',
    onboardingCompleted: true,
    updated_at: new Date().toISOString(),
  };

  if (db) {
    await setDoc(doc(db, 'users', userId), userProfile, { merge: true });
  }

  return userProfile;
};
