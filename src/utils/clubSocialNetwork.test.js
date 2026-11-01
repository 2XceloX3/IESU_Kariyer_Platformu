import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  canManageClub,
  getClubMembershipState,
  canViewClubContent,
  processClubMembershipAction,
  syncClubEventAcrossSurfaces,
  buildPersonalizedClubFeed,
} from './clubSocialNetwork.js';

describe('University Club Social Network — Pure Logic Suite', () => {
  const sampleClubA = {
    id: 'CLUB-001',
    name: 'İESÜ Yazılım ve Yapay Zeka Kulübü',
    category: 'Bilim ve Teknoloji',
    logo: '/logo-ai.png',
    presidentId: 'USR-PRES-1',
    president: {
      id: 'USR-PRES-1',
      name: 'Mehmet Kerem Yılmaz',
      email: 'kerem.yilmaz@ogr.esenyurt.edu.tr',
    },
    admins: ['USR-OFF-1'],
    members: [
      { id: 'MEM-1', userId: 'USR-MEM-1', name: 'Ayşe Demir', email: 'ayse@ogr.esenyurt.edu.tr', status: 'active' },
    ],
    memberApplications: [
      { id: 'APP-1', userId: 'USR-PEND-1', name: 'Can Kaya', email: 'can@ogr.esenyurt.edu.tr', status: 'pending' },
    ],
    posts: [],
    events: [],
    announcements: [],
  };

  const sampleClubB = {
    id: 'CLUB-002',
    name: 'İESÜ Girişimcilik ve İnovasyon Kulübü',
    category: 'Kariyer ve Girişimcilik',
    logo: '/logo-ent.png',
    presidentId: 'USR-PRES-2',
    president: {
      id: 'USR-PRES-2',
      name: 'Zeynep Arslan',
      email: 'zeynep.arslan@ogr.esenyurt.edu.tr',
    },
    admins: [],
    members: [],
    memberApplications: [],
    posts: [],
    events: [],
    announcements: [],
  };

  it('1. Club president can only manage their assigned club and cannot manage another club', () => {
    const presidentA = { id: 'USR-PRES-1', name: 'Mehmet Kerem Yılmaz', role: 'student' };
    const regularStudent = { id: 'USR-STD-99', name: 'Ali Veli', role: 'student' };

    assert.equal(canManageClub(sampleClubA, presidentA), true);
    assert.equal(canManageClub(sampleClubB, presidentA), false);
    assert.equal(canManageClub(sampleClubA, regularStudent), false);
  });

  it('2. Following a club updates follow state without automatically making the student a club member', () => {
    const student = { id: 'USR-STD-50', name: 'Elif Yıldız', email: 'elif@ogr.esenyurt.edu.tr', role: 'student' };

    const stateBeforeFollow = getClubMembershipState(sampleClubA, student, []);
    assert.equal(stateBeforeFollow.isFollowing, false);
    assert.equal(stateBeforeFollow.isMember, false);
    assert.equal(stateBeforeFollow.followLabel, 'Takip Et');
    assert.equal(stateBeforeFollow.statusLabel, 'Üye Ol');

    const stateAfterFollow = getClubMembershipState(sampleClubA, student, ['CLUB-001']);
    assert.equal(stateAfterFollow.isFollowing, true);
    assert.equal(stateAfterFollow.isMember, false);
    assert.equal(stateAfterFollow.followLabel, 'Takip Ediliyor');
    assert.equal(stateAfterFollow.statusLabel, 'Üye Ol');
  });

  it('3. Membership application transitions from Üye Ol -> Başvurun İnceleniyor -> Üyesisin upon president approval', () => {
    const student = { id: 'USR-STD-77', name: 'Burak Öz', email: 'burak@ogr.esenyurt.edu.tr', role: 'student' };
    const presidentA = { id: 'USR-PRES-1', name: 'Mehmet Kerem Yılmaz', role: 'student' };
    const presidentB = { id: 'USR-PRES-2', name: 'Zeynep Arslan', role: 'student' };

    // Apply for membership
    const applyRes = processClubMembershipAction({
      club: sampleClubA,
      actor: student,
      action: 'apply',
      applicationPayload: { id: 'APP-77', reason: 'Yapay zeka projelerinde görev almak istiyorum.' },
    });
    assert.equal(applyRes.ok, true);

    const pendingState = getClubMembershipState(applyRes.club, student, []);
    assert.equal(pendingState.isPending, true);
    assert.equal(pendingState.isMember, false);
    assert.equal(pendingState.statusLabel, 'Başvurun İnceleniyor');

    // Unauthorized president of another club cannot approve
    const unauthorizedApprove = processClubMembershipAction({
      club: applyRes.club,
      actor: presidentB,
      action: 'approve',
      applicationId: 'APP-77',
    });
    assert.equal(unauthorizedApprove.ok, false);

    // Authorized president approves
    const approveRes = processClubMembershipAction({
      club: applyRes.club,
      actor: presidentA,
      action: 'approve',
      applicationId: 'APP-77',
    });
    assert.equal(approveRes.ok, true);

    const memberState = getClubMembershipState(approveRes.club, student, []);
    assert.equal(memberState.isMember, true);
    assert.equal(memberState.isPending, false);
    assert.equal(memberState.statusLabel, 'Üyesisin');
  });

  it('4. Restricted, draft, pending, and cancelled content never leaks into public feeds or Discover', () => {
    const memberUser = { id: 'USR-MEM-1', name: 'Ayşe Demir', email: 'ayse@ogr.esenyurt.edu.tr', role: 'student' };
    const followerOnlyUser = { id: 'USR-FOL-1', name: 'Selim Ak', email: 'selim@ogr.esenyurt.edu.tr', role: 'student' };

    const draftPost = { id: 'P-DRAFT', title: 'Taslak Duyuru', status: 'draft', visibility: 'public' };
    const pendingEvent = { id: 'E-PEND', title: 'Onay Bekleyen Etkinlik', approvalStatus: 'pending', visibility: 'public' };
    const cancelledEvent = { id: 'E-CANC', title: 'İptal Edilen Etkinlik', status: 'cancelled', visibility: 'public' };
    const membersOnlyPost = { id: 'P-MEM', title: 'Üyelere Özel Toplantı Notu', status: 'published', visibility: 'members_only' };
    const publicPost = { id: 'P-PUB', title: 'Herkese Açık Hackathon Duyurusu', status: 'published', visibility: 'public' };

    assert.equal(canViewClubContent(draftPost, sampleClubA, memberUser, { surface: 'public_feed' }), false);
    assert.equal(canViewClubContent(pendingEvent, sampleClubA, memberUser, { surface: 'public_feed' }), false);
    assert.equal(canViewClubContent(cancelledEvent, sampleClubA, memberUser, { surface: 'public_feed' }), false);

    // Members-only post is visible to accepted club members in feed, but NOT to non-member followers or in Discover
    assert.equal(canViewClubContent(membersOnlyPost, sampleClubA, memberUser, { surface: 'public_feed' }), true);
    assert.equal(canViewClubContent(membersOnlyPost, sampleClubA, followerOnlyUser, { surface: 'public_feed', followedClubIds: ['CLUB-001'] }), false);
    assert.equal(canViewClubContent(membersOnlyPost, sampleClubA, memberUser, { surface: 'discover' }), false);

    // Public published post is visible to all
    assert.equal(canViewClubContent(publicPost, sampleClubA, followerOnlyUser, { surface: 'public_feed' }), true);
    assert.equal(canViewClubContent(publicPost, sampleClubA, followerOnlyUser, { surface: 'discover' }), true);
  });

  it('5. Authoritative event synchronization updates club and global events without duplicates and hides cancelled/pending events', () => {
    const presidentA = { id: 'USR-PRES-1', name: 'Mehmet Kerem Yılmaz', role: 'student' };
    let clubs = [structuredClone(sampleClubA), structuredClone(sampleClubB)];
    let globalEvents = [];

    // Create a published club event
    const createRes = syncClubEventAcrossSurfaces({
      clubs,
      globalEvents,
      clubId: 'CLUB-001',
      actor: presidentA,
      action: 'create',
      eventPayload: {
        id: 'EVT-100',
        title: 'Kampüs Yapay Zeka Zirvesi',
        description: 'Sektör liderleriyle buluşma.',
        date: '2026-11-15',
        time: '14:00',
        location: 'Ömer Halisdemir Konferans Salonu',
        status: 'Yaklaşan',
        approvalStatus: 'approved',
      },
    });

    assert.equal(createRes.ok, true);
    clubs = createRes.clubs;
    globalEvents = createRes.globalEvents;
    assert.equal(clubs[0].events.length, 1);
    assert.equal(globalEvents.length, 1);
    assert.equal(globalEvents[0].title, 'Kampüs Yapay Zeka Zirvesi');

    // Update the same event (should not duplicate in club or globalEvents)
    const updateRes = syncClubEventAcrossSurfaces({
      clubs,
      globalEvents,
      clubId: 'CLUB-001',
      actor: presidentA,
      action: 'update',
      eventPayload: {
        id: 'EVT-100',
        title: 'Kampüs Yapay Zeka Zirvesi (Güncellendi)',
        location: 'A Blok Konferans Salonu',
      },
    });

    assert.equal(updateRes.ok, true);
    clubs = updateRes.clubs;
    globalEvents = updateRes.globalEvents;
    assert.equal(clubs[0].events.length, 1);
    assert.equal(globalEvents.length, 1);
    assert.equal(globalEvents[0].title, 'Kampüs Yapay Zeka Zirvesi (Güncellendi)');
    assert.equal(globalEvents[0].location, 'A Blok Konferans Salonu');

    // Cancel the event -> removed from globalEvents and marked cancelled in club
    const cancelRes = syncClubEventAcrossSurfaces({
      clubs,
      globalEvents,
      clubId: 'CLUB-001',
      actor: presidentA,
      action: 'cancel',
      eventPayload: { id: 'EVT-100' },
    });

    assert.equal(cancelRes.ok, true);
    assert.equal(cancelRes.globalEvents.length, 0);
    assert.equal(cancelRes.clubs[0].events[0].status, 'cancelled');
  });

  it('6. Personalized feed ranks joined club posts first, followed club posts second, club events third, discovery fourth, and general content fifth', () => {
    const student = { id: 'USR-MEM-1', name: 'Ayşe Demir', email: 'ayse@ogr.esenyurt.edu.tr', role: 'student' };

    const clubJoined = {
      ...structuredClone(sampleClubA), // student USR-MEM-1 is a member of CLUB-001
      posts: [
        { id: 'POST-JOINED-1', title: 'Üye Kulüp Gönderisi', caption: 'Kodlama atölyesi başlıyor', status: 'published', visibility: 'public' },
      ],
      events: [
        { id: 'EVT-JOINED-1', title: 'Üye Kulüp Etkinliği', description: 'Atölye', date: '25 Kasım', status: 'Yaklaşan', approvalStatus: 'approved' },
      ],
    };

    const clubFollowed = {
      ...structuredClone(sampleClubB), // student will follow CLUB-002
      posts: [
        { id: 'POST-FOLLOWED-1', title: 'Takip Edilen Kulüp Gönderisi', caption: 'Girişimcilik semineri', status: 'published', visibility: 'public' },
      ],
    };

    const clubDiscovery = {
      id: 'CLUB-003',
      name: 'İESÜ Tiyatro Kulübü',
      category: 'Kültür ve Sanat',
      logo: '/logo-art.png',
      members: [],
      posts: [
        { id: 'POST-DISC-1', title: 'Keşif Kulüp Gönderisi', caption: 'Yeni oyun seçmeleri', status: 'published', visibility: 'public' },
        { id: 'POST-DISC-DRAFT', title: 'Gizli Taslak', caption: 'Görünmemeli', status: 'draft', visibility: 'public' },
      ],
    };

    const generalPosts = [
      { id: 'GEN-POST-1', author: 'Kariyer Merkezi', content: 'Genel kariyer duyurusu', status: 'published' },
    ];

    const feed = buildPersonalizedClubFeed({
      posts: generalPosts,
      clubs: [clubDiscovery, clubFollowed, clubJoined],
      user: student,
      followedClubIds: ['CLUB-002'],
    });

    // Draft post must not be in feed
    assert.equal(feed.some((item) => item.id === 'POST-DISC-DRAFT'), false);

    // Verify exact priority ordering of the 5 items
    assert.equal(feed.length, 5);
    assert.equal(feed[0].id, 'POST-JOINED-1');      // Tier 1: Joined club post
    assert.equal(feed[1].id, 'POST-FOLLOWED-1');    // Tier 2: Followed club post
    assert.equal(feed[2].id, 'EVT-JOINED-1');       // Tier 3: Joined/followed club event
    assert.equal(feed[3].id, 'POST-DISC-1');        // Tier 4: Public club discovery
    assert.equal(feed[4].id, 'GEN-POST-1');         // Tier 5: General portal content
  });
});
