/**
 * src/data/mockClubsData.js
 * Comprehensive initial data for Student Clubs, Club Applications (Forms & Budgets),
 * and Career & Competency Test Submissions for Istanbul Esenyurt University (İESÜ).
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
      department: 'Bilgisayar Mühendisliği',
      year: '3. Sınıf',
      email: 'kerem.yilmaz@ogr.esenyurt.edu.tr',
      phone: '0532 999 8811'
    },
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
    
    // Management Board
    boardMembers: [
      {
        id: 'BM-1',
        name: 'Mehmet Kerem Yılmaz',
        role: 'Kulüp Başkanı',
        department: 'Bilgisayar Mühendisliği (3. Sınıf)',
        email: 'kerem.yilmaz@ogr.esenyurt.edu.tr',
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
        email: 'zeynep.kaya@ogr.esenyurt.edu.tr',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        badge: 'Operasyon'
      },
      {
        id: 'BM-4',
        name: 'Caner Şahin',
        role: 'Genel Sekreter',
        department: 'Yönetim Bilişim Sistemleri (2. Sınıf)',
        email: 'caner.sahin@ogr.esenyurt.edu.tr',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        badge: 'İdari İşler'
      },
      {
        id: 'BM-5',
        name: 'Elif Yıldız',
        role: 'Sponsorluk & Dış İlişkiler Sorumlusu',
        department: 'Endüstri Mühendisliği (2. Sınıf)',
        email: 'elif.yildiz@ogr.esenyurt.edu.tr',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
        badge: 'Kurumsal İletişim'
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
        location: 'Merkez Kampüs Konferans Salonu & Fuaye',
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

    // Budget & Sponsorship Requests History
    budgetRequests: [
      {
        id: 'REQ-101',
        title: 'İESÜ Hackathon 2026 Organizasyon & Ödül Bütçesi',
        amount: '15.000 TL',
        requestedDate: '10.09.2026',
        status: 'approved',
        approvalNote: 'SKS Daire Başkanlığı ve Rektörlük Makamı tarafından onaylandı.',
        approvedAmount: '15.000 TL'
      },
      {
        id: 'REQ-102',
        title: 'Bootcamp Sunucu & GPU Bulut Hesap Desteği',
        amount: '8.500 TL',
        requestedDate: '21.09.2026',
        status: 'pending',
        approvalNote: 'Bütçe Dairesi değerlendirmesinde.'
      }
    ],

    // Registered members sample
    members: [
      { id: 'STU-001', name: 'Mehmet Kerem Yılmaz', department: 'Bilgisayar Mühendisliği', role: 'Başkan', joinedDate: 'Ekim 2023' },
      { id: 'STU-002', name: 'Zeynep Kaya', department: 'Yazılım Mühendisliği', role: 'Başkan Yardımcısı', joinedDate: 'Kasım 2023' },
      { id: 'STU-003', name: 'Ahmet Kaya', department: 'Bilgisayar Mühendisliği', role: 'Aktif Üye', joinedDate: 'Şubat 2024' },
      { id: 'STU-004', name: 'Selin Öztürk', department: 'Veri Bilimi ve Analitiği', role: 'Aktif Üye', joinedDate: 'Mart 2024' },
      { id: 'STU-005', name: 'Caner Şahin', department: 'Yönetim Bilişim Sistemleri', role: 'Genel Sekreter', joinedDate: 'Ekim 2024' },
      { id: 'STU-006', name: 'Elif Yıldız', department: 'Endüstri Mühendisliği', role: 'Kurul Üyesi', joinedDate: 'Kasım 2024' }
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
    boardMembers: [
      { id: 'BM-201', name: 'Berkant Özdemir', role: 'Kulüp Başkanı', department: 'Uluslararası Ticaret', email: 'berkant.o@ogr.esenyurt.edu.tr' },
      { id: 'BM-202', name: 'Doç. Dr. Selin Doğan', role: 'Danışman', department: 'İşletme Fakültesi', email: 'selin.dogan@esenyurt.edu.tr' }
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
    members: []
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
    description: 'Dünyanın en büyük teknik mesleki örgütü olan IEEE bünyesinde; CS (Computer Society), WIE (Women in Engineering) ve RAS (Robotics and Automation) komiteleriyle uluslararası düzeyde mühendislik etkinlikleri yürütür.',
    purpose: 'Mühendislik öğrencilerinin küresel standartlarda teknik bilgi ve mesleki ağ geliştirmelerini desteklemek.',
    boardMembers: [],
    events: [],
    announcements: [],
    budgetRequests: [],
    members: []
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
    boardMembers: [],
    events: [],
    announcements: [],
    budgetRequests: [],
    members: []
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
    eventName: 'İESÜ Hackathon 2026: Yapay Zeka Çözümleri',
    amount: '15.000 TL',
    location: 'Merkez Kampüs Konferans Salonu',
    status: 'approved',
    date: '10 Eylül 2026',
    description: 'Ödüller, yemek ikramı ve konuk jüri ulaşım giderleri için talep edilen bütçe.'
  },
  {
    id: 'APP-BUD-202',
    type: 'event_budget',
    club: 'İESÜ Yazılım ve İnovasyon Kulübü',
    eventName: 'Bootcamp Sunucu & GPU Bulut Hesap Desteği',
    amount: '8.500 TL',
    location: 'Bilgisayar Lab 402',
    status: 'pending',
    date: '21 Eylül 2026',
    description: 'Öğrencilerin derin öğrenme modellerini çalıştırabilmesi için 1 aylık AWS/Google Cloud eğitim kredisi.'
  },
  {
    id: 'APP-BUD-203',
    type: 'event_budget',
    club: 'İESÜ Girişimcilik ve İnovasyon Kulübü',
    eventName: 'Startup Demo Day & Yatırımcı Zirvesi',
    amount: '12.000 TL',
    location: 'A Blok Fuaye Alanı',
    status: 'pending',
    date: '23 Eylül 2026',
    description: 'Etkinlik sahne kurulumu, tanıtım roll-up ve stant materyalleri.'
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
