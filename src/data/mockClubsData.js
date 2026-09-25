/**
 * src/data/mockClubsData.js
 * Comprehensive initial data for Student Clubs, Club Applications (Forms, Venues & Budgets),
 * Member Applications with TC & Student No, and Instagram-style Club Media Feeds.
 */

export const initialClubs = [
  {
    id: 'CLUB-001',
    code: 'club_yazilim_inovasyon',
    name: 'İESÜ Yazılım ve İnovasyon Kulübü',
    shortName: 'YİK',
    category: 'Bilim, Teknoloji ve Mühendislik',
    establishedYear: 2021,
    status: 'Aktif',
    memberCount: 248,
    advisor: 'Dr. Öğr. Üyesi Deniz Demir (Bilgisayar Müh. Bölüm Başkanı)',
    advisorEmail: 'deniz.demir@esenyurt.edu.tr',
    presidentId: 'STU-001',
    president: {
      id: 'STU-001',
      name: 'Mehmet Kerem Yılmaz',
      studentNo: '2023010482',
      tcKimlik: '39281749102',
      department: 'Bilgisayar Mühendisliği',
      year: '3. Sınıf',
      email: 'kerem.yilmaz@ogr.esenyurt.edu.tr',
      phone: '0532 999 8811'
    },
    // SKS Managed Budget (Restricted: only visible/managed in Admin SKS Panel)
    budget: {
      allocated: 45000,
      spent: 16500,
      remaining: 28500,
      currency: '₺',
      fiscalYear: '2026-2027'
    },
    logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=250&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    description: 'İstanbul Esenyurt Üniversitesi öğrencilerinin yapay zeka, web/mobil geliştirme, siber güvenlik, robotik ve açık kaynak projelerinde yetkinlik kazanmasını amaçlayan; hackathonlar, bootcamp’ler, sektörel teknik geziler ve kariyer zirveleri düzenleyen resmî öğrenci kulübüdür.',
    purpose: 'Öğrencilerimizi üniversite yıllarından itibaren sektörün önde gelen teknoloji şirketleriyle buluşturmak, takım çalışması ruhuyla ulusal/uluslararası yarışmalara (TEKNOFEST, TÜBİTAK 2209) hazırlamak ve mezuniyet öncesi güçlü bir portfolyo oluşturmalarına rehberlik etmektir.',
    constitutionUrl: '#',
    constitutionApprovedDate: '14.10.2021 (SKS Daire Başkanlığı)',
    
    // Authorized Officers who can request venue/equipment from SKS and manage members
    authorizedOfficers: [
      { id: 'STU-001', name: 'Mehmet Kerem Yılmaz', role: 'Kulüp Başkanı', email: 'kerem.yilmaz@ogr.esenyurt.edu.tr' },
      { id: 'STU-002', name: 'Zeynep Kaya', role: 'Başkan Yardımcısı', email: 'zeynep.kaya@ogr.esenyurt.edu.tr' },
      { id: 'STU-005', name: 'Caner Şahin', role: 'Genel Sekreter', email: 'caner.sahin@ogr.esenyurt.edu.tr' },
      { id: 'STU-006', name: 'Elif Yıldız', role: 'Mali Sorumlu & Dış İlişkiler', email: 'elif.yildiz@ogr.esenyurt.edu.tr' }
    ],

    // Management Board
    boardMembers: [
      {
        id: 'BM-1',
        name: 'Mehmet Kerem Yılmaz',
        role: 'Kulüp Başkanı',
        department: 'Bilgisayar Mühendisliği (3. Sınıf)',
        studentNo: '2023010482',
        tcKimlik: '39281749102',
        email: 'kerem.yilmaz@ogr.esenyurt.edu.tr',
        phone: '0532 999 8811',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        badge: 'Kurul Başkanı'
      },
      {
        id: 'BM-2',
        name: 'Dr. Öğr. Üyesi Deniz Demir',
        role: 'Akademik Danışman',
        department: 'Mühendislik Fakültesi / Bilgisayar Müh.',
        email: 'deniz.demir@esenyurt.edu.tr',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        badge: 'Fakülte Danışmanı'
      },
      {
        id: 'BM-3',
        name: 'Zeynep Kaya',
        role: 'Başkan Yardımcısı',
        department: 'Yazılım Mühendisliği (3. Sınıf)',
        studentNo: '2023010499',
        tcKimlik: '48291038291',
        email: 'zeynep.kaya@ogr.esenyurt.edu.tr',
        phone: '0533 881 2233',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        badge: 'Operasyon'
      },
      {
        id: 'BM-4',
        name: 'Caner Şahin',
        role: 'Genel Sekreter',
        department: 'Yönetim Bilişim Sistemleri (2. Sınıf)',
        studentNo: '2024010114',
        tcKimlik: '29481940182',
        email: 'caner.sahin@ogr.esenyurt.edu.tr',
        phone: '0544 555 1234',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        badge: 'İdari İşler'
      },
      {
        id: 'BM-5',
        name: 'Elif Yıldız',
        role: 'Mali Sorumlu & Dış İlişkiler',
        department: 'Endüstri Mühendisliği (2. Sınıf)',
        studentNo: '2024010255',
        tcKimlik: '59281749201',
        email: 'elif.yildiz@ogr.esenyurt.edu.tr',
        phone: '0535 777 9900',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
        badge: 'Mali İşler'
      }
    ],

    // Events
    events: [
      {
        id: 'CLB-EVT-101',
        title: 'İESÜ Hackathon 2026: Yapay Zeka Çözümleri',
        category: 'Yarışma & Hackathon',
        date: '18-19 Ekim 2026',
        time: 'Cumartesi 09:30 - Pazar 18:00',
        location: 'Ömer Halisdemir Konferans Salonu & Fuaye',
        quota: 150,
        registeredCount: 118,
        status: 'Yaklaşan',
        description: '24 saat kesintisiz kodlama maratonunda sürdürülebilir şehirler ve üretken yapay zeka alanında inovatif projeler yarışıyor. 60.000 ₺ toplam ödül!',
        speaker: 'Logo Yazılım & Trendyol Mühendislik Mentorları',
        certificate: true
      },
      {
        id: 'CLB-EVT-102',
        title: 'Sektör Liderleri ile Buluşma: TechTalks 2026',
        category: 'Panel & Söyleşi',
        date: '12 Kasım 2026',
        time: '14:00 - 16:30',
        location: 'Amfi 1 (Mühendislik Fakültesi)',
        quota: 200,
        registeredCount: 92,
        status: 'Yaklaşan',
        description: 'Büyük ölçekli bulut mimarileri ve savunma sanayiinde yazılım mühendisliği kariyeri üzerine canlı soru-cevap oturumu.',
        speaker: 'Baykar Teknoloji & Havelsan Baş Mimarları',
        certificate: true
      },
      {
        id: 'CLB-EVT-103',
        title: 'React & Modern Frontend Geliştirme Bootcamp’i',
        category: 'Atölye / Eğitim',
        date: '10 Mart 2026',
        time: '4 Hafta (Cumartesi Günleri)',
        location: 'Bilgisayar Lab 402',
        quota: 45,
        registeredCount: 45,
        status: 'Tamamlandı',
        description: 'Sıfırdan ileri seviyeye React 19, TypeScript ve Tailwind CSS ile gerçek dünya projesi geliştirme atölyesi.',
        speaker: 'Kulüp Eğitmen Ekibi',
        certificate: true
      }
    ],

    // Announcements
    announcements: [
      {
        id: 'CLB-ANN-201',
        title: '2026-2027 Güz Dönemi Komisyon ve Proje Takımları Başvuruları Açıldı!',
        date: '22 Eylül 2026',
        author: 'Mehmet Kerem Yılmaz (Başkan)',
        content: 'Yapay Zeka, Mobil Uygulama, Siber Güvenlik ve Sosyal Medya komisyonlarımızda aktif rol almak isteyen tüm öğrencilerimizi proje ekiplerimize bekliyoruz.',
        isImportant: true
      },
      {
        id: 'CLB-ANN-202',
        title: 'TÜBİTAK 2209-A Öğrenci Projeleri Mentorluk Desteği',
        date: '18 Eylül 2026',
        author: 'Dr. Öğr. Üyesi Deniz Demir (Danışman)',
        content: 'Kulübümüz üyeleri tarafından hazırlanan 4 ayrı araştırma projesi danışman hocamızın rehberliğinde TÜBİTAK sistemine yüklenmiştir.',
        isImportant: false
      }
    ],

    // SKS Venue, Time & Equipment Requests (Student cannot see currency/budget, managed in Admin)
    budgetRequests: [
      {
        id: 'REQ-101',
        title: 'İESÜ Hackathon 2026 Organizasyon & Yer Tahsisi',
        requestedVenue: 'Ömer Halisdemir Konferans Salonu & Fuaye',
        eventDate: '18-19 Ekim 2026',
        startTime: '09:00',
        endTime: '19:00',
        expectedAttendees: 150,
        equipment: ['Ses Sistemi & 4 Adet Telsiz Mikrofon', 'Çift Projeksiyon & HDMI Çoklayıcı', '30 Adet Grup Çalışma Masası', 'Yaka Kartı Baskı Desteği', 'Afiş ve Roll-Up Asma İzni'],
        requestedDate: '10.09.2026',
        requester: 'Mehmet Kerem Yılmaz (Başkan)',
        status: 'approved',
        approvalNote: 'SKS Daire Başkanlığı tarafından salon tahsis edildi ve teknik ekipman rezervasyonu onaylandı.',
        assignedBudget: '15.000 TL' // Admin SKS internal
      },
      {
        id: 'REQ-102',
        title: 'Yapay Zeka Laboratuvarı & Sunucu Çalıştay İzni',
        requestedVenue: 'Bilgisayar Lab 402',
        eventDate: '26 Ekim 2026',
        startTime: '13:00',
        endTime: '17:30',
        expectedAttendees: 45,
        equipment: ['Lab Bilgisayarlarında Yönetici Erişimi', 'Projeksiyon Cihazı', 'Kürsü Ses Sistemi'],
        requestedDate: '21.09.2026',
        requester: 'Zeynep Kaya (Başkan Yrd.)',
        status: 'pending',
        approvalNote: 'Mühendislik Fakültesi Dekanlığı ve SKS incelemesinde.',
        assignedBudget: '8.500 TL' // Admin SKS internal
      }
    ],

    // Full Detailed Members List (with Student No, TC, Dept, Grade, Role)
    members: [
      { id: 'STU-001', studentNo: '2023010482', tcKimlik: '39281749102', name: 'Mehmet Kerem Yılmaz', department: 'Bilgisayar Mühendisliği', grade: '3. Sınıf', role: 'Kulüp Başkanı', joinedDate: '14.10.2023', phone: '0532 999 8811', email: 'kerem.yilmaz@ogr.esenyurt.edu.tr', status: 'Aktif' },
      { id: 'STU-002', studentNo: '2023010499', tcKimlik: '48291038291', name: 'Zeynep Kaya', department: 'Yazılım Mühendisliği', grade: '3. Sınıf', role: 'Başkan Yardımcısı', joinedDate: '14.10.2023', phone: '0533 881 2233', email: 'zeynep.kaya@ogr.esenyurt.edu.tr', status: 'Aktif' },
      { id: 'STU-005', studentNo: '2024010114', tcKimlik: '29481940182', name: 'Caner Şahin', department: 'Yönetim Bilişim Sistemleri', grade: '2. Sınıf', role: 'Genel Sekreter', joinedDate: '10.02.2024', phone: '0544 555 1234', email: 'caner.sahin@ogr.esenyurt.edu.tr', status: 'Aktif' },
      { id: 'STU-006', studentNo: '2024010255', tcKimlik: '59281749201', name: 'Elif Yıldız', department: 'Endüstri Mühendisliği', grade: '2. Sınıf', role: 'Mali Sorumlu', joinedDate: '15.02.2024', phone: '0535 777 9900', email: 'elif.yildiz@ogr.esenyurt.edu.tr', status: 'Aktif' },
      { id: 'STU-003', studentNo: '2023010312', tcKimlik: '18492019482', name: 'Ahmet Kaya', department: 'Bilgisayar Mühendisliği', grade: '3. Sınıf', role: 'Aktif Üye', joinedDate: '01.03.2024', phone: '0538 444 3322', email: 'ahmet.kaya@ogr.esenyurt.edu.tr', status: 'Aktif' },
      { id: 'STU-004', studentNo: '2024010891', tcKimlik: '72910384918', name: 'Selin Öztürk', department: 'Veri Bilimi ve Analitiği', grade: '1. Sınıf', role: 'Aktif Üye', joinedDate: '18.03.2024', phone: '0539 222 1100', email: 'selin.ozturk@ogr.esenyurt.edu.tr', status: 'Aktif' },
      { id: 'STU-007', studentNo: '2022010991', tcKimlik: '61928374910', name: 'Barış Koç', department: 'Elektrik-Elektronik Mühendisliği', grade: '4. Sınıf', role: 'Donanım Takım Lideri', joinedDate: '20.10.2023', phone: '0555 666 4433', email: 'baris.koc@ogr.esenyurt.edu.tr', status: 'Aktif' },
      { id: 'STU-008', studentNo: '2024010332', tcKimlik: '82910482910', name: 'Duygu Arıkan', department: 'Endüstriyel Tasarım', grade: '2. Sınıf', role: 'Tasarım & UI Sorumlusu', joinedDate: '05.04.2024', phone: '0531 333 4455', email: 'duygu.arikan@ogr.esenyurt.edu.tr', status: 'Aktif' }
    ],

    // Pending Member Applications for Club President & Officers Review
    memberApplications: [
      {
        id: 'APP-MEM-101',
        studentId: 'STU-088',
        studentNo: '2024010912',
        tcKimlik: '43928174920',
        name: 'Murat Can Polat',
        department: 'Yazılım Mühendisliği',
        grade: '1. Sınıf',
        email: 'murat.polat@ogr.esenyurt.edu.tr',
        phone: '0544 321 9900',
        reason: 'Yapay zeka modelleri ve açık kaynak yazılım projelerinde yer almak, hackathon takımı kurmak istiyorum.',
        appliedAt: '24 Eylül 2026',
        status: 'pending'
      },
      {
        id: 'APP-MEM-102',
        studentId: 'STU-094',
        studentNo: '2023010777',
        tcKimlik: '10928374650',
        name: 'Ceyda Aktaş',
        department: 'Yönetim Bilişim Sistemleri',
        grade: '2. Sınıf',
        email: 'ceyda.aktas@ogr.esenyurt.edu.tr',
        phone: '0536 789 0123',
        reason: 'Kulübün etkinlik organizasyonlarında ve sponsorluk ekibinde aktif görev alarak yönetim tecrübesi kazanmak istiyorum.',
        appliedAt: '25 Eylül 2026',
        status: 'pending'
      }
    ],

    // Instagram-style Event Media Feed Posts
    posts: [
      {
        id: 'POST-CLB-101',
        author: {
          name: 'İESÜ Yazılım ve İnovasyon Kulübü',
          handle: '@iesuyazilim',
          logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=250&q=80',
          verified: true
        },
        location: 'İESÜ Ömer Halisdemir Konferans Salonu',
        images: [
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80'
        ],
        filter: 'vibrant',
        music: {
          title: 'Campus Synthwave & Tech Beats',
          artist: 'İESÜ Sound Studio',
          duration: '02:30'
        },
        caption: '🚀 İESÜ Hackathon 2026 hazırlık maratonumuz resmen başladı! 24 saat boyunca kesintisiz kodlama, mentorluk ve 60.000 ₺ ödül havuzu sizleri bekliyor. Takımınızı kurun veya bireysel kaydınızı yapın! ✨ Link bio’da! 👨‍💻👩‍💻 #İESÜ #YazılımKulübü #Hackathon2026 #YapayZeka #Teknofest #GeleceğiKodla',
        likes: 194,
        isLiked: false,
        comments: [
          { id: 1, user: 'ahmet.kaya', name: 'Ahmet Kaya', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', text: 'Takımımız hazır, 1.lik ödülünü almaya geliyoruz! 🔥', time: '1 saat önce' },
          { id: 2, user: 'zeynep.dev', name: 'Zeynep Kaya', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', text: 'Mentor ekibi ve atölye programı harika oldu, herkesi bekliyoruz 💻👏', time: '40 dk önce' }
        ],
        shares: 38,
        saved: false,
        createdAt: '2 saat önce'
      },
      {
        id: 'POST-CLB-102',
        author: {
          name: 'İESÜ Yazılım ve İnovasyon Kulübü',
          handle: '@iesuyazilim',
          logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=250&q=80',
          verified: true
        },
        location: 'Bilgisayar Lab 402',
        images: [
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1000&q=80'
        ],
        filter: 'cyber',
        music: {
          title: 'Cyberpunk Coding Lounge',
          artist: 'Future AI Vibes',
          duration: '03:15'
        },
        caption: '⚡ React 19 ve TypeScript atölyemizin 1. modülünü 45 kişilik rekor katılımla tamamladık! Katılan tüm arkadaşlarımıza teşekkürler, kod depoları GitHub sayfamızda yayında. 🌐 #React #Frontend #TypeScript #WebDev',
        likes: 142,
        isLiked: true,
        comments: [
          { id: 1, user: 'selin.ozturk', name: 'Selin Öztürk', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80', text: 'Çok faydalı bir eğitimdi, haftaya görüşmek üzere!', time: 'Dün' }
        ],
        shares: 22,
        saved: true,
        createdAt: '1 gün önce'
      }
    ],

    // Stories / Highlights Bar
    highlights: [
      { id: 'HL-1', title: 'Hackathon', icon: '💻', cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80' },
      { id: 'HL-2', title: 'Bootcamp', icon: '⚡', cover: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=200&q=80' },
      { id: 'HL-3', title: 'Ödüller', icon: '🏆', cover: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80' },
      { id: 'HL-4', title: 'Geziler', icon: '🚌', cover: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80' },
      { id: 'HL-5', title: 'Yönetim', icon: '👥', cover: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }
    ]
  },
  {
    id: 'CLUB-002',
    code: 'club_girisimcilik_inovasyon',
    name: 'İESÜ Girişimcilik ve İnovasyon Kulübü',
    shortName: 'GİK',
    category: 'Girişimcilik ve İş Dünyası',
    establishedYear: 2020,
    status: 'Aktif',
    memberCount: 184,
    advisor: 'Doç. Dr. Selin Doğan (İşletme Fakültesi)',
    advisorEmail: 'selin.dogan@esenyurt.edu.tr',
    presidentId: 'STU-012',
    president: {
      id: 'STU-012',
      name: 'Berkant Özdemir',
      studentNo: '2022020119',
      tcKimlik: '28194019284',
      department: 'Uluslararası Ticaret ve Finansman',
      year: '4. Sınıf',
      email: 'berkant.ozdemir@ogr.esenyurt.edu.tr',
      phone: '0533 112 3344'
    },
    budget: {
      allocated: 35000,
      spent: 12000,
      remaining: 23000,
      currency: '₺',
      fiscalYear: '2026-2027'
    },
    logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=250&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    description: 'Üniversitemiz bünyesinde girişimcilik kültürünü yaygınlaştırmak, öğrencilerin iş fikirlerini kuluçka merkezinde olgunlaştırmak ve melek yatırımcı ağlarıyla buluşturmak amacıyla kurulmuştur.',
    purpose: 'Öğrencilerimize yalın girişim metodolojisi, fon bulma, şirketleşme ve patent süreçlerinde uygulamalı bilgi sağlamak.',
    authorizedOfficers: [
      { id: 'STU-012', name: 'Berkant Özdemir', role: 'Kulüp Başkanı', email: 'berkant.ozdemir@ogr.esenyurt.edu.tr' },
      { id: 'STU-015', name: 'Merve Koç', role: 'Başkan Yardımcısı', email: 'merve.koc@ogr.esenyurt.edu.tr' }
    ],
    boardMembers: [
      { id: 'BM-201', name: 'Berkant Özdemir', role: 'Kulüp Başkanı', department: 'Uluslararası Ticaret', studentNo: '2022020119', email: 'berkant.o@ogr.esenyurt.edu.tr' },
      { id: 'BM-202', name: 'Doç. Dr. Selin Doğan', role: 'Akademik Danışman', department: 'İşletme Fakültesi', email: 'selin.dogan@esenyurt.edu.tr' }
    ],
    events: [
      {
        id: 'CLB-EVT-201',
        title: 'Startup Pitching & Melek Yatırımcı Zirvesi',
        category: 'Girişimcilik Zirvesi',
        date: '28 Kasım 2026',
        time: '13:00 - 17:00',
        location: 'A Blok Konferans Salonu',
        quota: 120,
        registeredCount: 74,
        status: 'Yaklaşan',
        description: '10 finalist öğrenci girişimi 5 yatırımcı jürisi önünde 3 dakikalık sunumlarını yapacak.'
      }
    ],
    announcements: [
      { id: 'ANN-301', title: 'Kuluçka Ön Hızlandırma Programı Başvuruları Başladı', date: '20 Eylül 2026', author: 'Yönetim Kurulu' }
    ],
    budgetRequests: [],
    members: [
      { id: 'STU-012', studentNo: '2022020119', tcKimlik: '28194019284', name: 'Berkant Özdemir', department: 'Uluslararası Ticaret', grade: '4. Sınıf', role: 'Kulüp Başkanı', joinedDate: '10.10.2022', phone: '0533 112 3344', email: 'berkant.ozdemir@ogr.esenyurt.edu.tr', status: 'Aktif' },
      { id: 'STU-015', studentNo: '2023020412', tcKimlik: '39102938491', name: 'Merve Koç', department: 'İşletme', grade: '3. Sınıf', role: 'Başkan Yardımcısı', joinedDate: '15.10.2023', phone: '0532 111 2233', email: 'merve.koc@ogr.esenyurt.edu.tr', status: 'Aktif' }
    ],
    memberApplications: [],
    posts: [
      {
        id: 'POST-CLB-201',
        author: { name: 'İESÜ Girişimcilik Kulübü', handle: '@iesugirisim', logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=250&q=80', verified: true },
        location: 'İESÜ Kuluçka Merkezi',
        images: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80'],
        filter: 'vibrant',
        music: { title: 'Elevate Business Momentum', artist: 'Campus Startup Lab', duration: '02:10' },
        caption: '💡 Yeni nesil girişim fikirleri Kuluçka Merkezimizde canlanıyor! Erken aşama girişim desteği için başvurular devam ediyor. #Startup #Girişimcilik #MelekYatırımcı',
        likes: 98,
        isLiked: false,
        comments: [],
        shares: 14,
        saved: false,
        createdAt: '3 gün önce'
      }
    ],
    highlights: [
      { id: 'HL-21', title: 'Pitching', icon: '🎤', cover: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=200&q=80' },
      { id: 'HL-22', title: 'Yatırımcılar', icon: '💼', cover: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80' }
    ]
  },
  {
    id: 'CLUB-003',
    code: 'club_ieee_iesu',
    name: 'IEEE İESÜ Öğrenci Kolu',
    shortName: 'IEEE',
    category: 'Bilim, Teknoloji ve Mühendislik',
    establishedYear: 2019,
    status: 'Aktif',
    memberCount: 210,
    advisor: 'Prof. Dr. Kemal Vural (Elektrik-Elektronik Müh.)',
    advisorEmail: 'kemal.vural@esenyurt.edu.tr',
    presidentId: 'STU-018',
    president: {
      id: 'STU-018',
      name: 'Ayşe Nur Demir',
      studentNo: '2023030114',
      tcKimlik: '59102938401',
      department: 'Elektrik-Elektronik Mühendisliği',
      year: '3. Sınıf',
      email: 'ayse.demir@ogr.esenyurt.edu.tr',
      phone: '0535 444 7722'
    },
    budget: {
      allocated: 50000,
      spent: 22000,
      remaining: 28000,
      currency: '₺',
      fiscalYear: '2026-2027'
    },
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=250&q=80',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    description: 'Dünyanın en büyük teknik mesleki örgütü olan IEEE bünyesinde; CS, WIE ve RAS komiteleriyle uluslararası düzeyde mühendislik etkinlikleri yürütür.',
    purpose: 'Mühendislik öğrencilerinin küresel standartlarda teknik bilgi ve mesleki ağ geliştirmelerini desteklemek.',
    authorizedOfficers: [
      { id: 'STU-018', name: 'Ayşe Nur Demir', role: 'Kol Başkanı', email: 'ayse.demir@ogr.esenyurt.edu.tr' }
    ],
    boardMembers: [
      { id: 'BM-301', name: 'Ayşe Nur Demir', role: 'Kol Başkanı', department: 'Elektrik-Elektronik Müh. (3. Sınıf)', studentNo: '2023030114', email: 'ayse.demir@ogr.esenyurt.edu.tr' },
      { id: 'BM-302', name: 'Prof. Dr. Kemal Vural', role: 'Akademik Danışman', department: 'Mühendislik Fakültesi', email: 'kemal.vural@esenyurt.edu.tr' },
      { id: 'BM-303', name: 'Ozan Tekin', role: 'RAS Komite Lideri', department: 'Mekatronik Mühendisliği', studentNo: '2024010319', email: 'ozan.tekin@ogr.esenyurt.edu.tr' }
    ],
    events: [
      {
        id: 'CLB-EVT-301',
        title: 'IEEE Xplore Akademik Yayın & İnovasyon Semineri',
        category: 'Akademik Seminer',
        date: '19 Kasım 2026',
        time: '14:00 - 16:30',
        location: 'Ömer Halisdemir Konferans Salonu',
        quota: 100,
        registeredCount: 65,
        status: 'Yaklaşan',
        description: 'Uluslararası indeksli dergilerde araştırma makalesi yazımı ve patent tarama teknikleri.'
      }
    ],
    announcements: [
      { id: 'ANN-401', title: 'IEEE Global Student Congress Delegasyon Başvuruları', date: '22 Eylül 2026', isImportant: true, content: 'Bu yıl düzenlenecek uluslararası öğrenci kongresine kulübümüzü temsilen katılacak delege seçimi yapılacaktır.' }
    ],
    budgetRequests: [],
    members: [
      { id: 'STU-018', studentNo: '2023030114', tcKimlik: '59102938401', name: 'Ayşe Nur Demir', department: 'Elektrik-Elektronik Müh.', grade: '3. Sınıf', role: 'Kol Başkanı', joinedDate: '12.10.2023', phone: '0535 444 7722', email: 'ayse.demir@ogr.esenyurt.edu.tr', status: 'Aktif' },
      { id: 'STU-019', studentNo: '2024010319', tcKimlik: '68192038491', name: 'Ozan Tekin', department: 'Mekatronik Mühendisliği', grade: '2. Sınıf', role: 'RAS Komite Lideri', joinedDate: '15.10.2023', phone: '0532 555 8899', email: 'ozan.tekin@ogr.esenyurt.edu.tr', status: 'Aktif' }
    ],
    memberApplications: [],
    posts: [
      {
        id: 'POST-CLB-301',
        author: { name: 'IEEE İESÜ Öğrenci Kolu', handle: '@iesuieee', logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=250&q=80', verified: true },
        location: 'Ömer Halisdemir Konferans Salonu',
        images: ['https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80'],
        filter: 'cinema',
        music: { title: 'Global Tech Leadership', artist: 'IEEE Spectrum Beats', duration: '03:00' },
        caption: '🌐 IEEE İESÜ olarak küresel mühendislik standartlarını kampüsümüze taşımaya devam ediyoruz! Yeni dönem komite üye alımları başladı. #IEEE #Engineering #Technology #İESÜ',
        likes: 112,
        isLiked: false,
        comments: [],
        shares: 19,
        saved: false,
        createdAt: '4 gün önce'
      }
    ],
    highlights: [
      { id: 'HL-31', title: 'IEEE Day', icon: '🌍', cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=200&q=80' }
    ]
  },
  {
    id: 'CLUB-004',
    code: 'club_kariyer_liderlik',
    name: 'Kariyer ve Kişisel Gelişim Kulübü',
    shortName: 'KKGK',
    category: 'Kariyer ve Sosyal Sorumluluk',
    establishedYear: 2022,
    status: 'Aktif',
    memberCount: 165,
    advisor: 'Dr. Öğr. Üyesi Mutlu Gülsev Yağız',
    advisorEmail: 'myagiz@esenyurt.edu.tr',
    presidentId: 'STU-024',
    president: {
      id: 'STU-024',
      name: 'Caner Arslan',
      studentNo: '2023040188',
      tcKimlik: '38192049182',
      department: 'Psikoloji',
      year: '3. Sınıf',
      email: 'caner.arslan@ogr.esenyurt.edu.tr',
      phone: '0536 888 1122'
    },
    budget: {
      allocated: 30000,
      spent: 8000,
      remaining: 22000,
      currency: '₺',
      fiscalYear: '2026-2027'
    },
    logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=250&q=80',
    coverImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    description: 'Öğrencilerimizin mülakat yetkinlikleri, CV hazırlama, beden dili ve profesyonel iletişim alanlarında bireysel gelişimlerine odaklanan kariyer kulübüdür.',
    purpose: 'Üniversite-sanayi iş birliğiyle mülakat simülasyonları ve şirket gezileri düzenlemek.',
    authorizedOfficers: [
      { id: 'STU-024', name: 'Caner Arslan', role: 'Kulüp Başkanı', email: 'caner.arslan@ogr.esenyurt.edu.tr' }
    ],
    boardMembers: [
      { id: 'BM-401', name: 'Caner Arslan', role: 'Kulüp Başkanı', department: 'Psikoloji (3. Sınıf)', studentNo: '2023040188', email: 'caner.arslan@ogr.esenyurt.edu.tr' },
      { id: 'BM-402', name: 'Dr. Öğr. Üyesi Mutlu Gülsev Yağız', role: 'Akademik Danışman', department: 'İktisadi ve İdari Bilimler', email: 'myagiz@esenyurt.edu.tr' }
    ],
    events: [
      {
        id: 'CLB-EVT-401',
        title: 'İK Direktörleriyle Birebir Mülakat Simülasyonu',
        category: 'Kariyer Atölyesi',
        date: '05 Aralık 2026',
        time: '13:30 - 17:00',
        location: 'Merkez Kütüphane Seminer Salonu',
        quota: 50,
        registeredCount: 42,
        status: 'Yaklaşan',
        description: 'Öğrenciler kurumsal İK uzmanlarıyla canlı vaka mülakatlarına katılacak.'
      }
    ],
    announcements: [
      { id: 'ANN-402', title: 'Güz Dönemi CV & LinkedIn Danışmanlığı Randevuları Açıldı', date: '18 Eylül 2026', isImportant: false, content: 'Haftalık birebir profil inceleme oturumlarımız başlamıştır.' }
    ],
    budgetRequests: [],
    members: [
      { id: 'STU-024', studentNo: '2023040188', tcKimlik: '38192049182', name: 'Caner Arslan', department: 'Psikoloji', grade: '3. Sınıf', role: 'Kulüp Başkanı', joinedDate: '15.11.2023', phone: '0536 888 1122', email: 'caner.arslan@ogr.esenyurt.edu.tr', status: 'Aktif' }
    ],
    memberApplications: [],
    posts: [
      {
        id: 'POST-CLB-401',
        author: { name: 'Kariyer ve Gelişim Kulübü', handle: '@iesukariyer', logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=250&q=80', verified: true },
        location: 'İESÜ Kampüs Meydanı',
        images: ['https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1000&q=80'],
        filter: 'vibrant',
        music: { title: 'Ambition & Success', artist: 'Campus Career Studio', duration: '02:15' },
        caption: '🎯 Profesyonel hayata sağlam adımlarla hazırlanmak için Kariyer ve Kişisel Gelişim Kulübü yanınızda! 💼✨ #Kariyer #Liderlik #Gelişim #İESÜ',
        likes: 85,
        isLiked: false,
        comments: [],
        shares: 12,
        saved: false,
        createdAt: '1 hafta önce'
      }
    ],
    highlights: [
      { id: 'HL-41', title: 'Atölyeler', icon: '🎯', cover: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=200&q=80' }
    ]
  },
  {
    id: 'CLUB-005',
    code: 'club_robotik_otomasyon',
    name: 'İESÜ Yapay Zeka ve Robotik Topluluğu',
    shortName: 'YAZERO',
    category: 'Bilim, Teknoloji ve Mühendislik',
    establishedYear: 2023,
    status: 'Aktif',
    memberCount: 195,
    advisor: 'Dr. Öğr. Üyesi Deniz Demir (Mühendislik Fakültesi)',
    advisorEmail: 'deniz.demir@esenyurt.edu.tr',
    presidentId: 'STU-031',
    president: {
      id: 'STU-031',
      name: 'Mehmet Can Vural',
      studentNo: '2023010915',
      tcKimlik: '29102938192',
      department: 'Bilgisayar Mühendisliği',
      year: '3. Sınıf',
      email: 'mehmetcan.vural@ogr.esenyurt.edu.tr',
      phone: '0542 333 4455'
    },
    budget: {
      allocated: 40000,
      spent: 14000,
      remaining: 26000,
      currency: '₺',
      fiscalYear: '2026-2027'
    },
    logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=250&q=80',
    coverImage: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=80',
    description: 'Üniversitemizi TEKNOFEST, TÜBİTAK ve uluslararası robotik yarışmalarında temsil eden; otonom araçlar, İHA aviyonikleri, derin öğrenme ve gömülü sistemler geliştiren teknik topluluktur.',
    purpose: 'Kampüsümüzde öğrencilere yönelik uygulamalı robotik ve makine öğrenimi atölyeleri kurarak donanım ve yazılım alanında nitelikli mühendisler yetiştirmek.',
    authorizedOfficers: [
      { id: 'STU-031', name: 'Mehmet Can Vural', role: 'Topluluk Başkanı', email: 'mehmetcan.vural@ogr.esenyurt.edu.tr' },
      { id: 'STU-032', name: 'Selin Aksoy', role: 'Başkan Yardımcısı', email: 'selin.aksoy@ogr.esenyurt.edu.tr' },
      { id: 'STU-033', name: 'Eren Yılmaz', role: 'Teknik Takım Kaptanı', email: 'eren.yilmaz@ogr.esenyurt.edu.tr' }
    ],
    boardMembers: [
      { id: 'BM-501', name: 'Mehmet Can Vural', role: 'Topluluk Başkanı', department: 'Bilgisayar Mühendisliği (3. Sınıf)', studentNo: '2023010915', email: 'mehmetcan.vural@ogr.esenyurt.edu.tr' },
      { id: 'BM-502', name: 'Dr. Öğr. Üyesi Deniz Demir', role: 'Akademik Danışman', department: 'Mühendislik Fakültesi', email: 'deniz.demir@esenyurt.edu.tr' },
      { id: 'BM-503', name: 'Selin Aksoy', role: 'Başkan Yardımcısı', department: 'Elektrik-Elektronik Müh.', studentNo: '2023030421', email: 'selin.aksoy@ogr.esenyurt.edu.tr' },
      { id: 'BM-504', name: 'Eren Yılmaz', role: 'Teknik Takım Kaptanı', department: 'Mekatronik Müh.', studentNo: '2024010882', email: 'eren.yilmaz@ogr.esenyurt.edu.tr' }
    ],
    events: [
      {
        id: 'CLB-EVT-501',
        title: 'TEKNOFEST 2026 İHA ve Otonom Sistemler Çalıştayı',
        category: 'Teknik Çalıştay',
        date: '12 Kasım 2026',
        time: '14:00 - 18:00',
        location: 'Ömer Halisdemir Konferans Salonu',
        quota: 150,
        registeredCount: 92,
        status: 'Yaklaşan',
        description: 'İHA mekanik tasarımı, ROS2 haberleşme mimarisi ve sensör füzyonu üzerine pratik kodlama oturumu.'
      }
    ],
    announcements: [
      { id: 'ANN-501', title: 'Robotik Atölyesi Takım Seçmeleri Başladı', date: '21 Eylül 2026', isImportant: true, content: 'İHA, Savaşan İHA ve Robotaksi takımlarımıza katılmak isteyen mühendislik öğrencileri için başvuru formu açılmıştır.' }
    ],
    budgetRequests: [
      {
        id: 'REQ-501',
        title: 'Robotik Takım Çalışma Alanı & Laboratuvar Tahsisi',
        requestedVenue: 'Mühendislik Lab 304 & Fuaye',
        venue: 'Mühendislik Lab 304 & Fuaye',
        eventDate: '15 Ekim 2026',
        startTime: '10:00',
        endTime: '18:00',
        expectedAttendees: 60,
        equipment: ['Ses Sistemi & Kürsü Mikrofonu', 'Çift Projeksiyon & HDMI Çoklayıcı', 'Kokteyl & Grup Çalışma Masaları'],
        requestedDate: '20.09.2026',
        requester: 'Mehmet Can Vural (Topluluk Başkanı)',
        status: 'approved',
        approvalNote: 'Mühendislik Fakültesi Dekanlığı ve SKS tarafından onaylanmıştır.'
      }
    ],
    members: [
      { id: 'STU-031', studentNo: '2023010915', tcKimlik: '29102938192', name: 'Mehmet Can Vural', department: 'Bilgisayar Mühendisliği', grade: '3. Sınıf', role: 'Topluluk Başkanı', joinedDate: '18.10.2023', phone: '0542 333 4455', email: 'mehmetcan.vural@ogr.esenyurt.edu.tr', status: 'Aktif' },
      { id: 'STU-032', studentNo: '2023030421', tcKimlik: '39201948192', name: 'Selin Aksoy', department: 'Elektrik-Elektronik Müh.', grade: '3. Sınıf', role: 'Başkan Yardımcısı', joinedDate: '22.10.2023', phone: '0533 222 9911', email: 'selin.aksoy@ogr.esenyurt.edu.tr', status: 'Aktif' },
      { id: 'STU-033', studentNo: '2024010882', tcKimlik: '49201948291', name: 'Eren Yılmaz', department: 'Mekatronik Mühendisliği', grade: '2. Sınıf', role: 'Teknik Takım Kaptanı', joinedDate: '05.11.2023', phone: '0535 777 4433', email: 'eren.yilmaz@ogr.esenyurt.edu.tr', status: 'Aktif' },
      { id: 'STU-034', studentNo: '2024010551', tcKimlik: '59201948392', name: 'Büşra Çelik', department: 'Endüstri Mühendisliği', grade: '2. Sınıf', role: 'Aktif Üye', joinedDate: '12.11.2023', phone: '0531 888 2211', email: 'busra.celik@ogr.esenyurt.edu.tr', status: 'Aktif' }
    ],
    memberApplications: [
      {
        id: 'APP-MEM-501',
        studentId: 'STU-109',
        studentNo: '2024010772',
        tcKimlik: '19203948192',
        name: 'Oğuzhan Kaya',
        department: 'Bilgisayar Mühendisliği',
        grade: '1. Sınıf',
        email: 'oguzhan.kaya@ogr.esenyurt.edu.tr',
        phone: '0541 666 3322',
        reason: 'Gömülü sistemler ve Python ile görüntü işleme alanlarında projeler üretmek istiyorum.',
        appliedAt: '24 Eylül 2026',
        status: 'pending'
      }
    ],
    posts: [
      {
        id: 'POST-CLB-501',
        author: {
          name: 'İESÜ Yapay Zeka ve Robotik Topluluğu',
          handle: '@iesurobotics',
          logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=250&q=80',
          verified: true
        },
        location: 'İESÜ Robotik Ar-Ge Laboratuvarı',
        images: [
          'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80'
        ],
        filter: 'vibrant',
        music: {
          title: 'Autonomous Flight Horizons',
          artist: 'İESÜ Future Sound',
          duration: '02:45'
        },
        caption: '🤖 Otonom İHA aviyonik kartlarımızın ilk prototip testlerini başarıyla gerçekleştirdik! TEKNOFEST 2026 hedefimize emin adımlarla ilerliyoruz. Takımımıza katılmak için başvuruları kaçırmayın! 🚁✨ #İESÜ #Robotik #YapayZeka #TEKNOFEST #Mühendislik',
        likes: 178,
        isLiked: false,
        comments: [
          { id: 1, user: 'selin.aksoy', name: 'Selin Aksoy', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', text: 'Tüm ekibin ellerine sağlık, test uçuşu harikaydı! 🎯🚀', time: '3 saat önce' }
        ],
        shares: 31,
        saved: false,
        createdAt: '5 saat önce'
      }
    ],
    highlights: [
      { id: 'HL-51', title: 'İHA Test', icon: '🚁', cover: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=200&q=80' },
      { id: 'HL-52', title: 'Laboratuvar', icon: '⚡', cover: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=200&q=80' },
      { id: 'HL-53', title: 'TEKNOFEST', icon: '🏆', cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=200&q=80' }
    ]
  }
];

export const initialClubApplications = [
  {
    id: 'APP-CLB-101',
    type: 'new_club',
    name: 'Yapay Zeka ve Robotik Topluluğu',
    category: 'Bilim ve Teknoloji',
    applicant: 'Mehmet Can Vural',
    userId: 'STU-031',
    advisorName: 'Dr. Öğr. Üyesi Deniz Demir',
    purpose: 'TEKNOFEST İHA ve Savaşan İHA kategorilerine üniversitemizi temsilen yarışmacı takımlar hazırlamak ve kampüste robotik atölyesi kurmak.',
    status: 'pending',
    date: '22 Eylül 2026',
    estimatedMembers: 35
  },
  {
    id: 'APP-CLB-102',
    type: 'new_club',
    name: 'Sürdürülebilir Enerji ve Çevre Kulübü',
    category: 'Sosyal Sorumluluk & Çevre',
    applicant: 'Ceren Aksoy',
    userId: 'STU-042',
    advisorName: 'Doç. Dr. Hakan Erdem',
    purpose: 'Sıfır atık, güneş enerjisi ve yeşil kampüs inisiyatiflerini kampüste projelendirmek.',
    status: 'approved',
    date: '15 Ağustos 2026',
    estimatedMembers: 40
  },
  {
    id: 'APP-BUD-201',
    type: 'event_budget',
    club: 'İESÜ Yazılım ve İnovasyon Kulübü',
    eventName: 'İESÜ Hackathon 2026 Organizasyon & Yer Tahsisi',
    venue: 'Ömer Halisdemir Konferans Salonu & Fuaye',
    eventDate: '18-19 Ekim 2026',
    startTime: '09:00',
    endTime: '19:00',
    expectedAttendees: 150,
    equipment: ['Ses Sistemi & Kürsü', '4 Adet Kablosuz Mikrofon', 'Projeksiyon & HDMI', '30 Adet Çalışma Masası', 'Afiş Asma İzni'],
    requesterName: 'Mehmet Kerem Yılmaz',
    requesterRole: 'Kulüp Başkanı',
    assignedBudget: '15.000 TL',
    status: 'approved',
    date: '10 Eylül 2026',
    description: 'Etkinlik yer tahsisi, kokteyl alanı ve misafir jüri konuşmacı teknik donanım talebi.'
  },
  {
    id: 'APP-BUD-202',
    type: 'event_budget',
    club: 'İESÜ Yazılım ve İnovasyon Kulübü',
    eventName: 'Bootcamp Sunucu & GPU Bulut Hesap Desteği',
    venue: 'Bilgisayar Lab 402',
    eventDate: '26 Ekim 2026',
    startTime: '13:00',
    endTime: '17:30',
    expectedAttendees: 45,
    equipment: ['Lab Bilgisayarlarında Yönetici Erişimi', 'Projeksiyon Cihazı'],
    requesterName: 'Zeynep Kaya',
    requesterRole: 'Başkan Yardımcısı',
    assignedBudget: '8.500 TL',
    status: 'pending',
    date: '21 Eylül 2026',
    description: 'Öğrencilerin derin öğrenme modellerini çalıştırabilmesi için laboratuvar tahsisi.'
  },
  {
    id: 'APP-BUD-203',
    type: 'event_budget',
    club: 'İESÜ Girişimcilik ve İnovasyon Kulübü',
    eventName: 'Startup Demo Day & Yatırımcı Zirvesi',
    venue: 'A Blok Konferans Salonu',
    eventDate: '28 Kasım 2026',
    startTime: '13:00',
    endTime: '17:00',
    expectedAttendees: 120,
    equipment: ['Sahne Kurulumu', '2 Adet Yaka Mikrofonu', 'Roll-up ve Stant Alanı'],
    requesterName: 'Berkant Özdemir',
    requesterRole: 'Kulüp Başkanı',
    assignedBudget: '12.000 TL',
    status: 'pending',
    date: '23 Eylül 2026',
    description: 'Etkinlik sahne kurulumu, tanıtım roll-up ve stant materyalleri için salon tahsisi.'
  }
];

export const initialCareerTestSubmissions = [
  {
    id: 'TEST-101',
    studentId: 'STU-001',
    studentName: 'Ahmet Yılmaz',
    studentDept: 'Bilgisayar Mühendisliği',
    studentEmail: 'ahmet.yilmaz@ogr.esenyurt.edu.tr',
    personaTitle: 'Sistem Mimarı & Analitik Stratejist',
    personaBadge: 'Yüksek Analitik Yatkınlık',
    scores: {
      percent: { logic: 55, practical: 25, creative: 12, social: 8 },
      raw: { logic: 40, practical: 18, creative: 9, social: 6 }
    },
    recommendedPaths: [
      'Yazılım & Sistem Mimarisi',
      'Veri Bilimi ve İleri Analitik',
      'Siber Güvenlik & Kriptografi'
    ],
    recommendedClubs: ['İESÜ Yazılım ve İnovasyon Kulübü', 'IEEE İESÜ Öğrenci Kolu'],
    status: 'Değerlendirildi',
    submittedAt: '2026-09-24T14:32:00.000Z',
    counselorNotes: 'Öğrencinin analitik skorları çok yüksek. Savunma sanayiinde sistem yazılımları stajına yönlendirilmesi önerildi.'
  },
  {
    id: 'TEST-102',
    studentId: 'STU-002',
    studentName: 'Zeynep Kaya',
    studentDept: 'Yazılım Mühendisliği',
    studentEmail: 'zeynep.kaya@ogr.esenyurt.edu.tr',
    personaTitle: 'Vizyoner Tasarımcı & İnovatör',
    personaBadge: 'Yüksek Yaratıcı & Tasarım Yatkınlığı',
    scores: {
      percent: { creative: 48, logic: 28, social: 14, practical: 10 },
      raw: { creative: 38, logic: 22, social: 11, practical: 8 }
    },
    recommendedPaths: [
      'UI/UX ve Dijital Ürün Tasarımı',
      'Girişimcilik & Konsept Geliştirme',
      'Marka Stratejisi & Büyüme'
    ],
    recommendedClubs: ['İESÜ Girişimcilik ve İnovasyon Kulübü', 'İESÜ Yazılım ve İnovasyon Kulübü'],
    status: 'Görüşme Planlandı',
    submittedAt: '2026-09-23T11:15:00.000Z',
    counselorNotes: 'Tasarım ve ürün vizyonu kuvvetli. Logo Yazılım UI ekibiyle görüşme ayarlanacak.'
  },
  {
    id: 'TEST-103',
    studentId: 'STU-005',
    studentName: 'Caner Şahin',
    studentDept: 'Yönetim Bilişim Sistemleri',
    studentEmail: 'caner.sahin@ogr.esenyurt.edu.tr',
    personaTitle: 'Lider & İnsan Odaklı Yönetici',
    personaBadge: 'Yüksek İletişim & Sosyal Zeka',
    scores: {
      percent: { social: 52, logic: 24, practical: 16, creative: 8 },
      raw: { social: 42, logic: 19, practical: 13, creative: 6 }
    },
    recommendedPaths: [
      'Proje ve Çevik (Agile) Süreç Yöneticiliği',
      'İnsan Kaynakları & Yetenek Yönetimi',
      'Stratejik İş Geliştirme'
    ],
    recommendedClubs: ['Kariyer ve Kişisel Gelişim Kulübü', 'İESÜ Yazılım ve İnovasyon Kulübü'],
    status: 'Danışmanlık Tamamlandı',
    submittedAt: '2026-09-20T09:45:00.000Z',
    counselorNotes: 'Scrum Master ve ürün yöneticisi kariyer patikası için KGB planı çıkarıldı.'
  }
];
