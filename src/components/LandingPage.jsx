import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, ArrowLeft, Printer, Mail, MapPin, Download, FileText, ExternalLink, X, LogIn, Briefcase, Search, Users, Handshake, TrendingUp, Target, Sparkles, Zap, GraduationCap, Building, ChevronRight, ShieldCheck, Heart, MessageSquare, Send, Bookmark } from 'lucide-react';
import * as Icons from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { liveSliderData, liveNewsData } from '../utils/liveData';
import Logo from './Logo';
import MainHeader from './MainHeader';
import SpotlightCard from './shared/SpotlightCard';
import HeroSlider from './landing/HeroSlider';
import Footer from './landing/Footer';
import SubPanelFooter from './SubPanelFooter';
import SEO from './SEO';
import RichContentRenderer from './RichContentRenderer';
import TuitionAccordion from './TuitionAccordion';
import ScraperSyncBar from './ScraperSyncBar';
import KgmNewsSection from './KgmNewsSection';
import Events from './Events';
import OfficeInfo from './OfficeInfo';


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
  const [selectedPillModal, setSelectedPillModal] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [activeTab, setActiveTab] = useState('haberler');
  const [itemLiked, setItemLiked] = useState(false);
  const [itemSaved, setItemSaved] = useState(false);
  const [itemLikesCount, setItemLikesCount] = useState(24);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentsList, setCommentsList] = useState([
    { author: 'Ayşe Kaya (Bilgisayar Müh.)', text: 'Çok harika bir etkinlik, ben katıldım!', time: '10 dk önce' },
    { author: 'Mehmet Demir (İşletme)', text: 'Detaylar ve staj başvuruları için mükemmel bir fırsat.', time: '1 saat önce' }
  ]);

  const mockLikers = [
    { name: 'Ayşe K.', dept: 'Bilgisayar Müh.' },
    { name: 'Mehmet D.', dept: 'İşletme' },
    { name: 'Elif Ş.', dept: 'Yazılım Müh.' },
    { name: 'Can A.', dept: 'Endüstri Müh.' },
    { name: 'Zeynep K.', dept: 'Sağlık B.' }
  ];

  const news = useAppStore(state => state.news) || [];
  const announcements = useAppStore(state => state.announcements) || [];
  const events = useAppStore(state => state.events) || [];
  const showInstitutionalStats = useAppStore(state => state.showInstitutionalStats);
  const institutionalStatsData = useAppStore(state => state.institutionalStatsData);

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

  const menuPagesData = React.useMemo(() => ({
    about_us: {
      title: "İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi",
      category: "Kurumsal",
      date: "2026 - Güncel",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/07/hzzl9zmqxgrc0--20.jpg",
      content: `### Hakkımızda\n\nİstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi, öğrencilerimizin ve mezunlarımızın mesleki gelişimlerini desteklemek, onları iş dünyasına hazırlamak ve kariyer yolculuklarında rehberlik etmek amacıyla kurulmuştur.\n\n---\n\n#### 🎯 Misyonumuz\nÖğrenci ve mezunlarımızın, küresel ölçekte rekabet edebilir, yenilikçi ve etik değerlere sahip profesyoneller olarak iş dünyasına hazırlanmalarını sağlamak; onların potansiyellerini en üst düzeye çıkaracak kariyer planlama ve geliştirme hizmetleri sunmaktır.\n\n---\n\n#### 🚀 Vizyonumuz\nUlusal ve uluslararası düzeyde iş dünyası ile güçlü entegrasyon kuran, öğrenci ve mezunlarının kariyer yolculuklarında referans alınan, öncü bir Kariyer Geliştirme Merkezi olmak.\n\n---\n\n#### 👥 Ekip Üyeleri & Resmî Ofis Kadrosu\nKariyer merkezimiz, öğrencilerimize en iyi hizmeti sunmak için alanında uzman profesyonellerden oluşmaktadır:\n- **Kariyer Geliştirme Koordinatörü:** Genel yönetim, stratejik planlama ve kurumsal işbirlikleri.\n- **Kariyer Danışmanları:** Birebir danışmanlık, özgeçmiş (CV) kontrolü, mülakat simülasyonları.\n- **Staj ve İstihdam Uzmanları:** Yetenek Kapısı yönetimi, firma protokolleri ve iş ilanları takibi.\n- **Etkinlik & İletişim Sorumluları:** Kariyer fuarları, seminer organizasyonları ve mezun ilişkileri.\n\n---\n\n#### 📞 İletişim ve Yerleşke Bilgileri\n- **E-Posta:** kariyer@esenyurt.edu.tr\n- **Telefon:** 444 9 123 / 0 (212) 422 70 00\n- **Ofis:** Kariyer Geliştirme Merkezi / Rektörlük Binası Esenyurt Kampüsü`
    },
    services: {
      title: "Kariyer Geliştirme Hizmetlerimiz",
      category: "Hizmet Portföyü",
      date: "2026 - Güncel",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2024/06/km1geeaqjq2ly-aday-ogrenci.png",
      content: `### Sizin İçin Neler Yapıyoruz?\n\nKariyer Geliştirme Merkezi olarak öğrencilerimize ve mezunlarımıza sunduğumuz ana hizmetlerimiz aşağıda detaylandırılmıştır:\n\n---\n\n#### 1. 🎯 Birebir Kariyer Danışmanlığı\nÖğrenci ve mezunlarımızın kariyer hedeflerine ulaşmalarına yardımcı olmak amacıyla profesyonel kariyer danışmanlığı hizmetleri sunulmaktadır.\n\n---\n\n#### 2. 📄 Özgeçmiş (CV) ve Niyet Mektubu Rehberliği\nKişisel, eğitim ve mesleki bilgileri içeren kritik bir belge olan özgeçmişin oluşturulması ve profesyonel format düzenlemeleri konusunda birebir rehberlik sağlanır.\n\n---\n\n#### 3. 💼 Staj ve İstihdam Fırsatları (Yetenek Kapısı)\nSektör lideri firmalarla yapılan kurumsal iş birlikleri ve Yetenek Kapısı entegrasyonu ile zorunlu ve gönüllü staj başvuruları yönetilmektedir.\n\n---\n\n#### 4. 🏆 Kariyer Günleri ve Sektör Buluşmaları\nHer akademik yılda düzenlenen Kariyer Günleri, mülakat simülasyonları ve teknik geziler ile öğrenciler iş dünyasının lider temsilcileriyle doğrudan bir araya getirilmektedir.`
    },
    events_list: {
      title: "Akademik ve Sektörel Etkinliklerimiz",
      category: "Etkinlik Takvimi",
      date: "2026 Güz & Bahar Dönemi",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/05/wuyeismnf35tr-bahar-senligi.jpg",
      content: `### Yaklaşan ve Güncel Etkinliklerimiz\n\nİstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi tarafından düzenlenen atölyeler, seminerler ve zirveler:\n\n---\n\n#### 🎪 1. İESÜ Bahar Şenliği & Kariyer Festivali 2026\n- **Tarih:** 15-18 Mayıs 2026\n- **Yer:** Esenyurt Kampüsü Ana Bahçe\n- **Detay:** Sektör lideri şirket stantları, kariyer sohbetleri ve müzik performansları eşliğinde yıllık büyük buluşma.\n\n---\n\n#### 🏆 2. Bilim Rüzgarı & Akademik Başarı Ödül Töreni\n- **Tarih:** 20 Nisan 2026\n- **Yer:** Konferans Salonu\n- **Detay:** Başarılı projelerin, TEKNOFEST ekiplerinin ve akademik yayın ödüllerinin takdim edildiği resmi tören.\n\n---\n\n#### 🚀 3. TEKNOFEST & Ar-Ge Girişimcilik Zirvesi\n- **Tarih:** 10 Mart 2026\n- **Yer:** İESÜMER Kuluçka Merkezi\n- **Detay:** TEKNOFEST yarışmalarına katılacak öğrenci takımlarına teknik mentorluk ve fon sunumları.`
    },
    contact_us: {
      title: "Kariyer Geliştirme Merkezi İletişim Bilgileri",
      category: "İletişim & Ulaşım",
      date: "7/24 Kesintisiz Destek",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2024/06/km1geeaqjq2ly-aday-ogrenci.png",
      content: `### Bizimle İletişime Geçin\n\nKariyer planlama, staj işlemleri, randevu talepleri veya kurumsal iş birlikleri için aşağıdaki iletişim kanallarından bize ulaşabilirsiniz:\n\n---\n\n#### 📍 Kampüs Adresi\n**İstanbul Esenyurt Üniversitesi Rektörlüğü**\nZafer Mahallesi, Doğan Araslı Bulvarı No:79, 34513 Esenyurt / İstanbul\n\n---\n\n#### 📞 Telefon ve E-Posta\n- **Santral:** 444 9 123 / 0 (212) 422 70 00\n- **E-Posta:** kariyer@esenyurt.edu.tr\n- **Öğrenci Dekanlığı:** ogrencidekanligi@esenyurt.edu.tr\n\n---\n\n#### ⏰ Çalışma Saatleri\nHafta İçi: 08:30 - 17:30 (Resmi Tatiller Hariç)`
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


      <SEO 
        title="Ana Sayfa" 
        description="İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi"
        url="https://kariyer.esenyurt.edu.tr/"
      />



      {/* Unified Main Header for identical alignment */}
      <MainHeader setView={setView} />

      {/* Hero Slider with internal detail modal on click */}
      <HeroSlider slides={heroSlides} currentSlide={currentSlide} onSelectSlide={setSelectedItem} />

      {/* 1. INSTITUTIONAL STATISTICAL RIBBON (Controlled via Admin Panel) */}
      {showInstitutionalStats && (
        <section className="relative z-10 pt-10 pb-6 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(institutionalStatsData || []).map((stat) => (
              <div key={stat.id} className="bg-slate-50/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 flex items-center gap-4 hover:border-[#990000]/30 transition-colors shadow-sm">
                <div className="p-3 bg-red-50 text-[#990000] rounded-xl shrink-0">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">{stat.val}</h4>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{stat.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

        {/* Action Pills with Informative Modals */}
        <section className="relative z-10 py-4 max-w-7xl mx-auto px-4">
          <div className="flex justify-center flex-wrap gap-4">
            <button 
              onClick={() => setSelectedPillModal({
                id: 'startup_incubator',
                title: 'İESÜMER Kuluçka & Girişimcilik Merkezi',
                badge: '🚀 Girişimcilik & Ar-Ge',
                imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=60',
                desc: 'İESÜMER Kuluçka Merkezi; öğrencilerimizin yenilikçi iş fikirlerini prototipe dönüştürmelerini sağlayan, prototip laboratuvarları, 3D yazıcı parkı, patent rehberliği ve yatırımcı buluşmaları sunan resmî girişimcilik merkezimizdir.',
                features: [
                  '7/24 Kesintisiz Paylaşımlı Ofis ve Çalışma Alanı',
                  'TÜBİTAK BİGG ve KOSGEB Hibe Destek Danışmanlığı',
                  'Mentör Akademisyenler Eşliğinde Şirketleşme Desteği',
                  'Yatırımcı ve Melek Yatırım Ağı Sunum Günleri (Demo Day)'
                ],
                targetView: 'startup_incubator'
              })} 
              className="group bg-white border border-slate-200 shadow-md hover:shadow-xl rounded-full px-6 py-3 flex items-center gap-3 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <div className="bg-indigo-100 p-1.5 rounded-full text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors"><Building size={18} /></div>
              <span className="font-bold text-red-900 text-[13px]">İESÜMER Kuluçka & Girişimcilik</span>
            </button>

            <button 
              onClick={() => setSelectedPillModal({
                id: 'staj',
                title: 'CBİKO Ulusal Staj & Yetenek Kapısı',
                badge: '💼 Kariyer & İstihdam',
                imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=60',
                desc: 'Cumhurbaşkanlığı İnsan Kaynakları Ofisi (CBİKO) koordinasyonunda yürütülen Ulusal Staj Programı ve Yetenek Kapısı platformu ile öğrencilerimize liyakat esaslı zorunlu ve gönüllü staj imkanları sunulmaktadır.',
                features: [
                  'Liyakat Esaslı Kamu ve Özel Sektör Staj Fırsatları',
                  'Resmî Staj Evrakları ve SGK Giriş Onay Portalı',
                  '500+ Kurumsal Şirketin Staj İlanlarına Doğrudan Başvuru',
                  'Kariyer Danışmanları Eşliğinde Başvuru Takibi'
                ],
                targetView: 'staj'
              })} 
              className="group bg-white border border-slate-200 shadow-md hover:shadow-xl rounded-full px-6 py-3 flex items-center gap-3 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <div className="bg-emerald-100 p-1.5 rounded-full text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Target size={18} /></div>
              <span className="font-bold text-red-900 text-[13px]">Yetenek & Staj Kapısı</span>
            </button>

            <button 
              onClick={() => setSelectedPillModal({
                id: 'cvbuilder',
                title: 'Özgeçmiş & CV Oluşturucu',
                badge: '🤖 Kariyer Asistanı',
                imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60',
                desc: 'Akıllı CV Sihirbazı ile uluslararası İnsan Kaynakları standartlarına tam uyumlu profesyonel özgeçmişler ve ön yazılar hazırlayabilirsiniz.',
                features: [
                  'Uluslararası Standartlarda Profesyonel Şablonlar',
                  'Beceriler ve Deneyim Önerileri',
                  'PDF / Word Formatında Anında İndirme ve Düzenleme',
                  'Çoklu Dili Destekleyen Profesyonel Özgeçmiş Formatı'
                ],
                targetView: 'cvbuilder'
              })} 
              className="group bg-white border border-slate-200 shadow-md hover:shadow-xl rounded-full px-6 py-3 flex items-center gap-3 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <div className="bg-purple-100 p-1.5 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors"><FileText size={18} /></div>
              <span className="font-bold text-red-900 text-[13px]">Özgeçmiş & CV Oluşturucu</span>
            </button>
          </div>
        </section>

      {/* 3. BENTO BOX GRID: GELECEĞİN YETENEKLERİ (ULTRA PREMIUM CORPORATE) */}
      <section className="py-20 sm:py-28 bg-[#fdfdfd] relative overflow-hidden">
        {/* Subtle Corporate Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight text-[#990000]">
              Geleceğe Odaklan.
            </h2>
            <p className="text-slate-500 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Kariyer Geliştirme Merkezi servisleriyle yeteneklerini keşfet, iş dünyasına rakiplerinden bir adım önde başla.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-5 md:gap-6 auto-rows-[minmax(200px,auto)] min-h-[400px] perspective-1000">
            {/* Bento 1: Ulusal Staj Programı */}
            <SpotlightCard 
              spotlightColor="rgba(255,255,255,0.15)" 
              className="md:col-span-2 md:row-span-2 md:col-start-1 md:row-start-1 !bg-[#990000] !border-none !p-0 cursor-pointer group"
              onClick={() => setSelectedPillModal({
                id: 'bento_ulusal_staj',
                title: 'Ulusal Staj Programı & Yetenek Kapısı',
                badge: '🏛️ CBİKO Resmî Staj Programı',
                imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                desc: 'Cumhurbaşkanlığı İnsan Kaynakları Ofisi (CBİKO) tarafından yürütülen Ulusal Staj Programı, fırsat eşitliği ve liyakat esaslarına göre yükseköğretim öğrencilerinin kamu kurumları ve özel sektörde staj imkanına erişimini sağlar.',
                features: [
                  'Kamu Kurumları ve Bakanlıklarda Liyakat Esaslı Staj',
                  'Özel Sektör Devlerinde Öncelikli Staj İlanları',
                  'SGK ve Resmî Staj Evraklarının Portaldan Onaylanması',
                  'Birebir Kariyer Danışmanı İncelemesi ve Takibi'
                ],
                targetView: 'staj'
              })}
            >
              <div className="h-full flex flex-col justify-end p-8 md:p-10 relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center mix-blend-overlay opacity-20 group-hover:scale-105 transition-transform duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#990000] via-[#990000]/80 to-transparent"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6 border border-white/20">
                    <Briefcase size={28} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">Ulusal Staj<br/>Programı</h3>
                  <p className="text-red-100 text-sm font-medium mb-8 max-w-md leading-relaxed opacity-90">Cumhurbaşkanlığı İnsan Kaynakları Ofisi koordinasyonunda liyakat esaslı staj imkanı. Profesyonel hayata sağlam bir adım atın.</p>
                  <button type="button" className="bg-white text-[#990000] px-7 py-3 rounded-full font-bold text-[13px] w-max hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-xl shadow-black/10 z-20 cursor-pointer relative">Detayları İncele <ArrowRight size={16}/></button>
                </div>
              </div>
            </SpotlightCard>

            {/* Bento 2: Kariyer Danışmanlığı & Değerlendirme */}
            <SpotlightCard 
              spotlightColor="rgba(10,35,66,0.05)" 
              className="col-span-1 row-span-1 md:col-start-3 md:row-start-1 p-6 md:p-8 flex flex-col !bg-white cursor-pointer hover:-translate-y-1 transition-transform border border-slate-100 shadow-sm hover:shadow-xl"
              onClick={() => setSelectedPillModal({
                id: 'bento_kariyer_rehberligi',
                title: 'Birebir Kariyer Danışmanlığı & Yetenek Testleri',
                badge: '🎯 Profesyonel Kariyer Koçluğu',
                imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60',
                desc: 'İstanbul Esenyurt Üniversitesi Kariyer Danışmanları tarafından öğrencilerimize yetkinlik haritası çıkarma, mülakat simülasyonları, CV inceleme ve kariyer hedefleri belirleme alanlarında birebir danışmanlık verilmektedir.',
                features: [
                  'Birebir Yüz Yüze veya Online Mülakat Simülasyonu',
                  'Kişilik ve Yetkinlik Değerlendirme Envanterleri',
                  'Profesyonel Özgeçmiş (CV) ve Niyet Mektubu Analizi',
                  'Kariyer Haritası ve Mezuniyet Sonrası İstihdam Planı'
                ],
                targetView: 'services'
              })}
            >
              <div className="w-12 h-12 bg-red-50/80 rounded-xl flex items-center justify-center text-[#990000] mb-5 border border-red-100/50">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Kariyer Danışmanlığı</h3>
              <p className="text-gray-500 text-[13px] font-medium leading-relaxed">Bilimsel ölçümlere dayalı öz değerlendirme envanterleri ve yetenek testleri.</p>
            </SpotlightCard>

            {/* Bento 3: Akran Mentorluk Programı */}
            <SpotlightCard 
              spotlightColor="rgba(255,255,255,0.1)" 
              className="col-span-1 row-span-1 md:col-start-4 md:row-start-1 p-6 md:p-8 flex flex-col !bg-gradient-to-br !from-[#1C4173] !to-[#11294D] !border-none cursor-pointer hover:-translate-y-1 transition-transform shadow-lg"
              onClick={() => setSelectedPillModal({
                id: 'bento_akran_mentor',
                title: 'İESÜ Akran Mentorluk Programı',
                badge: '🤝 Öğrenci Rehberlik Ağı',
                imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60',
                desc: 'Üst sınıf başarılı öğrenciler ile yeni başlayan öğrencileri bir araya getiren Akran Mentorluk Programı; akademik uyum, ders çalışma teknikleri, kampüs yaşamı ve kariyer vizyonu kazandırmayı amaçlar.',
                features: [
                  'Deneyimli Üst Sınıf Öğrencilerinden Birebir Mentorluk',
                  'Akademik Uyum ve Ders Başarısı Yöntemleri',
                  'Kampüs ve Öğrenci Kulüpleri Etkinlik Entegrasyonu',
                  'Rozet ve Puan (BP) Ödüllü Sosyal Paylaşım Ağı'
                ],
                targetView: 'mentor_match'
              })}
            >
              <div className="absolute -right-6 -bottom-6 opacity-[0.07] pointer-events-none"><Users size={160} /></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-5 border border-white/20">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-black text-white mb-2 tracking-tight">Akran Mentor</h3>
                <p className="text-red-100/80 text-[13px] font-medium leading-relaxed">Deneyimli öğrencilerin rehberliğinde vizyonunuzu şekillendirin.</p>
              </div>
            </SpotlightCard>

            {/* Bento 4: Sektörel İşbirliklerimiz */}
            <SpotlightCard 
              spotlightColor="rgba(10,35,66,0.05)" 
              className="col-span-1 row-span-1 md:col-start-3 md:row-start-2 p-6 md:p-8 flex flex-col justify-center items-center text-center !bg-white cursor-pointer hover:-translate-y-1 transition-transform border border-slate-100 shadow-sm hover:shadow-xl"
              onClick={() => setSelectedPillModal({
                id: 'bento_isbirlikleri',
                title: 'Kurumsal Sektör İşbirlikleri & Protokoller',
                badge: '🤝 Dev Markalarla Güçlü Bağlar',
                imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=60',
                desc: 'İstanbul Esenyurt Üniversitesi; sanayi, teknoloji, sağlık ve finans sektörlerinin önde gelen 500+ kurumsal şirketiyle stratejik iş birliği protokollerine imza atmaktadır.',
                features: [
                  '500+ Kurumsal Şirketle İmzalanan Resmî Staj Protokolü',
                  'Sektör Liderleriyle Mülakat ve İş İlanı Buluşmaları',
                  'Teknik Geziler ve Saha Projesi Uygulama İmkânı',
                  'Mezuniyet Sonrası Doğrudan İşe Alım Önceliği'
                ],
                targetView: 'about_us'
              })}
            >
              <div className="w-14 h-14 bg-red-50/80 rounded-2xl flex items-center justify-center text-[#990000] mb-4 border border-red-100/50">
                <Handshake size={28} />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-1 tracking-tight">İşbirliklerimiz</h3>
              <p className="text-gray-500 text-[12px] font-medium leading-relaxed">Sektörün dev markalarıyla güçlü protokoller.</p>
            </SpotlightCard>

            {/* Bento 5: Araştırma Faaliyetleri */}
            <SpotlightCard 
              spotlightColor="rgba(255,255,255,0.05)" 
              className="col-span-1 row-span-1 md:col-start-4 md:row-start-2 p-6 md:p-8 flex flex-col justify-between !bg-[#051121] !border-none text-white cursor-pointer hover:-translate-y-1 transition-transform shadow-lg"
              onClick={() => setSelectedPillModal({
                id: 'bento_arastirma',
                title: 'Geleceğin Meslekleri & Araştırma Hub',
                badge: '📊 Sektörel Analiz & Ar-Ge',
                imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
                desc: 'Kariyer Geliştirme Merkezi Araştırma Birimi; yapay zeka, dijitalleşme ve iş dünyasının geleceğine yönelik düzenli istihdam analizleri ve sektör raporları yayımlar.',
                features: [
                  'Yıllık Mezun İstihdam Endeksi ve Sektör Raporları',
                  'Mesleklere Etki Analizleri',
                  'Öğrenci Ar-Ge Projeleri ve TÜBİTAK Başvuru Desteği',
                  'Akademik Yayın ve Sektörel Makale Arşivi'
                ],
                targetView: 'research_hub'
              })}
            >
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

      {/* 4. PREMIUM BENTO MASONRY NEWS/EVENTS GRID */}
      <section className="py-20 sm:py-28 bg-[#f8f9fc] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          
          <div className="mb-12">
            <h2 className="text-3xl md:text-2xl font-black text-[#990000] mb-2 tracking-tight">Güncel İçerikler</h2>
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
                {announcements.slice(0, 3).map((ann, idx) => {
                  const cleanAnnTitle = (ann.title || '')
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/&nbsp;/gi, ' ')
                    .replace(/&amp;/gi, '&')
                    .replace(/\s+/g, ' ')
                    .trim();

                  return (
                    <div key={idx} className="group cursor-pointer border-l-2 border-transparent hover:border-red-500 pl-4 -ml-4 transition-all" onClick={() => setSelectedItem(ann)}>
                      <p className="text-[11px] font-black text-red-500 uppercase tracking-wider mb-1">{ann.date || 'Yakın Zaman'}</p>
                      <h4 className="text-[13px] font-bold text-gray-800 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">{cleanAnnTitle}</h4>
                    </div>
                  );
                })}
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
                  <span className="bg-red-600/90 backdrop-blur text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">Etkinlik</span>
                  <h3 className="text-white font-bold leading-tight line-clamp-2 text-sm md:text-base group-hover:text-indigo-200 transition-colors">{events[0].title}</h3>
                </div>
              </div>
            )}

            {/* Bottom Row: Event 2 */}
            {events[1] && (
              <div onClick={() => setSelectedItem(events[1])} className="col-span-1 row-span-1 relative bg-gray-100 rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all">
                <img src={events[1].imageUrl || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800'} alt="Event 2" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 via-red-900/20 to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="bg-red-600/90 backdrop-blur text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">Etkinlik</span>
                  <h3 className="text-white font-bold leading-tight line-clamp-2 text-sm md:text-base group-hover:text-red-200 transition-colors">{events[1].title}</h3>
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
      <SubPanelFooter setView={(v) => {
        if (v === 'gizlilik') { setSelectedItem(legalData.gizlilik); return; }
        if (v === 'kullanim') { setSelectedItem(legalData.kullanim); return; }
        if (v === 'kvkk') { setSelectedItem(legalData.kvkk); return; }
        setSelectedItem(null);
        if (setView) setView(v);
      }} />

      {/* Full-Screen Dedicated News/Announcement/Tuition Detail View */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto animate-fade-in">
          {/* Top Sticky Header - Crimson Red / Nar Çiçeği Bar */}
          <div className="sticky top-0 z-30 bg-gradient-to-r from-[#990000] via-[#800000] to-[#660000] text-white px-4 sm:px-8 py-3.5 shadow-xl flex items-center justify-between border-b border-red-800 gap-4">
            {/* 1. Far Left: Pure White Logo + Title */}
            <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setSelectedItem(null)}>
              <div className="brightness-0 invert flex-shrink-0">
                <Logo className="h-10 w-auto" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xs sm:text-sm font-black text-white leading-tight tracking-tight">İSTANBUL ESENYURT ÜNİVERSİTESİ</h1>
                <p className="text-[10px] font-bold text-red-200 uppercase tracking-widest">Kariyer Geliştirme Merkezi</p>
              </div>
            </div>

            {/* 2. Right Group: Search Bar + Nav Links + Portala Giriş Button */}
            <div className="flex items-center gap-4 md:gap-6 overflow-x-auto py-1">
              {/* Search Bar immediately to the left of Hakkımızda */}
              <div className="relative hidden md:block w-44 lg:w-56 flex-shrink-0">
                <Search className="absolute left-3 top-2.5 text-white/60" size={14} />
                <input
                  type="text"
                  placeholder="İçerik veya Bölüm Ara..."
                  className="w-full bg-white/10 text-white placeholder-white/60 text-xs font-medium pl-9 pr-3 py-1.5 rounded-xl border border-white/20 focus:outline-none focus:bg-white/20 transition"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      setSelectedItem(null);
                      if (setView) setView('explore');
                    }
                  }}
                />
              </div>

              {/* Nav Links immediately to the left of Portala Giriş */}
              <div className="hidden lg:flex items-center gap-5 text-xs font-extrabold text-white/90 whitespace-nowrap">
                <button onClick={() => { setSelectedItem(null); setView && setView('about_us'); }} className="hover:text-white hover:underline transition">Hakkımızda</button>
                <button onClick={() => { setSelectedItem(null); setView && setView('services'); }} className="hover:text-white hover:underline transition">Hizmetlerimiz</button>
                <button onClick={() => { setSelectedItem(null); setView && setView('events_list'); }} className="hover:text-white hover:underline transition">Etkinliklerimiz</button>
                <button onClick={() => { setSelectedItem(null); setView && setView('contact_us'); }} className="hover:text-white hover:underline transition">İletişim</button>
              </div>

              {/* Far Right: Portala Giriş Button (Fixed size, no wrap) */}
              <button 
                onClick={() => { setSelectedItem(null); setView && setView('login'); }}
                className="flex items-center gap-1.5 bg-white text-[#990000] hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md hover:shadow-lg whitespace-nowrap flex-shrink-0"
              >
                <LogIn size={15} /> Portala Giriş
              </button>
            </div>
          </div>

          {/* Full Container Content */}
          <div className="max-w-7xl mx-auto px-4 pt-8 pb-0">
            {/* Interactive Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-6">
              <button 
                type="button"
                onClick={() => { setSelectedItem(null); setView && setView('landing'); }} 
                className="hover:text-[#990000] hover:underline transition cursor-pointer"
              >
                Ana Sayfa
              </button>
              <ChevronRight size={14} />
              <button 
                type="button"
                onClick={() => { setSelectedItem(null); setView && setView('duyurular'); }} 
                className="hover:text-[#990000] hover:underline transition cursor-pointer"
              >
                Duyurular & Haberler
              </button>
              <ChevronRight size={14} />
              <span className="text-[#990000] font-black truncate max-w-xs">{selectedItem.title}</span>
            </div>

            {/* Full Width Dedicated Content Layout */}
            <div className="w-full space-y-6">
              <div className="w-full space-y-6">
                {/* Hero Banner Image */}
                {selectedItem.imageUrl && (
                  <div className="w-full h-72 md:h-96 rounded-3xl overflow-hidden shadow-xl relative bg-black">
                    {/* Blurred background layer for aesthetic fit */}
                    <img src={selectedItem.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-2xl" />
                    {/* Main image fully contained */}
                    <img src={selectedItem.imageUrl} alt={selectedItem.title} className="absolute inset-0 w-full h-full object-contain p-4" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                      <span className="bg-[#990000] text-white text-xs font-black px-3.5 py-1.5 rounded-lg uppercase tracking-wider mb-3 inline-block">
                        {selectedItem.category || selectedItem.badge || 'Resmi Duyuru'}
                      </span>
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight drop-shadow-md">{selectedItem.title}</h1>
                    </div>
                  </div>
                )}

                {!selectedItem.imageUrl && (
                  <div className="bg-[#0A2342] text-white p-8 rounded-3xl shadow-xl">
                    <span className="bg-[#990000] text-white text-xs font-black px-3.5 py-1.5 rounded-lg uppercase tracking-wider mb-3 inline-block">
                      {selectedItem.category || selectedItem.badge || 'Resmi Duyuru'}
                    </span>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight">{selectedItem.title}</h1>
                  </div>
                )}

                {/* Metadata Bar */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                    <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-xl">
                      <Calendar size={16} className="text-[#990000]" /> {selectedItem.date || 'Güncel'}
                    </div>
                    {selectedItem.location && (
                      <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-xl">
                        <MapPin size={16} className="text-[#990000]" /> {selectedItem.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl">
                      <ShieldCheck size={16} /> Doğrulanmış Yayın Verisi
                    </div>
                  </div>

                  {selectedItem.url && (
                    <a
                      href={selectedItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Orijinal Bağlantı <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                {/* Main Rich Content & Full Width Tables */}
                <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-200 shadow-sm">
                  <RichContentRenderer content={selectedItem.content || selectedItem.description} />

                  {/* Full Width Tuition Accordion */}
                  {(selectedItem.title?.includes('Ücret') || selectedItem.title?.includes('Tercih') || selectedItem.title?.includes('İndirim') || selectedItem.category?.includes('Burs')) && (
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <TuitionAccordion />
                    </div>
                  )}

                  {/* Official Team Grid (Ekip & Kadro) */}
                  {(selectedItem.category === "Kurumsal" || selectedItem.title?.includes("Kariyer Geliştirme")) && (
                    <div className="mt-10 pt-10 border-t border-gray-100">
                      <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <Users className="text-[#990000]" size={28} />
                        Ekip & İletişim (Resmî Kadro)
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                          { name: "Öğr. Gör. Mutlu Gülsev YAĞIZ", title: "Müdür", phone: "444 9 123", email: "mutluyagiz@esenyurt.edu.tr", img: "https://www.esenyurt.edu.tr/uploads/staffs/278.jpg" },
                          { name: "Zuhal ŞAHİN", title: "Memur", email: "zuhalsahin@esenyurt.edu.tr", img: "https://www.esenyurt.edu.tr/uploads/staffs/405.jpg" }
                        ].map((member, idx) => (
                          <div key={idx} className="bg-slate-50 rounded-2xl p-5 flex items-center gap-5 border border-slate-200 hover:shadow-lg transition-all group hover:-translate-y-1">
                            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden shrink-0 border-4 border-white shadow-md group-hover:scale-105 transition-transform">
                              <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="text-[15px] font-black text-gray-900 mb-0.5 leading-tight">{member.name}</h4>
                              <p className="text-xs font-extrabold text-[#990000] mb-2">{member.title}</p>
                              {member.email && <div className="text-[11px] font-medium text-gray-600 flex items-center gap-1.5 mb-1"><Mail size={12} className="text-gray-400"/> {member.email}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Full Width Edge-to-Edge SubPanelFooter Integration */}
                <div className="mt-16 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-0 pb-0">
                  <SubPanelFooter setView={(v) => {
                    if (v === 'gizlilik') { setSelectedItem(legalData.gizlilik); return; }
                    if (v === 'kullanim') { setSelectedItem(legalData.kullanim); return; }
                    if (v === 'kvkk') { setSelectedItem(legalData.kvkk); return; }
                    setSelectedItem(null);
                    if (setView) setView(v);
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Pill Informative Modal */}
      {selectedPillModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl text-slate-800 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close X Button */}
            <button 
              onClick={() => setSelectedPillModal(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition flex items-center justify-center font-black cursor-pointer shadow-sm border border-slate-200"
              title="Kapat"
            >
              ✕
            </button>

            {/* Header Badge & Title */}
            <div className="mb-4 pr-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#990000] bg-red-50 px-3 py-1 rounded-full border border-red-100 inline-block mb-2">
                {selectedPillModal.badge}
              </span>
              <h3 className="text-2xl font-black text-slate-900 leading-tight">
                {selectedPillModal.title}
              </h3>
            </div>

            {/* Feature Banner Image */}
            {selectedPillModal.imageUrl && (
              <div className="h-44 w-full rounded-2xl overflow-hidden mb-5 border border-slate-100 shadow-inner">
                <img src={selectedPillModal.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Description & Feature List */}
            <div className="space-y-4 mb-8">
              <p className="text-xs font-medium text-slate-600 leading-relaxed">
                {selectedPillModal.desc}
              </p>

              {selectedPillModal.features && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <span className="text-[11px] font-black text-slate-900 block mb-1">
                    📌 Portala Özel Sunulan İmkânlar:
                  </span>
                  {selectedPillModal.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#990000] shrink-0"></span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Portal Entry & Detail View Buttons */}
            <div className="flex gap-3">
              {selectedPillModal.targetView && (
                <button
                  onClick={() => {
                    const target = selectedPillModal.targetView;
                    setSelectedPillModal(null);
                    if (setView) setView(target);
                  }}
                  className="flex-1 py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl text-xs uppercase tracking-widest transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  Detaylı İncele <ArrowRight size={16} />
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedPillModal(null);
                  if (setView) setView('login');
                }}
                className="flex-1 py-4 bg-[#990000] hover:bg-red-800 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                Giriş Yap <LogIn size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


