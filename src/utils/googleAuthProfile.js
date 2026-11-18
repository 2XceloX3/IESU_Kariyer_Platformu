import { GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { oAuthClientId } from './firebase';

const GENERIC_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'icloud.com',
  'yandex.com',
  'live.com',
  'msn.com',
  'protonmail.com',
  'proton.me',
  'windowslive.com',
  'mail.com'
]);

const formatDomainBrand = (domain) => {
  if (!domain) return '';
  const root = String(domain).split('.')[0] || '';
  return root
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
};

const normalizePhoneDigits = (rawPhone) => {
  if (!rawPhone) return '';
  const cleaned = String(rawPhone)
    .replace(/[\s()-]/g, '')
    .replace(/^\+90/, '0')
    .replace(/\D/g, '');
  if (!cleaned) return '';
  return cleaned.startsWith('0') ? cleaned.slice(0, 11) : (`0${cleaned}`).slice(0, 11);
};

const loadGoogleIdentityScript = () =>
  new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Tarayıcı ortamı bulunamadı.'));
      return;
    }
    if (window.google?.accounts?.oauth2) {
      resolve(window.google.accounts.oauth2);
      return;
    }
    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google?.accounts?.oauth2));
      existing.addEventListener('error', () => reject(new Error('Google OAuth istemcisi yüklenemedi.')));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.oauth2) {
        resolve(window.google.accounts.oauth2);
      } else {
        reject(new Error('Google OAuth istemcisi başlatılamadı.'));
      }
    };
    script.onerror = () => reject(new Error('Google OAuth bağlantısı kurulamadı.'));
    document.head.appendChild(script);
  });

const requestAccessTokenViaGIS = async (clientId) => {
  const oauth2 = await loadGoogleIdentityScript();
  return new Promise((resolve, reject) => {
    try {
      const tokenClient = oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        prompt: 'select_account',
        callback: (response) => {
          if (response?.error) {
            reject(new Error(response.error_description || response.error));
            return;
          }
          if (response?.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error('Google erişim anahtarı alınamadı.'));
          }
        },
        error_callback: (err) => {
          reject(new Error(err?.message || err?.type || 'Google oturum penceresi kapatıldı.'));
        }
      });
      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      reject(err);
    }
  });
};

const fetchGoogleOAuthUserInfo = async (accessToken) => {
  if (!accessToken || typeof fetch !== 'function') return null;
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

const fetchGooglePeopleProfile = async (accessToken) => {
  if (!accessToken || typeof fetch !== 'function') return null;
  try {
    const res = await fetch(
      'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos,organizations,phoneNumbers,urls',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

const fetchExistingFirestoreProfile = async (db, uid) => {
  if (!db || !uid || typeof getDoc !== 'function' || typeof doc !== 'function') return null;
  try {
    const companySnap = await getDoc(doc(db, 'company_profiles', uid));
    if (companySnap?.exists?.()) {
      return companySnap.data() || null;
    }
    const userSnap = await getDoc(doc(db, 'users', uid));
    if (userSnap?.exists?.()) {
      return userSnap.data() || null;
    }
  } catch {
    /* ignore Firestore read failure */
  }
  return null;
};

/**
 * Authenticates the user with Google (via Firebase Auth signInWithPopup or Google Identity Services OAuth2)
 * and fetches real profile & organization data from Google OAuth2 UserInfo + People API.
 * Never returns hardcoded mock company data.
 */
export async function authenticateAndFetchGoogleProfile({
  auth,
  db,
  googleProvider,
  signInWithPopup,
  existingCompanies = [],
  formData = {}
}) {
  let firebaseUser = null;
  let accessToken = null;
  let tokenResponse = {};
  let lastPopupError = null;

  if (auth && googleProvider && typeof signInWithPopup === 'function') {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      firebaseUser = result?.user || null;
      tokenResponse = result?._tokenResponse || {};
      try {
        const credential =
          typeof GoogleAuthProvider?.credentialFromResult === 'function'
            ? GoogleAuthProvider.credentialFromResult(result)
            : result?.credential;
        accessToken = credential?.accessToken || tokenResponse?.oauthAccessToken || null;
      } catch {
        accessToken = tokenResponse?.oauthAccessToken || null;
      }
    } catch (popupErr) {
      lastPopupError = popupErr;
      const code = popupErr?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        throw new Error('Google oturum açma penceresi kapatıldı. Gerçek hesap bilgilerinizin çekilmesi için lütfen Google hesabınızı seçin.');
      }
      if (code === 'auth/popup-blocked') {
        throw new Error('Tarayıcınız Google açılır penceresini (popup) engelledi. Lütfen adres çubuğundan açılır pencerelere izin verip tekrar deneyin.');
      }
    }
  }

  // Fallback to direct Google Identity Services OAuth2 if Firebase Auth popup wasn't available or failed due to domain/provider configuration
  if (!firebaseUser && !accessToken && oAuthClientId && typeof window !== 'undefined') {
    try {
      accessToken = await requestAccessTokenViaGIS(oAuthClientId);
    } catch (gisErr) {
      if (!lastPopupError) {
        lastPopupError = gisErr;
      }
    }
  }

  const [userInfo, peopleData] = await Promise.all([
    fetchGoogleOAuthUserInfo(accessToken),
    fetchGooglePeopleProfile(accessToken)
  ]);

  const uid =
    firebaseUser?.uid ||
    userInfo?.sub ||
    (peopleData?.resourceName ? String(peopleData.resourceName).replace('people/', '') : null);

  const firestoreProfile = await fetchExistingFirestoreProfile(db, uid);

  const primaryProvider = firebaseUser?.providerData?.[0] || {};
  const peoplePrimaryName =
    Array.isArray(peopleData?.names) && peopleData.names.length > 0 ? peopleData.names[0] : null;
  const peoplePrimaryEmail =
    Array.isArray(peopleData?.emailAddresses) && peopleData.emailAddresses.length > 0
      ? peopleData.emailAddresses[0]
      : null;
  const peoplePrimaryPhoto =
    Array.isArray(peopleData?.photos) && peopleData.photos.length > 0 ? peopleData.photos[0] : null;
  const peoplePrimaryOrg =
    Array.isArray(peopleData?.organizations) && peopleData.organizations.length > 0
      ? peopleData.organizations[0]
      : null;
  const peoplePrimaryPhone =
    Array.isArray(peopleData?.phoneNumbers) && peopleData.phoneNumbers.length > 0
      ? peopleData.phoneNumbers[0]
      : null;
  const peoplePrimaryUrl =
    Array.isArray(peopleData?.urls) && peopleData.urls.length > 0 ? peopleData.urls[0] : null;

  const resolvedEmail = String(
    userInfo?.email ||
      firebaseUser?.email ||
      primaryProvider?.email ||
      peoplePrimaryEmail?.value ||
      tokenResponse?.email ||
      ''
  )
    .trim()
    .toLowerCase();

  if (!resolvedEmail) {
    const errCode = lastPopupError?.code || '';
    if (errCode === 'auth/unauthorized-domain') {
      throw new Error('Bu önizleme alan adı Firebase Google OAuth üzerinde henüz yetkilendirilmemiş. Lütfen bilgilerinizi doğrudan forma girin.');
    }
    throw new Error(
      lastPopupError?.message ||
        'Google hesabınızdan gerçek kullanıcı verisi alınamadı. Lütfen Google oturumunuzu doğrulayıp tekrar deneyin.'
    );
  }

  const matchedCompany = (existingCompanies || []).find(
    (c) => c?.email && String(c.email).trim().toLowerCase() === resolvedEmail
  );

  const fullNameFromParts = [userInfo?.given_name, userInfo?.family_name].filter(Boolean).join(' ');
  const resolvedContactName = String(
    userInfo?.name ||
      fullNameFromParts ||
      firebaseUser?.displayName ||
      primaryProvider?.displayName ||
      peoplePrimaryName?.displayName ||
      tokenResponse?.fullName ||
      tokenResponse?.displayName ||
      firestoreProfile?.contactName ||
      firestoreProfile?.name ||
      matchedCompany?.contactName ||
      formData?.contactName ||
      ''
  ).trim();

  const resolvedAvatar =
    userInfo?.picture ||
    firebaseUser?.photoURL ||
    primaryProvider?.photoURL ||
    peoplePrimaryPhoto?.url ||
    tokenResponse?.photoUrl ||
    firestoreProfile?.avatar ||
    matchedCompany?.avatar ||
    null;

  const emailDomain = resolvedEmail.split('@')[1] || '';
  const isGenericDomain = !emailDomain || GENERIC_EMAIL_DOMAINS.has(emailDomain.toLowerCase());
  const hostedDomain = String(userInfo?.hd || (!isGenericDomain ? emailDomain : '')).trim().toLowerCase();

  const resolvedCompanyName = String(
    peoplePrimaryOrg?.name ||
      firestoreProfile?.companyName ||
      (firestoreProfile?.role === 'employer' || firestoreProfile?.role === 'company' ? firestoreProfile?.name : '') ||
      matchedCompany?.name ||
      (hostedDomain ? formatDomainBrand(hostedDomain) : '') ||
      formData?.companyName ||
      ''
  ).trim();

  const resolvedTitle = String(
    peoplePrimaryOrg?.title ||
      firestoreProfile?.title ||
      matchedCompany?.title ||
      formData?.title ||
      ''
  ).trim();

  const resolvedSector = String(
    peoplePrimaryOrg?.department ||
      firestoreProfile?.sector ||
      matchedCompany?.sector ||
      formData?.sector ||
      ''
  ).trim();

  const resolvedWebsite = String(
    peoplePrimaryUrl?.value ||
      firestoreProfile?.website ||
      matchedCompany?.website ||
      (hostedDomain ? `https://${hostedDomain}` : '') ||
      formData?.website ||
      ''
  ).trim();

  const resolvedPhone = normalizePhoneDigits(
    firebaseUser?.phoneNumber ||
      primaryProvider?.phoneNumber ||
      peoplePrimaryPhone?.canonicalForm ||
      peoplePrimaryPhone?.value ||
      firestoreProfile?.phone ||
      matchedCompany?.phone ||
      formData?.phone ||
      ''
  );

  const pulledFields = [];
  if (resolvedEmail) pulledFields.push('E-Posta');
  if (resolvedContactName) pulledFields.push('Ad Soyad');
  if (resolvedAvatar) pulledFields.push('Profil Fotoğrafı');
  if (resolvedCompanyName) pulledFields.push('Kurum Adı');
  if (resolvedTitle) pulledFields.push('Görev / Unvan');
  if (resolvedWebsite) pulledFields.push('Web Sitesi');
  if (resolvedPhone) pulledFields.push('Telefon');

  return {
    uid: uid || `GGL-${Date.now()}`,
    email: resolvedEmail,
    contactName: resolvedContactName,
    avatar: resolvedAvatar,
    companyName: resolvedCompanyName,
    title: resolvedTitle,
    sector: resolvedSector,
    website: resolvedWebsite,
    phone: resolvedPhone,
    hostedDomain: hostedDomain || null,
    emailVerified: Boolean(userInfo?.email_verified ?? firebaseUser?.emailVerified ?? true),
    pulledFields,
    googleVerified: true,
    fetchedAt: new Date().toISOString()
  };
}
