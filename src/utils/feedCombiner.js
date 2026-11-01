/**
 * feedCombiner.js
 * Bütünleştirilmiş Sosyal & Kurumsal Akış Motoru
 *
 * Hem nesne tabanlı ({ posts, clubs, events, ... }) hem de konumsal
 * (combineFeedItems(posts, events, news, announcements, jobs, generalEvents, careerOpportunities))
 * çağrıları destekler. Null, undefined ve ilkel (primitive) değerlere karşı tam korumalıdır.
 */

import { buildPersonalizedClubFeed, getClubMembershipState } from './clubSocialNetwork.js';

function isOptionsObject(arg, argCount) {
  if (argCount !== 1 || !arg || typeof arg !== 'object' || Array.isArray(arg)) {
    return false;
  }
  return (
    'posts' in arg ||
    'events' in arg ||
    'news' in arg ||
    'announcements' in arg ||
    'jobs' in arg ||
    'clubs' in arg ||
    'generalEvents' in arg ||
    'careerOpportunities' in arg ||
    'user' in arg
  );
}

export function combineFeedItems(
  arg1,
  arg2,
  arg3,
  arg4,
  arg5,
  arg6,
  arg7
) {
  let posts = [];
  let events = [];
  let news = [];
  let announcements = [];
  let jobs = [];
  let clubs = [];
  let generalEvents = [];
  let careerOpportunities = [];
  let user = null;
  let followedClubIds = [];
  let followedUserIds = [];

  if (isOptionsObject(arg1, arguments.length)) {
    posts = Array.isArray(arg1.posts) ? arg1.posts : [];
    events = Array.isArray(arg1.events) ? arg1.events : [];
    news = Array.isArray(arg1.news) ? arg1.news : [];
    announcements = Array.isArray(arg1.announcements) ? arg1.announcements : [];
    jobs = Array.isArray(arg1.jobs) ? arg1.jobs : [];
    clubs = Array.isArray(arg1.clubs) ? arg1.clubs : [];
    generalEvents = Array.isArray(arg1.generalEvents) ? arg1.generalEvents : [];
    careerOpportunities = Array.isArray(arg1.careerOpportunities) ? arg1.careerOpportunities : [];
    user = arg1.user && typeof arg1.user === 'object' ? arg1.user : null;
    followedClubIds = Array.isArray(arg1.followedClubIds) ? arg1.followedClubIds : [];
    followedUserIds = Array.isArray(arg1.followedUserIds) ? arg1.followedUserIds : [];
  } else {
    posts = Array.isArray(arg1) ? arg1 : [];
    events = Array.isArray(arg2) ? arg2 : [];
    news = Array.isArray(arg3) ? arg3 : [];
    announcements = Array.isArray(arg4) ? arg4 : [];
    jobs = Array.isArray(arg5) ? arg5 : [];
    generalEvents = Array.isArray(arg6) ? arg6 : [];
    careerOpportunities = Array.isArray(arg7) ? arg7 : [];
  }

  const personalizedBase = buildPersonalizedClubFeed({
    posts,
    clubs,
    events,
    announcements,
    news,
    jobs,
    user,
    followedClubIds,
    followedUserIds,
  });

  const seenIds = new Set();
  const seenTitles = new Set();
  const seenImages = new Set();
  const clubIdsWithPosts = new Set();

  const normKey = (str = '') =>
    String(str || '')
      .replace(/<[^>]+>/g, ' ')
      .toLocaleLowerCase('tr-TR')
      .replace(/\u0307/g, '')
      .replace(/['’"“”.,!?:;()[\]\-_/+•|]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  for (let i = 0; i < personalizedBase.length; i++) {
    const item = personalizedBase[i];
    if (item && item.id != null) seenIds.add(String(item.id));
    if (item && item.clubId != null) clubIdsWithPosts.add(String(item.clubId));
    const tk = normKey(item?.title || item?.content || '');
    if (tk && tk.length >= 8) seenTitles.add(tk);
    const img = String(item?.image || item?.imageUrl || '').trim();
    if (img && img.includes('/uploads/')) seenImages.add(img);
  }

  const extraItems = [];

  // Kampüs Genel Etkinlikleri (generalEvents)
  for (let i = 0; i < generalEvents.length; i++) {
    const ge = generalEvents[i];
    if (!ge || typeof ge !== 'object' || Array.isArray(ge)) continue;
    const status = String(ge.status || 'Yayında').toLowerCase().trim();
    if (status === 'taslak' || status === 'draft' || status === 'iptal' || status === 'cancelled' || status === 'pasif') {
      continue;
    }
    const id = ge.id != null ? ge.id : `gevt-${i}`;
    const tk = normKey(ge.title || '');
    const imgUrl = String(ge.image || ge.imageUrl || '').trim();
    if (seenIds.has(String(id))) continue;
    if (tk && tk.length >= 8 && seenTitles.has(tk)) continue;
    if (imgUrl && imgUrl.includes('/uploads/') && seenImages.has(imgUrl)) continue;

    seenIds.add(String(id));
    if (tk && tk.length >= 8) seenTitles.add(tk);
    if (imgUrl && imgUrl.includes('/uploads/')) seenImages.add(imgUrl);

    extraItems.push({
      ...ge,
      id,
      originalId: ge.id,
      authorId: 'admin_1513',
      isGeneralEvent: true,
      eventPost: true,
      eventTitle: ge.title || 'Kampüs Etkinliği',
      eventDate: ge.date ? (ge.time ? `${ge.date} • ${ge.time}` : ge.date) : 'Yaklaşan',
      eventLocation: ge.location || 'Merkez Kampüs',
      eventDesc: ge.description || '',
      eventData: ge,
      feedType: 'general_event',
      author: {
        id: 'admin_1513',
        name: ge.organizer || 'Kariyer Geliştirme Koordinatörlüğü',
        role: 'admin',
        avatar: '/iesu-logo.svg',
        title: `${ge.organizer || 'Üniversite'} • Kampüs Etkinliği (${ge.category || 'Genel'})`,
      },
      authorAvatar: '/iesu-logo.svg',
      role: `${ge.organizer || 'Üniversite'} • Kampüs Etkinliği`,
      time: ge.date || 'Yaklaşan',
      type: ge.category || 'Kampüs Etkinliği',
      title: ge.title || 'Kampüs Etkinliği',
      content:
        ge.description ||
        `🎉 ${ge.title || 'Kampüs Etkinliği'}\n📅 ${ge.date || ''} ${ge.time || ''}\n📍 ${ge.location || 'Merkez Kampüs'}`,
      image: ge.image || ge.imageUrl || null,
      likes: Number(ge.likes || 34),
      comments: Number(ge.comments || 5),
      priorityTier: 5,
    });
  }

  // Kariyer Fırsatları (Yarışma, Burs, Bootcamp, MT Programları)
  for (let i = 0; i < careerOpportunities.length; i++) {
    const opp = careerOpportunities[i];
    if (!opp || typeof opp !== 'object' || Array.isArray(opp)) continue;
    const status = String(opp.status || 'Yayında').toLowerCase().trim();
    if (status === 'taslak' || status === 'draft' || status === 'iptal' || status === 'cancelled' || status === 'pasif') {
      continue;
    }
    const id = opp.id != null ? opp.id : `opp-${i}`;
    const tk = normKey(opp.title || '');
    if (seenIds.has(String(id))) continue;
    if (tk && tk.length >= 8 && seenTitles.has(tk)) continue;
    seenIds.add(String(id));
    if (tk && tk.length >= 8) seenTitles.add(tk);

    const orgName = opp.organization || opp.organizer || 'Kariyer Geliştirme Koordinatörlüğü';
    const resolvedOrgId = opp.companyId || (orgName.includes('Kariyer Geliştirme') || orgName.includes('İESÜ') ? 'admin_1513' : orgName);
    extraItems.push({
      ...opp,
      id,
      originalId: opp.id,
      authorId: resolvedOrgId,
      isCareerOpportunity: true,
      opportunityData: opp,
      jobData: {
        id: opp.id || id,
        title: opp.title || 'Kariyer Fırsatı',
        company: orgName,
        companyId: resolvedOrgId,
        location: opp.location || 'İstanbul / Türkiye Geneli',
        type: opp.category || opp.type || 'KARİYER FIRSATI',
      },
      feedType: 'career_opp',
      author: {
        id: resolvedOrgId,
        name: orgName,
        role: 'company',
        avatar: opp.logo || opp.image || opp.imageUrl || '/iesu-logo.svg',
        title: `${opp.category || opp.type || 'Kariyer Fırsatı'} • Son Başvuru: ${opp.deadline || 'Yakında'}`,
      },
      authorAvatar: opp.logo || opp.image || opp.imageUrl || '/iesu-logo.svg',
      role: `${opp.category || opp.type || 'Fırsat'} • Son Başvuru: ${opp.deadline || 'Yakında'}`,
      time: opp.deadline ? `Son Başvuru: ${opp.deadline}` : (opp.status || 'Açık Çağrı'),
      type: opp.category || opp.type || 'Kariyer Fırsatı',
      title: opp.title,
      content: opp.description || `${opp.title || ''} — Son Başvuru: ${opp.deadline || 'Yakında'}`,
      image: opp.image || opp.imageUrl || null,
      reward: opp.reward,
      likes: Number(opp.likes || 41),
      comments: Number(opp.comments || 6),
      priorityTier: 5,
    });
  }

  // Kulüp keşif tanıtım kartları (en fazla 6 aktif kulüp)
  const maxClubs = Math.min(clubs.length, 6);
  for (let i = 0; i < maxClubs; i++) {
    const club = clubs[i];
    if (!club || typeof club !== 'object' || club.id == null) continue;
    const clubIdStr = String(club.id);
    const hasDedicatedPost = clubIdsWithPosts.has(clubIdStr);
    const id = `club-${clubIdStr}`;
    if (seenIds.has(id)) continue;
    seenIds.add(id);

    const membership = getClubMembershipState(club, user, followedClubIds);
    if (membership.isMember || membership.isFollowing || !hasDedicatedPost) {
      extraItems.push({
        id,
        originalId: club.id,
        clubId: clubIdStr,
        clubName: club.name,
        clubLogo: club.logo,
        clubCategory: club.category,
        authorId: clubIdStr,
        isClubPost: true,
        feedType: 'club',
        author: {
          id: clubIdStr,
          name: club.name || 'Öğrenci Kulübü',
          role: 'club',
          avatar: club.logo || '/iesu-logo.svg',
          title: `Öğrenci Kulübü • ${club.category || 'Kampüs Topluluğu'}`,
        },
        authorAvatar: club.logo || null,
        role: `Öğrenci Kulübü • ${club.category || 'Kampüs Topluluğu'}`,
        time: 'Aktif Topluluk',
        type: 'Öğrenci Kulübü',
        title: `${club.name} Yeni Üyelerini ve Etkinlik Katılımcılarını Bekliyor!`,
        content:
          club.description ||
          `${club.name} bünyesinde düzenlenen kampüs etkinliklerine ve projelere katılmak için kulüp sayfasını ziyaret edebilirsiniz.`,
        image: club.coverImage || club.image || club.logo || null,
        memberCount: club.memberCount || club.members?.length || 45,
        likes: club.memberCount || 30,
        comments: 4,
        membershipState: membership,
        priorityReason: membership.isMember
          ? 'Üyesi Olduğun Kulüp'
          : membership.isFollowing
          ? 'Takip Ettiğin Kulüp'
          : 'Önerilen Öğrenci Kulübü',
        priorityTier: membership.isMember ? 1 : membership.isFollowing ? 2 : hasDedicatedPost ? 5 : 4,
      });
    }
  }

  const allRaw = [...personalizedBase, ...extraItems];

  // Genel akışta paylaşılan kullanıcı gönderileri, iş/staj ilanları, kariyer fırsatları,
  // üniversite etkinlikleri ve kulüp paylaşımlarının dengeli bir şekilde görünmesi için harmanla:
  const priorityClubStream = [];
  const userPostStream = [];
  const jobAndOppStream = [];
  const eventStream = [];
  const discoveryClubStream = [];
  const newsAndAnnStream = [];

  for (let i = 0; i < allRaw.length; i++) {
    const item = allRaw[i];
    if (!item || typeof item !== 'object') continue;
    const isClubItem = Boolean(
      item.clubId ||
      item.isClubPost ||
      item.author?.role === 'club' ||
      (typeof item.feedType === 'string' && item.feedType.startsWith('club'))
    );

    if (isClubItem) {
      if ((item.priorityTier || 5) <= 2) {
        priorityClubStream.push(item);
      } else if (item.feedType === 'club_event') {
        eventStream.push(item);
      } else {
        discoveryClubStream.push(item);
      }
    } else if (item.feedType === 'post') {
      userPostStream.push(item);
    } else if (item.isJob || item.feedType === 'job' || item.isCareerOpportunity || item.feedType === 'career_opp') {
      jobAndOppStream.push(item);
    } else if (item.eventPost || item.isGeneralEvent || item.feedType === 'event' || item.feedType === 'general_event') {
      eventStream.push(item);
    } else {
      newsAndAnnStream.push(item);
    }
  }

  const interleaved = [];
  const streams = [
    userPostStream,
    jobAndOppStream,
    eventStream,
    priorityClubStream,
    discoveryClubStream,
    newsAndAnnStream,
  ];
  let hasMore = true;
  let cursor = 0;
  while (hasMore) {
    hasMore = false;
    for (let s = 0; s < streams.length; s++) {
      if (cursor < streams[s].length) {
        interleaved.push(streams[s][cursor]);
        hasMore = true;
      }
    }
    cursor++;
  }

  return interleaved;
}
