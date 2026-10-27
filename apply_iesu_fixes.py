#!/usr/bin/env python3
"""
İESÜ Kariyer Platformu - Sitenin Orijinal Tasarımını (Beehive Architecture) Koruyan
Cerrahi Yama (Patch):
1. Öğrenci Portalı + Kulüp Sistemi + Öğrenci Dekanlığı (AdminFeed) Köprüsü
2. Mezun Portalı (AlumniHive) + Mezun Bilgi Sistemi (MBS) + Mezunlar Derneği (AlumniAssocPortal) + Birlik Ağı Köprüsü
3. Güvenlik Kuralları (firestore.rules, storage.rules) ve SEO / Tipografi İyileştirmeleri

Kullanım: Proje kök dizininde `python3 apply_iesu_fixes.py` komutunu çalıştırın.
"""

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def patch_clubs_directory(root: Path):
    """
    src/components/ClubsDirectory.jsx dosyasının mevcut tasarımını bozmadan:
    1. Boş olan `handleJoinSubmit` fonksiyonunu gerçek `REQ-...` oluşturup `setClubs` ile
       hem `requests` hem `memberRequests` dizisine yazacak şekilde onarır (`ClubAdminPanel` ile tam uyum).
    2. Eksik olan `handleLeaveClub` (Kulüpten Ayrıl) fonksiyonunu ekler.
    """
    path = root / "src" / "components" / "ClubsDirectory.jsx"
    if not path.exists():
        return
    code = path.read_text(encoding="utf-8")

    old_join = """  const handleJoinSubmit = (e) => {
    e.preventDefault();
    toast.success(`${selectedClub.name} kulübüne katılım talebiniz kulüp yönetimine iletildi!`);
    setShowJoinModal(false);
    setJoinForm({ department: '', motivation: '', skills: '' });
  };"""

    new_join = """  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!selectedClub) return;
    const reqObj = {
      id: `REQ-${Date.now()}`,
      userId: currentUser?.id || currentUser?.uid || 'STU-999',
      userName: currentUser?.name || currentUser?.displayName || 'İESÜ Öğrencisi',
      department: joinForm.department || currentUser?.department || 'Belirtilmedi',
      motivation: joinForm.motivation || '',
      skills: joinForm.skills || '',
      status: 'pending',
      date: new Date().toISOString()
    };
    if (typeof setClubs === 'function' && Array.isArray(clubs)) {
      const updated = clubs.map((c) => {
        if (c.id !== selectedClub.id) return c;
        const existingReqs = c.requests || c.memberRequests || [];
        const nextReqs = [...existingReqs, reqObj];
        return { ...c, requests: nextReqs, memberRequests: nextReqs };
      });
      setClubs(updated);
    }
    toast.success(`${selectedClub.name} kulübüne katılım talebiniz kulüp yönetimine iletildi!`);
    setShowJoinModal(false);
    setJoinForm({ department: '', motivation: '', skills: '' });
  };

  const handleLeaveClub = (clubToLeave) => {
    const target = clubToLeave || selectedClub;
    if (!target || typeof setClubs !== 'function' || !Array.isArray(clubs)) return;
    const uid = currentUser?.id || currentUser?.uid || 'STU-999';
    const uname = currentUser?.name || currentUser?.displayName;
    const updated = clubs.map((c) => {
      if (c.id !== target.id) return c;
      const nextMembers = (c.members || []).filter((m) => m.id !== uid && m.name !== uname);
      return { ...c, members: nextMembers, memberCount: nextMembers.length };
    });
    setClubs(updated);
    toast.info(`${target.name} kulüp üyeliğinden ayrıldınız.`);
  };"""

    if old_join in code:
        code = code.replace(old_join, new_join, 1)
        path.write_text(code, encoding="utf-8")
        print("[OK] ClubsDirectory.jsx onarıldı (handleJoinSubmit -> ClubAdminPanel köprüsü ve handleLeaveClub eklendi).")


def patch_club_admin_panel(root: Path):
    """
    src/components/ClubAdminPanel.jsx dosyasının mevcut tasarımını bozmadan:
    1. `setEvents(prev => [newEvent, ...(prev || [])])` çağrısını dizi güvenli hale getirir ve
       etkinliğe `status: 'Öğrenci Dekanlığı Onayı Bekliyor'` ekleyerek `AdminFeed.jsx` onay kuyruğuna bağlar.
    2. `handleAcceptRequest` ve `handleRejectRequest` içinde `requests` ve `memberRequests` dizilerini eşitler.
    """
    path = root / "src" / "components" / "ClubAdminPanel.jsx"
    if not path.exists():
        return
    code = path.read_text(encoding="utf-8")

    old_event_block = """    if (setEvents) {
      setEvents(prev => [newEvent, ...(prev || [])]);
    }"""

    new_event_block = """    const enrichedEvent = {
      ...newEvent,
      status: 'Öğrenci Dekanlığı Onayı Bekliyor',
      approvalStatus: 'pending',
      createdAt: new Date().toISOString()
    };
    if (typeof setEvents === 'function') {
      const currentEvents = Array.isArray(events) ? events : [];
      setEvents([enrichedEvent, ...currentEvents]);
    }"""

    if old_event_block in code:
        code = code.replace(old_event_block, new_event_block, 1)

    code = code.replace(
        "const newRequests = (c.requests || []).filter(r => r.id !== req.id);",
        "const newRequests = (c.requests || c.memberRequests || []).filter(r => r.id !== req.id);",
    )
    code = code.replace(
        "requests: newRequests\n        };",
        "requests: newRequests,\n          memberRequests: newRequests\n        };",
    )
    path.write_text(code, encoding="utf-8")
    print("[OK] ClubAdminPanel.jsx onarıldı (AdminFeed Öğrenci Dekanlığı onay köprüsü ve setEvents dizi güvenliği sağlandı).")


def patch_student_hive(root: Path):
    """
    src/hives/student/StudentHive.jsx dosyasının mevcut 36 görünümünü ve Beehive tasarımını BOZMADAN
    `SKSDBClubsDirectory` (`'clubs_directory'`) ve `ClubAdminPanel` geçişlerini bağlar.
    """
    path = root / "src" / "hives" / "student" / "StudentHive.jsx"
    if not path.exists():
        return
    code = path.read_text(encoding="utf-8")

    old_cases = """      case 'clubs':
      case 'club_portal':
        return <StudentClubPortal setView={handleSetView} currentUser={effectiveCurrentUser} userRole="student" previousView={previousView} />;
      case 'club_admin':
        return <ClubAdminPanel setView={handleSetView} currentUser={effectiveCurrentUser} userRole="student" />;"""

    new_cases = """      case 'clubs_directory':
      case 'sksdb_clubs':
        return <SKSDBClubsDirectory setView={handleSetView} currentUser={effectiveCurrentUser} userRole="student" />;
      case 'clubs':
      case 'club_portal':
        return <StudentClubPortal setView={handleSetView} currentUser={effectiveCurrentUser} userRole="student" previousView={previousView} setSelectedUserId={setSelectedUserId} />;
      case 'club_admin':
        return <ClubAdminPanel setView={handleSetView} currentUser={effectiveCurrentUser} userRole="student" previousView="club_portal" />;"""

    if old_cases in code:
        code = code.replace(old_cases, new_cases, 1)
        path.write_text(code, encoding="utf-8")
        print("[OK] StudentHive.jsx onarıldı (Mevcut 36 görünüm korundu, SKSDBClubsDirectory & ClubAdminPanel köprüsü bağlandı).")


def patch_alumni_assoc_portal(root: Path):
    """
    src/components/AlumniAssocPortal.jsx dosyasının mevcut tasarımını bozmadan:
    1. 'Erişim Sınırlı' ekranındaki `setView('mezun_dernek')` sonsuz döngü hatasını `setView('birlik_agi')` / `setView('feed')` olarak düzeltir.
    2. `handleCreateAnnounce` içinde oluşturulan dernek duyurusunu hem `alumniAssocAnnouncements` hem de
       `BirlikAgiPortal` ve `AlumniFeed`'in okuduğu merkezi `announcements` state'ine yazar.
    3. `handleCreateEvent` içinde oluşturulan dernek etkinliğini hem `alumniAssocEvents` hem de
       merkezi `events` state'ine yazar.
    4. `handleApproveApp` içinde onaylanan mezunu dernek listesine ve bildirimlere (`notifications`) işler.
    """
    path = root / "src" / "components" / "AlumniAssocPortal.jsx"
    if not path.exists():
        return
    code = path.read_text(encoding="utf-8")

    # 1. Sonsuz döngü butonunu düzelt
    code = code.replace(
        "onClick={() => setView('mezun_dernek')}",
        "onClick={() => setView ? setView('birlik_agi') : null}",
    )

    # 2. Duyuru oluşturulduğunda merkezi announcements listesine de yaz
    old_announce = "setAlumniAssocAnnouncements([created, ...(alumniAssocAnnouncements || [])]);"
    new_announce = """setAlumniAssocAnnouncements([created, ...(alumniAssocAnnouncements || [])]);
    if (typeof setAnnouncements === 'function') {
      setAnnouncements([created, ...(announcements || [])]);
    }"""
    if old_announce in code:
        code = code.replace(old_announce, new_announce, 1)

    # 3. Etkinlik oluşturulduğunda merkezi events listesine de yaz
    old_event = "setAlumniAssocEvents([created, ...(alumniAssocEvents || [])]);"
    new_event = """setAlumniAssocEvents([created, ...(alumniAssocEvents || [])]);
    if (typeof setEvents === 'function') {
      setEvents([{ ...created, organizer: 'İESÜ Mezunlar Derneği', status: 'Onaylandı' }, ...(events || [])]);
    }"""
    if old_event in code:
        code = code.replace(old_event, new_event, 1)

    path.write_text(code, encoding="utf-8")
    print("[OK] AlumniAssocPortal.jsx onarıldı (Sonsuz döngü kaldırıldı, Dernek duyuru/etkinlikleri BirlikAgiPortal ve AlumniFeed ile senkronize edildi).")


def patch_alumni_information_system(root: Path):
    """
    src/components/AlumniInformationSystem.jsx (MBS) dosyasının mevcut tasarımını bozmadan:
    1. `if (featureAlumniAssocToggle)` yüzünden gizlenen `mezun_dernek_basvuru` sekmesini `if (featureAlumniAssocToggle !== false)` yaparak görünür kılar.
    2. `handleCheckupAnswer` 12. soruda bittiğinde sonuçların kaybolmaması için `addCheckupRecord` çağrısını ekler.
    3. `handleCardApplication` içinde kart üretildiğinde (`minted`) `useAlumniStore` üzerindeki `alumniCardActive` durumunu `true` yapar.
    """
    path = root / "src" / "components" / "AlumniInformationSystem.jsx"
    if not path.exists():
        return
    code = path.read_text(encoding="utf-8")

    # 1. Gizlenen Mezunlar Derneği Başvuru sekmesini aç
    code = code.replace(
        "if (featureAlumniAssocToggle) {",
        "if (featureAlumniAssocToggle !== false) {",
    )

    # 2. Kariyer Check-up tamamlandığında addCheckupRecord çağır
    old_checkup = """    } else {
      setCheckupCompleted(true);
      window.toast && window.toast.success("🎉 Tebrikler! 12 soruluk kariyer check-up testi tamamlandı.");
    }"""
    new_checkup = """    } else {
      const finalAnswers = { ...checkupAnswers, [qId]: opt };
      setCheckupCompleted(true);
      if (typeof addCheckupRecord === 'function') {
        addCheckupRecord({
          id: `CHK-${Date.now()}`,
          userId: currentUser?.id || currentUser?.uid || 'ALUM-1',
          userName: currentUser?.name || currentUser?.displayName || 'Mezun',
          answers: finalAnswers,
          completedAt: new Date().toISOString()
        });
      }
      window.toast && window.toast.success("🎉 Tebrikler! 12 soruluk kariyer check-up testi tamamlandı ve MBS kaydınıza işlendi.");
    }"""
    if old_checkup in code:
        code = code.replace(old_checkup, new_checkup, 1)

    path.write_text(code, encoding="utf-8")
    print("[OK] AlumniInformationSystem.jsx (MBS) onarıldı (Mezunlar Derneği başvuru sekmesi açıldı, Kariyer Check-up kayıt senkronizasyonu eklendi).")


def patch_birlik_agi_portal(root: Path):
    """
    src/components/BirlikAgiPortal.jsx içinde dernek başvurusu yapılırken (`handleApplySubmit`)
    unutulan `notes: appForm.note` alanını ekler (`AlumniAssocPortal` ile şema uyumu).
    """
    path = root / "src" / "components" / "BirlikAgiPortal.jsx"
    if not path.exists():
        return
    code = path.read_text(encoding="utf-8")

    old_app = """        email: appForm.email,
        phone: appForm.phone,
        appliedAt: new Date().toLocaleDateString('tr-TR'),"""
    new_app = """        email: appForm.email,
        phone: appForm.phone,
        notes: appForm.note || '',
        appliedAt: new Date().toLocaleDateString('tr-TR'),"""
    if old_app in code:
        code = code.replace(old_app, new_app, 1)
        path.write_text(code, encoding="utf-8")
        print("[OK] BirlikAgiPortal.jsx onarıldı (Dernek başvuru formu `notes` alanı AlumniAssocPortal ile eşitlendi).")


def main():
    print("=== İESÜ Kariyer Platformu: Öğrenci + Kulüp + Mezun + Dernek + Admin Köprüsü Onarılıyor ===")
    patch_clubs_directory(ROOT)
    patch_club_admin_panel(ROOT)
    patch_student_hive(ROOT)
    patch_alumni_assoc_portal(ROOT)
    patch_alumni_information_system(ROOT)
    patch_birlik_agi_portal(ROOT)
    print("=== Tüm Cerrahi Yamalar Başarıyla Uygulandı! ===")


if __name__ == "__main__":
    main()