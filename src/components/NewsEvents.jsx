import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, FileText, ExternalLink, Bell, Newspaper, Image as ImageIcon, MapPin, Clock, ChevronRight, ArrowRight, Download } from 'lucide-react';

export const contentData = {
  haberler: [
    {
      title: "Gençlik ve Spor Bakanlığı Tarafından Geliştirilen e-Rehberlik Sistemi Açıldı!",
      date: "09/07/2026",
      category: "Haber",
      description: "Gençlik ve Spor Bakanlığı tarafından geliştirilen e-Rehberlik Sistemi erişime açıldı! e-Rehberlik sistemi, kişiye uyarlanmış özel testler yoluyla, gençlerin; kişilik özelliklerini, ilgilerini, degerlerini, yeteneklerini ve becerilerini değerlendirerek kariyer ve mesleki gelişim süreçlerini desteklemek üzere tasarlanan çevrimiçi bir rehberlik sistemidir. 15-29 yaş aralığında yer alan gençler tarafından ücretsiz ve çevrimiçi olarak kullanılabilmektedir.",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/hi9d2cque1ep7-21.png",
      attachments: []
    },
    {
      title: "İstanbul Esenyurt Üniversitesi 2025–2026 Akademik Yılı Mezuniyet Töreni Büyük Bir Coşku ve Yoğun Katılımla Gerçekleşti !",
      date: "09/07/2026",
      category: "Akademik",
      description: "Yaklaşık 5 Bin Kişinin Katıldığı Törende Mezunlarımız Diplomalarını Alarak Geleceğe Uğurlandı. İstanbul Esenyurt Üniversitesi 2025–2026 Akademik Yılı Mezuniyet Töreni, 28 Haziran 2026 tarihinde Yahya Kemal Beyatlı Gösteri Merkezi'nde yaklaşık 5.000 kişinin katılımıyla büyük bir coşku ve gurur içerisinde gerçekleştirildi.",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/x88y5jc78wekt--20.jpg",
      attachments: []
    },
    {
      title: "Babalar gününüz kutlu olsun!",
      date: "09/07/2026",
      category: "Genel",
      description: "Tüm babalarımızın ve baba adaylarımızın Babalar Günü'nü en içten dileklerimizle kutlarız.",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/u0op1wb1gl5fd-19.png",
      attachments: []
    },
    {
      title: "Rektörümüzden mesaj var.",
      date: "09/07/2026",
      category: "Duyuru",
      description: "Sevgili Öğrenciler, BÜTÜNLEME SINAVI'NDA hepinize başarılar ve zihin açıklığı dilerim. Prof. Dr. Süleyman ÖZDEMİR Rektör",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/c24kzimehbxkp-18.png",
      attachments: []
    },
    {
      title: "Kuruluşumuzun 14. Yıl Dönümünü Büyük Bir Gururla Kutladık!",
      date: "09/07/2026",
      category: "Haber",
      description: "18 Haziran 2013 tarihinde kurulan Üniversitemiz, 14. kuruluş yıl dönümünü coşkulu bir törenle kutladı. Kutlama programı, Mütevelli Heyeti Başkanımız Orhan Özyurt, Rektörümüz Prof. Dr. Süleyman Özdemir, Dekanlarımız, Müdürlerimiz ile akademik ve idari kadromuzun yoğun katılımıyla gerçekleşti.",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/f4kpont66lo7m-17.png",
      attachments: []
    },
    {
      title: "Yükseköğretim Kurumları Sınavı'nda hepinize başarılar ve zihin açıklığı dilerim.",
      date: "09/07/2026",
      category: "Akademik",
      description: "Sevgili Gençler Yükseköğretim Kurumları Sınavı'nda hepinize başarılar ve zihin açıklığı dilerim. Prof. Dr. Süleyman ÖZDEMİR Rektör",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/lw1olwriqg45y--16.jpg",
      attachments: []
    }
  ],
  etkinlikler: [
    {
      title: "İESU BAHAR ŞENLİĞİ 26’ BAŞLIYOR",
      date: "11 MAYIS 2026",
      location: "İESU 2. Kat Teras Alanı",
      description: "11.00 – 19.00 Uluslararası Öğrenci Kültür Etkinlikleri, Renkli dans gösterileri, Çeşitli oyun ve eğlenceler, Yusuf Yusuf Show Stand-up Gösterisi",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/1hh79tp8rgliu-iesu-bahar-senligi-26’-basliyor.jpeg",
      registrationLink: null,
      attachments: []
    },
    {
      title: "Mezunlarımızla Söyleşi serisi başlıyor!",
      date: "15 HAZİRAN 2026",
      location: "İstanbul Esenyurt Üniversitesi",
      description: "Sektörde deneyim kazanan mezun iç mimarlarımızla bir araya gelerek profesyonel hayata dair merak edilenleri konuşuyoruz. Tüm öğrencilerimiz davetlidir.",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/x124bn4cr3rmz-mezunlarimizla-soylesi-serisi-basliyor.jpeg",
      registrationLink: null,
      attachments: []
    },
    {
      title: "Büyük bir emek ve özveriyle tamamladığınız üniversite hayatınızı gururla taçlandırma vakti geldi!",
      date: "28 HAZİRAN 2026",
      location: "Yahya Kemal Beyatlı Gösteri Merkezi",
      description: "Üniversitemiz 2025-2026 Akademik Yılı Mezuniyet Töreni, 28 Haziran 2026 Pazar günü coşkuyla gerçekleşecek. Geleceğe güvenle adım atan mezunlarımızın bu özel gününde bir arada olmayı diliyoruz.",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/x88y5jc78wekt--20.jpg",
      registrationLink: null,
      attachments: []
    }
  ],
  duyurular: [
    {
      title: "Gençlik ve Spor Bakanlığı Tarafından Geliştirilen e-Rehberlik Sistemi Açıldı!",
      date: "09/07/2026",
      tag: "Duyuru",
      description: "Gençlik ve Spor Bakanlığı tarafından geliştirilen e-Rehberlik Sistemi erişime açıldı! 15-29 yaş aralığında yer alan gençler tarafından ücretsiz ve çevrimiçi olarak kullanılabilmektedir.",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/hfvud8dreyy12-img_4720.jpg",
      attachments: []
    },
    {
      title: "Tek Ders / Not Yükseltme Sınav Programları Hk.",
      date: "09/07/2026",
      tag: "Akademik",
      description: "Bilişim Teknolojileri Meslek Yüksekokulu, Meslek Yüksekokulu, Sağlık Hizmetleri Meslek Yüksekokulu, Sanat ve Sosyal Bilimler Fakültesi, Ortak Dersler Bölümü Sınav Programları",
      attachments: [
        { title: "Bilişim Teknolojileri MYO Programı (PDF)", url: "https://www.esenyurt.edu.tr/uploads/2026/07/t1401vo9mwgr3-btmyo.pdf" },
        { title: "Ortak Dersler Bölümü Sınav Programı (PDF)", url: "https://www.esenyurt.edu.tr/uploads/2026/07/4f0tq996fqxrn-odb-tek-ders-sinav-programi.pdf" }
      ]
    },
    {
      title: "2025-2026 Yaz Okulu Başvuruları Başladı!",
      date: "24/06/2026",
      tag: "Önemli",
      description: "T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ 2025-2026 AKADEMİK YILI YAZ OKULU DUYURUSU. Üniversitemiz öğrencileri OBS kullanıcıları ile giriş yapıp “Yaz Okul Ön Başvuru” alanından talepte bulunacaklardır.",
      attachments: [
        { title: "Duyuru 2025-2026 Yaz Okulu (PDF)", url: "https://www.esenyurt.edu.tr/uploads/2026/06/z84w7ariwuek4-duyuru-2025-2026-yaz-okulu_23062026.pdf" }
      ]
    },
    {
      title: "2026-2027 Güz Dönemi Yüksek Lisans ve Doktora Başvuruları BAŞLADI!",
      date: "19/06/2026",
      tag: "Lisansüstü",
      description: "Kariyerinde Fark Yaratma Zamanı! İstanbul Esenyurt Üniversitesi’nde lisansüstü eğitim alarak akademik ve profesyonel hedeflerine bir adım daha yaklaş! Erken Başvuru Tarihleri: 15 Haziran - 3 Temmuz",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/kh7qrijo1itle--12.jpg",
      attachments: []
    }
  ]
};

export default function NewsEvents({ setView, category = 'haberler', news = [], announcements = [], events = [], currentUser, userRole }) {
  const [activeTab, setActiveTab] = useState(category);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setActiveTab(category);
      setIsAnimating(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [category]);

  const handleTabChange = (tab) => {
    if (tab === category) return;
    setView(tab);
  };

  const renderHaberler = () => (
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
      {(news || []).map((item, index) => {
        // First item is massive (Bento Grid Style)
        if (index === 0) {
          return (
            <div onClick={() => setSelectedItem(item)} key={index} className="md:col-span-8 group relative rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 min-h-[450px] cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent z-10 transition-opacity duration-500"></div>
              <img src={item?.imageUrl} alt={item?.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out" />
              <div className="absolute top-6 left-6 z-20 flex gap-2">
                <span className="bg-iesu-red text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">{item.category}</span>
              </div>
              <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="flex items-center gap-3 text-red-200 mb-4 font-bold text-[13px] tracking-wide">
                  <Calendar size={16} /> {item.date}
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4 group-hover:text-red-50 transition drop-shadow-md">{item?.title}</h3>
                <p className="text-gray-300 text-[15px] max-w-2xl mb-6 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-2 text-white font-bold text-[14px]">
                  Detayları Gör <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-iesu-red transition-colors ml-1"><ArrowRight size={16} /></div>
                </div>
              </div>
            </div>
          );
        }
        
        // Other items are standard elegant cards
        return (
          <div onClick={() => setSelectedItem(item)} key={index} className="md:col-span-4 group bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-500 flex flex-col h-full">
            <div className="h-48 overflow-hidden relative bg-gray-100">
              <img src={item?.imageUrl} alt={item?.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm text-iesu-red font-black text-[11px] uppercase tracking-wider">
                {item.category}
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow bg-white">
              <div className="flex items-center gap-2 text-[12px] font-bold text-gray-400 mb-3">
                <Calendar size={14} className="text-iesu-coral" /> {item.date}
              </div>
              <h4 className="font-extrabold text-[16px] text-gray-900 group-hover:text-iesu-red transition line-clamp-2 leading-snug mb-3">{item?.title}</h4>
              <p className="text-gray-500 text-[13px] line-clamp-2 mb-6 flex-grow">{item.description}</p>
              <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
                <span className="text-[13px] font-bold text-gray-400 group-hover:text-iesu-coral transition">Devamını Oku</span>
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-iesu-red group-hover:bg-iesu-red group-hover:text-white transition-all transform group-hover:translate-x-1">
                  <ChevronRight size={16} strokeWidth={3} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderDuyurular = () => (
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
      <div className="md:col-span-4">
        <div className="bg-gradient-to-br from-iesu-red to-iesu-darkRed rounded-[2rem] p-8 text-white shadow-xl sticky top-24 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
          <Bell size={48} className="text-red-200 mb-6 relative z-10" />
          <h2 className="text-3xl font-black mb-4 relative z-10">Önemli Duyurular</h2>
          <p className="text-red-100 text-[15px] font-medium relative z-10 leading-relaxed">Üniversitemizdeki akademik takvim, sınavlar ve idari süreçlerle ilgili en güncel bildirimler.</p>
        </div>
      </div>
      
      <div className="md:col-span-8 flex flex-col gap-4">
        {(announcements || []).map((item, index) => (
          <div onClick={() => setSelectedItem(item)} key={index} className="group relative bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:border-red-100 transition-all duration-500 flex flex-col sm:flex-row gap-6 items-start sm:items-center overflow-hidden cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gray-200 group-hover:bg-iesu-coral transition-colors duration-500"></div>
            
            <div className="flex-shrink-0 w-20 h-20 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-900 border border-gray-100 group-hover:bg-red-50 group-hover:text-iesu-red group-hover:border-red-100 transition-all duration-500 transform group-hover:-rotate-3">
              <span className="font-black text-2xl leading-none">{item.date ? item.date.split('/')[0] : '-'}</span>
              <span className="text-[11px] font-bold mt-1 tracking-widest uppercase">{item.date && item.date.includes('/') ? `${item.date.split('/')[1]}/${item.date.split('/')[2]?.slice(2)}` : ''}</span>
            </div>
            
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] uppercase tracking-widest font-black text-iesu-coral bg-red-50 px-2 py-1 rounded-md">{item.tag}</span>
                {item.attachments && item.attachments.length > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md"><FileText size={12}/> Ekli Dosya</span>
                )}
              </div>
              <h3 className="font-extrabold text-[17px] text-gray-900 group-hover:text-iesu-red transition-colors leading-snug mb-2 pr-8">
                {item?.title}
              </h3>
              <p className="text-gray-500 text-[14px] leading-relaxed line-clamp-2">{item.description}</p>
            </div>
            
            <div className="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-full bg-gray-50 items-center justify-center text-gray-400 group-hover:bg-iesu-red group-hover:text-white transition-all duration-500 transform group-hover:translate-x-2">
              <ChevronRight size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEtkinlikler = () => (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
      {(events || []).map((item, index) => {
        const spanClass = index % 3 === 0 && index !== 0 ? 'md:col-span-8' : (index % 3 === 1 && index !== 1 ? 'md:col-span-4' : 'md:col-span-6');
        
        return (
          <div onClick={() => setSelectedItem(item)} key={index} className={`${spanClass} group relative rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-2xl transition-all duration-500 min-h-[350px] flex flex-col cursor-pointer`}>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-transparent z-10 transition-opacity duration-500"></div>
            <img src={item?.imageUrl} alt={item?.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out" />
            
            <div className="absolute top-6 left-6 z-20 flex gap-2">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl text-center px-4 py-3 shadow-lg border border-white/20">
                <div className="text-2xl font-black text-iesu-red leading-none">{item.date ? item.date.split(' ')[0] : '-'}</div>
                <div className="text-[11px] font-bold text-gray-500 uppercase mt-1 tracking-wider">{item.date && item.date.includes(' ') ? item.date.split(' ')[1] : ''}</div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 p-8 z-20 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-white/10">Etkinlik</span>
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-red-100">
                  <Clock size={14} className="text-white" /> {item.date && item.date.includes(' ') ? item.date.split(' ').slice(2).join(' ') : (item.time || '')}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-red-100">
                  <MapPin size={14} className="text-white" /> {item.location}
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3 group-hover:text-red-50 transition drop-shadow-md">{item?.title}</h3>
              <p className="text-gray-300 text-[14px] line-clamp-2 mb-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans pb-24 relative overflow-x-hidden">
      
      {/* Spectacular Header Background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-gray-900 to-transparent pointer-events-none z-0"></div>
      <div className="absolute top-0 left-0 w-full h-96 bg-[url('https://www.esenyurt.edu.tr/uploads/2026/07/hzzl9zmqxgrc0--20.jpg')] opacity-10 bg-cover bg-center pointer-events-none mix-blend-overlay"></div>
      
      {/* Header Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (!userRole) { setView('landing'); return; }
                if (userRole === 'employer') { setView('company'); return; }
                setView(userRole === 'admin' ? 'admin' : userRole);
              }} 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-iesu-red hover:text-white hover:shadow-lg transition-all duration-300 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight capitalize">{category || 'Kariyer ve Gelişim Merkezi'}</h1>
          </div>
          <div className="hidden sm:flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[12px] font-bold text-gray-500">Sistem Aktif</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 mt-8">
        
        {/* Premium Tab Menu */}
        <div className="flex flex-col items-center justify-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 text-center tracking-tight drop-shadow-md">Neler Oluyor?</h2>
          
          <div className="inline-flex bg-white/10 backdrop-blur-xl p-1.5 rounded-2xl shadow-2xl border border-white/20">
            <button 
              onClick={() => handleTabChange('haberler')}
              className={`relative flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl font-bold text-[14px] transition-all duration-300 ${activeTab === 'haberler' ? 'text-iesu-red bg-white shadow-lg' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
            >
              <Newspaper size={18} /> Haberler
            </button>
            
            <button 
              onClick={() => handleTabChange('duyurular')}
              className={`relative flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl font-bold text-[14px] transition-all duration-300 ${activeTab === 'duyurular' ? 'text-iesu-red bg-white shadow-lg' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
            >
              <Bell size={18} /> Duyurular
            </button>
            
            <button 
              onClick={() => handleTabChange('etkinlikler')}
              className={`relative flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl font-bold text-[14px] transition-all duration-300 ${activeTab === 'etkinlikler' ? 'text-iesu-red bg-white shadow-lg' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
            >
              <Calendar size={18} /> Etkinlikler
            </button>
          </div>
        </div>

        {/* Dynamic Content Rendering */}
        <div className="min-h-[500px]">
          {activeTab === 'haberler' && renderHaberler()}
          {activeTab === 'duyurular' && renderDuyurular()}
          {activeTab === 'etkinlikler' && renderEtkinlikler()}
        </div>

      </div>

      {/* Detail Modal Overlay (Baloncuk) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-fade-in flex flex-col">
            {selectedItem.imageUrl && (
              <div className="w-full h-64 md:h-[400px] relative flex-shrink-0 bg-gray-900 overflow-hidden">
                {/* Blurred background image */}
                <img src={selectedItem.imageUrl} alt="Bg" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-2xl scale-110" />
                {/* Actual poster image */}
                <img src={selectedItem.imageUrl} alt={selectedItem.title} className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl z-10 p-4" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10 pointer-events-none"></div>
              </div>
            )}
            
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white text-white hover:text-gray-900 backdrop-blur-md rounded-full flex items-center justify-center transition-colors z-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="p-8 md:p-10 flex-grow flex flex-col">
              <div className="flex flex-wrap items-center gap-4 mb-5">
                {(selectedItem.category || selectedItem.tag) && (
                  <span className="bg-red-50 text-iesu-red text-[11px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider">
                    {selectedItem.category || selectedItem.tag}
                  </span>
                )}
                <div className="flex items-center gap-1.5 text-[13px] font-bold text-gray-500">
                  <Calendar size={16} /> {selectedItem.date}
                </div>
                {selectedItem.location && (
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-gray-500">
                    <MapPin size={16} /> {selectedItem.location}
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-5">{selectedItem.title}</h2>
              
              <div className="prose prose-sm md:prose-base text-gray-600 max-w-none mb-2">
                <p className="leading-relaxed font-medium">{selectedItem.description}</p>
              </div>

              {/* Registration Link for Events */}
              {selectedItem.registrationLink && (
                <div className="mt-6 mb-2">
                  <a href={selectedItem.registrationLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-iesu-red hover:bg-iesu-darkRed text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-red-500/30">
                    Etkinliğe Kayıt Ol <ExternalLink size={16} />
                  </a>
                </div>
              )}

              {/* Attachments */}
              {selectedItem.attachments && selectedItem.attachments.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h4 className="text-[15px] font-black text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-iesu-red" /> Ekler ve İlgili Belgeler
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedItem.attachments.map((attachment, idx) => (
                      <a key={idx} href={attachment.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-iesu-red hover:shadow-md transition-all group bg-gray-50 hover:bg-white cursor-pointer">
                        <span className="font-bold text-gray-700 group-hover:text-iesu-red transition-colors text-[13px] pr-2">{attachment.title}</span>
                        <div className="w-8 h-8 rounded-full bg-white flex-shrink-0 flex items-center justify-center text-gray-400 group-hover:bg-iesu-red group-hover:text-white transition-colors shadow-sm">
                          <Download size={14} />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}