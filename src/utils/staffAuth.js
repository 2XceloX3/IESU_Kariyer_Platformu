/**
 * src/utils/staffAuth.js
 * Kurumsal Çalışan Personel kimlik doğrulama, parola özet (hash) ve granüler yetki yardımcısı.
 * KVKK & Güvenlik Gereği: Personel parolaları localStorage'da asla düz metin saklanmaz.
 */

const STAFF_SALT = 'IESU-KGM-STAFF-2026-V1';

/**
 * Granüler Personel Yetki Grupları (Yalnızca operasyonel alanlar — Süper Admin sistem ayarları dahil değildir).
 */
export const STAFF_PERMISSION_GROUPS = [
  {
    id: 'students_staj',
    label: 'Öğrenci & Staj Yönetimi',
    shortLabel: 'Öğrenci & Staj',
    desc: 'Öğrenci listesi, gönüllü/zorunlu staj onayları, KGB ve CV portfolyoları',
    color: 'rose',
    tabs: ['students', 'gonullu', 'cms_ssp', 'cms_portfolios'],
    primaryTab: 'students'
  },
  {
    id: 'alumni',
    label: 'Mezunlar & MBS Yönetimi',
    shortLabel: 'Mezun & MBS',
    desc: 'Mezun havuzu, Mezunlar Portalı içerikleri, Dijital Mezun Kartı ve harita',
    color: 'emerald',
    tabs: ['alumni', 'cms_mezun_dernek', 'kart', 'world_map', 'cms_groups'],
    primaryTab: 'alumni'
  },
  {
    id: 'companies_protocols',
    label: 'Firma & İş Birliği Protokolleri',
    shortLabel: 'Firma & Protokol',
    desc: 'Kurumsal firmalar, üniversite-işletme protokolleri ve kariyer günleri',
    color: 'blue',
    tabs: ['companies', 'cms_corporate_partnerships', 'kariyer_gunleri', 'company_edu_requests', 'company_event_msgs'],
    primaryTab: 'cms_corporate_partnerships'
  },
  {
    id: 'jobs_applications',
    label: 'İlan & Başvuru Onayı',
    shortLabel: 'İlan & Başvuru',
    desc: 'İş/staj ilan denetimi, başvuru havuzu ve operasyon onay masası',
    color: 'amber',
    tabs: ['operasyon', 'ilan', 'cms_jobs', 'cms_feat', 'basvuru_havuzu', 'aday_havuzu'],
    primaryTab: 'ilan'
  },
  {
    id: 'content',
    label: 'İçerik, Haber & Etkinlik',
    shortLabel: 'İçerik & Duyuru',
    desc: 'Haberler, duyurular, kariyer etkinlikleri, galeri ve resmi içerik aktarımı',
    color: 'violet',
    tabs: ['cms_news', 'cms_ann', 'cms_events', 'etkinlik', 'cms_gallery', 'content_import'],
    primaryTab: 'cms_ann'
  },
  {
    id: 'mentorship',
    label: 'Mentörlük & Danışmanlık',
    shortLabel: 'Mentörlük',
    desc: 'Bire bir kariyer danışmanlığı randevuları ve mentör eşleştirme havuzu',
    color: 'teal',
    tabs: ['cms_career_counseling', 'mentorluk', 'cms_ment', 'cms_mentorship_pool'],
    primaryTab: 'cms_career_counseling'
  },
  {
    id: 'messages',
    label: 'İletişim & Mesaj Merkezi',
    shortLabel: 'Mesajlar',
    desc: 'Firma/kullanıcı mesaj havuzu ve gelen iletişim talepleri',
    color: 'sky',
    tabs: ['mesajlar'],
    primaryTab: 'mesajlar'
  },
  {
    id: 'reports_export',
    label: 'Veri Havuzu, Anket & Analitik',
    shortLabel: 'Veri & Rapor',
    desc: 'Excel/CSV veri dışa aktarımı, anketler ve istihdam analitiği',
    color: 'indigo',
    tabs: ['cms_datapool', 'analytics', 'anket'],
    primaryTab: 'cms_datapool'
  }
];

export const DEFAULT_PERMISSIONS_BY_TYPE = {
  '6': ['students_staj', 'alumni', 'companies_protocols', 'jobs_applications', 'content', 'mentorship', 'messages', 'reports_export'],
  '2': ['content', 'messages'],
  '3': ['alumni', 'mentorship', 'messages', 'reports_export'],
  '4': ['companies_protocols', 'jobs_applications', 'messages'],
  '5': ['reports_export']
};

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
    allowedModules: [...DEFAULT_PERMISSIONS_BY_TYPE['6']],
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
    allowedModules: [...DEFAULT_PERMISSIONS_BY_TYPE['2']],
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
    allowedModules: [...DEFAULT_PERMISSIONS_BY_TYPE['3']],
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
          username: acc.username || normalizeStaffUsername('', acc.email),
          allowedModules: Array.isArray(acc.allowedModules)
            ? acc.allowedModules
            : (DEFAULT_PERMISSIONS_BY_TYPE[String(acc.typeId)] || ['content', 'messages'])
        }));
      }
    }
  } catch { /* intentional */ }
  return DEFAULT_STAFF_ACCOUNTS;
}

const VALID_PERM_IDS = new Set(STAFF_PERMISSION_GROUPS.map(g => g.id));

/**
 * Bir personel oturumunun aktif yetki gruplarını (allowedModules) döndürür.
 * Yönetici panelinde yapılan yetki değişiklikleri anında yansır.
 */
export function resolveStaffPermissions(user) {
  if (!user) return [];
  if (user.role === 'admin') return STAFF_PERMISSION_GROUPS.map(g => g.id);

  // 1. Önce yerel depodaki en güncel personel kaydını kontrol et
  try {
    const accounts = loadStaffAccounts();
    const liveAcc = accounts.find(a =>
      (user.staffAccountId && String(a.id) === String(user.staffAccountId)) ||
      (user.id && user.id === `STAFF-${a.id}`) ||
      (user.username && a.username && a.username.toLowerCase() === String(user.username).toLowerCase()) ||
      (user.email && a.email && a.email.toLowerCase() === String(user.email).toLowerCase())
    );
    if (liveAcc && Array.isArray(liveAcc.allowedModules)) {
      return liveAcc.allowedModules.filter(id => VALID_PERM_IDS.has(id));
    }
  } catch { /* intentional */ }

  // 2. Oturum nesnesinde kayıtlı allowedModules varsa onu kullan
  if (Array.isArray(user.allowedModules)) {
    return user.allowedModules.filter(id => VALID_PERM_IDS.has(id));
  }

  // 3. Rol bazlı varsayılan yetki matrisi
  const typeId = String(user.staffTypeId || user.typeId || '5');
  return DEFAULT_PERMISSIONS_BY_TYPE[typeId] || ['reports_export'];
}

/**
 * Personelin AdminDashboard üzerinde erişebileceği tüm CMS tab ID'lerini döndürür.
 */
export function getStaffAllowedTabs(user) {
  const allowed = new Set(['overview']);
  const groups = resolveStaffPermissions(user);
  STAFF_PERMISSION_GROUPS.forEach(group => {
    if (groups.includes(group.id)) {
      group.tabs.forEach(t => allowed.add(t));
    }
  });
  return allowed;
}

/**
 * Belirli bir CMS tabına personelin yetkisi olup olmadığını kontrol eder.
 */
export function canStaffAccessTab(user, tabId) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (tabId === 'overview') return true;
  return getStaffAllowedTabs(user).has(tabId);
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

  const allowedModules = Array.isArray(matched.allowedModules)
    ? matched.allowedModules.filter(id => VALID_PERM_IDS.has(id))
    : (DEFAULT_PERMISSIONS_BY_TYPE[String(matched.typeId)] || ['content', 'messages']);

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
      allowedModules,
      avatar: '/iesu-logo.svg',
      onboardingCompleted: true,
      status: 'Aktif'
    }
  };
}
