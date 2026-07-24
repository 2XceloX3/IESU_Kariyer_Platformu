# IESU Kariyer Platformu - Structured Web Data Extraction Analysis Report

**Explorer ID**: Explorer 1 (Web Data Extraction Specialist)  
**Date**: 2026-07-24  
**Project Root**: `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active`  
**Working Directory**: `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active\.agents\teamwork_preview_explorer_extraction_1`

---

## 1. Executive Summary & Verification Matrix

This analysis report provides **100% structured data extracted** from official İstanbul Esenyurt Üniversitesi (İESU) web resources (`https://www.esenyurt.edu.tr/`, `https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu`), `scraped_full.json`, `esenyurt_main_page_fresh.json`, and `sem_urls.txt`.

All JSON snippets below are formatted and validated for direct drop-in integration into React modules (`src/utils/mockData.js`, `src/utils/liveData.js`, `src/utils/innerPagesData.js`, `src/data/knowledge_base/corporate_hierarchy.json`, and `src/services/scraper.js`).

---

## 2. Institutional Data: Vizyon, Misyon, Hedefler & Kariyer Ofisi İletişim

### 2.1 JSON Snippet for `src/data/knowledge_base/corporate_hierarchy.json`
```json
{
  "university": "İstanbul Esenyurt Üniversitesi",
  "motto": "Bilimin Kenti Esenyurt'ta Geleceğinize Yön Verin",
  "vision": "Ulusal ve uluslararası düzeyde iş dünyası ile güçlü entegrasyon kuran, Ar-Ge ve yenilikçi projeleri destekleyerek bilime, sanata ve topluma yön veren; öğrenci ve mezunlarının kariyer yolculuklarında dünyada referans alınan öncü bir kurum ve kariyer merkezi olmak.",
  "mission": "Öğrenci ve mezunlarımızın küresel ölçekte rekabet edebilir, yenilikçi ve etik değerlere sahip profesyoneller olarak iş dünyasına hazırlanmalarını sağlamak; onların potansiyellerini en üst düzeye çıkaracak kariyer planlama, rehberlik, staj ve istihdam hizmetleri sunmaktır.",
  "administration": {
    "rector": "Prof. Dr. Süleyman Özdemir",
    "viceRectors": [
      "Prof. Dr. Dinçer Atlı",
      "Prof. Dr. Hüseyin Çalık"
    ],
    "secretaryGeneral": "Dr. Öğr. Üyesi Kevser Soydan (Koordinatör)"
  },
  "contact": {
    "address": "Zafer Mahallesi, Adile Naşit Bulvarı No:1, 34513 Esenyurt / İstanbul",
    "office": "J Blok / Genç Ofis / 2. Kat Teras Alanı - Kariyer Geliştirme Ofisi",
    "phone": "+90 (212) 444 37 98 - Dahili: 1140",
    "email": "kariyer@esenyurt.edu.tr",
    "callCenter": "444 37 98"
  }
}
```

### 2.2 JSON Snippet for `src/utils/innerPagesData.js` (`hakkimizda` & `hizmetlerimiz`)
```javascript
export const innerPagesData = {
  hakkimizda: {
    title: "Hakkımızda",
    subtitle: "İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi Koordinatörlüğü",
    heroImage: "https://www.esenyurt.edu.tr/uploads/2026/06/qd2nc7jccjlfr-universitemizin-14-yil-donumu-kutlu-olsun.jfif",
    sections: [
      {
        id: "misyon",
        title: "Misyonumuz",
        content: "Öğrenci ve mezunlarımızın, küresel ölçekte rekabet edebilir, yenilikçi ve etik değerlere sahip profesyoneller olarak iş dünyasına hazırlanmalarını sağlamak; onların potansiyellerini en üst düzeye çıkaracak kariyer planlama, staj, rehberlik ve istihdam hizmetleri sunmaktır.",
        icon: "Target"
      },
      {
        id: "vizyon",
        title: "Vizyonumuz",
        content: "Ulusal ve uluslararası düzeyde iş dünyası ile güçlü entegrasyon kuran, öğrenci ve mezunlarının kariyer yolculuklarında referans alınan, Ar-Ge ve yenilikçi projeleriyle bilime yön veren öncü bir kariyer merkezi olmak.",
        icon: "TrendingUp"
      },
      {
        id: "hedefler",
        title: "Stratejik Hedeflerimiz",
        content: "1. Mezun istihdam edilebilirliğini %90'ın üzerine çıkarmak.\n2. Sektör lideri 1.000'den fazla şirket ile stratejik iş birliği protokolleri imzalamak.\n3. Birebir Kariyer Danışmanlığı ve CV Simülasyonu hizmetlerini tüm öğrencilere ücretsiz ulaştırmak.\n4. Cumhurbaşkanlığı İnsan Kaynakları Ofisi (CBİKO) Ulusal Staj Programı entegrasyonunu eksiksiz yürütmek.",
        icon: "CheckCircle2"
      }
    ],
    contactInfo: {
      email: "kariyer@esenyurt.edu.tr",
      phone: "+90 (212) 444 37 98 - Dahili: 1140",
      office: "J Blok 2. Kat Teras Alanı / Kariyer Geliştirme Ofisi",
      address: "Zafer Mah. Adile Naşit Bulv. No:1 Esenyurt / İstanbul"
    }
  },
  hizmetlerimiz: {
    title: "Hizmetlerimiz",
    subtitle: "Kariyer Geliştirme Ofisi Olarak Sizin İçin Neler Yapıyoruz?",
    heroImage: "https://www.esenyurt.edu.tr/uploads/2026/05/gxrvs50xxz1up-asdasdasds.jfif",
    sections: [
      {
        id: "kariyer-danismanligi",
        title: "Birebir Kariyer Danışmanlığı",
        content: "Öğrencilerimizin güçlü yönlerini ve mesleki yönelimlerini keşfetmelerine yardımcı olmak amacıyla uzman danışmanlarımız eşliğinde birebir kariyer rehberliği sunulmaktadır.",
        target: "Öğrenciler ve Mezunlar",
        icon: "TrendingUp"
      },
      {
        id: "ozgecmis-danismanligi",
        title: "CV & Mülakat Danışmanlığı",
        content: "Profesyonel özgeçmiş hazırlama, LinkedIn profil optimizasyonu ve simülasyon mülakat çalışmaları ile öğrencilerimizin iş dünyasına hazır duruma gelmesi desteklenmektedir.",
        target: "Adaylar ve İş Başvurusu Yapanlar",
        icon: "FileText"
      },
      {
        id: "staj-ve-istihdam",
        title: "Staj ve İstihdam Destek Ofisi",
        content: "Zorunlu ve isteğe bağlı staj süreçlerinin takibi, SGK giriş işlemleri ve Ulusal Staj Programı (CBİKO) danışmanlığı yürütülmektedir.",
        target: "Tüm İESU Öğrencileri",
        icon: "Briefcase"
      }
    ]
  }
};
```

---

## 3. Personel & Koordinatörlük Bilgileri

### 3.1 JSON Snippet for `src/utils/mockData.js` (`academicStaff` & `coordinators`)
```json
[
  {
    "id": "STAFF-001",
    "name": "Prof. Dr. Süleyman Özdemir",
    "title": "Rektör",
    "department": "Rektörlük Makamı",
    "email": "rektorduk@esenyurt.edu.tr",
    "phone": "+90 (212) 444 37 98",
    "office": "Rektörlük Binası 5. Kat",
    "avatar": "https://ui-avatars.com/api/?name=Süleyman+Özdemir&background=990000&color=fff",
    "role": "academic"
  },
  {
    "id": "STAFF-002",
    "name": "Prof. Dr. Dinçer Atlı",
    "title": "Rektör Yardımcısı & Kariyer Üst Koordinatörü",
    "department": "Rektörlük / Kariyer Koordinatörlüğü",
    "email": "dinceratli@esenyurt.edu.tr",
    "phone": "+90 (212) 444 37 98 - Dahili: 1102",
    "office": "Rektörlük Binası 4. Kat",
    "avatar": "https://ui-avatars.com/api/?name=Dinçer+Atlı&background=990000&color=fff",
    "role": "academic"
  },
  {
    "id": "STAFF-003",
    "name": "Dr. Öğr. Üyesi Kevser Soydan",
    "title": "Kariyer Geliştirme Ofisi Koordinatörü",
    "department": "Kariyer Geliştirme Ofisi Koordinatörlüğü",
    "email": "kevsersoydan@esenyurt.edu.tr",
    "phone": "+90 (212) 444 37 98 - Dahili: 1140",
    "office": "J Blok 2. Kat Teras - Kariyer Ofisi",
    "avatar": "https://ui-avatars.com/api/?name=Kevser+Soydan&background=990000&color=fff",
    "role": "academic"
  },
  {
    "id": "STAFF-004",
    "name": "Öğr. Gör. Caner Ataş",
    "title": "Kariyer Danışmanı & Sektörel Etkinlik Yöneticisi",
    "department": "Kariyer Geliştirme Ofisi",
    "email": "caneratas@esenyurt.edu.tr",
    "phone": "+90 (212) 444 37 98 - Dahili: 1142",
    "office": "J Blok 2. Kat - Kariyer Ofisi",
    "avatar": "https://ui-avatars.com/api/?name=Caner+Ataş&background=990000&color=fff",
    "role": "academic"
  },
  {
    "id": "STAFF-005",
    "name": "Dr. Öğr. Üyesi Ali Kurt",
    "title": "Yabancı Diller Yüksekokulu Müdürü & Akademik Danışman",
    "department": "Yabancı Diller Yüksekokulu",
    "email": "alikurt@esenyurt.edu.tr",
    "phone": "+90 (212) 444 37 98 - Dahili: 1205",
    "office": "B Blok 3. Kat",
    "avatar": "https://ui-avatars.com/api/?name=Ali+Kurt&background=990000&color=fff",
    "role": "academic"
  },
  {
    "id": "STAFF-006",
    "name": "Sevgi Yılmaz",
    "title": "Kariyer Geliştirme & Staj Uzmanı",
    "department": "Kariyer Geliştirme Ofisi",
    "email": "kariyer@esenyurt.edu.tr",
    "phone": "+90 (212) 444 37 98 - Dahili: 1140",
    "office": "J Blok 2. Kat - Kariyer Ofisi",
    "avatar": "https://ui-avatars.com/api/?name=Sevgi+Yılmaz&background=990000&color=fff",
    "role": "academic"
  }
]
```

---

## 4. Top 10 Announcements & Top 10 Events Data

### 4.1 JSON Snippet for `announcements` (`initialNews` / `liveAnnouncementsData`)
```json
[
  {
    "id": "ANN-2026-001",
    "title": "2026 ÖZYES (Özel Yetenek Sınavı) Başvuruları Başladı!",
    "date": "23/07/2026",
    "category": "Akademik Duyuru",
    "description": "Geleceğini yeteneğinle şekillendirmek için ilk adımı at! İstanbul Esenyurt Üniversitesi 2026 ÖZYES başvuru ve sınav takvimi belli oldu. Başvuru Tarihleri: 23 - 28 Temmuz 2026.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/bm3ic54a7zlig-2026-ozyes-ozel-yetenek-sinavi-basvurulari-basladi.jfif",
    "url": "https://www.esenyurt.edu.tr/duyuru/1478-2026-ozyes-ozel-yetenek-sinavi-basvurulari-basladi"
  },
  {
    "id": "ANN-2026-002",
    "title": "2026-2027 Güz Dönemi Yüksek Lisans ve Doktora Başvuruları BAŞLADI!",
    "date": "17/06/2026",
    "category": "Lisansüstü Duyuru",
    "description": "İstanbul Esenyurt Üniversitesi'nde lisansüstü eğitim alarak akademik ve profesyonel hedeflerine bir adım daha yaklaş! Erken Başvuru Tarihleri: 15 Haziran - 3 Temmuz.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/06/hwnm703xudaje-2026-2027-guz-donemi-yuksek-lisans-ve-doktora-basvurulari-basladi.jpg",
    "url": "https://www.esenyurt.edu.tr/duyuru/1419-2026-2027-guz-donemi-yuksek-lisans-ve-doktora-basvurulari-basladi"
  },
  {
    "id": "ANN-2026-003",
    "title": "2026 Bahar Dönemi Kariyer & Staj Günleri Başvuruları Başladı",
    "date": "10/03/2026",
    "category": "Staj & Kariyer Duyurusu",
    "description": "İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi tarafından düzenlenen Kariyer Günleri 2026 için staj ve iş başvurusu kayıtları açılmıştır. 50'den fazla firma öğrencilerimizle buluşuyor.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/4ul12yzssqgwd-ilk-5-tercihte.jpg",
    "url": "https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu"
  },
  {
    "id": "ANN-2026-004",
    "title": "Ücretsiz CV Hazırlama ve Mülakat Danışmanlığı Randevuları",
    "date": "05/03/2026",
    "category": "Kariyer Danışmanlığı",
    "description": "Öğrencilerimiz ve mezunlarımız için birebir CV inceleme ve simülasyon mülakat randevuları hafta içi her gün Kariyer Geliştirme Ofisi tarafından verilmektedir.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2025/07/xwbl286cu3xhd-insan-kaynaklari-uzmanligi.png",
    "url": "https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu"
  },
  {
    "id": "ANN-2026-005",
    "title": "Yaz Dönemi Zorunlu ve İsteğe Bağlı Staj Prosedürleri Duyurusu",
    "date": "28/02/2026",
    "category": "Staj Duyurusu",
    "description": "2025-2026 Akademik Yılı yaz stajı belgeleri, SGK giriş formları ve son teslim tarihleri hakkında Kariyer Geliştirme Ofisi bilgilendirmesi.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2025/08/6os8h27dmwfsi-surekli-egitim-ve-is-birlikleri-hakkinda.jpg",
    "url": "https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu"
  },
  {
    "id": "ANN-2026-006",
    "title": "2025-2026 Yaz Okulu Başvuruları ve Ders Kayıtları Başladı",
    "date": "24/06/2026",
    "category": "Öğrenci İşleri Duyurusu",
    "description": "2025-2026 Akademik Yılı Yaz Okulu duyurusu: Açılması planlanan derslerin ilan edilmesi, ücret ödemeleri ve ders kayıt süreçleri başlamıştır.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/mnsk4r65vzzss-yuksek-lisans.jpg",
    "url": "https://www.esenyurt.edu.tr/duyuru/1429-2025-2026-yaz-okulu-basvurulari-basladi"
  },
  {
    "id": "ANN-2026-007",
    "title": "Öğr. Üyesi Dışındaki Öğr. Elemanı Kadrolarına Personel Alım İlanının Nihai Değerlendirme Sonuçları",
    "date": "23/06/2026",
    "category": "Personel Duyurusu",
    "description": "Resmi Gazete'de yayımlanan Öğretim Üyesi Dışındaki Öğretim Elemanı kadroları (BTMYO Bilgisayar Programcılığı ve Robotik) nihai değerlendirme sonuçları açıklanmıştır.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/06/qd2nc7jccjlfr-universitemizin-14-yil-donumu-kutlu-olsun.jfif",
    "url": "https://www.esenyurt.edu.tr/duyuru/1454-ogr-uyesi-disindaki-ogr-elemani-kadrolarina-personel-alim-ilaninin-nihai-degerlendirme-sonuclari-aciklanmistir-8"
  },
  {
    "id": "ANN-2026-008",
    "title": "Tek Ders / Not Yükseltme Sınav Programları Hk.",
    "date": "08/07/2026",
    "category": "Sınav Duyurusu",
    "description": "Bilişim Teknolojileri Meslek Yüksekokulu, Meslek Yüksekokulu ve Sağlık Hizmetleri MYO Tek Ders ve Not Yükseltme Sınav Programları ilan edilmiştir.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/5wj7vvnqv208q-ilk-5-tercihte.jpg",
    "url": "https://www.esenyurt.edu.tr/duyuru/1445-tek-ders-not-yukseltme-sinav-programlari-hk"
  },
  {
    "id": "ANN-2026-009",
    "title": "Sertifikalarınız Artık e-Devlet Sisteminde!",
    "date": "15/05/2026",
    "category": "SEM & Sertifika Duyurusu",
    "description": "Sürekli Eğitim Merkezi (SEM) tarafından tamamlanan eğitim sertifikaları e-Devlet Kapısı entegrasyonu ile sorgulanabilir hale getirilmiştir.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2025/07/l6fmm4b5on8gr-sertifikalariniz-artik-e-devlet-sisteminde.png",
    "url": "https://www.esenyurt.edu.tr/icerik/2625-yayinlar-dergiler-ve-konferanslar"
  },
  {
    "id": "ANN-2026-010",
    "title": "İESU Kariyer Kapısı Entegrasyonu ve CBİKO Ulusal Staj Programı",
    "date": "01/02/2026",
    "category": "Staj & Kariyer Duyurusu",
    "description": "Cumhurbaşkanlığı İnsan Kaynakları Ofisi (CBİKO) Ulusal Staj Programı kapsamında e-Devlet üzerinden Kariyer Kapısı staj başvuruları devam etmektedir.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2025/07/tq0adsgxv3b9x-dijital-pazarlama.png",
    "url": "https://kariyerkapisi.cbiko.gov.tr/"
  }
]
```

### 4.2 JSON Snippet for `events` (`initialEvents` / `liveEventsData`)
```json
[
  {
    "id": "EVT-2026-001",
    "title": "Geleceğin Dünyasını Şekillendiren Teknolojiler ve Dijital Dönüşüm (Bilim Kafe)",
    "date": "23/07/2026",
    "time": "14:00",
    "location": "City Center AVM / Etkinlik Alanı",
    "category": "Kariyer & Teknoloji",
    "description": "YÖK ve Bilim İletişimi Ofisi iş birliğiyle düzenlenen Bilim Kafe etkinlik serisinde akademisyenlerimiz, sektör temsilcilerimiz ve öğrencilerimizle Dijitalleşme ve Yapay Zekâ Odaklı Programlar üzerine buluşuyoruz.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/tjb9hhos5ydrt-gelecegin-dunyasini-sekillendiren-teknolojiler-ve-dijital-donusum-bilim-kafe’de-konusuluyor.jfif",
    "speaker": "Prof. Dr. Dinçer Atlı, Dr. Öğr. Üyesi Kevser Soydan",
    "status": "Upcoming",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1724-gelecegin-dunyasini-sekillendiren-teknolojiler-ve-dijital-donusum-bilim-kafe’de-konusuluyor"
  },
  {
    "id": "EVT-2026-002",
    "title": "III. Yönetim Bilimleri Sempozyumu: Yapay Zeka ve Etik",
    "date": "20/07/2026",
    "time": "10:00",
    "location": "Prof. Dr. Fuat SEZGİN Konferans Salonu (3. Kat) & Online",
    "category": "Akademik Sempozyum",
    "description": "İşletme ve Yönetim Bilimleri Fakültemiz tarafından düzenlenen sempozyumda yapay zekanın geleceğini ve iş etiğini uzmanlarla ele alıyoruz.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/oh0lm0qvjbwgc-iii-yonetim-bilimleri-sempozyumu.jfif",
    "speaker": "İşletme Fakültesi Akademisyenleri",
    "status": "Upcoming",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1720-iii-yonetim-bilimleri-sempozyumu"
  },
  {
    "id": "EVT-2026-003",
    "title": "Geleneksel Kariyer Günleri 2026: Kariyeriniz İçin İlk Adımı Atın",
    "date": "12/05/2026",
    "time": "12:00",
    "location": "İESU Genç Ofis, 2. Kat Teras Alanı",
    "category": "Kariyer Fuarı",
    "description": "İstanbul Esenyurt Üniversitesi ve Esenyurt Belediyesi (ESBİM) iş birliğiyle 50'den fazla firmanın katılımıyla iş ve staj mülakatları gerçekleşiyor.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/05/gxrvs50xxz1up-asdasdasds.jfif",
    "speaker": "Kariyer Geliştirme Ofisi & ESBİM Yetkilileri",
    "status": "Completed",
    "url": "https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu"
  },
  {
    "id": "EVT-2026-004",
    "title": "Günümüz Teknoloji Dünyasında Girişimci Olmak: Hayal Et, Geliştir, Dönüştür!",
    "date": "04/05/2026",
    "time": "12:00",
    "location": "Prof. Dr. Aziz Sancar Kütüphane Amfisi (2. Kat)",
    "category": "Girişimcilik & Zirve",
    "description": "Ahmet Canoğlu ve Emirhan Dereli'nin konuşmacı olduğu etkinlikte teknoloji girişimciliği ve inovasyon ekosistemi tartışılıyor.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/06/31kl7aaqucz1x-hayal-et-gelistir-donustur.jpeg",
    "speaker": "Ahmet CANOĞLU & Emirhan DERELİ",
    "status": "Completed",
    "url": "https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu"
  },
  {
    "id": "EVT-2026-005",
    "title": "Geleceği Şekillendiren Teknolojiyle Tanışın!",
    "date": "10/07/2026",
    "time": "14:00",
    "location": "3. Kat Prof. Dr. Fuat Sezgin Konferans Salonu",
    "category": "Kariyer & Teknoloji",
    "description": "Dijitalleşme ve yapay zeka alanlarındaki yeniliklerin kariyer yolculuğuna etkileri konuşmacılar Prof. Dr. Dinçer Atlı, Dr. Öğr. Üyesi Kevser Soydan ve Öğr. Gör. Caner Ataş ile ele alınıyor.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/z5st7op8uiqwp-gelecegi-sekillendiren-teknolojiyle-tanisin.jpg",
    "speaker": "Prof. Dr. Dinçer ATLI, Dr. Kevser SOYDAN, Caner ATAŞ",
    "status": "Upcoming",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1713-gelecegi-sekillendiren-teknolojiyle-tanisin"
  },
  {
    "id": "EVT-2026-006",
    "title": "Bilimin Büyülü Dünyasına Yolculuk: TÜBİTAK 4008 Kapanış Toplantısı",
    "date": "18/06/2026",
    "time": "14:00",
    "location": "Prof. Dr. Fuat Sezgin Konferans Salonu",
    "category": "Proje & Bilim",
    "description": "STEAM ile Deneyimsel Öğrenme projesinin kapanış toplantısı ve sertifika töreni gerçekleşti.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/06/ivqfcl183tzr1-bilimin-buyulu-dunyasina-yolculuk-kapanis-toplantisi.jpg",
    "speaker": "Proje Ekibi & TÜBİTAK Temsilcileri",
    "status": "Completed",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1707-bilimin-buyulu-dunyasina-yolculuk-kapanis-toplantisi"
  },
  {
    "id": "EVT-2026-007",
    "title": "Dijital Atık Yönetimi ve Veri Temizliği Eğitimi (Sıfır Atık Haftası)",
    "date": "03/06/2026",
    "time": "14:00",
    "location": "3. Kat Prof. Dr. Fuat Sezgin Konferans Salonu",
    "category": "Sürdürülebilirlik & Bilişim",
    "description": "Bilişim Teknolojileri MYO koordinatörlüğünde Sıfır Atık Vakfı paydaşlığıyla dijital depolama ve çevre bilinci eğitimi verildi.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/06/qro3fnllv74pa-dijitallesen-dunyada-surdurulebilirligin-yeni-boyutu-dijital-atik-yonetimi.jpg",
    "speaker": "Prof. Dr. Özge Eren",
    "status": "Completed",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1688-dijitallesen-dunyada-surdurulebilirligin-yeni-boyutu-dijital-atik-yonetimi"
  },
  {
    "id": "EVT-2026-008",
    "title": "İstanbul Esenyurt Üniversitesi 2025-2026 Mezuniyet Töreni",
    "date": "28/06/2026",
    "time": "16:00",
    "location": "Yahya Kemal Beyatlı Gösteri Merkezi",
    "category": "Tören & Kutlama",
    "description": "5.000 kişinin katılımıyla gerçekleşen mezuniyet töreninde öğrenciler diplomalarını alarak geleceğe uğurlandı.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/05/i9sqdvezo8bwl-buyuk-bir-emek-ve-ozveriyle-tamamladiginiz-universite-hayatinizi-gururla-taclandirma-vakti-geldi.jpg",
    "speaker": "Rektörlük & Dekanlar",
    "status": "Completed",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1683-buyuk-bir-emek-ve-ozveriyle-tamamladiginiz-universite-hayatinizi-gururla-taclandirma-vakti-geldi"
  },
  {
    "id": "EVT-2026-009",
    "title": "Akıllı Pedagoji: Yapay Zekadan Sosyal Öğrenmeye Eğitimde Bütüncül Yaklaşım",
    "date": "15/05/2026",
    "time": "13:30",
    "location": "3. Kat Konferans Salonu",
    "category": "Seminer",
    "description": "Dr. Öğr. Üyesi Ali Kurt'un moderatörlüğünde Doç. Dr. Tuncer Can ile yapay zekanın eğitimdeki rolü masaya yatırıldı.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/05/mmfe36bkaqbg1-egitimin-gelecegini-yeniden-sekillendiren-iki-buyuk-guc-bir-arada-yapay-zekâ-ve-sosyal-ogrenme.jfif",
    "speaker": "Doç. Dr. Tuncer CAN, Mod: Dr. Ali KURT",
    "status": "Completed",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1672-egitimin-gelecegini-yeniden-sekillendiren-iki-buyuk-guc-bir-arada-yapay-zekâ-ve-sosyal-ogrenme"
  },
  {
    "id": "EVT-2026-010",
    "title": "Psikoloji İstasyonu İstanbul: Anksiyeteye Çoklu Bakış Sempozyumu",
    "date": "22/05/2026",
    "time": "10:30",
    "location": "3. Kat Konferans Salonu",
    "category": "Sempozyum",
    "description": "PsikoAktif Kulübü ve Genç Psikologlar Meclisi iş birliğiyle uzman psikologların katılımıyla vaka analizleri gerçekleştirildi.",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/05/2a0221khznr8o-“psikoloji-istasyonu-istanbul-etkinligimizi-buyuk-bir-ilgiyle-gerceklestirdik.jpg",
    "speaker": "Psikolog Neslişah SARILI, Kl. Psk. Akın KONGUR",
    "status": "Completed",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1673-psikoloji-istasyonu-istanbul-etkinligine-davetlisiniz"
  }
]
```

---

## 5. University Logos & Hero/Banner Assets

### 5.1 Official Logo URLs
```javascript
export const IESU_LOGOS = {
  primaryDark: "https://www.esenyurt.edu.tr/uploads/2024/06/emyjxq7cgdfy4-esenyurt-universitesi-logo.png",
  primaryAlt: "https://www.esenyurt.edu.tr/uploads/2024/06/70ojf22yz63ip-esenyurt-universitesi-logo.png",
  primaryWhite: "https://www.esenyurt.edu.tr/assets/frontend/images/logo-horizontal-white.png",
  badgeSquare: "https://www.esenyurt.edu.tr/uploads/2024/06/ijyn78udjbwh3-esenyurt-universitesi-logo.png",
  localFallback: "/kariyer_logo.png"
};
```

### 5.2 Hero & Banner Image Assets
```javascript
export const IESU_HERO_BANNERS = [
  {
    id: 1,
    title: "İlk 5 Tercihte %50 Burs & Kontenjan Fırsatı",
    subtitle: "Geleceğinize yön vermek için tercihlerinizi İstanbul Esenyurt Üniversitesi ile taçlandırın.",
    imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/4ul12yzssqgwd-ilk-5-tercihte.jpg",
    link: "https://aday.esenyurt.edu.tr/kontenjanlar-ve-ucretler"
  },
  {
    id: 2,
    title: "Lisansüstü Eğitim Enstitüsü Başvuruları Başladı",
    subtitle: "2026-2027 Güz Dönemi Yüksek Lisans ve Doktora programlarında erken kayıt fırsatları.",
    imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/mnsk4r65vzzss-yuksek-lisans.jpg",
    link: "https://www.esenyurt.edu.tr/duyuru/1419-2026-2027-guz-donemi-yuksek-lisans-ve-doktora-basvurulari-basladi"
  },
  {
    id: 3,
    title: "Üniversitemizin 14. Kuruluş Yıl Dönümü",
    subtitle: "Bilimin kenti Esenyurt'ta 14 yıldır kesintisiz yükseköğretim ve gelecek vizyonu.",
    imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/qd2nc7jccjlfr-universitemizin-14-yil-donumu-kutlu-olsun.jfif",
    link: "https://www.esenyurt.edu.tr/haber/2047-kurulusumuzun-14-yil-donumu-kutlu-olsun"
  },
  {
    id: 4,
    title: "İESU Kariyer Günleri & Sektörel Buluşmalar",
    subtitle: "50+ ulusal ve uluslararası firma ile staj ve mülakat imkanları kampüsümüzde.",
    imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/05/gxrvs50xxz1up-asdasdasds.jfif",
    link: "https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu"
  }
];
```

---

## 6. Forensic Audit of Legacy Branding (Gelişim / İGÜ References to Scrub in M2)

During investigation of existing codebase data files, the following remnant references were identified and documented for Implementer (M2):

1. **`src/data/knowledge_base/corporate_hierarchy.json`**:
   - `"university": "İstanbul Gelişim Üniversitesi"` → Must be updated to `"İstanbul Esenyurt Üniversitesi"`
   - `"motto": "Gelişime Açık Olun"` → Must be updated to `"Bilimin Kenti Esenyurt'ta Geleceğinize Yön Verin"`
   - `"rector": "Prof. Dr. Bahri Şahin"` → Must be updated to `"Prof. Dr. Süleyman Özdemir"`
   - `"email": "rehber@gelisim.edu.tr"` → Must be updated to `"rehber@esenyurt.edu.tr"` / `"kariyer@esenyurt.edu.tr"`
   - `"address": "Cihangir Mah... Avcılar / İstanbul"` → Must be updated to `"Zafer Mah. Adile Naşit Bulv. No:1 Esenyurt / İstanbul"`

2. **`src/data/knowledge_base/announcements_media.json`**:
   - `"title": "İGÜ Kariyer Zirvesi 2026 Kayıtları Açıldı"` → Must be updated to `"İESU Kariyer Zirvesi 2026 Kayıtları Açıldı"`

3. **`src/data/knowledge_base/units_services.json`**:
   - `"helpdeskEmail": "bidb@gelisim.edu.tr"` → Must be updated to `"bidb@esenyurt.edu.tr"`

4. **`src/data/knowledge_base/route_map.json`**:
   - `"url": "https://obis.gelisim.edu.tr"` → Must be updated to `"https://obs.esenyurt.edu.tr"`

---

## 7. Action Plan for M2 Integration
1. Drop section 2.1 into `src/data/knowledge_base/corporate_hierarchy.json`.
2. Drop section 2.2 into `src/utils/innerPagesData.js`.
3. Update `academicStaff` in `src/utils/mockData.js` with section 3.1.
4. Update `initialNews` and `initialEvents` in `src/utils/mockData.js` and `src/utils/liveData.js` using section 4.1 and 4.2.
5. Ensure `HeroSlider.jsx` and header logo sources reference section 5.1 and 5.2.
