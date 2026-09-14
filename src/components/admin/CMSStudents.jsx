import React, { useState } from 'react';
import PanelHeader from './PanelHeader';
import MediaUploader from './MediaUploader';
import AttachmentUploader from './AttachmentUploader';
import CMSCandidatePool from './CMSCandidatePool';
import { GraduationCap, Edit, Trash2, Plus, Search, Filter, UserCircle2, Mail, Briefcase, FileText, CheckCircle2, Download, Users, UserCheck, Sparkles, Layers } from 'lucide-react';
import { exportToCSV } from '../../utils/export';

export default function CMSStudents({ students = [], setStudents }) {
  const [activeTab, setActiveTab] = useState('staj_takip'); // 'staj_takip' | 'aday_havuzu'
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [form, setForm] = useState({
    name: '',
    studentId: '',
    department: '',
    year: '',
    email: '',
    status: 'Aktif',
    internshipStatus: 'Arıyor',
    avatar: '',
    cvData: null,
    cvName: '',
    skills: ''
  });

  const handleAddNew = () => {
    setForm({
      name: '',
      studentId: '',
      department: '',
      year: '',
      email: '',
      status: 'Aktif',
      internshipStatus: 'Arıyor',
      avatar: '',
      cvData: null,
      cvName: '',
      skills: ''
    });
    setCurrentId(null);
    setIsEditing(true);
  };

  const handleEdit = (std) => {
    setForm({ 
      ...std, 
      skills: std.skills || '', 
      internshipStatus: std.internshipStatus || 'Arıyor' 
    });
    setCurrentId(std.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu öğrenciyi silmek/arşivlemek istediğinize emin misiniz?")) {
      setStudents(prev => (prev || []).filter(s => s.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.studentId) return window.toast.info("Ad Soyad ve Öğrenci No zorunludur.");

    if (currentId) {
      setStudents(prev => (prev || []).map(s => s.id === currentId ? { ...s, ...form, updatedAt: new Date().toISOString() } : s));
    } else {
      setStudents(prev => [{ ...form, id: 'STD-' + Date.now(), createdAt: new Date().toISOString() }, ...(prev || [])]);
    }
    setIsEditing(false);
  };

  const safeStudents = students || [];

  const filtered = safeStudents.filter(s => {
    const matchQ = (s.name||'').toLowerCase().includes(searchQuery.toLowerCase()) || (s.studentId||'').toLowerCase().includes(searchQuery.toLowerCase());
    const matchS = statusFilter === 'all' || (s.status||'').toLowerCase() === statusFilter.toLowerCase();
    return matchQ && matchS;
  });

  const activeCount = safeStudents.filter(s => s.status === 'Aktif').length;
  const internshipSeekers = safeStudents.filter(s => s.internshipStatus === 'Arıyor').length;

  const listView = (
    <div className="space-y-6 font-sans">
      {/* PANEL MOD GEÇİŞ SEKMELERİ */}
      <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 w-fit">
        <button
          onClick={() => setActiveTab('staj_takip')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'staj_takip'
              ? 'bg-[#990000] text-white shadow-md shadow-red-950/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <GraduationCap size={16} />
          Öğrenci & Staj Takibi
        </button>
        <button
          onClick={() => setActiveTab('aday_havuzu')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'aday_havuzu'
              ? 'bg-[#990000] text-white shadow-md shadow-red-950/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Sparkles size={16} className="text-amber-400" />
          Öğrenci Aday Havuzu & Eşleşme Paneli
        </button>
      </div>

      {activeTab === 'aday_havuzu' ? (
        <CMSCandidatePool />
      ) : (
        <>
      {/* HEADER & BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#990000] via-rose-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-red-950/20">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-inner shrink-0">
              <GraduationCap size={28} className="text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                  Öğrenci & Staj Koordinasyon Radarı
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                  Canlı Takip
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-amber-300 drop-shadow-md">
                Öğrenci Yönetimi & Staj Durum Takibi
              </h1>
              <p className="text-xs text-rose-100/90 mt-1 max-w-xl">
                Kayıtlı aktif öğrencilerin bölüm, sınıf ve kurumsal staj durumlarını (Zorunlu / Gönüllü Staj) inceleyin ve güncelleyin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => {
                const headers = ['Öğrenci ID', 'Ad Soyad', 'Bölüm', 'Sınıf', 'Staj Durumu'];
                const csvContent = [
                  headers.join(';'),
                  ...filtered.map(s => [
                    s.studentId, 
                    (s.name || '').replace(/;/g, ','), 
                    s.department, 
                    s.year, 
                    s.internshipStatus
                  ].join(';'))
                ].join('\n');
            
                const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'Ogrenciler.csv';
                link.click();
              }}
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <Download size={16} /> Excel Dışa Aktar
            </button>
            <button 
              onClick={handleAddNew} 
              className="bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-500 hover:to-rose-600 text-slate-950 px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg shadow-rose-950/30 transition-all cursor-pointer hover:scale-105"
            >
              <Plus size={16} /> Yeni Öğrenci Ekle
            </button>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Toplam Kayıtlı Öğrenci</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{(students || []).length}</p>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold"><Users size={20}/></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Aktif Kullanıcı</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{(students || []).filter(s=>s.status==='Aktif').length}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold"><UserCheck size={20}/></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Staj Arayan Öğrenciler</p>
            <p className="text-2xl font-black text-rose-600 mt-0.5">{(students || []).filter(s=>s.internshipStatus==='Arıyor').length}</p>
          </div>
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center font-bold"><Briefcase size={20}/></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Şu An Stajda</p>
            <p className="text-2xl font-black text-purple-600 mt-0.5">{(students || []).filter(s=>s.internshipStatus==='Stajda').length}</p>
          </div>
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-bold"><GraduationCap size={20}/></div>
        </div>
      </div>

      {/* FILTERS BAR */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" placeholder="Öğrenci adı, no veya bölüm ara..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#990000] focus:bg-white transition-all"
            value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            {['all', 'aktif', 'pasif'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st ? 'bg-[#990000] text-white shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'all' ? 'TÜM DURUMLAR' : st.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RICH CARDS LIST */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
            <GraduationCap size={36} className="text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Kayıt Bulunamadı</h3>
            <p className="text-xs text-slate-400 mt-1">Arama kriterlerine uygun öğrenci bulunmuyor.</p>
          </div>
        ) : (
          filtered.map(s => (
            <div 
              key={s.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-rose-200 relative overflow-hidden"
            >
              {/* Left Accent Indicator */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                s.status === 'Aktif' ? 'bg-emerald-500' : 'bg-slate-400'
              }`} />

              <div className="flex items-center gap-4 pl-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-rose-950 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md border border-white/20 overflow-hidden">
                  {s.avatar ? <img src={s.avatar} className="w-full h-full object-cover" /> : s.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-black text-slate-900 text-sm">{s.name}</h4>
                    <span className="text-[11px] font-mono text-slate-400">({s.studentId})</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    <span className="font-bold text-[#990000]">{s.department || 'Bölüm Belirtilmedi'}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-600">{s.year ? `${s.year}. Sınıf` : '-'}</span>
                    <span>•</span>
                    <span className="text-slate-500 font-medium">{s.email || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pl-2 md:pl-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <span className={`inline-flex px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                  s.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                }`}>
                  {s.status}
                </span>

                <span className="inline-flex px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-rose-50 text-[#990000] border border-rose-200/60 flex items-center gap-1.5">
                  <Briefcase size={12}/> Staj: {s.internshipStatus || 'Arıyor'}
                </span>
              </div>

              <div className="flex items-center gap-2 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button 
                  onClick={() => handleEdit(s)} 
                  className="px-3.5 py-2 bg-slate-100 text-slate-700 hover:bg-[#990000] hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit size={14} /> Profili Düzenle
                </button>
                <button 
                  onClick={() => handleDelete(s.id)} 
                  className="px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  title="Sil"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
        </>
      )}
    </div>
  );

  const formView = (
    <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-black text-gray-900">{currentId ? 'Öğrenci Profili Düzenle' : 'Yeni Öğrenci Ekle'}</h3>
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
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Öğrenci Numarası <span className="text-red-500">*</span></label>
                <input type="text" value={form.studentId} onChange={e=>setForm({...form, studentId: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">E-posta</label>
                <input type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Bölüm / Fakülte</label>
                <input type="text" value={form.department} onChange={e=>setForm({...form, department: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Sınıf</label>
                <select value={form.year} onChange={e=>setForm({...form, year: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                  <option value="">Seçiniz</option>
                  <option value="Hazırlık">Hazırlık</option>
                  <option value="1">1. Sınıf</option>
                  <option value="2">2. Sınıf</option>
                  <option value="3">3. Sınıf</option>
                  <option value="4">4. Sınıf</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Sistem Durumu</label>
                <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                  <option>Aktif</option>
                  <option>Pasif</option>
                  <option>Mezun</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Staj Durumu</label>
                <select value={form.internshipStatus} onChange={e=>setForm({...form, internshipStatus: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                  <option>Arıyor</option>
                  <option>Stajda</option>
                  <option>Tamamladı</option>
                  <option>İlgilenmiyor</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-600 block mb-1.5">Yetenekler & İlgi Alanları (Virgülle ayırın)</label>
          <input type="text" value={form.skills} onChange={e=>setForm({...form, skills: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: React, Node.js, Dijital Pazarlama, AutoCAD" />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <AttachmentUploader 
            label="Öğrenci CV Dosyası (PDF)" 
            file={form.cvData} 
            onFileChange={(val) => setForm({...form, cvData: val})} 
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition">İptal</button>
          <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md transition">Kaydet</button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {isEditing ? formView : listView}
    </div>
  );
}
