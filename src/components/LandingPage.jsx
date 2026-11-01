import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, ArrowLeft, Printer, Mail, MapPin, Download, FileText, ExternalLink, X, LogIn, Briefcase, Search, Users, Handshake, TrendingUp, Target, Sparkles, Zap, GraduationCap, Building, ChevronRight, ShieldCheck, Heart, MessageSquare, Send, Bookmark } from 'lucide-react';
import * as Icons from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { liveSliderData, liveNewsData, liveEventData, liveAnnouncementData } from '../utils/liveData';
import Logo from './Logo';
import MainHeader from './MainHeader';
import SpotlightCard from './shared/SpotlightCard';
import HeroSlider from './landing/HeroSlider';
import SubPanelFooter from './SubPanelFooter';
import SEO from './SEO';
import RichContentRenderer from './RichContentRenderer';
import TuitionAccordion from './TuitionAccordion';
import SafeAvatar from './shared/SafeAvatar';
import SafeEventImage from './shared/SafeEventImage';
import { getTenantConfig } from '../config/tenantConfig';
import { cleanScrapedText, normalizeTitleForDedup, normalizeScrapedImageUrl } from '../services/scraper';

export default function LandingPage({ setView, currentUser, userRole }) {
  const tenant = getTenantConfig();
  const [selectedItem, setSelectedItemState] = useState(null);

  const setSelectedItem = React.useCallback((item) => {
    setSelectedItemState(item);
    try {
      if (typeof window !== 'undefined' && window.history) {
        if (item) {
          window.history.pushState({ iesuDetailModal: true }, '');
        }
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setSelectedItemState(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [selectedPillModal, setSelectedPillModal] = useState(null);
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

  const rawNews = useAppStore(state => state.news) || [];
  const rawAnnouncements = useAppStore(state => state.announcements) || [];
  const rawEvents = useAppStore(state => state.events) || [];
  const showInstitutionalStats = useAppStore(state => state.showInstitutionalStats);
  const institutionalStatsData = useAppStore(state => state.institutionalStatsData);
  const siteConfig = useAppStore(state => state.siteConfig);
  const refreshScrapedData = useAppStore(state => state.refreshScrapedData);
  const hydrateFromFirestore = useAppStore(state => state.hydrateFromFirestore);

  // Silent background service: hydrates from Firestore `news` and `events` and periodically scrapes esenyurt.edu.tr
  useEffect(() => {
    const isTestEnv = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || import.meta.env?.MODE === 'test');
    if (isTestEnv) return undefined;

    let stopService = null;
    import('../services/backgroundScraperService')
      .then(({ startBackgroundScraperService }) => {
        stopService = startBackgroundScraperService({
          intervalMs: 15 * 60 * 1000,
          onUpdate: (payload) => {
            if (!payload) return;
            const st = useAppStore.getState();
            if (Array.isArray(payload.news) && payload.news.length > 0) st.setNews?.(payload.news);
            if (Array.isArray(payload.events) && payload.events.length > 0) st.setEvents?.(payload.events);
            if (Array.isArray(payload.announcements) && payload.announcements.length > 0) st.setAnnouncements?.(payload.announcements);
            if (Array.isArray(payload.socialMedia) && payload.socialMedia.length > 0) st.setSocialMedia?.(payload.socialMedia);
          }
        });
      })
      .catch(() => {
        if (typeof hydrateFromFirestore === 'function') hydrateFromFirestore().catch(() => {});
        if (typeof refreshScrapedData === 'function') refreshScrapedData(false).catch(() => {});
      });

    return () => {
      if (typeof stopService === 'function') stopService();
    };
  }, [hydrateFromFirestore, refreshScrapedData]);

  const cleanFeedText = React.useCallback((str = '') => {
    return cleanScrapedText(str);
  }, []);

  const { news, events, validAnnouncements } = React.useMemo(() => {
    const navStopTitles = new Set([
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
      'staj',
      'danışmanlar',
      'misyon ve vizyon'
    ]);

    const seenTitles = new Set();
    const seenNewsImgs = new Set();
    const seenEventImgs = new Set();

    const dedupNews = [];
    for (const item of [...(rawNews || []), ...(liveNewsData || [])]) {
      const cleaned = cleanFeedText(item?.title || '');
      const key = normalizeTitleForDedup(cleaned);
      if (!key || key.length < 6 || seenTitles.has(key)) continue;
      const img = normalizeScrapedImageUrl(item?.imageUrl || item?.image || '', 'news');
      const isUniqueUpload =
        img.includes('/uploads/') &&
        !img.includes('bm3ic54a7zlig-2026-ozyes') &&
        !img.includes('ygwdtig4tykmo-cumhuriyetimizin-103-yil-donumu');
      if (isUniqueUpload && seenNewsImgs.has(img)) continue;
      seenTitles.add(key);
      if (isUniqueUpload) seenNewsImgs.add(img);
      dedupNews.push({ ...item, title: cleaned, imageUrl: img });
    }

    const dedupEvents = [];
    for (const item of [...(rawEvents || []), ...(liveEventData || [])]) {
      const cleaned = cleanFeedText(item?.title || '');
      const key = normalizeTitleForDedup(cleaned);
      if (!key || key.length < 6 || seenTitles.has(key)) continue;
      const img = normalizeScrapedImageUrl(item?.imageUrl || item?.image || '', 'event');
      const isUniqueUpload =
        img.includes('/uploads/') &&
        !img.includes('nz19buzmdccs4-mimari-kultur-ve-sanat-kulubunden');
      if (isUniqueUpload && seenEventImgs.has(img)) continue;
      seenTitles.add(key);
      if (isUniqueUpload) seenEventImgs.add(img);
      dedupEvents.push({ ...item, title: cleaned, imageUrl: img });
    }

    const dedupAnnouncements = [];
    for (const item of [...(rawAnnouncements || []), ...(liveAnnouncementData || [])]) {
      const cleaned = cleanFeedText(item?.title || '');
      const key = normalizeTitleForDedup(cleaned);
      if (!cleaned || cleaned.length < 15) continue;
      if (!key || navStopTitles.has(cleaned.toLocaleLowerCase('tr-TR')) || seenTitles.has(key)) continue;
      seenTitles.add(key);
      dedupAnnouncements.push({
        ...item,
        title: cleaned,
        imageUrl: normalizeScrapedImageUrl(item?.imageUrl || item?.image || '', 'announcement')
      });
    }

    return {
      news: dedupNews,
      events: dedupEvents,
      validAnnouncements: dedupAnnouncements
    };
  }, [rawNews, rawEvents, rawAnnouncements, cleanFeedText]);

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
      date: "Güncel takvim için resmî duyuruları izleyin",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2026/05/wuyeismnf35tr-bahar-senligi.jpg",
      content: `### Etkinlik takvimi\n\nGüncel etkinlik tarihleri, başvuru koşulları ve katılım bilgileri için üniversitenin resmî duyurularını kontrol edin. Bu portalda güncel etkinlik kaydı yoksa geçmiş tarihler yaklaşan etkinlik gibi gösterilmez.`
    },
    contact_us: {
      title: "Kariyer Geliştirme Merkezi İletişim Bilgileri",
      category: "İletişim & Ulaşım",
      date: "İletişim ve çalışma saatleri",
      imageUrl: "https://www.esenyurt.edu.tr/uploads/2024/06/km1geeaqjq2ly-aday-ogrenci.png",
      content: `### Kariyer Geliştirme Merkezi ile iletişim\n\nGüncel adres ve telefon bilgileri için üniversitenin resmî kariyer merkezi iletişim sayfasını kullanın.\n\n- **Adres:** Zafer Mah. Adile Naşit Bulv. No:1, Esenyurt / İstanbul\n- **Santral:** 444 9 123\n- **Kariyer Merkezi:** 444 9 123 / 1322\n- **E-posta:** kariyer@esenyurt.edu.tr\n\n[Resmî iletişim sayfası](https://www.esenyurt.edu.tr/icerik/3223-kariyer-gelistirme-merkezi-koordinatorlugu-iletisim)`
    }
  }), []);

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
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-gray-800 dark:text-slate-100 transition-colors duration-300">


      <SEO 
        title="Ana Sayfa" 
        description="İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü"
        url="https://kariyer.esenyurt.edu.tr/"
      />



      {/* Dynamic Announcement Banner (Controlled via Super Admin CMSSiteEditor) */}
      {siteConfig?.announcementBanner?.visible && siteConfig?.announcementBanner?.text && (
        <aside 
          aria-label="Acil Sistem Duyurusu" 
          className={`text-white text-xs font-bold py-2.5 px-4 text-center sticky top-0 z-50 shadow-md flex items-center justify-center gap-2 border-b transition-colors duration-300 ${
            siteConfig.announcementBanner.color === 'amber' ? 'bg-amber-600 border-amber-700' :
            siteConfig.announcementBanner.color === 'green' ? 'bg-emerald-600 border-emerald-700' :
            siteConfig.announcementBanner.color === 'blue' ? 'bg-blue-600 border-blue-700' :
            'bg-[#990000] border-red-800'
          }`}
        >
          <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider">Duyuru</span>
          <span>{siteConfig.announcementBanner.text}</span>
          {siteConfig.announcementBanner.link && (
            <a 
              href={siteConfig.announcementBanner.link} 
              className="underline text-red-100 hover:text-white font-black ml-1 text-xs inline-flex items-center gap-1 transition-colors"
            >
              İncele →
            </a>
          )}
        </aside>
      )}

      {/* Unified Main Header for identical alignment */}
      <MainHeader setView={setView} currentUser={currentUser} userRole={userRole} />

      {/* Hero Slider with internal detail modal on click and visual CMS overlay */}
      <HeroSlider slides={heroSlides} onSelectSlide={setSelectedItem} setView={setView} />

      {/* 1. INSTITUTIONAL STATISTICAL RIBBON (Controlled via Admin Panel) */}
      {showInstitutionalStats && (
        <section className="relative z-10 pt-10 pb-6 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(institutionalStatsData || []).map((stat) => (
              <div key={stat.id} className="bg-slate-50/80 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-4 hover:border-[#990000]/30 transition-colors shadow-sm">
                <div className="p-3 bg-red-50 dark:bg-red-950/60 text-[#990000] dark:text-red-400 rounded-xl shrink-0">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{stat.val}</h4>
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{stat.title}</p>
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
                desc: 'Girişimcilik ve kuluçka merkeziyle ilgili güncel hizmetleri, başvuru koşullarını ve iletişim bilgilerini üniversitenin resmî duyurularından takip edin.',
                features: [
                  'Güncel program ve etkinlik duyuruları',
                  'Başvuru ve katılım koşulları',
                  'Merkez iletişim bilgileri'
                ],
                targetView: 'startup_incubator'
              })} 
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl rounded-full px-6 py-3 flex items-center gap-3 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <div className="bg-indigo-100 dark:bg-red-950/60 p-1.5 rounded-full text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white transition-colors"><Building size={18} /></div>
              <span className="font-bold text-red-900 dark:text-slate-100 text-[13px]">İESÜMER Kuluçka & Girişimcilik</span>
            </button>

            <button 
              onClick={() => setSelectedPillModal({
                id: 'staj',
                title: 'CBİKO Ulusal Staj & Yetenek Kapısı',
                badge: '💼 Kariyer & İstihdam',
                imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=60',
                desc: 'Ulusal Staj Programı ve Yetenek Kapısı için güncel başvuru tarihlerini, koşulları ve fırsatları ilgili resmî platformlardan kontrol edin.',
                features: [
                  'Resmî başvuru takvimi ve koşulları',
                  'Yayımlanan staj fırsatları',
                  'Kariyer merkezi iletişim bilgileri'
                ],
                targetView: 'staj'
              })} 
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl rounded-full px-6 py-3 flex items-center gap-3 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <div className="bg-emerald-100 dark:bg-emerald-950/60 p-1.5 rounded-full text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Target size={18} /></div>
              <span className="font-bold text-red-900 dark:text-slate-100 text-[13px]">Yetenek & Staj Kapısı</span>
            </button>

            <button 
              onClick={() => setSelectedPillModal({
                id: 'cvbuilder',
                title: 'Özgeçmiş & CV Oluşturucu',
                badge: '🤖 Kariyer Asistanı',
                imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60',
                desc: 'CV oluşturucu ile profil bilgilerinizden özgeçmiş taslağı hazırlayın; başvuru öncesi bilgilerinizi kontrol edin.',
                features: [
                  'Profil bilgilerini kullanarak CV taslağı hazırlama',
                  'İçeriği gözden geçirip düzenleme',
                  'Mevcut dışa aktarma seçeneklerini kullanma'
                ],
                targetView: 'cvbuilder'
              })} 
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl rounded-full px-6 py-3 flex items-center gap-3 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <div className="bg-purple-100 dark:bg-purple-950/60 p-1.5 rounded-full text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors"><FileText size={18} /></div>
              <span className="font-bold text-red-900 dark:text-slate-100 text-[13px]">Özgeçmiş & CV Oluşturucu</span>
            </button>
          </div>
        </section>

      {/* 3. BENTO BOX GRID: GELECEĞİN YETENEKLERİ (ULTRA PREMIUM CORPORATE) */}
      <section className="py-20 sm:py-28 bg-[#fdfdfd] dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
        {/* Subtle Corporate Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight text-[#990000] dark:text-red-400">
              Geleceğe Odaklan.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed">
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
              <p className="text-red-100 text-sm font-medium mb-8 max-w-md leading-relaxed opacity-90">Ulusal Staj Programı ve Yetenek Kapısı hakkındaki güncel başvuru bilgilerini resmî platformlardan inceleyin.</p>
                  <button type="button" className="bg-white text-[#990000] px-7 py-3 rounded-full font-bold text-[13px] w-max hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-xl shadow-black/10 z-20 cursor-pointer relative">Detayları İncele <ArrowRight size={16}/></button>
                </div>
              </div>
            </SpotlightCard>

            {/* Bento 2: Kariyer Danışmanlığı & Değerlendirme */}
            <SpotlightCard 
              spotlightColor="rgba(10,35,66,0.05)" 
              className="col-span-1 row-span-1 md:col-start-3 md:row-start-1 p-6 md:p-8 flex flex-col !bg-white dark:!bg-slate-900 cursor-pointer hover:-translate-y-1 transition-transform border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl"
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
              <div className="w-12 h-12 bg-red-50/80 dark:bg-red-950/50 rounded-xl flex items-center justify-center text-[#990000] dark:text-red-400 mb-5 border border-red-100/50 dark:border-red-900/40">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Kariyer Danışmanlığı</h3>
              <p className="text-gray-500 dark:text-slate-400 text-[13px] font-medium leading-relaxed">Kariyer hedeflerinizi belirleme ve başvuru hazırlığınızı güçlendirme konusunda bilgi alın.</p>
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
              className="col-span-1 row-span-1 md:col-start-3 md:row-start-2 p-6 md:p-8 flex flex-col justify-center items-center text-center !bg-white dark:!bg-slate-900 cursor-pointer hover:-translate-y-1 transition-transform border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl"
              onClick={() => setSelectedPillModal({
                id: 'bento_isbirlikleri',
                title: 'Kurumsal Sektör İşbirlikleri & Protokoller',
                badge: '🤝 İşveren duyuruları',
                imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=60',
                desc: 'Güncel işveren etkinlikleri, ilanlar ve iş birliği duyuruları yayımlandıkça burada görüntülenir.',
                features: [
                  'Yayımlanan iş ve staj ilanları',
                  'Güncel kariyer etkinlikleri',
                  'İşveren iş birliği duyuruları'
                ],
                targetView: 'about_us'
              })}
            >
              <div className="w-14 h-14 bg-red-50/80 dark:bg-red-950/50 rounded-2xl flex items-center justify-center text-[#990000] dark:text-red-400 mb-4 border border-red-100/50 dark:border-red-900/40">
                <Handshake size={28} />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1 tracking-tight">İşbirliklerimiz</h3>
              <p className="text-gray-500 dark:text-slate-400 text-[12px] font-medium leading-relaxed">Güncel işveren etkinlikleri ve iş birliği duyurularını takip edin.</p>
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
                desc: 'Kariyer alanlarına ilişkin araştırma ve içerikler yayımlandıkça bu bölümde paylaşılır.',
                features: [
                  'Güncel kariyer içerikleri',
                  'Araştırma duyuruları',
                  'Sektörel etkinlikler'
                ],
                targetView: 'research_hub'
              })}
            >
              <div>
                <h3 className="text-lg font-black mb-2 tracking-tight text-white/90">Araştırma Faaliyetleri</h3>
                <p className="text-gray-400 text-[12px] font-medium mb-6 leading-relaxed">Kariyer alanlarına ilişkin güncel içerik ve araştırma duyuruları.</p>
              </div>
              <div className="flex justify-between items-end">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-300 border border-white/10"><Search size={20} /></div>
                <ArrowRight size={20} className="text-gray-500" />
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* 4. ETKİNLİKLER VE HABERLER */}
      <section
        id="etkinlikler-ve-haberler"
        data-testid="landing-events-news-section"
        className="py-20 sm:py-28 bg-[#f8f9fc] dark:bg-slate-900/50 relative transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-black text-[#990000] dark:text-red-400 mb-2 tracking-tight">Etkinlikler ve Haberler</h2>
              <p className="text-gray-500 dark:text-slate-400 font-medium">Üniversitemizdeki son gelişmeleri, etkinlikleri ve duyuruları takip edin.</p>
            </div>
            <button onClick={() => setView('haberler')} className="text-red-600 dark:text-red-400 font-bold flex items-center gap-2 hover:gap-3 transition-all cursor-pointer">
              Tümünü Gör <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[260px]">
            {/* Top Left: Featured News (Large) */}
            {news[0] && (
              <div onClick={() => setSelectedItem(news[0])} className="md:col-span-2 md:row-span-2 relative bg-slate-950 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-2xl transition-all duration-500">
                <SafeEventImage
                  src={news[0].imageUrl}
                  alt={news[0].title}
                  fallbackType="news"
                  mode="poster"
                  className="absolute inset-0 w-full h-full"
                />
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent pointer-events-none"></div>
                <div className="absolute top-6 left-6 z-30">
                  <span className="bg-red-600 text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">Öne Çıkan Haber</span>
                </div>
                <div className="absolute bottom-8 left-8 right-8 z-30">
                  <div className="flex items-center gap-2 text-gray-300 text-sm font-bold mb-3">
                    <Calendar size={16} /> {news[0].date || 'Yakın Zaman'}
                  </div>
                  <h3 className="text-2xl md:text-2xl font-black text-white leading-tight mb-6 group-hover:text-red-100 transition-colors">{cleanFeedText(news[0].title)}</h3>
                  <div className="inline-flex items-center gap-2 text-white font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full transition-all text-sm">
                    İçeriği Oku <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            )}

            {/* Top Right: Announcements List */}
            <div className="md:col-span-1 md:row-span-2 bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 dark:bg-red-950/30 rounded-bl-full -z-10"></div>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center">
                  <Icons.Bell size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Duyurular</h3>
              </div>

              <div className="flex flex-col gap-6 flex-grow">
                {validAnnouncements.slice(0, 3).map((ann, idx) => {
                  const cleanAnnTitle = cleanFeedText(ann.title || '');

                  return (
                    <div key={ann.id || idx} className="group cursor-pointer border-l-2 border-transparent hover:border-red-500 pl-4 -ml-4 transition-all" onClick={() => setSelectedItem(ann)}>
                      <p className="text-[11px] font-black text-red-500 dark:text-red-400 uppercase tracking-wider mb-1">{ann.date || 'Yakın Zaman'}</p>
                      <h4 className="text-[13px] font-bold text-gray-800 dark:text-slate-200 leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">{cleanAnnTitle}</h4>
                    </div>
                  );
                })}
              </div>

              <button onClick={() => setView('duyurular')} className="mt-8 w-full py-3 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 text-sm font-bold hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-400 transition-all flex items-center justify-center gap-2 cursor-pointer">
                Tüm Duyurular <ChevronRight size={16} />
              </button>
            </div>

            {/* Bottom Row: Event 1 */}
            {events[0] && (
              <div onClick={() => setSelectedItem(events[0])} className="col-span-1 row-span-1 relative bg-slate-900 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all">
                <SafeEventImage
                  src={events[0].imageUrl}
                  alt={events[0].title}
                  fallbackType="event"
                  mode="poster"
                  className="absolute inset-0 w-full h-full"
                />
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-5 left-5 right-5 z-30">
                  <span className="bg-red-600/90 backdrop-blur text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Etkinlik Afişi</span>
                  <h3 className="text-white font-bold leading-tight line-clamp-2 text-sm md:text-base group-hover:text-indigo-200 transition-colors">{cleanFeedText(events[0].title)}</h3>
                </div>
              </div>
            )}

            {/* Bottom Row: Event 2 */}
            {events[1] && (
              <div onClick={() => setSelectedItem(events[1])} className="col-span-1 row-span-1 relative bg-slate-900 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all">
                <SafeEventImage
                  src={events[1].imageUrl}
                  alt={events[1].title}
                  fallbackType="event"
                  mode="poster"
                  className="absolute inset-0 w-full h-full"
                />
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-5 left-5 right-5 z-30">
                  <span className="bg-red-600/90 backdrop-blur text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Etkinlik Afişi</span>
                  <h3 className="text-white font-bold leading-tight line-clamp-2 text-sm md:text-base group-hover:text-red-200 transition-colors">{cleanFeedText(events[1].title)}</h3>
                </div>
              </div>
            )}

            {/* Bottom Row: News 2 */}
            {news[1] && (
              <div onClick={() => setSelectedItem(news[1])} className="col-span-1 row-span-1 relative bg-slate-900 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all">
                <SafeEventImage
                  src={news[1].imageUrl}
                  alt={news[1].title}
                  fallbackType="news"
                  mode="cover"
                  className="absolute inset-0 w-full h-full"
                />
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-5 left-5 right-5 z-30">
                  <span className="bg-emerald-600/90 backdrop-blur text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Haber</span>
                  <h3 className="text-white font-bold leading-tight line-clamp-2 text-sm md:text-base group-hover:text-emerald-200 transition-colors">{cleanFeedText(news[1].title)}</h3>
                </div>
              </div>
            )}
          </div>

          {/* GÜNCEL ETKİNLİK AFİŞLERİ VİTRİNİ */}
          {events.length > 0 && (
            <div className="mt-14" data-testid="landing-event-posters-showcase">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#990000] dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-3.5 py-1 rounded-full border border-red-100 dark:border-red-900/50 mb-2">
                    <Sparkles size={13} /> Resmî Kampüs Takvimi
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Güncel Etkinlik Afişleri
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setView && setView('etkinlikler')}
                  className="inline-flex items-center gap-2 text-xs font-black text-white bg-[#990000] hover:bg-red-800 px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer self-start sm:self-auto"
                >
                  Tüm Etkinlik Afişlerini Gör <ArrowRight size={15} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {events.slice(0, 6).map((evt, idx) => (
                  <div
                    key={evt.id || idx}
                    onClick={() => setSelectedItem(evt)}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                    data-testid={`landing-event-poster-${idx}`}
                  >
                    <div className="aspect-[4/5] w-full relative overflow-hidden bg-slate-100">
                      <SafeEventImage
                        src={evt.imageUrl}
                        alt={evt.title}
                        fallbackType="event"
                        mode="poster"
                        className="w-full h-full"
                      />
                      <div className="absolute top-2.5 left-2.5 z-20">
                        <span className="bg-[#990000]/95 backdrop-blur-xs text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                          {evt.date || 'Etkinlik'}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 group-hover:text-[#990000] dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                        {cleanFeedText(evt.title)}
                      </h4>
                      <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#990000] dark:text-red-400">
                        Afişi İncele <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
        <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-slate-950 overflow-y-auto overflow-x-hidden animate-fade-in flex flex-col">
          {/* Unified Main Header */}
          <MainHeader
            setView={(v) => {
              setSelectedItem(null);
              if (setView) setView(v);
            }}
            currentUser={currentUser}
            userRole={userRole}
          />

          {/* Full Container Content */}
          <div className="max-w-7xl w-full mx-auto px-4 pt-8 pb-16 flex-grow">
            {/* Interactive Breadcrumb */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-slate-400">
                <button 
                  type="button"
                  onClick={() => { setSelectedItem(null); setView && setView('landing'); }} 
                  className="hover:text-[#990000] dark:hover:text-red-400 hover:underline transition cursor-pointer"
                >
                  Ana Sayfa
                </button>
                <ChevronRight size={14} />
                <button 
                  type="button"
                  onClick={() => { setSelectedItem(null); setView && setView('duyurular'); }} 
                  className="hover:text-[#990000] dark:hover:text-red-400 hover:underline transition cursor-pointer"
                >
                  Duyurular & Haberler
                </button>
                <ChevronRight size={14} />
                <span className="text-[#990000] dark:text-red-400 font-black truncate max-w-xs">{selectedItem.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-xs font-bold text-gray-700 dark:text-slate-200 hover:text-[#990000] dark:hover:text-red-400 hover:border-red-200 transition shadow-sm cursor-pointer"
              >
                <X size={14} /> Kapat
              </button>
            </div>

            {/* Full Width Dedicated Content Layout */}
            <div className="w-full space-y-6">
              <div className="w-full space-y-6">
                {/* Hero Banner Image */}
                {selectedItem.imageUrl && (
                  <div className="w-full h-80 md:h-[460px] rounded-3xl overflow-hidden shadow-xl relative bg-slate-950">
                    <SafeEventImage
                      src={selectedItem.imageUrl}
                      alt={selectedItem.title}
                      fallbackType="event"
                      mode="contain"
                      className="absolute inset-0 w-full h-full bg-slate-950"
                      imgClassName="p-3"
                    />
                    <div className="absolute inset-0 z-20 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white z-30">
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
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                      <Calendar size={16} className="text-[#990000] dark:text-red-400" /> {selectedItem.date || 'Güncel'}
                    </div>
                    {selectedItem.location && (
                      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                        <MapPin size={16} className="text-[#990000] dark:text-red-400" /> {selectedItem.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl">
                      <ShieldCheck size={16} /> Doğrulanmış Yayın Verisi
                    </div>
                  </div>

                  {selectedItem.url && (
                    <a
                      href={selectedItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      Orijinal Bağlantı <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                {/* Main Rich Content & Full Width Tables */}
                <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm">
                  <RichContentRenderer content={selectedItem.content || selectedItem.description} />

                  {/* Full Width Tuition Accordion */}
                  {(selectedItem.title?.includes('Ücret') || selectedItem.title?.includes('Tercih') || selectedItem.title?.includes('İndirim') || selectedItem.category?.includes('Burs')) && (
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-800">
                      <TuitionAccordion />
                    </div>
                  )}

                  {/* Official Team Grid (Ekip & Kadro) */}
                  {(selectedItem.category === "Kurumsal" || selectedItem.title?.includes("Kariyer Geliştirme")) && (
                    <div className="mt-10 pt-10 border-t border-gray-100 dark:border-slate-800">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <Users className="text-[#990000] dark:text-red-400" size={28} />
                        Ekip & İletişim (Resmî Kadro)
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                          { name: "Kariyer Geliştirme Koordinatörlüğü", title: "Müdür", phone: "444 9 123", email: "kgm@iesu.edu.tr", img: "https://www.esenyurt.edu.tr/uploads/staffs/278.jpg" },
                          { name: "Kariyer Geliştirme Koordinatörlüğü", title: "Memur", email: "zuhalsahin@esenyurt.edu.tr", img: "https://www.esenyurt.edu.tr/uploads/staffs/405.jpg" }
                        ].map((member, idx) => (
                          <div key={idx} className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-5 flex items-center gap-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all group hover:-translate-y-1">
                            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden shrink-0 border-4 border-white dark:border-slate-700 shadow-md group-hover:scale-105 transition-transform">
                              <SafeAvatar src={member.img} name={member.name} size={80} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="text-[15px] font-black text-gray-900 dark:text-white mb-0.5 leading-tight">{member.name}</h4>
                              <p className="text-xs font-extrabold text-[#990000] dark:text-red-400 mb-2">{member.title}</p>
                              {member.email && <div className="text-[11px] font-medium text-gray-600 dark:text-slate-300 flex items-center gap-1.5 mb-1"><Mail size={12} className="text-gray-400"/> {member.email}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Full Width SubPanelFooter without horizontal overflow hack */}
          <SubPanelFooter setView={(v) => {
            if (v === 'gizlilik') { setSelectedItem(legalData.gizlilik); return; }
            if (v === 'kullanim') { setSelectedItem(legalData.kullanim); return; }
            if (v === 'kvkk') { setSelectedItem(legalData.kvkk); return; }
            setSelectedItem(null);
            if (setView) setView(v);
          }} />
        </div>
      )}

      {/* Action Pill Informative Modal */}
      {selectedPillModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl text-slate-800 dark:text-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close X Button */}
            <button 
              onClick={() => setSelectedPillModal(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/60 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition flex items-center justify-center font-black cursor-pointer shadow-sm border border-slate-200 dark:border-slate-700"
              title="Kapat"
            >
              ✕
            </button>

            {/* Header Badge & Title */}
            <div className="mb-4 pr-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#990000] dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-3 py-1 rounded-full border border-red-100 dark:border-red-900/50 inline-block mb-2">
                {selectedPillModal.badge}
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {selectedPillModal.title}
              </h3>
            </div>

            {/* Feature Banner Image */}
            {selectedPillModal.imageUrl && (
              <div className="h-44 w-full rounded-2xl overflow-hidden mb-5 border border-slate-100 dark:border-slate-800 shadow-inner">
                <img src={selectedPillModal.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Description & Feature List */}
            <div className="space-y-4 mb-8">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedPillModal.desc}
              </p>

              {selectedPillModal.features && (
                <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <span className="text-[11px] font-black text-slate-900 dark:text-white block mb-1">
                    📌 Portala Özel Sunulan İmkânlar:
                  </span>
                  {selectedPillModal.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#990000] dark:bg-red-400 shrink-0"></span>
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
                    const protectedViews = ['student_kgb', 'staj', 'mentor_match', 'cvbuilder', 'startup_incubator', 'incubator', 'research_hub'];
                    if (protectedViews.includes(target)) {
                      if (currentUser) { setView && setView(target); }
                      else { setView && setView('login'); }
                    } else if (setView) {
                      setView(target);
                    }
                  }}
                  className="flex-1 py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl text-xs uppercase tracking-widest transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  Detaylı İncele <ArrowRight size={16} />
                </button>
              )}

              {!currentUser && (
                <button
                  onClick={() => {
                    setSelectedPillModal(null);
                    if (setView) setView('login');
                  }}
                  className="flex-1 py-4 bg-[#990000] hover:bg-red-800 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  Giriş Yap <LogIn size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

