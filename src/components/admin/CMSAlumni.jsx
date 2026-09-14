import React, { useState, useMemo } from 'react';
import PanelHeader from './PanelHeader';
import MediaUploader from './MediaUploader';
import AttachmentUploader from './AttachmentUploader';
import { 
  GraduationCap, Edit, Trash2, Plus, Search, Filter, UserCircle2, Mail, 
  Briefcase, FileText, Star, CheckCircle2, Download, ClipboardList, Compass, 
  X, Globe, MapPin, ExternalLink, Sparkles
} from 'lucide-react';
import { exportToCSV } from '../../utils/export';
import CMSSurveys from './CMSSurveys';
import useAppStore from '../../store/useAppStore';
import { SUPPORTED_COUNTRIES, aggregateAlumniHubs, geocodeLocation } from '../../utils/alumniGeoData';

export default function CMSAlumni({ alumni = [], setAlumni, surveys, setSurveys, currentUser, setPosts, posts, setView }) {
  const { alumniSurveyResponses } = useAppStore();
  const [activeTab, setActiveTab] = useState('mezunlar'); // 'mezunlar' | 'kuresel_harita' | 'anketler'
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const [form, setForm] = useState({
    name: '',
    department: '',
    graduationYear: '',
    currentCompany: '',
    currentPosition: '',
    email: '',
    status: 'Mezun',
    isMentor: false,
    avatar: '',
    cvData: null,
    cvName: '',
    skills: '',
    careerStatus: 'Belirtilmedi',
    isMatch: 'Belirtilmedi',
    country: 'Türkiye',
    city: 'İstanbul',
    showOnGlobalMap: true
  });

  const handleAddNew = () => {
    setForm({
      name: '',
      department: '',
      graduationYear: '',
      currentCompany: '',
      currentPosition: '',
      email: '',
      status: 'Mezun',
      isMentor: false,
      avatar: '',
      cvData: null,
      cvName: '',
      skills: '',
      careerStatus: 'Belirtilmedi',
      isMatch: 'Belirtilmedi',
      country: 'Türkiye',
      city: 'İstanbul',
      showOnGlobalMap: true
    });
    setCurrentId(null);
    setIsEditing(true);
  };

  const handleEdit = (al) => {
    setForm({ 
      ...al, 
      skills: al.skills || '', 
      isMentor: al.isMentor || false,
      country: al.country || 'Türkiye',
      city: al.city || 'İstanbul',
      showOnGlobalMap: al.showOnGlobalMap !== false
    });
    setCurrentId(al.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu mezun kaydını silmek/arşivlemek istediğinize emin misiniz?")) {
      setAlumni(prev => (prev || []).filter(a => a.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.graduationYear) return window.toast ? window.toast.info("Ad Soyad ve Mezuniyet Yılı zorunludur.") : alert("Ad Soyad ve Mezuniyet Yılı zorunludur.");

    const geocoded = geocodeLocation(form.country, form.city);
    const updatedEntry = {
      ...form,
      coordinates: geocoded.coordinates,
      updatedAt: new Date().toISOString()
    };

    if (currentId) {
      setAlumni(prev => (prev || []).map(a => a.id === currentId ? { ...a, ...updatedEntry } : a));
    } else {
      setAlumni(prev => [{ ...updatedEntry, id: 'ALM-' + Date.now(), createdAt: new Date().toISOString() }, ...(prev || [])]);
    }
    setIsEditing(false);
  };

  const handleSPSSExport = () => {
    if (!alumniSurveyResponses || alumniSurveyResponses.length === 0) {
      return window.toast?.info ? window.toast.info('Dışa aktarılacak anket verisi bulunmuyor.') : alert('Dışa aktarılacak anket verisi bulunmuyor.');
    }
    const exportData = alumniSurveyResponses.map(r => {
      const { name, tc, phone, email, ...safeData } = r;
      return safeData;
    });
    exportToCSV(exportData, 'kariyer_checkup_spss_anonim.csv');
  };

  const safeAlumni = alumni || [];

  // Diaspora Metrics & Grouping
  const diasporaData = useMemo(() => {
    const countryMap = new Map();

    safeAlumni.forEach(a => {
      const country = a.country || 'Türkiye';
      const city = a.city || 'İstanbul';
      if (!countryMap.has(country)) {
        const countryObj = SUPPORTED_COUNTRIES.find(c => c.name.toLowerCase() === country.toLowerCase());
        countryMap.set(country, {
          country,
          flag: countryObj ? countryObj.flag : '📍',
          count: 0,
          cities: new Set(),
          alumni: []
        });
      }
      const entry = countryMap.get(country);
      entry.count += 1;
      if (city) entry.cities.add(city);
      entry.alumni.push(a);
    });

    const abroadAlumni = safeAlumni.filter(a => a.country && a.country !== 'Türkiye');
    const abroadPercentage = safeAlumni.length > 0 ? Math.round((abroadAlumni.length / safeAlumni.length) * 100) : 0;
    const mapActiveCount = safeAlumni.filter(a => a.showOnGlobalMap !== false).length;

    return {
      countriesList: Array.from(countryMap.values()).sort((a, b) => b.count - a.count),
      totalCountries: countryMap.size,
      abroadCount: abroadAlumni.length,
      abroadPercentage,
      mapActiveCount
    };
  }, [safeAlumni]);

  const filtered = safeAlumni.filter(a => {
    const matchQ = (a.name||'').toLowerCase().includes(searchQuery.toLowerCase()) || 
                   (a.currentCompany||'').toLowerCase().includes(searchQuery.toLowerCase()) ||
                   (a.city||'').toLowerCase().includes(searchQuery.toLowerCase()) ||
                   (a.country||'').toLowerCase().includes(searchQuery.toLowerCase());
    const matchS = statusFilter === 'all' || (a.status||'').toLowerCase() === statusFilter.toLowerCase();
    const matchC = countryFilter === 'all' || (a.country||'').toLowerCase() === countryFilter.toLowerCase();
    return matchQ && matchS && matchC;
  });

  const mentorCount = safeAlumni.filter(a => a.isMentor).length;
  const employedCount = safeAlumni.filter(a => a.careerStatus === 'Çalışıyorum' || a.currentCompany).length;
  const totalWithStatus = safeAlumni.filter(a => a.careerStatus && a.careerStatus !== 'Belirtilmedi').length || 1;
  const employmentRate = Math.round((employedCount / totalWithStatus) * 100);
  const matchedCount = safeAlumni.filter(a => (a.careerStatus === 'Çalışıyorum' || a.currentCompany) && a.isMatch === 'Evet').length;
  const matchRate = employedCount > 0 ? Math.round((matchedCount / employedCount) * 100) : 0;

  const listView = (
    <div className="space-y-6">
      {/* HEADER & STATS */}
      <PanelHeader 
        title={
          activeTab === 'mezunlar' ? "Mezun Havuzu & Yönetimi" : 
          activeTab === 'kuresel_harita' ? "Küresel Mezun Dağılımı & Diaspora" : 
          "Mezun Anketleri"
        } 
        sub={
          activeTab === 'mezunlar' ? "Sisteme kayıtlı mezunları yönetin, lokasyon ve kariyer durumlarını takip edin." : 
          activeTab === 'kuresel_harita' ? "Mezunların dünya genelindeki dağılımını, ülkeleri ve küresel teknoloji merkezlerini izleyin." : 
          "Mezunlara yönelik anketler oluşturun ve performans değerlendirmelerini takip edin."
        } 
        action={
          activeTab === 'mezunlar' ? (
            <button onClick={handleAddNew} className="bg-white text-purple-600 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all">
              <Plus size={18} /> Mezun Ekle
            </button>
          ) : activeTab === 'kuresel_harita' ? (
            <button 
              onClick={() => setView && setView('global_map')} 
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Globe size={18} /> Canlı Mezun Haritasını Aç
            </button>
          ) : null
        } 
      />

      {/* TABS */}
      <div className="flex gap-2 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('mezunlar')} 
          className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'mezunlar' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <GraduationCap size={18} /> Mezun Yönetimi
        </button>
        <button 
          onClick={() => setActiveTab('kuresel_harita')} 
          className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'kuresel_harita' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Globe size={18} /> 🌍 Küresel Mezun Dağılımı & Harita
        </button>
        <button 
          onClick={() => setActiveTab('anketler')} 
          className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'anketler' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <ClipboardList size={18} /> Anket Havuzu
        </button>
      </div>

      {activeTab === 'anketler' ? (
        <CMSSurveys surveys={surveys} setSurveys={setSurveys} currentUser={currentUser} setPosts={setPosts} posts={posts} isAlumniTab={true} />
      ) : activeTab === 'kuresel_harita' ? (
        /* ========================================================================= */
        /* TAB: KÜRESEL MEZUN DAĞILIMI & HARİTA VIEW                                  */
        /* ========================================================================= */
        <div className="space-y-6 animate-fade-in">
          {/* Diaspora KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Globe size={24}/>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Aktif Ülke Sayısı</p>
                <p className="text-2xl font-black text-gray-900">{diasporaData.totalCountries}</p>
                <span className="text-[10px] text-blue-600 font-bold">Global Ağ</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <MapPin size={24}/>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Yurt Dışı Mezun</p>
                <p className="text-2xl font-black text-gray-900">{diasporaData.abroadCount} <span className="text-xs font-bold text-gray-500">(%{diasporaData.abroadPercentage})</span></p>
                <span className="text-[10px] text-purple-600 font-bold">Uluslararası İstihdam</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 size={24}/>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Haritada Görünür</p>
                <p className="text-2xl font-black text-gray-900">{diasporaData.mapActiveCount}</p>
                <span className="text-[10px] text-emerald-600 font-bold">Canlı Lokasyon</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Star size={24}/>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Lider Merkezler</p>
                <p className="text-sm font-black text-gray-900 truncate">Berlin, Londra, SF</p>
                <span className="text-[10px] text-amber-600 font-bold">Küresel Teknoloji Hubları</span>
              </div>
            </div>
          </div>

          {/* Interactive Map Banner */}
          <div className="p-6 bg-gradient-to-r from-[#020817] via-[#0f172a] to-[#1e293b] text-white rounded-3xl border border-cyan-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles size={13} className="text-cyan-400" /> İESÜ İnteraktif Küresel Harita
              </span>
              <h3 className="text-xl font-black text-white">Küresel Mezun Ağını Harita Üzerinde Görselleştirin</h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Mezunların bildirdiği ülke ve şehirlere göre ışıldayan canlı dünya haritasını tam ekranda açabilir, bölge filtreleri uygulayabilir ve mezunlarla anında iletişime geçebilirsiniz.
              </p>
            </div>
            <button
              onClick={() => setView && setView('global_map')}
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl text-xs font-black transition shadow-lg shadow-cyan-500/20 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Globe size={16} /> Haritayı Aç
            </button>
          </div>

          {/* Country Cards Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ülke Bazlı Mezun Dağılımı ({diasporaData.countriesList.length} Ülke)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {diasporaData.countriesList.map(c => (
                <div key={c.country} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <h5 className="font-black text-gray-900 text-sm">{c.country}</h5>
                        <p className="text-[11px] text-gray-500 font-medium">
                          {Array.from(c.cities).join(', ') || 'Çeşitli Şehirler'}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-black">
                      {c.count} Mezun
                    </span>
                  </div>

                  {/* Alumni avatars in this country */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center -space-x-2 overflow-hidden">
                      {c.alumni.slice(0, 4).map((al, idx) => (
                        <div key={al.id || idx} className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white overflow-hidden shrink-0" title={al.name}>
                          {al.avatar ? (
                            <img src={al.avatar} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                              {al.name?.[0] || 'M'}
                            </div>
                          )}
                        </div>
                      ))}
                      {c.alumni.length > 4 && (
                        <span className="text-[10px] font-bold text-gray-500 pl-3">
                          +{c.alumni.length - 4} diğer
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={() => setView && setView('global_map')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      Haritada Gör <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* TAB: MEZUN YÖNETİMİ (STANDART TABLO VIEW)                                  */
        /* ========================================================================= */
        <>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><GraduationCap size={24}/></div>
                <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Toplam Mezun</p><p className="text-2xl font-black text-gray-900">{safeAlumni.length}</p></div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Briefcase size={24}/></div>
                <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">İstihdam Oranı</p><p className="text-2xl font-black text-gray-900">%{employmentRate}</p></div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-red-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={24}/></div>
                <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Alan Uyumu</p><p className="text-2xl font-black text-gray-900">%{matchRate}</p></div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center"><Star size={24}/></div>
                <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Gönüllü Mentor</p><p className="text-2xl font-black text-gray-900">{mentorCount}</p></div>
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
              <input 
                type="text" placeholder="Ad Soyad, Firma veya Şehir/Ülke ara..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500/20 transition-all"
                value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select value={countryFilter} onChange={e=>setCountryFilter(e.target.value)} className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500/20 outline-none cursor-pointer">
                <option value="all">Tüm Ülkeler</option>
                {SUPPORTED_COUNTRIES.map(c => (
                  <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
              <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500/20 outline-none cursor-pointer">
                <option value="all">Tüm Durumlar</option>
                <option value="mezun">Mezun</option>
                <option value="pasif">Pasif</option>
              </select>
              <button onClick={() => exportToCSV(filtered, 'mezunlar.csv')} className="flex items-center gap-2 p-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition text-sm font-bold">
                <Download size={18} /> Excel
              </button>
              <button onClick={handleSPSSExport} className="flex items-center gap-2 p-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition text-sm font-bold shadow-sm">
                <Download size={18} /> SPSS (Anonim)
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center mb-4"><GraduationCap size={32}/></div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Kayıt Bulunamadı</h3>
                <p className="text-sm text-gray-500">Arama kriterlerine uygun mezun bulunmuyor.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Mezun</th>
                    <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Bölüm & Yıl</th>
                    <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Küresel Konum</th>
                    <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Kariyer Durumu</th>
                    <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Sistem Durumu</th>
                    <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50/50 transition group">
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                            {a.avatar ? <img src={a.avatar} className="w-full h-full object-cover" /> : <UserCircle2 size={20} className="text-gray-500"/>}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                              {a.name}
                              {a.isMentor && <Star size={12} className="text-yellow-500 fill-current" />}
                            </p>
                            <p className="text-[11px] font-medium text-gray-500 mt-0.5">{a.email || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <p className="text-xs font-bold text-gray-700">{a.department || 'Belirtilmedi'}</p>
                        <p className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase">{a.graduationYear ? `${a.graduationYear} Mezunu` : '-'}</p>
                      </td>
                      <td className="py-3 px-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">
                              {SUPPORTED_COUNTRIES.find(c => c.name.toLowerCase() === (a.country||'').toLowerCase())?.flag || '📍'}
                            </span>
                            <span className="text-xs font-bold text-gray-800">
                              {a.city ? `${a.city}, ${a.country || 'Türkiye'}` : (a.country || 'Türkiye')}
                            </span>
                          </div>
                          {a.showOnGlobalMap !== false ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-md text-[10px] font-bold">
                              <Globe size={10} /> Haritada Aktif
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400 font-medium">Gizli</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        {a.careerStatus && a.careerStatus !== 'Belirtilmedi' ? (
                          <div>
                            <p className={`text-xs font-bold px-2 py-0.5 rounded w-fit uppercase ${a.careerStatus === 'Çalışıyorum' ? 'bg-emerald-50 text-emerald-700' : a.careerStatus === 'İş Arıyorum' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>{a.careerStatus}</p>
                            {a.currentCompany && <p className="text-[10px] font-bold text-gray-500 mt-1">{a.currentCompany} - {a.currentPosition || a.title}</p>}
                            {a.careerStatus === 'Çalışıyorum' && (
                              <p className="text-[9px] font-bold mt-1 uppercase" style={{color: a.isMatch === 'Evet' ? '#10B981' : '#F43F5E'}}>
                                Alan Uyumu: {a.isMatch}
                              </p>
                            )}
                          </div>
                        ) : a.currentCompany || a.company ? (
                          <div>
                            <p className="text-xs font-bold text-gray-900">{a.currentCompany || a.company}</p>
                            <p className="text-[11px] text-gray-500">{a.currentPosition || a.title || 'Mezun'}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Belirtilmedi</span>
                        )}
                      </td>
                      <td className="py-3 px-5">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${a.status === 'Mezun' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                          {alumniSurveyResponses?.find(r => r.email === a.email || r.department === a.department) && (
                            <button 
                              title="Anket Yanıtını Gör"
                              onClick={() => {
                                const sr = alumniSurveyResponses.find(r => r.email === a.email || r.department === a.department);
                                setSelectedSurvey({ alumni: a, response: sr });
                              }} 
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-indigo-50 rounded-lg transition"
                            >
                              <Compass size={16}/>
                            </button>
                          )}
                          <button onClick={() => handleEdit(a)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Edit size={16}/></button>
                          <button onClick={() => handleDelete(a.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );

  const formView = (
    <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-black text-gray-900">{currentId ? 'Mezun Profili Düzenle' : 'Yeni Mezun Ekle'}</h3>
        <button type="button" onClick={() => setIsEditing(false)} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition">Listeye Dön</button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          <div className="w-full sm:w-1/3 shrink-0">
            <MediaUploader 
              label="Profil Fotoğrafı" 
              image={form.avatar} 
              onImageChange={(val) => setForm({...form, avatar: val})} 
              aspect="1:1" 
            />
          </div>
          
          <div className="w-full sm:w-2/3 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Ad Soyad <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" required />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">E-posta</label>
                <input type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Mezun Olduğu Bölüm</label>
                <input type="text" value={form.department} onChange={e=>setForm({...form, department: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Mezuniyet Yılı <span className="text-red-500">*</span></label>
                <input type="number" value={form.graduationYear} onChange={e=>setForm({...form, graduationYear: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" required placeholder="Örn: 2024" />
              </div>
            </div>

            {/* Küresel Lokasyon & Diaspora Alanı */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Globe size={14} className="text-blue-600" /> Küresel Diaspora Lokasyonu
                </span>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.showOnGlobalMap !== false}
                    onChange={e => setForm({ ...form, showOnGlobalMap: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                  />
                  Haritada Göster
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-1">Ülke</label>
                  <select 
                    value={form.country || 'Türkiye'} 
                    onChange={e=>setForm({...form, country: e.target.value})} 
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    {SUPPORTED_COUNTRIES.map(c => (
                      <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-1">Şehir</label>
                  <input 
                    type="text" 
                    value={form.city || ''} 
                    onChange={e=>setForm({...form, city: e.target.value})} 
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold" 
                    placeholder="Örn: Berlin, Londra, İstanbul..." 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Çalıştığı Şirket</label>
                <input type="text" value={form.currentCompany} onChange={e=>setForm({...form, currentCompany: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Mevcut Pozisyonu</label>
                <input type="text" value={form.currentPosition} onChange={e=>setForm({...form, currentPosition: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Kariyer Durumu</label>
                <select value={form.careerStatus} onChange={e=>setForm({...form, careerStatus: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                  <option value="Belirtilmedi">Belirtilmedi</option>
                  <option value="Çalışıyorum">Çalışıyorum</option>
                  <option value="İş Arıyorum">İş Arıyorum</option>
                  <option value="Eğitimime Devam Ediyorum">Eğitimime Devam Ediyorum</option>
                  <option value="Çalışmıyorum">Çalışmıyorum</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Bölüm/Alan Uyumu</label>
                <select value={form.isMatch} onChange={e=>setForm({...form, isMatch: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                  <option value="Belirtilmedi">Belirtilmedi</option>
                  <option value="Evet">Evet (Bölümümle İlgili)</option>
                  <option value="Hayır">Hayır (Farklı Sektör)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isMentor} onChange={e=>setForm({...form, isMentor: e.target.checked})} className="w-4 h-4 text-red-600 rounded cursor-pointer" />
                <span className="text-xs font-bold text-gray-700">Öğrencilere Mentorluk Yapabilir</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition">İptal</button>
          <button type="submit" className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-md transition">Kaydet</button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="space-y-6">
      {isEditing ? formView : listView}

      {/* Survey Response Detail Modal */}
      {selectedSurvey && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-gray-900 flex items-center gap-2">
                <Compass className="text-purple-600" size={20}/>
                {selectedSurvey.alumni?.name} - Kariyer Check-Up Yanıtı
              </h3>
              <button onClick={() => setSelectedSurvey(null)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                <X size={20}/>
              </button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 text-sm">
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-xs font-bold text-gray-500 block">Mezun Bilgisi:</span>
                <span className="font-bold text-gray-800">{selectedSurvey.alumni?.name} ({selectedSurvey.alumni?.department})</span>
              </div>
              <div className="space-y-2">
                {Object.entries(selectedSurvey.response?.answers || {}).map(([qKey, aVal], idx) => (
                  <div key={idx} className="p-3 border rounded-xl bg-white shadow-sm flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-600">{qKey}</span>
                    <span className="font-bold text-purple-700">{aVal}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-3 flex justify-end">
              <button onClick={() => setSelectedSurvey(null)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold">Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
