import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Mail, MapPin, Download, FileText, ExternalLink, X, LogIn, Briefcase, Search, Users, Handshake, TrendingUp, Target, Sparkles, Zap, GraduationCap, Building, ChevronRight, ShieldCheck } from 'lucide-react';
import * as Icons from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { liveSliderData } from '../utils/liveData';
import Logo from './Logo';
import SpotlightCard from './shared/SpotlightCard';
import HeroSlider from './landing/HeroSlider';
import Footer from './landing/Footer';
import SEO from './SEO';


const style = document.createElement('style');
style.textContent = `
  @keyframes marquee_40s_linear_infinite {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    animation: marquee_40s_linear_infinite 40s linear infinite;
  }
  @keyframes aurora {
    0% { background-position: 50% 50%, 50% 50%; }
    50% { background-position: 100% 50%, 0% 50%; }
    100% { background-position: 50% 50%, 50% 50%; }
  }
  .animate-aurora {
    animation: aurora 15s ease infinite;
    background-size: 200% 200%;
  }
`;

document.head.appendChild(style);

export default function LandingPage({ setView }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [activeTab, setActiveTab] = useState('haberler');

  const news = useAppStore(state => state.news) || [];
  const announcements = useAppStore(state => state.announcements) || [];
  const events = useAppStore(state => state.events) || [];

  const heroSlides = liveSliderData;

  const legalData = React.useMemo(() => ({
    gizlilik: {
      title: "Gizlilik Politikası",
      description: "İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi olarak kişisel verilerinizin güvenliğine en yüksek düzeyde önem veriyoruz. Sitemizi ziyaretiniz sırasında elde edilen bilgiler, yalnızca sizlere daha iyi hizmet sunmak ve kariyer süreçlerinizi desteklemek amacıyla, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) çerçevesinde işlenmektedir.",
      date: "01/01/2026",
      category: "Yasal Bilgilendirme"
    },
    kullanim: {
      title: "Kullanım Koşulları",
      description: "Bu web sitesi, İstanbul Esenyurt Üniversitesi öğrencileri, mezunları ve akademik personeli için kariyer planlama süreçlerini desteklemek amacıyla hazırlanmıştır. Sitede yer alan iş/staj ilanları, haberler ve duyurular bilgilendirme amaçlıdır.",
      date: "01/01/2026",
      category: "Yasal Bilgilendirme"
    },
    kvkk: {
      title: "KVKK Aydınlatma Metni",
      description: "6698 sayılı Kişisel Verilerin Korunması Kanunu ('KVKK') uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi tarafından işlenmektedir.",
      date: "01/01/2026",
      category: "Yasal Bilgilendirme"
    }
  }), []);

  useEffect(() => {
    if (isCarouselPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isCarouselPaused, heroSlides.length]);

  const renderDateIcon = (dateStr) => {
    if (!dateStr || dateStr.toLowerCase().includes('belirtilmemiş')) return <Calendar size={20} className="opacity-70" />;
    
    let day = '', month = '';
    
    if (dateStr.includes(' ')) {
      const parts = dateStr.split(' ');
      if (parts.length >= 2 && !isNaN(parseInt(parts[0]))) {
        day = parts[0];
        month = parts[1].substring(0,3);
      }
    } else if (dateStr.includes('.')) {
      const parts = dateStr.split(' ')[0].split('.');
      if (parts.length >= 2) {
        day = parts[0];
        const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
        month = months[parseInt(parts[1]) - 1] || '';
      }
    } else if (dateStr.includes('/')) {
      const parts = dateStr.split(' ')[0].split('/');
      if (parts.length >= 2) {
        day = parts[0];
        const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
        month = months[parseInt(parts[1]) - 1] || '';
      }
    }

    if (day && month) {
      return (
        <>
          <span className="text-[17px] font-black leading-none">{day}</span>
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-70 mt-0.5">{month}</span>
        </>
      );
    }
    return <Calendar size={20} className="opacity-70" />;
  };


  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <div className="fixed right-0 top-[75%] -translate-y-1/2 z-50 flex flex-col gap-2 p-2 pointer-events-none">
        <a href="https://www.instagram.com/igukariyer/" target="_blank" className="w-10 h-10 bg-white shadow-lg rounded-l-xl flex items-center justify-center text-[#E1306C] border border-gray-100 hover:-translate-x-2 transition-transform pointer-events-auto group">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
        </a>
        <a href="https://www.youtube.com/channel/UCgrDyt7yFm4cnayZzffcijg" target="_blank" className="w-10 h-10 bg-white shadow-lg rounded-l-xl flex items-center justify-center text-[#FF0000] border border-gray-100 hover:-translate-x-2 transition-transform pointer-events-auto group">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
        </a>
      </div>

      <SEO 
        title="Ana Sayfa" 
        description="İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi"
        url="https://kariyer.esenyurt.edu.tr/"
      />

      {/* Top Bar - Contact Info */}
      <div className="bg-iesu-secondary text-white text-[13px] py-2 px-4 hidden md:flex justify-between items-center w-full">
        <div className="flex gap-6 max-w-7xl mx-auto w-full justify-between font-medium">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5"><Mail size={14} /> kariyer@esenyurt.edu.tr</span>
            <span className="flex items-center gap-1.5">T: 0 (212) 422 70 00</span>
          </div>
          <div className="flex gap-6 items-center">
            <a href="https://obs.esenyurt.edu.tr/" target="_blank" rel="noopener noreferrer" className="hover:text-iesu-accent transition">Öğrenci Bilgi Sistemi</a>
            <div className="w-px h-4 bg-white/20"></div>
            <a href="https://tr-tr.facebook.com/iesuedu/" target="_blank" rel="noopener noreferrer" className="hover:text-iesu-accent transition" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://www.instagram.com/iguiesu/" target="_blank" rel="noopener noreferrer" className="hover:text-iesu-accent transition" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
            <a href="https://www.youtube.com/@IesuUniversitesi" target="_blank" rel="noopener noreferrer" className="hover:text-iesu-accent transition" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
            <a href="https://www.linkedin.com/school/iesuedu/" target="_blank" rel="noopener noreferrer" className="hover:text-iesu-accent transition" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar — clean, professional, no overlap */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Left: Logo + Name */}
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-auto" />
            <div className="hidden sm:block">
              <h1 className="text-sm font-black text-iesu-navy leading-tight tracking-tight">İSTANBUL ESENYURT ÜNİVERSİTESİ</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kariyer Geliştirme Merkezi</p>
            </div>
          </div>



          {/* Middle: Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700">
            <button onClick={() => setView('about_us')} className="hover:text-iesu-navy transition">Hakkımızda</button>
            <button onClick={() => setView('services')} className="hover:text-iesu-navy transition">Hizmetlerimiz</button>
            <button onClick={() => setView('events_list')} className="hover:text-iesu-navy transition">Etkinliklerimiz</button>
            <button onClick={() => setView('contact_us')} className="hover:text-iesu-navy transition">İletişim</button>
          </div>

          {/* Right: Direct Login Button */}
          <button 
            onClick={() => setView('login')}
            className="flex items-center gap-2 bg-iesu-navy text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#163B65] transition-colors shadow-md hover:shadow-lg"
          >
            <LogIn size={16} /> Portala Giriş
          </button>
        </div>
      </nav>

      {/* Hero Slider */}
      <HeroSlider slides={heroSlides} currentSlide={currentSlide} />

      {/* 1. QUALITATIVE INSTITUTIONAL VALUE RIBBON (NO HARDCODED NUMBERS) */}
      <section className="relative z-10 pt-10 pb-6 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 flex items-center gap-4 hover:border-indigo-300 transition-colors shadow-sm">
            <div className="p-3 bg-indigo-100/80 text-indigo-700 rounded-xl shrink-0"><ShieldCheck size={22} /></div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Avrupa Akredite</h4>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">AQAS & AHPGS Uluslararası Eğitim Kalite Standartları</p>
            </div>
          </div>
          <div className="bg-slate-50/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 flex items-center gap-4 hover:border-emerald-300 transition-colors shadow-sm">
            <div className="p-3 bg-emerald-100/80 text-emerald-700 rounded-xl shrink-0"><Zap size={22} /></div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">AI Destekli Portföy</h4>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Otomatik ATS Uyum Analizi & Canlı Mülakat Provası</p>
            </div>
          </div>
          <div className="bg-slate-50/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 flex items-center gap-4 hover:border-amber-300 transition-colors shadow-sm">
            <div className="p-3 bg-amber-100/80 text-amber-700 rounded-xl shrink-0"><Target size={22} /></div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">CBİKO Entegre</h4>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Cumhurbaşkanlığı İKO Liyakatli Ulusal Staj Programı</p>
            </div>
          </div>
          <div className="bg-slate-50/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 flex items-center gap-4 hover:border-purple-300 transition-colors shadow-sm">
            <div className="p-3 bg-purple-100/80 text-purple-700 rounded-xl shrink-0"><Search size={22} /></div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Research OS</h4>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Disiplinlerarası Ar-Ge Laboratuvar & Yayın Portalı</p>
            </div>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex justify-center flex-wrap gap-4 mt-6">
          <button 
            onClick={() => setView('startup_incubator')} 
            className="group bg-white border border-slate-200 shadow-md hover:shadow-xl rounded-full px-6 py-3 flex items-center gap-3 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <div className="bg-indigo-100 p-1.5 rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Building size={18} /></div>
            <span className="font-bold text-slate-800 text-[13px]">İESÜMER Kuluçka & Girişimcilik</span>
          </button>
          <button 
            onClick={() => setView('staj')} 
            className="group bg-white border border-slate-200 shadow-md hover:shadow-xl rounded-full px-6 py-3 flex items-center gap-3 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <div className="bg-emerald-100 p-1.5 rounded-full text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Target size={18} /></div>
            <span className="font-bold text-slate-800 text-[13px]">Yetenek & Staj Kapısı</span>
          </button>
          <button 
            onClick={() => setView('cvbuilder')} 
            className="group bg-white border border-slate-200 shadow-md hover:shadow-xl rounded-full px-6 py-3 flex items-center gap-3 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <div className="bg-purple-100 p-1.5 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors"><FileText size={18} /></div>
            <span className="font-bold text-slate-800 text-[13px]">AI Özgeçmiş & CV Oluşturucu</span>
          </button>
        </div>
      </section>

      {/* 3. BENTO BOX GRID: GELECEĞİN YETENEKLERİ (ULTRA PREMIUM CORPORATE) */}
      <section className="py-20 sm:py-28 bg-[#fdfdfd] relative overflow-hidden">
        {/* Subtle Corporate Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight text-[#0A2342]">
              Geleceğe Odaklan.
            </h2>
            <p className="text-slate-500 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Kariyer Geliştirme Merkezi servisleriyle yeteneklerini keşfet, iş dünyasına rakiplerinden bir adım önde başla.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-5 md:gap-6 auto-rows-[minmax(200px,auto)] min-h-[400px] perspective-1000">
            {/* Bento 1: Ulusal Staj */}
            <SpotlightCard spotlightColor="rgba(255,255,255,0.15)" className="md:col-span-2 md:row-span-2 md:col-start-1 md:row-start-1 !bg-[#0A2342] !border-none !p-0">
              <div className="h-full flex flex-col justify-end p-8 md:p-10 relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2342] via-[#0A2342]/80 to-transparent"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6 border border-white/20">
                    <Briefcase size={28} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">Ulusal Staj<br/>Programı</h3>
                  <p className="text-blue-100 text-sm font-medium mb-8 max-w-md leading-relaxed opacity-90">Cumhurbaşkanlığı İnsan Kaynakları Ofisi koordinasyonunda liyakat esaslı staj imkanı. Profesyonel hayata sağlam bir adım atın.</p>
                  <button onClick={() => setView('staj')} className="bg-white text-[#0A2342] px-7 py-3 rounded-full font-bold text-[13px] w-max hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-xl shadow-black/10 z-20 pointer-events-auto cursor-pointer relative">Detayları İncele <ArrowRight size={16}/></button>
                </div>
              </div>
            </SpotlightCard>

            {/* Bento 2: Kariyer Esenyurtim */}
            <SpotlightCard spotlightColor="rgba(10,35,66,0.05)" className="col-span-1 row-span-1 md:col-start-3 md:row-start-1 p-6 md:p-8 flex flex-col !bg-white cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => setView('services')}>
              <div className="w-12 h-12 bg-blue-50/80 rounded-xl flex items-center justify-center text-[#24548A] mb-5 border border-blue-100/50">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Kariyer Esenyurtim</h3>
              <p className="text-gray-500 text-[13px] font-medium leading-relaxed">Bilimsel ölçümlere dayalı öz değerlendirme envanterleri ve yetenek testleri.</p>
            </SpotlightCard>

            {/* Bento 3: Akran Mentor */}
            <SpotlightCard spotlightColor="rgba(255,255,255,0.1)" className="col-span-1 row-span-1 md:col-start-4 md:row-start-1 p-6 md:p-8 flex flex-col !bg-gradient-to-br !from-[#1C4173] !to-[#11294D] !border-none cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => setView('mentor_match')}>
              <div className="absolute -right-6 -bottom-6 opacity-[0.07] pointer-events-none"><Users size={160} /></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-5 border border-white/20">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-black text-white mb-2 tracking-tight">Akran Mentor</h3>
                <p className="text-blue-100/80 text-[13px] font-medium leading-relaxed">Deneyimli öğrencilerin rehberliğinde vizyonunuzu şekillendirin.</p>
              </div>
            </SpotlightCard>

            {/* Bento 4: İşbirliklerimiz */}
            <SpotlightCard spotlightColor="rgba(10,35,66,0.05)" className="col-span-1 row-span-1 md:col-start-3 md:row-start-2 p-6 md:p-8 flex flex-col justify-center items-center text-center !bg-white cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => setView('about_us')}>
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 mb-5 border border-gray-100">
                <Handshake size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-1 tracking-tight">İşbirliklerimiz</h3>
              <p className="text-gray-500 text-[12px] font-medium leading-relaxed">Sektörün dev markalarıyla güçlü protokoller.</p>
            </SpotlightCard>

            {/* Bento 5: Araştırma */}
            <SpotlightCard spotlightColor="rgba(255,255,255,0.05)" className="col-span-1 row-span-1 md:col-start-4 md:row-start-2 p-6 md:p-8 flex flex-col justify-between !bg-[#051121] !border-none text-white cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => setView('research_hub')}>
              <div>
                <h3 className="text-lg font-black mb-2 tracking-tight text-white/90">Araştırma Faaliyetleri</h3>
                <p className="text-gray-400 text-[12px] font-medium mb-6 leading-relaxed">Geleceğin meslek analizleri ve sektörel istihdam raporları.</p>
              </div>
              <div className="flex justify-between items-end">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-300 border border-white/10"><Search size={20} /></div>
                <ArrowRight size={20} className="text-gray-500" />
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* 3.5 İESÜ KURUMSAL HİZMETLER & HIZLI ERİŞİM HUB (QUALITATIVE LIGHT GLASSMORPHISM) */}
      <section className="py-16 bg-gradient-to-b from-[#fdfdfd] via-[#f8f9fc] to-[#ffffff] border-y border-slate-200/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#24548A] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
                Resmi İdari Hizmetler & Birimler
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-[#0A2342] mt-3 tracking-tight">
                İESÜ Kariyer & İdari Hizmetler Portalı
              </h2>
              <p className="text-slate-500 font-semibold text-xs md:text-sm mt-1">
                Öğrenci, akademisyen ve mezunlarımızın tüm idari işlemleri için hızlı erişim panelleri.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1: Kariyer Danışmanlığı Randevu */}
            <div 
              onClick={() => setView('mentor_booking')}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <GraduationCap size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">Kariyer & Özgeçmiş Danışmanlığı</h3>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed">Uzman kariyer danışmanlarımızdan 1-on-1 randevu alın, mülakat simülasyonlarına katılın.</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-black text-indigo-600 border-t border-slate-100 pt-4">
                <span>Randevu Al</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: SKSDB Vücut Kitle İndeksi & Diyetisyen */}
            <div 
              onClick={() => setView('sksdb_lunch')}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Target size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">SKSDB Öğrenci Sağlık & BMI</h3>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed">İdeal kilo aralığınızı hesaplayın, Mediko-Sosyal diyetisyeninden ücretsiz randevu alın.</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-black text-emerald-600 border-t border-slate-100 pt-4">
                <span>BMI İndeksini Ölç</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: BİDB Canlı Durum & Destek Biletleri */}
            <div 
              onClick={() => setView('bidb_status')}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Zap size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">BİDB Altyapı & Teknik Destek</h3>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed">Kampüs Wi-Fi, OBS ve LMS sunucu durumlarını izleyin, teknik destek bileti açın.</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-black text-amber-600 border-t border-slate-100 pt-4">
                <span>Sistem Durumunu Gör</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: Research OS & Ar-Ge Lab */}
            <div 
              onClick={() => setView('research_hub')}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Search size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">Ar-Ge Lab & Makale İndeksi</h3>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed">Ar-Ge laboratuvarlarından ekipman rezerve edin, YÖK/Scopus makalelerini inceleyin.</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-black text-purple-600 border-t border-slate-100 pt-4">
                <span>Research OS Merkezi</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 5: Vizyon, Misyon & Akreditasyonlar */}
            <div 
              onClick={() => setView('about_us')}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0A2342]/10 text-[#0A2342] flex items-center justify-center mb-4 group-hover:bg-[#0A2342] group-hover:text-white transition-colors">
                  <Building size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-[#0A2342] transition-colors">Vizyon, Yönerge & Kurumsal</h3>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed">İESÜ Kariyer Yönergesi, AQAS/AHPGS uluslararası akreditasyonlar ve mezun iletişim ağı.</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-black text-[#0A2342] border-t border-slate-100 pt-4">
                <span>Hakkımızda & Detaylar</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 6: Etkinlikler & Sertifikasyon */}
            <div 
              onClick={() => setView('events_list')}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  <Calendar size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-cyan-600 transition-colors">Kariyer Günleri & Bilet alma</h3>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed">Geleneksel Kariyer Günleri panellerine dijital katılım bileti oluşturun.</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-black text-cyan-600 border-t border-slate-100 pt-4">
                <span>Etkinlik Takvimini Aç</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PREMIUM BENTO MASONRY NEWS/EVENTS GRID */}
      <section className="py-20 sm:py-28 bg-[#f8f9fc] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          
          <div className="mb-12">
            <h2 className="text-3xl md:text-2xl font-black text-[#0A2342] mb-2 tracking-tight">Güncel İçerikler</h2>
            <p className="text-gray-500 font-medium">Kariyer merkezimizden en son haberler, etkinlikler ve duyurular.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Top Left: Featured News (Large) */}
            {news[0] && (
              <div onClick={() => setSelectedItem(news[0])} className="md:col-span-2 md:row-span-2 relative bg-gray-900 rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-2xl transition-all duration-500">
                <img src={news[0].imageUrl || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200'} alt="Featured News" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute top-6 left-6">
                  <span className="bg-red-600 text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">Öne Çıkan Haber</span>
                </div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-2 text-gray-300 text-sm font-bold mb-3">
                    <Calendar size={16} /> {news[0].date || 'Yakın Zaman'}
                  </div>
                  <h3 className="text-2xl md:text-2xl font-black text-white leading-tight mb-6 group-hover:text-red-100 transition-colors">{news[0].title}</h3>
                  <div className="inline-flex items-center gap-2 text-white font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full transition-all text-sm">
                    İçeriği Oku <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            )}

            {/* Top Right: Announcements List */}
            <div className="md:col-span-1 md:row-span-2 bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10"></div>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                  <Icons.Bell size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-900">Duyurular</h3>
              </div>

              <div className="flex flex-col gap-6 flex-grow">
                {announcements.slice(0, 3).map((ann, idx) => (
                  <div key={idx} className="group cursor-pointer border-l-2 border-transparent hover:border-red-500 pl-4 -ml-4 transition-all" onClick={() => setSelectedItem(ann)}>
                    <p className="text-[11px] font-black text-red-500 uppercase tracking-wider mb-1">{ann.date || 'Yakın Zaman'}</p>
                    <h4 className="text-[13px] font-bold text-gray-800 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">{ann.title}</h4>
                  </div>
                ))}
              </div>

              <button onClick={() => setView('duyurular')} className="mt-8 w-full py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 hover:text-red-600 transition-all flex items-center justify-center gap-2">
                Tüm Duyurular <ChevronRight size={16} />
              </button>
            </div>

            {/* Bottom Row: Event 1 */}
            {events[0] && (
              <div onClick={() => setSelectedItem(events[0])} className="col-span-1 row-span-1 relative bg-gray-100 rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all">
                <img src={events[0].imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'} alt="Event 1" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/20 to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="bg-indigo-600/90 backdrop-blur text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">Etkinlik</span>
                  <h3 className="text-white font-bold leading-tight line-clamp-2 text-sm md:text-base group-hover:text-indigo-200 transition-colors">{events[0].title}</h3>
                </div>
              </div>
            )}

            {/* Bottom Row: Event 2 */}
            {events[1] && (
              <div onClick={() => setSelectedItem(events[1])} className="col-span-1 row-span-1 relative bg-gray-100 rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all">
                <img src={events[1].imageUrl || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800'} alt="Event 2" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="bg-blue-600/90 backdrop-blur text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">Etkinlik</span>
                  <h3 className="text-white font-bold leading-tight line-clamp-2 text-sm md:text-base group-hover:text-blue-200 transition-colors">{events[1].title}</h3>
                </div>
              </div>
            )}

            {/* Bottom Row: News 2 */}
            {news[1] && (
              <div onClick={() => setSelectedItem(news[1])} className="col-span-1 row-span-1 relative bg-gray-100 rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all">
                <img src={news[1].imageUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'} alt="News 2" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/20 to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="bg-emerald-600/90 backdrop-blur text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">Haber</span>
                  <h3 className="text-white font-bold leading-tight line-clamp-2 text-sm md:text-base group-hover:text-emerald-200 transition-colors">{news[1].title}</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}

      <Footer setSelectedItem={setSelectedItem} legalData={legalData} setView={setView} />

      {/* News/Event Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative animate-scale-up">
            {selectedItem.imageUrl ? (
              <div className="w-full h-64 md:h-80 relative flex-shrink-0">
                <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all z-20"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="w-full bg-[#0A2342] p-4 flex justify-end">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            )}
            
            <div className="p-8 md:p-10 flex-grow flex flex-col">
              <div className="flex flex-wrap items-center gap-4 mb-5">
                {(selectedItem.category || selectedItem.tag) && (
                  <span className="bg-[#0A2342]/10 text-[#0A2342] text-[11px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider">
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
                {selectedItem.content || selectedItem.description || "Detaylı içerik bulunamadı."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
