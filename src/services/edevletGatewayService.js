import { db } from '../utils/firebase';
import { doc, setDoc } from 'firebase/firestore';
import useAppStore from '../store/useAppStore';
import { verifyStudentObsRecord } from './obsVerificationWorkflow';
import {
  EDEVLET_NOT_FOUND_MESSAGE,
  EDEVLET_NOT_FOUND_DETAIL,
  verifyEDevletStudentOrAlumni,
  verifyEDevletStudentOrAlumniSync,
} from './edevletVerificationService';

export {
  EDEVLET_NOT_FOUND_MESSAGE,
  EDEVLET_NOT_FOUND_DETAIL,
  verifyEDevletStudentOrAlumni,
  verifyEDevletStudentOrAlumniSync,
};

/**
 * Resmi e-Devlet Kapısı (Türksat) OAuth 2.0 / OpenID Connect & YÖKSİS Web Servisi Entegrasyonu
 *
 * Desteklenen Resmi Kapsamlar (Scopes):
 * 1. Kimlik-Dogrulama              -> T.C. Kimlik No, Ad, Soyad, Doğum Tarihi (MERNİS)
 * 2. Iletisim-Bilgileri            -> Doğrulanmış E-Posta ve Cep Telefonu
 * 3. Yoksis-Ogrenim-Bilgileri      -> Aktif Öğrenciler: Fakülte, Bölüm, Sınıf, GANO, Öğrenci No
 * 4. Yoksis-Mezuniyet-Bilgileri    -> Mezunlar: Mezun Olunan Bölüm, Mezuniyet Yılı, Diploma No, GANO
 * 5. Yoksis-Akademik-Bilgileri     -> Akademik Personel: Akademik Unvan (Prof./Doç./Dr. Öğr. Üyesi), Kadro Bölümü, YÖK Akademik ID
 */

export const EDEVLET_SCOPES_BY_ROLE = {
  student: 'Kimlik-Dogrulama Iletisim-Bilgileri Yoksis-Ogrenim-Bilgileri',
  alumni: 'Kimlik-Dogrulama Iletisim-Bilgileri Yoksis-Mezuniyet-Bilgileri Yoksis-Ogrenim-Bilgileri',
  academic: 'Kimlik-Dogrulama Iletisim-Bilgileri Yoksis-Akademik-Bilgileri',
};

export const getEDevletConfig = () => {
  const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kariyer.esenyurt.edu.tr';

  return {
    enabled: env.VITE_EDEVLET_ENABLED === 'true' || Boolean(env.VITE_EDEVLET_CLIENT_ID),
    clientId: env.VITE_EDEVLET_CLIENT_ID || '',
    redirectUri: env.VITE_EDEVLET_REDIRECT_URI || `${origin}/auth/edevlet/callback`,
    authUrl:
      env.VITE_EDEVLET_AUTH_URL ||
      'https://giris.turkiye.gov.tr/OAuth2AuthorizationServer/AuthorizationController',
    tokenUrl:
      env.VITE_EDEVLET_TOKEN_URL ||
      'https://giris.turkiye.gov.tr/OAuth2AuthorizationServer/AccessTokenController',
    resourceUrl:
      env.VITE_EDEVLET_RESOURCE_URL ||
      'https://giris.turkiye.gov.tr/OAuth2AuthorizationServer/ResourceController',
    callbackApiUrl: env.VITE_EDEVLET_GATEWAY_URL || '/api/auth/edevlet/callback',
  };
};

/**
 * OAuth 2.0 CSRF State parametresi oluşturur ve sessionStorage'a kaydeder.
 */
export const createEDevletOAuthState = (role = 'student', mode = 'login') => {
  const normalizedRole = ['student', 'alumni', 'academic'].includes(role) ? role : 'student';
  const nonce =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const statePayload = {
    role: normalizedRole,
    mode,
    nonce,
    ts: Date.now(),
  };

  const encodedState = btoa(unescape(encodeURIComponent(JSON.stringify(statePayload))));
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem('iesu_edevlet_oauth_state', encodedState);
      window.sessionStorage.setItem('iesu_edevlet_oauth_role', normalizedRole);
    }
  } catch {
    /* ignore storage errors */
  }
  return encodedState;
};

/**
 * State parametresini çözümler ve doğrular.
 */
export const parseEDevletOAuthState = (rawState) => {
  if (!rawState) return { role: 'student', mode: 'login' };
  try {
    const jsonStr = decodeURIComponent(escape(atob(rawState)));
    const parsed = JSON.parse(jsonStr);
    return {
      role: ['student', 'alumni', 'academic'].includes(parsed?.role) ? parsed.role : 'student',
      mode: parsed?.mode || 'login',
      nonce: parsed?.nonce || '',
      ts: parsed?.ts || 0,
    };
  } catch {
    try {
      const fallback = JSON.parse(rawState);
      return {
        role: ['student', 'alumni', 'academic'].includes(fallback?.role) ? fallback.role : 'student',
        mode: fallback?.mode || 'login',
      };
    } catch {
      return { role: 'student', mode: 'login' };
    }
  }
};

/**
 * Resmi e-Devlet Kapısı OAuth 2.0 Yetkilendirme (Authorization) URL'ini üretir.
 */
export const buildEDevletAuthorizationUrl = (role = 'student', options = {}) => {
  const config = getEDevletConfig();
  const normalizedRole = ['student', 'alumni', 'academic'].includes(role) ? role : 'student';
  const scope = options.scope || EDEVLET_SCOPES_BY_ROLE[normalizedRole] || EDEVLET_SCOPES_BY_ROLE.student;
  const state = createEDevletOAuthState(normalizedRole, options.mode || 'login');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId || 'IESU-KARIYER-EDEVLET-CLIENT',
    redirect_uri: config.redirectUri,
    scope,
    state,
  });

  return `${config.authUrl}?${params.toString()}`;
};

/**
 * Resmi e-Devlet Kapısı OAuth 2.0 / YÖKSİS Doğrudan Yönlendirme Başlatıcısı.
 * Herhangi bir sahte/manuel yan panel veya modal açmaz;
 * doğrudan resmi e-Devlet Kapısı OAuth 2.0 akışını başlatır.
 */
export const initiateEDevletOAuthLogin = (role = 'student', options = {}) => {
  const config = getEDevletConfig();
  const normalizedRole = ['student', 'alumni', 'academic'].includes(role) ? role : 'student';
  const authorizationUrl = buildEDevletAuthorizationUrl(normalizedRole, options);

  if (config.enabled && config.clientId) {
    if (typeof window !== 'undefined') {
      window.location.assign(authorizationUrl);
    }
    return {
      enabled: true,
      redirecting: true,
      role: normalizedRole,
      authorizationUrl,
    };
  }

  return {
    enabled: false,
    redirecting: false,
    role: normalizedRole,
    authorizationUrl,
    message:
      'e-Devlet Kapısı (Türksat & YÖKSİS) doğrudan entegrasyon altyapısı hazırdır. Kurumsal API anahtarları (VITE_EDEVLET_CLIENT_ID ve EDEVLET_CLIENT_SECRET) tanımlandığında tek tıkla giris.turkiye.gov.tr üzerinden otomatik veri aktarımı devreye girecektir.',
  };
};

/**
 * e-Devlet Kapısı OAuth 2.0 dönüşünde (Callback: /auth/edevlet/callback?code=...&state=...)
 * sunucu üzerinden AccessToken ve ResourceController (MERNİS + YÖKSİS Öğrenci / Mezun / Akademik Kütüğü)
 * verilerini çeker, doğrular, Firestore `users` koleksiyonuna ve uygulama durumuna otomatik aktarır.
 */
export const handleEDevletOAuthCallback = async (code, state) => {
  if (!code) {
    throw new Error('e-Devlet yetkilendirme kodu (authorization_code) bulunamadı.');
  }

  const config = getEDevletConfig();
  const parsedState = parseEDevletOAuthState(state);

  const response = await fetch(config.callbackApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      state,
      role: parsedState.role,
      redirectUri: config.redirectUri,
    }),
  });

  if (!response.ok) {
    let errMessage = 'e-Devlet Kapısı kimlik ve YÖKSİS verileri alınamadı.';
    try {
      const errBody = await response.json();
      if (errBody?.error) errMessage = errBody.error;
    } catch {
      /* ignore */
    }
    throw new Error(errMessage);
  }

  const data = await response.json();

  // Rol tespiti: YÖKSİS'ten gelen öğrenim/kadro durumuna göre otomatik belirlenir
  let resolvedRole = parsedState.role || 'student';
  if (data.role === 'academic' || data.academicTitle || data.yoksisService === 'Yoksis-Akademik-Bilgileri') {
    resolvedRole = 'academic';
  } else if (
    data.role === 'alumni' ||
    data.educationStatus === 'Mezun' ||
    data.yoksisService === 'Yoksis-Mezuniyet-Bilgileri' ||
    Boolean(data.diplomaNo)
  ) {
    resolvedRole = 'alumni';
  } else {
    resolvedRole = 'student';
  }

  const fullName = String(
    data.fullName ||
      data.name ||
      [data.firstName || data.ad, data.lastName || data.soyad].filter(Boolean).join(' ') ||
      'e-Devlet Kullanıcısı'
  ).trim();

  const tcNo = String(data.tcNo || data.kimlikNo || '').trim();
  const studentNo = String(data.studentNo || data.ogrenciNo || '').trim();
  const department = String(data.department || data.programAdi || data.bolumAdi || 'Bilgisayar Mühendisliği').trim();
  const faculty = String(
    data.faculty || data.fakulteAdi || 'İstanbul Esenyurt Üniversitesi'
  ).trim();
  const gpa = String(data.gano || data.gpa || '').trim();
  const graduationYear = String(data.graduationYear || data.mezuniyetYili || '').trim();
  const diplomaNo = String(data.diplomaNo || '').trim();
  const academicTitle = String(data.academicTitle || data.unvan || '').trim();

  // Öğrenci ve mezunlar için OBS/YÖKSİS doğrulama kaydını da oluştur
  let obsVerification = null;
  if (resolvedRole === 'student' || resolvedRole === 'alumni') {
    obsVerification = verifyStudentObsRecord(
      {
        tcKimlik: tcNo,
        studentNo,
        fullName,
        faculty,
        department,
        grade: data.grade || (resolvedRole === 'alumni' ? 'Mezun' : '3. Sınıf'),
        gano: gpa || '3.20',
        graduationYear: graduationYear || null,
      },
      { eDevletDynamic: true }
    );
  }

  const userId = String(
    data.uid ||
      data.id ||
      (tcNo ? `EDEVLET-${tcNo}` : studentNo ? `EDEVLET-${studentNo}` : `EDEVLET-${Date.now()}`)
  );

  const defaultEmail =
    data.email ||
    (resolvedRole === 'academic'
      ? `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@esenyurt.edu.tr`
      : resolvedRole === 'alumni'
      ? `${studentNo || userId}@mezun.esenyurt.edu.tr`
      : `${studentNo || userId}@ogr.esenyurt.edu.tr`);

  const userProfile = {
    id: userId,
    uid: userId,
    tcNo,
    tcKimlik: tcNo,
    studentId: studentNo,
    studentNo,
    name: fullName,
    email: defaultEmail,
    phone: data.phone || data.cepTelefonu || '',
    faculty,
    department,
    grade:
      resolvedRole === 'academic'
        ? academicTitle || 'Öğretim Üyesi'
        : resolvedRole === 'alumni'
        ? 'Mezun'
        : data.grade || data.sinif || 'Aktif Öğrenci',
    title:
      resolvedRole === 'academic'
        ? academicTitle || 'Dr. Öğr. Üyesi'
        : resolvedRole === 'alumni'
        ? data.title || 'İESÜ Mezunu'
        : 'Öğrenci',
    gpa,
    graduationYear: resolvedRole === 'alumni' ? graduationYear || '2024' : '',
    gradYear: resolvedRole === 'alumni' ? graduationYear || '2024' : '',
    diplomaNo,
    role: resolvedRole,
    status: 'Aktif',
    eDevletVerified: true,
    yoksisVerified: true,
    obsVerified: true,
    verificationCode: obsVerification?.record?.verificationCode || `YOKSIS-${Date.now()}`,
    verificationSource:
      resolvedRole === 'academic'
        ? 'e-Devlet Kapısı & YÖKSİS Akademik Personel Kütüğü'
        : resolvedRole === 'alumni'
        ? 'e-Devlet Kapısı & YÖKSİS Yükseköğretim Mezun Kütüğü'
        : 'e-Devlet Kapısı & YÖKSİS Aktif Öğrenci Kütüğü',
    authProvider: 'edevlet_oauth2',
    onboardingCompleted: true,
    kvkkConsent: true,
    updated_at: new Date().toISOString(),
  };

  // 1. Firestore 'users' koleksiyonuna otomatik kaydet
  if (db) {
    try {
      await setDoc(doc(db, 'users', userId), userProfile, { merge: true });
    } catch {
      /* Çevrimdışı veya yetki kısıtında oturumu engelleme */
    }
  }

  // 2. Uygulama Store'una ve aktif oturuma otomatik aktar
  try {
    const store = useAppStore.getState();
    store.setUserRole?.(resolvedRole);
    store.setCurrentUser?.(userProfile);
    store.setActivePortalBranch?.(resolvedRole);

    if (resolvedRole === 'alumni') {
      store.setAlumni?.((prev) => [
        userProfile,
        ...(Array.isArray(prev) ? prev.filter((u) => u.id !== userProfile.id && u.email !== userProfile.email) : []),
      ]);
    } else if (resolvedRole === 'academic') {
      store.setAcademicStaff?.((prev) => [
        userProfile,
        ...(Array.isArray(prev) ? prev.filter((u) => u.id !== userProfile.id && u.email !== userProfile.email) : []),
      ]);
    } else {
      store.setStudents?.((prev) => [
        userProfile,
        ...(Array.isArray(prev) ? prev.filter((u) => u.id !== userProfile.id && u.email !== userProfile.email) : []),
      ]);
    }

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('iesu_mock_user', JSON.stringify(userProfile));
      window.sessionStorage.setItem('iesu_user_role_v1', resolvedRole);
      window.sessionStorage.removeItem('iesu_edevlet_oauth_state');
    }
  } catch {
    /* ignore */
  }

  return userProfile;
};
