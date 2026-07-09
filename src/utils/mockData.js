import { IESU_FACULTIES, IESU_MYO, IESU_YUKSEKOKUL, IESU_ENSTITU } from './universityData';

export const generateStudents = () => {
  return [];
};

export const generateAlumni = () => {
  return [];
};

export const generateCompanies = () => {
  return [];
};

export const initialNews = [
  { id: "NEWS-001", title: "İstanbul Esenyurt Üniversitesi 2025–2026 Akademik Yılı Mezuniyet Töreni Büyük Bir Coşku ve Yoğun Katılımla Gerçekleşti !", description: "İstanbul Esenyurt Üniversitesi 2025-2026 Akademik Yılı Mezuniyet Töreni, 28 Haziran tarihinde büyük bir coşku ve yoğun katılımla gerçekleşti.", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/oylsngaboxc3h-istanbul-esenyurt-universitesi-2025%E2%80%932026-akademik-yili-mezuniyet-toreni-buyuk-bir-cosku-ve-yogun-katilimla-gerceklesti.jpg", status: "Aktif", date: "01.07.2026" },
  { id: "NEWS-002", title: "Babalar gününüz kutlu olsun!", description: "Tüm babaların babalar gününü en içten dileklerimizle kutlarız.", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/lfm1qqtrbpc06-babalar-gununuz-kutlu-olsun.jpg", status: "Aktif", date: "21.06.2026" },
  { id: "NEWS-003", title: "Rektörümüzden mesaj var.", description: "Sevgili Öğrenciler, yeni dönem planlamalarınızı şimdiden yapmaya başlayın.", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/cnr9eeh7d6p95-rektorumuzden-mesaj-var.png", status: "Aktif", date: "20.06.2026" },
  { id: "NEWS-004", title: "OSB'li Mucitlerle Bilime Yolculuk: TÜBİTAK 4008 Projesi Başarıyla Tamamlandı!", description: "Esenyurt İlçe Millî Eğitim Müdürlüğü yürütücülüğünde, TÜBİTAK'ın Özel Gereksinimli bireylere yönelik projesi başarıyla tamamlandı.", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/wqavsz5j3x5h3-osb%E2%80%99li-mucitlerle-bilime-yolculuk-tubitak-4008-projesi-basariyla-tamamlandi.jpg", status: "Aktif", date: "19.06.2026" },
  { id: "NEWS-005", title: "Kuruluşumuzun 14. Yıl Dönümünü Büyük Bir Gururla Kutladık!", description: "18 Haziran 2013 tarihinde kurulan Üniversitemiz, 14. kuruluş yıl dönümünü coşkulu bir törenle kutladı.", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/w8iuswg33mknh-kurulusumuzun-14-yil-donumunu-buyuk-bir-gururla-kutladik.jpg", status: "Aktif", date: "18.06.2026" },
  { id: "NEWS-006", title: "Yükseköğretim Kurumları Sınavı'nda hepinize başarılar ve zihin açıklığı dilerim.", description: "Yükseköğretim Kurumları Sınavı'na girecek tüm adaylarımıza başarılar dileriz.", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/mr13a89rux73s-yuksekogretim-kurumlari-sinavinda-hepinize-basarilar-ve-zihin-acikligi-dilerim.jpg", status: "Aktif", date: "14.06.2026" },
  { id: "NEWS-007", title: "Avukat Özgür Karakılıç'tan Sosyal Hizmet Öğrencilerine Hukuki Boyut Eğitimi", description: "Üniversitemiz Sağlık Bilimleri Fakültesi Sosyal Hizmet Bölümü öğrencileri, Çocuk Koruma alanında hukuki eğitim aldı.", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/pu8dbn1tyoq8e-avukat-ozgur-karakilic%E2%80%99tan-sosyal-hizmet-ogrencilerine-hukuki-boyut-egitimi.png", status: "Aktif", date: "12.06.2026" },
  { id: "NEWS-008", title: "Sarıyer Sosyal Hizmet Merkezi Müdürü Ahmet Serdar Ermiş'ten Sosyal Hizmet Öğrencilerine Sunum", description: "Üniversitemiz Sağlık Bilimleri Fakültesi Sosyal Hizmet Bölümü öğrencileri, sosyal hizmet alanında sunum dinledi.", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/5pgf61mq124st-sariyer-sosyal-hizmet-merkezi-muduru-ahmet-serdar-ermis%E2%80%99ten-sosyal-hizmet-ogrencilerine-sunum.png", status: "Aktif", date: "10.06.2026" },
  { id: "NEWS-009", title: "Uzman Doktor Canan Hasbal Akkuş'tan Sosyal Hizmet Öğrencilerine Eğitim", description: "Üniversitemiz Sağlık Bilimleri Fakültesi Sosyal Hizmet Bölümü öğrencileri, çocuk gelişimi alanında uzman eğitim aldı.", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/o86jd04eiinqg-uzman-doktor-canan-hasbal-akkus%E2%80%99tan-sosyal-hizmet-ogrencilerine-egitim.png", status: "Aktif", date: "08.06.2026" },
  { id: "NEWS-010", title: "Esenyurt Sosyal Hizmet Merkezinden Sosyal Hizmet Öğrencilerine Kadınlara Yönelik Sosyal Hizmet Sunumu", description: "Üniversitemiz Sağlık Bilimleri Fakültesi Sosyal Hizmet Bölümü öğrencileri, kadınlara yönelik sosyal hizmet sunumuna katıldı.", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/nrrvoz1mglczy-esenyurt-sosyal-hizmet-merkezinden-sosyal-hizmet-ogrencilerine-kadinlara-yonelik-sosyal-hizmet-sunumu.png", status: "Aktif", date: "06.06.2026" },
  { id: "NEWS-011", title: "Beylikdüzü Sosyal Hizmet Merkezinden Sosyal Hizmet Öğrencilerine Eğitim Programı", description: "Üniversitemiz Sağlık Bilimleri Fakültesi öğrencilerine, Beylikdüzü Sosyal Hizmet Merkezinden eğitim verildi.", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/x3bltktrn5mas-beylikduzu-sosyal-hizmet-merkezinden-sosyal-hizmet-ogrencilerine-egitim-programi.png", status: "Aktif", date: "04.06.2026" },
  { id: "NEWS-012", title: "Bahçelievler Sosyal Hizmet Merkezinden Sosyal Hizmet Öğrencilerine \"Bireylerle Sosyal Hizmet\" Sunumu", description: "Üniversitemiz Sağlık Bilimleri Fakültesi Sosyal Hizmet Bölümü öğrencileri, bireylerle sosyal hizmet sunumuna katıldı.", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/lv8d78x9mabzm-bahcelievler-sosyal-hizmet-merkezinden-sosyal-hizmet-ogrencilerine-%E2%80%9Cbireylerle-sosyal-hizmet%E2%80%9D-sunumu.png", status: "Aktif", date: "02.06.2026" }
];

export const initialEvents = [
  { id: "EVT-004", title: "Büyük bir emek ve özveriyle tamamladığınız üniversite hayatınızı gururla taçlandırma vakti geldi!", description: "Detaylı bilgi için tıklayınız...", date: "28 Mayıs", time: "14:00", location: "Esenyurt Üniversitesi", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/05/i9sqdvezo8bwl-buyuk-bir-emek-ve-ozveriyle-tamamladiginiz-universite-hayatinizi-gururla-taclandirma-vakti-geldi.jpg", status: "Aktif" },
  { id: "EVT-005", title: "Havacılığın Frekansı Yükseliyor!", description: "Detaylı bilgi için tıklayınız...", date: "20 Mayıs", time: "14:00", location: "Esenyurt Üniversitesi", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/05/8byod8k1jc947-havaciligin-frekansi-yukseliyor.jpg", status: "Aktif" },
  { id: "EVT-006", title: "İletişim Fakülteleri Neden Bu Kadar Önemli?", description: "Detaylı bilgi için tıklayınız...", date: "21 Mayıs", time: "13:00", location: "Esenyurt Üniversitesi", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/05/t27y5gb7wceap-1234535848979.jpg", status: "Aktif" },
  { id: "EVT-007", title: "Psikoloji İstasyonu: İstanbul Etkinliğine Davetlisiniz!", description: "Detaylı bilgi için tıklayınız...", date: "22 Mayıs", time: "10:30", location: "Esenyurt Üniversitesi", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/05/p0zg8mdsx3me7-psikoloji-istasyonu-istanbul-etkinligine-davetlisiniz.jpg", status: "Aktif" },
  { id: "EVT-008", title: "Eğitimin geleceğini yeniden şekillendiren iki büyük güç bir arada: Yapay Zekâ ve Sosyal Öğrenme!", description: "Detaylı bilgi için tıklayınız...", date: "18 Mayıs", time: "14:00", location: "Esenyurt Üniversitesi", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/05/mmfe36bkaqbg1-egitimin-gelecegini-yeniden-sekillendiren-iki-buyuk-guc-bir-arada-yapay-zek%C3%A2-ve-sosyal-ogrenme.jfif", status: "Aktif" },
  { id: "EVT-009", title: "\"Heybemden Masallar\" ile masalların büyülü dünyasına yolculuğa çıkıyoruz!", description: "Detaylı bilgi için tıklayınız...", date: "20 Mayıs", time: "13:00", location: "Esenyurt Üniversitesi", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/05/3fmhni1yzp4kx-heybemden-masallar-ile-masallarin-buyulu-dunyasina-yolculuga-cikiyoruz.jfif", status: "Aktif" },
  { id: "EVT-010", title: "\"20 Mayıs Çocuk Gelişimciler Günü\" etkinliğimize davetlisiniz!", description: "Detaylı bilgi için tıklayınız...", date: "20 Mayıs", time: "13:00", location: "Esenyurt Üniversitesi", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/05/8vdcentpr9w03-20-mayis-cocuk-gelisimciler-gunu-etkinligimize-davetlisiniz.jfif", status: "Aktif" },
  { id: "EVT-011", title: "Siber dünyanın kapılarını aralıyoruz!", description: "Detaylı bilgi için tıklayınız...", date: "18 Mayıs", time: "13:00", location: "Esenyurt Üniversitesi", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/05/n7aq87033zh6y-siber-dunyanin-kapilarini-araliyoruz.jpg", status: "Aktif" },
  { id: "EVT-012", title: "Geleceğin Teknolojilerini Birlikte İnşa Ediyoruz!", description: "Detaylı bilgi için tıklayınız...", date: "20 Mayıs", time: "15:30", location: "Esenyurt Üniversitesi", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/05/iy1xz1xicxkp4-gelecegin-teknolojilerini-birlikte-insa-ediyoruz.png", status: "Aktif" }
];

export const initialAnnouncements = [
  { id: "ANN-001", title: "Tek Ders / Not Yükseltme Sınav Programları Hk.", description: "Detaylı bilgi için tıklayınız...", status: "Aktif" },
  { id: "ANN-002", title: "Düzeltme İlanı", description: "Detaylı bilgi için tıklayınız...", status: "Aktif" },
  { id: "ANN-003", title: "2025-2026 Yaz Okulu Başvuruları Başladı!", description: "Detaylı bilgi için tıklayınız...", status: "Aktif" },
  { id: "ANN-004", title: "23/06/2026 tarihli 33289 Sayılı Resmi Gazete’de Yayımlanan Öğretim Üyesi ve Öğretim Üyesi Dışındaki Öğretim Elemanı Kadrolarına Personel Alımı", description: "Detaylı bilgi için tıklayınız...", status: "Aktif" },
  { id: "ANN-005", title: "Öğr. Üyesi Dışındaki Öğr. Elemanı Kadrolarına Personel Alım İlanının Nihai Değerlendirme Sonuçları Açıklanmıştır.", description: "Detaylı bilgi için tıklayınız...", status: "Aktif" },
  { id: "ANN-006", title: "2026-2027 Güz Dönemi Yüksek Lisans ve Doktora Başvuruları BAŞLADI!", description: "İstanbul Esenyurt Üniversitesi’nde lisansüstü eğitim alarak akademik ve profesyonel ....", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/hwnm703xudaje-2026-2027-guz-donemi-yuksek-lisans-ve-doktora-basvurulari-basladi.jpg", status: "Aktif" },
  { id: "ANN-007", title: "Öğr. Üyesi Dışındaki Öğr. Elemanı Kadrolarına Personel Alım İlanının Ön Değerlendirme Sonuçları Açıklanmıştır.", description: "Detaylı bilgi için tıklayınız...", status: "Aktif" },
  { id: "ANN-008", title: "2025-2026 Eğitim Öğretim Yılı Bahar Dönemi Bütünleme Sınav Programları / 2025-2026 Academic Year Spring Semester Make-up Exam Schedules", description: "Detaylı bilgi için tıklayınız...", status: "Aktif" },
  { id: "ANN-009", title: "02/06/2026 Tarihli 33268 Sayılı Resmi Gazete’de Yayımlanan Öğretim Üyesi ve Öğretim Üyesi Dışındaki Öğretim Elemanı Kadrolarına Personel Alımı", description: "Detaylı bilgi için tıklayınız...", status: "Aktif" },
  { id: "ANN-010", title: "2025-2026 Eğitim Öğretim Yılı Bahar Dönemi Final Sınav Programları / 2025-2026 Academic Year Spring Term Final Exam Schedules", description: "Detaylı bilgi için tıklayınız...", status: "Aktif" },
  { id: "ANN-011", title: "Genproo Etkinliği Tarihi Ertelenmesi Hk.", description: "Detaylı bilgi için tıklayınız...", status: "Aktif" },
  { id: "ANN-012", title: "2025 - 2026 Eğitim Öğretim Yılı Bahar Dönemi Vize Mazeret Sınav Programı", description: "Detaylı bilgi için tıklayınız...", status: "Aktif" }
];

export const initialSemCourses = [
  { id: "SEM-001", title: "Dijital Pazarlama Eğitimleri", description: "devamını oku", imageUrl: "https://w3-s3-bucket.s3.us-east-1.amazonaws.com/SaaS/semonline/uploaded-files/1863174303737663.jpeg", status: "Aktif" },
  { id: "SEM-002", title: "Sertifikalarınız Artık E-Devlet Sisteminde", description: "devamını oku", imageUrl: "https://w3-s3-bucket.s3.us-east-1.amazonaws.com/SaaS/semonline/uploaded-files/1863169639302748.jpeg", status: "Aktif" },
  { id: "SEM-003", title: "Temel ve Orta Seviye Excel Eğitimi", description: "devamını oku", imageUrl: "https://w3-s3-bucket.s3.us-east-1.amazonaws.com/SaaS/semonline/uploaded-files/1863175713016420.jpeg", status: "Aktif" },
  { id: "SEM-004", title: "Emlak Danışmanlığı Eğitimleri", description: "devamını oku", imageUrl: "https://w3-s3-bucket.s3.us-east-1.amazonaws.com/SaaS/semonline/uploaded-files/1863354459156114.jpeg", status: "Aktif" },
  { id: "SEM-005", title: "Bilirkişilik Temel Eğitimleri", description: "devamını oku", imageUrl: "https://w3-s3-bucket.s3.us-east-1.amazonaws.com/SaaS/semonline/uploaded-files/1862800825295090.jpeg", status: "Aktif" }
];

export const initialJobs = [
  { id: "JOB-001", title: "2026 Ulusal Staj", company: "Kariyer Merkezi", location: "Esenyurt Üniversitesi", description: "Staj programı detayları...", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/01/7vnjt36bkvvot-2026-ulusal-staj.PNG", status: "Aktif" },
  { id: "JOB-002", title: "Kariyer Geliştirme Ofisi", company: "Kariyer Merkezi", location: "Esenyurt Üniversitesi", description: "Kariyer fırsatları...", imageUrl: "https://www.esenyurt.edu.tr/uploads/2025/07/khp3b36qx52v7-kariyer-gelistirme-ofisi.jpeg", status: "Aktif" },
  { id: "JOB-003", title: "Yetenek Kapısı", company: "Kariyer Merkezi", location: "Esenyurt Üniversitesi", description: "Öğrencilere yönelik fırsatlar", imageUrl: "https://www.esenyurt.edu.tr/uploads/2025/07/puvyjwzmoe347-yetenek-kapisi.jpeg", status: "Aktif" },
  { id: "JOB-004", title: "Sosyal Medya", company: "Kariyer Merkezi", location: "Esenyurt Üniversitesi", description: "Kariyer merkezi sosyal ağları...", imageUrl: "https://www.esenyurt.edu.tr/uploads/2025/07/p6mqvahlvk7db-sosyal-medya.jpg", status: "Aktif" },
  { id: "JOB-005", title: "İş ve Staj Danışmanlığı", company: "Kariyer Merkezi", location: "Esenyurt Üniversitesi", description: "Kariyer planlama desteği", imageUrl: "https://www.esenyurt.edu.tr/uploads/2025/07/p70mfx6utfoke-is-ve-staj-danismanligi.jpg", status: "Aktif" }
];

export const initialFeatured = [
  { id: "FTR-001", title: "2025-2026 Yaz Okulu Başvuruları Başladı", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/pqwz3scyfp77u-yaz-okulu-basladi.jfif" },
  { id: "FTR-002", title: "Kuruluşumuzun 14. Yıl Dönümünü Büyük Bir Gururla Kutladık", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/qd2nc7jccjlfr-universitemizin-14-yil-donumu-kutlu-olsun.jfif" },
  { id: "FTR-003", title: "Bilimin Büyülü Dünyasına Yolculuk Kapanış Toplantısı", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/wfqhxuy8cvhjo-bilimin-buyulu-dunyasina-yolculuk-kapanis-toplantisi.jfif" },
  { id: "FTR-004", title: "Bahar Şenliği Başlıyor", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/05/wuyeismnf35tr-bahar-senligi.jpg" },
  { id: "FTR-005", title: "Akademik Başarı Ödülleri Sahiplerini Buldu", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/05/257y8y0atcmgq-odul-toreni.jpg" },
  { id: "FTR-006", title: "Teknofest Yolculuğu Başladı", imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/05/qwap0drtzge6m-teknofest.jpg" }
];

export const initialMentorships = [];

export const initialVoluntaryInternships = [];

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

export const initialInternships = [
  { id: "INT-001", studentName: "Burak Demir", studentNo: "20231012", department: "Bilgisayar Mühendisliği", company: "Aselsan", status: "Onay Bekliyor", type: "Zorunlu Staj", term: "Yaz 2026" },
  { id: "INT-002", studentName: "Elif Aydın", studentNo: "20231045", department: "İşletme", company: "Garanti BBVA", status: "Onaylandı", type: "Gönüllü Staj", term: "Yaz 2026" },
  { id: "INT-003", studentName: "Can Yıldız", studentNo: "20231088", department: "Bilgisayar Mühendisliği", company: "Trendyol Tech", status: "Devam Ediyor", type: "Zorunlu Staj", term: "Bahar 2026" },
  { id: "INT-004", studentName: "Derya Şahin", studentNo: "20231092", department: "Bilgisayar Mühendisliği", company: "Softtech", status: "Reddedildi", type: "Zorunlu Staj", term: "Yaz 2026" }
];

export const initialAcademicApprovals = [
  {
    id: "APP-001",
    userId: 1,
    userName: "Ahmet Yılmaz",
    userType: "student",
    fieldChanged: "ÇAP Bölümü",
    oldValue: "Yok",
    newValue: "İşletme (Lisans)",
    submittedDate: "2026-07-06",
    status: "Beklemede",
    adminNote: ""
  }
];
