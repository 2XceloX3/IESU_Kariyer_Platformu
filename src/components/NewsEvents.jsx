import React, { useState, useMemo } from 'react';
import { 
  Newspaper, Bell, Calendar, Sparkles, Search, Filter, 
  ArrowRight, Clock, Users, MapPin, Tag, ChevronRight, 
  ShieldCheck, Share2, Bookmark, CheckCircle2, Megaphone,
  ArrowLeft, Flame, Award, Building2, UserCheck, MessageCircle, Heart, X, Home
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import ConnectionSuggestions from './ConnectionSuggestions';
import SafeAvatar from './shared/SafeAvatar';

export default function NewsEvents({ setView, currentUser, userRole, setSelectedUserId }) {
  const news = useAppStore(state => state.news) || [];
  const announcements = useAppStore(state => state.announcements) || [];
  const events = useAppStore(state => state.events) || [];
  const students = useAppStore(state => state.students) || [];
  const alumni = useAppStore(state => state.alumni) || [];
  const companies = useAppStore(state => state.companies) || [];
  const academicStaff = useAppStore(state => state.academicStaff) || [];
  const posts = useAppStore(state => state.posts) || [];

  const [activeCategory, setActiveCategory] = useState('all'); // all, news, announcement, event
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [likedNews, setLikedNews] = useState({});

  // Unified Store Automation Data Fetching
  const allItems = useMemo(() => {
    let list = [];
    if (news && news.length > 0) {
      list = [...list, ...news.map((item, i) => ({ ...item, id: item.id || `n_${i}`, itemType: 'news' }))];
    }
    if (announcements && announcements.length > 0) {
      list = [...list, ...announcements.map((item, i) => ({ ...item, id: item.id || `a_${i}`, itemType: 'announcement' }))];
    }
    if (events && events.length > 0) {
      list = [...list, ...events.map((item, i) => ({ ...item, id: item.id || `e_${i}`, itemType: 'event' }))];
    }

    // Fallback demo dataset if store is loading
    if (list.length === 0) {
      list = [
        {
          id: 'k1',
          itemType: 'news',
          category: 'Kariyer Fuarı',
          title: '2026 Ulusal Kariyer & Sektör Buluşması Kayıtları Başladı',
          date: '15 Nisan 2026',
          time: '12 saat önce',
          location: 'İESÜ Ana Kampüs Konferans Salonu',
          readers: '4.2B Okuma',
          imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
          description: '50+ Lider savunma, bilişim ve sanayi kuruluşu kampüsümüzde öğrencilerimizle buluşuyor. Birebir staj mülakatları ve CV danışmanlık stantları açık olacaktır.'
        },
        {
          id: 'k2',
          itemType: 'announcement',
          category: 'Rapor & Analiz',
          title: 'Yapay Zeka ve İstihdam Raporu Yayımlandı',
          date: '10 Nisan 2026',
          time: '1 gün önce',
          location: 'İESÜ Ar-Ge OS Merkezi',
          readers: '3.1B Okuma',
          imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
          description: 'İESÜ Araştırma OS Merkezi tarafından yayımlanan 2026 raporuna göre yapay zeka entegrasyonu olan mezunların işe kabul oranı %45 arttı.'
        },
        {
          id: 'k3',
          itemType: 'event',
          category: 'Zirve',
          title: 'Geleneksel Hibrit Mezunlar ve Sektör Zirvesi',
          date: '22 Nisan 2026',
          time: '2 gün önce',
          location: 'Kültür Merkezi & Canlı Stream',
          readers: '8.4B Okuma',
          imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
          description: 'Global şirketlerde çalışan mezunlarımız aktif öğrencilerimizle buluşup birebir mentörlük ve yurt dışı staj tecrübelerini aktarıyor.'
        }
      ];
    }

    return list;
  }, [news, announcements, events]);

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchCat = activeCategory === 'all' || item.itemType === activeCategory;
      const matchQuery = !searchQuery || 
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [allItems, activeCategory, searchQuery]);

  const toggleLike = (id) => {
    setLikedNews(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans pb-32">
      
      {/* ─── 1. TOP HEADER BAR (SOL LOGO & ÜNİVERSİTE İSMİ, ORTA ARAMA, SAĞ PROFİL) ─── */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        {/* SOL: LOGO & ÜNİVERSİTE İSMİ */}
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <div className="hidden sm:flex flex-col border-l border-slate-200 pl-3">
            <span className="font-black text-slate-900 text-xs tracking-tight">İSTANBUL ESENYURT ÜNİVERSİTESİ</span>
            <span className="text-[10px] font-bold text-[#990000] uppercase tracking-wider">Kariyer Geliştirme Merkezi</span>
          </div>
        </div>

        {/* ORTA: ARAMA ÇUBUĞU */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Resmi haber, duyuru veya etkinlik ara..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100/80 focus:bg-white border border-transparent focus:border-red-300 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* SAĞ: TOP PROFILE MENU */}
        <div className="flex items-center gap-2">
          <TopProfileMenu currentUser={currentUser} setView={setView} userRole={userRole} />
        </div>
      </header>

      {/* ─── 2. MAIN 3-COLUMN IN-FEED LAYOUT CONTAINER ─── */}
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex gap-6 justify-center">
        
        {/* ─── LEFT PANEL (w-[270px]): PROFİL KARTI VE HABER FİLTRELERİ ─── */}
        <div className="hidden lg:block w-[270px] shrink-0 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <SafeAvatar 
                src={currentUser?.avatar} 
                name={currentUser?.name || 'Kullanıcı'} 
                size="lg" 
                rounded="rounded-2xl" 
                className="border border-slate-200 shadow-xs" 
                alt={currentUser?.name}
              />
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-sm truncate flex items-center gap-1">
                  {currentUser?.name || 'Kullanıcı'} <ShieldCheck size={14} className="text-[#990000]" />
                </h4>
                <p className="text-[11px] font-semibold text-slate-500 truncate">{currentUser?.department || 'İESÜ Öğrencisi'}</p>
              </div>
            </div>
          </div>

          {/* KGM Kategorileri Widget */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-400 mb-3">Haber Filtreleri</h3>
            <div className="space-y-1.5">
              {[
                { id: 'all', label: 'Tüm Gönderiler', count: allItems.length, icon: Newspaper },
                { id: 'news', label: 'Resmi Haberler', count: (news || []).length || 2, icon: Flame },
                { id: 'announcement', label: 'Duyurular', count: (announcements || []).length || 3, icon: Bell },
                { id: 'event', label: 'Etkinlikler & Zirveler', count: (events || []).length || 2, icon: Calendar },
              ].map(cat => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      isActive 
                        ? 'bg-red-50 text-[#990000] border border-red-100 shadow-xs' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={15} className={isActive ? 'text-[#990000]' : 'text-slate-400'} />
                      <span>{cat.label}</span>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isActive ? 'bg-[#990000] text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── CENTER PANEL (max-w-[620px]): AKIŞ GÖNDERİLERİ GİBİ HABER AKIŞI ─── */}
        <div className="w-full max-w-[620px] shrink-0 space-y-6">
          
          {/* Header Card Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-[#7A0000] to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-red-900 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={11} /> KGM Basın & Duyuru Portalı
              </span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            </div>
            <h2 className="text-xl font-black text-white leading-tight mb-1">Resmi Kariyer Haber Akışı</h2>
            <p className="text-xs text-slate-200 font-medium">İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi tüm resmi duyuruları.</p>
          </div>

          {/* Feed List Items */}
          <div className="space-y-5">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* News Card Header */}
                <div className="p-5 pb-3 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#990000] flex items-center justify-center font-black border border-red-100 shadow-inner">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1">
                        Kariyer Geliştirme Merkezi <CheckCircle2 size={13} className="text-[#990000] fill-current text-white" />
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                        <Clock size={11} /> {item.time || item.date || 'Bugün'} • {item.category || 'Resmi Duyuru'}
                      </p>
                    </div>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    {item.itemType === 'event' ? 'Etkinlik' : item.itemType === 'announcement' ? 'Duyuru' : 'Haber'}
                  </span>
                </div>

                {/* News Image Header (If available) */}
                {(item.imageUrl || item.image) && (
                  <div 
                    onClick={() => setSelectedNewsItem(item)}
                    className="w-full h-52 sm:h-64 bg-slate-950 relative overflow-hidden cursor-pointer group"
                  >
                    <img 
                      src={item.imageUrl || item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  </div>
                )}

                {/* News Content Body */}
                <div className="p-5 space-y-2">
                  <h3 
                    onClick={() => setSelectedNewsItem(item)}
                    className="text-base font-black text-slate-900 hover:text-[#990000] transition-colors leading-snug cursor-pointer"
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">
                    {item.description || item.summary || item.content}
                  </p>

                  {item.location && (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 pt-2">
                      <MapPin size={13} className="text-[#990000]" /> {item.location}
                    </div>
                  )}
                </div>

                {/* News Action Footer (Social Interactivity) */}
                <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleLike(item.id)}
                      className={`flex items-center gap-1.5 transition cursor-pointer ${likedNews[item.id] ? 'text-[#990000]' : 'hover:text-slate-900'}`}
                    >
                      <Heart size={16} className={likedNews[item.id] ? 'fill-current text-[#990000]' : ''} />
                      <span>{likedNews[item.id] ? 'Beğenildi' : 'Beğen'}</span>
                    </button>
                    <button 
                      onClick={() => setSelectedNewsItem(item)}
                      className="flex items-center gap-1.5 hover:text-slate-900 transition cursor-pointer"
                    >
                      <MessageCircle size={16} />
                      <span>Detay Gör</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => setSelectedNewsItem(item)}
                    className="text-[#990000] hover:text-red-800 font-black text-xs flex items-center gap-1 cursor-pointer"
                  >
                    Tamamını Oku <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ─── RIGHT PANEL (w-[300px]): SAĞ SÜTUN BAĞLANTI & MENTÖR KARTLARI ─── */}
        <div className="hidden xl:block w-[300px] shrink-0 space-y-6">
          <ConnectionSuggestions 
            currentUser={currentUser}
            students={students}
            alumni={alumni}
            companies={companies}
            academicStaff={academicStaff}
            setView={setView}
            setSelectedUserId={setSelectedUserId}
            maxSuggestions={3}
          />


        </div>

      </div>

      {/* IN-APP DETAIL MODAL (Z-200 PERFECT OVERLAY & HEADER CLEARANCE) */}
      {selectedNewsItem && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 pt-16 pb-24 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[70vh] relative">
            <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-[#990000] text-white flex items-center justify-between">
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                <Newspaper size={18} className="text-amber-400" /> KGM Duyuru Detayı
              </h3>
              <button 
                onClick={() => setSelectedNewsItem(null)} 
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-700 custom-scrollbar">
              <h2 className="text-base font-black text-slate-900 leading-snug">{selectedNewsItem.title}</h2>
              <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Clock size={12} /> {selectedNewsItem.time || selectedNewsItem.date}
              </p>
              <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-line border-t border-slate-100 pt-3">
                {selectedNewsItem.description || selectedNewsItem.summary || selectedNewsItem.content}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedNewsItem(null)}
                className="px-5 py-2 bg-[#990000] hover:bg-red-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. FLOATING DOCK BAR (ALWAYS VISIBLE Z-150 & GEÇİŞ PANELİ) ─── */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[150] w-[95%] max-w-[420px] pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-2xl border-2 border-[#990000]/30 p-2 sm:p-2.5 rounded-full shadow-[0_20px_50px_rgba(153,0,0,0.25)] flex items-center justify-between px-4 text-slate-800">
          
          {/* HOME / ANA AKIŞ - RED */}
          <button 
            onClick={() => setView(userRole === 'alumni' ? 'alumni' : 'student')} 
            className="p-2.5 rounded-full transition-all flex items-center justify-center bg-[#990000] text-white shadow-md shadow-red-500/40 hover:scale-110 active:scale-95 cursor-pointer" 
            title="Ana Akışa Dön"
          >
            <Home size={24} strokeWidth={2.2} />
          </button>
          
          {/* JOBS - PURPLE */}
          <button 
            onClick={() => setView('jobs')} 
            className="p-2.5 rounded-full transition-all flex items-center justify-center text-slate-600 hover:text-purple-600 hover:bg-purple-50 hover:scale-110 cursor-pointer" 
            title="İş İlanları"
          >
            <Building2 size={22} strokeWidth={2} />
          </button>
          
          {/* CENTER: SEARCH ICON */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#7A0000] via-[#990000] to-rose-600 text-white shadow-lg shadow-red-600/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-white/50 cursor-pointer" 
            title="Sayfa Başına Git"
          >
            <Search size={22} strokeWidth={2.8} />
          </button>
          
          {/* MESSAGES */}
          <button 
            onClick={() => setView('messaging')} 
            className="p-2.5 rounded-full transition-all flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:scale-110 cursor-pointer" 
            title="Mesajlar"
          >
            <MessageCircle size={22} strokeWidth={2} />
          </button>
          
          {/* PROFILE AVATAR */}
          <button 
            onClick={() => {
              const selfId = currentUser?.id || currentUser?.uid || currentUser?.studentNo || 'STU-001';
              if (setSelectedUserId) setSelectedUserId(selfId);
              setView('user_profile');
            }} 
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-[#990000] shadow-sm hover:scale-110 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
            title="Profilim"
          >
            <SafeAvatar 
              src={currentUser?.avatar} 
              name={currentUser?.name || 'Kullanıcı'} 
              size="xs" 
              alt="Profile" 
            />
          </button>
        </div>
      </div>

    </div>
  );
}