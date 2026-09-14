import React, { useState, useMemo } from 'react';
import {
  Calendar, MapPin, Clock, Users, Plus, Search, Filter, Trash2,
  Edit3, ExternalLink, Download, Sparkles, Building2, Eye, EyeOff,
  X, CheckCircle2, Award, Music, Landmark, Trophy, Theater, Layers,
  Compass, Star, Share2
} from 'lucide-react';
import { exportToCSV } from '../../utils/export';
import { toast } from '../shared/Toast';
import useAppStore from '../../store/useAppStore';

export default function CMSGeneralEvents({ generalEvents: propsEvents, setGeneralEvents: propsSetEvents }) {
  const storeEvents = useAppStore(state => state.generalEvents) || [];
  const storeSetEvents = useAppStore(state => state.setGeneralEvents);
  const posts = useAppStore(state => state.posts) || [];
  const setPosts = useAppStore(state => state.setPosts);
  const logAction = useAppStore(state => state.logAction);

  const events = propsEvents && propsEvents.length > 0 ? propsEvents : storeEvents;
  const setEvents = propsSetEvents || storeSetEvents;

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'newest', 'quota'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Rektörlük & Tören',
    organizer: 'T.C. İstanbul Esenyurt Üniversitesi Rektörlüğü',
    date: '',
    time: '14:00',
    location: 'Prof. Dr. Fuat Sezgin Konferans Salonu',
    quota: 250,
    registeredCount: 0,
    description: '',
    imageUrl: '',
    registrationLink: '',
    status: 'Yayında',
    featured: false,
    publishToFeed: true
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const total = events.length;
    const active = events.filter(e => e.status === 'Yayında').length;
    const academicCount = events.filter(e => e.category === 'Akademik & Sempozyum' || e.category === 'Rektörlük & Tören').length;
    const cultureFestCount = events.filter(e => e.category === 'Kültür & Sanat' || e.category === 'Kulüp & Bahar Şenliği' || e.category === 'Spor & Turnuvalar').length;
    const totalQuota = events.reduce((acc, curr) => acc + (Number(curr.quota) || 0), 0);
    const totalRegistered = events.reduce((acc, curr) => acc + (Number(curr.registeredCount) || 0), 0);

    return { total, active, academicCount, cultureFestCount, totalQuota, totalRegistered };
  }, [events]);

  // Filter & Sort
  const filteredEvents = useMemo(() => {
    return events
      .filter(ev => {
        const matchesCategory = activeCategory === 'all' || ev.category === activeCategory;
        const matchesStatus = statusFilter === 'all' || ev.status === statusFilter;
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = !query ||
          ev.title?.toLowerCase().includes(query) ||
          ev.location?.toLowerCase().includes(query) ||
          ev.organizer?.toLowerCase().includes(query) ||
          ev.description?.toLowerCase().includes(query);

        return matchesCategory && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(a.date || '2099-01-01') - new Date(b.date || '2099-01-01');
        }
        if (sortBy === 'quota') {
          return (Number(b.quota) || 0) - (Number(a.quota) || 0);
        }
        // newest default by ID
        return (b.id || '').localeCompare(a.id || '');
      });
  }, [events, activeCategory, statusFilter, searchQuery, sortBy]);

  // Handle open modal for creating new event
  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      category: 'Rektörlük & Tören',
      organizer: 'T.C. İstanbul Esenyurt Üniversitesi Rektörlüğü',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '14:00',
      location: 'Prof. Dr. Fuat Sezgin Konferans Salonu',
      quota: 300,
      registeredCount: 0,
      description: '',
      imageUrl: '',
      registrationLink: '',
      status: 'Yayında',
      featured: false,
      publishToFeed: true
    });
    setIsModalOpen(true);
  };

  // Handle open modal for editing
  const handleOpenEditModal = (ev) => {
    setEditingEvent(ev);
    setFormData({
      title: ev.title || '',
      category: ev.category || 'Rektörlük & Tören',
      organizer: ev.organizer || '',
      date: ev.date || '',
      time: ev.time || '14:00',
      location: ev.location || '',
      quota: ev.quota || 0,
      registeredCount: ev.registeredCount || 0,
      description: ev.description || '',
      imageUrl: ev.imageUrl || '',
      registrationLink: ev.registrationLink || '',
      status: ev.status || 'Yayında',
      featured: ev.featured || false,
      publishToFeed: true
    });
    setIsModalOpen(true);
  };

  // Akışta Doğrudan Paylaşma Fonksiyonu
  const handleShareToFeed = (ev) => {
    const targetId = ev.id || ('GEVT-' + Date.now().toString().slice(-6));
    const feedPost = {
      id: 'POST-GEVT-' + targetId,
      author: {
        name: ev.organizer || 'T.C. İstanbul Esenyurt Üniversitesi Rektörlüğü',
        role: 'admin',
        avatar: '/iesu-logo.svg',
        title: `🏛️ Kampüs Etkinliği • ${ev.category || 'Genel'}`
      },
      content: `🎉 ${ev.title || ''}\n\n${ev.description || ''}\n\n📅 Tarih: ${ev.date || ''} ${ev.time ? `• ${ev.time}` : ''}\n📍 Yer: ${ev.location || 'Merkez Kampüs'}${ev.quota ? `\n👥 Kontenjan: ${ev.quota} Kişi` : ''}${ev.registrationLink ? `\n🔗 Kayıt / Bilgi: ${ev.registrationLink}` : ''}`,
      image: ev.imageUrl || null,
      time: 'Az önce',
      createdAt: new Date().toISOString(),
      likes: 12,
      comments: 2,
      isGeneralEvent: true,
      eventData: { ...ev, id: targetId }
    };

    if (setPosts) {
      setPosts(prev => {
        const withoutOld = (prev || []).filter(p => p.id !== feedPost.id);
        return [feedPost, ...withoutOld];
      });
    }

    toast.success(`"${ev.title}" kampüs ve öğrenci akışında canlı olarak yayınlandı!`);
    if (logAction) logAction('Yönetici', `"${ev.title}" genel etkinliği akışta paylaşıldı.`, 'AKISTA_PAYLAS');
  };

  // Handle Save
  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date) {
      toast.error('Lütfen etkinlik başlığını ve tarihini eksiksiz giriniz.');
      return;
    }

    let savedEvent = null;

    if (editingEvent) {
      savedEvent = {
        ...editingEvent,
        ...formData,
        quota: Number(formData.quota) || 0,
        registeredCount: Number(formData.registeredCount) || 0,
        updatedAt: new Date().toISOString()
      };

      const updated = events.map(ev => ev.id === editingEvent.id ? savedEvent : ev);
      setEvents(updated);
      toast.success('Genel etkinlik başarıyla güncellendi!');
      if (logAction) logAction('Yönetici', `"${formData.title}" genel etkinliği güncellendi.`, 'ETKINLIK_GUNCELLEME');
    } else {
      savedEvent = {
        id: 'GEVT-' + Date.now().toString().slice(-6),
        ...formData,
        quota: Number(formData.quota) || 0,
        registeredCount: 0,
        createdAt: new Date().toISOString()
      };

      setEvents([savedEvent, ...events]);
      toast.success('Yeni genel etkinlik başarıyla eklendi!');
      if (logAction) logAction('Yönetici', `"${formData.title}" başlıklı yeni genel etkinlik eklendi.`, 'YENI_ETKINLIK');
    }

    // Akışta Yayınla seçildiyse ve etkinlik Yayında ise otomatik akışa da besle
    if (formData.publishToFeed && formData.status === 'Yayında' && savedEvent) {
      handleShareToFeed(savedEvent);
    }

    setIsModalOpen(false);
  };

  // Handle Delete
  const handleDeleteEvent = (id, title) => {
    if (window.confirm(`"${title}" etkinliğini kalıcı olarak silmek istediğinize emin misiniz?`)) {
      setEvents(events.filter(e => e.id !== id));
      toast.info('Etkinlik takvimden kaldırıldı.');
      if (logAction) logAction('Yönetici', `"${title}" etkinliği silindi.`, 'ETKINLIK_SILME');
    }
  };

  // Toggle Status
  const handleToggleStatus = (id) => {
    const updated = events.map(e => {
      if (e.id === id) {
        const nextStatus = e.status === 'Yayında' ? 'Taslak' : 'Yayında';
        toast.success(`Etkinlik durumu "${nextStatus}" olarak güncellendi.`);
        return { ...e, status: nextStatus };
      }
      return e;
    });
    setEvents(updated);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const exportData = filteredEvents.map(e => ({
      ID: e.id,
      Başlık: e.title,
      Kategori: e.category,
      Organizatör: e.organizer,
      Tarih: e.date,
      Saat: e.time,
      Mekan: e.location,
      Kontenjan: e.quota,
      KayıtlıSayısı: e.registeredCount || 0,
      Durum: e.status,
      KayıtLinki: e.registrationLink
    }));
    exportToCSV(exportData, 'IESU_Genel_Etkinlikler_Listesi');
    toast.success('Genel etkinlikler Excel/CSV olarak indirildi.');
  };

  // Category Badge Styles
  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Rektörlük & Tören':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          icon: '🏛️',
          label: 'Rektörlük & Tören'
        };
      case 'Akademik & Sempozyum':
        return {
          bg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
          icon: '🔬',
          label: 'Akademik Sempozyum'
        };
      case 'Kulüp & Bahar Şenliği':
        return {
          bg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
          icon: '🎪',
          label: 'Kulüp & Şenlik'
        };
      case 'Kültür & Sanat':
        return {
          bg: 'bg-purple-50 text-purple-900 border-purple-200',
          icon: '🎭',
          label: 'Kültür & Sanat'
        };
      case 'Spor & Turnuvalar':
        return {
          bg: 'bg-rose-50 text-rose-900 border-rose-200',
          icon: '🏆',
          label: 'Spor & Turnuva'
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: '📅',
          label: category || 'Genel Etkinlik'
        };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-gray-900 pb-16">

      {/* ── 1. PORTAL HEADER ──────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center font-black">
              <Calendar size={20} />
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-black text-xs uppercase tracking-wider border border-amber-100">
              Üniversite Etkinlik Koordinasyonu • Kampüs & Kültür Masası
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Genel Etkinlikler & Kampüs Yaşamı Portalı
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1 max-w-2xl">
            Kariyer odaklı etkinliklerin ötesinde; rektörlük törenleri, akademik sempozyumlar, bahar şenlikleri, kulüp festivalleri, spor müsabakaları ve sergileri bu merkezden yönetin.
          </p>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 border border-slate-200 transition cursor-pointer"
            title="Excel olarak indir"
          >
            <Download size={15} /> Excel / CSV İndir
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-amber-600/20 transition cursor-pointer"
          >
            <Plus size={16} /> Yeni Genel Etkinlik Ekle
          </button>
        </div>
      </div>

      {/* ── 2. STATS KPI CARDS ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Toplam Genel Etkinlik</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Layers size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">{stats.total}</span>
            <span className="text-xs text-emerald-600 font-bold">({stats.active} Yayında)</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-xs bg-gradient-to-br from-white to-amber-50/30">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Rektörlük & Akademik</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Landmark size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-900">{stats.academicCount}</span>
            <span className="text-xs text-amber-700 font-semibold">Tören & Sempozyum</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs bg-gradient-to-br from-white to-purple-50/30">
          <div className="flex items-center justify-between text-purple-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Kültür, Sanat & Şenlik</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <Theater size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-900">{stats.cultureFestCount}</span>
            <span className="text-xs text-purple-700 font-semibold">Festival & Spor</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Toplam Katılım / Kontenjan</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-900">{stats.totalRegistered.toLocaleString('tr-TR')}</span>
            <span className="text-xs text-emerald-700 font-semibold">/ {stats.totalQuota.toLocaleString('tr-TR')} Kapasite</span>
          </div>
        </div>
      </div>

      {/* ── 3. FILTER TABS & SEARCH BAR ───────────────────────────── */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-4">
        
        {/* Kategori Sekmeleri */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'Tüm Etkinlikler', count: events.length },
            { id: 'Rektörlük & Tören', label: '🏛️ Rektörlük & Tören', count: events.filter(e => e.category === 'Rektörlük & Tören').length },
            { id: 'Akademik & Sempozyum', label: '🔬 Akademik & Sempozyum', count: events.filter(e => e.category === 'Akademik & Sempozyum').length },
            { id: 'Kulüp & Bahar Şenliği', label: '🎪 Kulüp & Bahar Şenliği', count: events.filter(e => e.category === 'Kulüp & Bahar Şenliği').length },
            { id: 'Kültür & Sanat', label: '🎭 Kültür & Sanat', count: events.filter(e => e.category === 'Kültür & Sanat').length },
            { id: 'Spor & Turnuvalar', label: '🏆 Spor & Turnuvalar', count: events.filter(e => e.category === 'Spor & Turnuvalar').length },
          ].map(tab => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Arama & Durum Seçici */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="relative w-full sm:w-96">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Etkinlik adı, salon, organizatör ara..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-600 transition"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:border-amber-600 cursor-pointer"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="Yayında">Yayında Olanlar</option>
              <option value="Taslak">Taslak / Arşiv</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:border-amber-600 cursor-pointer"
            >
              <option value="date">Tarihe Göre Sırala</option>
              <option value="newest">En Yeni Eklenen</option>
              <option value="quota">En Yüksek Kontenjan</option>
            </select>
          </div>
        </div>

      </div>

      {/* ── 4. EVENT CARDS GRID ───────────────────────────────────── */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3">
            <Calendar size={28} />
          </div>
          <h3 className="text-base font-black text-gray-900">Aradığınız kriterlere uygun genel etkinlik bulunamadı</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            Arama teriminizi değiştirebilir veya sağ üstteki buton ile üniversite takvimine yeni bir genel etkinlik ekleyebilirsiniz.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('all'); setStatusFilter('all'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition"
          >
            Filtreleri Sıfırla
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredEvents.map((ev) => {
            const badge = getCategoryBadge(ev.category);
            const isLive = ev.status === 'Yayında';

            return (
              <div
                key={ev.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg hover:border-amber-200 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Kart Üst Görsel / Banner */}
                <div className="relative h-44 bg-slate-900 overflow-hidden shrink-0">
                  <img
                    src={ev.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    onError={(e) => { e.target.src = '/iesu-logo.svg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Kategori Rozeti & Durum */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black border backdrop-blur-md shadow-xs flex items-center gap-1 ${badge.bg}`}>
                      <span>{badge.icon}</span> {badge.label}
                    </span>

                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10">
                      <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
                      <span className="text-[10px] font-bold text-white">
                        {ev.status}
                      </span>
                    </div>
                  </div>

                  {/* Tarih Bandı */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-xs font-bold">
                    <span className="px-2 py-0.5 rounded-lg bg-amber-500/90 text-white text-[11px] font-black flex items-center gap-1">
                      <Calendar size={12} /> {ev.date}
                    </span>
                    {ev.time && (
                      <span className="px-2 py-0.5 rounded-lg bg-black/50 text-white text-[11px] font-semibold flex items-center gap-1">
                        <Clock size={12} /> {ev.time}
                      </span>
                    )}
                  </div>
                </div>

                {/* Kart Orta Bölüm */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-amber-800 font-bold">
                      <Building2 size={13} className="shrink-0 text-amber-700" />
                      <span className="truncate">{ev.organizer || 'İstanbul Esenyurt Üniversitesi'}</span>
                    </div>

                    <h3 className="text-base font-black text-gray-900 group-hover:text-amber-800 transition-colors leading-snug line-clamp-2">
                      {ev.title}
                    </h3>

                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {ev.description}
                    </p>
                  </div>

                  {/* Mekan ve Kontenjan */}
                  <div className="space-y-1.5 pt-2 text-xs text-gray-600 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-amber-700 shrink-0" />
                      <span className="font-semibold text-gray-800 truncate">{ev.location || 'Merkez Kampüs'}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users size={12} /> Kontenjan: <strong className="text-gray-900">{ev.quota || 'Serbest'}</strong>
                      </span>
                      {ev.registeredCount > 0 && (
                        <span className="text-emerald-700 font-bold">{ev.registeredCount} Kayıt</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Kart Alt Bölüm (Aksiyonlar) */}
                <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div className="text-[11px] font-bold text-gray-500">
                    {ev.featured ? (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-black">
                        <Star size={12} className="fill-amber-500 text-amber-500" /> Öne Çıkan
                      </span>
                    ) : (
                      <span>ID: {ev.id}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {ev.registrationLink && (
                      <a
                        href={ev.registrationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white hover:bg-amber-50 text-gray-600 hover:text-amber-700 border border-gray-200 transition shadow-xs"
                        title="Etkinlik Sayfası / Kayıt Linki"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}

                    <button
                      onClick={() => handleToggleStatus(ev.id)}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 text-gray-600 hover:text-slate-900 border border-gray-200 transition shadow-xs cursor-pointer"
                      title={isLive ? "Taslağa Al" : "Yayına Al"}
                    >
                      {isLive ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>

                    <button
                      onClick={() => handleShareToFeed(ev)}
                      className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 hover:text-purple-900 border border-purple-200 transition shadow-xs cursor-pointer"
                      title="Kampüs ve Öğrenci Akışında Canlı Paylaş"
                    >
                      <Share2 size={14} />
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(ev)}
                      className="p-2 rounded-xl bg-white hover:bg-amber-50 text-gray-600 hover:text-amber-700 border border-gray-200 transition shadow-xs cursor-pointer"
                      title="Düzenle"
                    >
                      <Edit3 size={14} />
                    </button>

                    <button
                      onClick={() => handleDeleteEvent(ev.id, ev.title)}
                      className="p-2 rounded-xl bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 transition shadow-xs cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ── 5. YENİ ETKİNLİK EKLE / DÜZENLE MODALI ────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 space-y-5">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-black">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    {editingEvent ? 'Genel Etkinliği Düzenle' : 'Yeni Genel Etkinlik Ekle'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Üniversite geneli tören, sempozyum, şenlik veya kültürel program detaylarını girin.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Etkinlik Başlığı *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Örn: 2025–2026 Akademik Yılı Mezuniyet Töreni"
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-bold outline-none focus:border-amber-600 cursor-pointer"
                  >
                    <option value="Rektörlük & Tören">🏛️ Rektörlük & Tören</option>
                    <option value="Akademik & Sempozyum">🔬 Akademik & Sempozyum</option>
                    <option value="Kulüp & Bahar Şenliği">🎪 Kulüp & Bahar Şenliği</option>
                    <option value="Kültür & Sanat">🎭 Kültür & Sanat</option>
                    <option value="Spor & Turnuvalar">🏆 Spor & Turnuvalar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Düzenleyen Birim / Organizatör *</label>
                  <input
                    type="text"
                    required
                    value={formData.organizer}
                    onChange={e => setFormData({ ...formData, organizer: e.target.value })}
                    placeholder="Örn: Rektörlük, SKS, Öğrenci Konseyi"
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tarih *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Saat</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                    placeholder="Örn: 14:00"
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Kontenjan</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quota}
                    onChange={e => setFormData({ ...formData, quota: e.target.value })}
                    placeholder="Örn: 300"
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Etkinlik Mekanı / Salon</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Örn: Prof. Dr. Fuat Sezgin Konferans Salonu, 3. Kat"
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Etkinlik Açıklaması & Kapsamı</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Program akışı, konuklar, hedeflenen kitle ve etkinlik içeriğini özetleyin..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-medium outline-none focus:border-amber-600 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Afiş / Görsel URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Resmi Kayıt / Duyuru Linki</label>
                  <input
                    type="url"
                    value={formData.registrationLink}
                    onChange={e => setFormData({ ...formData, registrationLink: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              {/* Durum & Öne Çıkarma */}
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <label className="font-bold text-gray-700">Yayın Durumu:</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="p-1.5 rounded-lg border border-gray-200 font-bold text-xs"
                  >
                    <option value="Yayında">Yayında</option>
                    <option value="Taslak">Taslak / Arşiv</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-0"
                  />
                  <span>Öne Çıkarılan Etkinlik Olarak İşaretle</span>
                </label>
              </div>

              {/* Akışta Paylaşım Onay Kutusu */}
              <label className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50/50 border border-purple-200/80 rounded-2xl cursor-pointer hover:bg-purple-100/50 transition">
                <input 
                  type="checkbox" 
                  checked={formData.publishToFeed}
                  onChange={e => setFormData({ ...formData, publishToFeed: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
                />
                <div className="flex-1">
                  <span className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                    <Share2 size={13} className="text-purple-600" /> Kampüs ve Öğrenci Akışında Canlı Yayınla / Paylaş
                  </span>
                  <span className="text-[11px] text-purple-700 font-medium block mt-0.5">
                    Etkinlik kaydedildiğinde tüm öğrencilerin, mezunların ve akademisyenlerin ana sayfa akışına canlı gönderi olarak düşer.
                  </span>
                </div>
              </label>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-sm"
                >
                  {editingEvent ? 'Değişiklikleri Kaydet' : 'Etkinliği Yayınla'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
