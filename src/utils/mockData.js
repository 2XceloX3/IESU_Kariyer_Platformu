import { IESU_FACULTIES, IESU_MYO, IESU_YUKSEKOKUL, IESU_ENSTITU } from './universityData';

export const generateStudents = () => {
  return [
    { id: 'STU-001', studentId: '20240001', name: 'Alperen Yılmaz', department: 'Yazılım Mühendisliği', year: 3, gpa: 3.4, email: 'alperen@ogr.esenyurt.edu.tr', password: 'password', role: 'student', avatar: 'https://ui-avatars.com/api/?name=Alperen+Yılmaz&background=0A2342&color=fff', pronouns: 'o/onun', internshipStatus: 'Arıyor' },
    { id: 'STU-002', studentId: '20240002', name: 'Zeynep Kaya', department: 'Bilgisayar Mühendisliği', year: 4, gpa: 3.8, email: 'zeynep@ogr.esenyurt.edu.tr', password: 'password', role: 'student', avatar: 'https://ui-avatars.com/api/?name=Zeynep+Kaya&background=0A2342&color=fff', doubleMajor: 'Endüstri Mühendisliği', internshipStatus: 'Tamamlandı' },
    { id: 'STU-003', studentId: '20240003', name: 'Mert Can', department: 'İşletme', year: 2, gpa: 2.9, email: 'mert@ogr.esenyurt.edu.tr', password: 'password', role: 'student', avatar: 'https://ui-avatars.com/api/?name=Mert+Can&background=0A2342&color=fff', internshipStatus: 'İlgilenmiyor' },
    { id: 'STU-004', studentId: '20240004', name: 'Elif Demir', department: 'Mimarlık', year: 3, gpa: 3.1, email: 'elif@ogr.esenyurt.edu.tr', password: 'password', role: 'student', avatar: 'https://ui-avatars.com/api/?name=Elif+Demir&background=0A2342&color=fff', internshipStatus: 'Aktif Stajyer' },
    { id: 'STU-005', studentId: '20240005', name: 'Burak Şahin', department: 'Makine Mühendisliği', year: 4, gpa: 3.6, email: 'burak@ogr.esenyurt.edu.tr', password: 'password', role: 'student', avatar: 'https://ui-avatars.com/api/?name=Burak+Şahin&background=0A2342&color=fff', internshipStatus: 'Arıyor' }
  ];
};

export const generateAlumni = () => {
  return [
    { id: 'ALU-001', studentId: '20190001', name: 'Caner Öztürk', department: 'Yazılım Mühendisliği', gradYear: 2023, email: 'caner@mezun.esenyurt.edu.tr', password: 'password', role: 'alumni', avatar: 'https://ui-avatars.com/api/?name=Caner+Öztürk&background=EA580C&color=fff', company: 'Trendyol', title: 'Frontend Developer' },
    { id: 'ALU-002', studentId: '20180002', name: 'Seda Çelik', department: 'Endüstri Mühendisliği', gradYear: 2022, email: 'seda@mezun.esenyurt.edu.tr', password: 'password', role: 'alumni', avatar: 'https://ui-avatars.com/api/?name=Seda+Çelik&background=EA580C&color=fff', company: 'Ford Otosan', title: 'Üretim Planlama Uzmanı' },
    { id: 'ALU-003', studentId: '20200003', name: 'Tolgahan Aslan', department: 'Uluslararası Ticaret', gradYear: 2024, email: 'tolga@mezun.esenyurt.edu.tr', password: 'password', role: 'alumni', avatar: 'https://ui-avatars.com/api/?name=Tolgahan+Aslan&background=EA580C&color=fff', company: 'Getir', title: 'Operasyon Uzmanı' },
    { id: 'ALU-004', studentId: '20170004', name: 'Ayça Yurt', department: 'Psikoloji', gradYear: 2021, email: 'ayca@mezun.esenyurt.edu.tr', password: 'password', role: 'alumni', avatar: 'https://ui-avatars.com/api/?name=Ayça+Yurt&background=EA580C&color=fff', company: 'Kendi Kliniği', title: 'Klinik Psikolog' }
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

// =====================================================
// Haberler — kariyer.esenyurt.edu.tr'den birebir çekildi
// =====================================================
export const generateAcademicStaff = () => {
  return [
    { id: 'ACAD-001', name: 'Prof. Dr. Ahmet Yılmaz', email: 'ayilmaz@esenyurt.edu.tr', department: 'Bilgisayar Mühendisliği', password: 'password', role: 'academic', avatar: 'https://ui-avatars.com/api/?name=Ahmet+Yılmaz&background=0EA5E9&color=fff', title: 'Dekan' },
    { id: 'ACAD-002', name: 'Doç. Dr. Zeynep Çelik', email: 'zcelik@esenyurt.edu.tr', department: 'Yazılım Mühendisliği', password: 'password', role: 'academic', avatar: 'https://ui-avatars.com/api/?name=Zeynep+Çelik&background=0EA5E9&color=fff', title: 'Bölüm Başkanı' },
    { id: 'ACAD-003', name: 'Dr. Öğr. Üyesi Can Kaya', email: 'ckaya@esenyurt.edu.tr', department: 'İşletme', password: 'password', role: 'academic', avatar: 'https://ui-avatars.com/api/?name=Can+Kaya&background=0EA5E9&color=fff', title: 'Kariyer Danışmanı' }
  ];
};

export const initialNews = [
  {
    "id": "NEWS-001",
    "title": "Esenyurt İlçe Milli Eğitim Müdürü Tayfun Özyolcuya Veda Programı",
    "date": "22/07/2026",
    "content": "Rekt&ouml;r&uuml;m&uuml;z Prof. Dr. S&uuml;leyman &Ouml;zdemir, Esenyurt Kaymakamı Sayın Fatih &Ccedil;obanoğlu&rsquo;nun ev sahipliğinde, Bitlis İl Mill&icirc; Eğitim M&uuml;d&uuml;r&uuml; olarak g&ouml;revlendirilen İl&ccedil;e Mill&icirc; Eğitim M&uuml;d&uuml;r&uuml; Tayfun &Ouml;zyolcu onuruna d&uuml;zenlenen veda programına katıldı. İl&ccedil;emize yaptığı değerli katkılar i&ccedil;in &Ouml;zyolcu&rsquo;ya teşekk&uuml;r ediyor, yeni g&ouml;revinde başarılar diliyoruz. Bu içerik 22/07/2026 tarihinde güncellenmiştir.",
    "category": "Haber",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/ke9pf3m8l8zvo-esenyurt-ilce-milli-egitim-muduru-tayfun-ozyolcuya-veda-programi.jpg",
    "url": "https://www.esenyurt.edu.tr/haber/2213-esenyurt-ilce-milli-egitim-muduru-tayfun-ozyolcuya-veda-programi"
  },
  {
    "id": "NEWS-002",
    "title": "Rektörümüz Prof. Dr. Süleyman Özdemir’den üniversite tercihi yapacak aday öğrencilere önemli tavsiyeler var.",
    "date": "21/07/2026",
    "content": "Tercih Yapacak Aday &Ouml;ğrencilerin Dikkat Etmesi Gereken Hususlar: Hayallerini kurduğunuz bir &uuml;niversite eğitimine kavuşabilmeniz dileğiyle, hayat boyu başarılar ve g&uuml;zel bir gelecek diliyorum. İstanbul Esenyurt &Uuml;niversitesi Rekt&ouml;r&uuml;",
    "category": "Haber",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/v89a2fua3ovrw-rektorumuz-prof-dr-suleyman-ozdemir’den-universite-tercihi-yapacak-aday-ogrencilere-onemli-tavsiyeler-var.jpg",
    "url": "https://www.esenyurt.edu.tr/haber/2169-rektorumuz-prof-dr-suleyman-ozdemir’den-universite-tercihi-yapacak-aday-ogrencilere-onemli-tavsiyeler-var"
  },
  {
    "id": "NEWS-003",
    "title": "Kalite Koordinatörlüğümüz tarafından “Kalite Farkındalık Eğitimi” gerçekleştirildi.",
    "date": "20/07/2026",
    "content": "&Uuml;niversitemizde kalite k&uuml;lt&uuml;r&uuml;n&uuml; g&uuml;&ccedil;lendirme &ccedil;alışmaları kapsamında, Kalite Koordinat&ouml;rl&uuml;ğ&uuml;m&uuml;z tarafından &ldquo;Kalite Farkındalık Eğitimi&rdquo; ger&ccedil;ekleştirildi. Eğitimde; Kalite Y&ouml;netim Sistemi (KYS) dok&uuml;manlarının hazırlanma ve yayımlanma s&uuml;re&ccedil;leri, dok&uuml;mantasyon &ccedil;alışmaları, belge oluşturma ve revizyon talepleri, veri setinin kullanımı, anket uygulamaları, s&uuml;re&ccedil; kartları, prosed&uuml;r hazırlama, risk ve fırsat y&ouml;netimi, i&ccedil; tetkik uygulamaları ile s&uuml;rekli ",
    "category": "Haber",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/1yke904877r2x-kalite-koordinatorlugumuz-tarafindan-“kalite-farkindalik-egitimi”-gerceklestirildi.png",
    "url": "https://www.esenyurt.edu.tr/haber/2163-kalite-koordinatorlugumuz-tarafindan-“kalite-farkindalik-egitimi”-gerceklestirildi"
  },
  {
    "id": "NEWS-004",
    "title": "15 Temmuz Demokrasi ve Millî Birlik Günü Anma Törenine Katılım Sağladık 🇹🇷",
    "date": "18/07/2026",
    "content": "İstanbul Esenyurt &Uuml;niversitesi olarak, 15 Temmuz Demokrasi ve Mill&icirc; Birlik G&uuml;n&uuml;&rsquo;n&uuml;n 10. yıl d&ouml;n&uuml;m&uuml; kapsamında Esenyurt Kaymakamlığı tarafından Cumhuriyet Meydanı&rsquo;nda d&uuml;zenlenen anma programına kurumsal katılım sağladık. Vatandaşlarımızın yoğun katılımıyla ger&ccedil;ekleşen ve mill&icirc; irade ruhunun tek y&uuml;rek olarak meydanlara taşındığı bu anlamlı t&ouml;rende, &Uuml;niversitemizi temsilen Rekt&ouml;r Yardımcımız Prof. Dr. Din&ccedil;er Atlı yer aldı. Kur&rsquo;an-ı Kerim tilaveti ve aziz şehitlerimiz i&ccedil;in edilen dualarla",
    "category": "Haber",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/27rl1c6i6ujf8-15-temmuz-demokrasi-ve-millî-birlik-gunu-anma-torenine-katilim-sagladik-🇹🇷.png",
    "url": "https://www.esenyurt.edu.tr/haber/2162-15-temmuz-demokrasi-ve-millî-birlik-gunu-anma-torenine-katilim-sagladik-🇹🇷"
  },
  {
    "id": "NEWS-005",
    "title": "İstanbul Esenyurt Üniversitesi, “Dumansız Kampüs Sağlıklı Gelecek Projesi” Lansmanında Yerini Aldı",
    "date": "26/07/2684",
    "content": "Sağlık Bakanlığı, Y&uuml;ksek&ouml;ğretim Kurulu ve T&uuml;rkiye Yeşilay Cemiyetinin iş birliğiyle hayata ge&ccedil;irilen &quot;Dumansız Kamp&uuml;s Sağlıklı Gelecek Projesi&quot;nin tanıtım programı, 4 Temmuz 2026 Cumartesi g&uuml;n&uuml; İstanbul&rsquo;da ger&ccedil;ekleştirildi. Programa; Sağlık Bakanı Prof. Dr. Kemal Memişoğlu, Y&uuml;ksek&ouml;ğretim Kurulu Başkanı Prof. Dr. Erol &Ouml;zvar, Yeşilay Genel Başkanı Do&ccedil;. Dr. Mehmet Din&ccedil;, İstanbuldaki &uuml;niversitelerin rekt&ouml;rleri, rekt&ouml;r yardımcıları, akademik personelleri ile &ouml;ğrenciler katılım sağladı. Progr",
    "category": "Haber",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/29u5jw3tnlh7g-istanbul-esenyurt-universitesi-“dumansiz-kampus-saglikli-gelecek-projesi”-lansmaninda-yerini-aldi-1.jpg",
    "url": "https://www.esenyurt.edu.tr/haber/2161-istanbul-esenyurt-universitesi-“dumansiz-kampus-saglikli-gelecek-projesi”-lansmaninda-yerini-aldi-1"
  },
  {
    "id": "NEWS-006",
    "title": "Geleceğin Meslekleri &quot;Bilim Kafe&quot; Buluşmalarında Ele Alındı: Dijitalleşme ve Yapay Zeka Odaklı Programlar 1 Etkinliğimizi Gerçekleştirdik!",
    "date": "18/07/2026",
    "content": "Geleceğin Meslekleri &quot;Bilim Kafe&quot; Buluşmalarında Ele Alındı: Dijitalleşme ve Yapay Zeka Odaklı Programlar 1 Etkinliğimizi Ger&ccedil;ekleştirdik! İstanbul Esenyurt &Uuml;niversitesi Bilim İletişimi Koordinat&ouml;rl&uuml;ğ&uuml; tarafından d&uuml;zenlenen &quot;Bilim Kafe - Geleceğin Meslekleri Buluşmaları&quot; kapsamında, &quot;Dijitalleşme ve Yapay Zeka Odaklı Programlar 1&quot; etkinliğimizi tamamladık. City Center AVMde saat 14.00te ger&ccedil;ekleştirilen bu vizyoner buluşmada; Dijital Oyun Tasarımı, Oyun Geliştirme ve Programlama ile Bilgisayar Destekli Tasarım ve Animasyon pr",
    "category": "Haber",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/sk9wusz8f4voh-gelecegin-meslekleri-bilim-kafe-bulusmalarinda-ele-alindi-dijitallesme-ve-yapay-zeka-odakli-programlar-1-etkinligimizi-gerceklestirdik.jpg",
    "url": "https://www.esenyurt.edu.tr/haber/2159-gelecegin-meslekleri-bilim-kafe-bulusmalarinda-ele-alindi-dijitallesme-ve-yapay-zeka-odakli-programlar-1-etkinligimizi-gerceklestirdik"
  },
  {
    "id": "NEWS-007",
    "title": "15 Temmuz Demokrasi ve Milli Birlik Günü Kapsamında Düzenlenen Sergi ve Panelimizi Gerçekleştirdik!",
    "date": "16/07/2026",
    "content": "İstanbul Esenyurt &Uuml;niversitesi olarak, 15 Temmuz Demokrasi ve Milli Birlik G&uuml;n&uuml; anma etkinlikleri kapsamında d&uuml;zenlediğimiz anlamlı programı akademik ve idari kadromuzun yoğun katılımıyla ger&ccedil;ekleştirdik. 14 Temmuz 2026 Salı g&uuml;n&uuml; saat 13.30&rsquo;da &uuml;niversitemiz 3. Kat Prof. Dr. Fuat Sezgin Konferans Salonu &ouml;n&uuml;nde kapılarını a&ccedil;an &quot;15 Temmuz Milli İrade Destanı Sergisi&quot; ile başlayan anma programımız, saat 14.00&rsquo;te d&uuml;zenlenen &quot;15 Temmuz Milli İrade Paneli: Demokrasi Zaferine Giden Yolda Neler Yaşandı?&quot; baş",
    "category": "Haber",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/p9hgqcbup3l96-15-temmuz-demokrasi-ve-milli-birlik-gunu-kapsaminda-duzenlenen-sergi-ve-panelimizi-gerceklestirdik.jpg",
    "url": "https://www.esenyurt.edu.tr/haber/2157-15-temmuz-demokrasi-ve-milli-birlik-gunu-kapsaminda-duzenlenen-sergi-ve-panelimizi-gerceklestirdik"
  },
  {
    "id": "NEWS-008",
    "title": "İstanbul Esenyurt Üniversitesi 2025–2026 Akademik Yılı Mezuniyet Töreni Büyük Bir Coşku ve Yoğun Katılımla Gerçekleşti !",
    "date": "26/07/2657",
    "content": "Yaklaşık 5 Bin Kişinin Katıldığı T&ouml;rende Mezunlarımız Diplomalarını Alarak Geleceğe Uğurlandı. İstanbul Esenyurt &Uuml;niversitesi 2025&ndash;2026 Akademik Yılı Mezuniyet T&ouml;reni, 28 Haziran 2026 tarihinde Yahya Kemal Beyatlı G&ouml;steri Merkezinde yaklaşık 5.000 kişinin katılımıyla b&uuml;y&uuml;k bir coşku ve gurur i&ccedil;erisinde ger&ccedil;ekleştirildi. &Ouml;ğrenciler, aileleri, akademisyenler ve davetlilerin yoğun ilgi g&ouml;sterdiği t&ouml;rende mezuniyet heyecanı ve mutluluğu bir arada yaşandı. Saygı Duruşu ve İstikl&acirc;l Marşının okunmasıyla başlayan programın a&ccedil",
    "category": "Haber",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/8gqx0jthi7yos-istanbul-esenyurt-universitesi-2025–2026-akademik-yili-mezuniyet-toreni-buyuk-bir-cosku-ve-yogun-katilimla-gerceklesti.jpg",
    "url": "https://www.esenyurt.edu.tr/haber/2072-istanbul-esenyurt-universitesi-2025–2026-akademik-yili-mezuniyet-toreni-buyuk-bir-cosku-ve-yogun-katilimla-gerceklesti"
  },
  {
    "id": "NEWS-009",
    "title": "Babalar gününüz kutlu olsun!",
    "date": "21/06/2026",
    "content": "Bu içerik 21/06/2026 tarihinde güncellenmiştir. İstanbul Esenyurt Üniversitesi'ni yakından takip etmek, yaklaşan etkinlikler, haberler ve daha birçok konudan anında haberdar olmak için abone olun. Zafer Mah. Adile Naşit Bulv. No:1 Esenyurt İstanbul/Türkiye",
    "category": "Haber",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/06/rawzsetju17c6-babalar-gununuz-kutlu-olsun.jpg",
    "url": "https://www.esenyurt.edu.tr/haber/2051-babalar-gununuz-kutlu-olsun"
  },
  {
    "id": "NEWS-010",
    "title": "Rektörümüzden mesaj var.",
    "date": "20/06/2026",
    "content": "Sevgili &Ouml;ğrenciler, B&Uuml;T&Uuml;NLEME SINAVINDA hepinize başarılar ve zihin a&ccedil;ıklığı dilerim. Prof. Dr. S&uuml;leyman &Ouml;ZDEMİR Rekt&ouml;r Bu içerik 20/06/2026 tarihinde güncellenmiştir.",
    "category": "Haber",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/06/4t5fdgnwaijdm-rektorumuzden-mesaj-var.png",
    "url": "https://www.esenyurt.edu.tr/haber/2050-rektorumuzden-mesaj-var"
  },
  {
    "id": "NEWS-011",
    "title": "OSB’li Mucitlerle Bilime Yolculuk: TÜBİTAK 4008 Projesi Başarıyla Tamamlandı!",
    "date": "19/06/2026",
    "content": "Esenyurt İl&ccedil;e Mill&icirc; Eğitim M&uuml;d&uuml;rl&uuml;ğ&uuml; y&uuml;r&uuml;t&uuml;c&uuml;l&uuml;ğ&uuml;nde, T&Uuml;BİTAK&rsquo;ın &Ouml;zel Gereksinimli Bireylere Y&ouml;nelik Kapsayıcı Toplum Uygulamaları Destekleme Programı kapsamında hayata ge&ccedil;irilen &quot;STEAM ile Deneyimsel &Ouml;ğrenme: OSBli Mucitlerle Bilime Yolculuk&quot; projesi, bug&uuml;n d&uuml;zenlenen Kapanış Toplantısı ve Sertifika T&ouml;reni&rsquo;yle başarıyla tamamlandı. İstanbul Esenyurt &Uuml;niversitesi olarak paydaşları arasında yer aldığımız bu anlamlı projeye, akademik kadromuzla g&uuml;&ccedil;l&uuml",
    "category": "Haber",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/06/f78wjtjfr2knd-osb’li-mucitlerle-bilime-yolculuk-tubitak-4008-projesi-basariyla-tamamlandi.jpg",
    "url": "https://www.esenyurt.edu.tr/haber/2049-osb’li-mucitlerle-bilime-yolculuk-tubitak-4008-projesi-basariyla-tamamlandi"
  },
  {
    "id": "NEWS-012",
    "title": "Kuruluşumuzun 14. Yıl Dönümünü Büyük Bir Gururla Kutladık!",
    "date": "19/06/2026",
    "content": "18 Haziran 2013 tarihinde kurulan &Uuml;niversitemiz, 14. kuruluş yıl d&ouml;n&uuml;m&uuml;n&uuml; coşkulu bir t&ouml;renle kutladı. Kutlama programı, M&uuml;tevelli Heyeti Başkanımız Orhan &Ouml;zyurt, Rekt&ouml;r&uuml;m&uuml;z Prof. Dr. S&uuml;leyman &Ouml;zdemir, Dekanlarımız, M&uuml;d&uuml;rlerimiz ile akademik ve idari kadromuzun yoğun katılımıyla ger&ccedil;ekleşti. Ger&ccedil;ekleşen t&ouml;rende, &Uuml;niversitemizin geride bıraktığı 13 yılın başarıları ve gelecek hedefleri vurgulandı. M&uuml;tevelli Heyeti Başkanımız Orhan &Ouml;zyurt ve Rekt&ouml;r&uuml;m&uuml;z Prof. Dr. S&uuml;leym",
    "category": "Haber",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/06/6oi5yhb4obal0-kurulusumuzun-14-yil-donumunu-buyuk-bir-gururla-kutladik.jpg",
    "url": "https://www.esenyurt.edu.tr/haber/2047-kurulusumuzun-14-yil-donumunu-buyuk-bir-gururla-kutladik"
  },
  {
    "id": "NEWS-013",
    "title": "Yükseköğretim Kurumları Sınavında hepinize başarılar ve zihin açıklığı dilerim.",
    "date": "18/06/2026",
    "content": "Y&uuml;ksek&ouml;ğretim Kurumları Sınavında hepinize başarılar ve zihin a&ccedil;ıklığı dilerim. Prof. Dr. S&uuml;leyman &Ouml;ZDEMİR Rekt&ouml;r Bu içerik 18/06/2026 tarihinde güncellenmiştir.",
    "category": "Haber",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/06/evq63ihv68dzl-yuksekogretim-kurumlari-sinavinda-hepinize-basarilar-ve-zihin-acikligi-dilerim.jpg",
    "url": "https://www.esenyurt.edu.tr/haber/2042-yuksekogretim-kurumlari-sinavinda-hepinize-basarilar-ve-zihin-acikligi-dilerim"
  },
  {
    "id": "NEWS-014",
    "title": "Avukat Özgür Karakılıç’tan Sosyal Hizmet Öğrencilerine Hukuki Boyut Eğitimi",
    "date": "16/06/2026",
    "content": "&Uuml;niversitemiz Sağlık Bilimleri Fak&uuml;ltesi Sosyal Hizmet B&ouml;l&uuml;m&uuml; &ouml;ğrencileri, &ccedil;ocuk istismarı ve ihmali alanının hukuki boyutuna ilişkin &ouml;nemli bir eğitim programına katıldı. Avukat &Ouml;zg&uuml;r Karakılı&ccedil;, 7 Mayıs 2026 tarihinde Sosyal Hizmet B&ouml;l&uuml;m&uuml; 3. sınıf &ouml;ğrencilerine &ldquo;&Ccedil;ocuk İstismarı ve İhmali&rdquo; dersi kapsamında konuk oldu. Ger&ccedil;ekleştirilen etkinlikte, &ccedil;ocuk istismarı ve ihmaline ilişkin hukuki s&uuml;re&ccedil;ler, bildirim y&uuml;k&uuml;ml&uuml;l&uuml;ğ&uuml;, &ccedil;ocuk koruma mekaniz",
    "category": "Haber",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/06/1d4403rbtm0q9-avukat-ozgur-karakilic’tan-sosyal-hizmet-ogrencilerine-hukuki-boyut-egitimi.png",
    "url": "https://www.esenyurt.edu.tr/haber/2037-avukat-ozgur-karakilic’tan-sosyal-hizmet-ogrencilerine-hukuki-boyut-egitimi"
  },
  {
    "id": "NEWS-015",
    "title": "Sarıyer Sosyal Hizmet Merkezi Müdürü Ahmet Serdar Ermiş’ten Sosyal Hizmet Öğrencilerine Sunum",
    "date": "16/06/2026",
    "content": "&Uuml;niversitemiz Sağlık Bilimleri Fak&uuml;ltesi Sosyal Hizmet B&ouml;l&uuml;m&uuml; &ouml;ğrencileri, sosyal hizmet uygulamalarına ilişkin g&uuml;ncel vakaların ele alındığı bir etkinlikte alan uzmanıyla bir araya geldi. Sarıyer Sosyal Hizmet Merkezi M&uuml;d&uuml;r&uuml; Ahmet Serdar Ermiş, 5 Mayıs 2026 tarihinde Sosyal Hizmet B&ouml;l&uuml;m&uuml; 2. sınıf &ouml;ğrencilerine &ldquo;Sosyal Hizmette Kuram I: Bireylerle Sosyal Hizmet&rdquo; dersi kapsamında konuk oldu. Ger&ccedil;ekleştirilen sunumda, bireylerle sosyal hizmet uygulamalarında karşılaşılan g&uuml;ncel vakalar, m&uuml;dahale s&",
    "category": "Haber",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/06/sv0wtp40eyauz-sariyer-sosyal-hizmet-merkezi-muduru-ahmet-serdar-ermis’ten-sosyal-hizmet-ogrencilerine-sunum.png",
    "url": "https://www.esenyurt.edu.tr/haber/2036-sariyer-sosyal-hizmet-merkezi-muduru-ahmet-serdar-ermis’ten-sosyal-hizmet-ogrencilerine-sunum"
  }
];

// =====================================================
// Etkinlikler — kariyer.esenyurt.edu.tr/tr/idari-icerik-etkinliklerimiz'den birebir
// NOT: Resmi sitede etkinliklere tarih ve konum eklenmemiş.
// =====================================================
export const initialEvents = [
  {
    "id": "EVT-001",
    "title": "Geleceğin dünyasını şekillendiren teknolojiler ve dijital dönüşüm Bilim Kafe’de konuşuluyor!",
    "description": "Dijitalleşme ve Yapay Zek&acirc; Odaklı Programlar 2 | Bilim Kafe &ndash; Geleceğin Meslekleri Buluşmaları İstanbul Esenyurt &Uuml;niversitesi olarak, teknolojinin ve geleceğin mesleklerinin izini s&uuml;rmeye devam ediyoruz! 🚀 Y&Ouml;K ve Bilim İletişimi Ofisi iş birliğiyle d&uuml;zenlenen Bilim Kafe etkinlik serimizin yenisinde; akademisyenlerimiz, sekt&ouml;r temsilcilerimiz ve &ouml;ğrencilerimizle &quot;Dijitalleşme ve Yapay Zek&acirc; Odaklı Programlar&quot; &uuml;zerine bir araya geliyoruz.",
    "date": "23/07/2026",
    "time": "14:00",
    "location": "Kampüs",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/tjb9hhos5ydrt-gelecegin-dunyasini-sekillendiren-teknolojiler-ve-dijital-donusum-bilim-kafe’de-konusuluyor.jfif",
    "status": "Aktif",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1724-gelecegin-dunyasini-sekillendiren-teknolojiler-ve-dijital-donusum-bilim-kafe’de-konusuluyor"
  },
  {
    "id": "EVT-002",
    "title": "III. Yönetim Bilimleri Sempozyumu",
    "description": "Yer: Prof. Dr. Fuat SEZGİN Konferans Salonu, 3. Kat & Online İşletme ve Y&ouml;netim Bilimleri Fak&uuml;ltemiz tarafından d&uuml;zenlenen III. Y&ouml;netim Bilimleri Sempozyumu&rsquo;nun bu yılki teması &ldquo;Yapay Zeka ve Etik&rdquo; olarak belirlendi. Yapay zekanın geleceğini, etik kurallar &ccedil;er&ccedil;evesinde alanın uzmanları ve akademisyenlerle birlikte ele alacağız.",
    "date": "20/07/2026",
    "time": "14:00",
    "location": "Kampüs",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/oh0lm0qvjbwgc-iii-yonetim-bilimleri-sempozyumu.jfif",
    "status": "Aktif",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1720-iii-yonetim-bilimleri-sempozyumu"
  },
  {
    "id": "EVT-003",
    "title": "🇹🇷 Karanlık bir geceyi, aydınlık bir geleceğe dönüştürenlerin hikayesi...",
    "description": "Yer: Prof. Dr. Fuat SEZGİN Konferans Salonu Önü (3. Kat) Milletimizin hainlere karşı tek y&uuml;rek olduğu, milli iradesini ve bağımsızlığını canı pahasına koruduğu o tarihi geceyi &quot;15 Temmuz Milli İrade Destanı Sergisi&quot; ile anıyoruz. İstanbul Esenyurt &Uuml;niversitesi olarak, bu eşsiz kahramanlık hikayesini ve şehitlerimizin aziz hatırasını canlı tutmak bizim i&ccedil;in bir onurdur. Sergimizde, o geceye dair derin izler taşıyan kareleri ve belgeleri bir araya getirdik.",
    "date": "11/07/2026",
    "time": "14:00",
    "location": "Kampüs",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/0jnmk9hfk7p3s-🇹🇷-karanlik-bir-geceyi-aydinlik-bir-gelecege-donusturenlerin-hikayesi.jpg",
    "status": "Aktif",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1717-🇹🇷-karanlik-bir-geceyi-aydinlik-bir-gelecege-donusturenlerin-hikayesi"
  },
  {
    "id": "EVT-004",
    "title": "15 Temmuz Milli İrade Paneline davetlisiniz!",
    "description": "Yer: 3. Kat - Prof. Dr. Fuat SEZGİN Konferans Salonu 🇹🇷 15 Temmuz Demokrasi ve Milli Birlik G&uuml;n&uuml; vesilesiyle d&uuml;zenleyeceğimiz &quot;15 Temmuz Milli İrade Paneli&quot;ne davetlisiniz! O tarihi geceyi ve demokrasi zaferine giden yolu, değerli konuklarımızla birlikte anıyor ve analiz ediyoruz.",
    "date": "10/07/2026",
    "time": "14:00",
    "location": "Kampüs",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/7ebbksmzr926z-15-temmuz-milli-irade-paneline-davetlisiniz.jpg",
    "status": "Aktif",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1714-15-temmuz-milli-irade-paneline-davetlisiniz"
  },
  {
    "id": "EVT-005",
    "title": "Geleceği Şekillendiren Teknolojiyle Tanışın!",
    "description": "Dijitalleşme ve yapay zeka alanlarındaki yenilikler, kariyer yolculuğunuzu nasıl etkileyecek? Bu soruların cevabını, sekt&ouml;r&uuml;n &ouml;nde gelen isimleri ve değerli akademisyenlerimizle birlikte arıyoruz. İstanbul Esenyurt &Uuml;niversitesi, Y&Ouml;K ve Bilim İletişim Ofisi (bio) işbirliğiyle d&uuml;zenlenen bu etkinlikte sizleri de aramızda g&ouml;rmekten mutluluk duyarız. Akademisyen Konuklar: Prof. Dr. Din&ccedil;er ATLI (Rekt&ouml;r Yrd.), Dr. &Ouml;ğr. &Uuml;yesi Kevser SOYDAN (Koordinat&ouml;r), &Ouml;ğr. G&ouml;r. Caner ATAŞ (Konuşmacı) Sekt&ouml;rel Uzmanlar: Fatih KIYMAZ (EMN T",
    "date": "10/07/2026",
    "time": "14:00",
    "location": "Kampüs",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/07/z5st7op8uiqwp-gelecegi-sekillendiren-teknolojiyle-tanisin.jpg",
    "status": "Aktif",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1713-gelecegi-sekillendiren-teknolojiyle-tanisin"
  },
  {
    "id": "EVT-006",
    "title": "Bilimin Büyülü Dünyasına Yolculuk: Kapanış Toplantısı",
    "description": "Yer: İstanbul Esenyurt Üniversitesi Prof. Dr. Fuat Sezgin Konferans Salonu K&uuml;&ccedil;&uuml;k y&uuml;reklerin b&uuml;y&uuml;k fikirlerle buluştuğu, merak ve keşif dolu bir ser&uuml;venin sonuna geldik! &quot;STEAM ile Deneyimsel &Ouml;ğrenme - OSBli Mucitlerle Bilime Yolculuk&quot; projemizin Kapanış Toplantısında sizleri de aramızda g&ouml;rmekten mutluluk duyacağız. T&Uuml;BİTAK ve iş birliği yaptığımız kıymetli kurumlarımızın desteğiyle y&uuml;r&uuml;tt&uuml;ğ&uuml;m&uuml;z bu projede, OSBli &ouml;ğrencilerimiz bilimin gizemli d&uuml;nyasını deneyimlediler, yaratıcılıklarını ortaya koyd",
    "date": "18/06/2026",
    "time": "14:00",
    "location": "Kampüs",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/06/ivqfcl183tzr1-bilimin-buyulu-dunyasina-yolculuk-kapanis-toplantisi.jpg",
    "status": "Aktif",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1707-bilimin-buyulu-dunyasina-yolculuk-kapanis-toplantisi"
  },
  {
    "id": "EVT-007",
    "title": "Dijitalleşen dünyada sürdürülebilirliğin yeni boyutu: Dijital Atık Yönetimi",
    "description": "Yer: 3. Kat, Prof. Dr. Fuat SEZGİN Konferans Salonu İstanbul Esenyurt &Uuml;niversitesi Bilişim Teknolojileri Meslek Y&uuml;ksekokulu olarak, T.C. İstanbul Valiliği ve Sıfır Atık Vakfı paydaşlığında, 1-7 Haziran Sıfır Atık Haftası&rsquo;na &ouml;zel &ccedil;ok kritik bir eğitime ev sahipliği yapıyoruz. &quot;Dijital Atık Y&ouml;netimi ve Veri Temizliği Eğitimi&quot; yarın kapılarını a&ccedil;ıyor. Teknolojinin hızla geliştiği g&uuml;n&uuml;m&uuml;zde, dijital depolama alanlarının t&uuml;kettiği enerji ve veri kirliliğinin &ccedil;evreye olan etkileri g&ouml;z ardı edilemez bir boyuta ulaşmıştı",
    "date": "03/06/2026",
    "time": "14:00",
    "location": "Kampüs",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/06/qro3fnllv74pa-dijitallesen-dunyada-surdurulebilirligin-yeni-boyutu-dijital-atik-yonetimi.jpg",
    "status": "Aktif",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1688-dijitallesen-dunyada-surdurulebilirligin-yeni-boyutu-dijital-atik-yonetimi"
  },
  {
    "id": "EVT-008",
    "title": "Atık malzemeler, mühendislik ve estetikle buluşuyor; sağlam köprüler geleceğe uzanıyor!",
    "description": "Yer: Detaylar ve başvuru süreci için takipte kalın. 1-7 Haziran Sıfır Atık Haftası kapsamında; İstanbul Esenyurt &Uuml;niversitesi, T.C. İstanbul Valiliği ve Sıfır Atık Vakfı iş birliğiyle d&uuml;zenlenen &quot;Sıfır Atık Tam Statik: K&ouml;pr&uuml; Tasarımı Yarışması&quot; duyuruldu! Geri d&ouml;n&uuml;ş&uuml;m bilincini statik ve tasarımla harmanlayan bu yarışmada, atık materyalleri kullanarak en dayanıklı ve yaratıcı k&ouml;pr&uuml;y&uuml; inşa etmeye hazır mısınız?",
    "date": "05.10.2026",
    "time": "14:00",
    "location": "Kampüs",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/06/cm1fe1okvam3t-atik-malzemeler-muhendislik-ve-estetikle-bulusuyor;-saglam-kopruler-gelecege-uzaniyor.jpg",
    "status": "Aktif",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1687-atik-malzemeler-muhendislik-ve-estetikle-bulusuyor;-saglam-kopruler-gelecege-uzaniyor"
  },
  {
    "id": "EVT-009",
    "title": "Büyük bir emek ve özveriyle tamamladığınız üniversite hayatınızı gururla taçlandırma vakti geldi!",
    "description": "&Uuml;niversitemiz 2025-2026 Akademik Yılı Mezuniyet T&ouml;reni, 28 Haziran 2026 Pazar g&uuml;n&uuml; coşkuyla ger&ccedil;ekleşecek. Geleceğe g&uuml;venle adım atan mezunlarımızın bu &ouml;zel g&uuml;n&uuml;nde bir arada olmayı diliyoruz. T&ouml;ren Detayları: 🗓 Tarih: 28 Haziran 2026 - Pazar 📍 Yer: Yahya Kemal Beyatlı G&ouml;steri Merkezi 🕓 T&ouml;ren Saati: 16.00 ⚠️ &Ouml;nemli Not: T&ouml;ren d&uuml;zeninin eksiksiz sağlanabilmesi adına; mezunlarımızın saat 14.00&rsquo;te, mezun yakınlarımızın ise saat 15.00&rsquo;te alana giriş yapmaları &ouml;nemle rica olunur.",
    "date": "23/05/2026",
    "time": "14:00",
    "location": "Kampüs",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/05/i9sqdvezo8bwl-buyuk-bir-emek-ve-ozveriyle-tamamladiginiz-universite-hayatinizi-gururla-taclandirma-vakti-geldi.jpg",
    "status": "Aktif",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1683-buyuk-bir-emek-ve-ozveriyle-tamamladiginiz-universite-hayatinizi-gururla-taclandirma-vakti-geldi"
  },
  {
    "id": "EVT-010",
    "title": "Havacılığın Frekansı Yükseliyor!",
    "description": "Yer: İstanbul Bilgi Üniversitesi, Kuştepe Kampüsü A-303 &quot;Kokpitten Kabine, İnsan Fakt&ouml;r&uuml;nden Geleceğe&quot; mottosuyla yola &ccedil;ıkan, havacılık sekt&ouml;r&uuml;n&uuml;n her dinamiğini derinlemesine ele alacağımız AviNation etkinliği i&ccedil;in geri sayım başladı! Sekt&ouml;r&uuml;n farklı alanlarında uzmanlaşmış &ccedil;ok değerli konuklarımızla, havacılığın d&uuml;n&uuml;ne, bug&uuml;n&uuml;ne ve geleceğine doğru bir yolculuğa &ccedil;ıkıyoruz. &Uuml;stelik etkinliğimiz Online Sertifikalıdır! 📜✨",
    "date": "20.05.2026",
    "time": "14:00",
    "location": "Kampüs",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/05/8byod8k1jc947-havaciligin-frekansi-yukseliyor.jpg",
    "status": "Aktif",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1679-havaciligin-frekansi-yukseliyor"
  },
  {
    "id": "EVT-011",
    "title": "İletişim Fakülteleri Neden Bu Kadar Önemli?",
    "description": "Yer: 3. Kat - Prof. Dr. Fuat SEZGİN Konferans Salonu Giderek dijitalleşen ve bilginin hızla t&uuml;kendiği g&uuml;n&uuml;m&uuml;zde, doğru ve nitelikli iletişim eğitiminin rol&uuml;n&uuml; ne kadar tartışıyoruz? Halkla İlişkiler ve Reklamcılık B&ouml;l&uuml;m&uuml;m&uuml;z&uuml;n d&uuml;zenlediği bu &ouml;zel etkinlikte, iletişim fak&uuml;ltelerinin &uuml;niversiteler ve toplum a&ccedil;ısından taşıdığı kritik &ouml;nemi masaya yatırıyoruz. &quot;Neden İletişim Eğitimi Olmalı?&quot; ve &quot;Neden İletişim Fak&uuml;lteleri Tercih Edilmeli?&quot; sorularına alanında uzman konuklarımızla yanıt a",
    "date": "19/05/2026",
    "time": "14:00",
    "location": "Kampüs",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/05/t27y5gb7wceap-1234535848979.jpg",
    "status": "Aktif",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1678-1234535848979"
  },
  {
    "id": "EVT-012",
    "title": "Psikoloji İstasyonu: İstanbul Etkinliğine Davetlisiniz!",
    "description": "&Uuml;niversitemiz PsikoAktif Kul&uuml;b&uuml; ve Gen&ccedil; Psikologlar Meclisi iş birliğiyle d&uuml;zenlenen &quot;Zihnin G&uuml;r&uuml;lt&uuml;s&uuml;n&uuml; Dindirmek: Anksiyeteye &Ccedil;oklu Bakış&quot; etkinliğinde bir araya geliyoruz. Alanında uzman konuklarımızla akran zorbalığından anksiyete m&uuml;dahalelerine kadar bir&ccedil;ok &ouml;nemli konuyu konuşuyoruz! Psikolog Neslişah Sarılı | Akran Zorbalığını Anlamak Kl. Psk. Akın Kongur | BDT ile Vaka Form&uuml;lasyonu ve M&uuml;dahale Teknikleri",
    "date": "16/05/2026",
    "time": "14:00",
    "location": "Kampüs",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/05/p0zg8mdsx3me7-psikoloji-istasyonu-istanbul-etkinligine-davetlisiniz.jpg",
    "status": "Aktif",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1673-psikoloji-istasyonu-istanbul-etkinligine-davetlisiniz"
  },
  {
    "id": "EVT-013",
    "title": "Eğitimin geleceğini yeniden şekillendiren iki büyük güç bir arada: Yapay Zekâ ve Sosyal Öğrenme!",
    "description": "İstanbul Esenyurt &Uuml;niversitesi Yabanı Diller Y&uuml;ksekokulu M&uuml;d&uuml;r&uuml; Dr. &Ouml;ğretim &Uuml;yesi Ali KURTun moderat&ouml;rl&uuml;ğ&uuml;nde ger&ccedil;ekleşecek &quot;Akıllı Pedagoji: Yapay Zekadan Sosyal &Ouml;ğrenmeye Eğitimde B&uuml;t&uuml;nc&uuml;l Yaklaşım&quot; seminerine davetlisiniz! ✨🧠 Teknolojinin ve insan etkileşiminin eğitimdeki rol&uuml;n&uuml;, alanında uzman &ccedil;ok değerli iki konuğumuzla enine boyuna tartışıyoruz: 👤 Konuklarımız: &bull; Do&ccedil;. Dr. Tuncer CAN (İstanbul &Uuml;niversitesi-Cerrahpaşa, Hasan Ali Y&uuml;cel Eğitim Fak&uuml;ltesi) &ndash",
    "date": "15/05/2026",
    "time": "14:00",
    "location": "Kampüs",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/05/mmfe36bkaqbg1-egitimin-gelecegini-yeniden-sekillendiren-iki-buyuk-guc-bir-arada-yapay-zekâ-ve-sosyal-ogrenme.jfif",
    "status": "Aktif",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1672-egitimin-gelecegini-yeniden-sekillendiren-iki-buyuk-guc-bir-arada-yapay-zekâ-ve-sosyal-ogrenme"
  },
  {
    "id": "EVT-014",
    "title": "&quot;Heybemden Masallar&quot; ile masalların büyülü dünyasına yolculuğa çıkıyoruz!",
    "description": "Yer: 2. Kat - Prof. Dr. Aziz SANCAR Kütüphane Amfisi İstanbul Esenyurt &Uuml;niversitesi SHMYO &Ccedil;ocuk Esenyurti Programı ve Parlayan &Ccedil;ocuklar Kul&uuml;b&uuml; iş birliğiyle d&uuml;zenlenen &quot;Masal Anlatıcılığı ve Eğitimde Uygulamaları&quot; etkinliğimizde buluşuyoruz. 🌈🦋 Masal Anlatıcısı ve Yazar Fatma GE&Ccedil;ER DEVRİM&rsquo;in değerli katılımıyla, masalların eğitimdeki g&uuml;c&uuml;n&uuml; keşfedeceğimiz ve heybesindeki eşsiz hikayelere ortak olacağımız bu keyifli etkinliği sakın ka&ccedil;ırmayın!",
    "date": "15/05/2026",
    "time": "14:00",
    "location": "Kampüs",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/05/3fmhni1yzp4kx-heybemden-masallar-ile-masallarin-buyulu-dunyasina-yolculuga-cikiyoruz.jfif",
    "status": "Aktif",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1671-heybemden-masallar-ile-masallarin-buyulu-dunyasina-yolculuga-cikiyoruz"
  },
  {
    "id": "EVT-015",
    "title": "&quot;20 Mayıs Çocuk Esenyurtciler Günü&quot; etkinliğimize davetlisiniz!",
    "description": "Yer: 3. Kat - Prof. Dr. Fuat SEZGİN Konferans Salonu İstanbul Esenyurt &Uuml;niversitesi Sağlık Bilimleri Fak&uuml;ltesi, &Ccedil;ocuk Esenyurti B&ouml;l&uuml;m&uuml; ve Gelecek 0-18 Kul&uuml;b&uuml; iş birliğiyle d&uuml;zenlenen &quot;20 Mayıs &Ccedil;ocuk Esenyurtciler G&uuml;n&uuml;&quot; etkinliğimize davetlisiniz! 🎓🧒👧 Alanında uzman konuklarımızın değerli paylaşımlarıyla ger&ccedil;ekleşecek bu &ouml;zel etkinliği ka&ccedil;ırmayın.",
    "date": "15/05/2026",
    "time": "14:00",
    "location": "Kampüs",
    "imageUrl": "https://www.esenyurt.edu.tr/uploads/2026/05/8vdcentpr9w03-20-mayis-cocuk-iesuciler-gunu-etkinligimize-davetlisiniz.jfif",
    "status": "Aktif",
    "url": "https://www.esenyurt.edu.tr/etkinlik/1670-20-mayis-cocuk-iesuciler-gunu-etkinligimize-davetlisiniz"
  }
];

// =====================================================
// Duyurular — kariyer.esenyurt.edu.tr'den birebir çekildi
// =====================================================
export const initialAnnouncements = [
  {
    "id": "ann-1",
    "title": "2026 ÖZYES (Özel Yetenek Sınavı) Başvuruları Başladı!",
    "date": "23/07/2026",
    "content": "Geleceğini yeteneğinle şekillendirmek i&ccedil;in ilk adımı at! İstanbul Esenyurt &Uuml;niversitesi 2026 &Ouml;ZYES başvuru ve sınav takvimi belli oldu. 📍 &Ouml;nemli Tarihler: ▶ Başvuru Tarihleri: 23 - 28 Temmuz 2026 ▶ Ge&ccedil; Başvuru G&uuml;n&uuml;: 30 Temmuz 2026",
    "isPremium": true
  },
  {
    "id": "ann-2",
    "title": "2025 - 2026 Yaz Okulu Ders Programı / 2025–2026 Summer School Course Schedule",
    "date": "22/07/2026",
    "content": "Sağlık Hizmetleri Meslek Y&uuml;ksekokulu - Vocational School of Health Scienes M&uuml;hendislik ve Mimarlık Fak&uuml;ltesi - Faculty of Engineering and Architecture Sağlık Bilimleri Fak&uuml;ltesi - Faculty of Sports Sciences",
    "isPremium": true
  },
  {
    "id": "ann-3",
    "title": "Öğr. Üyesi Dışındaki Öğr. Elemanı Kadrolarına Personel Alım İlanının Nihai Değerlendirme Sonuçları Açıklanmıştır.",
    "date": "23/06/2026",
    "content": "&Uuml;niversitemiz Rekt&ouml;rl&uuml;k Makamı tarafından 23/06/2026 tarihli ve 33289 sayılı Resmi Gazete&rsquo;de yayımlanan &Ouml;ğretim &Uuml;yesi Dışındaki &Ouml;ğretim Elemanı Kadrolarına Personel Alım İlanı kapsamında &lsquo;Nihai Değerlendirme&rsquo; sonucu kamuoyuna &ouml;nemle duyurulur. BTMYO Bilgisayar Programcılığı &Ouml;ğretim G&ouml;revlisi Nihai Değerlendirme Sonu&ccedil; Tutanağı BTMYO Robotik ve Yapay Zeka &Ouml;ğretim G&ouml;revlisi Nihai Değerlendirme Sonu&ccedil; Tutanağı",
    "isPremium": true
  },
  {
    "id": "ann-4",
    "title": "Öğr. Üyesi Dışındaki Öğr. Elemanı Kadrolarına Personel Alım İlanının Ön Değerlendirme Sonuçları Açıklanmıştır",
    "date": "23/06/2026",
    "content": "&Uuml;niversitemiz Rekt&ouml;rl&uuml;k Makamı tarafından 23/06/2026 tarihli ve 33289 sayılı Resmi Gazete&rsquo;de yayımlanan &Ouml;ğretim &Uuml;yesi Dışındaki &Ouml;ğretim Elemanı Kadrolarına Personel Alım İlanı kapsamında &lsquo;&Ouml;n Değerlendirme&rsquo; sonucu kamuoyuna &ouml;nemle duyurulur. BTMYO Bilgisayar Programcılığı &Ouml;ğretim G&ouml;revlisi &Ouml;n Değerlendirme Sonu&ccedil; Tutanağı BTMYO Robotik ve Yapay Zeka &Ouml;ğretim G&ouml;revlisi &Ouml;n Değerlendirme Sonu&ccedil; Tutanağı",
    "isPremium": true
  },
  {
    "id": "ann-5",
    "title": "Tek Ders / Not Yükseltme Sınav Programları Hk.",
    "date": "08/07/2026",
    "content": "Bilişim Teknolojileri Meslek Y&uuml;ksekokulu - Vocational School of Information Technologies Meslek Y&uuml;ksekokulu - Vocational School Sağlık Hizmetleri Meslek Y&uuml;ksekokulu - Vocational School of Health Services",
    "isPremium": true
  },
  {
    "id": "ann-6",
    "title": "Düzeltme İlanı",
    "date": "23/06/2026",
    "content": "İstanbul Esenyurt &Uuml;niversitesi Rekt&ouml;rl&uuml;ğ&uuml;nden: &Ouml;ĞRETİM &Uuml;YESİ DIŞINDAKİ &Ouml;ĞRETİM ELEMANI KADROLARINA PERSONEL ALIMI D&Uuml;ZELTME İLANI 23/06/2026 tarihli ve 33289 sayılı Resmi Gazete&rsquo;de aslına uygun olarak yayımlanan &Uuml;niversitemiz İşletme ve Y&ouml;netim Bilimleri Fak&uuml;ltesi İşletme (İngilizce) B&ouml;l&uuml;m&uuml; Araştırma G&ouml;revlisi kadrosuna akademik personel alım ilanımız sehven hatalı yazıldığından dolayı revize edilmiş olup, aşağıdaki tabloda sunulmuştur. Ayrıntılı bilgiye http://www.esenyurt.edu.tr adresinden ulaşılabilecektir.",
    "isPremium": true
  },
  {
    "id": "ann-7",
    "title": "2025-2026 Yaz Okulu Başvuruları Başladı!",
    "date": "24/06/2026",
    "content": "2025-2026 AKADEMİK YILI YAZ OKULU DUYURUSU A&ccedil;ılması Planlanan Derslerin İlan Edilmesi &Uuml;cret &Ouml;demeleri ve Ders Kayıtları",
    "isPremium": true
  },
  {
    "id": "ann-8",
    "title": "23/06/2026 tarihli 33289 Sayılı Resmi Gazete’de Yayımlanan Öğretim Üyesi ve Öğretim Üyesi Dışındaki Öğretim Elemanı Kadrolarına Personel Alımı",
    "date": "23/06/2026",
    "content": "&Ouml;ğretim &Uuml;yesi Dışındaki &Ouml;ğretim Elemanı Bu içerik 23/06/2026 tarihinde güncellenmiştir. İstanbul Esenyurt Üniversitesi'ni yakından takip etmek, yaklaşan etkinlikler, haberler ve daha birçok konudan anında haberdar olmak için abone olun.",
    "isPremium": true
  },
  {
    "id": "ann-9",
    "title": "Öğr. Üyesi Dışındaki Öğr. Elemanı Kadrolarına Personel Alım İlanının Nihai Değerlendirme Sonuçları Açıklanmıştır.",
    "date": "02/06/2026",
    "content": "&Uuml;niversitemiz Rekt&ouml;rl&uuml;k Makamı tarafından 02/06/2026 tarihli ve 33268 sayılı Resmi Gazete&rsquo;de yayımlanan &Ouml;ğretim &Uuml;yesi Dışındaki &Ouml;ğretim Elemanı Kadrolarına Personel Alım İlanı kapsamında &lsquo;Nihai Değerlendirme&rsquo; sonucu kamuoyuna &ouml;nemle duyurulur. BTMYO Robotik ve Yapay Zeka &Ouml;ğretim G&ouml;revlisi Nihai Değerlendirme MYO Elektrik Enerjisi &Uuml;retim İletim ve Dağıtımı &Ouml;ğretim G&ouml;revlisi Nihai Değerlendirme",
    "isPremium": true
  },
  {
    "id": "ann-10",
    "title": "2026-2027 Güz Dönemi Yüksek Lisans ve Doktora Başvuruları BAŞLADI!",
    "date": "17/06/2026",
    "content": "İstanbul Esenyurt &Uuml;niversitesi&rsquo;nde lisans&uuml;st&uuml; eğitim alarak akademik ve profesyonel hedeflerine bir adım daha yaklaş! 2026-2027 G&uuml;z D&ouml;nemi Y&uuml;ksek Lisans ve Doktora Başvuruları BAŞLADI! 🚀 ✨ Geleceğini şekillendirirken Erken Kayıt Avantajlarını ka&ccedil;ırma! 🗓 Erken Başvuru Tarihleri: 15 Haziran - 3 Temmuz",
    "isPremium": true
  }
];

// =====================================================
// SEM Kursları
// =====================================================
export const initialSemCourses = [
  { id: "SEM-001", title: "Dijital Pazarlama Sertifika Programı", description: "devamını oku", imageUrl: "https://w3-s3-bucket.s3.us-east-1.amazonaws.com/SaaS/semonline/uploaded-files/1863174303737663.jpeg", status: "Aktif" },
  { id: "SEM-002", title: "Sertifikalarınız Artık E-Devlet Sisteminde", description: "devamını oku", imageUrl: "https://w3-s3-bucket.s3.us-east-1.amazonaws.com/SaaS/semonline/uploaded-files/1863169639302748.jpeg", status: "Aktif" },
  { id: "SEM-003", title: "Temel ve Orta Seviye Excel Eğitimi", description: "devamını oku", imageUrl: "https://w3-s3-bucket.s3.us-east-1.amazonaws.com/SaaS/semonline/uploaded-files/1863175713016420.jpeg", status: "Aktif" },
  { id: "SEM-004", title: "Proje Yönetimi (PMP Hazırlık)", description: "devamını oku", imageUrl: "https://w3-s3-bucket.s3.us-east-1.amazonaws.com/SaaS/semonline/uploaded-files/1863354459156114.jpeg", status: "Aktif" },
  { id: "SEM-005", title: "İnsan Kaynakları Yönetimi Sertifika Programı", description: "devamını oku", imageUrl: "https://w3-s3-bucket.s3.us-east-1.amazonaws.com/SaaS/semonline/uploaded-files/1862800825295090.jpeg", status: "Aktif" },
];

// =====================================================
// İş İlanları — Gerçek sitedeki hizmetler temel alındı
// =====================================================
export const initialJobs = [
  { id: "JOB-001", title: "Ulusal Staj Programı", company: "İESÜ Kariyer Geliştirme Koordinatörlüğü", location: "Türkiye Geneli", description: "Cumhurbaşkanlığı himayesinde yürütülen Ulusal Staj Programı kapsamında çeşitli kurumlarda staj imkânı.", imageUrl: "https://panel.esenyurt.edu.tr/assets/2026/resimler/mmk/ulusal-staj-programi-ek-usp-uni-pay2_7a018351522340f9883fe36d578505ed.jpg", status: "Aktif" },
  { id: "JOB-002", title: "Araştırma Faaliyetleri", company: "İESÜ Kariyer Geliştirme Koordinatörlüğü", location: "İstanbul Esenyurt Üniversitesi", description: "Kariyer Geliştirme Koordinatörlüğü bünyesinde yürütülen araştırma faaliyetleri ve projeler.", imageUrl: "https://panel.esenyurt.edu.tr/assets/2025/resimler/mmk/123e5d87cd934f49ad587f7f4bb01f5a_(768_432).jpg", status: "Aktif" },
  { id: "JOB-003", title: "Akran Mentor Programı", company: "İESÜ Kariyer Geliştirme Koordinatörlüğü", location: "İstanbul Esenyurt Üniversitesi", description: "Deneyimli öğrencilerin yeni öğrencilere rehberlik ettiği Akran Mentor programı.", imageUrl: "https://panel.esenyurt.edu.tr/assets/2025/resimler/mmk/c5e98c9906414da897751aef53f7cdea_(768_432).jpg", status: "Aktif" },
  { id: "JOB-004", title: "İş Arama Platformları Rehberi", company: "İESÜ Kariyer Geliştirme Koordinatörlüğü", location: "Online", description: "Öğrencilere ve mezunlara yönelik iş arama platformları ve kariyer kaynakları rehberi.", imageUrl: "https://panel.esenyurt.edu.tr/assets/2025/resimler/mmk/49c1be8495d7408090bc9340ddd5a707_(768_432).jpg", status: "Aktif" },
  { id: "JOB-005", title: "İşbirliklerimiz — Sektör Ortaklıkları", company: "İESÜ Kariyer Geliştirme Koordinatörlüğü", location: "İstanbul Esenyurt Üniversitesi", description: "Kariyer Geliştirme Koordinatörlüğü'nin sektör liderleriyle kurduğu iş birliği protokolleri ve ortak projeler.", imageUrl: "https://panel.esenyurt.edu.tr/assets/2025/resimler/mmk/81ef9405e47647a19acf4f065f602379_(768_432).jpg", status: "Aktif" },
];

// =====================================================
// Öne Çıkan Fırsatlar — Sitedeki ana sayfadaki slider görselleri
// =====================================================
export const initialFeatured = [
  { id: "FTR-001", title: "Ulusal Staj Programı", imageUrl: "https://panel.esenyurt.edu.tr/assets/2025/resimler/kurumsaliletisim/c22f7ef2fdc8492ea26e4508c7a48adc_015b9396b49f4bbfb8454c98cc1ebeaa.jpg" },
  { id: "FTR-002", title: "Araştırma Faaliyetleri", imageUrl: "https://panel.esenyurt.edu.tr/assets/2025/resimler/kurumsaliletisim/09a23c212bca4b988af33523dc56b0dc_dd6cc4f202854efbb56f5f58b6494a2e.jpg" },
  { id: "FTR-003", title: "Akran Mentor Programı", imageUrl: "https://panel.esenyurt.edu.tr/assets/2025/resimler/kurumsaliletisim/1d091a0ef16d416db4ab9232c2f9120b_97d77ce97bbe412b80857b53c64b7cf6.jpg" },
  { id: "FTR-004", title: "İş Arama Platformları", imageUrl: "https://panel.esenyurt.edu.tr/assets/2025/resimler/kurumsaliletisim/b9ec20f282ca455e8b55f1eab8b00c57_7c50bd63d1b34feab07bbd8eed7ba269.jpg" },
  { id: "FTR-005", title: "İşbirliklerimiz", imageUrl: "https://panel.esenyurt.edu.tr/assets/2025/resimler/kurumsaliletisim/8c4f08ebeb2c4fd8b10b76a73388eb07_ce7747ca00fc4b659e0af2bacbe93742.jpg" },
];

export const initialMentorships = [];
export const initialVoluntaryInternships = [];

// =====================================================
// Akademik Katalog
// =====================================================
const generateCatalog = () => {
  let facId = 1;
  let depId = 1;
  let prgId = 1;

  const allUnits = [
    ...IESU_FACULTIES.map(u => ({...u, type: 'Fakülte'})),
    ...IESU_MYO.map(u => ({...u, type: 'Meslek Yüksekokulu'})),
    ...IESU_YUKSEKOKUL.map(u => ({...u, type: 'Yüksekokul'})),
    ...IESU_ENSTITU.map(u => ({...u, type: 'Enstitü'}))
  ];

  return allUnits.map(unit => {
    return {
      id: `FAC-${String(facId++).padStart(3, '0')}`,
      name: unit.name,
      type: unit.type,
      status: "Aktif",
      departments: unit.departments.map(dep => {
        return {
          id: `DEP-${String(depId++).padStart(3, '0')}`,
          name: dep,
          status: "Aktif",
          programs: [
            {
              id: `PRG-${String(prgId++).padStart(3, '0')}`,
              name: `${dep} (${unit.type === 'Meslek Yüksekokulu' ? 'Önlisans' : unit.type === 'Enstitü' ? 'Lisansüstü' : 'Lisans'})`,
              level: unit.type === 'Meslek Yüksekokulu' ? 'Önlisans' : unit.type === 'Enstitü' ? 'Lisansüstü' : 'Lisans',
              doubleMajorEligible: true,
              status: "Aktif"
            }
          ]
        }
      })
    };
  });
};

export const initialAcademicCatalog = generateCatalog();
export const academicStaff = [];

// =====================================================
// Stajlar — Eski sahte şirketler temizlendi
// =====================================================
export const initialInternships = [];

// =====================================================
// Akademik Onaylar
// =====================================================
export const initialAcademicApprovals = [];

// =====================================================
// Gruplar
// =====================================================
export const initialGroups = [
  {
    id: "GRP-001",
    name: "Yazılım Geliştiricileri Kulübü",
    description: "İstanbul Esenyurt Üniversitesi öğrencileri, mezunları ve akademisyenlerinin yer aldığı, teknoloji ve yazılım geliştirme üzerine etkinlikler düzenleyen resmi topluluk.",
    cover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    logo: "https://ui-avatars.com/api/?name=YG&background=0D9488&color=fff&size=200",
    type: "Öğrenci Kulübü",
    memberCount: 142,
    verified: true,
    createdBy: "admin_igu",
    status: "Aktif",
    events: [],
    boardMembers: [
      { role: "Kulüp Başkanı", name: "Ali Yılmaz", department: "Bilgisayar Mühendisliği" },
      { role: "Başkan Yardımcısı", name: "Ayşe Kaya", department: "Yazılım Mühendisliği" },
      { role: "Genel Sekreter", name: "Mehmet Demir", department: "Bilişim Sistemleri" },
      { role: "Sayman", name: "Zeynep Çelik", department: "İşletme" },
      { role: "Danışman Akademisyen", name: "Dr. Öğr. Üyesi Ahmet Kılıç", department: "Bilgisayar Mühendisliği" }
    ]
  },
  {
    id: "GRP-002",
    name: "Girişimcilik ve İnovasyon Topluluğu",
    description: "Kendi işini kurmak isteyenlerin, melek yatırımcıların ve girişimcilik ekosistemine ilgi duyan tüm İESÜ'lülerin buluşma noktası.",
    cover: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2032&q=80",
    logo: "https://ui-avatars.com/api/?name=GI&background=0A2342&color=fff&size=200",
    type: "Mezun Ağı",
    memberCount: 89,
    verified: false,
    createdBy: 1,
    status: "Aktif",
    events: [],
    boardMembers: [
      { role: "Kulüp Başkanı", name: "Kerem Tunç", department: "İşletme" },
      { role: "Başkan Yardımcısı", name: "Selin Yılmaz", department: "Uluslararası Ticaret" },
      { role: "Danışman Akademisyen", name: "Prof. Dr. Ayşe Yılmaz", department: "İşletme" }
    ]
  }
];

// =====================================================
// Anketler
// =====================================================
export const initialSurveys = [
  {
    id: 'SRV-101',
    title: '2024 Mezun İstihdam ve Memnuniyet Anketi',
    description: 'İESÜ\'nün kalitesini artırmak için mezuniyet sonrası iş hayatınızla ilgili deneyimlerinizi öğrenmek istiyoruz.',
    date: '2026-07-15',
    status: 'Aktif',
    type: 'Genel Anket',
    targetAudience: 'Mezunlar',
    responses: 24,
    questions: [
      { id: 'q1', text: 'İESÜ\'de aldığınız eğitimin mevcut işinize katkısı nedir?', type: 'likert' },
      { id: 'q2', text: 'Şu anki işinizden genel olarak memnun musunuz?', type: 'likert' }
    ]
  },
  {
    id: 'SRV-102',
    title: 'Kariyer Geliştirme Koordinatörlüğü Hizmetleri Değerlendirmesi',
    description: 'İESÜ Kariyer Geliştirme Koordinatörlüğü\'nin sunduğu hizmetlerden ne kadar faydalandınız?',
    date: '2026-07-10',
    status: 'Aktif',
    type: 'Etkinlik Değerlendirme',
    targetAudience: 'Tümü',
    responses: 112,
    questions: [
      { id: 'q1', text: 'Kariyer merkezimizin ilanlarını ne sıklıkla takip ediyorsunuz?', type: 'likert' }
    ]
  }
];


export const initialPosts = [
    { id: 'POST-001', author: { id: 'CMP-001', name: 'Trendyol', avatar: 'https://ui-avatars.com/api/?name=Trendyol&background=F97316&color=fff', title: 'Teknoloji Ekibi', role: 'employer' }, content: 'Yazılım Mühendisliği stajyer alımlarımız başlamıştır! Tüm İESÜ öğrencilerini bekliyoruz. 🚀 #trendyol #staj', likes: 145, comments: 23, time: '2 saat önce' },
    { id: 'POST-002', author: { id: 'ALU-001', name: 'Caner Öztürk', avatar: 'https://ui-avatars.com/api/?name=Caner+Öztürk&background=EA580C&color=fff', title: 'Frontend Developer @ Trendyol', role: 'alumni' }, content: 'Mezun olduğum Esenyurt Üniversitesi Kariyer Fuarında şirketimi temsil etmek gurur verici. Harika yeteneklerle tanıştık! 🎓', likes: 89, comments: 12, time: '5 saat önce' },
    { id: 'POST-003', author: { id: 'STU-002', name: 'Zeynep Kaya', avatar: 'https://ui-avatars.com/api/?name=Zeynep+Kaya&background=0A2342&color=fff', title: 'Bilgisayar Mühendisliği Öğrencisi', role: 'student' }, content: 'Bugün KGM tarafından düzenlenen Mülakat Teknikleri eğitimine katıldım. Eksiklerimi görmek için harika bir deneyimdi. Emeği geçenlere teşekkürler! 💼', likes: 45, comments: 5, time: '1 gün önce' },
    { id: 'POST-004', author: { id: 'ACAD-001', name: 'Prof. Dr. Ahmet Yılmaz', avatar: 'https://ui-avatars.com/api/?name=Ahmet+Yılmaz&background=0EA5E9&color=fff', title: 'Dekan', role: 'academic' }, content: 'Fakültemiz öğrencilerinin bitirme projeleri sanayi odaklı olmaya devam ediyor. Bu yıl 15 projemiz TÜBİTAK desteği aldı.', likes: 210, comments: 18, time: '2 gün önce' }
  ];