import React, { useState } from 'react';
import PanelHeader from './PanelHeader';
import { Users, Edit, Trash2, Plus, Calendar, Search, Filter, Briefcase, MapPin, CheckCircle2, Building2 } from 'lucide-react';
import MediaUploader from './MediaUploader';
import AttachmentUploader from './AttachmentUploader';

export default function CMSVoluntaryInternships({ volunteerInterns = [], setVolunteerInterns }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [form, setForm] = useState({
    title: '',
    company: '',
    department: '',
    internshipType: 'Zorunlu Olmayan (Gönüllü)',
    location: '',
    workModel: 'Hibrit',
    startDate: '',
    endDate: '',
    deadline: '',
    quota: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    applicationInstructions: '',
    status: 'Taslak',
    featured: false,
    image: '',
    pdf: null
  });

  const handleAddNew = () => {
    setForm({
      title: '',
      company: '',
      department: '',
      internshipType: 'Zorunlu Olmayan (Gönüllü)',
      location: '',
      workModel: 'Hibrit',
      startDate: '',
      endDate: '',
      deadline: '',
      quota: '',
      requirements: '',
      responsibilities: '',
      benefits: '',
      applicationInstructions: '',
      status: 'Taslak',
      featured: false,
      image: '',
      pdf: null
    });
    setCurrentId(null);
    setIsEditing(true);
  };

  const handleEdit = (internship) => {
    setForm({ 
      ...internship, 
      internshipType: internship.internshipType || 'Zorunlu Olmayan (Gönüllü)',
      workModel: internship.workModel || 'Hibrit',
      location: internship.location || '',
      requirements: internship.requirements || '',
      responsibilities: internship.responsibilities || '',
      benefits: internship.benefits || '',
      image: internship.image || '',
      pdf: internship.pdf || null
    });
    setCurrentId(internship.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu staj ilanını silmek istediğinize emin misiniz?")) {
      setVolunteerInterns((volunteerInterns || []).filter(v => v.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title || !form.company) return window.toast.info("Staj başlığı ve firma adı zorunludur.");

    if (currentId) {
      setVolunteerInterns((volunteerInterns || []).map(v => v.id === currentId ? { ...v, ...form, updatedAt: new Date().toISOString() } : v));
    } else {
      setVolunteerInterns([{ ...form, id: 'VI-' + Date.now(), createdAt: new Date().toISOString() }, ...volunteerInterns]);
    }
    setIsEditing(false);
  };

  const filtered = (volunteerInterns || []).filter(v => {
    const matchQ = (v.title||'').toLowerCase().includes(searchQuery.toLowerCase()) || (v.company||'').toLowerCase().includes(searchQuery.toLowerCase());
    const matchS = statusFilter === 'all' || (v.status||'').toLowerCase() === statusFilter.toLowerCase();
    return matchQ && matchS;
  });

  const activeCount = (volunteerInterns || []).filter(v => v.status === 'Yayında').length;
  const draftCount = (volunteerInterns || []).filter(v => v.status === 'Taslak').length;

  const listView = (
    <div className="space-y-6 font-sans">
      {/* HEADER & BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#990000] via-rose-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-red-950/20">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-inner shrink-0">
              <Briefcase size={28} className="text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                  Staj Onay Kuyrukları
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                  Zorunlu & Gönüllü
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Staj İlan & Öğrenci Başvuru Yönetimi
              </h1>
              <p className="text-xs text-rose-100/80 mt-1 max-w-xl">
                Üniversite onaylı zorunlu ve isteğe bağlı gönüllü staj süreçlerini, firma kontenjanlarını ve başvuruları tek merkezden yönetin.
              </p>
            </div>
          </div>

          <button 
            onClick={handleAddNew} 
            className="bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-500 hover:to-rose-600 text-slate-950 px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg shadow-rose-950/30 transition-all cursor-pointer hover:scale-105 shrink-0"
          >
            <Plus size={18} /> Yeni Staj Programı Ekle
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Toplam Staj Programı</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{(volunteerInterns || []).length}</p>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold"><Briefcase size={20}/></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm flex items-center justify-between bg-gradient-to-br from-white via-emerald-50/20 to-white">
          <div>
            <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Yayında & Aktif</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{activeCount}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold"><CheckCircle2 size={20}/></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm flex items-center justify-between bg-gradient-to-br from-white via-amber-50/20 to-white">
          <div>
            <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Taslak & Beklemede</p>
            <p className="text-2xl font-black text-amber-600 mt-0.5">{draftCount}</p>
          </div>
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold"><Edit size={20}/></div>
        </div>
      </div>

      {/* FILTERS BAR */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" placeholder="Staj başlığı veya firma ara..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#990000] focus:bg-white transition-all"
            value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            {['all', 'yayında', 'taslak', 'kapalı'].map(st => (
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

      {/* RICH CARDS TABLE */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
            <Briefcase size={36} className="text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Kayıt Bulunamadı</h3>
            <p className="text-xs text-slate-400 mt-1">Arama kriterlerine uygun staj ilanı veya başvuru bulunmuyor.</p>
          </div>
        ) : (
          filtered.map(v => (
            <div 
              key={v.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-rose-200 relative overflow-hidden"
            >
              {/* Left Accent Indicator */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                v.status === 'Yayında' ? 'bg-emerald-500' :
                v.status === 'Taslak' ? 'bg-amber-500' : 'bg-slate-400'
              }`} />

              <div className="flex items-center gap-4 pl-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/80 overflow-hidden shadow-xs">
                  {v.image ? <img src={v.image} className="w-full h-full object-cover" /> : <Building2 size={22} className="text-[#990000]"/>}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-black text-slate-900 text-sm">{v.title}</h4>
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-200/60">
                      {v.internshipType || 'Zorunlu / Gönüllü'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    <span className="font-bold text-[#990000]">{v.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-600">
                      <MapPin size={13} className="text-slate-400" /> {v.location || 'İstanbul'} ({v.workModel})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pl-2 md:pl-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <div className="text-xs text-slate-600 space-y-0.5">
                  <p className="font-bold flex items-center gap-1"><Calendar size={13} className="text-[#990000]"/> Son Başvuru: {v.deadline || '-'}</p>
                  <p className="text-[10px] text-slate-400">Tarih: {v.startDate || '?'} - {v.endDate || '?'}</p>
                </div>

                <span className={`inline-flex px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider shadow-xs ${
                  v.status === 'Yayında' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                  v.status === 'Taslak' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700'
                }`}>
                  {v.status}
                </span>
              </div>

              <div className="flex items-center gap-2 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button 
                  onClick={() => handleEdit(v)} 
                  className="px-3.5 py-2 bg-slate-100 text-slate-700 hover:bg-[#990000] hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit size={14} /> Düzenle
                </button>
                <button 
                  onClick={() => handleDelete(v.id)} 
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
    </div>
  );

  const formView = (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* LEFT: FORM */}
      <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-lg font-black text-gray-900">{currentId ? 'İlanı Düzenle' : 'Yeni Staj İlanı'}</h3>
          <button type="button" onClick={() => setIsEditing(false)} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition">İptal</button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">İlan Başlığı <span className="text-red-500">*</span></label>
              <input type="text" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: Pazarlama Stajyeri" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Firma / Kurum Adı <span className="text-red-500">*</span></label>
              <input type="text" value={form.company} onChange={e=>setForm({...form, company: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Firma Adı" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Çalışma Modeli</label>
              <select value={form.workModel} onChange={e=>setForm({...form, workModel: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                <option>Yerinde</option>
                <option>Hibrit</option>
                <option>Uzaktan</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Şehir / Konum</label>
              <input type="text" value={form.location} onChange={e=>setForm({...form, location: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: İstanbul" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">İlgili Bölüm</label>
              <input type="text" value={form.department} onChange={e=>setForm({...form, department: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: İşletme" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Başlangıç</label>
              <input type="date" value={form.startDate} onChange={e=>setForm({...form, startDate: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Bitiş</label>
              <input type="date" value={form.endDate} onChange={e=>setForm({...form, endDate: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Son Başvuru</label>
              <input type="date" value={form.deadline} onChange={e=>setForm({...form, deadline: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Durum</label>
              <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                <option>Yayında</option>
                <option>Taslak</option>
                <option>Kapalı</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Aranan Nitelikler (Requirements)</label>
              <textarea value={form.requirements} onChange={e=>setForm({...form, requirements: e.target.value})} rows={3} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20 resize-none" placeholder="Örn: 3. veya 4. sınıf öğrencisi olmak..."></textarea>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Sorumluluklar (Responsibilities)</label>
              <textarea value={form.responsibilities} onChange={e=>setForm({...form, responsibilities: e.target.value})} rows={3} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20 resize-none" placeholder="Stajyerin yapacağı işler..."></textarea>
            </div>
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">Faydalar ve Kazanımlar (Benefits)</label>
            <input type="text" value={form.benefits} onChange={e=>setForm({...form, benefits: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: Yol ve yemek desteği..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
            <MediaUploader 
              label="Firma Logosu / Görsel" 
              image={form.image} 
              onImageChange={(val) => setForm({...form, image: val})} 
              aspect="1:1" 
            />
            <AttachmentUploader 
              label="Ek Dosya (PDF / Ek Bilgi)" 
              file={form.pdf} 
              onFileChange={(val) => setForm({...form, pdf: val})} 
            />
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e=>setForm({...form, featured: e.target.checked})} className="w-4 h-4 rounded text-red-600 focus:ring-red-500/20" />
              <span className="text-sm font-bold text-gray-700">Öne Çıkarılan İlan</span>
            </label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition">İptal</button>
              <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md transition">İlanı Kaydet</button>
            </div>
          </div>
        </form>
      </div>

      {/* RIGHT: LIVE PREVIEW */}
      <div className="w-full lg:w-[380px] shrink-0">
        <div className="sticky top-6">
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Canlı Önizleme</h4>
          
          {/* Card Preview */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            {/* Header Area */}
            <div className="p-5 border-b border-gray-50 flex items-start gap-4">
              <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden">
                {form.image ? (
                  <img src={form.image} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building2 size={20} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                {form.featured && <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider mb-1 inline-block">ÖNE ÇIKAN</span>}
                <h3 className="text-[15px] font-black text-gray-900 leading-tight mb-0.5">
                  {form.title || 'İlan Başlığı'}
                </h3>
                <p className="text-[12px] font-bold text-gray-500">{form.company || 'Firma Adı'}</p>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-5 bg-gray-50/50">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Konum</p>
                  <p className="text-[12px] font-bold text-gray-800 flex items-center gap-1"><MapPin size={12} className="text-gray-500"/> {form.location || 'Belirtilmedi'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Çalışma Modeli</p>
                  <p className="text-[12px] font-bold text-gray-800 flex items-center gap-1"><Briefcase size={12} className="text-gray-500"/> {form.workModel || 'Belirtilmedi'}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Aranan Nitelikler Özeti</p>
                <p className="text-[12px] font-medium text-gray-600 line-clamp-2">
                  {form.requirements || 'İlan nitelikleri bu alanda görüntülenecektir.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Calendar size={13} />
                  <span className="text-[11px] font-bold">Son Başvuru: {form.deadline ? form.deadline.split('-').reverse().join('.') : '-'}</span>
                </div>
                <button disabled className="text-[11px] font-bold bg-emerald-600 text-white px-4 py-2 rounded-lg opacity-50 cursor-not-allowed">
                  Hemen Başvur
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {isEditing ? formView : listView}
    </div>
  );
}
