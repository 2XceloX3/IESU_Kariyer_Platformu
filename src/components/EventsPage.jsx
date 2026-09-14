import React, { useState } from 'react';
import { Calendar, MapPin, Clock, ExternalLink, Search, Sparkles, Filter, Building2, Tag, ChevronRight, X, ArrowUpRight, Eye } from 'lucide-react';
import MainHeader from './MainHeader';
import SubPanelFooter from './SubPanelFooter';
import useAppStore from '../store/useAppStore';

export default function EventsPage({ setView, currentUser, userRole, setSelectedUserId }) {
  const [filter, setFilter] = useState('Tümü');
  const [search, setSearch] = useState('');
  const [selectedEventModal, setSelectedEventModal] = useState(null);

  // Store'dan çekilen otomasyon verileri
  const storeEvents = useAppStore((state) => state.events) || [];

  // Resmî ve Zenginleştirilmiş Her Kategoriden En Az 5 Özgün Etkinlik Kataloğu
  const OFFICIAL_REAL_EVENTS = [
    // 🎨 KÜLTÜR & SANAT (5 Etkinlik)
    {
      id: 'EVT-KS-01',
      title: 'İESÜ Geleneksel Bahar Şenliği 2026',
      category: 'Kültür & Sanat',
      speaker: 'İESÜ Öğrenci Dekanlığı & Öğrenci Kulüpleri',
      date: '26 Mayıs 2026',
      time: '12:00 - 21:00',
      location: 'Avcılar Yerleşkesi Açık Hava Etkinlik Alanı',
      imageUrl: 'https://www.esenyurt.edu.tr/uploads/2026/05/wuyeismnf35tr-bahar-senligi.jpg',
      url: 'https://www.esenyurt.edu.tr/etkinlik/1648-iesu-bahar-senligi-26’-basliyor',
      desc: 'Kampüs genelinde müzik dinletileri, halk oyunları gösterileri, öğrenci kulüp stantları ve bahar konserleri.',
      content: `İstanbul Esenyurt Üniversitesi Öğrenci Dekanlığı ve Öğrenci Kulüpleri Koordinatörlüğü iş birliğiyle düzenlenen **İESÜ Geleneksel Bahar Şenliği**, tüm öğrencilerimizin ve mensuplarımızın katılımıyla gerçekleşiyor!\n\n📌 **Etkinlik Akışı:**\n• 12:00 - 14:00: Kulüp Stant Açılışları & Yarışmalar\n• 14:00 - 17:00: Müzik ve Dans Kulübü Sahne Performansları\n• 17:30 - 19:00: Spor Turnuvaları Ödül Töreni\n• 19:30 - 21:00: Kapanış Konseri ve Açık Hava Sineması`
    },
    {
      id: 'EVT-KS-02',
      title: 'Tiyatro Kulübü Oyuncuları: "Bir Şehnaz Oyun" Sahneleniyor',
      category: 'Kültür & Sanat',
      speaker: 'İESÜ Tiyatro Kulübü Öğrencileri',
      date: '14 Nisan 2026',
      time: '15:00 - 17:00',
      location: 'J Blok Konferans Salonu',
      imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/ogrenci-kulupleri',
      desc: 'Turgut Özakman’ın ölümsüz eseri "Bir Şehnaz Oyun", İESÜ Tiyatro Kulübü öğrencileri tarafından sergileniyor.',
      content: `Üniversitemiz Tiyatro Kulübü tarafından hazırlanan **"Bir Şehnaz Oyun"** tiyatro gösterisi tiyatrosever öğrencilerimizle buluşuyor.\n\nEsenyurt yerleşkesi J Blok konferans salonunda ücretsiz olarak sahnelenecek oyuna tüm akademik personel ve öğrencilerimiz davetlidir.`
    },
    {
      id: 'EVT-KS-03',
      title: 'Radyo, TV ve Sinema Bölümü Kısa Film Festivali Gösterimi',
      category: 'Kültür & Sanat',
      speaker: 'Sanat ve Sosyal Bilimler Fakültesi',
      date: '08 Mayıs 2026',
      time: '13:30 - 16:30',
      location: 'Sinema ve Kurgu Stüdyoları',
      imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/bolum/radyo-tv-sinema',
      desc: 'RTS Bölümü öğrencilerinin yıl boyunca çektiği kısa film, belgesel ve kurgu projelerinin gala gösterimi ve jüri değerlendirmesi.',
      content: `Sanat ve Sosyal Bilimler Fakültesi Radyo, Televizyon ve Sinema Bölümü bitirme projeleri ve yarışma filmleri gala gösteriminde izleyici karşısına çıkıyor. Gösterim sonrası yönetmen öğrencilerimizle söyleşi yapılacaktır.`
    },
    {
      id: 'EVT-KS-04',
      title: 'Fotoğrafçılık Kulübü: "Kampüste Yaşam" Karma Fotoğraf Sergisi',
      category: 'Kültür & Sanat',
      speaker: 'İESÜ Fotoğrafçılık ve Sanat Kulübü',
      date: '22 Nisan 2026',
      time: '10:00 - 17:00',
      location: 'Merkez Kampüs Fuaye Alanı',
      imageUrl: 'https://images.unsplash.com/photo-1552168324-d612d77725e3?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/ogrenci-kulupleri',
      desc: 'Öğrencilerimizin kadrajından kampüs yaşamı, mimari detaylar ve öğrenci portrelerinin sergilendiği açık sergi.',
      content: `İESÜ Fotoğrafçılık Kulübü üyelerinin dönem boyunca çektiği en başarılı fotoğraflar Merkez Kampüs Fuaye Alanı'nda hafta boyunca sergilenecektir.`
    },
    {
      id: 'EVT-KS-05',
      title: 'Klasik Türk Müziği ve Halk Oyunları Topluluğu Konseri',
      category: 'Kültür & Sanat',
      speaker: 'Müzik ve Halk Dansları Topluluğu',
      date: '10 Haziran 2026',
      time: '18:00 - 20:00',
      location: 'Şehit Ömer Halisdemir Konferans Salonu',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/etkinlikler',
      desc: 'Farklı yörelerin halk dansları ve Türk Sanat Müziği korosu tarafından icra edilecek unutulmaz müzik ziyafeti.',
      content: `Öğrencilerimizin ve eğitmenlerimizin ortaklaşa hazırladığı dönem sonu müzik ve halk dansları gösterisi Şehit Ömer Halisdemir Konferans Salonu'nda icra edilecektir.`
    },

    // 🚀 TEKNOLOJİ & BİLİM (5 Etkinlik)
    {
      id: 'EVT-TB-01',
      title: 'Bilim Kafe: Geleceği Şekillendiren Teknolojiler ve Dijital Dönüşüm',
      category: 'Teknoloji & Bilim',
      speaker: 'Bilgisayar Mühendisliği & TTO Akademisyenleri',
      date: '27 Temmuz 2026',
      time: '14:00 - 16:30',
      location: 'Bilim Kafe / Merkez Kampüs',
      imageUrl: 'https://www.esenyurt.edu.tr/uploads/2026/07/ylg08xu5dynap-gelecegin-dunyasini-sekillendiren-teknolojiler-ve-dijital-donusum-bilim-kafe’de-konusuluyor.jfif',
      url: 'https://www.esenyurt.edu.tr/etkinlik/1724-gelecegin-dunyasini-sekillendiren-teknolojiler-ve-dijital-donusum-bilim-kafe’de-konusuluyor',
      desc: 'Yapay zeka, nesnelerin interneti (IoT), büyük veri ve siber güvenlik odaklı dijital dönüşüm söyleşisi.',
      content: `İstanbul Esenyurt Üniversitesi **Bilim Kafe Etkinlik Dizisi** kapsamında; mühendislik akademisyenlerimiz ve teknoloji sektörü yöneticileri öğrencilerimizle buluşuyor!\n\n💡 **Tartışılacak Konular:** Generative AI, Endüstri 4.0, Siber Savunma ve Veri Gizliliği.`
    },
    {
      id: 'EVT-TB-02',
      title: 'Siber Güvenlik ve Etik Hackerlık (Ethical Hacking) Atölyesi',
      category: 'Teknoloji & Bilim',
      speaker: 'Bilişim Teknolojileri MYO & Siber Güvenlik Uzmanları',
      date: '11 Mart 2026',
      time: '10:00 - 14:00',
      location: 'Bilgisayar Laboratuvarı LAB-3',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/yuksekokul/meslek-yuksekokulu',
      desc: 'Ağ güvenliği, sızma testleri (Penetration Testing) ve veri koruma teknikleri üzerine uygulamalı bilgisayar atölyesi.',
      content: `Bilişim Teknolojileri MYO tarafından organize edilen uygulamalı **Siber Güvenlik ve Sızma Testi Atölyesi** LAB-3 ortamında gerçekleştirilecektir. Katılımcılara temel siber savunma teknikleri gösterilecektir.`
    },
    {
      id: 'EVT-TB-03',
      title: 'Veri Bilimi Uygulamaları Zirvesi',
      category: 'Teknoloji & Bilim',
      speaker: 'Mühendislik ve Mimarlık Fakültesi',
      date: '19 Şubat 2026',
      time: '09:30 - 16:00',
      location: 'Konferans Salonu B-1',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/fakulte/muhendislik-ve-mimarlik-fakultesi',
      desc: 'Python, Makine Öğrenmesi (Machine Learning) ve Derin Öğrenme algoritmalarının endüstriyel vakaları.',
      content: `Yazılım ve Bilgisayar Mühendisliği bölümlerimiz öncülüğünde düzenlenen **Veri Bilimi Zirvesi** kapsamında veri analitiği projeleri ve makine öğrenmesi uygulamaları anlatılacaktır.`
    },
    {
      id: 'EVT-TB-04',
      title: 'Mobil Uygulama Geliştirme Hackathonu: Flutter & React Native',
      category: 'Teknoloji & Bilim',
      speaker: 'Yazılım Kulüpleri & İESÜMER Kuluçka',
      date: '04 Nisan 2026',
      time: '09:00 - 18:00',
      location: 'İESÜMER Kuluçka Merkez Alanı',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/icerik/iesumer-kulucka',
      desc: '24 saatlik kesintisiz mobil kodlama maratonu. Dereceye giren öğrenci ekiplerine Kuluçka Merkezi ofis desteği.',
      content: `İESÜMER Kuluçka Merkezi ev sahipliğinde gerçekleşecek mobil hackathon maratonunda öğrencilerimiz toplumsal fayda sağlayan mobil yazılımlar geliştireceklerdir.`
    },
    {
      id: 'EVT-TB-05',
      title: 'Bulut Bilişim (Cloud Computing) ve AWS / Azure Eğitimi',
      category: 'Teknoloji & Bilim',
      speaker: 'BİDB & Bulut Mimarisi Uzmanları',
      date: '15 Mayıs 2026',
      time: '14:00 - 17:00',
      location: 'Online Webinar & Lab-1',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
      url: 'https://bidb.esenyurt.edu.tr',
      desc: 'Amazon Web Services (AWS) ve Microsoft Azure sunucu mimarileri üzerine teknik sertifikasyon eğitimi.',
      content: `BİDB Bilişim Daire Başkanlığı desteğiyle düzenlenen bulut mimarisi seminerinde öğrencilerimize ücretsiz bulut sunucu kredisi tanıtılacaktır.`
    },

    // 📖 AKADEMİK (5 Etkinlik)
    {
      id: 'EVT-AK-01',
      title: 'III. Ulusal Yönetim Bilimleri Sempozyumu',
      category: 'Akademik',
      speaker: 'İşletme ve Yönetim Bilimleri Fakültesi Dekanlığı',
      date: '26 Kasım 2026',
      time: '10:00 - 17:00',
      location: 'J Blok Mehmet Akif Ersoy Konferans Salonu',
      imageUrl: 'https://www.esenyurt.edu.tr/uploads/2026/07/oh0lm0qvjbwgc-iii-yonetim-bilimleri-sempozyumu.jfif',
      url: 'https://www.esenyurt.edu.tr/etkinlik/1720-iii-yonetim-bilimleri-sempozyumu',
      desc: 'Sürdürülebilir finans, dijital pazarlama, yeşil lojistik ve stratejik yönetim temalarında ulusal bildiri sunumları.',
      content: `İşletme ve Yönetim Bilimleri Fakültesi tarafından üçüncüsü düzenlenen **III. Yönetim Bilimleri Sempozyumu** kapsamında kabul edilen bildiriler ISBN'li bildiri kitabında basılacaktır.`
    },
    {
      id: 'EVT-AK-02',
      title: 'I. Uluslararası Kriminoloji ve Adli Bilimler Sempozyumu',
      category: 'Akademik',
      speaker: 'Rektörlük Makamı & Sosyal Bilimler Araştırma Merkezi',
      date: '14 Kasım 2026',
      time: '09:30 - 17:30',
      location: 'Merkez Kampüs Konferans Hall',
      imageUrl: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/haberler',
      desc: 'Suç sosyolojisi, adli bilimler, ceza hukuku ve siber suçlar üzerine disiplinlerarası bilimsel oturumlar.',
      content: `Uluslararası kriminoloji uzmanlarının katılımıyla gerçekleştirilecek sempozyumda adli adalet ve toplum güvenliği bilimsel boyutuyla incelenecektir.`
    },
    {
      id: 'EVT-AK-03',
      title: 'Sağlık Bilimlerinde Multidisipliner Yaklaşımlar Kongresi',
      category: 'Akademik',
      speaker: 'Sağlık Bilimleri Fakültesi & SHMYO',
      date: '18 Aralık 2026',
      time: '10:00 - 16:30',
      location: 'Sağlık Kompleksi Amfisi',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/fakulte/saglik-bilimleri-fakultesi',
      desc: 'Hemşirelik, beslenme, fizyoterapi ve çocuk gelişimi alanlarındaki yeni araştırmalar ve klinik çalışmalar.',
      content: `Sağlık Bilimleri Fakültemiz ve Sağlık Hizmetleri MYO akademisyenlerinin güncel tedavi ve bakım süreçlerine ilişkin araştırmaları sunulacaktır.`
    },
    {
      id: 'EVT-AK-04',
      title: 'ICEBM 2026: Uluslararası Ekonomi, İşletme ve Yönetim Konferansı',
      category: 'Akademik',
      speaker: 'İESÜ Lisansüstü Eğitim Enstitüsü & Paydaş Üniversiteler',
      date: '24 Eylül 2026',
      time: '09:00 - 18:00',
      location: 'Hibrit / Konferans Salonu A',
      imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/enstitu/lisansustu-egitim-enstitusu',
      desc: 'Küresel finans, makroekonomi ve uluslararası pazarlama makalelerinin hakemli sunumu.',
      content: `Lisansüstü Eğitim Enstitümüzün uluslararası ortaklığıyla düzenlenen ICEBM konferansı akademisyenlerimizin tebliğleriyle gerçekleşecektir.`
    },
    {
      id: 'EVT-AK-05',
      title: 'TÜBİTAK 2209-A & 2209-B Proje Yazma Akademik Çalıştayı',
      category: 'Akademik',
      speaker: 'Teknoloji Transfer Ofisi (TTO) Araştırma Ekibi',
      date: '03 Mart 2026',
      time: '13:00 - 16:00',
      location: 'TTO Proje Atölyesi',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/icerik/tto-teknoloji-transfer',
      desc: 'Lisans ve önlisans öğrencilerimize yönelik TÜBİTAK araştırma projeleri hazırlama rehberliği.',
      content: `TTO koordinatörlüğünde düzenlenen çalıştayda proje yöntemi, bütçeleme ve başvuru formlarının doldurulması uygulamalı öğretilecektir.`
    },

    // 🛠️ TEKNOLOJİ & PROJE (5 Etkinlik)
    {
      id: 'EVT-TP-01',
      title: 'İstanbul Esenyurt Üniversitesi’nde TEKNOFEST 2026 Yolculuğu',
      category: 'Teknoloji & Proje',
      speaker: 'Teknoloji Transfer Ofisi (TTO) & Mühendislik Fakültesi',
      date: '15 Mayıs 2026',
      time: '11:00 - 15:00',
      location: 'Ar-Ge ve İnovasyon Laboratuvarları Kompleksi',
      imageUrl: 'https://www.esenyurt.edu.tr/uploads/2026/05/qwap0drtzge6m-teknofest.jpg',
      url: 'https://www.esenyurt.edu.tr/haber/1864-istanbul-esenyurt-universitesi’nde-teknofest-yolculugu-basladi',
      desc: 'TEKNOFEST yarışmalarına katılacak takım projelerinin tanıtımı, mentörlük desteği ve lab imkanları.',
      content: `TEKNOFEST yarışmalarında üniversitemizi temsil edecek İHA, İKA, roket ve yazılım takımlarımıza prototip geliştirme bütçesi ve lab desteği açıklanmaktadır.`
    },
    {
      id: 'EVT-TP-02',
      title: 'AKBANK Gençlik Akademisi - UPgrade Your Career with AI Workshop',
      category: 'Teknoloji & Proje',
      speaker: 'AKBANK Gençlik Akademisi & İESÜ Kariyer Ofisi',
      date: '18 Mart 2026',
      time: '10:30 - 15:30',
      location: 'İESÜ Merkez Kampüs Konferans Salonu',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu',
      desc: 'İstem mühendisliği (Prompt Engineering) ve projelerde üretken yapay zeka araçları atölyesi.',
      content: `Akbank Gençlik Akademisi ve Kariyer Ofisi iş birliğiyle düzenlenen uygulamalı yapay zeka çalıştayında katılımcılara sertifika verilecektir.`
    },
    {
      id: 'EVT-TP-03',
      title: 'Otonom Araçlar ve İHA (İnsansız Hava Aracı) Prototip Sergisi',
      category: 'Teknoloji & Proje',
      speaker: 'Elektrik-Elektronik & Mekatronik Takımları',
      date: '28 Mayıs 2026',
      time: '13:00 - 16:30',
      location: 'Mühendislik Laboratuvarları Bahçesi',
      imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/bolum/elektrik-elektronik-muhendisligi',
      desc: 'Mühendislik öğrencilerimizin tasarladığı otonom robotlar, drone prototipleri ve faydalı yük mekanizmaları.',
      content: `Öğrenci proje takımlarımızın ürettiği İHA ve robotik sistemler açık alanda uçuş ve sürüş testleriyle sergilenecektir.`
    },
    {
      id: 'EVT-TP-04',
      title: '3D Yazıcı ve Eklemeli İmalat Teknolojileri Atölyesi',
      category: 'Teknoloji & Proje',
      speaker: 'Endüstri Mühendisliği & TTO',
      date: '10 Şubat 2026',
      time: '14:00 - 16:00',
      location: 'Hızlı Prototipleme Laboratuvarı',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/bolum/endustri-muhendisligi',
      desc: 'CAD çizimlerinin 3B yazıcılarda katmanlı imalatı ve malzeme mukavemet testleri uygulaması.',
      content: `Hızlı Prototipleme Laboratuvarında gerçekleşecek atölyede SolidWorks çizimlerinin 3B basım süreçleri gösterilecektir.`
    },
    {
      id: 'EVT-TP-05',
      title: 'Biyomedikal Cihaz Tasarım Sunumları',
      category: 'Teknoloji & Proje',
      speaker: 'Sağlık ve Mühendislik Ortak Proje Grubu',
      date: '16 Haziran 2026',
      time: '11:00 - 14:30',
      location: 'Biyomedikal Araştırma Lab',
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/icerik/arge-proje-yonetimi',
      desc: 'EKG, pulse oksimetre ve hasta takip cihazlarının sensör devresi ve mobil entegrasyon projesi.',
      content: `Biyomedikal mühendislik ve sağlık bilimleri disiplinlerarası çalışma grubunun geliştirdiği prototip cihaz tanıtımları.`
    },

    // 🏆 AKADEMİK BAŞARI (5 Etkinlik)
    {
      id: 'EVT-AB-01',
      title: 'Üniversitemizde Bilim Rüzgârı: Akademik Başarı Ödülleri Töreni',
      category: 'Akademik Başarı',
      speaker: 'Rektörlük Makamı & Mütevelli Heyeti',
      date: '20 Mayıs 2026',
      time: '14:00 - 16:00',
      location: 'Mehmet Akif Ersoy Konferans Salonu',
      imageUrl: 'https://www.esenyurt.edu.tr/uploads/2026/05/257y8y0atcmgq-odul-toreni.jpg',
      url: 'https://www.esenyurt.edu.tr/haber/1880-universitemizde-bilim-ruzgâri-akademik-basari-odulleri-sahiplerini-buldu',
      desc: 'Uluslararası Scopus yayını, TÜBİTAK projesi ve patent başarısı gösteren akademisyenlerimize ödül töreni.',
      content: `YÖK 2025 raporunda öne çıkan açık erişimli yayın ve uluslararasılaşma başarılarına katkı sağlayan öğretim üyelerimize başarı plaketleri takdim edilecektir.`
    },
    {
      id: 'EVT-AB-02',
      title: '2025-2026 Akademik Yılı Mezuniyet Töreni Coşkusu',
      category: 'Akademik Başarı',
      speaker: 'Rektörlük, Dekanlıklar ve Mezunlar',
      date: '20 Haziran 2026',
      time: '16:00 - 20:00',
      location: 'Esenyurt Kompleksi Spor ve Kongre Merkezi',
      imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/haberler',
      desc: 'Fakülte ve yüksekokul birincilerimizin kep atma heyecanı ve dereceye giren öğrencilerimize başarı belgeleri.',
      content: `Mezuniyet töreninde dereceye giren lisans ve önlisans öğrencilerimize hediye ve plaketleri Rektörlük Makamı tarafından takdim olunacaktır.`
    },
    {
      id: 'EVT-AB-03',
      title: 'ÜNİLİG Wushu Şampiyonası Altın Madalya Kutlama Etkinliği',
      category: 'Akademik Başarı',
      speaker: 'SKS Daire Başkanlığı & Spor Birimi',
      date: '22 Ocak 2026',
      time: '14:00 - 15:30',
      location: 'Kapalı Spor Tesisleri',
      imageUrl: 'https://www.esenyurt.edu.tr/uploads/2026/01/i3o6f0hqu7iwb-unilig.png',
      url: 'https://www.esenyurt.edu.tr/haber/1715-universitemiz-unilig-wushu-sampiyonasi’ndan-altin-ve-bronz-madalya-ile-dondu',
      desc: 'Üniversiteler Spor Ligi Wushu Şampiyonası’nda altın ve bronz madalya kazanan milli sporcu öğrencilerimizin tebrik töreni.',
      content: `ÜNİLİG yarışmalarında dereceye girerek üniversitemizi gururlandıran sporcularımıza SKS Daire Başkanlığınca tebrik belgesi sunulacaktır.`
    },
    {
      id: 'EVT-AB-04',
      title: 'YÖK 2025 Raporu Açık Erişim Yayın Başarısı Basın Toplantısı',
      category: 'Akademik Başarı',
      speaker: 'Kalite Koordinatörlüğü & Kütüphane Daire Bşk.',
      date: '05 Ocak 2026',
      time: '11:00 - 12:30',
      location: 'Aziz Sancar Kütüphanesi Toplantı Salonu',
      imageUrl: 'https://www.esenyurt.edu.tr/uploads/2025/12/pjhehwxvm6o1u-yok-universite-izleme-ve-degerlendirme-genel-raporu-2025’te-onemli-basari.jpg',
      url: 'https://www.esenyurt.edu.tr/haber/1669-yok-universite-izleme-ve-degerlendirme-genel-raporu-2025’te-onemli-basari',
      desc: 'YÖK Üniversite İzleme ve Değerlendirme Raporu’nda açık erişim yayında 8., uluslararası öğrenci oranında 3. sıra başarısı.',
      content: `Üniversitemizin kalite göstergelerindeki yükselişi ve uluslararası indekslerdeki dereceleri kütüphane fuayesinde sunulacaktır.`
    },
    {
      id: 'EVT-AB-05',
      title: 'Uluslararası Akreditasyon (AQAS/AHPGS) Teşekkür Töreni',
      category: 'Akademik Başarı',
      speaker: 'Kalite Koordinatörlüğü & Bölüm Başkanları',
      date: '12 Nisan 2026',
      time: '15:00 - 16:30',
      location: 'Senato Odası',
      imageUrl: 'https://www.esenyurt.edu.tr/uploads/2026/04/z6zk51zk7l2gc-.jpg',
      url: 'https://www.esenyurt.edu.tr/icerik/3748-kalite-koordinatorlugu',
      desc: 'Akredite program sayısını 12’ye, başvuru süreciyle 31’e çıkaran akademik bölümlerimize sertifika takdimi.',
      content: `Uluslararası akreditasyon başarılarında emeği geçen fakülte akreditasyon komisyonu üyelerine katılım belgeleri sunulacaktır.`
    },

    // 🏛️ SOSYAL & KURUMSAL (5 Etkinlik)
    {
      id: 'EVT-SK-01',
      title: '15 Temmuz Milli İrade Paneli ve Anma Programı',
      category: 'Sosyal & Kurumsal',
      speaker: 'İESÜ Akademik Kadrosu & İdari Birimler',
      date: '14 Temmuz 2026',
      time: '11:00 - 13:00',
      location: 'Ana Konferans Salonu',
      imageUrl: 'https://www.esenyurt.edu.tr/uploads/2026/07/7ebbksmzr926z-15-temmuz-milli-irade-paneline-davetlisiniz.jpg',
      url: 'https://www.esenyurt.edu.tr/etkinlik/1714-15-temmuz-milli-irade-paneline-davetlisiniz',
      desc: '15 Temmuz Demokrasi ve Milli Birlik Günü anma ve değerlendirme akademik paneli.',
      content: `15 Temmuz Demokrasi ve Milli Birlik Günü vesilesiyle düzenlenen akademik panelde milli irade, anayasal düzen ve toplumsal dayanışma sunumları icra olunacaktır.`
    },
    {
      id: 'EVT-SK-02',
      title: '15. İstanbul Üniversite Tercih Fuarı İESÜ Standı',
      category: 'Sosyal & Kurumsal',
      speaker: 'Aday Öğrenci Danışma Merkezi & İletişim Daire Bşk.',
      date: '24 - 26 Temmuz 2026',
      time: '10:00 - 18:00',
      location: 'İstanbul Kongre Merkezi (Harbiye)',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60',
      url: 'https://aday.esenyurt.edu.tr/',
      desc: 'Üniversite adayları için fakültelerimizin, burs olanaklarımızın ve tercih danışmanlığının sunulduğu dev fuar.',
      content: `Harbiye İstanbul Kongre Merkezi'nde aday öğrencilere fakültelerimiz, kontenjanlarımız ve tercih indirimlerimiz birebir anlatılacaktır.`
    },
    {
      id: 'EVT-SK-03',
      title: 'Dünya Kadınlar Günü Paneli ve Fotoğraf Sergisi',
      category: 'Sosyal & Kurumsal',
      speaker: 'Kadın ve Aile Çalışmaları Araştırma Merkezi',
      date: '08 Mart 2026',
      time: '13:30 - 16:00',
      location: 'Konferans Salonu A',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/haberler',
      desc: 'Kadının akademideki ve iş dünyasındaki yeri, girişimci kadınlar paneli ve çiçek takdimi.',
      content: `8 Mart Dünya Kadınlar Günü vesilesiyle kadın akademisyen ve çalışanlarımızın katılımıyla söyleşi ve fuaye sergisi gerçekleştirilecektir.`
    },
    {
      id: 'EVT-SK-04',
      title: 'Kan Bağışı Hayat Kurtarır: İESÜ & Kızılay Ortak Kampanyası',
      category: 'Sosyal & Kurumsal',
      speaker: 'Genç Yeşilay Kulübü & Türk Kızılayı',
      date: '17 Kasım 2026',
      time: '10:00 - 17:00',
      location: 'Merkez Kampüs Meydanı',
      imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/sks/saglik-hizmetleri',
      desc: 'Türk Kızılayı kan bağışı tırı kampüsümüzde. Öğrencilerimiz ve personelimiz için sosyal sorumluluk desteği.',
      content: `Genç Yeşilay Kulübümüz öncülüğünde Türk Kızılayı ile birlikte organize edilen kan ve kök hücre bağışı organizasyonu kampüs meydanında sürecektir.`
    },
    {
      id: 'EVT-SK-05',
      title: '24 Kasım Öğretmenler Günü Akademik Buluşma ve Plaket Töreni',
      category: 'Sosyal & Kurumsal',
      speaker: 'Rektörlük Makamı',
      date: '24 Kasım 2026',
      time: '10:30 - 13:00',
      location: 'Akademik Yemekhane & Konferans Salonu',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=60',
      url: 'https://www.esenyurt.edu.tr/haberler',
      desc: 'Öğretmenler Günü vesilesiyle akademisyenlerimize kahvaltı organizasyonu ve kıdem plaketleri sunumu.',
      content: `Rektörlük makamı ev sahipliğinde üniversitemizde 10. yılını dolduran değerli akademisyenlerimize hizmet plaketleri takdim olunacaktır.`
    }
  ];

  // Başlık (Title) Bazlı Çift Kayıt Temizliği (Önce Resmi Katalog, Sonra Store)
  const ALL_EVENTS = [];
  const seenTitles = new Set();

  // 1. Önce Resmî ve Eksiksiz Kataloğu Ekle
  OFFICIAL_REAL_EVENTS.forEach(evt => {
    const key = (evt.title || '').toLowerCase().replace(/[^a-z0-9ğüşıöç]/gi, '').slice(0, 20);
    if (key && !seenTitles.has(key)) {
      seenTitles.add(key);
      ALL_EVENTS.push(evt);
    }
  });

  // 2. Ardından Çekilen Diğer Farklı Etkinlikleri Ekle
  if (storeEvents && storeEvents.length > 0) {
    storeEvents.forEach(e => {
      const key = (e.title || '').toLowerCase().replace(/[^a-z0-9ğüşıöç]/gi, '').slice(0, 20);
      if (key && !seenTitles.has(key)) {
        seenTitles.add(key);
        ALL_EVENTS.push({
          id: e.id || `evt_${Math.random()}`,
          title: e.title || 'Resmî Üniversite Etkinliği',
          category: e.category || 'Resmî Etkinlik',
          speaker: e.speaker || 'İstanbul Esenyurt Üniversitesi Birimleri',
          date: e.date || 'Resmî Yayın Tarihi',
          time: e.time || 'Etkinlik Saatinde',
          location: e.location || 'Üniversite Yerleşkesi / Konferans Salonu',
          imageUrl: e.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
          url: e.url || 'https://www.esenyurt.edu.tr/etkinlikler',
          desc: e.description || `${e.title} - İstanbul Esenyurt Üniversitesi resmi yayını.`,
          content: e.content || e.description || `${e.title}\n\nDetaylı resmi açıklama için web sitesini ziyaret edebilirsiniz.`
        });
      }
    });
  }

  const CATEGORIES = ['Tümü', 'Kültür & Sanat', 'Teknoloji & Bilim', 'Akademik', 'Teknoloji & Proje', 'Akademik Başarı', 'Sosyal & Kurumsal'];

  const filteredEvents = ALL_EVENTS.filter(evt => {
    let matchesCat = filter === 'Tümü';
    if (!matchesCat) {
      const evtCat = (evt.category || '').toLowerCase();
      const targetCat = filter.toLowerCase();
      matchesCat = evtCat.includes(targetCat) || targetCat.includes(evtCat) || 
                 (targetCat.includes('kültür') && (evtCat.includes('kültür') || evtCat.includes('sanat') || evtCat.includes('tiyatro'))) ||
                 (targetCat.includes('bilim') && (evtCat.includes('bilim') || evtCat.includes('teknoloji') || evtCat.includes('veri'))) ||
                 (targetCat.includes('akademik') && (evtCat.includes('akademik') || evtCat.includes('sempozyum') || evtCat.includes('kongre'))) ||
                 (targetCat.includes('proje') && (evtCat.includes('proje') || evtCat.includes('teknofest') || evtCat.includes('atölye'))) ||
                 (targetCat.includes('başarı') && (evtCat.includes('başarı') || evtCat.includes('ödül') || evtCat.includes('mezuniyet'))) ||
                 (targetCat.includes('sosyal') && (evtCat.includes('sosyal') || evtCat.includes('kurumsal') || evtCat.includes('panel') || evtCat.includes('fuar')));
    }
    const matchesSearch = (evt.title || '').toLowerCase().includes(search.toLowerCase()) || 
                          (evt.location || '').toLowerCase().includes(search.toLowerCase()) ||
                          (evt.desc || '').toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <MainHeader setView={setView} currentUser={currentUser} userRole={userRole} />

      <main className="flex-1 w-full max-w-[1250px] mx-auto p-4 lg:p-8 flex flex-col gap-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-[#800000] to-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl border border-red-900 relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-950/70 px-4 py-1.5 rounded-full border border-amber-500/40 inline-block mb-3">
              İSTANBUL ESENYURT ÜNİVERSİTESİ
            </span>
            <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight leading-tight">
              Etkinliklerimiz & Zirve Portalı
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed font-medium">
              Üniversitemizde düzenlenen tüm resmî paneller, bilimsel sempozyumlar, TEKNOFEST buluşmaları ve kültür-sanat festivallerini detaylarıyla takip edebilirsiniz.
            </p>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          {/* Search Input */}
          <div className="w-full md:w-80 bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-2.5">
            <Search size={18} className="text-slate-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Etkinlik veya salon ara..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none w-full"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                  filter === cat 
                    ? 'bg-gradient-to-r from-[#990000] to-[#800000] text-white shadow-md' 
                    : 'bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-[#990000] border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Real Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <div 
              key={evt.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Event Photo */}
                <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                  <img 
                    src={evt.imageUrl} 
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 bg-[#990000] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {evt.category}
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-[11px] font-bold text-[#990000] mb-2">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {evt.date}</span>
                    {evt.time && <span className="flex items-center gap-1"><Clock size={14} /> {evt.time}</span>}
                  </div>

                  <h3 className="text-base font-black text-slate-900 mb-2 leading-snug group-hover:text-[#990000] transition-colors line-clamp-2">
                    {evt.title}
                  </h3>

                  <p className="text-xs font-medium text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {evt.desc}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-[#990000] shrink-0" />
                      <span className="truncate">{evt.speaker}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#990000] shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button: Directly opens complete content drawer */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedEventModal(evt)}
                  className="w-full py-3 bg-[#990000] hover:bg-red-800 text-white font-black rounded-xl text-xs transition shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye size={15} /> Etkinlik Detaylarını Gör
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl text-slate-800 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedEventModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X size={20} />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#990000] bg-red-50 px-3 py-1 rounded-full border border-red-100 inline-block mb-2">
                {selectedEventModal.category}
              </span>
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                {selectedEventModal.title}
              </h3>
            </div>

            {selectedEventModal.imageUrl && (
              <div className="h-56 w-full rounded-2xl overflow-hidden mb-5">
                <img src={selectedEventModal.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-5 text-xs font-bold bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-black">Tarih / Saat</span>
                <span className="text-[#990000]">{selectedEventModal.date} - {selectedEventModal.time}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-black">Konum / Salon</span>
                <span className="text-slate-800">{selectedEventModal.location}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Etkinlik Açıklaması & Program Detayı:</h4>
              <p className="text-xs font-medium text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedEventModal.desc}
              </p>
              {selectedEventModal.content && (
                <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-line pt-2 border-t border-slate-100">
                  {selectedEventModal.content}
                </p>
              )}
            </div>

            <button
              onClick={() => setSelectedEventModal(null)}
              className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-black rounded-2xl text-xs uppercase tracking-widest transition shadow-md cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      <SubPanelFooter setView={setView} />
    </div>
  );
}
