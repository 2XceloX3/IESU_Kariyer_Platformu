// İstanbul Esenyurt Üniversitesi — Gerçek Fakülte ve Bölüm Verileri
// Kaynak: https://www.esenyurt.edu.tr/akademik/fakulteler

export const IESU_FACULTIES = [
  {
    name: 'İşletme ve Yönetim Bilimleri Fakültesi',
    departments: [
      'Havacılık Yönetimi',
      'İşletme',
      'Siyaset Bilimi ve Uluslararası İlişkiler',
      'Uluslararası Ticaret ve Finansman',
      'Yönetim Bilişim Sistemleri',
      'Lojistik Yönetimi'
    ]
  },
  {
    name: 'Mühendislik ve Mimarlık Fakültesi',
    departments: [
      'Bilgisayar Mühendisliği',
      'Elektrik-Elektronik Mühendisliği',
      'Endüstri Mühendisliği',
      'İnşaat Mühendisliği',
      'Makine Mühendisliği',
      'Mimarlık',
      'Yazılım Mühendisliği',
      'İç Mimarlık'
    ]
  },
  {
    name: 'Sağlık Bilimleri Fakültesi',
    departments: [
      'Beslenme ve Diyetetik',
      'Fizyoterapi ve Rehabilitasyon',
      'Hemşirelik',
      'Sağlık Yönetimi',
      'Sosyal Hizmet',
      'Çocuk Gelişimi'
    ]
  },
  {
    name: 'Sanat ve Sosyal Bilimler Fakültesi',
    departments: [
      'Gastronomi ve Mutfak Sanatları',
      'Görsel İletişim Tasarımı',
      'İngilizce Mütercim ve Tercümanlık',
      'Psikoloji',
      'Radyo, Televizyon ve Sinema',
      'Yeni Medya ve İletişim',
      'Türk Dili ve Edebiyatı'
    ]
  },
  {
    name: 'Spor Bilimleri Fakültesi',
    departments: [
      'Antrenörlük Eğitimi',
      'Spor Yöneticiliği',
      'Rekreasyon'
    ]
  },
  {
    name: 'Uygulamalı Bilimler Fakültesi',
    departments: [
      'Finans ve Bankacılık',
      'Muhasebe ve Finans Yönetimi',
      'Sigortacılık ve Risk Yönetimi',
      'Uluslararası Lojistik Yönetimi'
    ]
  }
];

export const IESU_YUKSEKOKUL = [
  {
    name: 'Yabancı Diller Yüksekokulu',
    departments: [
      'İngilizce Hazırlık Programı'
    ]
  }
];

export const IESU_MYO = [
  {
    name: 'Bilişim Teknolojileri Meslek Yüksekokulu',
    departments: [
      'Bilgisayar Programcılığı',
      'Bilişim Güvenliği Teknolojisi',
      'İnternet ve Ağ Teknolojileri'
    ]
  },
  {
    name: 'Meslek Yüksekokulu',
    departments: [
      'Bankacılık ve Sigortacılık',
      'Büro Yönetimi ve Yönetici Asistanlığı',
      'Dış Ticaret',
      'Grafik Tasarımı',
      'İç Mekan Tasarımı',
      'İnsan Kaynakları Yönetimi',
      'Lojistik',
      'Medya ve İletişim',
      'Mimari Restorasyon',
      'Muhasebe ve Vergi Uygulamaları',
      'Sivil Havacılık Kabin Hizmetleri',
      'Turizm ve Otel İşletmeciliği',
      'Uçak Teknolojisi'
    ]
  },
  {
    name: 'Sağlık Hizmetleri Meslek Yüksekokulu',
    departments: [
      'Ağız ve Diş Sağlığı',
      'Ameliyathane Hizmetleri',
      'Anestezi',
      'Fizyoterapi',
      'İlk ve Acil Yardım',
      'Odyometri',
      'Optisyenlik',
      'Tıbbi Görüntüleme Teknikleri',
      'Tıbbi Laboratuvar Teknikleri',
      'Yaşlı Bakımı'
    ]
  }
];

export const IESU_ENSTITU = [
  {
    name: 'Lisansüstü Eğitim Enstitüsü',
    departments: [
      'İşletme (Yüksek Lisans)',
      'Siyaset Bilimi ve Uluslararası İlişkiler (Yüksek Lisans)',
      'İnşaat Mühendisliği (Yüksek Lisans)',
      'Elektrik-Elektronik Mühendisliği (Yüksek Lisans)',
      'Psikoloji (Yüksek Lisans)',
      'Mimarlık (Yüksek Lisans)',
      'Sağlık Yönetimi (Yüksek Lisans)'
    ]
  }
];

// Tüm bölümleri düz liste olarak döndürür
export function getAllDepartments() {
  const all = [];
  [...IESU_FACULTIES, ...IESU_MYO, ...IESU_YUKSEKOKUL, ...IESU_ENSTITU].forEach(unit => {
    unit.departments.forEach(dept => {
      all.push({ faculty: unit.name, department: dept });
    });
  });
  return all;
}

// Fakülte adlarını düz liste olarak döndürür
export function getAllFacultyNames() {
  return [
    ...IESU_FACULTIES.map(f => f.name),
    ...IESU_MYO.map(f => f.name),
    ...IESU_YUKSEKOKUL.map(f => f.name),
    ...IESU_ENSTITU.map(f => f.name)
  ];
}

// Bir fakültenin bölümlerini döndürür
export function getDepartmentsByFaculty(facultyName) {
  const unit = [...IESU_FACULTIES, ...IESU_MYO, ...IESU_YUKSEKOKUL, ...IESU_ENSTITU].find(f => f.name === facultyName);
  return unit ? unit.departments : [];
}
