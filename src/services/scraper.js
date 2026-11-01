/**
 * İESU Kariyer Geliştirme Ofisi Web Scraper Engine & Data Pipeline
 * Dual Browser/Node compatible with live scraping & robust offline fallback.
 */

import {
  OFFICIAL_IESU_INSTAGRAM_POSTS,
  normalizeInstagramGraphPost,
  deduplicateSocialMediaPosts,
  fetchInstagramGraphMedia
} from './instagramService.js';

export {
  OFFICIAL_IESU_INSTAGRAM_POSTS,
  normalizeInstagramGraphPost,
  deduplicateSocialMediaPosts,
  fetchInstagramGraphMedia
};

export const STORAGE_KEY = 'iesu_kariyer_cache_v3';
export const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export const MOCK_IESU_KARIYER_DATA = {
  officeInfo: {
    title: "İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi Koordinatörlüğü",
    description: "Kariyer Geliştirme Ofisi Koordinatörlüğü, öğrencilerimizin ve mezunlarımızın mesleki gelişimlerini desteklemek, kariyer planlamalarına rehberlik etmek ve onları iş dünyası ile buluşturmak amacıyla hizmet vermektedir.",
    address: "Zafer Mah. Adile Naşit Bulv. No:1, Esenyurt / İstanbul / Türkiye",
    email: "kariyer@esenyurt.edu.tr",
    phone: "444 9 123 / +90 (212) 699 09 90",
    workingHours: "Hafta içi 08:30 - 17:30",
    sourceUrl: "https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu",
    coordinators: [
      { name: "Dr. Öğr. Üyesi Kevser Soydan", title: "Kariyer Geliştirme Ofisi Koordinatörü", role: "Kariyer Geliştirme Ofisi Koordinatörü", email: "kevser.soydan@esenyurt.edu.tr" },
      { name: "Öğr. Gör. Caner Ataş", title: "Kariyer Uzmanı", role: "Kariyer Uzmanı", email: "caner.atas@esenyurt.edu.tr" }
    ]
  },
  announcements: [
    {
      id: "duyuru-1581",
      title: "2026-2027 Eğitim Öğretim Yılı Güz Dönemi Vize Sınav Programları",
      date: "26/10/2026",
      category: " Akademik Duyuru",
      summary: "2026-2027 Eğitim Öğretim Yılı Güz Dönemi Vize Sınav Programları (Midterm Exam Schedules) ilan edilmiştir.",
      content: "2026-2027 Eğitim Öğretim Yılı Güz Dönemi Vize Sınav Programları (2026-2027 Academic Year Fall Semester Midterm Exam Schedules) fakülte ve yüksekokul bazında yayımlanmıştır.",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/bm3ic54a7zlig-2026-ozyes-ozel-yetenek-sinavi-basvurulari-basladi.jfif",
      link: "https://www.esenyurt.edu.tr/duyuru/1581-2026-2027-egitim-ogretim-yili-guz-donemi-vize-sinav-programlari-2026-2027-academic-year-fall-semester-midterm-exam-schedules",
      url: "https://www.esenyurt.edu.tr/duyuru/1581-2026-2027-egitim-ogretim-yili-guz-donemi-vize-sinav-programlari-2026-2027-academic-year-fall-semester-midterm-exam-schedules",
      isPinned: true,
      source: "esenyurt.edu.tr"
    },
    {
      id: "duyuru-1576",
      title: "Spor Bilimleri Fakültesi ve Ek Yerleştirme İle Gelen Öğrencilerin Dikkatine!",
      date: "21/10/2026",
      category: "Öğrenci Duyurusu",
      summary: "Spor Bilimleri Fakültesi ve ek yerleştirme ile kayıt yaptıran öğrencilerimiz için ders kaydı ve muafiyet duyurusu.",
      content: "Spor Bilimleri Fakültesi ve ek yerleştirme ile üniversitemize kayıt yaptıran öğrencilerimizin ders kayıt işlemleri hakkında bilgilendirme.",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/mnsk4r65vzzss-yuksek-lisans.jpg",
      link: "https://www.esenyurt.edu.tr/duyuru/1576-spor-bilimleri-fakultesi-ve-ek-yerlestirme-ile-gelen-ogrencilerin-dikkatine",
      url: "https://www.esenyurt.edu.tr/duyuru/1576-spor-bilimleri-fakultesi-ve-ek-yerlestirme-ile-gelen-ogrencilerin-dikkatine",
      isPinned: false,
      source: "esenyurt.edu.tr"
    },
    {
      id: "duyuru-1563",
      title: "Topluma Hizmet Uygulamaları Dersi Başvuruları Başladı",
      date: "14/10/2026",
      category: "Genel Duyuru",
      summary: "2026-2027 Güz Dönemi Topluma Hizmet Uygulamaları dersi proje ve kurum başvuruları başlamıştır.",
      content: "Topluma Hizmet Uygulamaları dersi kapsamında yürütülecek sosyal sorumluluk ve saha projeleri için başvuru takvimi açıklanmıştır.",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/qd2nc7jccjlfr-universitemizin-14-yil-donumu-kutlu-olsun.jfif",
      link: "https://www.esenyurt.edu.tr/duyuru/1563-topluma-hizmet-uygulamalari-dersi-basvurulari-basladi",
      url: "https://www.esenyurt.edu.tr/duyuru/1563-topluma-hizmet-uygulamalari-dersi-basvurulari-basladi",
      isPinned: false,
      source: "esenyurt.edu.tr"
    }
  ],
  events: [
    {
      id: "etkinlik-1840",
      title: "Mimari Kültür ve Sanat Kulübü'nden Teknik Gezi: Novawood Showroom Ziyareti!",
      date: "09 Kasım",
      time: "11:00",
      location: "Novawood Showroom / Teknik Gezi",
      category: "Kültür & Sanat",
      speaker: "Mimari Kültür ve Sanat Kulübü",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/10/nz19buzmdccs4-mimari-kultur-ve-sanat-kulubunden-teknik-gezi-novawood-showroom-ziyareti.jpg",
      link: "https://www.esenyurt.edu.tr/etkinlik/1840-mimari-kultur-ve-sanat-kulubunden-teknik-gezi-novawood-showroom-ziyareti",
      url: "https://www.esenyurt.edu.tr/etkinlik/1840-mimari-kultur-ve-sanat-kulubunden-teknik-gezi-novawood-showroom-ziyareti",
      status: "Upcoming",
      summary: "Mimari Kültür ve Sanat Kulübü teknik gezi programı kapsamında Novawood Showroom ziyareti gerçekleştirilecektir.",
      content: "Mimari Kültür ve Sanat Kulübü'nden Teknik Gezi: Novawood Showroom Ziyareti! Tarih: 09 Kasım, Saat: 11:00.",
      source: "esenyurt.edu.tr"
    },
    {
      id: "etkinlik-1839",
      title: "29 Ekim Cumhuriyet Bayramı Kutlama Programı!",
      date: "27 Ekim",
      time: "13:30",
      location: "Prof. Dr. Fuat Sezgin Konferans Salonu",
      category: "Sosyal & Kurumsal",
      speaker: "İstanbul Esenyurt Üniversitesi Rektörlüğü",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/10/4fnkhf1c6hdhk-29-ekim-cumhuriyet-bayrami-kutlama-programi.jpg",
      link: "https://www.esenyurt.edu.tr/etkinlik/1839-29-ekim-cumhuriyet-bayrami-kutlama-programi",
      url: "https://www.esenyurt.edu.tr/etkinlik/1839-29-ekim-cumhuriyet-bayrami-kutlama-programi",
      status: "Upcoming",
      summary: "Cumhuriyetimizin 103. yıl dönümü kapsamında düzenlenen 29 Ekim Cumhuriyet Bayramı Kutlama Programı.",
      content: "29 Ekim Cumhuriyet Bayramı Kutlama Programı! Tarih: 27 Ekim, Saat: 13:30.",
      source: "esenyurt.edu.tr"
    },
    {
      id: "etkinlik-1835",
      title: "Gökyüzünün Geleceği: Uçaklarda Robotikleşme, Akıllı Teknolojiler ve Pilotajın Dönüşümü!",
      date: "27 Ekim",
      time: "13:00",
      location: "Prof. Dr. Fuat Sezgin Konferans Salonu",
      category: "Teknoloji & Bilim",
      speaker: "Havacılık ve Uzay Kulübü",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/10/a0ne1dli7schi-gokyuzunun-gelecegi-ucaklarda-robotiklesme-akilli-teknolojiler-ve-pilotajin-donusumu.png",
      link: "https://www.esenyurt.edu.tr/etkinlik/1835-gokyuzunun-gelecegi-ucaklarda-robotiklesme-akilli-teknolojiler-ve-pilotajin-donusumu",
      url: "https://www.esenyurt.edu.tr/etkinlik/1835-gokyuzunun-gelecegi-ucaklarda-robotiklesme-akilli-teknolojiler-ve-pilotajin-donusumu",
      status: "Upcoming",
      summary: "Havacılık sektöründe robotik sistemler, otonom uçuş teknolojileri ve pilotajın geleceği üzerine söyleşi.",
      content: "Gökyüzünün Geleceği: Uçaklarda Robotikleşme, Akıllı Teknolojiler ve Pilotajın Dönüşümü! Tarih: 27 Ekim, Saat: 13:00.",
      source: "esenyurt.edu.tr"
    },
    {
      id: "etkinlik-1832",
      title: "Fikirden Projeye: TÜBİTAK 2209-A ve 2209-B Eğitimi!",
      date: "27 Ekim",
      time: "11:00",
      location: "Merkez Kampüs Konferans Salonu",
      category: "Akademik",
      speaker: "Proje ve Teknoloji Transfer Ofisi",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/10/jjx116fpj1fw4-fikirden-projeye-tubitak-2209-a-ve-2209-b-egitimi.png",
      link: "https://www.esenyurt.edu.tr/etkinlik/1832-fikirden-projeye-tubitak-2209-a-ve-2209-b-egitimi",
      url: "https://www.esenyurt.edu.tr/etkinlik/1832-fikirden-projeye-tubitak-2209-a-ve-2209-b-egitimi",
      status: "Upcoming",
      summary: "Üniversite öğrencileri araştırma projeleri destekleme programı TÜBİTAK 2209-A ve 2209-B proje yazım eğitimi.",
      content: "Fikirden Projeye: TÜBİTAK 2209-A ve 2209-B Eğitimi! Tarih: 27 Ekim, Saat: 11:00.",
      source: "esenyurt.edu.tr"
    },
    {
      id: "etkinlik-1836",
      title: "Kriz ve Stres Yönetimi Eğitimi!",
      date: "26 Ekim",
      time: "13:00",
      location: "Prof. Dr. Fuat Sezgin Konferans Salonu",
      category: "Kariyer & Gelişim",
      speaker: "Kariyer Geliştirme Koordinatörlüğü",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/10/pj79a7secfbab-kriz-ve-stres-yonetimi-egitimi.jpg",
      link: "https://www.esenyurt.edu.tr/etkinlik/1836-kriz-ve-stres-yonetimi-egitimi",
      url: "https://www.esenyurt.edu.tr/etkinlik/1836-kriz-ve-stres-yonetimi-egitimi",
      status: "Upcoming",
      summary: "İş ve akademik yaşamda kriz anlarını yönetme ve stres kontrolü üzerine uygulamalı eğitim semineri.",
      content: "Kriz ve Stres Yönetimi Eğitimi! Tarih: 26 Ekim, Saat: 13:00.",
      source: "esenyurt.edu.tr"
    },
    {
      id: "etkinlik-1833",
      title: "Temel Beden Farkındalık Terapisi (BBAT) Semineri!",
      date: "08 Kasım",
      time: "10:00",
      location: "Sağlık Bilimleri Fakültesi Konferans Salonu",
      category: "Akademik",
      speaker: "Fizyoterapi ve Rehabilitasyon Bölümü",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/10/tqlpoor6ncmhk-temel-beden-farkindalik-terapisi-bbat-semineri.jpg",
      link: "https://www.esenyurt.edu.tr/etkinlik/1833-temel-beden-farkindalik-terapisi-bbat-semineri",
      url: "https://www.esenyurt.edu.tr/etkinlik/1833-temel-beden-farkindalik-terapisi-bbat-semineri",
      status: "Upcoming",
      summary: "Temel Beden Farkındalık Terapisi (BBAT) yaklaşımı ve klinik uygulamaları semineri.",
      content: "Temel Beden Farkındalık Terapisi (BBAT) Semineri! Tarih: 08 Kasım, Saat: 10:00.",
      source: "esenyurt.edu.tr"
    },
    {
      id: "etkinlik-1830",
      title: "Fizyoterapide Kariyer Yolculuğu!",
      date: "07 Aralık",
      time: "12:00",
      location: "Prof. Dr. Fuat Sezgin Konferans Salonu",
      category: "Kariyer & Sektör",
      speaker: "Sağlık Bilimleri Fakültesi & KGM",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/10/wwsywtvoiujec-fizyoterapide-kariyer-yolculugu.jpg",
      link: "https://www.esenyurt.edu.tr/etkinlik/1830-fizyoterapide-kariyer-yolculugu",
      url: "https://www.esenyurt.edu.tr/etkinlik/1830-fizyoterapide-kariyer-yolculugu",
      status: "Upcoming",
      summary: "Mezun fizyoterapistler ve klinik yöneticileriyle sağlık sektöründe kariyer fırsatları söyleşisi.",
      content: "Fizyoterapide Kariyer Yolculuğu! Tarih: 07 Aralık, Saat: 12:00.",
      source: "esenyurt.edu.tr"
    },
    {
      id: "etkinlik-1824",
      title: "Geleceğin Şefkatli Ellerinden Şifa Niyetine Türküler!",
      date: "09 Aralık",
      time: "14:00",
      location: "Prof. Dr. Fuat Sezgin Konferans Salonu",
      category: "Kültür & Sanat",
      speaker: "Sağlık Hizmetleri MYO & Müzik Kulübü",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/10/ykzsghd1v15rc-gelecegin-sefkatli-ellerinden-sifa-niyetine-turkuler.jpg",
      link: "https://www.esenyurt.edu.tr/etkinlik/1824-gelecegin-sefkatli-ellerinden-sifa-niyetine-turkuler",
      url: "https://www.esenyurt.edu.tr/etkinlik/1824-gelecegin-sefkatli-ellerinden-sifa-niyetine-turkuler",
      status: "Upcoming",
      summary: "Öğrencilerimizin hazırladığı geleneksel Türk Halk Müziği dinletisi ve kültür buluşması.",
      content: "Geleceğin Şefkatli Ellerinden Şifa Niyetine Türküler! Tarih: 09 Aralık, Saat: 14:00.",
      source: "esenyurt.edu.tr"
    },
    {
      id: "etkinlik-1823",
      title: "Kalite Topluluğu Tanışma ve Yeni Dönem Buluşması!",
      date: "22 Ekim",
      time: "11:00",
      location: "Merkez Kampüs Amfi 2",
      category: "Sosyal & Kurumsal",
      speaker: "İESÜ Kalite Topluluğu",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/10/goptxt6egfaak-kalite-toplulugu-tanisma-ve-yeni-donem-bulusmasi.png",
      link: "https://www.esenyurt.edu.tr/etkinlik/1823-kalite-toplulugu-tanisma-ve-yeni-donem-bulusmasi",
      url: "https://www.esenyurt.edu.tr/etkinlik/1823-kalite-toplulugu-tanisma-ve-yeni-donem-bulusmasi",
      status: "Upcoming",
      summary: "YÖKAK kalite elçileri ve Kalite Topluluğu yeni akademik dönem proje ve tanışma toplantısı.",
      content: "Kalite Topluluğu Tanışma ve Yeni Dönem Buluşması! Tarih: 22 Ekim, Saat: 11:00.",
      source: "esenyurt.edu.tr"
    },
    {
      id: "etkinlik-1756",
      title: "Türkiye Coğrafi İstihbarat Sempozyumu'nu duyurmaktan gurur duyuyoruz!",
      date: "19 Kasım",
      time: "09:00",
      location: "İstanbul | Wish More Hotel & Merkez Kampüs",
      category: "Akademik",
      speaker: "İESÜ & TASAM MSGE & MSB Harita Genel Müdürlüğü",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/08/z3eienjfa37b8-turkiye-cografi-istihbarat-sempozyumunu-duyurmaktan-gurur-duyuyoruz.jpg",
      link: "https://www.esenyurt.edu.tr/etkinlik/1756-turkiye-cografi-istihbarat-sempozyumunu-duyurmaktan-gurur-duyuyoruz",
      url: "https://www.esenyurt.edu.tr/etkinlik/1756-turkiye-cografi-istihbarat-sempozyumunu-duyurmaktan-gurur-duyuyoruz",
      status: "Upcoming",
      summary: "Jeouzamsal İstihbarat ve Yapay Zekâ temalı uluslararası sempozyum.",
      content: "Türkiye Coğrafi İstihbarat Sempozyumu, 19-20 Kasım 2026.",
      source: "esenyurt.edu.tr"
    },
    {
      id: "etkinlik-1724",
      title: "Geleceğin dünyasını şekillendiren teknolojiler ve dijital dönüşüm Bilim Kafe’de konuşuluyor!",
      date: "27 Temmuz",
      time: "14:00",
      location: "Bilim Kafe",
      category: "Teknoloji & Bilim",
      speaker: "Bilim İletişimi Koordinatörlüğü",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/tjb9hhos5ydrt-gelecegin-dunyasini-sekillendiren-teknolojiler-ve-dijital-donusum-bilim-kafe’de-konusuluyor.jfif",
      link: "https://www.esenyurt.edu.tr/etkinlik/1724-gelecegin-dunyasini-sekillendiren-teknolojiler-ve-dijital-donusum-bilim-kafe’de-konusuluyor",
      url: "https://www.esenyurt.edu.tr/etkinlik/1724-gelecegin-dunyasini-sekillendiren-teknolojiler-ve-dijital-donusum-bilim-kafe’de-konusuluyor",
      status: "Upcoming",
      summary: "Geleceğin dünyasını şekillendiren teknolojiler ve dijital dönüşüm Bilim Kafe’de konuşuluyor.",
      content: "Geleceğin dünyasını şekillendiren teknolojiler ve dijital dönüşüm Bilim Kafe’de konuşuluyor!",
      source: "esenyurt.edu.tr"
    },
    {
      id: "etkinlik-1720",
      title: "III. Yönetim Bilimleri Sempozyumu",
      date: "26 Kasım",
      time: "10:00",
      location: "Prof. Dr. Fuat Sezgin Konferans Salonu",
      category: "Akademik",
      speaker: "İşletme ve Yönetim Bilimleri Fakültesi",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/oh0lm0qvjbwgc-iii-yonetim-bilimleri-sempozyumu.jfif",
      link: "https://www.esenyurt.edu.tr/etkinlik/1720-iii-yonetim-bilimleri-sempozyumu",
      url: "https://www.esenyurt.edu.tr/etkinlik/1720-iii-yonetim-bilimleri-sempozyumu",
      status: "Upcoming",
      summary: "Yapay Zekâ ve Etik temalı III. Yönetim Bilimleri Sempozyumu.",
      content: "III. Yönetim Bilimleri Sempozyumu.",
      source: "esenyurt.edu.tr"
    }
  ],
  news: [
    {
      id: "haber-2643",
      title: "Cumhuriyetimizin 103. yıl dönümünü büyük bir coşku ve gururla kutluyoruz.",
      date: "28/10/2026",
      category: "Kampüs Haberi",
      summary: "Şanlı tarihimizin en büyük gururu, egemenliğimizin sarsılmaz simgesi Cumhuriyetimizin 103. yıl dönümü üniversitemizde coşkuyla kutlandı.",
      content: "Cumhuriyetimizin 103. yıl dönümünü büyük bir coşku ve gururla kutluyoruz.",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/10/ygwdtig4tykmo-cumhuriyetimizin-103-yil-donumunu-buyuk-bir-cosku-ve-gururla-kutluyoruz.jpg",
      url: "https://www.esenyurt.edu.tr/haber/2643-cumhuriyetimizin-103-yil-donumunu-buyuk-bir-cosku-ve-gururla-kutluyoruz",
      link: "https://www.esenyurt.edu.tr/haber/2643-cumhuriyetimizin-103-yil-donumunu-buyuk-bir-cosku-ve-gururla-kutluyoruz",
      source: "esenyurt.edu.tr"
    },
    {
      id: "haber-2630",
      title: "YÖKAK Kurumsal Akreditasyon Programı Hazırlıkları Değerlendirildi",
      date: "26/10/2026",
      category: "Kalite & Akreditasyon",
      summary: "İstanbul Esenyurt Üniversitesinde, Yükseköğretim Kalite Kurulu (YÖKAK) Kurumsal Akreditasyon Programı (KAP) hazırlıkları değerlendirildi.",
      content: "İstanbul Esenyurt Üniversitesinde, Yükseköğretim Kalite Kurulu (YÖKAK) tarafından yürütülen Kurumsal Akreditasyon Programı hazırlıkları kapsamlı biçimde ele alındı.",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/10/b23vlg8aq2o1g-yokak-kurumsal-akreditasyon-programi-hazirliklari-degerlendirildi-2.png",
      url: "https://www.esenyurt.edu.tr/haber/2630-yokak-kurumsal-akreditasyon-programi-hazirliklari-degerlendirildi-2",
      link: "https://www.esenyurt.edu.tr/haber/2630-yokak-kurumsal-akreditasyon-programi-hazirliklari-degerlendirildi-2",
      source: "esenyurt.edu.tr"
    },
    {
      id: "haber-2625",
      title: "İstanbul Esenyurt Üniversitesi’nde 2025-2026 Yılı En İyi Eğitim-Öğretim Ödülleri, düzenlenen törenle sahiplerine verildi.",
      date: "26/10/2026",
      category: "Akademik Başarı",
      summary: "Prof. Dr. Fuat Sezgin Konferans Salonu’nda gerçekleştirilen törende 2025-2026 Yılı En İyi Eğitim-Öğretim Ödülleri akademisyenlerimize takdim edildi.",
      content: "İstanbul Esenyurt Üniversitesi’nde 2025-2026 Yılı En İyi Eğitim-Öğretim Ödülleri, düzenlenen törenle sahiplerine verildi.",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/10/0lgzw00u11mr7-istanbul-esenyurt-universitesi’nde-2025-2026-yili-en-iyi-egitim-ogretim-odulleri-duzenlenen-torenle-sahiplerine-verildi.png",
      url: "https://www.esenyurt.edu.tr/haber/2625-istanbul-esenyurt-universitesi’nde-2025-2026-yili-en-iyi-egitim-ogretim-odulleri-duzenlenen-torenle-sahiplerine-verildi",
      link: "https://www.esenyurt.edu.tr/haber/2625-istanbul-esenyurt-universitesi’nde-2025-2026-yili-en-iyi-egitim-ogretim-odulleri-duzenlenen-torenle-sahiplerine-verildi",
      source: "esenyurt.edu.tr"
    },
    {
      id: "haber-2623",
      title: "Prof. Dr. Muhsin Kar, Rektörümüzü Ziyaret Etti: Gündemde “Yükseköğretimde Kalite” Vardı",
      date: "26/10/2026",
      category: "Kurumsal Ziyaret",
      summary: "Yükseköğretimde kalite güvencesi ve kurumsal akreditasyon süreçleri üzerine değerlendirme toplantısı gerçekleştirildi.",
      content: "Prof. Dr. Muhsin Kar, Rektörümüzü Ziyaret Etti: Gündemde “Yükseköğretimde Kalite” Vardı.",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/10/xrg29dad6vo9h-prof-dr-muhsin-kar-rektorumuzu-ziyaret-etti-gundemde-“yuksekogretimde-kalite”-vardi.png",
      url: "https://www.esenyurt.edu.tr/haber/2623-prof-dr-muhsin-kar-rektorumuzu-ziyaret-etti-gundemde-“yuksekogretimde-kalite”-vardi",
      link: "https://www.esenyurt.edu.tr/haber/2623-prof-dr-muhsin-kar-rektorumuzu-ziyaret-etti-gundemde-“yuksekogretimde-kalite”-vardi",
      source: "esenyurt.edu.tr"
    }
  ],
  socialMedia: OFFICIAL_IESU_INSTAGRAM_POSTS,
  lastUpdated: new Date().toISOString(),
  source: "fallback",
  status: "success"
};

export const OFFICIAL_FALLBACK_IMAGES = {
  news: 'https://www.esenyurt.edu.tr/uploads/2026/10/ygwdtig4tykmo-cumhuriyetimizin-103-yil-donumunu-buyuk-bir-cosku-ve-gururla-kutluyoruz.jpg',
  event: 'https://www.esenyurt.edu.tr/uploads/2026/10/nz19buzmdccs4-mimari-kultur-ve-sanat-kulubunden-teknik-gezi-novawood-showroom-ziyareti.jpg',
  announcement: 'https://www.esenyurt.edu.tr/uploads/2026/07/bm3ic54a7zlig-2026-ozyes-ozel-yetenek-sinavi-basvurulari-basladi.jfif'
};

// Known soft-404 upload slugs on esenyurt.edu.tr that return text/html instead of image/*
const BROKEN_UPLOAD_PATTERNS = [
  '2e6bua6grui8j-spor-bilimleri-fakultesi',
  '/assets/events/default.jpg',
  'undefined',
  'null'
];

/**
 * Normalizes and repairs scraped or stored image URLs.
 * Decodes HTML entities (&amp; -> &), resolves relative esenyurt.edu.tr paths,
 * and replaces known soft-404 URLs with official university fallback visuals.
 */
export function normalizeScrapedImageUrl(rawUrl = '', fallbackType = 'event') {
  const fallback = OFFICIAL_FALLBACK_IMAGES[fallbackType] || OFFICIAL_FALLBACK_IMAGES.event;
  if (!rawUrl || typeof rawUrl !== 'string') return fallback;

  const decoded = rawUrl
    .replace(/&amp;/gi, '&')
    .replace(/&#0*38;/gi, '&')
    .replace(/&quot;/gi, '')
    .trim();

  if (!decoded || decoded === '#' || decoded === '/') return fallback;
  if ( decoded.startsWith('data:image/') ) return decoded;

  const lower = decoded.toLowerCase();
  if (BROKEN_UPLOAD_PATTERNS.some((pat) => lower.includes(pat))) {
    return fallback;
  }

  // If the URL still contains raw '&' inside an esenyurt.edu.tr /uploads/ filename, it triggers a soft-404 on the server
  if (lower.includes('esenyurt.edu.tr/uploads/') && decoded.includes('&')) {
    return fallback;
  }

  if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
    return decoded;
  }
  if (decoded.startsWith('/')) {
    return `https://www.esenyurt.edu.tr${decoded}`;
  }
  return `https://www.esenyurt.edu.tr/${decoded}`;
}

/**
 * Cleans HTML entities and tags from scraped or RSS strings.
 */
export function cleanScrapedText(raw = '') {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;|&rsquo;|&lsquo;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/^\s*\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b(?!\s*(?:tarihli|günü|sayılı)\b)\s*[-–—:]?\s*/gi, '')
    .replace(/(?:\.{2,}|…|!|\s)*(?:devamını\s+oku|detaylı\s+bilgi\s+için\s+tıklayınız|detaylar\s+için\s+tıklayınız)\s*$/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractInlineDateAndImage(rawHtml = '', resolveUrlFn = (u) => u) {
  if (!rawHtml || typeof rawHtml !== 'string') return { date: '', imageUrl: '' };
  const dateMatch = rawHtml.replace(/<[^>]+>/g, ' ').match(/\b(\d{1,2}[./]\d{1,2}[./]\d{4})\b/);
  const imgMatch = rawHtml.match(/<img[^>]+(?:src|data-src)=["']([^"']+)["']/i);
  const rawImg = imgMatch && imgMatch[1] ? imgMatch[1].replace(/&amp;/gi, '&').trim() : '';
  return {
    date: dateMatch ? dateMatch[1].replace(/\//g, '.') : '',
    imageUrl: rawImg ? resolveUrlFn(rawImg) : ''
  };
}

const JUNK_OR_FAKE_TITLES = new Set([
  'kuruluş ve tarihçe',
  'kurucu vakfımız',
  "mütevelli heyeti başkan'ından",
  'rektörün mesajı',
  'yönetim kurulu',
  'senato',
  'organizasyon şeması',
  'başvuru ve kayıt',
  'kariyer geliştirme merkezi koordinatörlüğü',
  'kariyer geliştirme ofisi koordinatörlüğü',
  'akademik takvim',
  'öğrenci işleri',
  'devamını oku',
  'detaylı bilgi için tıklayınız',
  'iesü sanayi iş birlikleri ve osb istihdam protokolü imzalandı',
  'iesu sanayi is birlikleri ve osb istihdam protokolu imzalandi',
  'ulusal akademik sempozyum ve teknofest 2026 proje takımları buluşması',
  'iesü ulusal üniversite-sanayi iş birliği ve uygulamalı bilimler sempozyumu'
]);

/**
 * Turkish-aware title normalizer for strict deduplication across News, Events, and Announcements.
 * Ensures e.g. "SPOR BİLİMLERİ FAKÜLTESİ & EK YERLEŞTİRME İLE GELEN ÖĞRENCİLERİMİZİN DİKKATİNE!"
 * and "Spor Bilimleri Fakültesi Ve Ek Yerleştirme İle Gelen Öğrencilerin Dikkatine!"
 * resolve to the exact same canonical key.
 */
export function normalizeTitleForDedup(str = '') {
  const cleaned = cleanScrapedText(str);
  if (!cleaned) return '';
  return cleaned
    .toLocaleLowerCase('tr-TR')
    .replace(/\u0307/g, '')
    .replace(/&/g, ' ve ')
    .replace(/öğrencilerimizin/g, 'öğrencilerin')
    .replace(/mezunlarımızın/g, 'mezunların')
    .replace(/akademisyenlerimizin/g, 'akademisyenlerin')
    .replace(/personelimizin/g, 'personelin')
    .replace(/['’"“”.,!?:;()[\]\-_/+•|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractCanonicalArticleKey(urlOrLink = '') {
  const s = String(urlOrLink || '').trim().toLowerCase();
  if (!s || s === '#') return '';
  const m = s.match(/\/(haber|etkinlik|duyuru)\/(\d+)/i);
  if (m) return `${m[1]}:${m[2]}`;
  return s.replace(/^https?:\/\/(www\.)?esenyurt\.edu\.tr/i, '').replace(/\/+$/, '');
}

/**
 * Pure deterministic deduplicator for scraped/RSS items.
 * Eliminates duplicate titles, duplicate canonical URLs/IDs, and fabricated items,
 * and repairs broken/soft-404 image URLs.
 */
export function deduplicateFeedItems(existingItems = [], incomingItems = [], maxItems = 50) {
  const safeExisting = Array.isArray(existingItems) ? existingItems : [];
  const safeIncoming = Array.isArray(incomingItems) ? incomingItems : [];
  const seenTitles = new Set();
  const seenUrls = new Set();
  const seenUploadImages = new Set();
  const result = [];

  for (const item of [...safeIncoming, ...safeExisting]) {
    if (!item || typeof item !== 'object' || !item.title) continue;
    const cleanedTitle = cleanScrapedText(item.title);
    if (!cleanedTitle || cleanedTitle.length < 4) continue;

    const normTitle = normalizeTitleForDedup(cleanedTitle);
    if (!normTitle || JUNK_OR_FAKE_TITLES.has(normTitle) || JUNK_OR_FAKE_TITLES.has(cleanedTitle.toLocaleLowerCase('tr-TR'))) {
      continue;
    }

    const urlKey = extractCanonicalArticleKey(item.url || item.link || '');
    const rawImg = String(item.imageUrl || item.image || '').trim();
    const fallbackType =
      urlKey.startsWith('duyuru:') || String(item.id || '').startsWith('duyuru') || String(item.id || '').startsWith('ann')
        ? 'announcement'
        : urlKey.startsWith('haber:') || String(item.id || '').startsWith('haber') || String(item.id || '').startsWith('news')
        ? 'news'
        : 'event';
    const normalizedImg = rawImg ? normalizeScrapedImageUrl(rawImg, fallbackType) : '';

    const isSpecificUploadImg =
      normalizedImg.includes('/uploads/') &&
      !normalizedImg.includes('gxrvs50xxz1up-asdasdasds') &&
      !normalizedImg.includes('bm3ic54a7zlig-2026-ozyes') &&
      !normalizedImg.includes('mnsk4r65vzzss-yuksek-lisans') &&
      !normalizedImg.includes('qd2nc7jccjlfr-universitemizin-14-yil-donumu') &&
      !normalizedImg.includes('ygwdtig4tykmo-cumhuriyetimizin-103-yil-donumu') &&
      !normalizedImg.includes('nz19buzmdccs4-mimari-kultur-ve-sanat-kulubunden');

    if (seenTitles.has(normTitle)) continue;
    if (urlKey && urlKey.length > 3 && !urlKey.endsWith('/haberler') && !urlKey.endsWith('/etkinlikler') && !urlKey.endsWith('/duyurular') && !urlKey.includes('2355-kariyer-gelistirme') && seenUrls.has(urlKey)) {
      continue;
    }
    if (isSpecificUploadImg && seenUploadImages.has(normalizedImg)) {
      continue;
    }

    seenTitles.add(normTitle);
    if (urlKey && urlKey.length > 3) seenUrls.add(urlKey);
    if (isSpecificUploadImg) seenUploadImages.add(normalizedImg);

    const cleanedSummary = item.summary ? cleanScrapedText(item.summary) : cleanedTitle;
    const cleanedDesc = item.description ? cleanScrapedText(item.description) : cleanedSummary;
    const cleanedContent = item.content ? cleanScrapedText(item.content) : cleanedDesc;

    result.push({
      ...item,
      title: cleanedTitle,
      summary: cleanedSummary,
      description: cleanedDesc,
      content: cleanedContent,
      ...(normalizedImg ? { imageUrl: normalizedImg } : {}),
      source: item.source || 'esenyurt.edu.tr'
    });
    if (result.length >= maxItems) break;
  }

  return result;
}

/**
 * Parses standard RSS 2.0 (<item>) or Atom (<entry>) XML feeds from esenyurt.edu.tr
 * into normalized { news, events, announcements } arrays.
 */
export function parseIesuRssXml(xmlString = '') {
  const emptyResult = { news: [], events: [], announcements: [], feedFormat: 'rss-xml' };
  if (!xmlString || typeof xmlString !== 'string') return emptyResult;

  const resolveUrl = (url) => {
    if (!url) return 'https://www.esenyurt.edu.tr/';
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    if (trimmed.startsWith('/')) return `https://www.esenyurt.edu.tr${trimmed}`;
    return `https://www.esenyurt.edu.tr/${trimmed}`;
  };

  const DEFAULT_NEWS_IMAGE = "https://www.esenyurt.edu.tr/uploads/2026/10/ygwdtig4tykmo-cumhuriyetimizin-103-yil-donumunu-buyuk-bir-cosku-ve-gururla-kutluyoruz.jpg";
  const DEFAULT_EVENT_IMAGE = "https://www.esenyurt.edu.tr/uploads/2026/10/nz19buzmdccs4-mimari-kultur-ve-sanat-kulubunden-teknik-gezi-novawood-showroom-ziyareti.jpg";
  const DEFAULT_ANN_IMAGE = "https://www.esenyurt.edu.tr/uploads/2026/07/bm3ic54a7zlig-2026-ozyes-ozel-yetenek-sinavi-basvurulari-basladi.jfif";

  const extractTag = (block, tagNames) => {
    for (const tag of tagNames) {
      const regex = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i');
      const match = block.match(regex);
      if (match && match[1]) {
        return match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1').trim();
      }
    }
    return '';
  };

  const extractImage = (block, rawDesc = '') => {
    const enclosureMatch = block.match(/<(?:enclosure|media:content|media:thumbnail)[^>]+url=["']([^"']+)["']/i);
    if (enclosureMatch && enclosureMatch[1]) return resolveUrl(enclosureMatch[1]);
    const imgMatch = (block + ' ' + rawDesc).match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) return resolveUrl(imgMatch[1]);
    return '';
  };

  const itemBlocks = [];
  const rssItemRegex = /<(?:item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/(?:item|entry)>/gi;
  let match;
  while ((match = rssItemRegex.exec(xmlString)) !== null) {
    itemBlocks.push(match[1]);
  }

  const news = [];
  const events = [];
  const announcements = [];

  itemBlocks.forEach((block, index) => {
    const rawTitle = extractTag(block, ['title']);
    const title = cleanScrapedText(rawTitle);
    if (!title || title.length < 4) return;

    let rawLink = extractTag(block, ['link', 'guid', 'id']);
    if (!rawLink) {
      const atomLink = block.match(/<link[^>]+href=["']([^"']+)["']/i);
      if (atomLink && atomLink[1]) rawLink = atomLink[1];
    }
    const canonicalUrl = resolveUrl(cleanScrapedText(rawLink));

    const rawDesc = extractTag(block, ['description', 'content:encoded', 'summary', 'content']);
    const cleanDesc = cleanScrapedText(rawDesc) || title;
    const rawDate = cleanScrapedText(extractTag(block, ['pubDate', 'dc:date', 'published', 'updated']));
    const rawCategory = cleanScrapedText(extractTag(block, ['category']));
    const rawLocation = cleanScrapedText(extractTag(block, ['location', 'ev:location']));

    let formattedDate = rawDate || new Date().toISOString().split('T')[0];
    if (rawDate) {
      const parsedTs = Date.parse(rawDate);
      if (!Number.isNaN(parsedTs)) {
        formattedDate = new Date(parsedTs).toISOString().split('T')[0];
      }
    }

    const imageUrl = extractImage(block, rawDesc);
    const combinedText = `${rawCategory} ${canonicalUrl} ${title}`.toLowerCase();

    const isEvent =
      combinedText.includes('etkinlik') ||
      combinedText.includes('seminer') ||
      combinedText.includes('sempozyum') ||
      combinedText.includes('konferans') ||
      combinedText.includes('zirve') ||
      combinedText.includes('söyleşi') ||
      combinedText.includes('fuar') ||
      combinedText.includes('workshop');

    const isAnnouncement =
      !isEvent && (
        combinedText.includes('duyuru') ||
        combinedText.includes('ilan') ||
        combinedText.includes('başvuru') ||
        combinedText.includes('sınav') ||
        combinedText.includes('takvim') ||
        combinedText.includes('prosedür')
      );

    if (isEvent) {
      events.push({
        id: `rss-evt-${index + 1}`,
        title,
        date: formattedDate,
        location: rawLocation || 'İstanbul Esenyurt Üniversitesi Kampüsü',
        category: rawCategory || 'Üniversite Etkinliği',
        summary: cleanDesc,
        content: cleanDesc,
        imageUrl: imageUrl || DEFAULT_EVENT_IMAGE,
        link: canonicalUrl,
        url: canonicalUrl,
        status: 'Upcoming',
        source: 'esenyurt.edu.tr (RSS)'
      });
    } else if (isAnnouncement) {
      announcements.push({
        id: `rss-ann-${index + 1}`,
        title,
        date: formattedDate,
        category: rawCategory || 'Resmi Duyuru',
        summary: cleanDesc,
        content: cleanDesc,
        imageUrl: imageUrl || DEFAULT_ANN_IMAGE,
        link: canonicalUrl,
        url: canonicalUrl,
        isPinned: announcements.length === 0,
        source: 'esenyurt.edu.tr (RSS)'
      });
    } else {
      news.push({
        id: `rss-news-${index + 1}`,
        title,
        date: formattedDate,
        category: rawCategory || 'Kampüs Haberi',
        summary: cleanDesc,
        content: cleanDesc,
        imageUrl: imageUrl || DEFAULT_NEWS_IMAGE,
        url: canonicalUrl,
        link: canonicalUrl,
        source: 'esenyurt.edu.tr (RSS)'
      });
    }
  });

  return { news, events, announcements, feedFormat: 'rss-xml' };
}

export function fetchIesuKariyerData() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.lastUpdated) {
          const age = Date.now() - new Date(parsed.lastUpdated).getTime();
          if (age < CACHE_TTL_MS) {
            return parsed;
          }
        }
      }
    }
  } catch (e) {
    console.warn("LocalStorage access failed, returning fallback:", e);
  }
  return MOCK_IESU_KARIYER_DATA;
}

export async function scrapeLiveOrFallback(options = {}) {
  const { forceRefresh = false, timeoutMs = 4000, persistToFirestore = true } = options;
  if (!forceRefresh) {
    const cachedData = fetchIesuKariyerData();
    if (cachedData && cachedData.source === 'live') return cachedData;
  }

  try {
    const endpoints = [
      '/api/iesu-rss-scraper',
      'https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu',
      '/api/esenyurt-live/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu',
      '/api/esenyurt-live/'
    ];

    let htmlOrXmlText = '';
    let jsonPayload = null;

    for (const targetUrl of endpoints) {
      try {
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timeoutId = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
        const response = await fetch(targetUrl, { signal: controller ? controller.signal : undefined });
        if (timeoutId) clearTimeout(timeoutId);
        if (response && response.ok) {
          if (targetUrl === '/api/iesu-rss-scraper' && typeof response.headers?.get === 'function' && (response.headers.get('content-type') || '').includes('application/json')) {
            const parsedJson = await response.json();
            if (parsedJson && parsedJson.ok) {
              jsonPayload = parsedJson;
              break;
            }
          }
          if (typeof response.text === 'function') {
            const text = await response.text();
            if (text && text.length > 80 && !text.includes('<div id="root"></div>')) {
              try {
                if (text.trim().startsWith('{')) {
                  const maybeJson = JSON.parse(text);
                  if (maybeJson && maybeJson.ok && (Array.isArray(maybeJson.news) || Array.isArray(maybeJson.announcements))) {
                    jsonPayload = maybeJson;
                    break;
                  }
                }
              } catch (_) {}
              htmlOrXmlText = text;
              break;
            }
          }
        }
      } catch (_) {
        // try next endpoint
      }
    }

    let parsedData = null;

    if (jsonPayload) {
      parsedData = {
        officeInfo: jsonPayload.officeInfo || MOCK_IESU_KARIYER_DATA.officeInfo,
        announcements: Array.isArray(jsonPayload.announcements) && jsonPayload.announcements.length > 0
          ? deduplicateFeedItems(MOCK_IESU_KARIYER_DATA.announcements, jsonPayload.announcements, 25)
          : MOCK_IESU_KARIYER_DATA.announcements,
        events: Array.isArray(jsonPayload.events) && jsonPayload.events.length > 0
          ? deduplicateFeedItems(MOCK_IESU_KARIYER_DATA.events, jsonPayload.events, 25)
          : MOCK_IESU_KARIYER_DATA.events,
        news: Array.isArray(jsonPayload.news) && jsonPayload.news.length > 0
          ? deduplicateFeedItems(MOCK_IESU_KARIYER_DATA.news, jsonPayload.news, 25)
          : MOCK_IESU_KARIYER_DATA.news,
        socialMedia: Array.isArray(jsonPayload.socialMedia) && jsonPayload.socialMedia.length > 0
          ? deduplicateSocialMediaPosts([], jsonPayload.socialMedia, 24)
          : deduplicateSocialMediaPosts([], OFFICIAL_IESU_INSTAGRAM_POSTS, 24),
        lastUpdated: jsonPayload.fetchedAt || new Date().toISOString(),
        source: 'live',
        status: 'success',
        feedFormat: jsonPayload.feedFormat || 'rss+html-scraper+instagram-graph'
      };
    } else if (htmlOrXmlText) {
      const igResult = await fetchInstagramGraphMedia({ timeoutMs: 2500 }).catch(() => ({
        posts: OFFICIAL_IESU_INSTAGRAM_POSTS
      }));
      const cleanSocial = deduplicateSocialMediaPosts([], igResult?.posts || OFFICIAL_IESU_INSTAGRAM_POSTS, 24);
      const isRssXml = /<(?:rss|feed)\b/i.test(htmlOrXmlText) && /<(?:item|entry)\b/i.test(htmlOrXmlText);
      if (isRssXml) {
        const rssParsed = parseIesuRssXml(htmlOrXmlText);
        parsedData = {
          officeInfo: MOCK_IESU_KARIYER_DATA.officeInfo,
          announcements: rssParsed.announcements.length > 0 ? rssParsed.announcements : MOCK_IESU_KARIYER_DATA.announcements,
          events: rssParsed.events.length > 0 ? rssParsed.events : MOCK_IESU_KARIYER_DATA.events,
          news: rssParsed.news.length > 0 ? rssParsed.news : MOCK_IESU_KARIYER_DATA.news,
          socialMedia: cleanSocial,
          lastUpdated: new Date().toISOString(),
          source: 'live',
          status: 'success',
          feedFormat: 'rss-xml+instagram-graph'
        };
      } else {
        parsedData = parseIesuHtmlPayload(htmlOrXmlText);
        parsedData.socialMedia = cleanSocial;
        parsedData.lastUpdated = new Date().toISOString();
        parsedData.source = 'live';
        parsedData.status = 'success';
      }
    } else {
      throw new Error('Live endpoints unreachable or blocked by CORS');
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
      } catch (e) {}
    }

    const isTestEnv = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || import.meta.env?.MODE === 'test');
    if (persistToFirestore && !isTestEnv) {
      import('./dbSync').then(({ saveScrapedFeedToFirestore }) => {
        saveScrapedFeedToFirestore(parsedData).catch(() => {});
      }).catch(() => {});
    }

    return parsedData;
  } catch (err) {
    console.warn("Live scraping fallback triggered:", err.message);
    const fallbackPayload = {
      ...MOCK_IESU_KARIYER_DATA,
      lastUpdated: new Date().toISOString(),
      source: 'fallback',
      status: 'warning'
    };
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackPayload));
      } catch (e) {}
    }
    const isTestEnv = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || import.meta.env?.MODE === 'test');
    if (persistToFirestore && !isTestEnv) {
      import('./dbSync').then(({ saveScrapedFeedToFirestore }) => {
        saveScrapedFeedToFirestore(fallbackPayload).catch(() => {});
      }).catch(() => {});
    }
    return fallbackPayload;
  }
}

export function parseIesuHtmlPayload(html) {
  if (!html || typeof html !== 'string') {
    return {
      ...MOCK_IESU_KARIYER_DATA,
      lastUpdated: new Date().toISOString(),
      source: 'live',
      status: 'success'
    };
  }

  let doc = null;
  try {
    if (typeof window !== 'undefined' && window.DOMParser) {
      const parser = new window.DOMParser();
      doc = parser.parseFromString(html, 'text/html');
    } else if (typeof DOMParser !== 'undefined') {
      const parser = new DOMParser();
      doc = parser.parseFromString(html, 'text/html');
    }
  } catch (e) {
    console.warn("DOMParser unavailable or failed:", e);
  }

  const announcements = extractAnnouncements(doc, html);
  const events = extractEvents(doc, html);
  const news = extractNews(doc, html);
  const officeInfo = extractOfficeInfo(doc, html);

  return {
    announcements: announcements.length > 0 ? announcements : MOCK_IESU_KARIYER_DATA.announcements,
    events: events.length > 0 ? events : MOCK_IESU_KARIYER_DATA.events,
    news: news.length > 0 ? news : MOCK_IESU_KARIYER_DATA.news,
    socialMedia: MOCK_IESU_KARIYER_DATA.socialMedia,
    officeInfo: officeInfo && officeInfo.title ? officeInfo : MOCK_IESU_KARIYER_DATA.officeInfo,
    lastUpdated: new Date().toISOString(),
    source: 'live',
    status: 'success'
  };
}

export function extractNews(doc, html = '') {
  if (!doc && !html) return [];
  const items = [];
  const resolveUrl = (url) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    if (trimmed.startsWith('/')) return `https://www.esenyurt.edu.tr${trimmed}`;
    return `https://www.esenyurt.edu.tr/${trimmed}`;
  };
  const DEFAULT_NEWS_IMAGE = "https://www.esenyurt.edu.tr/uploads/2026/10/ygwdtig4tykmo-cumhuriyetimizin-103-yil-donumunu-buyuk-bir-cosku-ve-gururla-kutluyoruz.jpg";

  // 1. Parse <a href="/haber/..."> cards from HTML string (works in both Node & Browser)
  if (html && typeof html === 'string') {
    const byUrl = new Map();
    const haberLinkRegex = /<a[^>]+href=["']([^"']*\/haber\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    while ((match = haberLinkRegex.exec(html)) !== null) {
      const rawHref = match[1].trim();
      const innerHtml = match[2];
      const fullUrl = resolveUrl(rawHref);

      const h3Match = innerHtml.match(/<h[234][^>]*>([\s\S]*?)<\/h[234]>/i);
      const pMatch = innerHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
      const { date, imageUrl } = extractInlineDateAndImage(innerHtml, resolveUrl);

      const title = cleanScrapedText(h3Match ? h3Match[1] : innerHtml);
      const summary = cleanScrapedText(pMatch ? pMatch[1] : '') || title;

      const existing = byUrl.get(fullUrl) || {
        url: fullUrl,
        link: fullUrl,
        title: '',
        summary: '',
        date: '',
        imageUrl: ''
      };

      if (title && (!existing.title || h3Match)) existing.title = title;
      if (summary && !existing.summary) existing.summary = summary;
      if (date && !existing.date) existing.date = date;
      if (imageUrl && !existing.imageUrl) existing.imageUrl = imageUrl;

      byUrl.set(fullUrl, existing);
    }

    for (const entry of byUrl.values()) {
      if (!entry.title || entry.title.length < 8) continue;
      if (items.some((x) => normalizeTitleForDedup(x.title) === normalizeTitleForDedup(entry.title))) continue;
      const idMatch = entry.url.match(/\/haber\/(\d+)/i);
      items.push({
        id: idMatch ? `haber-${idMatch[1]}` : `live-news-${items.length + 1}`,
        title: entry.title,
        date: entry.date || new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
        category: 'Kampüs Haberi',
        summary: entry.summary || entry.title,
        description: entry.summary || entry.title,
        content: entry.summary || entry.title,
        imageUrl: entry.imageUrl || DEFAULT_NEWS_IMAGE,
        url: entry.url,
        link: entry.url,
        source: 'esenyurt.edu.tr'
      });
      if (items.length >= 20) break;
    }
  }

  // 2. Fallback DOM selector for custom DOM fixtures
  if (items.length === 0 && doc && typeof doc.querySelectorAll === 'function') {
    const nodes = doc.querySelectorAll('.haber-list li, .news-item, .haber-item, .card-haber, article.haber, a[href*="/haber/"]');
    nodes.forEach((node, idx) => {
      if (items.length >= 20) return;
      const a = node.tagName === 'A' ? node : node.querySelector('a');
      const imgEl = node.querySelector?.('img');
      const title = cleanScrapedText(node.querySelector?.('.title, h3, h4')?.textContent || a?.textContent || '');
      if (title && title.length > 8 && !items.some((x) => normalizeTitleForDedup(x.title) === normalizeTitleForDedup(title))) {
        const rawLink = a ? a.getAttribute('href') : '';
        const rawImg = imgEl ? (imgEl.getAttribute('src') || imgEl.getAttribute('data-src')) : '';
        items.push({
          id: `live-news-${idx + 1}`,
          title,
          date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
          category: 'Kampüs Haberi',
          summary: title,
          content: title,
          imageUrl: rawImg ? resolveUrl(rawImg) : DEFAULT_NEWS_IMAGE,
          url: rawLink ? resolveUrl(rawLink) : 'https://www.esenyurt.edu.tr/',
          source: 'esenyurt.edu.tr'
        });
      }
    });
  }

  return deduplicateFeedItems([], items, 20);
}

export function extractAnnouncements(doc, html = '') {
  if (!doc && !html) return [];
  const items = [];

  const resolveUrl = (url) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    if (trimmed.startsWith('/')) return `https://www.esenyurt.edu.tr${trimmed}`;
    return `https://www.esenyurt.edu.tr/${trimmed}`;
  };

  const DEFAULT_ANNOUNCEMENT_IMAGE = "https://www.esenyurt.edu.tr/uploads/2026/07/bm3ic54a7zlig-2026-ozyes-ozel-yetenek-sinavi-basvurulari-basladi.jfif";

  if (doc && typeof doc.querySelectorAll === 'function') {
    const selector = '.duyuru-list li, .announcement-item, .card-duyuru, .duyuru-item, .news-item, article.duyuru, .duyuru-box';
    const nodes = doc.querySelectorAll(selector);
    nodes.forEach((node, idx) => {
      const a = node.querySelector('a');
      const dateSpan = node.querySelector('.date, time, .duyuru-tarih, .tarih');
      const summaryEl = node.querySelector('.summary, .ozet, p');
      const imgEl = node.querySelector('img');
      const rawTitle = a ? a.textContent.trim() : (node.querySelector('.title, h3, h4')?.textContent.trim() || '');
      const title = cleanScrapedText(rawTitle);
      if (title) {
        const rawLink = a ? a.getAttribute('href') : '';
        const rawImg = imgEl ? (imgEl.getAttribute('src') || imgEl.getAttribute('data-src')) : '';
        items.push({
          id: `ann-${idx + 1}`,
          title: title,
          date: dateSpan ? dateSpan.textContent.trim() : new Date().toISOString().split('T')[0],
          category: 'Genel Duyuru',
          summary: summaryEl ? cleanScrapedText(summaryEl.textContent) : title,
          content: title,
          imageUrl: rawImg ? resolveUrl(rawImg) : DEFAULT_ANNOUNCEMENT_IMAGE,
          link: rawLink ? resolveUrl(rawLink) : '#',
          url: rawLink ? resolveUrl(rawLink) : '#',
          isPinned: idx === 0
        });
      }
    });
  }

  if (items.length === 0 && html && typeof html === 'string') {
    // First pass: strictly match /duyuru/ links
    const duyuruRegex = /<a[^>]+href=["']([^"']*\/duyuru\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    let count = 1;
    while ((match = duyuruRegex.exec(html)) !== null && count <= 20) {
      const href = match[1];
      const innerHtml = match[2];
      const h3Match = innerHtml.match(/<h[234][^>]*>([\s\S]*?)<\/h[234]>/i);
      const text = cleanScrapedText(h3Match ? h3Match[1] : innerHtml);
      const { date, imageUrl } = extractInlineDateAndImage(innerHtml, resolveUrl);
      if (text && text.length > 10 && !items.some((x) => normalizeTitleForDedup(x.title) === normalizeTitleForDedup(text))) {
        const idMatch = href.match(/\/duyuru\/(\d+)/i);
        const fullUrl = resolveUrl(href);
        items.push({
          id: idMatch ? `duyuru-${idMatch[1]}` : `ann-${count}`,
          title: text,
          date: date || new Date().toISOString().split('T')[0],
          category: 'Genel Duyuru',
          summary: text,
          content: text,
          imageUrl: imageUrl || DEFAULT_ANNOUNCEMENT_IMAGE,
          link: fullUrl,
          url: fullUrl,
          isPinned: count === 1
        });
        count++;
      }
    }
  }

  return deduplicateFeedItems([], items, 20);
}

export function extractEvents(doc, html = '') {
  if (!doc && !html) return [];
  const items = [];

  const resolveUrl = (url) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    if (trimmed.startsWith('/')) return `https://www.esenyurt.edu.tr${trimmed}`;
    return `https://www.esenyurt.edu.tr/${trimmed}`;
  };

  const DEFAULT_EVENT_IMAGE = "https://www.esenyurt.edu.tr/uploads/2026/10/nz19buzmdccs4-mimari-kultur-ve-sanat-kulubunden-teknik-gezi-novawood-showroom-ziyareti.jpg";

  // 1. Structured DOM fixtures (e.g. .etkinlik-list .etkinlik-item)
  if (doc && typeof doc.querySelectorAll === 'function') {
    const selector = '.etkinlik-list .etkinlik-item, .event-card, .etkinlik-card, .event-item, .etkinlik-box';
    const nodes = doc.querySelectorAll(selector);
    nodes.forEach((node, idx) => {
      const titleEl = node.querySelector('.title, h4, h3, a');
      const dateEl = node.querySelector('.event-date, .etkinlik-tarih, .date, time');
      const locEl = node.querySelector('.location, .konum, .yer');
      const speakerEl = node.querySelector('.speaker, .konusmaci');
      const imgEl = node.querySelector('img');
      const linkEl = node.querySelector('a');

      if (titleEl) {
        const rawImg = imgEl ? imgEl.getAttribute('src') : '';
        const rawLink = linkEl ? linkEl.getAttribute('href') : '';
        const fullUrl = rawLink ? resolveUrl(rawLink) : '#';
        items.push({
          id: `evt-${idx + 1}`,
          title: cleanScrapedText(titleEl.textContent),
          date: dateEl ? dateEl.textContent.trim() : '2026-04-15 14:00',
          location: locEl ? locEl.textContent.trim() : 'İstanbul Esenyurt Üniversitesi Kampüsü',
          imageUrl: rawImg ? resolveUrl(rawImg) : DEFAULT_EVENT_IMAGE,
          speaker: speakerEl ? speakerEl.textContent.trim() : undefined,
          link: fullUrl,
          url: fullUrl,
          status: 'Upcoming'
        });
      }
    });
  }

  // 2. Parse esenyurt.edu.tr/etkinlikler <div class="box">...</div> cards + <a href="/etkinlik/..."> links
  if (items.length === 0 && html && typeof html === 'string') {
    const byUrl = new Map();

    // First pass: parse full <div class="box"> cards so image, date, time, and title are paired together
    const boxRegex = /<div\s+class=["']box["']\s*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;
    let boxMatch;
    while ((boxMatch = boxRegex.exec(html)) !== null) {
      const block = boxMatch[1];
      const hrefMatch = block.match(/href=["']([^"']*\/etkinlik\/[^"']+)["']/i);
      if (!hrefMatch) continue;
      const fullUrl = resolveUrl(hrefMatch[1]);
      const imgMatch = block.match(/<img[^>]+(?:src|data-src)=["']([^"']+)["']/i);
      const h3Match = block.match(/<h[234][^>]*>([\s\S]*?)<\/h[234]>/i);
      const titleAttrMatch = block.match(/title=["']([^"']+)["']/i);
      const dateMatch = block.match(/<p\s+class=["']date[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
      const timeMatch = block.match(/<p\s+class=["']time[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);

      const title = cleanScrapedText(h3Match ? h3Match[1] : (titleAttrMatch ? titleAttrMatch[1] : ''));
      const imageUrl = imgMatch && imgMatch[1] ? resolveUrl(imgMatch[1]) : '';
      const dateStr = cleanScrapedText(dateMatch ? dateMatch[1] : '');
      const timeStr = cleanScrapedText(timeMatch ? timeMatch[1] : '');

      if (title) {
        byUrl.set(fullUrl, {
          url: fullUrl,
          title,
          imageUrl,
          date: dateStr,
          time: timeStr
        });
      }
    }

    // Second pass: also merge any standalone <a href="/etkinlik/..."> anchors
    const evtLinkRegex = /<a[^>]+href=["']([^"']*\/etkinlik[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    while ((match = evtLinkRegex.exec(html)) !== null) {
      const href = match[1];
      const innerHtml = match[2];
      const fullUrl = resolveUrl(href);
      const h3Match = innerHtml.match(/<h[234][^>]*>([\s\S]*?)<\/h[234]>/i);
      const title = cleanScrapedText(h3Match ? h3Match[1] : innerHtml);
      const { date, imageUrl } = extractInlineDateAndImage(innerHtml, resolveUrl);

      const existing = byUrl.get(fullUrl) || { url: fullUrl, title: '', imageUrl: '', date: '', time: '' };
      if (title && title.length > 6 && !existing.title) existing.title = title;
      if (imageUrl && !existing.imageUrl) existing.imageUrl = imageUrl;
      if (date && !existing.date) existing.date = date;
      byUrl.set(fullUrl, existing);
    }

    let count = 1;
    for (const entry of byUrl.values()) {
      if (!entry.title || entry.title.length < 6) continue;
      if (items.some((x) => normalizeTitleForDedup(x.title) === normalizeTitleForDedup(entry.title))) continue;
      const idMatch = entry.url.match(/\/etkinlik\/(\d+)/i);
      items.push({
        id: idMatch ? `etkinlik-${idMatch[1]}` : `evt-${count}`,
        title: entry.title,
        date: entry.date || new Date().toISOString().split('T')[0],
        time: entry.time || '13:00',
        location: 'İstanbul Esenyurt Üniversitesi Kampüsü',
        category: 'Üniversite Etkinliği',
        summary: entry.title,
        description: entry.title,
        content: entry.title,
        imageUrl: entry.imageUrl || DEFAULT_EVENT_IMAGE,
        link: entry.url,
        url: entry.url,
        status: 'Upcoming',
        source: 'esenyurt.edu.tr'
      });
      count++;
      if (count > 20) break;
    }
  }

  return deduplicateFeedItems([], items, 20);
}

export function extractOfficeInfo(doc, html = '') {
  if (!doc && !html) return MOCK_IESU_KARIYER_DATA.officeInfo;

  let title = '';
  let description = '';

  if (doc && typeof doc.querySelector === 'function') {
    const titleEl = doc.querySelector('.page-title, h1, .title-main, .icerik-baslik');
    const bodyEl = doc.querySelector('.page-content, .content-body, .icerik-detay, .entry-content');
    if (titleEl) title = titleEl.textContent.trim();
    if (bodyEl) description = bodyEl.textContent.trim();
  }

  return {
    title: title || MOCK_IESU_KARIYER_DATA.officeInfo.title,
    description: description || MOCK_IESU_KARIYER_DATA.officeInfo.description,
    address: MOCK_IESU_KARIYER_DATA.officeInfo.address,
    email: MOCK_IESU_KARIYER_DATA.officeInfo.email,
    phone: MOCK_IESU_KARIYER_DATA.officeInfo.phone,
    workingHours: MOCK_IESU_KARIYER_DATA.officeInfo.workingHours,
    coordinators: MOCK_IESU_KARIYER_DATA.officeInfo.coordinators
  };
}
