# Integration Blueprint & Data Mapping Specification
**Project**: IESU Kariyer Platformu Data Integration & QA  
**Author**: Explorer 3 (Integration Blueprint Designer)  
**Date**: 2026-07-24  
**Target Folder**: `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu\.agents\explorer_m1_3\mapping_blueprint.md`

---

## 1. Executive Summary & Objective

This document defines the integration blueprint for mapping real extracted web data from **İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi Koordinatörlüğü** into the frontend data layer files located under `src/utils/`.

It also provides actionable directives to fix critical build and test failures identified during the project infrastructure audit.

---

## 2. Infrastructure & Build Audit Findings

### 2.1 Build Status (`npm run build`)
- **Status**: ❌ **FAILED**
- **Error Location**: `src/components/StudentAnalytics.jsx:64:31`
- **Root Cause**: Invalid character sequence (`GÃ¶rÃ¼ntÃ¼lenme` containing byte `¶` due to UTF-8 corruption). Vite/Rollup parser fails with `[builtin:vite-transform] Invalid Character '¶'`.
- **Remediation Requirement**: Clean string in `StudentAnalytics.jsx` to `"Görüntülenme"` using UTF-8 encoding without BOM.

### 2.2 Test Status (`npm test` / Vitest)
- **Status**: ❌ **FAILED** (6 of 7 test suites failed, 12 of 22 tests failed)
- **Root Cause**: UTF-8 character corruption in `mockData.js`, `innerPagesData.js`, `liveData.js`, `universityData.js`, and component rendered outputs (e.g. `Kariyer GeliÅŸtirme` instead of `Kariyer Geliştirme`, `SÃœPER ADMIN` instead of `Süper Admin`).
- **Remediation Requirement**: Perform a clean UTF-8 normalization pass over all mock data utility files and affected components so DOM query matchers like `getByText(/Kariyer Geliştirme/i)` succeed.

### 2.3 Quality Audit (`oxlint src/`)
- **Status**: ⚠️ **983 warnings, 1 error**
- **Primary Issue**: Unused lucide-react icon imports and unused state variables in components.
- **Remediation Requirement**: Clean up dead imports during worker integration phase to maintain zero-warning code quality.

---

## 3. Real Web Data Inventory (Esenyurt University Kariyer Geliştirme Ofisi)

Source: Target URL `https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu` and `page_raw.html`.

- **University**: İstanbul Esenyurt Üniversitesi (İESÜ / IESU)
- **Office**: Kariyer Geliştirme Ofisi Koordinatörlüğü
- **Address**: Zafer Mah. Adile Naşit Bulv. No:1 Esenyurt İstanbul / Türkiye
- **Phone**: 444 9 123 / +90 212 699 09 90
- **Email**: `kariyer@esenyurt.edu.tr` / `info@esenyurt.edu.tr`
- **Key Leadership**:
  - Rektör: Prof. Dr. Süleyman Özdemir
  - Kariyer Geliştirme Merkezi Müdürü / Koordinatör: Dr. Öğr. Üyesi Mustafa Özan
- **Academic Units (Faculties & Schools)**:
  - İşletme ve Yönetim Bilimleri Fakültesi
  - Mühendislik ve Mimarlık Fakültesi
  - Sağlık Bilimleri Fakültesi
  - Sanat ve Sosyal Bilimler Fakültesi
  - Spor Bilimleri Fakültesi
  - Uygulamalı Bilimler Fakültesi
  - Yabancı Diller Yüksekokulu
  - Bilişim Teknolojileri Meslek Yüksekokulu
  - Meslek Yüksekokulu
  - Sağlık Hizmetleri Meslek Yüksekokulu
  - Lisansüstü Eğitim Enstitüsü
  - Ortak Dersler Bölümü / İngilizce Hazırlık Okulu

---

## 4. File-by-File Data Mapping Specification

### 4.1 `src/utils/universityData.js`

#### Issues & Requirements:
1. Standardize top-level exports to use `IESU_` prefix instead of legacy `IGU_` prefix.
2. Maintain backward-compatibility alias exports (`export const IGU_FACULTIES = IESU_FACULTIES;`, etc.) to prevent breaking components importing legacy named exports.
3. Update faculties and departments to reflect İstanbul Esenyurt Üniversitesi structure.

#### Data Schema & Mapping:

```js
// İstanbul Esenyurt Üniversitesi — Fakülte ve Bölüm Verileri

export const IESU_FACULTIES = [
  {
    name: 'İşletme ve Yönetim Bilimleri Fakültesi',
    departments: [
      'İşletme',
      'Uluslararası Lojistik ve Taşımacılık',
      'Uluslararası Ticaret ve Finansman',
      'Yönetim Bilişim Sistemleri',
      'Havacılık Yönetimi'
    ]
  },
  {
    name: 'Mühendislik ve Mimarlık Fakültesi',
    departments: [
      'Bilgisayar Mühendisliği',
      'Yazılım Mühendisliği',
      'Elektrik-Elektronik Mühendisliği',
      'Endüstri Mühendisliği',
      'İnşaat Mühendisliği',
      'Makine Mühendisliği',
      'Mimarlık',
      'İç Mimarlık ve Çevre Tasarımı'
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
      'Psikoloji',
      'Radyo, Televizyon ve Sinema',
      'Halkla İlişkiler ve Reklamcılık',
      'Sosyoloji',
      'Türk Dili ve Edebiyatı'
    ]
  },
  {
    name: 'Spor Bilimleri Fakültesi',
    departments: [
      'Antrenörlük Eğitimi',
      'Spor Yöneticiliği'
    ]
  },
  {
    name: 'Uygulamalı Bilimler Fakültesi',
    departments: [
      'Gastronomi ve Mutfak Sanatları',
      'Sivil Havacılık Yüksekokulu'
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
      'Siber Güvenlik Analistliği',
      'Web Tasarımı ve Kodlama'
    ]
  },
  {
    name: 'Meslek Yüksekokulu',
    departments: [
      'Aşçılık',
      'Bankacılık ve Sigortacılık',
      'Büro Yönetimi ve Yönetici Asistanlığı',
      'Dış Ticaret',
      'Grafik Tasarımı',
      'İnsan Kaynakları Yönetimi',
      'Lojistik',
      'Sivil Havacılık Kabin Hizmetleri',
      'Turizm ve Otel İşletmeciliği'
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
      'Optisyenlik',
      'Tıbbi Görüntüleme Teknikleri',
      'Tıbbi Laboratuvar Teknikleri'
    ]
  }
];

export const IESU_ENSTITU = [
  {
    name: 'Lisansüstü Eğitim Enstitüsü',
    departments: [
      'İşletme (Yüksek Lisans)',
      'Bilgisayar Mühendisliği (Yüksek Lisans)',
      'Klinik Psikoloji (Yüksek Lisans)',
      'İnşaat Mühendisliği (Yüksek Lisans)',
      'Mimarlık (Yüksek Lisans)'
    ]
  }
];

// Backward Compatibility Aliases
export const IGU_FACULTIES = IESU_FACULTIES;
export const IGU_YUKSEKOKUL = IESU_YUKSEKOKUL;
export const IGU_MYO = IESU_MYO;
export const IGU_ENSTITU = IESU_ENSTITU;

export function getAllDepartments() {
  const all = [];
  [...IESU_FACULTIES, ...IESU_MYO, ...IESU_YUKSEKOKUL, ...IESU_ENSTITU].forEach(unit => {
    unit.departments.forEach(dept => {
      all.push({ faculty: unit.name, department: dept });
    });
  });
  return all;
}

export function getAllFacultyNames() {
  return [
    ...IESU_FACULTIES.map(f => f.name),
    ...IESU_MYO.map(f => f.name),
    ...IESU_YUKSEKOKUL.map(f => f.name),
    ...IESU_ENSTITU.map(f => f.name)
  ];
}

export function getDepartmentsByFaculty(facultyName) {
  const unit = [...IESU_FACULTIES, ...IESU_MYO, ...IESU_YUKSEKOKUL, ...IESU_ENSTITU].find(f => f.name === facultyName);
  return unit ? unit.departments : [];
}
```

---

### 4.2 `src/utils/innerPagesData.js`

#### Mapping Specification:
- UTF-8 clean Turkish text.
- Real Esenyurt University Career Office mission, vision, contact details, services, and CBİKO Ulusal Staj Programı links.

```js
export const innerPagesData = {
  hakkimizda: {
    title: "Hakkımızda",
    subtitle: "İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi Koordinatörlüğü",
    heroImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    sections: [
      {
        id: "misyon",
        title: "Misyonumuz",
        content: "İstanbul Esenyurt Üniversitesi öğrencilerinin ve mezunlarının kariyer planlama süreçlerinde kendi yetenek, ilgi ve değerlerini keşfetmelerine rehberlik etmek; ulusal ve uluslararası iş dünyası ile güçlü köprüler kurarak onların istihdam edilebilirliğini ve mesleki donanımlarını en üst düzeye çıkarmaktır.",
        icon: "Target"
      },
      {
        id: "vizyon",
        title: "Vizyonumuz",
        content: "Öğrenci odaklı yaklaşımı, dinamik üniversite-sanayi iş birlikleri ve yenilikçi kariyer geliştirme modelleri ile Türkiye'nin referans gösterilen öncü kariyer geliştirme merkezlerinden biri olmaktır.",
        icon: "TrendingUp"
      }
    ],
    contactInfo: {
      email: "kariyer@esenyurt.edu.tr",
      phone: "444 9 123 / +90 212 699 09 90",
      office: "Zafer Mah. Adile Naşit Bulv. No:1 Esenyurt / İstanbul — Kariyer Geliştirme Ofisi"
    }
  },
  hizmetlerimiz: {
    title: "Hizmetlerimiz",
    subtitle: "Kariyer Geliştirme Ofisi Olarak Öğrenci ve Mezunlarımıza Sunduğumuz Olanaklar",
    heroImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    sections: [
      {
        id: "kariyer-danismanligi",
        title: "Kariyer Danışmanlığı",
        content: "Uzman danışmanlarımız eşliğinde birebir kariyer danışmanlığı görüşmeleri, hedef belirleme ve kariyer haritası oluşturma desteği.",
        target: "Tüm Öğrenciler ve Mezunlar",
        icon: "TrendingUp"
      },
      {
        id: "ozgecmis-danismanligi",
        title: "Özgeçmiş & Mülakat Danışmanlığı",
        content: "Etkili CV hazırlama, ön yazı yazımı ve birebir mülakat simülasyonları ile iş başvuru süreçlerine profesyonel hazırlık.",
        target: "Son Sınıf Öğrencileri ve Mezunlar",
        icon: "FileText"
      },
      {
        id: "yetenek-kapisi",
        title: "Yetenek Kapısı & Kariyer Portalı",
        content: "Cumhurbaşkanlığı İnsan Kaynakları Ofisi Yetenek Kapısı entegrasyonu ile iş/staj ilanlarına erişim ve başvuru yönetimi.",
        target: "Tüm Öğrenci ve Mezunlar",
        icon: "MapPin"
      }
    ]
  },
  ulusal_staj: {
    title: "T.C. Ulusal Staj Programı",
    subtitle: "Cumhurbaşkanlığı İnsan Kaynakları Ofisi Koordinasyonunda Liyakat Esaslı Staj İmkânı",
    heroImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    sections: [
      {
        id: "nedir",
        title: "Ulusal Staj Programı Nedir?",
        content: "T.C. Cumhurbaşkanlığı İnsan Kaynakları Ofisi (CBİKO) tarafından yürütülen Ulusal Staj Programı, üniversite öğrencilerimizin fırsat eşitliği çerçevesinde ve liyakat esaslarına uygun olarak kamu kurumları ve özel sektör kuruluşlarında staj yapmalarını sağlayan ulusal bir platformdur.",
        icon: "Briefcase"
      },
      {
        id: "basvuru-sartlari",
        title: "Nasıl Başvurulur?",
        content: "1. kariyerkapisi.cbiko.gov.tr adresine e-Devlet ile giriş yapın.\n2. Öğrenim ve profil bilgilerinizi onaylayın.\n3. Yetkinlik ve deneyimlerinizi eksiksiz doldurarak başvurunuzu tamamlayın.",
        icon: "Target"
      }
    ],
    externalLink: {
      url: "https://kariyerkapisi.cbiko.gov.tr/",
      label: "Kariyer Kapısı'na Git"
    }
  },
  akran_mentor: {
    title: "Akran Mentorluğu Programı",
    subtitle: "Deneyimli Üst Sınıf Öğrencilerinin Rehberliğinde Kampüs ve Kariyer Uyum Destek Programı",
    heroImage: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    sections: [
      {
        id: "program-amaci",
        title: "Programın Amacı",
        content: "İstanbul Esenyurt Üniversitesi Akran Mentorluğu Programı, oryantasyon dönemindeki yeni öğrencilerimizin üniversite hayatına, ders süreçlerine ve sosyal etkinliklere adaptasyonunu kolaylaştırmak amacıyla yürütülmektedir.",
        icon: "Users"
      }
    ]
  },
  isbirlikleri: {
    title: "İş Birliklerimiz & Çözüm Ortakları",
    subtitle: "Sektörün Öncü Kurumları ve Sanayi Kuruluşları ile Güçlü Protokoller",
    heroImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    sections: [
      {
        id: "amac",
        title: "Üniversite-Sanayi İş Birliği",
        content: "Öğrencilerimizin teorik bilgilerini pratikle birleştirmeleri amacıyla bölgemizdeki sanayi odaları, organize sanayi bölgeleri ve teknoloji firmaları ile düzenli iş birliği protokolleri yürütülmektedir.",
        icon: "Building"
      }
    ]
  }
};
```

---

### 4.3 `src/utils/mockData.js`

#### Mapping Specification:
1. Update `generateAcademicStaff` to include real Esenyurt University Leadership:
   - `Dr. Öğr. Üyesi Mustafa Özan` (Kariyer Geliştirme Ofisi Koordinatörü)
   - `Prof. Dr. Süleyman Özdemir` (Rektör)
   - Academic staff with `@esenyurt.edu.tr` emails.
2. Update `generateStudents` and `generateAlumni` email domains to `@ogr.esenyurt.edu.tr` and `@mezun.esenyurt.edu.tr`.
3. Clean UTF-8 strings across `initialNews` and all exported mock functions.

```js
import { IESU_FACULTIES, IESU_MYO, IESU_YUKSEKOKUL, IESU_ENSTITU } from './universityData';

export const generateStudents = () => {
  return [
    { id: 'STU-001', studentId: '20240001', name: 'Alperen Yılmaz', department: 'Yazılım Mühendisliği', year: 3, gpa: 3.4, email: 'alperen@ogr.esenyurt.edu.tr', password: 'password', role: 'student', avatar: 'https://ui-avatars.com/api/?name=Alperen+Yilmaz&background=0A2342&color=fff', pronouns: 'o/onun', internshipStatus: 'Arıyor' },
    { id: 'STU-002', studentId: '20240002', name: 'Zeynep Kaya', department: 'Bilgisayar Mühendisliği', year: 4, gpa: 3.8, email: 'zeynep@ogr.esenyurt.edu.tr', password: 'password', role: 'student', avatar: 'https://ui-avatars.com/api/?name=Zeynep+Kaya&background=0A2342&color=fff', doubleMajor: 'Endüstri Mühendisliği', internshipStatus: 'Tamamlandı' },
    { id: 'STU-003', studentId: '20240003', name: 'Mert Can', department: 'İşletme', year: 2, gpa: 2.9, email: 'mert@ogr.esenyurt.edu.tr', password: 'password', role: 'student', avatar: 'https://ui-avatars.com/api/?name=Mert+Can&background=0A2342&color=fff', internshipStatus: 'İlgilenmiyor' },
    { id: 'STU-004', studentId: '20240004', name: 'Elif Demir', department: 'Mimarlık', year: 3, gpa: 3.1, email: 'elif@ogr.esenyurt.edu.tr', password: 'password', role: 'student', avatar: 'https://ui-avatars.com/api/?name=Elif+Demir&background=0A2342&color=fff', internshipStatus: 'Aktif Stajyer' },
    { id: 'STU-005', studentId: '20240005', name: 'Burak Şahin', department: 'Makine Mühendisliği', year: 4, gpa: 3.6, email: 'burak@ogr.esenyurt.edu.tr', password: 'password', role: 'student', avatar: 'https://ui-avatars.com/api/?name=Burak+Sahin&background=0A2342&color=fff', internshipStatus: 'Arıyor' }
  ];
};

export const generateAlumni = () => {
  return [
    { id: 'ALU-001', studentId: '20190001', name: 'Caner Öztürk', department: 'Yazılım Mühendisliği', gradYear: 2023, email: 'caner@mezun.esenyurt.edu.tr', password: 'password', role: 'alumni', avatar: 'https://ui-avatars.com/api/?name=Caner+Ozturk&background=EA580C&color=fff', company: 'Trendyol', title: 'Frontend Developer' },
    { id: 'ALU-002', studentId: '20180002', name: 'Seda Çelik', department: 'Endüstri Mühendisliği', gradYear: 2022, email: 'seda@mezun.esenyurt.edu.tr', password: 'password', role: 'alumni', avatar: 'https://ui-avatars.com/api/?name=Seda+Celik&background=EA580C&color=fff', company: 'Ford Otosan', title: 'Üretim Planlama Uzmanı' },
    { id: 'ALU-003', studentId: '20200003', name: 'Tolgahan Aslan', department: 'Uluslararası Ticaret ve Finansman', gradYear: 2024, email: 'tolga@mezun.esenyurt.edu.tr', password: 'password', role: 'alumni', avatar: 'https://ui-avatars.com/api/?name=Tolgahan+Aslan&background=EA580C&color=fff', company: 'Getir', title: 'Operasyon Uzmanı' },
    { id: 'ALU-004', studentId: '20170004', name: 'Ayça Yurt', department: 'Psikoloji', gradYear: 2021, email: 'ayca@mezun.esenyurt.edu.tr', password: 'password', role: 'alumni', avatar: 'https://ui-avatars.com/api/?name=Ayca+Yurt&background=EA580C&color=fff', company: 'Kendi Kliniği', title: 'Klinik Psikolog' }
  ];
};

export const generateCompanies = () => {
  return [
    { id: 'CMP-001', username: 'trendyol', name: 'Trendyol', sector: 'E-Ticaret', email: 'ik@trendyol.com', password: 'password', role: 'employer', avatar: 'https://ui-avatars.com/api/?name=Trendyol&background=F97316&color=fff', website: 'https://trendyol.com', location: 'İstanbul, TR' },
    { id: 'CMP-002', username: 'getir', name: 'Getir', sector: 'Hızlı Teslimat', email: 'ik@getir.com', password: 'password', role: 'employer', avatar: 'https://ui-avatars.com/api/?name=Getir&background=5B21B6&color=fff', website: 'https://getir.com', location: 'İstanbul, TR' },
    { id: 'CMP-003', username: 'aselsan', name: 'Aselsan', sector: 'Savunma Sanayii', email: 'ik@aselsan.com.tr', password: 'password', role: 'employer', avatar: 'https://ui-avatars.com/api/?name=Aselsan&background=0A2342&color=fff', website: 'https://aselsan.com.tr', location: 'Ankara, TR' },
    { id: 'CMP-004', username: 'ford', name: 'Ford Otosan', sector: 'Otomotiv', email: 'ik@ford.com.tr', password: 'password', role: 'employer', avatar: 'https://ui-avatars.com/api/?name=Ford+Otosan&background=0284C7&color=fff', website: 'https://ford.com.tr', location: 'Kocaeli, TR' }
  ];
};

export const generateAcademicStaff = () => {
  return [
    { id: 'ACAD-001', name: 'Dr. Öğr. Üyesi Mustafa Özan', email: 'mustafaozan@esenyurt.edu.tr', department: 'Kariyer Geliştirme Ofisi', password: 'password', role: 'academic', avatar: 'https://ui-avatars.com/api/?name=Mustafa+Ozan&background=0EA5E9&color=fff', title: 'Kariyer Merkezi Müdürü' },
    { id: 'ACAD-002', name: 'Prof. Dr. Süleyman Özdemir', email: 'rektor@esenyurt.edu.tr', department: 'Rektörlük', password: 'password', role: 'academic', avatar: 'https://ui-avatars.com/api/?name=Suleyman+Ozdemir&background=0EA5E9&color=fff', title: 'Rektör' },
    { id: 'ACAD-003', name: 'Doç. Dr. Zeynep Çelik', email: 'zcelik@esenyurt.edu.tr', department: 'Yazılım Mühendisliği', password: 'password', role: 'academic', avatar: 'https://ui-avatars.com/api/?name=Zeynep+Celik&background=0EA5E9&color=fff', title: 'Bölüm Başkanı' }
  ];
};

export const initialNews = [
  {
    id: "NEWS-001",
    title: "Rektörümüz Prof. Dr. Süleyman Özdemir'den Aday Öğrencilere Önemli Tavsiyeler",
    description: "İstanbul Esenyurt Üniversitesi Rektörü Prof. Dr. Süleyman Özdemir, üniversite tercihi yapacak aday öğrencilere kariyer planlaması ve meslek seçimi konularında değerli tavsiyelerde bulundu.",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: "Aktif",
    date: "21 Temmuz 2026 Salı"
  },
  {
    id: "NEWS-002",
    title: "İstanbul Esenyurt Üniversitesi 2025–2026 Mezuniyet Töreni Coşkuyla Gerçekleşti",
    description: "Üniversitemiz 2025–2026 Akademik Yılı Mezuniyet Töreni, protokol üyeleri, akademisyenler ve mezun ailelerinin yoğun katılımıyla büyük bir törenle gerçekleştirildi.",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: "Aktif",
    date: "01 Temmuz 2026 Çarşamba"
  },
  {
    id: "NEWS-003",
    title: "Gençlik ve Spor Bakanlığı e-Rehberlik Sistemi Erişime Açıldı",
    description: "Gençlik ve Spor Bakanlığı tarafından geliştirilen e-Rehberlik sistemi üniversitemiz öğrencilerinin kullanımına sunulmuştur.",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: "Aktif",
    date: "09 Temmuz 2026 Perşembe"
  }
];
```

---

### 4.4 `src/utils/liveData.js`

#### Mapping Specification:
- Live announcements, slider images, and statistics customized for İstanbul Esenyurt Üniversitesi.

```js
export const liveSliderData = [
  {
    badge: "Kariyer Danışmanlığı",
    title: "Birebir Kariyer Danışmanlığı & Özgeçmiş İnceleme",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    actionLink: "/services"
  },
  {
    badge: "Ulusal Staj Programı",
    title: "T.C. Cumhurbaşkanlığı İKO Ulusal Staj Başvuruları",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    actionLink: "/services"
  },
  {
    badge: "Akran Mentorluğu",
    title: "2026-2027 Akran Mentorluğu Başvuruları Açıldı",
    image: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    actionLink: "/mentor_match"
  }
];

export const liveNewsData = [
  {
    id: "news-1",
    title: "Rektörümüz Prof. Dr. Süleyman Özdemir'den Aday Öğrencilere Tavsiyeler",
    date: "21 Temmuz 2026",
    category: "Öne Çıkan Haber",
    description: "İstanbul Esenyurt Üniversitesi Rektörü Prof. Dr. Süleyman Özdemir, tercih dönemindeki aday öğrencilere üniversite ve kariyer seçimi rehberliği sundu.",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "news-2",
    title: "Gençlik ve Spor Bakanlığı e-Rehberlik Sistemi Açıldı",
    date: "09 Temmuz 2026",
    category: "Duyuru",
    description: "Gençlik ve Spor Bakanlığı e-Rehberlik sistemi üniversitemiz kariyer portalı ile entegre bir şekilde kullanıma açılmıştır.",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "news-3",
    title: "2025–2026 Akademik Yılı Mezuniyet Töreni Coşkuyla Gerçekleşti",
    date: "01 Temmuz 2026",
    category: "Etkinlik",
    description: "İstanbul Esenyurt Üniversitesi mezuniyet töreni coşkulu bir katılımla ve keplerin fırlatılmasıyla tamamlandı.",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export const liveAnnouncementsData = [
  {
    id: "ann-1",
    title: "2025-2026 Yaz Okulu Ders Programı Açıklandı",
    date: "20 Temmuz 2026",
    category: "Duyuru",
    description: "İESÜ Yaz okulu ders ve sınav programları Öğrenci İşleri Daire Başkanlığı tarafından ilan edilmiştir."
  },
  {
    id: "ann-2",
    title: "Tek Ders / Not Yükseltme Sınav Programları",
    date: "09 Temmuz 2026",
    category: "Akademik",
    description: "Mezuniyet aşamasındaki öğrencilerimiz için Tek Ders Sınav takvimi yayınlanmıştır."
  }
];

export const liveStatsData = [
  { label: "Anlaşmalı Firma", value: "950+", color: "bg-blue-100 text-blue-700" },
  { label: "İşe Yerleşen Mezun", value: "18.500+", color: "bg-emerald-100 text-emerald-700" },
  { label: "Kariyer Etkinliği", value: "320", color: "bg-orange-100 text-orange-700" },
  { label: "Aktif İş İlanı", value: "1.450+", color: "bg-purple-100 text-purple-700" }
];
```

---

## 5. Encoding Fix Specification for `StudentAnalytics.jsx`

- **File Path**: `src/components/StudentAnalytics.jsx`
- **Line Number**: 64
- **Original Line**:
  ```jsx
  { name: '1. Hafta', GÃ¶rÃ¼ntÃ¼lenme: Math.round(30 * factor), Arama: Math.round(15 * factor) },
  ```
- **Replacement Line**:
  ```jsx
  { name: '1. Hafta', Görüntülenme: Math.round(30 * factor), Arama: Math.round(15 * factor) },
  ```

---

## 6. Worker Execution Plan & Verification Steps

1. **UTF-8 Normalization**: Worker must rewrite files using UTF-8 without BOM encoding to resolve character corruption.
2. **Backward Compatibility**: Ensure `universityData.js` exports both `IESU_*` and `IGU_*` aliases.
3. **Build Pass Check**: Run `cmd /c npm run build` and ensure exit code `0`.
4. **Test Pass Check**: Run `cmd /c npm test` and ensure all 7 test files pass.
5. **Lint Verification**: Run `cmd /c npx oxlint src/` and ensure 0 errors.

---
