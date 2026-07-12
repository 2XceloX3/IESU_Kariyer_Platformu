import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Calendar, ArrowRight, Mail, Menu, Search, Bell, MapPin, Download, FileText, ExternalLink, CheckCircle, X } from 'lucide-react';
import { contentData } from './NewsEvents';
import Logo from './Logo';

export default function LandingPage({ setView }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = React.useRef(null);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if(email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const allSearchableItems = [
    ...(contentData?.haberler || []),
    ...(contentData?.duyurular || []),
    ...(contentData?.etkinlikler || [])
  ];

  const searchResults = searchTerm.length > 2 
    ? allSearchableItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 5)
    : [];

  const heroSlides = [
    {
      badge: "Öne Çıkan Kariyer Fırsatı",
      title: "2026 Ulusal Staj Programı Başvuruları Başladı",
      image: "https://www.esenyurt.edu.tr/uploads/2026/01/7vnjt36bkvvot-2026-ulusal-staj.PNG",
      action: () => setView('jobs')
    },
    {
      badge: "Yetenek Kapısı",
      title: "Kariyer Fuarlarına Kayıt Yaptırmayı Unutmayın",
      image: "https://www.esenyurt.edu.tr/uploads/2025/07/puvyjwzmoe347-yetenek-kapisi.jpeg",
      action: () => setView('jobs')
    },
    {
      badge: "Yeni Mezun Programı",
      title: "Öncü Teknoloji Firmalarında Mühendislik Fırsatları",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=600&fit=crop",
      action: () => setView('jobs')
    }
  ];

  const legalData = {
    gizlilik: {
      title: "Gizlilik Politikası",
      description: "İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi Koordinatörlüğü olarak kişisel verilerinizin güvenliğine en yüksek düzeyde önem veriyoruz. Sitemizi ziyaretiniz sırasında elde edilen bilgiler, yalnızca sizlere daha iyi hizmet sunmak ve kariyer süreçlerinizi desteklemek amacıyla, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) çerçevesinde işlenmektedir. Toplanan verileriniz, izniniz olmadan üçüncü şahıslarla paylaşılmamaktadır. Sitemizdeki çerez (cookie) uygulamaları, kullanıcı deneyimini artırmak için kullanılmakta olup, dilediğiniz zaman tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.",
      date: "01/01/2026",
      category: "Yasal Bilgilendirme"
    },
    kullanim: {
      title: "Kullanım Koşulları",
      description: "Bu web sitesi, İstanbul Esenyurt Üniversitesi öğrencileri, mezunları ve akademik personeli için kariyer planlama süreçlerini desteklemek amacıyla hazırlanmıştır. Sitede yer alan iş/staj ilanları, haberler ve duyurular bilgilendirme amaçlıdır. Kullanıcılar, portal üzerinden yaptıkları başvurularda doğru ve güncel bilgi vermekle yükümlüdür. İstanbul Esenyurt Üniversitesi, sistemde yer alan dış bağlantıların (üçüncü taraf sitelerin) içeriklerinden sorumlu tutulamaz. Siteye giriş yapan her kullanıcı bu koşulları peşinen kabul etmiş sayılır.",
      date: "01/01/2026",
      category: "Yasal Bilgilendirme"
    },
    kvkk: {
      title: "KVKK Aydınlatma Metni",
      description: "6698 sayılı Kişisel Verilerin Korunması Kanunu ('KVKK') uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi Koordinatörlüğü tarafından işlenmektedir.\n\n1. İşlenme Amacı: Öğrenci ve mezunlarımızın iş/staj olanaklarından faydalanması, kariyer etkinliklerine katılımı ve istatistiksel raporlamalar yapılması.\n2. Verilerin Aktarımı: İzniniz doğrultusunda, işbirliği yapılan kurum ve kuruluşlarla (işverenlerle) staj ve iş başvurularınız kapsamında paylaşılabilir.\n3. Haklarınız: KVKK Madde 11 uyarınca; verilerinizin işlenip işlenmediğini öğrenme, düzeltme talep etme ve silinmesini isteme hakkına sahipsiniz. Başvurularınızı kvkk@esenyurt.edu.tr adresine iletebilirsiniz.",
      date: "01/01/2026",
      category: "Yasal Bilgilendirme"
    }
  };

  useEffect(() => {
    if (isCarouselPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isCarouselPaused, heroSlides.length]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* Top Bar - Contact Info */}
      <div className="bg-iesu-red text-white text-[13px] py-2 px-4 hidden md:flex justify-between items-center w-full">
        <div className="flex gap-6 max-w-7xl mx-auto w-full justify-between font-medium">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5"><Mail size={14} /> kariyer@esenyurt.edu.tr</span>
            <span className="flex items-center gap-1.5">T: 444 9 123</span>
          </div>
          <div className="flex gap-6 items-center">
            <a href="https://obs.esenyurt.edu.tr/" target="_blank" rel="noopener noreferrer" className="hover:text-red-200 transition">Öğrenci Bilgi Sistemi</a>
            <div className="w-px h-4 bg-red-400"></div>
            <a href="https://twitter.com/iesuniversitesi" target="_blank" rel="noopener noreferrer" className="hover:text-red-200 transition" aria-label="X">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>
            </a>
            <a href="https://www.facebook.com/iesuniversitesi" target="_blank" rel="noopener noreferrer" className="hover:text-red-200 transition" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://www.instagram.com/iesuniversitesi/" target="_blank" rel="noopener noreferrer" className="hover:text-red-200 transition" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
            <a href="https://tr.linkedin.com/school/i%CC%87stanbulesenyurt%C3%BCniversitesi/" target="_blank" rel="noopener noreferrer" className="hover:text-red-200 transition" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header & Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b-4 border-iesu-coral">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Left: Logo Section */}
          <div className="flex items-center gap-3 w-1/3 justify-start">
            <Logo className="h-10 sm:h-12 w-auto text-iesu-red" />
            <div className="hidden lg:block">
              <h1 className="text-[14px] xl:text-[15px] font-black text-gray-900 leading-none tracking-tight whitespace-nowrap">İSTANBUL ESENYURT ÜNİVERSİTESİ</h1>
              <p className="text-[10px] xl:text-[11px] text-iesu-coral font-bold uppercase tracking-widest mt-1 whitespace-nowrap">Kariyer Geliştirme Ofisi Koordinatörlüğü</p>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="w-1/3 flex justify-center hidden sm:flex relative">
            <div ref={searchContainerRef} className="relative group w-full max-w-md z-50">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-iesu-red transition-colors">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                value={searchTerm}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => { setSearchTerm(e.target.value); setIsSearchFocused(true); }}
                placeholder="İlan, etkinlik, duyuru ara..." 
                className="w-full bg-gray-100/80 border border-transparent text-gray-900 text-[14px] rounded-lg pl-10 pr-10 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-iesu-coral/20 focus:border-iesu-coral transition-all duration-300"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              
              {/* Search Results Dropdown */}
              {isSearchFocused && searchTerm.length > 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col z-50">
                  {searchResults.length > 0 ? (
                    searchResults.map((item, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          setSelectedItem(item);
                          setSearchTerm('');
                        }}
                        className="text-left px-4 py-3 hover:bg-red-50 border-b border-gray-50 transition-colors last:border-0 flex flex-col gap-1"
                      >
                        <span className="text-[10px] font-bold text-iesu-red uppercase tracking-wider">{item.category || item.tag || 'İçerik'}</span>
                        <span className="text-[13px] font-semibold text-gray-800 line-clamp-1">{item.title}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-[13px] text-gray-500 text-center">
                      Sonuç bulunamadı.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Login Button & Desktop Links */}
          <div className="flex items-center justify-end w-1/3 gap-6">
            <button 
              className="hidden lg:block text-gray-600 hover:text-iesu-red font-bold text-sm transition-colors"
              onClick={() => {
                setView('landing');
                setTimeout(() => {
                  const el = document.getElementById('events');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              Etkinlikler
            </button>
            <button 
              onClick={() => setView('login')}
              className="bg-iesu-red text-white px-5 sm:px-8 py-2.5 rounded-xl font-bold text-[14px] hover:bg-iesu-darkRed transition shadow-lg flex items-center gap-2 border border-transparent hover:border-red-300"
            >
              Portala Giriş <ArrowRight size={16} className="hidden sm:block" />
            </button>
            <button className="lg:hidden ml-4 text-iesu-red" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={32} />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b-4 border-iesu-coral p-4 flex flex-col gap-4 shadow-xl absolute w-full z-40">
          <button onClick={() => { setView('landing'); setIsMenuOpen(false); }} className="text-iesu-red font-bold text-[15px] text-left">Ana Sayfa</button>
          <button className="text-gray-700 font-semibold hover:text-iesu-coral text-[15px] text-left">Kariyer Danışmanlığı</button>
          <button onClick={() => { setView('jobs'); setIsMenuOpen(false); }} className="text-gray-700 font-semibold hover:text-iesu-coral text-[15px] text-left">İş ve Staj</button>
          <button onClick={() => { 
            setView('landing'); 
            setIsMenuOpen(false); 
            setTimeout(() => {
              const el = document.getElementById('events');
              if(el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }} className="text-gray-700 font-semibold hover:text-iesu-coral text-[15px] text-left">Etkinlikler</button>
          <button className="text-gray-700 font-semibold hover:text-iesu-coral text-[15px] text-left">Mezun Ağı</button>
          <button onClick={() => { setView('login'); setIsMenuOpen(false); }} className="bg-iesu-red text-white font-bold px-4 py-3 rounded-lg w-full mt-2 shadow">Portala Giriş</button>
        </div>
      )}

      {/* Hero Slider Area */}
      <section 
        className="relative h-[400px] md:h-[480px] bg-gray-900 overflow-hidden group"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
        onFocus={() => setIsCarouselPaused(true)}
        onBlur={() => setIsCarouselPaused(false)}
      >
        {/* Arrow Left */}
        <button 
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={(e) => { e.preventDefault(); setCurrentSlide(p => p === 0 ? heroSlides.length - 1 : p - 1); }}
          aria-label="Önceki Slayt"
        >
          <ChevronLeft size={24} />
        </button>
        
        {/* Arrow Right */}
        <button 
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={(e) => { e.preventDefault(); setCurrentSlide(p => (p + 1) % heroSlides.length); }}
          aria-label="Sonraki Slayt"
        >
          <ChevronRight size={24} />
        </button>

        {heroSlides.map((slide, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${index === currentSlide ? 'translate-x-0' : index < currentSlide ? '-translate-x-full' : 'translate-x-full'}`}
          >
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-transparent"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-start">
              <span className="inline-block px-4 py-1.5 bg-iesu-red text-white text-[12px] font-black rounded-full mb-5 uppercase tracking-wider shadow-lg border border-red-500/30">{slide.badge}</span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 max-w-2xl leading-tight drop-shadow-md">{slide.title}</h2>
              <button onClick={slide.action} className="bg-white text-iesu-red px-7 py-3 rounded-full font-bold text-[15px] hover:bg-iesu-coral hover:text-white transition flex items-center gap-2 shadow-lg group-hover:scale-105 duration-300">
                Fırsatı İncele <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ))}
        
        {/* Slider Controls */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
          {heroSlides.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-10 bg-iesu-red' : 'w-2 bg-white/50 hover:bg-white'}`}
            />
          ))}
        </div>
      </section>

      {/* Bento Grid News & Events Section */}
      <section id="events" className="max-w-7xl mx-auto px-4 py-24 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Gündem <span className="text-iesu-red">&</span> Gelişmeler</h2>
            <p className="text-gray-500 mt-4 font-medium text-[16px] max-w-xl">Üniversitemizden en güncel haberler, kritik duyurular ve yaklaşan heyecan verici etkinlikler.</p>
          </div>
          <button onClick={() => setView('haberler')} className="hidden md:flex items-center gap-2 font-bold text-iesu-red hover:text-white transition-all bg-red-50 hover:bg-iesu-red px-6 py-3.5 rounded-xl shadow-sm hover:shadow-lg">
            Tümünü Görüntüle <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Featured News - Spans 8 cols */}
          <div onClick={() => setSelectedItem({
            title: "İstanbul Esenyurt Üniversitesi 2025–2026 Akademik Yılı Mezuniyet Töreni Büyük Bir Coşkuyla Gerçekleşti",
            date: "01 Temmuz 2026",
            category: "Öne Çıkan Haber",
            description: "Binlerce öğrencimiz kep atma heyecanını yaşarken, aileler de bu gurur dolu güne ortak oldu. Tören renkli anlara sahne oldu.",
            imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/hzzl9zmqxgrc0--20.jpg"
          })} className="lg:col-span-8 group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-2xl transition-all duration-500 min-h-[450px]">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-transparent z-10 transition-opacity duration-500"></div>
            <img src="https://www.esenyurt.edu.tr/uploads/2026/07/hzzl9zmqxgrc0--20.jpg" alt="Featured" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out" />
            <div className="absolute top-6 left-6 z-20 flex gap-2">
              <span className="bg-iesu-red text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">Öne Çıkan Haber</span>
            </div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
              <div className="flex items-center gap-3 text-red-200 mb-4 font-bold text-[13px] tracking-wide">
                <Calendar size={16} /> 01 Temmuz 2026
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-6 group-hover:text-red-50 transition drop-shadow-md">İstanbul Esenyurt Üniversitesi 2025–2026 Akademik Yılı Mezuniyet Töreni Büyük Bir Coşkuyla Gerçekleşti</h3>
              <div className="flex items-center gap-2 text-white font-bold text-[15px]">
                İçeriği Oku <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-iesu-red transition-colors ml-1"><ArrowRight size={16} /></div>
              </div>
            </div>
          </div>

          {/* Announcements - Spans 4 cols */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-gradient-to-b from-[#f8f9fc] to-white rounded-[2rem] p-8 h-full border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-40 h-40 bg-red-50 rounded-full blur-3xl opacity-80 -mr-10 -mt-10 pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <div className="bg-red-100 text-iesu-red p-2 rounded-xl"><Bell size={20} /></div> Duyurular
                </h3>
              </div>
              
              <div className="space-y-6 relative z-10 flex-grow">
                {/* Item */}
                <div onClick={() => setSelectedItem({
                  title: "2025-2026 Yaz Okulu Başvuruları Resmi Olarak Başladı!",
                  date: "24 Haziran 2026",
                  category: "Duyuru",
                  description: "Yaz okulu kapsamında açılacak dersler, kredilendirme ve başvuru işlemleri hakkında detaylı bilgi için lütfen portalımızı ziyaret edin. Son başvuru tarihini kaçırmayın.",
                  attachments: [
                    { title: "Yaz Okulu Başvuru Kılavuzu (PDF)", url: "https://www.esenyurt.edu.tr/uploads/2025/08/i5u1kucx99f7l-kopya-2025-2026-lisansustu-programlari-akademik-takvim.pdf" },
                    { title: "Açılacak Dersler Listesi (XLSX)", url: "https://www.esenyurt.edu.tr/uploads/2025/08/i5u1kucx99f7l-kopya-2025-2026-lisansustu-programlari-akademik-takvim.pdf" }
                  ]
                })} className="group cursor-pointer">
                  <div className="flex gap-4 items-start">
                    <div className="w-1.5 h-12 bg-gray-200 rounded-full group-hover:bg-iesu-coral transition-colors duration-300 mt-1"></div>
                    <div>
                      <span className="text-[10px] font-black text-iesu-coral uppercase tracking-widest mb-1.5 block">24 Haziran 2026</span>
                      <h4 className="font-extrabold text-[15px] text-gray-800 group-hover:text-iesu-red transition leading-snug">2025-2026 Yaz Okulu Başvuruları Resmi Olarak Başladı!</h4>
                    </div>
                  </div>
                </div>
                {/* Item */}
                <div onClick={() => setSelectedItem({
                  title: "Güz Dönemi Yüksek Lisans Başvuruları BAŞLADI",
                  date: "19 Haziran 2026",
                  category: "Duyuru",
                  description: "İstanbul Esenyurt Üniversitesi’nde lisansüstü eğitim alarak akademik ve profesyonel gelişiminizi en üst düzeye taşıyın. Başvuru kılavuzu ektedir.",
                  attachments: [
                    { title: "Lisansüstü Başvuru Şartları ve Kılavuzu", url: "https://www.esenyurt.edu.tr/uploads/2026/01/mfouqnznc1y27-2025-26-hazirlik-akademik-takvimi.pdf" }
                  ]
                })} className="group cursor-pointer">
                  <div className="flex gap-4 items-start">
                    <div className="w-1.5 h-12 bg-gray-200 rounded-full group-hover:bg-iesu-coral transition-colors duration-300 mt-1"></div>
                    <div>
                      <span className="text-[10px] font-black text-iesu-coral uppercase tracking-widest mb-1.5 block">19 Haziran 2026</span>
                      <h4 className="font-extrabold text-[15px] text-gray-800 group-hover:text-iesu-red transition leading-snug">Güz Dönemi Yüksek Lisans Başvuruları BAŞLADI</h4>
                    </div>
                  </div>
                </div>
                {/* Item */}
                <div onClick={() => setSelectedItem({
                  title: "Bahar Dönemi Final Sınav Programları ve Salon Düzenleri",
                  date: "15 Haziran 2026",
                  category: "Duyuru",
                  description: "Final sınav takvimi web sitemiz üzerinden yayınlanmıştır. Sınav giriş belgelerinizi OBS üzerinden almayı unutmayın. Tüm öğrencilerimize başarılar dileriz."
                })} className="group cursor-pointer">
                  <div className="flex gap-4 items-start">
                    <div className="w-1.5 h-12 bg-gray-200 rounded-full group-hover:bg-iesu-coral transition-colors duration-300 mt-1"></div>
                    <div>
                      <span className="text-[10px] font-black text-iesu-coral uppercase tracking-widest mb-1.5 block">15 Haziran 2026</span>
                      <h4 className="font-extrabold text-[15px] text-gray-800 group-hover:text-iesu-red transition leading-snug">Bahar Dönemi Final Sınav Programları ve Salon Düzenleri</h4>
                    </div>
                  </div>
                </div>
              </div>
              
              <button onClick={() => setView('duyurular')} className="mt-8 w-full py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:border-iesu-coral hover:text-iesu-coral transition flex items-center justify-center gap-2 group relative z-10 bg-white">
                Tüm Duyurular <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Bottom row: Events & Secondary News (Spans 4 cols each) */}
          <div onClick={() => setSelectedItem({
            title: "İESU BAHAR ŞENLİĞİ 26’ BAŞLIYOR",
            date: "11 MAYIS 2026",
            category: "Etkinlik",
            location: "Ana Kampüs Etkinlik Alanı",
            description: "Bahar şenliğimiz kapsamında ünlü sanatçıların konserleri, ödüllü yarışmalar ve öğrenci kulüpleri stantları sizleri bekliyor.",
            imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/1hh79tp8rgliu-iesu-bahar-senligi-26’-basliyor.jpeg",
            attachments: [
              { title: "Bahar Şenliği Etkinlik Programı (PDF)", url: "https://www.esenyurt.edu.tr/uploads/2025/08/00ltcaciydfvj-jqo8958p52ivt-2024-2025-eg%CC%86itim-o%CC%88g%CC%86retim-yili-akademik-takvimi.pdf" }
            ]
          })} className="lg:col-span-4 group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-500 h-72">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-gray-900/20 group-hover:to-gray-900/40 transition-colors z-10"></div>
            <img src="https://www.esenyurt.edu.tr/uploads/2026/06/1hh79tp8rgliu-iesu-bahar-senligi-26’-basliyor.jpeg" alt="Event" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            <div className="absolute top-5 left-5 z-20">
              <div className="bg-white/95 backdrop-blur rounded-xl text-center px-4 py-2 shadow-lg">
                <div className="text-xl font-black text-iesu-red leading-none">11</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase mt-1">MAYIS</div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 p-6 z-20 transform group-hover:-translate-y-1 transition-transform duration-500">
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest mb-3 inline-block border border-white/10">Etkinlik</span>
              <h4 className="text-xl font-black text-white leading-tight">İESU BAHAR ŞENLİĞİ 26’ BAŞLIYOR</h4>
            </div>
          </div>

          <div onClick={() => setSelectedItem({
            title: "Mezunlarımızla Söyleşi Serisi Başlıyor",
            date: "18 MAYIS 2026",
            category: "Etkinlik",
            location: "Online (Zoom)",
            description: "Kariyerlerinde başarılı adımlar atmış mezunlarımız, tecrübelerini mevcut öğrencilerimizle paylaşıyor. Katılım sertifikalıdır.",
            imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/06/x124bn4cr3rmz-mezunlarimizla-soylesi-serisi-basliyor.jpeg",
            registrationLink: "https://zoom.us/webinar/register/..."
          })} className="lg:col-span-4 group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-500 h-72">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-gray-900/20 group-hover:to-gray-900/40 transition-colors z-10"></div>
            <img src="https://www.esenyurt.edu.tr/uploads/2026/06/x124bn4cr3rmz-mezunlarimizla-soylesi-serisi-basliyor.jpeg" alt="Event" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            <div className="absolute top-5 left-5 z-20">
              <div className="bg-white/95 backdrop-blur rounded-xl text-center px-4 py-2 shadow-lg">
                <div className="text-xl font-black text-iesu-red leading-none">18</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase mt-1">MAYIS</div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 p-6 z-20 transform group-hover:-translate-y-1 transition-transform duration-500">
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest mb-3 inline-block border border-white/10">Etkinlik</span>
              <h4 className="text-xl font-black text-white leading-tight">Mezunlarımızla Söyleşi Serisi Başlıyor</h4>
            </div>
          </div>

          {/* Secondary News - Spans 4 cols */}
          <div onClick={() => setSelectedItem({
            title: "Kariyer Ofisi'nden Yeni Nesil Yapay Zekâ Atölyesi",
            date: "25 Haziran 2026",
            category: "Eğitim",
            description: "Öğrencilerimizi geleceğin mesleklerine hazırlamak amacıyla düzenlenen Yapay Zekâ ve Veri Bilimi atölyesi yoğun ilgi gördü.",
            imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&h=400&fit=crop"
          })} className="lg:col-span-4 group bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-500 flex flex-col h-72">
            <div className="h-32 bg-gray-100 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&h=400&fit=crop" alt="News" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            </div>
            <div className="p-6 flex flex-col flex-grow bg-white">
              <span className="text-[10px] font-black text-iesu-coral uppercase tracking-widest mb-2 block">25 Haziran 2026</span>
              <h4 className="font-extrabold text-[16px] text-gray-900 group-hover:text-iesu-red transition line-clamp-2 leading-snug">Kariyer Ofisi'nden Yeni Nesil Yapay Zekâ Atölyesi</h4>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-[13px] font-bold text-gray-400 group-hover:text-iesu-coral transition">Haberin Detayı</span>
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-iesu-red group-hover:bg-iesu-red group-hover:text-white transition-all transform group-hover:translate-x-1">
                  <ChevronRight size={16} strokeWidth={3} />
                </div>
              </div>
            </div>
          </div>

        </div>
        
        <div className="mt-8 flex justify-center md:hidden">
          <button onClick={() => setView('haberler')} className="flex items-center justify-center gap-2 font-bold text-iesu-red bg-red-50 px-8 py-4 rounded-xl w-full">
            Tüm Gelişmeleri Gör <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Premium Red/Coral Theme Footer */}
      <footer className="bg-gradient-to-br from-[#bc1d2a] via-[#dc2626] to-[#ff4d4d] py-16 relative overflow-hidden">
        {/* Abstract Background Waves */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <svg className="absolute w-[150%] h-[150%] -top-[20%] -left-[10%] opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 C20,70 40,30 60,60 C80,90 100,50 100,50 L100,100 L0,100 Z" fill="#ffffff" />
          </svg>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
            
            {/* Column 1: Brand & About */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-6 bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
                <div className="bg-white p-1.5 rounded-lg">
                  <Logo className="h-9 w-auto text-iesu-red" />
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="text-[14px] md:text-[16px] font-black text-white leading-snug mb-1">Kariyer Geliştirme Ofisi Koordinatörlüğü</h2>
                  <p className="text-red-100 font-bold text-[10px] tracking-widest uppercase">Esenyurt Üniversitesi</p>
                </div>
              </div>
              <p className="text-[14px] text-red-50 leading-relaxed mb-6 font-medium">
                Öğrencilerimizin kariyer planlamalarına destek olmak ve iş dünyası ile aralarında güçlü köprüler kurmak amacıyla hizmet veriyoruz. Geleceğinize giden yolda daima yanınızdayız.
              </p>
              <div className="flex gap-3">
                <a href="https://twitter.com/iesuniversitesi" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white flex items-center justify-center text-white hover:text-iesu-red transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>
                </a>
                <a href="https://www.facebook.com/iesuniversitesi" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white flex items-center justify-center text-white hover:text-iesu-red transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="https://www.instagram.com/iesuniversitesi/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white flex items-center justify-center text-white hover:text-iesu-red transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                </a>
                <a href="https://tr.linkedin.com/school/i%CC%87stanbulesenyurt%C3%BCniversitesi/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white flex items-center justify-center text-white hover:text-iesu-red transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="flex flex-col">
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white"></span> Hızlı Bağlantılar</h3>
              <ul className="space-y-3 font-medium text-[14px]">
                <li><a href="https://obs.esenyurt.edu.tr/" target="_blank" rel="noopener noreferrer" className="text-red-100 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2"><ChevronRight size={14} /> Öğrenci Bilgi Sistemi (OBS)</a></li>
                <li><a href="https://eslms.esenyurt.edu.tr/almsp" target="_blank" rel="noopener noreferrer" className="text-red-100 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2"><ChevronRight size={14} /> Esuzemi (Uzaktan Eğitim)</a></li>
                <li><a href="https://kutuphane.esenyurt.edu.tr/" target="_blank" rel="noopener noreferrer" className="text-red-100 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2"><ChevronRight size={14} /> Merkez Kütüphane</a></li>
                <li><button onClick={() => setView('staj')} className="text-red-100 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2"><ChevronRight size={14} /> Gönüllü Staj Süreçleri</button></li>
                <li><button onClick={() => setView('sem')} className="text-red-100 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2"><ChevronRight size={14} /> SEM (Sürekli Eğitim Merkezi)</button></li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div className="flex flex-col">
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white"></span> İletişim Bilgileri</h3>
              <ul className="space-y-4 font-medium text-[14px] text-red-50">
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-2 rounded-lg mt-0.5"><Mail size={16} className="text-white" /></div>
                  <div>
                    <span className="block text-[11px] text-red-200 uppercase tracking-wider font-bold mb-0.5">E-Posta</span>
                    <a href="mailto:kariyer@esenyurt.edu.tr" className="hover:text-white transition">kariyer@esenyurt.edu.tr</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-2 rounded-lg mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div>
                  <div>
                    <span className="block text-[11px] text-red-200 uppercase tracking-wider font-bold mb-0.5">Telefon</span>
                    <a href="tel:+904449123" className="hover:text-white transition">444 9 123 (Dahili: 1102)</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-2 rounded-lg mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                  <div>
                    <span className="block text-[11px] text-red-200 uppercase tracking-wider font-bold mb-0.5">Adres</span>
                    <a href="https://maps.app.goo.gl/esenyurt" target="_blank" rel="noopener noreferrer" className="hover:text-white transition leading-snug">Zafer Mah. Adile Naşit Bulvarı No:1 Esenyurt / İstanbul</a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="flex flex-col">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg">
                <h3 className="text-[16px] font-black text-white mb-2">E-Bülten'e Kayıt Olun</h3>
                <p className="text-[13px] text-red-100 mb-5 leading-snug">Sektör buluşmaları, yeni staj programları ve duyurulardan ilk siz haberdar olun.</p>
                {isSubscribed ? (
                  <div className="bg-green-500/20 border border-green-400/50 text-green-100 p-4 rounded-xl flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-300" />
                    <p className="text-sm font-bold">Kayıt Başarılı! Aramıza hoş geldiniz.</p>
                  </div>
                ) : (
                  <form className="space-y-3" onSubmit={handleSubscribe}>
                    <div className="relative">
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta adresiniz..." className="w-full bg-white/10 border border-white/30 rounded-xl pl-4 pr-12 py-3 text-[14px] text-white placeholder-red-200 focus:outline-none focus:bg-white/20 transition" required />
                      <button type="submit" className="absolute right-1 top-1 bottom-1 bg-white text-iesu-red px-3 rounded-lg hover:bg-gray-100 transition flex items-center justify-center shadow-sm">
                        <ArrowRight size={16} strokeWidth={3} />
                      </button>
                    </div>
                    <div className="flex items-start gap-2 text-[11px]">
                      <input type="checkbox" id="newsletter-kvkk" className="mt-0.5" required />
                      <label htmlFor="newsletter-kvkk" className="text-red-100 cursor-pointer leading-tight">
                        <button type="button" onClick={(e) => { e.preventDefault(); setSelectedItem(legalData.kvkk); }} className="underline font-bold hover:text-white">Aydınlatma Metni</button>'ni okudum, onaylıyorum.
                      </label>
                    </div>
                  </form>
                )}
              </div>
            </div>

          </div>
          
          {/* Copyright Row */}
          <div className="pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[13px] text-red-200 font-medium tracking-wide">© 2026 T.C. İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi Koordinatörlüğü.</p>
            <div className="flex gap-6 text-[13px] text-red-200 font-medium">
              <button onClick={() => setSelectedItem(legalData.gizlilik)} className="hover:text-white transition cursor-pointer">Gizlilik Politikası</button>
              <button onClick={() => setSelectedItem(legalData.kullanim)} className="hover:text-white transition cursor-pointer">Kullanım Koşulları</button>
              <button onClick={() => setSelectedItem(legalData.kvkk)} className="hover:text-white transition cursor-pointer">KVKK</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Detail Modal Overlay (Baloncuk) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-fade-in flex flex-col">
            {selectedItem.imageUrl ? (
              <div className="w-full h-64 md:h-80 relative flex-shrink-0">
                <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                
                {/* Modal Close Button Over Image */}
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all z-20"
                >
                  <span className="font-black text-xl leading-none">&times;</span>
                </button>
              </div>
            ) : (
              <div className="w-full bg-iesu-red p-4 flex justify-end">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all"
                >
                  <span className="font-black text-xl leading-none">&times;</span>
                </button>
              </div>
            )}
            
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
