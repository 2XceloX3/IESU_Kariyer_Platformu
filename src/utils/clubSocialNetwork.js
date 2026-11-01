/**
 * İstanbul Esenyurt Üniversitesi (İESÜ) — Üniversite Kulüp Sosyal Ağı
 * Saf İş Mantığı Modülü (Pure Logic Module)
 *
 * Bu modül; kulüp başkan/temsilci yetkilendirmesini, takip vs. üyelik durumlarını,
 * içerik görünürlük kurallarını (public, members_only, draft, pending, cancelled),
 * kişiselleştirilmiş sosyal akış sıralamasını ve tüm yüzeylerde (Kulüp Sayfası,
 * Ana Akış, Keşfet, Etkinlik Takvimi) tekil etkinlik senkronizasyonunu yönetir.
 */

/**
 * Kullanıcının belirli bir kulübü yönetme (Kulüp Başkanı / Yetkili Temsilci / Admin)
 * yetkisi olup olmadığını kontrol eder.
 * Bir kulübün başkanı başka bir kulübü yönetemez.
 *
 * @param {Object|null} club
 * @param {Object|null} user
 * @returns {boolean}
 */
export function canManageClub(club, user) {
  if (!club || !user) return false;

  const role = String(user.role || '').toLowerCase();
  if (role === 'admin' || role === 'super_admin' || role === 'dean' || user.isSuperAdmin) {
    return true;
  }

  const userId = user.id != null ? String(user.id) : null;
  const userEmail = user.email ? String(user.email).toLowerCase().trim() : null;
  const userName = user.name ? String(user.name).toLowerCase().trim() : null;

  if (userId && club.presidentId != null && String(club.presidentId) === userId) {
    return true;
  }

  if (club.president && typeof club.president === 'object') {
    if (userId && club.president.id != null && String(club.president.id) === userId) {
      return true;
    }
    if (userEmail && club.president.email && String(club.president.email).toLowerCase().trim() === userEmail) {
      return true;
    }
    if (userName && club.president.name && String(club.president.name).toLowerCase().trim() === userName) {
      return true;
    }
  }

  if (Array.isArray(club.admins) && userId) {
    if (club.admins.some((a) => String(a) === userId)) {
      return true;
    }
  }

  if (Array.isArray(club.authorizedOfficers)) {
    const isOfficer = club.authorizedOfficers.some((o) => {
      if (!o) return false;
      if (userId && o.userId != null && String(o.userId) === userId) return true;
      if (userEmail && o.email && String(o.email).toLowerCase().trim() === userEmail) return true;
      if (userName && o.name && String(o.name).toLowerCase().trim() === userName) return true;
      return false;
    });
    if (isOfficer) return true;
  }

  return false;
}

/**
 * Kullanıcının belirli bir kulüpteki üyelik, başvuru ve takip durumunu hesaplar.
 * Kulübü takip etmek ("Takip Ediliyor") kulüp üyeliği ("Üyesisin") anlamına gelmez.
 *
 * @param {Object|null} club
 * @param {Object|null} user
 * @param {Array<string>} followedClubIds
 * @returns {{
 *   isMember: boolean,
 *   isPending: boolean,
 *   isFollowing: boolean,
 *   isManager: boolean,
 *   membershipStatus: 'member' | 'pending' | 'none',
 *   statusLabel: 'Üyesisin' | 'Başvurun İnceleniyor' | 'Üye Ol',
 *   followLabel: 'Takip Ediliyor' | 'Takip Et'
 * }}
 */
export function getClubMembershipState(club, user, followedClubIds = []) {
  const safeFollowed = Array.isArray(followedClubIds) ? followedClubIds.map(String) : [];
  const clubId = club?.id != null ? String(club.id) : '';
  const isFollowing = Boolean(clubId && safeFollowed.includes(clubId));

  if (!club || !user) {
    return {
      isMember: false,
      isPending: false,
      isFollowing,
      isManager: false,
      membershipStatus: 'none',
      statusLabel: 'Üye Ol',
      followLabel: isFollowing ? 'Takip Ediliyor' : 'Takip Et',
    };
  }

  const isManager = canManageClub(club, user);
  const userId = user.id != null ? String(user.id) : null;
  const userEmail = user.email ? String(user.email).toLowerCase().trim() : null;
  const userName = user.name ? String(user.name).toLowerCase().trim() : null;

  const matchesUser = (entry) => {
    if (!entry) return false;
    if (typeof entry === 'string' || typeof entry === 'number') {
      return userId != null && String(entry) === userId;
    }
    if (userId && (String(entry.userId ?? '') === userId || String(entry.id ?? '') === userId)) {
      return true;
    }
    if (userEmail && entry.email && String(entry.email).toLowerCase().trim() === userEmail) {
      return true;
    }
    if (userName && (entry.name || entry.userName)) {
      const entryName = String(entry.name || entry.userName).toLowerCase().trim();
      if (entryName === userName) return true;
    }
    return false;
  };

  const inMembers = Array.isArray(club.members) && club.members.some((m) => {
    if (!m) return false;
    if (m.status && String(m.status).toLowerCase() === 'pending') return false;
    if (m.status && String(m.status).toLowerCase() === 'rejected') return false;
    return matchesUser(m);
  });

  const inBoard = Array.isArray(club.boardMembers) && club.boardMembers.some(matchesUser);
  const isMember = Boolean(isManager || inMembers || inBoard);

  const inPendingApps = !isMember && (
    (Array.isArray(club.memberApplications) &&
      club.memberApplications.some((app) => app && (!app.status || app.status === 'pending' || app.status === 'Beklemede') && matchesUser(app))) ||
    (Array.isArray(club.joinRequests) &&
      club.joinRequests.some((req) => req && (!req.status || req.status === 'pending' || req.status === 'Beklemede') && matchesUser(req)))
  );

  const membershipStatus = isMember ? 'member' : inPendingApps ? 'pending' : 'none';
  const statusLabel = isMember
    ? 'Üyesisin'
    : inPendingApps
    ? 'Başvurun İnceleniyor'
    : 'Üye Ol';

  return {
    isMember,
    isPending: Boolean(inPendingApps),
    isFollowing,
    isManager,
    membershipStatus,
    statusLabel,
    followLabel: isFollowing ? 'Takip Ediliyor' : 'Takip Et',
  };
}

/**
 * Bir kulüp içeriğinin (gönderi, duyuru veya etkinlik) belirli bir kullanıcıya
 * genel akışlarda veya kulüp sayfasında gösterilip gösterilemeyeceğini denetler.
 *
 * Kurallar:
 * - 'draft' (taslak) veya 'pending' (onay bekleyen) veya 'rejected' içerikler
 *   asla genel akışa sızmaz; yalnızca kulüp yöneticisi yönetim görünümünde görebilir.
 * - 'cancelled' (iptal edilen) içerikler genel akıştan kaldırılır.
 * - 'members_only' (sadece üyelere özel) içerikler yalnızca kulübün onaylı üyelerine
 *   ve yöneticilerine gösterilir; sadece takip eden veya üye olmayan kullanıcılara gösterilmez.
 *
 * @param {Object|null} item
 * @param {Object|null} club
 * @param {Object|null} user
 * @param {{ surface?: 'public_feed' | 'discover' | 'club_page' | 'admin_panel', followedClubIds?: Array<string> }} options
 * @returns {boolean}
 */
export function canViewClubContent(item, club, user, options = {}) {
  if (!item) return false;
  const surface = options.surface || 'public_feed';
  const status = String(item.status || 'published').toLowerCase().trim();
  const approvalStatus = String(item.approvalStatus || 'approved').toLowerCase().trim();
  const visibility = String(item.visibility || 'public').toLowerCase().trim();

  const isManager = club ? canManageClub(club, user) : false;

  // Admin panelinde kulüp yöneticisi kendi kulübünün tüm içeriklerini görebilir
  if (surface === 'admin_panel') {
    return isManager;
  }

  // İptal edilmiş veya silinmiş içerikler genel yüzeylerde gösterilmez
  if (status === 'cancelled' || status === 'iptal' || status === 'deleted' || status === 'rejected') {
    return false;
  }

  // Taslak veya onay bekleyen içerikler genel akış ve keşfette asla gösterilmez
  if (
    status === 'draft' ||
    status === 'taslak' ||
    status === 'pending' ||
    status === 'beklemede' ||
    status === 'incelemede' ||
    approvalStatus === 'pending' ||
    approvalStatus === 'rejected' ||
    approvalStatus === 'draft'
  ) {
    return false;
  }

  // Üyelere özel içerik kontrolü
  if (visibility === 'members_only' || visibility === 'members' || item.membersOnly === true) {
    // Keşfet (discover) her zaman herkese açık içerikleri vitrine çıkarır
    if (surface === 'discover') return false;
    if (!club || !user) return false;
    const { isMember } = getClubMembershipState(club, user, options.followedClubIds || []);
    return isMember;
  }

  return true;
}

/**
 * Üyelik başvurusu oluşturma, onaylama ve reddetme işlemlerini kulüp nesnesi üzerinde
 * yetki kontrollü olarak yürütür.
 *
 * @param {{
 *   club: Object,
 *   actor: Object,
 *   action: 'apply' | 'approve' | 'reject',
 *   applicationPayload?: Object,
 *   applicationId?: string
 * }} params
 * @returns {{ ok: boolean, error?: string, club: Object }}
 */
export function processClubMembershipAction({ club, actor, action, applicationPayload, applicationId }) {
  if (!club) return { ok: false, error: 'Kulüp bulunamadı.', club };

  if (action === 'apply') {
    if (!actor || !actor.id) {
      return { ok: false, error: 'Başvuru için oturum açmış öğrenci gereklidir.', club };
    }
    const currentState = getClubMembershipState(club, actor, []);
    if (currentState.isMember) {
      return { ok: false, error: 'Zaten bu kulübün üyesisiniz.', club };
    }
    if (currentState.isPending) {
      return { ok: false, error: 'Bu kulüp için zaten incelenmekte olan bir başvurunuz var.', club };
    }

    const newApp = {
      id: applicationPayload?.id || `APP-MEM-${Date.now()}`,
      userId: actor.id,
      name: applicationPayload?.name || actor.name,
      userName: applicationPayload?.name || actor.name,
      email: applicationPayload?.email || actor.email || '',
      studentNo: applicationPayload?.studentNo || actor.studentNo || '',
      department: applicationPayload?.department || actor.department || actor.dept || '',
      grade: applicationPayload?.grade || actor.grade || '',
      phone: applicationPayload?.phone || actor.phone || '',
      motivation: applicationPayload?.reason || applicationPayload?.motivation || 'Kulüp çalışmalarına aktif katkı sağlamak istiyorum.',
      status: 'pending',
      date: applicationPayload?.date || new Date().toISOString(),
    };

    const existingApps = Array.isArray(club.memberApplications) ? club.memberApplications : [];
    return {
      ok: true,
      club: {
        ...club,
        memberApplications: [newApp, ...existingApps],
      },
    };
  }

  // Onay ve Red işlemleri yalnızca o kulübün yetkili yöneticisi tarafından yapılabilir
  if (!canManageClub(club, actor)) {
    return { ok: false, error: 'Bu kulübün üyelik başvurularını yönetme yetkiniz yok.', club };
  }

  const existingApps = Array.isArray(club.memberApplications) ? club.memberApplications : [];
  const existingRequests = Array.isArray(club.joinRequests) ? club.joinRequests : [];
  const targetApp =
    existingApps.find((a) => String(a.id) === String(applicationId)) ||
    existingRequests.find((r) => String(r.id) === String(applicationId));

  if (!targetApp) {
    return { ok: false, error: 'Başvuru kaydı bulunamadı.', club };
  }

  if (action === 'approve') {
    const newMember = {
      id: `MEM-${targetApp.userId || Date.now()}`,
      userId: targetApp.userId || targetApp.id,
      name: targetApp.name || targetApp.userName,
      email: targetApp.email || '',
      department: targetApp.department || '',
      studentNo: targetApp.studentNo || '',
      role: 'Aktif Üye',
      status: 'active',
      joinedAt: new Date().toISOString(),
    };

    const currentMembers = Array.isArray(club.members) ? club.members : [];
    const alreadyExists = currentMembers.some(
      (m) =>
        (newMember.userId && String(m.userId) === String(newMember.userId)) ||
        (newMember.email && m.email && String(m.email).toLowerCase() === String(newMember.email).toLowerCase())
    );

    const updatedMembers = alreadyExists ? currentMembers : [...currentMembers, newMember];
    const updatedApps = existingApps.filter((a) => String(a.id) !== String(applicationId));
    const updatedReqs = existingRequests.filter((r) => String(r.id) !== String(applicationId));

    return {
      ok: true,
      club: {
        ...club,
        members: updatedMembers,
        memberCount: Math.max((Number(club.memberCount) || currentMembers.length) + (alreadyExists ? 0 : 1), updatedMembers.length),
        memberApplications: updatedApps,
        joinRequests: updatedReqs,
      },
    };
  }

  if (action === 'reject') {
    const updatedApps = existingApps.filter((a) => String(a.id) !== String(applicationId));
    const updatedReqs = existingRequests.filter((r) => String(r.id) !== String(applicationId));
    return {
      ok: true,
      club: {
        ...club,
        memberApplications: updatedApps,
        joinRequests: updatedReqs,
      },
    };
  }

  return { ok: false, error: 'Geçersiz işlem.', club };
}

/**
 * Kulüp etkinliklerini tekil doğruluk kaynağı (Single Authoritative Event Record)
 * ilkesine göre hem ilgili kulübün `events` listesinde hem de platformun küresel
 * `events` listesinde senkronize eder.
 *
 * - 'create' veya 'update':
 *   Eğer etkinlik 'published' / 'approved' / 'Yaklaşan' durumundaysa küresel etkinlik
 *   listesine eklenir veya güncellenir.
 *   Eğer etkinlik 'draft' veya 'pending' (onay bekliyor) durumundaysa kulüp kaydında
 *   tutulur ancak küresel/genel akıştan gizlenir.
 * - 'cancel' veya 'delete':
 *   Etkinliği kulüp listesinde iptal/silinmiş olarak günceller ve küresel genel
 *   listeden kaldırır (mükerrer veya bayat etkinlik kartı kalmaz).
 *
 * @param {{
 *   clubs: Array<Object>,
 *   globalEvents: Array<Object>,
 *   clubId: string,
 *   actor: Object,
 *   action: 'create' | 'update' | 'cancel' | 'delete',
 *   eventPayload: Object
 * }} params
 * @returns {{ ok: boolean, error?: string, clubs: Array<Object>, globalEvents: Array<Object>, eventRecord?: Object }}
 */
export function syncClubEventAcrossSurfaces({
  clubs = [],
  globalEvents = [],
  clubId,
  actor,
  action,
  eventPayload = {},
}) {
  const targetClub = (clubs || []).find((c) => String(c.id) === String(clubId));
  if (!targetClub) {
    return { ok: false, error: 'Kulüp bulunamadı.', clubs, globalEvents };
  }

  if (!canManageClub(targetClub, actor)) {
    return {
      ok: false,
      error: 'Yalnızca kulüp başkanı veya yetkili temsilciler bu kulüp için etkinlik yönetebilir.',
      clubs,
      globalEvents,
    };
  }

  const eventId = String(eventPayload.id || `CLB-EVT-${Date.now()}`);
  const existingClubEvents = Array.isArray(targetClub.events) ? targetClub.events : [];
  const prevClubEvent = existingClubEvents.find((e) => String(e.id) === eventId);

  if (action === 'delete' || action === 'cancel') {
    const updatedClubEvents =
      action === 'delete'
        ? existingClubEvents.filter((e) => String(e.id) !== eventId)
        : existingClubEvents.map((e) =>
            String(e.id) === eventId
              ? { ...e, status: 'cancelled', approvalStatus: 'cancelled', cancelledAt: new Date().toISOString() }
              : e
          );

    const updatedClubs = clubs.map((c) =>
      String(c.id) === String(clubId) ? { ...c, events: updatedClubEvents } : c
    );
    const updatedGlobalEvents = (globalEvents || []).filter((e) => String(e.id) !== eventId);

    return {
      ok: true,
      clubs: updatedClubs,
      globalEvents: updatedGlobalEvents,
      eventRecord: updatedClubEvents.find((e) => String(e.id) === eventId) || null,
    };
  }

  const normalizedStatus = eventPayload.status || prevClubEvent?.status || 'Yaklaşan';
  const normalizedApproval = eventPayload.approvalStatus || prevClubEvent?.approvalStatus || 'approved';
  const normalizedVisibility = eventPayload.visibility || prevClubEvent?.visibility || 'public';

  const authoritativeEvent = {
    ...(prevClubEvent || {}),
    ...eventPayload,
    id: eventId,
    clubId: targetClub.id,
    clubName: targetClub.name,
    clubLogo: targetClub.logo || '',
    organizer: targetClub.name,
    title: String(eventPayload.title ?? prevClubEvent?.title ?? '').trim(),
    description: String(eventPayload.description ?? prevClubEvent?.description ?? '').trim(),
    date: eventPayload.date ?? prevClubEvent?.date ?? 'Yakında',
    time: eventPayload.time ?? prevClubEvent?.time ?? '14:00',
    location: eventPayload.location ?? prevClubEvent?.location ?? 'Merkez Kampüs',
    category: eventPayload.category ?? prevClubEvent?.category ?? targetClub.category ?? 'Kulüp Etkinliği',
    quota: Number(eventPayload.quota ?? prevClubEvent?.quota ?? 100),
    registeredCount: Number(eventPayload.registeredCount ?? prevClubEvent?.registeredCount ?? 0),
    status: normalizedStatus,
    approvalStatus: normalizedApproval,
    visibility: normalizedVisibility,
    updatedAt: new Date().toISOString(),
  };

  if (!authoritativeEvent.title) {
    return { ok: false, error: 'Etkinlik başlığı zorunludur.', clubs, globalEvents };
  }

  const existsInClub = existingClubEvents.some((e) => String(e.id) === eventId);
  const updatedClubEvents = existsInClub
    ? existingClubEvents.map((e) => (String(e.id) === eventId ? authoritativeEvent : e))
    : [authoritativeEvent, ...existingClubEvents];

  const updatedClubs = clubs.map((c) =>
    String(c.id) === String(clubId) ? { ...c, events: updatedClubEvents } : c
  );

  // Etkinlik kamuya açık ve onaylanmış/yayınlanmış ise globalEvents listesinde senkronize edilir;
  // taslak, onay bekleyen veya iptal edilmiş ise globalEvents listesinden çıkarılır.
  const isPubliclyVisible = canViewClubContent(authoritativeEvent, targetClub, null, { surface: 'public_feed' });
  const withoutCurrentGlobal = (globalEvents || []).filter((e) => String(e.id) !== eventId);

  const updatedGlobalEvents = isPubliclyVisible
    ? [authoritativeEvent, ...withoutCurrentGlobal]
    : withoutCurrentGlobal;

  return {
    ok: true,
    clubs: updatedClubs,
    globalEvents: updatedGlobalEvents,
    eventRecord: authoritativeEvent,
  };
}

/**
 * Aynı kulübün ardışık gönderilerinin akışı domine etmesini önlemek için
 * aynı öncelik katmanındaki öğeleri kulüp bazında dengeli şekilde harmanlar (interleave).
 *
 * @param {Array<Object>} items
 * @returns {Array<Object>}
 */
function interleaveByClub(items) {
  if (!Array.isArray(items) || items.length <= 2) return items || [];
  if (items.length > 200) return items; // Büyük veri setlerinde O(N^2) splice maliyetini önle

  const result = [];
  const remaining = [...items];

  while (remaining.length > 0) {
    const lastClubId = result.length > 0 ? result[result.length - 1]?.clubId : null;
    let pickIndex = 0;

    if (lastClubId) {
      const diffIdx = remaining.findIndex((item) => !item.clubId || item.clubId !== lastClubId);
      if (diffIdx !== -1) {
        pickIndex = diffIdx;
      }
    }

    result.push(remaining.splice(pickIndex, 1)[0]);
  }

  return result;
}

function isHiddenStatus(item) {
  if (!item || typeof item !== 'object') return true;
  if (item.isOptimistic) return false;
  const s = String(item.status || 'published').toLowerCase().trim();
  const a = String(item.approvalStatus || 'approved').toLowerCase().trim();
  return (
    s === 'draft' ||
    s === 'taslak' ||
    s === 'pending' ||
    s === 'beklemede' ||
    s === 'incelemede' ||
    s === 'cancelled' ||
    s === 'iptal' ||
    s === 'rejected' ||
    s === 'reddedildi' ||
    s === 'pasif' ||
    s === 'deleted' ||
    a === 'draft' ||
    a === 'pending' ||
    a === 'rejected'
  );
}

const DEFAULT_EVENT_POSTER_IMAGES = [
  'https://www.esenyurt.edu.tr/uploads/2026/10/nz19buzmdccs4-mimari-kultur-ve-sanat-kulubunden-teknik-gezi-novawood-showroom-ziyareti.jpg',
  'https://www.esenyurt.edu.tr/uploads/2026/10/4fnkhf1c6hdhk-29-ekim-cumhuriyet-bayrami-kutlama-programi.jpg',
  'https://www.esenyurt.edu.tr/uploads/2026/10/a0ne1dli7schi-gokyuzunun-gelecegi-ucaklarda-robotiklesme-akilli-teknolojiler-ve-pilotajin-donusumu.png',
  'https://www.esenyurt.edu.tr/uploads/2026/10/jjx116fpj1fw4-fikirden-projeye-tubitak-2209-a-ve-2209-b-egitimi.png',
  'https://www.esenyurt.edu.tr/uploads/2026/07/tjb9hhos5ydrt-gelecegin-dunyasini-sekillendiren-teknolojiler-ve-dijital-donusum-bilim-kafe’de-konusuluyor.jfif',
  'https://www.esenyurt.edu.tr/uploads/2026/07/oh0lm0qvjbwgc-iii-yonetim-bilimleri-sempozyumu.jfif',
  'https://www.esenyurt.edu.tr/uploads/2026/07/z5st7op8uiqwp-gelecegi-sekillendiren-teknolojiyle-tanisin.jpg',
  'https://www.esenyurt.edu.tr/uploads/2026/06/ivqfcl183tzr1-bilimin-buyulu-dunyasina-yolculuk-kapanis-toplantisi.jpg',
  'https://www.esenyurt.edu.tr/uploads/2026/06/qro3fnllv74pa-dijitallesen-dunyada-surdurulebilirligin-yeni-boyutu-dijital-atik-yonetimi.jpg',
  'https://www.esenyurt.edu.tr/uploads/2026/06/cm1fe1okvam3t-atik-malzemeler-muhendislik-ve-estetikle-bulusuyor;-saglam-kopruler-gelecege-uzaniyor.jpg',
  'https://www.esenyurt.edu.tr/uploads/2026/05/8byod8k1jc947-havaciligin-frekansi-yukseliyor.jpg',
  'https://www.esenyurt.edu.tr/uploads/2026/05/p0zg8mdsx3me7-psikoloji-istasyonu-istanbul-etkinligine-davetlisiniz.jpg',
  'https://www.esenyurt.edu.tr/uploads/2026/05/mmfe36bkaqbg1-egitimin-gelecegini-yeniden-sekillendiren-iki-buyuk-guc-bir-arada-yapay-zekâ-ve-sosyal-ogrenme.jfif',
  'https://www.esenyurt.edu.tr/uploads/2026/05/n7aq87033zh6y-siber-dunyanin-kapilarini-araliyoruz.jpg',
  'https://www.esenyurt.edu.tr/uploads/2026/04/vzf9ndd1pvpb8-gencfest-2026-basliyor.jfif',
  'https://www.esenyurt.edu.tr/uploads/2026/08/z3eienjfa37b8-turkiye-cografi-istihbarat-sempozyumunu-duyurmaktan-gurur-duyuyoruz.jpg'
];

function pickEventPoster(item, fallbackIdx = 0) {
  const explicit = item?.image || item?.imageUrl;
  if (explicit && typeof explicit === 'string' && explicit.trim().length > 4) {
    return explicit.trim();
  }
  const seedStr = String(item?.id || item?.title || fallbackIdx);
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  return DEFAULT_EVENT_POSTER_IMAGES[hash % DEFAULT_EVENT_POSTER_IMAGES.length];
}

function normalizeFeedTitleKey(str = '') {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/gi, ' ve ')
    .toLocaleLowerCase('tr-TR')
    .replace(/\u0307/g, '')
    .replace(/&/g, ' ve ')
    .replace(/öğrencilerimizin/g, 'öğrencilerin')
    .replace(/['’"“”.,!?:;()[\]\-_/+•|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildPersonalizedClubFeed(rawParams = {}) {
  const params = rawParams && typeof rawParams === 'object' && !Array.isArray(rawParams) ? rawParams : {};
  const safePosts = Array.isArray(params.posts) ? params.posts : [];
  const safeClubs = Array.isArray(params.clubs) ? params.clubs : [];
  const safeEvents = Array.isArray(params.events) ? params.events : [];
  const safeAnnouncements = Array.isArray(params.announcements) ? params.announcements : [];
  const safeNews = Array.isArray(params.news) ? params.news : [];
  const safeJobs = Array.isArray(params.jobs) ? params.jobs : [];
  const user = params.user && typeof params.user === 'object' ? params.user : null;
  const followedClubIds = Array.isArray(params.followedClubIds) ? params.followedClubIds : [];
  const followedUserIds = Array.isArray(params.followedUserIds) ? params.followedUserIds : [];

  const clubMap = new Map();
  safeClubs.forEach((club) => {
    if (club && typeof club === 'object' && club.id != null) {
      clubMap.set(String(club.id), club);
    }
  });

  const seenIds = new Set();
  const seenTitles = new Set();
  const tier1MemberPosts = [];
  const tier2FollowedPosts = [];
  const tier3RelevantEvents = [];
  const tier4DiscoveryClubContent = [];
  const tier5OtherContent = [];

  const registerUnique = (idKey, titleOrContent = '') => {
    const normalizedId = String(idKey || '');
    if (!normalizedId || seenIds.has(normalizedId)) return false;
    const normTitle = normalizeFeedTitleKey(titleOrContent);
    if (normTitle && normTitle.length >= 8 && seenTitles.has(normTitle)) {
      return false;
    }
    seenIds.add(normalizedId);
    if (normTitle && normTitle.length >= 8) {
      seenTitles.add(normTitle);
    }
    return true;
  };

  // 1. Kulüplerin içindeki gönderileri, duyuruları ve etkinlikleri topla
  safeClubs.forEach((club) => {
    if (!club || typeof club !== 'object' || club.id == null) return;
    const clubId = String(club.id);
    const membership = getClubMembershipState(club, user, followedClubIds);

    // Kulüp gönderileri (club.posts)
    if (Array.isArray(club.posts)) {
      club.posts.forEach((post, idx) => {
        if (!post || typeof post !== 'object') return;
        if (!canViewClubContent(post, club, user, { surface: 'public_feed', followedClubIds })) {
          return;
        }
        const uniqueKey = `club-post-${post.id || `${clubId}-${idx}`}`;
        if (!registerUnique(uniqueKey, post.title || post.content || post.caption || '')) return;

        const feedPost = {
          ...post,
          id: post.id || uniqueKey,
          feedType: 'club_post',
          type: post.type || 'Kulüp Paylaşımı',
          clubId,
          clubName: club.name,
          clubLogo: club.logo,
          clubCategory: club.category,
          author: post.author?.name ? post.author.name : club.name,
          authorAvatar: post.author?.logo || club.logo,
          role: `${club.name} • Resmî Kulüp Paylaşımı`,
          content: post.content || post.caption || post.description || '',
          title: post.title || '',
          image: post.image || post.imageUrl || (Array.isArray(post.images) ? post.images[0] : null) || null,
          time: post.time || post.createdAt || 'Yeni',
          likes: Number(post.likes || 0),
          comments: Array.isArray(post.comments) ? post.comments.length : Number(post.comments || 0),
          membershipState: membership,
          priorityReason: membership.isMember
            ? 'Üyesi Olduğun Kulüp'
            : membership.isFollowing
            ? 'Takip Ettiğin Kulüp'
            : 'Kampüs Kulüp Keşfi',
        };

        if (membership.isMember) {
          tier1MemberPosts.push({ ...feedPost, priorityTier: 1 });
        } else if (membership.isFollowing) {
          tier2FollowedPosts.push({ ...feedPost, priorityTier: 2 });
        } else {
          tier4DiscoveryClubContent.push({ ...feedPost, priorityTier: 4 });
        }
      });
    }

    // Kulüp duyuruları (club.announcements)
    if (Array.isArray(club.announcements)) {
      club.announcements.forEach((ann, idx) => {
        if (!ann || typeof ann !== 'object') return;
        if (!canViewClubContent(ann, club, user, { surface: 'public_feed', followedClubIds })) {
          return;
        }
        const uniqueKey = `club-ann-${ann.id || `${clubId}-${idx}`}`;
        if (!registerUnique(uniqueKey, ann.title || ann.content || '')) return;

        const feedAnn = {
          ...ann,
          id: ann.id || uniqueKey,
          feedType: 'club_announcement',
          type: 'Kulüp Duyurusu',
          clubId,
          clubName: club.name,
          clubLogo: club.logo,
          clubCategory: club.category,
          author: club.name,
          authorAvatar: club.logo,
          role: `${club.name} • Resmî Kulüp Duyurusu`,
          title: ann.title || 'Kulüp Duyurusu',
          content: ann.content || ann.description || '',
          image: ann.image || ann.imageUrl || null,
          time: ann.date || ann.time || 'Yeni',
          likes: Number(ann.likes || 5),
          comments: Number(ann.comments || 0),
          membershipState: membership,
          priorityReason: membership.isMember
            ? 'Üyesi Olduğun Kulüp Duyurusu'
            : membership.isFollowing
            ? 'Takip Ettiğin Kulüp Duyurusu'
            : 'Kulüp Duyurusu',
        };

        if (membership.isMember) {
          tier1MemberPosts.push({ ...feedAnn, priorityTier: 1 });
        } else if (membership.isFollowing) {
          tier2FollowedPosts.push({ ...feedAnn, priorityTier: 2 });
        } else {
          tier4DiscoveryClubContent.push({ ...feedAnn, priorityTier: 4 });
        }
      });
    }

    // Kulüp etkinlikleri (club.events)
    if (Array.isArray(club.events)) {
      club.events.forEach((evt, idx) => {
        if (!evt || typeof evt !== 'object') return;
        if (!canViewClubContent(evt, club, user, { surface: 'public_feed', followedClubIds })) {
          return;
        }
        if (String(evt.status || '').toLowerCase() === 'tamamlandı' || String(evt.status || '').toLowerCase() === 'completed') {
          return;
        }
        const uniqueKey = `club-evt-${evt.id || `${clubId}-${idx}`}`;
        if (!registerUnique(uniqueKey, evt.title || '')) return;

        const posterImg = pickEventPoster(evt, idx);
        const feedEvt = {
          ...evt,
          id: evt.id || uniqueKey,
          feedType: 'club_event',
          type: 'Kulüp Etkinliği',
          clubId,
          clubName: club.name,
          clubLogo: club.logo,
          clubCategory: club.category,
          authorId: clubId,
          author: club.name,
          authorAvatar: club.logo,
          role: `${club.name} • Kampüs Etkinliği`,
          title: evt.title,
          eventPost: true,
          eventTitle: evt.title,
          eventDate: evt.date ? (evt.time ? `${evt.date} • ${evt.time}` : evt.date) : 'Yaklaşan Etkinlik',
          eventLocation: evt.location || 'Merkez Kampüs',
          eventDesc: evt.description || '',
          eventData: evt,
          content: evt.description || `${evt.location || 'Merkez Kampüs'} • ${evt.date || ''} ${evt.time || ''}`,
          image: posterImg,
          imageUrl: posterImg,
          time: evt.date || 'Yaklaşan Etkinlik',
          likes: Number(evt.registeredCount || evt.likes || 12),
          comments: 0,
          membershipState: membership,
          priorityReason:
            membership.isMember || membership.isFollowing
              ? 'Üye/Takip Edilen Kulüp Etkinliği'
              : 'Yaklaşan Kulüp Etkinliği',
        };

        if (membership.isMember || membership.isFollowing) {
          tier3RelevantEvents.push({ ...feedEvt, priorityTier: 3 });
        } else {
          tier4DiscoveryClubContent.push({ ...feedEvt, priorityTier: 4 });
        }
      });
    }
  });

  // 2. Genel posts dizisindeki kulüp veya diğer kullanıcı gönderilerini sınıflandır
  safePosts.forEach((post, idx) => {
    if (!post || typeof post !== 'object' || Array.isArray(post)) return;
    const postClub = post.clubId ? clubMap.get(String(post.clubId)) : null;

    if (postClub) {
      if (!canViewClubContent(post, postClub, user, { surface: 'public_feed', followedClubIds })) {
        return;
      }
      const uniqueKey = `club-post-${post.id || idx}`;
      if (!registerUnique(uniqueKey, post.title || post.content || '')) return;

      const membership = getClubMembershipState(postClub, user, followedClubIds);
      const enriched = {
        ...post,
        id: post.id ?? `club-post-${idx}`,
        feedType: 'club_post',
        clubId: String(postClub.id),
        clubName: postClub.name,
        clubLogo: postClub.logo,
        clubCategory: postClub.category,
        authorId: String(postClub.id),
        author: post.author || postClub.name,
        authorAvatar: post.authorAvatar || postClub.logo,
        image: post.image || post.imageUrl || null,
        membershipState: membership,
        priorityReason: membership.isMember
          ? 'Üyesi Olduğun Kulüp'
          : membership.isFollowing
          ? 'Takip Ettiğin Kulüp'
          : 'Kampüs Kulüp Keşfi',
      };

      if (membership.isMember) {
        tier1MemberPosts.push({ ...enriched, priorityTier: 1 });
      } else if (membership.isFollowing) {
        tier2FollowedPosts.push({ ...enriched, priorityTier: 2 });
      } else {
        tier4DiscoveryClubContent.push({ ...enriched, priorityTier: 4 });
      }
      return;
    }

    if (isHiddenStatus(post)) return;

    const uniqueKey = `post-${post.id ?? idx}`;
    if (!registerUnique(uniqueKey, post.title || post.content || '')) return;

    const resolvedAuthorId = post.authorId || post.author?.id || post.userId || null;
    tier5OtherContent.push({
      ...post,
      id: post.id ?? uniqueKey,
      authorId: resolvedAuthorId,
      feedType: post.feedType || 'post',
      image: post.image || post.imageUrl || null,
      priorityTier: 5,
      priorityReason:
        followedUserIds.length > 0 && resolvedAuthorId && followedUserIds.includes(resolvedAuthorId)
          ? 'Takip Ettiğin Kişi'
          : 'Kampüs Akışı',
    });
  });

  // 3. Genel events dizisindeki kulüp veya üniversite etkinliklerini sınıflandır
  safeEvents.forEach((evt, idx) => {
    if (!evt || typeof evt !== 'object' || Array.isArray(evt)) return;
    const evtClub = evt.clubId ? clubMap.get(String(evt.clubId)) : null;
    if (evtClub) {
      if (!canViewClubContent(evt, evtClub, user, { surface: 'public_feed', followedClubIds })) {
        return;
      }
      const uniqueKey = `club-evt-${evt.id ?? idx}`;
      if (!registerUnique(uniqueKey, evt.title || '')) return;
      const membership = getClubMembershipState(evtClub, user, followedClubIds);
      const posterImg = pickEventPoster(evt, idx);
      const enrichedEvt = {
        ...evt,
        id: evt.id ?? uniqueKey,
        feedType: 'club_event',
        clubId: String(evtClub.id),
        clubName: evtClub.name,
        clubLogo: evtClub.logo,
        authorId: String(evtClub.id),
        author: evtClub.name,
        authorAvatar: evtClub.logo,
        title: evt.title,
        eventPost: true,
        eventTitle: evt.title,
        eventDate: evt.date ? (evt.time ? `${evt.date} • ${evt.time}` : evt.date) : 'Yaklaşan Etkinlik',
        eventLocation: evt.location || 'Merkez Kampüs',
        eventDesc: evt.description || evt.content || '',
        eventData: evt,
        content: evt.description || evt.content || evt.title || '',
        image: posterImg,
        imageUrl: posterImg,
        membershipState: membership,
      };
      if (membership.isMember || membership.isFollowing) {
        tier3RelevantEvents.push({ ...enrichedEvt, priorityTier: 3 });
      } else {
        tier4DiscoveryClubContent.push({ ...enrichedEvt, priorityTier: 4 });
      }
      return;
    }

    if (isHiddenStatus(evt)) return;
    const uniqueKey = `evt-${evt.id ?? idx}`;
    if (!registerUnique(uniqueKey, evt.title || '')) return;

    const posterImg = pickEventPoster(evt, idx);
    tier5OtherContent.push({
      ...evt,
      id: evt.id ?? uniqueKey,
      feedType: evt.feedType || 'event',
      authorId: evt.authorId || 'admin_1513',
      author: evt.author || evt.organizer || 'Kariyer Geliştirme Koordinatörlüğü',
      authorAvatar: evt.authorAvatar || '/iesu-logo.svg',
      role: evt.role || 'Üniversite Etkinliği',
      time: evt.date || 'Yaklaşan Etkinlik',
      title: evt.title,
      eventPost: true,
      isGeneralEvent: true,
      eventTitle: evt.title,
      eventDate: evt.date ? (evt.time ? `${evt.date} • ${evt.time}` : evt.date) : 'Yaklaşan Etkinlik',
      eventLocation: evt.location || 'Merkez Kampüs',
      eventDesc: evt.description || evt.content || '',
      eventData: evt,
      content: evt.content || evt.description || evt.title || '',
      image: posterImg,
      imageUrl: posterImg,
      priorityTier: 5,
    });
  });

  // 4. Duyurular, Haberler ve İlanlar (Tier 5)
  safeAnnouncements.forEach((ann, idx) => {
    if (!ann || typeof ann !== 'object' || Array.isArray(ann)) return;
    if (isHiddenStatus(ann)) return;
    const uniqueKey = `ann-${ann.id ?? idx}`;
    if (!registerUnique(uniqueKey, ann.title || '')) return;
    tier5OtherContent.push({
      ...ann,
      id: ann.id ?? uniqueKey,
      feedType: 'announcement',
      authorId: ann.authorId || 'admin_1513',
      author: ann.author || 'Kariyer Geliştirme Koordinatörlüğü',
      authorAvatar: ann.authorAvatar || '/iesu-logo.svg',
      role: 'Resmî Duyuru',
      time: ann.date || 'Güncel Duyuru',
      title: ann.title,
      content: ann.description || ann.content || ann.summary || ann.title || '',
      image: ann.image || ann.imageUrl || null,
      priorityTier: 5,
    });
  });

  safeNews.forEach((n, idx) => {
    if (!n || typeof n !== 'object' || Array.isArray(n)) return;
    if (isHiddenStatus(n)) return;
    const uniqueKey = `news-${n.id ?? idx}`;
    if (!registerUnique(uniqueKey, n.title || '')) return;
    tier5OtherContent.push({
      ...n,
      id: n.id ?? uniqueKey,
      feedType: 'news',
      authorId: n.authorId || 'admin_1513',
      author: n.author || 'İESÜ Haber Merkezi',
      authorAvatar: n.authorAvatar || '/iesu-logo.svg',
      role: n.category || 'Kampüs Haberi',
      time: n.date || 'Güncel Haber',
      title: n.title,
      content: n.summary || n.content || n.description || n.title || '',
      image: n.image || n.imageUrl || null,
      priorityTier: 5,
    });
  });

  safeJobs.slice(0, 20).forEach((job, idx) => {
    if (!job || typeof job !== 'object' || Array.isArray(job)) return;
    if (isHiddenStatus(job)) return;
    const uniqueKey = `job-${job.id ?? idx}`;
    if (!registerUnique(uniqueKey, `${job.title || ''} ${job.company || ''}`)) return;
    const companyLabel = job.company || job.companyName || 'İESÜ Kariyer Geliştirme Koordinatörlüğü';
    const resolvedCompanyId = job.companyId || job.authorId || (companyLabel.includes('Kariyer Geliştirme') ? 'admin_1513' : companyLabel);
    tier5OtherContent.push({
      ...job,
      id: job.id ?? uniqueKey,
      feedType: 'job',
      isJob: true,
      companyName: companyLabel,
      authorId: resolvedCompanyId,
      author: companyLabel,
      authorAvatar: job.logo || job.authorAvatar || (companyLabel.includes('Kariyer Geliştirme') ? '/iesu-logo.svg' : `https://ui-avatars.com/api/?name=${encodeURIComponent(companyLabel)}&background=0A2342&color=fff`),
      role: `${job.type || 'Kariyer & Staj Fırsatı'} • ${job.location || 'İstanbul'}`,
      time: job.deadline ? `Son Başvuru: ${job.deadline}` : 'Başvuruya Açık',
      title: job.title,
      jobData: {
        id: job.id ?? uniqueKey,
        title: job.title || 'İş & Staj İlanı',
        company: companyLabel,
        companyId: resolvedCompanyId,
        location: job.location || 'İstanbul / Türkiye Geneli',
        type: job.type || 'İŞ / STAJ İLANI',
      },
      content: job.description || `${job.title || 'İlan'} pozisyonu için başvurular devam ediyor.`,
      image: job.image || job.imageUrl || null,
      priorityTier: 5,
    });
  });

  return [
    ...interleaveByClub(tier1MemberPosts),
    ...interleaveByClub(tier2FollowedPosts),
    ...interleaveByClub(tier3RelevantEvents),
    ...interleaveByClub(tier4DiscoveryClubContent),
    ...tier5OtherContent,
  ];
}
