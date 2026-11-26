/**
 * src/utils/staffAuth.js
 * Kurumsal Çalışan Personel kimlik doğrulama ve parola özet (hash) yardımcısı.
 * KVKK & Güvenlik Gereği: Personel parolaları localStorage'da asla düz metin saklanmaz.
 */

const STAFF_SALT = 'IESU-KGM-STAFF-2026-V1';

/**
 * Deterministik, tuzlu özet (hash) fonksiyonu (sync, tarayıcı/test uyumlu).
 * Parolayı düz metin saklamamak için çift geçişli FNV-1a + DJB2 64-bit hex özet üretir.
 */
export function hashStaffPassword(email = '', password = '') {
  const input = `${STAFF_SALT}::${String(email || '').trim().toLowerCase()}::${String(password || '')}`;
  let h1 = 0x811c9dc5;
  let h2 = 5381;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193);
    h2 = ((h2 << 5) + h2) ^ ch;
  }
  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `shv1_${part1}${part2}`;
}

export const DEFAULT_STAFF_ACCOUNTS = [
  {
    id: '101',
    name: 'Kariyer Geliştirme Koordinatörlüğü',
    username: 'kariyer_admin',
    email: 'kariyer@iesu.edu.tr',
    typeId: '1',
    typeName: 'Süper Admin',
    department: 'Kariyer Geliştirme Koordinatörlüğü',
    lastLogin: '2026-10-18 09:30',
    status: 'Aktif',
    hasPassword: true
  },
  {
    id: '104',
    name: 'Kariyer Geliştirme Merkezi Birim Yöneticisi',
    username: 'kgm_personel',
    email: 'personel@iesu.edu.tr',
    typeId: '6',
    typeName: 'Birim Yöneticisi',
    department: 'Kariyer Geliştirme Merkezi',
    lastLogin: '2026-10-18 10:15',
    status: 'Aktif',
    hasPassword: true,
    passwordHash: hashStaffPassword('personel@iesu.edu.tr', 'iesu2026')
  },
  {
    id: '102',
    name: 'Kurumsal İletişim & İçerik Birimi',
    username: 'kgm_editor',
    email: 'editor@iesu.edu.tr',
    typeId: '2',
    typeName: 'İçerik Editörü',
    department: 'Kurumsal İletişim',
    lastLogin: '2026-10-18 14:15',
    status: 'Aktif',
    hasPassword: true,
    passwordHash: hashStaffPassword('editor@iesu.edu.tr', 'iesu2026')
  },
  {
    id: '103',
    name: 'Mezun İlişkileri Koordinatörlüğü',
    username: 'mezun_sorumlu',
    email: 'mezun@iesu.edu.tr',
    typeId: '3',
    typeName: 'Mezun İlişkileri Sorumlusu',
    department: 'Mezun İlişkileri Ofisi',
    lastLogin: '2026-10-18 11:45',
    status: 'Aktif',
    hasPassword: true,
    passwordHash: hashStaffPassword('mezun@iesu.edu.tr', 'iesu2026')
  }
];

export function normalizeStaffUsername(raw = '', fallbackEmail = '') {
  const cleaned = String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/^@+/, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9._-]/g, '');
  if (cleaned) return cleaned;
  const fromEmail = String(fallbackEmail || '').trim().toLowerCase().split('@')[0] || '';
  return fromEmail.replace(/[^a-z0-9._-]/g, '');
}

export function loadStaffAccounts() {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('iesu_staff_accounts_v1') : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(acc => ({
          ...acc,
          username: acc.username || normalizeStaffUsername('', acc.email)
        }));
      }
    }
  } catch { /* intentional */ }
  return DEFAULT_STAFF_ACCOUNTS;
}

/**
 * Personel hesabı doğrulama:
 * - Hesap `iesu_staff_accounts_v1` içinde bulunmalıdır (veya varsayılan listede).
 * - Kullanıcı adı (username) VEYA e-posta + şifre ile doğrulanır.
 * - `typeId === '1'` (Süper Admin) buradan değil, Süper Yönetici akışından doğrulanır.
 * - Pasif hesaplar engellenir.
 */
export function verifyStaffCredentials(identifier = '', password = '') {
  const cleanId = String(identifier || '').trim().toLowerCase().replace(/^@+/, '');
  const cleanPass = String(password || '').trim();
  if (!cleanId || !cleanPass) return { ok: false, reason: 'missing' };

  const accounts = loadStaffAccounts();
  const matched = accounts.find(a =>
    a.typeId !== '1' &&
    (
      (a.username && String(a.username).trim().toLowerCase() === cleanId) ||
      (a.email && String(a.email).trim().toLowerCase() === cleanId)
    )
  );

  if (!matched) return { ok: false, reason: 'not_found' };
  if (matched.status !== 'Aktif') return { ok: false, reason: 'inactive', account: matched };

  const computedHash = hashStaffPassword(matched.email, cleanPass);
  const storedHash = matched.passwordHash || hashStaffPassword(matched.email, 'iesu2026');

  if (computedHash !== storedHash) {
    return { ok: false, reason: 'invalid_password' };
  }

  // Son giriş zamanını güncelle
  try {
    const updated = accounts.map(a =>
      a.id === matched.id
        ? { ...a, lastLogin: new Date().toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }
        : a
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem('iesu_staff_accounts_v1', JSON.stringify(updated));
    }
  } catch { /* intentional */ }

  return {
    ok: true,
    user: {
      id: `STAFF-${matched.id}`,
      staffAccountId: matched.id,
      username: matched.username || normalizeStaffUsername('', matched.email),
      name: matched.name,
      email: matched.email,
      role: 'staff',
      staffTypeId: matched.typeId,
      staffTitle: matched.typeName || 'Kurumsal Personel',
      title: matched.typeName || 'Kurumsal Personel',
      department: matched.department || 'Kariyer Geliştirme Merkezi',
      avatar: '/iesu-logo.svg',
      onboardingCompleted: true,
      status: 'Aktif'
    }
  };
}
