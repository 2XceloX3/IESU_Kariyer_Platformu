import React, { useState, useMemo } from 'react';
import SafeAvatar from './shared/SafeAvatar';
import { 
  Users, Trophy, Zap, Star, Search, Plus, Bell, ChevronRight, 
  Map, Activity, Heart, MessageCircle, Share2, Play, Building2,
  Calendar, CheckCircle2, Award, Briefcase, Sparkles, Navigation,
  Globe, Radio, Mic, Headset, UserCircle2, X, Send, Crown, FileText,
  Bookmark, ExternalLink, ShieldCheck, ArrowRight, Compass, GraduationCap, MapPin
} from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';
import Logo from './Logo';
import SubPanelFooter from './SubPanelFooter';
import useAppStore from '../store/useAppStore';
import { combineFeedItems } from '../utils/feedCombiner';
import PostCard from './PostCard';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import { toast } from './shared/Toast';

export default function BirlikAgiPortal({ currentUser, setView, previousView, setSelectedGroupId, setSelectedUserId, userRole, academicRole }) {
  const posts = useAppStore(state => state.posts);
  const setPosts = useAppStore(state => state.setPosts);
  const events = useAppStore(state => state.events) || [];
  const news = useAppStore(state => state.news) || [];
  const announcements = useAppStore(state => state.announcements) || [];
  const jobs = useAppStore(state => state.jobs) || [];
  const generalEvents = useAppStore(state => state.generalEvents) || [];
  const careerOpportunities = useAppStore(state => state.careerOpportunities) || [];
  const students = useAppStore(state => state.students) || [];
  const alumni = useAppStore(state => state.alumni) || [];
  const alumniAssocBoard = useAppStore(state => state.alumniAssocBoard) || [];
  const alumniAssocApplications = useAppStore(state => state.alumniAssocApplications) || [];
  const featureAlumniAssocToggle = useAppStore(state => state.featureAlumniAssocToggle);
  const notifications = useAppStore(state => state.notifications) || [];
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'network' | 'events' | 'board' | 'apply'

  // Interactive Committee Membership State (persisted)
  const [joinedCommittees, setJoinedCommittees] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('iesu_alumni_committees_v1') || '["kom-1"]');
      return Array.isArray(saved) ? saved : ['kom-1'];
    } catch (_) {
      return ['kom-1'];
    }
  });

  // Interactive Alumni Event RSVP State (persisted)
  const [rsvpEventIds, setRsvpEventIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('iesu_alumni_rsvp_v1') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (_) {
      return [];
    }
  });

  const handleToggleCommittee = (komId, komTitle) => {
    setJoinedCommittees(prev => {
      const exists = prev.includes(komId);
      const next = exists ? prev.filter(id => id !== komId) : [...prev, komId];
      try {
        localStorage.setItem('iesu_alumni_committees_v1', JSON.stringify(next));
      } catch (_) {}
      toast.success(
        exists
          ? `${komTitle} üyeliğinizden ayrıldınız.`
          : `${komTitle} çalışma grubuna katıldınız!`
      );
      return next;
    });
  };

  const handleToggleEventRsvp = (evId, evTitle) => {
    setRsvpEventIds(prev => {
      const exists = prev.includes(evId);
      const next = exists ? prev.filter(id => id !== evId) : [...prev, evId];
      try {
        localStorage.setItem('iesu_alumni_rsvp_v1', JSON.stringify(next));
      } catch (_) {}
      toast.success(
        exists
          ? `${evTitle} katılım kaydınız iptal edildi.`
          : `${evTitle} için katılım kaydınız onaylandı!`
      );
      return next;
    });
  };

  // Application Form State
  const [appForm, setAppForm] = useState({
    name: currentUser?.name || '',
    type: 'Asıl Üyelik',
    department: currentUser?.department || 'Bilgisayar Mühendisliği',
    graduationYear: currentUser?.graduationYear || currentUser?.gradYear || '2024',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    note: ''
  });

  const [activeModal, setActiveModal] = useState(null); // story
  const [selectedStory, setSelectedStory] = useState(null);

  // İESÜ Mezunlar Portalı Resmî Hikâyeleri
  const assocStories = [
    { id: 1, name: 'İESÜ Mezunlar Portalı', logo: '/iesu-logo.svg', tag: 'Resmî Duyuru', hasUnseen: true, image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80', caption: '2026 Mezunlar Buluşması ve Kariyer Zirvesi kayıtları açıldı!' },
    { id: 2, name: 'Kariyer Mentorluğu', logo: null, tag: 'Mentorluk', hasUnseen: true, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', caption: 'Yeni dönem Mezun-Öğrenci Akran Mentorluğu eşleşmeleri başladı.' },
    { id: 3, name: 'Küresel Mezun Ağı', logo: null, tag: 'Global', hasUnseen: false, image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80', caption: 'Avrupa ve Kuzey Amerika mezun komitelerimizle küresel ağımızı büyütüyoruz.' },
    { id: 4, name: 'Sektör Komiteleri', logo: null, tag: 'Komite', hasUnseen: false, image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&q=80', caption: '6 farklı sektörel komitede meslektaşlarınızla ortak projeler geliştirin.' },
  ];

  const SECTORAL_COMMITTEES = [
    { id: 'kom-1', title: 'Yazılım, Yapay Zeka ve Teknoloji Komitesi', count: '1.850 Mezun', lead: 'Kariyer Geliştirme Koordinatörlüğü', desc: 'Avrupa, ABD ve Türkiye teknoloji ekosistemindeki mezun mühendis ve ürün liderleri çalışma ağı.' },
    { id: 'kom-2', title: 'Sağlık Bilimleri ve Hastaneler Ağı', count: '2.400 Mezun', lead: 'Sağlık Bilimleri Mezun Temsilciliği', desc: 'Fizyoterapi, beslenme, hemşirelik ve sağlık yönetimi mezunlarımızın mesleki gelişim komitesi.' },
    { id: 'kom-3', title: 'Uluslararası Ticaret & Lojistik Komitesi', count: '1.200 Mezun', lead: 'İİBF Mezun Koordinasyonu', desc: 'İthalat, ihracat, tedarik zinciri ve finans sektöründe görev yapan mezunlar dayanışması.' },
    { id: 'kom-4', title: 'Sosyal Bilimler ve Psikoloji Platformu', count: '980 Mezun', lead: 'Sosyal Bilimler Temsilciliği', desc: 'Psikologlar, klinik uzmanlar ve kamu/özel sektör insan kaynakları liderleri komitesi.' },
    { id: 'kom-5', title: 'Girişimcilik ve Yatırımcı Meclisi', count: '650 Mezun', lead: 'İESÜ Kuluçka & Mezun Ağı', desc: 'Kendi teknoloji veya hizmet girişimini kuran mezunlar ile öğrenci takımlarını buluşturan kurul.' },
    { id: 'kom-6', title: 'Avrupa & Uluslararası Mezunlar Komitesi', count: '410 Mezun', lead: 'Yurt Dışı Mezun Temsilciliği', desc: 'Yurt dışında çalışan ve lisansüstü eğitim gören mezunlarımızın uluslararası kariyer köprüsü.' },
  ];

  const ALUMNI_EVENTS = [
    {
      id: 'al-ev-1',
      title: '2026 İESÜ Büyük Mezunlar Buluşması ve Kariyer Zirvesi',
      date: '18 Mayıs 2026 • 14:00',
      loc: 'Prof. Dr. Fuat Sezgin Konferans Salonu & Kampüs Bahçesi',
      category: 'Yıllık Buluşma',
      attendees: 340,
      desc: 'Fakülte buluşmaları, sektör panelleri, mezun başarı ödülleri ve dönem arkadaşlarıyla networking kokteyli.'
    },
    {
      id: 'al-ev-2',
      title: 'Sektör Lideri Mezunlarla Öğrenci-Mezun Mentorluk Günü',
      date: '02 Haziran 2026 • 10:30',
      loc: 'İESÜ Kampüs Kuluçka Merkezi',
      category: 'Mentorluk & Kariyer',
      attendees: 185,
      desc: 'Üst düzey yönetici ve uzman mezunlarımızla son sınıf öğrencilerinin birebir kariyer ve mülakat deneyim paylaşımı.'
    },
    {
      id: 'al-ev-3',
      title: 'Sektörel Komiteler Ortak Proje & İş Birliği Çalıştayı',
      date: '19 Haziran 2026 • 18:30',
      loc: 'Ömer Halisdemir Konferans Salonu (Hibrit)',
      category: 'Networking',
      attendees: 120,
      desc: 'Mezun şirketleri arasında iş geliştirme, ortak Ar-Ge çağrıları ve staj kontenjanı iş birlikleri toplantısı.'
    }
  ];

  // Featured Alumni Career Stories derived from store alumni or verified fallback
  const alumniStoriesList = useMemo(() => {
    const base = (alumni || []).slice(0, 3);
    if (base.length >= 3) {
      return base.map((al, idx) => ({
        id: al.id || `al-story-${idx}`,
        name: al.name,
        avatar: al.avatar,
        department: al.department || 'Bilgisayar Mühendisliği',
        gradYear: al.graduationYear || al.gradYear || '2021',
        role: al.title || al.currentRole || 'Kıdemli Yazılım Mühendisi',
        company: al.company || 'Teknoloji Sektörü',
        quote: al.bio || 'İESÜ’de edindiğim proje kültürü ve mezun ağımızın desteğiyle kariyerimde uluslararası projelere liderlik ediyorum.'
      }));
    }
    return [
      {
        id: 'al-s-1',
        name: 'Selin Kaya',
        avatar: null,
        department: 'Bilgisayar Mühendisliği',
        gradYear: '2021',
        role: 'Kıdemli Ürün Yöneticisi',
        company: 'FinTech Global',
        quote: 'Mezunlar Portalı üzerinden tanıştığım dönem arkadaşlarım ve mentorlarımla ilk stajımı bulmuş, bugün ise kendi ekibime İESÜ’lü genç meslektaşlarımı dahil ediyorum.'
      },
      {
        id: 'al-s-2',
        name: 'Mert Demir',
        avatar: null,
        department: 'Uluslararası Ticaret ve Lojistik',
        gradYear: '2020',
        role: 'Bölge Operasyon Direktörü',
        company: 'EuroLogistics GmbH',
        quote: 'Avrupa Mezunlar Komitesi sayesinde yurt dışındaki kariyer geçiş sürecimde hem sektörel rehberlik hem de güçlü bir profesyonel çevre edindim.'
      },
      {
        id: 'al-s-3',
        name: 'Uzm. Psk. Zeynep Aydın',
        avatar: null,
        department: 'Psikoloji',
        gradYear: '2022',
        role: 'Klinik Psikolog & Kurucu',
        company: 'Aydın Danışmanlık Merkezi',
        quote: 'Mezun-Öğrenci mentorluk programında genç meslektaşlarıma klinik staj ve yüksek lisans süreçlerinde rehberlik etmekten büyük mutluluk duyuyorum.'
      }
    ];
  }, [alumni]);

  // Personal application status check
  const myExistingApplication = useMemo(() => {
    return (alumniAssocApplications || []).find(
      a =>
        (currentUser?.email && a.email === currentUser.email) ||
        (currentUser?.name && a.name === currentUser.name)
    );
  }, [alumniAssocApplications, currentUser]);

  // Live platform feed stream connected seamlessly with official alumni portal items
  const displayPosts = useMemo(() => {
    const combined = combineFeedItems(posts, events, news, announcements, jobs, generalEvents, careerOpportunities);
    if (combined.length > 0) return combined;
    return [
      {
        id: 'assoc-feed-1',
        title: 'İESÜ Mezunlar Portalı 2026 Büyük Bahar Buluşması ve Kariyer Zirvesi',
        author: { name: 'İESÜ Mezunlar Portalı', role: 'Kariyer Geliştirme Koordinatörlüğü', avatar: '/iesu-logo.svg' },
        date: 'Bugün, 14:30',
        content: 'Değerli Mezunlarımız ve Öğrencilerimiz! 🎓 2026 yılı geleneksel mezunlar buluşmamızı bu yıl dev bir Kariyer Zirvesi ile taçlandırıyoruz. Sektör lideri mezunlarımız deneyimlerini paylaşacak, yeni komite üyelikleri kabul edilecek.',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        likes: 184,
        comments: 32,
        category: 'İESÜ Mezunlar Portalı'
      }
    ];
  }, [posts, events, news, announcements, jobs, generalEvents, careerOpportunities]);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!appForm.name.trim() || !appForm.email.trim()) {
      toast.error('Lütfen ad soyad ve e-posta bilgilerinizi eksiksiz giriniz.');
      return;
    }
    const setAlumniAssocApplications = useAppStore.getState().setAlumniAssocApplications;
    const currentApps = useAppStore.getState().alumniAssocApplications || [];
    
    const newApp = {
      id: `APP-${Date.now()}`,
      name: appForm.name.trim(),
      type: appForm.type,
      department: appForm.department.trim(),
      graduationYear: appForm.graduationYear.trim(),
      email: appForm.email.trim(),
      phone: appForm.phone.trim(),
      notes: appForm.note || '',
      appliedAt: new Date().toLocaleDateString('tr-TR'),
      status: 'Beklemede'
    };

    if (typeof setAlumniAssocApplications === 'function') {
      setAlumniAssocApplications([newApp, ...currentApps]);
    }
    toast.success('İESÜ Mezunlar Portalı komite ve üyelik başvurunuz başarıyla kaydedildi!');
    setAppForm({ ...appForm, phone: '', note: '' });
    setActiveTab('feed');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* FULL STANDARD WHITE NAVBAR MATCHING ALUMNI FEED */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between relative">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
            const store = useAppStore.getState();
            if (store.setActivePortalBranch) store.setActivePortalBranch('alumni');
            setView('alumni');
          }}>
            <Logo color="emerald" className="h-10 w-auto hover:scale-105 transition-transform shrink-0" />
            <div className="hidden sm:block text-left">
              <h1 className="text-[13px] font-black text-emerald-800 tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">İESÜ Mezunlar Portalı</p>
            </div>
          </div>

          {/* CENTER: Mezunlar Portalı Emerald Badge */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center pointer-events-none z-20">
            <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-md shadow-emerald-600/30 border border-emerald-300/60 flex items-center gap-2 whitespace-nowrap shrink-0">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0"></span>
              🎓 İESÜ MEZUNLAR PORTALI
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button onClick={() => setView('notifications')} className="p-2 rounded-full transition-all flex items-center justify-center hover:bg-emerald-50 text-[#059669]" title="Bildirimler">
              <div className="relative">
                <Bell size={24} strokeWidth={2.5} className="fill-current text-[#059669]/10" />
                {((notifications || []).filter(n => n.userId === currentUser?.id && !n.read).length > 0) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                )}
              </div>
            </button>
            <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} academicRole={academicRole} />
          </div>
        </div>
      </nav>

      <div className="pt-20"></div>

      <main className="flex-1 w-full max-w-[1300px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* HERO BANNER WITH CLEAR VALUE PROPOSITION & DIRECT ACTIONS */}
        <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-800/40 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
            <div className="max-w-3xl space-y-3.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-950/80 px-3.5 py-1 rounded-full border border-amber-500/40 flex items-center gap-1.5">
                  <Crown size={12} className="text-amber-400" /> İESÜ MEZUNLAR PORTALI
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-500/30">
                  Kariyer Geliştirme Koordinatörlüğü
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Mezunlarımızla Yaşam Boyu Kariyer, Dayanışma ve İş Birliği Ağı
              </h1>
              <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl">
                İstanbul Esenyurt Üniversitesi (İESÜ) Mezunlar Portalı; mezunlarımızın sektörel komitelerde buluşmasını, öğrencilerimize mentorluk yapmasını, iş ve kariyer fırsatlarını paylaşmasını ve üniversitemizle bağını güçlendirmesini sağlar.
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('network')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Globe size={15} /> Sektörel Komitelere Katıl ({joinedCommittees.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('events')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Calendar size={15} /> Mezun Buluşmaları ({ALUMNI_EVENTS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('apply')}
                  className="px-4 py-2.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Award size={15} /> Komite & Üyelik Başvurusu
                </button>
              </div>
            </div>

            {/* Personal Alumni Experience Summary Card */}
            <div className="w-full lg:w-80 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-3 shrink-0">
              <div className="flex items-center gap-3">
                <SafeAvatar
                  src={currentUser?.avatar || '/iesu-logo.svg'}
                  name={currentUser?.name || 'İESÜ Mezunu'}
                  size={44}
                  className="w-11 h-11 rounded-xl border border-emerald-400/40 shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">Kişisel Mezun Durumu</span>
                  <h2 className="text-sm font-black text-white truncate">{currentUser?.name || 'İESÜ Mezunu'}</h2>
                  <p className="text-[11px] text-slate-300 truncate">{currentUser?.department || 'İstanbul Esenyurt Üniversitesi'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-center">
                <div className="bg-black/25 rounded-xl p-2 border border-white/10">
                  <span className="block text-sm font-black text-emerald-300">{joinedCommittees.length} Komite</span>
                  <span className="block text-[10px] text-slate-300 font-semibold">Aktif Çalışma Grubu</span>
                </div>
                <div className="bg-black/25 rounded-xl p-2 border border-white/10">
                  <span className="block text-sm font-black text-amber-300">
                    {myExistingApplication ? myExistingApplication.status : 'Aktif Mezun'}
                  </span>
                  <span className="block text-[10px] text-slate-300 font-semibold">Portal Kaydı</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setView('mbs')}
                  className="py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <GraduationCap size={13} /> MBS Sistemi
                </button>
                <button
                  type="button"
                  onClick={() => setView('global_map')}
                  className="py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <Globe size={13} /> Küresel Harita
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* OFFICIAL ALUMNI HIGHLIGHTS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {assocStories.map(st => (
            <button
              key={st.id}
              type="button"
              onClick={() => { setSelectedStory(st); setActiveModal('story'); }}
              className="bg-white hover:bg-emerald-50/40 p-3.5 rounded-2xl border border-slate-200/90 hover:border-emerald-300 transition flex items-center gap-3 text-left cursor-pointer group shadow-2xs"
            >
              <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-emerald-600 shrink-0">
                <SafeAvatar src={st.image} name={st.name} size={44} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-0.5">
                  {st.tag}
                </span>
                <h3 className="text-xs font-black text-slate-900 group-hover:text-emerald-800 truncate">{st.name}</h3>
                <p className="text-[11px] text-slate-500 truncate">{st.caption}</p>
              </div>
            </button>
          ))}
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'feed', label: 'Topluluk Akışı & Duyurular', icon: <FileText size={16} /> },
            { id: 'network', label: 'Kariyer, Mentorluk & Komiteler', icon: <Globe size={16} /> },
            { id: 'events', label: `Mezun Etkinlikleri (${ALUMNI_EVENTS.length})`, icon: <Calendar size={16} /> },
            { id: 'board', label: 'Koordinasyon Kurulu & Kurumsal Yapı', icon: <Users size={16} /> },
            { id: 'apply', label: 'Komite & Üyelik Başvurusu', icon: <Award size={16} /> },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black transition whitespace-nowrap cursor-pointer ${
                activeTab === t.id 
                  ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: TOPLULUK AKIŞI & PAYLAŞIMLAR */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {displayPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  currentUser={currentUser} 
                  students={students} 
                  alumni={alumni} 
                  setPosts={setPosts} 
                />
              ))}
            </div>

            {/* SAĞ YAN PANEL: TOPLULUK ÖZETİ, FIRSATLAR VE İLETİŞİM */}
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 text-white p-6 rounded-3xl border border-emerald-800/50 shadow-lg space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-400" />
                  <h3 className="font-black text-base">İESÜ Mezunlar Portalı Nedir?</h3>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  İstanbul Esenyurt Üniversitesi (İESÜ) Mezunlar Portalı, mezunlarımızın üniversite ile bağını koruyan, mezunlar arası iş ve mentorluk ağını güçlendiren resmî kurumsal topluluk platformudur.
                </p>
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center gap-2 text-emerald-200 font-semibold">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    <span>Mezun-Öğrenci kariyer mentorluğu eşleşmesi</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-200 font-semibold">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    <span>6 sektörel komitede mesleki çalışma grupları</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-200 font-semibold">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    <span>Yıllık mezun buluşmaları ve kariyer zirveleri</span>
                  </div>
                </div>
              </div>

              {/* Quick Career & Mentorship Shortcuts */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Briefcase size={16} className="text-emerald-700" /> Mezun Kariyer & Katkı Adımları
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('network')}
                  className="w-full p-3 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/80 flex items-center justify-between text-left transition cursor-pointer"
                >
                  <div>
                    <strong className="text-xs font-black text-emerald-950 block">Sektörel Komitelere Katılın</strong>
                    <span className="text-[11px] text-emerald-800 font-medium">Meslektaşlarınızla ortak projeler üretin</span>
                  </div>
                  <ChevronRight size={16} className="text-emerald-700 shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('events')}
                  className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left transition cursor-pointer"
                >
                  <div>
                    <strong className="text-xs font-black text-slate-900 block">Mezun Buluşmalarına Kayıt Olun</strong>
                    <span className="text-[11px] text-slate-600 font-medium">Kampüs etkinliklerinde yerinizi ayırtın</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-600 shrink-0" />
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Bell size={16} className="text-emerald-700" /> Koordinasyon İletişim Kanalları
                </h3>
                <div className="space-y-3 text-xs font-semibold text-slate-600">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <strong className="block text-slate-900">Resmî Birim</strong>
                    <span>Kariyer Geliştirme Koordinatörlüğü</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <strong className="block text-slate-900">E-posta</strong>
                    <span>mezun@esenyurt.edu.tr</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <strong className="block text-slate-900">Ofis Adresi</strong>
                    <span>İESÜ Rektörlük Binası, Zemin Kat Kariyer Geliştirme Merkezi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KARİYER, MENTORLUK, BAŞARI HİKÂYELERİ & SEKTÖREL KOMİTELER */}
        {activeTab === 'network' && (
          <div className="space-y-6 animate-fade-in">
            {/* Alumni Career Stories & Achievements */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Mezun Başarı Hikâyeleri
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">İlham Veren İESÜ Mezunları</h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-500">
                    Farklı sektörlerde liderlik üstlenen ve üniversite topluluğumuza değer katan mezunlarımızın deneyimleri.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setView('global_map')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Globe size={15} /> Küresel Mezun Haritasını Aç
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {alumniStoriesList.map(story => (
                  <div key={story.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <SafeAvatar src={story.avatar} name={story.name} size={48} className="w-12 h-12 rounded-xl border border-emerald-200 shrink-0" />
                        <div className="min-w-0">
                          <h4 className="text-sm font-black text-slate-900 truncate">{story.name}</h4>
                          <p className="text-xs font-bold text-emerald-700 truncate">{story.role} • {story.company}</p>
                          <span className="text-[10px] font-semibold text-slate-500 block">{story.department} ('{String(story.gradYear).slice(-2)})</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{story.quote}"
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-bold text-emerald-800">
                      <span>Mezun Mentor & Konuşmacı</span>
                      <CheckCircle2 size={14} className="text-emerald-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Sectoral Committees */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                  Mesleki Dayanışma & Çalışma Grupları
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Sektörel Komiteler ve Küresel Ağlarımız</h3>
                <p className="text-xs sm:text-sm font-medium text-slate-500">
                  Uzmanlık alanınıza uygun mezun komitelerine tek tıkla katılarak sektör içi iş birliklerine, mentorluk programlarına ve komite toplantılarına dahil olabilirsiniz.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {SECTORAL_COMMITTEES.map((kom) => {
                  const isJoined = joinedCommittees.includes(kom.id);
                  return (
                    <div key={kom.id} className={`p-6 rounded-2xl border transition flex flex-col justify-between space-y-4 ${
                      isJoined ? 'border-emerald-300 bg-emerald-50/30 shadow-xs' : 'border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-white'
                    }`}>
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">{kom.count}</span>
                          {isJoined && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 size={11} /> Üyesiniz
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-black text-slate-900 leading-snug">{kom.title}</h4>
                        <p className="text-xs font-medium text-slate-600 leading-relaxed">{kom.desc}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-slate-500 truncate">{kom.lead}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleCommittee(kom.id, kom.title)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                            isJoined
                              ? 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                              : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs'
                          }`}
                        >
                          {isJoined ? 'Komiteden Ayrıl' : '+ Komiteye Katıl'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MEZUN ETKİNLİKLERİ & BULUŞMALAR */}
        {activeTab === 'events' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Buluşma & Networking Takvimi
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Geleneksel Mezun Etkinlikleri ve Zirveler</h3>
                <p className="text-xs sm:text-sm font-medium text-slate-500">
                  İESÜ Mezunlar Portalı ve Kariyer Geliştirme Koordinatörlüğü tarafından düzenlenen buluşmalara katılım durumunuzu bildirin.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl self-start sm:self-auto">
                Kayıtlı Etkinliğiniz: {rsvpEventIds.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ALUMNI_EVENTS.map((ev) => {
                const isAttending = rsvpEventIds.includes(ev.id);
                return (
                  <div key={ev.id} className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 transition ${
                    isAttending ? 'border-emerald-300 bg-emerald-50/30 shadow-xs' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                          {ev.category}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                          <Users size={13} className="text-emerald-700" /> {ev.attendees + (isAttending ? 1 : 0)} Katılımcı
                        </span>
                      </div>

                      <h4 className="text-base font-black text-slate-900 leading-snug">{ev.title}</h4>
                      <p className="text-xs font-medium text-slate-600 leading-relaxed">{ev.desc}</p>

                      <div className="space-y-1 pt-1 text-xs font-semibold text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-emerald-700 shrink-0" />
                          <span>{ev.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-emerald-700 shrink-0" />
                          <span>{ev.loc}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleEventRsvp(ev.id, ev.title)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        isAttending
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                      }`}
                    >
                      <CheckCircle2 size={15} />
                      {isAttending ? 'Katılımınız Onaylandı ✓ (İptal Et)' : 'Etkinliğe Katıl (LCV)'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: KOORDİNASYON KURULU & KURUMSAL YAPI */}
        {activeTab === 'board' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fade-in">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                Resmî İdari Yapı
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Mezunlar Koordinasyon Kurulu</h3>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                İstanbul Esenyurt Üniversitesi (İESÜ) Mezunlar Portalı ve Kariyer Geliştirme Koordinatörlüğü idari temsilcileri.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(alumniAssocBoard && alumniAssocBoard.length > 0 ? alumniAssocBoard : [
                { id: 'b-1', name: 'Kariyer Geliştirme Koordinatörlüğü', role: 'Portal Koordinasyon Başkanlığı', email: 'kariyer@esenyurt.edu.tr' },
                { id: 'b-2', name: 'Mezun İlişkileri Birimi', role: 'Mezun Ağı & Etkinlik Koordinatörü', email: 'mezun@esenyurt.edu.tr' },
                { id: 'b-3', name: 'Sektörel İş Birlikleri Masası', role: 'Komite & Mentorluk Koordinatörü', email: 'mentorluk@esenyurt.edu.tr' }
              ]).map((m) => (
                <div key={m.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-4">
                  <SafeAvatar
                    src={m.avatar}
                    name={m.name}
                    size={56}
                    className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-800 to-teal-900 text-white font-black flex items-center justify-center text-lg shadow shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-black text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded-md inline-block">{m.role}</span>
                    <h4 className="text-base font-black text-slate-900 mt-1 truncate">{m.name}</h4>
                    <p className="text-xs font-medium text-slate-500 truncate">{m.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ÜYELİK & KOMİTE BAŞVURU FORMU */}
        {activeTab === 'apply' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 max-w-3xl mx-auto animate-fade-in">
            {featureAlumniAssocToggle === false ? (
              <div className="text-center py-12 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                <ShieldCheck size={48} className="mx-auto text-amber-600" />
                <h3 className="text-xl font-black text-slate-900">İESÜ Mezunlar Portalı Başvuru Dönemi Şu An Kapalıdır</h3>
                <p className="text-xs font-medium text-slate-600 max-w-md mx-auto">
                  İESÜ Mezunlar Portalı komite ve çalışma grubu başvuruları belirli dönemlerde açılmaktadır. Lütfen yeni duyuruları takip ediniz.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Resmî Mezun Kayıt & Katılım Formu
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">İESÜ Mezunlar Portalı Komite & Üyelik Başvurusu</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">
                    Aşağıdaki formu doldurarak İESÜ Mezunlar Portalı çalışma komitelerinde aktif görev alabilir, mentorluk programlarına katılabilir veya mezun temsilciliği talebinizi Kariyer Geliştirme Koordinatörlüğüne iletebilirsiniz.
                  </p>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Ad Soyad *</label>
                      <input 
                        type="text" 
                        required
                        value={appForm.name} 
                        onChange={(e) => setAppForm({ ...appForm, name: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Katılım / Başvuru Türü</label>
                      <select 
                        value={appForm.type}
                        onChange={(e) => setAppForm({ ...appForm, type: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                      >
                        <option value="Asıl Üyelik">İESÜ Mezunlar Portalı Aktif Üyeliği</option>
                        <option value="Sektörel Komite Üyeliği">Sektörel Komite & Çalışma Grubu Üyeliği</option>
                        <option value="Kariyer Mentorluğu">Mezun-Öğrenci Kariyer Mentorluğu</option>
                        <option value="Yönetim Ekibi Adaylığı">Koordinasyon & Temsilcilik Adaylığı</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Mezun Olunan Bölüm *</label>
                      <input 
                        type="text" 
                        required
                        value={appForm.department} 
                        onChange={(e) => setAppForm({ ...appForm, department: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Mezuniyet Yılı *</label>
                      <input 
                        type="text" 
                        required
                        value={appForm.graduationYear} 
                        onChange={(e) => setAppForm({ ...appForm, graduationYear: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">E-posta *</label>
                      <input 
                        type="email" 
                        required
                        value={appForm.email} 
                        onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Telefon No *</label>
                      <input 
                        type="tel" 
                        required
                        value={appForm.phone} 
                        placeholder="0532 000 0000"
                        onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Katkı Sunmak İstediğiniz Alanlar / Mesajınız</label>
                    <textarea 
                      rows={4}
                      value={appForm.note}
                      onChange={(e) => setAppForm({ ...appForm, note: e.target.value })}
                      placeholder="İESÜ Mezunlar Portalı komitelerinde üstlenmek istediğiniz görevler, çalıştığınız kurum veya uzmanlık alanlarınız..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send size={16} /> Başvurumu Gönder ve Kaydet
                  </button>
                </form>
              </>
            )}
          </div>
        )}

      </main>

      {/* STORY FULLSCREEN MODAL */}
      {activeModal === 'story' && selectedStory && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full overflow-hidden relative shadow-2xl border border-slate-800">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black text-white rounded-full z-10 cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 inset-x-0 flex items-center gap-3 z-10">
              <SafeAvatar src={selectedStory.logo} name={selectedStory.name} size={40} className="w-10 h-10 rounded-full border border-amber-400" />
              <div>
                <h4 className="text-xs font-black">{selectedStory.name}</h4>
                <span className="text-[10px] text-amber-300 font-bold">{selectedStory.tag}</span>
              </div>
            </div>
            <SafeAvatar src={selectedStory.image} name={selectedStory.name} size={450} className="w-full h-[420px] object-cover rounded-none" />
            <div className="p-6 bg-slate-900 space-y-3">
              <p className="text-xs font-medium text-slate-200 leading-relaxed">{selectedStory.caption}</p>
              <button 
                onClick={() => { setActiveModal(null); setActiveTab('apply'); }}
                className="w-full py-3 bg-[#059669] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-md"
              >
                Komite & Katılım Başvurusuna Git
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Dock for easy return to main feed */}
      <SubPanelFloatingDock 
        currentUser={currentUser} 
        setView={setView} 
        setSelectedUserId={setSelectedUserId} 
        userRole="alumni" 
        activeTab={activeTab} 
      />

      <SubPanelFooter setView={setView} theme="emerald" />
    </div>
  );
}

