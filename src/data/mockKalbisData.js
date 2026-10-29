/**
 * src/data/mockKalbisData.js
 * İstanbul Esenyurt Üniversitesi (İESÜ) KALBİS Kalite Güvencesi Bilgi Yönetim Sistemi Veri Havuzu
 */

export const KALBIS_ENVIRONMENTAL_METRICS = {
  digitalDocuments: '1.776',
  digitalPages: '10.407',
  paperSavedKg: '20 kg',
  co2ReducedKg: '44 kg',
  waterSavedL: '292 L',
  treeEquivalent: '0,5',
  year: '2026',
  footnote: 'Değerler, dijital yürütülen süreçlerin fiziksel basımla gerçekleştirilmesi hâlinde oluşacağı varsayılan kâğıt tüketimi üzerinden tahmin edilmiştir (KK onaylı LCA katsayıları + baskı baz-senaryo varsayımları). 2026 yılı: 1.775 belge, 10.407 sayfa.'
};

export const KALBIS_ROLES = [
  {
    id: 'akademik_personel',
    title: 'Akademik Personel',
    name: 'Mutlu Gülsev YAĞIZ',
    initials: 'MGY',
    department: 'SİVİL HAVA ULAŞTIRMA İŞLETMECİLİĞİ PROGRAMI',
    faculty: 'Meslek Yüksekokulu',
    isPrimary: true
  },
  {
    id: 'koordinatorluk_yoneticisi',
    title: 'Koordinatörlük Yöneticisi',
    name: 'Kariyer Geliştirme Koordinatörlüğü',
    initials: 'KGK',
    department: 'Kariyer Geliştirme Koordinatörlüğü',
    faculty: 'Rektörlük Birimleri',
    isPrimary: false
  }
];

export const KALBIS_COMMISSIONS = [
  {
    id: 'KOM-01',
    name: 'Rektörlük Kalite Komisyonu',
    type: 'Rektörlük',
    president: 'Prof. Dr. Rektör Yardımcısı',
    membersCount: 14,
    meetingsThisYear: 8,
    activeTasks: 5,
    pukoPhase: 'Kontrol Et',
    status: 'Aktif',
    lastDecisionDate: '24 Ekim 2026',
    description: 'Üniversite genelinde kalite güvencesi kültürünün yaygınlaştırılması ve YÖKAK Kurumsal Akreditasyon Programı (KAP) koordinasyonu.'
  },
  {
    id: 'KOM-02',
    name: 'Mühendislik ve Doğa Bilimleri Fakülte Kalite Komisyonu',
    type: 'Akademik Birim',
    president: 'Prof. Dr. Fakülte Dekanı',
    membersCount: 9,
    meetingsThisYear: 6,
    activeTasks: 3,
    pukoPhase: 'Uygula',
    status: 'Aktif',
    lastDecisionDate: '18 Ekim 2026',
    description: 'MÜDEK akreditasyon hazırlıkları ve mühendislik bölümleri program çıktıları matrisi incelemesi.'
  },
  {
    id: 'KOM-03',
    name: 'Sivil Hava Ulaştırma İşletmeciliği Program Değerlendirme Komisyonu',
    type: 'Program',
    president: 'Öğr. Gör. Mutlu Gülsev YAĞIZ',
    membersCount: 5,
    meetingsThisYear: 4,
    activeTasks: 2,
    pukoPhase: 'Planla',
    status: 'Aktif',
    lastDecisionDate: '12 Ekim 2026',
    description: 'Havacılık sektörü danışma kurulu geri bildirimleri doğrultusunda ders planı güncellemesi ve staj komisyonu eşgüdümü.'
  },
  {
    id: 'KOM-04',
    name: 'Eğitim-Öğretim Tutarlılık Komisyonu',
    type: 'Tutarlılık',
    president: 'Doç. Dr. Kalite Koordinatörü',
    membersCount: 7,
    meetingsThisYear: 5,
    activeTasks: 4,
    pukoPhase: 'Önlem Al',
    status: 'Aktif',
    lastDecisionDate: '20 Ekim 2026',
    description: 'Tüm fakülte ve enstitü ders bilgi paketlerinin (Bologna) TYYÇ düzeyleri ile tutarlılığının kontrolü.'
  },
  {
    id: 'KOM-05',
    name: 'Kariyer Geliştirme ve Mezun İzleme Komisyonu',
    type: 'İdari Birim',
    president: 'Kariyer Geliştirme Koordinatörü',
    membersCount: 8,
    meetingsThisYear: 7,
    activeTasks: 6,
    pukoPhase: 'Uygula',
    status: 'Aktif',
    lastDecisionDate: '22 Ekim 2026',
    description: 'Mezun istihdam izleme anketleri, işveren memnuniyet endeksi ve staj süreçleri kalite denetimleri.'
  },
  {
    id: 'KOM-06',
    name: 'Sürekli Eğitim ve Yaşam Boyu Öğrenme Komisyonu (SEM)',
    type: 'UYGAR',
    president: 'Dr. Öğr. Üyesi SEM Müdürü',
    membersCount: 6,
    meetingsThisYear: 3,
    activeTasks: 2,
    pukoPhase: 'Planla',
    status: 'Aktif',
    lastDecisionDate: '10 Ekim 2026',
    description: 'Sertifika programlarının mikroyeterlilik standartlarına uyumu ve kalite güvencesi onay mekanizması.'
  }
];

export const KALBIS_DOIF_RECORDS = [
  {
    id: 'DOIF-2026-089',
    title: 'Havacılık Simülatör Laboratuvarı Yazılım Güncellemesi ve Periyodik Kalibrasyon',
    source: 'Program Özdeğerlendirme Raporu',
    department: 'Sivil Hava Ulaştırma İşletmeciliği',
    responsible: 'Öğr. Gör. Mutlu Gülsev YAĞIZ',
    pukoLetter: 'P',
    pukoPhase: 'Planla',
    status: 'Açık',
    targetDate: '15 Kasım 2026',
    evidenceCount: 3,
    priority: 'Yüksek',
    rootCause: 'Simülatör yazılım lisansının güncellenmemesi nedeniyle uluslararası sivil havacılık regülasyonlarında belirtilen yeni senaryoların test edilememesi.',
    plannedAction: 'BIDB ve SHGM akredite yazılım sağlayıcısıyla bakım protokolü imzalanması ve kalibrasyon sertifikasının alınması.'
  },
  {
    id: 'DOIF-2026-074',
    title: 'Öğrenci Staj Kabul Form-1 Evraklarının %100 Dijital Onaya Taşınması',
    source: 'İç Tetkik Bulgusu',
    department: 'Kariyer Geliştirme Koordinatörlüğü',
    responsible: 'Kariyer Ofisi Uzmanı',
    pukoLetter: 'U',
    pukoPhase: 'Uygula',
    status: 'Uygulamada',
    targetDate: '30 Ekim 2026',
    evidenceCount: 5,
    priority: 'Kritik',
    rootCause: 'Fiziksel kağıt dolaşımında öğrencilerin fakülte ile işletme arasında evrak kaybetme riski ve SGK 5510 bildirim sürelerinin aksama riski.',
    plannedAction: 'İESÜ Kariyer Platformu Form-1 modülü üzerinden e-imzalı akışın devreye alınması ve fiziki evrakın kaldırılması.'
  },
  {
    id: 'DOIF-2026-061',
    title: 'Ders İzlencelerinde (Syllabus) Öğrenme Çıktıları ile Ölçme Matrisi Uyumu',
    source: 'Ölçme Değerlendirme Komisyonu',
    department: 'Mühendislik Fakültesi',
    responsible: 'Bölüm Başkanı',
    pukoLetter: 'K',
    pukoPhase: 'Kontrol Et',
    status: 'İncelemede',
    targetDate: '05 Kasım 2026',
    evidenceCount: 8,
    priority: 'Orta',
    rootCause: 'Bazı ara sınav sorularının ders öğrenme çıktılarıyla eşleşme puanlarının sisteme girilmemesi.',
    plannedAction: 'Tüm öğretim elemanlarına KALBİS Ders İşlemleri modülü üzerinden rubrik ve sınav analiz raporu eğitimi verilmesi.'
  },
  {
    id: 'DOIF-2026-042',
    title: 'Mezun İzleme Anketi Katılım Oranının %60 Üzerine Çıkarılması',
    source: 'Dış Paydaş Geri Bildirimi',
    department: 'Mezun İlişkileri Koordinatörlüğü',
    responsible: 'Koordinatörlük Yöneticisi',
    pukoLetter: 'Ö',
    pukoPhase: 'Önlem Al',
    status: 'Tamamlandı',
    targetDate: '10 Ekim 2026',
    evidenceCount: 12,
    priority: 'Yüksek',
    rootCause: 'Mezun iletişim bilgilerinin güncel tutulmasında yaşanan zorluklar.',
    plannedAction: 'Mezun portalı tekil kimlik doğrulaması ve kariyer avantaj kartı (İESÜ Mezun Kartı) teşvikleri ile veri güncelleme oranının artırılması.'
  }
];

export const KALBIS_COURSE_FILES = [
  {
    code: 'SHU-201',
    name: 'Hava Trafik Yönetimi ve Seyrüsefer',
    instructor: 'Öğr. Gör. Mutlu Gülsev YAĞIZ',
    term: '2026 Güz',
    syllabusReady: true,
    examKeyUploaded: true,
    samplePapersCount: 3,
    status: 'İncelendi (Onaylı)',
    score: 95
  },
  {
    code: 'SHU-205',
    name: 'Havacılık Güvenliği ve Kriz Yönetimi',
    instructor: 'Öğr. Gör. Mutlu Gülsev YAĞIZ',
    term: '2026 Güz',
    syllabusReady: true,
    examKeyUploaded: true,
    samplePapersCount: 3,
    status: 'İncelendi (Onaylı)',
    score: 92
  },
  {
    code: 'CENG-301',
    name: 'Yazılım Mühendisliği ve Kalite Standartları',
    instructor: 'Dr. Öğr. Üyesi Ahmet Kaya',
    term: '2026 Güz',
    syllabusReady: true,
    examKeyUploaded: false,
    samplePapersCount: 1,
    status: 'Eksik Var',
    score: 70
  },
  {
    code: 'END-402',
    name: 'Yalın Üretim ve Süreç İyileştirme',
    instructor: 'Doç. Dr. Selin Doğan',
    term: '2026 Güz',
    syllabusReady: true,
    examKeyUploaded: true,
    samplePapersCount: 3,
    status: 'İncelendi (Onaylı)',
    score: 98
  }
];

export const KALBIS_DATA_TASKS = [
  {
    id: 'TSK-01',
    title: '2026 Yılı Kurumsal Özdeğerlendirme Raporu (KİDR) Birim Kanıt Girişi',
    deadline: '15 Kasım 2026',
    category: 'YÖKAK Ölçütleri',
    progress: 78,
    status: 'Devam Ediyor',
    unit: 'Tüm Birimler',
    pukoCode: 'Liderlik, Yönetişim ve Kalite'
  },
  {
    id: 'TSK-02',
    title: 'Güz Dönemi Öğrenci Ders Değerlendirme Anketi Sonuç Raporu',
    deadline: '30 Kasım 2026',
    category: 'Eğitim ve Öğretim',
    progress: 45,
    status: 'Devam Ediyor',
    unit: 'Öğrenci İşleri & Kalite Komisyonu',
    pukoCode: 'Öğrenci Merkezli Öğrenme'
  },
  {
    id: 'TSK-03',
    title: 'Ar-Ge ve Toplumsal Katkı Faaliyetleri Kanıt Dokümanları Toplama',
    deadline: '20 Aralık 2026',
    category: 'Araştırma ve Geliştirme',
    progress: 90,
    status: 'Tamamlanmak Üzere',
    unit: 'TTO & Bilimsel Araştırma Projeleri',
    pukoCode: 'Araştırma Kaynakları'
  }
];

export const KALBIS_PROCESS_CARDS = [
  {
    id: 'SK-01',
    code: 'SK-KAL-001',
    title: 'Düzeltici ve Önleyici Faaliyet (DÖİF) Yönetim Süreci',
    owner: 'Kalite Koordinatörlüğü',
    inputs: ['İç tetkik bulguları', 'Paydaş geri bildirimleri', 'Akreditasyon raporları'],
    outputs: ['DÖİF takip formu', 'Kalıcı iyileştirme raporu', 'Revize süreç dokümanı'],
    puko: 'P - U - K - Ö (Tam Döngü)',
    cycleTime: '15 İş Günü',
    riskLevel: 'Kritik'
  },
  {
    id: 'SK-02',
    code: 'SK-EGT-014',
    title: 'Ders Dosyası İnceleme ve Akreditasyon Uyumluluk Süreci',
    owner: 'Eğitim-Öğretim Komisyonu',
    inputs: ['Ders izlencesi', 'Sınav soruları ve rubrikler', 'Öğrenci örnek çalışma dosyaları'],
    outputs: ['Ders inceleme karnesi', 'Program çıktıları gerçekleşme oranı'],
    puko: 'P - U - K',
    cycleTime: 'Dönem Sonu (10 Gün)',
    riskLevel: 'Yüksek'
  },
  {
    id: 'SK-03',
    code: 'SK-STJ-008',
    title: 'Staj ve İşletmede Mesleki Eğitim Kalite Güvencesi',
    owner: 'Kariyer Geliştirme Koordinatörlüğü',
    inputs: ['Form-1 Başvuru Belgesi', 'İşletme Kabul Beyanı', 'SGK 5510 Tescil Belgesi'],
    outputs: ['Stajyer Değerlendirme Notu', 'İşveren Memnuniyet Anketi Verisi'],
    puko: 'P - U - K - Ö',
    cycleTime: '30 İş Günü',
    riskLevel: 'Yüksek'
  }
];

export const KALBIS_NOTIFICATIONS = [
  {
    id: 'NOTIF-01',
    title: 'DÖİF-2026-089 için Son Tarih Yaklaşıyor',
    message: 'Havacılık simülatörü kalibrasyon planı için 15 Kasım son tarihtir.',
    date: 'Bugün, 14:20',
    type: 'warning',
    read: false
  },
  {
    id: 'NOTIF-02',
    title: 'Rektörlük Kalite Komisyonu Kararı Yayınlandı',
    message: '24 Ekim 2026 tarihli 8 sayılı toplantı kararı e-imzalı olarak sisteme yüklendi.',
    date: 'Dün, 10:15',
    type: 'info',
    read: false
  },
  {
    id: 'NOTIF-03',
    title: 'Yeşil Kampüs LCA Veri Doğrulaması Tamamlandı',
    message: 'Ekim ayı dijitalleşme çevresel tasarruf verileri başarıyla konsolide edildi.',
    date: '26 Ekim 2026',
    type: 'success',
    read: true
  }
];
