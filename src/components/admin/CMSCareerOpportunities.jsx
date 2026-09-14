import React, { useState, useMemo } from 'react';
import {
  TrendingUp, Plus, Search, Filter, Trash2, Edit3, ExternalLink,
  Calendar, MapPin, Building2, Download, CheckCircle2, AlertCircle,
  Clock, Sparkles, Award, Star, Compass, Tag, Layers, ArrowUpRight,
  ShieldCheck, Eye, EyeOff, X, Users, Globe, Flame
} from 'lucide-react';
import { exportToCSV } from '../../utils/export';
import { toast } from '../shared/Toast';
import useAppStore from '../../store/useAppStore';

export default function CMSCareerOpportunities({ careerOpportunities: propsOpps, setCareerOpportunities: propsSetOpps }) {
  const storeOpps = useAppStore(state => state.careerOpportunities) || [];
  const storeSetOpps = useAppStore(state => state.setCareerOpportunities);
  const logAction = useAppStore(state => state.logAction);

  const opportunities = propsOpps && propsOpps.length > 0 ? propsOpps : storeOpps;
  const setOpportunities = propsSetOpps || storeSetOpps;

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'deadline', 'applicants'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    category: 'MT Programı',
    location: 'İstanbul (Hibrit)',
    deadline: '',
    targetAudience: '',
    description: '',
    benefits: '',
    logo: '',
    applicationUrl: '',
    status: 'Yayında',
    featured: false
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const total = opportunities.length;
    const active = opportunities.filter(o => o.status === 'Yayında').length;
    const mtCount = opportunities.filter(o => o.category === 'MT Programı').length;
    const globalCount = opportunities.filter(o => o.category === 'Global / Yurt Dışı').length;
    const totalApplicants = opportunities.reduce((acc, curr) => acc + (curr.applicantCount || 0), 0);

    return { total, active, mtCount, globalCount, totalApplicants };
  }, [opportunities]);

  // Filter & Sort
  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter(opp => {
        const matchesCategory = activeCategory === 'all' || opp.category === activeCategory;
        const matchesStatus = statusFilter === 'all' || opp.status === statusFilter;
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = !query || 
          opp.title?.toLowerCase().includes(query) ||
          opp.organization?.toLowerCase().includes(query) ||
          opp.targetAudience?.toLowerCase().includes(query) ||
          opp.location?.toLowerCase().includes(query);

        return matchesCategory && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          return new Date(a.deadline || '2099-01-01') - new Date(b.deadline || '2099-01-01');
        }
        if (sortBy === 'applicants') {
          return (b.applicantCount || 0) - (a.applicantCount || 0);
        }
        // newest default
        return (b.id || '').localeCompare(a.id || '');
      });
  }, [opportunities, activeCategory, statusFilter, searchQuery, sortBy]);

  // Handle open modal for creating new opportunity
  const handleOpenCreateModal = () => {
    setEditingOpportunity(null);
    setFormData({
      title: '',
      organization: '',
      category: 'MT Programı',
      location: 'İstanbul (Hibrit)',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      targetAudience: 'Mühendislik & İİBF Son Sınıf ve Yeni Mezunlar',
      description: '',
      benefits: 'Tam Zamanlı İstihdam, Mentorluk Desteği, Sertifika',
      logo: 'https://ui-avatars.com/api/?name=IESU&background=990000&color=fff&size=120',
      applicationUrl: 'https://esenyurt.edu.tr',
      status: 'Yayında',
      featured: false
    });
    setIsModalOpen(true);
  };

  // Handle open modal for editing
  const handleOpenEditModal = (opp) => {
    setEditingOpportunity(opp);
    setFormData({
      title: opp.title || '',
      organization: opp.organization || '',
      category: opp.category || 'MT Programı',
      location: opp.location || '',
      deadline: opp.deadline || '',
      targetAudience: opp.targetAudience || '',
      description: opp.description || '',
      benefits: Array.isArray(opp.benefits) ? opp.benefits.join(', ') : (opp.benefits || ''),
      logo: opp.logo || '',
      applicationUrl: opp.applicationUrl || '',
      status: opp.status || 'Yayında',
      featured: opp.featured || false
    });
    setIsModalOpen(true);
  };

  // Handle Save
  const handleSaveOpportunity = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.organization.trim()) {
      toast.error('Lütfen başlık ve kurum adını eksiksiz giriniz.');
      return;
    }

    const benefitsArray = formData.benefits
      ? formData.benefits.split(',').map(b => b.trim()).filter(Boolean)
      : [];

    if (editingOpportunity) {
      // Update existing
      const updated = opportunities.map(o => o.id === editingOpportunity.id ? {
        ...o,
        ...formData,
        benefits: benefitsArray,
        updatedAt: new Date().toISOString()
      } : o);

      setOpportunities(updated);
      toast.success('Kariyer fırsatı başarıyla güncellendi!');
      if (logAction) logAction('Yönetici', `"${formData.title}" fırsatı güncellendi.`, 'FIRSAT_GUNCELLEME');
    } else {
      // Create new
      const newOpp = {
        id: 'OPP-' + Date.now().toString().slice(-6),
        ...formData,
        benefits: benefitsArray,
        applicantCount: 0,
        createdAt: new Date().toISOString()
      };

      setOpportunities([newOpp, ...opportunities]);
      toast.success('Yeni kariyer fırsatı başarıyla yayınlandı!');
      if (logAction) logAction('Yönetici', `"${formData.title}" başlıklı yeni kariyer fırsatı yayınlandı.`, 'YENI_FIRSAT');
    }

    setIsModalOpen(false);
  };

  // Handle Delete
  const handleDeleteOpportunity = (id, title) => {
    if (window.confirm(`"${title}" fırsatını kalıcı olarak silmek istediğinize emin misiniz?`)) {
      setOpportunities(opportunities.filter(o => o.id !== id));
      toast.info('Kariyer fırsatı yayından kaldırıldı.');
      if (logAction) logAction('Yönetici', `"${title}" fırsatı silindi.`, 'FIRSAT_SILME');
    }
  };

  // Toggle Status
  const handleToggleStatus = (id) => {
    const updated = opportunities.map(o => {
      if (o.id === id) {
        const nextStatus = o.status === 'Yayında' ? 'Pasif' : 'Yayında';
        toast.success(`Fırsat durumu "${nextStatus}" olarak güncellendi.`);
        return { ...o, status: nextStatus };
      }
      return o;
    });
    setOpportunities(updated);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const exportData = filteredOpportunities.map(o => ({
      ID: o.id,
      Başlık: o.title,
      Kurum: o.organization,
      Kategori: o.category,
      Konum: o.location,
      SonBaşvuru: o.deadline,
      HedefKitle: o.targetAudience,
      Durum: o.status,
      AdaySayısı: o.applicantCount || 0,
      BaşvuruLinki: o.applicationUrl
    }));
    exportToCSV(exportData, 'IESU_Kariyer_Firsatlari_Listesi');
    toast.success('Kariyer fırsatları Excel/CSV olarak indirildi.');
  };

  // Category Colors and Badges
  const getCategoryBadge = (category) => {
    switch (category) {
      case 'MT Programı':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          icon: '🌟',
          tag: 'Yönetici Adayı & MT'
        };
      case 'Global / Yurt Dışı':
        return {
          bg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
          icon: '🌍',
          tag: 'Global & Erasmus+'
        };
      case 'Yarışma & Hackathon':
        return {
          bg: 'bg-purple-50 text-purple-900 border-purple-200',
          icon: '🏆',
          tag: 'Yarışma & Hackathon'
        };
      case 'Burs & Hibe':
        return {
          bg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
          icon: '🎓',
          tag: 'Burs & Girişimcilik'
        };
      case 'Yetenek Akademisi':
        return {
          bg: 'bg-blue-50 text-blue-900 border-blue-200',
          icon: '🚀',
          tag: 'Yetenek Akademisi'
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: '✨',
          tag: category || 'Özel Fırsat'
        };
    }
  };

  // Calculate days remaining
  const getRemainingDays = (deadline) => {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: 'Süresi Doldu', expired: true };
    if (days === 0) return { text: 'Bugün Son Gün!', urgent: true };
    return { text: `Son ${days} Gün`, days };
  };

  return (
    <div className="space-y-6 animate-fade-in text-gray-900 pb-16">
      
      {/* ── 1. PORTAL HEADER & TITLE ───────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-9 h-9 rounded-xl bg-red-50 text-[#990000] border border-red-100 flex items-center justify-center font-black">
              <TrendingUp size={20} />
            </span>
            <span className="px-3 py-1 rounded-full bg-red-50 text-[#990000] font-black text-xs uppercase tracking-wider border border-red-100">
              Kariyer Geliştirme Merkezi • Fırsat Masası
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Kariyer Fırsatları & Küresel Olanaklar Portalı
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1 max-w-2xl">
            Standart iş ilanlarının ötesinde; Yönetici Adayı (MT) programları, AB & Erasmus+ bursları, TÜBİTAK fonları, hackathonlar ve prestijli yetenek akademilerini bu merkezden yönetin.
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
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-900 via-[#990000] to-red-700 hover:from-red-800 hover:to-red-600 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-red-900/20 transition cursor-pointer"
          >
            <Plus size={16} /> Yeni Fırsat Yayınla
          </button>
        </div>
      </div>

      {/* ── 2. STATS KPI CARDS ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Toplam Fırsat</span>
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
            <span className="text-xs font-bold uppercase tracking-wider">MT & Liderlik Programı</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Award size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-900">{stats.mtCount}</span>
            <span className="text-xs text-amber-700 font-semibold">Kurumsal Holding</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-xs bg-gradient-to-br from-white to-indigo-50/30">
          <div className="flex items-center justify-between text-indigo-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Global & Yurt Dışı</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
              <Globe size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-900">{stats.globalCount}</span>
            <span className="text-xs text-indigo-700 font-semibold">AB & Erasmus Hibeli</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-xs bg-gradient-to-br from-white to-red-50/30">
          <div className="flex items-center justify-between text-[#990000] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Toplam Başvuru / İlgi</span>
            <div className="w-8 h-8 rounded-xl bg-red-100 text-[#990000] flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#990000]">{stats.totalApplicants}</span>
            <span className="text-xs text-slate-500 font-semibold">Öğrenci & Mezun</span>
          </div>
        </div>
      </div>

      {/* ── 3. FILTER TABS & SEARCH BAR ───────────────────────────── */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-4">
        
        {/* Kategori Sekmeleri */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'Tüm Fırsatlar', icon: Sparkles, count: opportunities.length },
            { id: 'MT Programı', label: '🌟 Yönetici Adayı (MT)', count: stats.mtCount },
            { id: 'Global / Yurt Dışı', label: '🌍 Global & Yurt Dışı', count: stats.globalCount },
            { id: 'Yarışma & Hackathon', label: '🏆 Yarışma & Hackathon', count: opportunities.filter(o => o.category === 'Yarışma & Hackathon').length },
            { id: 'Burs & Hibe', label: '🎓 Burs & Girişimcilik', count: opportunities.filter(o => o.category === 'Burs & Hibe').length },
            { id: 'Yetenek Akademisi', label: '🚀 Yetenek Akademisi', count: opportunities.filter(o => o.category === 'Yetenek Akademisi').length },
          ].map(tab => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#990000] text-white shadow-sm'
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
              placeholder="Fırsat adı, kurum veya bölüm ara..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium focus:bg-white focus:outline-none focus:border-[#990000] transition"
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
              className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#990000] cursor-pointer"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="Yayında">Yayında Olanlar</option>
              <option value="Pasif">Pasif / Taslak</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#990000] cursor-pointer"
            >
              <option value="newest">En Yeni Eklenen</option>
              <option value="deadline">Son Başvuru Tarihine Göre</option>
              <option value="applicants">En Çok Başvuru Alan</option>
            </select>
          </div>

        </div>

      </div>

      {/* ── 4. OPPORTUNITY CARDS GRID ──────────────────────────────── */}
      {filteredOpportunities.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-red-50 text-[#990000] flex items-center justify-center mx-auto mb-3">
            <Compass size={28} />
          </div>
          <h3 className="text-base font-black text-gray-900">Aradığınız kriterlere uygun fırsat bulunamadı</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            Arama teriminizi değiştirebilir veya sağ üstteki buton ile sisteme yeni bir kariyer fırsatı ekleyebilirsiniz.
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
          {filteredOpportunities.map((opp) => {
            const badge = getCategoryBadge(opp.category);
            const remaining = getRemainingDays(opp.deadline);
            const isLive = opp.status === 'Yayında';

            return (
              <div
                key={opp.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg hover:border-red-100 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Kart Üst Bölüm */}
                <div className="p-6 space-y-4">
                  
                  {/* Başlık Satırı: Logo, Kurum & Rozetler */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={opp.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(opp.organization)}&background=990000&color=fff&size=100`}
                        alt={opp.organization}
                        className="w-12 h-12 rounded-2xl object-cover border border-gray-100 shadow-xs shrink-0"
                        onError={(e) => { e.target.src = '/iesu-logo.svg'; }}
                      />
                      <div>
                        <span className="text-[11px] font-bold text-gray-500 line-clamp-1">
                          {opp.organization}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border flex items-center gap-1 ${badge.bg}`}>
                            <span>{badge.icon}</span> {badge.tag}
                          </span>
                          {opp.featured && (
                            <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black flex items-center gap-0.5" title="Öne Çıkan Fırsat">
                              <Star size={10} className="fill-amber-500 text-amber-500" /> Öne Çıkan
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Durum Göstergesi */}
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                      <span className={`text-[10px] font-black ${isLive ? 'text-emerald-700' : 'text-gray-400'}`}>
                        {opp.status}
                      </span>
                    </div>
                  </div>

                  {/* Fırsat Başlığı */}
                  <div>
                    <h3 className="text-base font-black text-gray-900 group-hover:text-[#990000] transition-colors leading-snug line-clamp-2">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                      {opp.description}
                    </p>
                  </div>

                  {/* Hedef Kitle & Lokasyon */}
                  <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Compass size={13} className="text-[#990000] shrink-0" />
                      <span className="font-semibold text-gray-700 truncate">
                        <strong>Hedef:</strong> {opp.targetAudience || 'Tüm Bölümler'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-gray-400 shrink-0" />
                      <span className="truncate">{opp.location || 'Türkiye Geneli'}</span>
                    </div>
                  </div>

                  {/* Sağlanan Avantajlar (Benefits) */}
                  {opp.benefits && opp.benefits.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {opp.benefits.slice(0, 3).map((benefit, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-red-50/70 text-[#990000] text-[10px] font-bold border border-red-100"
                        >
                          ✓ {benefit}
                        </span>
                      ))}
                      {opp.benefits.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-bold">
                          +{opp.benefits.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                </div>

                {/* Kart Alt Bölüm (Son Başvuru & Butonlar) */}
                <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-3">
                  
                  {/* Kalan Gün / Son Başvuru */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold">
                      <Clock size={12} className={remaining?.expired ? 'text-red-500' : 'text-gray-400'} />
                      <span className={remaining?.expired ? 'text-red-600' : remaining?.urgent ? 'text-amber-600' : 'text-gray-600'}>
                        {remaining ? remaining.text : opp.deadline}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium mt-0.5">
                      {opp.applicantCount || 0} Aday Başvurdu
                    </div>
                  </div>

                  {/* Aksiyon İkonları */}
                  <div className="flex items-center gap-1.5">
                    {opp.applicationUrl && (
                      <a
                        href={opp.applicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white hover:bg-red-50 text-gray-600 hover:text-[#990000] border border-gray-200 transition shadow-xs"
                        title="Dış Bağlantıyı Aç"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}

                    <button
                      onClick={() => handleToggleStatus(opp.id)}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 text-gray-600 hover:text-slate-900 border border-gray-200 transition shadow-xs cursor-pointer"
                      title={isLive ? "Yayından Kaldır (Pasife Al)" : "Yayına Al"}
                    >
                      {isLive ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(opp)}
                      className="p-2 rounded-xl bg-white hover:bg-amber-50 text-gray-600 hover:text-amber-700 border border-gray-200 transition shadow-xs cursor-pointer"
                      title="Düzenle"
                    >
                      <Edit3 size={14} />
                    </button>

                    <button
                      onClick={() => handleDeleteOpportunity(opp.id, opp.title)}
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

      {/* ── 5. YENİ FIRSAT EKLE / DÜZENLE MODALI ──────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#990000] flex items-center justify-center font-black">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    {editingOpportunity ? 'Kariyer Fırsatını Düzenle' : 'Yeni Kariyer Fırsatı Yayınla'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Öğrencilere ve mezunlara sunulacak prestijli program detaylarını girin.
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

            {/* Modal Form */}
            <form onSubmit={handleSaveOpportunity} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Fırsat Başlığı *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Örn: Koç Holding Genç Yetenek & MT 2026"
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-[#990000]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sağlayıcı Kurum / Firma *</label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={e => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Örn: Koç Holding A.Ş."
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-[#990000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-bold outline-none focus:border-[#990000] cursor-pointer"
                  >
                    <option value="MT Programı">🌟 MT & Yönetici Adayı</option>
                    <option value="Global / Yurt Dışı">🌍 Global & Yurt Dışı</option>
                    <option value="Yarışma & Hackathon">🏆 Yarışma & Hackathon</option>
                    <option value="Burs & Hibe">🎓 Burs & Hibe Fonu</option>
                    <option value="Yetenek Akademisi">🚀 Yetenek Akademisi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Konum & Model</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Örn: İstanbul (Hibrit)"
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-[#990000]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Son Başvuru Tarihi</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-[#990000]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Hedef Kitle (Fakülte / Bölümler / Sınıf)</label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="Örn: Mühendislik & İİBF Son Sınıf ve Yeni Mezunlar"
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-[#990000]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Fırsat Açıklaması & Kapsamı</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Programın amacı, rotasyon planı veya başvuru şartlarını kısaca özetleyin..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-medium outline-none focus:border-[#990000] resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Sağlanan Avantajlar (Virgülle ayırınız)</label>
                <input
                  type="text"
                  value={formData.benefits}
                  onChange={e => setFormData({ ...formData, benefits: e.target.value })}
                  placeholder="Tam Zamanlı İstihdam, Yurt Dışı Eğitimi, Maaş & SGK, Mentorluk"
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-[#990000]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Resmi Başvuru / Şartname Linki</label>
                  <input
                    type="url"
                    value={formData.applicationUrl}
                    onChange={e => setFormData({ ...formData, applicationUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-[#990000]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Kurum Logo / Avatar URL</label>
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={e => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="https://... veya boş bırakın"
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-[#990000]"
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
                    <option value="Pasif">Pasif / Taslak</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-[#990000] focus:ring-0"
                  />
                  <span>Öne Çıkarılan Fırsat Olarak İşaretle</span>
                </label>
              </div>

              {/* Form Buttons */}
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
                  className="px-6 py-2.5 rounded-xl bg-[#990000] hover:bg-red-800 text-white font-bold transition shadow-sm"
                >
                  {editingOpportunity ? 'Değişiklikleri Kaydet' : 'Fırsatı Yayınla'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
